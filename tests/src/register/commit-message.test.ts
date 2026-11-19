import { describe, expect, it } from "vitest";
import { registerCommitMessageFromParagraphs } from "../../../src/register/register.js";

describe("registerCommitMessageFromParagraphs", () => {
  it("joins repeated -m values as paragraphs like git commit -m", () => {
    const actual = registerCommitMessageFromParagraphs([
      "docs(register PJR-AAAA): close",
      "本文\n\nCo-Authored-By: A <a@example.com>",
    ]);

    expect(actual).toBe(
      "docs(register PJR-AAAA): close\n\n本文\n\nCo-Authored-By: A <a@example.com>",
    );
  });

  it("returns undefined when every value is blank so the default message is used", () => {
    expect(registerCommitMessageFromParagraphs(["  ", ""])).toBeUndefined();
    expect(registerCommitMessageFromParagraphs(undefined)).toBeUndefined();
  });
});
