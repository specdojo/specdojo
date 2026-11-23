import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  failedParentValidationReason,
  invokeParentValidation,
  runParentValidationBatch,
  type ParentValidationDefinition,
} from "../../../src/exec/parent-validation.js";

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
