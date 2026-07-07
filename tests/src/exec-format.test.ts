import { describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { formatMarkdownFile } from "../../src/exec-format.js";

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
});
