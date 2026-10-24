import { describe, expect, it, vi } from "vitest";
import {
  buildExecutorPrompt,
  commitSubject,
  executorRequirements,
  extractBlockReason,
  isRateLimitError,
  parseExecRunBusyPolicy,
  pipelineRecoveryMeta,
  rebuildStaleGeneratedTracksForCycle,
  resolveRegisterWorktree,
  resolveAgentOverride,
  reporterRequirements,
  selectCandidates,
} from "../../../../src/exec/run/run.js";
import { mkdtempSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { ExecDefaultsConfig, RateLimitDetection } from "../../../../src/exec/agent-config.js";
import type { MemberRoster, ProjectMember } from "../../../../src/shared/specdojo-config.js";

describe("commitSubject", () => {
  const prefix = "exec(register PJR-AB12): ";

  it("100文字のsubjectを変更しない", () => {
    const title = "a".repeat(100 - prefix.length);

    expect(commitSubject(prefix, title)).toBe(`${prefix}${title}`);
  });

  it("101文字のsubjectを省略記号付き100文字へ切り詰める", () => {
    const title = "a".repeat(101 - prefix.length);
    const subject = commitSubject(prefix, title);

    expect(subject).toHaveLength(100);
    expect(subject).toBe(`${prefix}${"a".repeat(99 - prefix.length)}…`);
  });
});

describe("parseExecRunBusyPolicy", () => {
  it("既定を fail とし、skip / wait / fail だけを受け入れる", () => {
    expect(parseExecRunBusyPolicy(undefined)).toBe("fail");
    expect(parseExecRunBusyPolicy("skip")).toBe("skip");
    expect(parseExecRunBusyPolicy("wait")).toBe("wait");
    expect(parseExecRunBusyPolicy("fail")).toBe("fail");
    expect(() => parseExecRunBusyPolicy("retry")).toThrow(/--if-busy/);
  });
});

describe("resolveRegisterWorktree", () => {
  it("設定の既定を使い、CLI の明示指定を優先する", () => {
    expect(resolveRegisterWorktree({}, {})).toBe(false);
    expect(resolveRegisterWorktree({}, { run: { register_execution: "worktree" } })).toBe(true);
    expect(
      resolveRegisterWorktree({ inPlace: true }, { run: { register_execution: "worktree" } }),
    ).toBe(false);
    expect(
      resolveRegisterWorktree({ worktree: true }, { run: { register_execution: "in-place" } }),
    ).toBe(true);
  });

  it("--worktree と --in-place の同時指定を拒否する", () => {
    expect(() => resolveRegisterWorktree({ worktree: true, inPlace: true }, {})).toThrow(
      /either --worktree or --in-place/,
    );
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

  it("executor evidence で underscore 付き識別子をコード化するよう指示する", () => {
    const prompt = buildExecutorPrompt("# Plan\n");

    expect(prompt).toContain("identifiers or field names containing an");
    expect(prompt).toContain("`depends_on`");
  });

  it("result への記録を個票と handoff へ振り分ける", () => {
    const prompt = buildExecutorPrompt("# Plan\n");

    expect(prompt).toContain("report's optional `handoff` array");
    expect(prompt).toContain("write it in both places instead of editing the result");
    expect(prompt).toContain("Reports without this field remain valid");
    expect(prompt).toContain('"handoff":[]');
  });

  it("requires_human を sandbox 外で人が行う確認だけに限定する", () => {
    const prompt = buildExecutorPrompt("# Plan\n");

    expect(prompt).toContain("`requires_human`");
    expect(prompt).toContain("cannot run from the agent sandbox");
    expect(prompt).toContain("Do not use it for a check that could run but was skipped");
    expect(prompt).toContain('"status":"passed|failed|not_run|not_applicable|requires_human"');
  });

  it("not_applicable に理由を要求し、機械的な反証を伝える", () => {
    const prompt = buildExecutorPrompt("# Plan\n");

    expect(prompt).toContain("`not_applicable`");
    expect(prompt).toContain("non-empty `reason`");
    expect(prompt).toContain("rejects the claim when it can confirm the check applies");
    expect(prompt).toContain("`npm run validate:schema:file` requires a changed `*.yaml`");
    expect(prompt).toContain("markdownlint requires a changed `*.md` file");
    expect(prompt).toContain("judged by that repository's package.json");
    expect(prompt).toContain("sets `catalog_path`");
    expect(prompt).toContain("outside `docs/ja/projects/`, is a valid reason");
  });

  it("review executor に未実施の任意確認を validations へ記録しないよう伝える", () => {
    const prompt = buildExecutorPrompt(
      [
        "---",
        "specdojo:",
        "  task_id: T-REVIEW-010",
        "  mode: review",
        "---",
        "",
        "# Review Plan",
      ].join("\n"),
    );

    expect(prompt).toContain("For a review task, report only checks you actually ran");
    expect(prompt).toContain("Do not add optional");
    expect(prompt).toContain('under "確認できなかった範囲"');
    expect(prompt).toContain("reflect it in the verdict");
  });

  it("index build は runner が担うため executor は実行も記録もしないと伝える", () => {
    const prompt = buildExecutorPrompt("# Plan\n");

    expect(prompt).toContain("Do not run or report `specdojo index build`.");
    expect(prompt).toContain("the runner regenerates the index");
  });

  it("再開 executor に既存差分と全 target の構造化確認を要求する", () => {
    const prompt = buildExecutorPrompt("# Plan\n", [], {
      resumed: true,
      existingChanges: ["docs/a.md"],
      initialChangeTargets: ["docs/first-attempt.md"],
      resumeHandoff: ["parent validation test-unit failed: 1 test failed"],
    });

    expect(prompt).toContain("resumes an interrupted attempt");
    expect(prompt).toContain("`target_coverage`");
    expect(prompt).toContain("incomplete lower bound, not an upper bound");
    expect(prompt).toContain("`docs/first-attempt.md`");
    expect(prompt).toContain("`docs/a.md`");
    expect(prompt).toContain("parent validation test-unit failed: 1 test failed");
  });

  it("plan が targets を宣言した場合は初回変更集合より宣言を優先する", () => {
    const prompt = buildExecutorPrompt(
      [
        "---",
        "specdojo:",
        "  task_id: PJR-AB12",
        "  mode: edit",
        "  targets:",
        "    - test:declared-doc",
        "---",
        "",
        "# Plan",
      ].join("\n"),
      [],
      {
        resumed: true,
        initialChangeTargets: ["docs/first-attempt.md"],
      },
    );

    expect(prompt).toContain("Declared targets take");
    expect(prompt).not.toContain("incomplete lower bound, not an upper bound");
    expect(prompt).not.toContain("`docs/first-attempt.md`");
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
      "validate-schema",
      "test-unit",
      "test-integration",
    ]);

    expect(prompt).toContain("do not create or update the result file");
    expect(prompt).toContain("<specdojo_executor_evidence>");
    expect(prompt).toContain("Update the result file.");
    expect(prompt).toContain("npm run test:unit");
    expect(prompt).toContain("npm run validate:schema");
    expect(prompt).toContain("test-integration");
    expect(prompt).toContain("Do not run those commands inside the agent sandbox");
    expect(prompt).toContain("source=runner");
    expect(prompt).toContain("Do not run git commit or change");
    expect(prompt).toContain("user.name and user.email");
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

  it("resolves an alias to the concrete member and returns the concrete actor", () => {
    const aliased: MemberRoster = {
      ...members,
      aliases: [{ nickname: "legacy-edit", alias_of: "opencode-edit" }],
    };

    expect(resolveAgentOverride("edit", "legacy-edit", {}, aliased)).toEqual({
      kind: "command",
      command: "opencode run --agent edit",
      actor: "opencode-edit",
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
