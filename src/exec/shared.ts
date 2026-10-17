import { randomBytes } from "node:crypto";
import { basename, relative } from "node:path";
import { toPortablePath } from "../shared/artifact-path.js";

export { toArtifactPath, toPortablePath } from "../shared/artifact-path.js";
export { ensureDir, listFilesRecursive, readJson, readYaml, writeJson } from "../shared/fs.js";
export {
  displayWidth,
  escapeMarkdownInline,
  expandTemplate,
  inlineCodeAnglePlaceholders,
  padEndDisplay,
  redactSensitiveText,
  stripTerminalControlSequences,
} from "../shared/text.js";
export {
  formatDateOnlyUtc,
  isUtcIsoSeconds,
  normalizeDateOnly,
  nowUtcIsoSeconds,
} from "../shared/time.js";

export function tsForFilenameUtc(ts: string): string {
  return ts.replace(/[-:]/g, "").replace("T", "T");
}

// worktree/branch 生成専用。project 修飾した task ID（`<projectId>:<taskId>`）を返す。
// projectId が未解決（env path override 等）の場合は bare のままにして後方互換を保つ。
// schedule 検索・plan/result ファイル名・claim には使わない（bare の task ID を使う）。
export function qualifyTaskId(projectId: string | undefined, taskId: string): string {
  return projectId ? `${projectId}:${taskId}` : taskId;
}

export function safeSlug(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9._-]/g, "_")
    .slice(0, 80);
}

export function randomHex(bytes: number): string {
  return randomBytes(bytes).toString("hex");
}

export function requireNonEmpty(name: string, v: unknown): string {
  if (typeof v !== "string" || v.trim().length === 0) throw new Error(`${name} is required`);
  return v.trim();
}

export function collectRepeatable(value: string, previous: string[]): string[] {
  return previous.concat([value]);
}

// CPM 由来の日数値（ES / EF / slack / duration 等）の表示用フォーマット。
// 浮動小数点誤差（例: 6.2509999999999994）を吸収し、小数点以下を最大2桁に丸める。
// JSON 等のデータ出力には使わず、Markdown 表示にのみ使う。
export function formatDays(value: number): string {
  return String(Math.round(value * 100) / 100);
}

export function parseKeyValuePairs(
  pairs: string[] | undefined,
): Record<string, string> | undefined {
  if (!pairs || pairs.length === 0) return undefined;
  const out: Record<string, string> = {};
  for (const p of pairs) {
    const idx = p.indexOf("=");
    if (idx <= 0) throw new Error(`Invalid key=value: ${p}`);
    const k = p.slice(0, idx).trim();
    const v = p.slice(idx + 1).trim();
    if (!k) throw new Error(`Empty key in: ${p}`);
    out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function isSchYamlFilename(path: string): boolean {
  const name = basename(path);
  return /^sch-.*\.(yaml|yml)$/.test(name);
}

export function sleepMs(ms: number): void {
  const sab = new SharedArrayBuffer(4);
  const int32 = new Int32Array(sab);
  Atomics.wait(int32, 0, 0, ms);
}

export function toScheduleFilePath(schedulePath: string, filePath: string): string {
  return toPortablePath(relative(schedulePath, filePath) || ".");
}
