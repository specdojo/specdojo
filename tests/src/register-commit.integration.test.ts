import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { execLifecyclePoolPath } from "../../src/exec-run-lock.js";
import { CrossProcessMutex } from "../../src/exec-slot-lock.js";
import { gitEnvironment } from "../../src/exec-worktree.js";
import { registerRegisterCommands } from "../../src/register.js";

const REGISTER_REL = "docs/ja/projects/prj-0001/controls/project-register";
const EXECUTION_REL = "docs/ja/projects/prj-0001/execution";

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

async function createRepository(): Promise<string> {
  const sourceRoot = process.cwd();
  const root = mkdtempSync(join(tmpdir(), "specdojo-register-lifecycle-"));
  mkdirSync(join(root, ".specdojo"), { recursive: true });
  writeFileSync(
    join(root, ".specdojo/specdojo.config.json"),
    `${JSON.stringify(
      {
        version: 1,
        current_project: "prj-0001",
        projects: {
          "prj-0001": {
            base_path: "docs/ja/projects/prj-0001",
            project_register_path: "controls/project-register",
            execution_path: "execution",
            run: { register_date_timezone: "UTC" },
          },
        },
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  cpSync(join(sourceRoot, "docs/ja/specdojo/templates"), join(root, "docs/ja/specdojo/templates"), {
    recursive: true,
  });
  mkdirSync(join(root, REGISTER_REL), { recursive: true });
  writeFileSync(join(root, ".gitignore"), "**/generated/\n.specdojo/doc-index.json\n", "utf8");
  writeFileSync(join(root, "notes.md"), "clean\n", "utf8");
  git(root, "init");

  process.chdir(root);
  await runRegister([
    "add",
    "--project",
    "prj-0001",
    "--type",
    "todo",
    "--title",
    "ライフサイクル枠を確認する",
    "--description",
    "記帳 commit の統合テスト。",
    "--topic",
    "lifecycle-commit",
    "--id",
    "PJR-AB12",
    "--registered",
    "2026-09-29T00:00:00Z",
  ]);
  git(root, "add", ".");
  git(root, "commit", "-m", "test: initial register");
  return root;
}

describe("register --commit", () => {
  const originalCwd = process.cwd();
  let root: string | undefined;

  afterEach(() => {
    process.chdir(originalCwd);
    if (root) rmSync(root, { recursive: true, force: true });
    root = undefined;
    process.exitCode = undefined;
    vi.restoreAllMocks();
  });

  it("コマンドが変更した個票と event だけを commit し、開始前の変更を残す", async () => {
    vi.spyOn(process.stdout, "write").mockReturnValue(true);
    root = await createRepository();
    writeFileSync(join(root, "notes.md"), "user change\n", "utf8");

    await runRegister([
      "update",
      "--project",
      "prj-0001",
      "--id",
      "PJR-AB12",
      "--owner",
      "DEV",
      "--commit",
    ]);

    expect(git(root, "log", "-1", "--format=%s")).toBe(
      "docs(register PJR-AB12): update ライフサイクル枠を確認する",
    );
    expect(git(root, "show", "--name-only", "--format=", "HEAD").split("\n").sort()).toEqual([
      `${REGISTER_REL}/events/pjr-ab12.yaml`,
      `${REGISTER_REL}/pjr-ab12-lifecycle-commit.md`,
    ]);
    expect(git(root, "status", "--porcelain")).toBe(" M notes.md");
  });

  it("exec と同じ register lifecycle 枠が空くまで待ってから記帳・build・commit する", async () => {
    vi.spyOn(process.stdout, "write").mockReturnValue(true);
    root = await createRepository();

    let releaseHolder!: () => void;
    let holderAcquired!: () => void;
    const acquired = new Promise<void>((resolve) => {
      holderAcquired = resolve;
    });
    const holder = new CrossProcessMutex(execLifecyclePoolPath(join(root, EXECUTION_REL)), {
      actor: "exec-run",
      label: "PJR-OTHER",
    });
    const holding = holder.runExclusive(async () => {
      holderAcquired();
      await new Promise<void>((resolve) => {
        releaseHolder = resolve;
      });
    });
    await acquired;

    let finished = false;
    const recording = runRegister([
      "start",
      "--project",
      "prj-0001",
      "--id",
      "PJR-AB12",
      "--commit",
      "-m",
      "docs(register PJR-AB12): start under lifecycle lock",
    ]).then(() => {
      finished = true;
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(finished).toBe(false);
    expect(git(root, "rev-list", "--count", "HEAD")).toBe("1");

    releaseHolder();
    await holding;
    await recording;

    expect(finished).toBe(true);
    expect(git(root, "rev-list", "--count", "HEAD")).toBe("2");
    expect(git(root, "log", "-1", "--format=%s")).toBe(
      "docs(register PJR-AB12): start under lifecycle lock",
    );
    expect(
      readFileSync(join(root, REGISTER_REL, "pjr-ab12-lifecycle-commit.md"), "utf8"),
    ).toContain("item_status: in-progress");
  });
});
