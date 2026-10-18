import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";
import Ajv2020Module from "ajv/dist/2020.js";
import { describe, expect, it } from "vitest";
import type { ExecEvidence } from "../../../src/exec/evidence.js";
import {
  buildReporterPrompt,
  deriveReporterFacts,
  evidenceForReporter,
  mechanicallyNotApplicableReason,
  parseReporterOutput,
  reporterOutputSchemaForMode,
  runReporterWithFormatRetry,
} from "../../../src/exec/reporter.js";

const Ajv2020 = Ajv2020Module.default;

function evidence(): ExecEvidence {
  return {
    schema_version: 1,
    task_id: "T-TEST-doc-010",
    run_id: "run-1",
    stage: {
      role: "executor",
      actor: "executor",
      status: "succeeded",
      started_at: "2026-08-10T07:00:00.000Z",
      completed_at: "2026-08-10T07:01:00.000Z",
      exit_code: 0,
      attempts: 1,
    },
    changes: [{ path: "docs/test.md", status: "M" }],
    diff_summary: { files_changed: 1, summary: "docs/test.md | 2 ++" },
    validations: [{ command: "npm test", status: "passed", summary: "10 tests passed" }],
    final_message: "updated the document",
    log_refs: [
      {
        kind: "agent-output-excerpt",
        path: "execution/exec/evidence/T-TEST-doc-010/run-1/executor.log",
        bytes: 100,
        truncated: false,
      },
    ],
  };
}

const validEditOutput = {
  schema_version: 1,
  mode: "edit",
  summary: ["文書を更新した。"],
  changed_files: [{ path: "docs/test.md", summary: "内容を追加した。" }],
  handoff: [],
  approach: "plan と evidence を照合した。",
} as const;

const validReviewOutput = {
  schema_version: 1,
  mode: "review",
  grade_check: "評価結果は最新で、grade は pass だった。",
  rationale: ["完了条件と実行記録を照合した。"],
  improvements: [],
  approach: "done criteria と evidence を照合した。",
  verdict: "complete",
} as const;

