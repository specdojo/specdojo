// 見張り（`orchestrator watch-scan`）が見つけた止まりを、理由の種類に分ける規則。
// 手当て（PJR-3M4M）と診断（PJR-YNQG）は、ここで決めた種類と詳細を入口にする。

export type StallTargetKind = "schedule-task" | "register-item" | "queue";

export type StallCategory =
  | "usage_limit"
  | "load_timeout"
  | "needs_target_sync"
  | "needs_decision"
  | "interrupted"
  | "unknown";

/** 分類の材料の 1 つ。`source` は repository 相対のパス、または記録の種類を表す名前。 */
export type StallText = { source: string; text: string };

export type StallObservation = {
  kind: StallTargetKind;
  id: string;
  /** 止まって見える状態（`blocked`・`doing`・`waiting`・`review`・`stopped` など）。 */
  state: string;
  /** その状態に入った記録の時刻。同じ止まりを見分ける鍵に使う。 */
  since: string;
  actor?: string;
  /** 状態に入った記録の文言。分類ではログより先に見る。 */
  message?: StallText;
  /** event の meta の値（`limit_kind` など）。 */
  meta?: Record<string, string>;
  /** run のログなど、message で分けられないときに見る材料。 */
  logs: StallText[];
  /** 実行中のロックがなく、更新が `--stale-after` より古い実行中の状態。 */
  interrupted?: boolean;
  /** pipeline の段も limit の印も持たない block（人やオーケストレーターが手で止めたもの）。 */
  manual?: boolean;
};

export type StallBasis = { source: string; excerpt: string };

export type StallClassification = {
  category: StallCategory;
  detail: string;
  basis: StallBasis;
  nextAction: string;
};

type Rule = {
  category: StallCategory;
  detail: string;
  pattern: RegExp;
  nextAction: string;
  /** run のログには当てない。テストの名前や出力の文言で誤って分けないため。 */
  messageOnly?: boolean;
};

const USAGE_LIMIT_KINDS = new Set(["rate_limit", "session_limit", "quota_exhausted"]);
const LOAD_LIMIT_KINDS = new Set(["overloaded", "timeout", "oom"]);
const EXCERPT_MAX_LENGTH = 200;

const NEXT_USAGE_LIMIT =
  "解除の時刻を待って `specdojo exec resume` で再開するか、別の agent で流し直す";
const NEXT_LOAD_TIMEOUT = "負荷の低いときに同じ検査や統合を流し直してから再開する";
const NEXT_TARGET_SYNC = "worktree を統合先の新しい commit に同期してから再開する";

