export type YamlRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is YamlRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function records(value: unknown): YamlRecord[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

export function code(value: string): string {
  const runs = value.match(/`+/g) ?? [];
  const fence = "`".repeat(Math.max(1, ...runs.map((run) => run.length + 1)));
  return `${fence} ${value} ${fence}`.replace(/^` ([^`]+) `$/, "`$1`");
}

// Markdown の参照とコードを保ち、YAML に含まれるパスのプレースホルダを HTML として解釈させない。
function text(value: string): string {
  return value
    .split(/(`+[^`]*`+|\[\[[^\]]+\]\]|\[[^\]]*\]\([^)]*\)|https?:\/\/[^\s<>]+)/g)
    .map((part, index) => {
      if (index % 2 === 1) return /^https?:/.test(part) ? `<${part}>` : part;
      return part
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\b[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)+\b/g, (identifier) => code(identifier));
    })
    .join("");
}

export function valueText(value: unknown): string {
  if (value === undefined || value === null || value === "") return "-";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (Array.isArray(value)) return value.length ? value.map(valueText).join(" / ") : "-";
  if (isRecord(value)) {
    return (
      Object.entries(value)
        .map(([key, entry]) => `${code(key)}: ${valueText(entry)}`)
        .join(" / ") || "-"
    );
  }
  return text(String(value));
}

export function cell(value: string): string {
  return value
    .replace(/\s*[\r\n]+\s*/g, " ")
    .replace(
      /(\\*)\|/g,
      (_match, slashes: string) => `${slashes}${slashes.length % 2 === 0 ? "\\" : ""}|`,
    );
}

export function table(headers: string[], rows: string[][]): string {
  return [
    "<!-- prettier-ignore -->",
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map((entry) => cell(entry) || "-").join(" | ")} |`),
  ].join("\n");
}

export type Column = [key: string, label: string];

export function recordTable(items: YamlRecord[], columns: Column[]): string {
  return table(
    columns.map(([, label]) => label),
    items.map((item) => columns.map(([key]) => valueText(item[key]))),
  );
}

export function properties(value: unknown, columns?: Column[]): string {
  const entries = isRecord(value) ? value : {};
  const selected = columns ?? Object.keys(entries).map((key): Column => [key, code(key)]);
  return table(
    ["項目", "内容"],
    selected.map(([key, label]) => [label, valueText(entries[key])]),
  );
}

export class TableBody {
  private sections: string[] = [];

  section(title: string, body: string): void {
    this.sections.push(`## ${this.sections.length + 1}. ${title}\n\n${body}`);
  }

  render(): string {
    return [...this.sections, `## ${this.sections.length + 1}. YAML の正本\n`].join("\n\n");
  }
}
