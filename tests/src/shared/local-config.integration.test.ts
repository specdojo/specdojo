import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { worktreeBuildEnvironment } from "../../../src/exec/worktree.js";
import { gitEnvironment } from "../../../src/shared/git.js";

const sourceRoot = process.cwd();
let parent: string;
let main: string;
let worktree: string;

function git(cwd: string, ...args: string[]): void {
  const result = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    env: gitEnvironment(),
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")}: ${result.stderr}`);
}

function writeJson(path: string, value: unknown): void {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function runCli(cwd: string, env: NodeJS.ProcessEnv, ...args: string[]) {
  return spawnSync(
    process.execPath,
    [
      join(sourceRoot, "node_modules/tsx/dist/cli.mjs"),
      join(sourceRoot, "src/specdojo.ts"),
      ...args,
    ],
    { cwd, env, encoding: "utf8" },
  );
}

beforeEach(() => {
  // main/ and wt/ sit beside the repositories, so "../<name>" resolves from either checkout.
  parent = mkdtempSync(join(tmpdir(), "specdojo-local-config-int-"));
  main = join(parent, "main");
  worktree = join(parent, "wt");
  for (const name of ["main", "app1", "app1-alt", "tools"]) mkdirSync(join(parent, name));
  git(main, "init", "-b", "main");
  writeJson(join(main, ".specdojo", "specdojo.config.json"), {
    version: 1,
    current_project: "prj-0001",
    projects: { "prj-0001": { repos: [{ name: "app1", path: "../app1" }] } },
  });
  writeFileSync(join(main, ".gitignore"), ".specdojo/specdojo.local.config.json\n", "utf8");
  git(main, "add", ".");
  git(main, "commit", "-m", "test: initial");
  git(main, "worktree", "add", "-b", "exec/task-1", worktree);
});

afterEach(() => {
  rmSync(parent, { recursive: true, force: true });
});

describe("local config in a worktree child process", () => {
  it("applies the main tree's local config passed by environment and ignores the worktree's own file", () => {
    const mainLocal = join(main, ".specdojo", "specdojo.local.config.json");
    writeJson(mainLocal, {
      version: 1,
      projects: {
        "prj-0001": {
          repos: [
            { name: "app1", path: "../app1-alt" },
            { name: "tools", path: "../tools" },
          ],
        },
      },
    });
    // An agent could leave a same-named file in its worktree; the child must not read it.
    writeJson(join(worktree, ".specdojo", "specdojo.local.config.json"), {
      version: 1,
      projects: { "prj-0001": { repos: [{ name: "evil", path: ".." }] } },
    });

    const result = runCli(worktree, worktreeBuildEnvironment(worktree), "config", "show");

    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain(`local-config: ${mainLocal}\n`);
    expect(result.stdout).toContain("  repo app1: ../app1-alt (local; shared: ../app1)\n");
    expect(result.stdout).toContain("  repo tools: ../tools (local; added)\n");
    expect(result.stdout).not.toContain("evil");
  });

  it("reports no local config in the child when the main tree has none", () => {
    const result = runCli(worktree, worktreeBuildEnvironment(worktree), "config", "show");

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("local-config: none\n");
    expect(result.stdout).toContain("  repo app1: ../app1 (shared)\n");
  });
});
