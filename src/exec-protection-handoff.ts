import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { stripTerminalControlSequences } from "./exec-shared.js";
import { describeAgentProtectedConfigChanges } from "./exec-agent-protected-config.js";
import {
  describeAgentGitStateChanges,
  type AgentGitStateSnapshot,
} from "./exec-agent-git-state.js";

// PJR-VH6R: 保護機構が agent の変更を止めたとき、規約は「対象・変更理由・提案差分・
// 変更後に必要な検証」を result の申し送りへ書くことを求めている。しかし block は agent の
// 記入を待たずに成立するため、実際には _TODO_ のまま残り、orchestrator が worktree の
// `git diff` を読み直す必要があった。ここでは機構が自動で取得できる情報（対象と提案差分）を
// result へ記録し、agent 由来の情報（理由・必要な検証）は未記入であることを明示する。
export const PROTECTION_HANDOFF_MARKER = "<!-- specdojo:agent-protection-handoff -->";

const PROTECTION_HANDOFF_HEADING_TITLE = "保護機構による block の申し送り";
// 見出し行の末尾は `[ \t]*` で止め、改行を巻き込まないようにする（節の開始位置がずれるため）。
const HANDOFF_SECTION_HEADING = /^## +\d+\. +申し送り[ \t]*$/m;
const PROTECTION_SECTION_HEADING = new RegExp(
  `^## +\\d+\\. +${PROTECTION_HANDOFF_HEADING_TITLE}[ \t]*$`,
  "m",
);
const EVIDENCE_MAX_LINES = 200;
const EVIDENCE_MAX_CHARS = 8000;

export type AgentProtectionMechanism = "agent-config-write" | "agent-git-state-write";

export type AgentProtectionHandoff = {
  mechanism: AgentProtectionMechanism;
  // 対象の見出しラベル（保護対象パス / Git 状態フィールド）。
  subjectLabel: string;
  subjects: readonly string[];
  // 標準エラーへ出力するものと同じ 1 行の block メッセージ。
  reason: string;
  evidenceLabel: string;
  evidenceLanguage: "diff" | "text";
  evidence: string;
};

function inlineText(value: string): string {
  return stripTerminalControlSequences(value)
    .replace(/[\r\n]+/g, " ")
    .replace(/`/g, "'")
    .trim();
}

export function truncateProtectionEvidence(text: string): string {
  const normalized = stripTerminalControlSequences(text).replace(/\r\n/g, "\n").trimEnd();
  if (normalized === "") return "";
  const lines = normalized.split("\n");
  const limited =
    lines.length > EVIDENCE_MAX_LINES
      ? [
          ...lines.slice(0, EVIDENCE_MAX_LINES),
          `... (${lines.length - EVIDENCE_MAX_LINES} 行を省略)`,
        ]
      : lines;
  const joined = limited.join("\n");
  if (joined.length <= EVIDENCE_MAX_CHARS) return joined;
  return `${joined.slice(0, EVIDENCE_MAX_CHARS)}\n... (文字数上限で切り詰め)`;
}

// 差分がコードフェンスを含んでも result の構造を壊さないよう、内容より長いフェンスを使う。
function fenceFor(text: string): string {
  const runs = [...text.matchAll(/^\s*(`{3,})/gm)].map((match) => match[1].length);
  return "`".repeat(Math.max(3, ...runs, 0) + (runs.length > 0 ? 1 : 0));
}

export function renderProtectionHandoff(
  handoff: AgentProtectionHandoff,
  agentRecorded: boolean,
): string {
  const subjects =
    handoff.subjects.length === 0
      ? "なし"
      : handoff.subjects.map((subject) => `\`${inlineText(subject)}\``).join(", ");
  const evidence = truncateProtectionEvidence(handoff.evidence);
  const fence = fenceFor(evidence);
  const agentNote = agentRecorded
    ? "この節の上に agent が記入した申し送りを参照する。"
    : "agent の記入なし。";
  const lines = [
    PROTECTION_HANDOFF_MARKER,
    "",
    `**保護機構による自動記録**: \`${handoff.mechanism}\` が agent の変更を止めた。適用するかどうかは人または対話型 orchestrator が agent 実行外で判断する。`,
    "",
    `- ${handoff.subjectLabel}: ${subjects}`,
    `- 変更理由: ${agentNote}${agentRecorded ? "" : "自動記録では意図までは復元できないため、下の差分と block メッセージから判断する。"}`,
    `- 変更後に必要な検証: ${agentNote}${agentRecorded ? "" : "適用者が対象設定に対応する test / hook / CI 検証を判断する。"}`,
    `- block メッセージ: \`${inlineText(handoff.reason)}\``,
    "",
  ];
  if (evidence === "") {
    lines.push(`${handoff.evidenceLabel}: 取得できなかった（対象は上記のとおり）。`);
    return lines.join("\n");
  }
  lines.push(
    `${handoff.evidenceLabel}:`,
    "",
    `${fence}${handoff.evidenceLanguage}`,
    evidence,
    fence,
  );
  return lines.join("\n");
}

