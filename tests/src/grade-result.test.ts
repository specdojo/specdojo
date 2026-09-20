import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import {
  gradeContentHash,
  gradeResultPath,
  parseGradeResult,
  validateGradeResult,
  writeGradeResult,
  type GradeResult,
} from "../../src/grade-result.js";

const markdown = `---
specdojo:
  id: prj-0001:example
  type: project
  status: draft
---

# Example
`;

function result(): GradeResult {
  return {
    version: 1,
    document: "prj-0001:example",
    path: "docs/example.md",
    target: "deliverable",
    rubric: "grade-rubric-v1",
    verdict: "pass",
    score: 100,
    graded_at: "2026-09-20T00:00:00.000Z",
    graded_by: "codex-executor",
    content_hash: gradeContentHash(markdown),
    categories: { quality: { score: 100 } },
    viewpoints: { "vp-qe-verifiability": { level: 4, score: 100 } },
    finding_counts: { blocker: 0, major: 0, minor: 0, note: 0 },
    findings: [],
  };
}

describe("grade result sidecar", () => {
  it("writes one schema-tagged YAML file per document id", () => {
    const directory = mkdtempSync(join(tmpdir(), "specdojo-grade-result-"));
    try {
      const path = gradeResultPath(directory, "prj-0001:example");
      expect(writeGradeResult(path, result())).toBe(true);
      expect(writeGradeResult(path, result())).toBe(false);
      const content = readFileSync(path, "utf8");
      expect(content).toContain("grade-result.schema.yaml");
      expect(parseGradeResult(content, path)).toEqual(result());
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });

  it("detects document changes and finding count drift", () => {
    const stored = result();
    stored.finding_counts.minor = 1;
    expect(
      validateGradeResult(stored, `${markdown}\nchanged`, "docs/example.md", "deliverable"),
    ).toEqual(
      expect.arrayContaining([
        "docs/example.md: content changed after the last grade",
        "docs/example.md: finding_counts.minor=1, findings=0",
      ]),
    );
  });
});
