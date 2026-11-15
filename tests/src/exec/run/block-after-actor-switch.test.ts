import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runWithRetry } from "../../../../src/exec/run/agent.js";
import { spawnBlock, stageActorMeta } from "../../../../src/exec/run/mode-shared.js";
import type { PreparedTask } from "../../../../src/exec/run/schedule-prepare.js";
import { runPreparedTask } from "../../../../src/exec/run/schedule-task.js";

vi.mock(import("../../../../src/exec/run/agent.js"), async (importOriginal) => ({
  ...(await importOriginal()),
  runWithRetry: vi.fn(),
}));
vi.mock(import("../../../../src/exec/run/mode-shared.js"), async (importOriginal) => ({
  ...(await importOriginal()),
  spawnBlock: vi.fn(),
  spawnComplete: vi.fn(),
}));

let repo: string;

function preparedTask(): PreparedTask {
  return {
    task: {
      id: "T-001",
      schedule_file: "sch-track-test.yaml",
      fifo_rank: 1,
      critical_first_rank: 1,
    },
    actor: "claim-agent",
    claimActor: "claim-agent",
    agentCandidates: [
      { command: "claim", actor: "claim-agent" },
      { command: "fallback", actor: "fallback-agent" },
    ],
    plan: "plan",
    prompt: "prompt",
    worktree: { path: join(repo, "worktree"), branch: "exec/test", name: "test", created: false },
  };
}

beforeEach(() => {
  repo = mkdtempSync(join(tmpdir(), "specdojo-block-actor-"));
  vi.spyOn(process.stdout, "write").mockReturnValue(true);
  vi.spyOn(process.stderr, "write").mockReturnValue(true);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.mocked(runWithRetry).mockReset();
  vi.mocked(spawnBlock).mockReset();
  rmSync(repo, { recursive: true, force: true });
});

describe("runPreparedTask block after an actor switch", () => {
  it("blocks as the claiming actor when a fallback agent's stage fails", async () => {
    vi.mocked(runWithRetry).mockResolvedValue({
      result: "failure",
      exitCode: 1,
      stdout: "",
      stderr: "blocked: fallback failed",
      attempts: 2,
      actor: "fallback-agent",
      rateLimitEvents: [],
    });
    const prepared = preparedTask();

    const result = await runPreparedTask(
      prepared,
      "prj-test",
      repo,
      join(repo, "schedule"),
      join(repo, "execution"),
      undefined,
      {},
      false,
    );

    expect(result).toBe("failure");
    expect(spawnBlock).toHaveBeenCalledOnce();
    const [projectId, taskId, by, , meta] = vi.mocked(spawnBlock).mock.calls[0];
    expect([projectId, taskId, by]).toEqual(["prj-test", "T-001", "claim-agent"]);
    expect(meta).toMatchObject({
      limit_deferred: "false",
      claim_actor: "claim-agent",
      stage_actor: "fallback-agent",
    });
  });
});

describe("stageActorMeta", () => {
  it("falls back to the claiming actor when the stage actor is unknown", () => {
    expect(stageActorMeta("claim-agent", undefined)).toEqual({
      claim_actor: "claim-agent",
      stage_actor: "claim-agent",
    });
  });
});
