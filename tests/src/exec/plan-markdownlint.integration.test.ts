import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerExecCommands } from "../../../src/exec/exec.js";
import { createPlanMarkdownlintFixture } from "../../helpers/plan-markdownlint.js";
import * as spawnSelf from "../../../src/shared/spawn-self.js";

const originalCwd = process.cwd();
const envKeys = ["SPECDOJO_PROJECT", "SPECDOJO_SCHEDULE_PATH", "SPECDOJO_EXECUTION_PATH"];
const originalEnv = envKeys.map((key) => process.env[key]);
const taskId = "T-TEST-doc-010";
const repos: string[] = [];

async function runExec(args: string[]): Promise<void> {
  for (const key of envKeys) delete process.env[key];
  process.exitCode = undefined;
  const program = new Command();
  program.exitOverride();
  registerExecCommands(program);
  await program.parseAsync(["node", "specdojo", "exec", ...args]);
}

function fixture(description: string, mode = "edit"): string {
  const repo = createPlanMarkdownlintFixture(description, mode);
  repos.push(repo);
  process.chdir(repo);
  return repo;
}

afterEach(() => {
  process.chdir(originalCwd);
  envKeys.forEach((key, index) => {
    if (originalEnv[index] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[index];
  });
  process.exitCode = undefined;
  vi.restoreAllMocks();
  for (const repo of repos.splice(0)) rmSync(repo, { recursive: true, force: true });
});

describe("scheduled plan Markdown validation", () => {
  it.each(["edit", "review"])(
    "rejects MD032 in a strategy's %s plan before replacing an existing plan",
    async (mode) => {
      const repo = fixture("Phase instructions.\n- First item", mode);
      const planPath = join(repo, "execution", "exec", "plans", `${taskId}-plan.md`);
      writeFileSync(planPath, "existing plan\n");
      const stdout = vi.spyOn(process.stdout, "write").mockImplementation(() => true);

      await runExec(["plan", "--project", "test", "--task", taskId]);

      expect(process.exitCode).toBe(1);
      expect(stdout.mock.calls.map(([text]) => String(text)).join("")).toMatch(
        /Task T-TEST-doc-010[\s\S]*T-TEST-doc-010-plan\.md: \d+[^\n]*MD032/,
      );
      expect(readFileSync(planPath, "utf8")).toBe("existing plan\n");
    },
  );

  it.each(["edit", "review"])("generates a %s plan with a correct description", async (mode) => {
    const repo = fixture("Phase instructions.\n\n- First item", mode);
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);

    await runExec(["plan", "--project", "test", "--task", taskId]);

    expect(process.exitCode).toBe(0);
    const plan = readFileSync(
      join(repo, "execution", "exec", "plans", `${taskId}-plan.md`),
      "utf8",
    );
    expect(plan).toContain("Phase instructions.\n\n- First item");
  });

  it.each([false, true])(
    "checks auto dry-run plans before claim or agent launch (valid: %s)",
    async (valid) => {
      const repo = fixture(`Phase instructions.\n${valid ? "\n" : ""}- First item`);
      vi.spyOn(process.stdout, "write").mockImplementation(() => true);
      const stderr = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
      await runExec(["refresh", "--project", "test"]);
      expect(process.exitCode).toBe(0);

      vi.spyOn(spawnSelf, "selfRunArgs").mockImplementation((args) => [
        process.execPath,
        [
          "--import",
          import.meta.resolve("tsx"),
          fileURLToPath(new URL("../../../src/specdojo.ts", import.meta.url)),
          ...args,
        ],
      ]);

      await runExec(["run", "--project", "test", "--auto", "--dry-run", "--edit-by", "test-agent"]);

      expect(process.exitCode ?? 0).toBe(valid ? 0 : 1);
      const errors = stderr.mock.calls.map(([text]) => String(text)).join("");
      if (!valid)
        expect(errors).toMatch(/Task T-TEST-doc-010[\s\S]*T-TEST-doc-010-plan\.md: \d+[^\n]*MD032/);
      const plans = join(repo, "execution", "exec", "plans");
      expect(existsSync(join(plans, `${taskId}-plan.md`))).toBe(valid);
      const events = join(repo, "execution", "exec", "events");
      expect(existsSync(events) ? readdirSync(events) : []).toEqual([]);
    },
  );
});
