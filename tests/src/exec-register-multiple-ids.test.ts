import { describe, expect, it } from "vitest";
import {
  formatRegisterRunSummary,
  isRegisterFailureMode,
  parseRegisterIds,
  registerRunExitCode,
  selectRegisterCommitPaths,
  selectRegisterRunArtifactResidue,
  type RegisterItemSummary,
} from "../../src/exec-register.js";

describe("parseRegisterIds", () => {
  it("単一の文字列を1件のリストへ正規化する", () => {
    expect(parseRegisterIds("pjr-0012")).toEqual({ ids: ["PJR-0012"], duplicates: [] });
  });

  it("カンマ区切りを指定順のリストへ展開する", () => {
    expect(parseRegisterIds("PJR-0001, pjr-0002 ,PJR-0003")).toEqual({
      ids: ["PJR-0001", "PJR-0002", "PJR-0003"],
      duplicates: [],
    });
  });

  it("variadic 配列とカンマ区切りの混在を許容する", () => {
    expect(parseRegisterIds(["PJR-0001,PJR-0002", "pjr-0003"])).toEqual({
      ids: ["PJR-0001", "PJR-0002", "PJR-0003"],
      duplicates: [],
    });
  });

  it("重複は最初の出現のみ残し、除外分を duplicates に記録する", () => {
    expect(parseRegisterIds(["PJR-0001", "pjr-0001", "PJR-0002", "PJR-0002"])).toEqual({
      ids: ["PJR-0001", "PJR-0002"],
      duplicates: ["PJR-0001", "PJR-0002"],
    });
  });

  it("IDが1件も無い場合はエラーを投げる", () => {
    expect(() => parseRegisterIds(undefined)).toThrow(/No register item ID/);
    expect(() => parseRegisterIds("  ,  ")).toThrow(/No register item ID/);
  });

  it("PJR-XXXX 形式以外はエラーを投げる", () => {
    expect(() => parseRegisterIds(["PJR-0001", "T-LAUNCH-001"])).toThrow(
      /Invalid register item ID/,
    );
  });
});

describe("isRegisterFailureMode", () => {
  it("stop / continue のみ許容する", () => {
    expect(isRegisterFailureMode("stop")).toBe(true);
    expect(isRegisterFailureMode("continue")).toBe(true);
    expect(isRegisterFailureMode("halt")).toBe(false);
  });
});

describe("selectRegisterCommitPaths", () => {
  it("実行後に新しく現れたパスだけを対象にする", () => {
    const preexisting = ["docs/user-edit.md"];
    const current = [
      "docs/user-edit.md",
      "exec/results/pjr-0001-result.md",
      "exec/plans/pjr-0001-plan.md",
    ];

    expect(selectRegisterCommitPaths(preexisting, current)).toEqual([
      "exec/plans/pjr-0001-plan.md",
      "exec/results/pjr-0001-result.md",
    ]);
  });

  it("実行前から存在する利用者の変更は除外する", () => {
    const preexisting = ["src/user-change.ts", "docs/user-note.md"];
    const current = ["src/user-change.ts", "docs/user-note.md"];

    expect(selectRegisterCommitPaths(preexisting, current)).toEqual([]);
  });

  it("runner管理パスは実行前からdirtyでも対象にする", () => {
    const preexisting = ["docs/pjr-index.md", "docs/user-note.md"];
    const current = ["docs/pjr-index.md", "docs/user-note.md", "exec/results/pjr-result.md"];

    expect(
      selectRegisterCommitPaths(preexisting, current, [
        "docs/pjr-index.md",
        "exec/results/pjr-result.md",
      ]),
    ).toEqual(["docs/pjr-index.md", "exec/results/pjr-result.md"]);
  });

  it("重複を除きソートして返す", () => {
    expect(selectRegisterCommitPaths([], ["b.md", "a.md", "b.md"])).toEqual(["a.md", "b.md"]);
  });
});

describe("selectRegisterRunArtifactResidue", () => {
  it("未commitのregister plan/resultだけを抽出する", () => {
    expect(
      selectRegisterRunArtifactResidue([
        "docs/project/execution/exec/plans/pjr-0001-20260726T010203Z-ab12-plan.md",
        "docs/project/execution/exec/results/pjr-0001-20260726T010203Z-ab12-result.md",
        "docs/project/execution/exec/results/T-001-result.md",
        "docs/user.md",
      ]),
    ).toEqual([
      "docs/project/execution/exec/plans/pjr-0001-20260726T010203Z-ab12-plan.md",
      "docs/project/execution/exec/results/pjr-0001-20260726T010203Z-ab12-result.md",
    ]);
  });
});

describe("registerRunExitCode", () => {
  const base: RegisterItemSummary = {
    id: "PJR-0001",
    title: "t",
    outcome: "success",
    transition: "review",
    commit: "off",
  };

  it("failure が1件でもあれば 1 を返す", () => {
    const summaries: RegisterItemSummary[] = [
      base,
      { ...base, id: "PJR-0002", outcome: "failure", transition: "waiting" },
    ];

    expect(registerRunExitCode(summaries)).toBe(1);
  });

  it("success と skipped のみなら 0 を返す", () => {
    const summaries: RegisterItemSummary[] = [
      base,
      { ...base, id: "PJR-0002", outcome: "skipped", transition: "none", commit: "skipped" },
    ];

    expect(registerRunExitCode(summaries)).toBe(0);
  });
});

describe("formatRegisterRunSummary", () => {
  it("ID別の成否・状態遷移・commit結果・理由を一覧化する", () => {
    const summaries: RegisterItemSummary[] = [
      {
        id: "PJR-0001",
        title: "one",
        outcome: "success",
        transition: "review",
        commit: "committed abc1234",
      },
      {
        id: "PJR-0002",
        title: "two",
        outcome: "failure",
        transition: "waiting",
        commit: "off",
        reason: "agent exited with non-zero code (exit 1)",
      },
      {
        id: "PJR-0003",
        title: "-",
        outcome: "skipped",
        transition: "none",
        commit: "skipped",
        reason: "stopped after an earlier failure (--on-failure stop)",
      },
      {
        id: "PJR-0004",
        title: "four",
        outcome: "failure",
        transition: "waiting",
        commit: "incomplete",
        reason: "register commit incomplete: target remained dirty",
      },
    ];

    const actual = formatRegisterRunSummary(summaries);

    expect(actual).toBe(
      [
        "Register run summary:",
        "  PJR-0001  success  transition=review  commit=committed abc1234",
        "  PJR-0002  failure  transition=waiting  commit=off  reason=agent exited with non-zero code (exit 1)",
        "  PJR-0003  skipped  transition=none  commit=skipped  reason=stopped after an earlier failure (--on-failure stop)",
        "  PJR-0004  failure  transition=waiting  commit=incomplete  reason=register commit incomplete: target remained dirty",
      ].join("\n"),
    );
  });
});
