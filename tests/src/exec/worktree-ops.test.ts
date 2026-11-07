import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { runLefthookScaffold } from "../../../src/shared/lefthook-scaffold.js";
import {
  assertResultMarkdownlint,
  type WorktreeOpsContext,
  normalizeResultWhitespace,
} from "../../../src/exec/worktree-ops.js";
import type { ExecWorktree } from "../../../src/exec/worktree.js";
import { isCommitTargetPath } from "../../../src/exec/worktree-ops-commit.js";
import { runRecordPrefixes, taskRecordPaths } from "../../../src/exec/run-records.js";

describe("run record commit targets", () => {
  it.each([
    "execution/exec/results/old-result.md",
    "execution/runs/register/PJR-AB12/run-1/result.md",
  ])("includes current run evidence independently of result %s", (result) => {
    const prefixes = runRecordPrefixes("execution", "PJR-AB12", "run-1");
    for (const prefix of prefixes) {
      for (const name of [
        "evidence.json",
        "executor.log",
        "pipeline-state.json",
        "executor.attempt-1.log",
        "nested/output.log",
      ]) {
        expect(
          isCommitTargetPath(`${prefix}${name}`, "execution", result, undefined, prefixes),
        ).toBe(true);
      }
    }
    for (const path of [
      "execution/runs/register/PJR-AB12/run-2/executor.log",
      "execution/runs/register/PJR-OTHER/run-1/evidence.json",
    ]) {
      expect(isCommitTargetPath(path, "execution", result, undefined, prefixes)).toBe(false);
    }
  });
});

function fixture(result: string): {
  root: string;
  context: WorktreeOpsContext;
  worktree: ExecWorktree;
} {
  const root = mkdtempSync(join(tmpdir(), "specdojo-result-markdownlint-"));
  const executionPath = join(root, "execution");
  const resultPath = taskRecordPaths(executionPath, "TASK").result;
  mkdirSync(dirname(resultPath), { recursive: true });
  // リポジトリの .markdownlint.yaml と同じく行長は検査しない。
  writeFileSync(join(root, ".markdownlint.yaml"), "MD013: false\n", "utf8");
  writeFileSync(resultPath, result, "utf8");
  return {
    root,
    context: { repoRoot: root, schedulePath: join(root, "schedule"), executionPath },
    worktree: { path: root, branch: "exec/TASK", name: "TASK", created: true },
  };
}

