import { readFileSync } from "node:fs";
import { load } from "js-yaml";
import { describe, expect, it } from "vitest";
import { buildValidator, formatErrors } from "../../../helpers/schema.js";

const validate = buildValidator("docs/specdojo/schemas/v1/job.schema.yaml");

function commandJob(review: unknown): Record<string, unknown> {
  return {
    id: "job-grade",
    name: "Grade",
    task: { mode: "command", command: "tools/grade/run.sh", review },
    run: { idempotency_key: "{{job_id}}" },
  };
}

describe("job.schema.yaml task.review", () => {
  it("accepts a review declaration with nominated executor and reporter", () => {
    const valid = validate(
      commandJob({
        agent: { executor: "claude-expert-review-executor", reporter: "claude-reporter" },
      }),
    );

    expect(valid, formatErrors(validate.errors)).toBe(true);
  });

  it("accepts an empty review mapping on an agent task", () => {
    const valid = validate({
      id: "job-report",
      name: "Report",
      task: { mode: "edit", description: "write", targets: ["report"], review: {} },
      run: { idempotency_key: "{{job_id}}" },
    });

    expect(valid, formatErrors(validate.errors)).toBe(true);
  });

  it("rejects unknown keys, a missing executor, and an invalid nickname", () => {
    expect(validate(commandJob({ enabled: true }))).toBe(false);
    expect(validate(commandJob({ agent: { reporter: "claude-reporter" } }))).toBe(false);
    expect(validate(commandJob({ agent: { executor: "Claude Expert" } }))).toBe(false);
    expect(
      validate(
        commandJob({
          agent: { executor: "claude-expert-review-executor", reporters: "claude-reporter" },
        }),
      ),
    ).toBe(false);
  });

  it.each([
    "docs/ja/projects/prj-0001/jobs/job-grade-kata.yaml",
    "docs/ja/projects/prj-0001/jobs/job-grade-deliverable.yaml",
  ])("validates the grade Job %s that nominates the review agents", (jobPath) => {
    const job = load(readFileSync(jobPath, "utf8")) as { task?: { review?: unknown } };

    expect(validate(job), formatErrors(validate.errors)).toBe(true);
    expect(job.task?.review).toEqual({
      agent: { executor: "claude-expert-review-executor", reporter: "claude-reporter" },
    });
  });
});
