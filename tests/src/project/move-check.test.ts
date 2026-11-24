import { describe, expect, it } from "vitest";
import {
  collectPrefixedReferences,
  execBranchPrefix,
  formatMoveCheckReport,
  moveCheckHasBlockers,
  type MoveCheckReport,
} from "../../../src/project/move-check.js";

describe("collectPrefixedReferences", () => {
  it("collects wikilinks and frontmatter values but not prose outside frontmatter", () => {
    const content = [
      "---",
      "specdojo:",
      "  rulebook: specdojo:pjr-rulebook",
      "  derived_from:",
      "    - prj-0001:PJR-16S0",
      "---",
      "",
      "See [[prj-0001:pjr-zdvq-sample|title]] and [[prj-0003:other]].",
      "Run npm run specdojo:build and prj-0001:PJR-AAAA in prose.",
    ].join("\n");

    const actual = collectPrefixedReferences(content, false, ["prj-0001", "specdojo"]);

    expect(actual.sort()).toEqual([
      "prj-0001:PJR-16S0",
      "prj-0001:pjr-zdvq-sample",
      "specdojo:pjr-rulebook",
    ]);
  });

  it("scans every line of a YAML file", () => {
    const actual = collectPrefixedReferences("depends_on:\n  - prj-0002:dct-x\n", true, [
      "prj-0002",
    ]);

    expect(actual).toEqual(["prj-0002:dct-x"]);
  });
});

describe("execBranchPrefix", () => {
  it("expands the project before the task id placeholder", () => {
    expect(execBranchPrefix("exec/{project}-{id}", "prj-0002")).toBe("exec/prj-0002-");
  });

  it("returns undefined when the template cannot tell projects apart", () => {
    expect(execBranchPrefix("feature/{id}-{topic}", "prj-0002")).toBeUndefined();
  });
});

describe("formatMoveCheckReport", () => {
  it("prints each check with its status, details, and a summary", () => {
    const report: MoveCheckReport = {
      projectId: "prj-0002",
      rootDir: "/repo",
      items: [
        { id: "register-items", status: "needs-cleanup", summary: "1 item", details: ["PJR-0ABC"] },
        { id: "routines", status: "ok", summary: "none", details: [] },
      ],
    };

    expect(formatMoveCheckReport(report)).toBe(
      [
        "Move check for prj-0002 (read-only; nothing was changed)",
        "",
        "[needs-cleanup] register-items: 1 item",
        "  - PJR-0ABC",
        "[ok] routines: none",
        "",
        "Summary: ok 1, needs-cleanup 1, check-manually 0",
        "",
      ].join("\n"),
    );
    expect(moveCheckHasBlockers(report)).toBe(true);
  });
});
