import { describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { buildDocIndex, lookupDocIndex, replaceDocIndexRefs } from "../../src/doc-index.js";
import type { DocIndex } from "../../src/doc-index.js";

function writeIndex(dir: string, entries: Record<string, string>): string {
  const index: DocIndex = { version: 1, entries };
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
  it("Markdown frontmatter と YAML top-level id をインデックス化する", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const docsRoot = join(repoRoot, "docs");
      mkdirSync(join(docsRoot, "ja"), { recursive: true });
      writeFileSync(
        join(docsRoot, "ja", "sample.md"),
        "---\nid: sample-doc\ntype: guide\nstatus: draft\n---\n\n# Sample\n",
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

  it("generated 配下を除外し、nested_id_files を収集する", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-test-"));
    try {
      const docsRoot = join(repoRoot, "docs");
      mkdirSync(join(repoRoot, ".specdojo"), { recursive: true });
      mkdirSync(join(docsRoot, "generated"), { recursive: true });
      writeFileSync(
        join(docsRoot, "generated", "ignored.md"),
        "---\nid: ignored-doc\ntype: guide\nstatus: draft\n---\n",
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
      expect(index.entries["viewpoints-root"]).toBe("docs/viewpoints.yaml");
      expect(index.entries["vp-with-path"]).toBe("docs/custom-target.md");
      expect(index.entries["vp-with-line"]).toBe("docs/viewpoints.yaml:5");
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });
});
