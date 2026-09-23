import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AGENT_RUN_RATE_LIMIT_EXIT_CODE, registerAgentCommands } from "../../src/agent.js";

const originalCwd = process.cwd();
const projectEnvKeys = [
  "SPECDOJO_PROJECT",
  "SPECDOJO_SCHEDULE_PATH",
  "SPECDOJO_EXECUTION_PATH",
] as const;
const originalProjectEnv = Object.fromEntries(projectEnvKeys.map((key) => [key, process.env[key]]));

function restoreProjectEnv(): void {
  for (const key of projectEnvKeys) {
    const value = originalProjectEnv[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function writeFixture(repo: string, command: string): void {
  mkdirSync(join(repo, ".specdojo"), { recursive: true });
  mkdirSync(join(repo, "schedule"), { recursive: true });
  mkdirSync(join(repo, "execution"), { recursive: true });
  writeFileSync(
    join(repo, ".specdojo", "specdojo.config.json"),
    JSON.stringify(
      {
        version: 1,
        current_project: "test",
        projects: {
          test: {
            schedule_path: "schedule",
            execution_path: "execution",
            members_path: "pm-members.yaml",
          },
        },
      },
      null,
      2,
    ) + "\n",
    "utf8",
  );
  writeFileSync(
    join(repo, "pm-members.yaml"),
    [
      "version: 1",
      "project_id: test",
      "members:",
      "  - nickname: other-agent",
      "    display_name: Other Agent",
      "    email: null",
      "    roles: [DEV]",
      "    type: agent",
      '    command: "node -e \\"process.stdout.write(\'wrong agent\')\\""',
      "  - nickname: selected-agent",
      "    display_name: Selected Agent",
      "    email: null",
      "    roles: [DEV]",
      "    type: agent",
      `    command: ${JSON.stringify(command)}`,
      "",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(join(repo, "plan.md"), "evaluate this plan\n", "utf8");
}

async function withRepo(command: string, run: (repo: string) => Promise<void>): Promise<void> {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-agent-command-"));
  try {
    writeFixture(repo, command);
    process.chdir(repo);
    for (const key of projectEnvKeys) delete process.env[key];
    await run(repo);
  } finally {
    process.chdir(originalCwd);
    restoreProjectEnv();
    rmSync(repo, { recursive: true, force: true });
  }
}

async function runAgent(args: string[]): Promise<void> {
  process.exitCode = undefined;
  const program = new Command();
  program.exitOverride();
  registerAgentCommands(program);
  await program.parseAsync(["node", "specdojo", "agent", "run", ...args]);
}

afterEach(() => {
  process.chdir(originalCwd);
  restoreProjectEnv();
  process.exitCode = undefined;
  vi.restoreAllMocks();
});

describe("agent run", () => {
  it("passes the plan on stdin and saves the selected agent stdout", async () => {
    const command =
      "node -e \"const fs=require('node:fs');process.stdout.write('response:'+fs.readFileSync(0,'utf8'))\"";

    await withRepo(command, async (repo) => {
      await runAgent([
        "--plan",
        "plan.md",
        "--by",
        "selected-agent",
        "--out",
        "outputs/response.txt",
      ]);

      expect(readFileSync(join(repo, "outputs", "response.txt"), "utf8")).toBe(
        "response:evaluate this plan\n",
      );
      expect(process.exitCode).toBeUndefined();
    });
  });

  it("resolves an exact nickname and dry-run does not execute the command", async () => {
    const command = "node -e \"require('node:fs').writeFileSync('agent-ran.txt','yes')\"";
    const stdout: string[] = [];
    vi.spyOn(process.stdout, "write").mockImplementation((chunk: string | Uint8Array) => {
      stdout.push(String(chunk));
      return true;
    });

    await withRepo(command, async (repo) => {
      await runAgent(["--plan", "plan.md", "--by", "selected-agent", "--dry-run"]);

      expect(stdout.join("")).toBe(`${command}\n`);
      expect(existsSync(join(repo, "agent-ran.txt"))).toBe(false);
      expect(process.exitCode).toBeUndefined();
    });
  });

  it("saves stdout and returns the dedicated rate-limit exit code", async () => {
    const command = "node -e \"process.stdout.write('partial response');process.exit(29)\"";
    const stderr: string[] = [];
    vi.spyOn(process.stderr, "write").mockImplementation((chunk: string | Uint8Array) => {
      stderr.push(String(chunk));
      return true;
    });

    await withRepo(command, async (repo) => {
      writeFileSync(
        join(repo, ".specdojo", "exec-defaults.yaml"),
        "rate_limit_detection:\n  exit_codes: [29]\n",
        "utf8",
      );

      await runAgent([
        "--plan",
        "plan.md",
        "--by",
        "selected-agent",
        "--out",
        "outputs/partial.txt",
      ]);

      expect(readFileSync(join(repo, "outputs", "partial.txt"), "utf8")).toBe("partial response");
      expect(process.exitCode).toBe(AGENT_RUN_RATE_LIMIT_EXIT_CODE);
      expect(stderr.join("")).toContain("rate limit: selected-agent");
    });
  });
});
