import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  reviewCompletionBlockReason,
  reviewResultVerdict,
  reviewTaskBlockReason,
} from "../../../src/exec/review-completion.js";

function reviewResult(verdict: string): string {
  return `---\nspecdojo:\n  type: exec-result\n  mode: review\n---\n\n# Review\n\n## 3. 判定\n\n- verdict: ${verdict}\n`;
}

describe("reviewCompletionBlockReason", () => {
  it("blocks with the failure detail and next action when grade still failed after retries", () => {
    const actual = reviewCompletionBlockReason({
      verdict: "complete",
      gradeOutcome: {
        action: "failed",
        runId: "review-T-1-a3",
        detail: "docs/a.md: exit 1: CAUSE requires a preceding FINDING",
        attempts: 3,
      },
    });

    expect(actual).toBe(
      "review grade failed after 3 attempt(s): docs/a.md: exit 1: CAUSE requires a preceding FINDING" +
        "; need=fix the grade failure (for example the grade output format) and re-run the review task" +
        "; ref=grade run review-T-1-a3",
    );
  });

  it.each(["grade-stale", "grade-unavailable", "changed-during-review"] as const)(
    "blocks a review whose verdict is %s",
    (verdict) => {
      const actual = reviewCompletionBlockReason({ verdict });

      expect(actual).toMatch(new RegExp(`^review verdict is ${verdict}; need=\\S`));
    },
  );

  it.each(["complete", "complete-with-findings", "incomplete"] as const)(
    "does not block a review whose verdict is %s and whose grade succeeded",
    (verdict) => {
      const actual = reviewCompletionBlockReason({
        verdict,
        gradeOutcome: { action: "executed", runId: "review-T-1" },
      });

      expect(actual).toBeUndefined();
    },
  );
});

describe("reviewTaskBlockReason", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "specdojo-review-completion-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("reads grade-stale from the review result and blocks the review task", async () => {
    const resultPath = path.join(dir, "result.md");
    await writeFile(resultPath, reviewResult("grade-stale"), "utf8");

    const actual = reviewTaskBlockReason({ mode: "review", resultPath });

    expect(reviewResultVerdict(resultPath)).toBe("grade-stale");
    expect(actual).toMatch(/^review verdict is grade-stale; need=run `specdojo grade run`/);
  });

  it("does not inspect results of edit tasks", async () => {
    const resultPath = path.join(dir, "result.md");
    await writeFile(resultPath, reviewResult("grade-stale"), "utf8");

    const actual = reviewTaskBlockReason({ mode: "edit", resultPath });

    expect(actual).toBeUndefined();
  });

  it("ignores a verdict placeholder that is not a review verdict", async () => {
    const resultPath = path.join(dir, "result.md");
    await writeFile(resultPath, reviewResult("_TODO_"), "utf8");

    expect(reviewResultVerdict(resultPath)).toBeUndefined();
  });
});
