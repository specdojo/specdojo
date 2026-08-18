import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import fg from "fast-glob";
import {
  assertControlGeneratedIndexes,
  buildDocIndex,
  lookupDocIndex,
  replaceDocIndexRefs,
} from "../../src/doc-index.js";
import type { DocIndex } from "../../src/doc-index.js";
import { readSpecdojoNamespace } from "../../src/frontmatter-namespace.js";

function writeIndex(
  dir: string,
  entries: Record<string, string>,
  localized?: Record<string, Record<string, string>>,
): string {
  const index: DocIndex = { version: 1, entries, ...(localized ? { localized } : {}) };
  const indexPath = join(dir, "doc-index.json");
  writeFileSync(indexPath, JSON.stringify(index, null, 2), "utf8");
  return indexPath;
}

describe("lookupDocIndex", () => {
  it("インデックスファイルが存在しない場合は undefined を返す", () => {
    const result = lookupDocIndex("some-id", "/nonexistent/path/doc-index.json");
    expect(result).toBeUndefined();
  });

  it("id がインデックスに存在する場合はパスを返す", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const indexPath = writeIndex(dir, { "my-doc": "docs/my-doc.md" });
      expect(lookupDocIndex("my-doc", indexPath)).toBe("docs/my-doc.md");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("id がインデックスに存在しない場合は undefined を返す", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const indexPath = writeIndex(dir, { "other-doc": "docs/other.md" });
      expect(lookupDocIndex("missing-doc", indexPath)).toBeUndefined();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("複数エントリのインデックスから正しい id のパスを返す", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const indexPath = writeIndex(dir, {
        "doc-a": "docs/a.md",
        "doc-b": "docs/b.md",
        "doc-c": "docs/c.md",
      });
      expect(lookupDocIndex("doc-b", indexPath)).toBe("docs/b.md");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("行番号付きパス（path:line 形式）もそのまま返す", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const indexPath = writeIndex(dir, { "nested-id": "docs/schedule.yaml:12" });
      expect(lookupDocIndex("nested-id", indexPath)).toBe("docs/schedule.yaml:12");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("replaceDocIndexRefs", () => {
  it("[[id]] を Markdown リンクに置換する", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const indexPath = writeIndex(dir, {
        "sample-doc": "docs/sample.md",
        "nested-id": "docs/viewpoints.yaml:12",
      });
      const result = replaceDocIndexRefs("See [[sample-doc]] and [[nested-id]].", indexPath);

      // markdown format emits root-relative links (leading slash) for site-root resolution.
      expect(result.content).toBe(
        "See [sample-doc](/docs/sample.md) and [nested-id](/docs/viewpoints.yaml:12).",
      );
      expect(result.missingIds).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("path 形式で置換する", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const indexPath = writeIndex(dir, { "sample-doc": "docs/sample.md" });
      const result = replaceDocIndexRefs("See [[sample-doc]].", indexPath, {
        format: "path",
      });

      expect(result.content).toBe("See docs/sample.md.");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("[[id|title]] は title を Markdown リンク表示名として使う", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const indexPath = writeIndex(dir, { "sample-doc": "docs/sample.md" });
      const result = replaceDocIndexRefs("See [[sample-doc|Sample Document]].", indexPath);

      expect(result.content).toBe("See [Sample Document](/docs/sample.md).");
      expect(result.missingIds).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("path 形式では [[id|title]] の title を無視して path のみに置換する", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const indexPath = writeIndex(dir, { "sample-doc": "docs/sample.md" });
      const result = replaceDocIndexRefs("See [[sample-doc|Sample Document]].", indexPath, {
        format: "path",
      });

      expect(result.content).toBe("See docs/sample.md.");
      expect(result.missingIds).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("未解決 ID はデフォルトで維持し、missingIds に一意に記録する", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const indexPath = writeIndex(dir, { "known-doc": "docs/known.md" });
      const result = replaceDocIndexRefs(
        "See [[known-doc]], [[missing-doc]], [[missing-doc]].",
        indexPath,
      );

      expect(result.content).toBe(
        "See [known-doc](/docs/known.md), [[missing-doc]], [[missing-doc]].",
      );
      expect(result.missingIds).toEqual(["missing-doc"]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("[[id|title]] が未解決の場合は id のみを missingIds に記録する", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const indexPath = writeIndex(dir, {});
      const result = replaceDocIndexRefs("See [[missing-doc|Missing Document]].", indexPath);

      expect(result.content).toBe("See [[missing-doc|Missing Document]].");
      expect(result.missingIds).toEqual(["missing-doc"]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("インラインコード内の [[id]] は参照として扱わず素通しする", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const indexPath = writeIndex(dir, { "sample-doc": "docs/sample.md" });
      const result = replaceDocIndexRefs(
        "リンクは `[[id|title]]` 形式で書き、未作成なら `[[...]]` を使わない。実体は [[sample-doc]]。",
        indexPath,
        { format: "path" },
      );

      expect(result.content).toBe(
        "リンクは `[[id|title]]` 形式で書き、未作成なら `[[...]]` を使わない。実体は docs/sample.md。",
      );
      expect(result.missingIds).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("コードフェンス内の [[id]] は参照として扱わず素通しする", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const indexPath = writeIndex(dir, { "sample-doc": "docs/sample.md" });
      const input = ["例:", "```text", "[[missing-doc]]", "```", "本文 [[sample-doc]]。"].join(
        "\n",
      );
      const result = replaceDocIndexRefs(input, indexPath, { format: "path" });

      expect(result.content).toBe(
        ["例:", "```text", "[[missing-doc]]", "```", "本文 docs/sample.md。"].join("\n"),
      );
      expect(result.missingIds).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("lang 指定時は同一言語の localized variant を優先解決する", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const indexPath = writeIndex(
        dir,
        { "shared-guide": "docs/ja/guide.md" },
        { "shared-guide": { ja: "docs/ja/guide.md", en: "docs/en/guide.md" } },
      );
      const result = replaceDocIndexRefs("See [[shared-guide]].", indexPath, {
        format: "path",
        lang: "en",
      });

      expect(result.content).toBe("See docs/en/guide.md.");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("lang の variant が無ければ既定言語（entries）へフォールバックする", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const indexPath = writeIndex(
        dir,
        { "ja-only": "docs/ja/only.md" },
        { "ja-only": { ja: "docs/ja/only.md" } },
      );
      const result = replaceDocIndexRefs("See [[ja-only]].", indexPath, {
        format: "path",
        lang: "en",
      });

      expect(result.content).toBe("See docs/ja/only.md.");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("missing: marker の場合は未解決 ID を _MISSING_ に置換する", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const indexPath = writeIndex(dir, {});
      const result = replaceDocIndexRefs("See [[missing-doc]].", indexPath, {
        missing: "marker",
      });

      expect(result.content).toBe("See _MISSING_.");
      expect(result.missingIds).toEqual(["missing-doc"]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("buildDocIndex", () => {
  it("異なるファイルに同じ authority-qualified ID があれば拒否する", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const docsRoot = join(repoRoot, "docs");
      mkdirSync(join(docsRoot, "ja", "specdojo", "guides"), { recursive: true });
      mkdirSync(join(docsRoot, "ja", "project", "guides"), { recursive: true });
      const frontmatter =
        "---\nspecdojo:\n  id: specdojo:shared-guide\n  type: guide\n  status: draft\n---\n";
      writeFileSync(join(docsRoot, "ja", "specdojo", "guides", "shared-guide.md"), frontmatter);
      writeFileSync(join(docsRoot, "ja", "project", "guides", "shared-guide.md"), frontmatter);

      expect(() =>
        buildDocIndex(docsRoot, join(docsRoot, ".specdojo", "doc-index.json"), repoRoot),
      ).toThrow(/Duplicate document ID "specdojo:shared-guide"/);
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  it("Markdown frontmatter と YAML top-level id をインデックス化する", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const docsRoot = join(repoRoot, "docs");
      mkdirSync(join(docsRoot, "ja"), { recursive: true });
      writeFileSync(
        join(docsRoot, "ja", "sample.md"),
        "---\nspecdojo:\n  id: sample-doc\n  type: guide\n  status: draft\n---\n\n# Sample\n",
        "utf8",
      );
      writeFileSync(
        join(docsRoot, "ja", "sample.yaml"),
        "id: sample-yaml\ntype: project\nstatus: draft\n",
        "utf8",
      );

      const outputPath = join(docsRoot, ".specdojo", "doc-index.json");
      const result = buildDocIndex(docsRoot, outputPath, repoRoot);
      const index = JSON.parse(readFileSync(outputPath, "utf8")) as DocIndex;

      expect(result.count).toBe(2);
      expect(index.entries["sample-doc"]).toBe("docs/ja/sample.md");
      expect(index.entries["sample-yaml"]).toBe("docs/ja/sample.yaml");
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  it("トップレベル id のない YAML は x-spec-meta.id をインデックス化する", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const docsRoot = join(repoRoot, "docs");
      mkdirSync(join(docsRoot, "ja"), { recursive: true });
      writeFileSync(
        join(docsRoot, "ja", "ifx-api-sample.yaml"),
        [
          "openapi: 3.0.3",
          "info:",
          "  title: 決済サービスAPI",
          "x-spec-meta:",
          "  id: specdojo:ifx-api-sample",
          "  type: api",
          "  status: draft",
          "",
        ].join("\n"),
        "utf8",
      );

      const outputPath = join(docsRoot, ".specdojo", "doc-index.json");
      buildDocIndex(docsRoot, outputPath, repoRoot);
      const index = JSON.parse(readFileSync(outputPath, "utf8")) as DocIndex;

      expect(index.entries["specdojo:ifx-api-sample"]).toBe("docs/ja/ifx-api-sample.yaml");
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  it("locales 設定時、同一論理 ID の言語別文書は variant として許容する", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const docsRoot = join(repoRoot, "docs");
      mkdirSync(join(docsRoot, "ja"), { recursive: true });
      mkdirSync(join(docsRoot, "en"), { recursive: true });
      mkdirSync(join(repoRoot, ".specdojo"), { recursive: true });
      const frontmatter = (id: string) =>
        `---\nspecdojo:\n  id: ${id}\n  type: guide\n  status: draft\n---\n\n# Doc\n`;
      writeFileSync(join(docsRoot, "ja", "guide.md"), frontmatter("shared-guide"), "utf8");
      writeFileSync(join(docsRoot, "en", "guide.md"), frontmatter("shared-guide"), "utf8");
      writeFileSync(
        join(repoRoot, ".specdojo", "index-config.yaml"),
        "locales:\n  - ja\n  - en\n",
        "utf8",
      );

      const outputPath = join(docsRoot, ".specdojo", "doc-index.json");
      buildDocIndex(docsRoot, outputPath, repoRoot);
      const index = JSON.parse(readFileSync(outputPath, "utf8")) as DocIndex;

      // entries は既定言語（config 先頭の ja）を指す。
      expect(index.entries["shared-guide"]).toBe("docs/ja/guide.md");
      expect(index.localized?.["shared-guide"]).toEqual({
        ja: "docs/ja/guide.md",
        en: "docs/en/guide.md",
      });
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  it("locales 設定時でも同一言語内の ID 重複は拒否する", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const docsRoot = join(repoRoot, "docs");
      mkdirSync(join(docsRoot, "ja", "a"), { recursive: true });
      mkdirSync(join(docsRoot, "ja", "b"), { recursive: true });
      mkdirSync(join(repoRoot, ".specdojo"), { recursive: true });
      const frontmatter = "---\nspecdojo:\n  id: dup-guide\n  type: guide\n  status: draft\n---\n";
      writeFileSync(join(docsRoot, "ja", "a", "guide.md"), frontmatter, "utf8");
      writeFileSync(join(docsRoot, "ja", "b", "guide.md"), frontmatter, "utf8");
      writeFileSync(
        join(repoRoot, ".specdojo", "index-config.yaml"),
        "locales:\n  - ja\n  - en\n",
        "utf8",
      );

      expect(() =>
        buildDocIndex(docsRoot, join(docsRoot, ".specdojo", "doc-index.json"), repoRoot),
      ).toThrow(/Duplicate document ID "dup-guide" in locale "ja"/);
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  it("言語中立文書と言語別文書で同一 ID を使うと拒否する", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const docsRoot = join(repoRoot, "docs");
      mkdirSync(join(docsRoot, "ja"), { recursive: true });
      mkdirSync(join(docsRoot, "specdojo"), { recursive: true });
      mkdirSync(join(repoRoot, ".specdojo"), { recursive: true });
      const frontmatter = "---\nspecdojo:\n  id: mixed-id\n  type: guide\n  status: draft\n---\n";
      // docs/specdojo は locales に含めないため言語中立、docs/ja は locale ja。
      writeFileSync(join(docsRoot, "specdojo", "neutral.md"), frontmatter, "utf8");
      writeFileSync(join(docsRoot, "ja", "localized.md"), frontmatter, "utf8");
      writeFileSync(
        join(repoRoot, ".specdojo", "index-config.yaml"),
        "locales:\n  - ja\n  - en\n",
        "utf8",
      );

      expect(() =>
        buildDocIndex(docsRoot, join(docsRoot, ".specdojo", "doc-index.json"), repoRoot),
      ).toThrow(/mixed language-neutral and localized/);
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  it("通常の generated は除外し、controls 配下の generated は収集する", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const docsRoot = join(repoRoot, "docs");
      mkdirSync(join(repoRoot, ".specdojo"), { recursive: true });
      mkdirSync(join(docsRoot, "generated"), { recursive: true });
      mkdirSync(join(docsRoot, "ja", "projects", "prj-0001", "controls", "generated"), {
        recursive: true,
      });
      writeFileSync(
        join(docsRoot, "generated", "ignored.md"),
        "---\nspecdojo:\n  id: ignored-doc\n  type: guide\n  status: draft\n---\n",
        "utf8",
      );
      writeFileSync(
        join(docsRoot, "ja", "projects", "prj-0001", "controls", "generated", "included.md"),
        "---\nspecdojo:\n  id: controls-generated-doc\n  type: project\n  status: ready\n---\n",
        "utf8",
      );
      writeFileSync(
        join(docsRoot, "viewpoints.yaml"),
        [
          "id: viewpoints-root",
          "viewpoints:",
          "  - id: vp-with-path",
          "    path: docs/custom-target.md",
          "  - id: vp-with-line",
          "    name: line target",
          "",
        ].join("\n"),
        "utf8",
      );
      writeFileSync(
        join(repoRoot, ".specdojo", "index-config.yaml"),
        [
          "nested_id_files:",
          "  - file: docs/viewpoints.yaml",
          "    collect_from:",
          "      - field: viewpoints",
          "        id_field: id",
          "        path_field: path",
          "",
        ].join("\n"),
        "utf8",
      );

      const outputPath = join(docsRoot, ".specdojo", "doc-index.json");
      buildDocIndex(docsRoot, outputPath, repoRoot);
      const index = JSON.parse(readFileSync(outputPath, "utf8")) as DocIndex;

      expect(index.entries["ignored-doc"]).toBeUndefined();
      expect(index.entries["controls-generated-doc"]).toBe(
        "docs/ja/projects/prj-0001/controls/generated/included.md",
      );
      expect(index.entries["viewpoints-root"]).toBe("docs/viewpoints.yaml");
      expect(index.entries["vp-with-path"]).toBe("docs/custom-target.md");
      expect(index.entries["vp-with-line"]).toBe("docs/viewpoints.yaml:5");
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  it("project-register の生成一覧が無ければ index build 用の事前検査で拒否する", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const docsRoot = join(repoRoot, "docs");
      const registerDir = join(
        docsRoot,
        "ja",
        "projects",
        "prj-0001",
        "controls",
        "project-register",
      );
      mkdirSync(registerDir, { recursive: true });

      expect(() => assertControlGeneratedIndexes(docsRoot)).toThrow(
        /Run: specdojo register build before specdojo index build/,
      );

      mkdirSync(join(registerDir, "generated"), { recursive: true });
      writeFileSync(
        join(registerDir, "generated", "pjr-index.md"),
        "---\nspecdojo:\n  id: prj-0001:pjr-index\n  type: project\n  status: ready\n---\n",
        "utf8",
      );
      expect(() => assertControlGeneratedIndexes(docsRoot)).not.toThrow();
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});

describe("prj-0001 project register references", () => {
  it("個票の part_of と pjr-index wikilink が生成された登録台帳へ解決する", () => {
    const repoRoot = process.cwd();
    const outputDir = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    const indexPath = join(outputDir, "doc-index.json");
    const registerId = "prj-0001:pjr-index";

    try {
      buildDocIndex(join(repoRoot, "docs"), indexPath, repoRoot);

      const expectedPath =
        "docs/ja/projects/prj-0001/controls/project-register/generated/pjr-index.md";
      expect(lookupDocIndex(registerId, indexPath)).toBe(expectedPath);

      const registerFiles = fg.sync("docs/ja/projects/prj-0001/controls/project-register/*.md", {
        cwd: repoRoot,
        absolute: true,
      });
      let partOfReferenceCount = 0;
      for (const file of registerFiles) {
        const namespace = readSpecdojoNamespace(readFileSync(file, "utf8"));
        const partOf = Array.isArray(namespace.part_of) ? namespace.part_of : [];
        for (const id of partOf) {
          if (typeof id !== "string") continue;
          partOfReferenceCount++;
          expect(lookupDocIndex(id, indexPath), `${file}: unresolved part_of ${id}`).toBeDefined();
        }
      }
      expect(partOfReferenceCount).toBeGreaterThan(0);

      const markdownFiles = fg.sync("docs/**/*.md", {
        cwd: repoRoot,
        absolute: true,
        ignore: ["**/generated/**"],
      });
      let wikilinkReferenceCount = 0;
      for (const file of markdownFiles) {
        const content = readFileSync(file, "utf8");
        const matches = content.matchAll(/\[\[prj-0001:pjr-index(?:(?:\\\\)*\|[^\]]*)?\]\]/g);
        for (const _match of matches) {
          wikilinkReferenceCount++;
          expect(lookupDocIndex(registerId, indexPath), `${file}: unresolved ${registerId}`).toBe(
            expectedPath,
          );
        }
      }
      expect(wikilinkReferenceCount).toBeGreaterThan(0);
    } finally {
      rmSync(outputDir, { recursive: true, force: true });
    }
  }, 20_000);
});
