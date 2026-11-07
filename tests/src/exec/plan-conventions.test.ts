import { createHash } from "node:crypto";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { archivePlan, loadPlan } from "../../../src/exec/plans-storage.js";
import { readAgentPlan } from "../../../src/exec/agent-plan.js";
import { buildExecutorPrompt, loadPrompt } from "../../../src/exec/run/agent.js";
import { buildReporterPrompt } from "../../../src/exec/reporter.js";
import {
  expandPlanConventions,
  planConventionsFiles,
  readPlanFile,
  storePlanConventions,
  withPlanConventionsFiles,
} from "../../../src/shared/plan-conventions.js";
import { injectCommonConventions, MISSING } from "../../../src/shared/plan-templates.js";
import {
  planConventionsDirectory,
  planConventionsPath,
  runRecordPaths,
  taskRecordPrefixes,
} from "../../../src/shared/run-records.js";

const roots: string[] = [];
const originalCwd = process.cwd();
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "specdojo-conventions-"));
  roots.push(root);
  const executionPath = join(root, "execution");
  const planPath = runRecordPaths(executionPath, "schedule", "T-TEST", "run-1").plan;
  mkdirSync(dirname(planPath), { recursive: true });
  return { root, executionPath, planPath };
}
function save(mode: "edit" | "review" = "edit", schema = MISSING) {
  const paths = fixture();
  const body = "---\nspecdojo:\n  task_id: T-TEST\n---\n\n# Plan\n\n_COMMON_CONVENTIONS_\n";
  const full = injectCommonConventions(body, schema, new Map(), mode);
  const stored = injectCommonConventions(body, schema, new Map(), mode, paths);
  writeFileSync(paths.planPath, stored);
  const [version] = planConventionsFiles(stored, dirname(paths.planPath));
  return { ...paths, full, stored, version };
}
afterEach(() => {
  process.chdir(originalCwd);
  vi.unstubAllEnvs();
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("stored plan conventions", () => {
  it.each([false, true])(
    "uses the same hash in different checkouts with relative resources (local: %s)",
    (local) => {
      const versions: string[] = [];
      const contents: string[] = [];
      for (let index = 0; index < 2; index++) {
        const f = fixture();
        const repo = join(f.root, "repo");
        const pkg = join(f.root, "package");
        mkdirSync(repo);
        mkdirSync(join(repo, ".specdojo"));
        writeFileSync(join(repo, ".specdojo/specdojo.config.json"), '{"version":1,"projects":{}}');
        const resourceRoot = local ? repo : pkg;
        cpSync(
          join(originalCwd, "docs/ja/specdojo/exec-templates"),
          join(resourceRoot, "docs/ja/specdojo/exec-templates"),
          { recursive: true },
        );
        process.chdir(repo);
        vi.stubEnv("SPECDOJO_PACKAGE_ROOT", pkg);
        const schema = join(resourceRoot, "docs/specdojo/schemas/v1/example.yaml");
        const planPath = join(repo, "execution/runs/schedule/T-TEST/run-1/plan.md");
        const stored = injectCommonConventions("_COMMON_CONVENTIONS_", schema, new Map(), "edit", {
          executionPath: join(repo, "execution"),
          planPath,
        });
        const [version] = planConventionsFiles(stored, dirname(planPath));
        const content = readFileSync(version, "utf8");
        expect(content).not.toContain(f.root);
        expect(content).not.toContain(originalCwd);
        expect(content).toContain("`docs/specdojo/schemas/v1/example.yaml`");
        expect(content).toContain(
          "`docs/ja/specdojo/exec-templates/xp-common-conventions-template.md`",
        );
        versions.push(basename(version));
        contents.push(content);
      }
      expect(versions[0]).toBe(versions[1]);
      expect(contents[0]).toBe(contents[1]);
    },
  );

  it("includes only the referenced version in checkpoint copy and release paths", () => {
    const f = save();
    storePlanConventions("unrelated rules", f.executionPath, f.planPath);
    const resultPath = join(dirname(f.planPath), "result.md");
    const paths = withPlanConventionsFiles([f.planPath, resultPath, f.planPath]);
    expect(paths).toEqual([f.planPath, f.version, resultPath]);
    expect(withPlanConventionsFiles(paths)).toEqual(paths);
  });

  it.each(["edit", "review"] as const)(
    "stores one immutable %s version and restores the exact prompt",
    (mode) => {
      const f = save(mode);
      expect(f.stored).toMatch(/\[共通規約 sha256:[a-f0-9]{64}\]/);
      expect(f.stored).not.toContain("result の必須セクション");
      expect(readPlanFile(f.planPath)).toBe(f.full);
      expect(readAgentPlan(f.planPath)).toBe(f.full);
      expect(loadPlan(f.executionPath, "T-TEST")).toBe(f.full);
      expect(loadPrompt(f.executionPath, "T-TEST")).toContain("result の必須セクション");
      expect(buildExecutorPrompt(readPlanFile(f.planPath), [], { resumed: true })).toContain(
        f.full.trimEnd(),
      );
      const reporter = buildReporterPrompt({
        plan: readPlanFile(f.planPath),
        mode,
        evidence: {
          schema_version: 1,
          task_id: "T-TEST",
          run_id: "run-1",
          stage: {
            role: "executor",
            actor: "test",
            status: "succeeded",
            started_at: "2026-11-07T00:00:00Z",
            completed_at: "2026-11-07T00:00:01Z",
            exit_code: 0,
            attempts: 1,
          },
          changes: [],
          diff_summary: { files_changed: 0, summary: "" },
          validations: [],
          final_message: "done",
          log_refs: [],
        },
      });
      expect(reporter).toContain(f.full.trimEnd());
      const content = readFileSync(f.version, "utf8");
      const hash = createHash("sha256").update(content).digest("hex");
      expect(f.version).toBe(planConventionsPath(f.executionPath, hash));
      const before = statSync(f.version).mtimeMs;
      const next = join(dirname(f.planPath), "another-plan.md");
      const ref = storePlanConventions(content, f.executionPath, next);
      expect(expandPlanConventions(ref, dirname(next))).toBe(content.trimEnd());
      expect(readdirSync(planConventionsDirectory(f.executionPath))).toEqual([`${hash}.txt`]);
      expect(statSync(f.version).mtimeMs).toBe(before);
      expect(Buffer.byteLength(f.full) - Buffer.byteLength(f.stored)).toBeGreaterThan(1000);
    },
  );

  it("restores a moved worktree plan using its relative reference", () => {
    const f = save();
    const target = fixture();
    cpSync(f.executionPath, target.executionPath, { recursive: true });
    rmSync(f.root, { recursive: true, force: true });
    expect(readPlanFile(target.planPath)).toBe(f.full);
    expect(taskRecordPrefixes(target.executionPath, "T-TEST")).toContain(
      `${planConventionsDirectory(target.executionPath)}/`,
    );
  });

  it("uses distinct versions for changed rules, mode and resolved schema without changing old prompts", () => {
    const f = save();
    const original = readFileSync(f.version, "utf8");
    storePlanConventions(`${original}\n- new rule`, f.executionPath, f.planPath);
    const review = injectCommonConventions("_COMMON_CONVENTIONS_", MISSING, new Map(), "review", f);
    const schema = injectCommonConventions(
      "_COMMON_CONVENTIONS_",
      "docs/schema.yaml",
      new Map(),
      "edit",
      f,
    );
    expect(readdirSync(planConventionsDirectory(f.executionPath))).toHaveLength(4);
    expect(readPlanFile(f.planPath)).toBe(f.full);
    expect(expandPlanConventions(review, dirname(f.planPath))).toContain("review の判断手順");
    expect(expandPlanConventions(schema, dirname(f.planPath))).toContain(
      "対応 schema `docs/schema.yaml`",
    );
  });

  it("fails with the version and path when a snapshot is missing or corrupted", () => {
    const f = save();
    rmSync(f.version);
    for (const read of [
      () => readPlanFile(f.planPath),
      () => readAgentPlan(f.planPath),
      () => loadPlan(f.executionPath, "T-TEST"),
      () => loadPrompt(f.executionPath, "T-TEST"),
    ]) {
      expect(read).toThrow(/Plan conventions version not found: sha256:[a-f0-9]{64}; path=/);
    }
    writeFileSync(f.version, "changed\n");
    expect(() => readPlanFile(f.planPath)).toThrow("SHA-256 mismatch");
    expect(() =>
      storePlanConventions(
        injectCommonConventions("_COMMON_CONVENTIONS_", MISSING, new Map()),
        f.executionPath,
        f.planPath,
      ),
    ).toThrow("SHA-256 mismatch");
  });

  it("reads legacy inline plans unchanged, including manually supplied plan paths", () => {
    const f = save();
    const manual = join(f.root, "manual.md");
    writeFileSync(manual, f.full);
    rmSync(f.version);
    expect(readPlanFile(manual)).toBe(f.full);
    expect(readAgentPlan(manual)).toBe(f.full);
    expect(expandPlanConventions(f.full)).toBe(f.full);
  });

  it("supports encoded paths and a manually placed referenced plan", () => {
    const f = fixture();
    const execution = join(f.root, "execution with space (copy)");
    const ref = storePlanConventions("## Rules\n\n- rule", execution, f.planPath);
    writeFileSync(f.planPath, ref);
    expect(ref).toContain("%20");
    expect(readPlanFile(f.planPath)).toBe("## Rules\n\n- rule");
    const hash = "a".repeat(64);
    expect(() =>
      expandPlanConventions(`[共通規約 sha256:${hash}](../../other.md)`, f.root),
    ).toThrow("Invalid plan conventions reference");
    expect(relative(f.root, planConventionsFiles(ref, dirname(f.planPath))[0])).toContain(
      "execution with space",
    );
    expect(() =>
      expandPlanConventions("[共通規約 sha256:invalid](conventions/version.txt)"),
    ).toThrow("Invalid plan conventions reference");
  });

  it("retains convention references when archiving a run plan", () => {
    const f = fixture();
    const legacy = join(f.executionPath, "runs", "schedule", "custom", "custom", "plan.md");
    mkdirSync(dirname(legacy), { recursive: true });
    writeFileSync(legacy, storePlanConventions("## Rules\n\n- rule", f.executionPath, legacy));
    const archived = archivePlan({ executionPath: f.executionPath, slug: "custom" });
    expect(archived.to).toBeDefined();
    expect(readPlanFile(archived.to!)).toBe("## Rules\n\n- rule");
  });
});
