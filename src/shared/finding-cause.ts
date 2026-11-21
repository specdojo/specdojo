/** Shared by grade findings and edit records such as condense. */
export type FindingCause =
  | { type: "document" }
  | { type: "kata"; kind: "rulebook" | "recipe" | "sample" | "template"; location: string };

export function isFindingCause(value: unknown): value is FindingCause {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const cause = value as Record<string, unknown>;
  if (cause.type === "document") return Object.keys(cause).length === 1;
  return (
    cause.type === "kata" &&
    typeof cause.kind === "string" &&
    ["rulebook", "recipe", "sample", "template"].includes(cause.kind) &&
    typeof cause.location === "string" &&
    cause.location.trim().length > 0 &&
    Object.keys(cause).every((key) => ["type", "kind", "location"].includes(key))
  );
}

/** Legacy findings without a cause belong to the document. */
export function findingCause(finding: { cause?: FindingCause }): FindingCause {
  const cause = finding.cause;
  return cause?.type === "kata"
    ? { type: "kata", kind: cause.kind, location: cause.location }
    : { type: "document" };
}
