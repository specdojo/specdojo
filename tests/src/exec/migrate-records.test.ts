import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { applyRecordMigration, planRecordMigration } from "../../../src/exec/migrate-records.js";
import {
  planConventionsFiles,
  readPlanFile,
  storePlanConventions,
} from "../../../src/shared/plan-conventions.js";
import { gitEnvironment } from "../../../src/shared/git.js";
import * as worktrees from "../../../src/exec/worktree.js";

const roots: string[] = [];
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "specdojo-migration-"));
  roots.push(root);
  const write = (path: string, content: string) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  };
  const git = (...args: string[]) => {
    const result = spawnSync("git", args, {
      cwd: root,
      encoding: "utf8",
      env: gitEnvironment(),
    });
    if (result.status !== 0) throw new Error(result.stderr);
    return result.stdout;
  };
  git("init", "-q");
  return { root, execution: join(root, "execution"), write, git };
}
afterEach(() => {
  vi.restoreAllMocks();
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("legacy record migration", () => {
  it.each([
    ["PJR-AB12", "exec/test-PJR-AB12"],
    ["PJR-AB12-post-review", "exec/test-PJR-AB12"],
    ["T-TEST", "exec/test-T-TEST"],
    ["JBR-example-review", "exec/test-JBR-example"],
    ["PJR-AB12", "exec/PJR-AB12"],
  ])("refuses migrating %s with retained worktree %s", (task, branch) => {
    const f = fixture();
    const plan = `execution/exec/plans/${task}-plan.md`;
    f.write(plan, `---\nspecdojo:\n  task_id: ${task}\n---\n`);
    vi.spyOn(worktrees, "listRegisteredWorktrees").mockReturnValue([{ path: f.root, branch }]);
    expect(() => planRecordMigration(f.root, f.execution, "test")).toThrow(
      `Migration target ${task} has a retained exec worktree: ${f.root} (${branch})`,
    );
    expect(existsSync(join(f.root, plan))).toBe(true);
    expect(existsSync(join(f.execution, "runs"))).toBe(false);
  });

  it("checks evidence-only runs and allows migration after the worktree is removed", () => {
    const f = fixture();
    f.write("execution/exec/evidence/T-TEST/run-1/executor.log", "unchanged log");
    const listing = vi
      .spyOn(worktrees, "listRegisteredWorktrees")
      .mockReturnValue([{ path: f.root, branch: "exec/test-T-TEST" }]);
    expect(() => planRecordMigration(f.root, f.execution, "test")).toThrow(
      "retained exec worktree",
    );
    listing.mockReturnValue([]);
    expect(planRecordMigration(f.root, f.execution, "test").moves).toHaveLength(1);
  });

  it("allows unrelated project/task worktrees, stale entries, and already migrated records", () => {
    const f = fixture();
    f.write("execution/exec/plans/T-TEST-plan.md", "---\nspecdojo:\n  task_id: T-TEST\n---\n");
    const listing = vi.spyOn(worktrees, "listRegisteredWorktrees").mockReturnValue([
      { path: f.root, branch: "exec/other-T-TEST" },
      { path: f.root, branch: "exec/test-T-OTHER" },
      { path: join(f.root, "removed"), branch: "exec/test-T-TEST" },
    ]);
    const migration = planRecordMigration(f.root, f.execution, "test");
    expect(migration.moves).toHaveLength(1);
    f.git("add", ".");
    applyRecordMigration(f.root, migration);
    listing.mockReturnValue([{ path: f.root, branch: "exec/test-T-TEST" }]);
    expect(planRecordMigration(f.root, f.execution, "test").moves).toEqual([]);
  });

  it.each([false, true])(
    "moves a checkpoint with git mv and is idempotent (legacy reference: %s)",
    (legacy) => {
      const f = fixture();
      const plan = "execution/exec/plans/pjr-ab12-stem-plan.md";
      const result = "execution/exec/results/pjr-ab12-stem-result.md";
      const evidence = "execution/exec/evidence/PJR-AB12/run-1";
      const next = "execution/runs/register/PJR-AB12/run-1";
      const header = "---\nspecdojo:\n  id: test:plan-id\n  task_id: PJR-AB12\n---\n";
      let reference = storePlanConventions("rules", f.execution, join(f.root, plan));
      if (legacy) {
        const [version] = planConventionsFiles(reference, dirname(join(f.root, plan)));
        reference = `[共通規約 sha256:${basename(version, ".txt")}](${relative(dirname(join(f.root, plan)), version)})`;
      }
      f.write(plan, header + reference);
      f.write(
        result,
        `---\nspecdojo:\n  id: test:result-id\n  task_id: PJR-AB12\n  plan_ref: exec/plans/pjr-ab12-stem-plan.md\n---\nbody ${plan}\n`,
      );
      const state = {
        task_id: "PJR-AB12",
        run_id: "run-1",
        artifacts: { plan_ref: plan, result_ref: result },
      };
      f.write(`${evidence}/pipeline-state.json`, JSON.stringify(state));
      f.write(
        `${evidence}/evidence.json`,
        JSON.stringify({
          task_id: "PJR-AB12",
          run_id: "run-1",
          log_refs: [{ path: `${evidence}/executor.log` }],
          changes: [{ path: `${evidence}/executor.log` }],
          final_message: `${evidence}/executor.log`,
        }),
      );
      f.write(`${evidence}/executor.log`, `raw log ${plan}\n\u0000`);
      f.write(
        "execution/jobs/runs/example.json",
        JSON.stringify({ plan_ref: "exec/plans/pjr-ab12-stem-plan.md" }),
      );
      f.git("add", ".");
      const migration = planRecordMigration(f.root, f.execution);
      expect(existsSync(join(f.root, plan))).toBe(true);
      expect(migration.moves).toHaveLength(5);
      applyRecordMigration(f.root, migration);
      expect(f.git("ls-files")).toContain(`${next}/executor.log`);
      expect(existsSync(join(f.root, plan))).toBe(false);
      expect(readPlanFile(join(f.root, next, "plan.md"))).toBe(header + "rules");
      expect(readFileSync(join(f.root, next, "result.md"), "utf8")).toContain(`body ${plan}`);
      expect(readFileSync(join(f.root, next, "result.md"), "utf8")).toContain("id: test:result-id");
      expect(readFileSync(join(f.root, next, "executor.log"), "utf8")).toBe(
        `raw log ${plan}\n\u0000`,
      );
      const data = JSON.parse(readFileSync(join(f.root, next, "evidence.json"), "utf8"));
      expect(data.log_refs[0].path).toBe(`${next}/executor.log`);
      expect(data.changes[0].path).toBe(`${evidence}/executor.log`);
      expect(data.final_message).toBe(`${evidence}/executor.log`);
      expect(
        JSON.parse(readFileSync(join(f.root, next, "pipeline-state.json"), "utf8")).artifacts
          .plan_ref,
      ).toBe(`${next}/plan.md`);
      expect(planRecordMigration(f.root, f.execution)).toEqual({
        moves: [],
        updates: [],
        missing: [],
        skipped: [],
      });
    },
  );

  it("preserves unpaired records and refuses collisions before moving anything", () => {
    const f = fixture();
    for (const [task, kind] of [
      ["T-TEST", "plan"],
      ["JBR-job-review", "result"],
    ]) {
      f.write(
        `execution/exec/${kind}s/${task}-${kind}.md`,
        `---\nspecdojo:\n  task_id: ${task}\n---\n`,
      );
    }
    const migration = planRecordMigration(f.root, f.execution);
    expect(migration.missing).toEqual([
      { stem: "T-TEST", missing: "result" },
      { stem: "JBR-job-review", missing: "plan" },
    ]);
    expect(migration.moves.find((move) => move.from.includes("JBR-job-review"))?.to).toContain(
      "runs/job/JBR-job/JBR-job-review/result.md",
    );
    f.write(migration.moves[0].to, "existing");
    expect(() => planRecordMigration(f.root, f.execution)).toThrow("already exists");
    expect(existsSync(join(f.root, migration.moves[0].from))).toBe(true);
  });

  it("keeps older checkpoints separate and places a shared pair with the latest checkpoint", () => {
    const f = fixture();
    const plan = "execution/exec/plans/T-TEST-plan.md";
    f.write(plan, "---\nspecdojo:\n  task_id: T-TEST\n---\n");
    for (const run of ["run-1", "run-2"])
      f.write(
        `execution/exec/evidence/T-TEST/${run}/pipeline-state.json`,
        JSON.stringify({
          task_id: "T-TEST",
          run_id: run,
          updated_at: run,
          artifacts: { plan_ref: plan },
        }),
      );
    const migration = planRecordMigration(f.root, f.execution);
    expect(migration.moves.find((move) => move.from === plan)?.to).toBe(
      "execution/runs/schedule/T-TEST/run-2/plan.md",
    );
    expect(migration.moves.filter((move) => move.to.endsWith("pipeline-state.json"))).toHaveLength(
      2,
    );
  });
});
