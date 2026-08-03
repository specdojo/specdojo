import { describe, expect, it } from "vitest";
import { parsePracticeId, practiceLocalId, qualifyPracticeId } from "../../src/practice-id.js";

describe("practice ID", () => {
  it("authority と local ID を分離し、ファイル名には local ID だけを使える", () => {
    expect(parsePracticeId("specdojo:prj-overview-rulebook")).toEqual({
      authority: "specdojo",
      localId: "prj-overview-rulebook",
    });
    expect(practiceLocalId("specdojo:prj-overview-rulebook")).toBe("prj-overview-rulebook");
  });

  it("未修飾 ID に authority を付け、修飾済み ID は維持する", () => {
    expect(qualifyPracticeId("specdojo", "track-design-guide")).toBe("specdojo:track-design-guide");
    expect(qualifyPracticeId("specdojo", "construction-dojo:safety-rulebook")).toBe(
      "construction-dojo:safety-rulebook",
    );
  });

  it("不正な authority-qualified ID を拒否する", () => {
    expect(() => parsePracticeId("SpecDojo:track-design-guide")).toThrow("Invalid practice ID");
    expect(() => parsePracticeId("specdojo:track:design-guide")).toThrow("Invalid practice ID");
  });
});
