import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { gitEnvironment } from "../../src/exec-worktree.js";

const REAL_REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const TSX = join(REAL_REPO_ROOT, "node_modules", ".bin", "tsx");
const CLI = join(REAL_REPO_ROOT, "src", "specdojo.ts");
const tempDirs: string[] = [];

function git(cwd: string, ...args: string[]): string {
  const result = spawnSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    env: gitEnvironment(),
  });
  if (result.status !== 0) throw new Error(String(result.stderr));
  return String(result.stdout).trim();
}

function reviewResultContent(repo: string): string {
  const reviewResults = git(repo, "ls-files", "execution")
    .split("\n")
    .filter((path) => path.endsWith("-review-result.md"));
  expect(reviewResults).toHaveLength(1);
  return readFileSync(join(repo, reviewResults[0]), "utf8");
}

function jobWorktreePath(repo: string): string {
  const entry = git(repo, "worktree", "list", "--porcelain")
    .split("\n\n")
    .find((candidate) => candidate.includes("JBR-"));
  const worktree = entry?.match(/^worktree (.+)$/m)?.[1];
  if (!worktree) throw new Error("Job Run worktree not found");
  return worktree;
}

function expectSingleTrailingNewline(content: string): void {
  expect(content.endsWith("\n")).toBe(true);
  expect(content.endsWith("\n\n")).toBe(false);
}

