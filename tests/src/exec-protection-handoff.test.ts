import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  applyProtectionHandoff,
  PROTECTION_HANDOFF_MARKER,
  recordProtectionHandoff,
  renderProtectionHandoff,
  truncateProtectionEvidence,
  type AgentProtectionHandoff,
} from "../../src/exec-protection-handoff.js";

const roots: string[] = [];

afterEach(() => {
  while (roots.length > 0) rmSync(roots.pop()!, { recursive: true, force: true });
});

const CONFIG_HANDOFF: AgentProtectionHandoff = {
  mechanism: "agent-config-write",
  subjectLabel: "対象パス",
  subjects: ["package.json"],
  reason: "agent-config-write: protected configuration changes detected; paths=package.json",
  evidenceLabel: "提案差分",
  evidenceLanguage: "diff",
  evidence: ["--- a/package.json", "+++ b/package.json", '+    "lint:md": "markdownlint ."'].join(
    "\n",
  ),
};

const FRONTMATTER = [
  "---",
  "specdojo:",
  "  id: prj-0001:xer-sample",
  "  type: exec-result",
  "  task_id: PJR-TEST",
  "  mode: edit",
  "  status: in_progress",
  "---",
].join("\n");

function editResult(handoffSection: string): string {
  return [
    FRONTMATTER,
    "",
    "# Edit Result",
    "",
    "## 1. 実施内容",
    "",
    "_TODO_: 実施した内容の要約を記入する。",
    "",
    "## 2. 変更ファイル",
    "",
    "_TODO_: 変更したファイルのパスを記入する。",
    "",
    "## 3. 申し送り",
    "",
    handoffSection,
    "",
    "## 4. 進め方と実践の型の適用",
    "",
    "_TODO_: 進め方を記入する。",
    "",
  ].join("\n");
}

const REVIEW_RESULT = [
  FRONTMATTER,
  "",
  "# Review Result",
  "",
  "## 1. レビュー観点別結果",
  "",
  "- 観点別結果: 該当なし",
  "",
  "## 2. findings",
  "",
  "- なし",
  "",
  "## 3. 実践の型との整合確認",
  "",
  "- なし",
  "",
  "## 4. decision",
  "",
  "- recommendation: _TODO_",
  "",
].join("\n");

function handoffSectionOf(content: string): string {
  const start = content.indexOf("## 3. 申し送り");
  const end = content.indexOf("## 4.", start);
  return content.slice(start, end === -1 ? undefined : end);
}

function occurrences(content: string, needle: string): number {
  return content.split(needle).length - 1;
}

describe("applyProtectionHandoff", () => {
  it("records the blocked paths, block message and proposed diff into the handoff section", () => {
    const actual = applyProtectionHandoff(
      editResult("_TODO_: 後続タスクへの申し送り事項を記入する（なければ削除）。"),
      CONFIG_HANDOFF,
    );

    const section = handoffSectionOf(actual);
    expect(section).toContain("`agent-config-write` が agent の変更を止めた");
    expect(section).toContain("- 対象パス: `package.json`");
    expect(section).toContain(
      "- block メッセージ: `agent-config-write: protected configuration changes detected; paths=package.json`",
    );
    expect(section).toContain("```diff");
    expect(section).toContain('+    "lint:md": "markdownlint ."');
    expect(section).not.toContain("_TODO_: 後続タスクへの申し送り事項");
  });

  it("states that the reason and the required validation are unrecorded by the agent", () => {
    const actual = applyProtectionHandoff(
      editResult("_TODO_: 後続タスクへの申し送り事項を記入する（なければ削除）。"),
      CONFIG_HANDOFF,
    );

    const section = handoffSectionOf(actual);
    expect(section).toContain("- 変更理由: agent の記入なし。");
    expect(section).toContain("- 変更後に必要な検証: agent の記入なし。");
  });

  it("keeps the agent handoff text and points the reason at it", () => {
    const agentText = "設定変更が必要: `package.json` に lint:md script を追加したい。";

    const actual = applyProtectionHandoff(editResult(agentText), CONFIG_HANDOFF);

    const section = handoffSectionOf(actual);
    expect(section.indexOf(agentText)).toBeLessThan(section.indexOf(PROTECTION_HANDOFF_MARKER));
    expect(section).toContain("- 変更理由: この節の上に agent が記入した申し送りを参照する。");
  });

  it("keeps the mandatory placeholders and the frontmatter untouched", () => {
    const actual = applyProtectionHandoff(
      editResult("_TODO_: 後続タスクへの申し送り事項を記入する（なければ削除）。"),
      CONFIG_HANDOFF,
    );

    expect(actual.startsWith(FRONTMATTER)).toBe(true);
    expect(actual).toContain("_TODO_: 実施した内容");
    expect(actual).toContain("_TODO_: 変更したファイル");
  });

  it("replaces a previous automatic record instead of appending a second one", () => {
    const once = applyProtectionHandoff(
      editResult("_TODO_: 後続タスクへの申し送り事項を記入する（なければ削除）。"),
      CONFIG_HANDOFF,
    );

    const twice = applyProtectionHandoff(once, {
      ...CONFIG_HANDOFF,
      subjects: ["lefthook.yml"],
    });

    expect(occurrences(twice, PROTECTION_HANDOFF_MARKER)).toBe(1);
    expect(twice).toContain("- 対象パス: `lefthook.yml`");
    expect(twice).not.toContain("- 対象パス: `package.json`");
  });

  it("appends a numbered section when the result has no handoff section", () => {
    const once = applyProtectionHandoff(REVIEW_RESULT, CONFIG_HANDOFF);
    const twice = applyProtectionHandoff(once, CONFIG_HANDOFF);

    expect(once).toContain("## 5. 保護機構による block の申し送り");
    expect(occurrences(twice, "## 5. 保護機構による block の申し送り")).toBe(1);
    expect(occurrences(twice, PROTECTION_HANDOFF_MARKER)).toBe(1);
  });
});

