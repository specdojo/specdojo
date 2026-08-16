import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerExecCommands } from "../../src/exec.js";
import { gitEnvironment } from "../../src/exec-worktree.js";
import * as spawnSelfModule from "../../src/spawn-self.js";

// executor / reporter パイプラインの E2E 検証。plan 生成、agent 起動、evidence 収集、
// reporter 出力の検証、result 描画までを CLI 経路で通し、従来の単一 agent フローとの
// 後方互換、ローカル LLM 構成、クラウド executor 構成、失敗経路を確認する。

const originalCwd = process.cwd();
const ENV_KEYS = ["SPECDOJO_PROJECT", "SPECDOJO_SCHEDULE_PATH", "SPECDOJO_EXECUTION_PATH"];
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

// executor が stdout へ出すが evidence 本文には載らないマーカー。ログ本文が reporter へ
// 渡らないこと（ログは参照のみ）を確認するために使う。
const RAW_LOG_MARKER = "raw-executor-log-marker";

type AgentBehavior = {
  role: "executor" | "reporter" | "legacy";
  kind?: "ok" | "fail" | "invalid" | "blocked";
  task?: string;
};

type AgentInvocation = {
  nickname: string;
  model: string;
  effort: string;
  mode: string;
  role: string;
  prompt: string;
};

// テスト用の agent 実装。provider の command_template から nickname / model / effort を
// 受け取り、behavior ファイルの指定に従って executor / reporter / 従来 agent として振る舞う。
const FAKE_AGENT_SCRIPT = `
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function arg(name) {
  const index = process.argv.indexOf("--" + name);
  return index >= 0 ? (process.argv[index + 1] ?? "") : "";
}

const logPath = arg("log");
const behaviorPath = arg("behavior");
const nickname = arg("nickname");
const model = arg("model");
const effort = arg("effort");
const mode = arg("mode");
const prompt = readFileSync(0, "utf8");
const behaviors = JSON.parse(readFileSync(behaviorPath, "utf8"));
const behavior = behaviors[nickname] ?? { role: "legacy", kind: "ok" };
appendFileSync(
  logPath,
  JSON.stringify({ nickname, model, effort, mode, role: behavior.role, prompt }) + "\\n",
  "utf8",
);

if (behavior.role === "executor") {
  if (behavior.kind === "fail") {
    process.stderr.write("blocked: validation command failed; need=fix the failing test\\n");
    process.exit(1);
  }
  writeFileSync("pipeline-artifact.md", "# " + nickname + " / " + model + "\\n", "utf8");
  process.stdout.write("${RAW_LOG_MARKER} api_key: sk-proj-abcdefgh12345678\\n");
  process.stdout.write(
    "<specdojo_executor_evidence>" +
      JSON.stringify({
        final_message: "pipeline-artifact.md を更新し、検証を実行した。",
        validations: [{ command: "npm test", status: "passed", summary: "全テストが成功した。" }],
      }) +
      "</specdojo_executor_evidence>\\n",
  );
  process.exit(0);
}

if (behavior.role === "reporter") {
  if (behavior.kind === "fail") {
    process.stderr.write("reporter process failed\\n");
    process.exit(1);
  }
  if (behavior.kind === "invalid") {
    process.stdout.write(JSON.stringify({ schema_version: 1, mode: "edit" }));
    process.exit(0);
  }
  const blocked = behavior.kind === "blocked";
  process.stdout.write(
    JSON.stringify({
      schema_version: 1,
      mode: "edit",
      outcome: blocked ? "blocked" : "complete",
      summary: blocked
        ? ["検証が完了しなかったため結果を確定できなかった。"]
        : ["成果物を更新し、検証を完了した。"],
      changed_files: [{ path: "pipeline-artifact.md", summary: "文書を更新した。" }],
      handoff: [],
      approach: "plan と executor evidence だけを根拠に結果を構成した。",
      block_reason: blocked ? "検証コマンドの結果が evidence に含まれていない。" : "",
    }),
  );
  process.exit(0);
}

writeFileSync("legacy-artifact.md", "# legacy\\n", "utf8");
const resultPath = join(
  process.env.SPECDOJO_EXECUTION_PATH ?? "",
  "exec",
  "results",
  behavior.task + "-result.md",
);
const current = readFileSync(resultPath, "utf8");
writeFileSync(
  resultPath,
  current.replace(/_TODO_: [^\\n]*/g, "従来フローの agent が自身で記入した。"),
  "utf8",
);
process.exit(0);
`;

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", env: gitEnvironment() }).trim();
}

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

