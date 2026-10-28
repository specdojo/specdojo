import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { lint } from "markdownlint/sync";
import { describe, expect, it } from "vitest";
import { reviewDoneCriteriaRows } from "../../../src/exec/plans-core.js";

describe("review template tables", () => {
  it("keeps MD060 enabled and passes both raw templates and expanded criteria tables", () => {
    const directory = "docs/ja/specdojo/exec-templates";
    const templates = readdirSync(directory)
      .filter((name) => name.startsWith("xrp-") && name.endsWith("template.md"))
      .map((path) => ({ path, template: readFileSync(join(directory, path), "utf8") }))
      .filter(({ template }) => template.includes("_DONE_CRITERIA_ROWS_"));
    expect(templates.length).toBeGreaterThan(0);
    const rows = reviewDoneCriteriaRows([
      {
        text: "日本語の長さを含む完了条件を確認する。",
        roles: ["QE", "PO"],
        viewpoint: "vp-content",
      },
    ]);
    for (const { path, template } of templates) {
      expect(template).not.toMatch(/markdownlint-disable[^\n]*MD060/);
      // 表の検査は同一プロセスで行い、各入力での CLI 起動による負荷を避ける。
      const result = lint({
        config: { default: false, MD060: true },
        strings: { raw: template, expanded: template.replace("_DONE_CRITERIA_ROWS_", rows) },
      });
      expect(result.raw, `${path} (raw)`).toEqual([]);
      expect(result.expanded, `${path} (expanded)`).toEqual([]);
    }
  });
});
