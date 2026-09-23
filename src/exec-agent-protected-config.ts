import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, lstatSync, readdirSync, readFileSync, readlinkSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { gitEnvironment, gitResult } from "./exec-worktree.js";

// PJR-3S8Q で agent の書き込み対象外とした、親 runner / hook / CI の実行内容を
// 変えられる設定パス。provider 設定から注入できない固定定義として CLI 側に持つ。
const PROTECTED_DIRECTORY_PREFIXES = [
  ".specdojo/",
  ".agents/rules/",
  ".agents/skills/",
  ".claude/",
  ".codex/",
  ".opencode/",
  ".github/agents/",
  ".github/workflows/",
  ".gitlab/ci/",
  ".circleci/",
  ".azure-pipelines/",
  ".jenkins/",
] as const;

const PROTECTED_EXACT_PATHS = new Set([
  "package.json",
  "AGENTS.md",
  "CLAUDE.md",
  "GEMINI.md",
  "lefthook.yml",
  ".lefthook.yml",
  ".gitlab-ci.yml",
  ".gitlab-ci.yaml",
  "azure-pipelines.yml",
  "azure-pipelines.yaml",
  "Jenkinsfile",
]);

const SNAPSHOT_DIRECTORY_ROOTS = [
  ".specdojo",
  ".agents/rules",
  ".agents/skills",
  ".claude",
  ".codex",
  ".opencode",
  ".github/agents",
  ".github/workflows",
  ".gitlab/ci",
  ".circleci",
  ".azure-pipelines",
  ".jenkins",
] as const;

// 保護対象ディレクトリの配下にあるが、設定ではなく再生成可能な既知の生成物。
// 任意の gitignore 対象を除外すると、agent が .gitignore と新規設定を同時に作ることで
// ガードをすり抜けられるため、生成物として用途が確定しているパスだけを列挙する。
const GENERATED_PATHS = new Set([".specdojo/doc-index.json"]);

export type AgentProtectedConfigSnapshot = ReadonlyMap<string, string>;

// `.specdojo/doc-index.json` のように、保護対象ディレクトリの下にある gitignore 済みの生成物を
// 除外する。agent は共通規約に従って `index build` などの再生成コマンドを実行するため、生成物まで
// 保護対象に含めると、規約どおりの検証を行っただけで違反として扱われてしまう。
//
// 判定は「追跡されていない」ではなく「ignore されている」で行う。未追跡のファイルをすべて除外すると、
// agent が新しい設定ファイル（例: `.specdojo/claude/settings.<mode>.json`）を作って保護をすり抜け
// られるため、ignore 済みの生成物だけを対象から外す。
//
// git が使えない、または想定外の終了コードで失敗した場合は除外せず、全候補を保護対象のままにする。
function ignoredGeneratedPaths(
  repoRoot: string,
  candidates: readonly string[],
): ReadonlySet<string> {
  const generatedCandidates = candidates
    .map((path) => normalizeRepoPath(path))
    .filter((path) => GENERATED_PATHS.has(path));
  if (generatedCandidates.length === 0) return new Set();
  const result = spawnSync("git", ["check-ignore", "--no-index", "-z", "--stdin"], {
    cwd: repoRoot,
    env: gitEnvironment(),
    input: `${generatedCandidates.join("\0")}\0`,
    encoding: "utf8",
  });
  // 0: 1件以上が ignore 対象、1: 該当なし。それ以外は判定不能として除外しない。
  if (result.error || (result.status !== 0 && result.status !== 1)) return new Set();
  return new Set(
    (result.stdout ?? "")
      .split("\0")
      .filter((path) => path !== "")
      .map((path) => normalizeRepoPath(path)),
  );
}

