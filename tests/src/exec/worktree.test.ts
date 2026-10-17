import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  appendGitFailureLog,
  describeGitProcessFailure,
  formatGitCommandFailure,
  formatWorktreeBuildFailure,
  generateWorktreeArtifacts,
  isGitDubiousOwnership,
  isGitIndexLockContention,
  isGitNotRepositoryWithGitMetadata,
  resolveWorktreeBuildCommand,
  runGitWithTransientRetry,
  summarizeGitStderr,
  summarizeGitHookFailure,
  summarizeGitArguments,
  type TransientGitRetryNotice,
} from "../../../src/exec/worktree.js";
import { sanitizeRegisterConclusion } from "../../../src/exec/register.js";

describe("transient git failure retry", () => {
  const dubiousOwnership =
    "fatal: detected dubious ownership in repository at '/workspaces/example'";

  it("detects only the dubious ownership fatal message", () => {
    expect(isGitDubiousOwnership(dubiousOwnership)).toBe(true);
    expect(isGitDubiousOwnership("fatal: not a git repository")).toBe(false);
    expect(isGitDubiousOwnership("")).toBe(false);
  });

  it("waits before retrying a dubious ownership failure and reports the wait", () => {
    const results = [
      { status: 128, stderr: dubiousOwnership },
      { status: 0, stderr: "" },
    ];
    let calls = 0;
    const notices: TransientGitRetryNotice[] = [];
    const waits: number[] = [];

    const actual = runGitWithTransientRetry(
      () => results[calls++]!,
      (notice) => notices.push(notice),
      (milliseconds) => waits.push(milliseconds),
    );

    expect(actual.status).toBe(0);
    expect(calls).toBe(2);
    expect(waits).toEqual([2000]);
    expect(notices).toEqual([
      {
        attempt: 1,
        maxAttempts: 3,
        waitMilliseconds: 2000,
        reason: "dubious ownership",
      },
    ]);
  });

  it("widens the wait on each retry and gives up after three retries", () => {
    let calls = 0;
    const waits: number[] = [];

    const actual = runGitWithTransientRetry(
      () => {
        calls += 1;
        return { status: 128, stderr: dubiousOwnership };
      },
      () => undefined,
      (milliseconds) => waits.push(milliseconds),
    );

    expect(actual.status).toBe(128);
    expect(calls).toBe(4);
    expect(waits).toEqual([2000, 5000, 10000]);
  });

  it("succeeds when the failure clears on a later retry", () => {
    const results = [
      { status: 128, stderr: dubiousOwnership },
      { status: 128, stderr: dubiousOwnership },
      { status: 0, stderr: "" },
    ];
    let calls = 0;
    const waits: number[] = [];

    const actual = runGitWithTransientRetry(
      () => results[calls++]!,
      () => undefined,
      (milliseconds) => waits.push(milliseconds),
    );

    expect(actual.status).toBe(0);
    expect(calls).toBe(3);
    expect(waits).toEqual([2000, 5000]);
  });

  it("does not retry a different git failure", () => {
    let calls = 0;
    let retryReports = 0;

    const waits: number[] = [];
    const actual = runGitWithTransientRetry(
      () => {
        calls += 1;
        return { status: 128, stderr: "fatal: not a git repository" };
      },
      () => {
        retryReports += 1;
      },
      (milliseconds) => waits.push(milliseconds),
    );

    expect(actual.status).toBe(128);
    expect(calls).toBe(1);
    expect(retryReports).toBe(0);
    expect(waits).toEqual([]);
  });

  it("detects not-a-repository only when the working directory has git metadata", () => {
    const withGitMetadata = mkdtempSync(join(tmpdir(), "specdojo-git-retry-"));
    const withoutGitMetadata = mkdtempSync(join(tmpdir(), "specdojo-git-retry-"));
    mkdirSync(join(withGitMetadata, ".git"));

    try {
      const stderr = "warning: Not a git repository. Use --no-index to compare two paths";
      expect(isGitNotRepositoryWithGitMetadata(stderr, withGitMetadata)).toBe(true);
      expect(isGitNotRepositoryWithGitMetadata(stderr.toUpperCase(), withGitMetadata)).toBe(true);
      expect(isGitNotRepositoryWithGitMetadata(stderr, withoutGitMetadata)).toBe(false);
      expect(isGitNotRepositoryWithGitMetadata("fatal: unrelated failure", withGitMetadata)).toBe(
        false,
      );
    } finally {
      rmSync(withGitMetadata, { recursive: true, force: true });
      rmSync(withoutGitMetadata, { recursive: true, force: true });
    }
  });

  it("retries not-a-repository with git metadata and reports its reason", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-git-retry-"));
    writeFileSync(join(repoRoot, ".git"), "gitdir: ../git-dir\n", "utf8");
    const results = [
      { status: 128, stderr: "warning: Not a git repository. Use --no-index" },
      { status: 0, stderr: "" },
    ];
    let calls = 0;
    const reasons: string[] = [];
    const waits: number[] = [];

    try {
      const actual = runGitWithTransientRetry(
        () => results[calls++]!,
        ({ reason }) => reasons.push(reason),
        (milliseconds) => waits.push(milliseconds),
        repoRoot,
      );

      expect(actual.status).toBe(0);
      expect(calls).toBe(2);
      expect(reasons).toEqual(["not a git repository"]);
      expect(waits).toEqual([2000]);
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  it("does not retry not-a-repository without git metadata", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-git-retry-"));
    let calls = 0;
    const waits: number[] = [];

    try {
      const actual = runGitWithTransientRetry(
        () => {
          calls += 1;
          return { status: 128, stderr: "fatal: not a git repository" };
        },
        () => undefined,
        (milliseconds) => waits.push(milliseconds),
        repoRoot,
      );

      expect(actual.status).toBe(128);
      expect(calls).toBe(1);
      expect(waits).toEqual([]);
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  it("shares one retry limit across both transient failure reasons", () => {
    const repoRoot = mkdtempSync(join(tmpdir(), "specdojo-git-retry-"));
    mkdirSync(join(repoRoot, ".git"));
    const failures = [
      dubiousOwnership,
      "warning: Not a git repository. Use --no-index",
      dubiousOwnership,
      "warning: Not a git repository. Use --no-index",
    ];
    let calls = 0;
    const reasons: string[] = [];
    const waits: number[] = [];

    try {
      const actual = runGitWithTransientRetry(
        () => ({ status: 128, stderr: failures[calls++]! }),
        ({ reason }) => reasons.push(reason),
        (milliseconds) => waits.push(milliseconds),
        repoRoot,
      );

      expect(actual.status).toBe(128);
      expect(calls).toBe(4);
      expect(reasons).toEqual(["dubious ownership", "not a git repository", "dubious ownership"]);
      expect(waits).toEqual([2000, 5000, 10000]);
    } finally {
      rmSync(repoRoot, { recursive: true, force: true });
    }
  });

  it("keeps the existing index-lock classification separate", () => {
    expect(isGitIndexLockContention("Unable to create '/repo/.git/index.lock'")).toBe(true);
    expect(isGitDubiousOwnership(dubiousOwnership)).toBe(true);
    expect(isGitDubiousOwnership("warning: Not a git repository")).toBe(false);
  });
});

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

describe("summarizeGitStderr", () => {
  it("drops carriage-return progress and keeps the cause line that follows it", () => {
    const stderr =
      "Preparing worktree (new branch 'exec/prj-0001-PJR-G8M9')\n" +
      "Updating files:  50% (2325/4638)\rUpdating files:  99% (4591/4638)\r" +
      "Updating files: 100% (4638/4638), done.\n" +
      "fatal: could not create work tree dir: No space left on device\n";

    expect(summarizeGitStderr(stderr)).toBe(
      "fatal: could not create work tree dir: No space left on device",
    );
  });

  it("keeps the trailing lines when no line names a cause", () => {
    const stderr =
      "Preparing worktree (new branch 'exec/prj-0001-PJR-G8M9')\n" +
      "Updating files:  52% (2412/4638)\rUpdating files: 100% (4638/4638), done.\n" +
      "HEAD is now at 9d44d2c\n";

    expect(summarizeGitStderr(stderr)).toBe(
      "Preparing worktree (new branch 'exec/prj-0001-PJR-G8M9') / HEAD is now at 9d44d2c",
    );
  });

  it("returns an empty string when git wrote only progress", () => {
    expect(summarizeGitStderr("Receiving objects:  73% (100/137)\r")).toBe("");
  });

  it("truncates a long cause so that the reason keeps the beginning of the message", () => {
    const stderr = `fatal: ${"x".repeat(500)}\n`;

    const actual = summarizeGitStderr(stderr, 40);

    expect(actual).toHaveLength(40);
    expect(actual.startsWith("fatal: xxx")).toBe(true);
    expect(actual.endsWith("…")).toBe(true);
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

  it("summarizes progress-heavy stderr so that the cause survives truncation", () => {
    const stderr =
      "Preparing worktree (new branch 'exec/prj-0001-PJR-G8M9')\n" +
      "Updating files:  50% (2325/4638)\rUpdating files: 100% (4638/4638), done.\n" +
      "fatal: unable to write file docs/ja/index.md\n";

    const actual = formatGitCommandFailure(
      ["worktree", "add", "../worktrees/prj-0001-PJR-G8M9", "-b", "exec/prj-0001-PJR-G8M9"],
      stderr,
    );

    expect(actual).toContain("git worktree failed: fatal: unable to write file docs/ja/index.md");
    expect(actual).not.toContain("Updating files");
  });

  it("omits the stderr section when git wrote nothing to stderr", () => {
    expect(formatGitCommandFailure(["rev-parse", "--short", "HEAD"], "  ")).toBe(
      "git rev-parse failed (args: --short HEAD)",
    );
  });

  it("puts the process failure cause first when git wrote nothing to stderr", () => {
    expect(
      formatGitCommandFailure(
        ["status", "--porcelain=v1"],
        "",
        "output exceeded maxBuffer (ENOBUFS): spawnSync git ENOBUFS; terminated by signal SIGTERM",
      ),
    ).toBe(
      "git status failed: output exceeded maxBuffer (ENOBUFS): spawnSync git ENOBUFS; " +
        "terminated by signal SIGTERM (args: --porcelain=v1)",
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

describe("describeGitProcessFailure", () => {
  it("reports ENOBUFS and the signal when the output exceeds maxBuffer", () => {
    const result = spawnSync(
      process.execPath,
      ["-e", "process.stdout.write('x'.repeat(64 * 1024))"],
      { encoding: "utf8", maxBuffer: 1024, stdio: ["ignore", "pipe", "pipe"] },
    );

    const actual = describeGitProcessFailure(result);

    expect(result.status).toBeNull();
    expect(actual).toContain("output exceeded maxBuffer (ENOBUFS)");
    expect(actual).toContain(`terminated by signal ${result.signal}`);
  });

  it("reports the error code of a spawn failure", () => {
    const error = Object.assign(new Error("spawn git EACCES"), { code: "EACCES" });

    expect(describeGitProcessFailure({ status: null, signal: null, error })).toBe(
      "spawn git EACCES",
    );
  });

  it("returns an empty cause when git exited with its own status", () => {
    expect(describeGitProcessFailure({ status: 128, signal: null })).toBe("");
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

  it("keeps Vitest failure names and totals from the end of long hook output", () => {
    const output = [
      "┃ test ❯",
      "┃ unknown option '--reserve'",
      ...Array.from({ length: 50 }, (_, index) => `middle output ${index}`),
      "┃ FAIL  tests/src/doc-index.test.ts > project register references",
      "┃ Test Files  1 failed | 120 passed (121)",
      "┃ Tests  1 failed | 2038 passed (2039)",
    ].join("\n");

    const summary = summarizeGitHookFailure(output);

    expect(summary).toContain("test: unknown option '--reserve'");
    expect(summary).toContain("FAIL  tests/src/doc-index.test.ts");
    expect(summary).toContain("Test Files  1 failed | 120 passed (121)");
    expect(summary).toContain("Tests  1 failed | 2038 passed (2039)");
  });

  it("persists complete redacted hook output in the run log", () => {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-git-failure-log-"));
    try {
      const logPath = join(dir, "evidence", "task", "run", "integrate.log");
      appendGitFailureLog(logPath, [
        "--- stdout ---",
        "hook started; api_key=raw-secret-value",
        "--- stderr ---",
        "FAIL  tests/src/doc-index.test.ts",
        "Test Files  1 failed | 120 passed (121)",
      ]);

      const log = readFileSync(logPath, "utf8");
      expect(log).toContain("hook started; api_key=[REDACTED]");
      expect(log).toContain("FAIL  tests/src/doc-index.test.ts");
      expect(log).toContain("Test Files  1 failed | 120 passed (121)");
      expect(log).not.toContain("raw-secret-value");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
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
