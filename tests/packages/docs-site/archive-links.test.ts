import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  loadArchiveLinks,
  resolveArchiveWikilink,
} from "../../../packages/docs-site/.vitepress/archive-links.js";

const source = { repositoryUrl: "https://github.com/specdojo/specdojo/", branch: "main" };
const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

function fixture(links: unknown): string {
  const root = mkdtempSync(join(tmpdir(), "archive-links-"));
  roots.push(root);
  const dir = join(root, "archive/ja/product/trash");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "cdfd-reporting.md"), "archived document");
  writeFileSync(join(dir, "links.json"), JSON.stringify(links));
  return root;
}

describe("archive links", () => {
  it("resolves historical IDs to source files while preserving titles", () => {
    const links = loadArchiveLinks(
      fixture({ "prj-0001:cdfd-reporting": "archive/ja/product/trash/cdfd-reporting.md" }),
    );
    expect(resolveArchiveWikilink("prj-0001:cdfd-reporting|旧報告フロー", links, source)).toEqual({
      displayText: "旧報告フロー",
      href: "https://github.com/specdojo/specdojo/blob/main/archive/ja/product/trash/cdfd-reporting.md",
    });
    expect(resolveArchiveWikilink("prj-0001:cdfd-reporting", links, source)?.displayText).toBe(
      "prj-0001:cdfd-reporting",
    );
    expect(resolveArchiveWikilink("unrelated", links, source)).toBeUndefined();
    expect(resolveArchiveWikilink("constructor", links, source)).toBeUndefined();
  });

  it("does not require an archive in user workspaces", () => {
    const root = mkdtempSync(join(tmpdir(), "no-archive-"));
    roots.push(root);
    expect(loadArchiveLinks(root)).toEqual({});
  });

  it.each([
    [[]],
    [{ old: "archive/ja/product/trash/missing.md" }],
    [{ old: "archive/ja/product/trash/../../outside.md" }],
    [{ old: "docs/ja/current.md" }],
    [{ old: 42 }],
  ])("rejects invalid or missing source targets: %j", (links) => {
    expect(() => loadArchiveLinks(fixture(links))).toThrow(/Invalid archive link/);
  });
});
