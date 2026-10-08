import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { globFilesSync } from "../../../packages/docs-lint/src/glob-files.js";

describe("globFilesSync", () => {
  it("brace・ignore・onlyFiles・dot・重複排除を適用し辞書順で返す", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-docs-lint-glob-"));
    try {
      for (const file of [
        "docs/b.yml",
        "docs/a.yaml",
        "docs/nested/c.yaml",
        "docs/nested/ignored.yml",
        "docs/.hidden.yaml",
      ]) {
        mkdirSync(join(root, file, ".."), { recursive: true });
        writeFileSync(join(root, file), "test: true\n", "utf8");
      }
      mkdirSync(join(root, "docs/directory.yaml"), { recursive: true });

      expect(
        globFilesSync(["docs/**/*.{yaml,yml}", "docs/a.yaml"], {
          cwd: root,
          ignore: ["**/ignored.yml"],
        }),
      ).toEqual(["docs/a.yaml", "docs/b.yml", "docs/nested/c.yaml"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