function normalizeRepoPath(path: string): string {
  return path.replaceAll("\\", "/").replace(/^\.\//, "");
}

export function isAgentProtectedConfigPath(path: string): boolean {
  const normalized = normalizeRepoPath(path);
  if (PROTECTED_EXACT_PATHS.has(normalized)) return true;
  if (PROTECTED_DIRECTORY_PREFIXES.some((prefix) => normalized.startsWith(prefix))) return true;
  return /^(?:commitlint\.config\.[^/]+|\.commitlintrc(?:\.[^/]+)?)$/.test(normalized);
}

// snapshot と統合直前の再検査で同じ保護境界を使う。isAgentProtectedConfigPath は
// path だけで設定候補を分類し、この関数が repository の ignore 規則と既知の生成物定義を
// 組み合わせて、実際に block すべきパスを返す。
export function agentProtectedConfigPaths(
  repoRoot: string,
  candidates: readonly string[],
): string[] {
  const protectedPaths = [
    ...new Set(
      candidates.map((path) => normalizeRepoPath(path)).filter(isAgentProtectedConfigPath),
    ),
  ];
  const ignoredGenerated = ignoredGeneratedPaths(repoRoot, protectedPaths);
  return protectedPaths
    .filter((path) => !ignoredGenerated.has(path))
    .sort((a, b) => a.localeCompare(b));
}

function fingerprint(path: string): string {
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) return `link:${readlinkSync(path)}`;
  if (!stat.isFile()) return `other:${stat.mode}:${stat.size}`;
  return `file:${createHash("sha256").update(readFileSync(path)).digest("hex")}`;
}

function addTreeFiles(repoRoot: string, rootPath: string, out: Map<string, string>): void {
  if (!existsSync(rootPath)) return;
  const stat = lstatSync(rootPath);
  if (!stat.isDirectory()) {
    const relPath = normalizeRepoPath(relative(repoRoot, rootPath).split(sep).join("/"));
    if (isAgentProtectedConfigPath(relPath)) out.set(relPath, fingerprint(rootPath));
    return;
  }
  for (const entry of readdirSync(rootPath, { withFileTypes: true })) {
    const entryPath = join(rootPath, entry.name);
    if (entry.isDirectory()) addTreeFiles(repoRoot, entryPath, out);
    else {
      const relPath = normalizeRepoPath(relative(repoRoot, entryPath).split(sep).join("/"));
      if (isAgentProtectedConfigPath(relPath)) out.set(relPath, fingerprint(entryPath));
    }
  }
}

// in-place 実行では人間が先に行った未 commit 変更を妨げないよう、agent 起動直前の
// ファイル内容を保存し、終了後に内容が変わった保護対象だけを agent 由来と判定する。
export function captureAgentProtectedConfigSnapshot(
  repoRoot: string,
): AgentProtectedConfigSnapshot {
  const snapshot = new Map<string, string>();
  for (const entry of readdirSync(repoRoot, { withFileTypes: true })) {
    if (entry.isDirectory()) continue;
    if (!isAgentProtectedConfigPath(entry.name)) continue;
    snapshot.set(entry.name, fingerprint(join(repoRoot, entry.name)));
  }
  for (const relRoot of SNAPSHOT_DIRECTORY_ROOTS) {
    addTreeFiles(repoRoot, join(repoRoot, relRoot), snapshot);
  }
  const protectedPaths = new Set(agentProtectedConfigPaths(repoRoot, [...snapshot.keys()]));
  for (const path of snapshot.keys()) {
    if (!protectedPaths.has(path)) snapshot.delete(path);
  }
  return snapshot;
}

export function changedAgentProtectedConfigPaths(
  repoRoot: string,
  before: AgentProtectedConfigSnapshot,
): string[] {
  const after = captureAgentProtectedConfigSnapshot(repoRoot);
  const allPaths = new Set([...before.keys(), ...after.keys()]);
  return [...allPaths]
    .filter((path) => before.get(path) !== after.get(path))
    .sort((a, b) => a.localeCompare(b));
}

// block した変更を人が判断できるよう、対象パスごとの差分を git から取得する。
// diff は差分ありで status 1 を返すため、0 と 1 のみ結果として採用する。
type GitTextResult = { text: string; failure?: string };

function gitFailure(result: ReturnType<typeof gitResult>): string {
  const detail = result.error?.message || (typeof result.stderr === "string" ? result.stderr : "");
  const normalized = detail.trim().replace(/\s+/g, " ");
  if (normalized) return normalized.slice(0, 500);
  return `git exited with status ${result.status ?? "unknown"}`;
}

