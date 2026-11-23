import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerRegisterCommands } from "../../../src/register/register.js";
import { readAllEventFiles, writeEventFile } from "../../../src/exec/events.js";
import type { ExecEventV1 } from "../../../src/exec/types.js";
import { gitEnvironment } from "../../../src/shared/git.js";
import {
  inRegisterBranch,
  pushRegisterBranch,
  resolveRegisterBranchTarget,
} from "../../../src/shared/register-branch.js";

const PROJECT = "sample";
const BRANCH = "project/sample/register";
const REGISTER = "docs/sample/controls/project-register";
const EVENTS = "docs/sample/execution/exec/events";

function git(cwd: string, ...args: string[]): string {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", env: gitEnvironment() });
  if (result.status !== 0) throw new Error(`${args.join(" ")}: ${result.stdout}\n${result.stderr}`);
  return result.stdout.trimEnd();
}

async function register(...args: string[]): Promise<void> {
  const program = new Command().exitOverride();
  registerRegisterCommands(program);
  await program.parseAsync(["register", ...args], { from: "user" });
}

async function add(id: string, topic: string, project = PROJECT, commit = true): Promise<void> {
  await register(
    "add",
    "--project",
    project,
    "--id",
    id,
    "--type",
    "todo",
    "--title",
    topic,
    "--topic",
    topic,
    "--registered",
    "2026-11-23T00:00:00Z",
    ...(commit ? ["--commit"] : []),
  );
}

