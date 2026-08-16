import { describe, expect, it, vi } from "vitest";
import {
  failedParentValidationReason,
  hasRecordedParentValidations,
  resolveParentValidationDefinitions,
  runParentValidations,
} from "../../src/exec-parent-validation.js";

describe("parent validation allowlist", () => {
  it("resolves a fixed executable and argv without a shell command from config", () => {
    const [definition] = resolveParentValidationDefinitions(["test-integration"]);

    expect(definition.id).toBe("test-integration");
    expect(definition.command).toMatch(/^npm(?:\.cmd)?$/);
    expect(definition.args).toEqual(["run", "test:integration"]);
    expect(definition.displayCommand).toBe("npm run test:integration");
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
});
