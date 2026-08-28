import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerExecCommands } from "../../src/exec.js";
import { gitEnvironment } from "../../src/exec-worktree.js";

// PJR-6VFN: `exec run --register --worktree --resume` の E2E 検証。executor が成功した直後に
// reporter だけが失敗した run を、worktree と executor の未コミット成果を保持したまま reporter
// 段から再開できること、再開できない条件では破壊的操作を行わずに拒否することを、実際の CLI
// 経路（register start/review/wait の実プロセス起動を含む）で確認する。
//
// 一時リポジトリの構成方法（node_modules のシンボリックリンクと process.argv[1] の差し替え）は
// exec-register-pipeline-e2e.integration.test.ts と同じ理由による。

const REAL_REPO_ROOT = join(__dirname, "..", "..");
const originalCwd = process.cwd();
const originalArgv1 = process.argv[1];
const ENV_KEYS = ["SPECDOJO_PROJECT", "SPECDOJO_SCHEDULE_PATH", "SPECDOJO_EXECUTION_PATH"];
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

function clearProjectEnv(): void {
  for (const key of ENV_KEYS) delete process.env[key];
}

async function runExec(args: string[]): Promise<void> {
  clearProjectEnv();
  process.exitCode = undefined;
  const program = new Command();
  program.exitOverride();
  registerExecCommands(program);
  await program.parseAsync(["node", "specdojo", "exec", ...args]);
}

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", env: gitEnvironment() }).trim();
}

const PROJECT_BASE = "docs/ja/projects/test";
const REGISTER_REL = `${PROJECT_BASE}/controls/project-register`;
const SCHEDULE_REL = `${PROJECT_BASE}/schedule`;
const EXECUTION_REL = `${PROJECT_BASE}/execution`;
const TICKET_REL = `${REGISTER_REL}/pjr-cd34-resume-test.md`;
const ARTIFACT_NAME = "pipeline-artifact.md";
const REPORTER_FAILURE_MARKER = "fail-reporter";

const CONFIG = {
  version: 1,
  current_project: "test",
  projects: {
    test: {
      base_path: "docs/ja/projects/test",
      catalog_path: "010-deliverables-catalog",
      schedule_path: "schedule",
      execution_path: "execution",
      project_register_path: "controls/project-register",
      members_path: "pm-members.yaml",
      run: { register_date_timezone: "UTC" },
    },
  },
};

function buildIndex(): string {
  return [
    "---",
    "specdojo:",
    "  id: test:pjr-index",
    "  type: project",
    "  status: ready",
    "---",
    "",
    "# プロジェクト登録簿",
    "",
    "## 1. 登録項目一覧: `./generated/pjr-index.md`",
    "",
  ].join("\n");
}

function buildTicket(): string {
  return [
    "---",
    "specdojo:",
    "  id: test:pjr-cd34-resume-test",
    "  type: project",
    "  status: draft",
    "  rulebook: specdojo:pjr-rulebook",
    "  part_of:",
    "    - test:pjr-index",
    "  item_type: todo",
    "  item_status: open",
    "  priority: medium",
    "  owner: ARC",
    '  registered_at: "2026-08-01T00:00:00Z"',
    '  due_on: "2026-08-31"',
    "---",
    "",
    "# PJR-CD34 resume test item",
    "",
    "## 1. 概要",
    "",
    "reporter 再開の E2E 検証用ダミー項目。",
    "",
    "## 2. 完了条件",
    "",
    "- ダミーの完了条件。",
    "",
    "## 3. 作業内容",
    "",
    "| No | 作業 | 担当 | 状態 | メモ |",
    "| --- | --- | --- | --- | --- |",
    "| 1 | ダミー作業 | ARC | open | - |",
    "",
    "## 4. 対応結果",
    "",
    "-",
    "",
    "## 5. 関連ドキュメント",
    "",
    "-",
    "",
  ].join("\n");
}

// executor は worktree 内に成果物を1件書き、reporter はマーカーファイルがある間だけ失敗する。
// これにより「executor 成功 + reporter 失敗」の run を決定論的に再現できる。
function fakeAgentScript(markerPath: string): string {
  return `
import { existsSync, readFileSync, writeFileSync } from "node:fs";

function arg(name) {
  const index = process.argv.indexOf("--" + name);
  return index >= 0 ? (process.argv[index + 1] ?? "") : "";
}

const nickname = arg("nickname");
const role = nickname.startsWith("exec-") ? "executor" : "reporter";
readFileSync(0, "utf8");

if (role === "executor") {
  writeFileSync(${JSON.stringify(ARTIFACT_NAME)}, "# executor artifact\\n", "utf8");
  process.stdout.write(
    "<specdojo_executor_evidence>" +
      JSON.stringify({
        final_message: "${ARTIFACT_NAME} を追加した。",
        validations: [{ command: "npm run test:unit", status: "passed", summary: "全テスト成功。" }],
      }) +
      "</specdojo_executor_evidence>\\n",
  );
  process.exit(0);
}

if (existsSync(${JSON.stringify(markerPath)})) {
  process.stderr.write("blocked: reporter unavailable\\n");
  process.exit(1);
}

process.stdout.write(
  JSON.stringify({
    schema_version: 1,
    mode: "edit",
    outcome: "complete",
    summary: ["reporter 再開で result を記入した。"],
    changed_files: [{ path: ${JSON.stringify(ARTIFACT_NAME)}, summary: "成果物を追加した。" }],
    handoff: [],
    approach: "plan と executor evidence だけを根拠に結果を構成した。",
    block_reason: "",
  }),
);
process.exit(0);
`;
}

