import { describe, expect, it } from "vitest";
import {
  executorOutcomeFailure,
  noProductChangeWarnings,
  targetedProductRepos,
  toolPermissionDenials,
} from "../../../src/exec/executor-outcome-checks.js";

const OPENCODE_DENIAL =
  'Error: The user has specified a rule which prevents you from using this specific tool call. {"permission":"external_directory","action":"deny","pattern":"*"}';

function plan(frontmatter: string[], body: string): string {
  return [
    "---",
    "specdojo:",
    "  task_id: PJR-AB12",
    "  mode: edit",
    ...frontmatter,
    "---",
    "",
    "# Edit Plan",
    "",
    body,
    "",
  ].join("\n");
}

describe("toolPermissionDenials", () => {
  it("returns each distinct opencode and Claude Code denial line once", () => {
    const output = [
      OPENCODE_DENIAL,
      OPENCODE_DENIAL,
      "Permission to use Edit has been denied.",
      "Claude requested permissions to write to /tmp/x, but you haven't granted it yet.",
    ].join("\n");

    expect(toolPermissionDenials(output)).toEqual([
      OPENCODE_DENIAL,
      "Permission to use Edit has been denied.",
      "Claude requested permissions to write to /tmp/x, but you haven't granted it yet.",
    ]);
  });

  it("ignores shell permission errors and the report envelope", () => {
    const output = [
      "bash: ./run.sh: Permission denied",
      `<specdojo_executor_evidence>{"final_message":"${OPENCODE_DENIAL.replaceAll('"', "'")}"}</specdojo_executor_evidence>`,
    ].join("\n");

    expect(toolPermissionDenials(output)).toEqual([]);
  });
});

describe("targetedProductRepos", () => {
  it("detects a product target in the plan frontmatter targets", () => {
    const content = plan(["  targets:", "    - app2:docs/a.md"], "本文");

    expect(targetedProductRepos({ productNames: ["app1", "app2"], plan: content })).toEqual([
      "app2",
    ]);
  });

  it("detects a product target in the register hints", () => {
    const content = plan([], "本文");

    expect(
      targetedProductRepos({
        productNames: ["app1"],
        plan: content,
        hints: ["app1:src/a.ts"],
      }),
    ).toEqual(["app1"]);
  });

  it("detects a <repo>:<path> reference in the plan body", () => {
    const content = plan([], "- `app1:src/feature.ts` の不具合を直す");

    expect(targetedProductRepos({ productNames: ["app1", "app2"], plan: content })).toEqual([
      "app1",
    ]);
  });

  it("does not count a repository name followed by a description or a qualified id", () => {
    const content = plan([], "- app1: 説明だけ\n- [[test:app1:doc]] と myapp1:src/a.ts");

    expect(targetedProductRepos({ productNames: ["app1"], plan: content })).toEqual([]);
  });

  it("does not read the body of an approach plan", () => {
    const content = plan(["  approach: sample-authoring"], "手本 `app1:src/feature.ts`");

    expect(targetedProductRepos({ productNames: ["app1"], plan: content })).toEqual([]);
  });
});

describe("executorOutcomeFailure", () => {
  it("returns undefined without denials or unchanged targeted products", () => {
    expect(
      executorOutcomeFailure({ output: "done", unchangedTargetedRepos: [], resumeHint: "resume" }),
    ).toBeUndefined();
  });

  it("puts the missing product changes first and names the denial and the next action", () => {
    const reason = executorOutcomeFailure({
      output: OPENCODE_DENIAL,
      unchangedTargetedRepos: ["app1"],
      resumeHint: "specdojo exec run --resume",
    });

    expect(reason).toMatch(/^no product changes in app1 although the plan targets it; /u);
    expect(reason).toContain("1 tool permission denial(s) in executor output");
    expect(reason).toContain("executor reported complete; next: specdojo exec run --resume");
  });
});

describe("noProductChangeWarnings", () => {
  it("lists waiting register items and blocked tasks whose reason has the marker", () => {
    const lines = noProductChangeWarnings({
      registerItems: [
        { id: "PJR-ZZ99", status: "waiting", blockReason: "no product changes in app1" },
        { id: "PJR-AA11", status: "review", blockReason: "no product changes in app1" },
        { id: "PJR-BB22", status: "waiting", blockReason: "rate limit reached" },
      ],
      tasks: [
        { taskId: "T-1", state: "blocked", lastMsg: "no product changes in app2" },
        { taskId: "T-2", state: "doing", lastMsg: "no product changes in app2" },
      ],
    });

    expect(lines).toEqual([
      "PJR-ZZ99 (register, waiting): no product changes in app1",
      "T-1 (blocked): no product changes in app2",
    ]);
  });
});
