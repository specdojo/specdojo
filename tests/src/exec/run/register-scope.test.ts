import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runRegisterMode } from "../../../../src/exec/run/register-mode.js";
import { runSingleRegisterItemWorktree } from "../../../../src/exec/run/register-worktree.js";
import { findExecWorktree } from "../../../../src/exec/worktree.js";

vi.mock(import("../../../../src/exec/run/register-worktree.js"), async (importOriginal) => ({
  ...(await importOriginal()),
  runSingleRegisterItemWorktree: vi.fn(),
}));
vi.mock(import("../../../../src/exec/worktree.js"), async (importOriginal) => ({
  ...(await importOriginal()),
  findExecWorktree: vi.fn(),
}));

const originalCwd = process.cwd();
let repo: string;
const scope = { paths: ["project:src/run.ts"], unknown: false };

function recordPath(id: string): string {
  return join(
    repo,
    "execution/exec/.locks/change-scopes",
    `${createHash("sha256").update(id).digest("hex")}.json`,
  );
}

function ticket(id: string, status = "open"): void {
  writeFileSync(
    join(repo, "register", `${id.toLowerCase()}-test.md`),
    `---
specdojo:
  id: test:${id.toLowerCase()}-test
  type: project
  status: draft
  item_type: todo
  item_status: ${status}
  priority: medium
---

# ${id} Test

Change \`src/run.ts\`.
`,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("SPECDOJO_SCHEDULE_PATH", undefined);
  vi.stubEnv("SPECDOJO_EXECUTION_PATH", undefined);
  repo = mkdtempSync(join(tmpdir(), "specdojo-register-scope-"));
  mkdirSync(join(repo, ".specdojo"));
  mkdirSync(join(repo, "register"));
  mkdirSync(join(repo, "schedule"));
  writeFileSync(
    join(repo, ".specdojo/specdojo.config.json"),
    JSON.stringify({
      version: 1,
      current_project: "test",
      projects: {
        test: {
          project_register_path: "register",
          schedule_path: "schedule",
          execution_path: "execution",
        },
      },
    }),
  );
  process.chdir(repo);
  process.exitCode = undefined;
  vi.spyOn(process.stdout, "write").mockReturnValue(true);
  vi.spyOn(process.stderr, "write").mockReturnValue(true);
  vi.mocked(findExecWorktree).mockReturnValue(null);
  ticket("PJR-NEXT");
});

afterEach(() => {
  process.chdir(originalCwd);
  process.exitCode = undefined;
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  rmSync(repo, { recursive: true, force: true });
});

describe("register scope reservation lifecycle", () => {
  it.each(["throw", "summary"])("releases a failed preparation (%s)", async (failure) => {
    if (failure === "throw") {
      vi.mocked(runSingleRegisterItemWorktree).mockRejectedValue(new Error("plan failed"));
    } else {
      vi.mocked(runSingleRegisterItemWorktree).mockResolvedValue({
        id: "PJR-NEXT",
        title: "Test",
        outcome: "failure",
        transition: "none",
        commit: "off",
      });
    }
    await runRegisterMode({ project: "test", register: ["PJR-NEXT"], worktree: true });
    expect(runSingleRegisterItemWorktree).toHaveBeenCalledTimes(1);
    expect(process.exitCode).toBe(1);
    expect(existsSync(recordPath("PJR-NEXT"))).toBe(false);
    expect(existsSync(recordPath("PJR-NEXT").replace(/\.json$/, ".lock"))).toBe(false);
  });

  it("retains a failure after preparation completed", async () => {
    vi.mocked(runSingleRegisterItemWorktree).mockImplementation(async (_context, opts) => {
      opts.onScopePrepared?.();
      throw new Error("executor failed");
    });
    await runRegisterMode({ project: "test", register: ["PJR-NEXT"], worktree: true });
    expect(JSON.parse(readFileSync(recordPath("PJR-NEXT"), "utf8"))).toMatchObject({
      state: "blocked",
    });
  });

  it("recovers a schedule preparation's orphan before a register run", async () => {
    writeFileSync(
      join(repo, "schedule/sch-track-main.yaml"),
      "kind: track\ntrack: main\ntasks:\n  - id: T-OLD\n    execution: human\n",
    );
    mkdirSync(join(repo, "execution/exec/.locks/change-scopes"), { recursive: true });
    writeFileSync(recordPath("T-OLD"), JSON.stringify({ item: "T-OLD", scope, state: "blocked" }));
    vi.mocked(runSingleRegisterItemWorktree).mockRejectedValue(new Error("plan failed"));

    await runRegisterMode({ project: "test", register: ["PJR-NEXT"], worktree: true });

    expect(existsSync(recordPath("T-OLD"))).toBe(false);
    expect(runSingleRegisterItemWorktree).toHaveBeenCalledTimes(1);
  });

  it.each([
    { status: "open", worktree: false, removed: true },
    { status: "open", worktree: true, removed: false },
    { status: "waiting", worktree: false, removed: false },
  ])(
    "cleans only unused open reservations: $status, worktree=$worktree",
    async ({ status, worktree, removed }) => {
      ticket("PJR-AB12", status);
      mkdirSync(join(repo, "execution/exec/.locks/change-scopes"), { recursive: true });
      writeFileSync(
        recordPath("PJR-AB12"),
        JSON.stringify({ item: "PJR-AB12", scope, state: "blocked" }),
      );
      if (worktree) {
        vi.mocked(findExecWorktree).mockReturnValue({
          path: join(repo, "old"),
          name: "old",
          branch: "exec/old",
          created: false,
        });
      }
      vi.mocked(runSingleRegisterItemWorktree).mockRejectedValue(new Error("plan failed"));
      await runRegisterMode({ project: "test", register: ["PJR-NEXT"], worktree: true });
      expect(existsSync(recordPath("PJR-AB12"))).toBe(!removed);
      expect(runSingleRegisterItemWorktree).toHaveBeenCalledTimes(removed ? 1 : 0);
    },
  );
});
