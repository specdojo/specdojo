import { parsePlanTaskIdentity } from "./plans-storage.js";
import { redactSensitiveText } from "./shared.js";

// executor が complete と報告しても、runner が観測した事実と食い違う場合は成功として扱わない
// （PJR-QQRH）。ツールの権限による拒否が出力にある場合と、プロダクトを対象にする計画なのに
// プロダクトの worktree に変更が無い場合を検出する。

/** Marker that `exec status` looks for in block reasons. */
export const NO_PRODUCT_CHANGES_MARKER = "no product changes";

const MAX_REASON_LENGTH = 1_000;
const MAX_DENIAL_SAMPLE_LENGTH = 120;

const REPORT_BLOCK_PATTERN =
  /<specdojo_executor_evidence>[\s\S]*?<\/specdojo_executor_evidence>/giu;

// provider のツール権限による拒否の文言。シェルの EACCES など一般的な "Permission denied" は
// テストの出力などにも現れるため対象にしない。
const PERMISSION_DENIAL_PATTERNS: readonly RegExp[] = [
  // opencode: permission rule の deny（PJR-08EK の実観測）。
  /The user has specified a rule which prevents you from using this specific tool call/iu,
  /"permission"\s*:\s*"[^"]+"\s*,\s*"action"\s*:\s*"deny"/iu,
  // Claude Code: deny rule と未許可の書き込み。
  /Permission to use \S+(?: with [^\n]*)? has been denied/iu,
  /requested permissions? to (?:use|write|edit|read)[^\n]*but you haven't granted it/iu,
];

/** Output lines that show a provider's tool-permission denial, excluding the report envelope. */
export function toolPermissionDenials(output: string): string[] {
  const text = output.replace(REPORT_BLOCK_PATTERN, "");
  const seen = new Set<string>();
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (PERMISSION_DENIAL_PATTERNS.some((pattern) => pattern.test(trimmed))) seen.add(trimmed);
  }
  return [...seen];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

/**
 * Product repositories the task targets: a `<repo>:<path>` value in the plan frontmatter
 * `targets` or in `hints` (register `target_path` / `targets`), or a `<repo>:<path>` reference
 * in the plan body. Returned in the order of `productNames`.
 */
export function targetedProductRepos(params: {
  productNames: readonly string[];
  plan: string;
  hints?: readonly string[];
}): string[] {
  const identity = parsePlanTaskIdentity(params.plan);
  const declared = [...(identity?.targets ?? []), ...(params.hints ?? [])].map((value) =>
    value.trim(),
  );
  return params.productNames.filter((name) => {
    if (declared.some((value) => value.startsWith(`${name}:`) && value.length > name.length + 1)) {
      return true;
    }
    // approach の plan は対象を frontmatter の targets で宣言し、本文の `<repo>:<path>` は
    // 読み取り専用の手本（sources）でもありうるため、本文からは判定しない。
    if (identity?.approach) return false;
    // 直前が語の一部でなく、`:` の直後にパスが続く参照だけを数える（`app1: 説明` は数えない）。
    const reference = new RegExp(
      `(?:^|[^A-Za-z0-9._/:-])${escapeRegExp(name)}:[A-Za-z0-9._/-]`,
      "mu",
    );
    return reference.test(params.plan);
  });
}

function bounded(value: string, limit: number): string {
  const redacted = redactSensitiveText(value);
  return redacted.length <= limit ? redacted : `${redacted.slice(0, Math.max(0, limit - 1))}…`;
}

/**
 * Why an executor that reported complete must not be treated as successful, or undefined.
 * `unchangedTargetedRepos` lists targeted product repositories without uncommitted changes or
 * exec-branch commits.
 */
export function executorOutcomeFailure(params: {
  output: string;
  unchangedTargetedRepos: readonly string[];
  resumeHint: string;
}): string | undefined {
  // register の block_reason は 200 文字で切られるため、`exec status` が探す目印を先頭に置く。
  const reasons: string[] = [];
  if (params.unchangedTargetedRepos.length > 0) {
    reasons.push(
      `${NO_PRODUCT_CHANGES_MARKER} in ${params.unchangedTargetedRepos.join(", ")} ` +
        "although the plan targets it",
    );
  }
  const denials = toolPermissionDenials(params.output);
  if (denials.length > 0) {
    reasons.push(
      `${denials.length} tool permission denial(s) in executor output ` +
        `(first: ${bounded(denials[0]!, MAX_DENIAL_SAMPLE_LENGTH)})`,
    );
  }
  if (reasons.length === 0) return undefined;
  return bounded(
    `${reasons.join("; ")}; executor reported complete; next: ${params.resumeHint}`,
    MAX_REASON_LENGTH,
  );
}

/** Whether a block reason records the missing product changes, for status warnings. */
export function isNoProductChangesReason(reason: string | undefined): boolean {
  return typeof reason === "string" && reason.includes(NO_PRODUCT_CHANGES_MARKER);
}

/**
 * `exec status` warning lines for waiting register items and blocked schedule tasks whose block
 * reason records missing product changes. Sorted by ID.
 */
export function noProductChangeWarnings(input: {
  registerItems: ReadonlyArray<{ id: string; status: string; blockReason?: string }>;
  tasks: ReadonlyArray<{ taskId: string; state: string; lastMsg?: string }>;
}): string[] {
  const lines = [
    ...input.registerItems
      .filter((item) => item.status === "waiting" && isNoProductChangesReason(item.blockReason))
      .map((item) => ({
        id: item.id,
        line: `${item.id} (register, waiting): ${item.blockReason}`,
      })),
    ...input.tasks
      .filter((task) => task.state === "blocked" && isNoProductChangesReason(task.lastMsg))
      .map((task) => ({ id: task.taskId, line: `${task.taskId} (blocked): ${task.lastMsg}` })),
  ];
  return lines.sort((a, b) => a.id.localeCompare(b.id)).map((entry) => entry.line);
}