function gitDiffText(repoRoot: string, args: readonly string[]): GitTextResult {
  const result = gitResult(repoRoot, [...args]);
  if (result.error || (result.status !== 0 && result.status !== 1)) {
    return { text: "", failure: gitFailure(result) };
  }
  return { text: typeof result.stdout === "string" ? result.stdout : "" };
}

function untrackedProtectedPaths(
  repoRoot: string,
  paths: readonly string[],
): { paths: ReadonlySet<string>; failure?: string } {
  const result = gitResult(repoRoot, ["status", "--porcelain", "-z", "--", ...paths]);
  if (result.error || result.status !== 0) {
    return { paths: new Set(), failure: gitFailure(result) };
  }
  const stdout = typeof result.stdout === "string" ? result.stdout : "";
  const untracked = new Set<string>();
  for (const entry of stdout.split("\0")) {
    if (!entry.startsWith("?? ")) continue;
    untracked.add(normalizeRepoPath(entry.slice(3)));
  }
  return { paths: untracked };
}

// 未追跡の新規ファイルは git diff の対象にならないため、適用者が内容を判断できるよう
// 現在の内容を追加行として組み立てる。git command 自体の失敗時にはこの処理へフォールバックしない。
function addedFileDiff(repoRoot: string, path: string, note: string): string {
  const absolutePath = join(repoRoot, path);
  if (!existsSync(absolutePath)) return "";
  let content: string;
  try {
    content = readFileSync(absolutePath, "utf8");
  } catch {
    return "";
  }
  const header = `# ${path}: ${note}\n--- /dev/null\n+++ b/${path}`;
  if (content.includes("\0")) return `${header}\n# binary content omitted`;
  const lines = content.split("\n");
  if (lines.at(-1) === "") lines.pop();
  return [header, ...lines.map((line) => `+${line}`)].join("\n");
}

// 対象パスごとの提案差分を1つのテキストにまとめる。差分を取得できないパスは、
// 取得できなかったことが分かる注記を残し、他パスの差分は落とさない。
export function describeAgentProtectedConfigChanges(
  repoRoot: string,
  paths: readonly string[],
): string {
  if (paths.length === 0) return "";
  const untracked = untrackedProtectedPaths(repoRoot, paths);
  const sections: string[] = [];
  for (const path of paths) {
    if (untracked.failure) {
      sections.push(`# ${path}: 差分を取得できませんでした（git status: ${untracked.failure}）`);
      continue;
    }
    if (untracked.paths.has(path)) {
      const added = addedFileDiff(repoRoot, path, "新規ファイル（未追跡）の内容");
      sections.push(
        added.trim() === ""
          ? `# ${path}: 未追跡ファイルの内容を読み取れませんでした`
          : added.trimEnd(),
      );
      continue;
    }

    const againstHead = gitDiffText(repoRoot, ["diff", "HEAD", "--unified=3", "--", path]);
    if (againstHead.text.trim() !== "") {
      sections.push(againstHead.text.trimEnd());
      continue;
    }
    const workingTree = gitDiffText(repoRoot, ["diff", "--unified=3", "--", path]);
    if (workingTree.text.trim() !== "") {
      sections.push(workingTree.text.trimEnd());
      continue;
    }

    const failures = [againstHead.failure, workingTree.failure].filter(Boolean);
    sections.push(
      failures.length > 0
        ? `# ${path}: 差分を取得できませんでした（git diff: ${[...new Set(failures)].join(" / ")}）`
        : `# ${path}: git diff の出力が空でした（HEAD に反映済み、削除、またはバイナリの可能性があります）`,
    );
  }
  return sections.join("\n");
}

export function agentProtectedConfigViolation(paths: readonly string[]): string {
  return (
    "agent-config-write: protected configuration changes detected; " +
    `paths=${paths.join(", ")}; ` +
    "agent must record the required change in the result handoff for human or orchestrator application"
  );
}
