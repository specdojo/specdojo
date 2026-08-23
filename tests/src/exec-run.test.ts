import { describe, expect, it, vi } from "vitest";
import {
  buildExecutorPrompt,
  executorRequirements,
  extractBlockReason,
  isRateLimitError,
  parseExecRunBusyPolicy,
  pipelineRecoveryMeta,
  rebuildStaleGeneratedTracksForCycle,
  resolveAgentOverride,
  reporterRequirements,
  selectCandidates,
} from "../../src/exec-run.js";
import { mkdtempSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { ExecDefaultsConfig, RateLimitDetection } from "../../src/exec-agent-config.js";
import type { MemberRoster, ProjectMember } from "../../src/specdojo-config.js";

describe("parseExecRunBusyPolicy", () => {
  it("既定を fail とし、skip / wait / fail だけを受け入れる", () => {
    expect(parseExecRunBusyPolicy(undefined)).toBe("fail");
    expect(parseExecRunBusyPolicy("skip")).toBe("skip");
    expect(parseExecRunBusyPolicy("wait")).toBe("wait");
    expect(parseExecRunBusyPolicy("fail")).toBe("fail");
    expect(() => parseExecRunBusyPolicy("retry")).toThrow(/--if-busy/);
  });
});

describe("rebuildStaleGeneratedTracksForCycle", () => {
  it("does not build or write output when every generated track is current", async () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-cycle-rebuild-"));
    const strategyPath = join(dir, "sch-strategy-launch.yaml");
    const trackPath = join(dir, "sch-track-launch.yaml");
    writeFileSync(strategyPath, "kind: strategy\ntrack: launch\n", "utf8");
    writeFileSync(trackPath, "kind: track\ntrack: launch\ntasks: []\n", "utf8");
    const oldTime = new Date("2026-01-01T00:00:00Z");
    const newTime = new Date("2026-01-02T00:00:00Z");
    utimesSync(strategyPath, oldTime, oldTime);
    utimesSync(trackPath, newTime, newTime);
    const buildTrack = vi.fn(() => true);
    const write = vi.fn();

    const result = await rebuildStaleGeneratedTracksForCycle(dir, "test", false, {
      buildTrack,
      write,
    });

    expect(result).toEqual({ status: "not-needed", tracks: [] });
    expect(buildTrack).not.toHaveBeenCalled();
    expect(write).not.toHaveBeenCalled();
  });

  it("builds stale tracks in order and reports success", async () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-cycle-rebuild-"));
    writeFileSync(join(dir, "sch-strategy-beta.yaml"), "kind: strategy\ntrack: beta\n", "utf8");
    writeFileSync(join(dir, "sch-strategy-alpha.yaml"), "kind: strategy\ntrack: alpha\n", "utf8");
    const buildTrack = vi.fn(() => true);

    const result = await rebuildStaleGeneratedTracksForCycle(dir, "test", false, {
      buildTrack,
      write: () => undefined,
    });

    expect(result).toEqual({ status: "success", tracks: ["alpha", "beta"] });
    expect(buildTrack.mock.calls).toEqual([["alpha"], ["beta"]]);
  });

  it("stops at the failed build so later stale tracks cannot reach auto execution", async () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-cycle-rebuild-"));
    writeFileSync(join(dir, "sch-strategy-alpha.yaml"), "kind: strategy\ntrack: alpha\n", "utf8");
    writeFileSync(join(dir, "sch-strategy-beta.yaml"), "kind: strategy\ntrack: beta\n", "utf8");
    const buildTrack = vi.fn((track: string) => track !== "alpha");
    const output: string[] = [];

    const result = await rebuildStaleGeneratedTracksForCycle(dir, "test", false, {
      buildTrack,
      write: (message) => output.push(message),
    });

    expect(result).toEqual({ status: "failure", tracks: ["alpha"] });
    expect(buildTrack.mock.calls).toEqual([["alpha"]]);
    expect(output.join("")).toContain("schedule build failed for track alpha");
  });
});

function agent(overrides: Partial<ProjectMember> & { nickname: string }): ProjectMember {
  return {
    display_name: overrides.nickname,
    email: null,
    roles: [],
    type: "agent",
    capabilities: ["web_search"],
    command: `run --agent ${overrides.nickname}`,
    mode: "edit",
    ...overrides,
  };
}

