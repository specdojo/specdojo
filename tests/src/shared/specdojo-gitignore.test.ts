import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  DEFAULT_GITIGNORE_PATTERNS,
  GITIGNORE_HEADER,
  gitignorePatternsForLayouts,
  mergeGitignore,
  NODE_MODULES_PATTERN,
} from "../../../src/shared/specdojo-gitignore.js";
import { projectGitignoreLayout } from "../../../src/shared/specdojo-config.js";
import { gitEnvironment } from "../../../src/shared/git-environment.js";

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
  it("生成ディレクトリだけを除外し .vitepress の利用者設定を追跡対象に保つ", () => {
    const root = mkdtempSync(join(tmpdir(), "specdojo-gitignore-"));
    try {
      execFileSync("git", ["init", "--quiet", root], { env: gitEnvironment() });
      const existing = "custom-output/\n/public/mermaid/\n";
      const merged = mergeGitignore(existing, [...DEFAULT_GITIGNORE_PATTERNS]);
      writeFileSync(join(root, ".gitignore"), merged.content);
      mkdirSync(join(root, ".vitepress"));
      writeFileSync(join(root, ".vitepress/config.mts"), "export default {};");
      expect(merged.content.startsWith(existing)).toBe(true);
      const paths = [
        "dist/index.html",
        "cache/data.json",
        "mermaid/1234abcd.svg",
        "kata-staging/docs/index.md",
      ].map((file) => `.vitepress/${file}`);
      const ignored = execFileSync("git", ["check-ignore", "--stdin"], {
        cwd: root,
        env: gitEnvironment(),
        input: [...paths, ".vitepress/config.mts", ".vitepress/theme/index.ts"].join("\n") + "\n",
        encoding: "utf8",
      })
        .trim()
        .split("\n");
      expect(ignored).toEqual(paths);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("appends only the missing lines after the existing content", () => {
    const existing = "node_modules/\n.specdojo/doc-index.json\n";

    const actual = mergeGitignore(existing, ["node_modules/", ".specdojo/doc-index.json", "a/*"]);

    expect(actual).toEqual({
      content: `node_modules/\n.specdojo/doc-index.json\n\n${GITIGNORE_HEADER}\na/*\n`,
      added: ["a/*"],
      skipped: ["node_modules/", ".specdojo/doc-index.json"],
    });
  });

  it("adds node_modules/ with the defaults to a .gitignore lacking it", () => {
    const actual = mergeGitignore("dist\n", [...DEFAULT_GITIGNORE_PATTERNS]);

    expect(actual.added).toEqual([...DEFAULT_GITIGNORE_PATTERNS]);
    expect(actual.added[0]).toBe(NODE_MODULES_PATTERN);
    expect(actual.content).toBe(
      `dist\n\n${GITIGNORE_HEADER}\n${DEFAULT_GITIGNORE_PATTERNS.join("\n")}\n`,
    );
  });

  it.each([
    "node_modules",
    "/node_modules",
    "/node_modules/",
    "**/node_modules",
    "**/node_modules/",
  ])("skips node_modules/ when an equivalent line %s already exists", (line) => {
    const actual = mergeGitignore(`${line}\n`, [NODE_MODULES_PATTERN, "a/*"]);

    expect(actual).toEqual({
      content: `${line}\n\n${GITIGNORE_HEADER}\na/*\n`,
      added: ["a/*"],
      skipped: [NODE_MODULES_PATTERN],
    });
  });

  it("does not treat a nested node_modules path as excluding the root one", () => {
    const actual = mergeGitignore("packages/app/node_modules/\n", [NODE_MODULES_PATTERN]);

    expect(actual.added).toEqual([NODE_MODULES_PATTERN]);
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
