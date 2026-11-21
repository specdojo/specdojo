import { existsSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { join, resolve } from "node:path";
import { specdojoPackageRootDir } from "../shared/package-paths.js";
import {
  isAgentProtectedConfigPath,
  PROTECTED_DIRECTORY_PREFIXES,
  PROTECTED_EXACT_PATHS,
} from "./agent-protected-config.js";

export type AntigravityRole = "edit" | "review" | "report" | "orchestrator";
type Permissions = { allow: string[]; deny: string[]; ask: string[] };

export function antigravityRole(value: string): AntigravityRole {
  if (["edit", "review", "report", "orchestrator"].includes(value)) {
    return value as AntigravityRole;
  }
  throw new Error(`Invalid Antigravity role: ${value}`);
}

function canonicalRoot(root: string): string {
  const absolute = resolve(root);
  const normalized = (existsSync(absolute) ? realpathSync(absolute) : absolute).replaceAll(
    "\\",
    "/",
  );
  // The permission syntax has no escaping for parentheses or the global wildcard.
  if (/[()*\r\n]/u.test(normalized)) {
    throw new Error(`Unsupported Antigravity workspace path: ${normalized}`);
  }
  return normalized.replace(/\/$/u, "") + "/";
}

/** One settings object per launch: never read or modify the user's global settings. */
export function buildAntigravitySession(options: {
  role: AntigravityRole;
  cwd: string;
  repoRoots: readonly string[];
}): { roots: string[]; settings: Record<string, unknown> & { permissions: Permissions } } {
  const { role, cwd } = options;
  const roots = [...new Set([cwd, ...options.repoRoots].map(canonicalRoot))];
  const localProfile = join(cwd, ".specdojo", "antigravity", `settings.${role}.json`);
  const profilePath = existsSync(localProfile)
    ? localProfile
    : join(specdojoPackageRootDir(), "templates", "antigravity", `settings.${role}.json`);
  const profile: unknown = JSON.parse(readFileSync(profilePath, "utf8"));
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
    throw new Error(`Invalid Antigravity settings: ${profilePath}`);
  }
  const settings = profile as Record<string, unknown>;
  const permissions: Permissions = { allow: [], deny: [], ask: [] };
  if (settings.permissions !== undefined) {
    if (
      !settings.permissions ||
      typeof settings.permissions !== "object" ||
      Array.isArray(settings.permissions)
    ) {
      throw new Error(`Invalid permissions in ${profilePath}`);
    }
    for (const name of ["allow", "deny", "ask"] as const) {
      const rules = (settings.permissions as Record<string, unknown>)[name] ?? [];
      if (!Array.isArray(rules) || rules.some((rule) => typeof rule !== "string")) {
        throw new Error(`Invalid permissions.${name} in ${profilePath}`);
      }
      permissions[name] = [...rules];
    }
  }

  for (const root of roots) {
    permissions.allow.push(`read_file(${root})`);
    if (role === "edit" || role === "orchestrator") permissions.allow.push(`write_file(${root})`);
    for (const secret of [
      ".env",
      ".env.local",
      ".env.development",
      ".env.production",
      ".env.test",
      ".env.staging",
      ".envrc",
      "secrets/",
      ".ssh/",
      ".aws/",
      ".gemini/",
    ]) {
      permissions.deny.push(`read_file(${root}${secret})`);
    }
    permissions.deny.push(`write_file(${root}.git)`);
    if (role !== "orchestrator") {
      const discovered = existsSync(root)
        ? readdirSync(root).filter(isAgentProtectedConfigPath)
        : [];
      for (const protectedPath of new Set([
        ...PROTECTED_DIRECTORY_PREFIXES,
        ...PROTECTED_EXACT_PATHS,
        ...discovered,
      ])) {
        if (/[()*\r\n]/u.test(protectedPath)) {
          throw new Error(`Unsupported Antigravity protected path: ${protectedPath}`);
        }
        permissions.deny.push(`write_file(${root}${protectedPath})`);
      }
    }
  }
  if (role === "review" || role === "report") {
    // A command or MCP tool can write independently of write_file permissions.
    permissions.deny.push(
      "write_file(*)",
      "command(*)",
      "unsandboxed(*)",
      "mcp(*)",
      "execute_url(*)",
    );
  }
  permissions.deny.push("command(sudo)", "command(rm -rf)");
  for (const bin of ["", "/usr/bin/", "/usr/local/bin/"]) {
    permissions.deny.push(`command(${bin}git push)`, `command(${bin}gh)`);
    if (role !== "orchestrator") {
      for (const action of ["add", "commit", "config", "reset"])
        permissions.deny.push(`command(${bin}git ${action})`);
    }
  }
  for (const name of ["allow", "deny", "ask"] as const)
    permissions[name] = [...new Set(permissions[name])];
  return {
    roots,
    settings: { ...settings, agentMode: "", toolPermission: "request-review", permissions },
  };
}

export function antigravitySessionArguments(options: {
  role: AntigravityRole;
  cwd: string;
  repoRoots: readonly string[];
  providerArgs: readonly string[];
}): string[] {
  const { roots, settings } = buildAntigravitySession(options);
  const args: string[] = [];
  for (let index = 0; index < options.providerArgs.length; index++) {
    const arg = options.providerArgs[index];
    // Go-style flag parsers may also accept a single dash for long options.
    const flag = arg.startsWith("-") && !arg.startsWith("--") && arg.length > 2 ? `-${arg}` : arg;
    if (arg === "--") throw new Error("Antigravity provider argument terminator is not supported");
    if (
      [
        "-p",
        "-i",
        "--print",
        "--prompt",
        "--prompt-interactive",
        "--model",
        "--effort",
        "--input-format",
        "--output-format",
        "--json-schema",
        "--print-timeout",
        "--log-file",
      ].includes(flag)
    ) {
      const value = options.providerArgs[++index];
      if (value === undefined) throw new Error(`Missing value for ${arg}`);
      args.push(arg, value);
      continue;
    }
    if (flag === "--add-dir" || flag.startsWith("--add-dir=")) {
      const dir =
        flag === "--add-dir" ? options.providerArgs[++index] : flag.slice("--add-dir=".length);
      if (!dir || !roots.includes(canonicalRoot(resolve(options.cwd, dir)))) {
        throw new Error(`Undeclared Antigravity workspace: ${dir ?? "(missing)"}`);
      }
      continue;
    }
    if (
      /^--(?:settings|dangerously-skip-permissions|mode|project|new-project|continue|conversation|agent)(?:=|$)/u.test(
        flag,
      ) ||
      arg === "-c"
    ) {
      throw new Error(`Antigravity session permissions cannot be overridden: ${arg}`);
    }
    if (!arg.startsWith("-")) {
      throw new Error(`Use -p or -i for Antigravity prompts; unexpected argument: ${arg}`);
    }
    args.push(arg);
  }
  return [
    ...args,
    ...roots.flatMap((root) => ["--add-dir", root.replace(/\/$/u, "") || "/"]),
    "--settings",
    JSON.stringify(settings),
  ];
}