function normalizeDocument(content: string): string {
  return `${content
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\n+$/, "")}\n`;
}

// 申し送り節のうち、agent が書いた部分だけを取り出す。テンプレートのプレースホルダのままなら
// 未記入として扱い、過去の自動記録（マーカー以降）は毎回置き換える。
function agentHandoffText(section: string): string {
  const markerIndex = section.indexOf(PROTECTION_HANDOFF_MARKER);
  const text = (markerIndex === -1 ? section : section.slice(0, markerIndex)).trim();
  if (text === "" || text.includes("_TODO_")) return "";
  return text;
}

function sectionRange(content: string, heading: RegExpExecArray): { start: number; end: number } {
  const start = heading.index + heading[0].length;
  const rest = content.slice(start);
  const next = /^##\s+/m.exec(rest);
  return { start, end: next ? start + next.index : content.length };
}

function nextSectionNumber(content: string): number {
  const numbers = [...content.matchAll(/^##\s+(\d+)\./gm)].map((match) => Number(match[1]));
  return numbers.length === 0 ? 1 : Math.max(...numbers) + 1;
}

/**
 * result 本文へ保護機構の申し送りを反映する。申し送り節（edit result）があればその節へ、
 * 無ければ専用節を追加する。同じ result へ複数回記録された場合は、直前の自動記録を置き換える。
 */
export function applyProtectionHandoff(content: string, handoff: AgentProtectionHandoff): string {
  const normalized = content.replace(/\r\n/g, "\n");

  const handoffHeading = HANDOFF_SECTION_HEADING.exec(normalized);
  if (handoffHeading) {
    const { start, end } = sectionRange(normalized, handoffHeading);
    const agentText = agentHandoffText(normalized.slice(start, end));
    const body = [agentText, renderProtectionHandoff(handoff, agentText !== "")]
      .filter((part) => part !== "")
      .join("\n\n");
    return normalizeDocument(
      `${normalized.slice(0, start)}\n\n${body}\n\n${normalized.slice(end)}`,
    );
  }

  const protectionHeading = PROTECTION_SECTION_HEADING.exec(normalized);
  if (protectionHeading) {
    const { start, end } = sectionRange(normalized, protectionHeading);
    return normalizeDocument(
      `${normalized.slice(0, start)}\n\n${renderProtectionHandoff(handoff, false)}\n\n${normalized.slice(end)}`,
    );
  }

  const heading = `## ${nextSectionNumber(normalized)}. ${PROTECTION_HANDOFF_HEADING_TITLE}`;
  return normalizeDocument(
    `${normalized}\n\n${heading}\n\n${renderProtectionHandoff(handoff, false)}`,
  );
}

/**
 * result ファイルへ申し送りを書き込む。result が無い run（--deliverable の一部など）や
 * 書き込みに失敗した場合は false を返し、block 自体は呼び出し側の経路をそのまま通す。
 */
export function recordProtectionHandoff(
  resultPath: string | undefined,
  handoff: AgentProtectionHandoff,
): boolean {
  if (!resultPath || !existsSync(resultPath)) return false;
  try {
    const content = readFileSync(resultPath, "utf8");
    const updated = applyProtectionHandoff(content, handoff);
    if (updated === content) return false;
    writeFileSync(resultPath, updated, "utf8");
    return true;
  } catch {
    // 申し送りを書けないこと自体で block 経路を壊さない。block と終了コードは呼び出し側が担う。
    return false;
  }
}

// 差分の収集に失敗しても block 経路を止めない。対象と block メッセージだけでも記録する。
function collectEvidence(collect: () => string): string {
  try {
    return collect();
  } catch {
    return "";
  }
}

export function recordProtectedConfigBlock(params: {
  resultPath?: string;
  repoRoot: string;
  paths: readonly string[];
  reason: string;
}): boolean {
  return recordProtectionHandoff(params.resultPath, {
    mechanism: "agent-config-write",
    subjectLabel: "対象パス",
    subjects: params.paths,
    reason: params.reason,
    evidenceLabel: "提案差分",
    evidenceLanguage: "diff",
    evidence: collectEvidence(() =>
      describeAgentProtectedConfigChanges(params.repoRoot, params.paths),
    ),
  });
}

export function recordGitStateBlock(params: {
  resultPath?: string;
  repoRoot: string;
  before: AgentGitStateSnapshot;
  fields: readonly string[];
  reason: string;
}): boolean {
  return recordProtectionHandoff(params.resultPath, {
    mechanism: "agent-git-state-write",
    subjectLabel: "対象フィールド",
    subjects: params.fields,
    reason: params.reason,
    evidenceLabel: "検知した変更",
    evidenceLanguage: "text",
    evidence: collectEvidence(() =>
      describeAgentGitStateChanges(params.repoRoot, params.before, params.fields),
    ),
  });
}
