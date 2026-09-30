import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type * as ChildProcessModule from "node:child_process";
import type * as FsModule from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import type * as GenMermaidSvgModule from "../../../packages/docs-site/src/gen-mermaid-svg.js";
import {
  generateMermaidSvgsForFile,
  shouldGenerateMermaidForFile,
} from "../../../packages/docs-site/src/gen-mermaid-svg.js";

type GenMermaidModule = typeof GenMermaidSvgModule;

interface ManifestFile {
  version: number;
  files: Record<
    string,
    {
      mtimeMs: number;
      size: number;
      hashes: string[];
      mermaidCliVersion?: string;
      mermaidConfigHash?: string;
    }
  >;
}

interface MermaidCacheFixture {
  rootDir: string;
  outDir: string;
  mdPath: string;
  renderedSvgs: string[];
  setConfig: (content: string) => void;
  setVersion: (version: string) => void;
  loadModule: () => Promise<GenMermaidModule>;
  readManifest: () => ManifestFile;
  cleanup: () => void;
}

// mermaid-cli の版と mermaid-config.json はモジュール読込時に読まれるため、
// node:fs と node:child_process を差し替えたうえでモジュールを読み直して検証する。
async function setupMermaidCacheFixture(): Promise<MermaidCacheFixture> {
  const originalFs = await vi.importActual<typeof FsModule>("node:fs");
  const originalCp = await vi.importActual<typeof ChildProcessModule>("node:child_process");
  const directory = originalFs.mkdtempSync(join(tmpdir(), "specdojo-mermaid-cache-"));
  const rootDir = join(directory, "docs");
  const outDir = join(directory, "public/mermaid");
  const mdPath = join(rootDir, "ja/test.md");
  originalFs.mkdirSync(join(rootDir, "ja"), { recursive: true });
  originalFs.mkdirSync(outDir, { recursive: true });
  originalFs.writeFileSync(mdPath, "```mermaid\ngraph TD;\n  A-->B;\n```\n", "utf8");

  let configContent = JSON.stringify({ layout: "dagre" });
  let version = "12.0.0";
  const renderedSvgs: string[] = [];

  vi.doMock("node:fs", () => ({
    ...originalFs,
    readFileSync: (
      file: Parameters<typeof originalFs.readFileSync>[0],
      options?: Parameters<typeof originalFs.readFileSync>[1],
    ) => {
      if (typeof file === "string" && file.endsWith("mermaid-config.json")) {
        return configContent;
      }
      if (
        typeof file === "string" &&
        file.endsWith("package.json") &&
        file.includes("@mermaid-js")
      ) {
        return JSON.stringify({ version });
      }
      return originalFs.readFileSync(file, options);
    },
  }));
  vi.doMock("node:child_process", () => ({
    ...originalCp,
    execFileSync: (...callArgs: unknown[]) => {
      const args = callArgs[1];
      if (!Array.isArray(args)) return Buffer.alloc(0);
      const outPath: unknown = args[args.indexOf("-o") + 1];
      if (typeof outPath !== "string") return Buffer.alloc(0);
      originalFs.writeFileSync(
        outPath,
        `<svg viewBox="0 0 100 100"><text>${version}-${configContent}</text></svg>`,
        "utf8",
      );
      renderedSvgs.push(outPath);
      return Buffer.alloc(0);
    },
  }));

  return {
    rootDir,
    outDir,
    mdPath,
    renderedSvgs,
    setConfig: (content) => {
      configContent = content;
    },
    setVersion: (next) => {
      version = next;
    },
    loadModule: async () => {
      vi.resetModules();
      return import("../../../packages/docs-site/src/gen-mermaid-svg.js");
    },
    readManifest: () =>
      JSON.parse(originalFs.readFileSync(join(outDir, ".manifest.json"), "utf8")) as ManifestFile,
    cleanup: () => {
      vi.doUnmock("node:fs");
      vi.doUnmock("node:child_process");
      vi.resetModules();
      originalFs.rmSync(directory, { recursive: true, force: true });
    },
  };
}

