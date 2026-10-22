import { spawnSync } from "node:child_process";
import {
  chmodSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerRegisterCommands } from "../../../src/register/register.js";
import { gitEnvironment } from "../../../src/shared/git.js";

const TARGET_BRANCH = "project/prj-target/develop";
const TARGET_REGISTER = "docs/project-register";

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

type Fixture = { parent: string; source: string; target: string };

function shellQuote(value: string): string {
  return `'${value.replaceAll("'", `'\\''`)}'`;
}

function createFixture(installTargetCli: boolean): Fixture {
  const sourceRoot = process.cwd();
  const parent = mkdtempSync(join(tmpdir(), "specdojo-external-register-"));
  const source = join(parent, "source");
  const target = join(parent, "target");
  mkdirSync(join(source, ".specdojo"), { recursive: true });
  mkdirSync(join(target, ".specdojo"), { recursive: true });
  writeFileSync(
    join(source, ".specdojo/specdojo.config.json"),
    `${JSON.stringify(
      {
        version: 1,
        current_project: "prj-source",
        projects: { "prj-source": {} },
        external_projects: {
          customer: { path: "../target", project_id: "prj-target" },
        },
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    join(target, ".specdojo/specdojo.config.json"),
    `${JSON.stringify(
      {
        version: 1,
        current_project: "prj-host",
        projects: {
          "prj-host": {},
          "prj-target": {
            base_path: "docs",
            integration_branch: TARGET_BRANCH,
            project_register_path: "project-register",
            execution_path: "execution",
          },
        },
      },
      null,
      2,
    )}\n`,
  );
  cpSync(
    join(sourceRoot, "docs/ja/specdojo/templates"),
    join(target, "docs/ja/specdojo/templates"),
    { recursive: true },
  );
  writeFileSync(join(target, ".gitignore"), "**/generated/\n**/execution/exec/.locks/\n");

  if (installTargetCli) {
    const binDir = join(target, "node_modules/.bin");
    mkdirSync(binDir, { recursive: true });
    const executable = join(binDir, "specdojo");
    writeFileSync(
      executable,
      "#!/bin/sh\n" +
        `exec ${shellQuote(process.execPath)} ${shellQuote(join(sourceRoot, "node_modules/tsx/dist/cli.mjs"))} ` +
        `${shellQuote(join(sourceRoot, "src/specdojo.ts"))} "$@"\n`,
    );
    chmodSync(executable, 0o755);
  }

  for (const repo of [source, target]) {
    git(repo, "init", "-b", "main");
    git(repo, "config", "user.name", "SpecDojo Test");
    git(repo, "config", "user.email", "test@specdojo.invalid");
    git(repo, "add", ".");
    git(repo, "commit", "-m", "test: initial repository");
  }
  git(target, "branch", TARGET_BRANCH);
  return { parent, source, target };
}

function targetCli(fixture: Fixture, ...args: string[]): void {
  const result = spawnSync(join(fixture.target, "node_modules/.bin/specdojo"), args, {
    cwd: fixture.target,
    encoding: "utf8",
    env: process.env,
  });
  if (result.status !== 0) {
    throw new Error([result.stdout, result.stderr].filter(Boolean).join("\n"));
  }
}

describe("cross-repository register add", () => {
  const originalCwd = process.cwd();
  let fixture: Fixture | undefined;

  afterEach(() => {
    process.chdir(originalCwd);
    if (fixture) rmSync(fixture.parent, { recursive: true, force: true });
    fixture = undefined;
    process.exitCode = undefined;
    vi.restoreAllMocks();
  });

  it("delegates to the target CLI, commits once on its integration branch, and leaves the source unchanged", async () => {
    fixture = createFixture(true);
    targetCli(
      fixture,
      "register",
      "add",
      "--project",
      "prj-target",
      "--type",
      "decision",
      "--title",
      "起票元",
      "--topic",
      "source-item",
      "--id",
      "PJR-SRC1",
      "--commit",
    );
    const targetHead = git(fixture.target, "rev-parse", TARGET_BRANCH);
    const sourceHead = git(fixture.source, "rev-parse", "HEAD");
    const sourceStatus = git(fixture.source, "status", "--porcelain");
    process.chdir(fixture.source);

    await runRegister([
      "add",
      "--project",
      "customer",
      "--type",
      "todo",
      "--title",
      "別リポジトリへ追加する",
      "--topic",
      "external-item",
      "--id",
      "PJR-NEW1",
      "--from",
      "customer:PJR-SRC1",
      "--commit",
    ]);

    expect(process.exitCode).toBeUndefined();
    expect(git(fixture.source, "rev-parse", "HEAD")).toBe(sourceHead);
    expect(git(fixture.source, "status", "--porcelain")).toBe(sourceStatus);
    expect(git(fixture.target, "rev-list", "--count", `${targetHead}..${TARGET_BRANCH}`)).toBe("1");
    const content = git(
      fixture.target,
      "show",
      `${TARGET_BRANCH}:${TARGET_REGISTER}/pjr-new1-external-item.md`,
    );
    expect(content).toContain("derived_from:\n    - prj-target:PJR-SRC1");
    expect(existsSync(join(fixture.source, "docs"))).toBe(false);
  });

  it("stops before writing when the target repository has no SpecDojo installation", async () => {
    fixture = createFixture(false);
    const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
    const targetHead = git(fixture.target, "rev-parse", TARGET_BRANCH);
    process.chdir(fixture.source);

    await runRegister([
      "add",
      "--project",
      "customer",
      "--type",
      "todo",
      "--title",
      "失敗する起票",
      "--topic",
      "missing-cli",
      "--commit",
    ]);

    expect(process.exitCode).toBe(1);
    expect(stderr.mock.calls.flat().join("")).toContain("does not have SpecDojo installed");
    expect(git(fixture.target, "rev-parse", TARGET_BRANCH)).toBe(targetHead);
    expect(git(fixture.target, "ls-tree", "-r", "--name-only", TARGET_BRANCH)).not.toContain(
      "missing-cli",
    );
  });

  it("directs external-project state transitions to the target repository", async () => {
    fixture = createFixture(false);
    const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
    process.chdir(fixture.source);

    await runRegister(["close", "--project", "customer", "--id", "PJR-ANY1"]);

    expect(process.exitCode).toBe(1);
    expect(stderr.mock.calls.flat().join("")).toContain(
      `Run the command in ${fixture.target} for project prj-target`,
    );
  });
});
