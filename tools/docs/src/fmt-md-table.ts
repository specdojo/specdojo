import fs from "node:fs/promises";

async function main() {
  const file = process.argv[2];
  const cursorLine = Number(process.argv[3] ?? "0"); // 1-based
  if (!file || !cursorLine) return;

  const input = await fs.readFile(file, "utf8");
  const lines = input.split(/\r?\n/);

  function isDelimiterCell(c: string) {
    return /^:?-+:?:?$/.test(c.trim());
  }

  function normalizeDelimiterCell(c: string) {
    const t = c.trim();
    const l = t.startsWith(":");
    const r = t.endsWith(":");
    if (l && r) return ":---:";
    if (l) return ":---";
    if (r) return "---:";
    return "---";
  }

  function splitRow(line: string) {
    const indent = line.match(/^\s*/)?.[0] ?? "";
    const inner = line.trim().replace(/^\|/, "").replace(/\|$/, "");
    return { indent, cells: inner.split("|") };
  }

  function isDelimiterRow(line: string) {
    const t = line.trim();
    if (!/^[\s|:-]+$/.test(t)) return false;
    const { cells } = splitRow(t);
    return cells.length > 1 && cells.every(isDelimiterCell);
  }

  function isTableRow(line: string) {
    return (line.match(/\|/g)?.length ?? 0) >= 2;
  }

  const index = cursorLine - 1;
  if (!isTableRow(lines[index])) return;

  // 上へ探索
  let top = index;
  while (top > 0 && isTableRow(lines[top - 1])) top--;

  // 下へ探索
  let bottom = index;
  while (bottom < lines.length - 1 && isTableRow(lines[bottom + 1])) bottom++;

  // デリミタが無ければ表ではない
  if (top + 1 > bottom || !isDelimiterRow(lines[top + 1])) return;

  let changed = false;

  const h = splitRow(lines[top]);
  const d = splitRow(lines[top + 1]);

  const newHeader = `${h.indent}| ${h.cells.map((c) => c.trim()).join(" | ")} |`;
  const newDelim = `${d.indent}| ${d.cells.map(normalizeDelimiterCell).join(" | ")} |`;

  if (newHeader !== lines[top]) {
    lines[top] = newHeader;
    changed = true;
  }
  if (newDelim !== lines[top + 1]) {
    lines[top + 1] = newDelim;
    changed = true;
  }

  for (let i = top + 2; i <= bottom; i++) {
    const r = splitRow(lines[i]);
    const newRow = `${r.indent}| ${r.cells.map((c) => c.trim()).join(" | ")} |`;
    if (newRow !== lines[i]) {
      lines[i] = newRow;
      changed = true;
    }
  }

  if (changed) await fs.writeFile(file, lines.join("\n"), "utf8");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
