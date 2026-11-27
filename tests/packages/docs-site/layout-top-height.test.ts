import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  FIXED_NAV_MEDIA_QUERY,
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

  it("does not set the variable on narrow screens where the nav is not fixed", () => {
    const root = createRoot();
    applyLayoutTopHeight(root, 38);

    applyLayoutTopHeight(root, 38, false);

    expect(root.values.has(LAYOUT_TOP_HEIGHT_VAR)).toBe(false);
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

describe("NextChannelBanner styles", () => {
  const sourcePath = "packages/docs-site/.vitepress/theme/NextChannelBanner.vue";

  it("fixes the banner and removes the local nav padding only where the nav is fixed", async () => {
    const source = await readFile(sourcePath, "utf8");
    const query = `@media ${FIXED_NAV_MEDIA_QUERY}`;

    const blocks = source.split(query).slice(1);

    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toMatch(/\.next-channel-banner\s*{[^}]*position:\s*fixed/);
    // VitePress の scoped 規則（`.VPLocalNav[data-v-…]`）より詳細度を高くしないと上書きが効かない。
    expect(blocks[1]).toMatch(/html \.Layout > \.VPLocalNav\s*{[^}]*padding-top:\s*0/);
    expect(blocks[1]).toContain("var(--vp-layout-top-height, 0px)");
  });
});
