import { Command } from "commander";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  consecutiveFailureCount,
  parseRegisterRunSummary,
  renderNightReport,
  registerNightOrchestratorCommand,
  requiresDerivedApproval,
  selectApprovedNightItems,
} from "../../../src/commands/night-orchestrator.js";
import type { PjrItem } from "../../../src/register/register.js";
import { GIT_LOCAL_ENV_VARS } from "../../../src/shared/git-environment.js";
import { EXEC_RUN_LOCK_TOKEN_ENV } from "../../../src/exec/run/lock.js";

function item(id: string, overrides: Partial<PjrItem> = {}): PjrItem {
  return {
    id,
    status: "open",
    title: id,
    description: "test",
    type: "todo",
    priority: "medium",
    owner: "DEV",
    registeredAt: "2026-10-19T00:00:00Z",
    due: "-",
    completedAt: "-",
    conclusion: "-",
    ticket: `${id}.md`,
    ...overrides,
  };
}

describe("night orchestrator", () => {
  it("子の exec run から Git の repository 固有変数を除き、実行元と通常の環境を維持する", async () => {
    const cwd = process.cwd();
    const entry = process.argv[1];
    const root = mkdtempSync(join(tmpdir(), "specdojo-night-env-"));
    try {
      mkdirSync(join(root, ".specdojo"));
      mkdirSync(join(root, "register"));
      writeFileSync(
        join(root, ".specdojo/specdojo.config.json"),
        JSON.stringify({
          version: 1,
          current_project: "test",
          projects: {
            test: {
              schedule_path: "schedule",
              execution_path: "execution",
              project_register_path: "register",
            },
          },
        }),
      );
      writeFileSync(
        join(root, "register/pjr-ab12-topic.md"),
        "---\nspecdojo:\n  id: test:pjr-ab12-topic\n  item_type: todo\n  item_status: open\n  autopilot: approved\n---\n\n# PJR-AB12 test\n",
      );
      const wrapper = join(root, "cli.mjs");
      writeFileSync(
        wrapper,
        `import { writeFileSync } from "node:fs";
const keys = ${JSON.stringify([...GIT_LOCAL_ENV_VARS, "PATH", "GIT_AUTHOR_NAME", EXEC_RUN_LOCK_TOKEN_ENV])};
writeFileSync("child.json", JSON.stringify({cwd: process.cwd(), args: process.argv.slice(2), env: Object.fromEntries(keys.filter(key => process.env[key] !== undefined).map(key => [key, process.env[key]]))}));
console.log("  PJR-AB12  success  transition=review  commit=committed abc123");
`,
      );
      for (const name of GIT_LOCAL_ENV_VARS) vi.stubEnv(name, `/poison/${name}`);
      vi.stubEnv(EXEC_RUN_LOCK_TOKEN_ENV, "fixture-lock");
      process.chdir(root);
      process.argv[1] = wrapper;
      const program = new Command();
      registerNightOrchestratorCommand(program.command("orchestrator"));
      await program.parseAsync(["orchestrator", "night", "--project", "test"], { from: "user" });

      const child = JSON.parse(readFileSync(join(root, "child.json"), "utf8"));
      expect(child.cwd).toBe(root);
      expect(child.args).toEqual(
        expect.arrayContaining([
          "exec",
          "run",
          "--register",
          "PJR-AB12",
          "--worktree",
          "--post-review",
        ]),
      );
      expect(GIT_LOCAL_ENV_VARS.filter((name) => child.env[name] !== undefined)).toEqual([]);
      expect(child.env.PATH).toBe(process.env.PATH);
      expect(child.env.GIT_AUTHOR_NAME).toBe(process.env.GIT_AUTHOR_NAME);
      expect(child.env[EXEC_RUN_LOCK_TOKEN_ENV]).toBe("fixture-lock");
      expect(process.env.GIT_DIR).toBe("/poison/GIT_DIR");
    } finally {
      process.chdir(cwd);
      process.argv[1] = entry;
      vi.unstubAllEnvs();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("承認のない個票と実行対象外の type/status を queue に入れない", () => {
    const selected = selectApprovedNightItems(
      [
        item("PJR-AB12", { autopilot: "approved" }),
        item("PJR-AB13"),
        item("PJR-AB14", { autopilot: "approved", type: "decision" }),
        item("PJR-AB15", { autopilot: "approved", status: "waiting" }),
        item("PJR-AB17", { autopilot: "approved", type: "epic", track: "business" }),
        item("PJR-AB16", { autopilot: "approved", type: "issue" }),
      ],
      10,
    );
    expect(selected.map((entry) => entry.id)).toEqual(["PJR-AB12", "PJR-AB16"]);
  });

  it("一晩の件数上限を ID 順で適用する", () => {
    const selected = selectApprovedNightItems(
      ["PJR-AB15", "PJR-AB12", "PJR-AB14"].map((id) => item(id, { autopilot: "approved" })),
      2,
    );
    expect(selected.map((entry) => entry.id)).toEqual(["PJR-AB12", "PJR-AB14"]);
  });

  it("run summary を読み、成功で連続失敗数をリセットする", () => {
    const outcomes = parseRegisterRunSummary(`Register run summary:
  PJR-AB12  failure  transition=waiting  commit=incomplete  reason=blocked
  PJR-AB13  success  transition=done  commit=committed abc123
  PJR-AB14  failure  transition=waiting  commit=incomplete  reason=failed`);
    expect(outcomes).toHaveLength(3);
    expect(consecutiveFailureCount(1, outcomes)).toBe(1);
  });

  it("承認範囲外の失敗だけを derived approval の対象にする", () => {
    expect(
      requiresDerivedApproval({
        id: "PJR-AB12",
        outcome: "failure",
        transition: "waiting",
        reason: "protected configuration change required",
      }),
    ).toBe(true);
    expect(
      requiresDerivedApproval({
        id: "PJR-AB13",
        outcome: "failure",
        transition: "waiting",
        reason: "unit test failed",
      }),
    ).toBe(false);
  });

  it("close・waiting・新しい承認待ちを朝報告へまとめる", () => {
    const report = renderNightReport({
      projectId: "prj-0001",
      startedAt: "2026-10-19T17:00:00.000Z",
      completedAt: "2026-10-19T17:10:00.000Z",
      selected: [
        item("PJR-AB12", { autopilot: "approved" }),
        item("PJR-AB13", { autopilot: "approved" }),
      ],
      outcomes: [
        { id: "PJR-AB12", outcome: "success", transition: "done" },
        { id: "PJR-AB13", outcome: "failure", transition: "waiting", reason: "protected" },
      ],
      approvalIssues: new Map([["PJR-AB13", "PJR-CD34"]]),
    });
    expect(report).toContain("- close: PJR-AB12");
    expect(report).toContain("- `waiting`: PJR-AB13");
    expect(report).toContain("PJR-CD34（PJR-AB13 由来）");
  });
});
