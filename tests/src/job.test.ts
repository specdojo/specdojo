import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  completeJobRun,
  deriveJobState,
  executeJobCommand,
  executeJobPrecondition,
  isJobAgentTask,
  isJobCommandTask,
  jobCheckpoint,
  materializeJobRun,
  parseJobDefinition,
  parseJobInputs,
  renderJobTemplate,
  resolveJobPaths,
} from "../../src/job.js";

const originalCwd = process.cwd();

function setupRepo(): string {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-job-"));
  for (const path of [
    ".specdojo",
    "jobs",
    "schedule",
    "execution",
    "docs/ja/specdojo/exec-templates",
  ])
    mkdirSync(join(repo, path), { recursive: true });
  writeFileSync(
    join(repo, ".specdojo/specdojo.config.json"),
    JSON.stringify({
      version: 1,
      current_project: "test",
      projects: {
        test: { schedule_path: "schedule", execution_path: "execution", jobs_path: "jobs" },
      },
    }),
  );
  writeFileSync(
    join(repo, "docs/ja/specdojo/exec-templates/xep-job-template.md"),
    "_FRONTMATTER_\n\n# _JOB_NAME_\n\n_JOB_DESCRIPTION_\n\n_JOB_INPUTS_\n\n_JOB_TARGETS_\n\n_JOB_PATHS_\n",
  );
  writeFileSync(
    join(repo, "docs/ja/specdojo/exec-templates/xep-common-conventions-template.md"),
    "## Common\n",
  );
  writeFileSync(
    join(repo, "jobs/job-translate.yaml"),
    [
      "id: job-translate",
      "name: Translate",
      "inputs:",
      "  from_revision:",
      "    type: string",
      "    from_checkpoint: revision",
      "    default: initial",
      "  to_revision:",
      "    type: string",
      "    required: true",
      "task:",
      "  mode: edit",
      "  description: translate {{inputs.from_revision}}..{{inputs.to_revision}}",
      "  agent:",
      "    executor: gemma-executor",
      "    reporter: gemma-reporter",
      "  paths: [docs/ja, docs/en]",
      "run:",
      '  idempotency_key: "{{job_id}}:{{inputs.from_revision}}:{{inputs.to_revision}}"',
      "checkpoint:",
      "  values:",
      '    revision: "{{inputs.to_revision}}"',
      "",
    ].join("\n"),
  );
  process.chdir(repo);
  return repo;
}

afterEach(() => {
  process.chdir(originalCwd);
  delete process.env.SPECDOJO_PROJECT;
});

