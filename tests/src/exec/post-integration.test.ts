import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { loadExecDefaultsConfig } from "../../../src/exec/agent-config.js";
import { integratedCommitRange, runPostIntegration } from "../../../src/exec/post-integration.js";
import { gitOutput } from "../../../src/exec/worktree.js";
import type * as WorktreeModule from "../../../src/exec/worktree.js";
import {
  DIST_BUILD_FAILURE_MARKER,
  evaluateDistFreshness,
  inspectBuildFreshness,
} from "../../../src/shared/dist-freshness.js";
import { DeferredCleanup, runWithDeferredCleanup } from "../../../src/exec/run/deferred-cleanup.js";
import { SerialAsyncLock } from "../../../src/exec/run/shared.js";

vi.mock("../../../src/exec/worktree.js", async (importOriginal) => ({
  ...(await importOriginal<typeof WorktreeModule>()),
  gitOutput: vi.fn(),
}));

const roots: string[] = [];
function setup() {
  const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-post-integration-"));
  roots.push(repoRoot);
  return {
    repoRoot,
    baseCommit: "before-merge",
    outputCommit: "merge",
    entries: [{ id: "build-dist" as const, paths: ["src/**", "tsconfig*.json"] }],
    logPath: join(repoRoot, "runs", "post-integration.log"),
    log: vi.fn(),
  };
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
  vi.resetAllMocks();
});

describe("post integration config", () => {
  it("loads an optional fixed ID with paths", () => {
    const { repoRoot, entries } = setup();
    const config = join(repoRoot, "defaults.yaml");
    writeFileSync(config, JSON.stringify({ pipeline: { post_integration: entries } }));
    expect(loadExecDefaultsConfig(config).pipeline?.post_integration).toEqual(entries);
    writeFileSync(config, "pipeline: { post_integration: [] }");
    expect(loadExecDefaultsConfig(config).pipeline?.post_integration).toEqual([]);
    writeFileSync(config, "{}");
    expect(loadExecDefaultsConfig(config).pipeline?.post_integration).toBeUndefined();
  });

  it.each(
    [
      null,
      "build-dist",
      {},
      [null],
      ["build-dist"],
      [{ id: "arbitrary", paths: ["**"] }],
      [{ id: 1, paths: ["**"] }],
      [{ id: "build-dist" }],
      [{ id: "build-dist", paths: [] }],
      [{ id: "build-dist", paths: "src/**" }],
      [{ id: "build-dist", paths: [""] }],
      [{ id: "build-dist", paths: [" "] }],
      [{ id: "build-dist", paths: [1] }],
      [{ id: "build-dist", paths: ["**"], command: "evil" }],
      [{ id: "build-dist", paths: ["**"], args: [] }],
      [{ id: "build-dist", paths: ["**"], repo: "product" }],
      [
        { id: "build-dist", paths: ["**"] },
        { id: "build-dist", paths: ["src/**"] },
      ],
    ].map((entries) => ({ entries })),
  )("rejects invalid entries: %j", ({ entries }) => {
    const { repoRoot } = setup();
    const config = join(repoRoot, "defaults.yaml");
    writeFileSync(config, JSON.stringify({ pipeline: { post_integration: entries } }));
    expect(() => loadExecDefaultsConfig(config)).toThrow(/pipeline\.post_integration/);
  });
});

