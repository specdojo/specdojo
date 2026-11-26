// 立ち上げたままのオーケストレーターが手で run・再開・直しを進めている間に見張りが動いても、
// 触らずに次の回へ回すことを、実プロセスと実際の実行ロックで確かめる（PJR-T4E0）。
// 場面は 2026-11-13〜14 の夜の実例（型のメニューの足し忘れ・commit の対象外・branch の食い違い）。
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { spawn, type ChildProcess } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  acquireExecRunLock,
  releaseExecRunLock,
  type ExecRunLockHandle,
} from "../../../src/exec/run/lock.js";
import {
  listProcesses,
  pauseWatch,
  resumeWatch,
  watchActionGate,
} from "../../../src/exec/watch-control.js";
import { resolveWatchRemedies } from "../../../src/exec/watch-remedy.js";
import { runWatchScan, type WatchScanInput } from "../../../src/exec/watch-scan.js";
import type { PjrItem } from "../../../src/register/item.js";

const NOW = new Date("2026-11-14T00:00:00Z");

// branch の食い違いは同期の手当て、時間切れは流し直しの手当てを選んだ設定（PJR-3M4M）。
const remedies = resolveWatchRemedies({
  remedies: { load_timeout: { action: "rerun" }, needs_target_sync: { action: "sync" } },
});

function waitEvent(reason: string): string {
  return [
    "- v: 1",
    "  id: reg_00000000000000000000000000000001",
    '  ts: "2026-11-13T15:00:00Z"',
    "  action: wait",
    "  actor: sol-executor",
    "  from_status: in-progress",
    "  to_status: waiting",
    `  reason: ${JSON.stringify(reason)}`,
    "  changes:",
    "    - field: status",
    "      from: in-progress",
    "      to: waiting",
    "",
  ].join("\n");
}

// 型のメニューの足し忘れ（親の検証の test-unit）、commit の対象外、branch の食い違い。
const SCENES = {
  "PJR-KATA": {
    reason: "parent validation failed: test-unit",
    log: [
      "parent validation: test-unit",
      "exit code: 1",
      "timed out: no",
      " FAIL  tests/packages/docs-site/sidebar-kata.test.ts > specdojo sidebar kata menus > covers all non-deprecated rulebooks, recipes, samples, and templates",
    ].join("\n"),
  },
  "PJR-SCOP": {
    reason:
      "integration failed: uncommitted=1; log=docs/ja/projects/prj-0001/execution/runs/schedule/x/integrate.log",
  },
  "PJR-BRCH": {
    reason:
      "project: git commit failed: test: error: unknown option '--reserve'; FAIL  |integration| tests/src/exec/pipeline-e2e.integration.test.ts",
  },
} as const;

