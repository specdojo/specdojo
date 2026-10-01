import { readFileSync, writeFileSync } from "node:fs";
import { productMergeState, type ProductMergeState } from "./exec-repo-integration.js";
import { productIntegrationTarget } from "./exec-task-repos.js";
import { gitOutput, gitResult, type ProductWorktree } from "./exec-worktree.js";

// PJR-30SW: プロダクト側の commit と merge commit へ付ける `Refs:` trailer と、統合後に result へ
// 記録する trace 表。trace key は PJR-1SXK の決定どおり `<project-id>:<item-id>` とする。

/** Heading text of the trace section the runner appends to the result. */
export const RESULT_TRACE_HEADING = "トレーサビリティ";

/** Project-qualified trace key (`<project-id>:<item-id>`) used by the `Refs:` trailer. */
export function traceKey(projectId: string, itemId: string): string {
  const project = projectId.trim();
  const item = itemId.trim();
  if (!project || !item) {
    throw new Error(
      `trace key requires a project id and an item id (got "${projectId}:${itemId}")`,
    );
  }
  return `${project}:${item}`;
}

/** `Refs:` trailer line for a register item (`Refs: <project-id>:<item-id>`). */
export function refsTrailer(projectId: string, itemId: string): string {
  return `Refs: ${traceKey(projectId, itemId)}`;
}

/**
 * Append trailer lines to a commit message as the last paragraph. Trailers already present in the
 * message are not duplicated, so retried commits keep a single `Refs:` line.
 */
export function withCommitTrailers(message: string, trailers: readonly string[]): string {
  const body = message.trimEnd();
  const existing = new Set(body.split("\n").map((line) => line.trim()));
  const missing = trailers.filter((trailer) => !existing.has(trailer.trim()));
  if (missing.length === 0) return body;
  return `${body}\n\n${missing.join("\n")}`;
}

/**
 * Message of the project-side merge commit of a register item: the subject, then the transition,
 * the agents, and the project-qualified `Refs:` trailer.
 */
export function registerProjectMergeMessage(params: {
  subject: string;
  executor: string;
  reporter: string;
  projectId: string;
  itemId: string;
}): string {
  return (
    `${params.subject}\n\n` +
    `Transition: start → review\nExecutor: ${params.executor}\nReporter: ${params.reporter}\n` +
    refsTrailer(params.projectId, params.itemId)
  );
}

export type ProductIntegrationTrace = {
  repo: string;
  integrationBranch: string;
  state: ProductMergeState;
  // 統合先が実装変更を含んだ直後の commit（runner が作った merge commit）。変更なしは null。
  commit: string | null;
  // merge commit の subject から分かる PR 参照（例: `#123`）。分からなければ null。
  pullRequest: string | null;
};

// 統合先の first-parent 上で、exec branch の先端を初めて含んだ commit（= merge commit）。
function integrationCommitOf(product: ProductWorktree, target: string): string | null {
  const tip = gitResult(product.repoRoot, ["rev-parse", "--verify", `${product.branch}^{commit}`]);
  if (tip.status !== 0) return null;
  const tipSha = String(tip.stdout).trim();
  const lines = gitOutput(product.repoRoot, [
    "rev-list",
    "--first-parent",
    "--ancestry-path",
    `${tipSha}..${target}`,
  ])
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.at(-1) ?? null;
}