describe("post integration execution", () => {
  it.each([
    "src/file.ts",
    "src/nested/file.ts",
    "tsconfig.json",
    "tsconfig.build.json",
    "src/old name.ts",
  ])("builds in the integration target with fixed argv for %s", async (path) => {
    const params = setup();
    vi.mocked(gitOutput).mockReturnValue(`${path}\0`);
    const invoke = vi.fn().mockResolvedValue({ exitCode: 0, stdout: "built", stderr: "" });
    const records = await runPostIntegration({ ...params, invoke });
    expect(invoke).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        command: process.platform === "win32" ? "npm.cmd" : "npm",
        args: ["run", "build"],
        timeoutMs: 600000,
      }),
      params.repoRoot,
    );
    expect(gitOutput).toHaveBeenCalledWith(params.repoRoot, [
      "diff",
      "--name-only",
      "--no-renames",
      "-z",
      "before-merge",
      "merge",
      "--",
    ]);
    expect(records[0]).toMatchObject({
      status: "passed",
      base_commit: "before-merge",
      output_commit: "merge",
    });
    expect(JSON.parse(readFileSync(params.logPath, "utf8"))).toEqual(records[0]);
  });

  it.each(["docs/guide.md\0", "", "product:src/file.ts\0"])(
    "records a skip for unrelated paths: %s",
    async (diff) => {
      const params = setup();
      vi.mocked(gitOutput).mockReturnValue(diff);
      const invoke = vi.fn();
      expect((await runPostIntegration({ ...params, invoke }))[0]).toMatchObject({
        status: "skipped",
        summary: "no integrated paths match paths",
      });
      expect(invoke).not.toHaveBeenCalled();
    },
  );

  it.each([
    { exitCode: 1, stdout: "", stderr: "compile error" },
    { exitCode: null, stdout: "", stderr: "", error: "spawn failed" },
    { exitCode: 0, stdout: "", stderr: "", timedOut: true },
  ])("records a failed build without undoing the merge: %j", async (result) => {
    const params = setup();
    vi.mocked(gitOutput).mockReturnValue("src/file.ts\0");
    const records = await runPostIntegration({
      ...params,
      invoke: vi.fn().mockResolvedValue(result),
    });
    expect(records[0].status).toBe("failed");
    expect(params.log).toHaveBeenCalledWith(expect.stringContaining("integration kept"));
    expect(vi.mocked(gitOutput).mock.calls.every(([, args]) => args[0] === "diff")).toBe(true);
    expect(existsSync(join(params.repoRoot, "dist", DIST_BUILD_FAILURE_MARKER))).toBe(true);
  });

  it("keeps dist-freshness blocking even if a failed compiler emitted newer JS", async () => {
    const params = setup();
    mkdirSync(join(params.repoRoot, "src"));
    mkdirSync(join(params.repoRoot, "dist"));
    writeFileSync(join(params.repoRoot, "src/file.ts"), "source");
    utimesSync(join(params.repoRoot, "src/file.ts"), 1, 1);
    writeFileSync(join(params.repoRoot, "dist/specdojo.js"), "partial output");
    vi.mocked(gitOutput).mockReturnValue("src/file.ts\0");
    await runPostIntegration({ ...params, invoke: vi.fn().mockRejectedValue(new Error("failed")) });
    const freshness = inspectBuildFreshness(params.repoRoot);
    expect(freshness).toMatchObject({ status: "stale", buildFailed: true });
    expect(
      evaluateDistFreshness(freshness, ["node", "dist/specdojo.js", "exec", "run"], {}),
    ).toMatchObject({ action: "block" });
    await runPostIntegration({
      ...params,
      outputCommit: "next-merge",
      invoke: vi.fn().mockResolvedValue({ exitCode: 0, stdout: "", stderr: "" }),
    });
    expect(inspectBuildFreshness(params.repoRoot).status).toBe("up-to-date");
  });

  it.each([0, 1])(
    "does not repeat a recorded attempt on cleanup resume (exit %s)",
    async (exitCode) => {
      const params = setup();
      vi.mocked(gitOutput).mockReturnValue("src/file.ts\0");
      const invoke = vi.fn().mockResolvedValue({ exitCode, stdout: "", stderr: "" });
      await runPostIntegration({ ...params, invoke });
      expect(await runPostIntegration({ ...params, invoke })).toEqual([]);
      expect(invoke).toHaveBeenCalledTimes(1);
    },
  );

  it("keeps the lifecycle lock through the build, before deferred cleanup and other integrations", async () => {
    const params = setup();
    vi.mocked(gitOutput).mockReturnValue("src/file.ts\0");
    const lock = new SerialAsyncLock();
    const order: string[] = [];
    let releaseBuild!: () => void;
    let markStarted!: () => void;
    const started = new Promise<void>((resolve) => {
      markStarted = resolve;
    });
    const release = new Promise<void>((resolve) => {
      releaseBuild = resolve;
    });
    const run = runWithDeferredCleanup(lock, async () => {
      order.push("merge");
      await runPostIntegration({
        ...params,
        invoke: async () => {
          order.push("build start");
          markStarted();
          await release;
          order.push("build end");
          return { exitCode: 0, stdout: "", stderr: "" };
        },
      });
      return new DeferredCleanup(
        () => {
          order.push("cleanup");
        },
        () => "success",
      );
    });
    await started;
    const other = lock.runExclusive(() => {
      order.push("other integration");
    });
    expect(order).toEqual(["merge", "build start"]);
    releaseBuild();
    expect(await run).toBe("success");
    await other;
    expect(order.indexOf("build end")).toBeLessThan(order.indexOf("other integration"));
    expect(order.indexOf("build end")).toBeLessThan(order.indexOf("cleanup"));
  });

  it("locates the original integration after later commits", () => {
    vi.mocked(gitOutput)
      .mockReturnValueOnce("branch-tip")
      .mockReturnValueOnce("later\noriginal-merge\n")
      .mockReturnValueOnce("original-base");
    expect(integratedCommitRange("repo", "exec/task")).toEqual({
      baseCommit: "original-base",
      outputCommit: "original-merge",
    });
  });
});
