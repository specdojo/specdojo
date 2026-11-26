import { spawn, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { buildOrchestratorLaunch } from "../../../src/commands/orchestrator.js";
import { gitEnvironment } from "../../../src/shared/git-environment.js";
import { load } from "../../../src/shared/yaml.js";
import { TEST_GIT_ENVIRONMENT } from "../../helpers/git-environment.js";

// PJR-FNB7: Quick Start の「機能追加を起票する（todo）」の対話を、利用者の発言を固定して
// 実オーケストレーター（claude CLI の会話の継続）に流すための部品。
// 純粋な判定（JSON の解釈・状態の比較）と、実プロセスを起動する部分を分けている。

export const PROJECT_ID = "prj-0001";
export const REGISTER_DIR = path.join(
  "docs",
  "ja",
  "projects",
  PROJECT_ID,
  "controls",
  "project-register",
);
export const EVENTS_DIR = path.join(REGISTER_DIR, "events");
export const EXPECTED_TOPIC = "add-faq-section";

export interface ScenarioTurn {
  // 承認の発言かどうか。承認より前の発言の後は、状態が変わっていないことを確かめる。
  isApproval: boolean;
  message: string;
}

// docs/ja/specdojo/guides/quick-start-guide.md の「機能追加を起票する（todo）」の利用者の発言。
export const QUICK_START_TODO_SCENARIO: readonly ScenarioTurn[] = [
  {
    isApproval: false,
    message: "LP によくある質問（FAQ）セクションを追加したいので、todo を起票してほしいです。",
  },
  {
    isApproval: false,
    message:
      "優先度は medium、担当は owner、期日は 2026-11-30、難しさは medium でお願いします。topic は add-faq-section にしてください。",
  },
  { isApproval: true, message: "はい、実行してください。" },
];

export const EXPECTED_TICKET_FIELDS: Readonly<Record<string, string>> = {
  item_type: "todo",
  item_status: "open",
  priority: "medium",
  owner: "owner",
  due_on: "2026-11-30",
  difficulty: "medium",
};

export interface ClaudeTurnResult {
  sessionId: string;
  isError: boolean;
  resultText: string;
  durationMs: number;
  costUsd: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// `claude -p --output-format json` の 1 回分の出力を解釈する。
export function parseClaudeJsonResult(stdout: string): ClaudeTurnResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stdout.trim());
  } catch (error) {
    throw new Error(`claude output is not JSON: ${stdout.slice(0, 500)}`, { cause: error });
  }
  if (!isRecord(parsed) || typeof parsed.session_id !== "string") {
    throw new Error(`claude output has no session_id: ${stdout.slice(0, 500)}`);
  }
  return {
    sessionId: parsed.session_id,
    isError: parsed.is_error === true,
    resultText: typeof parsed.result === "string" ? parsed.result : "",
    durationMs: typeof parsed.duration_ms === "number" ? parsed.duration_ms : 0,
    costUsd: typeof parsed.total_cost_usd === "number" ? parsed.total_cost_usd : 0,
  };
}

export interface RepositoryState {
  head: string;
  status: string;
  // 個票とイベントのファイル（repo 相対パス）と内容のハッシュ
  tickets: Record<string, string>;
  events: Record<string, string>;
}

function diffRecords(
  label: string,
  before: Record<string, string>,
  after: Record<string, string>,
): string[] {
  const names = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
  const failures: string[] = [];
  for (const name of names) {
    if (!(name in before)) failures.push(`${label} added: ${name}`);
    else if (!(name in after)) failures.push(`${label} removed: ${name}`);
    else if (before[name] !== after[name]) failures.push(`${label} changed: ${name}`);
  }
  return failures;
}

// 承認の発言の前に、個票・イベント・HEAD・作業ツリーが変わっていないことを確かめる。
export function compareBeforeApproval(before: RepositoryState, after: RepositoryState): string[] {
  return [
    ...(before.head === after.head ? [] : [`HEAD moved: ${before.head} -> ${after.head}`]),
    ...(before.status === after.status ? [] : [`working tree changed:\n${after.status}`]),
    ...diffRecords("ticket", before.tickets, after.tickets),
    ...diffRecords("event", before.events, after.events),
  ];
}

