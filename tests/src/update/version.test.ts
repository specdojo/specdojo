import { describe, expect, it } from "vitest";
import {
  changelogLinesMentioning,
  changelogSectionsBetween,
  compareVersions,
  parseChangelogSections,
} from "../../../src/update/version.js";

const CHANGELOG = [
  "# Changelog",
  "",
  "## [Unreleased]",
  "",
  "## [0.9.2] - 2026-11-21",
  "",
  "### 利用者から見て動きが変わる点",
  "",
  "- agy を起動しなくなりました（PJR-NJE4）。",
  "",
  "## [0.9.1] - 2026-11-20",
  "",
  "### 利用者から見て動きが変わる点",
  "",
  "- opencode の `command_template` に `--agent <name>` が必要になりました（PJR-08EK）。",
  "",
  "## [0.9.0] - 2026-11-20",
  "",
  "- Node.js 22.17 以上が必要です。",
  "",
].join("\n");

describe("compareVersions", () => {
  it("orders versions by major, minor, and patch numerically", () => {
    expect(compareVersions("0.10.0", "0.9.2")).toBeGreaterThan(0);
    expect(compareVersions("0.9.1", "0.9.2")).toBeLessThan(0);
    expect(compareVersions("1.0.0", "1.0.0")).toBe(0);
  });

  it("treats a release as newer than its prerelease", () => {
    expect(compareVersions("1.0.0", "1.0.0-rc.1")).toBeGreaterThan(0);
    expect(compareVersions("1.0.0-rc.2", "1.0.0-rc.10")).toBeLessThan(0);
  });

  it("rejects values that are not versions", () => {
    expect(() => compareVersions("latest", "1.0.0")).toThrow(/Cannot compare versions: latest/);
  });
});

describe("changelogSectionsBetween", () => {
  it("returns the sections after the current version up to the target, oldest first", () => {
    const sections = changelogSectionsBetween(CHANGELOG, "0.9.0", "0.9.2");

    expect(sections.map((section) => section.version)).toEqual(["0.9.1", "0.9.2"]);
    expect(sections[0].body).toMatch(/^## \[0\.9\.1\] - 2026-11-20\n/u);
    expect(sections[0].body).toContain("command_template");
    expect(sections[0].body).not.toContain("0.9.0");
  });

  it("excludes the Unreleased section", () => {
    const versions = parseChangelogSections(CHANGELOG).map((section) => section.version);

    expect(versions).toEqual(["0.9.2", "0.9.1", "0.9.0"]);
  });

  it("returns nothing when the versions are the same", () => {
    expect(changelogSectionsBetween(CHANGELOG, "0.9.2", "0.9.2")).toEqual([]);
  });
});

describe("changelogLinesMentioning", () => {
  it("returns bullet lines that contain any of the terms with their version", () => {
    const sections = changelogSectionsBetween(CHANGELOG, "0.9.0", "0.9.2");

    expect(changelogLinesMentioning(sections, ["command_template"])).toEqual([
      {
        version: "0.9.1",
        text: "- opencode の `command_template` に `--agent <name>` が必要になりました（PJR-08EK）。",
      },
    ]);
  });
});
