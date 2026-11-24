import type { ReporterOutput } from "./reporter-output.js";

// 見出しの末尾に付くと MD026 になる句読点。
const HEADING_TRAILING_PUNCTUATION = /[.,;:!。、，；：！]+\s*$/;

// 値を変えてはいけない構造のキー。
const PRESERVED_KEYS = new Set(["path", "verdict", "mode"]);

/**
 * 自由記述の 1 つの文字列で、意味を変えずに直せる Markdown の違反だけを直す。
 * - MD038: コードの書式の内側の前後の空白を除く。
 * - MD026: 見出し行の末尾の句読点を除く。
 * - 自由記述の中のコードブロック: 囲みの行（```）だけを除き、中身は残す。
 */
export function repairReporterText(text: string): string {
  return text
    .split("\n")
    .filter((line) => !/^\s*(```|~~~)/.test(line))
    .map((line) => {
      const repaired = line.replace(
        /(`+)([^`\n]+)\1(?!`)/g,
        (_match, fence: string, body: string) => `${fence}${body.trim() || body}${fence}`,
      );
      return /^#{1,6}\s/.test(repaired)
        ? repaired.replace(HEADING_TRAILING_PUNCTUATION, "")
        : repaired;
    })
    .join("\n");
}

function repairValue(value: unknown): unknown {
  if (typeof value === "string") return repairReporterText(value);
  if (Array.isArray(value)) return value.map(repairValue);
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        PRESERVED_KEYS.has(key) ? entry : repairValue(entry),
      ]),
    );
  }
  return value;
}

/** スキーマを通った出力の自由記述を機械的に直す。構造と enum・path の値は変えない。 */
export function repairReporterOutput(output: ReporterOutput): ReporterOutput {
  return repairValue(output) as ReporterOutput;
}