export interface AfterApprovalFacts {
  before: RepositoryState;
  after: RepositoryState;
  // before.head..after.head で変わったファイル（repo 相対、POSIX 区切り）
  committedFiles: readonly string[];
  // 新しい個票の specdojo frontmatter
  readTicketFields: (ticketPath: string) => Record<string, unknown>;
  // 新しいイベントファイルの action の並び
  readEventActions: (eventPath: string) => string[];
}

// 承認の後に、期待した個票・イベント・commit があることを確かめる。
export function checkAfterApproval(facts: AfterApprovalFacts): string[] {
  const { before, after } = facts;
  const failures: string[] = [];
  const newTickets = Object.keys(after.tickets).filter((name) => !(name in before.tickets));
  const newEvents = Object.keys(after.events).filter((name) => !(name in before.events));
  if (newTickets.length !== 1)
    failures.push(`expected 1 new ticket, got: ${newTickets.join(", ") || "none"}`);
  if (newEvents.length !== 1)
    failures.push(`expected 1 new event file, got: ${newEvents.join(", ") || "none"}`);
  if (before.head === after.head) failures.push("HEAD did not move (no commit)");
  if (after.status !== "") failures.push(`working tree is not clean:\n${after.status}`);
  const ticket = newTickets[0];
  if (ticket !== undefined) {
    if (!ticket.endsWith(`-${EXPECTED_TOPIC}.md`))
      failures.push(`ticket topic mismatch: ${ticket}`);
    const fields = facts.readTicketFields(ticket);
    for (const [field, expected] of Object.entries(EXPECTED_TICKET_FIELDS)) {
      if (String(fields[field]) !== expected) {
        failures.push(`ticket ${field}: expected ${expected}, got ${String(fields[field])}`);
      }
    }
    if (!facts.committedFiles.includes(ticket)) failures.push(`ticket is not committed: ${ticket}`);
  }
  const event = newEvents[0];
  if (event !== undefined) {
    const actions = facts.readEventActions(event);
    if (actions[0] !== "add")
      failures.push(`first event action: expected add, got ${actions.join(",")}`);
    if (!facts.committedFiles.includes(event)) failures.push(`event is not committed: ${event}`);
  }
  return failures;
}

// 以下は実ファイル・実プロセスを扱う部分。

const FIXTURE_GIT_ENVIRONMENT: NodeJS.ProcessEnv = { ...gitEnvironment(), ...TEST_GIT_ENVIRONMENT };

export function git(cwd: string, args: readonly string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", env: FIXTURE_GIT_ENVIRONMENT }).trim();
}

function hashFiles(repo: string, relDir: string, pattern: RegExp): Record<string, string> {
  const dir = path.join(repo, relDir);
  if (!existsSync(dir)) return {};
  const entries: Record<string, string> = {};
  for (const name of readdirSync(dir).sort()) {
    if (!pattern.test(name)) continue;
    const content = readFileSync(path.join(dir, name));
    entries[path.posix.join(...relDir.split(path.sep), name)] = createHash("sha256")
      .update(content)
      .digest("hex");
  }
  return entries;
}

export function captureState(repo: string): RepositoryState {
  return {
    head: git(repo, ["rev-parse", "HEAD"]),
    status: git(repo, ["status", "--porcelain=v1", "--untracked-files=all"]),
    tickets: hashFiles(repo, REGISTER_DIR, /^pjr-[0-9a-z]{4}-.+\.md$/),
    events: hashFiles(repo, EVENTS_DIR, /^pjr-[0-9a-z]{4}\.yaml$/),
  };
}

export function committedFiles(repo: string, from: string, to: string): string[] {
  if (from === to) return [];
  return git(repo, ["diff", "--name-only", `${from}..${to}`])
    .split("\n")
    .filter(Boolean);
}

export function readTicketFields(repo: string, ticketPath: string): Record<string, unknown> {
  const content = readFileSync(path.join(repo, ticketPath), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content);
  const frontmatter: unknown = match ? load(match[1]) : undefined;
  if (!isRecord(frontmatter) || !isRecord(frontmatter.specdojo)) return {};
  return frontmatter.specdojo;
}

export function readEventActions(repo: string, eventPath: string): string[] {
  const events: unknown = load(readFileSync(path.join(repo, eventPath), "utf8"));
  if (!Array.isArray(events)) return [];
  return events.map((event: unknown) => (isRecord(event) ? String(event.action) : ""));
}

