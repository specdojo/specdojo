import { describe, expect, it } from "vitest";
import {
  applyLayoutTopHeight,
  clearLayoutTopHeight,
  LAYOUT_TOP_HEIGHT_VAR,
} from "../../../packages/docs-site/.vitepress/theme/layout-top-height.js";

function createRoot(): {
  values: Map<string, string>;
  style: Parameters<typeof applyLayoutTopHeight>[0]["style"];
} {
  const values = new Map<string, string>();
  return {
    values,
    style: {
      setProperty: (name, value) => {
        values.set(name, value);
      },
      removeProperty: (name) => {
        const previous = values.get(name) ?? "";
        values.delete(name);
        return previous;
      },
    },
  };
}

describe("applyLayoutTopHeight", () => {
  it("sets the VitePress layout-top height to the rounded-up banner height", () => {
    const root = createRoot();

    applyLayoutTopHeight(root, 38.5);

    expect(root.values.get(LAYOUT_TOP_HEIGHT_VAR)).toBe("39px");
  });

  it("follows a taller banner when the text wraps", () => {
    const root = createRoot();

    applyLayoutTopHeight(root, 38);
    applyLayoutTopHeight(root, 62);

    expect(root.values.get(LAYOUT_TOP_HEIGHT_VAR)).toBe("62px");
  });

  it("removes the variable when the banner has no height", () => {
    const root = createRoot();
    applyLayoutTopHeight(root, 38);

    applyLayoutTopHeight(root, 0);

    expect(root.values.has(LAYOUT_TOP_HEIGHT_VAR)).toBe(false);
  });
});

describe("clearLayoutTopHeight", () => {
  it("removes the variable so the stable site is not shifted", () => {
    const root = createRoot();
    applyLayoutTopHeight(root, 38);

    clearLayoutTopHeight(root);

    expect(root.values.size).toBe(0);
  });
});
