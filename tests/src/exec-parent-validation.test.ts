import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  failedParentValidationReason,
  hasRecordedParentValidations,
  ParentValidationGate,
  parentValidationDisplayCommands,
  parentValidationGateFor,
  parentValidationLabels,
  parentValidationRoots,
  replaceParentValidationResults,
  resolveParentValidationAssignments,
  resolveParentValidationConcurrency,
  resolveParentValidationDefinitions,
  runParentValidations,
  type ParentValidationInvoker,
} from "../../src/exec-parent-validation.js";
import type { ExecEvidence } from "../../src/exec-evidence.js";

function evidenceWithRunnerStatus(status: "passed" | "failed" | "not_run"): ExecEvidence {
  return {
    schema_version: 1,
    task_id: "T-TEST-doc-010",
    run_id: "run-1",
    stage: {
      role: "executor",
      actor: "executor",
      status: "succeeded",
      started_at: "2026-08-10T07:00:00.000Z",
      completed_at: "2026-08-10T07:01:00.000Z",
      exit_code: 0,
      attempts: 1,
    },
    changes: [],
    diff_summary: { files_changed: 0, summary: "" },
    validations: [
      {
        source: "executor",
        command: "npm run test:unit",
        status: "passed",
        summary: "unit passed",
      },
      {
        id: "test-integration",
        source: "runner",
        command: "npm run test:integration",
        status,
        summary: "old result",
      },
    ],
    final_message: "done",
    log_refs: [],
  };
}

describe("parent validation allowlist", () => {
  it("resolves a fixed executable and argv without a shell command from config", () => {
    const definitions = resolveParentValidationDefinitions([
      "validate-schema",
      "test-unit",
      "test-integration",
    ]);

    expect(definitions).toEqual([
      expect.objectContaining({
        id: "validate-schema",
        command: expect.stringMatching(/^npm(?:\.cmd)?$/),
        args: ["run", "validate:schema"],
        displayCommand: "npm run validate:schema",
      }),
      expect.objectContaining({
        id: "test-unit",
        command: expect.stringMatching(/^npm(?:\.cmd)?$/),
        args: ["run", "test:unit"],
        displayCommand: "npm run test:unit",
      }),
      expect.objectContaining({
        id: "test-integration",
        command: expect.stringMatching(/^npm(?:\.cmd)?$/),
        args: ["run", "test:integration"],
        displayCommand: "npm run test:integration",
      }),
    ]);
  });

  it("resolves the lint IDs to fixed npm lint scripts", () => {
    const definitions = resolveParentValidationDefinitions(["lint-ts", "lint-fm", "lint-md"]);

    expect(definitions).toEqual([
      expect.objectContaining({
        id: "lint-ts",
        command: expect.stringMatching(/^npm(?:\.cmd)?$/),
        args: ["run", "lint:ts"],
        displayCommand: "npm run lint:ts",
      }),
      expect.objectContaining({
        id: "lint-fm",
        command: expect.stringMatching(/^npm(?:\.cmd)?$/),
        args: ["run", "lint:fm"],
        displayCommand: "npm run lint:fm",
      }),
      expect.objectContaining({
        id: "lint-md",
        command: expect.stringMatching(/^npm(?:\.cmd)?$/),
        args: ["run", "lint:md"],
        displayCommand: "npm run lint:md",
      }),
    ]);
  });

  it("lists the lint IDs among the allowed IDs when rejecting an unknown ID", () => {
    expect(() => resolveParentValidationDefinitions(["lint"])).toThrow(
      /allowed: validate-schema, typecheck, test-unit, test-integration, lint-ts, lint-fm, lint-md/,
    );
  });

  it("rejects unknown and duplicate IDs before any process starts", () => {
    expect(() => resolveParentValidationDefinitions(["arbitrary-command"])).toThrow(
      /Unknown parent validation id/,
    );
    expect(() =>
      resolveParentValidationDefinitions(["test-integration", "test-integration"]),
    ).toThrow(/Duplicate parent validation id/);
  });

  it("records a runner-owned passed result and redacts its bounded summary", async () => {
    const invoke = vi.fn().mockResolvedValue({
      exitCode: 0,
      stdout: "66 tests passed; api_key=super-secret-value",
      stderr: "",
    });

    const validations = await runParentValidations(["test-integration"], "/repo", invoke);

    expect(invoke).toHaveBeenCalledTimes(1);
    expect(invoke.mock.calls[0][0]).toMatchObject({
      id: "test-integration",
      args: ["run", "test:integration"],
    });
    expect(invoke.mock.calls[0][1]).toBe("/repo");
    expect(validations).toEqual([
      {
        id: "test-integration",
        source: "runner",
        command: "npm run test:integration",
        status: "passed",
        summary: "exit 0: 66 tests passed; api_key=[REDACTED]",
      },
    ]);
  });

  it("makes a failed runner validation authoritative", async () => {
    const validations = await runParentValidations(["test-integration"], "/repo", async () => ({
      exitCode: 1,
      stdout: "",
      stderr: "one test failed",
    }));

    expect(validations[0]).toMatchObject({ source: "runner", status: "failed" });
    expect(failedParentValidationReason(validations)).toBe(
      "parent validation failed: test-integration",
    );
  });

  it("accepts persisted validations only when they match the current configured IDs", () => {
    const recorded = [
      {
        id: "test-integration",
        source: "runner" as const,
        command: "npm run test:integration",
        status: "passed" as const,
        summary: "exit 0",
      },
    ];

    expect(hasRecordedParentValidations(recorded, ["test-integration"])).toBe(true);
    expect(hasRecordedParentValidations([], ["test-integration"])).toBe(false);
    expect(hasRecordedParentValidations(recorded, [])).toBe(false);
  });

  it("replaces a resolved runner failure without changing executor-owned validations", () => {
    const evidence = evidenceWithRunnerStatus("failed");
    const refreshed = replaceParentValidationResults(evidence, [
      {
        id: "test-integration",
        source: "runner",
        command: "npm run test:integration",
        status: "passed",
        summary: "exit 0: integration passed",
      },
    ]);

    expect(refreshed.validations).toEqual([
      evidence.validations[0],
      {
        id: "test-integration",
        source: "runner",
        command: "npm run test:integration",
        status: "passed",
        summary: "exit 0: integration passed",
      },
    ]);
    expect(failedParentValidationReason(refreshed.validations)).toBeUndefined();
  });

  it("keeps an unresolved runner failure authoritative after revalidation", () => {
    const refreshed = replaceParentValidationResults(evidenceWithRunnerStatus("failed"), [
      {
        id: "test-integration",
        source: "runner",
        command: "npm run test:integration",
        status: "failed",
        summary: "exit 1: integration still fails",
      },
    ]);

    expect(failedParentValidationReason(refreshed.validations)).toBe(
      "parent validation failed: test-integration",
    );
  });
});