describe("assertResultMarkdownlint", () => {
  it("accepts a long Japanese result without config and still rejects notation errors", () => {
    const target = fixture(
      `# Result\n\n${"日本語の長い行を含む result の検査です。".repeat(20)}\n`,
    );
    try {
      rmSync(join(target.root, ".markdownlint.yaml"));
      expect(() => assertResultMarkdownlint(target.context, target.worktree, "TASK")).not.toThrow();
      writeFileSync(
        taskRecordPaths(target.context.executionPath, "TASK").result,
        "#Invalid heading\n",
      );
      expect(() => assertResultMarkdownlint(target.context, target.worktree, "TASK")).toThrow(
        /MD018/,
      );
    } finally {
      rmSync(target.root, { recursive: true, force: true });
    }
  });

  it.each([
    ".markdownlint.yaml",
    ".markdownlint.yml",
    ".markdownlint.json",
    ".markdownlint.jsonc",
    ".markdownlintrc",
  ])("prioritizes explicit MD013 in %s over SpecDojo defaults", (filename) => {
    const target = fixture(
      `# Result\n\n${"日本語の長い行を含む result の検査です。".repeat(20)}\n`,
    );
    try {
      rmSync(join(target.root, ".markdownlint.yaml"));
      writeFileSync(join(target.root, filename), '{"MD013": true}\n');
      expect(() => assertResultMarkdownlint(target.context, target.worktree, "TASK")).toThrow(
        /MD013/,
      );
    } finally {
      rmSync(target.root, { recursive: true, force: true });
    }
  });

  it("preserves markdownlint-cli's inherited .markdownlintrc settings", () => {
    const target = fixture(
      `# Result\n\n${"日本語の長い行を含む result の検査です。".repeat(20)}\n`,
    );
    const child = join(target.root, "child");
    try {
      rmSync(join(target.root, ".markdownlint.yaml"));
      writeFileSync(join(target.root, ".markdownlintrc"), '{"MD013":true}\n');
      mkdirSync(taskRecordPaths(join(child, "execution"), "TASK").directory, { recursive: true });
      writeFileSync(
        taskRecordPaths(join(child, "execution"), "TASK").result,
        readFileSync(taskRecordPaths(join(target.root, "execution"), "TASK").result),
      );
      expect(() =>
        assertResultMarkdownlint(
          { ...target.context, repoRoot: child, executionPath: join(child, "execution") },
          { ...target.worktree, path: child },
          "TASK",
        ),
      ).toThrow(/MD013/);
    } finally {
      rmSync(target.root, { recursive: true, force: true });
    }
  });

  it("uses scaffolded .markdownlintrc rules for result checks", async () => {
    const target = fixture(`# Result\n\n${"long result line ".repeat(20).trim()}\n`);
    const stdout = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      rmSync(join(target.root, ".markdownlint.yaml"));
      await runLefthookScaffold({
        packageRoot: process.cwd(),
        repoRoot: target.root,
        config: { version: 1, projects: {} },
        force: false,
        dryRun: false,
      });
      expect(() => assertResultMarkdownlint(target.context, target.worktree, "TASK")).not.toThrow();
      writeFileSync(
        taskRecordPaths(target.context.executionPath, "TASK").result,
        "#Invalid heading\n",
      );
      expect(() => assertResultMarkdownlint(target.context, target.worktree, "TASK")).toThrow(
        /MD018/,
      );
    } finally {
      stdout.mockRestore();
      rmSync(target.root, { recursive: true, force: true });
    }
  });

  it("commit 前に result の Markdown 記法違反を明示的な理由で block する", () => {
    const target = fixture("# Result\n\n*asterisk* and _underscore_\n");
    try {
      expect(() => assertResultMarkdownlint(target.context, target.worktree, "TASK")).toThrow(
        /^Result Markdown notation violation before commit: .*MD049/,
      );
    } finally {
      rmSync(target.root, { recursive: true, force: true });
    }
  });

  it("prettier が強調へ書き換えた再現文（PJR-19HX）を MD049 として block する", () => {
    // `depends_on` を囲まずに `_TODO_` と同居させた文を prettier --write に通した実出力。
    const target = fixture(
      "# Result\n\n- 対象、depends*on の cdfd-overview を根拠とし、判断不能箇所があれば \\_TODO*/_ASSUMPTION_ を残す方針。\n",
    );
    try {
      expect(() => assertResultMarkdownlint(target.context, target.worktree, "TASK")).toThrow(
        /^Result Markdown notation violation before commit: .*MD049/,
      );
    } finally {
      rmSync(target.root, { recursive: true, force: true });
    }
  });

  it("markdownlint 違反がない result は commit 前検査を通す", () => {
    const target = fixture(
      "# Result\n\n- `depends_on` の cdfd-overview を根拠とし、判断不能箇所があれば _TODO_/_ASSUMPTION_ を残す方針。\n",
    );
    try {
      expect(() => assertResultMarkdownlint(target.context, target.worktree, "TASK")).not.toThrow();
    } finally {
      rmSync(target.root, { recursive: true, force: true });
    }
  });

  it("result が存在しない場合は検査を省略して通す", () => {
    const target = fixture("# Result\n");
    rmSync(taskRecordPaths(target.context.executionPath, "TASK").result);
    try {
      expect(() => assertResultMarkdownlint(target.context, target.worktree, "TASK")).not.toThrow();
    } finally {
      rmSync(target.root, { recursive: true, force: true });
    }
  });
});

describe("normalizeResultWhitespace", () => {
  it("strips trailing spaces and ensures a single trailing newline without touching emphasis", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-result-ws-"));
    try {
      const file = join(dir, "result.md");
      writeFileSync(file, "# R\n\n- _TODO_ を残す \n- 末尾", "utf8");

      normalizeResultWhitespace(file);

      expect(readFileSync(file, "utf8")).toBe("# R\n\n- _TODO_ を残す\n- 末尾\n");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
