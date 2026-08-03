export const SPECDOJO_PRACTICE_AUTHORITY = "specdojo";

const AUTHORITY_RE = /^[a-z][a-z0-9-]*$/;
const LOCAL_ID_RE = /^[a-z0-9][a-z0-9-]*$/;

export type PracticeIdParts = {
  authority?: string;
  localId: string;
};

// An authority expresses logical ownership and never becomes part of a filename.
export function parsePracticeId(id: string): PracticeIdParts {
  const separator = id.indexOf(":");
  if (separator < 0) return { localId: id };

  const authority = id.slice(0, separator);
  const localId = id.slice(separator + 1);
  if (!AUTHORITY_RE.test(authority) || !LOCAL_ID_RE.test(localId) || localId.includes(":")) {
    throw new Error(`Invalid practice ID: ${id}`);
  }
  return { authority, localId };
}

export function practiceLocalId(id: string): string {
  return parsePracticeId(id).localId;
}

export function qualifyPracticeId(authority: string, id: string): string {
  if (!AUTHORITY_RE.test(authority)) throw new Error(`Invalid practice authority: ${authority}`);
  const parsed = parsePracticeId(id);
  return parsed.authority ? id : `${authority}:${parsed.localId}`;
}
