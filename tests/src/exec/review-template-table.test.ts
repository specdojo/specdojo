import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { reviewDoneCriteriaRows } from "../../../src/exec/plans-core.js";

const require = createRequire(import.meta.url);

describe("review template tables", () => {
  it("keeps MD060 enabled and passes both raw templates and expanded criteria tables", () => {
    const temporary = mkdtempSync(join(tmpdir(), "specdojo-review-tables-"));
    try {
      const config = join(temporary, "markdownlint.json");
      writeFileSync(config, JSON.stringify({ default: false, MD060: true }));
      const directory = "docs/ja/specdojo/exec-templates";
      const paths = readdirSync(directory).filter(
        (name) => name.startsWith("xrp-") && name.endsWith("template.md"),
      );
      const rows = reviewDoneCriteriaRows([
        {
          text: "日本語の長さを含む完了条件を確認する。",
          roles: ["QE", "PO"],
          viewpoint: "vp-content",
        },
      ]);
      for (const path of paths) {
        const template = readFileSync(join(directory, path), "utf8");
        if (!template.includes("_DONE_CRITERIA_ROWS_")) continue;
        expect(template).not.toMatch(/markdownlint-disable[^\n]*MD060/);
        for (const input of [template, template.replace("_DONE_CRITERIA_ROWS_", rows)]) {
          const result = spawnSync(
            process.execPath,
            [require.resolve("markdownlint-cli/markdownlint.js"), "--config", config, "--stdin"],
            { input, encoding: "utf8" },
          );
          expect(result.stderr, path).toBe("");
          expect(result.status, path).toBe(0);
        }
      }
    } finally {
      rmSync(temporary, { recursive: true, force: true });
    }
  });
});