describe("parent validation repository assignment", () => {
  const passed = async () => ({ exitCode: 0, stdout: "ok", stderr: "" });

  it("assigns plain IDs to the project and { id, repo } entries to the named repository", () => {
    const assignments = resolveParentValidationAssignments([
      "lint-md",
      { id: "test-unit", repo: "app1" },
      { id: "test-unit", repo: "app2" },
      { id: "validate-schema", repo: "project" },
    ]);

    expect(
      assignments.map(({ definition, repo, label }) => ({ id: definition.id, repo, label })),
    ).toEqual([
      { id: "lint-md", repo: "project", label: "lint-md" },
      { id: "test-unit", repo: "app1", label: "app1:test-unit" },
      { id: "test-unit", repo: "app2", label: "app2:test-unit" },
      { id: "validate-schema", repo: "project", label: "validate-schema" },
    ]);
  });

  it("keeps the fixed argv of an ID regardless of the assigned repository", () => {
    const [project, product] = resolveParentValidationDefinitions([
      "test-unit",
      { id: "test-unit", repo: "app1" },
    ]);

    expect(product).toBe(project);
    expect(product.args).toEqual(["run", "test:unit"]);
  });

  it("rejects malformed entries, unknown IDs and duplicate (id, repo) pairs", () => {
    expect(() => resolveParentValidationAssignments([{ id: "test-unit" }])).toThrow(
      /pipeline\.parent_validations\[0\] in exec-defaults\.repo must match/,
    );
    expect(() => resolveParentValidationAssignments([{ id: "test-unit", repo: "App1" }])).toThrow(
      /\.repo must match/,
    );
    expect(() =>
      resolveParentValidationAssignments([{ id: "test-unit", repo: "app1", command: "rm -rf /" }]),
    ).toThrow(/unknown key\(s\) "command"/);
    expect(() => resolveParentValidationAssignments([42])).toThrow(
      /must be a validation id or \{ id, repo \}/,
    );
    expect(() =>
      resolveParentValidationAssignments([{ id: "npm-run-arbitrary", repo: "app1" }]),
    ).toThrow(/Unknown parent validation id in exec-defaults: npm-run-arbitrary/);
    expect(() =>
      resolveParentValidationAssignments([
        { id: "test-unit", repo: "app1" },
        { id: "test-unit", repo: "app1" },
      ]),
    ).toThrow(/Duplicate parent validation id in exec-defaults: app1:test-unit/);
    expect(() =>
      resolveParentValidationAssignments(["lint-md", { id: "lint-md", repo: "project" }]),
    ).toThrow(/Duplicate parent validation id in exec-defaults: lint-md/);
  });

  it("does not treat inherited object properties as allowlisted IDs", () => {
    expect(() => resolveParentValidationAssignments(["toString"])).toThrow(
      /Unknown parent validation id in exec-defaults: toString/,
    );
  });

  it("runs each validation in the worktree of its repository with two product repositories", async () => {
    const invoke = vi.fn<ParentValidationInvoker>(passed);

    const validations = await runParentValidations(
      [
        "lint-md",
        "validate-schema",
        { id: "test-unit", repo: "app1" },
        { id: "typecheck", repo: "app2" },
        { id: "test-unit", repo: "app2" },
      ],
      parentValidationRoots("/wt/T-1/project", [
        { name: "app1", path: "/wt/T-1/app1" },
        { name: "app2", path: "/wt/T-1/app2" },
      ]),
      invoke,
    );

    expect(invoke.mock.calls.map(([definition, cwd]) => [definition.id, cwd])).toEqual([
      ["lint-md", "/wt/T-1/project"],
      ["validate-schema", "/wt/T-1/project"],
      ["test-unit", "/wt/T-1/app1"],
      ["typecheck", "/wt/T-1/app2"],
      ["test-unit", "/wt/T-1/app2"],
    ]);
    expect(validations.map(({ id, repo, status }) => ({ id, repo, status }))).toEqual([
      { id: "lint-md", repo: "project", status: "passed" },
      { id: "validate-schema", repo: "project", status: "passed" },
      { id: "test-unit", repo: "app1", status: "passed" },
      { id: "typecheck", repo: "app2", status: "passed" },
      { id: "test-unit", repo: "app2", status: "passed" },
    ]);
  });

  it("names the repository when a product validation fails", async () => {
    const validations = await runParentValidations(
      ["lint-md", { id: "test-unit", repo: "app1" }, { id: "test-unit", repo: "app2" }],
      parentValidationRoots("/wt/T-1/project", [
        { name: "app1", path: "/wt/T-1/app1" },
        { name: "app2", path: "/wt/T-1/app2" },
      ]),
      async (_definition, cwd) =>
        cwd === "/wt/T-1/app2"
          ? { exitCode: 1, stdout: "", stderr: "1 test failed" }
          : { exitCode: 0, stdout: "", stderr: "" },
    );

    expect(failedParentValidationReason(validations)).toBe(
      "parent validation failed: app2:test-unit",
    );
  });

  it("fails a validation assigned to a repository without a worktree and does not spawn it", async () => {
    const invoke = vi.fn<ParentValidationInvoker>(passed);

    const validations = await runParentValidations(
      ["lint-md", { id: "test-unit", repo: "app9" }],
      parentValidationRoots("/wt/T-1/project", [{ name: "app1", path: "/wt/T-1/app1" }]),
      invoke,
    );

    expect(invoke).toHaveBeenCalledTimes(1);
    expect(validations[1]).toMatchObject({
      id: "test-unit",
      source: "runner",
      repo: "app9",
      command: "npm run test:unit",
      status: "failed",
      summary: expect.stringMatching(/repository "app9" has no worktree for this task/),
    });
  });

  it("keeps the single-repository evidence shape for plain IDs without product worktrees", async () => {
    const invoke = vi.fn<ParentValidationInvoker>(passed);

    const validations = await runParentValidations(
      ["lint-md", "test-unit"],
      parentValidationRoots("/repo"),
      invoke,
    );

    expect(invoke.mock.calls.map(([, cwd]) => cwd)).toEqual(["/repo", "/repo"]);
    expect(validations.every((validation) => !("repo" in validation))).toBe(true);
  });

  it("re-runs persisted validations when the repository assignment changed", () => {
    const recorded = [
      {
        id: "test-unit",
        source: "runner" as const,
        repo: "app1",
        command: "npm run test:unit",
        status: "passed" as const,
        summary: "exit 0",
      },
    ];

    expect(hasRecordedParentValidations(recorded, [{ id: "test-unit", repo: "app1" }])).toBe(true);
    expect(hasRecordedParentValidations(recorded, [{ id: "test-unit", repo: "app2" }])).toBe(false);
    expect(hasRecordedParentValidations(recorded, ["test-unit"])).toBe(false);
  });

  it("lists labels and display commands with the repository for product assignments", () => {
    const entries = ["lint-md", { id: "test-unit", repo: "app1" }];

    expect(parentValidationLabels(entries)).toEqual(["lint-md", "app1:test-unit"]);
    expect(parentValidationDisplayCommands(entries)).toEqual([
      "npm run lint:md",
      "npm run test:unit (in app1)",
    ]);
  });
});

