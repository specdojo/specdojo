import path from "node:path";
import { pathToFileURL } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

type CheckResult = { script: string; status: number; seconds: number; output: string };
type RunScript = (script: string, env: NodeJS.ProcessEnv) => Promise<CheckResult>;
type Options = { test: boolean; maxWorkers?: number; concurrency: number; help?: boolean };
type ToolModule = {
  STATIC_CHECKS: string[];
  parseArguments: (argv: string[]) => Options;
  runStaticChecks: (
    checks: string[],
    options: { concurrency: number; run: RunScript; report?: (result: CheckResult) => void },
  ) => Promise<CheckResult[]>;
};

let tool: ToolModule;

beforeAll(async () => {
  const moduleUrl = pathToFileURL(path.resolve("tools/run-checks-parallel.mjs")).href;
  tool = (await import(moduleUrl)) as ToolModule;
});

describe("run-checks-parallel parseArguments", () => {
  it("runs only the static checks when no option is given", () => {
    expect(tool.parseArguments([])).toEqual({
      test: false,
      maxWorkers: undefined,
      concurrency: tool.STATIC_CHECKS.length,
    });
  });

  it("accepts --test with --max-workers", () => {
    expect(tool.parseArguments(["--test", "--max-workers", "4"])).toMatchObject({
      test: true,
      maxWorkers: 4,
    });
  });

  it("rejects --max-workers without --test", () => {
    expect(() => tool.parseArguments(["--max-workers", "4"])).toThrow(
      /--max-workers requires --test/,
    );
  });

  it("rejects a non-positive --concurrency", () => {
    expect(() => tool.parseArguments(["--concurrency", "0"])).toThrow(
      /--concurrency must be a positive integer: 0/,
    );
  });
});

describe("run-checks-parallel runStaticChecks", () => {
  it("lists the same static checks as npm run check before npm test", () => {
    expect(tool.STATIC_CHECKS).toEqual([
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
    ]);
  });

  it("never runs more checks at once than the concurrency", async () => {
    let running = 0;
    let peak = 0;
    const run: RunScript = async (script) => {
      running += 1;
      peak = Math.max(peak, running);
      await new Promise((resolve) => setTimeout(resolve, 5));
      running -= 1;
      return { script, status: 0, seconds: 0, output: "" };
    };

    await tool.runStaticChecks(["a", "b", "c", "d", "e"], { concurrency: 2, run });

    expect(peak).toBe(2);
  });

  it("returns every result in the declared order, including failures", async () => {
    const run: RunScript = async (script) => {
      await new Promise((resolve) => setTimeout(resolve, script === "a" ? 10 : 1));
      return { script, status: script === "b" ? 1 : 0, seconds: 0, output: "" };
    };

    const results = await tool.runStaticChecks(["a", "b", "c"], { concurrency: 3, run });

    expect(results.map((result) => [result.script, result.status])).toEqual([
      ["a", 0],
      ["b", 1],
      ["c", 0],
    ]);
  });
});