type PipelineFixture = {
  repo: string;
  executionPath: string;
  logPath: string;
  behaviorPath: string;
  parentValidationDir: string;
  parentValidationLogPath: string;
  parentValidationBehaviorPath: string;
};

function writeMembers(repo: string): void {
  const member = (
    nickname: string,
    provider: string,
    proficiency: string,
    stageRole?: string,
  ): string[] => [
    `  - nickname: ${nickname}`,
    `    display_name: ${nickname}`,
    "    email: null",
    "    roles: [DEV]",
    "    type: agent",
    `    provider: ${provider}`,
    "    mode: edit",
    ...(stageRole ? [`    stage_role: ${stageRole}`] : []),
    "    capabilities: []",
    `    proficiency: ${proficiency}`,
    "    priority: 1",
  ];

  writeFileSync(
    join(repo, "pm-members.yaml"),
    [
      "version: 1",
      "project_id: test",
      "members:",
      // 従来フロー専用（stage_role なし）
      ...member("legacy-edit-agent", "opencode", "normal"),
      // ローカル LLM の pipeline 構成（executor / reporter とも同一 provider）
      ...member("local-gemma-executor", "opencode", "normal", "executor"),
      ...member("local-gemma-reporter", "opencode", "normal", "reporter"),
      // クラウド executor（reporter はローカルと共通）
      ...member("cloud-expert-executor", "codex", "expert", "executor"),
      "",
    ].join("\n"),
    "utf8",
  );
}

function writeExecDefaults(repo: string, logPath: string, behaviorPath: string): void {
  const base = `node ${join(repo, "fake-agent.mjs")} --log ${logPath} --behavior ${behaviorPath} --nickname {nickname} --mode {mode}`;
  writeFileSync(
    join(repo, ".specdojo", "exec-defaults.yaml"),
    [
      "pipeline:",
      "  parent_validations:",
      "    - test-integration",
      "rate_limit_detection:",
      "  exit_codes: []",
      "  stderr_patterns:",
      '    - "rate limit"',
      "providers:",
      "  opencode:",
      // ローカル Ollama は単一モデルを共有するため直列化する。
      "    max_concurrency: 1",
      `    command_template: "${base} --model {model}"`,
      "    command_params:",
      "      by_proficiency:",
      "        normal: { model: gemma3-12b }",
      "        expert: { model: gemma3-27b }",
      "  codex:",
      `    command_template: "${base} --model {model} --effort {effort}"`,
      "    command_params:",
      "      by_proficiency:",
      "        expert: { model: gpt-5-codex, effort: high }",
      "",
    ].join("\n"),
    "utf8",
  );
}

