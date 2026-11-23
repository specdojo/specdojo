/**
 * On-demand measurement for PJR-6690: runs the same parent validation several times at once
 * through `invokeParentValidation`, optionally while the runner's event loop is blocked by
 * synchronous child processes, as `exec run --parallel` does when another task runs `npm ci` or
 * `specdojo build` with spawnSync.
 *
 * Not part of `vitest run`: it runs the real validation command several times and takes minutes.
 * The regression test is tests/src/exec/parent-validation-output.integration.test.ts.
 *
 * Usage:
 *   npx tsx tools/e2e/parent-validation-load.ts [--count 5] [--block-ms 2000] [--idle-ms 200]
 *     [--timeout-ms 600000] [--] [command args...]
 *
 * The default command is `npm run validate:schema` in the current directory. `--block-ms 0`
 * measures without blocking the event loop.
 */
import { spawnSync } from "node:child_process";
import {
  invokeParentValidation,
  type ParentValidationDefinition,
} from "../../src/exec/parent-validation.js";

type Options = {
  count: number;
  blockMs: number;
  idleMs: number;
  timeoutMs: number;
  command: string[];
};

function positiveInteger(name: string, value: string | undefined, allowZero: boolean): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || (!allowZero && parsed === 0)) {
    throw new Error(
      `${name} must be a ${allowZero ? "non-negative" : "positive"} integer: ${value}`,
    );
  }
  return parsed;
}

function parseOptions(argv: readonly string[]): Options {
  const options: Options = {
    count: 5,
    blockMs: 2_000,
    idleMs: 200,
    timeoutMs: 10 * 60 * 1_000,
    command: ["npm", "run", "validate:schema"],
  };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === "--count") options.count = positiveInteger(arg, argv[++index], false);
    else if (arg === "--block-ms") options.blockMs = positiveInteger(arg, argv[++index], true);
    else if (arg === "--idle-ms") options.idleMs = positiveInteger(arg, argv[++index], true);
    else if (arg === "--timeout-ms") options.timeoutMs = positiveInteger(arg, argv[++index], false);
    else if (arg === "--") {
      options.command = argv.slice(index + 1);
      break;
    } else {
      options.command = argv.slice(index);
      break;
    }
  }
  if (options.command.length === 0) throw new Error("command is empty");
  return options;
}

// spawnSync で子の終了を待つ間、runner は親の検証の出力を読めない（npm ci・specdojo build と同じ）。
function startEventLoopBlocker(blockMs: number, idleMs: number): () => number {
  if (blockMs === 0) return () => 0;
  let blockedMs = 0;
  let stopped = false;
  const tick = (): void => {
    if (stopped) return;
    const started = performance.now();
    spawnSync("sleep", [String(blockMs / 1_000)]);
    blockedMs += performance.now() - started;
    setTimeout(tick, idleMs);
  };
  setTimeout(tick, idleMs);
  return () => {
    stopped = true;
    return blockedMs;
  };
}

async function main(): Promise<void> {
  const options = parseOptions(process.argv.slice(2));
  const [command, ...args] = options.command;
  const definition: ParentValidationDefinition = {
    id: "validate-schema",
    command,
    args,
    displayCommand: options.command.join(" "),
    timeoutMs: options.timeoutMs,
  };
  process.stdout.write(
    `command=${definition.displayCommand} count=${options.count} block_ms=${options.blockMs} idle_ms=${options.idleMs}\n`,
  );
  const stopBlocker = startEventLoopBlocker(options.blockMs, options.idleMs);
  const started = performance.now();
  const results = await Promise.all(
    Array.from({ length: options.count }, async (_, index) => {
      const runStarted = performance.now();
      const result = await invokeParentValidation(definition, process.cwd());
      return { index, seconds: (performance.now() - runStarted) / 1_000, result };
    }),
  );
  const blockedMs = stopBlocker();
  for (const { index, seconds, result } of results) {
    process.stdout.write(
      `run ${index + 1}: ${seconds.toFixed(1)}s exit=${result.exitCode ?? "null"} timed_out=${result.timedOut === true} stdout_bytes=${Buffer.byteLength(result.stdout)}\n`,
    );
  }
  process.stdout.write(
    `total ${((performance.now() - started) / 1_000).toFixed(1)}s, event loop blocked ${(blockedMs / 1_000).toFixed(1)}s\n`,
  );
  if (results.some(({ result }) => result.exitCode !== 0 || result.timedOut)) process.exitCode = 1;
}

await main();
