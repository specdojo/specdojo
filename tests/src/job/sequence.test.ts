import { describe, expect, it } from "vitest";
import { parseJobDefinition } from "../../../src/job/job.js";

function parse(task: Record<string, unknown>) {
  return parseJobDefinition(
    {
      id: "job-sequence",
      name: "Sequence",
      task: { mode: "command", ...task },
      run: { idempotency_key: "{{job_id}}" },
    },
    "job-sequence.yaml",
  );
}

describe("sequence Job definition", () => {
  it("accepts steps instead of a single command", () => {
    expect(
      parse({
        steps: [{ id: "build", command: "npm run docs:build", on_failure: "continue" }],
        lock_wait_seconds: 0,
      }).errors,
    ).toEqual([]);
  });

  it.each([
    { steps: [] },
    { command: "true", steps: [{ id: "one", command: "true" }] },
    {
      steps: [
        { id: "one", command: "true" },
        { id: "one", command: "true" },
      ],
    },
    { steps: [{ id: "one", command: "" }] },
    { steps: [{ id: "one", command: "true", on_failure: "ignore" }] },
    { steps: [{ id: "one", command: "true", on_failuer: "continue" }] },
    { steps: [{ id: "one", command: "true" }], lock_wait_seconds: -1 },
    { steps: [{ id: "one", command: "true" }], lock_wait_seconds: 0.5 },
    { steps: [{ id: "one", command: "true", timeout_seconds: 0 }] },
    { command: "true", lock_wait_seconds: 1 },
    { steps: [{ id: "one", command: "true" }], partial_exit_code: 1 },
    {
      steps: [
        {
          id: "one",
          command: "true",
          completion: { path: "state.json", field: "state", succeeded: [] },
        },
      ],
    },
    {
      steps: [
        {
          id: "one",
          command: "true",
          completion: {
            path: "state.json",
            field: "state",
            succeeded: ["done"],
            deferred: ["done"],
          },
        },
      ],
    },
  ])("rejects invalid or ambiguous steps: %j", (task) => {
    expect(parse(task).errors.length).toBeGreaterThan(0);
  });

  it("rejects steps on an agent task", () => {
    expect(
      parse({
        mode: "edit",
        description: "write",
        paths: ["docs"],
        steps: [{ id: "one", command: "true" }],
      }).errors.length,
    ).toBeGreaterThan(0);
  });
});
