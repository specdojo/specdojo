import { isFindingCause, type FindingCause } from "./finding-cause.js";

export const CONDENSE_CATEGORIES = [
  "repetition",
  "table-prose",
  "figure-prose",
  "unneeded-background",
  "canonical-restatement",
] as const;
export const CONDENSE_ACTIONS = ["delete", "merge", "reference", "retain"] as const;

export type CondenseRecord = {
  location: string;
  category: (typeof CONDENSE_CATEGORIES)[number];
  action: (typeof CONDENSE_ACTIONS)[number];
  /** Why this change preserves meaning, or why the candidate must be retained. */
  reason: string;
  cause: FindingCause;
};

export function isCondenseRecords(value: unknown): value is CondenseRecord[] {
  return (
    Array.isArray(value) &&
    value.length <= 100 &&
    value.every((entry: unknown) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
      const record = entry as Record<string, unknown>;
      const text = (value: unknown): value is string =>
        typeof value === "string" && value.trim().length > 0 && value.length <= 4000;
      return (
        Object.keys(record).length === 5 &&
        text(record.location) &&
        text(record.reason) &&
        CONDENSE_CATEGORIES.includes(record.category as CondenseRecord["category"]) &&
        CONDENSE_ACTIONS.includes(record.action as CondenseRecord["action"]) &&
        isFindingCause(record.cause)
      );
    })
  );
}