// 理由が具体的に分かる規則。上の規則ほど優先する。判断が要るもの・統合先の同期を、
// 負荷の時間切れより先に置く。両方が出ていれば、流し直しで直らない方を採って止めたままにする。
const SPECIFIC_RULES: readonly Rule[] = [
  {
    category: "usage_limit",
    detail: "usage_limit",
    pattern:
      /\b(?:rate_limit|session_limit|quota_exhausted) reached\b|rate limit reached|usage limit|RESOURCE_EXHAUSTED|too many requests/iu,
    nextAction: NEXT_USAGE_LIMIT,
    messageOnly: true,
  },
  {
    category: "needs_decision",
    detail: "protected_config",
    pattern: /agent-config-write|protected configuration changes/iu,
    nextAction:
      "保護された設定の変更の案を読み、人が設定を変えるか、変えずに済む作業へ直してから再開する",
  },
  {
    category: "needs_decision",
    detail: "git_state",
    pattern: /agent-git-state-write|Git state changes detected/iu,
    nextAction: "agent が変えた Git の状態（HEAD・config）を確かめて戻してから再開する",
  },
  {
    category: "needs_decision",
    detail: "out_of_commit_scope",
    pattern: /commit-scope: skipped non-target changes|\buncommitted=\d+|not committable/iu,
    nextAction:
      "commit の対象外の変更を読み、対象の宣言（targets）を直すか、変更を別の項目へ移すかを決める",
  },
  {
    category: "needs_decision",
    detail: "kata_rule",
    pattern:
      /sidebar kata menus|covers all non-deprecated rulebooks|enum coverage|catalog-validate: ERROR/iu,
    nextAction:
      "型の決まり（サイドバーの型のメニュー・カタログ・schema の列挙）を直す項目を起票してから再開する",
  },
  {
    category: "needs_decision",
    detail: "merge_conflict",
    pattern: /\bCONFLICT \(|Merge conflict in/u,
    nextAction: "統合先とぶつかった箇所を人が直してから統合をやり直す",
  },
  {
    category: "needs_decision",
    detail: "integration_target_dirty",
    pattern: /Staged changes in integration target/iu,
    nextAction: "統合先の作業ツリーに残る変更を片付けてから統合をやり直す",
  },
  {
    category: "needs_target_sync",
    detail: "target_ahead",
    pattern:
      /unknown option '--|unknown command '|non-fast-forward|is behind|not up to date with|needs? (?:a )?rebase/iu,
    nextAction: NEXT_TARGET_SYNC,
  },
  {
    category: "load_timeout",
    detail: "load_timeout",
    pattern: /^timed out: yes$|Test timed out in \d+ ?ms|Hook timed out in \d+ ?ms/mu,
    nextAction: NEXT_LOAD_TIMEOUT,
  },
  {
    category: "load_timeout",
    detail: "load_timeout",
    pattern: /\bETIMEDOUT\b|overloaded|over capacity/iu,
    nextAction: NEXT_LOAD_TIMEOUT,
    messageOnly: true,
  },
  {
    category: "load_timeout",
    detail: "git_index_lock",
    pattern: /index\.lock/u,
    nextAction: NEXT_LOAD_TIMEOUT,
  },
];

// 種類までは分からないが、どの段で止まったかは分かる文言。具体的な規則がどの材料にも
// 当たらなかったときだけ使い、記録を読んで決める「判断が要るもの」に入れる。
const GENERIC_RULES: readonly Rule[] = [
  {
    category: "needs_decision",
    detail: "executor_incomplete",
    pattern: /executor reported incomplete|result is incomplete/iu,
    nextAction:
      "executor の報告の残りの作業（handoff）を読み、続けるか手直しの項目を起こすかを決める",
  },
  {
    category: "needs_decision",
    detail: "validation_failure",
    pattern:
      /parent validation failed|executor validation failed|reporter output invalid|reporter result rendering failed|git commit failed/iu,
    nextAction: "失敗した検査のログを読み、成果物を直すか検査を直すかを決める",
  },
];

function excerptOf(text: string, match: RegExpExecArray): string {
  const start = text.lastIndexOf("\n", match.index) + 1;
  const endIndex = text.indexOf("\n", match.index + match[0].length);
  const line = text.slice(start, endIndex === -1 ? undefined : endIndex).trim();
  return line.length > EXCERPT_MAX_LENGTH ? `${line.slice(0, EXCERPT_MAX_LENGTH)}…` : line;
}

function matchRule(rule: Rule, text: StallText): StallClassification | undefined {
  const match = rule.pattern.exec(text.text);
  if (!match) return undefined;
  return {
    category: rule.category,
    detail: rule.detail,
    basis: { source: text.source, excerpt: excerptOf(text.text, match) },
    nextAction: rule.nextAction,
  };
}

/**
 * 状態に入った記録の文言を先に見て、当たらなければ run のログを見る。文言は 1 つの理由を
 * 述べるので文言ごとに最初の規則を採り、ログはどのファイルに出たかより規則の順を優先する
 * （判断が要る失敗と時間切れが別のログに出ていれば、判断が要る方を採る）。
 */
function firstMatch(
  rules: readonly Rule[],
  messages: readonly StallText[],
  logs: readonly StallText[],
): StallClassification | undefined {
  for (const text of messages) {
    for (const rule of rules) {
      const matched = matchRule(rule, text);
      if (matched) return matched;
    }
  }
  for (const rule of rules) {
    if (rule.messageOnly) continue;
    for (const text of logs) {
      const matched = matchRule(rule, text);
      if (matched) return matched;
    }
  }
  return undefined;
}

function fromLimitMeta(observation: StallObservation): StallClassification | undefined {
  const kind = observation.meta?.limit_kind;
  if (!kind) return undefined;
  const resumeAt = observation.meta?.limit_resume_at;
  const basis = {
    source: observation.message?.source ?? "event meta",
    excerpt: `limit_kind=${kind}${resumeAt ? ` limit_resume_at=${resumeAt}` : ""}`,
  };
  if (USAGE_LIMIT_KINDS.has(kind)) {
    return { category: "usage_limit", detail: kind, basis, nextAction: NEXT_USAGE_LIMIT };
  }
  if (LOAD_LIMIT_KINDS.has(kind)) {
    return { category: "load_timeout", detail: kind, basis, nextAction: NEXT_LOAD_TIMEOUT };
  }
  return undefined;
}

/**
 * 止まりを理由の種類に分ける。見る順は、limit の meta、状態に入った記録の文言、run のログ。
 * 具体的な規則がどれにも当たらなければ、段だけ分かる規則、最後に `unknown` とする。
 */
export function classifyStall(observation: StallObservation): StallClassification {
  if (observation.interrupted) {
    return {
      category: "interrupted",
      detail: `stale_${observation.state}`,
      basis: {
        source: observation.message?.source ?? observation.kind,
        excerpt: `state=${observation.state} since=${observation.since}`,
      },
      nextAction: "実行中のプロセスがないことを確かめ、`specdojo exec resume` で再開する",
    };
  }
  if (observation.kind === "register-item" && observation.state === "review") {
    return {
      category: "needs_decision",
      detail: "review_pending",
      basis: {
        source: observation.message?.source ?? "register event",
        excerpt: observation.message?.text.split("\n")[0]?.trim() || "status=review",
      },
      nextAction: "post-review の結果を読み、close するか差し戻すかを決める",
    };
  }
  const messages = observation.message ? [observation.message] : [];
  const classified =
    fromLimitMeta(observation) ??
    firstMatch(SPECIFIC_RULES, messages, observation.logs) ??
    firstMatch(GENERIC_RULES, messages, observation.logs);
  if (classified) return classified;
  const fallbackBasis = {
    source: observation.message?.source ?? observation.kind,
    excerpt: observation.message?.text.split("\n")[0]?.trim().slice(0, EXCERPT_MAX_LENGTH) || "-",
  };
  if (observation.manual) {
    return {
      category: "needs_decision",
      detail: "manual_block",
      basis: fallbackBasis,
      nextAction: "手で止めた人の理由を読み、その指示（手直しの todo など）が済んでから再開する",
    };
  }
  if (observation.kind === "queue" && observation.state === "stopped") {
    return {
      category: "needs_decision",
      detail: "queue_step_failed",
      basis: fallbackBasis,
      nextAction:
        "止まった段の対象の止まりを先に片付け、`specdojo exec queue run` で列を続けるか `exec queue cancel` で止める",
    };
  }
  return {
    category: "unknown",
    detail: "unknown",
    basis: {
      source: observation.message?.source ?? observation.kind,
      excerpt: observation.message?.text.split("\n")[0]?.trim().slice(0, EXCERPT_MAX_LENGTH) || "-",
    },
    nextAction: "記録とログを読み、止まった理由を確かめる",
  };
}

export const STALL_CATEGORY_LABELS: Record<StallCategory, string> = {
  usage_limit: "使用量の上限",
  load_timeout: "負荷による時間切れ",
  needs_target_sync: "統合先の新しい commit が要る",
  needs_decision: "判断が要る",
  interrupted: "中断",
  unknown: "分けられなかった",
};
