import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  completeJobRun,
  jobCheckpoint,
  materializeJobRun,
  parseJobDefinition,
  parseJobInputs,
  resolveJobPaths,
} from "../../src/job.js";

const originalCwd = process.cwd();

function setupRepo(): string {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-job-"));
  for (const path of [".specdojo", "jobs", "schedule", "execution", "docs/ja/specdojo/templates"])
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
    join(repo, "docs/ja/specdojo/templates/xep-job-template.md"),
    "_FRONTMATTER_\n\n# _JOB_NAME_\n\n_JOB_DESCRIPTION_\n\n_JOB_INPUTS_\n\n_JOB_TARGETS_\n\n_JOB_PATHS_\n",
  );
  writeFileSync(
    join(repo, "docs/ja/specdojo/templates/xep-common-conventions-template.md"),
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

  it("parses key=value inputs and rejects duplicates", () => {
    expect(parseJobInputs(["period=2026-W32", "lang=en"])).toEqual({
      period: "2026-W32",
      lang: "en",
    });
    expect(() => parseJobInputs(["period=a", "period=b"])).toThrow(/Duplicate input/);
  });
});

describe("Job Run lifecycle", () => {
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
