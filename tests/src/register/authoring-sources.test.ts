import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { resolveAuthoringSources } from "../../../src/register/authoring-sources.js";

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function fixture(files: readonly string[]): string {
  const root = mkdtempSync(join(tmpdir(), "specdojo-authoring-sources-"));
  roots.push(root);
  for (const file of files) {
    mkdirSync(join(root, file, ".."), { recursive: true });
    writeFileSync(join(root, file), "# sample\n", "utf8");
  }
  return root;
}

function resolvePaths(root: string, source: string): string[] {
  return resolveAuthoringSources({ repoRoot: root, project: {}, sources: [source] }).map(
    (resolved) => resolved.path,
  );
}

describe("resolveAuthoringSources path expansion", () => {
  it("ディレクトリはファイルだけを / 区切りで並べ、ドット・.git・node_modules を含めない", () => {
    const root = fixture([
      "lessons/b.md",
      "lessons/a.md",
      "lessons/sub/c.md",
      "lessons/.hidden.md",
      "lessons/.drafts/d.md",
      "lessons/.git/e.md",
      "lessons/node_modules/pkg/f.md",
      "lessons/sub/node_modules/g.md",
    ]);
    mkdirSync(join(root, "lessons/empty"), { recursive: true });

    expect(resolvePaths(root, "lessons/")).toEqual([
      "lessons/a.md",
      "lessons/b.md",
      "lessons/sub/c.md",
    ]);
  });

  it("ディレクトリをたどる途中のシンボリックリンクはたどらない", () => {
    const root = fixture(["lessons/a.md", "outside/target.md", "outside/dir/inner.md"]);
    symlinkSync(join(root, "outside/target.md"), join(root, "lessons/file-link.md"));
    symlinkSync(join(root, "outside/dir"), join(root, "lessons/dir-link"));

    expect(resolvePaths(root, "lessons/")).toEqual(["lessons/a.md"]);
    expect(resolvePaths(root, "lessons/**/*.md")).toEqual(["lessons/a.md"]);
  });

  it("glob はブレース展開し、ドット・.git・node_modules を除いて並べる", () => {
    const root = fixture([
      "docs/b.yaml",
      "docs/a.md",
      "docs/nested/c.md",
      "docs/.hidden.md",
      "docs/node_modules/x.md",
      "docs/.git/y.md",
      "docs/skip.txt",
    ]);
    mkdirSync(join(root, "docs/dir.md"), { recursive: true });

    expect(resolvePaths(root, "docs/**/*.{md,yaml}")).toEqual([
      "docs/a.md",
      "docs/b.yaml",
      "docs/nested/c.md",
    ]);
  });

  it("* で終わらない glob は一致したディレクトリの中のファイルも返す", () => {
    const root = fixture(["lessons/one/sub/a.md", "lessons/one/sub/b.md", "lessons/two/c.md"]);

    expect(resolvePaths(root, "lessons/*/sub")).toEqual([
      "lessons/one/sub/a.md",
      "lessons/one/sub/b.md",
    ]);
  });

  it("ドットで始まる名前を明示した glob はドットファイルを返す", () => {
    const root = fixture(["docs/.hidden.md", "docs/a.md"]);

    expect(resolvePaths(root, "docs/.*.md")).toEqual(["docs/.hidden.md"]);
  });

  it("一致するファイルがない glob を拒否する", () => {
    const root = fixture(["docs/a.md"]);

    expect(() => resolvePaths(root, "docs/**/*.yaml")).toThrow(
      /Authoring source did not match any files: docs\/\*\*\/\*\.yaml/,
    );
  });
});