function roster(members: ProjectMember[]): MemberRoster {
  return { version: 1, project_id: "test", members };
}

describe("extractBlockReason", () => {
  it("prefers the tagged `blocked:` line from edit agents", () => {
    const stderr = [
      "some warning from the toolchain",
      "blocked: depends_on dct-foo unresolved; need=resolve dependency; ref=docs/foo.md",
    ].join("\n");

    const actual = extractBlockReason(stderr);

    expect(actual).toBe(
      "agent exited with non-zero code: blocked: depends_on dct-foo unresolved; need=resolve dependency; ref=docs/foo.md",
    );
  });

  it("prefers the tagged `review-blocked:` line from review agents", () => {
    const stderr = "review-blocked: target file missing; criterion=RVP-001; ref=docs/bar.md\n";

    const actual = extractBlockReason(stderr);

    expect(actual).toBe(
      "agent exited with non-zero code: review-blocked: target file missing; criterion=RVP-001; ref=docs/bar.md",
    );
  });

  it("falls back to the last non-empty line when no tagged line is present", () => {
    const stderr = "line one\nfatal: something went wrong\n\n";

    const actual = extractBlockReason(stderr);

    expect(actual).toBe("agent exited with non-zero code: fatal: something went wrong");
  });

  it("returns the generic message when stderr is empty", () => {
    expect(extractBlockReason("")).toBe("agent exited with non-zero code");
    expect(extractBlockReason("   \n  \n")).toBe("agent exited with non-zero code");
  });

  it("truncates an overly long reason to keep the block event log readable", () => {
    const longReason = `blocked: ${"x".repeat(600)}`;
    const actual = extractBlockReason(longReason);

    expect(actual.startsWith("agent exited with non-zero code: blocked: ")).toBe(true);
    expect(actual.endsWith("…")).toBe(true);
    // prefix + first 500 chars of the reason + ellipsis
    expect(actual.length).toBe("agent exited with non-zero code: ".length + 500 + 1);
  });
});

describe("pipelineRecoveryMeta", () => {
  it("records reporter recovery position and run-scoped artifact references", () => {
    expect(
      pipelineRecoveryMeta({
        stage: "reporter",
        evidenceRef: "execution/exec/evidence/task/run/evidence.json",
        stateRef: "execution/exec/evidence/task/run/pipeline-state.json",
        runId: "run-1",
      }),
    ).toEqual({
      pipeline_stage: "reporter",
      evidence_ref: "execution/exec/evidence/task/run/evidence.json",
      pipeline_state_ref: "execution/exec/evidence/task/run/pipeline-state.json",
      pipeline_run_id: "run-1",
    });
  });
});

