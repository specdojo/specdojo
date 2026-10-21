import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerRegisterCommands } from "../../../src/register/register.js";
import { gitEnvironment } from "../../../src/shared/git.js";

const PROJECT_ONE_BRANCH = "project/prj-0001/develop";
const PROJECT_TWO_BRANCH = "project/customer-b/develop";
const PROJECT_TWO_REGISTER = "docs/ja/projects/prj-0002/controls/project-register";

function git(cwd: string, ...args: string[]): string {
  const result = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    env: gitEnvironment(),
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error(
      [result.error?.message, result.stdout, result.stderr].filter(Boolean).join("\n"),
    );
  }
  return result.stdout.trimEnd();
}

async function runRegister(args: string[]): Promise<void> {
  const program = new Command();
  program.exitOverride();
  registerRegisterCommands(program);
  await program.parseAsync(["register", ...args], { from: "user" });
}

type Fixture = { parent: string; repo: string; targetWorktree: string };

async function createFixture(openTargetWorktree: boolean): Promise<Fixture> {
  const sourceRoot = process.cwd();
  const parent = mkdtempSync(join(tmpdir(), "specdojo-cross-project-register-"));
  const repo = join(parent, "repo");
  const targetWorktree = join(parent, "target-worktree");
  mkdirSync(repo, { recursive: true });
  mkdirSync(join(repo, ".specdojo"), { recursive: true });
  writeFileSync(
    join(repo, ".specdojo/specdojo.config.json"),
    `${JSON.stringify(
      {
        version: 1,
        current_project: "prj-0001",
        projects: {
          "prj-0001": {
            base_path: "docs/ja/projects/prj-0001",
            project_register_path: "controls/project-register",
            execution_path: "execution",
          },
          "prj-0002": {
            base_path: "docs/ja/projects/prj-0002",
            integration_branch: PROJECT_TWO_BRANCH,
            project_register_path: "controls/project-register",
            execution_path: "execution",
          },
        },
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  cpSync(join(sourceRoot, "docs/ja/specdojo/templates"), join(repo, "docs/ja/specdojo/templates"), {
    recursive: true,
  });
  writeFileSync(join(repo, ".gitignore"), "**/generated/\n**/execution/exec/.locks/\n", "utf8");
  git(repo, "init", "-b", "main");
  git(repo, "config", "user.name", "SpecDojo Test");
  git(repo, "config", "user.email", "test@specdojo.invalid");
  git(repo, "add", ".");
  git(repo, "commit", "-m", "test: initial repository");
  git(repo, "branch", PROJECT_ONE_BRANCH);
  git(repo, "branch", PROJECT_TWO_BRANCH);
  git(repo, "switch", PROJECT_ONE_BRANCH);

  process.chdir(repo);
  await runRegister([
    "add",
    "--project",
    "prj-0001",
    "--type",
    "decision",
    "--title",
    "起票元を決める",
    "--topic",
    "source-decision",
    "--id",
    "PJR-SRC1",
    "--registered",
    "2026-10-21T00:00:00Z",
  ]);
  git(repo, "add", ".");
  git(repo, "commit", "-m", "test: add source register item");

  if (openTargetWorktree) git(repo, "worktree", "add", targetWorktree, PROJECT_TWO_BRANCH);
  return { parent, repo, targetWorktree };
}

async function addToProjectTwo(): Promise<void> {
  await runRegister([
    "add",
    "--project",
    "prj-0002",
    "--type",
    "todo",
    "--title",
    "別 project に追加する",
    "--topic",
    "cross-project-item",
    "--id",
    "PJR-NEW2",
    "--from",
    "prj-0001:PJR-SRC1",
    "--registered",
    "2026-10-21T01:00:00Z",
    "--commit",
  ]);
}

describe("cross-project register add", () => {
  const originalCwd = process.cwd();
  let fixture: Fixture | undefined;

  afterEach(() => {
    process.chdir(originalCwd);
    if (fixture) rmSync(fixture.parent, { recursive: true, force: true });
    fixture = undefined;
    process.exitCode = undefined;
    vi.restoreAllMocks();
  });

  it("uses an existing target worktree and commits once without changing the source worktree", async () => {
    vi.spyOn(process.stdout, "write").mockReturnValue(true);
    fixture = await createFixture(true);
    const sourceHead = git(fixture.repo, "rev-parse", "HEAD");
    const targetHead = git(fixture.repo, "rev-parse", PROJECT_TWO_BRANCH);

    await addToProjectTwo();

    expect(process.exitCode).toBeUndefined();
    expect(git(fixture.repo, "rev-parse", "HEAD")).toBe(sourceHead);
    expect(git(fixture.repo, "branch", "--show-current")).toBe(PROJECT_ONE_BRANCH);
    expect(git(fixture.repo, "rev-list", "--count", `${targetHead}..${PROJECT_TWO_BRANCH}`)).toBe(
      "1",
    );
    const ticket = join(
      fixture.targetWorktree,
      PROJECT_TWO_REGISTER,
      "pjr-new2-cross-project-item.md",
    );
    expect(readFileSync(ticket, "utf8")).toContain("derived_from:\n    - prj-0001:PJR-SRC1");
    expect(git(fixture.targetWorktree, "status", "--porcelain")).toBe("");
  });

  it("uses and removes a temporary worktree when the target branch is not open", async () => {
    vi.spyOn(process.stdout, "write").mockReturnValue(true);
    fixture = await createFixture(false);
    const sourceHead = git(fixture.repo, "rev-parse", "HEAD");
    const targetHead = git(fixture.repo, "rev-parse", PROJECT_TWO_BRANCH);

    await addToProjectTwo();

    expect(process.exitCode).toBeUndefined();
    expect(git(fixture.repo, "rev-parse", "HEAD")).toBe(sourceHead);
    expect(git(fixture.repo, "rev-list", "--count", `${targetHead}..${PROJECT_TWO_BRANCH}`)).toBe(
      "1",
    );
    expect(git(fixture.repo, "worktree", "list", "--porcelain")).not.toContain(
      `branch refs/heads/${PROJECT_TWO_BRANCH}`,
    );
    expect(
      git(
        fixture.repo,
        "show",
        `${PROJECT_TWO_BRANCH}:${PROJECT_TWO_REGISTER}/pjr-new2-cross-project-item.md`,
      ),
    ).toContain("prj-0001:PJR-SRC1");
  });

  it("stops before writing when the target register has uncommitted changes", async () => {
    vi.spyOn(process.stdout, "write").mockReturnValue(true);
    const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
    fixture = await createFixture(true);
    const targetHead = git(fixture.repo, "rev-parse", PROJECT_TWO_BRANCH);
    const dirtyPath = join(fixture.targetWorktree, PROJECT_TWO_REGISTER, "operator-note.md");
    mkdirSync(join(fixture.targetWorktree, PROJECT_TWO_REGISTER), { recursive: true });
    writeFileSync(dirtyPath, "uncommitted\n", "utf8");

    await addToProjectTwo();

    expect(process.exitCode).toBe(1);
    expect(stderr.mock.calls.flat().join("")).toContain("register has uncommitted changes");
    expect(git(fixture.repo, "rev-parse", PROJECT_TWO_BRANCH)).toBe(targetHead);
    expect(
      existsSync(
        join(fixture.targetWorktree, PROJECT_TWO_REGISTER, "pjr-new2-cross-project-item.md"),
      ),
    ).toBe(false);
  });

  it("rejects cross-project add without commit and cross-project transitions", async () => {
    vi.spyOn(process.stdout, "write").mockReturnValue(true);
    const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
    fixture = await createFixture(false);

    await runRegister([
      "add",
      "--project",
      "prj-0002",
      "--type",
      "todo",
      "--title",
      "commit なし",
      "--topic",
      "without-commit",
    ]);
    expect(process.exitCode).toBe(1);
    expect(stderr.mock.calls.flat().join("")).toContain("requires --commit");

    process.exitCode = undefined;
    stderr.mockClear();
    await runRegister(["close", "--project", "prj-0002", "--id", "PJR-NEW2"]);
    expect(process.exitCode).toBe(1);
    expect(stderr.mock.calls.flat().join("")).toContain(
      "Run the command in the worktree for project prj-0002",
    );
  });
});
