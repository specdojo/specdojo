import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { globFilesSync } from "../../../packages/docs-lint/src/glob-files.js";
import { describe, expect, it } from "vitest";
import {
  EXEC_RECORD_SRC_EXCLUDE,
  isExecPlanLink,
  isExecRecordPath,
  isExecResultLink,
} from "../../../packages/docs-site/.vitepress/exec-record-paths.js";

const execution = "docs/ja/projects/prj-0001/execution";
const records = [
  { path: "exec/plans/old-plan.md", kind: "plan" },
  { path: "exec/results/old-result.md", kind: "result" },
  ...["register", "schedule", "job"].flatMap((origin) =>
    ["plan", "result"].map((kind) => ({ path: `runs/${origin}/ITEM/run-id/${kind}.md`, kind })),
  ),
];
const pages = [
  "generated/exec-records.md",
  "generated/dashboard.md",
  "runs/register/ITEM/run-id/notes.md",
  "runs/register/ITEM/plan.md",
  "runs/register/ITEM/run-id/nested/result.md",
  "jobs/runs/register/ITEM/run-id/result.md",
];

describe("exec record paths", () => {
  it.each(records)("classifies legacy and run records: $path", ({ path, kind }) => {
    for (const extension of [".md", ".html", ""]) {
      const link = `/${execution}/${path.replace(/\.md$/, extension)}#details`;
      expect(isExecPlanLink(link)).toBe(kind === "plan");
      expect(isExecResultLink(link)).toBe(kind === "result");
      expect(isExecRecordPath(link)).toBe(true);
      expect(isExecRecordPath(link.replace(/\//g, "\\"))).toBe(true);
    }
  });

  it.each(pages)("keeps non-record pages in navigation and search: %s", (path) => {
    expect(isExecRecordPath(`${execution}/${path}`)).toBe(false);
  });

  it("keeps legacy events out of navigation and search", () => {
    expect(isExecRecordPath(`${execution}/exec/events/event.md`)).toBe(true);
    expect(isExecRecordPath(undefined)).toBe(false);
  });

  it("excludes legacy and run pages from the VitePress scan while keeping entry pages", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-exec-record-paths-"));
    try {
      for (const path of [...records.map((record) => record.path), ...pages]) {
        const filePath = join(root, execution, path);
        mkdirSync(dirname(filePath), { recursive: true });
        writeFileSync(filePath, "# Page\n");
      }
      expect(
        globFilesSync("docs/**/*.md", { cwd: root, ignore: EXEC_RECORD_SRC_EXCLUDE }).sort(),
      ).toEqual(pages.map((path) => `${execution}/${path}`).sort());
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