function write(path: string, value: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function event(type: ExecEventV1["type"], actor = "agent-1"): ExecEventV1 {
  return {
    v: 1,
    ts: type === "claim" ? "2026-11-23T00:00:00Z" : "2026-11-23T00:01:00Z",
    type,
    task_id: "T-001",
    by: actor,
    msg: type,
  };
}

describe("register branch synchronization", () => {
  const originalCwd = process.cwd();
  const sourceRoot = resolve(originalCwd);
  let parent: string;
  let repo: string;
  let remote: string;
  let peer: string;

  function fixture(sync: unknown = { enabled: true }): void {
    parent = mkdtempSync(join(tmpdir(), "specdojo-register-sync-"));
    repo = join(parent, "repo");
    peer = join(parent, "peer");
    remote = join(parent, "remote.git");
    mkdirSync(repo);
    git(parent, "init", "--bare", remote);
    git(repo, "init", "-b", "project/sample/develop");
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
            register_sync: sync,
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
    git(repo, "branch", BRANCH);
    git(repo, "push", "origin", "project/sample/develop", BRANCH);
    git(parent, "clone", "--branch", BRANCH, remote, peer);
    process.chdir(repo);
    vi.spyOn(process.stdout, "write").mockReturnValue(true);
  }

  function ticket(id: string, topic: string): string {
    return `${REGISTER}/${id.toLowerCase()}-${topic}.md`;
  }

  afterEach(() => {
    process.chdir(originalCwd);
    if (parent) rmSync(parent, { recursive: true, force: true });
    process.exitCode = undefined;
    vi.restoreAllMocks();
  });

  it("commits and pushes add/update/transitions in another worktree and preserves source changes", async () => {
    fixture();
    const head = git(repo, "rev-parse", "HEAD");
    write(join(repo, "product.txt"), "staged product edit\n");
    git(repo, "add", "product.txt");
    await add("PJR-AB12", "first-item");
    await register(
      "update",
      "--project",
      PROJECT,
      "--id",
      "PJR-AB12",
      "--priority",
      "high",
      "--commit",
    );
    for (const command of ["defer", "reopen", "reject", "reopen"]) {
      await register(command, "--project", PROJECT, "--id", "PJR-AB12", "--commit");
    }
    for (const command of ["start", "wait", "start", "review"]) {
      await register(command, "--project", PROJECT, "--id", "PJR-AB12", "--commit");
    }
    const completionFile = join(parent, "completed-work.md");
    write(
      completionFile,
      "| No | 作業 | 担当 | 状態 | メモ |\n| --- | --- | --- | --- | --- |\n| 1 | 実装 | DEV | done | 完了 |\n",
    );
    await register(
      "update",
      "--project",
      PROJECT,
      "--id",
      "PJR-AB12",
      "--section",
      "作業内容",
      "--section-file",
      completionFile,
      "--commit",
    );
    await register(
      "close",
      "--project",
      PROJECT,
      "--id",
      "PJR-AB12",
      "--conclusion",
      "completed",
      "--commit",
    );
    expect(process.exitCode).toBeUndefined();
    expect(git(remote, "show", `${BRANCH}:${ticket("PJR-AB12", "first-item")}`)).toContain(
      "priority: high",
    );
    expect(git(remote, "show", `${BRANCH}:${REGISTER}/events/pjr-ab12.yaml`)).toContain(
      "action: reject",
    );
    expect(git(remote, "show", `${BRANCH}:${ticket("PJR-AB12", "first-item")}`)).toContain(
      "item_status: done",
    );
    expect(git(repo, "rev-parse", "HEAD")).toBe(head);
    expect(readFileSync(join(repo, "product.txt"), "utf8")).toBe("staged product edit\n");
    expect(git(repo, "diff", "--cached", "--name-only")).toBe("product.txt");
    expect(existsSync(join(repo, ticket("PJR-AB12", "first-item")))).toBe(false);
    expect(
      git(remote, "diff", "--name-only", `${head}..${BRANCH}`)
        .split("\n")
        .every((path) => path.startsWith(`${REGISTER}/`)),
    ).toBe(true);
  });

  it("keeps the legacy current-branch commit when disabled", async () => {
    fixture({ enabled: false });
    const remoteHead = git(remote, "rev-parse", BRANCH);
    await add("PJR-AB12", "local-item");
    expect(process.exitCode).toBeUndefined();
    expect(existsSync(join(repo, ticket("PJR-AB12", "local-item")))).toBe(true);
    expect(git(remote, "rev-parse", BRANCH)).toBe(remoteHead);
    expect(git(repo, "status", "--porcelain")).toBe("");
  });

  it("writes locally without --commit even when synchronization is enabled", async () => {
    fixture();
    const head = git(remote, "rev-parse", BRANCH);
    await add("PJR-AB12", "uncommitted-item", PROJECT, false);
    expect(process.exitCode).toBeUndefined();
    expect(existsSync(join(repo, ticket("PJR-AB12", "uncommitted-item")))).toBe(true);
    expect(git(remote, "rev-parse", BRANCH)).toBe(head);
  });

  it("honors a custom branch and named remote, creating a local branch from the remote", async () => {
    fixture({ enabled: true, branch: "bookkeeping/sample", remote: "team" });
    git(repo, "remote", "rename", "origin", "team");
    git(repo, "push", "team", "HEAD:refs/heads/bookkeeping/sample");
    await add("PJR-AB12", "custom-target");
    expect(process.exitCode).toBeUndefined();
    expect(
      git(remote, "show", `bookkeeping/sample:${ticket("PJR-AB12", "custom-target")}`),
    ).toContain("custom-target");
  });

  it("routes cross-project add to register without requiring a local integration branch", async () => {
    fixture();
    const configPath = join(repo, ".specdojo/specdojo.config.json");
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    config.projects.caller = {};
    config.projects.sample.integration_branch = "project/missing/develop";
    write(configPath, JSON.stringify(config));
    git(repo, "add", ".specdojo/specdojo.config.json");
    git(repo, "commit", "-m", "test: caller project");
    git(repo, "switch", "-c", "project/caller/develop");
    const head = git(repo, "rev-parse", "HEAD");
    await add("PJR-AB12", "cross-project-item");
    expect(process.exitCode).toBeUndefined();
    expect(git(repo, "rev-parse", "HEAD")).toBe(head);
    expect(git(remote, "show", `${BRANCH}:${ticket("PJR-AB12", "cross-project-item")}`)).toContain(
      "cross-project-item",
    );
  });

  it("stops with initialization guidance before writing if the remote branch is absent", async () => {
    fixture({ enabled: true, branch: "bookkeeping/missing" });
    const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
    await add("PJR-AB12", "missing-branch");
    expect(process.exitCode).toBe(1);
    expect(stderr.mock.calls.flat().join("")).toContain(
      "create it from the project develop branch",
    );
    expect(existsSync(join(repo, ticket("PJR-AB12", "missing-branch")))).toBe(false);
  });

  it("does not create a worktree, fetch or push on dry-run", async () => {
    fixture();
    const head = git(remote, "rev-parse", BRANCH);
    git(repo, "remote", "remove", "origin");
    await register(
      "add",
      "--project",
      PROJECT,
      "--id",
      "PJR-AB12",
      "--type",
      "todo",
      "--title",
      "preview",
      "--topic",
      "preview",
      "--commit",
      "--dry-run",
    );
    expect(process.exitCode).toBeUndefined();
    expect(git(repo, "worktree", "list", "--porcelain")).not.toContain(
      `branch refs/heads/${BRANCH}`,
    );
    expect(git(remote, "rev-parse", BRANCH)).toBe(head);
  });

  it("pushes schedule claim/complete events and reads state from the register branch", () => {
    fixture();
    const head = git(repo, "rev-parse", "HEAD");
    const schedule = join(repo, "docs/sample/schedule");
    const claim = writeEventFile(schedule, event("claim"));
    const complete = writeEventFile(schedule, event("complete"));
    expect(claim).not.toContain(join(repo, EVENTS));
    expect(readAllEventFiles(schedule).map((item) => item.event.type)).toEqual([
      "claim",
      "complete",
    ]);
    expect(git(remote, "ls-tree", "-r", "--name-only", BRANCH, EVENTS).split("\n")).toHaveLength(2);
    expect(git(remote, "show", `${BRANCH}:${EVENTS}/${complete.split("/").at(-1)}`)).toContain(
      '"type": "complete"',
    );
    expect(git(repo, "rev-parse", "HEAD")).toBe(head);
    expect(existsSync(join(repo, EVENTS))).toBe(false);
  });

  it("rejects a claim when a different clone has already claimed the task", () => {
    fixture();
    process.chdir(peer);
    writeEventFile(join(peer, "docs/sample/schedule"), event("claim", "agent-2"));
    process.chdir(repo);
    expect(() => writeEventFile(join(repo, "docs/sample/schedule"), event("claim"))).toThrow(
      "state is doing",
    );
  });

  it("rebases and retries an actual non-fast-forward rejection without losing either writer", async () => {
    fixture();
    const target = resolveRegisterBranchTarget(PROJECT)!;
    await inRegisterBranch(target, async (worktree) => {
      // Both clones start at the same remote commit; peer pushes after our pull, before our push.
      write(join(worktree, EVENTS, "local.json"), JSON.stringify(event("note")));
      git(worktree, "add", EVENTS);
      git(worktree, "commit", "-m", "test: local event");
      write(join(peer, EVENTS, "peer.json"), JSON.stringify(event("note", "agent-2")));
      git(peer, "add", EVENTS);
      git(peer, "commit", "-m", "test: peer event");
      git(peer, "push", "origin", BRANCH);
      pushRegisterBranch(target, worktree);
      expect(git(worktree, "status", "--porcelain")).toBe("");
    });
    const files = git(remote, "ls-tree", "-r", "--name-only", BRANCH, EVENTS);
    expect(files).toContain("local.json");
    expect(files).toContain("peer.json");
    expect(git(repo, "rev-parse", BRANCH)).toBe(git(remote, "rev-parse", BRANCH));
  });

  it("preserves local commits and reports recovery steps when the server rejects a push", async () => {
    fixture();
    const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
    write(
      join(remote, "hooks/pre-receive"),
      "#!/bin/sh\necho 'permission denied by test server' >&2\nexit 1\n",
    );
    const { chmodSync } = await import("node:fs");
    chmodSync(join(remote, "hooks/pre-receive"), 0o755);
    const remoteHead = git(remote, "rev-parse", BRANCH);
    await add("PJR-AB12", "preserved-item");
    expect(process.exitCode).toBe(1);
    expect(git(repo, "show", `${BRANCH}:${ticket("PJR-AB12", "preserved-item")}`)).toContain(
      "preserved-item",
    );
    expect(git(remote, "rev-parse", BRANCH)).toBe(remoteHead);
    expect(stderr.mock.calls.flat().join("")).toContain("permission denied by test server");
    expect(stderr.mock.calls.flat().join("")).toContain("Do not repeat add");
    // Do not let another command silently publish unresolved bookkeeping.
    process.exitCode = undefined;
    stderr.mockClear();
    await add("PJR-CD34", "later-item");
    expect(process.exitCode).toBe(1);
    expect(stderr.mock.calls.flat().join("")).toContain("previous register sync failed");
  });

  it("leaves a rebase conflict and the local record available for manual recovery", async () => {
    fixture();
    const target = resolveRegisterBranchTarget(PROJECT)!;
    let retained = "";
    await expect(
      inRegisterBranch(target, async (worktree) => {
        retained = worktree;
        write(join(worktree, EVENTS, "conflict.json"), "local\n");
        git(worktree, "add", EVENTS);
        git(worktree, "commit", "-m", "test: local conflicting record");
        write(join(peer, EVENTS, "conflict.json"), "remote\n");
        git(peer, "add", EVENTS);
        git(peer, "commit", "-m", "test: remote conflicting record");
        git(peer, "push", "origin", BRANCH);
        pushRegisterBranch(target, worktree);
      }),
    ).rejects.toThrow("git rebase --continue");
    expect(readFileSync(join(retained, EVENTS, "conflict.json"), "utf8")).toContain("local");
    expect(git(retained, "show", `ORIG_HEAD:${EVENTS}/conflict.json`)).toBe("local");
    expect(git(remote, "show", `${BRANCH}:${EVENTS}/conflict.json`)).toBe("remote");
  });

  it("uses an external project's configured register branch via its CLI", async () => {
    fixture();
    // A real target CLI runs the current sources. This avoids a dependency on a prebuilt dist.
    const entrypoint = join(repo, "node_modules/.bin/specdojo");
    const loader = join(sourceRoot, "node_modules/tsx/dist/loader.mjs");
    write(
      entrypoint,
      `#!/usr/bin/env node\nif(process.argv.includes('--version')) { console.log('0.10.0'); } else {\n` +
        `const {spawnSync}=require('node:child_process');\n` +
        `const r=spawnSync(process.execPath,['--import',${JSON.stringify(loader)},${JSON.stringify(join(sourceRoot, "src/specdojo.ts"))},...process.argv.slice(2)],{stdio:'inherit'});process.exit(r.status??1);}\n`,
    );
    const { chmodSync } = await import("node:fs");
    chmodSync(entrypoint, 0o755);
    const caller = join(parent, "caller");
    write(
      join(caller, ".specdojo/specdojo.config.json"),
      JSON.stringify({
        version: 1,
        current_project: "caller",
        projects: { caller: {} },
        external_projects: { upstream: { path: relative(caller, repo), project_id: PROJECT } },
      }),
    );
    process.chdir(caller);
    await add("PJR-AB12", "external-item", "upstream");
    expect(process.exitCode).toBeUndefined();
    expect(git(remote, "show", `${BRANCH}:${ticket("PJR-AB12", "external-item")}`)).toContain(
      "external-item",
    );
    expect(existsSync(join(repo, ticket("PJR-AB12", "external-item")))).toBe(false);
  });
});
