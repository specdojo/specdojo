import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { downgradeUnfilledResult } from "../../src/exec-run.js";
import { readResultFrontmatterSnapshot } from "../../src/exec-results.js";

const FRONTMATTER = [
  "---",
  "specdojo:",
  "  id: prj-0001:xer-test",
  "  type: exec-result",
  "  task_id: T-TEST",
  "  mode: edit",
  "  status: in_progress",
  "  project_id: prj-0001",
  "  plan_ref: exec/plans/test-plan.md",
  '  started_at: "2026-08-10T00:00:00.000Z"',
  "  agent: codex-edit-agent",
  "---",
].join("\n");

const UNFILLED_EDIT_BODY = [
  "## 1. 実施内容",
  "",
  "_TODO_: 実施した内容の要約を記入する。",
  "",
  "## 2. 変更ファイル",
  "",
  "_TODO_: 変更したファイルのパスを記入する。",
  "",
].join("\n");

const FILLED_EDIT_BODY = [
  "## 1. 実施内容",
  "",
  "比較表を更新した。",
  "",
  "## 2. 変更ファイル",
  "",
  "- docs/foo.md",
  "",
].join("\n");

let dir: string;

function writeResult(body: string): {
  resultPath: string;
  scaffoldFrontmatter: Record<string, unknown>;
} {
  dir = mkdtempSync(join(tmpdir(), "specdojo-downgrade-"));
  const resultPath = join(dir, "result.md");
  const scaffoldContent = `${FRONTMATTER}\n${body}`;
  writeFileSync(resultPath, scaffoldContent, "utf8");
  return { resultPath, scaffoldFrontmatter: readResultFrontmatterSnapshot(resultPath) };
}

describe("downgradeUnfilledResult", () => {
  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  it("downgrades a successful run to a block when the result is still unfilled", () => {
    const { resultPath, scaffoldFrontmatter } = writeResult(UNFILLED_EDIT_BODY);

    const outcome = downgradeUnfilledResult("success", resultPath, "edit", scaffoldFrontmatter);

    expect(outcome).toEqual({ result: "failure", unfilledBlock: true });
  });

  it("keeps a successful run when the result mandatory sections are filled", () => {
    const { resultPath, scaffoldFrontmatter } = writeResult(UNFILLED_EDIT_BODY);
    writeFileSync(resultPath, `${FRONTMATTER}\n${FILLED_EDIT_BODY}`, "utf8");

    const outcome = downgradeUnfilledResult("success", resultPath, "edit", scaffoldFrontmatter);

    expect(outcome).toEqual({ result: "success", unfilledBlock: false });
  });

  it("does not reconsider a rate-limit outcome even if the result is unfilled", () => {
    const { resultPath, scaffoldFrontmatter } = writeResult(UNFILLED_EDIT_BODY);

    const outcome = downgradeUnfilledResult("rate_limit", resultPath, "edit", scaffoldFrontmatter);

    expect(outcome).toEqual({ result: "rate_limit", unfilledBlock: false });
  });

  it("accepts a completed resume after runner-owned blocked lifecycle fields changed", () => {
    const { resultPath, scaffoldFrontmatter: originalScaffold } = writeResult(UNFILLED_EDIT_BODY);
    const blocked = `${FRONTMATTER}\n${UNFILLED_EDIT_BODY}`
      .replace("  status: in_progress", "  status: blocked")
      .replace(
        "  agent: codex-edit-agent",
        "  completed_at: 2026-08-10T00:05:00.000Z\n  agent: codex-edit-agent\n  block_reason: rate limit reached",
      );
    writeFileSync(resultPath, blocked, "utf8");
    const resumeScaffold = readResultFrontmatterSnapshot(resultPath);
    writeFileSync(resultPath, blocked.replace(UNFILLED_EDIT_BODY, FILLED_EDIT_BODY), "utf8");

    const outcome = downgradeUnfilledResult(
      "success",
      resultPath,
      "edit",
      resumeScaffold,
      originalScaffold,
    );

    expect(outcome).toEqual({ result: "success", unfilledBlock: false });
  });

  it("does not reconsider a failure outcome", () => {
    const { resultPath, scaffoldFrontmatter } = writeResult(UNFILLED_EDIT_BODY);

    const outcome = downgradeUnfilledResult("failure", resultPath, "edit", scaffoldFrontmatter);

    expect(outcome).toEqual({ result: "failure", unfilledBlock: false });
  });

  it("keeps a successful run when there is no result path to inspect", () => {
    const outcome = downgradeUnfilledResult("success", undefined, "edit");

    expect(outcome).toEqual({ result: "success", unfilledBlock: false });
  });

  it.each([
    ["missing field", "  task_id: T-TEST\n", ""],
    ["changed field", "  agent: codex-edit-agent", "  agent: local-edit-agent"],
    ["added field", "  agent: codex-edit-agent", "  agent: codex-edit-agent\n  summary: custom"],
  ])("downgrades success when scaffold frontmatter has a %s", (_label, from, to) => {
    const { resultPath, scaffoldFrontmatter } = writeResult(UNFILLED_EDIT_BODY);
    const filled = `${FRONTMATTER}\n${FILLED_EDIT_BODY}`.replace(from, to);
    writeFileSync(resultPath, filled, "utf8");

    const outcome = downgradeUnfilledResult("success", resultPath, "edit", scaffoldFrontmatter);

    expect(outcome).toEqual({ result: "failure", unfilledBlock: true });
  });
});