const PULL_REQUEST_SUBJECT = /^Merge pull request (#\d+)\b/;

function pullRequestOf(repoRoot: string, commit: string): string | null {
  const subject = gitOutput(repoRoot, ["log", "-1", "--format=%s", commit]).trim();
  return PULL_REQUEST_SUBJECT.exec(subject)?.[1] ?? null;
}

/** Integration snapshot of one product repository, read from the Git state after integration. */
export function productIntegrationTrace(product: ProductWorktree): ProductIntegrationTrace {
  const integrationBranch = productIntegrationTarget(product);
  const state = productMergeState(product);
  const commit = state === "merged" ? integrationCommitOf(product, integrationBranch) : null;
  return {
    repo: product.name,
    integrationBranch,
    state,
    commit,
    pullRequest: commit ? pullRequestOf(product.repoRoot, commit) : null,
  };
}

const NOT_APPLICABLE = "not applicable";

function traceRows(
  key: string,
  traces: readonly ProductIntegrationTrace[],
  recordedAt: string,
): string[][] {
  return traces.map((trace) => [
    `\`${key}\``,
    `\`${trace.repo}\``,
    `\`${trace.integrationBranch}\``,
    trace.pullRequest ?? NOT_APPLICABLE,
    trace.commit
      ? `\`${trace.commit}\``
      : trace.state === "unchanged"
        ? `${NOT_APPLICABLE} (no changes)`
        : `${NOT_APPLICABLE} (not integrated)`,
    recordedAt,
  ]);
}

function renderTable(header: readonly string[], rows: readonly string[][]): string[] {
  const escape = (cell: string): string => cell.replace(/\|/g, "\\|");
  const all = [header.map(escape), ...rows.map((row) => row.map(escape))];
  const widths = header.map((cell, column) =>
    Math.max(3, cell.length, ...all.map((row) => (row[column] ?? "").length)),
  );
  const line = (cells: readonly string[]): string =>
    `| ${cells.map((cell, column) => cell.padEnd(widths[column] ?? 0)).join(" | ")} |`;
  return [
    line(all[0] ?? []),
    `| ${widths.map((width) => "-".repeat(width)).join(" | ")} |`,
    ...all.slice(1).map(line),
  ];
}

/** Body of the trace section (without the heading). */
export function renderResultTraceBody(params: {
  traceKey: string;
  traces: readonly ProductIntegrationTrace[];
  recordedAt: string;
}): string {
  const table = renderTable(
    ["trace key", "repository", "integration branch", "PR", "commit snapshot", "recorded at"],
    traceRows(params.traceKey, params.traces, params.recordedAt),
  );
  // PJR-9KST: result は利用側プロジェクトの markdownlint 設定で検査され、既定の MD013（80 文字）が
  // 効くことがある。説明文は文ごとに改行して短く保ち、行長を内容で決められない表だけ MD013 を外す。
  return [
    "runner がプロダクトリポジトリを統合した後に記録した、統合先の commit snapshot です。",
    "プロジェクトリポジトリの統合は、この result を含む merge commit で確認します。",
    `その merge commit には \`Refs: ${params.traceKey}\` を付けます。`,
    "PR が `not applicable` の行は、runner がローカルで統合し PR を経由していません。",
    "",
    "<!-- markdownlint-disable MD013 -->",
    "",
    ...table,
    "",
    "<!-- markdownlint-enable MD013 -->",
  ].join("\n");
}

type MarkdownSection = { start: number; end: number; number: number; title: string };

// `## n. <title>` の見出しを、コードフェンスの内側を除いて列挙する。
function topLevelSections(lines: readonly string[]): MarkdownSection[] {
  const headings: Array<{ index: number; number: number; title: string }> = [];
  let fence: string | null = null;
  lines.forEach((line, index) => {
    const marker = /^\s*(```+|~~~+)/.exec(line)?.[1];
    if (marker) {
      if (fence === null) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null;
      return;
    }
    if (fence !== null) return;
    const match = /^## (\d+)\. (.+?)\s*$/.exec(line);
    if (match) headings.push({ index, number: Number(match[1]), title: match[2] ?? "" });
  });
  return headings.map((heading, position) => ({
    start: heading.index,
    end: headings[position + 1]?.index ?? lines.length,
    number: heading.number,
    title: heading.title,
  }));
}

/**
 * Insert or replace the trace section of a result Markdown. The section is appended as the next
 * numbered `##` chapter; a re-run (integration resume) replaces the previous section in place.
 */
export function upsertResultTraceSection(content: string, body: string): string {
  const lines = content.replace(/\r\n/g, "\n").replace(/\n+$/, "").split("\n");
  const sections = topLevelSections(lines);
  const existing = sections.find((section) => section.title === RESULT_TRACE_HEADING);
  if (existing) {
    const replaced = [
      ...lines.slice(0, existing.start),
      `## ${existing.number}. ${RESULT_TRACE_HEADING}`,
      "",
      body,
      ...(existing.end < lines.length ? ["", ...lines.slice(existing.end)] : []),
    ];
    return `${replaced.join("\n")}\n`;
  }
  const next = Math.max(0, ...sections.map((section) => section.number)) + 1;
  return `${[...lines, "", `## ${next}. ${RESULT_TRACE_HEADING}`, "", body].join("\n")}\n`;
}

/** Record the product integration snapshots in the result file. */
export function recordResultTrace(params: {
  resultPath: string;
  traceKey: string;
  traces: readonly ProductIntegrationTrace[];
  recordedAt?: string;
}): void {
  if (params.traces.length === 0) return;
  const body = renderResultTraceBody({
    traceKey: params.traceKey,
    traces: params.traces,
    recordedAt: params.recordedAt ?? new Date().toISOString(),
  });
  const content = readFileSync(params.resultPath, "utf8");
  const updated = upsertResultTraceSection(content, body);
  if (updated !== content) writeFileSync(params.resultPath, updated, "utf8");
}
