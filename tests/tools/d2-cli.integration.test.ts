import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { d2SvgId, generateD2Svgs } from "../../packages/docs-site/src/gen-d2-svg.js";

// Run with the CLI installed in Dev Container / CI; unit tests cover its absence.
const available = spawnSync("d2", ["version"], { encoding: "utf8" }).status === 0;
describe.skipIf(!available)("real D2 CLI", () => {
  it("renders valid D2 and rejects invalid D2 in both generation and lint", () => {
    const root = mkdtempSync(path.join(tmpdir(), "specdojo-real-d2-"));
    const rootDir = path.join(root, "docs");
    const outDir = path.join(root, "svg");
    const file = path.join(rootDir, "diagram.md");
    mkdirSync(rootDir);
    const lint = () =>
      execFileSync(process.execPath, ["tools/lint-d2.mjs", file], { stdio: "pipe" });
    try {
      writeFileSync(file, "```d2\na -> b\n```\n");
      generateD2Svgs({ rootDir, outDir });
      expect(readFileSync(path.join(outDir, `${d2SvgId("a -> b")}.svg`), "utf8")).toContain("<svg");
      expect(lint).not.toThrow();
      writeFileSync(file, "```d2\na: {\n```\n");
      expect(() => generateD2Svgs({ rootDir, outDir })).toThrow(/diagram\.md:1/);
      expect(lint).toThrow();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
