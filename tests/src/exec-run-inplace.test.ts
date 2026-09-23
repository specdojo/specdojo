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
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerExecCommands } from "../../src/exec.js";
import * as execWorktree from "../../src/exec-worktree.js";

const originalCwd = process.cwd();
const ENV_KEYS = ["SPECDOJO_PROJECT", "SPECDOJO_SCHEDULE_PATH", "SPECDOJO_EXECUTION_PATH"];
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

const FAKE_AGENT_CMD =
  `node -e "const fs=require('node:fs');` +
  `fs.writeFileSync('agent-ran.txt',fs.readFileSync(0,'utf8'))"`;
const FAKE_AGENT_NICKNAME = "test-edit-agent";

function configurePipeline(repo: string, reporterCommandOverride?: string): void {
  const executorCommand =
    `node -e "const fs=require('node:fs');fs.readFileSync(0,'utf8');` +
    `fs.writeFileSync('pipeline-artifact.md','# Updated\\n');` +
    `console.log('<specdojo_executor_evidence>'+JSON.stringify({final_message:'artifact updated',` +
    `validations:[{command:'npm test',status:'passed',summary:'ok'}]})+'</specdojo_executor_evidence>')"`;
  const reporterOutput = JSON.stringify({
    schema_version: 1,
    mode: "edit",
    outcome: "complete",
    summary: ["成果物を更新し、検証を完了した。"],
    changed_files: [{ path: "pipeline-artifact.md", summary: "文書を更新した。" }],
    handoff: [],
    approach: "plan と executor evidence のみを根拠に結果を構成した。",
    block_reason: "",
  });
  const reporterOutputBase64 = Buffer.from(reporterOutput, "utf8").toString("base64");
  const reporterCommand =
    reporterCommandOverride ??
    `node -e "const fs=require('node:fs');fs.readFileSync(0,'utf8');` +
      `fs.writeSync(1,Buffer.from('${reporterOutputBase64}','base64'))"`;
  writeFileSync(
    join(repo, "pm-members.yaml"),
    [
      "version: 1",
      "project_id: test",
      "members:",
      "  - nickname: pipeline-executor",
      "    display_name: Pipeline Executor",
      "    email: null",
      "    roles: [DEV]",
      "    type: agent",
      "    stage_role: executor",
      "    capabilities: [exec]",
      "    proficiency: expert",
      `    command: ${JSON.stringify(executorCommand)}`,
      "    mode: edit",
      "  - nickname: pipeline-reporter",
      "    display_name: Pipeline Reporter",
      "    email: null",
      "    roles: []",
      "    type: agent",
      "    stage_role: reporter",
      "    capabilities: []",
      "    proficiency: normal",
      `    command: ${JSON.stringify(reporterCommand)}`,
      "    mode: edit",
      "",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(
    join(repo, "schedule", "sch-strategy-test.yaml"),
    [
      "kind: strategy",
      "track: test",
      "phase_sets:",
      "  first:",
      "    - id: draft",
      "      name: Draft",
      "      task_suffix: '010'",
      "      mode: edit",
      "      agent_pipeline:",
      "        stages:",
      "          - stage_role: executor",
      "            capabilities: [exec]",
      "            proficiency: expert",
      "          - stage_role: reporter",
      "            proficiency: normal",
      "owner_rules:",
      "  - local_ids: [doc]",
      "    owner: DEV",
      "    phase_set: first",
      "",
    ].join("\n"),
    "utf8",
  );
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

function setupRepository(): { repo: string; executionPath: string } {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-run-inplace-"));
  mkdirSync(join(repo, ".specdojo"), { recursive: true });
  mkdirSync(join(repo, "schedule"), { recursive: true });
  mkdirSync(join(repo, "catalog"), { recursive: true });
  mkdirSync(join(repo, "jobs"), { recursive: true });
  mkdirSync(join(repo, "execution", "exec", "events"), { recursive: true });
  mkdirSync(join(repo, "docs", "ja", "specdojo", "exec-templates"), { recursive: true });

  writeFileSync(
    join(repo, ".specdojo", "specdojo.config.json"),
    JSON.stringify(
      {
        version: 1,
        current_project: "test",
        projects: {
          test: {
            schedule_path: "schedule",
            execution_path: "execution",
            catalog_path: "catalog",
            jobs_path: "jobs",
            members_path: "pm-members.yaml",
          },
        },
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );
  writeFileSync(
    join(repo, "pm-members.yaml"),
    [
      "version: 1",
      "project_id: test",
      "members:",
      `  - nickname: ${FAKE_AGENT_NICKNAME}`,
      "    display_name: Test Edit Agent",
      "    email: null",
      "    roles: [DEV]",
      "    type: agent",
      "    capabilities: []",
      "    priority: 1",
      `    command: ${JSON.stringify(FAKE_AGENT_CMD)}`,
      "    mode: edit",
      "",
    ].join("\n"),
    "utf8",
  );
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
      "  - local_id: doc",
      '    phase_suffix: "010"',
      "    name: Test document",
      "    duration_days: 1",
      "    depends_on: []",
      "    owner: DEV",
      "",
    ].join("\n"),
    "utf8",
  );
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
      "      - local_id: doc",
      "        name: Test document",
      "        kind: work",
      "        overview: Overview text",
      "        path: doc.md",
      "        done_criteria:",
      "          - text: Content is complete",
      "            roles: [DEV]",
      "            viewpoint: vp-dev-quality",
      "",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(
    join(repo, "docs", "ja", "specdojo", "exec-templates", "xep-template.md"),
    "_FRONTMATTER_\n\n# Edit Plan: _TASK_ID_\n\n_DONE_CRITERIA_GOALS_\n",
    "utf8",
  );
  writeFileSync(
    join(repo, "docs", "ja", "specdojo", "exec-templates", "xer-template.md"),
    "_FRONTMATTER_\n\n## 1. 実施内容\n",
    "utf8",
  );
  writeFileSync(
    join(repo, "docs", "ja", "specdojo", "exec-templates", "xrp-viewpoint-detail-template.md"),
    "### _VP_ID_\n\n_VP_CHECK_\n",
    "utf8",
  );
  writeFileSync(
    join(repo, "docs", "ja", "specdojo", "exec-templates", "xep-common-conventions-template.md"),
    "## 記法・リンク規約（共通）\n\n- リンクは `[[id|title]]` 形式。\n",
    "utf8",
  );
  writeFileSync(
    join(repo, "docs", "ja", "specdojo", "exec-templates", "xep-job-template.md"),
    [
      "_FRONTMATTER_",
      "",
      "# Job Plan: _JOB_NAME_",
      "",
      "_JOB_DESCRIPTION_",
      "",
      "_JOB_INPUTS_",
      "",
      "_JOB_TARGETS_",
      "",
      "_JOB_PATHS_",
      "",
      "_JOB_EXECUTION_",
      "",
      "_COMMON_CONVENTIONS_",
      "",
    ].join("\n"),
    "utf8",
  );

  return { repo, executionPath: join(repo, "execution") };
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

describe("exec run (in-place, default)", () => {
  it("returns routine skip without creating Job artifacts when the precondition output is empty", async () => {
    const { repo, executionPath } = setupRepository();
    writeFileSync(
      join(repo, "jobs", "job-command-empty.yaml"),
      [
        "id: job-command-empty",
        "name: Empty command selection",
        "task:",
        "  mode: command",
        "  precondition:",
        "    command: \"printf '  \\\\n'\"",
        "    skip_when: empty-output",
        "  command: touch command-ran.txt",
        "run:",
        '  idempotency_key: "{{job_id}}"',
        "",
      ].join("\n"),
      "utf8",
    );
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExec([
        "run",
        "--project",
        "test",
        "--job",
        "job-command-empty",
        "--job-trigger",
        "routine",
      ]);

      expect(process.exitCode).toBe(75);
      expect(existsSync(join(repo, "command-ran.txt"))).toBe(false);
      expect(existsSync(join(executionPath, "jobs", "runs"))).toBe(false);
      expect(existsSync(join(executionPath, "exec", "plans"))).toBe(false);
      expect(existsSync(join(executionPath, "exec", "results"))).toBe(false);
      expect(existsSync(join(executionPath, "exec", "evidence", "JBR-command-empty"))).toBe(false);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("executes a command Job in the runner and records separate stream evidence", async () => {
    const { repo, executionPath } = setupRepository();
    writeFileSync(
      join(repo, "jobs", "job-command.yaml"),
      [
        "id: job-command",
        "name: Command",
        "task:",
        "  mode: command",
        "  command: |",
        "    printf 'command stdout\\n'",
        "    printf 'api_key=super-secret-value\\n'",
        "    printf 'command stderr\\n' >&2",
        "    printf 'done\\n' > command-artifact.txt",
        "  paths: [command-artifact.txt]",
        "run:",
        '  idempotency_key: "{{job_id}}"',
        "",
      ].join("\n"),
      "utf8",
    );
    vi.spyOn(execWorktree, "gitOutput").mockImplementation((_repoRoot, args) =>
      args[0] === "status" ? "?? command-artifact.txt\0" : " command-artifact.txt | 1 +\n",
    );
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExec(["run", "--project", "test", "--job", "job-command"]);

      expect(readFileSync(join(repo, "command-artifact.txt"), "utf8")).toBe("done\n");
      const runs = readdirSync(join(executionPath, "jobs", "runs"));
      const run = JSON.parse(
        readFileSync(join(executionPath, "jobs", "runs", runs[0]), "utf8"),
      ) as {
        state: string;
        task: { mode: string; command: string };
        attempts: Array<{ exit_code: number; evidence_ref: string }>;
      };
      expect(run.state).toBe("succeeded");
      expect(run.task).toMatchObject({ mode: "command" });
      expect(run.attempts[0].exit_code).toBe(0);
      const evidence = JSON.parse(
        readFileSync(join(repo, run.attempts[0].evidence_ref), "utf8"),
      ) as {
        command: {
          value: string;
          exit_code: number;
          stdout_ref: string;
          stderr_ref: string;
          stdout: string;
          stderr: string;
        };
        log_refs: Array<{ kind: string }>;
      };
      expect(evidence.command.value).toContain("command-artifact.txt");
      expect(evidence.command.exit_code).toBe(0);
      expect(evidence.command.stdout).toContain("command stdout");
      expect(evidence.command.stdout).toContain("api_key=[REDACTED]");
      expect(evidence.command.stdout).not.toContain("super-secret-value");
      expect(evidence.command.stderr).toContain("command stderr");
      expect(readFileSync(join(repo, evidence.command.stdout_ref), "utf8")).toContain(
        "command stdout",
      );
      expect(readFileSync(join(repo, evidence.command.stderr_ref), "utf8")).toContain(
        "command stderr",
      );
      expect(evidence.log_refs.map((ref) => ref.kind)).toEqual([
        "command-stdout",
        "command-stderr",
      ]);
      expect(process.exitCode).toBeUndefined();
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("fails directly on a non-zero command without starting the analysis reporter", async () => {
    const { repo, executionPath } = setupRepository();
    const reporterOutput = JSON.stringify({
      schema_version: 1,
      mode: "edit",
      outcome: "complete",
      summary: ["reporter should not run"],
      changed_files: [],
      handoff: [],
      approach: "unexpected reporter invocation",
      block_reason: "",
    });
    const reporterOutputBase64 = Buffer.from(reporterOutput, "utf8").toString("base64");
    configurePipeline(
      repo,
      `node -e "const fs=require('node:fs');fs.writeFileSync('reporter-ran.txt','yes');` +
        `fs.writeSync(1,Buffer.from('${reporterOutputBase64}','base64'))"`,
    );
    writeFileSync(
      join(repo, "jobs", "job-command-failure.yaml"),
      [
        "id: job-command-failure",
        "name: Command failure",
        "task:",
        "  mode: command",
        "  command: |",
        "    printf 'before failure\\n'",
        "    printf 'failure detail\\n' >&2",
        "    exit 7",
        "  analysis:",
        "    agent: pipeline-reporter",
        "    description: command evidence から実行結果を報告する。",
        "run:",
        '  idempotency_key: "{{job_id}}"',
        "",
      ].join("\n"),
      "utf8",
    );
    vi.spyOn(execWorktree, "gitOutput").mockReturnValue("");
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExec(["run", "--project", "test", "--job", "job-command-failure"]);

      expect(existsSync(join(repo, "reporter-ran.txt"))).toBe(false);
      const runFile = readdirSync(join(executionPath, "jobs", "runs"))[0];
      const run = JSON.parse(
        readFileSync(join(executionPath, "jobs", "runs", runFile), "utf8"),
      ) as {
        run_id: string;
        state: string;
        attempts: Array<{ exit_code: number; evidence_ref: string }>;
      };
      expect(run.state).toBe("failed");
      expect(run.attempts[0].exit_code).toBe(7);
      const evidence = JSON.parse(
        readFileSync(join(repo, run.attempts[0].evidence_ref), "utf8"),
      ) as { command: { stdout_ref: string; stderr_ref: string } };
      expect(readFileSync(join(repo, evidence.command.stdout_ref), "utf8")).toContain(
        "before failure",
      );
      expect(readFileSync(join(repo, evidence.command.stderr_ref), "utf8")).toContain(
        "failure detail",
      );
      const result = readFileSync(
        join(executionPath, "exec", "results", `${run.run_id}-result.md`),
        "utf8",
      );
      expect(result).toContain("status: blocked");
      expect(result).toContain("command exited with code 7");
      expect(process.exitCode).toBe(7);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("runs only analysis reporter after a successful command that starts a nested process", async () => {
    const { repo, executionPath } = setupRepository();
    const reporterOutput = JSON.stringify({
      schema_version: 1,
      mode: "edit",
      outcome: "complete",
      summary: ["成果物を更新し、検証を完了した。"],
      changed_files: [],
      handoff: [],
      approach: "command evidence の stdout と stderr を確認した。",
      block_reason: "",
    });
    const reporterOutputBase64 = Buffer.from(reporterOutput, "utf8").toString("base64");
    configurePipeline(
      repo,
      `node -e "const fs=require('node:fs');const prompt=fs.readFileSync(0,'utf8');` +
        `fs.writeFileSync('reporter-prompt.txt',prompt);` +
        `fs.writeSync(1,Buffer.from('${reporterOutputBase64}','base64'))"`,
    );
    writeFileSync(
      join(repo, "jobs", "job-command-analysis.yaml"),
      [
        "id: job-command-analysis",
        "name: Command analysis",
        "task:",
        "  mode: command",
        "  command: |",
        "    node -e \"require('node:fs').writeFileSync('nested-agent.txt', 'nested process ran\\\\n')\"",
        "    printf 'analysis input\\n'",
        "    printf 'analysis warning\\n' >&2",
        "  analysis:",
        "    agent: pipeline-reporter",
        "    description: command evidence から実行結果を報告する。",
        "  paths: [nested-agent.txt]",
        "run:",
        '  idempotency_key: "{{job_id}}"',
        "",
      ].join("\n"),
      "utf8",
    );
    vi.spyOn(execWorktree, "gitOutput").mockImplementation((_repoRoot, args) =>
      args[0] === "status" ? "?? nested-agent.txt\0" : " nested-agent.txt | 1 +\n",
    );
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExec(["run", "--project", "test", "--job", "job-command-analysis"]);

      expect(readFileSync(join(repo, "nested-agent.txt"), "utf8")).toBe("nested process ran\n");
      expect(existsSync(join(repo, "pipeline-artifact.md"))).toBe(false);
      const reporterPrompt = readFileSync(join(repo, "reporter-prompt.txt"), "utf8");
      expect(reporterPrompt).toContain('"stdout_ref"');
      expect(reporterPrompt).toContain('"stderr_ref"');
      expect(reporterPrompt).toContain('"stdout": "analysis input\\n"');
      expect(reporterPrompt).toContain('"stderr": "analysis warning\\n"');
      const runFile = readdirSync(join(executionPath, "jobs", "runs"))[0];
      const run = JSON.parse(
        readFileSync(join(executionPath, "jobs", "runs", runFile), "utf8"),
      ) as { run_id: string; state: string };
      expect(run.state).toBe("succeeded");
      const result = readFileSync(
        join(executionPath, "exec", "results", `${run.run_id}-result.md`),
        "utf8",
      );
      expect(result).toContain("status: complete");
      expect(result).toContain("成果物を更新し、検証を完了した。");
      const state = JSON.parse(
        readFileSync(
          join(executionPath, "exec", "evidence", run.run_id, "attempt-1", "pipeline-state.json"),
          "utf8",
        ),
      ) as { stages: { executor: { actor: string }; reporter: { status: string } } };
      expect(state.stages.executor.actor).toBe("specdojo-runner");
      expect(state.stages.reporter.status).toBe("succeeded");
      expect(process.exitCode).toBeUndefined();
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("runs executor and reporter stages and renders the result from validated JSON", async () => {
    const { repo, executionPath } = setupRepository();
    configurePipeline(repo);
    vi.spyOn(execWorktree, "gitOutput").mockImplementation((_repoRoot, args) =>
      args[0] === "status" ? "?? pipeline-artifact.md\0" : " pipeline-artifact.md | 1 +\n",
    );
    const output: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk: string | Uint8Array) => {
      output.push(String(chunk));
      return true;
    });
    try {
      process.chdir(repo);
      await runExec([
        "run",
        "--project",
        "test",
        "--task",
        "T-TEST-doc-010",
        "--executor-by",
        "pipeline-executor",
        "--reporter-by",
        "pipeline-reporter",
      ]);

      expect(readFileSync(join(repo, "pipeline-artifact.md"), "utf8")).toContain("# Updated");
      const result = readFileSync(
        join(executionPath, "exec", "results", "T-TEST-doc-010-result.md"),
        "utf8",
      );
      expect(result, output.join("")).toContain("status: complete");
      expect(result).toContain("成果物を更新し、検証を完了した。");
      expect(result).toContain("`pipeline-artifact.md`: 文書を更新した。");
      expect(result).not.toContain("_TODO_");
      const evidenceDirs = readdirSync(join(executionPath, "exec", "evidence", "T-TEST-doc-010"));
      expect(evidenceDirs).toHaveLength(1);
      expect(
        existsSync(
          join(
            executionPath,
            "exec",
            "evidence",
            "T-TEST-doc-010",
            evidenceDirs[0],
            "evidence.json",
          ),
        ),
      ).toBe(true);
      const pipelineState = JSON.parse(
        readFileSync(
          join(
            executionPath,
            "exec",
            "evidence",
            "T-TEST-doc-010",
            evidenceDirs[0],
            "pipeline-state.json",
          ),
          "utf8",
        ),
      ) as {
        stages: {
          executor: { status: string; attempts: number; artifact_ref: string };
          reporter: { status: string; attempts: number; artifact_ref: string };
        };
      };
      expect(pipelineState.stages.executor).toMatchObject({
        status: "succeeded",
        attempts: 1,
      });
      expect(pipelineState.stages.executor.artifact_ref).toContain("/evidence.json");
      expect(pipelineState.stages.reporter).toMatchObject({
        status: "succeeded",
        attempts: 1,
      });
      expect(pipelineState.stages.reporter.artifact_ref).toContain("/T-TEST-doc-010-result.md");
      expect(process.exitCode).toBeUndefined();
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("persists succeeded executor state when the reporter fails", async () => {
    const { repo, executionPath } = setupRepository();
    configurePipeline(
      repo,
      `node -e "require('node:fs').readFileSync(0,'utf8');process.stderr.write('reporter failed');process.exit(1)"`,
    );
    vi.spyOn(execWorktree, "gitOutput").mockImplementation((_repoRoot, args) =>
      args[0] === "status" ? "?? pipeline-artifact.md\0" : " pipeline-artifact.md | 1 +\n",
    );
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExec([
        "run",
        "--project",
        "test",
        "--task",
        "T-TEST-doc-010",
        "--executor-by",
        "pipeline-executor",
        "--reporter-by",
        "pipeline-reporter",
      ]);

      expect(process.exitCode).toBe(1);
      const runId = readdirSync(join(executionPath, "exec", "evidence", "T-TEST-doc-010"))[0];
      const state = JSON.parse(
        readFileSync(
          join(executionPath, "exec", "evidence", "T-TEST-doc-010", runId, "pipeline-state.json"),
          "utf8",
        ),
      ) as { stages: { executor: { status: string }; reporter: { status: string } } };
      expect(state.stages.executor.status).toBe("succeeded");
      expect(state.stages.reporter.status).toBe("failed");
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("runs --task in the current repo with the generated plan and writes no events", async () => {
    const { repo, executionPath } = setupRepository();
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExec([
        "run",
        "--project",
        "test",
        "--task",
        "T-TEST-doc-010",
        "--by",
        FAKE_AGENT_NICKNAME,
      ]);

      const received = readFileSync(join(repo, "agent-ran.txt"), "utf8");
      expect(received).toContain("# Edit Plan: T-TEST-doc-010");
      expect(received).toContain("Content is complete");

      // --task is task identity, so the plan uses the fixed `<task-id>` name (shared with the
      // claim / run --track-state path), even without worktree or events.
      const planFiles = readdirSync(join(executionPath, "exec", "plans")).filter((f) =>
        f.endsWith("-plan.md"),
      );
      expect(planFiles).toHaveLength(1);
      expect(planFiles[0]).toBe("T-TEST-doc-010-plan.md");
      expect(readdirSync(join(executionPath, "exec", "events"))).toHaveLength(0);
      expect(process.exitCode).toBeUndefined();

      // The result is scaffolded so the agent fills a frontmatter-complete file (incl. mode),
      // shares the plan's stem, and its status reflects the successful exit even without events.
      const resultFiles = readdirSync(join(executionPath, "exec", "results")).filter((f) =>
        f.endsWith("-result.md"),
      );
      expect(resultFiles).toHaveLength(1);
      expect(resultFiles[0]).toBe("T-TEST-doc-010-result.md");
      // Plan and result share one stem (1:1 linkage).
      expect(resultFiles[0].replace(/-result\.md$/, "")).toBe(
        planFiles[0].replace(/-plan\.md$/, ""),
      );
      const result = readFileSync(join(executionPath, "exec", "results", resultFiles[0]), "utf8");
      expect(result).toContain("mode: edit");
      expect(result).toContain("status: complete");
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("runs --deliverable from the catalog (schedule-independent)", async () => {
    const { repo, executionPath } = setupRepository();
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExec([
        "run",
        "--project",
        "test",
        "--deliverable",
        "doc",
        "--by",
        FAKE_AGENT_NICKNAME,
      ]);

      expect(readFileSync(join(repo, "agent-ran.txt"), "utf8")).toContain("Content is complete");
      const planFiles = readdirSync(join(executionPath, "exec", "plans")).filter((f) =>
        f.endsWith("-plan.md"),
      );
      expect(planFiles).toHaveLength(1);
      expect(planFiles[0]).toMatch(/^doc-\d{8}T\d{6}Z-[0-9a-f]{4}-plan\.md$/);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("accumulates a distinct plan+result per lightweight run (audit trail)", async () => {
    const { repo, executionPath } = setupRepository();
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExec([
        "run",
        "--project",
        "test",
        "--deliverable",
        "doc",
        "--by",
        FAKE_AGENT_NICKNAME,
      ]);
      await runExec([
        "run",
        "--project",
        "test",
        "--deliverable",
        "doc",
        "--by",
        FAKE_AGENT_NICKNAME,
      ]);

      const planFiles = readdirSync(join(executionPath, "exec", "plans")).filter((f) =>
        f.endsWith("-plan.md"),
      );
      const resultFiles = readdirSync(join(executionPath, "exec", "results")).filter((f) =>
        f.endsWith("-result.md"),
      );
      // Each run leaves its own plan and result; nothing is overwritten (the trail is preserved).
      expect(planFiles).toHaveLength(2);
      expect(resultFiles).toHaveLength(2);
      expect(new Set(resultFiles).size).toBe(2);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("archives the plan to done/ with --archive-on-success", async () => {
    const { repo, executionPath } = setupRepository();
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExec([
        "run",
        "--project",
        "test",
        "--deliverable",
        "doc",
        "--by",
        FAKE_AGENT_NICKNAME,
        "--archive-on-success",
      ]);

      // The unique-named plan is moved out of plans/ into done/.
      const remaining = readdirSync(join(executionPath, "exec", "plans")).filter((f) =>
        f.endsWith("-plan.md"),
      );
      expect(remaining).toHaveLength(0);
      const doneFiles = readdirSync(join(executionPath, "exec", "plans", "done"));
      expect(doneFiles).toHaveLength(1);
      expect(doneFiles[0]).toMatch(/^doc-\d{8}T\d{6}Z-[0-9a-f]{4}-.*-plan\.md$/);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("dry-run resolves without generating a plan or running the agent", async () => {
    const { repo, executionPath } = setupRepository();
    const lines: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk: string | Uint8Array) => {
      lines.push(String(chunk));
      return true;
    });
    try {
      process.chdir(repo);
      await runExec([
        "run",
        "--project",
        "test",
        "--deliverable",
        "doc",
        "--by",
        FAKE_AGENT_NICKNAME,
        "--dry-run",
      ]);

      expect(lines.join("")).toContain("[dry-run]");
      expect(existsSync(join(repo, "agent-ran.txt"))).toBe(false);
      const plansDir = join(executionPath, "exec", "plans");
      const planFiles = existsSync(plansDir)
        ? readdirSync(plansDir).filter((f) => f.endsWith("-plan.md"))
        : [];
      expect(planFiles).toHaveLength(0);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("scaffolds a frontmatter-complete result from a bring-your-own --plan", async () => {
    const { repo, executionPath } = setupRepository();
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      // A bring-your-own plan carries its task identity in frontmatter; the run
      // must recover it and scaffold the result before launching the agent so the
      // agent fills a frontmatter-complete file instead of inventing one.
      const planPath = join(executionPath, "exec", "plans", "custom-plan.md");
      mkdirSync(join(executionPath, "exec", "plans"), { recursive: true });
      writeFileSync(
        planPath,
        [
          "---",
          "specdojo:",
          "  id: test:xep-custom",
          "  type: exec-plan",
          "  task_id: custom",
          "  mode: edit",
          "  status: ready",
          "  project_id: test",
          "  approach: fully-guided",
          "---",
          "",
          "# Edit Plan: custom",
          "",
        ].join("\n"),
        "utf8",
      );

      await runExec(["run", "--project", "test", "--plan", planPath, "--by", FAKE_AGENT_NICKNAME]);

      const result = readFileSync(
        join(executionPath, "exec", "results", "custom-result.md"),
        "utf8",
      );
      expect(result).toContain("id: test:xer-custom");
      expect(result).toContain("mode: edit");
      expect(result).toContain("approach: fully-guided");
      expect(result).toContain("status: complete");
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("marks the result blocked (exit 1) when the agent exits 0 but leaves the result unfilled", async () => {
    const { repo, executionPath } = setupRepository();
    // Use the real result template placeholders so the unfilled-result check can fire.
    // The fake agent never fills the result, mirroring an agent (e.g. claude -p) that
    // concludes "blocked" yet still exits 0.
    writeFileSync(
      join(repo, "docs", "ja", "specdojo", "exec-templates", "xer-template.md"),
      [
        "_FRONTMATTER_",
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
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExec([
        "run",
        "--project",
        "test",
        "--task",
        "T-TEST-doc-010",
        "--by",
        FAKE_AGENT_NICKNAME,
      ]);

      // The agent ran (exit 0) but produced no result content.
      expect(existsSync(join(repo, "agent-ran.txt"))).toBe(true);
      expect(process.exitCode).toBe(1);

      const resultFiles = readdirSync(join(executionPath, "exec", "results")).filter((f) =>
        f.endsWith("-result.md"),
      );
      expect(resultFiles).toHaveLength(1);
      const result = readFileSync(join(executionPath, "exec", "results", resultFiles[0]), "utf8");
      expect(result).toContain("status: blocked");
      expect(result).toContain("block_reason:");
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("rejects --worktree without --task", async () => {
    const { repo } = setupRepository();
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExec(["run", "--project", "test", "--deliverable", "doc", "--worktree"]);

      expect(process.exitCode).toBe(1);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });
});

describe("exec plan (command naming)", () => {
  it("generates a fixed `<task-id>-plan.md` for --task (no --out)", async () => {
    const { repo, executionPath } = setupRepository();
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExec(["plan", "--project", "test", "--task", "T-TEST-doc-010"]);

      // task identity → the fixed name shared with claim / run --track-state, so a later
      // claim/complete adopts this plan/result without renaming.
      const planFiles = readdirSync(join(executionPath, "exec", "plans")).filter((f) =>
        f.endsWith("-plan.md"),
      );
      expect(planFiles).toEqual(["T-TEST-doc-010-plan.md"]);
      expect(process.exitCode).toBe(0);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("generates a unique-named plan for --deliverable (no task identity)", async () => {
    const { repo, executionPath } = setupRepository();
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      process.chdir(repo);
      await runExec(["plan", "--project", "test", "--deliverable", "doc"]);

      const planFiles = readdirSync(join(executionPath, "exec", "plans")).filter((f) =>
        f.endsWith("-plan.md"),
      );
      expect(planFiles).toHaveLength(1);
      expect(planFiles[0]).toMatch(/^doc-\d{8}T\d{6}Z-[0-9a-f]{4}-plan\.md$/);
      expect(process.exitCode).toBe(0);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });
});
