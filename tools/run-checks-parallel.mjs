#!/usr/bin/env node
// `npm run check` の静的な検査（型・lint・schema・カタログ・履歴のリンク）を並べて流し、
// 指定があればそのあとに `npm test` を流す（PJR-5RAY）。
// 検査どうしは読み取りだけで、互いの生成物に依存しないため並べてよい。
// `npm run check` そのものは変えず、CI と exec の親の検証が見つける不具合は変えない。
import { spawn } from "node:child_process";
import { availableParallelism } from "node:os";
import { pathToFileURL } from "node:url";

/** `npm run check` の `npm test` より前の段と同じ並び（表示の順に使う）。 */
export const STATIC_CHECKS = [
  "typecheck",
  "lint:ts",
  "check:src-imports",
  "lint:md",
  "lint:fm",
  "lint:mermaid",
  "lint:d2",
  "validate:schema",
  "validate:catalog",
  "validate:history-links",
];

const USAGE = `Usage: node tools/run-checks-parallel.mjs [--test] [--max-workers <n>] [--concurrency <n>]

  --test             Run "npm test" after all static checks pass
  --max-workers <n>  With --test: set VITEST_MAX_WORKERS for "npm test" (positive integer)
  --concurrency <n>  Run at most <n> static checks at a time (default: all)`;

function parsePositiveInteger(value, name) {
  if (value === undefined || !/^[1-9][0-9]*$/.test(value)) {
    throw new Error(`${name} must be a positive integer: ${value ?? "(missing)"}`);
  }
  return Number(value);
}

/** 引数を解釈する。不正な指定は理由を添えて例外にする。 */
export function parseArguments(argv) {
  const options = { test: false, maxWorkers: undefined, concurrency: STATIC_CHECKS.length };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--test") {
      options.test = true;
    } else if (arg === "--max-workers") {
      options.maxWorkers = parsePositiveInteger(argv[index + 1], "--max-workers");
      index += 1;
    } else if (arg === "--concurrency") {
      options.concurrency = parsePositiveInteger(argv[index + 1], "--concurrency");
      index += 1;
    } else if (arg === "-h" || arg === "--help") {
      options.help = true;
    } else {
      throw new Error(`Unknown option: ${arg}\n${USAGE}`);
    }
  }
  if (options.maxWorkers !== undefined && !options.test) {
    throw new Error("--max-workers requires --test");
  }
  return options;
}

function npmCommand() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

/** `npm run <script>` を流し、出力をまとめて結果を返す。 */
function runNpmScript(script, env) {
  const startedAt = Date.now();
  return new Promise((resolve) => {
    const child = spawn(npmCommand(), ["run", "--silent", script], {
      env,
      shell: process.platform === "win32",
      stdio: ["ignore", "pipe", "pipe"],
    });
    const chunks = [];
    child.stdout.on("data", (chunk) => chunks.push(chunk));
    child.stderr.on("data", (chunk) => chunks.push(chunk));
    child.on("error", (error) => {
      chunks.push(Buffer.from(`${error.message}\n`));
    });
    child.on("close", (code, signal) => {
      resolve({
        script,
        status: code ?? (signal ? 1 : 0),
        seconds: (Date.now() - startedAt) / 1000,
        output: Buffer.concat(chunks).toString("utf8"),
      });
    });
  });
}

/** 静的な検査を最大 `concurrency` 本ずつ流し、終わった順に結果を集める。 */
export async function runStaticChecks(
  checks,
  { concurrency, run = runNpmScript, env = process.env, report = () => {} },
) {
  const results = [];
  let next = 0;
  async function worker() {
    while (next < checks.length) {
      const script = checks[next];
      next += 1;
      const result = await run(script, env);
      results.push(result);
      report(result);
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, checks.length) }, () => worker());
  await Promise.all(workers);
  return checks.map((script) => results.find((result) => result.script === script));
}

function formatSeconds(seconds) {
  return `${seconds.toFixed(1)}s`;
}

function reportResult(result) {
  const mark = result.status === 0 ? "ok" : "FAILED";
  process.stdout.write(`[check] ${mark} ${result.script} (${formatSeconds(result.seconds)})\n`);
  if (result.status !== 0 && result.output.trim()) {
    process.stdout.write(`${result.output.trimEnd()}\n`);
  }
}

export async function main(argv = process.argv.slice(2)) {
  let options;
  try {
    options = parseArguments(argv);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return 2;
  }
  if (options.help) {
    process.stdout.write(`${USAGE}\n`);
    return 0;
  }
  const startedAt = Date.now();
  const concurrency = Math.min(options.concurrency, Math.max(1, availableParallelism()));
  process.stdout.write(
    `[check] running ${STATIC_CHECKS.length} static checks (concurrency ${concurrency})\n`,
  );
  const results = await runStaticChecks(STATIC_CHECKS, { concurrency, report: reportResult });
  const failed = results.filter((result) => result.status !== 0).map((result) => result.script);
  process.stdout.write(
    `[check] static checks: ${results.length - failed.length} passed, ${failed.length} failed (${formatSeconds((Date.now() - startedAt) / 1000)})\n`,
  );
  if (failed.length > 0) {
    process.stderr.write(`[check] failed: ${failed.join(", ")}\n`);
    return 1;
  }
  if (!options.test) return 0;

  const env = { ...process.env };
  if (options.maxWorkers !== undefined) env.VITEST_MAX_WORKERS = String(options.maxWorkers);
  process.stdout.write(
    `[check] npm test${options.maxWorkers === undefined ? "" : ` (VITEST_MAX_WORKERS=${options.maxWorkers})`}\n`,
  );
  const testStartedAt = Date.now();
  const status = await new Promise((resolve) => {
    const child = spawn(npmCommand(), ["test"], {
      env,
      shell: process.platform === "win32",
      stdio: "inherit",
    });
    child.on("error", (error) => {
      process.stderr.write(`${error.message}\n`);
      resolve(1);
    });
    child.on("close", (code, signal) => resolve(code ?? (signal ? 1 : 0)));
  });
  process.stdout.write(
    `[check] npm test: ${status === 0 ? "ok" : "FAILED"} (${formatSeconds((Date.now() - testStartedAt) / 1000)})\n`,
  );
  return status;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  process.exitCode = await main();
}
