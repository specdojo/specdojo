import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  formatGitCommandFailure,
  formatWorktreeBuildFailure,
  generateWorktreeArtifacts,
  resolveWorktreeBuildCommand,
  summarizeGitHookFailure,
  summarizeGitArguments,
} from "../../src/exec-worktree.js";
import { sanitizeRegisterConclusion } from "../../src/exec-register.js";

describe("summarizeGitArguments", () => {
  it("keeps arguments as-is when there is no pathspec separator", () => {
    expect(summarizeGitArguments(["--no-renames", "--name-only", "-z"])).toBe(
      "--no-renames --name-only -z",
    );
  });

  it("replaces the pathspec after -- with its count", () => {
    const actual = summarizeGitArguments([
      "-m",
      "exec",
      "--",
      "docs/a.md",
      "docs/b.md",
      "docs/c.md",
    ]);

    expect(actual).toBe("-m exec -- 3 paths");
  });

  it("uses the singular form for a single pathspec", () => {
    expect(summarizeGitArguments(["--", "docs/a.md"])).toBe("-- 1 path");
  });

  it("abbreviates an argument longer than the per-argument limit", () => {
    const actual = summarizeGitArguments(["-m", "x".repeat(60)]);

    expect(actual).toBe(`-m ${"x".repeat(39)}…`);
  });
});

describe("formatGitCommandFailure", () => {
  it("puts the git stderr before the argument summary", () => {
    const actual = formatGitCommandFailure(
      ["commit", "-m", "exec(register PJR-TA5C): title", "--", "docs/a.md", "docs/b.md"],
      "error: cannot commit\n",
    );

    expect(actual).toBe(
      "git commit failed: error: cannot commit " +
        "(args: -m exec(register PJR-TA5C): title -- 2 paths)",
    );
  });

  it("omits the stderr section when git wrote nothing to stderr", () => {
    expect(formatGitCommandFailure(["rev-parse", "--short", "HEAD"], "  ")).toBe(
      "git rev-parse failed (args: --short HEAD)",
    );
  });

  it("keeps the whole stderr in the record limit even with many pathspec entries", () => {
    const paths = Array.from(
      { length: 40 },
      (_, index) => `docs/ja/projects/prj-0001/file-${index}.md`,
    );
    const stderr = "fatal: cannot lock ref 'HEAD': unable to create lock file .git/index.lock";

    const reason = sanitizeRegisterConclusion(
      `integrate failed: ${formatGitCommandFailure(["commit", "-m", "title", "--", ...paths], stderr)}`,
    );

    expect(reason).toContain(stderr);
    expect(reason).toContain("-- 40 paths");
  });
});

describe("summarizeGitHookFailure", () => {
  it("keeps the failed step and first error while removing terminal decoration", () => {
    const output = [
      "\u001b[31m╭──────── hook output ────────╮\u001b[0m",
      "┃ typecheck ❯",
      "┃ src/example.ts(4,2): error TS2322: Type 'number' is not assignable to type 'string'.",
      "┃ another error that is intentionally omitted",
      "╰─────────────────────────────╯",
    ].join("\n");

    expect(summarizeGitHookFailure(output)).toBe(
      "typecheck: src/example.ts(4,2): error TS2322: Type 'number' is not assignable to type 'string'.",
    );
  });
});

describe("generateWorktreeArtifacts", () => {
  function createWorktreeDirectory(withSpecdojoConfig: boolean): string {
    const worktree = mkdtempSync(join(tmpdir(), "specdojo-worktree-artifacts-"));
    if (withSpecdojoConfig) {
      mkdirSync(join(worktree, ".specdojo"), { recursive: true });
      writeFileSync(
        join(worktree, ".specdojo", "specdojo.config.json"),
        `${JSON.stringify({ version: 1, projects: {} }, null, 2)}\n`,
        "utf8",
      );
    }
    return worktree;
  }

  it("builds generated artifacts in the worktree when it holds a SpecDojo config", () => {
    const worktree = createWorktreeDirectory(true);
    const built: string[] = [];

    try {
      generateWorktreeArtifacts(worktree, (worktreePath) => built.push(worktreePath));

      expect(built).toEqual([resolve(worktree)]);
    } finally {
      rmSync(worktree, { recursive: true, force: true });
    }
  });

  it("skips the build when the worktree has no SpecDojo config", () => {
    const worktree = createWorktreeDirectory(false);
    const built: string[] = [];

    try {
      generateWorktreeArtifacts(worktree, (worktreePath) => built.push(worktreePath));

      expect(built).toEqual([]);
    } finally {
      rmSync(worktree, { recursive: true, force: true });
    }
  });
});

describe("resolveWorktreeBuildCommand", () => {
  function createWorktree(entries: readonly string[]): string {
    const worktree = mkdtempSync(join(tmpdir(), "specdojo-worktree-cli-"));
    for (const entry of entries) {
      const target = join(worktree, entry);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, "", "utf8");
    }
    return worktree;
  }

  it("prefers the worktree's own source entry run through its local tsx", () => {
    const worktree = createWorktree([
      join("src", "specdojo.ts"),
      join("node_modules", ".bin", "tsx"),
      join("dist", "specdojo.js"),
    ]);

    try {
      expect(resolveWorktreeBuildCommand(worktree)).toEqual({
        command: process.execPath,
        args: [
          join(worktree, "node_modules", ".bin", "tsx"),
          join(worktree, "src", "specdojo.ts"),
          "build",
        ],
      });
    } finally {
      rmSync(worktree, { recursive: true, force: true });
    }
  });

  it("falls back to the installed CLI binary, then to the built entry", () => {
    const consumer = createWorktree([join("node_modules", ".bin", "specdojo")]);
    const built = createWorktree([join("dist", "specdojo.js")]);

    try {
      expect(resolveWorktreeBuildCommand(consumer)).toEqual({
        command: join(consumer, "node_modules", ".bin", "specdojo"),
        args: ["build"],
      });
      expect(resolveWorktreeBuildCommand(built)).toEqual({
        command: process.execPath,
        args: [join(built, "dist", "specdojo.js"), "build"],
      });
    } finally {
      rmSync(consumer, { recursive: true, force: true });
      rmSync(built, { recursive: true, force: true });
    }
  });

  it("returns null when the worktree holds no runnable SpecDojo CLI", () => {
    const worktree = createWorktree([join("src", "specdojo.ts")]);

    try {
      expect(resolveWorktreeBuildCommand(worktree)).toBeNull();
    } finally {
      rmSync(worktree, { recursive: true, force: true });
    }
  });
});

describe("formatWorktreeBuildFailure", () => {
  it("names the preparation step so the failure is not read as a deliverable failure", () => {
    const actual = formatWorktreeBuildFailure("/tmp/worktrees/prj-0001-PJR-E6QJ", "exited with 1");

    expect(actual).toContain("Worktree preparation failed: specdojo build exited with 1");
    expect(actual).toContain("/tmp/worktrees/prj-0001-PJR-E6QJ");
    expect(actual).toContain("not a task deliverable failure");
  });
});
