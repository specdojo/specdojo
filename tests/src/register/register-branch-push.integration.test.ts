import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerRegisterCommands } from "../../../src/register/register.js";
import { gitEnvironment } from "../../../src/shared/git.js";
import {
  registerBranchWorktree,
  resolveRegisterBranchTarget,
} from "../../../src/shared/register-branch.js";

const PROJECT = "sample";
const DEVELOP = "project/sample/develop";
const BRANCH = "project/sample/register";
const REGISTER = "docs/sample/controls/project-register";
const EVENTS = "docs/sample/execution/exec/events";

const TICKET = `---
specdojo:
  id: sample:pjr-ab12-first
  type: project
  status: draft
---

# PJR-AB12 first
`;

function git(cwd: string, ...args: string[]): string {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", env: gitEnvironment() });
  if (result.status !== 0) throw new Error(`${args.join(" ")}: ${result.stdout}\n${result.stderr}`);
  return result.stdout.trimEnd();
}

function write(path: string, value: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value, "utf8");
}

function commitFile(cwd: string, path: string, value: string): string {
  write(join(cwd, path), value);
  git(cwd, "add", "--", path);
  git(cwd, "commit", "-m", `test: ${path}`);
  return git(cwd, "rev-parse", "HEAD");
}

describe("register branch-push", () => {
  const originalCwd = process.cwd();
  let parent: string;
  let repo: string;
  let remote: string;
  let stdout: string[];
  let stderr: string[];

  function fixture(): void {
    parent = mkdtempSync(join(tmpdir(), "specdojo-register-branch-push-"));
    repo = join(parent, "repo");
    remote = join(parent, "remote.git");
    mkdirSync(repo);
    git(parent, "init", "--bare", remote);
    git(repo, "init", "-b", DEVELOP);
    write(
      join(repo, ".specdojo/specdojo.config.json"),
      JSON.stringify({
        version: 1,
        current_project: PROJECT,
        projects: {
          [PROJECT]: {
            base_path: "docs/sample",
            project_register_path: "controls/project-register",
            schedule_path: "schedule",
            execution_path: "execution",
            register_sync: { enabled: true },
          },
        },
      }),
    );
    write(join(repo, "product.txt"), "base\n");
    git(repo, "add", ".");
    git(repo, "commit", "-m", "test: initial repository");
    git(repo, "remote", "add", "origin", remote);
    git(repo, "push", "origin", DEVELOP);
    process.chdir(repo);
    stdout = [];
    stderr = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
      stdout.push(String(chunk));
      return true;
    });
    vi.spyOn(process.stderr, "write").mockImplementation((chunk) => {
      stderr.push(String(chunk));
      return true;
    });
  }

  /** 別の利用者の clone から register のブランチへ commit を push する。 */
  function peerCommit(path: string, value: string): string {
    const peer = join(parent, "peer");
    if (!existsSync(peer)) git(parent, "clone", "--branch", BRANCH, remote, peer);
    else git(peer, "pull", "--rebase", "origin", BRANCH);
    const commit = commitFile(peer, path, value);
    git(peer, "push", "origin", `HEAD:refs/heads/${BRANCH}`);
    return commit;
  }

  function registerWorktree(): string {
    const target = resolveRegisterBranchTarget(PROJECT);
    if (!target) throw new Error("register_sync must be enabled in the fixture");
    const { worktree } = registerBranchWorktree(target);
    if (!worktree) throw new Error("register worktree must exist");
    return worktree;
  }

  function remoteTip(): string {
    return git(remote, "rev-parse", `refs/heads/${BRANCH}`);
  }

  async function branchPush(...args: string[]): Promise<void> {
    const program = new Command().exitOverride();
    registerRegisterCommands(program);
    await program.parseAsync(["register", "branch-push", "--project", PROJECT, ...args], {
      from: "user",
    });
  }

  afterEach(() => {
    process.chdir(originalCwd);
    try {
      process.exitCode = undefined;
      vi.restoreAllMocks();
    } finally {
      if (parent) rmSync(parent, { recursive: true, force: true });
    }
  });

  it("creates the branch from the integration branch, adds the worktree and pushes it", async () => {
    fixture();
    const develop = git(repo, "rev-parse", DEVELOP);

    await branchPush();

    expect(process.exitCode).toBeUndefined();
    expect(git(repo, "rev-parse", `refs/heads/${BRANCH}`)).toBe(develop);
    expect(remoteTip()).toBe(develop);
    expect(git(registerWorktree(), "symbolic-ref", "--short", "HEAD")).toBe(BRANCH);
    expect(git(repo, "symbolic-ref", "--short", "HEAD")).toBe(DEVELOP);
    expect(stdout.join("")).toContain(`Created branch ${BRANCH} from origin/${DEVELOP}`);
  });

  it("only creates the local branch and worktree when the branch exists only on the remote", async () => {
    fixture();
    git(repo, "push", "origin", `${DEVELOP}:refs/heads/${BRANCH}`);
    peerCommit(`${EVENTS}/2026/peer.json`, "{}\n");
    const before = remoteTip();

    await branchPush();

    expect(process.exitCode).toBeUndefined();
    expect(git(repo, "rev-parse", `refs/heads/${BRANCH}`)).toBe(before);
    expect(remoteTip()).toBe(before);
    expect(existsSync(join(registerWorktree(), `${EVENTS}/2026/peer.json`))).toBe(true);
    expect(stdout.join("")).toContain("nothing to push");
  });

  it("pushes a branch that exists only locally to the configured remote branch", async () => {
    fixture();
    git(repo, "branch", BRANCH, DEVELOP);

    await branchPush();

    expect(process.exitCode).toBeUndefined();
    expect(remoteTip()).toBe(git(repo, "rev-parse", DEVELOP));
    expect(stdout.join("")).toContain(`Pushed the local branch to new origin/${BRANCH}`);
  });

  it("recovers a stopped worktree by rebasing unpushed commits onto the remote and pushing", async () => {
    fixture();
    await branchPush();
    const worktree = registerWorktree();
    const local = commitFile(worktree, `${EVENTS}/2026/local.json`, "{}\n");
    peerCommit(`${EVENTS}/2026/peer.json`, "{}\n");

    await branchPush();

    expect(process.exitCode).toBeUndefined();
    expect(git(remote, "log", "-1", "--format=%s", BRANCH)).toBe(`test: ${EVENTS}/2026/local.json`);
    expect(git(remote, "show", `${BRANCH}:${EVENTS}/2026/peer.json`)).toBe("{}");
    expect(git(worktree, "rev-parse", "HEAD")).toBe(remoteTip());
    expect(git(worktree, "rev-parse", "HEAD")).not.toBe(local);
  });

  it("stops on a conflict with the files and a fix, keeps the commits and finishes after resolution", async () => {
    fixture();
    await branchPush();
    const worktree = registerWorktree();
    const path = `${EVENTS}/2026/shared.json`;
    const local = commitFile(worktree, path, '{"by":"local"}\n');
    const peer = peerCommit(path, '{"by":"peer"}\n');

    await branchPush();

    expect(process.exitCode).toBe(1);
    const message = stderr.join("");
    expect(message).toContain("has conflicts while rebasing");
    expect(message).toContain(`  ${path}`);
    expect(message).toContain("git add");
    expect(remoteTip()).toBe(peer);
    expect(git(worktree, "cat-file", "-t", local)).toBe("commit");
    expect(git(repo, "rev-parse", `refs/heads/${BRANCH}`)).toBe(local);

    process.exitCode = undefined;
    write(join(worktree, path), '{"by":"both"}\n');
    git(worktree, "add", "--", path);
    await branchPush();

    expect(stderr.join("")).toBe(message);
    expect(process.exitCode).toBeUndefined();
    expect(git(remote, "show", `${BRANCH}:${path}`)).toBe('{"by":"both"}');
    expect(git(remote, "rev-parse", `${BRANCH}^`)).toBe(peer);
  });

  it("does not push a commit outside the register scope", async () => {
    fixture();
    await branchPush();
    const worktree = registerWorktree();
    commitFile(worktree, "product.txt", "edited on register\n");
    const before = remoteTip();

    await branchPush();

    expect(process.exitCode).toBe(1);
    expect(stderr.join("")).toContain("product.txt");
    expect(remoteTip()).toBe(before);
  });

  it("does not push a ticket whose register event is missing", async () => {
    fixture();
    await branchPush();
    const worktree = registerWorktree();
    commitFile(worktree, `${REGISTER}/pjr-ab12-first.md`, TICKET);
    const before = remoteTip();

    await branchPush();

    expect(process.exitCode).toBe(1);
    expect(stderr.join("")).toContain("個票とイベントの形の違反");
    expect(remoteTip()).toBe(before);
  });

  it("creates the branch from the remote integration tip when the local one is ahead", async () => {
    fixture();
    const pushed = git(repo, "rev-parse", DEVELOP);
    commitFile(repo, "product.txt", "unpushed product edit\n");

    await branchPush();

    expect(process.exitCode).toBeUndefined();
    expect(git(repo, "rev-parse", `refs/heads/${BRANCH}`)).toBe(pushed);
    expect(remoteTip()).toBe(pushed);
    expect(git(remote, "rev-parse", `refs/heads/${DEVELOP}`)).toBe(pushed);
    expect(stdout.join("")).toContain(`Created branch ${BRANCH} from origin/${DEVELOP}`);
  });

  it("creates from the local integration branch with a notice when the remote has none", async () => {
    fixture();
    git(repo, "push", "origin", "--delete", DEVELOP);

    await branchPush();

    expect(process.exitCode).toBe(1);
    const message = stderr.join("");
    expect(message).toContain(`origin/${DEVELOP} does not exist`);
    expect(message).toContain("push the integration branch to the remote first");
    expect(git(remote, "branch", "--list", BRANCH)).toBe("");
    expect(git(repo, "branch", "--list", BRANCH)).toBe("");
  });

  it("starts --dry-run from the remote integration tip when the local one is ahead", async () => {
    fixture();
    const pushed = git(repo, "rev-parse", DEVELOP);
    commitFile(repo, "product.txt", "unpushed product edit\n");

    await branchPush("--dry-run");

    expect(process.exitCode).toBeUndefined();
    const output = stdout.join("");
    expect(output).toContain(
      `Would create branch ${BRANCH} from origin/${DEVELOP} (${pushed.slice(0, 12)})`,
    );
    expect(output).toContain(", 0 commit(s)");
    expect(output).toContain("Checks: passed.");
    expect(git(repo, "branch", "--list", BRANCH)).toBe("");
  });

  it("shows the same initial-check hint on --dry-run as the real run", async () => {
    fixture();
    git(repo, "push", "origin", "--delete", DEVELOP);

    await branchPush("--dry-run");

    expect(process.exitCode).toBe(1);
    const output = stdout.join("");
    expect(output).toContain(`origin/${DEVELOP} does not exist`);
    expect(output).toContain("Checks: failed");
    expect(output).toContain("push the integration branch to the remote first");
    expect(git(repo, "branch", "--list", BRANCH)).toBe("");
  });

  it("shows the branch, commit range and checks on --dry-run without changing anything", async () => {
    fixture();
    const develop = git(repo, "rev-parse", DEVELOP);

    await branchPush("--dry-run");

    expect(process.exitCode).toBeUndefined();
    const output = stdout.join("");
    expect(output).toContain(
      `Would create branch ${BRANCH} from origin/${DEVELOP} (${develop.slice(0, 12)})`,
    );
    expect(output).toContain("Would push to origin/project/sample/register");
    expect(output).toContain("Checks: passed.");
    expect(git(repo, "branch", "--list", BRANCH)).toBe("");
    expect(git(remote, "branch", "--list", BRANCH)).toBe("");
    expect(git(repo, "worktree", "list", "--porcelain")).not.toContain(BRANCH);
  });

  it("reports pending commits and failed checks on --dry-run without pushing", async () => {
    fixture();
    await branchPush();
    const worktree = registerWorktree();
    const base = remoteTip();
    const local = commitFile(worktree, "product.txt", "edited on register\n");
    const status = readFileSync(join(worktree, "product.txt"), "utf8");

    await branchPush("--dry-run");

    expect(process.exitCode).toBe(1);
    const output = stdout.join("");
    expect(output).toContain(`${base.slice(0, 12)}..${local.slice(0, 12)}, 1 commit(s)`);
    expect(output).toContain("Checks: failed");
    expect(remoteTip()).toBe(base);
    expect(readFileSync(join(worktree, "product.txt"), "utf8")).toBe(status);
  });
});
