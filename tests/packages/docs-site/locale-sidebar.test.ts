import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  scanLocaleSidebar,
  shouldScanLocaleSidebar,
} from "../../../packages/docs-site/.vitepress/locale-sidebar.js";

describe("locale sidebar scanning", () => {
  let workspaceRoot: string;

  beforeEach(async () => {
    workspaceRoot = await mkdtemp(path.join(tmpdir(), "specdojo-locale-sidebar-"));
  });

  afterEach(async () => {
    await rm(workspaceRoot, { recursive: true, force: true });
  });

  it("scans the locale whose folder exists under the document root", async () => {
    await mkdir(path.join(workspaceRoot, "docs", "ja"), { recursive: true });

    expect(shouldScanLocaleSidebar(workspaceRoot, "docs", "ja")).toBe(true);
  });

  it("skips scanning when docs/en is missing (workspace created by config init)", async () => {
    await mkdir(path.join(workspaceRoot, "docs", "ja"), { recursive: true });
    let scanCount = 0;

    const actual = scanLocaleSidebar(workspaceRoot, "docs", "en", () => {
      scanCount += 1;
      return [{ text: "unexpected" }];
    });

    expect(actual).toEqual([]);
    expect(scanCount).toBe(0);
  });

  it("skips scanning when docs/ja is missing but docs/en exists", async () => {
    await mkdir(path.join(workspaceRoot, "docs", "en"), { recursive: true });
    let scanCount = 0;

    const actual = scanLocaleSidebar(workspaceRoot, "docs", "ja", () => {
      scanCount += 1;
      return [{ text: "unexpected" }];
    });

    expect(actual).toEqual([]);
    expect(scanCount).toBe(0);
    expect(shouldScanLocaleSidebar(workspaceRoot, "docs", "en")).toBe(true);
  });

  it("skips scanning when the locale path is a file instead of a folder", async () => {
    await mkdir(path.join(workspaceRoot, "docs"), { recursive: true });
    await writeFile(path.join(workspaceRoot, "docs", "en"), "not a folder\n", "utf8");

    expect(shouldScanLocaleSidebar(workspaceRoot, "docs", "en")).toBe(false);
  });

  it("returns the scanned items when the locale folder exists", async () => {
    await mkdir(path.join(workspaceRoot, "docs", "en"), { recursive: true });

    const actual = scanLocaleSidebar(workspaceRoot, "docs", "en", () => [
      { text: "Guide", link: "/en/guide" },
    ]);

    expect(actual).toEqual([{ text: "Guide", link: "/en/guide" }]);
  });
});
