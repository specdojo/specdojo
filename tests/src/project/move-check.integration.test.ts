import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { listFilesRecursive } from "../../../src/shared/fs.js";
import { gitEnvironment } from "../../../src/shared/git.js";

// `specdojo project move --check` を実 Git の fixture で子プロセスとして起動し、
// 点検の前後で作業ツリー・HEAD・refs・worktree が変わらないことを確かめる。

const REPO_ROOT = resolve(process.cwd());
const REGISTER_REL = "controls/project-register";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function git(cwd: string, args: string[]): string {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", env: gitEnvironment() });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`);
  return result.stdout;
}

function writeText(path: string, content: string): void {
  mkdirSync(resolve(path, ".."), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function ticket(projectId: string, id: string, status: string, body: string): string {
  return [
    "---",
    "specdojo:",
    `  id: ${projectId}:${id.toLowerCase()}-sample`,
    "  type: project",
    "  status: draft",
    "  item_type: todo",
    `  item_status: ${status}`,
    "  priority: medium",
    "  owner: DEV",
    '  registered_at: "2026-11-01T01:00:00Z"',
    '  due_on: "2026-12-31"',
    "---",
    "",
    `# ${id} Sample`,
    "",
    body,
    "",
  ].join("\n");
}

function createFixture(prj0002Status: string): string {
  const root = mkdtempSync(join(tmpdir(), "specdojo-project-move-check-"));
  tempDirs.push(root);
  git(root, ["init", "--quiet", "--initial-branch=main"]);
  const config = {
    version: 1,
    current_project: "prj-0001",
    projects: Object.fromEntries(
      ["prj-0001", "prj-0002"].map((id) => [
        id,
        { base_path: `docs/ja/projects/${id}`, project_register_path: REGISTER_REL },
      ]),
    ),
  };
  writeText(join(root, ".specdojo", "specdojo.config.json"), `${JSON.stringify(config)}\n`);
  writeText(
    join(root, "docs/ja/projects/prj-0001", REGISTER_REL, "pjr-0aaa-sample.md"),
    ticket("prj-0001", "PJR-0AAA", "done", "Links back to [[prj-0002:pjr-0abc-sample]]."),
  );
  writeText(
    join(root, "docs/ja/projects/prj-0002", REGISTER_REL, "pjr-0abc-sample.md"),
    ticket("prj-0002", "PJR-0ABC", prj0002Status, "See [[prj-0001:pjr-0aaa-sample]]."),
  );
  git(root, ["add", "."]);
  git(root, ["commit", "--quiet", "-m", "fixture"]);
  return root;
}

function runMoveCheck(cwd: string): SpawnSyncReturns<string> {
  return spawnSync(
    process.execPath,
    [
      join(REPO_ROOT, "node_modules", ".bin", "tsx"),
      join(REPO_ROOT, "src", "specdojo.ts"),
      "project",
      "move",
      "prj-0002",
      "--check",
    ],
    { cwd, encoding: "utf8", env: { ...gitEnvironment(), CI: "true", LEFTHOOK: "0" } },
  );
}

type RepositorySnapshot = {
  files: Record<string, string>;
  head: string;
  refs: string;
  status: string;
  worktrees: string;
};

function snapshot(root: string): RepositorySnapshot {
  const files = Object.fromEntries(
    listFilesRecursive(root)
      .map((path) => relative(root, path))
      .filter((path) => path.split(/[\\/]/)[0] !== ".git")
      .sort()
      .map((path) => [path, readFileSync(join(root, path), "utf8")]),
  );
  return {
    files,
    head: git(root, ["rev-parse", "HEAD"]),
    refs: git(root, ["for-each-ref", "--format=%(refname) %(objectname)"]),
    status: git(root, ["status", "--porcelain", "--untracked-files=all"]),
    worktrees: git(root, ["worktree", "list", "--porcelain"]),
  };
}

describe("specdojo project move --check", () => {
  it(
    "reports in-flight work with exit 1 and leaves files, HEAD, refs, and worktrees unchanged",
    { timeout: 120_000 },
    () => {
      const root = createFixture("in-progress");
      const worktreePath = join(root, "..", `${root.split(/[\\/]/).pop()}-wt`);
      tempDirs.push(worktreePath);
      git(root, ["worktree", "add", "--quiet", "-b", "exec/prj-0002-PJR-0ABC", worktreePath]);
      const before = snapshot(root);

      const result = runMoveCheck(root);

      expect(result.status, result.stderr).toBe(1);
      expect(result.stdout).toContain("[needs-cleanup] register-items");
      expect(result.stdout).toContain("PJR-0ABC in-progress Sample");
      expect(result.stdout).toContain("[needs-cleanup] exec-worktrees");
      expect(result.stdout).toContain("project: exec/prj-0002-PJR-0ABC (worktree ");
      expect(result.stdout).toContain("out prj-0001:pjr-0aaa-sample (1 files)");
      expect(result.stdout).toContain("in prj-0002:pjr-0abc-sample (1 files)");
      expect(snapshot(root)).toEqual(before);
    },
  );

  it("exits 0 when nothing needs cleanup", { timeout: 120_000 }, () => {
    const root = createFixture("done");
    const before = snapshot(root);

    const result = runMoveCheck(root);

    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("[ok] register-items");
    expect(result.stdout).toContain("[ok] exec-worktrees");
    expect(result.stdout).toContain("Summary: ok 5, needs-cleanup 0, check-manually 3");
    expect(snapshot(root)).toEqual(before);
  });
});
