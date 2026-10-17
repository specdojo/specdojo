import { stripTerminalControlSequences } from "../exec/shared.js";

const MAX_DASHBOARD_CELL_LENGTH = 200;

// dashboard の表へは event や subprocess 由来の文字列も入る。表へ埋める直前に
// ターミナル制御シーケンスと改行類を除き、列区切りをエスケープして長さを制限する。
export function sanitizeDashboardCell(text: string): string {
  const singleLine = stripTerminalControlSequences(text)
    .replace(/[\t\r\n]+/g, " ")
    .replace(/ +/g, " ")
    .trim();
  const truncated =
    singleLine.length <= MAX_DASHBOARD_CELL_LENGTH
      ? singleLine
      : `${singleLine.slice(0, MAX_DASHBOARD_CELL_LENGTH)}…`;
  return truncated.replace(/\|/g, "\\|");
}
