import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

describe("Mermaid SVG generation cache", () => {
  it("redraws SVG when mermaid-cli version or config changes, reuses otherwise", async () => {
    const directory = mkdtempSync(join(tmpdir(), "specdojo-mermaid-cache-"));
    const rootDir = join(directory, "docs");
    const outDir = join(directory, "public/mermaid");
    const mdPath = join(rootDir, "ja/test.md");
    mkdirSync(join(rootDir, "ja"), { recursive: true });
    mkdirSync(outDir, { recursive: true });
    writeFileSync(mdPath, "```mermaid\ngraph TD;\n  A-->B;\n```\n", "utf8");

    vi.resetModules();

    let mockedConfigContent = '{"layout":"dagre"}';
    let mockedVersion = "12.0.0";
    const originalFs = await import("node:fs");

    vi.doMock("node:fs", () => {
      return {
        ...originalFs,
        readFileSync: (pathStr: string, options: any) => {
          if (pathStr.includes("mermaid-config.json")) {
            return mockedConfigContent;
          }
          if (pathStr.includes("package.json") && pathStr.includes("@mermaid-js")) {
            return JSON.stringify({ version: mockedVersion });
          }
          return originalFs.readFileSync(pathStr, options);
        },
      };
    });

    const originalCp = await import("node:child_process");
    vi.doMock("node:child_process", () => {
      return {
        ...originalCp,
        execFileSync: (cmd: string, args: string[], opts: any) => {
          const outArgIndex = args.indexOf("-o");
          if (outArgIndex >= 0 && outArgIndex + 1 < args.length) {
            const outPath = args[outArgIndex + 1];
            originalFs.writeFileSync(
              outPath,
              `<svg viewBox="0 0 100 100"><text>${mockedVersion}-${mockedConfigContent}</text></svg>`,
              "utf8",
            );
          }
        },
      };
    });

    try {
      const { generateMermaidSvgsForFile } =
        await import("../../../packages/docs-site/src/gen-mermaid-svg.js");
      generateMermaidSvgsForFile(mdPath, { rootDir, outDir });
      const manifest1 = JSON.parse(originalFs.readFileSync(join(outDir, ".manifest.json"), "utf8"));
      const hash1 = manifest1.files["ja/test.md"].hashes[0];

      generateMermaidSvgsForFile(mdPath, { rootDir, outDir });
      const manifest2 = JSON.parse(originalFs.readFileSync(join(outDir, ".manifest.json"), "utf8"));
      expect(manifest2.files["ja/test.md"].hashes[0]).toBe(hash1);

      mockedConfigContent = '{"layout":"elk"}';
      vi.resetModules();
      const mod2 = await import("../../../packages/docs-site/src/gen-mermaid-svg.js");
      mod2.generateMermaidSvgsForFile(mdPath, { rootDir, outDir });
      const manifest3 = JSON.parse(originalFs.readFileSync(join(outDir, ".manifest.json"), "utf8"));
      const hash3 = manifest3.files["ja/test.md"].hashes[0];
      expect(hash3).not.toBe(hash1);

      mockedVersion = "13.0.0";
      vi.resetModules();
      const mod3 = await import("../../../packages/docs-site/src/gen-mermaid-svg.js");
      mod3.generateMermaidSvgsForFile(mdPath, { rootDir, outDir });
      const manifest4 = JSON.parse(originalFs.readFileSync(join(outDir, ".manifest.json"), "utf8"));
      const hash4 = manifest4.files["ja/test.md"].hashes[0];
      expect(hash4).not.toBe(hash3);
      expect(hash4).not.toBe(hash1);
    } finally {
      vi.doUnmock("node:fs");
      vi.doUnmock("node:child_process");
      rmSync(directory, { recursive: true, force: true });
    }
  });
});

import {
  generateMermaidSvgsForFile,
  shouldGenerateMermaidForFile,
} from "../../../packages/docs-site/src/gen-mermaid-svg.js";

describe("Mermaid SVG generation basics", () => {
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
