import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  generateMermaidSvgsForFile,
  shouldGenerateMermaidForFile,
} from "../../../packages/docs-site/src/gen-mermaid-svg.js";

describe("Mermaid SVG generation", () => {
  it("accepts Markdown under docs except generated directories", () => {
    const root = join(tmpdir(), "specdojo-mermaid-root");

    expect(shouldGenerateMermaidForFile(join(root, "ja/guide.md"), root)).toBe(true);
    expect(shouldGenerateMermaidForFile(join(root, "ja/generated/guide.md"), root)).toBe(false);
    expect(shouldGenerateMermaidForFile(join(root, "ja/guide.yaml"), root)).toBe(false);
    expect(shouldGenerateMermaidForFile(join(root, "../outside.md"), root)).toBe(false);
  });

  it("removes a missing Markdown entry from the manifest without throwing", () => {
    const directory = mkdtempSync(join(tmpdir(), "specdojo-mermaid-missing-"));
    const rootDir = join(directory, "docs");
    const outDir = join(directory, "public/mermaid");
    const mdPath = join(rootDir, "ja/removed.md");
    const hash = "1234abcd";
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, `${hash}.svg`), "<svg></svg>\n", "utf8");
    writeFileSync(
      join(outDir, ".manifest.json"),
      JSON.stringify({
        version: 1,
        files: {
          "ja/removed.md": { mtimeMs: 1, size: 1, hashes: [hash] },
        },
      }),
      "utf8",
    );

    try {
      expect(() => generateMermaidSvgsForFile(mdPath, { rootDir, outDir })).not.toThrow();

      expect(JSON.parse(readFileSync(join(outDir, ".manifest.json"), "utf8"))).toEqual({
        version: 1,
        files: {},
      });
      expect(() => readFileSync(join(outDir, `${hash}.svg`), "utf8")).toThrow();
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("ignores generated Markdown and removes any stale manifest entry", () => {
    const directory = mkdtempSync(join(tmpdir(), "specdojo-mermaid-generated-"));
    const rootDir = join(directory, "docs");
    const outDir = join(directory, "public/mermaid");
    const mdPath = join(rootDir, "ja/generated/invalid.md");
    mkdirSync(join(rootDir, "ja/generated"), { recursive: true });
    mkdirSync(outDir, { recursive: true });
    writeFileSync(mdPath, "```mermaid\nthis is not valid Mermaid\n```\n", "utf8");
    writeFileSync(
      join(outDir, ".manifest.json"),
      JSON.stringify({
        version: 1,
        files: {
          "ja/generated/invalid.md": { mtimeMs: 1, size: 1, hashes: [] },
        },
      }),
      "utf8",
    );

    try {
      expect(() => generateMermaidSvgsForFile(mdPath, { rootDir, outDir })).not.toThrow();
      expect(JSON.parse(readFileSync(join(outDir, ".manifest.json"), "utf8"))).toEqual({
        version: 1,
        files: {},
      });
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
