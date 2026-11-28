import { readFileSync } from "node:fs";
import {
  FINDING_RE,
  isRecord,
  parseMarkdown,
  type GradeFindingInput,
  type GradeTarget,
  type MarkdownDocument,
} from "./core.js";
import type { GradeSizeLimits, GradeSizeThreshold } from "../review/types.js";
import type { GradeResult, GradeSizeMetrics } from "../shared/grade-result.js";
import { resolveSpecdojoPathIfExists } from "../shared/template-resolution.js";

// 機械で測る大きさの指標（PJR-2Q0G）。LLM を使わず、本文の空白を除いた文字数から
// 宣言された sample との比・前回の grade からの増え方・文書の運用と検証の章の割合を求める。
// 指標は冗長さの兆候であり、それだけでは減点しない。減点するかは vp-arc-conciseness の
// 判定と組み合わせて決める（combineSizeFindings を参照）。
export const SIZE_METRICS_VIEWPOINT = "vp-arc-conciseness";

const TABLE_SEPARATOR_RE = /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)*\|?\s*$/;
const HEADING_RE = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const FENCE_RE = /^\s*(`{3,}|~{3,})/;

type SizeLine = { text: string; characters: number };

// 空白（改行を含む）を除いた文字数を数える。表の区切り行と grade の finding コメントは
// 文書の内容ではないため除く（PJR-8S4T で sld の大きさを測ったときと同じ数え方）。
export function countSizeCharacters(text: string): number {
  return text
    .replace(FINDING_RE, "")
    .split(/\r?\n/)
    .filter((line) => !TABLE_SEPARATOR_RE.test(line))
    .reduce((sum, line) => sum + [...line.replace(/\s+/gu, "")].length, 0);
}

function sizeLines(body: string): SizeLine[] {
  return body
    .replace(FINDING_RE, "")
    .split(/\r?\n/)
    .map((text) => ({
      text,
      characters: TABLE_SEPARATOR_RE.test(text) ? 0 : [...text.replace(/\s+/gu, "")].length,
    }));
}

// 各行を、その行を含む最も深い見出しの節に割り当て、その見出しの文言が operations_headings の
// いずれかを含む行を、文書の運用・検証の章として数える。親の章名に「検証」を含んでも、
// 隣接仕様との対応のように別の主題の小節は数えない。H1（文書のタイトル）の直下は対象にしない。
// コードフェンス内の `#` は見出しとみなさない。
export function measureOperationsCharacters(body: string, headings: readonly string[]): number {
  if (headings.length === 0) return 0;
  let total = 0;
  let isOperations = false;
  let fence: string | undefined;
  for (const line of sizeLines(body)) {
    const fenceMatch = line.text.match(FENCE_RE);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (fence === undefined) fence = marker;
      else if (fence === marker) fence = undefined;
    }
    const heading = fence === undefined && !fenceMatch ? line.text.match(HEADING_RE) : null;
    if (heading) {
      isOperations =
        heading[1].length >= 2 && headings.some((keyword) => heading[2].includes(keyword));
    }
    if (isOperations) total += line.characters;
  }
  return total;
}

// 成果物が宣言した rulebook の sample を、id から解決する。sample の id はファイル名ベース
// （`specdojo:<name>-sample` → `docs/ja/specdojo/samples/<name>-sample.md`）であり、rulebook も
// 同じである。利用リポジトリに置いた kata を優先し、なければ package 同梱の kata を使う。
// 解決できない場合は比を求めない。
export function resolveDeclaredSamplePath(metadata: Record<string, unknown>): string | undefined {
  const direct = firstSpecdojoId(metadata.sample);
  if (direct) return kataPath("samples", direct);
  const rulebookId = firstSpecdojoId(metadata.rulebook);
  if (!rulebookId) return undefined;
  const rulebookPath = kataPath("rulebooks", rulebookId);
  if (!rulebookPath) return undefined;
  try {
    const rulebook = parseMarkdown(readFileSync(rulebookPath, "utf8"), rulebookPath);
    const sampleId = firstSpecdojoId((rulebook.data.specdojo as Record<string, unknown>).sample);
    return sampleId ? kataPath("samples", sampleId) : undefined;
  } catch {
    // 壊れた rulebook は rulebook 自身の grade と lint が扱う。大きさの指標は比を省いて続ける。
    return undefined;
  }
}

