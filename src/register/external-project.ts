import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
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
  track?: string;
  domain?: string[];
  title: string;
  description: string;
  input?: string[];
  priority: string;
  difficulty?: string;
  status: string;
  owner: string;
  registered?: string;
  startOn?: string;
  due: string;
  completed: string;
  conclusion: string;
  approach?: string;
  target?: string[];
  source?: string[];
  section?: string[];
  sectionFile?: string[];
  from?: string[];
  dependsOn?: string[];
  id?: string;
  topic?: string;
  by?: string;
  reason?: string;
  force?: boolean;
  dryRun?: boolean;
  commit?: boolean;
  message?: readonly string[];
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
  addValue(args, "--track", opts.track);
  for (const domain of opts.domain ?? []) addValue(args, "--domain", domain);
  addValue(args, "--difficulty", opts.difficulty);
  addValue(args, "--registered", opts.registered);
  addValue(args, "--start-on", opts.startOn);
  addValue(args, "--approach", opts.approach);
  for (const input of opts.input ?? []) addValue(args, "--input", input);
  for (const target of opts.target ?? []) addValue(args, "--target", target);
  for (const source of opts.source ?? []) addValue(args, "--source", source);
  for (const source of opts.from ?? []) {
    addValue(args, "--from", rewriteExternalDerivedFrom(source, alias, externalProject.project_id));
  }
  for (const predecessor of opts.dependsOn ?? []) {
    addValue(
      args,
      "--depends-on",
      rewriteExternalDerivedFrom(predecessor, alias, externalProject.project_id),
    );
  }
  addValue(args, "--id", opts.id);
  addValue(args, "--topic", opts.topic);
  addValue(args, "--by", opts.by);
  addValue(args, "--reason", opts.reason);
  if (opts.force) args.push("--force");
  if (opts.dryRun) args.push("--dry-run");
  args.push("--commit");
  // `-m` の各値を 1 つずつ `--message` として渡す。相手側で段落として連結するため、
  // 複数渡すとカンマ連結ではなく 1 行の件名にならない（PJR-QTZ7）。help の -m の説明
  // 「each value becomes a paragraph, as in git commit -m」と同じ挙動にする。
  for (const paragraph of externalCommitMessageParagraphs(opts.message)) {
    addValue(args, "--message", paragraph);
  }
  return args;
}

// `git commit -m` と同様、空でない各値を段落として保持する。全て空なら空配列を返し、
// 相手側が既定の commit message を組み立てるよう `--message` を渡さない。
function externalCommitMessageParagraphs(message: readonly string[] | undefined): string[] {
  return (message ?? [])
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph !== "");
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

function targetSpecdojoExecutable(repoRoot: string): { command: string; args: string[] } {
  const executable = join(
    repoRoot,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "specdojo.cmd" : "specdojo",
  );
  if (existsSync(executable)) return { command: executable, args: [] };

  const packagePath = join(repoRoot, "package.json");
  if (existsSync(packagePath)) {
    const pkg: unknown = JSON.parse(readFileSync(packagePath, "utf8"));
    if (pkg && typeof pkg === "object" && "name" in pkg && pkg.name === "specdojo") {
      const entrypoint = join(repoRoot, "dist", "specdojo.js");
      if (!existsSync(entrypoint)) {
        throw new Error(
          `External SpecDojo repository has not been built: ${entrypoint}. ` +
            "Run npm run build in that repository.",
        );
      }
      return { command: process.execPath, args: [entrypoint] };
    }
  }
  throw new Error(
    `External project repository does not have SpecDojo installed: ${executable}. ` +
      `Install specdojo ${MINIMUM_EXTERNAL_REGISTER_VERSION} or newer in that repository.`,
  );
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
  if ((opts.section?.length ?? 0) > 0 || (opts.sectionFile?.length ?? 0) > 0) {
    throw new Error(
      `Cross-repository register add for external project ${alias} does not support --section.`,
    );
  }

  const repoRoot = resolveExternalProjectRoot(rootDir, externalProject);
  const executable = targetSpecdojoExecutable(repoRoot);
  const versionResult = run(executable.command, [...executable.args, "--version"], {
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

  const result = run(
    executable.command,
    [...executable.args, ...buildExternalRegisterAddArgs(alias, externalProject, opts)],
    {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  if (result.error) {
    throw new Error(`Failed to run SpecDojo in external project ${alias}: ${result.error.message}`);
  }
  // 相手側の stdout / stderr を自分の出力へ流し、実行の進捗や失敗の告知を隠さない。
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    // git commit が stdout と stderr の双方へ失敗理由を書くことがある（commitlint は stdout）。
    // 相手側の register コマンド自身で原因を出すようにしているので、ここは終了コードを継承する。
    process.exitCode = result.status ?? 1;
  }
  return true;
}