describe("selectCandidates", () => {
  const requirements = { capabilities: ["web_search"] };

  it("orders candidates by priority ascending, then fewest extra capabilities", () => {
    const members = roster([
      agent({ nickname: "high", priority: 2 }),
      agent({ nickname: "low", priority: 1 }),
      agent({ nickname: "low-extra", priority: 1, capabilities: ["web_search", "extra"] }),
    ]);

    const actual = selectCandidates(requirements, members, "edit").map((m) => m.nickname);

    expect(actual).toEqual(["low", "low-extra", "high"]);
  });

  it("sorts busy agents last so parallel runs spread across agents", () => {
    const members = roster([
      agent({ nickname: "top", priority: 1 }),
      agent({ nickname: "next", priority: 2 }),
    ]);

    const actual = selectCandidates(requirements, members, "edit", new Set(["top"])).map(
      (m) => m.nickname,
    );

    // `top` has the best priority but is busy, so it drops behind the idle `next`.
    expect(actual).toEqual(["next", "top"]);
  });

  it("keeps priority order among busy agents when all candidates are busy", () => {
    const members = roster([
      agent({ nickname: "high", priority: 2 }),
      agent({ nickname: "low", priority: 1 }),
    ]);

    const actual = selectCandidates(requirements, members, "edit", new Set(["high", "low"])).map(
      (m) => m.nickname,
    );

    expect(actual).toEqual(["low", "high"]);
  });

  it("excludes agents marked disabled so a single provider can be isolated for testing", () => {
    const members = roster([
      agent({ nickname: "codex", priority: 1 }),
      agent({ nickname: "claude", priority: 2, disabled: true }),
      agent({ nickname: "opencode", priority: 3, disabled: false }),
    ]);

    const actual = selectCandidates(requirements, members, "edit").map((m) => m.nickname);

    expect(actual).toEqual(["codex", "opencode"]);
  });

  it("selects a member without a command when its provider declares a command_template", () => {
    const execDefaults: ExecDefaultsConfig = {
      providers: { claude: { command_template: "claude -p --agent {nickname}" } },
    };
    const members = roster([
      agent({ nickname: "templated", provider: "claude", command: undefined, priority: 1 }),
      agent({ nickname: "no-source", provider: "custom", command: undefined, priority: 2 }),
    ]);

    const actual = selectCandidates(requirements, members, "edit", undefined, execDefaults).map(
      (m) => m.nickname,
    );

    // `no-source` has neither a command override nor a provider template, so it is not runnable.
    expect(actual).toEqual(["templated"]);
  });

  it("keeps pipeline-stage agents out of legacy single-agent selection", () => {
    const members = roster([
      agent({ nickname: "legacy", priority: 3 }),
      agent({ nickname: "executor", priority: 1, stage_role: "executor" }),
      agent({ nickname: "reporter", priority: 2, stage_role: "reporter" }),
    ]);

    const actual = selectCandidates(requirements, members, "edit").map((m) => m.nickname);

    expect(actual).toEqual(["legacy"]);
  });

  it("selects only agents matching the requested pipeline stage", () => {
    const members = roster([
      agent({ nickname: "legacy", priority: 1 }),
      agent({ nickname: "executor", priority: 3, stage_role: "executor" }),
      agent({ nickname: "reporter", priority: 2, stage_role: "reporter" }),
    ]);

    const executorCandidates = selectCandidates(
      { ...requirements, stage_role: "executor" },
      members,
      "edit",
    ).map((m) => m.nickname);
    const reporterCandidates = selectCandidates(
      { ...requirements, stage_role: "reporter" },
      members,
      "edit",
    ).map((m) => m.nickname);

    expect(executorCandidates).toEqual(["executor"]);
    expect(reporterCandidates).toEqual(["reporter"]);
  });

  it("uses stage_role for report-profile eligibility without mixing task modes", () => {
    const members = roster([
      agent({ nickname: "edit-executor", stage_role: "executor", mode: "edit" }),
      agent({ nickname: "review-executor", stage_role: "executor", mode: "review" }),
      agent({ nickname: "reporter", stage_role: "reporter", mode: "report" }),
    ]);

    const editCandidates = selectCandidates(
      { ...requirements, stage_role: "executor" },
      members,
      "edit",
    ).map((m) => m.nickname);
    const reviewCandidates = selectCandidates(
      { ...requirements, stage_role: "executor" },
      members,
      "review",
    ).map((m) => m.nickname);
    const reporterCandidates = selectCandidates(
      { ...requirements, stage_role: "reporter" },
      members,
      undefined,
    ).map((m) => m.nickname);

    expect(editCandidates).toEqual(["edit-executor"]);
    expect(reviewCandidates).toEqual(["review-executor"]);
    expect(reporterCandidates).toEqual(["reporter"]);
  });

  it("keeps the configured executor and reporter names out of legacy selection", () => {
    const members = roster([
      agent({ nickname: "opencode-edit-agent", priority: 3 }),
      agent({
        nickname: "opencode-executor",
        priority: 1,
        stage_role: "executor",
        proficiency: "normal",
      }),
      agent({
        nickname: "opencode-reporter",
        priority: 1,
        stage_role: "reporter",
        proficiency: "normal",
        capabilities: [],
      }),
      agent({
        nickname: "codex-expert-executor",
        priority: 1,
        stage_role: "executor",
        proficiency: "expert",
      }),
    ]);

    const legacyCandidates = selectCandidates(requirements, members, "edit").map(
      (member) => member.nickname,
    );
    const normalExecutorCandidates = selectCandidates(
      { ...requirements, proficiency: "normal", stage_role: "executor" },
      members,
      "edit",
    ).map((member) => member.nickname);
    const expertExecutorCandidates = selectCandidates(
      { ...requirements, proficiency: "expert", stage_role: "executor" },
      members,
      "edit",
    ).map((member) => member.nickname);
    const reporterCandidates = selectCandidates(
      { capabilities: [], proficiency: "normal", stage_role: "reporter" },
      members,
      "edit",
    ).map((member) => member.nickname);

    expect(legacyCandidates).toEqual(["opencode-edit-agent"]);
    expect(normalExecutorCandidates).toEqual(["opencode-executor"]);
    expect(expertExecutorCandidates).toEqual(["codex-expert-executor"]);
    expect(reporterCandidates).toEqual(["opencode-reporter"]);
  });
});

