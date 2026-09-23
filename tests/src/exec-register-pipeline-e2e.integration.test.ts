import { execFileSync } from "node:child_process";
import {
  chmodSync,
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
import { registerRegisterCommands } from "../../src/register.js";
import { gitEnvironment } from "../../src/exec-worktree.js";

// PJR-TNDH: `exec run --register` を executor/reporter パイプラインで実行する E2E 検証。
// register 項目は agent_pipeline を持たないため、--executor-by / --reporter-by の明示指定だけで
// pipeline モードへ切り替わることと、reporter が result 本文を描画して register が review へ
// 遷移することを、実際の CLI 経路（register start/review の実プロセス起動を含む）で確認する。
//
// register の状態遷移（start/review/wait）は spawnSelf 経由で specdojo CLI 自身を再帰的に
// 子プロセス起動する。selfRunArgs は process.argv[1] が ".ts" で終わる場合、
// specdojoRootDir()/node_modules/.bin/tsx を探すため、一時リポジトリへ実リポジトリの
// node_modules をシンボリックリンクし、process.argv[1] を実リポジトリの src/specdojo.ts へ
// 差し替えることで、一時プロジェクトを cwd としたまま実際の CLI 呼び出しを成立させる。

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

async function runRegister(args: string[]): Promise<void> {
  clearProjectEnv();
  process.exitCode = undefined;
  const program = new Command();
  program.exitOverride();
  registerRegisterCommands(program);
  await program.parseAsync(["register", ...args], { from: "user" });
}

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", env: gitEnvironment() }).trim();
}

const PROJECT_BASE = "docs/ja/projects/test";
const REGISTER_REL = `${PROJECT_BASE}/controls/project-register`;
const SCHEDULE_REL = `${PROJECT_BASE}/schedule`;
const EXECUTION_REL = `${PROJECT_BASE}/execution`;
const ORIGINAL_PACKAGE = `${JSON.stringify(
  { scripts: { "test:integration": 'node -e "process.exit(0)"' } },
  null,
  2,
)}\n`;

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

