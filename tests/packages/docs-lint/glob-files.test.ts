import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { globFilesSync } from "../../../packages/docs-lint/src/glob-files.js";

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function fixture(files: readonly string[]): string {
  const root = mkdtempSync(join(tmpdir(), "specdojo-docs-lint-glob-"));
  roots.push(root);
  for (const file of files) {
    mkdirSync(join(root, file, ".."), { recursive: true });
    writeFileSync(join(root, file), "test: true\n", "utf8");
  }
  return root;
}

describe("globFilesSync", () => {
  it("brace・ignore・onlyFiles・dot・重複排除を適用し辞書順で返す", () => {
    const root = fixture([
      "docs/b.yml",
      "docs/a.yaml",
      "docs/nested/c.yaml",
      "docs/nested/ignored.yml",
      "docs/.hidden.yaml",
      "docs/.hidden-dir/d.yaml",
    ]);
    mkdirSync(join(root, "docs/directory.yaml"), { recursive: true });

    expect(
      globFilesSync(["docs/**/*.{yaml,yml}", "docs/a.yaml"], {
        cwd: root,
        ignore: ["**/ignored.yml"],
      }),
    ).toEqual(["docs/a.yaml", "docs/b.yml", "docs/nested/c.yaml"]);
  });

  it("パターンがドットで始まる名前を指すときはドットファイルも返す", () => {
    const root = fixture(["docs/.hidden.yaml", "docs/a.yaml"]);

    expect(globFilesSync("docs/.*.yaml", { cwd: root })).toEqual(["docs/.hidden.yaml"]);
  });

  it("ディレクトリ名だけのパターンを中身へ展開しない", () => {
    const root = fixture(["docs/nested/c.yaml"]);

    expect(globFilesSync("docs/nested", { cwd: root })).toEqual([]);
  });

  it("ファイルへのシンボリックリンクは今までどおり返す", () => {
    const root = fixture(["outside/target.yaml", "docs/a.yaml"]);
    symlinkSync(join(root, "outside/target.yaml"), join(root, "docs/link.yaml"));

    expect(globFilesSync("docs/*.yaml", { cwd: root })).toEqual(["docs/a.yaml", "docs/link.yaml"]);
  });

  it("** はディレクトリへのシンボリックリンクの中へ入らない", () => {
    const root = fixture(["outside/inner.yaml", "docs/a.yaml"]);
    symlinkSync(join(root, "outside"), join(root, "docs/linked-dir"));

    expect(globFilesSync("docs/**/*.yaml", { cwd: root })).toEqual(["docs/a.yaml"]);
  });

  it("absolute を指定すると / 区切りの絶対パスを返す", () => {
    const root = fixture(["docs/a.yaml"]);

    expect(globFilesSync("docs/*.yaml", { cwd: root, absolute: true })).toEqual([
      join(root, "docs/a.yaml").replaceAll("\\", "/"),
    ]);
  });
});
