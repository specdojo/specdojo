import { execFileSync } from "node:child_process";
import type * as ChildProcess from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  assertD2Version,
  d2SvgId,
  extractD2Blocks,
  renderD2,
} from "../../../packages/docs-site/src/d2.mjs";
import { generateD2Svgs } from "../../../packages/docs-site/src/gen-d2-svg.js";
import { d2SvgAutoGenerate } from "../../../packages/docs-site/.vitepress/d2-auto-generate.js";

vi.mock("node:child_process", async (importOriginal) => ({
  ...(await importOriginal<typeof ChildProcess>()),
  execFileSync: vi.fn(),
}));

const cli = vi.mocked(execFileSync);
let root: string;
let rootDir: string;
let outDir: string;
const valid = "a -> b";
const invalid = "a: {";

beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), "specdojo-d2-"));
  rootDir = path.join(root, "docs");
  outDir = path.join(root, "svg");
  mkdirSync(rootDir);
  cli.mockReset();
  cli.mockImplementation((_file, args, options) => {
    if (args?.[0] === "version") return "v0.9.0\n";
    if ((options as { input?: string })?.input === invalid) {
      throw Object.assign(new Error("exit 1"), { stderr: "-:1:4: unclosed map" });
    }
    return args?.[0] === "validate" ? "" : '<svg viewBox="0 0 100 80"></svg>';
  });
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

function document(code: string, file = "diagram.md"): string {
  const target = path.join(rootDir, file);
  writeFileSync(target, `# Diagram\n\n\`\`\`d2\n${code}\n\`\`\`\n`);
  return target;
}

describe("D2 Markdown and CLI", () => {
  it.each(["\n", "\r\n"])(
    "extracts nested, tilde and long fences with source lines (%j)",
    (eol) => {
      const source = [
        "---",
        "title: test",
        "---",
        "",
        "> ~~~d2 title",
        "> a -> b",
        "> ~~~",
        "",
        "- list",
        "",
        "  ````d2",
        "  c -> d",
        "  ````",
        "",
        "<!--",
        "```d2",
        "ignored",
        "```",
        "-->",
      ].join(eol);
      expect(extractD2Blocks(source, "source.md")).toEqual([
        { file: "source.md", line: 5, code: valid },
        { file: "source.md", line: 11, code: "c -> d" },
      ]);
      expect(extractD2Blocks("````markdown\n```d2\na -> b\n```\n````")).toEqual([]);
    },
  );

  it("uses ELK and matching cache IDs for trimmed sources", () => {
    expect(d2SvgId(valid)).toBe(d2SvgId(` ${valid}\n`));
    renderD2(valid);
    expect(cli).toHaveBeenCalledWith(
      "d2",
      expect.arrayContaining(["--layout", "elk", "-", "-"]),
      expect.objectContaining({ input: valid, timeout: 120_000 }),
    );
  });

  it("rejects a missing CLI, incompatible version and non-SVG output", () => {
    cli.mockImplementationOnce(() => {
      throw Object.assign(new Error("missing"), { code: "ENOENT" });
    });
    expect(assertD2Version).toThrow(/D2 CLI not found.*0\.9\.0.*PATH/);
    cli.mockReturnValueOnce("0.8.0");
    expect(assertD2Version).toThrow(/version mismatch/);
    cli.mockReturnValueOnce("not svg");
    expect(() => renderD2(valid)).toThrow(/did not produce SVG/);
  });
});