type Fixture = { root: string; markerPath: string; worktreeBase: string };

function withRepo(fn: (fixture: Fixture) => Promise<void> | void): Promise<void> {
  return (async () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-register-resume-e2e-"));
    const markerPath = join(root, REPORTER_FAILURE_MARKER);
    // worktree の既定基準パスは複数 fixture で共有されるため、fixture ごとに専用の基準
    // ディレクトリを作って --worktree-base で明示する。reporter 失敗の検証では worktree を
    // 意図的に残すので、共有パスを使うと孤児 worktree が後続テストの checkpoint を壊す。
    const worktreeBase = mkdtempSync(join(tmpdir(), "specdojo-register-resume-wt-"));
    try {
      mkdirSync(join(root, ".specdojo"), { recursive: true });
      writeFileSync(
        join(root, ".specdojo", "specdojo.config.json"),
        `${JSON.stringify(CONFIG, null, 2)}\n`,
        "utf8",
      );
      mkdirSync(join(root, REGISTER_REL, "generated"), { recursive: true });
      mkdirSync(join(root, `${PROJECT_BASE}/controls/generated`), { recursive: true });
      mkdirSync(join(root, SCHEDULE_REL), { recursive: true });
      mkdirSync(join(root, EXECUTION_REL, "exec", "events"), { recursive: true });
      writeFileSync(join(root, REGISTER_REL, "pjr-index.md"), buildIndex(), "utf8");
      writeFileSync(join(root, TICKET_REL), buildTicket(), "utf8");
      cpSync(
        join(REAL_REPO_ROOT, "docs/ja/specdojo/templates"),
        join(root, "docs/ja/specdojo/templates"),
        { recursive: true },
      );
      symlinkSync(join(REAL_REPO_ROOT, "node_modules"), join(root, "node_modules"));

      writeFileSync(join(root, "fake-agent.mjs"), fakeAgentScript(markerPath), "utf8");
      writeFileSync(
        join(root, PROJECT_BASE, "pm-members.yaml"),
        [
          "version: 1",
          "project_id: test",
          "members:",
          "  - nickname: exec-1",
          "    display_name: exec-1",
          "    email: null",
          "    roles: []",
          "    type: agent",
          "    provider: opencode",
          "    mode: edit",
          "    stage_role: executor",
          "    capabilities: []",
          "    proficiency: normal",
          "    priority: 1",
          "  - nickname: report-1",
          "    display_name: report-1",
          "    email: null",
          "    roles: []",
          "    type: agent",
          "    provider: opencode",
          "    mode: review",
          "    stage_role: reporter",
          "    capabilities: []",
          "    proficiency: normal",
          "    priority: 1",
          "",
        ].join("\n"),
        "utf8",
      );
      writeFileSync(
        join(root, ".specdojo", "exec-defaults.yaml"),
        [
          "providers:",
          "  opencode:",
          `    command_template: "node ${join(root, "fake-agent.mjs")} --nickname {nickname}"`,
          "",
        ].join("\n"),
        "utf8",
      );

      git(root, "init");
      git(root, "add", "-A");
      git(root, "commit", "-m", "initial");

      process.chdir(root);
      process.argv[1] = join(REAL_REPO_ROOT, "src", "specdojo.ts");
      await fn({ root, markerPath, worktreeBase });
    } finally {
      process.chdir(originalCwd);
      process.argv[1] = originalArgv1;
      try {
        rmSync(root, { recursive: true, force: true });
      } finally {
        rmSync(worktreeBase, { recursive: true, force: true });
      }
    }
  })();
}

// executor は成功し reporter は失敗する1回目の実行。worktree と未コミット成果が残る。
async function runWithFailingReporter(markerPath: string, worktreeBase: string): Promise<void> {
  writeFileSync(markerPath, "fail\n", "utf8");
  await runExec([
    "run",
    "--project",
    "test",
    "--register",
    "PJR-CD34",
    "--executor-by",
    "exec-1",
    "--reporter-by",
    "report-1",
    "--worktree",
    "--worktree-base",
    worktreeBase,
  ]);
}

function worktreePathFor(root: string): string | null {
  const listing = git(root, "worktree", "list", "--porcelain");
  const line = listing
    .split("\n")
    .find((entry) => entry.startsWith("worktree ") && entry.includes("PJR-CD34"));
  return line ? line.slice("worktree ".length) : null;
}

afterEach(() => {
  process.chdir(originalCwd);
  process.argv[1] = originalArgv1;
  clearProjectEnv();
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  process.exitCode = undefined;
  vi.restoreAllMocks();
});

