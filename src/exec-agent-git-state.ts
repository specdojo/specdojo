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

// Agent は成果物だけを編集し、commit と Git 設定変更は親 runner が管理する。
// linked worktree の HEAD と共有 local config を agent 起動前後で比較し、provider の
// 権限設定をすり抜けた Git 操作も merge や親検証より前に検知する。
export function captureAgentGitStateSnapshot(repoRoot: string): AgentGitStateSnapshot {
  return {
    head: [
      commandSnapshot(repoRoot, ["rev-parse", "--verify", "HEAD"]),
      commandSnapshot(repoRoot, ["symbolic-ref", "-q", "HEAD"]),
    ].join("\n"),
    localConfig: commandSnapshot(repoRoot, ["config", "--local", "--null", "--list"]),
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
