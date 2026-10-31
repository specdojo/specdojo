/** Variables shared by product commit and merge message templates. */
export const COMMIT_MESSAGE_VARIABLES = [
  "id",
  "project",
  "topic",
  "type",
  "scope",
  "title",
  "branch",
  "target",
] as const;

export type CommitMessageVariables = Record<(typeof COMMIT_MESSAGE_VARIABLES)[number], string>;

/** Validate before a run starts; braces are reserved for the supported placeholders. */
export function validateCommitMessageTemplate(value: unknown, at: string): string[] {
  if (value === undefined) return [];
  if (typeof value !== "string" || !value.trim()) return [`${at} must be a non-empty string`];
  if (value.includes("\0")) return [`${at} must not contain NUL`];
  const errors: string[] = [];
  const rest = value.replace(/\{([^{}]*)\}/g, (placeholder: string, key: string) => {
    if (!(COMMIT_MESSAGE_VARIABLES as readonly string[]).includes(key)) {
      errors.push(`${at}: unknown variable ${placeholder}`);
    }
    return "";
  });
  if (/[{}]/.test(rest)) errors.push(`${at}: malformed placeholder`);
  return errors;
}

/** Expand once so placeholder-like text in a title is kept literally. */
export function expandCommitMessageTemplate(
  template: string,
  variables: CommitMessageVariables,
): string {
  const errors = validateCommitMessageTemplate(template, "commit message template");
  if (errors.length > 0) throw new Error(errors.join("; "));
  const effective = variables.scope ? template : template.replaceAll("({scope})", "");
  return effective.replace(
    /\{([^{}]+)\}/g,
    (_placeholder, key: keyof CommitMessageVariables) => variables[key],
  );
}
