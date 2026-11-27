import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { writeEventFile } from "../../../src/exec/events.js";
import { registerRegisterCommands } from "../../../src/register/register.js";
import { checkRegisterPush } from "../../../src/register/push-check.js";
import { gitEnvironment } from "../../../src/shared/git.js";
import { checkRegisterGuard, mergeRegisterBranch } from "../../../src/shared/register-merge.js";
import { resolveSyncBranchTargets } from "../../../src/shared/register-branch.js";

const PROJECT = "sample";
const DEVELOP = "project/sample/develop";
const REGISTER_BRANCH = "project/sample/sync/register";
const EVENTS_BRANCH = "project/sample/sync/exec-events";
const REGISTER = "docs/sample/controls/project-register";
const EVENTS = "docs/sample/execution/exec/events";

function git(cwd: string, ...args: string[]): string {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", env: gitEnvironment() });
  if (result.status !== 0) throw new Error(`${args.join(" ")}: ${result.stdout}\n${result.stderr}`);
  return result.stdout.trimEnd();
}

function write(path: string, value: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

async function register(...args: string[]): Promise<void> {
  const program = new Command().exitOverride();
  registerRegisterCommands(program);
  await program.parseAsync(["register", ...args], { from: "user" });
}

describe("sync branches split into register and exec-events", () => {
  const originalCwd = process.cwd();
  const sourceRoot = resolve(originalCwd);
  let parent: string;
  let repo: string;
  let remote: string;

  function fixture(): void {
    parent = mkdtempSync(join(tmpdir(), "specdojo-sync-branches-"));
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
            sync: { enabled: true },
          },
        },
      }),
    );
    cpSync(
      join(sourceRoot, "docs/ja/specdojo/templates"),
      join(repo, "docs/ja/specdojo/templates"),
      { recursive: true },
    );
    write(join(repo, ".gitignore"), "**/generated/\n**/exec/.locks/\nnode_modules/\n");
    write(join(repo, "product.txt"), "base\n");
    git(repo, "add", ".");
    git(repo, "commit", "-m", "test: initial repository");
    git(repo, "remote", "add", "origin", remote);
    git(repo, "branch", REGISTER_BRANCH);
    git(repo, "branch", EVENTS_BRANCH);
    git(repo, "push", "origin", DEVELOP, REGISTER_BRANCH, EVENTS_BRANCH);
    process.chdir(repo);
    vi.spyOn(process.stdout, "write").mockReturnValue(true);
  }

  afterEach(() => {
    process.chdir(originalCwd);
    if (parent) rmSync(parent, { recursive: true, force: true });
    process.exitCode = undefined;
    vi.restoreAllMocks();
  });

  async function addItem(): Promise<void> {
    await register(
      "add",
      "--project",
      PROJECT,
      "--id",
      "PJR-AB12",
      "--type",
      "todo",
      "--title",
      "first-item",
      "--topic",
      "first-item",
      "--registered",
      "2026-11-23T00:00:00Z",
      "--commit",
    );
  }

  function claim(): string {
    return writeEventFile(join(repo, "docs/sample/schedule"), {
      v: 1,
      ts: "2026-11-23T00:00:00Z",
      type: "claim",
      task_id: "T-001",
      by: "agent-1",
      msg: "claim",
    });
  }

  function changedPaths(base: string, branch: string): string[] {
    return git(remote, "diff", "--name-only", `${base}..${branch}`).split("\n").filter(Boolean);
  }

  it("resolves the default branch names with one scope each", () => {
    fixture();

    const targets = resolveSyncBranchTargets(PROJECT);

    expect(targets.map(({ kind, branch, scope }) => ({ kind, branch, scope }))).toEqual([
      { kind: "register", branch: REGISTER_BRANCH, scope: [REGISTER] },
      { kind: "exec-events", branch: EVENTS_BRANCH, scope: [EVENTS] },
    ]);
  });

  it("publishes register mutations and exec events to their own branch only", async () => {
    fixture();
    const base = git(repo, "rev-parse", "HEAD");

    await addItem();
    claim();

    expect(process.exitCode).toBeUndefined();
    const registerPaths = changedPaths(base, REGISTER_BRANCH);
    const eventPaths = changedPaths(base, EVENTS_BRANCH);
    expect(registerPaths.length).toBeGreaterThan(0);
    expect(registerPaths.every((path) => path.startsWith(`${REGISTER}/`))).toBe(true);
    expect(eventPaths).toHaveLength(1);
    expect(eventPaths[0]!.startsWith(`${EVENTS}/`)).toBe(true);
    expect(git(repo, "rev-parse", "HEAD")).toBe(base);
  });

  it("merges register then exec-events into develop and passes the guard", async () => {
    fixture();
    await addItem();
    claim();
    const base = git(repo, "rev-parse", "HEAD");

    const outcome = mergeRegisterBranch(PROJECT);

    expect(outcome.status).toBe("checked");
    expect(
      outcome.status === "checked" &&
        outcome.branches.map(({ status, source }) => ({ status, source })),
    ).toEqual([
      { status: "merged", source: REGISTER_BRANCH },
      { status: "merged", source: EVENTS_BRANCH },
    ]);
    expect(git(repo, "ls-files", "--", EVENTS).split("\n").filter(Boolean)).toHaveLength(1);
    expect(existsSync(join(repo, REGISTER, "events", "pjr-ab12.yaml"))).toBe(true);
    expect(checkRegisterGuard(PROJECT, { kind: "range", range: `${base}..HEAD` })).toEqual({
      status: "checked",
      violations: [],
    });
  });

  it("flags a direct edit of exec events on develop", () => {
    fixture();
    write(join(repo, EVENTS, "direct.json"), "{}\n");
    git(repo, "add", "--", EVENTS);

    const result = checkRegisterGuard(PROJECT, { kind: "staged" });

    expect(result).toEqual({ status: "checked", violations: [`staged: ${EVENTS}/direct.json`] });
  });

  it("rejects register files pushed to the exec-events branch", () => {
    fixture();
    const worktree = join(parent, "events-worktree");
    git(repo, "worktree", "add", worktree, EVENTS_BRANCH);
    write(join(worktree, REGISTER, "stray.md"), "stray\n");
    git(worktree, "add", "--", REGISTER);
    git(worktree, "commit", "-m", "test: stray register file");
    const base = git(repo, "rev-parse", `origin/${EVENTS_BRANCH}`);

    const result = checkRegisterPush(PROJECT, "UTC", {
      commit: git(worktree, "rev-parse", "HEAD"),
      base,
      remoteRef: `refs/heads/${EVENTS_BRANCH}`,
    });

    expect(result.status).toBe("checked");
    expect(result.status === "checked" && result.scopeViolations).toEqual([
      expect.stringMatching(new RegExp(`: ${REGISTER}/stray\\.md$`, "u")),
    ]);
    expect(result.status === "checked" && result.shapeViolations).toEqual([]);
  });
});