describe("exec run --register --worktree --resume", () => {
  it(
    "resumes only the reporter stage and completes the item without re-running the executor",
    { timeout: 120_000 },
    async () => {
      await withRepo(async ({ root, markerPath, worktreeBase }) => {
        vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        vi.spyOn(process.stderr, "write").mockImplementation(() => true);

        await runWithFailingReporter(markerPath, worktreeBase);

        // reporter 失敗後: 項目は waiting、worktree と executor の未コミット成果が残る。
        expect(readFileSync(join(root, TICKET_REL), "utf8")).toContain("item_status: waiting");
        const worktreePath = worktreePathFor(root);
        expect(worktreePath).not.toBeNull();
        expect(existsSync(join(worktreePath ?? "", ARTIFACT_NAME))).toBe(true);
        expect(existsSync(join(root, ARTIFACT_NAME))).toBe(false);

        const evidenceDir = join(root, EXECUTION_REL, "exec", "evidence", "PJR-CD34");
        const runDirsAfterFirstRun = readdirSync(
          join(worktreePath ?? "", EXECUTION_REL, "exec", "evidence", "PJR-CD34"),
        );
        expect(runDirsAfterFirstRun).toHaveLength(1);

        // reporter を復旧させてから、reporter 段だけを再開する。
        rmSync(markerPath, { force: true });
        process.exitCode = undefined;
        await runExec([
          "run",
          "--project",
          "test",
          "--register",
          "PJR-CD34",
          "--worktree",
          "--worktree-base",
          worktreeBase,
          "--resume",
        ]);

        expect(process.exitCode ?? 0).toBe(0);
        expect(readFileSync(join(root, TICKET_REL), "utf8")).toContain("item_status: review");

        // executor の成果と reporter の result が統合ブランチへ merge されている。
        expect(existsSync(join(root, ARTIFACT_NAME))).toBe(true);
        const resultFiles = readdirSync(join(root, EXECUTION_REL, "exec", "results"));
        expect(resultFiles).toHaveLength(1);
        const result = readFileSync(
          join(root, EXECUTION_REL, "exec", "results", resultFiles[0]),
          "utf8",
        );
        expect(result).toContain("status: complete");
        expect(result).toContain("reporter 再開で result を記入した。");
        expect(result).not.toContain("_TODO_");

        // executor は再実行されず、run は1件のままで worktree は撤去されている。
        expect(readdirSync(evidenceDir)).toHaveLength(1);
        expect(worktreePathFor(root)).toBeNull();
      });
    },
  );

  it(
    "refuses to re-run the whole item while a succeeded executor result is uncommitted",
    { timeout: 120_000 },
    async () => {
      await withRepo(async ({ root, markerPath, worktreeBase }) => {
        const stderr: string[] = [];
        vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        vi.spyOn(process.stderr, "write").mockImplementation((chunk) => {
          stderr.push(String(chunk));
          return true;
        });

        await runWithFailingReporter(markerPath, worktreeBase);
        const worktreePath = worktreePathFor(root);
        expect(worktreePath).not.toBeNull();

        process.exitCode = undefined;
        await runExec([
          "run",
          "--project",
          "test",
          "--register",
          "PJR-CD34",
          "--executor-by",
          "exec-1",
          "--reporter-by",
          "report-1",
          "--worktree",
          "--worktree-base",
          worktreeBase,
        ]);

        expect(stderr.join("")).toContain("refusing to re-run PJR-CD34");
        expect(process.exitCode).toBe(1);
        // worktree と executor の成果、項目の状態はいずれも壊されない。
        expect(worktreePathFor(root)).toBe(worktreePath);
        expect(existsSync(join(worktreePath ?? "", ARTIFACT_NAME))).toBe(true);
        expect(readFileSync(join(root, TICKET_REL), "utf8")).toContain("item_status: waiting");
      });
    },
  );

  it("refuses to resume an item that has no exec worktree", { timeout: 60_000 }, async () => {
    await withRepo(async ({ worktreeBase }) => {
      const stderr: string[] = [];
      vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      vi.spyOn(process.stderr, "write").mockImplementation((chunk) => {
        stderr.push(String(chunk));
        return true;
      });

      await runExec([
        "run",
        "--project",
        "test",
        "--register",
        "PJR-CD34",
        "--worktree",
        "--worktree-base",
        worktreeBase,
        "--resume",
      ]);

      expect(stderr.join("")).toContain("no exec worktree to resume for PJR-CD34");
      expect(process.exitCode).toBe(1);
    });
  });

  it("rejects --resume without --worktree", { timeout: 30_000 }, async () => {
    await withRepo(async () => {
      const stdout: string[] = [];
      vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
        stdout.push(String(chunk));
        return true;
      });
      vi.spyOn(process.stderr, "write").mockImplementation(() => true);

      await runExec(["run", "--project", "test", "--register", "PJR-CD34", "--resume"]);

      expect(stdout.join("")).toContain(
        "--resume and --force-restart require --worktree with --register.",
      );
      expect(process.exitCode).toBe(1);
    });
  });
});