function write(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function setupFixture(
  verdict: "complete" | "incomplete",
  options: { declareReview?: boolean; failCommand?: boolean; omitReporter?: boolean } = {},
): {
  repo: string;
  worktrees: string;
  head: string;
} {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-job-worktree-"));
  const worktrees = mkdtempSync(join(tmpdir(), "specdojo-job-worktrees-"));
  tempDirs.push(repo, worktrees);
  for (const path of [".specdojo", "jobs", "schedule", "execution", "tools", "output"])
    mkdirSync(join(repo, path), { recursive: true });
  symlinkSync(join(REAL_REPO_ROOT, "node_modules"), join(repo, "node_modules"), "dir");
  write(join(repo, ".gitignore"), ".specdojo/doc-index.json\n**/generated/\n");
  write(
    join(repo, ".specdojo/specdojo.config.json"),
    `${JSON.stringify({
      version: 1,
      current_project: "test",
      projects: {
        test: {
          schedule_path: "schedule",
          execution_path: "execution",
          jobs_path: "jobs",
          run: { exec_defaults: ".specdojo/exec-defaults.yaml" },
        },
      },
    })}\n`,
  );
  write(join(repo, ".specdojo/exec-defaults.yaml"), "pipeline:\n  parent_validations: []\n");
  write(
    join(repo, ".specdojo/agent-members.yaml"),
    [
      "version: 1",
      "members:",
      "  - nickname: fixture-review-executor",
      "    display_name: Fixture Review Executor",
      "    email: null",
      "    roles: []",
      "    type: agent",
      "    provider: custom",
      "    mode: review",
      "    stage_role: executor",
      "    command: node tools/review-executor.mjs",
      "    capabilities: []",
      "    proficiency: normal",
      "    priority: 1",
      "  - nickname: fixture-nominated-review-executor",
      "    display_name: Fixture Nominated Review Executor",
      "    email: null",
      "    roles: []",
      "    type: agent",
      "    provider: custom",
      "    mode: review",
      "    stage_role: executor",
      "    command: node tools/review-executor.mjs",
      "    capabilities: []",
      "    proficiency: normal",
      "    priority: 9",
      ...(options.omitReporter
        ? []
        : [
            "  - nickname: fixture-reporter",
            "    display_name: Fixture Reporter",
            "    email: null",
            "    roles: []",
            "    type: agent",
            "    provider: custom",
            "    stage_role: reporter",
            "    command: node tools/review-reporter.mjs",
            "    capabilities: []",
            "    proficiency: normal",
            "    priority: 1",
          ]),
      "",
    ].join("\n"),
  );
  write(
    join(repo, "tools/review-executor.mjs"),
    `process.stdin.resume(); process.stdin.on("end", () => console.log('<specdojo_executor_evidence>{"final_message":"reviewed","validations":[]}</specdojo_executor_evidence>'));\n`,
  );
  write(
    join(repo, "tools/review-reporter.mjs"),
    `process.stdin.resume(); process.stdin.on("end", () => console.log(JSON.stringify({schema_version:1,mode:"review",grade_check:"Job Run output checked",rationale:["output commit and evidence agree"],improvements:[],approach:"read-only review",verdict:${JSON.stringify(verdict)}})));\n`,
  );
  write(
    join(repo, "jobs/job-sample.yaml"),
    [
      "id: job-sample",
      "name: Sample Job",
      "description: Create one deterministic output.",
      "task:",
      "  mode: command",
      "  command: |",
      "    mkdir -p output",
      "    git rev-parse HEAD > output/run.txt",
      ...(options.failCommand ? ["    exit 1"] : []),
      "  paths: [output]",
      ...(options.declareReview
        ? [
            "  review:",
            "    agent:",
            "      executor: fixture-nominated-review-executor",
            "      reporter: fixture-reporter",
          ]
        : []),
      "run:",
      '  idempotency_key: "{{job_id}}:{{scheduled_at}}"',
      "",
    ].join("\n"),
  );
  for (const name of [
    "xep-job-template.md",
    "xep-common-conventions-template.md",
    "xrp-job-template.md",
    "xer-template.md",
    "xrr-template.md",
  ]) {
    const from = join(REAL_REPO_ROOT, "docs/ja/specdojo/exec-templates", name);
    const to = join(repo, "docs/ja/specdojo/exec-templates", name);
    mkdirSync(dirname(to), { recursive: true });
    cpSync(from, to);
  }
  write(join(repo, "unrelated.txt"), "committed\n");
  git(repo, "init", "-b", "project/test/develop");
  git(repo, "config", "user.name", "SpecDojo Test");
  git(repo, "config", "user.email", "specdojo@example.invalid");
  git(repo, "add", ".");
  git(repo, "commit", "-m", "test: fixture");
  const head = git(repo, "rev-parse", "HEAD");
  write(join(repo, "unrelated.txt"), "user change\n");
  return { repo, worktrees, head };
}

function runJob(
  repo: string,
  worktrees: string,
  options: { worktreeFlag?: boolean; scheduledAt?: string | null } = {},
): ReturnType<typeof spawnSync> {
  const scheduledAt =
    options.scheduledAt === undefined ? "2026-10-12T01:00:00.000Z" : options.scheduledAt;
  return spawnSync(
    process.execPath,
    [
      TSX,
      CLI,
      "exec",
      "run",
      "--project",
      "test",
      "--job",
      "job-sample",
      ...(scheduledAt ? ["--scheduled-at", scheduledAt] : []),
      ...(options.worktreeFlag === false ? [] : ["--worktree"]),
      "--worktree-base",
      worktrees,
    ],
    {
      cwd: repo,
      encoding: "utf8",
      env: { ...gitEnvironment(), CI: "true", LEFTHOOK: "0" },
      timeout: 120_000,
    },
  );
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("Job Run worktree integration", () => {
  it("commits only Run output and merges an accepted review without moving root HEAD during the command", () => {
    const fixture = setupFixture("complete");
    const result = runJob(fixture.repo, fixture.worktrees);

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    expect(readFileSync(join(fixture.repo, "output/run.txt"), "utf8").trim()).toBe(fixture.head);
    expect(readFileSync(join(fixture.repo, "unrelated.txt"), "utf8")).toBe("user change\n");
    expect(git(fixture.repo, "log", "-1", "--pretty=%P").split(" ")).toHaveLength(2);
    // 利用者の変更は stage されず、作業ツリーの変更として残る。
    expect(git(fixture.repo, "diff", "--name-only")).toBe("unrelated.txt");
    expect(git(fixture.repo, "diff", "--cached", "--name-only")).toBe("");
    expect(git(fixture.repo, "worktree", "list", "--porcelain")).not.toContain("JBR-");
    expectSingleTrailingNewline(reviewResultContent(fixture.repo));
  }, 120_000);

  it("keeps the exec worktree and normalizes the result when the runner overrides a failed Job review", () => {
    const fixture = setupFixture("complete", { failCommand: true });
    const result = runJob(fixture.repo, fixture.worktrees);

    expect(result.status).toBe(1);
    expect(git(fixture.repo, "rev-parse", "HEAD")).toBe(fixture.head);
    expect(git(fixture.repo, "worktree", "list", "--porcelain")).toContain("JBR-");
    expect(existsSync(join(fixture.repo, "output/run.txt"))).toBe(false);
    expect(`${result.stdout}\n${result.stderr}`).toContain("[routine-job] waiting");
    const reviewResult = reviewResultContent(jobWorktreePath(fixture.repo));
    expect(reviewResult).toContain("- verdict: incomplete");
    expect(reviewResult).toContain("- runner 判定: ");
    expectSingleTrailingNewline(reviewResult);
  }, 120_000);

  it("fills and normalizes an incomplete result when no review reporter is available", () => {
    const fixture = setupFixture("complete", { omitReporter: true });
    const result = runJob(fixture.repo, fixture.worktrees);

    expect(result.status).toBe(1);
    expect(`${result.stdout}\n${result.stderr}`).toContain("[routine-job] waiting");
    const reviewResult = reviewResultContent(jobWorktreePath(fixture.repo));
    expect(reviewResult).toContain("- verdict: incomplete");
    expect(reviewResult).toContain("No reporter is available for Job Run review.");
    expectSingleTrailingNewline(reviewResult);
  }, 120_000);

  it("reuses the parent run identity when a reviewed manual Job omits --scheduled-at", () => {
    const fixture = setupFixture("complete", { declareReview: true });
    const result = runJob(fixture.repo, fixture.worktrees, {
      worktreeFlag: false,
      scheduledAt: null,
    });

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    const output = String(result.stdout);
    const parentRunId = output.match(/Running Job Run (JBR-[^ ]+) in /)?.[1];
    const completedRunId = output.match(/Job Run complete: (JBR-\S+)/)?.[1];
    const mergedRunId = output.match(/\[routine-job\] merged run_id=(JBR-\S+)/)?.[1];
    expect(parentRunId).toMatch(/^JBR-/);
    expect(completedRunId).toBe(parentRunId);
    expect(mergedRunId).toBe(parentRunId);
    expect(git(fixture.repo, "ls-files", `execution/jobs/runs/${parentRunId}.json`)).toBe(
      `execution/jobs/runs/${parentRunId}.json`,
    );
  }, 120_000);

  it("reviews a Job that declares task.review without --worktree using the nominated review executor", () => {
    const fixture = setupFixture("complete", { declareReview: true });
    const result = runJob(fixture.repo, fixture.worktrees, { worktreeFlag: false });

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    expect(String(result.stdout)).toContain("[routine-job] merged");
    expect(readFileSync(join(fixture.repo, "output/run.txt"), "utf8").trim()).toBe(fixture.head);
    expect(git(fixture.repo, "log", "-1", "--pretty=%P").split(" ")).toHaveLength(2);
    expect(reviewResultContent(fixture.repo)).toMatch(
      /agent: "?fixture-nominated-review-executor"?/,
    );
  }, 120_000);
});