describe("Job Definition", () => {
  it("validates id, task, inputs and idempotency key", () => {
    const parsed = parseJobDefinition(
      {
        id: "job-report",
        name: "Report",
        inputs: { period: { type: "string", required: true } },
        task: { mode: "edit", description: "write", targets: ["report"] },
        run: { idempotency_key: "{{job_id}}:{{inputs.period}}" },
      },
      "job-report.yaml",
    );
    expect(parsed.errors).toEqual([]);
    expect(parsed.job?.id).toBe("job-report");
  });

  it("keeps the delegated executor and reporter nicknames on the task", () => {
    const parsed = parseJobDefinition(
      {
        id: "job-report",
        name: "Report",
        task: {
          mode: "edit",
          description: "write",
          targets: ["report"],
          agent: { executor: "claude-expert-executor", reporter: "claude-reporter" },
        },
        run: { idempotency_key: "{{job_id}}" },
      },
      "job-report.yaml",
    );
    expect(parsed.errors).toEqual([]);
    expect(parsed.job).toBeDefined();
    if (!parsed.job || !isJobAgentTask(parsed.job.task)) throw new Error("expected agent task");
    expect(parsed.job.task.agent).toEqual({
      executor: "claude-expert-executor",
      reporter: "claude-reporter",
    });
  });

  it("rejects an executor value that is not a nickname", () => {
    const parsed = parseJobDefinition(
      {
        id: "job-report",
        name: "Report",
        task: {
          mode: "edit",
          description: "write",
          targets: ["report"],
          agent: { executor: "Expert Executor" },
        },
        run: { idempotency_key: "{{job_id}}" },
      },
      "job-report.yaml",
    );
    expect(parsed.job).toBeUndefined();
    expect(parsed.errors).toContain(
      "job-report.yaml: task.agent.executor must be an agent nickname from pm-members.yaml",
    );
  });

  it("rejects an unknown key under agent so a typo cannot drop the reporter stage", () => {
    const parsed = parseJobDefinition(
      {
        id: "job-report",
        name: "Report",
        task: {
          mode: "edit",
          description: "write",
          targets: ["report"],
          agent: { executor: "claude-expert-executor", reporters: "claude-reporter" },
        },
        run: { idempotency_key: "{{job_id}}" },
      },
      "job-report.yaml",
    );
    expect(parsed.job).toBeUndefined();
    expect(parsed.errors).toContain("job-report.yaml: task.agent has unknown key(s): reporters");
  });

  it("parses command mode separately from optional agent analysis", () => {
    const parsed = parseJobDefinition(
      {
        id: "job-grade",
        name: "Grade",
        inputs: { period: { type: "string", required: true } },
        task: {
          mode: "command",
          command: "tools/grade/run.sh --period {{inputs.period}}",
          analysis: {
            agent: "gemma-reporter",
            description: "evidence から失敗原因を判断する",
          },
        },
        run: { idempotency_key: "{{job_id}}:{{inputs.period}}" },
      },
      "job-grade.yaml",
    );

    expect(parsed.errors).toEqual([]);
    expect(parsed.job && isJobCommandTask(parsed.job.task)).toBe(true);
    expect(parsed.job?.task).toMatchObject({
      mode: "command",
      command: "tools/grade/run.sh --period {{inputs.period}}",
      analysis: { agent: "gemma-reporter" },
    });
  });

  it("parses an empty-output precondition on a command Job", () => {
    const parsed = parseJobDefinition(
      {
        id: "job-grade",
        name: "Grade",
        task: {
          mode: "command",
          precondition: { command: "list targets", skip_when: "empty-output" },
          command: "grade targets",
        },
        run: { idempotency_key: "{{job_id}}" },
      },
      "job-grade.yaml",
    );

    expect(parsed.errors).toEqual([]);
    expect(parsed.job?.task).toMatchObject({
      precondition: { command: "list targets", skip_when: "empty-output" },
    });
  });

  it("rejects an unsupported precondition skip condition", () => {
    const parsed = parseJobDefinition(
      {
        id: "job-grade",
        name: "Grade",
        task: {
          mode: "command",
          precondition: { command: "list targets", skip_when: "contains:no targets" },
          command: "grade targets",
        },
        run: { idempotency_key: "{{job_id}}" },
      },
      "job-grade.yaml",
    );

    expect(parsed.job).toBeUndefined();
    expect(parsed.errors).toContain(
      "job-grade.yaml: task.precondition.skip_when must be empty-output or an exit code from 0 to 255",
    );
  });

  it("rejects agent-driven fields in command mode", () => {
    const parsed = parseJobDefinition(
      {
        id: "job-grade",
        name: "Grade",
        task: {
          mode: "command",
          command: "tools/grade/run.sh",
          description: "agent がコマンドを実行する",
          agent: { executor: "gemma-executor" },
        },
        run: { idempotency_key: "{{job_id}}" },
      },
      "job-grade.yaml",
    );

    expect(parsed.job).toBeUndefined();
    expect(parsed.errors).toContain(
      "job-grade.yaml: task.agent is not allowed in command mode; use task.analysis.agent",
    );
  });

  it("rejects a precondition outside command mode", () => {
    const parsed = parseJobDefinition(
      {
        id: "job-edit",
        name: "Edit",
        task: {
          mode: "edit",
          description: "Edit a document",
          paths: ["docs/example.md"],
          precondition: { command: "list targets", skip_when: "empty-output" },
        },
        run: { idempotency_key: "{{job_id}}" },
      },
      "job-edit.yaml",
    );

    expect(parsed.job).toBeUndefined();
    expect(parsed.errors).toContain(
      "job-edit.yaml: task.command, task.precondition, and task.analysis are only allowed in command mode",
    );
  });

  it("parses key=value inputs and rejects duplicates", () => {
    expect(parseJobInputs(["period=2026-W32", "lang=en"])).toEqual({
      period: "2026-W32",
      lang: "en",
    });
    expect(() => parseJobInputs(["period=a", "period=b"])).toThrow(/Duplicate input/);
  });

  it("enum と整数範囲を定義時に検証する", () => {
    const valid = parseJobDefinition(
      {
        id: "job-auto",
        name: "Auto",
        inputs: {
          strategy: { type: "string", default: "critical-first", enum: ["critical-first", "fifo"] },
          parallel: { type: "integer", default: 1, minimum: 1, maximum: 8 },
        },
        task: { mode: "command", command: "run {{inputs.strategy}} {{inputs.parallel}}" },
        run: { idempotency_key: "{{job_id}}:{{inputs.strategy}}:{{inputs.parallel}}" },
      },
      "job-auto.yaml",
    );
    expect(valid.errors).toEqual([]);

    const invalid = parseJobDefinition(
      {
        id: "job-auto",
        name: "Auto",
        inputs: {
          strategy: { type: "string", default: "newest", enum: ["critical-first", "fifo"] },
          parallel: { type: "integer", default: 0, minimum: 1 },
        },
        task: { mode: "command", command: "run" },
        run: { idempotency_key: "{{job_id}}" },
      },
      "job-auto.yaml",
    );
    expect(invalid.errors).toContain(
      "job-auto.yaml: inputs.strategy.default is invalid: Input strategy must be one of: critical-first, fifo",
    );
    expect(invalid.errors).toContain(
      "job-auto.yaml: inputs.parallel.default is invalid: Input parallel must be at least 1",
    );
  });

  it("project_id を command template へ展開する", () => {
    expect(
      renderJobTemplate("specdojo exec cycle --project {{project_id}}", {
        job_id: "job-cycle",
        project_id: "prj-test",
        specdojo: "specdojo",
        scheduled_at: "2026-09-09T00:00:00.000Z",
        inputs: {},
        checkpoint: {},
      }),
    ).toBe("specdojo exec cycle --project prj-test");
  });

  it("job_run_id を command template へ展開する", () => {
    expect(
      renderJobTemplate("run --run-id {{job_run_id}}", {
        job_id: "job-grade",
        job_run_id: "JBR-grade-0123456789ab",
        project_id: "prj-test",
        specdojo: "specdojo",
        scheduled_at: "2026-09-09T00:00:00.000Z",
        inputs: {},
        checkpoint: {},
      }),
    ).toBe("run --run-id JBR-grade-0123456789ab");
  });
});

