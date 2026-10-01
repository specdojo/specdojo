import { execFileSync } from "node:child_process";
import {
  chmodSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerExecCommands } from "../../src/exec.js";
import { registerRegisterCommands } from "../../src/register.js";
import { registerConfigCommands } from "../../src/specdojo-config.js";
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

async function runConfig(args: string[]): Promise<void> {
  const program = new Command();
  program.exitOverride();
  registerConfigCommands(program);
  await program.parseAsync(["config", ...args], { from: "user" });
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
const PARTIAL_ARTIFACT = "partial-first-attempt.md";
const CONCURRENT_ARTIFACT = "concurrent-artifact.md";
// PJR-69VP: exec-multi-repo はプロジェクト worktree（cwd）にも成果物を書き、cwd を記録する。
// register 由来のタスクは既知の成果物ディレクトリ外の新規ファイルを commit しないため docs/ に置く。
const MULTI_REPO_ARTIFACT = "docs/multi-repo-artifact.md";
const AGENT_CWD_RECORD = "docs/agent-cwd.txt";
const TRACE_KEY = "test:PJR-AB12";
const TASK_DIR_NAME = "test-PJR-AB12";
const EXEC_BRANCH = `exec/${TASK_DIR_NAME}`;

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
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

function arg(name) {
  const index = process.argv.indexOf("--" + name);
  return index >= 0 ? (process.argv[index + 1] ?? "") : "";
}

const nickname = arg("nickname");
const role = nickname.startsWith("exec-") ? "executor" : "reporter";
const prompt = readFileSync(0, "utf8");

if (role === "executor") {
  for (const name of (process.env.SPECDOJO_REPO_NAMES ?? "").split(",").filter(Boolean)) {
    const root = process.env["SPECDOJO_REPO_" + name.toUpperCase().replaceAll("-", "_")];
    if (!root) throw new Error("product worktree is missing: " + name);
    mkdirSync(root + "/src", { recursive: true });
    writeFileSync(
      root + "/src/feature.ts",
      "export const repo = " + JSON.stringify(name) + ";\\n",
    );
  }
  if (nickname === "exec-multi-repo") {
    mkdirSync("docs", { recursive: true });
    writeFileSync(${JSON.stringify(MULTI_REPO_ARTIFACT)}, "# project artifact\\n", "utf8");
    writeFileSync(${JSON.stringify(AGENT_CWD_RECORD)}, process.cwd() + "\\n", "utf8");
  }
  if (nickname === "exec-advance-root") {
    const root = execFileSync("git", ["worktree", "list", "--porcelain"], {
      encoding: "utf8",
    })
      .split("\\n")
      .find((line) => line.startsWith("worktree "))
      ?.slice("worktree ".length);
    if (!root) throw new Error("root worktree was not found");
    writeFileSync(root + "/${CONCURRENT_ARTIFACT}", "# concurrent artifact\\n", "utf8");
    execFileSync("git", ["-C", root, "add", "--", "${CONCURRENT_ARTIFACT}"]);
    execFileSync("git", [
      "-C",
      root,
      "commit",
      "--no-verify",
      "-m",
      "concurrent artifact",
      "--",
      "${CONCURRENT_ARTIFACT}",
    ]);
  }
  if (nickname === "exec-rate-limit" && !existsSync(${JSON.stringify(PARTIAL_ARTIFACT)})) {
    writeFileSync(${JSON.stringify(PARTIAL_ARTIFACT)}, "# partial first attempt\\n", "utf8");
    process.stderr.write("rate limit reached\\n");
    process.exit(75);
  }
  if (nickname.includes("protected-write") && !existsSync("docs/protection-applied")) {
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

type ProductFixture = {
  app1: string;
  app2: string;
  targets: { app1: string; app2: string };
};

function initProductRepository(path: string, name: string): void {
  mkdirSync(join(path, "src"), { recursive: true });
  writeFileSync(join(path, "README.md"), `# ${name}\n`, "utf8");
  writeFileSync(join(path, "src", "index.ts"), "export {};\n", "utf8");
  git(path, "init", "--quiet");
  git(path, "add", "-A");
  git(path, "commit", "--quiet", "-m", "initial");
}

function enableProductRepositories(root: string): ProductFixture {
  const app1 = `${root}-app1`;
  const app2 = `${root}-app2`;
  initProductRepository(app1, "app1");
  initProductRepository(app2, "app2");
  git(app2, "checkout", "--quiet", "-b", "release");
  const targets = {
    app1: git(app1, "branch", "--show-current"),
    app2: "release",
  };
  const repoPath = (path: string): string => relative(root, path).split(sep).join("/");
  const config = {
    ...CONFIG,
    projects: {
      test: {
        ...CONFIG.projects.test,
        repos: [
          { name: "app1", path: repoPath(app1), setup: { install: false, build: false } },
          {
            name: "app2",
            path: repoPath(app2),
            integration_branch: targets.app2,
            setup: { install: false, build: false },
          },
        ],
      },
    },
  };
  writeFileSync(
    join(root, ".specdojo", "specdojo.config.json"),
    `${JSON.stringify(config, null, 2)}\n`,
    "utf8",
  );
  git(root, "add", ".specdojo/specdojo.config.json");
  git(root, "commit", "--quiet", "-m", "configure product repositories");
  return { app1, app2, targets };
}

function rejectMergeCommit(repoRoot: string): () => void {
  const marker = join(repoRoot, ".git", "reject-merge");
  const hook = join(repoRoot, ".git", "hooks", "pre-merge-commit");
  writeFileSync(marker, "reject\n", "utf8");
  writeFileSync(
    hook,
    [
      "#!/bin/sh",
      `if [ -f '${marker}' ]; then`,
      "  echo 'intentional merge failure' >&2",
      "  exit 1",
      "fi",
      "exit 0",
      "",
    ].join("\n"),
    "utf8",
  );
  chmodSync(hook, 0o755);
  return () => rmSync(marker, { force: true });
}

function isAncestor(repoRoot: string, ancestor: string, descendant: string): boolean {
  try {
    git(repoRoot, "merge-base", "--is-ancestor", ancestor, descendant);
    return true;
  } catch {
    return false;
  }
}

function integrateRepoStatuses(root: string): Record<string, string | undefined> {
  const evidenceRoot = join(root, EXECUTION_REL, "exec", "evidence", "PJR-AB12");
  const runIds = readdirSync(evidenceRoot);
  expect(runIds).toHaveLength(1);
  const state = JSON.parse(
    readFileSync(join(evidenceRoot, runIds[0]!, "pipeline-state.json"), "utf8"),
  ) as { stages: { integrate: { repos?: Record<string, { status: string }> } } };
  return Object.fromEntries(
    Object.entries(state.stages.integrate.repos ?? {}).map(([repo, value]) => [repo, value.status]),
  );
}

function readRootResult(root: string): string {
  const resultDir = join(root, EXECUTION_REL, "exec", "results");
  const files = readdirSync(resultDir);
  expect(files).toHaveLength(1);
  return readFileSync(join(resultDir, files[0]!), "utf8");
}

function readIntegrateState(root: string): { status: string; repos?: Record<string, unknown> } {
  const evidenceRoot = join(root, EXECUTION_REL, "exec", "evidence", "PJR-AB12");
  const runIds = readdirSync(evidenceRoot);
  expect(runIds).toHaveLength(1);
  const state = JSON.parse(
    readFileSync(join(evidenceRoot, runIds[0]!, "pipeline-state.json"), "utf8"),
  ) as { stages: { integrate: { status: string; repos?: Record<string, unknown> } } };
  return state.stages.integrate;
}

// プロダクトの統合先の先端が runner の merge commit であり、merge commit とプロダクト側の commit が
// 修飾した `Refs:` を持ち、exec branch が撤去済みであることを確かめて、merge commit を返す。
function expectIntegratedProduct(repoRoot: string, target: string, repo: string): string {
  const mergeCommit = git(repoRoot, "rev-parse", target);
  expect(git(repoRoot, "rev-list", "--parents", "-n", "1", target).split(" ")).toHaveLength(3);
  expect(git(repoRoot, "log", "-1", "--format=%B", target)).toContain(`Refs: ${TRACE_KEY}`);
  expect(git(repoRoot, "log", "--format=%B", `${target}^1..${target}^2`)).toContain(
    `Refs: ${TRACE_KEY}`,
  );
  expect(git(repoRoot, "show", `${target}:src/feature.ts`)).toBe(
    `export const repo = ${JSON.stringify(repo)};`,
  );
  expect(git(repoRoot, "branch", "--list", EXEC_BRANCH)).toBe("");
  return mergeCommit;
}

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
          "  - nickname: exec-2",
          "    display_name: exec-2",
          "    email: null",
          "    roles: []",
          "    type: agent",
          "    provider: codex",
          "    mode: edit",
          "    stage_role: executor",
          "    capabilities: []",
          "    proficiency: normal",
          "    priority: 1",
          "  - nickname: exec-multi-repo",
          "    display_name: exec-multi-repo",
          "    email: null",
          "    roles: []",
          "    type: agent",
          "    provider: opencode",
          "    mode: edit",
          "    stage_role: executor",
          "    capabilities: []",
          "    proficiency: normal",
          "    priority: 1",
          "  - nickname: exec-advance-root",
          "    display_name: exec-advance-root",
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
          "  - nickname: exec-rate-limit",
          "    display_name: exec-rate-limit",
          "    email: null",
          "    roles: []",
          "    type: agent",
          "    provider: opencode",
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
          "rate_limit_detection:",
          "  exit_codes: [75]",
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
    "resolves per-item --executor-by assignments in dry-run and rejects assignments outside the target",
    { timeout: 30_000 },
    async () => {
      await withRepo(async ({ root, worktreeBase }) => {
        writeFileSync(
          join(root, REGISTER_REL, "pjr-cd34-pipeline-test.md"),
          buildTicket("PJR-CD34"),
          "utf8",
        );
        const stdout: string[] = [];
        vi.spyOn(process.stdout, "write").mockImplementation((chunk) => {
          stdout.push(String(chunk));
          return true;
        });
        vi.spyOn(process.stderr, "write").mockImplementation(() => true);

        await runExec([
          "run",
          "--project",
          "test",
          "--register",
          "PJR-AB12",
          "PJR-CD34",
          "--executor-by",
          "PJR-AB12=exec-1,PJR-CD34=exec-claude-protected-write",
          "--reporter-by",
          "report-1",
          "--worktree",
          "--worktree-base",
          worktreeBase,
          "--parallel",
          "2",
          "--dry-run",
        ]);

        const dryRunOutput = stdout.join("");
        expect(dryRunOutput).toMatch(/PJR-AB12[\s\S]*executor: exec-1/);
        expect(dryRunOutput).toMatch(/PJR-CD34[\s\S]*executor: exec-claude-protected-write/);
        expect(process.exitCode ?? 0).toBe(0);

        stdout.length = 0;
        await runExec([
          "run",
          "--project",
          "test",
          "--register",
          "PJR-AB12",
          "--executor-by",
          "PJR-AB12=exec-1,PJR-CD34=exec-claude-protected-write",
          "--reporter-by",
          "report-1",
          "--dry-run",
        ]);

        expect(stdout.join("")).toContain(
          "--executor-by item assignments include IDs outside the register execution target: PJR-CD34.",
        );
        expect(process.exitCode).toBe(1);
      });
    },
  );

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
        const evidence = JSON.parse(
          readFileSync(join(evidenceDir, runDirs[0], "evidence.json"), "utf8"),
        ) as { attempt_changes?: unknown };
        expect(evidence.attempt_changes).toBeUndefined();

        expect(process.exitCode ?? 0).toBe(0);
      });
    },
  );

  it(
    "runs two register items in parallel with different per-item executors",
    { timeout: 120_000 },
    async () => {
      await withRepo(async ({ root, worktreeBase }) => {
        writeFileSync(
          join(root, REGISTER_REL, "pjr-cd34-pipeline-test.md"),
          buildTicket("PJR-CD34"),
          "utf8",
        );
        vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        vi.spyOn(process.stderr, "write").mockImplementation(() => true);
        // 並行に走る 2 項目がどちらも登録簿の生成物を作り直すため、生成物を git で管理
        // していると統合で add/add の衝突になる。利用者と同じく config init で .gitignore
        // を用意し、案内どおり管理済みの生成物を git の管理から外す。
        await runConfig(["init"]);
        const trackedIgnored = git(root, "ls-files", "-ci", "--exclude-standard")
          .split("\n")
          .filter((line) => line.length > 0);
        expect(trackedIgnored.length).toBeGreaterThan(0);
        git(root, "rm", "-r", "--cached", "--quiet", ...trackedIgnored);
        git(root, "add", "-A");
        git(root, "commit", "-m", "add second register item");

        await runExec([
          "run",
          "--project",
          "test",
          "--register",
          "PJR-AB12",
          "PJR-CD34",
          "--executor-by",
          "PJR-AB12=exec-1,PJR-CD34=exec-2",
          "--reporter-by",
          "report-1",
          "--worktree",
          "--worktree-base",
          worktreeBase,
          "--parallel",
          "2",
        ]);

        for (const [id, expectedExecutor] of [
          ["PJR-AB12", "exec-1"],
          ["PJR-CD34", "exec-2"],
        ] as const) {
          const ticketName =
            id === "PJR-AB12" ? "pjr-ab12-pipeline-test.md" : "pjr-cd34-pipeline-test.md";
          expect(readFileSync(join(root, REGISTER_REL, ticketName), "utf8")).toContain(
            "item_status: review",
          );
          const evidenceDir = join(root, EXECUTION_REL, "exec", "evidence", id);
          const runDirs = readdirSync(evidenceDir);
          expect(runDirs).toHaveLength(1);
          const state = JSON.parse(
            readFileSync(join(evidenceDir, runDirs[0], "pipeline-state.json"), "utf8"),
          ) as { stages: { executor: { actor: string }; reporter: { actor: string } } };
          expect(state.stages.executor.actor).toBe(expectedExecutor);
          expect(state.stages.reporter.actor).toBe("report-1");
        }
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
    "resumes a hook-rejected merge without reverting changes added after branch creation",
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
          "exec-advance-root",
          "--reporter-by",
          "report-1",
          "--worktree",
          "--worktree-base",
          worktreeBase,
        ]);

        expect(process.exitCode).toBe(1);
        expect(() => git(root, "rev-parse", "--verify", "MERGE_HEAD")).toThrow();
        expect(Number(git(root, "rev-list", "--first-parent", "--count", "HEAD"))).toBe(
          firstParentBefore + 2,
        );
        expect(readFileSync(join(root, CONCURRENT_ARTIFACT), "utf8")).toBe(
          "# concurrent artifact\n",
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
          firstParentBefore + 3,
        );
        expect(readFileSync(join(root, CONCURRENT_ARTIFACT), "utf8")).toBe(
          "# concurrent artifact\n",
        );
        expect(git(root, "diff", "--name-only", "HEAD^1", "HEAD")).not.toContain(
          CONCURRENT_ARTIFACT,
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

  // PJR-69VP: プロジェクトリポジトリ 1 つとプロダクトリポジトリ 2 つ（app2 は integration_branch を
  // 宣言）で、1 つの項目が 3 つのリポジトリを変更する run が、worktree の作成から統合・trace の
  // 記録・撤去まで通ることを確かめる。
  it(
    "changes three repositories in one item and integrates them with the qualified Refs and the trace",
    { timeout: 120_000 },
    async () => {
      await withRepo(async ({ root, worktreeBase }) => {
        vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        vi.spyOn(process.stderr, "write").mockImplementation(() => true);
        const products = enableProductRepositories(root);

        try {
          await runExec([
            "run",
            "--project",
            "test",
            "--register",
            "PJR-AB12",
            "--executor-by",
            "exec-multi-repo",
            "--reporter-by",
            "report-1",
            "--worktree",
            "--worktree-base",
            worktreeBase,
          ]);

          expect(process.exitCode ?? 0).toBe(0);
          expect(
            readFileSync(join(root, REGISTER_REL, "pjr-ab12-pipeline-test.md"), "utf8"),
          ).toContain("item_status: review");

          // agent の cwd は <worktree_base>/<task>/project/。プロダクトは同じタスクの隣に置かれる。
          expect(readFileSync(join(root, AGENT_CWD_RECORD), "utf8")).toBe(
            `${join(realpathSync(worktreeBase), TASK_DIR_NAME, "project")}\n`,
          );
          expect(readFileSync(join(root, MULTI_REPO_ARTIFACT), "utf8")).toBe(
            "# project artifact\n",
          );

          const app1Merge = expectIntegratedProduct(products.app1, products.targets.app1, "app1");
          const app2Merge = expectIntegratedProduct(products.app2, products.targets.app2, "app2");

          // プロジェクト側は merge commit 1 件で、修飾した Refs を持つ（PJR-30SW）。
          const projectMessage = git(root, "log", "-1", "--format=%B");
          expect(projectMessage).toContain("Transition: start → review");
          expect(projectMessage).toContain(`Refs: ${TRACE_KEY}`);
          expect(projectMessage).not.toMatch(/^Refs: PJR-AB12$/m);
          expect(git(root, "rev-list", "--parents", "-n", "1", "HEAD").split(" ")).toHaveLength(3);

          // result にはプロダクトの統合先の commit snapshot が記録される。
          const result = readRootResult(root);
          expect(result).toContain("status: complete");
          expect(result).toMatch(/^## \d+\. トレーサビリティ$/m);
          expect(result).toContain(`\`${app1Merge}\``);
          expect(result).toContain(`\`${app2Merge}\``);
          expect(result).toContain(`\`${products.targets.app2}\``);

          const integrate = readIntegrateState(root);
          expect(integrate.status).toBe("succeeded");
          expect(integrateRepoStatuses(root)).toEqual({
            app1: "merged",
            app2: "merged",
            project: "merged",
          });

          // 全リポジトリの worktree と exec branch が撤去される。
          expect(existsSync(join(worktreeBase, TASK_DIR_NAME))).toBe(false);
          expect(execWorktreePath(root)).toBeNull();
          expect(git(root, "branch", "--list", EXEC_BRANCH)).toBe("");
        } finally {
          rmSync(products.app1, { recursive: true, force: true });
          rmSync(products.app2, { recursive: true, force: true });
        }
      });
    },
  );

  // PJR-69VP: repos を宣言しない構成（同一リポジトリ構成を含む）の回帰。worktree は
  // <worktree_base>/<task>/ 直下に置かれ、Refs は修飾形、result は trace の章を持たず、
  // pipeline state はリポジトリ別の統合状態を持たない。
  it(
    "keeps the single-repository layout and result when no repos are declared",
    { timeout: 120_000 },
    async () => {
      await withRepo(async ({ root, worktreeBase }) => {
        vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        vi.spyOn(process.stderr, "write").mockImplementation(() => true);

        await runExec([
          "run",
          "--project",
          "test",
          "--register",
          "PJR-AB12",
          "--executor-by",
          "exec-multi-repo",
          "--reporter-by",
          "report-1",
          "--worktree",
          "--worktree-base",
          worktreeBase,
        ]);

        expect(process.exitCode ?? 0).toBe(0);
        expect(
          readFileSync(join(root, REGISTER_REL, "pjr-ab12-pipeline-test.md"), "utf8"),
        ).toContain("item_status: review");
        expect(readFileSync(join(root, AGENT_CWD_RECORD), "utf8")).toBe(
          `${join(realpathSync(worktreeBase), TASK_DIR_NAME)}\n`,
        );
        expect(readFileSync(join(root, MULTI_REPO_ARTIFACT), "utf8")).toBe("# project artifact\n");
        const projectMessage = git(root, "log", "-1", "--format=%B");
        expect(projectMessage).toContain("Transition: start → review");
        expect(projectMessage).toContain(`Refs: ${TRACE_KEY}`);
        expect(readRootResult(root)).not.toContain("トレーサビリティ");
        const integrate = readIntegrateState(root);
        expect(integrate.status).toBe("succeeded");
        expect(integrate.repos).toBeUndefined();
        expect(existsSync(join(worktreeBase, TASK_DIR_NAME))).toBe(false);
        expect(git(root, "branch", "--list", EXEC_BRANCH)).toBe("");
      });
    },
  );

  // PJR-9KST: 部分統合が waiting に戻った後の `--resume` で、root に再記帳した
  // 個票・event・派生ビューが project の事前検査を妨げないことを、3 つの失敗位置で確かめる。
  const multiRepoFailurePositions: Array<{
    failing: "app1" | "app2" | "project";
    integratedBefore: ReadonlyArray<"app1" | "app2">;
    expectedStatuses: Record<"app1" | "app2" | "project", string>;
  }> = [
    {
      failing: "app1",
      integratedBefore: [],
      expectedStatuses: { app1: "failed", app2: "pending", project: "pending" },
    },
    {
      failing: "app2",
      integratedBefore: ["app1"],
      expectedStatuses: { app1: "merged", app2: "failed", project: "pending" },
    },
    {
      failing: "project",
      integratedBefore: ["app1", "app2"],
      expectedStatuses: { app1: "merged", app2: "merged", project: "failed" },
    },
  ];

  for (const position of multiRepoFailurePositions) {
    it(
      `releases resumed register bookkeeping when the ${position.failing} merge failed`,
      { timeout: 180_000 },
      async () => {
        await withRepo(async ({ root, worktreeBase }) => {
          vi.spyOn(process.stdout, "write").mockImplementation(() => true);
          vi.spyOn(process.stderr, "write").mockImplementation(() => true);
          const products = enableProductRepositories(root);
          const productRoots = { app1: products.app1, app2: products.app2 };
          const failingRoot =
            position.failing === "project" ? root : productRoots[position.failing];
          const allowMerge = rejectMergeCommit(failingRoot);

          try {
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
            expect(
              readFileSync(join(root, REGISTER_REL, "pjr-ab12-pipeline-test.md"), "utf8"),
            ).toContain("item_status: waiting");
            const worktreePath = execWorktreePath(root);
            expect(worktreePath).not.toBeNull();
            expect(integrateRepoStatuses(worktreePath ?? "")).toEqual(position.expectedStatuses);
            // PJR-69VP: 失敗後も、タスクの全リポジトリの worktree が残る。
            for (const repo of ["project", "app1", "app2"]) {
              expect(existsSync(join(worktreeBase, TASK_DIR_NAME, repo))).toBe(true);
            }
            expect(isAncestor(root, EXEC_BRANCH, "HEAD")).toBe(false);

            const mergedBefore = new Map<"app1" | "app2", string>();
            for (const repo of ["app1", "app2"] as const) {
              const merged = isAncestor(
                productRoots[repo],
                "exec/test-PJR-AB12",
                products.targets[repo],
              );
              expect(merged).toBe(position.integratedBefore.includes(repo));
              if (merged) {
                mergedBefore.set(
                  repo,
                  git(productRoots[repo], "rev-parse", products.targets[repo]),
                );
              }
            }

            allowMerge();
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
            expect(
              readFileSync(join(root, REGISTER_REL, "pjr-ab12-pipeline-test.md"), "utf8"),
            ).toContain("item_status: review");
            expect(integrateRepoStatuses(root)).toEqual({
              app1: "merged",
              app2: "merged",
              project: "merged",
            });
            for (const [repo, commit] of mergedBefore) {
              expect(git(productRoots[repo], "rev-parse", products.targets[repo])).toBe(commit);
            }
            // PJR-69VP: 再開後も Refs は修飾形で、result の trace には各プロダクトの merge commit が入る。
            const app1Merge = expectIntegratedProduct(products.app1, products.targets.app1, "app1");
            const app2Merge = expectIntegratedProduct(products.app2, products.targets.app2, "app2");
            expect(git(root, "log", "-1", "--format=%B")).toContain(`Refs: ${TRACE_KEY}`);
            const result = readRootResult(root);
            expect(result).toContain(`\`${app1Merge}\``);
            expect(result).toContain(`\`${app2Merge}\``);
            expect(existsSync(join(worktreeBase, TASK_DIR_NAME))).toBe(false);
          } finally {
            allowMerge();
            rmSync(products.app1, { recursive: true, force: true });
            rmSync(products.app2, { recursive: true, force: true });
          }
        });
      },
    );
  }

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
        writeFileSync(join(worktreePath ?? "", "docs", "protection-applied"), "applied\n", "utf8");

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
        expect(existsSync(join(root, "docs", "protection-applied"))).toBe(true);
        expect(execWorktreePath(root)).toBeNull();
        expect(Number(git(root, "rev-list", "--first-parent", "--count", "HEAD"))).toBe(
          beforeResume + 1,
        );
        expect(git(root, "log", "-1", "--pretty=%B")).toContain("Transition: start → review");
      });
    },
    120_000,
  );

  it(
    "rejects a resumed target-less register executor that omits the first-attempt change lower bound",
    { timeout: 120_000 },
    async () => {
      await withRepo(async ({ root, worktreeBase }) => {
        vi.spyOn(process.stdout, "write").mockImplementation(() => true);
        vi.spyOn(process.stderr, "write").mockImplementation(() => true);

        await runExec([
          "run",
          "--project",
          "test",
          "--register",
          "PJR-AB12",
          "--executor-by",
          "exec-rate-limit",
          "--reporter-by",
          "report-1",
          "--worktree",
          "--worktree-base",
          worktreeBase,
        ]);

        expect(process.exitCode).toBe(1);
        const worktreePath = execWorktreePath(root);
        expect(worktreePath).not.toBeNull();
        const evidenceDir = join(worktreePath ?? "", EXECUTION_REL, "exec", "evidence", "PJR-AB12");
        const firstRunId = readdirSync(evidenceDir)[0];
        const firstEvidence = JSON.parse(
          readFileSync(join(evidenceDir, firstRunId, "evidence.json"), "utf8"),
        ) as { attempt_changes?: Array<{ path: string }> };
        expect(firstEvidence.attempt_changes).toEqual([{ path: PARTIAL_ARTIFACT, status: "??" }]);

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

        expect(process.exitCode).toBe(1);
        expect(execWorktreePath(root)).not.toBeNull();
        const runIds = readdirSync(evidenceDir).sort();
        expect(runIds).toHaveLength(2);
        const resumedState = JSON.parse(
          readFileSync(join(evidenceDir, runIds[1], "pipeline-state.json"), "utf8"),
        ) as { stages: { executor: { status: string }; reporter: { status: string } } };
        expect(resumedState.stages.executor.status).toBe("failed");
        expect(resumedState.stages.reporter.status).toBe("pending");
        expect(
          readFileSync(join(root, REGISTER_REL, "pjr-ab12-pipeline-test.md"), "utf8"),
        ).toContain(`resumed executor did not account for every plan target: ${PARTIAL_ARTIFACT}`);
      });
    },
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