describe("pipeline executor preparation", () => {
  it("uses stage requirements instead of phase-wide agent requirements", () => {
    expect(
      executorRequirements({
        id: "T-TEST-doc-010",
        schedule_file: "sch-track-test.yaml",
        fifo_rank: 1,
        critical_first_rank: 1,
        capabilities: ["phase-capability"],
        proficiency: "normal",
        agent_pipeline: {
          stages: [
            { stage_role: "executor", capabilities: ["exec"], proficiency: "expert" },
            { stage_role: "reporter", proficiency: "normal" },
          ],
        },
      }),
    ).toEqual({ capabilities: ["exec"], proficiency: "expert", stage_role: "executor" });
  });

  it("resolves reporter requirements independently from executor requirements", () => {
    expect(
      reporterRequirements({
        id: "T-TEST-doc-010",
        schedule_file: "sch-track-test.yaml",
        fifo_rank: 1,
        critical_first_rank: 1,
        agent_pipeline: {
          stages: [
            { stage_role: "executor", capabilities: ["exec"], proficiency: "expert" },
            { stage_role: "reporter", capabilities: ["summary"], proficiency: "normal" },
          ],
        },
      }),
    ).toEqual({ capabilities: ["summary"], proficiency: "normal", stage_role: "reporter" });
  });

  it("separates result writing from the executor prompt and requests structured evidence", () => {
    const prompt = buildExecutorPrompt("# Edit Plan\n\nUpdate the result file.", [
      "test-integration",
    ]);

    expect(prompt).toContain("do not create or update the result file");
    expect(prompt).toContain("<specdojo_executor_evidence>");
    expect(prompt).toContain("Update the result file.");
    expect(prompt).toContain("npm run test:unit");
    expect(prompt).toContain("test-integration");
    expect(prompt).toContain("source=runner");
  });

  it("rejects an explicit legacy agent override for an executor stage", () => {
    const members = roster([agent({ nickname: "legacy" })]);

    expect(resolveAgentOverride("edit", "legacy", {}, members, {}, "executor")).toEqual({
      kind: "error",
      message: "--by agent must have stage_role: executor for this pipeline stage: legacy",
    });
  });
});

describe("isRateLimitError", () => {
  const detection: RateLimitDetection = {
    exit_codes: [],
    stderr_patterns: ["rate limit", "429"],
  };

  it("does not flag a successful run that merely echoes the pattern in its output", () => {
    // The pm-members editing task printed file content containing "rate limit" but exited 0.
    const actual = isRateLimitError(0, "updated comment: rate limit fallback\n", detection);

    expect(actual).toBe(false);
  });

  it("flags a stderr pattern when the process exited non-zero", () => {
    const actual = isRateLimitError(1, "error: rate limit reached\n", detection);

    expect(actual).toBe(true);
  });

  it("treats a null exit (crash) as non-success so patterns still apply", () => {
    const actual = isRateLimitError(null, "429 too many requests\n", detection);

    expect(actual).toBe(true);
  });

  it("flags a session-limit notice that the CLI printed to stdout, not stderr", () => {
    // claude emits "You've hit your session limit" on stdout while exiting non-zero; the caller
    // passes the combined stdout+stderr so the pattern still matches.
    const claude: RateLimitDetection = { exit_codes: [], stderr_patterns: ["session limit"] };

    const actual = isRateLimitError(
      1,
      "You've hit your session limit · resets 5:50pm (UTC)\n",
      claude,
    );

    expect(actual).toBe(true);
  });

  it("matches stderr regardless of exit code when the gate is disabled", () => {
    const ungated: RateLimitDetection = { ...detection, stderr_requires_nonzero_exit: false };

    const actual = isRateLimitError(0, "rate limit\n", ungated);

    expect(actual).toBe(true);
  });

  it("flags a configured exit code on its own even on a successful-looking stream", () => {
    const byCode: RateLimitDetection = { exit_codes: [42], stderr_patterns: [] };

    expect(isRateLimitError(42, "no pattern here\n", byCode)).toBe(true);
  });

  it("returns false when there is no detection config", () => {
    expect(isRateLimitError(1, "rate limit\n", undefined)).toBe(false);
  });
});

