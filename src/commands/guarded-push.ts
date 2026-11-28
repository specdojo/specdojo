import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import type { Command } from "commander";
import { AGENT_ROLE_ENV } from "../shared/agent-role.js";
import { CrossProcessMutex } from "../shared/cross-process-lock.js";
import { gitEnvironment } from "../shared/git-environment.js";
import { registerLifecyclePoolPath } from "../register/lifecycle-lock.js";
import { gitExecutionPath, runGitChild } from "./git.js";

export type GuardedPushOptions = {
  project: string;
  branch?: string;
  remote?: string;
  dryRun?: boolean;
  cwd?: string;
};

function assertBranch(project: string, branch: string): void {
  if (
    branch !== `project/${project}/develop` &&
    !(branch.startsWith(`feature/${project}/`) && branch.length > `feature/${project}/`.length)
  ) {
    throw new Error(`Branch outside guarded-push scope: ${branch}`);
  }
  // Reject refspecs and option-like input before invoking Git. Git checks the remaining syntax.
  if (
    /[\s:+*?\[\\~^]/u.test(branch) ||
    [...branch].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)
  ) {
    throw new Error(`Invalid branch: ${branch}`);
  }
}

function git(cwd: string, args: string[]): string {
  const result = spawnSync("git", ["--no-replace-objects", ...args], {
    cwd,
    env: gitEnvironment(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    // Remote URLs can contain credentials; do not echo Git's stderr or the arguments.
    throw new Error(`guarded-push: git ${args[0]} failed (exit ${result.status})`);
  }
  return result.stdout.trim();
}

function pushEndpoint(root: string, remote: string): string {
  const urls = git(root, ["remote", "get-url", "--push", "--all", remote]).split(/\r?\n/u);
  if (urls.length !== 1 || !urls[0]) {
    throw new Error("guarded-push requires exactly one push URL for the named remote");
  }
  const url = urls[0];
  // A local path must not be interpreted as another configured remote name by `push`.
  return /^[a-z][a-z0-9+.-]*:\/\//iu.test(url) || /^[^/]+:/u.test(url) ? url : resolve(root, url);
}

export async function runGuardedPush(options: GuardedPushOptions): Promise<number> {
  // Check before even resolving cwd/config/locks, and before the first Git process.
  if (Object.hasOwn(process.env, AGENT_ROLE_ENV)) {
    throw new Error("guarded-push is forbidden during executor/reporter execution");
  }
  if (!/^[a-z0-9][a-z0-9-]*$/u.test(options.project)) {
    throw new Error("guarded-push requires an explicit project ID");
  }
  const remote = options.remote ?? "origin";
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/u.test(remote)) {
    throw new Error("guarded-push requires a named remote, not a URL or Git options");
  }
  if (options.branch !== undefined) assertBranch(options.project, options.branch);
  const root = git(options.cwd ?? process.cwd(), ["rev-parse", "--show-toplevel"]);
  const executionPath = gitExecutionPath(root, options.project);
  const mutex = new CrossProcessMutex(
    registerLifecyclePoolPath(executionPath),
    { actor: "specdojo-guarded-push", label: "guarded push" },
    {
      onWait: () =>
        process.stderr.write("Waiting for the exec-lifecycle lock held by another operation\n"),
    },
  );
  return mutex.runExclusive(async () => {
    const branch = options.branch ?? git(root, ["symbolic-ref", "--quiet", "--short", "HEAD"]);
    assertBranch(options.project, branch);
    const ref = `refs/heads/${branch}`;
    git(root, ["check-ref-format", ref]);
    const tip = git(root, ["rev-parse", "--verify", `${ref}^{commit}`]);
    const endpoint = pushEndpoint(root, remote);
    const advertisement = git(root, ["ls-remote", "--refs", "--heads", "--", endpoint, ref]);
    const entries = advertisement ? advertisement.split(/\r?\n/u) : [];
    if (entries.length > 1 || (entries.length === 1 && entries[0].split("\t")[1] !== ref)) {
      throw new Error("Unexpected remote branch advertisement");
    }
    const base = entries[0]?.split("\t")[0];
    if (base) {
      if (!/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u.test(base)) {
        throw new Error("Invalid remote commit ID");
      }
      // Fetch objects only, never remote-tracking refs or FETCH_HEAD. This also handles stale
      // tracking refs and a push URL different from the fetch URL, including during dry-run.
      git(root, [
        "fetch",
        "--no-tags",
        "--no-recurse-submodules",
        "--no-write-fetch-head",
        "--no-auto-maintenance",
        "--",
        endpoint,
        base,
      ]);
      const check = spawnSync(
        "git",
        ["--no-replace-objects", "merge-base", "--is-ancestor", base, tip],
        {
          cwd: root,
          env: gitEnvironment(),
          stdio: "ignore",
        },
      );
      if (check.error) throw check.error;
      if (check.status !== 0) throw new Error("guarded-push refuses a non-fast-forward push");
    }
    const range = base ? `${base}..${tip}` : tip;
    const count = git(root, ["rev-list", "--count", range, "--"]);
    process.stdout.write(
      `Branch: ${branch}\nRemote: ${remote}\nRange: ${base ? range : `(new branch) ${tip}`}\nCommits: ${count}\n`,
    );
    if (options.dryRun) {
      process.stdout.write("Dry run: nothing pushed\n");
      return 0;
    }
    // Pin the checked commit and destination. Using the resolved URL avoids remote.*.push /
    // mirror / receivepack; explicit flags suppress configured tag/submodule side pushes.
    // Ordinary Git/server fast-forward checks reject concurrent incompatible remote updates.
    return runGitChild(
      [
        "--no-replace-objects",
        "push",
        "--no-force",
        "--no-follow-tags",
        "--recurse-submodules=no",
        "--",
        endpoint,
        `${tip}:${ref}`,
      ],
      root,
      true,
    );
  });
}

export function registerGuardedPushCommand(program: Command): void {
  program
    .command("guarded-push")
    .allowExcessArguments(false)
    .description("Push one project develop/feature branch without rewriting remote history")
    .requiredOption("--project <id>", "Project whose branch scope and lifecycle lock are used")
    .option("--branch <branch>", "Local and remote branch (defaults to current branch)")
    .option("--remote <name>", "Configured remote with exactly one push URL", "origin")
    .option("--dry-run", "Check and display the range without pushing")
    .action(async (options: GuardedPushOptions) => {
      try {
        process.exitCode = await runGuardedPush(options);
      } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
      }
    });
}
