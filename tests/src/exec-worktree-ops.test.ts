import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertResultMarkdownlint,
  type WorktreeOpsContext,
  normalizeResultWhitespace,
} from "../../src/exec-worktree-ops.js";
import type { ExecWorktree } from "../../src/exec-worktree.js";

function fixture(result: string): {
  root: string;
  context: WorktreeOpsContext;
  worktree: ExecWorktree;
} {
  const root = mkdtempSync(join(tmpdir(), "specdojo-result-markdownlint-"));
  const executionPath = join(root, "execution");
  const resultPath = join(executionPath, "exec", "results", "TASK-result.md");
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
    rmSync(join(target.context.executionPath, "exec", "results", "TASK-result.md"));
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
