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

function commandStdout(snapshot: string): string {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const stdout = (parsed as { stdout?: unknown }).stdout;
      if (typeof stdout === "string") return stdout.trim();
    }
  } catch {
    // 解析できないスナップショットは「値なし」として扱い、申し送りの記録自体は続ける。
  }
  return "";
}

function describeHead(snapshot: string): string {
  const [revParse = "", symbolicRef = ""] = snapshot.split("\n");
  const commit = commandStdout(revParse) || "(none)";
  const ref = commandStdout(symbolicRef) || "(detached)";
  return `${ref} @ ${commit}`;
}

function localConfigEntries(snapshot: string): string[] {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const entries = (parsed as { entries?: unknown }).entries;
      if (Array.isArray(entries)) {
        return entries.filter((entry): entry is string => typeof entry === "string");
      }
    }
  } catch {
    // 同上。キー差分を出せない場合は、フィールド名だけの記録に留める。
  }
  return [];
}

function localConfigKeys(entries: readonly string[]): string[] {
  return entries.map((entry) => {
    const separator = entry.indexOf("\n");
    return separator === -1 ? entry : entry.slice(0, separator);
  });
}

function describeKeyDifference(before: readonly string[], after: readonly string[]): string[] {
  const removed = [...before];
  const added: string[] = [];
  for (const key of after) {
    const index = removed.indexOf(key);
    if (index === -1) added.push(key);
    else removed.splice(index, 1);
  }
  const lines: string[] = [];
  if (added.length > 0) lines.push(`+ ${[...new Set(added)].sort().join(", ")}`);
  if (removed.length > 0) lines.push(`- ${[...new Set(removed)].sort().join(", ")}`);
  return lines;
}

// block した Git 状態変更を、人が判断できる形へ要約する。local config は値に資格情報を
// 含みうるためキー名だけを出力し、値は適用者が repository 側で確認する前提にする。
export function describeAgentGitStateChanges(
  repoRoot: string,
  before: AgentGitStateSnapshot,
  fields: readonly string[],
): string {
  const after = captureAgentGitStateSnapshot(repoRoot);
  const sections: string[] = [];
  if (fields.includes("HEAD")) {
    sections.push(
      [
        "HEAD:",
        `  before: ${describeHead(before.head)}`,
        `  after:  ${describeHead(after.head)}`,
      ].join("\n"),
    );
  }
  if (fields.includes("local-config")) {
    const difference = describeKeyDifference(
      localConfigKeys(localConfigEntries(before.localConfig)),
      localConfigKeys(localConfigEntries(after.localConfig)),
    );
    sections.push(
      [
        "local-config（値は資格情報を含みうるため出力しない。キー名のみ）:",
        ...(difference.length > 0
          ? difference.map((line) => `  ${line}`)
          : ["  キー構成は同じで値だけが変わりました。"]),
      ].join("\n"),
    );
  }
  return sections.join("\n");
}

export function agentGitStateViolation(fields: readonly string[]): string {
  return (
    "agent-git-state-write: Git state changes detected; " +
    `fields=${fields.join(", ")}; ` +
    "agent must leave commits and repository configuration changes to the parent runner"
  );
}
