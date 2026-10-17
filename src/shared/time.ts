export function nowUtcIsoSeconds(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function isUtcIsoSeconds(ts: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(ts);
}

export function formatDateOnlyUtc(dt: Date): string {
  const yyyy = dt.getUTCFullYear().toString().padStart(4, "0");
  const mm = (dt.getUTCMonth() + 1).toString().padStart(2, "0");
  const dd = dt.getUTCDate().toString().padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function normalizeDateOnly(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return formatDateOnlyUtc(value);
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;
  const m = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];

  const dt = new Date(trimmed);
  if (Number.isNaN(dt.getTime())) return null;
  return formatDateOnlyUtc(dt);
}
