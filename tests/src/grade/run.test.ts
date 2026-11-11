import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { dump } from "js-yaml";
import { Command } from "commander";
import { registerGradeCommand } from "../../../src/grade/grade.js";
import {
  type runAgentPlan,
  resolveGradingPlanActor as resolveGradeRunActor,
} from "../../../src/exec/agent-plan.js";
import { runGrade, type GradeRunOptions } from "../../../src/grade/run.js";
import { discoverGradeTargets } from "../../../src/grade/target-discovery.js";
import { loadViewpoints, resolveSafeMarkdownPath } from "../../../src/grade/targets.js";
import {
  readGradePipelineState,
  recordGradePipelineStage,
} from "../../../src/grade/pipeline-state.js";
import { gradeContentHash, readGradeResultForDocument } from "../../../src/grade/result.js";
import { renderGradePlan } from "../../../src/grade/plan.js";
import { validateGradeResultForDocument } from "../../../src/grade/markdown.js";
import { ensureReviewGrade, reviewGradeFreshness } from "../../../src/review/grade.js";
import {
  GRADE_RUN_DOCUMENT,
  GRADE_RUN_MARKERS,
  writeGradeRunFixture,
} from "../../helpers/grade-run-fixture.js";

const executePlan = vi.fn<typeof runAgentPlan>();
const grade = (options: GradeRunOptions) =>
  runGrade(options, { executePlan, resolveActor: resolveGradeRunActor });

const originalCwd = process.cwd();
let root: string;
const options: GradeRunOptions = {
  target: "kata",
  project: "test",
  paths: [GRADE_RUN_DOCUMENT],
  runId: "native-test",
};

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "specdojo-grade-run-"));
  writeGradeRunFixture(root);
  process.chdir(root);
  executePlan.mockReset();
  executePlan.mockResolvedValue({
    actor: "actual-grader",
    command: "test",
    execution: { result: "success", exitCode: 0, stdout: GRADE_RUN_MARKERS, stderr: "" },
  });
});
afterEach(() => {
  process.chdir(originalCwd);
  rmSync(root, { recursive: true, force: true });
});

