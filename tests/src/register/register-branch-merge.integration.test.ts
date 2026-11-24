import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerRegisterCommands } from "../../../src/register/register.js";
import { gitEnvironment } from "../../../src/shared/git.js";

const PROJECT = "sample";
const DEVELOP = "project/sample/develop";
const BRANCH = "project/sample/register";
const REGISTER = "docs/sample/controls/project-register";
const EVENTS = "docs/sample/execution/exec/events";

function git(cwd: string, ...args: string[]): string {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", env: gitEnvironment() });
  if (result.status !== 0) throw new Error(`${args.join(" ")}: ${result.stdout}\n${result.stderr}`);
  return result.stdout.trimEnd();
}

function write(path: string, value: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value, "utf8");
}

describe("register branch one-way merge into develop", () => {
  const originalCwd = process.cwd();
  let parent: string;
  let repo: string;
  let peer: string;
  let stderr: string[];
  let stdout: string[];

  function fixture(sync: unknown = { enabled: true }): void {
    parent = mkdtempSync(join(tmpdir(), "specdojo-register-merge-"));
    repo = join(parent, "repo");
    peer = join(parent, "peer");
    const remote = join(parent, "remote.git");
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
            register_sync: sync,
          },
        },
      }),
    );
    write(join(repo, `${REGISTER}/pjr-0001-base.md`), "base\n");
    write(join(repo, "product.txt"), "base\n");
    git(repo, "add", ".");
    git(repo, "commit", "-m", "test: initial repository");
    git(repo, "remote", "add", "origin", remote);
    git(repo, "branch", BRANCH);
    git(repo, "push", "origin", DEVELOP, BRANCH);
    git(parent, "clone", "--branch", BRANCH, remote, peer);
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

  function peerCommit(path: string, value: string): void {
    write(join(peer, path), value);
    git(peer, "add", "--", path);
    git(peer, "commit", "-m", `docs(register): ${path}`);
    git(peer, "push", "origin", `HEAD:refs/heads/${BRANCH}`);
  }

  function developCommit(path: string, value: string): void {
    write(join(repo, path), value);
    git(repo, "add", "--", path);
    git(repo, "commit", "-m", `feat: ${path}`);
  }

  async function register(...args: string[]): Promise<void> {
    const program = new Command().exitOverride();
    registerRegisterCommands(program);
    await program.parseAsync(["register", ...args, "--project", PROJECT], { from: "user" });
  }

  afterEach(() => {
    process.chdir(originalCwd);
    if (parent) rmSync(parent, { recursive: true, force: true });
    process.exitCode = undefined;
    vi.restoreAllMocks();
  });

  it("merges register commits into develop repeatedly without conflicts", async () => {
    fixture();
    const base = git(repo, "rev-parse", "HEAD");
    peerCommit(`${REGISTER}/pjr-0002-first.md`, "first\n");
    peerCommit(`${EVENTS}/2026/claim-1.json`, "{}\n");
    developCommit("product.txt", "develop edit\n");

    await register("branch-merge");
    expect(process.exitCode).toBeUndefined();
    expect(git(repo, "log", "-1", "--format=%P").split(" ")).toHaveLength(2);
    expect(existsSync(join(repo, `${REGISTER}/pjr-0002-first.md`))).toBe(true);
    expect(existsSync(join(repo, `${EVENTS}/2026/claim-1.json`))).toBe(true);

    peerCommit(`${REGISTER}/pjr-0001-base.md`, "updated on register\n");
    developCommit("product.txt", "second develop edit\n");
    await register("branch-merge");
    await register("branch-merge");

    expect(process.exitCode).toBeUndefined();
    expect(stdout.join("")).toContain("Register branch is already merged.");
    expect(git(repo, "show", `HEAD:${REGISTER}/pjr-0001-base.md`)).toBe("updated on register");
    expect(git(repo, "status", "--porcelain")).toBe("");

    await register("branch-guard", "--range", `${base}..HEAD`);
    expect(process.exitCode).toBeUndefined();
    expect(stdout.join("")).toContain("No direct register file changes found.");
  });

  it("accepts register content that reaches a feature branch through develop", async () => {
    fixture();
    const base = git(repo, "rev-parse", "HEAD");
    git(repo, "switch", "-c", "feature/x");
    developCommit("product.txt", "feature edit\n");
    git(repo, "switch", DEVELOP);
    peerCommit(`${REGISTER}/pjr-0002-first.md`, "first\n");
    await register("branch-merge");
    git(repo, "switch", "feature/x");
    git(repo, "merge", "--no-ff", "-m", "merge develop", DEVELOP);

    await register("branch-guard", "--range", `${base}..HEAD`);

    expect(process.exitCode).toBeUndefined();
  });

  it("reports staged and committed direct edits of register files on develop", async () => {
    fixture();
    const base = git(repo, "rev-parse", "HEAD");
    write(join(repo, `${REGISTER}/pjr-0001-base.md`), "edited on develop\n");
    git(repo, "add", "--", REGISTER);

    await register("branch-guard", "--staged");
    expect(process.exitCode).toBe(1);
    expect(stderr.join("")).toContain(`staged: ${REGISTER}/pjr-0001-base.md`);

    process.exitCode = undefined;
    git(repo, "commit", "-m", "feat: direct edit");
    await register("branch-guard", "--range", `${base}..HEAD`);
    expect(process.exitCode).toBe(1);
    expect(stderr.join("")).toMatch(
      /[0-9a-f]{12}: docs\/sample\/controls\/project-register\/pjr-0001-base\.md/,
    );
  });

  it("aborts a conflicting merge caused by a direct develop edit and keeps develop intact", async () => {
    fixture();
    developCommit(`${REGISTER}/pjr-0001-base.md`, "edited on develop\n");
    const head = git(repo, "rev-parse", "HEAD");
    peerCommit(`${REGISTER}/pjr-0001-base.md`, "edited on register\n");

    await register("branch-merge");

    expect(process.exitCode).toBe(1);
    expect(stderr.join("")).toContain("failed and was aborted");
    expect(git(repo, "rev-parse", "HEAD")).toBe(head);
    expect(existsSync(join(repo, ".git/MERGE_HEAD"))).toBe(false);
    expect(git(repo, "status", "--porcelain")).toBe("");
  });

  it("refuses a register branch that carries changes outside bookkeeping", async () => {
    fixture();
    peerCommit("product.txt", "smuggled\n");

    await register("branch-merge");

    expect(process.exitCode).toBe(1);
    expect(stderr.join("")).toContain("outside bookkeeping; refusing to merge: product.txt");
    expect(git(repo, "show", "HEAD:product.txt")).toBe("base");
  });

  it("does nothing without register_sync", async () => {
    fixture({ enabled: false });
    write(join(repo, `${REGISTER}/pjr-0001-base.md`), "edited on develop\n");
    git(repo, "add", "--", REGISTER);

    await register("branch-merge");
    await register("branch-guard", "--staged");

    expect(process.exitCode).toBeUndefined();
    expect(stdout.join("")).toContain("register_sync is not enabled for sample; nothing to merge.");
    expect(stdout.join("")).toContain("register_sync is not enabled for sample; skipped.");
  });
});