describe("D2 SVG generation", () => {
  it("writes valid SVG, reuses it and prunes only obsolete generated SVGs", () => {
    const file = document(valid);
    generateD2Svgs({ rootDir, outDir });
    expect(readFileSync(path.join(outDir, `${d2SvgId(valid)}.svg`), "utf8")).toContain("<svg");
    cli.mockClear();
    generateD2Svgs({ rootDir, outDir });
    expect(cli).toHaveBeenCalledTimes(1); // version is still checked with a warm cache
    writeFileSync(path.join(outDir, "user.svg"), "preserve");
    rmSync(file);
    generateD2Svgs({ rootDir, outDir });
    expect(readdirSync(outDir)).toEqual(["user.svg"]);
  });

  it("reports invalid diagrams with document and fence line, retries after correction", () => {
    const bad = document(invalid);
    document(valid, "valid.md");
    expect(() => generateD2Svgs({ rootDir, outDir })).toThrow(/diagram\.md:3 \[d2\].*unclosed map/);
    expect(readdirSync(outDir)).toEqual([`${d2SvgId(valid)}.svg`]);
    writeFileSync(bad, "```d2\nc -> d\n```\n");
    generateD2Svgs({ rootDir, outDir });
    expect(readdirSync(outDir)).toHaveLength(2);
  });

  it("fails on a missing CLI even when SVGs are already cached", () => {
    document(valid);
    generateD2Svgs({ rootDir, outDir });
    cli.mockImplementation(() => {
      throw Object.assign(new Error("missing"), { code: "ENOENT" });
    });
    expect(() => generateD2Svgs({ rootDir, outDir })).toThrow(/D2 CLI not found/);
  });

  it("ignores generated Markdown and builds the site staging tree", async () => {
    mkdirSync(path.join(rootDir, "generated"));
    document(invalid, "generated/invalid.md");
    generateD2Svgs({ rootDir, outDir });
    expect(cli).not.toHaveBeenCalled();
    document(valid);
    const plugin = d2SvgAutoGenerate({ rootDir, outDir, contentRoot: rootDir, syncFile: vi.fn() });
    const build = plugin.buildStart;
    if (typeof build !== "function") throw new Error("build hook missing");
    await build.call({} as ThisParameterType<typeof build>, {} as Parameters<typeof build>[0]);
    expect(readdirSync(outDir)).toEqual([`${d2SvgId(valid)}.svg`]);
    document(invalid);
    expect(() =>
      build.call({} as ThisParameterType<typeof build>, {} as Parameters<typeof build>[0]),
    ).toThrow();
  });
});

describe("D2 lint command", () => {
  async function lint() {
    return (await import(pathToFileURL(path.resolve("tools/lint-d2.mjs")).href)) as {
      lintD2: (
        patterns: string[],
        options: { cwd: string; stdout: (text: string) => void; stderr: (text: string) => void },
      ) => number;
    };
  }

  it("checks valid and invalid D2 via validate and returns a failing exit status", async () => {
    document(valid);
    document(invalid, "bad.md");
    const stdout = vi.fn();
    const stderr = vi.fn();
    const { lintD2 } = await lint();
    expect(lintD2(["*.md"], { cwd: rootDir, stdout, stderr })).toBe(1);
    expect(cli).toHaveBeenCalledWith(
      "d2",
      ["validate", "-"],
      expect.objectContaining({ input: valid }),
    );
    expect(stderr.mock.calls.flat().join("")).toContain("bad.md:3 [d2] 構文エラー");
    expect(stdout.mock.calls.flat().join("")).toContain("1 passed, 1 error");
    rmSync(path.join(rootDir, "bad.md"));
    expect(lintD2(["*.md"], { cwd: rootDir, stdout, stderr })).toBe(0);
  });

  it("fails for unmatched paths and reports an unavailable CLI as unchecked", async () => {
    const { lintD2 } = await lint();
    const stdout = vi.fn();
    const stderr = vi.fn();
    expect(lintD2(["missing.md"], { cwd: rootDir, stdout, stderr })).toBe(1);
    document(valid);
    cli.mockImplementation(() => {
      throw Object.assign(new Error("missing"), { code: "ENOENT" });
    });
    expect(lintD2(["*.md"], { cwd: rootDir, stdout, stderr })).toBe(1);
    expect(stderr.mock.calls.flat().join("")).toContain("未検査: D2 CLI not found");
  });
});
