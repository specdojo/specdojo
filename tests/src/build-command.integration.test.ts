import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { generateWorktreeArtifacts, gitEnvironment } from "../../src/exec-worktree.js";

// project を 2 つ持つ checkout で、生成物（git 管理外の generated/）が無い状態から
// `specdojo build`（--project なし）が通ることを、実 CLI の子プロセスで確認する。

// Vitest はリポジトリ直下を cwd にして実行される。
const REPO_ROOT = resolve(process.cwd());
const PROJECT_IDS = ["prj-0001", "prj-0002"] as const;
const REGISTER_REL = "controls/project-register";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function registerDir(root: string, projectId: string): string {
  return join(root, "docs", "ja", "projects", projectId, REGISTER_REL);
}

function generatedRegisterIndex(root: string, projectId: string): string {
  return join(registerDir(root, projectId), "generated", "pjr-index.md");
}

function createTwoProjectFixture(): string {
  const root = mkdtempSync(join(tmpdir(), "specdojo-build-multi-project-"));
  tempDirs.push(root);
  mkdirSync(join(root, ".specdojo"), { recursive: true });
  // current_project は先頭ではない project を指し、対象外 project の登録簿も必要になる構成にする。
  const config = {
    version: 1,
    current_project: "prj-0002",
    projects: Object.fromEntries(
      PROJECT_IDS.map((id) => [
        id,
        { base_path: `docs/ja/projects/${id}`, project_register_path: REGISTER_REL },
      ]),
    ),
  };
  writeFileSync(
    join(root, ".specdojo", "specdojo.config.json"),
    `${JSON.stringify(config, null, 2)}\n`,
    "utf8",
  );
  for (const id of PROJECT_IDS) {
    mkdirSync(registerDir(root, id), { recursive: true });
  }
  // build は各段を fixture 側の node_modules/.bin/tsx で起動し直すため、依存を参照させる。
  // index build は node_modules を走査対象から除外する。
  symlinkSync(join(REPO_ROOT, "node_modules"), join(root, "node_modules"), "dir");
  return root;
}

function runBuild(cwd: string): SpawnSyncReturns<string> {
  return spawnSync(
    process.execPath,
    [
      join(REPO_ROOT, "node_modules", ".bin", "tsx"),
      join(REPO_ROOT, "src", "specdojo.ts"),
      "build",
    ],
    {
      cwd,
      encoding: "utf8",
      env: { ...gitEnvironment(), CI: "true", LEFTHOOK: "0" },
    },
  );
}

describe("specdojo build without --project", () => {
  it(
    "builds every project's register so index build succeeds from a clean checkout",
    { timeout: 120_000 },
    () => {
      const root = createTwoProjectFixture();
      for (const id of PROJECT_IDS) {
        expect(existsSync(generatedRegisterIndex(root, id))).toBe(false);
      }

      const result = runBuild(root);

      expect(result.stderr).not.toContain("Generated project register index is missing");
      expect(result.status).toBe(0);
      for (const id of PROJECT_IDS) {
        expect(readFileSync(generatedRegisterIndex(root, id), "utf8")).toContain(
          `id: ${id}:pjr-index`,
        );
      }
      expect(existsSync(join(root, ".specdojo", "doc-index.json"))).toBe(true);
    },
  );

  it(
    "lets exec worktree preparation generate artifacts for the same two-project fixture",
    { timeout: 120_000 },
    () => {
      const root = createTwoProjectFixture();
      // worktree の checkout にある CLI として、このリポジトリの src を参照させる。
      symlinkSync(join(REPO_ROOT, "src"), join(root, "src"), "dir");

      expect(() => generateWorktreeArtifacts(root)).not.toThrow();

      for (const id of PROJECT_IDS) {
        expect(existsSync(generatedRegisterIndex(root, id))).toBe(true);
      }
    },
  );
});