describe("native grade run", () => {
  it.each(["top-level.yaml", "external.yml"])(
    "grades YAML %s and reuses its result in review",
    async (name) => {
      const path = `docs/ja/specdojo/samples/${name}`;
      const content = name.endsWith(".yml")
        ? "---\nopenapi: 3.1.0\nx-spec-meta:\n  id: test:yaml\n  type: api\n  status: draft\n  rulebook: none\npaths: {}\n"
        : "# source\nid: test:yaml\ntype: data\nstatus: draft\nrulebook: none\nfields: []\n";
      mkdirSync(join(root, "docs/ja/specdojo/samples"), { recursive: true });
      writeFileSync(join(root, path), content);
      const reviewInvoke = vi.fn().mockResolvedValue({ exitCode: 0, stderr: "" });
      expect(
        await ensureReviewGrade({
          taskId: "REVIEW-YAML",
          projectId: "test",
          subjectPath: path,
          target: "kata",
          repoRoot: root,
          dryRun: false,
          invoke: reviewInvoke,
        }),
      ).toMatchObject({ action: "executed" });
      expect(reviewInvoke).toHaveBeenCalledWith(
        process.execPath,
        expect.arrayContaining(["grade", "run", "--path", path]),
        root,
      );
      expect(discoverGradeTargets({ target: "kata", project: "test" })).toContain(join(root, path));
      const plan = renderGradePlan({
        target: "kata",
        projectId: "test",
        path,
        viewpoints: loadViewpoints("test"),
        embedDocuments: true,
      });
      expect(plan).toContain(`1 | ${content.split("\n")[0]}`);
      expect(plan).toContain("元の YAML ファイルの1始まりの行番号");
      executePlan.mockResolvedValue({
        actor: "actual-grader",
        command: "test",
        execution: {
          result: "success",
          exitCode: 0,
          stdout:
            "[VIEWPOINT vp-content]\nLEVEL: 3\nFINDING minor line=2: 内容を確認する。\n[END VIEWPOINT]\n",
          stderr: "",
        },
      });
      const result = await grade({ ...options, paths: [path], kind: "sample" });
      expect(result.documents[0]?.status).toBe("complete");
      const stored = readGradeResultForDocument({ documentPath: path, project: "test" });
      expect(stored).toMatchObject({
        document: "test:yaml",
        content_hash: gradeContentHash(content),
        findings: [{ line: 2, anchor: content.split("\n")[1] }],
      });
      expect(readFileSync(join(root, path), "utf8")).toBe(content);
      expect(validateGradeResultForDocument({ path, target: "kata", project: "test" })).toEqual([]);
      expect(
        discoverGradeTargets({ target: "kata", project: "test", paths: [path], changedOnly: true }),
      ).toEqual([]);
      expect(
        reviewGradeFreshness({ subjectPath: path, projectId: "test", rootDir: root }).state,
      ).toBe("fresh");
      const invoke = vi.fn();
      expect(
        await ensureReviewGrade({
          taskId: "REVIEW-YAML",
          projectId: "test",
          subjectPath: path,
          target: "kata",
          repoRoot: root,
          dryRun: false,
          invoke,
        }),
      ).toEqual({ action: "skipped" });
      expect(invoke).not.toHaveBeenCalled();
      recordGradePipelineStage({
        target: "kata",
        project: "test",
        path,
        runId: "retry",
        stage: 1,
        stageTotal: 1,
        maxFailures: 3,
        status: "failed",
      });
      expect(readGradePipelineState({ target: "kata", project: "test", path })?.content_hash).toBe(
        gradeContentHash(content),
      );
      writeFileSync(join(root, path), `${content}\n`);
      expect(readGradePipelineState({ target: "kata", project: "test", path })).toBeUndefined();
      expect(
        reviewGradeFreshness({ subjectPath: path, projectId: "test", rootDir: root }).state,
      ).toBe("stale");
    },
  );

  it("skips YAML without metadata with a reason", () => {
    const path = "docs/ja/specdojo/rulebooks/unrelated.yaml";
    writeFileSync(join(root, path), "settings: {}\n");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      expect(discoverGradeTargets({ target: "kata", project: "test", paths: [path] })).toEqual([]);
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining("YAML grade target requires metadata id"),
      );
      expect(warn).not.toHaveBeenCalledWith(expect.stringContaining("Markdown frontmatter"));
    } finally {
      warn.mockRestore();
    }
  });

  it("forwards CLI executor and exec-defaults options to the agent runtime", async () => {
    const resolveActor = vi.fn().mockReturnValue("actual-grader");
    const program = new Command();
    registerGradeCommand(program, { executePlan, resolveActor });
    await program.parseAsync([
      "node",
      "specdojo",
      "grade",
      "run",
      "--target",
      "kata",
      "--path",
      GRADE_RUN_DOCUMENT,
      "--run-id",
      "cli-options",
      "--by",
      "grader-alias",
      "--exec-defaults",
      "custom-defaults.yaml",
    ]);
    expect(resolveActor).toHaveBeenCalledWith(
      expect.objectContaining({
        by: "grader-alias",
        execDefaultsPath: "custom-defaults.yaml",
      }),
    );
    expect(executePlan).toHaveBeenCalledWith(
      expect.objectContaining({
        nickname: "actual-grader",
        execDefaultsPath: "custom-defaults.yaml",
      }),
    );
    expect(
      readGradeResultForDocument({ documentPath: GRADE_RUN_DOCUMENT, project: "test" }),
    ).toMatchObject({ graded_by: "actual-grader" });
  });

  it("dry-run selects the kind and resolves aliases without writing or executing", async () => {
    expect(resolveGradeRunActor({ project: "test", by: "grader-alias" })).toBe("actual-grader");
    const result = await grade({
      ...options,
      kind: "rulebook",
      by: "grader-alias",
      dryRun: true,
    });
    expect(result.documents.map((item) => item.path)).toEqual([GRADE_RUN_DOCUMENT]);
    expect(executePlan).not.toHaveBeenCalled();
    expect(existsSync("execution")).toBe(false);
    expect((await grade({ ...options, kind: "recipe", dryRun: true })).documents).toEqual([]);
  });

  it("writes canonical grade with the actual actor and never reapplies completed stages", async () => {
    await grade({ ...options, by: "grader-alias" });
    const first = readGradeResultForDocument({ documentPath: GRADE_RUN_DOCUMENT, project: "test" });
    expect(first).toMatchObject({ graded_by: "actual-grader", score: 100, verdict: "pass" });
    await grade({ ...options, by: "grader-alias" });
    expect(executePlan).toHaveBeenCalledTimes(1);
    expect(
      readGradeResultForDocument({ documentPath: GRADE_RUN_DOCUMENT, project: "test" }),
    ).toEqual(first);
    expect(
      readGradePipelineState({ target: "kata", project: "test", path: GRADE_RUN_DOCUMENT }),
    ).toBeUndefined();
  });

  it("freezes filtered selection and resumes only failed documents", async () => {
    const other = GRADE_RUN_DOCUMENT.replace("example", "other");
    writeFileSync(
      other,
      readFileSync(GRADE_RUN_DOCUMENT, "utf8").replace("test:example", "test:other"),
    );
    const request = { ...options, paths: [GRADE_RUN_DOCUMENT, other], changedOnly: true };
    executePlan.mockResolvedValueOnce({
      actor: "actual-grader",
      command: "test",
      execution: { result: "success", exitCode: 0, stdout: GRADE_RUN_MARKERS, stderr: "" },
    });
    executePlan.mockRejectedValueOnce(new Error("interrupted"));
    await expect(grade(request)).rejects.toThrow(/other-rulebook.md: interrupted/);
    expect(readGradePipelineState({ target: "kata", project: "test", path: other })).toMatchObject({
      stage_failed: 1,
      consecutive_failures: 1,
    });
    const stored = readGradeResultForDocument({
      documentPath: GRADE_RUN_DOCUMENT,
      project: "test",
    });
    await grade(request);
    expect(executePlan).toHaveBeenCalledTimes(3);
    expect(
      readGradeResultForDocument({ documentPath: GRADE_RUN_DOCUMENT, project: "test" }),
    ).toEqual(stored);
  });

  it("recovers an interruption after canonical apply without applying or executing twice", async () => {
    await grade(options);
    const first = readGradeResultForDocument({ documentPath: GRADE_RUN_DOCUMENT, project: "test" });
    const statePath = "execution/grade/generated/runs/native-test/run.json";
    const state = JSON.parse(readFileSync(statePath, "utf8"));
    state.documents[0].status = "pending";
    delete state.documents[0].resultHash;
    writeFileSync(statePath, JSON.stringify(state));
    recordGradePipelineStage({
      target: "kata",
      project: "test",
      path: GRADE_RUN_DOCUMENT,
      runId: "native-test",
      stage: 1,
      stageTotal: 1,
      maxFailures: 3,
      status: "failed",
    });
    await grade(options);
    expect(executePlan).toHaveBeenCalledTimes(1);
    expect(
      readGradeResultForDocument({ documentPath: GRADE_RUN_DOCUMENT, project: "test" }),
    ).toEqual(first);
    expect(
      readGradePipelineState({ target: "kata", project: "test", path: GRADE_RUN_DOCUMENT }),
    ).toBeUndefined();
  });

  it("rejects context changes and run-id reuse with different options", async () => {
    await grade(options);
    await expect(grade({ ...options, kind: "all" })).rejects.toThrow(/configuration changed/);
    writeFileSync(GRADE_RUN_DOCUMENT, `${readFileSync(GRADE_RUN_DOCUMENT, "utf8")}\nChanged.\n`);
    await expect(grade(options)).rejects.toThrow(/context changed/);
    expect(executePlan).toHaveBeenCalledTimes(1);
  });

  it("records malformed analysis failures without creating a grade", async () => {
    executePlan.mockResolvedValueOnce({
      actor: "actual-grader",
      command: "test",
      execution: { result: "success", exitCode: 0, stdout: "invalid analysis", stderr: "" },
    });
    await expect(grade(options)).rejects.toThrow(/grade run incomplete/);
    expect(
      readGradeResultForDocument({ documentPath: GRADE_RUN_DOCUMENT, project: "test" }),
    ).toBeUndefined();
    expect(
      readGradePipelineState({ target: "kata", project: "test", path: GRADE_RUN_DOCUMENT }),
    ).toMatchObject({ stage_failed: 1 });
  });

  it("rejects work directories outside the repository", async () => {
    await expect(grade({ ...options, workDir: "..", dryRun: true })).rejects.toThrow(
      /inside the repository/,
    );
    expect(executePlan).not.toHaveBeenCalled();
  });

  it("falls back to packaged common viewpoints when viewpoints_path is absent", () => {
    writeFileSync(
      ".specdojo/specdojo.config.json",
      JSON.stringify({ version: 1, current_project: "test", projects: { test: {} } }),
    );
    expect(loadViewpoints("test").id).toBe("specdojo:pm-review-viewpoints");
  });

  it("accepts only declared sibling roots, rejects traversal and symlink escapes", () => {
    const products = join(root, "products");
    mkdirSync(products);
    const allowed = join(products, "allowed");
    const outside = join(products, "outside");
    mkdirSync(allowed);
    mkdirSync(outside);
    writeFileSync(join(allowed, "doc.md"), readFileSync(GRADE_RUN_DOCUMENT, "utf8"));
    writeFileSync(join(outside, "doc.md"), "outside");
    // Project root beside both product directories.
    const projectRoot = join(products, "project");
    writeGradeRunFixture(projectRoot);
    const configPath = join(projectRoot, ".specdojo/specdojo.config.json");
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    config.projects.test.repos = [{ name: "allowed", path: "../allowed" }];
    config.projects.other = { repos: [{ name: "outside", path: "../outside" }] };
    writeFileSync(configPath, JSON.stringify(config));
    process.chdir(projectRoot);
    expect(
      discoverGradeTargets({
        target: "deliverable",
        project: "test",
        paths: ["../allowed/doc.md"],
      }),
    ).toEqual([join(allowed, "doc.md")]);
    expect(() => resolveSafeMarkdownPath("../outside/doc.md")).toThrow(/outside repository/);
    expect(resolveSafeMarkdownPath("../outside/doc.md", projectRoot, "other")).toBe(
      join(outside, "doc.md"),
    );
    expect(() => resolveSafeMarkdownPath("../allowed/../outside/doc.md")).toThrow(
      /outside repository/,
    );
    symlinkSync(join(outside, "doc.md"), join(allowed, "escaped.md"));
    expect(() => resolveSafeMarkdownPath("../allowed/escaped.md")).toThrow(/outside repository/);
    process.chdir(root);
  });

  it("grades declared sibling deliverables with criteria sidecars and resumes failures", async () => {
    // A nested project lets ../product remain inside the disposable fixture.
    const projectRoot = join(root, "project");
    writeGradeRunFixture(projectRoot);
    const product = join(root, "product");
    mkdirSync(product);
    writeFileSync(
      join(product, "document.md"),
      readFileSync(GRADE_RUN_DOCUMENT, "utf8").replace("test:example-rulebook", "test:deliverable"),
    );
    const configPath = join(projectRoot, ".specdojo/specdojo.config.json");
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    config.projects.test.repos = [{ name: "product", path: "../product" }];
    config.current_project = "other";
    config.projects.other = {};
    writeFileSync(configPath, JSON.stringify(config));
    writeFileSync(
      join(projectRoot, "catalog/dct-docs.yaml"),
      dump({
        id: "test:dct-docs",
        type: "catalog",
        status: "draft",
        rulebook: "none",
        base_path: "../product",
        groups: [
          {
            title: "Documents",
            deliverables: [
              {
                local_id: "document",
                name: "Document",
                kind: "document",
                path: "document.md",
                done_criteria: [
                  { text: "Content verified", roles: ["QE"], viewpoint: "vp-content" },
                ],
              },
            ],
          },
        ],
      }),
    );
    process.chdir(projectRoot);
    const request: GradeRunOptions = {
      target: "deliverable",
      project: "test",
      paths: ["../product/document.md"],
      runId: "product",
    };
    executePlan.mockRejectedValueOnce(new Error("interrupted"));
    await expect(grade(request)).rejects.toThrow(/interrupted/);
    expect(
      readGradePipelineState({
        target: "deliverable",
        project: "test",
        path: "../product/document.md",
      }),
    ).toMatchObject({ document: "../product/document.md" });
    executePlan.mockResolvedValueOnce({
      actor: "actual-grader",
      command: "test",
      execution: {
        result: "success",
        exitCode: 0,
        stdout: `${GRADE_RUN_MARKERS}[DONE_CRITERIA]\nDC-001: satisfied: Content verified.\n[END DONE_CRITERIA]\n`,
        stderr: "",
      },
    });
    await grade(request);
    expect(
      readGradeResultForDocument({ documentPath: "../product/document.md", project: "test" }),
    ).toMatchObject({ graded_by: "actual-grader", done_criteria: { satisfied: 1 } });
  });

  it("resumes same-id documents across repositories without replacing completed results", async () => {
    const projectRoot = join(root, "project");
    writeGradeRunFixture(projectRoot);
    const configPath = join(projectRoot, ".specdojo/specdojo.config.json");
    const config = JSON.parse(readFileSync(configPath, "utf8"));
    config.projects.test.repos = [
      { name: "api", path: "../api-checkout" },
      { name: "web", path: "../web-checkout" },
    ];
    writeFileSync(configPath, JSON.stringify(config));
    const content = readFileSync(GRADE_RUN_DOCUMENT, "utf8").replace(
      "test:example-rulebook",
      "shared-document",
    );
    for (const repo of ["api-checkout", "web-checkout"]) {
      mkdirSync(join(root, repo));
      writeFileSync(join(root, repo, "document.md"), content);
    }
    writeFileSync(join(projectRoot, "document.md"), content);
    process.chdir(projectRoot);
    const request: GradeRunOptions = {
      target: "deliverable",
      project: "test",
      paths: ["document.md", "../api-checkout/document.md", "../web-checkout/document.md"],
      runId: "same-id-repos",
    };
    const success = {
      actor: "actual-grader",
      command: "test",
      execution: { result: "success", exitCode: 0, stdout: GRADE_RUN_MARKERS, stderr: "" },
    } as const;
    executePlan.mockResolvedValueOnce(success);
    executePlan.mockRejectedValueOnce(new Error("interrupted"));
    await expect(grade(request)).rejects.toThrow(/interrupted/);
    expect(executePlan).toHaveBeenCalledTimes(3);
    const completed = request.paths!.flatMap((path) => {
      const stored = readGradeResultForDocument({ documentPath: path, project: "test" });
      return stored ? [{ path, stored }] : [];
    });
    expect(completed).toHaveLength(2);

    await grade(request);
    expect(executePlan).toHaveBeenCalledTimes(4);
    for (const { path, stored } of completed) {
      expect(readGradeResultForDocument({ documentPath: path, project: "test" })).toEqual(stored);
    }
    for (const path of request.paths!) {
      expect(readGradeResultForDocument({ documentPath: path, project: "test" })).toMatchObject({
        document: "shared-document",
        path,
      });
    }
    for (const result of [
      "shared-document.yaml",
      "api/shared-document.yaml",
      "web/shared-document.yaml",
    ]) {
      expect(existsSync(join(projectRoot, "execution/grade/results", result))).toBe(true);
    }
    await grade(request);
    expect(executePlan).toHaveBeenCalledTimes(4);
  });
});
