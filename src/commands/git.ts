import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { constants as osConstants } from "node:os";
import { join, resolve } from "node:path";
import type { Command } from "commander";
import { registerLifecyclePoolPath } from "../register/lifecycle-lock.js";
import {
  CrossProcessMutex,
  GIT_LOCK_TOKENS_ENV,
  isLiveLock,
  livePoolHolders,
} from "../shared/cross-process-lock.js";
import { gitEnvironment } from "../shared/git-environment.js";
import { restoreIndexAfterPathspecCommit } from "../shared/git.js";
import {
  getProjectExecutionPath,
  specdojoRootDir,
  type SpecDojoConfig,
} from "../shared/specdojo-config.js";

const READ_COMMANDS = new Set([
  "status",
  "log",
  "diff",
  "show",
  "grep",
  "ls-files",
  "ls-tree",
  "rev-parse",
  "rev-list",
  "describe",
  "shortlog",
  "name-rev",
  "merge-base",
  "cat-file",
  "version",
  "help",
]);
const VALUE_OPTIONS = ["-C", "-c", "--git-dir", "--work-tree", "--namespace", "--config-env"];
const FLAG_OPTIONS = new Set([
  "--bare",
  "--no-pager",
  "--paginate",
  "-p",
  "-P",
  "--no-replace-objects",
  "--literal-pathspecs",
  "--glob-pathspecs",
  "--noglob-pathspecs",
  "--icase-pathspecs",
  "--no-optional-locks",
  "--no-lazy-fetch",
  "--no-advice",
]);

export function inspectGitArguments(args: readonly string[]): {
  globals: string[];
  needsLock: boolean;
} {
  const globals: string[] = [];
  let customConfig = false;
  let index = 0;
  while (index < args.length && args[index].startsWith("-")) {
    const arg = args[index++];
    if (arg === "--version" || arg === "--help" || arg === "-h") {
      return { globals, needsLock: false };
    }
    const valueOption = VALUE_OPTIONS.find(
      (option) =>
        arg === option ||
        (option.startsWith("--") ? arg.startsWith(`${option}=`) : arg.startsWith(option)),
    );
    if (valueOption) {
      globals.push(arg);
      if (arg === valueOption) {
        if (index === args.length) throw new Error(`Missing value for git ${arg}`);
        globals.push(args[index++]);
      }
      if (valueOption === "-c" || valueOption === "--config-env") customConfig = true;
    } else if (FLAG_OPTIONS.has(arg) || arg.startsWith("--exec-path=")) {
      globals.push(arg);
      if (arg.startsWith("--exec-path=")) customConfig = true;
    } else {
      throw new Error(`Unsupported git global option: ${arg}`);
    }
  }
  const command = args[index];
  // Aliases, unknown commands and output-writing variants join the same queue as writes.
  const writesOutput = args
    .slice(index + 1)
    .some((arg) => arg === "--output" || arg.startsWith("--output="));
  return { globals, needsLock: customConfig || !READ_COMMANDS.has(command) || writesOutput };
}

// `commit ... -- <pathspec>` の pathspec を返す。`--` の無い commit や commit 以外は空を返す。
// pathspec 付きの commit は一時 index で行われ、hook が整形した内容が本来の index に残るため、
// 呼び出し側が commit の後に index を戻す対象にする（PJR-Y3XS）。
export function commitPathspecs(args: readonly string[]): string[] {
  const { globals } = inspectGitArguments(args);
  if (args[globals.length] !== "commit") return [];
  const rest = args.slice(globals.length + 1);
  const separator = rest.indexOf("--");
  return separator === -1 ? [] : rest.slice(separator + 1);
}

// Avoid loading .env: a transparent Git wrapper must not alter the caller's credentials or env.
export function gitExecutionPath(root: string, projectOption?: string): string {
  const configPath = join(root, ".specdojo", "specdojo.config.json");
  if (!existsSync(configPath)) throw new Error(`No config found: ${configPath}`);
  const config = JSON.parse(readFileSync(configPath, "utf8")) as SpecDojoConfig;
  if (config?.version !== 1 || !config.projects || typeof config.projects !== "object") {
    throw new Error(`Invalid SpecDojo config: ${configPath}`);
  }
  const projectId =
    projectOption ||
    process.env.SPECDOJO_PROJECT ||
    config.current_project ||
    Object.keys(config.projects)[0];
  const project = config.projects[projectId];
  if (!project || typeof project !== "object") throw new Error(`Unknown project: ${projectId}`);
  return resolve(root, getProjectExecutionPath(project));
}

