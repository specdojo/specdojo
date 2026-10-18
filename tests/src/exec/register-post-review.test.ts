import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  changesModifyRunningSpecDojo,
  postReviewCommitFailureLines,
  registerPostReviewDisposition,
} from "../../../src/exec/run/register-post-review.js";

describe("register post-review disposition", () => {
  it.each(["todo", "issue"])(
    "verdict が complete のとき %s を close する判定になる",
    (itemType) => {
      expect(registerPostReviewDisposition({ itemType, verdict: "complete" })).toMatchObject({
        transition: "done",
        outcome: "success",
      });
    },
  );

  it.each(["todo", "issue"])(
    "verdict が complete-with-findings のとき %s を close する判定になり、指摘が close の理由に残る",
    (itemType) => {
      const disposition = registerPostReviewDisposition({
        itemType,
        verdict: "complete-with-findings",
      });
      expect(disposition).toMatchObject({
        transition: "done",
        outcome: "success",
      });
      expect(disposition.explanation).toContain("complete-with-findings");
    },
  );

  it("incomplete は waiting に戻す", () => {
    expect(
      registerPostReviewDisposition({ itemType: "issue", verdict: "incomplete" }),
    ).toMatchObject({ transition: "waiting", outcome: "failure" });
  });

  it.each(["decision", "question"])(
    "%s は verdict にかかわらず close しない判定になる",
    (itemType) => {
      for (const verdict of ["complete", "complete-with-findings"]) {
        const disposition = registerPostReviewDisposition({ itemType, verdict });
        expect(disposition).toMatchObject({
          transition: "review",
          outcome: "success",
        });
        expect(disposition.transition).not.toBe("done");
      }

      const incomplete = registerPostReviewDisposition({ itemType, verdict: "incomplete" });
      expect(incomplete).toMatchObject({
        transition: "waiting",
        outcome: "failure",
      });
      expect(incomplete.transition).not.toBe("done");

      const undefinedVerdict = registerPostReviewDisposition({ itemType, verdict: undefined });
      expect(undefinedVerdict).toMatchObject({
        transition: "waiting",
        outcome: "failure",
      });
      expect(undefinedVerdict.transition).not.toBe("done");
    },
  );

  it("実行中の SpecDojo 実装を変えた todo は人の close に残す", () => {
    expect(
      registerPostReviewDisposition({
        itemType: "todo",
        verdict: "complete",
        runnerImplementationChanged: true,
      }),
    ).toMatchObject({ transition: "review", outcome: "success" });
  });
});

describe("changesModifyRunningSpecDojo", () => {
  it("specdojo package の src と tools を runner 実装変更として扱う", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-post-review-"));
    try {
      writeFileSync(join(root, "package.json"), '{"name":"specdojo"}\n', "utf8");
      expect(changesModifyRunningSpecDojo(root, ["src/exec/run/register.ts"])).toBe(true);
      expect(changesModifyRunningSpecDojo(root, ["docs/guide.md"])).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("別 package の src は SpecDojo runner の変更とみなさない", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-post-review-"));
    try {
      writeFileSync(join(root, "package.json"), '{"name":"example-app"}\n', "utf8");
      expect(changesModifyRunningSpecDojo(root, ["src/index.ts"])).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("postReviewCommitFailureLines", () => {
  it("names the failed hook, its first error, and the files left in the working tree", () => {
    const lines = postReviewCommitFailureLines({
      itemId: "PJR-JSEY",
      message:
        "git commit failed: markdown: docs/result.md:21:3 error MD029/ol-prefix Ordered list item prefix",
      leftFiles: ["docs/events/pjr-jsey.yaml", "docs/pjr-jsey.md"],
      failureLogPath: "docs/evidence/PJR-JSEY-post-review/run/post-review-commit.log",
    });

    expect(lines).toEqual([
      "Error: post-review bookkeeping commit failed for PJR-JSEY",
      "  failed hook: markdown",
      "  first error: docs/result.md:21:3 error MD029/ol-prefix Ordered list item prefix",
      "  uncommitted bookkeeping files: docs/events/pjr-jsey.yaml, docs/pjr-jsey.md",
      "  full hook output: docs/evidence/PJR-JSEY-post-review/run/post-review-commit.log",
    ]);
  });

  it("does not treat a git fatal message as a hook name", () => {
    const lines = postReviewCommitFailureLines({
      itemId: "PJR-JSEY",
      message: "git commit failed: fatal: unable to write new index file",
      leftFiles: [],
      failureLogPath: "post-review-commit.log",
    });

    expect(lines.slice(1, 4)).toEqual([
      "  failed hook: unknown",
      "  first error: fatal: unable to write new index file",
      "  uncommitted bookkeeping files: none",
    ]);
  });
});