function buildTicket(id: string): string {
  return [
    "---",
    "specdojo:",
    `  id: test:${id.toLowerCase()}-topic`,
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
    `# ${id} pipeline test item`,
    "",
    "## 1. 概要",
    "",
    "executor/reporter pipeline の E2E 検証用ダミー項目。",
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

const FAKE_PIPELINE_AGENT_SCRIPT = `
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

function arg(name) {
  const index = process.argv.indexOf("--" + name);
  return index >= 0 ? (process.argv[index + 1] ?? "") : "";
}

const nickname = arg("nickname");
const role = nickname.startsWith("exec-") ? "executor" : "reporter";
const prompt = readFileSync(0, "utf8");

if (role === "executor") {
  if (nickname.includes("protected-write") && !existsSync("protection-applied")) {
    writeFileSync(
      "package.json",
      '{"scripts":{"test:integration":"echo ran > parent-validation-ran"}}\\n',
      "utf8",
    );
  }
  process.stdout.write(
    "<specdojo_executor_evidence>" +
      JSON.stringify({
        final_message: "pipeline-artifact.md を更新した。",
        validations: [{ command: "npm test", status: "passed", summary: "全テスト成功。" }],
      }) +
      "</specdojo_executor_evidence>\\n",
  );
  process.exit(0);
}

if (role === "reporter") {
  const settings = arg("settings");
  if (settings !== ".specdojo/claude/settings.report.json" || !existsSync(settings)) {
    process.stderr.write("reporter settings profile is missing: " + settings + "\\n");
    process.exit(1);
  }
  if (nickname === "report-lock") execFileSync("git", ["worktree", "lock", "."]);
  process.stdout.write(
    JSON.stringify({
      schema_version: 1,
      mode: "edit",
      outcome: "complete",
      summary: ["register 項目を pipeline 経由で処理した。"],
      changed_files: [{ path: "pipeline-artifact.md", summary: "文書を更新した。" }],
      handoff: [],
      approach: "plan と executor evidence だけを根拠に結果を構成した。",
      block_reason: "",
    }),
  );
  process.exit(0);
}

process.stderr.write("unknown role: " + role + "\\n");
process.exit(1);
`;

type Fixture = { root: string; worktreeBase: string };

function withRepo(fn: (fixture: Fixture) => Promise<void> | void): Promise<void> {
  return (async () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-register-pipeline-e2e-"));
    // worktree の既定基準パスは fixture 間で共有されるため、fixture ごとに専用ディレクトリを
    // 作って --worktree-base で明示する。保護違反や失敗の検証では worktree を意図的に残すので、
    // 共有パスのままだと孤児 worktree が後続テストの checkpoint を壊す。
    const worktreeBase = mkdtempSync(join(tmpdir(), "specdojo-register-pipeline-e2e-wt-"));
    try {
      mkdirSync(join(root, ".specdojo"), { recursive: true });
      mkdirSync(join(root, ".specdojo", "claude"), { recursive: true });
      writeFileSync(
        join(root, ".specdojo", "specdojo.config.json"),
        `${JSON.stringify(CONFIG, null, 2)}\n`,
        "utf8",
      );
      writeFileSync(join(root, "package.json"), ORIGINAL_PACKAGE, "utf8");
      mkdirSync(join(root, REGISTER_REL, "generated"), { recursive: true });
      mkdirSync(join(root, `${PROJECT_BASE}/controls/generated`), { recursive: true });
      mkdirSync(join(root, SCHEDULE_REL), { recursive: true });
      mkdirSync(join(root, EXECUTION_REL, "exec", "events"), { recursive: true });
      writeFileSync(join(root, REGISTER_REL, "pjr-index.md"), buildIndex(), "utf8");
      writeFileSync(
        join(root, REGISTER_REL, "pjr-ab12-pipeline-test.md"),
        buildTicket("PJR-AB12"),
        "utf8",
      );
      cpSync(
        join(REAL_REPO_ROOT, "docs/ja/specdojo/exec-templates"),
        join(root, "docs/ja/specdojo/exec-templates"),
        {
          recursive: true,
        },
      );
      // register add は個票の雛形として templates 配下の pjr-*-template.md を読む。
      // exec-templates とは別ディレクトリのため、両方を用意する必要がある。
      cpSync(
        join(REAL_REPO_ROOT, "docs/ja/specdojo/templates"),
        join(root, "docs/ja/specdojo/templates"),
        {
          recursive: true,
        },
      );
      // spawnSelf は specdojoRootDir()（= 一時リポジトリ）配下の node_modules/.bin/tsx を
      // 探すため、実リポジトリの node_modules をシンボリックリンクして解決可能にする。
      symlinkSync(join(REAL_REPO_ROOT, "node_modules"), join(root, "node_modules"));

      writeFileSync(join(root, "fake-agent.mjs"), FAKE_PIPELINE_AGENT_SCRIPT, "utf8");
      cpSync(
        join(REAL_REPO_ROOT, "templates", "claude", "settings.report.json"),
        join(root, ".specdojo", "claude", "settings.report.json"),
      );
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
          "    provider: claude",
          "    mode: report",
          "    stage_role: reporter",
          "    capabilities: []",
          "    proficiency: normal",
          "    priority: 1",
          "  - nickname: exec-codex-protected-write",
          "    display_name: exec-codex-protected-write",
          "    email: null",
          "    roles: []",
          "    type: agent",
          "    provider: codex",
          "    mode: edit",
          "    stage_role: executor",
          "    capabilities: []",
          "    proficiency: normal",
          "    priority: 2",
          "  - nickname: exec-claude-protected-write",
          "    display_name: exec-claude-protected-write",
          "    email: null",
          "    roles: []",
          "    type: agent",
          "    provider: claude",
          "    mode: edit",
          "    stage_role: executor",
          "    capabilities: []",
          "    proficiency: normal",
          "    priority: 3",
          "  - nickname: report-lock",
          "    display_name: report-lock",
          "    email: null",
          "    roles: []",
          "    type: agent",
          "    provider: claude",
          "    mode: report",
          "    stage_role: reporter",
          "    capabilities: []",
          "    proficiency: normal",
          "    priority: 4",
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
          "  claude:",
          `    command_template: "node ${join(root, "fake-agent.mjs")} --nickname {nickname} --settings .specdojo/claude/settings.{mode}.json"`,
          "  codex:",
          `    command_template: "node ${join(root, "fake-agent.mjs")} --nickname {nickname}"`,
          "pipeline:",
          "  parent_validations:",
          "    - test-integration",
          "",
        ].join("\n"),
        "utf8",
      );

      git(root, "init");
      git(root, "add", "-A");
      git(root, "commit", "-m", "initial");

      process.chdir(root);
      // register start/review の再帰的な specdojo CLI 呼び出し（spawnSelf）を、実リポジトリの
      // src/specdojo.ts を tsx 経由で再実行する形で成立させる。
      process.argv[1] = join(REAL_REPO_ROOT, "src", "specdojo.ts");
      await fn({ root, worktreeBase });
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

function execWorktreePath(root: string): string | null {
  return (
    git(root, "worktree", "list", "--porcelain")
      .split("\n")
      .filter((line) => line.startsWith("worktree "))
      .map((line) => line.slice("worktree ".length))
      .find((path) => path !== root) ?? null
  );
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

describe("exec run --register executor/reporter pipeline (E2E)", () => {
  it(
    "resolves --executor-by/--reporter-by, runs both stages, and transitions the item to review",
    { timeout: 60_000 },
    async () => {
      await withRepo(async ({ root }) => {
        vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        vi.spyOn(process.stderr, "write").mockImplementation(() => true);

        await runExec([
          "run",
          "--project",
          "test",
          "--register",
          "PJR-AB12",
          "--executor-by",
          "exec-1",
          "--reporter-by",
          "report-1",
        ]);

        const ticket = readFileSync(join(root, REGISTER_REL, "pjr-ab12-pipeline-test.md"), "utf8");
        expect(ticket).toContain("item_status: review");

        const resultFiles = readdirSync(join(root, EXECUTION_REL, "exec", "results"));
        expect(resultFiles).toHaveLength(1);
        const result = readFileSync(
          join(root, EXECUTION_REL, "exec", "results", resultFiles[0]),
          "utf8",
        );
        expect(result).toContain("status: complete");
        expect(result).toContain("register 項目を pipeline 経由で処理した。");
        expect(result).not.toContain("_TODO_");

        // executor evidence が記録されていること（reporter へ渡す根拠）。
        const evidenceDir = join(root, EXECUTION_REL, "exec", "evidence", "PJR-AB12");
        expect(existsSync(evidenceDir)).toBe(true);
        const runDirs = readdirSync(evidenceDir);
        expect(runDirs).toHaveLength(1);
        expect(existsSync(join(evidenceDir, runDirs[0], "pipeline-state.json"))).toBe(true);

        expect(process.exitCode ?? 0).toBe(0);
      });
    },
  );

  it(
    "runs the same pipeline in --worktree mode and merges the result back",
    { timeout: 60_000 },
    async () => {
      await withRepo(async ({ root, worktreeBase }) => {
        vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        vi.spyOn(process.stderr, "write").mockImplementation(() => true);
        const firstParentBefore = Number(
          git(root, "rev-list", "--first-parent", "--count", "HEAD"),
        );

        await runExec([
          "run",
          "--project",
          "test",
          "--register",
          "PJR-AB12",
          "--executor-by",
          "exec-1",
          "--reporter-by",
          "report-1",
          "--worktree",
          "--worktree-base",
          worktreeBase,
        ]);

        const ticket = readFileSync(join(root, REGISTER_REL, "pjr-ab12-pipeline-test.md"), "utf8");
        expect(ticket).toContain("item_status: review");

        const resultFiles = readdirSync(join(root, EXECUTION_REL, "exec", "results"));
        expect(resultFiles).toHaveLength(1);
        const result = readFileSync(
          join(root, EXECUTION_REL, "exec", "results", resultFiles[0]),
          "utf8",
        );
        expect(result).toContain("status: complete");
        expect(result).toContain("register 項目を pipeline 経由で処理した。");
        expect(result).not.toContain("_TODO_");

        const evidenceDir = join(root, EXECUTION_REL, "exec", "evidence", "PJR-AB12");
        expect(existsSync(evidenceDir)).toBe(true);
        expect(readdirSync(evidenceDir)).toHaveLength(1);

        // worktree は成功時に merge back 後、撤去される。
        const worktrees = git(root, "worktree", "list", "--porcelain");
        expect(worktrees).not.toContain("PJR-AB12");
        expect(Number(git(root, "rev-list", "--first-parent", "--count", "HEAD"))).toBe(
          firstParentBefore + 1,
        );
        expect(git(root, "log", "-1", "--pretty=%s")).toBe(
          "exec(register PJR-AB12): pipeline test item",
        );
        expect(git(root, "log", "-1", "--pretty=%B")).toContain("Transition: start → review");
        expect(git(root, "rev-list", "--parents", "-1", "HEAD").split(" ")).toHaveLength(3);

        expect(process.exitCode ?? 0).toBe(0);
      });
    },
  );

  it(
    "rejects --register with only one of --executor-by/--reporter-by",
    { timeout: 30_000 },
    async () => {
      await withRepo(async () => {
        const stdout: string[] = [];
        vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
          stdout.push(String(chunk));
          return true;
        });
        vi.spyOn(process.stderr, "write").mockImplementation(() => true);

        // run action の catch がエラーを stdout + exitCode=1 に変換するため（他の run
        // バリデーションエラーと同じ規約）、reject ではなくこの2点で検証する。
        await runExec([
          "run",
          "--project",
          "test",
          "--register",
          "PJR-AB12",
          "--executor-by",
          "exec-1",
        ]);

        expect(stdout.join("")).toContain(
          "--register pipeline execution requires both --executor-by and --reporter-by.",
        );
        expect(process.exitCode).toBe(1);
      });
    },
  );

  it(
    "aborts a hook-rejected merge, records a clean wait reason, and resumes integration",
    { timeout: 120_000 },
    async () => {
      await withRepo(async ({ root, worktreeBase }) => {
        vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        vi.spyOn(process.stderr, "write").mockImplementation(() => true);
        const firstParentBefore = Number(
          git(root, "rev-list", "--first-parent", "--count", "HEAD"),
        );
        const rejectMarker = join(root, ".git", "reject-merge-commit");
        const hookPath = join(root, ".git", "hooks", "pre-commit");
        writeFileSync(rejectMarker, "reject\n", "utf8");
        writeFileSync(
          hookPath,
          [
            "#!/bin/sh",
            // 自動 merge の pre-merge-commit 時点では MERGE_HEAD が未作成のため、pre-merge-commit
            // から環境変数付きで exec された場合だけ統合 commit を落とす（task commit は通す）。
            `if [ -f '${rejectMarker}' ] && [ "$SPECDOJO_TEST_MERGE_COMMIT" = "1" ]; then`,
            "  printf '\\033[31m╭── hook output ──╮\\033[0m\\n' >&2",
            "  printf '┃ typecheck ❯\\n' >&2",
            "  printf '┃ src/demo.ts(1,1): error TS2322: merge hook rejected\\n' >&2",
            "  printf '╰─────────────────╯\\n' >&2",
            "  exit 1",
            "fi",
            "exit 0",
            "",
          ].join("\n"),
          "utf8",
        );
        chmodSync(hookPath, 0o755);
        const preMergeHookPath = join(root, ".git", "hooks", "pre-merge-commit");
        writeFileSync(
          preMergeHookPath,
          '#!/bin/sh\nSPECDOJO_TEST_MERGE_COMMIT=1 exec "$(git rev-parse --git-path hooks/pre-commit)"\n',
          "utf8",
        );
        chmodSync(preMergeHookPath, 0o755);

        await runExec([
          "run",
          "--project",
          "test",
          "--register",
          "PJR-AB12",
          "--executor-by",
          "exec-1",
          "--reporter-by",
          "report-1",
          "--worktree",
          "--worktree-base",
          worktreeBase,
        ]);

        expect(process.exitCode).toBe(1);
        expect(() => git(root, "rev-parse", "--verify", "MERGE_HEAD")).toThrow();
        expect(Number(git(root, "rev-list", "--first-parent", "--count", "HEAD"))).toBe(
          firstParentBefore + 1,
        );
        const worktreePath = execWorktreePath(root);
        expect(worktreePath).not.toBeNull();
        expect(git(root, "branch", "--list", "exec/test-PJR-AB12")).toContain("exec/test-PJR-AB12");
        const waitingTicket = readFileSync(
          join(root, REGISTER_REL, "pjr-ab12-pipeline-test.md"),
          "utf8",
        );
        expect(waitingTicket).toContain("item_status: waiting");
        expect(waitingTicket).toContain("typecheck: src/demo.ts(1,1): error TS2322");
        expect(waitingTicket).not.toContain("\u001b[31m");
        expect(waitingTicket).not.toContain("╭── hook output");

        const evidenceRoot = join(
          worktreePath ?? "",
          EXECUTION_REL,
          "exec",
          "evidence",
          "PJR-AB12",
        );
        const runIds = readdirSync(evidenceRoot);
        expect(runIds).toHaveLength(1);
        const integrateLog = readFileSync(join(evidenceRoot, runIds[0]!, "integrate.log"), "utf8");
        expect(integrateLog).toContain("\u001b[31m╭── hook output ──╮\u001b[0m");
        expect(integrateLog).toContain("--- merge --abort ---\nexit: 0");

        rmSync(rejectMarker);
        await runExec([
          "run",
          "--project",
          "test",
          "--register",
          "PJR-AB12",
          "--worktree",
          "--worktree-base",
          worktreeBase,
          "--resume",
        ]);

        expect(process.exitCode ?? 0).toBe(0);
        expect(execWorktreePath(root)).toBeNull();
        expect(Number(git(root, "rev-list", "--first-parent", "--count", "HEAD"))).toBe(
          firstParentBefore + 2,
        );
        expect(
          readFileSync(join(root, REGISTER_REL, "pjr-ab12-pipeline-test.md"), "utf8"),
        ).toContain("item_status: review");
        const mergedEvidenceRoot = join(root, EXECUTION_REL, "exec", "evidence", "PJR-AB12");
        const mergedRunIds = readdirSync(mergedEvidenceRoot);
        expect(mergedRunIds).toEqual(runIds);
        const mergedState = JSON.parse(
          readFileSync(join(mergedEvidenceRoot, mergedRunIds[0]!, "pipeline-state.json"), "utf8"),
        ) as {
          stages: Record<string, { status: string; attempts: number }>;
        };
        expect(mergedState.stages.integrate).toMatchObject({ status: "succeeded", attempts: 2 });
        expect(mergedState.stages.executor).toMatchObject({ status: "succeeded", attempts: 1 });
        expect(mergedState.stages.reporter).toMatchObject({ status: "succeeded", attempts: 1 });
      });
    },
  );

  it(
    "resumes cleanup without a second merge when removal fails after integration",
    { timeout: 120_000 },
    async () => {
      await withRepo(async ({ root, worktreeBase }) => {
        vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        vi.spyOn(process.stderr, "write").mockImplementation(() => true);
        const firstParentBefore = Number(
          git(root, "rev-list", "--first-parent", "--count", "HEAD"),
        );

        await runExec([
          "run",
          "--project",
          "test",
          "--register",
          "PJR-AB12",
          "--executor-by",
          "exec-1",
          "--reporter-by",
          "report-lock",
          "--worktree",
          "--worktree-base",
          worktreeBase,
        ]);

        expect(process.exitCode).toBe(1);
        expect(Number(git(root, "rev-list", "--first-parent", "--count", "HEAD"))).toBe(
          firstParentBefore + 1,
        );
        expect(
          readFileSync(join(root, REGISTER_REL, "pjr-ab12-pipeline-test.md"), "utf8"),
        ).toContain("item_status: review");
        const worktreePath = execWorktreePath(root);
        expect(worktreePath).not.toBeNull();
        git(root, "worktree", "unlock", worktreePath ?? "");

        process.exitCode = undefined;
        await runExec([
          "run",
          "--project",
          "test",
          "--register",
          "PJR-AB12",
          "--worktree",
          "--worktree-base",
          worktreeBase,
          "--resume",
        ]);

        expect(process.exitCode ?? 0).toBe(0);
        expect(execWorktreePath(root)).toBeNull();
        expect(Number(git(root, "rev-list", "--first-parent", "--count", "HEAD"))).toBe(
          firstParentBefore + 1,
        );
        expect(git(root, "log", "-1", "--pretty=%s")).toBe(
          "exec(register PJR-AB12): pipeline test item",
        );
      });
    },
  );

  it.each(["exec-codex-protected-write", "exec-claude-protected-write"])(
    "blocks %s distinctly and resumes the executor after the handoff is applied",
    async (executor) => {
      await withRepo(async ({ root, worktreeBase }) => {
        vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        const stderr: string[] = [];
        vi.spyOn(process.stderr, "write").mockImplementation((chunk) => {
          stderr.push(String(chunk));
          return true;
        });
        const firstParentBefore = Number(
          git(root, "rev-list", "--first-parent", "--count", "HEAD"),
        );

        await runExec([
          "run",
          "--project",
          "test",
          "--register",
          "PJR-AB12",
          "--executor-by",
          executor,
          "--reporter-by",
          "report-1",
          "--worktree",
          "--worktree-base",
          worktreeBase,
        ]);

        const ticket = readFileSync(join(root, REGISTER_REL, "pjr-ab12-pipeline-test.md"), "utf8");
        expect(ticket).toContain("item_status: waiting");
        expect(ticket).toContain("block_reason:");
        expect(ticket).not.toContain("conclusion:");
        expect(readFileSync(join(root, "package.json"), "utf8")).toContain(
          '"test:integration": "node -e \\"process.exit(0)\\""',
        );
        expect(existsSync(join(root, "parent-validation-ran"))).toBe(false);
        expect(stderr.join("")).toContain(
          "blocked: agent-config-write: protected configuration changes detected; paths=package.json",
        );
        expect(process.exitCode).toBe(1);
        expect(Number(git(root, "rev-list", "--first-parent", "--count", "HEAD"))).toBe(
          firstParentBefore + 1,
        );
        expect(git(root, "log", "-1", "--pretty=%s")).toBe("exec(register PJR-AB12): wait");

        const worktreePath = execWorktreePath(root);
        expect(worktreePath).not.toBeNull();
        const evidenceDir = join(worktreePath ?? "", EXECUTION_REL, "exec", "evidence", "PJR-AB12");
        const blockedRunId = readdirSync(evidenceDir)[0];
        const blockedState = JSON.parse(
          readFileSync(join(evidenceDir, blockedRunId, "pipeline-state.json"), "utf8"),
        ) as { stages: { executor: { status: string } } };
        expect(blockedState.stages.executor.status).toBe("blocked");

        // 人または orchestrator が申し送りを適用し、agent 由来の保護対象差分を worktree から
        // 取り除いた状態を再現する。再開後の fake executor は marker を見て同じ変更を再提案しない。
        writeFileSync(join(worktreePath ?? "", "package.json"), ORIGINAL_PACKAGE, "utf8");
        writeFileSync(join(worktreePath ?? "", "protection-applied"), "applied\n", "utf8");

        const beforeResume = Number(git(root, "rev-list", "--first-parent", "--count", "HEAD"));
        process.exitCode = undefined;
        await runExec([
          "run",
          "--project",
          "test",
          "--register",
          "PJR-AB12",
          "--worktree",
          "--worktree-base",
          worktreeBase,
          "--resume",
        ]);

        expect(process.exitCode ?? 0).toBe(0);
        expect(
          readFileSync(join(root, REGISTER_REL, "pjr-ab12-pipeline-test.md"), "utf8"),
        ).toContain("item_status: review");
        expect(existsSync(join(root, "protection-applied"))).toBe(true);
        expect(execWorktreePath(root)).toBeNull();
        expect(Number(git(root, "rev-list", "--first-parent", "--count", "HEAD"))).toBe(
          beforeResume + 1,
        );
        expect(git(root, "log", "-1", "--pretty=%B")).toContain("Transition: start → review");
      });
    },
    120_000,
  );
});

// register CLI 自体は本テストの前提整備にのみ使う（add で個票を作れることの確認）。
describe("register add (fixture sanity check)", () => {
  it("creates a ticket file the pipeline E2E test can rely on", async () => {
    await withRepo(async ({ root }) => {
      vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      await runRegister([
        "add",
        "--project",
        "test",
        "--type",
        "todo",
        "--title",
        "sanity",
        "--id",
        "PJR-ZZ99",
        "--owner",
        "ARC",
      ]);
      expect(
        existsSync(join(root, REGISTER_REL, "pjr-zz99-sanity.md")) ||
          readdirSync(join(root, REGISTER_REL)).some((f) => f.startsWith("pjr-zz99-")),
      ).toBe(true);
    });
  });
});
