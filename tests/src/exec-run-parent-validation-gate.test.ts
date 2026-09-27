import { afterEach, describe, expect, it, vi } from "vitest";
import type { ExecDefaultsConfig } from "../../src/exec-agent-config.js";
import type {
  ParentValidationDefinition,
  ParentValidationProcessResult,
} from "../../src/exec-parent-validation.js";
import {
  runCompletionDrivenWorkerPool,
  runConfiguredParentValidations,
} from "../../src/exec-run.js";

type Probe = {
  active: number;
  maxActive: number;
  events: string[];
};

function trackingInvoker(probe: Probe, label: string) {
  return async (definition: ParentValidationDefinition): Promise<ParentValidationProcessResult> => {
    probe.active++;
    probe.maxActive = Math.max(probe.maxActive, probe.active);
    probe.events.push(`start:${label}:${definition.id}`);
    // Yield several macrotasks so an overlapping validation would be observed.
    for (let tick = 0; tick < 3; tick++) await new Promise((resolve) => setTimeout(resolve, 0));
    probe.events.push(`end:${label}:${definition.id}`);
    probe.active--;
    return { exitCode: 0, stdout: "ok", stderr: "" };
  };
}

async function runItemsInParallel(
  execDefaults: ExecDefaultsConfig,
  labels: readonly string[],
): Promise<{ validationProbe: Probe; executorMaxActive: number }> {
  const validationProbe: Probe = { active: 0, maxActive: 0, events: [] };
  let executorActive = 0;
  let executorMaxActive = 0;
  const queue = [...labels];
  await runCompletionDrivenWorkerPool<string, void>({
    maxParallel: labels.length,
    fillSlots: (openSlots) => queue.splice(0, openSlots),
    runItem: async (label) => {
      // Simulated executor stage: runs outside the parent validation gate.
      executorActive++;
      executorMaxActive = Math.max(executorMaxActive, executorActive);
      await new Promise((resolve) => setTimeout(resolve, 0));
      executorActive--;
      await runConfiguredParentValidations(execDefaults, `/worktrees/${label}`, {
        label,
        invoke: trackingInvoker(validationProbe, label),
      });
    },
  });
  return { validationProbe, executorMaxActive };
}

describe("runConfiguredParentValidations in a parallel run", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps executors parallel while running parent validations one item at a time by default", async () => {
    const writes: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk: string | Uint8Array) => {
      writes.push(String(chunk));
      return true;
    });
    const execDefaults: ExecDefaultsConfig = {
      pipeline: { parent_validations: ["test-integration", "test-unit"] },
    };

    const { validationProbe, executorMaxActive } = await runItemsInParallel(execDefaults, [
      "PJR-AAAA",
      "PJR-BBBB",
      "PJR-CCCC",
    ]);

    expect(executorMaxActive).toBe(3);
    expect(validationProbe.maxActive).toBe(1);
    expect(validationProbe.events).toEqual([
      "start:PJR-AAAA:test-integration",
      "end:PJR-AAAA:test-integration",
      "start:PJR-AAAA:test-unit",
      "end:PJR-AAAA:test-unit",
      "start:PJR-BBBB:test-integration",
      "end:PJR-BBBB:test-integration",
      "start:PJR-BBBB:test-unit",
      "end:PJR-BBBB:test-unit",
      "start:PJR-CCCC:test-integration",
      "end:PJR-CCCC:test-integration",
      "start:PJR-CCCC:test-unit",
      "end:PJR-CCCC:test-unit",
    ]);
    expect(writes).toContain(
      "  Waiting for parent validation slot: PJR-BBBB (test-integration, test-unit); running: PJR-AAAA\n",
    );
    expect(writes).toContain("  Parent validation slot acquired: PJR-CCCC\n");
  });

  it("allows the configured number of concurrent parent validations", async () => {
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const execDefaults: ExecDefaultsConfig = {
      pipeline: { parent_validations: ["test-integration"], parent_validation_concurrency: 2 },
    };

    const { validationProbe } = await runItemsInParallel(execDefaults, [
      "PJR-AAAA",
      "PJR-BBBB",
      "PJR-CCCC",
    ]);

    expect(validationProbe.maxActive).toBe(2);
  });
});
