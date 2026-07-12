import { describe, expect, it } from "vitest";
import path from "node:path";
import {
  normalizePjrId,
  registerItemCategory,
  requireRunnableRegisterItem,
  sanitizeRegisterConclusion,
  ticketPathFromItem,
} from "../../src/exec-register.js";
import { resolveRegisterCommand } from "../../src/exec-run.js";
import type { PjrItem } from "../../src/register.js";
import type { MemberRoster, ProjectMember } from "../../src/specdojo-config.js";

function makeItem(overrides: Partial<PjrItem> = {}): PjrItem {
  return {
    id: "PJR-0001",
    status: "open",
    title: "サンプル項目",
    description: "説明",
    type: "todo",
    priority: "high",
    owner: "ARC",
    due: "-",
    completed: "-",
    conclusion: "-",
    ticket: "-",
    ...overrides,
  };
}

function makeAgent(overrides: Partial<ProjectMember> = {}): ProjectMember {
  return {
    nickname: "agent-1",
    display_name: "Agent 1",
    email: null,
    roles: ["DEV"],
    type: "agent",
    command: "run-agent-1",
    ...overrides,
  };
}

function makeRoster(members: ProjectMember[]): MemberRoster {
  return { version: 1, project_id: "prj-test", members };
}

describe("registerItemCategory", () => {
  it("todo / issue / change-request は edit 区分になる", () => {
    expect(registerItemCategory("todo")).toBe("edit");
    expect(registerItemCategory("issue")).toBe("edit");
    expect(registerItemCategory("change-request")).toBe("edit");
  });

  it("question / risk は investigate 区分になる", () => {
    expect(registerItemCategory("question")).toBe("investigate");
    expect(registerItemCategory("risk")).toBe("investigate");
  });

  it("decision / dependency / note は実行対象外として null を返す", () => {
    expect(registerItemCategory("decision")).toBeNull();
    expect(registerItemCategory("dependency")).toBeNull();
    expect(registerItemCategory("note")).toBeNull();
  });
});

describe("normalizePjrId", () => {
  it("小文字と前後空白を正規化する", () => {
    expect(normalizePjrId(" pjr-0012 ")).toBe("PJR-0012");
  });

  it("PJR-XXXX 形式以外はエラーを投げる", () => {
    expect(() => normalizePjrId("PJR-12")).toThrow(/Invalid register item ID/);
    expect(() => normalizePjrId("T-LAUNCH-001")).toThrow(/PJR-XXXX/);
  });
});

describe("requireRunnableRegisterItem", () => {
  it("実行可能な項目の区分を返す", () => {
    expect(requireRunnableRegisterItem(makeItem({ type: "question" }))).toBe("investigate");
  });

  it("実行対象外の type はエラーを投げる", () => {
    expect(() => requireRunnableRegisterItem(makeItem({ type: "note" }))).toThrow(/not executable/);
  });

  it("終端状態の項目は reopen を促すエラーを投げる", () => {
    expect(() => requireRunnableRegisterItem(makeItem({ status: "done" }))).toThrow(
      /register reopen/,
    );
  });
});

describe("ticketPathFromItem", () => {
  it("個票リンクから絶対パスを組み立てる", () => {
    const item = makeItem({ ticket: "[pjr-0001-sample](./pjr-0001-sample.md)" });
    const actual = ticketPathFromItem(item, "/repo/register");

    expect(actual).toBe(path.join("/repo/register", "pjr-0001-sample.md"));
  });

  it("個票なし（-）は null を返す", () => {
    expect(ticketPathFromItem(makeItem({ ticket: "-" }), "/repo/register")).toBeNull();
  });
});

describe("sanitizeRegisterConclusion", () => {
  it("改行とパイプを表セルに安全な文字へ置換する", () => {
    expect(sanitizeRegisterConclusion("line1\nline2 | note")).toBe("line1 line2 / note");
  });

  it("200 文字を超える理由は切り詰める", () => {
    const actual = sanitizeRegisterConclusion("x".repeat(300));

    expect(actual).toHaveLength(201);
    expect(actual.endsWith("…")).toBe(true);
  });
});

describe("resolveRegisterCommand", () => {
  it("owner が agent の nickname に一致すればその agent を使う", () => {
    const roster = makeRoster([makeAgent({ nickname: "edit-bot", command: "run-edit-bot" })]);

    const actual = resolveRegisterCommand(makeItem({ owner: "edit-bot" }), roster, {});

    expect(actual).toEqual({ command: "run-edit-bot", actor: "edit-bot" });
  });

  it("owner の Role code に一致する agent を priority 昇順で選ぶ", () => {
    const roster = makeRoster([
      makeAgent({ nickname: "slow", roles: ["ARC"], priority: 20, command: "run-slow" }),
      makeAgent({ nickname: "fast", roles: ["ARC"], priority: 10, command: "run-fast" }),
    ]);

    const actual = resolveRegisterCommand(makeItem({ owner: "ARC" }), roster, {});

    expect(actual).toEqual({ command: "run-fast", actor: "fast" });
  });

  it("disabled な agent と review 専用 agent はロール一致でも選ばない", () => {
    const roster = makeRoster([
      makeAgent({ nickname: "off", roles: ["ARC"], disabled: true }),
      makeAgent({ nickname: "reviewer", roles: ["ARC"], mode: "review", command: "run-review" }),
      makeAgent({ nickname: "editor", roles: ["ARC"], mode: "edit", command: "run-editor" }),
    ]);

    const actual = resolveRegisterCommand(makeItem({ owner: "ARC" }), roster, {});

    expect(actual).toEqual({ command: "run-editor", actor: "editor" });
  });

  it("owner で解決できない場合は edit-mode の自動選択にフォールバックする", () => {
    const roster = makeRoster([
      makeAgent({ nickname: "generic", roles: ["DEV"], priority: 1, command: "run-generic" }),
    ]);

    const actual = resolveRegisterCommand(makeItem({ owner: "QE" }), roster, {});

    expect(actual).toEqual({ command: "run-generic", actor: "generic" });
  });

  it("--cmd 指定は nickname 解決を優先しつつコマンド文字列も受け入れる", () => {
    const roster = makeRoster([makeAgent({ nickname: "named", command: "run-named" })]);

    expect(resolveRegisterCommand(makeItem(), roster, { cmd: "named" })).toEqual({
      command: "run-named",
      actor: "named",
    });
    expect(resolveRegisterCommand(makeItem(), roster, { cmd: "raw-command" })).toEqual({
      command: "raw-command",
      actor: "auto-agent",
    });
  });

  it("--by が agent として解決できない場合はエラーを投げる", () => {
    const roster = makeRoster([makeAgent({ nickname: "agent-1" })]);

    expect(() => resolveRegisterCommand(makeItem(), roster, { by: "unknown" })).toThrow(
      /Agent command not found for actor: unknown/,
    );
  });

  it("候補が全く無い場合は項目 ID と owner を含むエラーを投げる", () => {
    expect(() => resolveRegisterCommand(makeItem({ id: "PJR-0042" }), null, {})).toThrow(
      /PJR-0042/,
    );
  });
});
