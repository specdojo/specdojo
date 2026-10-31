import { gitResult } from "./git.js";
import { validateCommitMessageTemplate } from "./commit-message-template.js";

export const DEFAULT_BRANCH_TEMPLATE = "exec/{project}-{id}";
export type BranchVariables = Record<
  "project" | "id" | "topic" | "type" | "scope" | "title",
  string
>;

export function isValidBranchName(cwd: string, branch: string): boolean {
  return (
    gitResult(cwd, ["check-ref-format", "--branch", branch]).status === 0 &&
    gitResult(cwd, ["check-ref-format", `refs/heads/${branch}`]).status === 0
  );
}

export function validateBranchTemplate(value: unknown, at: string, cwd: string): string[] {
  if (value === undefined) return [];
  const errors = validateCommitMessageTemplate(value, at);
  if (typeof value !== "string") return errors;
  if (!/\{(?:id|topic)\}/.test(value)) errors.push(`${at} must contain {id} or {topic}`);
  if (/\{(?:branch|target)\}/.test(value))
    errors.push(`${at}: {branch} and {target} are not supported`);
  const sample = value.replace(/\{[^{}]*\}/g, "value");
  if (!isValidBranchName(cwd, sample)) {
    errors.push(`${at} is not a valid Git branch template`);
  }
  return errors;
}

export function expandBranchTemplate(template: string, variables: BranchVariables): string {
  return template.replace(
    /\{([^{}]+)\}/g,
    (_placeholder, key: keyof BranchVariables) => variables[key],
  );
}
