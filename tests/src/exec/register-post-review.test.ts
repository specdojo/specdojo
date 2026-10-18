import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  changesModifyRunningSpecDojo,
  registerPostReviewDisposition,
} from "../../../src/exec/run/register-post-review.js";

describe("register post-review disposition", () => {
  it.each(["complete", "complete-with-findings"])("%s は todo を自動 close する", (verdict) => {
    expect(registerPostReviewDisposition({ itemType: "todo", verdict })).toMatchObject({
      transition: "done",
      outcome: "success",
    });
  });

  it("incomplete は waiting に戻す", () => {
    expect(
      registerPostReviewDisposition({ itemType: "issue", verdict: "incomplete" }),
    ).toMatchObject({ transition: "waiting", outcome: "failure" });
  });

  it.each(["decision", "question"])("%s は complete でも close しない", (itemType) => {
    expect(registerPostReviewDisposition({ itemType, verdict: "complete" })).toMatchObject({
      transition: "review",
      outcome: "success",
    });
  });

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