describe("Job command execution", () => {
  it("uses fail-fast shell semantics and captures stdout and stderr", async () => {
    const repo = mkdtempSync(join(tmpdir(), "specdojo-job-command-"));
    try {
      const result = await executeJobCommand(
        "printf 'before\\n'; printf 'problem\\n' >&2; false; printf 'after\\n'",
        repo,
      );

      expect(result.exitCode).not.toBe(0);
      expect(result.stdout).toContain("before");
      expect(result.stdout).not.toContain("after");
      expect(result.stderr).toContain("problem");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("evaluates empty output and a configured exit code as skip conditions", async () => {
    const repo = mkdtempSync(join(tmpdir(), "specdojo-job-precondition-"));
    try {
      const empty = await executeJobPrecondition(
        { command: "printf '  \\n'", skip_when: "empty-output" },
        repo,
      );
      const exitCode = await executeJobPrecondition({ command: "exit 42", skip_when: 42 }, repo);

      expect(empty).toMatchObject({ skipped: true, reason: "empty selection" });
      expect(exitCode).toMatchObject({
        skipped: true,
        reason: "precondition exited with code 42",
      });
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });
});

describe("Job Run lifecycle", () => {
  it("skips an empty selection before creating Run or plan files", async () => {
    const repo = setupRepo();
    try {
      writeFileSync(
        join(repo, "jobs/job-empty.yaml"),
        [
          "id: job-empty",
          "name: Empty selection",
          "task:",
          "  mode: command",
          "  precondition:",
          "    command: \"printf '  \\\\n'\"",
          "    skip_when: empty-output",
          "  command: touch should-not-run",
          "run:",
          '  idempotency_key: "{{job_id}}:{{scheduled_at}}"',
          "",
        ].join("\n"),
      );

      const materialized = await materializeJobRun({
        projectId: "test",
        jobId: "job-empty",
        scheduledAt: "2026-09-12T00:00:00Z",
      });

      expect(materialized.preconditionSkipped).toBe(true);
      expect(materialized.preconditionReason).toBe("empty selection");
      expect(existsSync(materialized.runPath)).toBe(false);
      expect(existsSync(materialized.planPath)).toBe(false);
      expect(existsSync(join(repo, "should-not-run"))).toBe(false);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("creates the normal Run and plan when the precondition selects an item", async () => {
    const repo = setupRepo();
    try {
      writeFileSync(
        join(repo, "jobs/job-selected.yaml"),
        [
          "id: job-selected",
          "name: Selected item",
          "task:",
          "  mode: command",
          "  precondition:",
          "    command: printf 'docs/selected.md\\n'",
          "    skip_when: empty-output",
          "  command: printf 'run\\n'",
          "run:",
          '  idempotency_key: "{{job_id}}:{{scheduled_at}}"',
          "",
        ].join("\n"),
      );

      const materialized = await materializeJobRun({
        projectId: "test",
        jobId: "job-selected",
        scheduledAt: "2026-09-12T00:00:00Z",
      });

      expect(materialized.preconditionSkipped).toBeUndefined();
      expect(existsSync(materialized.runPath)).toBe(true);
      expect(existsSync(materialized.planPath)).toBe(true);
      expect(materialized.record.attempts).toHaveLength(1);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("scheduled_at ごとに別の再開キーを materialize し、同じ実行枠の retry では再利用する", async () => {
    const repo = setupRepo();
    try {
      writeFileSync(
        join(repo, "jobs/job-grade.yaml"),
        [
          "id: job-grade",
          "name: Grade",
          "inputs:",
          "  period:",
          "    type: string",
          "    required: true",
          "task:",
          "  mode: command",
          "  command: run --run-id {{job_run_id}} --period {{inputs.period}}",
          "run:",
          '  idempotency_key: "{{job_id}}:{{scheduled_at}}"',
          "",
        ].join("\n"),
      );

      const first = await materializeJobRun({
        projectId: "test",
        jobId: "job-grade",
        inputs: ["period=2026-W37"],
        scheduledAt: "2026-09-14T01:00:00+09:00",
      });
      const nextDay = await materializeJobRun({
        projectId: "test",
        jobId: "job-grade",
        inputs: ["period=2026-W37"],
        scheduledAt: "2026-09-15T01:00:00+09:00",
      });
      const sameDaySecondSlot = await materializeJobRun({
        projectId: "test",
        jobId: "job-grade",
        inputs: ["period=2026-W37"],
        scheduledAt: "2026-09-14T06:00:00+09:00",
      });

      expect(nextDay.record.run_id).not.toBe(first.record.run_id);
      expect(sameDaySecondSlot.record.run_id).not.toBe(first.record.run_id);
      expect(first.record.task).toMatchObject({
        command: `run --run-id ${first.record.run_id} --period 2026-W37`,
      });
      expect(nextDay.record.task).toMatchObject({
        command: `run --run-id ${nextDay.record.run_id} --period 2026-W37`,
      });

      completeJobRun({ projectId: "test", runPath: first.runPath, status: "failed" });
      const retry = await materializeJobRun({
        projectId: "test",
        jobId: "job-grade",
        inputs: ["period=2026-W37"],
        scheduledAt: "2026-09-14T01:00:00+09:00",
      });
      expect(retry.record.run_id).toBe(first.record.run_id);
      expect(retry.record.attempts).toHaveLength(2);
      expect(retry.record.task).toMatchObject({
        command: `run --run-id ${first.record.run_id} --period 2026-W37`,
      });
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("materialize 時に enum と整数範囲外の入力を拒否する", async () => {
    const repo = setupRepo();
    try {
      writeFileSync(
        join(repo, "jobs/job-constrained.yaml"),
        [
          "id: job-constrained",
          "name: Constrained",
          "inputs:",
          "  strategy:",
          "    type: string",
          "    enum: [critical-first, fifo]",
          "  parallel:",
          "    type: integer",
          "    minimum: 1",
          "task:",
          "  mode: command",
          "  command: run {{inputs.strategy}} {{inputs.parallel}}",
          "run:",
          '  idempotency_key: "{{job_id}}:{{inputs.strategy}}:{{inputs.parallel}}"',
          "",
        ].join("\n"),
      );

      await expect(
        materializeJobRun({
          projectId: "test",
          jobId: "job-constrained",
          inputs: ["strategy=newest", "parallel=0"],
          dryRun: true,
        }),
      ).rejects.toThrow(/Input strategy must be one of/);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("materializes one idempotent Run and advances checkpoint only on success", async () => {
    const repo = setupRepo();
    try {
      const first = await materializeJobRun({
        projectId: "test",
        jobId: "job-translate",
        inputs: ["to_revision=abc123"],
        scheduledAt: "2026-08-07T08:00:00Z",
      });
      expect(first.duplicateComplete).toBe(false);
      expect(first.record.inputs).toEqual({ from_revision: "initial", to_revision: "abc123" });
      // The delegation target is frozen into the Run so a later definition change cannot
      // silently move a running Job to another agent.
      if (!isJobAgentTask(first.record.task)) throw new Error("expected agent task");
      expect(first.record.task.agent).toEqual({
        executor: "gemma-executor",
        reporter: "gemma-reporter",
      });
      expect(readFileSync(first.planPath, "utf8")).toContain("translate initial..abc123");

      completeJobRun({ projectId: "test", runPath: first.runPath, status: "succeeded" });
      expect(jobCheckpoint(resolveJobPaths("test"), "job-translate")).toEqual({
        revision: "abc123",
      });

      const duplicate = await materializeJobRun({
        projectId: "test",
        jobId: "job-translate",
        inputs: ["from_revision=initial", "to_revision=abc123"],
        scheduledAt: "2026-08-07T08:05:00Z",
      });
      expect(duplicate.record.run_id).toBe(first.record.run_id);
      expect(duplicate.duplicateComplete).toBe(true);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("keeps the previous checkpoint after failure and appends a retry attempt", async () => {
    const repo = setupRepo();
    try {
      const first = await materializeJobRun({
        projectId: "test",
        jobId: "job-translate",
        inputs: ["to_revision=broken"],
      });
      completeJobRun({ projectId: "test", runPath: first.runPath, status: "failed" });
      expect(jobCheckpoint(resolveJobPaths("test"), "job-translate")).toEqual({});

      const retry = await materializeJobRun({
        projectId: "test",
        jobId: "job-translate",
        inputs: ["to_revision=broken"],
      });
      expect(retry.record.run_id).toBe(first.record.run_id);
      expect(retry.record.attempts).toHaveLength(2);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });
});

describe("Job Run file validation", () => {
  it("skips a structurally invalid Run file and keeps checkpoints from valid history", async () => {
    const repo = setupRepo();
    try {
      const paths = resolveJobPaths("test");
      const run = await materializeJobRun({
        projectId: "test",
        jobId: "job-translate",
        inputs: ["to_revision=abc123"],
      });
      completeJobRun({ projectId: "test", runPath: run.runPath, status: "succeeded" });
      writeFileSync(
        join(paths.runsPath, "JBR-translate-broken.json"),
        JSON.stringify({ version: 1, run_id: "JBR-translate-broken", state: "succeeded" }),
      );

      const state = deriveJobState(paths);

      expect(Object.keys(state.jobs)).toEqual(["job-translate"]);
      expect(state.jobs["job-translate"]?.checkpoint).toEqual({ revision: "abc123" });
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("rejects completing a Run whose file does not match the Run record shape", () => {
    const repo = setupRepo();
    try {
      const paths = resolveJobPaths("test");
      mkdirSync(paths.runsPath, { recursive: true });
      const runPath = join(paths.runsPath, "JBR-translate-invalid.json");
      writeFileSync(runPath, JSON.stringify({ version: 1, run_id: "JBR-translate-invalid" }));

      expect(() => completeJobRun({ projectId: "test", runPath, status: "succeeded" })).toThrow(
        /Invalid Job Run file: .*JBR-translate-invalid\.json/,
      );
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });
});