describe("reporter structured output", () => {
  it("accepts the strict edit shape, unwraps code fences, and rejects additional properties", () => {
    expect(parseReporterOutput(JSON.stringify(validEditOutput), "edit").output).toEqual(
      validEditOutput,
    );
    expect(
      parseReporterOutput(JSON.stringify({ ...validEditOutput, commentary: "extra" }), "edit")
        .error,
    ).toMatch(/additional properties/);
    // agent は provider やモデルによってコードフェンスや前置きを付けるため、
    // 応答から JSON 本体を取り出したうえで検証する。schema 検証は緩めない。
    expect(
      parseReporterOutput(`\`\`\`json\n${JSON.stringify(validEditOutput)}\n\`\`\``, "edit").output,
    ).toEqual(validEditOutput);
    expect(parseReporterOutput("判定できませんでした", "edit").error).toMatch(/single JSON value/);
  });

  it("keeps the published JSON schema aligned with valid reporter output", () => {
    const schemaPath = join(
      dirname(fileURLToPath(import.meta.url)),
      "..",
      "..",
      "..",
      "docs",
      "specdojo",
      "schemas",
      "v1",
      "exec-reporter-output.schema.yaml",
    );
    const schema = load(readFileSync(schemaPath, "utf8")) as Record<string, unknown>;
    const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
    expect(validate(validEditOutput), JSON.stringify(validate.errors)).toBe(true);
    expect(validate(validReviewOutput), JSON.stringify(validate.errors)).toBe(true);
    expect(parseReporterOutput(JSON.stringify(validReviewOutput), "review").output).toEqual(
      validReviewOutput,
    );
  });

  it("supplies a simple mode-specific schema suitable for structured output", () => {
    const schema = reporterOutputSchemaForMode("edit");
    const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);

    expect(schema).not.toHaveProperty("oneOf");
    expect(validate(validEditOutput), JSON.stringify(validate.errors)).toBe(true);
    expect(validate(validReviewOutput)).toBe(false);
  });

  it("accepts every task-completion verdict and rejects per-viewpoint review output", () => {
    for (const verdict of [
      "complete",
      "complete-with-findings",
      "incomplete",
      "grade-stale",
      "grade-unavailable",
      "changed-during-review",
    ]) {
      const output = { ...validReviewOutput, verdict };
      expect(parseReporterOutput(JSON.stringify(output), "review").output, verdict).toEqual(output);
    }
    expect(
      parseReporterOutput(JSON.stringify({ ...validReviewOutput, verdict: "approve" }), "review")
        .error,
    ).toMatch(
      /verdict is invalid: removed verdict 'approve'; use complete or complete-with-findings/,
    );
    expect(
      parseReporterOutput(JSON.stringify({ ...validReviewOutput, verdict: "unknown" }), "review")
        .error,
    ).toMatch(/verdict is invalid: unknown verdict 'unknown'; allowed: complete,/);
    expect(
      parseReporterOutput(JSON.stringify({ ...validReviewOutput, rationale: [] }), "review").error,
    ).toMatch(/rationale/);
    // 改訂前の観点別出力（viewpoint_results / recommendation）は受け付けない。
    const legacyOutput = {
      schema_version: 1,
      mode: "review",
      viewpoint_results: [{ id: "RVP-001", result: "pass", evidence: ["x"], notes: "" }],
      findings: [],
      approach: "done criteria と evidence を照合した。",
      recommendation: "approve",
    };
    expect(parseReporterOutput(JSON.stringify(legacyOutput), "review").error).toBeDefined();
  });

  it("names the replacement verdict when a review output uses the legacy recommendation", () => {
    const { verdict: _verdict, ...withoutVerdict } = validReviewOutput;
    const legacy = { ...withoutVerdict, recommendation: "revise" };

    expect(parseReporterOutput(JSON.stringify(legacy), "review").error).toBe(
      "recommendation was replaced by verdict; removed verdict 'revise'; use incomplete " +
        "(allowed: complete, complete-with-findings, incomplete, grade-stale, grade-unavailable, changed-during-review)",
    );
  });

  it("keeps review judgement prose while reserving lifecycle facts for the runner", () => {
    const prompt = buildReporterPrompt({
      plan: "# Plan\n\nReview the task.",
      evidence: evidence(),
      mode: "review",
    });

    expect(prompt).toContain("did not re-grade the deliverable");
    expect(prompt).toContain("Record that judgement in verdict");
    expect(prompt).toContain('evidence.final_message identifies "確認できなかった範囲"');
    expect(prompt).toContain("runner owns frontmatter, outcome");
  });

  it("passes only plan, bounded evidence, and schema to the reporter", () => {
    const prompt = buildReporterPrompt({
      plan: "# Plan\n\nDo the work.",
      evidence: evidence(),
      mode: "edit",
    });

    expect(prompt).toContain("<specdojo_plan>");
    expect(prompt).toContain('"diff_summary"');
    expect(prompt).toContain("<specdojo_reporter_output_schema");
    expect(prompt).toContain('source="runner"');
    expect(prompt).toContain("the authoritative changed-file list");
    expect(prompt).toContain("identifier or field name");
    expect(prompt).toContain("`depends_on`");
    expect(prompt).not.toContain("raw_diff");
    expect(prompt).not.toContain("executor log body");
  });

  it("asks for path-keyed descriptions without requiring the evidence order or count", () => {
    const prompt = buildReporterPrompt({
      plan: "# Plan\n\nDo the work.",
      evidence: evidence(),
      mode: "edit",
    });
    const normalizedPrompt = prompt.replace(/\s+/gu, " ");

    expect(normalizedPrompt).toContain("exact path from its evidence.changes entry");
    expect(normalizedPrompt).toContain("order does not matter");
    expect(normalizedPrompt).toContain(
      "missing descriptions are filled with Git change metadata by the runner",
    );
    expect(normalizedPrompt).toContain("paths absent from evidence are discarded");
    expect(prompt).not.toContain('"outcome"');
    expect(prompt).not.toContain('"block_reason"');
  });

  it("rejects reporter attempts to supply machine-owned facts", () => {
    expect(
      parseReporterOutput(
        JSON.stringify({
          ...validEditOutput,
          outcome: "blocked",
          block_reason: "LLM judgement",
          changed_files: [{ path: "docs/test.md", summary: "内容を追加した。" }],
        }),
        "edit",
      ).error,
    ).toMatch(/additional properties/);
  });

  it("derives paths and a complete outcome from successful evidence", () => {
    expect(deriveReporterFacts(evidence())).toEqual({
      outcome: "complete",
      changed_files: [{ path: "docs/test.md", status: "M" }],
      block_reason: "",
    });
  });

  it("keeps deliverables and excludes resolved evidence, register, and result paths", () => {
    const input = evidence();
    input.changes = [
      { path: "docs/test.md", status: "M" },
      { path: "runtime/custom/exec/evidence/T-TEST/run-1/pipeline-state.json", status: "??" },
      { path: "runtime/custom/exec/evidence/T-TEST/run-1/evidence.json", status: "??" },
      { path: "runtime/custom/exec/evidence/T-TEST/run-1/executor.log", status: "??" },
      { path: "records/register/pjr-ab12-test.md", status: "M" },
      { path: "records/register/events/pjr-ab12-events.json", status: "M" },
      { path: "records/generated/pm-issue-log.md", status: "M" },
      { path: "runtime/custom/exec/results/pjr-ab12-result.md", status: "M" },
    ];
    input.attempt_changes = [...input.changes];
    input.diff_summary = { files_changed: input.changes.length, summary: "unfiltered" };

    const selected = evidenceForReporter(input, {
      repoRoot: "/repo",
      worktreePath: "/worktrees/task",
      executionPath: "/repo/runtime/custom",
      registerPaths: ["/repo/records/register", "/repo/records/generated"],
      resultPath: "/worktrees/task/runtime/custom/exec/results/pjr-ab12-result.md",
    });

    expect(selected.changes).toEqual([{ path: "docs/test.md", status: "M" }]);
    expect(selected.attempt_changes).toEqual([{ path: "docs/test.md", status: "M" }]);
    expect(selected.diff_summary).toEqual({ files_changed: 1, summary: "M docs/test.md" });
    expect(deriveReporterFacts(selected).changed_files).toEqual([
      { path: "docs/test.md", status: "M" },
    ]);
    expect(input.changes).toHaveLength(8);
  });

  it("supplies runner not-applicable judgements to the reporter and forbids contradictory handoff", () => {
    const input = evidence();
    input.validations = [
      {
        source: "executor",
        command: "npx specdojo catalog validate --project prj-0001",
        status: "not_run",
        summary: "適用条件を確認していない",
      },
    ];
    const selected = evidenceForReporter(input, {
      repoRoot: "/repo",
      worktreePath: "/worktrees/task",
      executionPath: "/repo/runtime/custom",
      factOptions: {
        packageDependencies: new Set(["specdojo"]),
        specdojoConfig: {
          version: 1,
          current_project: "prj-0001",
          projects: { "prj-0001": {} },
        },
      },
    });

    expect(selected.runner_context?.mechanically_not_applicable).toEqual([
      {
        command: "npx specdojo catalog validate --project prj-0001",
        reason: "project 'prj-0001' に catalog_path が設定されていない",
      },
    ]);
    const prompt = buildReporterPrompt({ plan: "# Plan", evidence: selected, mode: "edit" });
    expect(prompt).toContain('"mechanically_not_applicable"');
    expect(prompt).toContain("do not ask for\na command in mechanically_not_applicable to be run");
  });

  it("tells the reporter when the executor changed a filtered runner-managed record", () => {
    const input = evidence();
    const ticket = { path: "records/register/pjr-ab12-test.md", status: "M" };
    input.changes = [...input.changes, ticket];
    input.attempt_changes = [{ path: "docs/test.md", status: "M" }, ticket];
    const selected = evidenceForReporter(input, {
      repoRoot: "/repo",
      worktreePath: "/worktrees/task",
      executionPath: "/repo/runtime/custom",
      registerPaths: ["/repo/records/register"],
    });

    expect(selected.changes).toEqual([{ path: "docs/test.md", status: "M" }]);
    expect(selected.runner_context?.runner_managed_attempt_changes).toEqual([ticket]);
    const prompt = buildReporterPrompt({ plan: "# Plan", evidence: selected, mode: "edit" });
    expect(prompt).toContain('"runner_managed_attempt_changes"');
    expect(prompt).toContain("intentionally absent from changed_files");
    expect(prompt).toContain("do not request confirmation solely because");
  });

  it("blocks mechanically on runner validation failure even when prose is valid", () => {
    const input = evidence();
    input.validations.push({
      id: "test-unit",
      source: "runner",
      command: "npm run test:unit",
      status: "failed",
      summary: "exit 1",
    });
    expect(deriveReporterFacts(input)).toMatchObject({
      outcome: "blocked",
      block_reason: "parent validation failed: test-unit",
      changed_files: [{ path: "docs/test.md", status: "M" }],
    });
  });

  it("blocks mechanically on an executor-reported failed validation", () => {
    const input = evidence();
    input.validations = [
      { command: "npx markdownlint docs/test.md", status: "failed", summary: "1 error" },
    ];
    expect(deriveReporterFacts(input)).toMatchObject({
      outcome: "blocked",
      block_reason: "executor validation failed or not run: npx markdownlint docs/test.md",
    });
  });

  it("accepts an executor validation delegated as not_run when the runner passed the same command", () => {
    const input = evidence();
    input.validations = [
      {
        source: "executor",
        command: "npm run test:unit",
        status: "not_run",
        summary: "delegated to the parent runner",
      },
      {
        id: "test-unit",
        source: "runner",
        command: "npm run test:unit",
        status: "passed",
        summary: "exit 0",
      },
    ];
    expect(deriveReporterFacts(input)).toMatchObject({ outcome: "complete", block_reason: "" });
  });

  it("still blocks an edit-mode not_run validation that the runner did not run", () => {
    const input = evidence();
    input.validations = [
      { source: "executor", command: "npm run lint:md", status: "not_run", summary: "delegated" },
      {
        id: "test-unit",
        source: "runner",
        command: "npm run test:unit",
        status: "passed",
        summary: "exit 0",
      },
    ];
    expect(deriveReporterFacts(input, { mode: "edit" })).toMatchObject({
      outcome: "blocked",
      block_reason: "executor validation failed or not run: npm run lint:md",
    });
  });

  it.each(["not_run", "not_applicable"] as const)(
    "does not block review mode on an executor validation recorded as %s",
    (status) => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command: "specdojo grade list --dependency-changed",
          status,
          summary: "review で任意確認を実施しなかった",
          ...(status === "not_applicable" ? { reason: "review の判断には不要" } : {}),
        },
      ];

      expect(deriveReporterFacts(input, { mode: "review" })).toMatchObject({
        outcome: "complete",
        block_reason: "",
      });
    },
  );

  it("still blocks review mode on an executor-reported failed validation", () => {
    const input = evidence();
    input.validations = [
      {
        source: "executor",
        command: "specdojo grade list --dependency-changed",
        status: "failed",
        summary: "exit 1",
      },
    ];

    expect(deriveReporterFacts(input, { mode: "review" })).toMatchObject({
      outcome: "blocked",
      block_reason:
        "executor validation failed or not run: specdojo grade list --dependency-changed",
    });
  });

  it("completes when only a requires_human validation remains", () => {
    const input = evidence();
    input.validations = [
      {
        source: "executor",
        command: "real-agent-cli --version",
        status: "requires_human",
        summary: "実 agent CLI の起動は sandbox 外で人が確認する",
      },
    ];

    expect(deriveReporterFacts(input)).toMatchObject({ outcome: "complete", block_reason: "" });
  });

  it("does not block a reasoned not_applicable validation", () => {
    const input = evidence();
    input.validations = [
      {
        source: "executor",
        command: "npx prettier --write docs/test.md",
        status: "not_applicable",
        summary: "適用外",
        reason: "prettier が package.json の依存にない",
      },
    ];

    expect(
      deriveReporterFacts(input, {
        packageScripts: {},
        packageDependencies: new Set(),
      }),
    ).toMatchObject({ outcome: "complete", block_reason: "" });
  });

  it.each(["not_applicable", "not_run"] as const)(
    "accepts catalog validate as %s when the target project has no catalog_path",
    (status) => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command: "npx specdojo catalog validate --project prj-0001",
          status,
          summary: "catalog_path がないため適用外",
          ...(status === "not_applicable" ? { reason: "catalog_path が設定されていない" } : {}),
        },
      ];

      expect(
        deriveReporterFacts(input, {
          packageDependencies: new Set(["specdojo"]),
          specdojoConfig: {
            version: 1,
            current_project: "prj-0001",
            projects: { "prj-0001": {} },
          },
        }),
      ).toMatchObject({ outcome: "complete", block_reason: "" });
    },
  );

  it.each(["not_applicable", "not_run"] as const)(
    "blocks catalog validate reported as %s when the target project has catalog_path",
    (status) => {
      const input = evidence();
      input.changes = [{ path: "docs/ja/projects/prj-0001/design/test.md", status: "M" }];
      input.validations = [
        {
          source: "executor",
          command: "npx specdojo catalog validate --project prj-0001",
          status,
          summary: "適用外として報告",
          ...(status === "not_applicable" ? { reason: "catalog_path がない" } : {}),
        },
      ];

      expect(
        deriveReporterFacts(input, {
          packageDependencies: new Set(["specdojo"]),
          specdojoConfig: {
            version: 1,
            current_project: "prj-0001",
            projects: { "prj-0001": { catalog_path: "catalog" } },
          },
        }),
      ).toMatchObject({
        outcome: "blocked",
        block_reason:
          "executor validation failed or not run: npx specdojo catalog validate --project prj-0001",
      });
    },
  );

  describe("catalog validate judged by the change scope", () => {
    const catalogConfig = {
      version: 1 as const,
      current_project: "prj-0001",
      projects: { "prj-0001": { catalog_path: "catalog" } },
    };

    it.each(["not_applicable", "not_run"] as const)(
      "accepts catalog validate as %s when no change reaches docs/ja/projects/",
      (status) => {
        const input = evidence();
        input.changes = [
          { path: "src/exec/reporter.ts", status: "M" },
          { path: "docs/ja/specdojo/guides/exec-config-guide.md", status: "M" },
        ];
        input.validations = [
          {
            source: "executor",
            command: "npx specdojo catalog validate --project prj-0001",
            status,
            summary: "変更が docs/ja/projects/ 配下に及ばない",
            ...(status === "not_applicable"
              ? { reason: "変更が docs/ja/projects/ 配下に及ばない" }
              : {}),
          },
        ];

        expect(
          deriveReporterFacts(input, {
            packageDependencies: new Set(["specdojo"]),
            specdojoConfig: catalogConfig,
          }),
        ).toMatchObject({ outcome: "complete", block_reason: "" });
      },
    );

    it("blocks catalog validate as not_applicable when a renamed path reaches docs/ja/projects/", () => {
      const input = evidence();
      input.changes = [
        { path: "docs/old.md -> docs/ja/projects/prj-0001/design/new.md", status: "R" },
      ];
      input.validations = [
        {
          source: "executor",
          command: "npx specdojo catalog validate --project prj-0001",
          status: "not_applicable",
          summary: "適用外として報告",
          reason: "変更が docs/ja/projects/ 配下に及ばない",
        },
      ];

      expect(
        deriveReporterFacts(input, {
          packageDependencies: new Set(["specdojo"]),
          specdojoConfig: catalogConfig,
        }),
      ).toMatchObject({
        outcome: "blocked",
        block_reason:
          "executor validation failed or not run: npx specdojo catalog validate --project prj-0001",
      });
    });

    it("judges the change scope against the deliverable changes, not runner-managed records", () => {
      const input = evidence();
      input.changes = [
        { path: "src/exec/reporter.ts", status: "M" },
        {
          path: "docs/ja/projects/prj-0001/execution/exec/results/pjr-ab12-result.md",
          status: "M",
        },
      ];
      input.validations = [
        {
          source: "executor",
          command: "npx specdojo catalog validate",
          status: "not_run",
          summary: "適用条件を確認していない",
        },
      ];
      const selected = evidenceForReporter(input, {
        repoRoot: "/repo",
        worktreePath: "/repo",
        executionPath: "/repo/docs/ja/projects/prj-0001/execution",
        factOptions: {
          packageDependencies: new Set(["specdojo"]),
          specdojoConfig: {
            ...catalogConfig,
            projects: {
              "prj-0001": {
                base_path: "docs/ja/projects/prj-0001",
                catalog_path: "catalog",
              },
            },
          },
        },
      });

      expect(selected.runner_context?.mechanically_not_applicable).toEqual([
        {
          command: "npx specdojo catalog validate",
          reason: "変更が docs/ja/projects/ 配下に及ばない",
        },
      ]);
      expect(
        deriveReporterFacts(selected, {
          packageDependencies: new Set(["specdojo"]),
          specdojoConfig: catalogConfig,
        }),
      ).toMatchObject({ outcome: "complete", block_reason: "" });
    });
  });

  describe("index build owned by the runner", () => {
    it.each([
      ["specdojo index build", "not_run"],
      ["npx specdojo index build", "not_run"],
      ["node --import tsx src/specdojo.ts index build", "not_run"],
      ["npx tsx src/specdojo.ts index build", "not_run"],
      ["node dist/specdojo.js index build", "not_run"],
      ["npx specdojo index build", "not_applicable"],
    ] as const)("accepts %s reported as %s", (command, status) => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command,
          status,
          summary: ".specdojo/doc-index.json は agent が書き込めない",
          ...(status === "not_applicable" ? { reason: "runner が index を再生成する" } : {}),
        },
      ];

      expect(
        deriveReporterFacts(input, {
          packageDependencies: new Set(["specdojo"]),
          specdojoConfig: null,
        }),
      ).toMatchObject({ outcome: "complete", block_reason: "" });
    });

    it("still blocks an executor-reported failed index build", () => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command: "npx specdojo index build",
          status: "failed",
          summary: "EACCES",
        },
      ];

      expect(
        deriveReporterFacts(input, {
          packageDependencies: new Set(["specdojo"]),
          specdojoConfig: null,
        }),
      ).toMatchObject({
        outcome: "blocked",
        block_reason: "executor validation failed or not run: npx specdojo index build",
      });
    });

    it("does not accept the executor not_run when the runner failed to regenerate the index", () => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command: "npx specdojo index build",
          status: "not_run",
          summary: "runner へ委譲",
        },
        {
          source: "runner",
          command: "specdojo index build",
          status: "not_run",
          summary: "index の再生成を実行できなかった",
        },
      ];

      expect(
        deriveReporterFacts(input, {
          packageDependencies: new Set(["specdojo"]),
          specdojoConfig: null,
        }),
      ).toMatchObject({
        outcome: "blocked",
        block_reason: expect.stringMatching(/^parent validation failed: /u),
      });
    });

    it.each(["npx specdojo register build", "node --import tsx src/specdojo.ts exec refresh"])(
      "keeps blocking other SpecDojo commands reported as not_run: %s",
      (command) => {
        const input = evidence();
        input.validations = [
          { source: "executor", command, status: "not_run", summary: "実行していない" },
        ];

        expect(
          deriveReporterFacts(input, {
            packageDependencies: new Set(["specdojo"]),
            specdojoConfig: null,
          }),
        ).toMatchObject({
          outcome: "blocked",
          block_reason: `executor validation failed or not run: ${command}`,
        });
      },
    );
  });

  describe("not_applicable judged against the run's target project", () => {
    const multiProjectConfig = {
      version: 1 as const,
      current_project: "prj-0001",
      projects: {
        "prj-0001": { base_path: "docs/ja/projects/prj-0001", catalog_path: "catalog" },
        "prj-0002": { base_path: "docs/ja/projects/prj-0002" },
      },
    };

    it("accepts catalog validate without --project when the run's project has no catalog_path", () => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command: "npx specdojo catalog validate",
          status: "not_applicable",
          summary: "適用外",
          reason: "prj-0002 に catalog_path が設定されていない",
        },
      ];
      const selected = evidenceForReporter(input, {
        repoRoot: "/repo",
        worktreePath: "/worktrees/task",
        executionPath: "/repo/docs/ja/projects/prj-0002/execution",
        factOptions: {
          packageDependencies: new Set(["specdojo"]),
          specdojoConfig: multiProjectConfig,
        },
      });

      expect(selected.runner_scope).toEqual({ project_id: "prj-0002" });
      expect(
        deriveReporterFacts(selected, {
          packageDependencies: new Set(["specdojo"]),
          specdojoConfig: multiProjectConfig,
        }),
      ).toMatchObject({ outcome: "complete", block_reason: "" });
    });

    it("blocks catalog validate without --project when the run's project sets catalog_path", () => {
      const input = evidence();
      input.changes = [{ path: "docs/ja/projects/prj-0001/design/test.md", status: "M" }];
      input.validations = [
        {
          source: "executor",
          command: "npx specdojo catalog validate",
          status: "not_applicable",
          summary: "適用外",
          reason: "catalog_path がない",
        },
      ];

      expect(
        deriveReporterFacts(input, {
          projectId: "prj-0001",
          packageDependencies: new Set(["specdojo"]),
          specdojoConfig: { ...multiProjectConfig, current_project: "prj-0002" },
        }),
      ).toMatchObject({
        outcome: "blocked",
        block_reason: "executor validation failed or not run: npx specdojo catalog validate",
      });
    });

    it("does not resolve a project from an execution path matched by no project", () => {
      const selected = evidenceForReporter(evidence(), {
        repoRoot: "/repo",
        worktreePath: "/worktrees/task",
        executionPath: "/repo/elsewhere/execution",
        factOptions: { specdojoConfig: multiProjectConfig },
      });

      expect(selected.runner_scope).toBeUndefined();
    });
  });

  describe("not_applicable for product repository commands", () => {
    const productConfig = {
      version: 1 as const,
      current_project: "prj-0002",
      projects: {
        "prj-0002": { repos: [{ name: "specdojo-lp", path: "../specdojo-lp" }] },
      },
    };
    const projectManifest = {
      packageScripts: { build: "tsc -b" },
      packageDependencies: new Set(["prettier"]),
    };

    it.each([
      "npx prettier --write specdojo-lp:src/pages/index.astro",
      "npx --prefix specdojo-lp prettier --write src/pages/index.astro",
      "npm --prefix specdojo-lp run build",
      "npm --prefix ../specdojo-lp/ run build",
    ])("accepts %s when the product repository lacks the tool", (command) => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command,
          status: "not_applicable",
          summary: "適用外",
          reason: "specdojo-lp の package.json に該当がない",
        },
      ];

      expect(
        deriveReporterFacts(input, {
          ...projectManifest,
          projectId: "prj-0002",
          specdojoConfig: productConfig,
          productPackageManifests: {
            "specdojo-lp": { scripts: {}, dependencies: new Set() },
          },
        }),
      ).toMatchObject({ outcome: "complete", block_reason: "" });
    });

    it.each([
      "npx prettier --write specdojo-lp:src/pages/index.astro",
      "npm --prefix specdojo-lp run build",
    ])("blocks %s when the product repository provides the tool", (command) => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command,
          status: "not_applicable",
          summary: "適用外",
          reason: "未導入",
        },
      ];

      expect(
        deriveReporterFacts(input, {
          packageScripts: {},
          packageDependencies: new Set(),
          projectId: "prj-0002",
          specdojoConfig: productConfig,
          productPackageManifests: {
            "specdojo-lp": {
              scripts: { build: "astro build" },
              dependencies: new Set(["prettier"]),
            },
          },
        }),
      ).toMatchObject({
        outcome: "blocked",
        block_reason: `executor validation failed or not run: ${command}`,
      });
    });

    it("still blocks a project repository command whose tool the project repository provides", () => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command: "npx prettier --write docs/test.md",
          status: "not_applicable",
          summary: "適用外",
          reason: "prettier は未導入",
        },
      ];

      expect(
        deriveReporterFacts(input, {
          ...projectManifest,
          projectId: "prj-0002",
          specdojoConfig: productConfig,
          productPackageManifests: {
            "specdojo-lp": { scripts: {}, dependencies: new Set() },
          },
        }),
      ).toMatchObject({
        outcome: "blocked",
        block_reason: "executor validation failed or not run: npx prettier --write docs/test.md",
      });
    });

    it("names the product repository in the mechanical not_run reason", () => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command: "npm --prefix specdojo-lp run build",
          status: "not_run",
          summary: "未実行",
        },
      ];
      const selected = evidenceForReporter(input, {
        repoRoot: "/repo",
        worktreePath: "/worktrees/task",
        executionPath: "/repo/execution",
        projectId: "prj-0002",
        factOptions: {
          ...projectManifest,
          specdojoConfig: productConfig,
          productPackageManifests: {
            "specdojo-lp": { scripts: {}, dependencies: new Set() },
          },
        },
      });

      expect(selected.runner_context?.mechanically_not_applicable).toEqual([
        {
          command: "npm --prefix specdojo-lp run build",
          reason: "specdojo-lp の package.json に npm script 'build' がない",
        },
      ]);
    });
  });

  it("accepts not_run for an npx package that is not installed", () => {
    const input = evidence();
    input.validations = [
      {
        source: "executor",
        command: "npx prettier --write docs/test.md",
        status: "not_run",
        summary: "prettier は未導入",
      },
    ];

    expect(
      deriveReporterFacts(input, {
        packageDependencies: new Set(),
        specdojoConfig: null,
      }),
    ).toMatchObject({ outcome: "complete", block_reason: "" });
  });

  it("blocks not_run for an npx package that is installed", () => {
    const input = evidence();
    input.validations = [
      {
        source: "executor",
        command: "npx prettier --write docs/test.md",
        status: "not_run",
        summary: "未実行",
      },
    ];

    expect(
      deriveReporterFacts(input, {
        packageDependencies: new Set(["prettier"]),
        specdojoConfig: null,
      }),
    ).toMatchObject({
      outcome: "blocked",
      block_reason: "executor validation failed or not run: npx prettier --write docs/test.md",
    });
  });

  it.each([
    {
      command: "npm test",
      reason: "test script はない",
      packageScripts: { test: "vitest run" },
      packageDependencies: new Set<string>(),
    },
    {
      command: "npx prettier --write docs/test.md",
      reason: "prettier は未導入",
      packageScripts: {},
      packageDependencies: new Set(["prettier"]),
    },
    {
      command: "npx prettier --write docs/test.md",
      reason: "",
      packageScripts: {},
      packageDependencies: new Set<string>(),
    },
  ])("blocks an invalid not_applicable claim for $command", (validation) => {
    const input = evidence();
    input.validations = [
      {
        source: "executor",
        command: validation.command,
        status: "not_applicable",
        summary: "適用外",
        reason: validation.reason,
      },
    ];

    expect(
      deriveReporterFacts(input, {
        packageScripts: validation.packageScripts as Readonly<Record<string, string>>,
        packageDependencies: validation.packageDependencies,
      }),
    ).toMatchObject({
      outcome: "blocked",
      block_reason: `executor validation failed or not run: ${validation.command}`,
    });
  });

  describe("npm init placeholder test script", () => {
    it.each([
      'echo "Error: no test specified" && exit 1',
      "echo 'Error: no test specified' && exit 1",
      "echo Error: no test specified && exit 1",
      '  echo  "Error: no test specified"&&exit 1  ',
    ])("accepts npm test as not_applicable when the test script is %j", (body) => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command: "npm test",
          status: "not_applicable",
          summary: "適用外",
          reason: "test script は npm init の仮の script である",
        },
      ];

      expect(
        deriveReporterFacts(input, {
          packageScripts: { test: body },
          packageDependencies: new Set<string>(),
        }),
      ).toMatchObject({ outcome: "complete", block_reason: "" });
    });

    it("treats npm test as mechanically not applicable for the placeholder test script", () => {
      expect(
        mechanicallyNotApplicableReason("npm test", {
          packageScripts: { test: 'echo "Error: no test specified" && exit 1' },
          packageDependencies: new Set<string>(),
          specdojoConfig: null,
        }),
      ).toBe("package.json の npm script 'test' は npm init の仮の script である");
    });

    it.each([
      'echo "Error: no test specified" && exit 1 || vitest run',
      'echo "Running tests" && vitest run',
    ])("blocks npm test as not_applicable when the test script is real: %j", (body) => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command: "npm test",
          status: "not_applicable",
          summary: "適用外",
          reason: "test script は npm init の仮の script である",
        },
      ];

      expect(
        deriveReporterFacts(input, {
          packageScripts: { test: body },
          packageDependencies: new Set<string>(),
        }),
      ).toMatchObject({
        outcome: "blocked",
        block_reason: "executor validation failed or not run: npm test",
      });
    });

    it("keeps a placeholder body under another script name as present", () => {
      expect(
        mechanicallyNotApplicableReason("npm run lint", {
          packageScripts: { lint: 'echo "Error: no test specified" && exit 1' },
          packageDependencies: new Set<string>(),
          specdojoConfig: null,
        }),
      ).toBeUndefined();
    });
  });

  it.each(["npm run lint:md -- docs/test.md", "npm run lint:md docs/test.md"])(
    "blocks not_applicable for an existing script invoked with arguments: %s",
    (command) => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command,
          status: "not_applicable",
          summary: "適用外",
          reason: "lint:md script はない",
        },
      ];

      expect(
        deriveReporterFacts(input, {
          packageScripts: { "lint:md": "markdownlint docs" },
          packageDependencies: new Set(),
        }),
      ).toMatchObject({
        outcome: "blocked",
        block_reason: `executor validation failed or not run: ${command}`,
      });
    },
  );

  it("keeps argument-bearing npm commands distinct for delegated-validation matching", () => {
    const input = evidence();
    input.validations = [
      {
        source: "executor",
        command: "npm run test:unit -- tests/src/exec/reporter.test.ts",
        status: "not_run",
        summary: "runner に委譲",
      },
      {
        id: "test-unit",
        source: "runner",
        command: "npm run test:unit",
        status: "passed",
        summary: "exit 0",
      },
    ];

    expect(
      deriveReporterFacts(input, {
        packageScripts: { "test:unit": "vitest run --config vitest.unit.config.ts" },
      }),
    ).toMatchObject({
      outcome: "blocked",
      block_reason:
        "executor validation failed or not run: npm run test:unit -- tests/src/exec/reporter.test.ts",
    });
  });

  it.each([
    { command: "npm test", status: "failed" as const, summary: "1 failed" },
    { command: "npm run lint:md", status: "not_run" as const, summary: "not delegated" },
  ])("still blocks $status mixed with requires_human", (blockingValidation) => {
    const input = evidence();
    input.validations = [
      {
        source: "executor",
        command: "real-agent-cli --version",
        status: "requires_human",
        summary: "人が確認する",
      },
      { source: "executor", ...blockingValidation },
    ];

    expect(deriveReporterFacts(input)).toMatchObject({
      outcome: "blocked",
      block_reason: `executor validation failed or not run: ${blockingValidation.command}`,
    });
  });

  it("does not let a runner pass override an executor-reported failure of the same command", () => {
    const input = evidence();
    input.validations = [
      { source: "executor", command: "npm run test:unit", status: "failed", summary: "1 failed" },
      {
        id: "test-unit",
        source: "runner",
        command: "npm run test:unit",
        status: "passed",
        summary: "exit 0",
      },
    ];
    expect(deriveReporterFacts(input)).toMatchObject({
      outcome: "blocked",
      block_reason: "executor validation failed or not run: npm run test:unit",
    });
  });

  it("does not accept a delegated validation passed only in a product repository", () => {
    const input = evidence();
    input.validations = [
      { source: "executor", command: "npm run test:unit", status: "not_run", summary: "delegated" },
      {
        id: "test-unit",
        source: "runner",
        repo: "app",
        command: "npm run test:unit",
        status: "passed",
        summary: "exit 0",
      },
    ];
    expect(deriveReporterFacts(input).outcome).toBe("blocked");
  });

  describe("product repository validations delegated as not_run", () => {
    const productConfig = {
      version: 1 as const,
      current_project: "prj-0002",
      projects: {
        "prj-0002": {
          repos: [
            { name: "app1", path: "../app1" },
            { name: "app2", path: "../app2" },
          ],
        },
      },
    };
    const options = {
      projectId: "prj-0002",
      specdojoConfig: productConfig,
      productPackageManifests: {
        app1: {
          scripts: {
            check: "npm run typecheck && npm run test:unit",
            "test:unit": "vitest run",
          },
          dependencies: new Set<string>(),
        },
        app2: { scripts: { "test:unit": "vitest run" }, dependencies: new Set<string>() },
      },
    };

    it("accepts the same command passed by the runner in the targeted product repository", () => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command: "npm --prefix app1 run test:unit",
          status: "not_run",
          summary: "app1 の親検証へ委譲",
        },
        {
          id: "test-unit",
          source: "runner",
          repo: "app1",
          command: "npm run test:unit",
          status: "passed",
          summary: "exit 0",
        },
      ];

      expect(deriveReporterFacts(input, options)).toMatchObject({
        outcome: "complete",
        block_reason: "",
      });
    });

    it("expands a delegated composite script within the targeted product repository", () => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command: "npm --prefix app1 run check",
          status: "not_run",
          summary: "app1 の親検証へ委譲",
        },
        {
          id: "typecheck",
          source: "runner",
          repo: "app1",
          command: "npm run typecheck",
          status: "passed",
          summary: "exit 0",
        },
        {
          id: "test-unit",
          source: "runner",
          repo: "app1",
          command: "npm run test:unit",
          status: "passed",
          summary: "exit 0",
        },
      ];

      expect(deriveReporterFacts(input, options)).toMatchObject({
        outcome: "complete",
        block_reason: "",
      });
    });

    it("does not accept the same command passed in a different product repository", () => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command: "npm --prefix app1 run test:unit",
          status: "not_run",
          summary: "app1 の親検証へ委譲",
        },
        {
          id: "test-unit",
          source: "runner",
          repo: "app2",
          command: "npm run test:unit",
          status: "passed",
          summary: "exit 0",
        },
      ];

      expect(deriveReporterFacts(input, options)).toMatchObject({
        outcome: "blocked",
        block_reason: "executor validation failed or not run: npm --prefix app1 run test:unit",
      });
    });

    it("does not accept a failed parent validation in the targeted product repository", () => {
      const input = evidence();
      input.validations = [
        {
          source: "executor",
          command: "npm --prefix app1 run test:unit",
          status: "not_run",
          summary: "app1 の親検証へ委譲",
        },
        {
          id: "test-unit",
          source: "runner",
          repo: "app1",
          command: "npm run test:unit",
          status: "failed",
          summary: "1 failed",
        },
      ];

      expect(deriveReporterFacts(input, options)).toMatchObject({
        outcome: "blocked",
        block_reason: "parent validation failed: app1:test-unit",
      });
    });
  });

  describe("composite commands delegated as not_run", () => {
    const packageScripts = {
      check: "npm run typecheck && npm run lint:md && npm run validate:catalog && npm test",
      test: "vitest run",
      "test:unit": "vitest run --config vitest.unit.config.ts",
      "test:integration": "vitest run --config vitest.integration.config.ts",
    };
    const runner = (command: string, status: "passed" | "failed" = "passed") => ({
      id: command,
      source: "runner" as const,
      command,
      status,
      summary: status === "passed" ? "exit 0" : "exit 1",
    });

    it("accepts npm run check when every component passed in the runner or the executor", () => {
      const input = evidence();
      input.validations = [
        { source: "executor", command: "npm run check", status: "not_run", summary: "delegated" },
        {
          source: "executor",
          command: "npm run validate:catalog",
          status: "passed",
          summary: "ok",
        },
        runner("npm run typecheck"),
        runner("npm run lint:md"),
        runner("npm run test:unit"),
        runner("npm run test:integration"),
      ];
      expect(deriveReporterFacts(input, { packageScripts })).toMatchObject({
        outcome: "complete",
        block_reason: "",
      });
    });

    it("accepts a component that the executor ran as the script body", () => {
      const input = evidence();
      input.validations = [
        { source: "executor", command: "npm run check", status: "not_run", summary: "delegated" },
        {
          source: "executor",
          command: "node --import tsx src/specdojo.ts catalog validate",
          status: "passed",
          summary: "ok",
        },
        runner("npm run typecheck"),
        runner("npm run lint:md"),
        runner("npm run test:unit"),
        runner("npm run test:integration"),
      ];
      const facts = deriveReporterFacts(input, {
        packageScripts: {
          ...packageScripts,
          "validate:catalog": "tsx src/specdojo.ts catalog validate",
        },
      });
      expect(facts.outcome).toBe("complete");
    });

    it("accepts a nested composite component that the runner ran as a whole", () => {
      const input = evidence();
      input.validations = [
        { source: "executor", command: "npm run check", status: "not_run", summary: "delegated" },
        runner("npm run validate:schema"),
        runner("npm run typecheck"),
      ];
      const facts = deriveReporterFacts(input, {
        packageScripts: {
          check: "npm run typecheck && npm run validate:schema",
          "validate:schema": "npm run validate:schema:docs && npm run validate:schema:samples",
          "validate:schema:docs": "tsx tools/validate.ts docs",
          "validate:schema:samples": "tsx tools/validate.ts samples",
        },
      });
      expect(facts.outcome).toBe("complete");
    });

    it("accepts the script body run with only a --project option", () => {
      const input = evidence();
      input.validations = [
        { source: "executor", command: "npm run check", status: "not_run", summary: "delegated" },
        {
          source: "executor",
          command: "node --import tsx src/specdojo.ts catalog validate --project prj-0001",
          status: "passed",
          summary: "ok",
        },
        runner("npm run typecheck"),
        runner("npm run lint:md"),
        runner("npm run test:unit"),
        runner("npm run test:integration"),
      ];
      const facts = deriveReporterFacts(input, {
        packageScripts: {
          ...packageScripts,
          "validate:catalog": "tsx src/specdojo.ts catalog validate",
        },
      });
      expect(facts.outcome).toBe("complete");
    });

    it("does not accept the script body run with other options", () => {
      const input = evidence();
      input.validations = [
        { source: "executor", command: "npm run check", status: "not_run", summary: "delegated" },
        {
          source: "executor",
          command: "node --import tsx src/specdojo.ts catalog validate --only one.yaml",
          status: "passed",
          summary: "ok",
        },
        runner("npm run typecheck"),
        runner("npm run lint:md"),
        runner("npm run test:unit"),
        runner("npm run test:integration"),
      ];
      const facts = deriveReporterFacts(input, {
        packageScripts: {
          ...packageScripts,
          "validate:catalog": "tsx src/specdojo.ts catalog validate",
        },
      });
      expect(facts.outcome).toBe("blocked");
    });

    it("still blocks npm run check when a component was not run by anyone", () => {
      const input = evidence();
      input.validations = [
        { source: "executor", command: "npm run check", status: "not_run", summary: "delegated" },
        runner("npm run typecheck"),
        runner("npm run lint:md"),
        runner("npm run test:unit"),
        runner("npm run test:integration"),
      ];
      expect(deriveReporterFacts(input, { packageScripts })).toMatchObject({
        outcome: "blocked",
        block_reason: "executor validation failed or not run: npm run check",
      });
    });

    it("does not treat npm test as passed when only the unit tests passed", () => {
      const input = evidence();
      input.validations = [
        { source: "executor", command: "npm run check", status: "not_run", summary: "delegated" },
        {
          source: "executor",
          command: "npm run validate:catalog",
          status: "passed",
          summary: "ok",
        },
        runner("npm run typecheck"),
        runner("npm run lint:md"),
        runner("npm run test:unit"),
      ];
      expect(deriveReporterFacts(input, { packageScripts }).outcome).toBe("blocked");
    });

    it("does not expand a script that runs arbitrary shell commands", () => {
      const input = evidence();
      input.validations = [
        { source: "executor", command: "npm run verify", status: "not_run", summary: "delegated" },
        runner("npm run typecheck"),
      ];
      const facts = deriveReporterFacts(input, {
        packageScripts: { verify: "npm run typecheck && rm -rf tmp" },
      });
      expect(facts.outcome).toBe("blocked");
    });

    it("keeps an executor failure of npm run check blocking", () => {
      const input = evidence();
      input.validations = [
        { source: "executor", command: "npm run check", status: "failed", summary: "1 failed" },
        {
          source: "executor",
          command: "npm run validate:catalog",
          status: "passed",
          summary: "ok",
        },
        runner("npm run typecheck"),
        runner("npm run lint:md"),
        runner("npm run test:unit"),
        runner("npm run test:integration"),
      ];
      expect(deriveReporterFacts(input, { packageScripts }).outcome).toBe("blocked");
    });
  });

  it("uses the evidence block reason for a failed protected executor", () => {
    const input = evidence();
    input.stage.status = "failed";
    input.stage.exit_code = 1;
    input.block_reason = "agent-config-write: protected configuration changes detected";
    expect(deriveReporterFacts(input)).toMatchObject({
      outcome: "blocked",
      block_reason: "agent-config-write: protected configuration changes detected",
    });
  });

  it("retries only the reporter after a format error and reuses the same evidence", async () => {
    const prompts: string[] = [];
    const invoke = async (prompt: string) => {
      prompts.push(prompt);
      return {
        result: "success" as const,
        stdout: prompts.length === 1 ? "not-json" : JSON.stringify(validEditOutput),
        stderr: "",
      };
    };

    const outcome = await runReporterWithFormatRetry({
      plan: "# Plan",
      evidence: evidence(),
      mode: "edit",
      invoke,
    });

    expect(outcome.result).toBe("success");
    expect(prompts).toHaveLength(2);
    expect(prompts[1]).toContain("previous response failed validation");
    const evidenceBlocks = prompts.map(
      (prompt) =>
        prompt.match(
          /<specdojo_executor_evidence>\n([\s\S]*?)\n<\/specdojo_executor_evidence>/,
        )?.[1],
    );
    expect(evidenceBlocks[1]).toBe(evidenceBlocks[0]);
  });

  it("stops after the bounded reporter format attempts", async () => {
    let calls = 0;
    const outcome = await runReporterWithFormatRetry({
      plan: "# Plan",
      evidence: evidence(),
      mode: "edit",
      invoke: async () => {
        calls++;
        return { result: "success", stdout: "{}", stderr: "" };
      },
    });

    expect(outcome).toMatchObject({
      result: "failure",
      formatAttempts: 3,
      invocationOutputs: [
        { stdout: "{}", stderr: "" },
        { stdout: "{}", stderr: "" },
        { stdout: "{}", stderr: "" },
      ],
    });
    expect(calls).toBe(3);
  });

  it("returns the raw streams when the reporter process exits non-zero", async () => {
    const outcome = await runReporterWithFormatRetry({
      plan: "# Plan",
      evidence: evidence(),
      mode: "edit",
      invoke: async () => ({
        result: "failure",
        stdout: "diagnostic stdout",
        stderr: "SyntaxError: broken JSON",
      }),
    });

    expect(outcome).toEqual({
      result: "failure",
      reason: "SyntaxError: broken JSON",
      formatAttempts: 1,
      invocationOutputs: [{ stdout: "diagnostic stdout", stderr: "SyntaxError: broken JSON" }],
    });
  });
});
