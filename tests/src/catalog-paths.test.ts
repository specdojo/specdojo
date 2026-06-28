import { describe, expect, it } from "vitest";
import { resolveBasePath, resolveDeliverablePath } from "../../src/catalog-paths.js";

describe("resolveBasePath", () => {
  it("appends a relative child to the parent base", () => {
    expect(resolveBasePath("docs/ja", "projects")).toBe("docs/ja/projects");
  });

  it("returns the parent unchanged when the child is absent", () => {
    expect(resolveBasePath("docs/ja", undefined)).toBe("docs/ja");
  });

  it("re-anchors at the repo root and strips the leading slash for an absolute child", () => {
    expect(resolveBasePath("docs/ja", "/docs/specdojo")).toBe("docs/specdojo");
  });

  it("does not emit a leading slash when there is no parent", () => {
    expect(resolveBasePath("", "docs/ja")).toBe("docs/ja");
  });
});

describe("resolveDeliverablePath", () => {
  it("joins the item path onto the section base", () => {
    expect(resolveDeliverablePath("docs/ja/projects", "prj-overview.md")).toBe(
      "docs/ja/projects/prj-overview.md",
    );
  });

  it("falls back to the section base when the item has no path", () => {
    expect(resolveDeliverablePath("docs/ja/projects", undefined)).toBe("docs/ja/projects");
  });

  it("re-anchors at the repo root for an absolute item path", () => {
    expect(resolveDeliverablePath("docs/ja/projects", "/docs/other/file.md")).toBe(
      "docs/other/file.md",
    );
  });
});
