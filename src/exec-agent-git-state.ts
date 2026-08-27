import { gitResult } from "./exec-worktree.js";

export type AgentGitStateSnapshot = Readonly<{
  head: string;
  localConfig: string;
}>;

function commandSnapshot(repoRoot: string, args: string[]): string {
  const result = gitResult(repoRoot, args);
  const stdout = typeof result.stdout === "string" ? result.stdout : "";
  const stderr = typeof result.stderr === "string" ? result.stderr.trim() : "";
  return JSON.stringify({ status: result.status, stdout, stderr });
}

function isRunnerOwnedLocalConfigEntry(entry: string): boolean {
  const separator = entry.indexOf("\n");
  const key = (separator === -1 ? entry : entry.slice(0, separator)).toLowerCase();
  // VS Code records the merge base after it discovers a branch created for an exec worktree.
  // The write can land while the agent is running, but it describes runner-created branch
  // metadata and neither changes repository behavior nor belongs to the agent worktree.
  return /^branch\..+\.vscode-merge-base$/.test(key);
}

function localConfigSnapshot(repoRoot: string): string {
  const result = gitResult(repoRoot, ["config", "--local", "--null", "--list"]);
  const stdout = typeof result.stdout === "string" ? result.stdout : "";
  const stderr = typeof result.stderr === "string" ? result.stderr.trim() : "";
  if (result.status !== 0) return JSON.stringify({ status: result.status, stdout, stderr });

  // Drop only runner-owned metadata. Preserve order and duplicates because duplicate scalar
  // settings can be order-sensitive, and changing them must remain detectable.
  const entries = stdout
    .split("\0")
    .filter((entry) => entry !== "" && !isRunnerOwnedLocalConfigEntry(entry));
  return JSON.stringify({ status: result.status, entries });
}

// Agent は成果物だけを編集し、commit と Git 設定変更は親 runner が管理する。
// agent の cwd で解決した linked worktree の HEAD と、runner 所有メタデータを除く
// 共有 local config を agent 起動前後で比較し、provider の権限設定をすり抜けた
// Git 操作も merge や親検証より前に検知する。
export function captureAgentGitStateSnapshot(repoRoot: string): AgentGitStateSnapshot {
  return {
    head: [
      commandSnapshot(repoRoot, ["rev-parse", "--verify", "HEAD"]),
      commandSnapshot(repoRoot, ["symbolic-ref", "-q", "HEAD"]),
    ].join("\n"),
    localConfig: localConfigSnapshot(repoRoot),
  };
}

export function changedAgentGitStateFields(
  repoRoot: string,
  before: AgentGitStateSnapshot,
): string[] {
  const after = captureAgentGitStateSnapshot(repoRoot);
  const changed: string[] = [];
  if (before.head !== after.head) changed.push("HEAD");
  if (before.localConfig !== after.localConfig) changed.push("local-config");
  return changed;
}

export function agentGitStateViolation(fields: readonly string[]): string {
  return (
    "agent-git-state-write: Git state changes detected; " +
    `fields=${fields.join(", ")}; ` +
    "agent must leave commits and repository configuration changes to the parent runner"
  );
}