function firstSpecdojoId(value: unknown): string | undefined {
  const candidates = Array.isArray(value) ? value : [value];
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const match = candidate.trim().match(/^specdojo:([a-z0-9][a-z0-9-]*)$/);
    if (match) return match[1];
  }
  return undefined;
}

function kataPath(kind: "samples" | "rulebooks", localId: string): string | undefined {
  return resolveSpecdojoPathIfExists(`docs/ja/specdojo/${kind}/${localId}.md`);
}

export function sampleCharacters(path: string): number | undefined {
  try {
    const sample = parseMarkdown(readFileSync(path, "utf8"), path);
    return countSizeCharacters(sample.body);
  } catch {
    return undefined;
  }
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function measureSizeMetrics(opts: {
  body: string;
  limits?: GradeSizeLimits;
  sample?: { id: string; characters: number };
  previousCharacters?: number;
}): GradeSizeMetrics {
  const characters = countSizeCharacters(opts.body);
  const operationsCharacters = measureOperationsCharacters(
    opts.body,
    opts.limits?.operations_headings ?? [],
  );
  return {
    characters,
    ...(opts.sample && opts.sample.characters > 0
      ? {
          sample: opts.sample.id,
          sample_characters: opts.sample.characters,
          sample_ratio: round(characters / opts.sample.characters),
        }
      : {}),
    ...(opts.previousCharacters !== undefined && opts.previousCharacters > 0
      ? {
          previous_characters: opts.previousCharacters,
          growth_ratio: round(characters / opts.previousCharacters),
        }
      : {}),
    ...(opts.limits?.operations_headings
      ? {
          operations_characters: operationsCharacters,
          operations_ratio: characters > 0 ? round(operationsCharacters / characters) : 0,
        }
      : {}),
  };
}

function exceeded(value: number, threshold: GradeSizeThreshold): "major" | "minor" | undefined {
  if (value >= threshold.major) return "major";
  if (value >= threshold.minor) return "minor";
  return undefined;
}

const percent = (value: number): string => `${Math.round(value * 100)}%`;

// 上限を超えた指標を finding にする。どこを削れるかは機械では分からないため、message には
// 指標と、vp-arc-conciseness の判定で削れる箇所を確かめることだけを書く。
export function sizeLimitFindings(
  metrics: GradeSizeMetrics,
  limits: GradeSizeLimits | undefined,
): GradeFindingInput[] {
  if (!limits) return [];
  const findings: GradeFindingInput[] = [];
  const sampleLimit = limits.sample_ratio;
  if (sampleLimit && metrics.sample_ratio !== undefined && metrics.sample_characters) {
    const severity = exceeded(metrics.sample_ratio, sampleLimit);
    if (
      severity &&
      metrics.characters - metrics.sample_characters >= (sampleLimit.min_characters ?? 0)
    ) {
      findings.push({
        severity,
        line: 1,
        message: `大きさの指標: 本文が宣言された sample（${metrics.sample}）の ${metrics.sample_ratio} 倍（${metrics.characters.toLocaleString("en-US")} 字、sample は ${metrics.sample_characters.toLocaleString("en-US")} 字）で、上限（minor ${sampleLimit.minor} 倍・major ${sampleLimit.major} 倍）を超えています。正本の再掲や同じ判断の言い直しを削る・まとめる・参照に置き換えてください。`,
      });
    }
  }
  const growthLimit = limits.growth_ratio;
  if (growthLimit && metrics.growth_ratio !== undefined && metrics.previous_characters) {
    const severity = exceeded(metrics.growth_ratio, growthLimit);
    if (
      severity &&
      metrics.characters - metrics.previous_characters >= (growthLimit.min_characters ?? 0)
    ) {
      findings.push({
        severity,
        line: 1,
        message: `大きさの指標: 本文が前回の grade の時点（${metrics.previous_characters.toLocaleString("en-US")} 字）から ${metrics.growth_ratio} 倍（${metrics.characters.toLocaleString("en-US")} 字）に増え、上限（minor ${growthLimit.minor} 倍・major ${growthLimit.major} 倍）を超えています。手直しで足した記述が既存の判断の言い直しや正本の再掲になっていないか確かめ、削る・まとめる・参照に置き換えてください。`,
      });
    }
  }
  const operationsLimit = limits.operations_ratio;
  if (operationsLimit && metrics.operations_ratio !== undefined) {
    const severity = exceeded(metrics.operations_ratio, operationsLimit);
    if (severity && (metrics.operations_characters ?? 0) >= (operationsLimit.min_characters ?? 0)) {
      findings.push({
        severity,
        line: 1,
        message: `大きさの指標: 文書の運用・検証の章が本文の ${percent(metrics.operations_ratio)}（${(metrics.operations_characters ?? 0).toLocaleString("en-US")} 字）を占め、上限（minor ${percent(operationsLimit.minor)}・major ${percent(operationsLimit.major)}）を超えています。共通の正本（ドキュメントメタ情報標準など）にある運用の記述の再掲と、文書の品質の検査を業務の検証に入れた記述を、正本への参照に置き換えてください。`,
      });
    }
  }
  return findings;
}

// 機械の指標の finding を vp-arc-conciseness の判定と組み合わせる。agent が削れる箇所を
// minor 以上の finding として示した場合だけ、指標の重大度で減点する。agent が削れる箇所を
// 示さなかった場合（上限を超えた分が判断に要る背景・制約・例外・完了条件である場合）は、
// 指標を note として記録するだけにし、長さだけでは減点しない。
export function combineSizeFindings<
  T extends { id: string; level: number; findings?: GradeFindingInput[] },
>(
  viewpoints: readonly T[],
  sizeFindings: readonly GradeFindingInput[],
  levelCap: (findings: readonly GradeFindingInput[]) => number,
): T[] {
  if (sizeFindings.length === 0) return [...viewpoints];
  return viewpoints.map((viewpoint) => {
    if (viewpoint.id !== SIZE_METRICS_VIEWPOINT) return viewpoint;
    const agentFindings = viewpoint.findings ?? [];
    const hasRemovable = agentFindings.some(
      (finding) => finding.severity !== "note" && !isSizeMetricMessage(finding.message),
    );
    const metricFindings = sizeFindings.map((finding) =>
      hasRemovable ? { ...finding } : { ...finding, severity: "note" as const },
    );
    const findings = [
      ...agentFindings.filter((finding) => !isSizeMetricMessage(finding.message)),
      ...metricFindings,
    ];
    return { ...viewpoint, findings, level: Math.min(viewpoint.level, levelCap(findings)) };
  });
}

export function isSizeMetricMessage(message: string): boolean {
  return message.startsWith("大きさの指標:");
}

// grade plan と grade apply が同じ指標を使うための入口。YAML の文書は章の構造と sample の
// 対応がないため測らない。sample との比は成果物（deliverable）だけで求める。kata の rulebook も
// `sample` を宣言するが、rulebook と sample は役割が違い、大きさを比べても冗長さを示さない。
export function documentSizeMetrics(opts: {
  document: MarkdownDocument;
  target: GradeTarget;
  limits?: GradeSizeLimits;
  previous?: GradeResult;
}): { metrics: GradeSizeMetrics; findings: GradeFindingInput[] } | undefined {
  if (opts.document.format === "yaml") return undefined;
  const metadata = isRecord(opts.document.data.specdojo) ? opts.document.data.specdojo : {};
  const samplePath =
    opts.target === "deliverable" ? resolveDeclaredSamplePath(metadata) : undefined;
  const sampleId = samplePath ? sampleDocumentId(samplePath) : undefined;
  const characters = samplePath ? sampleCharacters(samplePath) : undefined;
  const metrics = measureSizeMetrics({
    body: opts.document.body,
    limits: opts.limits,
    sample: sampleId && characters !== undefined ? { id: sampleId, characters } : undefined,
    previousCharacters: opts.previous?.size_metrics?.characters,
  });
  return { metrics, findings: sizeLimitFindings(metrics, opts.limits) };
}

function sampleDocumentId(path: string): string | undefined {
  try {
    const id = (
      parseMarkdown(readFileSync(path, "utf8"), path).data.specdojo as Record<string, unknown>
    ).id;
    return typeof id === "string" && id.trim() ? id.trim() : undefined;
  } catch {
    return undefined;
  }
}