function gitRoot(globals: string[], cwd: string): string {
  const result = spawnSync("git", [...globals, "rev-parse", "--show-toplevel"], {
    cwd,
    env: gitEnvironment(),
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  if (result.status !== 0)
    throw new Error(result.stderr.trim() || "Unable to resolve Git worktree");
  return result.stdout.trim();
}

export function unlockedGitWarning(
  executionPath: string,
  env: NodeJS.ProcessEnv,
): string | undefined {
  const locksDir = join(executionPath, "exec", ".locks");
  const runActive =
    isLiveLock(join(locksDir, "exec-run.lock")) ||
    livePoolHolders(join(locksDir, "exec-run-join")).length > 0;
  if (!runActive) return undefined;
  const tokens = new Set((env[GIT_LOCK_TOKENS_ENV] ?? "").split(","));
  const held = livePoolHolders(registerLifecyclePoolPath(executionPath)).some(
    (slot) => slot.owner && tokens.has(slot.owner.token),
  );
  return held
    ? undefined
    : "[specdojo] warning: exec run is active; use specdojo git -- commit ... to serialize with runner integration.\n";
}

export function runGitChild(args: string[], cwd: string, needsLock: boolean): Promise<number> {
  return new Promise((resolveExit, reject) => {
    const env = { ...gitEnvironment(), ...(needsLock ? {} : { GIT_OPTIONAL_LOCKS: "0" }) };
    const child = spawn("git", args, { cwd, env, stdio: "inherit" });
    // Keep the lifecycle lock until Git (including hooks) exits, even when the wrapper is signalled.
    const signals = ["SIGINT", "SIGTERM", "SIGHUP", "SIGQUIT"] as const;
    const handlers = signals.map((signal) => () => {
      child.kill(signal);
    });
    signals.forEach((signal, index) => process.on(signal, handlers[index]));
    const cleanup = (): void => {
      signals.forEach((signal, index) => process.off(signal, handlers[index]));
    };
    child.once("error", (error) => {
      cleanup();
      reject(error);
    });
    child.once("close", (code, signal) => {
      cleanup();
      resolveExit(code ?? (signal ? 128 + osConstants.signals[signal] : 1));
    });
  });
}

export async function runSerializedGit(
  args: string[],
  options: { cwd?: string; project?: string } = {},
): Promise<number> {
  if (args.length === 0) throw new Error("Usage: specdojo git [--project <id>] -- <git arguments>");
  const cwd = options.cwd ?? process.cwd();
  const { globals, needsLock } = inspectGitArguments(args);
  if (!needsLock) return runGitChild(args, cwd, false);
  const executionPath = gitExecutionPath(gitRoot(globals, cwd), options.project);
  const mutex = new CrossProcessMutex(
    registerLifecyclePoolPath(executionPath),
    {
      actor: "specdojo-git",
      label: "git write",
    },
    {
      onWait: () =>
        process.stderr.write("Waiting for the exec-lifecycle lock held by another operation\n"),
    },
  );
  const pathspecs = commitPathspecs(args);
  return mutex.runExclusive(async () => {
    const code = await runGitChild(args, cwd, true);
    if (code !== 0 || pathspecs.length === 0) return code;
    const restored = restoreIndexAfterPathspecCommit(cwd, pathspecs, globals);
    if (restored.length > 0) {
      process.stderr.write(
        `[specdojo] restored hook-formatted paths left in the index after commit: ${restored.join(", ")}\n`,
      );
    }
    return code;
  });
}

export function registerGitCommand(program: Command): void {
  program
    .command("git")
    .description("Run Git writes under the runner lifecycle lock; pass Git arguments after --")
    .option("--project <id>", "Project whose lifecycle lock is used")
    .option("--warn-unlocked", "Pre-commit check: warn about unlocked commits during exec run")
    .argument("[gitArgs...]", "Git arguments after --")
    .action(async (args: string[], options: { project?: string; warnUnlocked?: boolean }) => {
      try {
        if (options.warnUnlocked) {
          const warning = unlockedGitWarning(
            gitExecutionPath(specdojoRootDir(), options.project),
            process.env,
          );
          if (warning) process.stderr.write(warning);
        } else {
          process.exitCode = await runSerializedGit(args, options);
        }
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = options.warnUnlocked ? 0 : 1;
      }
    });
}
