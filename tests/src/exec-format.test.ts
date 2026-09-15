import { describe, expect, it } from "vitest";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { getFileInfo } from "prettier";
import { findPrettierIgnorePath, formatMarkdownFile } from "../../src/exec-format.js";
import { specdojoRootDir } from "../../src/specdojo-config.js";

describe("formatMarkdownFile", () => {
  it("Markdown ファイルを Prettier で整形して上書きする", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));

    try {
      const target = path.join(dir, "doc.md");
      await writeFile(target, "#    Title\n\n\n\n-   item\n", "utf8");

      await formatMarkdownFile(target);

      const actual = await readFile(target, "utf8");
      expect(actual).toBe("# Title\n\n- item\n");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("ファイルが存在しない場合は対象パスを含むエラーを投げる", async () => {
    const missing = path.join(tmpdir(), "specdojo-test-missing", "no-such.md");

    await expect(formatMarkdownFile(missing)).rejects.toThrow(
      /Failed to format Markdown with Prettier: .*no-such\.md/,
    );
  });

  it("上位の .prettierignore で除外されたファイルは本文を書き換えない", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));

    try {
      await writeFile(path.join(dir, ".prettierignore"), "exec/results/**\n", "utf8");
      const target = path.join(dir, "exec", "results", "task-result.md");
      await mkdir(path.dirname(target), { recursive: true });
      // `depends_on` を囲まずに `_TODO_` と同居させた文。Prettier は強調と解釈して書き換える。
      const source =
        "# Result\n\n- depends_on の cdfd-overview を根拠とし、判断不能箇所があれば _TODO_/_ASSUMPTION_ を残す。\n";
      await writeFile(target, source, "utf8");

      await formatMarkdownFile(target);

      expect(await readFile(target, "utf8")).toBe(source);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe("findPrettierIgnorePath", () => {
  it("対象ファイルから上位へ辿って最も近い .prettierignore を返す", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "specdojo-test-"));

    try {
      const ignorePath = path.join(dir, ".prettierignore");
      await writeFile(ignorePath, "", "utf8");
      const nested = path.join(dir, "a", "b", "doc.md");
      await mkdir(path.dirname(nested), { recursive: true });
      await writeFile(nested, "# Doc\n", "utf8");

      expect(findPrettierIgnorePath(nested)).toBe(ignorePath);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe(".prettierignore", () => {
  it("exec の plan/result 履歴だけを Prettier の対象外にする", async () => {
    const repo = specdojoRootDir();
    const ignorePath = path.join(repo, ".prettierignore");
    const files = [
      "docs/ja/projects/prj-test/execution/exec/plans/task-plan.md",
      "docs/ja/projects/prj-test/execution/exec/results/task-result.md",
    ];

    for (const file of files) {
      await expect(getFileInfo(path.join(repo, file), { ignorePath })).resolves.toMatchObject({
        ignored: true,
      });
    }
    await expect(
      getFileInfo(path.join(repo, "docs/ja/projects/prj-test/deliverables/doc.md"), {
        ignorePath,
      }),
    ).resolves.toMatchObject({ ignored: false });
  });
});
