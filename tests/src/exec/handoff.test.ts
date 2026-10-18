import { describe, expect, it } from "vitest";
import { extractProtectedConfigHandoff } from "../../../src/exec/handoff.js";
import { PROTECTION_HANDOFF_MARKER } from "../../../src/exec/protection-handoff.js";

function resultWithHandoff(body: string): string {
  return [
    "---",
    "specdojo:",
    "  type: exec-result",
    "---",
    "",
    "## 4. 申し送り",
    "",
    PROTECTION_HANDOFF_MARKER,
    "",
    "**保護機構による自動記録**: `agent-config-write` が agent の変更を止めた。",
    "",
    "- 対象パス: `package.json`, `app:package.json`",
    "- block メッセージ: `blocked`",
    "",
    body,
    "",
  ].join("\n");
}

describe("protected configuration handoff extraction", () => {
  it("extracts the recorded target paths and proposed patch", () => {
    const actual = extractProtectedConfigHandoff(
      resultWithHandoff(
        [
          "提案差分:",
          "",
          "```diff",
          "diff --git a/package.json b/package.json",
          "--- a/package.json",
          "+++ b/package.json",
          "@@ -1 +1 @@",
          "-{}",
          '+{"private":true}',
          "```",
        ].join("\n"),
      ),
    );

    expect(actual.subjects).toEqual(["package.json", "app:package.json"]);
    expect(actual.patch).toContain("diff --git a/package.json b/package.json");
  });

  it("rejects a handoff without a proposed patch", () => {
    expect(() =>
      extractProtectedConfigHandoff(
        resultWithHandoff("提案差分: 取得できなかった（対象は上記のとおり）。"),
      ),
    ).toThrow("no proposed patch");
  });

  it("rejects a truncated proposed patch", () => {
    expect(() =>
      extractProtectedConfigHandoff(
        resultWithHandoff(
          [
            "提案差分:",
            "",
            "```diff",
            "diff --git a/package.json b/package.json",
            "... (文字数上限で切り詰め)",
            "```",
          ].join("\n"),
        ),
      ),
    ).toThrow("truncated");
  });
});
