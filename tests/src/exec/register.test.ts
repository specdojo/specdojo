import { describe, expect, it } from "vitest";
import path from "node:path";
import {
  normalizePjrId,
  parseRegisterSelectionFilter,
  registerItemCategory,
  requireRunnableRegisterItem,
  sanitizeRegisterConclusion,
  selectRegisterItems,
  ticketPathFromItem,
} from "../../../src/exec/register.js";
import {
  applyRegisterDifficultyRouting,
  isRegisterPipelineRequested,
  parseRegisterExecutorSelection,
  resolveRegisterCommand,
  resolveRegisterPipelineCommand,
} from "../../../src/exec/run/run.js";
import type { PjrItem } from "../../../src/register/register.js";
import type { MemberRoster, ProjectMember } from "../../../src/shared/specdojo-config.js";

function makeItem(overrides: Partial<PjrItem> = {}): PjrItem {
  return {
    id: "PJR-0001",
    status: "open",
    title: "サンプル項目",
    description: "説明",
    type: "todo",
    priority: "high",
    owner: "ARC",
    registeredAt: "_TODO_",
    due: "-",
    completedAt: "-",
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

  it("decision / note は実行対象外として null を返す", () => {
    expect(registerItemCategory("decision")).toBeNull();
    expect(registerItemCategory("note")).toBeNull();
    expect(registerItemCategory("epic")).toBeNull();
  });
});

