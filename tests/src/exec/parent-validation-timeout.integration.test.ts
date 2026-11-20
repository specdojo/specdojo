import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  invokeParentValidation,
  type ParentValidationDefinition,
} from "../../../src/exec/parent-validation.js";
import { withValidationMetrics } from "../../../src/exec/validation-metrics.js";

// 時間切れの後に、子孫が出力の pipe を持ったまま残る状況を実プロセスで再現する（PJR-V277）。
const GRANDCHILD_SCRIPT = `
process.on("SIGTERM", () => {});
process.stdout.write(JSON.stringify({ grandchild: process.pid }) + "\\n");
setInterval(() => {}, 1000);
`;

const PARENT_SCRIPT = `
import { spawn } from "node:child_process";
const [grandchild, mode] = process.argv.slice(2);
if (mode === "exit") {
  process.stdout.write("done\\n");
  process.stderr.write("warn\\n");
  process.exit(3);
}
spawn(process.execPath, [grandchild], {
  stdio: ["ignore", "inherit", "inherit"],
  detached: mode === "escape",
});
setInterval(() => {}, 1000);
`;

const directories: string[] = [];
const leftovers: number[] = [];

afterEach(async () => {
  for (const pid of leftovers.splice(0)) {
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      // 既に終わっている。
    }
  }
  for (const directory of directories.splice(0)) {
    await rm(directory, { recursive: true, force: true });
  }
});

async function fixture(mode: "hold" | "escape" | "exit") {
  const directory = await mkdtemp(path.join(tmpdir(), "parent-validation-timeout-"));
  directories.push(directory);
  const grandchild = path.join(directory, "grandchild.mjs");
  const parent = path.join(directory, "parent.mjs");
  await writeFile(grandchild, GRANDCHILD_SCRIPT, "utf8");
  await writeFile(parent, PARENT_SCRIPT, "utf8");
  const definition: ParentValidationDefinition = {
    id: "test-integration",
    command: process.execPath,
    args: [parent, grandchild, mode],
    displayCommand: "npm run test:integration",
    timeoutMs: 2_000,
  };
  return { directory, definition, metrics: path.join(directory, "metrics.jsonl") };
}

function grandchildPid(stdout: string): number {
  const line = stdout.split("\n").find((value) => value.includes("grandchild"));
  if (!line) throw new Error(`grandchild pid not found in stdout: ${stdout}`);
  const pid = (JSON.parse(line) as { grandchild: number }).grandchild;
  leftovers.push(pid);
  return pid;
}

function isRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
  } catch {
    return false;
  }
  try {
    // 回収されない zombie は終了済みとして扱う。
    return readFileSync(`/proc/${pid}/stat`, "utf8").split(") ")[1]?.[0] !== "Z";
  } catch {
    return true;
  }
}

async function waitUntilStopped(pid: number): Promise<boolean> {
  for (let attempt = 0; attempt < 40; attempt++) {
    if (!isRunning(pid)) return true;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return false;
}

async function metricRows(file: string): Promise<Record<string, unknown>[]> {
  const text = await readFile(file, "utf8").catch(() => "");
  return text
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>);
}

describe.skipIf(process.platform === "win32")("parent validation timeout stop", () => {
  it("kills a grandchild that ignores SIGTERM and holds the pipes, then returns as timed out", async () => {
    const { definition, metrics } = await fixture("hold");
    const started = performance.now();

    const result = await withValidationMetrics("hold", metrics, () =>
      invokeParentValidation(definition, process.cwd(), { killGraceMs: 500, closeGraceMs: 2_000 }),
    );

    expect(performance.now() - started).toBeLessThan(8_000);
    expect(result.timedOut).toBe(true);
    expect(await waitUntilStopped(grandchildPid(result.stdout))).toBe(true);
    expect(
      (await metricRows(metrics)).find((row) => row.event === "validation-timeout-stop"),
    ).toMatchObject({
      id: "test-integration",
      process_group: true,
      survivors_after_term: true,
      kill_sent: true,
      pipes_closed: true,
    });
  });

  it("returns after the close grace when a descendant outside the group keeps the pipes open", async () => {
    const { definition, metrics } = await fixture("escape");
    const started = performance.now();

    const result = await withValidationMetrics("escape", metrics, () =>
      invokeParentValidation(definition, process.cwd(), { killGraceMs: 500, closeGraceMs: 500 }),
    );

    expect(performance.now() - started).toBeLessThan(8_000);
    expect(result.timedOut).toBe(true);
    expect(isRunning(grandchildPid(result.stdout))).toBe(true);
    expect(
      (await metricRows(metrics)).find((row) => row.event === "validation-timeout-stop"),
    ).toMatchObject({ id: "test-integration", pipes_closed: false });
  });

  it("keeps exit code, output and metrics unchanged when the validation finishes in time", async () => {
    const { definition, metrics } = await fixture("exit");

    const result = await withValidationMetrics("exit", metrics, () =>
      invokeParentValidation(definition, process.cwd()),
    );

    expect(result).toEqual({
      exitCode: 3,
      stdout: "done\n",
      stderr: "warn\n",
      timedOut: false,
      stdoutTruncated: false,
      stderrTruncated: false,
    });
    expect(await metricRows(metrics)).toEqual([]);
  });
});
