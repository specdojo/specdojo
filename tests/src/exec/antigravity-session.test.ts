import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  antigravityRole,
  antigravitySessionArguments,
  buildAntigravitySession,
} from "../../../src/exec/antigravity-session.js";
import {
  PROTECTED_DIRECTORY_PREFIXES,
  PROTECTED_EXACT_PATHS,
} from "../../../src/exec/agent-protected-config.js";

const fixtures: string[] = [];
afterEach(() => {
  for (const root of fixtures.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("Antigravity session permissions", () => {
  it("protects every repository while allowing edit artifacts under declared roots only", () => {
    const { settings, roots } = buildAntigravitySession({
      role: "edit",
      cwd: "/project",
      repoRoots: ["/task/app", "/task/app"],
    });
    expect(roots).toEqual(["/project/", "/task/app/"]);
    for (const root of roots) {
      expect(settings.permissions.allow).toContain(`write_file(${root})`);
      expect(settings.permissions.deny).toContain(`read_file(${root}.env)`);
      expect(settings.permissions.deny).toContain(`read_file(${root}secrets/)`);
      expect(settings.permissions.deny).toContain(`write_file(${root}.git)`);
      for (const protectedPath of [...PROTECTED_DIRECTORY_PREFIXES, ...PROTECTED_EXACT_PATHS]) {
        expect(settings.permissions.deny).toContain(`write_file(${root}${protectedPath})`);
      }
    }
    expect(JSON.stringify(settings)).not.toContain("/undeclared");
    expect(settings.toolPermission).toBe("request-review");
  });

  it.each(["review", "report"] as const)(
    "denies file, shell, and MCP writes for %s despite local broad allows",
    (role) => {
      const cwd = mkdtempSync(join(tmpdir(), "specdojo-agy-session-"));
      fixtures.push(cwd);
      mkdirSync(join(cwd, ".specdojo", "antigravity"), { recursive: true });
      writeFileSync(
        join(cwd, ".specdojo", "antigravity", `settings.${role}.json`),
        JSON.stringify({ permissions: { allow: ["write_file(*)", "command(*)", "mcp(*)"] } }),
      );
      const { settings } = buildAntigravitySession({ role, cwd, repoRoots: ["/product"] });
      expect(settings.permissions.deny).toEqual(
        expect.arrayContaining(["write_file(*)", "command(*)", "mcp(*)", "unsandboxed(*)"]),
      );
      expect(settings.permissions.allow).toContain("read_file(/product/)");
    },
  );

  it("lets orchestrators edit protected configuration but protects secrets and Git metadata", () => {
    const { settings } = buildAntigravitySession({
      role: "orchestrator",
      cwd: "/project",
      repoRoots: ["/product"],
    });
    expect(settings.permissions.allow).toContain("write_file(/product/)");
    expect(settings.permissions.deny).not.toContain("write_file(/product/package.json)");
    expect(settings.permissions.deny).toContain("read_file(/product/.env)");
    expect(settings.permissions.deny).toContain("command(git push)");
  });

  it("canonicalizes symlink roots and includes discovered commitlint configuration", () => {
    const cwd = mkdtempSync(join(tmpdir(), "specdojo-agy-session-"));
    fixtures.push(cwd);
    mkdirSync(join(cwd, "product"));
    symlinkSync(join(cwd, "product"), join(cwd, "alias"));
    writeFileSync(join(cwd, "product", "commitlint.config.cts"), "");
    const { roots, settings } = buildAntigravitySession({
      role: "edit",
      cwd,
      repoRoots: [join(cwd, "product"), join(cwd, "alias")],
    });
    expect(roots).toHaveLength(2);
    expect(settings.permissions.deny).toContain(`write_file(${cwd}/product/commitlint.config.cts)`);
  });

  it.each(['{"permissions":{"deny":"all"}}', '{"permissions":[]}', "[]", "invalid JSON"])(
    "rejects malformed local settings %s",
    (content) => {
      const cwd = mkdtempSync(join(tmpdir(), "specdojo-agy-session-"));
      fixtures.push(cwd);
      mkdirSync(join(cwd, ".specdojo", "antigravity"), { recursive: true });
      writeFileSync(join(cwd, ".specdojo", "antigravity", "settings.edit.json"), content);
      expect(() => buildAntigravitySession({ role: "edit", cwd, repoRoots: [] })).toThrow();
    },
  );

  it.each([
    "--settings",
    "--settings={}",
    "--dangerously-skip-permissions",
    "--mode=auto",
    "--project=other",
    "--conversation",
    "--agent",
    "-settings={}",
    "-dangerously-skip-permissions",
    "-c",
  ])("rejects session override %s", (arg) => {
    expect(() =>
      antigravitySessionArguments({
        role: "edit",
        cwd: "/project",
        repoRoots: [],
        providerArgs: [arg],
      }),
    ).toThrow(/cannot be overridden/);
  });

  it("rejects undeclared extra directories and permission syntax injection", () => {
    expect(() =>
      antigravitySessionArguments({
        role: "edit",
        cwd: "/project",
        repoRoots: [],
        providerArgs: ["--add-dir", "/other"],
      }),
    ).toThrow(/Undeclared/);
    expect(() =>
      buildAntigravitySession({ role: "edit", cwd: "/project(*)", repoRoots: [] }),
    ).toThrow(/Unsupported/);
    expect(() => antigravityRole("unknown")).toThrow(/Invalid/);
    for (const arg of ["--", "positional-prompt"]) {
      expect(() =>
        antigravitySessionArguments({
          role: "edit",
          cwd: "/project",
          repoRoots: [],
          providerArgs: [arg],
        }),
      ).toThrow();
    }
  });

  it("passes exactly one settings object, preserves prompts, and deduplicates declared dirs", () => {
    const prompt = 'literal "quotes" $(text)';
    const args = antigravitySessionArguments({
      role: "edit",
      cwd: "/project",
      repoRoots: ["/product"],
      providerArgs: ["-p", prompt, "--add-dir", "/product"],
    });
    expect(args.slice(0, 2)).toEqual(["-p", prompt]);
    expect(args.filter((arg) => arg === "--settings")).toHaveLength(1);
    expect(args.filter((arg) => arg === "/product")).toHaveLength(1);
    expect(JSON.parse(args.at(-1)!)).toHaveProperty("permissions");
  });
});