describe("Mermaid SVG generation cache", () => {
  let fixture: MermaidCacheFixture | undefined;

  afterEach(() => {
    fixture?.cleanup();
    fixture = undefined;
  });

  it("redraws SVG when mermaid-cli version or config changes, reuses otherwise", async () => {
    fixture = await setupMermaidCacheFixture();
    const { rootDir, outDir, mdPath } = fixture;

    const mod1 = await fixture.loadModule();
    mod1.generateMermaidSvgsForFile(mdPath, { rootDir, outDir });
    const hash1 = fixture.readManifest().files["ja/test.md"].hashes[0];

    mod1.generateMermaidSvgsForFile(mdPath, { rootDir, outDir });
    expect(fixture.readManifest().files["ja/test.md"].hashes[0]).toBe(hash1);
    expect(fixture.renderedSvgs).toHaveLength(1);

    fixture.setConfig(JSON.stringify({ layout: "elk" }));
    const mod2 = await fixture.loadModule();
    mod2.generateMermaidSvgsForFile(mdPath, { rootDir, outDir });
    const hash3 = fixture.readManifest().files["ja/test.md"].hashes[0];
    expect(hash3).not.toBe(hash1);

    fixture.setVersion("13.0.0");
    const mod3 = await fixture.loadModule();
    mod3.generateMermaidSvgsForFile(mdPath, { rootDir, outDir });
    const hash4 = fixture.readManifest().files["ja/test.md"].hashes[0];
    expect(hash4).not.toBe(hash3);
    expect(hash4).not.toBe(hash1);
    expect(fixture.renderedSvgs).toHaveLength(3);
  });

  it("reuses the file-level manifest cache when version and config are unchanged", async () => {
    fixture = await setupMermaidCacheFixture();
    const { rootDir, outDir } = fixture;

    const mod1 = await fixture.loadModule();
    mod1.generateMermaidSvgs({ rootDir, outDir });
    const first = fixture.readManifest().files["ja/test.md"];
    expect(first.mermaidCliVersion).toBe("12.0.0");
    expect(first.mermaidConfigHash).toMatch(/^[0-9a-f]{32}$/);
    // VitePress の Markdown 描画が参照する SVG 名は、生成された SVG 名と一致する
    expect(first.hashes).toEqual([mod1.mermaidSvgId("graph TD;\n  A-->B;")]);
    expect(fixture.renderedSvgs).toHaveLength(1);

    const mod2 = await fixture.loadModule();
    mod2.generateMermaidSvgs({ rootDir, outDir });
    expect(fixture.readManifest().files["ja/test.md"]).toEqual(first);
    expect(fixture.renderedSvgs).toHaveLength(1);
  });

  it("redraws despite a matching manifest entry when the config changes", async () => {
    fixture = await setupMermaidCacheFixture();
    const { rootDir, outDir } = fixture;

    const mod1 = await fixture.loadModule();
    mod1.generateMermaidSvgs({ rootDir, outDir });
    const first = fixture.readManifest().files["ja/test.md"];

    fixture.setConfig(JSON.stringify({ layout: "elk" }));
    const mod2 = await fixture.loadModule();
    mod2.generateMermaidSvgs({ rootDir, outDir });
    const second = fixture.readManifest().files["ja/test.md"];

    expect(second.mtimeMs).toBe(first.mtimeMs);
    expect(second.size).toBe(first.size);
    expect(second.hashes[0]).not.toBe(first.hashes[0]);
    expect(second.mermaidConfigHash).not.toBe(first.mermaidConfigHash);
    expect(fixture.renderedSvgs).toHaveLength(2);
    expect(existsSync(join(outDir, `${first.hashes[0]}.svg`))).toBe(false);
    expect(existsSync(join(outDir, `${second.hashes[0]}.svg`))).toBe(true);
  });

  it("redraws despite a matching manifest entry when the mermaid-cli version changes", async () => {
    fixture = await setupMermaidCacheFixture();
    const { rootDir, outDir } = fixture;

    const mod1 = await fixture.loadModule();
    mod1.generateMermaidSvgs({ rootDir, outDir });
    const first = fixture.readManifest().files["ja/test.md"];

    fixture.setVersion("13.0.0");
    const mod2 = await fixture.loadModule();
    mod2.generateMermaidSvgs({ rootDir, outDir });
    const second = fixture.readManifest().files["ja/test.md"];

    expect(second.hashes[0]).not.toBe(first.hashes[0]);
    expect(second.mermaidCliVersion).toBe("13.0.0");
    expect(fixture.renderedSvgs).toHaveLength(2);
  });

  it("redraws when a previous manifest entry lacks the version and config hash", async () => {
    fixture = await setupMermaidCacheFixture();
    const { rootDir, outDir, mdPath } = fixture;
    const legacyHash = "1234abcd";
    const stat = statSync(mdPath);
    writeFileSync(join(outDir, `${legacyHash}.svg`), "<svg></svg>\n", "utf8");
    writeFileSync(
      join(outDir, ".manifest.json"),
      JSON.stringify({
        version: 1,
        files: {
          "ja/test.md": { mtimeMs: stat.mtimeMs, size: stat.size, hashes: [legacyHash] },
        },
      }),
      "utf8",
    );

    const mod = await fixture.loadModule();
    mod.generateMermaidSvgs({ rootDir, outDir });
    const entry = fixture.readManifest().files["ja/test.md"];

    expect(fixture.renderedSvgs).toHaveLength(1);
    expect(entry.hashes).not.toEqual([legacyHash]);
    expect(entry.mermaidCliVersion).toBe("12.0.0");
    expect(existsSync(join(outDir, `${legacyHash}.svg`))).toBe(false);
  });
});

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
