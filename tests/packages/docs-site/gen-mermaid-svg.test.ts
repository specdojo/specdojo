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
  failingCodes: Set<string>;
  attemptedCodes: string[];
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
  const outDir = join(directory, ".vitepress/mermaid");
  const mdPath = join(rootDir, "ja/test.md");
  originalFs.mkdirSync(join(rootDir, "ja"), { recursive: true });
  originalFs.mkdirSync(outDir, { recursive: true });
  originalFs.writeFileSync(mdPath, "```mermaid\ngraph TD;\n  A-->B;\n```\n", "utf8");

  let configContent = JSON.stringify({ layout: "dagre" });
  let version = "12.0.0";
  const renderedSvgs: string[] = [];
  const failingCodes = new Set<string>();
  const attemptedCodes: string[] = [];

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
      const inputPath: unknown = args[args.indexOf("-i") + 1];
      if (typeof inputPath !== "string") throw new Error("missing Mermaid input");
      const code = originalFs.readFileSync(inputPath, "utf8");
      attemptedCodes.push(code);
      if (failingCodes.has(code)) {
        // 失敗時に mermaid-cli が SVG を途中まで書いた場合も再利用しない。
        originalFs.writeFileSync(outPath, "<svg>partial output");
        throw Object.assign(new Error("mermaid-cli exited with status 1"), {
          stderr: Buffer.from(`Error: Parse error: ${code}\n    at parser (mermaid.js:1:1)`),
        });
      }
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
    failingCodes,
    attemptedCodes,
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
    vi.useRealTimers();
    vi.restoreAllMocks();
    fixture?.cleanup();
    fixture = undefined;
  });

  it("dev の全走査は失敗した図を警告し、同じ文書と別の文書の正常な図を生成する", async () => {
    fixture = await setupMermaidCacheFixture();
    const { rootDir, outDir, mdPath, failingCodes } = fixture;
    failingCodes.add("bad diagram");
    writeFileSync(mdPath, "```mermaid\nbad diagram\n```\n```mermaid\ngraph TD; C-->D;\n```\n");
    writeFileSync(join(rootDir, "ja/z-good.md"), "```mermaid\ngraph TD; E-->F;\n```\n");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const mod = await fixture.loadModule();

    expect(() => mod.generateMermaidSvgs({ rootDir, outDir, errorMode: "warn" })).not.toThrow();
    expect(fixture.renderedSvgs).toHaveLength(2);
    expect(warn).toHaveBeenCalledWith(
      expect.stringMatching(/ja[/\\]test\.md.*diagram 1.*Parse error: bad diagram/),
    );
    expect(fixture.readManifest().files["ja/test.md"].hashes).toEqual([
      mod.mermaidSvgId("graph TD; C-->D;"),
    ]);
    expect(fixture.readManifest().files["ja/test.md"]).toHaveProperty("hasErrors", true);
    expect(existsSync(join(outDir, `${mod.mermaidSvgId("bad diagram")}.svg`))).toBe(false);
    expect(existsSync(join(outDir, `.tmp-${mod.mermaidSvgId("bad diagram")}.mmd`))).toBe(false);

    // 正常な図の cache は保持し、一部失敗した文書は mtime/size が同じでも再試行する。
    mod.generateMermaidSvgs({ rootDir, outDir, errorMode: "warn" });
    expect(fixture.attemptedCodes.filter((code) => code === "bad diagram")).toHaveLength(2);
    expect(fixture.renderedSvgs).toHaveLength(2);
  });

  it("build は全ファイル・全ブロックを処理し、複数の失敗をまとめて通知する", async () => {
    fixture = await setupMermaidCacheFixture();
    const { rootDir, outDir, mdPath, failingCodes } = fixture;
    failingCodes.add("bad one").add("bad two").add("bad three");
    writeFileSync(
      mdPath,
      "```mermaid\nbad one\n```\n```mermaid\nbad two\n```\n```mermaid\ngraph TD; C-->D;\n```\n",
    );
    writeFileSync(join(rootDir, "ja/z-bad.md"), "```mermaid\nbad three\n```\n");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const mod = await fixture.loadModule();
    let failure: unknown;
    try {
      mod.generateMermaidSvgs({ rootDir, outDir });
    } catch (error) {
      failure = error;
    }
    expect(failure).toBeInstanceOf(AggregateError);
    const aggregate = failure as AggregateError;
    expect(aggregate.errors).toHaveLength(3);
    expect(aggregate.message).toContain("3 diagram(s) failed");
    for (const code of failingCodes) {
      expect(aggregate.message).toContain(`Parse error: ${code}`);
      expect(existsSync(join(outDir, `${mod.mermaidSvgId(code)}.svg`))).toBe(false);
    }
    expect(aggregate.message).toMatch(/ja[/\\]test\.md/);
    expect(aggregate.message).toMatch(/ja[/\\]z-bad\.md/);
    expect(fixture.attemptedCodes).toHaveLength(4);
    expect(fixture.readManifest().files["ja/test.md"].hashes).toEqual([
      mod.mermaidSvgId("graph TD; C-->D;"),
    ]);
    expect(fixture.readManifest().files["ja/z-bad.md"]).toBeUndefined();
  });

  it("dev の単一ファイル再生成で古い cache を除去し、修正後の図を生成する", async () => {
    fixture = await setupMermaidCacheFixture();
    const { rootDir, outDir, mdPath, failingCodes } = fixture;
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const mod = await fixture.loadModule();
    mod.generateMermaidSvgs({ rootDir, outDir });
    const oldHash = fixture.readManifest().files["ja/test.md"].hashes[0];
    failingCodes.add("broken");
    writeFileSync(mdPath, "```mermaid\nbroken\n```\n");

    expect(() =>
      mod.generateMermaidSvgsForFile(mdPath, { rootDir, outDir, errorMode: "warn" }),
    ).not.toThrow();
    expect(fixture.readManifest().files["ja/test.md"]).toBeUndefined();
    expect(existsSync(join(outDir, `${oldHash}.svg`))).toBe(false);
    expect(existsSync(join(outDir, `${mod.mermaidSvgId("broken")}.svg`))).toBe(false);

    writeFileSync(mdPath, "```mermaid\ngraph TD; Fixed-->OK;\n```\n");
    mod.generateMermaidSvgsForFile(mdPath, { rootDir, outDir, errorMode: "warn" });
    const fixedHash = mod.mermaidSvgId("graph TD; Fixed-->OK;");
    expect(fixture.readManifest().files["ja/test.md"].hashes).toEqual([fixedHash]);
    expect(existsSync(join(outDir, `${fixedHash}.svg`))).toBe(true);
  });

  it("Vite の serve は起動時・watcher・HMR で継続し、build は集約エラーを伝播する", async () => {
    fixture = await setupMermaidCacheFixture();
    const { rootDir, outDir, mdPath, failingCodes } = fixture;
    failingCodes.add("broken");
    writeFileSync(mdPath, "```mermaid\nbroken\n```\n");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await fixture.loadModule();
    const { mermaidSvgAutoGenerate } =
      await import("../../../packages/docs-site/.vitepress/mermaid-auto-generate.js");
    const plugin = mermaidSvgAutoGenerate({
      rootDir,
      outDir,
      contentRoot: rootDir,
      syncFile: vi.fn(),
    });
    const { configResolved, buildStart, configureServer, handleHotUpdate } = plugin;
    if (
      typeof configResolved !== "function" ||
      typeof buildStart !== "function" ||
      typeof configureServer !== "function" ||
      typeof handleHotUpdate !== "function"
    ) {
      throw new Error("Mermaid hooks are missing");
    }
    const context = {} as ThisParameterType<typeof buildStart>;
    await configResolved({ command: "serve", build: {} } as Parameters<typeof configResolved>[0]);
    expect(() => buildStart.call(context, {} as Parameters<typeof buildStart>[0])).not.toThrow();

    vi.useFakeTimers();
    const listeners: Record<string, ((file: string) => void)[]> = {};
    const server = {
      watcher: {
        add: vi.fn(),
        on: (event: string, listener: (file: string) => void) => {
          (listeners[event] ??= []).push(listener);
        },
      },
      ws: { send: vi.fn() },
    };
    await configureServer(server as unknown as Parameters<typeof configureServer>[0]);
    expect(() => vi.runAllTimers()).not.toThrow();
    for (const listener of listeners.add) listener(mdPath);
    expect(() => vi.runAllTimers()).not.toThrow();
    expect(() =>
      handleHotUpdate({ file: mdPath, server } as unknown as Parameters<typeof handleHotUpdate>[0]),
    ).not.toThrow();
    expect(warn).toHaveBeenCalledTimes(4);
    expect(server.ws.send).toHaveBeenCalledWith({ type: "full-reload" });
    writeFileSync(mdPath, "```mermaid\ngraph TD; Fixed-->OK;\n```\n");
    await handleHotUpdate({ file: mdPath, server } as unknown as Parameters<
      typeof handleHotUpdate
    >[0]);
    expect(fixture.readManifest().files["ja/test.md"].hashes).toHaveLength(1);

    writeFileSync(mdPath, "```mermaid\nbroken\n```\n");
    await configResolved({ command: "build", build: {} } as Parameters<typeof configResolved>[0]);
    expect(() => buildStart.call(context, {} as Parameters<typeof buildStart>[0])).toThrow(
      AggregateError,
    );
    // SSR の二重生成は既存どおり避ける。
    await configResolved({ command: "build", build: { ssr: true } } as Parameters<
      typeof configResolved
    >[0]);
    expect(() => buildStart.call(context, {} as Parameters<typeof buildStart>[0])).not.toThrow();
  });

  it("既定の出力先を workspace の .vitepress/mermaid にし public を変更しない", async () => {
    fixture = await setupMermaidCacheFixture();
    const workspace = join(fixture.rootDir, "..");
    const oldRoot = process.env.SPECDOJO_DOCS_ROOT;
    process.env.SPECDOJO_DOCS_ROOT = workspace;
    try {
      mkdirSync(join(workspace, "public"));
      writeFileSync(join(workspace, "public/user.svg"), "user asset");
      const mod = await fixture.loadModule();
      mod.generateMermaidSvgs();
      const output = join(workspace, ".vitepress/mermaid");
      const manifest = JSON.parse(
        readFileSync(join(output, ".manifest.json"), "utf8"),
      ) as ManifestFile;
      const hash = manifest.files["ja/test.md"].hashes[0];
      expect(existsSync(join(output, `${hash}.svg`))).toBe(true);
      expect(readFileSync(join(workspace, "public/user.svg"), "utf8")).toBe("user asset");
      expect(existsSync(join(workspace, "public/mermaid"))).toBe(false);
      expect(fixture.renderedSvgs).toEqual([join(output, `${hash}.svg`)]);
    } finally {
      if (oldRoot === undefined) delete process.env.SPECDOJO_DOCS_ROOT;
      else process.env.SPECDOJO_DOCS_ROOT = oldRoot;
    }
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
    const outDir = join(directory, ".vitepress/mermaid");
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

    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      expect(() => generateMermaidSvgsForFile(mdPath, { rootDir, outDir })).not.toThrow();
      expect(warn).toHaveBeenCalledWith(
        "[mermaid] skipping missing or generated Markdown: ja/removed.md",
      );

      expect(JSON.parse(readFileSync(join(outDir, ".manifest.json"), "utf8"))).toEqual({
        version: 1,
        files: {},
      });
      expect(() => readFileSync(join(outDir, `${hash}.svg`), "utf8")).toThrow();
    } finally {
      warn.mockRestore();
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("ignores generated Markdown and removes any stale manifest entry", () => {
    const directory = mkdtempSync(join(tmpdir(), "specdojo-mermaid-generated-"));
    const rootDir = join(directory, "docs");
    const outDir = join(directory, ".vitepress/mermaid");
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