describe("parent validation concurrency", () => {
  it("defaults to one concurrent parent validation", () => {
    expect(resolveParentValidationConcurrency(undefined)).toBe(1);
    expect(resolveParentValidationConcurrency(3)).toBe(3);
  });

  it.each([0, -1, 1.5, "2"])("rejects a non-positive-integer concurrency %s", (value) => {
    expect(() => resolveParentValidationConcurrency(value)).toThrow(
      /parent_validation_concurrency .* positive integer/,
    );
  });

  it("serializes overlapping batches and logs which item waits for which validations", async () => {
    const lines: string[] = [];
    const gate = new ParentValidationGate(1, (line) => lines.push(line));
    const events: string[] = [];
    let releaseFirst!: () => void;
    const firstBlocked = new Promise<void>((resolve) => {
      releaseFirst = resolve;
    });

    const first = gate.run("PJR-AAAA", ["test-integration"], async () => {
      events.push("start:PJR-AAAA");
      await firstBlocked;
      events.push("end:PJR-AAAA");
    });
    const second = gate.run("PJR-BBBB", ["test-integration", "test-unit"], async () => {
      events.push("start:PJR-BBBB");
      events.push("end:PJR-BBBB");
    });
    await Promise.resolve();
    releaseFirst();
    await Promise.all([first, second]);

    expect(events).toEqual(["start:PJR-AAAA", "end:PJR-AAAA", "start:PJR-BBBB", "end:PJR-BBBB"]);
    expect(lines).toEqual([
      "  Waiting for parent validation slot: PJR-BBBB (test-integration, test-unit); running: PJR-AAAA\n",
      "  Parent validation slot acquired: PJR-BBBB\n",
    ]);
  });

  it("releases the slot when a batch throws", async () => {
    const gate = new ParentValidationGate(1, () => undefined);

    await expect(
      gate.run("PJR-AAAA", ["test-unit"], async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");

    await expect(gate.run("PJR-BBBB", ["test-unit"], async () => "ran")).resolves.toBe("ran");
  });

  it("serializes batches of separate gates (separate exec runs) sharing one lock root", async () => {
    const lockRoot = await mkdtemp(path.join(tmpdir(), "specdojo-parent-validation-gate-"));
    try {
      const lines: string[] = [];
      const primaryRun = new ParentValidationGate(1, () => undefined, lockRoot);
      const joinedRun = new ParentValidationGate(1, (line) => lines.push(line), lockRoot);
      let active = 0;
      let maxActive = 0;
      const batch = async (): Promise<void> => {
        active++;
        maxActive = Math.max(maxActive, active);
        await new Promise((resolve) => setTimeout(resolve, 30));
        active--;
      };

      await Promise.all([
        primaryRun.run("PJR-AAAA", ["test-unit"], batch),
        joinedRun.run("PJR-BBBB", ["test-unit", "typecheck"], batch),
      ]);

      expect(maxActive).toBe(1);
      expect(lines).toEqual([
        "  Waiting for parent validation slot held by another exec run: PJR-BBBB (test-unit, typecheck)\n",
      ]);
    } finally {
      await rm(lockRoot, { recursive: true, force: true });
    }
  });

  it("shares one gate per exec-defaults object", () => {
    const execDefaults = { pipeline: { parent_validation_concurrency: 2 } };

    const gate = parentValidationGateFor(execDefaults);

    expect(parentValidationGateFor(execDefaults)).toBe(gate);
    expect(gate.limit).toBe(2);
    expect(parentValidationGateFor({})).not.toBe(gate);
  });
});
