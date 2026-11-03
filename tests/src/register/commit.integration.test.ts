import { spawnSync } from "node:child_process";
import {
  chmodSync,
  cpSync,
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
import { execLifecyclePoolPath } from "../../../src/exec/run/lock.js";
import { CrossProcessMutex } from "../../../src/exec/slot-lock.js";
import { gitEnvironment } from "../../../src/exec/worktree.js";
import { registerRegisterCommands } from "../../../src/register/register.js";

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

  it.each(["unstaged", "staged", "partially-staged"])(
    "コマンドが変更した個票と event だけを commit し、開始前の %s 変更を残す",
    async (state) => {
      vi.spyOn(process.stdout, "write").mockReturnValue(true);
      root = await createRepository();
      writeFileSync(join(root, "notes.md"), "user change\n", "utf8");
      if (state !== "unstaged") git(root, "add", "notes.md");
      if (state === "partially-staged") {
        writeFileSync(join(root, "notes.md"), "later user change\n", "utf8");
      }
      // 失敗した checkpoint の event が root の index に残った事象を再現する。
      const event = `${EXECUTION_REL}/exec/events/leftover.json`;
      mkdirSync(join(root, EXECUTION_REL, "exec/events"), { recursive: true });
      writeFileSync(join(root, event), '{"type":"claim"}\n', "utf8");
      git(root, "add", event);
      const stagedBefore = git(root, "diff", "--cached", "--binary");
      const statusBefore = git(root, "status", "--porcelain");

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
      expect(git(root, "status", "--porcelain")).toBe(statusBefore);
      expect(git(root, "diff", "--cached", "--binary")).toBe(stagedBefore);
    },
  );

  it.each(["pre-commit", "commit-msg"])(
    "%s が失敗してもコマンドの stage だけを戻し、本文と既存の index を残す",
    async (hook) => {
      vi.spyOn(process.stdout, "write").mockReturnValue(true);
      const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
      root = await createRepository();
      writeFileSync(join(root, "notes.md"), "staged by user\n", "utf8");
      git(root, "add", "notes.md");
      writeFileSync(join(root, "notes.md"), "unstaged by user\n", "utf8");
      const stagedBefore = git(root, "diff", "--cached", "--binary");
      const headBefore = git(root, "rev-parse", "HEAD");
      const hookPath = join(root, ".git/hooks", hook);
      writeFileSync(hookPath, "#!/bin/sh\necho 'intentional hook failure' >&2\nexit 1\n", "utf8");
      chmodSync(hookPath, 0o755);

      await runRegister(["update", "--id", "PJR-AB12", "--owner", "DEV", "--commit"]);

      expect(process.exitCode).toBe(1);
      expect(stderr.mock.calls.flat().join("")).toContain("intentional hook failure");
      expect(git(root, "rev-parse", "HEAD")).toBe(headBefore);
      expect(git(root, "diff", "--cached", "--binary")).toBe(stagedBefore);
      expect(readFileSync(join(root, "notes.md"), "utf8")).toBe("unstaged by user\n");
      expect(
        readFileSync(join(root, REGISTER_REL, "pjr-ab12-lifecycle-commit.md"), "utf8"),
      ).toContain("owner: DEV");
      expect(readFileSync(join(root, REGISTER_REL, "events/pjr-ab12.yaml"), "utf8")).toContain(
        "DEV",
      );
    },
  );

  it.each([false, true])(
    "hook 整形後の amend で無関係な stage を保持する（amend 拒否: %s）",
    async (rejectAmend) => {
      vi.spyOn(process.stdout, "write").mockReturnValue(true);
      vi.spyOn(process.stderr, "write").mockReturnValue(true);
      root = await createRepository();
      writeFileSync(join(root, "notes.md"), "staged by user\n", "utf8");
      git(root, "add", "notes.md");
      const stagedBefore = git(root, "diff", "--cached", "--binary");
      // 初回 commit 後に整形差分を作り、収束の amend を実際に通す。
      const postCommit = join(root, ".git/hooks/post-commit");
      writeFileSync(
        postCommit,
        [
          "#!/bin/sh",
          'marker="$(git rev-parse --git-path formatted-once)"',
          'if [ ! -f "$marker" ]; then',
          '  touch "$marker"',
          `  printf '\\nHook formatted.\\n' >> '${REGISTER_REL}/pjr-ab12-lifecycle-commit.md'`,
          "fi",
          "",
        ].join("\n"),
        "utf8",
      );
      chmodSync(postCommit, 0o755);
      if (rejectAmend) {
        const preCommit = join(root, ".git/hooks/pre-commit");
        writeFileSync(
          preCommit,
          '#!/bin/sh\nif [ -f "$(git rev-parse --git-path formatted-once)" ]; then\n  echo "amend rejected" >&2\n  exit 1\nfi\n',
          "utf8",
        );
        chmodSync(preCommit, 0o755);
      }

      await runRegister(["update", "--id", "PJR-AB12", "--owner", "DEV", "--commit"]);

      expect(process.exitCode).toBe(rejectAmend ? 1 : undefined);
      expect(git(root, "rev-list", "--count", "HEAD")).toBe("2");
      expect(git(root, "show", "--name-only", "--format=", "HEAD").split("\n").sort()).toEqual([
        `${REGISTER_REL}/events/pjr-ab12.yaml`,
        `${REGISTER_REL}/pjr-ab12-lifecycle-commit.md`,
      ]);
      expect(git(root, "diff", "--cached", "--binary")).toBe(stagedBefore);
      expect(
        git(root, "show", `HEAD:${REGISTER_REL}/pjr-ab12-lifecycle-commit.md`).includes(
          "Hook formatted.",
        ),
      ).toBe(!rejectAmend);
      expect(
        readFileSync(join(root, REGISTER_REL, "pjr-ab12-lifecycle-commit.md"), "utf8"),
      ).toContain("Hook formatted.");
    },
  );

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
