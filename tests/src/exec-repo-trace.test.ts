import { describe, expect, it } from "vitest";
import {
  refsTrailer,
  registerProjectMergeMessage,
  renderResultTraceBody,
  traceKey,
  upsertResultTraceSection,
  withCommitTrailers,
  type ProductIntegrationTrace,
} from "../../src/exec-repo-trace.js";

const RESULT = [
  "---",
  "specdojo:",
  "  id: prj-0001:xer-sample",
  "---",
  "",
  "# Edit Result",
  "",
  "## 1. 実施内容",
  "",
  "- 実装した。",
  "",
  "## 2. 変更ファイル",
  "",
  "```markdown",
  "## 9. コード例の見出し",
  "```",
  "",
  "## 4. 進め方と実践の型の適用",
  "",
  "- 記入済み。",
  "",
].join("\n");

const MERGED: ProductIntegrationTrace = {
  repo: "app1",
  integrationBranch: "main",
  state: "merged",
  commit: "0123456789abcdef0123456789abcdef01234567",
  pullRequest: null,
};

const UNCHANGED: ProductIntegrationTrace = {
  repo: "app2",
  integrationBranch: "release",
  state: "unchanged",
  commit: null,
  pullRequest: null,
};

describe("refsTrailer", () => {
  it("qualifies the register item id with the project id", () => {
    expect(refsTrailer("prj-0001", "PJR-30SW")).toBe("Refs: prj-0001:PJR-30SW");
  });

  it("rejects an empty project id", () => {
    expect(() => traceKey(" ", "PJR-30SW")).toThrow(/project id and an item id/);
  });
});

describe("withCommitTrailers", () => {
  it("appends the trailer as the last paragraph", () => {
    expect(
      withCommitTrailers("exec(register PJR-30SW): title\n", ["Refs: prj-0001:PJR-30SW"]),
    ).toBe("exec(register PJR-30SW): title\n\nRefs: prj-0001:PJR-30SW");
  });

  it("does not duplicate a trailer that is already present", () => {
    const message = "subject\n\nRefs: prj-0001:PJR-30SW";

    expect(withCommitTrailers(message, ["Refs: prj-0001:PJR-30SW"])).toBe(message);
  });
});

describe("registerProjectMergeMessage", () => {
  it("ends the project merge commit with the project-qualified Refs trailer", () => {
    const message = registerProjectMergeMessage({
      subject: "exec(register PJR-30SW): title",
      executor: "claude",
      reporter: "claude-reporter",
      projectId: "prj-0001",
      itemId: "PJR-30SW",
    });

    expect(message).toBe(
      "exec(register PJR-30SW): title\n\n" +
        "Transition: start → review\nExecutor: claude\nReporter: claude-reporter\n" +
        "Refs: prj-0001:PJR-30SW",
    );
  });
});

describe("renderResultTraceBody", () => {
  it("renders one row per product with the full commit and not applicable cells", () => {
    const body = renderResultTraceBody({
      traceKey: "prj-0001:PJR-30SW",
      traces: [MERGED, UNCHANGED],
      recordedAt: "2026-10-01T00:00:00.000Z",
    });
    const rows = body.split("\n").filter((line) => line.startsWith("| "));

    expect(rows).toHaveLength(4);
    expect(rows[2]).toMatch(
      /^\| `prj-0001:PJR-30SW` \| `app1` +\| `main` +\| not applicable \| `0123456789abcdef0123456789abcdef01234567` +\| 2026-10-01T00:00:00.000Z \|$/,
    );
    expect(rows[3]).toContain("| not applicable (no changes) ");
    expect(new Set(rows.map((row) => row.length)).size).toBe(1);
  });

  it("uses the PR reference when the merge commit names one", () => {
    const body = renderResultTraceBody({
      traceKey: "prj-0001:PJR-30SW",
      traces: [{ ...MERGED, pullRequest: "#123" }],
      recordedAt: "2026-10-01T00:00:00.000Z",
    });

    expect(body).toContain("| #123 ");
  });
});

describe("upsertResultTraceSection", () => {
  it("appends the trace section after the last numbered chapter outside code fences", () => {
    const actual = upsertResultTraceSection(RESULT, "trace body");

    expect(actual.endsWith("- 記入済み。\n\n## 5. トレーサビリティ\n\ntrace body\n")).toBe(true);
  });

  it("replaces an existing trace section in place on a re-run", () => {
    const first = upsertResultTraceSection(RESULT, "first body");

    const second = upsertResultTraceSection(first, "second body");

    expect(second).not.toContain("first body");
    expect(second.match(/## \d+\. トレーサビリティ/g)).toEqual(["## 5. トレーサビリティ"]);
    expect(second.endsWith("## 5. トレーサビリティ\n\nsecond body\n")).toBe(true);
  });
});