async function waitUntil(check: () => boolean, label: string): Promise<void> {
  const deadline = Date.now() + 10_000;
  while (!check()) {
    if (Date.now() > deadline) throw new Error(`timed out waiting for ${label}`);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

describe("watch-scan next to an orchestrator working by hand", () => {
  let dir: string;
  let executionPath: string;
  let registerPath: string;
  const children: ChildProcess[] = [];
  let lock: ExecRunLockHandle | null = null;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "specdojo-watch-coexist-"));
    executionPath = path.join(dir, "execution");
    registerPath = path.join(dir, "register");
    await mkdir(path.join(registerPath, "events"), { recursive: true });
    for (const [id, scene] of Object.entries(SCENES)) {
      await writeFile(
        path.join(registerPath, "events", `${id.toLowerCase()}.yaml`),
        waitEvent(scene.reason),
        "utf8",
      );
      if ("log" in scene) {
        const runDir = path.join(executionPath, "runs", "register", id, "run-1");
        await mkdir(runDir, { recursive: true });
        await writeFile(
          path.join(runDir, "parent-validation-attempt-1-test-unit.log"),
          scene.log,
          "utf8",
        );
      }
    }
  });

  afterEach(async () => {
    try {
      if (lock) releaseExecRunLock(lock);
      lock = null;
      for (const child of children.splice(0)) child.kill("SIGKILL");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  function input(overrides: Partial<WatchScanInput> = {}): WatchScanInput {
    const items = [
      ...Object.keys(SCENES).map((id) => ({
        id,
        status: "waiting",
        registeredAt: "2026-11-13T00:00:00Z",
      })),
      // オーケストレーターが手で流している run の項目。更新は古いが、ロックがあるので中断と見なさない。
      { id: "PJR-INPR", status: "in-progress", registeredAt: "2026-11-13T00:00:00Z" },
    ] as PjrItem[];
    return {
      projectId: "prj-test",
      root: dir,
      executionPath,
      register: { items, projectRegisterPath: registerPath },
      timeZone: "UTC",
      now: NOW,
      staleMs: 2 * 3_600_000,
      dryRun: false,
      manualActors: new Set(["indie", "specdojo-orchestrator"]),
      ...overrides,
    };
  }

  function startProcess(args: string[], cwd: string): ChildProcess {
    const child = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)", ...args], {
      cwd,
      stdio: "ignore",
    });
    children.push(child);
    return child;
  }

  async function registerEventFiles(): Promise<Record<string, string>> {
    const directory = path.join(registerPath, "events");
    const files: Record<string, string> = {};
    for (const name of (await readdir(directory)).sort())
      files[name] = await readFile(path.join(directory, name), "utf8");
    return files;
  }

  it("leaves hand-started work alone, then records it once the orchestrator lets go", async () => {
    const before = await registerEventFiles();
    // 型のメニューを手で直している間は「見張りの対象外」の印を付ける。
    pauseWatch(executionPath, {
      targets: ["PJR-KATA"],
      by: "specdojo-orchestrator",
      reason: "adding the kata menu entry",
      now: "2026-11-13T23:50:00Z",
    });
    // commit の対象外の変更を、オーケストレーターが手で再開している。
    const resume = startProcess(["specdojo", "exec", "resume", "--register", "PJR-SCOP"], dir);
    // branch の食い違いを直すため、worktree の中で統合先へ同期している。
    const worktree = path.join(dir, "worktrees", "prj-test-PJR-BRCH");
    await mkdir(worktree, { recursive: true });
    const sync = startProcess(["git-sync-stand-in"], worktree);
    // 手で流している run が実行ロックを持っている。
    lock = await acquireExecRunLock(executionPath, {
      actor: "specdojo-orchestrator",
      ifBusy: "fail",
    });
    expect(lock).not.toBeNull();
    await waitUntil(
      () =>
        [resume.pid, sync.pid].every((pid) =>
          listProcesses().some((info) => info.pid === pid && info.argv.length > 2),
        ),
      "the hand-started processes",
    );

    const busy = runWatchScan(input({ ifBusy: "skip" }));
    const held = runWatchScan(input());

    expect(busy.skipped).toEqual({ reason: "busy", detail: "another exec run holds the run lock" });
    expect(watchActionGate(executionPath)).toMatchObject({ allowed: false, reason: "busy" });
    expect(held.appended).toEqual([]);
    expect(held.current).toEqual([]);
    expect(held.held.map((entry) => [entry.target.id, entry.hold.reason]).sort()).toEqual([
      ["PJR-BRCH", "live_process"],
      ["PJR-KATA", "paused"],
      ["PJR-SCOP", "live_process"],
    ]);

    // ロックが外れても、手で始めた作業と印の付いた対象には手当て（PJR-3M4M）を打たない。
    releaseExecRunLock(lock!);
    lock = null;
    const launch = vi.fn();
    const whileWorking = runWatchScan(input({ dryRun: true, remedies, launch }));

    expect(whileWorking.remedy.launched).toBeUndefined();
    expect(whileWorking.remedy.deferredByLock).toBe(false);
    expect(whileWorking.held.map((entry) => entry.target.id).sort()).toEqual([
      "PJR-BRCH",
      "PJR-KATA",
      "PJR-SCOP",
    ]);
    expect(launch).not.toHaveBeenCalled();

    for (const child of children.splice(0)) child.kill("SIGKILL");
    await waitUntil(
      () => !listProcesses().some((info) => info.pid === resume.pid || info.pid === sync.pid),
      "the hand-started processes to exit",
    );
    resumeWatch(executionPath, {
      targets: ["PJR-KATA"],
      by: "specdojo-orchestrator",
      now: "2026-11-14T00:10:00Z",
    });
    const after = runWatchScan(input({ now: new Date("2026-11-14T00:30:00Z"), remedies, launch }));

    expect(watchActionGate(executionPath)).toEqual({ allowed: true });
    expect(
      after.appended.map((line) =>
        line.event === "stalled"
          ? [line.target.id, line.category, line.detail]
          : [line.event, line.target.id],
      ),
    ).toEqual([
      ["PJR-BRCH", "needs_target_sync", "target_ahead"],
      ["PJR-INPR", "interrupted", "stale_in-progress"],
      ["PJR-KATA", "needs_decision", "kata_rule"],
      ["PJR-SCOP", "needs_decision", "out_of_commit_scope"],
      ["remedy", "PJR-BRCH"],
    ]);
    expect(launch).toHaveBeenCalledTimes(1);
    expect(launch.mock.calls[0]![0]).toContain("PJR-BRCH");
    // 見張りは登録簿の event を書き換えない。
    expect(await registerEventFiles()).toEqual(before);
  }, 30_000);
});
