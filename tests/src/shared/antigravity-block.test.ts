import { chmodSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerAgentCommands } from "../../../src/commands/agent.js";
import { runInit } from "../../../src/commands/init.js";
import { registerOrchestratorCommands } from "../../../src/commands/orchestrator.js";
import { type ExecDefaultsConfig } from "../../../src/exec/agent-config.js";
import { resolveReporterAgentCandidates } from "../../../src/exec/run/agent.js";
import {
  autoSelectRegisterPipelineAgents,
  resolveRegisterPipelineCommand,
} from "../../../src/exec/run/register-core.js";
import {
  resolveAgentOverride,
  resolvePinnedRateLimitRunOptions,
  selectCandidates,
} from "../../../src/exec/run/shared.js";
import type { ReadyTaskView } from "../../../src/exec/types.js";
import { ANTIGRAVITY_BLOCKED_MESSAGE } from "../../../src/shared/antigravity-block.js";
import type { MemberRoster, ProjectMember } from "../../../src/shared/specdojo-config.js";

// The 0.9.1 init template launches agy through `specdojo agent launch`; a plain `agy` command
// also covers members that bypass that wrapper. Neither may be expanded into a runnable command.
const defaults: ExecDefaultsConfig = {
  providers: {
    antigravity: {
      command_template:
        "specdojo agent launch --provider antigravity --role {mode} -- --model {model}",
    },
    codex: { command_template: "codex exec --model {model}" },
  },
};

function member(overrides: Partial<ProjectMember>): ProjectMember {
  return {
    nickname: "agy-executor",
    display_name: "Agent",
    type: "agent",
    email: null,
    roles: [],
    provider: "antigravity",
    model: "gemini-fixture",
    capabilities: [],
    mode: "edit",
    stage_role: "executor",
    priority: 1,
    ...overrides,
  };
}

const roster: MemberRoster = {
  version: 1,
  members: [
    member({}),
    member({ nickname: "sol-executor", provider: "codex", model: "gpt-fixture", priority: 2 }),
    member({ nickname: "agy-reporter", stage_role: "reporter", mode: "report" }),
    member({
      nickname: "luna-reporter",
      provider: "codex",
      model: "gpt-fixture",
      stage_role: "reporter",
      mode: "report",
      priority: 2,
    }),
  ],
};

const blockedPattern =
  /do not launch Antigravity \(agy\)\..*Antigravity FAQ.*Section 6.*https:\/\/antigravity\.google\/docs\/faq.*https:\/\/antigravity\.google\/terms.*\.specdojo\/agent-members\.yaml/;

function fakeAgyOnPath(): { root: string; marker: string; restore: () => void } {
  const root = mkdtempSync(join(tmpdir(), "specdojo-agy-block-"));
  const bin = join(root, "bin");
  const marker = join(root, "agy-was-launched");
  mkdirSync(bin);
  const fakeAgy = join(bin, "agy");
  writeFileSync(fakeAgy, `#!/bin/sh\necho launched > ${JSON.stringify(marker)}\n`, "utf8");
  chmodSync(fakeAgy, 0o755);
  const originalPath = process.env.PATH;
  process.env.PATH = `${bin}${delimiter}${originalPath ?? ""}`;
  return {
    root,
    marker,
    restore: () => {
      process.env.PATH = originalPath;
      rmSync(root, { recursive: true, force: true });
    },
  };
}

async function runCli(register: (program: Command) => void, argv: string[]): Promise<string> {
  const errors: string[] = [];
  vi.spyOn(process.stderr, "write").mockImplementation((chunk) => {
    errors.push(String(chunk));
    return true;
  });
  const program = new Command().exitOverride();
  register(program);
  await program.parseAsync(["node", "specdojo", ...argv]);
  return errors.join("");
}

afterEach(() => {
  process.exitCode = undefined;
  vi.restoreAllMocks();
});

