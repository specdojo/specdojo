import { describe, expect, it } from "vitest";
import { displayWidth, padEndDisplay } from "../../src/exec-shared.js";

describe("displayWidth", () => {
  it("counts ASCII characters as one column each", () => {
    expect(displayWidth("task_id")).toBe(7);
  });

  it("counts full-width CJK characters as two columns each", () => {
    expect(displayWidth("最終調整")).toBe(8);
  });

  it("mixes half-width and full-width widths", () => {
    expect(displayWidth("Recipe 最終調整")).toBe(7 + 8);
  });

  it("counts a surrogate-pair emoji as two columns", () => {
    expect(displayWidth("🍵")).toBe(2);
  });

  it("returns zero for an empty string", () => {
    expect(displayWidth("")).toBe(0);
  });
});

describe("padEndDisplay", () => {
  it("pads a full-width string to the requested display width", () => {
    const padded = padEndDisplay("最終調整", 12);

    expect(padded).toBe("最終調整    ");
    expect(displayWidth(padded)).toBe(12);
  });

  it("does not pad when the string already meets the width", () => {
    expect(padEndDisplay("最終調整", 8)).toBe("最終調整");
  });

  it("does not truncate a string that exceeds the width", () => {
    expect(padEndDisplay("最終調整", 4)).toBe("最終調整");
  });

  it("aligns half-width and full-width values to the same display width", () => {
    const a = padEndDisplay("abcd", 8);
    const b = padEndDisplay("最終", 8);

    expect(displayWidth(a)).toBe(displayWidth(b));
  });
});
