import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  loadConfig,
  resolveExternalProjectRoot,
  specdojoRootDir,
  type SpecDojoExternalProjectConfig,
} from "../shared/specdojo-config.js";

export const MINIMUM_EXTERNAL_REGISTER_VERSION = "0.4.2";
export const MINIMUM_EXTERNAL_SOURCE_VERSION = "0.4.5";

export type ExternalRegisterAddOptions = {
  project?: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  difficulty?: string;
  status: string;
  owner: string;
  registered?: string;
  due: string;
  completed: string;
  conclusion: string;
  approach?: string;
  target?: string[];
  source?: string[];
  from?: string[];
  id?: string;
  topic?: string;
  by?: string;
  reason?: string;
  force?: boolean;
  dryRun?: boolean;
  commit?: boolean;
  message?: string;
};

type SpawnSync = (
  command: string,
  args: readonly string[],
  options: Parameters<typeof spawnSync>[2],
) => SpawnSyncReturns<string>;

function addValue(args: string[], flag: string, value: string | undefined): void {
  if (value !== undefined) args.push(flag, value);
}

function rewriteExternalDerivedFrom(value: string, alias: string, projectId: string): string {
  const separator = value.indexOf(":");
  if (separator <= 0 || value.slice(0, separator) !== alias) return value;
  return `${projectId}:${value.slice(separator + 1)}`;
}

/** Build the target CLI invocation without exposing the caller's local alias to the target. */
export function buildExternalRegisterAddArgs(
  alias: string,
  externalProject: SpecDojoExternalProjectConfig,
  opts: ExternalRegisterAddOptions,
): string[] {
  const args = [
    "register",
    "add",
    "--project",
    externalProject.project_id,
    "--type",
    opts.type,
    "--title",
    opts.title,
    "--description",
    opts.description,
    "--priority",
    opts.priority,
    "--status",
    opts.status,
    "--owner",
    opts.owner,
    "--due",
    opts.due,
    "--completed",
    opts.completed,
    "--conclusion",
    opts.conclusion,
  ];
  addValue(args, "--difficulty", opts.difficulty);
  addValue(args, "--registered", opts.registered);
  addValue(args, "--approach", opts.approach);
  for (const target of opts.target ?? []) addValue(args, "--target", target);
  for (const source of opts.source ?? []) addValue(args, "--source", source);
  for (const source of opts.from ?? []) {
    addValue(args, "--from", rewriteExternalDerivedFrom(source, alias, externalProject.project_id));
  }
  addValue(args, "--id", opts.id);
  addValue(args, "--topic", opts.topic);
  addValue(args, "--by", opts.by);
  addValue(args, "--reason", opts.reason);
  if (opts.force) args.push("--force");
  if (opts.dryRun) args.push("--dry-run");
  args.push("--commit");
  addValue(args, "--message", opts.message);
  return args;
}

function versionParts(version: string): [number, number, number] | undefined {
  const match = version.match(/(?:^|\s)v?(\d+)\.(\d+)\.(\d+)(?:\s|$|-)/);
  if (!match) return undefined;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function supportsExternalRegister(version: string): boolean {
  return versionAtLeast(version, MINIMUM_EXTERNAL_REGISTER_VERSION);
}

function versionAtLeast(version: string, required: string): boolean {
  const actual = versionParts(version);
  const minimum = versionParts(required);
  if (!actual || !minimum) return false;
  for (let index = 0; index < actual.length; index += 1) {
    if (actual[index] !== minimum[index]) return actual[index] > minimum[index];
  }
  return true;
}

function targetSpecdojoExecutable(repoRoot: string): string {
  const executable = join(
    repoRoot,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "specdojo.cmd" : "specdojo",
  );
  if (!existsSync(executable)) {
    throw new Error(
      `External project repository does not have SpecDojo installed: ${executable}. ` +
        `Install specdojo ${MINIMUM_EXTERNAL_REGISTER_VERSION} or newer in that repository.`,
    );
  }
  return executable;
}

/**
 * Delegate `register add` when `--project` names an external-project alias.
 * Returns false for a local project so the normal mutation path can continue.
 */
export function delegateExternalRegisterAdd(
  opts: ExternalRegisterAddOptions,
  run: SpawnSync = spawnSync as SpawnSync,
): boolean {
  const alias = opts.project?.trim();
  if (!alias) return false;

  const rootDir = specdojoRootDir();
  const { config, configPath } = loadConfig(rootDir);
  if (!config) throw new Error(`register commands require specdojo.config.json (${configPath})`);
  const externalProject = config.external_projects?.[alias];
  if (!externalProject) return false;
  if (!opts.commit) {
    throw new Error(
      `Cross-repository register add for external project ${alias} requires --commit.`,
    );
  }

  const repoRoot = resolveExternalProjectRoot(rootDir, externalProject);
  const executable = targetSpecdojoExecutable(repoRoot);
  const versionResult = run(executable, ["--version"], {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (versionResult.error) {
    throw new Error(
      `Failed to run SpecDojo in external project ${alias}: ${versionResult.error.message}`,
    );
  }
  if (versionResult.status !== 0) {
    const detail = `${versionResult.stderr ?? versionResult.stdout ?? ""}`.trim();
    throw new Error(
      `Failed to inspect SpecDojo version in external project ${alias}` +
        (detail ? `: ${detail}` : "."),
    );
  }
  const version = `${versionResult.stdout ?? ""}`.trim();
  if (!supportsExternalRegister(version)) {
    throw new Error(
      `External project ${alias} uses SpecDojo ${version || "with an unknown version"}; ` +
        `${MINIMUM_EXTERNAL_REGISTER_VERSION} or newer is required for cross-project register add.`,
    );
  }
  if ((opts.source?.length ?? 0) > 0 && !versionAtLeast(version, MINIMUM_EXTERNAL_SOURCE_VERSION)) {
    throw new Error(
      `External project ${alias} uses SpecDojo ${version}; ` +
        `${MINIMUM_EXTERNAL_SOURCE_VERSION} or newer is required for --source.`,
    );
  }

  const result = run(executable, buildExternalRegisterAddArgs(alias, externalProject, opts), {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: "inherit",
  });
  if (result.error) {
    throw new Error(`Failed to run SpecDojo in external project ${alias}: ${result.error.message}`);
  }
  if (result.status !== 0) process.exitCode = result.status ?? 1;
  return true;
}