describe("renderProtectionHandoff", () => {
  it("notes that the evidence could not be collected when it is empty", () => {
    const actual = renderProtectionHandoff({ ...CONFIG_HANDOFF, evidence: "" }, false);

    expect(actual).toContain("提案差分: 取得できなかった（対象は上記のとおり）。");
    expect(actual).not.toContain("```diff");
  });

  it("uses a longer fence when the evidence itself contains a code fence", () => {
    const actual = renderProtectionHandoff(
      { ...CONFIG_HANDOFF, evidence: "```\nfenced\n```" },
      false,
    );

    expect(actual).toContain("````diff");
    expect(actual.trimEnd().endsWith("````")).toBe(true);
  });

  it("keeps the git state fields and their detected change", () => {
    const actual = renderProtectionHandoff(
      {
        mechanism: "agent-git-state-write",
        subjectLabel: "対象フィールド",
        subjects: ["HEAD", "local-config"],
        reason: "agent-git-state-write: Git state changes detected; fields=HEAD, local-config",
        evidenceLabel: "検知した変更",
        evidenceLanguage: "text",
        evidence: "HEAD:\n  before: refs/heads/exec/a @ 111\n  after:  refs/heads/exec/a @ 222",
      },
      false,
    );

    expect(actual).toContain("- 対象フィールド: `HEAD`, `local-config`");
    expect(actual).toContain("検知した変更:");
    expect(actual).toContain("```text");
    expect(actual).toContain("  after:  refs/heads/exec/a @ 222");
  });
});

describe("truncateProtectionEvidence", () => {
  it("keeps a short diff as-is", () => {
    expect(truncateProtectionEvidence("+ line\n")).toBe("+ line");
  });

  it("truncates a long diff and reports how many lines were dropped", () => {
    const evidence = Array.from({ length: 250 }, (_, index) => `+ line ${index}`).join("\n");

    const actual = truncateProtectionEvidence(evidence);

    expect(actual.split("\n")).toHaveLength(201);
    expect(actual).toContain("+ line 199");
    expect(actual).not.toContain("+ line 200\n");
    expect(actual.endsWith("... (50 行を省略)")).toBe(true);
  });
});

describe("recordProtectionHandoff", () => {
  it("writes the handoff into an existing result file", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-protection-handoff-"));
    roots.push(root);
    const resultPath = join(root, "PJR-TEST-result.md");
    writeFileSync(
      resultPath,
      editResult("_TODO_: 後続タスクへの申し送り事項を記入する（なければ削除）。"),
      "utf8",
    );

    const recorded = recordProtectionHandoff(resultPath, CONFIG_HANDOFF);

    expect(recorded).toBe(true);
    expect(readFileSync(resultPath, "utf8")).toContain("- 対象パス: `package.json`");
  });

  it("reports that nothing was recorded when the run has no result file", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-protection-handoff-"));
    roots.push(root);

    expect(recordProtectionHandoff(undefined, CONFIG_HANDOFF)).toBe(false);
    expect(recordProtectionHandoff(join(root, "missing-result.md"), CONFIG_HANDOFF)).toBe(false);
  });
});
