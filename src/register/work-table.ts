// 個票の「作業内容」の表が実績に合っているかを検査する。close の前に、未着手のまま
// 理由のない行や `_TODO_` の残った行を見つけ、完了を止める理由として返す。
const WORK_TABLE_HEADING_RE = /^##\s+(?:\d+\.\s*)?作業内容\s*$/;
const PLACEHOLDER_CELLS = new Set(["", "-", "_TODO_"]);
const DONE_STATE = "done";

function splitTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  // `\|` はセル内の文字であり、列の区切りではない。
  return trimmed.split(/(?<!\\)\|/).map((cell) => cell.trim());
}

// インラインコードの `_TODO_` は記法の説明であり、未記入の目印ではない。
function hasTodoMarker(cell: string): boolean {
  return cell.replace(/`[^`]*`/g, "").includes("_TODO_");
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function workTableLines(content: string): string[] {
  const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  const lines = body.split(/\r?\n/);
  const heading = lines.findIndex((line) => WORK_TABLE_HEADING_RE.test(line));
  if (heading < 0) return [];
  const section: string[] = [];
  for (const line of lines.slice(heading + 1)) {
    if (/^##\s+/.test(line)) break;
    section.push(line);
  }
  const start = section.findIndex((line) => line.trim().startsWith("|"));
  if (start < 0) return [];
  const endOffset = section.slice(start).findIndex((line) => !line.trim().startsWith("|"));
  return section.slice(start, endOffset < 0 ? undefined : start + endOffset);
}

// 状態が done でない行は、メモに残した理由があれば通す。理由のない行と、どの列であれ
// `_TODO_` の目印が残る行を問題として返す。表や状態の列がない個票は検査の対象外とする。
export function registerWorkTableIssues(content: string): string[] {
  const [header, separator, ...rows] = workTableLines(content).map(splitTableRow);
  if (!header || !separator || !isSeparatorRow(separator)) return [];
  const stateIndex = header.indexOf("状態");
  if (stateIndex < 0) return [];
  const noteIndex = header.indexOf("メモ");
  const numberIndex = header.indexOf("No");
  return rows.flatMap((cells, index) => {
    const label = `row ${numberIndex >= 0 && cells[numberIndex] ? cells[numberIndex] : index + 1}`;
    if (cells.some(hasTodoMarker)) {
      return [`${label} still contains _TODO_`];
    }
    const state = cells[stateIndex] ?? "";
    if (state === DONE_STATE) return [];
    const note = noteIndex >= 0 ? (cells[noteIndex] ?? "") : "";
    if (!PLACEHOLDER_CELLS.has(note)) return [];
    return [`${label} is "${state || "-"}" without a reason in メモ`];
  });
}

export function registerWorkTableIssueMessage(id: string, issues: readonly string[]): string {
  return (
    `the 作業内容 table of ${id} does not match the work done: ${issues.join("; ")}. ` +
    `Set each row to done, or write why it remains in メモ.`
  );
}
