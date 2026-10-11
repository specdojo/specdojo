import { describe, expect, it } from "vitest";
import {
  DEFAULT_GITIGNORE_PATTERNS,
  GITIGNORE_HEADER,
  gitignorePatternsForLayouts,
  mergeGitignore,
} from "../../src/specdojo-gitignore.js";
import { projectGitignoreLayout } from "../../src/specdojo-config.js";

describe("gitignorePatternsForLayouts", () => {
  it("returns only the defaults when the project lives under docs/", () => {
    const layout = projectGitignoreLayout({
      base_path: "docs/ja/projects/prj-0001",
      project_register_path: "controls/project-register",
    });

    expect(gitignorePatternsForLayouts([layout])).toEqual([...DEFAULT_GITIGNORE_PATTERNS]);
  });

  it("derives patterns from base_path when the project lives outside docs/", () => {
    const layout = projectGitignoreLayout({
      base_path: "specs/prj-0001/",
      project_register_path: "controls/project-register",
    });

    expect(gitignorePatternsForLayouts([layout])).toEqual([
      ...DEFAULT_GITIGNORE_PATTERNS,
      "specs/prj-0001/**/generated/*",
      "!specs/prj-0001/**/generated/.gitkeep",
      "specs/prj-0001/execution/exec/.locks/",
    ]);
  });

  it("derives patterns from each configured path when base_path is absent", () => {
    const layout = projectGitignoreLayout({
      project_register_path: "register",
      execution_path: "docs/ops/run",
    });

    expect(gitignorePatternsForLayouts([layout])).toEqual([
      ...DEFAULT_GITIGNORE_PATTERNS,
      "schedule/**/generated/*",
      "!schedule/**/generated/.gitkeep",
      "timeline/**/generated/*",
      "!timeline/**/generated/.gitkeep",
      "register/**/generated/*",
      "!register/**/generated/.gitkeep",
      "docs/ops/run/exec/.locks/",
    ]);
  });

  it("ignores paths pointing outside the repository", () => {
    const patterns = gitignorePatternsForLayouts([
      { basePath: "../other-repo/prj", projectPaths: [], executionPath: "../other-repo/run" },
    ]);

    expect(patterns).toEqual([...DEFAULT_GITIGNORE_PATTERNS]);
  });
});

describe("mergeGitignore", () => {
  it("appends only the missing lines after the existing content", () => {
    const existing = "node_modules/\n.specdojo/doc-index.json\n";

    const actual = mergeGitignore(existing, ["node_modules/", ".specdojo/doc-index.json", "a/*"]);

    expect(actual).toEqual({
      content: `node_modules/\n.specdojo/doc-index.json\n\n${GITIGNORE_HEADER}\na/*\n`,
      added: ["a/*"],
      skipped: ["node_modules/", ".specdojo/doc-index.json"],
    });
  });

  it("returns the same content when merged twice", () => {
    const first = mergeGitignore("dist\n", ["a/*", "!a/.gitkeep"]);

    const second = mergeGitignore(first.content, ["a/*", "!a/.gitkeep"]);

    expect(second.content).toBe(first.content);
    expect(second.added).toEqual([]);
    expect(second.skipped).toEqual(["a/*", "!a/.gitkeep"]);
  });

  it("keeps CRLF line endings and terminates a last line lacking a newline", () => {
    const actual = mergeGitignore("dist\r\nbuild", ["a/*"]);

    expect(actual.content).toBe(`dist\r\nbuild\r\n\r\n${GITIGNORE_HEADER}\r\na/*\r\n`);
  });

  it("writes only the header and patterns into an empty file", () => {
    const actual = mergeGitignore("", ["a/*"]);

    expect(actual.content).toBe(`${GITIGNORE_HEADER}\na/*\n`);
  });
});