function writeSchedule(repo: string): void {
  const pipelinePhase = (executorProficiency: string): string[] => [
    "    - id: draft",
    "      name: Draft",
    '      task_suffix: "010"',
    "      mode: edit",
    "      agent_pipeline:",
    "        stages:",
    "          - stage_role: executor",
    `            proficiency: ${executorProficiency}`,
    "          - stage_role: reporter",
    "            proficiency: normal",
  ];

  writeFileSync(
    join(repo, "schedule", "sch-strategy-test.yaml"),
    [
      "kind: strategy",
      "track: test",
      "phase_sets:",
      "  local-pipeline:",
      ...pipelinePhase("normal"),
      "  cloud-pipeline:",
      ...pipelinePhase("expert"),
      "  legacy-single:",
      "    - id: draft",
      "      name: Draft",
      '      task_suffix: "010"',
      "      mode: edit",
      "      proficiency: normal",
      "owner_rules:",
      "  - local_ids: [doc]",
      "    owner: DEV",
      "    phase_set: local-pipeline",
      "  - local_ids: [deep]",
      "    owner: DEV",
      "    phase_set: cloud-pipeline",
      "  - local_ids: [plain]",
      "    owner: DEV",
      "    phase_set: legacy-single",
      "",
    ].join("\n"),
    "utf8",
  );

  const task = (localId: string, name: string): string[] => [
    `  - local_id: ${localId}`,
    '    phase_suffix: "010"',
    `    name: ${name}`,
    "    duration_days: 1",
    "    depends_on: []",
    "    owner: DEV",
  ];
  writeFileSync(
    join(repo, "schedule", "sch-track-test.yaml"),
    [
      "kind: track",
      "id: test:sch-track-test",
      "type: project",
      "status: draft",
      "version: 1",
      "project_id: test",
      "track: test",
      "tasks:",
      ...task("doc", "Local pipeline document"),
      ...task("deep", "Cloud pipeline document"),
      ...task("plain", "Legacy single-agent document"),
      "",
    ].join("\n"),
    "utf8",
  );
}

function writeCatalog(repo: string): void {
  const deliverable = (localId: string, name: string): string[] => [
    `      - local_id: ${localId}`,
    `        name: ${name}`,
    "        kind: work",
    "        overview: Overview text",
    `        path: ${localId}.md`,
    "        done_criteria:",
    "          - text: Content is complete",
    "            roles: [DEV]",
    "            viewpoint: vp-dev-quality",
  ];
  writeFileSync(
    join(repo, "catalog", "dct-test.yaml"),
    [
      "id: test:dct",
      "type: project",
      "status: draft",
      "project_id: test",
      "domain: test",
      "base_path: /docs/test",
      "groups:",
      "  - deliverables:",
      ...deliverable("doc", "Local pipeline document"),
      ...deliverable("deep", "Cloud pipeline document"),
      ...deliverable("plain", "Legacy single-agent document"),
      "",
    ].join("\n"),
    "utf8",
  );
}

