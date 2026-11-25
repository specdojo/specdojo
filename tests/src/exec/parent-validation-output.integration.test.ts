import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  failedParentValidationReason,
  invokeParentValidation,
  runParentValidationBatch,
  type ParentValidationDefinition,
} from "../../../src/exec/parent-validation.js";
import { withValidationMetrics } from "../../../src/exec/validation-metrics.js";
import { gitResult, gitResultAsync } from "../../../src/shared/git.js";

// PJR-6690: `exec run --parallel` の runner は、他のタスクの spawnSync（npm ci など）で event loop
// が止まる。止まっている間も、出力の多い検証の子が書き込みで止まらないことを実プロセスで確かめる。
const NOISY_SCRIPT = `
import { writeFileSync } from "node:fs";
const [doneFile] = process.argv.slice(2);
const line = "docs/ja/projects/prj-0001/execution/runs/example/pipeline-state.json: valid\\n";
process.stdout.write("> specdojo@0.0.0 validate:schema:pipeline-state\\n");
// pipe の buffer（64 KiB）を十分に超える量を書く。
for (let index = 0; index < 12_000; index++) process.stdout.write(line);
process.stderr.write("warn\\n");
writeFileSync(doneFile, String(Date.now()), "utf8");
`;

const STALLED_SCRIPT = `
process.stdout.write("> specdojo@0.0.0 validate:schema\\n");
process.stdout.write("> specdojo@0.0.0 validate:schema:glossary\\n");
setInterval(() => {}, 1000);
`;

const directories: string[] = [];

afterEach(async () => {
  for (const directory of directories.splice(0)) {
    await rm(directory, { recursive: true, force: true });
  }
});

async function scriptDefinition(
  script: string,
  args: (directory: string) => string[],
  timeoutMs: number,
): Promise<{ directory: string; definition: ParentValidationDefinition }> {
  const directory = await mkdtemp(path.join(tmpdir(), "parent-validation-output-"));
  directories.push(directory);
  const scriptPath = path.join(directory, "validation.mjs");
  await writeFile(scriptPath, script, "utf8");
  return {
    directory,
    definition: {
      id: "validate-schema",
      command: process.execPath,
      args: [scriptPath, ...args(directory)],
      displayCommand: "npm run validate:schema",
      timeoutMs,
    },
  };
}

async function readExitTiming(metricsPath: string): Promise<Record<string, unknown> | undefined> {
  return (await readFile(metricsPath, "utf8"))
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>)
    .find((entry) => entry.event === "validation-exit-timing");
}

// commit の hook が長く走る一時リポジトリを作る。hook の置き場は core.hooksPath で固定する。
async function repositoryWithSlowHook(seconds: number): Promise<{ repo: string; hooks: string }> {
  const repo = await mkdtemp(path.join(tmpdir(), "parent-validation-commit-"));
  directories.push(repo);
  const hooks = path.join(repo, "hooks");
  await mkdir(hooks);
  const hook = path.join(hooks, "pre-commit");
  await writeFile(hook, `#!/bin/sh\nsleep ${seconds}\n`, "utf8");
  await chmod(hook, 0o755);
  expect(gitResult(repo, ["init", "--quiet"]).status).toBe(0);
  return { repo, hooks };
}

function blockEventLoop(milliseconds: number): number {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
  return Date.now();
}

describe.skipIf(process.platform === "win32")("parent validation output", () => {
  it("lets a validation with large output finish while the runner's event loop is blocked", async () => {
    const { directory, definition } = await scriptDefinition(
      NOISY_SCRIPT,
      (dir) => [path.join(dir, "done")],
      60_000,
    );

    const pending = invokeParentValidation(definition, process.cwd());
    const unblockedAt = blockEventLoop(3_000);
    const result = await pending;

    const finishedAt = Number(await readFile(path.join(directory, "done"), "utf8"));
    expect(finishedAt).toBeLessThan(unblockedAt);
    expect(result).toMatchObject({
      exitCode: 0,
      timedOut: false,
      stderr: "warn\n",
      stage: "validate:schema:pipeline-state",
    });
    expect(result.stdout.split("\n").filter((line) => line.endsWith(": valid"))).toHaveLength(
      12_000,
    );
  });

  it("records the runner's detection lag separately from the child's run time (PJR-P8SX)", async () => {
    const { directory, definition } = await scriptDefinition(
      NOISY_SCRIPT,
      (dir) => [path.join(dir, "done")],
      60_000,
    );
    const metricsPath = path.join(directory, "metrics.jsonl");

    await withValidationMetrics("lag", metricsPath, async () => {
      const pending = invokeParentValidation(definition, process.cwd());
      blockEventLoop(3_000);
      await pending;
    });

    const timing = await readExitTiming(metricsPath);
    expect(timing).toMatchObject({ id: "validate-schema" });
    expect(timing?.detection_lag_ms).toEqual(expect.any(Number));
    expect(Number(timing?.detection_lag_ms)).toBeGreaterThan(1_000);
    expect(Number(timing?.last_output_ms)).toBeLessThan(Number(timing?.duration_ms));
    expect(Number(timing?.event_loop_delay_max_ms)).toBeGreaterThan(2_000);
  });

  it("notices a validation's end on time while another task's commit hook runs (PJR-P8SX)", async () => {
    const { directory, definition } = await scriptDefinition(
      NOISY_SCRIPT,
      (dir) => [path.join(dir, "done")],
      60_000,
    );
    const metricsPath = path.join(directory, "metrics.jsonl");
    const { repo, hooks } = await repositoryWithSlowHook(3);

    const commit = await withValidationMetrics("commit", metricsPath, async () => {
      const validation = invokeParentValidation(definition, process.cwd());
      const committing = gitResultAsync(repo, [
        "-c",
        `core.hooksPath=${hooks}`,
        "commit",
        "--allow-empty",
        "-m",
        "integrate another task",
      ]);
      await validation;
      return committing;
    });

    expect(commit.status).toBe(0);
    const timing = await readExitTiming(metricsPath);
    expect(Number(timing?.duration_ms)).toBeLessThan(2_500);
    expect(Number(timing?.detection_lag_ms)).toBeLessThan(1_000);
    expect(Number(timing?.event_loop_delay_max_ms)).toBeLessThan(1_000);
  });

  it("names the stalled npm script stage and the elapsed time in the block reason on timeout", async () => {
    const { definition } = await scriptDefinition(STALLED_SCRIPT, () => [], 1_000);

    // 設定の validate-schema の代わりに、glossary の段で止まる子を流す。
    const batch = await runParentValidationBatch(["validate-schema"], process.cwd(), (_, cwd) =>
      invokeParentValidation(definition, cwd, { killGraceMs: 200, closeGraceMs: 500 }),
    );

    expect(batch.failureOutputs[0]).toMatchObject({
      timedOut: true,
      stage: "validate:schema:glossary",
    });
    expect(failedParentValidationReason(batch.validations)).toMatch(
      /^parent validation failed: validate-schema \(timed out after [1-9]\d*s \(stage: validate:schema:glossary\)\)$/u,
    );
  });
});