describe("register filter selection", () => {
  const items: PjrItem[] = [
    makeItem({ id: "PJR-0003", type: "todo", priority: "low" }),
    makeItem({ id: "PJR-0001", type: "todo", priority: "high" }),
    makeItem({ id: "PJR-0002", type: "issue", priority: "high" }),
    makeItem({ id: "PJR-0004", type: "note", priority: "high" }),
    makeItem({ id: "PJR-0007", type: "epic", track: "business", priority: "high" }),
    makeItem({ id: "PJR-0005", type: "todo", priority: "high", status: "done" }),
    makeItem({ id: "PJR-0006", type: "todo", priority: "high", status: "waiting" }),
  ];

  it("flat な list 入力を検証し、条件と上限で ID 昇順に選ぶ", () => {
    const filter = parseRegisterSelectionFilter({
      types: "todo,issue",
      priorities: "high",
      statuses: "open,waiting",
      limit: "2",
    });

    expect(selectRegisterItems(items, filter).map((item) => item.id)).toEqual([
      "PJR-0001",
      "PJR-0002",
    ]);
  });

  it("既定では open かつ実行可能 type だけを選ぶ", () => {
    expect(selectRegisterItems(items, {}).map((item) => item.id)).toEqual([
      "PJR-0001",
      "PJR-0002",
      "PJR-0003",
    ]);
  });

  it("epic を明示した filter も実行対象にしない", () => {
    expect(selectRegisterItems(items, parseRegisterSelectionFilter({ types: "epic" }))).toEqual([]);
  });

  it("未知の値と正でない limit を拒否する", () => {
    expect(() => parseRegisterSelectionFilter({ types: "unknown" })).toThrow(/unknown value/);
    expect(() => parseRegisterSelectionFilter({ limit: "0" })).toThrow(/positive integer/);
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
    expect(() => requireRunnableRegisterItem(makeItem({ type: "epic" }))).toThrow(
      /epic.*not executable/,
    );
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

  it("色付き hook 出力の ANSI エスケープコードを除去する", () => {
    const esc = String.fromCharCode(0x1b);
    const colored = `${esc}[31mCheckpoint commit failed${esc}[0m`;

    const actual = sanitizeRegisterConclusion(colored);

    // 制御文字が残らず、表・YAML を壊さない可読文字列になること。
    expect(actual).toBe("Checkpoint commit failed");
    expect([...actual].every((ch) => (ch.codePointAt(0) ?? 0) >= 0x20)).toBe(true);
  });

  it("ANSI 除去後も改行はスペースへ、パイプはスラッシュへ整える", () => {
    const esc = String.fromCharCode(0x1b);
    const reason = `${esc}[1mline1\nline2 | note${esc}[0m`;

    expect(sanitizeRegisterConclusion(reason)).toBe("line1 line2 / note");
  });

  it("失敗理由の山括弧プレースホルダを code span 化する", () => {
    expect(sanitizeRegisterConclusion("dct-<domain>.yaml の生成に失敗した")).toBe(
      "`dct-<domain>.yaml` の生成に失敗した",
    );
  });
});

describe("resolveRegisterCommand", () => {
  it("--by 指定は nickname から command を解決する", () => {
    const roster = makeRoster([makeAgent({ nickname: "named", command: "run-named" })]);

    expect(resolveRegisterCommand(makeItem(), roster, { by: "named" })).toEqual({
      command: "run-named",
      actor: "named",
    });
  });

  it("--by の alias を解決し、実体の nickname を actor にする", () => {
    const roster: MemberRoster = {
      ...makeRoster([makeAgent({ nickname: "sol-executor", command: "run-sol" })]),
      aliases: [{ nickname: "codex-expert-executor", alias_of: "sol-executor" }],
    };

    expect(resolveRegisterCommand(makeItem(), roster, { by: "codex-expert-executor" })).toEqual({
      command: "run-sol",
      actor: "sol-executor",
    });
  });

  it("--by が agent として解決できない場合はエラーを投げる", () => {
    const roster = makeRoster([makeAgent({ nickname: "agent-1" })]);

    expect(() => resolveRegisterCommand(makeItem(), roster, { by: "unknown" })).toThrow(
      /Agent command not found for actor: unknown/,
    );
  });

  it("--by が無い場合は owner の nickname や Role code に一致する agent があっても自動選択しない", () => {
    const roster = makeRoster([
      makeAgent({ nickname: "ARC", roles: ["ARC"], command: "run-arc" }),
      makeAgent({ nickname: "generic", roles: ["DEV"], priority: 1, command: "run-generic" }),
    ]);

    expect(() =>
      resolveRegisterCommand(makeItem({ id: "PJR-0042", owner: "ARC" }), roster, {}),
    ).toThrow(/No agent specified for register item PJR-0042 \(owner: ARC\)/);
  });
});

describe("isRegisterPipelineRequested", () => {
  it("--executor-by と --reporter-by が両方揃うと true を返す", () => {
    expect(isRegisterPipelineRequested({ executorBy: "exec-1", reporterBy: "report-1" })).toBe(
      true,
    );
  });

  it("片方だけでも true を返す（呼び出し側で対称チェックする前提）", () => {
    expect(isRegisterPipelineRequested({ executorBy: "exec-1" })).toBe(true);
    expect(isRegisterPipelineRequested({ reporterBy: "report-1" })).toBe(true);
  });

  it("どちらも無指定で --by も無ければ stage_role 自動選択の pipeline として true を返す", () => {
    expect(isRegisterPipelineRequested({})).toBe(true);
  });

  it("--by だけを指定した場合は単一 agent 実行として false を返す", () => {
    expect(isRegisterPipelineRequested({ by: "named" })).toBe(false);
  });
});

describe("parseRegisterExecutorSelection", () => {
  it("従来の単一 nickname を全項目共通指定として扱う", () => {
    expect(parseRegisterExecutorSelection("exec-1", ["PJR-0001", "PJR-0002"])).toEqual({
      kind: "shared",
      executor: "exec-1",
    });
  });

  it("項目ごとの指定を ID 正規化後の map にする", () => {
    const selection = parseRegisterExecutorSelection("pjr-0001=exec-codex,PJR-0002=exec-claude", [
      "PJR-0001",
      "PJR-0002",
    ]);

    expect(selection.kind).toBe("per-item");
    expect(selection.kind === "per-item" ? Object.fromEntries(selection.executors) : {}).toEqual({
      "PJR-0001": "exec-codex",
      "PJR-0002": "exec-claude",
    });
  });

  it("起動対象外 ID、指定漏れ、重複指定を拒否する", () => {
    expect(() =>
      parseRegisterExecutorSelection("PJR-0001=exec-1,PJR-9999=exec-2", ["PJR-0001"]),
    ).toThrow(/outside the register execution target.*PJR-9999/);
    expect(() =>
      parseRegisterExecutorSelection("PJR-0001=exec-1", ["PJR-0001", "PJR-0002"]),
    ).toThrow(/missing: PJR-0002/);
    expect(() =>
      parseRegisterExecutorSelection("PJR-0001=exec-1,PJR-0001=exec-2", ["PJR-0001"]),
    ).toThrow(/Duplicate.*PJR-0001/);
  });
});

describe("resolveRegisterPipelineCommand", () => {
  it("--executor-by / --reporter-by の nickname から executor と reporter の候補を解決する", () => {
    const roster = makeRoster([
      makeAgent({
        nickname: "exec-1",
        stage_role: "executor",
        provider: "codex",
        command: "run-exec-1",
      }),
      makeAgent({
        nickname: "report-1",
        stage_role: "reporter",
        provider: "codex",
        command: "run-report-1",
      }),
    ]);

    const actual = resolveRegisterPipelineCommand(roster, {
      executorBy: "exec-1",
      reporterBy: "report-1",
    });

    expect(actual).toEqual({
      executor: { command: "run-exec-1", actor: "exec-1", provider: "codex" },
      reporterCandidates: [{ command: "run-report-1", actor: "report-1", provider: "codex" }],
    });
  });

  it("--executor-by / --reporter-by の alias を実体へ解決して actor に記録する", () => {
    const roster: MemberRoster = {
      ...makeRoster([
        makeAgent({
          nickname: "sol-executor",
          stage_role: "executor",
          provider: "codex",
          model: "gpt-5.6-sol",
          command: undefined,
        }),
        makeAgent({
          nickname: "sonnet-reporter",
          stage_role: "reporter",
          provider: "claude",
          command: "run-sonnet-reporter",
        }),
      ]),
      aliases: [
        { nickname: "codex-expert-executor", alias_of: "sol-executor" },
        { nickname: "claude-reporter", alias_of: "sonnet-reporter" },
      ],
    };

    expect(
      resolveRegisterPipelineCommand(
        roster,
        {
          executorBy: "codex-expert-executor",
          reporterBy: "claude-reporter",
        },
        { providers: { codex: { command_template: "codex exec --model {model}" } } },
      ),
    ).toEqual({
      executor: {
        command: "codex exec --model gpt-5.6-sol",
        actor: "sol-executor",
        provider: "codex",
      },
      reporterCandidates: [
        {
          command: "run-sonnet-reporter",
          actor: "sonnet-reporter",
          provider: "claude",
        },
      ],
    });
  });

  it("--reporter-by の report profile を Claude settings に展開する", () => {
    const roster = makeRoster([
      makeAgent({ nickname: "exec-1", stage_role: "executor", command: "run-exec-1" }),
      makeAgent({
        nickname: "claude-reporter",
        stage_role: "reporter",
        provider: "claude",
        mode: "report",
        command: undefined,
      }),
    ]);

    const actual = resolveRegisterPipelineCommand(
      roster,
      { executorBy: "exec-1", reporterBy: "claude-reporter" },
      {
        providers: {
          claude: {
            command_template:
              "claude -p --agent {nickname} --settings .specdojo/claude/settings.{mode}.json",
          },
        },
      },
    );

    expect(actual.reporterCandidates).toEqual([
      {
        command:
          "claude -p --agent claude-reporter --settings .specdojo/claude/settings.report.json",
        actor: "claude-reporter",
        provider: "claude",
      },
    ]);
  });

  it("片方だけの指定はエラーを投げる", () => {
    const roster = makeRoster([makeAgent({ nickname: "exec-1", stage_role: "executor" })]);

    expect(() => resolveRegisterPipelineCommand(roster, { executorBy: "exec-1" })).toThrow(
      /requires both --executor-by and --reporter-by/,
    );
  });

  it("stage_role が一致しない nickname はエラーを投げる", () => {
    const roster = makeRoster([
      makeAgent({ nickname: "exec-1", stage_role: "reporter", command: "run-exec-1" }),
      makeAgent({ nickname: "report-1", stage_role: "reporter", command: "run-report-1" }),
    ]);

    expect(() =>
      resolveRegisterPipelineCommand(roster, { executorBy: "exec-1", reporterBy: "report-1" }),
    ).toThrow(/--executor-by agent must have stage_role: executor/);
  });

  it("nickname が roster に存在しない場合はエラーを投げる", () => {
    const roster = makeRoster([makeAgent({ nickname: "exec-1", stage_role: "executor" })]);

    expect(() =>
      resolveRegisterPipelineCommand(roster, { executorBy: "exec-1", reporterBy: "unknown" }),
    ).toThrow(/--reporter-by agent nickname not found/);
  });

  it("指定が無い場合は stage_role を持つ agent から priority 順に自動選択し、stage_role の無い agent を選ばない", () => {
    const roster = makeRoster([
      makeAgent({ nickname: "translator", roles: [], priority: 0, command: "run-translator" }),
      makeAgent({
        nickname: "review-exec",
        roles: [],
        stage_role: "executor",
        mode: "review",
        priority: 0,
        command: "run-review-exec",
      }),
      makeAgent({
        nickname: "exec-slow",
        roles: [],
        stage_role: "executor",
        mode: "edit",
        priority: 5,
        command: "run-exec-slow",
      }),
      makeAgent({
        nickname: "exec-fast",
        roles: [],
        stage_role: "executor",
        mode: "edit",
        priority: 1,
        command: "run-exec-fast",
      }),
      makeAgent({
        nickname: "report-2",
        roles: [],
        stage_role: "reporter",
        mode: "report",
        priority: 2,
        command: "run-report-2",
      }),
      makeAgent({
        nickname: "report-1",
        roles: [],
        stage_role: "reporter",
        priority: 1,
        command: "run-report-1",
      }),
    ]);

    const actual = resolveRegisterPipelineCommand(roster, {});

    expect(actual).toEqual({
      executor: { command: "run-exec-fast", actor: "exec-fast", provider: undefined },
      reporterCandidates: [
        { command: "run-report-1", actor: "report-1", provider: undefined },
        { command: "run-report-2", actor: "report-2", provider: undefined },
      ],
    });
  });

  it("自動選択の候補が stage_role の無い agent だけの場合は明示指定を求めるエラーを投げる", () => {
    const roster = makeRoster([
      makeAgent({ nickname: "translator", roles: [], command: "run-translator" }),
    ]);

    expect(() => resolveRegisterPipelineCommand(roster, {})).toThrow(
      /No agent found for --register pipeline stage \(stage_role: executor \(mode: edit\), stage_role: reporter\)\. Specify --executor-by/,
    );
  });
});

describe("applyRegisterDifficultyRouting", () => {
  const defaults = {
    routing: {
      hard: {
        executor_by: "hard-executor",
        reporter_by: "hard-reporter",
        on_rate_limit: "wait" as const,
        fallback_executor_by: "backup-executor",
        fallback_reporter_by: "backup-reporter",
      },
      medium: {
        executor_by: "medium-executor",
        reporter_by: "medium-reporter",
        on_rate_limit: "fallback" as const,
      },
      easy: {
        executor_by: "easy-executor",
        reporter_by: "easy-reporter",
        on_rate_limit: "stop" as const,
      },
    },
  };

  it.each([
    ["hard", "hard-executor", "hard-reporter", "wait"],
    ["medium", "medium-executor", "medium-reporter", "fallback"],
    ["easy", "easy-executor", "easy-reporter", "stop"],
  ] as const)("difficulty=%s の route を選ぶ", (difficulty, executorBy, reporterBy, action) => {
    expect(applyRegisterDifficultyRouting({ difficulty }, {}, defaults)).toMatchObject({
      executorBy,
      reporterBy,
      onRateLimit: action,
    });
  });

  it("CLI の stage・rate limit 指定を route より優先する", () => {
    expect(
      applyRegisterDifficultyRouting(
        { difficulty: "hard" },
        {
          executorBy: "cli-executor",
          reporterBy: "cli-reporter",
          onRateLimit: "stop",
          fallbackExecutorBy: "cli-backup",
        },
        defaults,
      ),
    ).toMatchObject({
      executorBy: "cli-executor",
      reporterBy: "cli-reporter",
      onRateLimit: "stop",
      fallbackExecutorBy: "cli-backup",
      fallbackReporterBy: "backup-reporter",
    });
  });

  it("difficulty または route が無い場合は既存の自動選択用 options を変えない", () => {
    const options = { parallel: "2" };
    expect(applyRegisterDifficultyRouting({}, options, defaults)).toBe(options);
    expect(applyRegisterDifficultyRouting({ difficulty: "easy" }, options, {})).toBe(options);
  });
});