describe("Antigravity launch block", () => {
  it("names the reason, both sources, and the corrective action in the message", () => {
    expect(ANTIGRAVITY_BLOCKED_MESSAGE).toMatch(blockedPattern);
  });

  it("refuses a member selected by name before building its command", () => {
    const resolution = resolveAgentOverride(
      "edit",
      "agy-executor",
      {},
      roster,
      defaults,
      "executor",
    );

    expect(resolution).toMatchObject({ kind: "error" });
    expect(resolution.kind === "error" ? resolution.message : "").toMatch(blockedPattern);
    expect(() =>
      resolveRegisterPipelineCommand(
        roster,
        { executorBy: "agy-executor", reporterBy: "luna-reporter" },
        defaults,
      ),
    ).toThrow(blockedPattern);
  });

  it("skips agy members during automatic selection and moves on to another member", () => {
    const executors = selectCandidates(
      { capabilities: [], stage_role: "executor" },
      roster,
      "edit",
      undefined,
      defaults,
    );
    const selected = autoSelectRegisterPipelineAgents(roster, defaults);

    expect(executors.map((candidate) => candidate.nickname)).toEqual(["sol-executor"]);
    expect(selected.executor).toMatchObject({ actor: "sol-executor", provider: "codex" });
    expect(selected.reporterCandidates.map((candidate) => candidate.actor)).toEqual([
      "luna-reporter",
    ]);
    expect(JSON.stringify(selected)).not.toContain("antigravity --role");
  });

  it("never offers agy as an alternative candidate or a named fallback", () => {
    const task: ReadyTaskView = {
      id: "T-TEST-doc-010",
      mode: "edit",
      schedule_file: "",
      fifo_rank: 0,
      critical_first_rank: 0,
      agent_pipeline: {
        stages: [
          { stage_role: "executor", capabilities: [] },
          { stage_role: "reporter", capabilities: [] },
        ],
      },
    };
    const reporters = resolveReporterAgentCandidates(task, roster, defaults);

    expect(reporters.map((candidate) => candidate.actor)).toEqual(["luna-reporter"]);
    expect(() =>
      resolvePinnedRateLimitRunOptions(
        { onRateLimit: "fallback", fallbackExecutorBy: "agy-executor" },
        defaults,
        roster,
        "executor",
        { actor: "sol-executor", command: "codex exec --model gpt-fixture", provider: "codex" },
      ),
    ).toThrow(blockedPattern);
  });

  it("stops `agent launch --provider antigravity` without running agy", async () => {
    const agy = fakeAgyOnPath();
    try {
      const stderr = await runCli(registerAgentCommands, [
        "agent",
        "launch",
        "--provider",
        "antigravity",
        "--role",
        "edit",
        "--",
        "--model",
        "fixture",
      ]);

      expect(process.exitCode).toBe(1);
      expect(stderr).toMatch(blockedPattern);
      expect(existsSync(agy.marker)).toBe(false);
    } finally {
      agy.restore();
    }
  });

  it("stops `orchestrator launch --provider antigravity` without running agy", async () => {
    const agy = fakeAgyOnPath();
    try {
      const stderr = await runCli(registerOrchestratorCommands, [
        "orchestrator",
        "launch",
        "--provider",
        "antigravity",
        "--",
        "--model",
        "fixture",
      ]);

      expect(process.exitCode).toBe(1);
      expect(stderr).toMatch(/orchestrator launch: SpecDojo 0\.9\.2/);
      expect(stderr).toMatch(blockedPattern);
      expect(existsSync(agy.marker)).toBe(false);
    } finally {
      agy.restore();
    }
  });

  it("refuses `init --provider antigravity` before writing agy configuration", async () => {
    const repo = mkdtempSync(join(tmpdir(), "specdojo-init-agy-block-"));
    const originalCwd = process.cwd();
    vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    try {
      mkdirSync(join(repo, ".git"));
      process.chdir(repo);

      await expect(runInit({ yes: true, provider: "antigravity", exec: true })).rejects.toThrow(
        blockedPattern,
      );
      expect(existsSync(join(repo, ".specdojo"))).toBe(false);
    } finally {
      process.chdir(originalCwd);
      rmSync(repo, { recursive: true, force: true });
    }
  });
});