// 一時リポジトリに、ビルド済みの specdojo を `npx specdojo` で呼べる形で用意し、init して commit する。
export function prepareFixtureRepository(repo: string, projectRoot: string): void {
  const cliPath = path.join(projectRoot, "dist", "specdojo.js");
  if (!existsSync(cliPath))
    throw new Error(`build output not found: ${cliPath} (run npm run build)`);
  git(repo, ["init", "--quiet", "-b", "main"]);
  writeFileSync(
    path.join(repo, "package.json"),
    `${JSON.stringify({ name: "fnb7-orchestrator-fixture", private: true, devDependencies: { specdojo: "*" } }, null, 2)}\n`,
    "utf8",
  );
  mkdirSync(path.join(repo, "node_modules", ".bin"), { recursive: true });
  symlinkSync(projectRoot, path.join(repo, "node_modules", "specdojo"), "dir");
  symlinkSync(
    path.join("..", "specdojo", "dist", "specdojo.js"),
    path.join(repo, "node_modules", ".bin", "specdojo"),
  );
  writeFileSync(path.join(repo, ".gitignore"), "node_modules/\n", "utf8");
  execFileSync(
    process.execPath,
    [
      cliPath,
      "init",
      "--yes",
      "--project",
      PROJECT_ID,
      "--provider",
      "claude",
      "--nickname",
      "owner",
      "--display-name",
      "Owner",
    ],
    { cwd: repo, encoding: "utf8", env: FIXTURE_GIT_ENVIRONMENT },
  );
  git(repo, ["add", "-A"]);
  git(repo, ["commit", "--quiet", "-m", "chore: init fixture"]);
}

// 起票に要るコマンドだけを許す。承認より前にこれらを使って状態を変えないかが検査の対象である。
const ALLOWED_TOOLS = [
  "Bash(npx specdojo:*)",
  "Bash(specdojo:*)",
  "Bash(git status:*)",
  "Bash(git log:*)",
  "Bash(git diff:*)",
  "Bash(git show:*)",
  "Bash(git rev-parse:*)",
  "Bash(git branch:*)",
];

export interface RunTurnOptions {
  repo: string;
  model: string;
  sessionId: string;
  isFirstTurn: boolean;
  message: string;
  timeoutMs: number;
}

// 実オーケストレーターへ 1 発言を渡す。2 発言目からは同じ会話を継続する。
export async function runOrchestratorTurn(options: RunTurnOptions): Promise<ClaudeTurnResult> {
  const env = { ...FIXTURE_GIT_ENVIRONMENT };
  // 親の Claude Code セッションの中から起動しても、入れ子の判定を持ち込まない。
  delete env.CLAUDECODE;
  const launch = buildOrchestratorLaunch({
    provider: "claude",
    providerArgs: [
      "-p",
      "--output-format",
      "json",
      "--agent",
      "specdojo-orchestrator",
      "--model",
      options.model,
      "--settings",
      ".specdojo/claude/settings.orchestrator.json",
      "--setting-sources",
      "project",
      "--strict-mcp-config",
      "--permission-mode",
      "default",
      "--allowedTools",
      ALLOWED_TOOLS.join(","),
      ...(options.isFirstTurn
        ? ["--session-id", options.sessionId]
        : ["--resume", options.sessionId]),
    ],
    repoRoots: [],
    cwd: options.repo,
    env,
  });
  const { stdout, stderr, code } = await new Promise<{
    stdout: string;
    stderr: string;
    code: number | null;
  }>((resolve, reject) => {
    const child = spawn(launch.command, launch.args, {
      cwd: launch.cwd,
      env: launch.env,
      stdio: ["pipe", "pipe", "pipe"],
    });
    let out = "";
    let err = "";
    const timer = setTimeout(() => child.kill("SIGTERM"), options.timeoutMs);
    child.stdout.on("data", (chunk: Buffer) => (out += chunk.toString("utf8")));
    child.stderr.on("data", (chunk: Buffer) => (err += chunk.toString("utf8")));
    child.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.once("close", (exitCode) => {
      clearTimeout(timer);
      resolve({ stdout: out, stderr: err, code: exitCode });
    });
    // 発言は stdin で渡す。可変長の --allowedTools に位置引数として飲み込まれないようにする。
    child.stdin.end(options.message, "utf8");
  });
  if (code !== 0 && stdout.trim() === "") {
    throw new Error(`claude exited with ${String(code)}: ${stderr.slice(0, 2000)}`);
  }
  return parseClaudeJsonResult(stdout);
}