function writeTemplates(repo: string): void {
  const templates = join(repo, "docs", "ja", "specdojo", "templates");
  writeFileSync(
    join(templates, "xep-template.md"),
    "_FRONTMATTER_\n\n# Edit Plan: _TASK_ID_\n\n_DONE_CRITERIA_GOALS_\n",
    "utf8",
  );
  writeFileSync(
    join(templates, "xer-template.md"),
    [
      "_FRONTMATTER_",
      "",
      "# Edit Result",
      "",
      "## 1. 実施内容",
      "",
      "_TODO_: 実施した内容の要約を記入する。",
      "",
      "## 2. 変更ファイル",
      "",
      "_TODO_: 変更したファイルのパスを記入する。",
      "",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(
    join(templates, "xrp-viewpoint-detail-template.md"),
    "### _VP_ID_\n\n_VP_CHECK_\n",
    "utf8",
  );
  writeFileSync(
    join(templates, "xep-common-conventions-template.md"),
    "## 記法・リンク規約（共通）\n\n- リンクは `[[id|title]]` 形式。\n",
    "utf8",
  );
}

function setupPipelineRepository(): PipelineFixture {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-pipeline-e2e-"));
  const parentValidationDir = mkdtempSync(join(tmpdir(), "specdojo-parent-validation-e2e-"));
  const parentValidationLogPath = join(parentValidationDir, "runs.log");
  const parentValidationBehaviorPath = join(parentValidationDir, "behavior.txt");
  for (const dir of [
    join(repo, ".specdojo"),
    join(repo, "schedule"),
    join(repo, "catalog"),
    join(repo, "execution", "exec", "events"),
    join(repo, "docs", "ja", "specdojo", "templates"),
  ]) {
    mkdirSync(dir, { recursive: true });
  }

  const logPath = join(repo, "agent-invocations.jsonl");
  const behaviorPath = join(repo, "agent-behavior.json");
  writeFileSync(logPath, "", "utf8");
  writeFileSync(parentValidationLogPath, "", "utf8");
  writeFileSync(parentValidationBehaviorPath, "pass\n", "utf8");
  writeFileSync(join(repo, "fake-agent.mjs"), FAKE_AGENT_SCRIPT, "utf8");
  writeFileSync(
    join(repo, "parent-validation.mjs"),
    [
      'import { appendFileSync, readFileSync } from "node:fs";',
      `const logPath = ${JSON.stringify(parentValidationLogPath)};`,
      `const behaviorPath = ${JSON.stringify(parentValidationBehaviorPath)};`,
      'appendFileSync(logPath, "run\\n", "utf8");',
      'const behavior = readFileSync(behaviorPath, "utf8").trim();',
      'process.stdout.write("integration validation " + behavior + "\\n");',
      'process.exit(behavior === "pass" ? 0 : 1);',
      "",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(
    join(repo, "package.json"),
    `${JSON.stringify({ scripts: { "test:integration": "node parent-validation.mjs" } }, null, 2)}\n`,
    "utf8",
  );
  writeFileSync(
    join(repo, ".specdojo", "specdojo.config.json"),
    `${JSON.stringify(
      {
        version: 1,
        current_project: "test",
        projects: {
          test: {
            schedule_path: "schedule",
            execution_path: "execution",
            catalog_path: "catalog",
            members_path: "pm-members.yaml",
          },
        },
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  writeMembers(repo);
  writeExecDefaults(repo, logPath, behaviorPath);
  writeSchedule(repo);
  writeCatalog(repo);
  writeTemplates(repo);
  setBehavior(behaviorPath, {});

  // evidence は git status / diff から変更ファイルを収集するため、実リポジトリを用意し、
  // agent 実行前の状態をコミットしておく。
  git(repo, "init");
  git(repo, "config", "user.name", "SpecDojo Test");
  git(repo, "config", "user.email", "specdojo@example.invalid");
  git(repo, "config", "commit.gpgsign", "false");
  git(repo, "add", "-A");
  git(repo, "commit", "-m", "initial");

  return {
    repo,
    executionPath: join(repo, "execution"),
    logPath,
    behaviorPath,
    parentValidationDir,
    parentValidationLogPath,
    parentValidationBehaviorPath,
  };
}

function setBehavior(behaviorPath: string, behaviors: Record<string, AgentBehavior>): void {
  writeFileSync(
    behaviorPath,
    `${JSON.stringify(
      {
        "legacy-edit-agent": { role: "legacy", kind: "ok", task: "T-TEST-plain-010" },
        "local-gemma-executor": { role: "executor", kind: "ok" },
        "cloud-expert-executor": { role: "executor", kind: "ok" },
        "local-gemma-reporter": { role: "reporter", kind: "ok" },
        ...behaviors,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
}

function readInvocations(logPath: string): AgentInvocation[] {
  return readFileSync(logPath, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as AgentInvocation);
}

function evidenceRunDir(fixture: PipelineFixture, taskId: string): string {
  const taskDir = join(fixture.executionPath, "exec", "evidence", taskId);
  const runs = readdirSync(taskDir).sort();
  expect(runs).toHaveLength(1);
  return join(taskDir, runs[0]);
}

type TaskEvent = { type: string; task_id: string; by: string; meta?: Record<string, unknown> };

function readTaskEvents(fixture: PipelineFixture, taskId: string): TaskEvent[] {
  const dir = join(fixture.executionPath, "exec", "events");
  return readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => JSON.parse(readFileSync(join(dir, file), "utf8")) as TaskEvent)
    .filter((event) => event.task_id === taskId);
}

function readResult(fixture: PipelineFixture, taskId: string): string {
  return readFileSync(
    join(fixture.executionPath, "exec", "results", `${taskId}-result.md`),
    "utf8",
  );
}

afterEach(() => {
  process.chdir(originalCwd);
  clearProjectEnv();
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  process.exitCode = undefined;
  vi.restoreAllMocks();
});

describe("executor / reporter pipeline E2E", () => {
  let fixture: PipelineFixture | undefined;

  function setup(): PipelineFixture {
    fixture = setupPipelineRepository();
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    process.chdir(fixture.repo);
    return fixture;
  }

  afterEach(() => {
    process.chdir(originalCwd);
    if (fixture) {
      rmSync(fixture.repo, { recursive: true, force: true });
      rmSync(fixture.parentValidationDir, { recursive: true, force: true });
    }
    fixture = undefined;
  });

  it("keeps the legacy single-agent flow unchanged for phases without agent_pipeline", async () => {
    const target = setup();

    await runExec(["run", "--project", "test", "--task", "T-TEST-plain-010"]);

    // pipeline を宣言していない phase では従来どおり単一 agent が plan をそのまま受け取り、
    // agent 自身が result を記入する。evidence / pipeline state は作られない。
    const invocations = readInvocations(target.logPath);
    expect(invocations).toHaveLength(1);
    expect(invocations[0].nickname).toBe("legacy-edit-agent");
    expect(invocations[0].prompt).toContain("# Edit Plan: T-TEST-plain-010");
    expect(invocations[0].prompt).not.toContain("executor stage");
    expect(existsSync(join(target.executionPath, "exec", "evidence"))).toBe(false);

    const result = readResult(target, "T-TEST-plain-010");
    expect(result).toContain("status: complete");
    expect(result).toContain("従来フローの agent が自身で記入した。");
    expect(process.exitCode).toBeUndefined();
  });

  it("runs a local LLM executor and reporter selected from the same provider template", async () => {
    const target = setup();

    await runExec(["run", "--project", "test", "--task", "T-TEST-doc-010"]);

    // stage 要件（stage_role + proficiency）だけで両 stage が自動選択され、
    // provider の command_template がメンバー属性で展開される。
    const invocations = readInvocations(target.logPath);
    expect(invocations.map((item) => item.nickname)).toEqual([
      "local-gemma-executor",
      "local-gemma-reporter",
    ]);
    expect(invocations[0].model).toBe("gemma3-12b");
    expect(invocations[1].model).toBe("gemma3-12b");
    expect(invocations[0].prompt).toContain("executor stage");
    expect(invocations[0].prompt).toContain("npm run test:unit");

    // 成果物は executor が更新し、result は reporter の構造化出力から runner が描画する。
    expect(readFileSync(join(target.repo, "pipeline-artifact.md"), "utf8")).toContain(
      "local-gemma-executor",
    );
    const result = readResult(target, "T-TEST-doc-010");
    expect(result).toContain("status: complete");
    expect(result).toContain("成果物を更新し、検証を完了した。");
    expect(result).toContain("`pipeline-artifact.md`: 文書を更新した。");
    expect(result).not.toContain("_TODO_");
    expect(process.exitCode).toBeUndefined();

    const runDir = evidenceRunDir(target, "T-TEST-doc-010");
    const evidence = JSON.parse(readFileSync(join(runDir, "evidence.json"), "utf8")) as {
      task_id: string;
      stage: { role: string; actor: string; status: string; attempts: number };
      changes: Array<{ path: string }>;
      validations: Array<{ command: string; status: string }>;
      final_message: string;
      log_refs: Array<{ path: string; truncated: boolean }>;
    };
    expect(evidence.task_id).toBe("T-TEST-doc-010");
    expect(evidence.stage).toMatchObject({
      role: "executor",
      actor: "local-gemma-executor",
      status: "succeeded",
      attempts: 1,
    });
    expect(evidence.changes.map((change) => change.path)).toContain("pipeline-artifact.md");
    expect(evidence.validations).toEqual([
      {
        source: "executor",
        command: "npm test",
        status: "passed",
        summary: "全テストが成功した。",
      },
      {
        id: "test-integration",
        source: "runner",
        command: "npm run test:integration",
        status: "passed",
        summary: expect.stringContaining("integration validation pass"),
      },
    ]);
    expect(readFileSync(target.parentValidationLogPath, "utf8")).toBe("run\n");

    const state = JSON.parse(readFileSync(join(runDir, "pipeline-state.json"), "utf8")) as {
      stages: Record<string, { status: string; actor: string; attempts: number }>;
    };
    expect(state.stages.executor).toMatchObject({
      status: "succeeded",
      actor: "local-gemma-executor",
    });
    expect(state.stages.reporter).toMatchObject({
      status: "succeeded",
      actor: "local-gemma-reporter",
    });
  });

  it("hands the reporter bounded evidence only, keeping raw log text and secrets out of the prompt", async () => {
    const target = setup();

    await runExec(["run", "--project", "test", "--task", "T-TEST-doc-010"]);

    const reporterPrompt = readInvocations(target.logPath)[1].prompt;
    // reporter へ渡すのは plan と上限つき evidence とスキーマだけで、生ログ本文は渡さない。
    expect(reporterPrompt).toContain("# Edit Plan: T-TEST-doc-010");
    expect(reporterPrompt).toContain("pipeline-artifact.md を更新し、検証を実行した。");
    expect(reporterPrompt).not.toContain(RAW_LOG_MARKER);

    const runDir = evidenceRunDir(target, "T-TEST-doc-010");
    const log = readFileSync(join(runDir, "executor.log"), "utf8");
    // ログは run 単位のファイルに残し、evidence からは参照だけを渡す。秘匿値は保存前に伏せる。
    expect(log).toContain(RAW_LOG_MARKER);
    expect(log).toContain("[REDACTED]");
    expect(log).not.toContain("sk-proj-abcdefgh12345678");
    const evidence = JSON.parse(readFileSync(join(runDir, "evidence.json"), "utf8")) as {
      log_refs: Array<{ kind: string; path: string }>;
    };
    expect(evidence.log_refs[0].kind).toBe("agent-output-excerpt");
    expect(evidence.log_refs[0].path).toContain("executor.log");
  });

  it("runs a cloud executor with the shared reporter and result path", async () => {
    const target = setup();

    await runExec(["run", "--project", "test", "--task", "T-TEST-deep-010"]);

    // expert 要件の stage はクラウド provider の executor を選び、reporter と result 生成は
    // ローカル構成と同じ経路を共有する。
    const invocations = readInvocations(target.logPath);
    expect(invocations.map((item) => item.nickname)).toEqual([
      "cloud-expert-executor",
      "local-gemma-reporter",
    ]);
    expect(invocations[0].model).toBe("gpt-5-codex");
    expect(invocations[0].effort).toBe("high");

    const result = readResult(target, "T-TEST-deep-010");
    expect(result).toContain("status: complete");
    expect(result).toContain("成果物を更新し、検証を完了した。");
    expect(process.exitCode).toBeUndefined();

    const state = JSON.parse(
      readFileSync(join(evidenceRunDir(target, "T-TEST-deep-010"), "pipeline-state.json"), "utf8"),
    ) as { stages: Record<string, { status: string; actor: string }> };
    expect(state.stages.executor).toMatchObject({
      status: "succeeded",
      actor: "cloud-expert-executor",
    });
    expect(state.stages.reporter).toMatchObject({
      status: "succeeded",
      actor: "local-gemma-reporter",
    });
  });

  it("blocks on executor failure without starting the reporter", async () => {
    const target = setup();
    setBehavior(target.behaviorPath, {
      "local-gemma-executor": { role: "executor", kind: "fail" },
    });

    await runExec(["run", "--project", "test", "--task", "T-TEST-doc-010"]);

    expect(process.exitCode).toBe(1);
    expect(readInvocations(target.logPath).map((item) => item.nickname)).toEqual([
      "local-gemma-executor",
    ]);

    const runDir = evidenceRunDir(target, "T-TEST-doc-010");
    const evidence = JSON.parse(readFileSync(join(runDir, "evidence.json"), "utf8")) as {
      stage: { status: string; exit_code: number };
    };
    expect(evidence.stage).toMatchObject({ status: "failed", exit_code: 1 });
    const state = JSON.parse(readFileSync(join(runDir, "pipeline-state.json"), "utf8")) as {
      stages: Record<string, { status: string }>;
    };
    expect(state.stages.executor.status).toBe("failed");
    expect(state.stages.reporter.status).toBe("pending");

    const result = readResult(target, "T-TEST-doc-010");
    expect(result).toContain("status: blocked");
    expect(result).toContain("validation command failed");
  });

  it("records a failed parent validation and blocks even if the reporter returns complete", async () => {
    const target = setup();
    writeFileSync(target.parentValidationBehaviorPath, "fail\n", "utf8");

    await runExec(["run", "--project", "test", "--task", "T-TEST-doc-010"]);

    expect(process.exitCode).toBe(1);
    expect(readInvocations(target.logPath).map((item) => item.role)).toEqual([
      "executor",
      "reporter",
    ]);
    const runDir = evidenceRunDir(target, "T-TEST-doc-010");
    const evidence = JSON.parse(readFileSync(join(runDir, "evidence.json"), "utf8")) as {
      validations: Array<{ id?: string; source?: string; status: string }>;
    };
    expect(evidence.validations).toContainEqual(
      expect.objectContaining({
        id: "test-integration",
        source: "runner",
        status: "failed",
      }),
    );
    expect(readResult(target, "T-TEST-doc-010")).toContain(
      "parent validation failed: test-integration",
    );
  });

  it("blocks on reporter output that never validates, keeping the executor evidence for resume", async () => {
    const target = setup();
    setBehavior(target.behaviorPath, {
      "local-gemma-reporter": { role: "reporter", kind: "invalid" },
    });

    await runExec(["run", "--project", "test", "--task", "T-TEST-doc-010"]);

    expect(process.exitCode).toBe(1);
    // 形式エラーは reporter だけを再実行し、executor は再実行しない。
    const invocations = readInvocations(target.logPath);
    expect(invocations.filter((item) => item.role === "executor")).toHaveLength(1);
    expect(invocations.filter((item) => item.role === "reporter")).toHaveLength(3);

    const runDir = evidenceRunDir(target, "T-TEST-doc-010");
    const state = JSON.parse(readFileSync(join(runDir, "pipeline-state.json"), "utf8")) as {
      stages: Record<string, { status: string; artifact_ref: string | null }>;
    };
    expect(state.stages.executor.status).toBe("succeeded");
    expect(state.stages.executor.artifact_ref).toContain("evidence.json");
    expect(state.stages.reporter.status).toBe("failed");

    const result = readResult(target, "T-TEST-doc-010");
    expect(result).toContain("status: blocked");
    expect(result).toContain("format attempts");
  });

  it("blocks when the reporter reports outcome blocked", async () => {
    const target = setup();
    setBehavior(target.behaviorPath, {
      "local-gemma-reporter": { role: "reporter", kind: "blocked" },
    });

    await runExec(["run", "--project", "test", "--task", "T-TEST-doc-010"]);

    expect(process.exitCode).toBe(1);
    const result = readResult(target, "T-TEST-doc-010");
    expect(result).toContain("status: blocked");
    expect(result).toContain("検証コマンドの結果が evidence に含まれていない。");
  });

  it("rejects an executor override whose member is not a pipeline executor", async () => {
    const target = setup();

    await runExec([
      "run",
      "--project",
      "test",
      "--task",
      "T-TEST-doc-010",
      "--executor-by",
      "legacy-edit-agent",
    ]);

    expect(process.exitCode).toBe(1);
    expect(readInvocations(target.logPath)).toHaveLength(0);
  });
});

// worktree 経路の失敗と復旧。block イベントに残した stage checkpoint から reporter だけを
// 再開し、executor を再実行しないことを確認する。claim / complete / block は runner が
// specdojo CLI を再起動して記録するため、テストでは同じ CLI を実プロセスとして起動する。
describe("executor / reporter pipeline resume E2E (worktree)", () => {
  const specdojoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
  let fixture: PipelineFixture | undefined;
  let worktreeBase: string | undefined;

  afterEach(() => {
    process.chdir(originalCwd);
    if (worktreeBase) rmSync(worktreeBase, { recursive: true, force: true });
    if (fixture) {
      rmSync(fixture.repo, { recursive: true, force: true });
      rmSync(fixture.parentValidationDir, { recursive: true, force: true });
    }
    worktreeBase = undefined;
    fixture = undefined;
  });

  // Spawns real git worktree + child-process commands; needs more than the 5s default
  // when the full suite runs in parallel under load.
  it("resumes the reporter from persisted evidence instead of rerunning the executor", async () => {
    fixture = setupPipelineRepository();
    worktreeBase = mkdtempSync(join(tmpdir(), "specdojo-pipeline-e2e-wt-"));
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    // 子プロセスとして再起動する自コマンドを、この作業ツリーの specdojo CLI に固定する。
    vi.spyOn(spawnSelfModule, "selfRunArgs").mockImplementation((subArgs: string[]) => [
      process.execPath,
      [
        join(specdojoRoot, "node_modules", ".bin", "tsx"),
        join(specdojoRoot, "src", "specdojo.ts"),
        ...subArgs,
      ],
    ]);
    process.chdir(fixture.repo);

    // 1回目: reporter がプロセス失敗し、executor evidence を残したまま blocked になる。
    setBehavior(fixture.behaviorPath, {
      "local-gemma-reporter": { role: "reporter", kind: "fail" },
    });
    await runExec([
      "run",
      "--project",
      "test",
      "--task",
      "T-TEST-doc-010",
      "--worktree",
      "--worktree-base",
      worktreeBase,
    ]);

    expect(process.exitCode).toBe(1);
    const blockEvent = readTaskEvents(fixture, "T-TEST-doc-010").find(
      (event) => event.type === "block",
    );
    expect(blockEvent?.meta).toMatchObject({ pipeline_stage: "reporter" });
    expect(String(blockEvent?.meta?.pipeline_state_ref)).toContain("pipeline-state.json");
    expect(String(blockEvent?.meta?.evidence_ref)).toContain("evidence.json");

    // 2回目: reporter を復旧させて再開する。executor は再実行されない。
    setBehavior(fixture.behaviorPath, {});
    await runExec([
      "resume",
      "--project",
      "test",
      "--task",
      "T-TEST-doc-010",
      "--worktree-base",
      worktreeBase,
    ]);

    const invocations = readInvocations(fixture.logPath);
    expect(invocations.filter((item) => item.role === "executor")).toHaveLength(1);
    expect(invocations.filter((item) => item.role === "reporter")).toHaveLength(2);
    expect(readFileSync(fixture.parentValidationLogPath, "utf8")).toBe("run\n");

    const result = readResult(fixture, "T-TEST-doc-010");
    expect(result).toContain("status: complete");
    expect(result).toContain("成果物を更新し、検証を完了した。");
    // 同一秒に書かれるイベントはファイル名順が確定しないため、種別の集合で確認する。
    const eventTypes = readTaskEvents(fixture, "T-TEST-doc-010").map((event) => event.type);
    expect(eventTypes.sort()).toEqual(["block", "claim", "complete", "unblock"]);
  }, 20_000);
});
