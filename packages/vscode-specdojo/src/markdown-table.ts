export function formatMarkdownTable(input: string, cursorLine: number): string {
  const lines = input.split(/\r?\n/);

  function isDelimiterCell(cell: string): boolean {
    return /^:?-+:?:?$/.test(cell.trim());
  }

  function normalizeDelimiterCell(cell: string): string {
    const trimmed = cell.trim();
    const leftAligned = trimmed.startsWith(":");
    const rightAligned = trimmed.endsWith(":");
    if (leftAligned && rightAligned) return ":---:";
    if (leftAligned) return ":---";
    if (rightAligned) return "---:";
    return "---";
  }

  function splitRow(line: string): { indent: string; cells: string[] } {
    const indent = line.match(/^\s*/)?.[0] ?? "";
    const inner = line.trim().replace(/^\|/, "").replace(/\|$/, "");
    return { indent, cells: inner.split("|") };
  }

  function isDelimiterRow(line: string): boolean {
    const trimmed = line.trim();
    if (!/^[\s|:-]+$/.test(trimmed)) return false;
    const { cells } = splitRow(trimmed);
    return cells.length > 1 && cells.every(isDelimiterCell);
  }

  function isTableRow(line: string | undefined): boolean {
    return (line?.match(/\|/g)?.length ?? 0) >= 2;
  }

  const index = cursorLine - 1;
  if (!isTableRow(lines[index])) return input;

  let top = index;
  while (top > 0 && isTableRow(lines[top - 1])) top--;

  let bottom = index;
  while (bottom < lines.length - 1 && isTableRow(lines[bottom + 1])) bottom++;

  if (top + 1 > bottom || !isDelimiterRow(lines[top + 1])) return input;

  let changed = false;
  const header = splitRow(lines[top]);
  const delimiter = splitRow(lines[top + 1]);

  const newHeader = `${header.indent}| ${header.cells.map((cell) => cell.trim()).join(" | ")} |`;
  const newDelimiter = `${delimiter.indent}| ${delimiter.cells
    .map(normalizeDelimiterCell)
    .join(" | ")} |`;
  if (newHeader !== lines[top]) {
    lines[top] = newHeader;
    changed = true;
  }
  if (newDelimiter !== lines[top + 1]) {
    lines[top + 1] = newDelimiter;
    changed = true;
  }

  for (let rowIndex = top + 2; rowIndex <= bottom; rowIndex++) {
    const row = splitRow(lines[rowIndex]);
    const newRow = `${row.indent}| ${row.cells.map((cell) => cell.trim()).join(" | ")} |`;
    if (newRow !== lines[rowIndex]) {
      lines[rowIndex] = newRow;
      changed = true;
    }
  }

  return changed ? lines.join("\n") : input;
}
