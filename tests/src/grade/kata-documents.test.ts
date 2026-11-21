import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resolveKataDocuments } from "../../../src/grade/targets.js";

let root: string;

function write(rel: string, content: string): void {
  const path = join(root, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function rulebook(name: string, sampleLines: string[]): void {
  const lines = ["---", "specdojo:", `  id: specdojo:${name}-rulebook`, ...sampleLines, "---"];
  write(`docs/ja/specdojo/rulebooks/${name}-rulebook.md`, `${lines.join("\n")}\n\n# T\n`);
}

function sample(id: string): void {
  write(`docs/ja/specdojo/samples/${id}.md`, `---\nspecdojo:\n  id: specdojo:${id}\n---\n\n# S\n`);
}

describe("resolveKataDocuments", () => {
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "specdojo-kata-docs-"));
  });
  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("selects every sample listed in an array declaration", () => {
    const ids = ["opd-index-sample", "opd-a-sample", "opd-b-sample", "opd-c-sample"];
    rulebook("opd", ["  sample:", ...ids.map((id) => `    - specdojo:${id}`)]);
    for (const id of ids) sample(id);

    const actual = resolveKataDocuments("opd", root);

    expect(actual).toEqual([
      "docs/ja/specdojo/rulebooks/opd-rulebook.md",
      ...ids.map((id) => `docs/ja/specdojo/samples/${id}.md`),
    ]);
  });

  it("selects the sample of a string declaration", () => {
    rulebook("abc", ["  sample: specdojo:abc-main-sample"]);
    sample("abc-main-sample");

    expect(resolveKataDocuments("abc", root)).toEqual([
      "docs/ja/specdojo/rulebooks/abc-rulebook.md",
      "docs/ja/specdojo/samples/abc-main-sample.md",
    ]);
  });

  it("selects only the rulebook when sample is not-needed", () => {
    rulebook("abc", ["  sample: not-needed"]);
    sample("abc-sample");

    expect(resolveKataDocuments("abc", root)).toEqual([
      "docs/ja/specdojo/rulebooks/abc-rulebook.md",
    ]);
  });

  it("falls back to the file name lookup when sample is not declared", () => {
    rulebook("abc", []);
    sample("abc-sample");

    expect(resolveKataDocuments("abc", root)).toEqual([
      "docs/ja/specdojo/rulebooks/abc-rulebook.md",
      "docs/ja/specdojo/samples/abc-sample.md",
    ]);
  });

  it("fails with the declaration and sample id when a declared sample file is missing", () => {
    rulebook("opr", [
      "  sample:",
      "    - specdojo:opr-sample",
      "    - specdojo:opr-missing-sample",
    ]);
    sample("opr-sample");

    expect(() => resolveKataDocuments("opr", root)).toThrow(
      /opr-missing-sample.*declared in sample of docs\/ja\/specdojo\/rulebooks\/opr-rulebook\.md/,
    );
  });
});