describe("resolveAgentOverride", () => {
  const members = roster([
    agent({ nickname: "opencode-edit", command: "opencode run --agent edit", mode: "edit" }),
    agent({ nickname: "opencode-review", command: "opencode run --agent review", mode: "review" }),
  ]);

  it("resolves the edit nickname to its pm-members command for edit-mode tasks", () => {
    const actual = resolveAgentOverride(
      "edit",
      undefined,
      { edit: "opencode-edit", review: "opencode-review" },
      members,
    );

    expect(actual).toEqual({
      kind: "command",
      command: "opencode run --agent edit",
      actor: "opencode-edit",
    });
  });

  it("resolves the review nickname to its pm-members command for review-mode tasks", () => {
    const actual = resolveAgentOverride(
      "review",
      undefined,
      { edit: "opencode-edit", review: "opencode-review" },
      members,
    );

    expect(actual).toEqual({
      kind: "command",
      command: "opencode run --agent review",
      actor: "opencode-review",
    });
  });

  it("returns none when the mode has no override", () => {
    const actual = resolveAgentOverride("review", undefined, { edit: "opencode-edit" }, members);

    expect(actual).toEqual({ kind: "none" });
  });

  it("returns an error when the nickname is not in pm-members", () => {
    const actual = resolveAgentOverride("edit", undefined, { edit: "ghost-agent" }, members);

    expect(actual.kind).toBe("error");
    if (actual.kind === "error") {
      expect(actual.message).toContain("--edit-by");
      expect(actual.message).toContain("ghost-agent");
    }
  });

  it("lets a single explicit override win over the mode-specific override", () => {
    const actual = resolveAgentOverride(
      "edit",
      "opencode-review",
      { edit: "opencode-edit", review: "opencode-review" },
      members,
    );

    expect(actual).toEqual({
      kind: "command",
      command: "opencode run --agent review",
      actor: "opencode-review",
    });
  });

  it("returns an error when an explicit --by nickname is unknown", () => {
    const actual = resolveAgentOverride("edit", "ghost-agent", {}, members);

    expect(actual.kind).toBe("error");
    if (actual.kind === "error") {
      expect(actual.message).toContain("--by");
      expect(actual.message).toContain("ghost-agent");
    }
  });

  it("resolves a mode override nickname through the provider command template", () => {
    const execDefaults: ExecDefaultsConfig = {
      providers: {
        claude: {
          command_template: "claude -p --agent {nickname} --settings settings.{mode}.json",
        },
      },
    };
    const templated = roster([
      agent({ nickname: "claude-edit-agent", provider: "claude", command: undefined }),
    ]);

    const actual = resolveAgentOverride(
      "edit",
      undefined,
      { edit: "claude-edit-agent" },
      templated,
      execDefaults,
    );

    expect(actual).toEqual({
      kind: "command",
      command: "claude -p --agent claude-edit-agent --settings settings.edit.json",
      actor: "claude-edit-agent",
      provider: "claude",
    });
  });

  it("returns an error when the provider template cannot be expanded for the member", () => {
    const execDefaults: ExecDefaultsConfig = {
      providers: { codex: { command_template: "codex exec --model {model}" } },
    };
    const templated = roster([
      agent({ nickname: "codex-edit-agent", provider: "codex", command: undefined }),
    ]);

    const actual = resolveAgentOverride(
      "edit",
      undefined,
      { edit: "codex-edit-agent" },
      templated,
      execDefaults,
    );

    expect(actual.kind).toBe("error");
    if (actual.kind === "error") {
      expect(actual.message).toContain("{model}");
      expect(actual.message).toContain("codex-edit-agent");
    }
  });
});
