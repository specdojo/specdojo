import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { gitEnvironment } from "../../src/exec-worktree.js";
import { registerStatePaths } from "../../src/exec-run.js";
import type { RegisterPaths } from "../../src/register.js";

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", env: gitEnvironment() }).trim();
}

const REGISTER_REL = "docs/ja/projects/prj-x/controls/project-register";

// worktree register 実行の状態遷移が変更する調整状態（pjr-index と派生ビュー）だけを
// registerStatePaths が拾い、成果物・plan/result・無関係な変更は拾わないことを確認する。
describe("registerStatePaths", () => {
  let repo: string | undefined;

  afterEach(() => {
    if (repo) rmSync(repo, { recursive: true, force: true });
    repo = undefined;
  });

  function paths(repoRoot: string): RegisterPaths {
    const absRegister = join(repoRoot, REGISTER_REL);
    return {
      projectId: "prj-x",
      projectRegisterPath: absRegister,
      pjrIndexPath: join(absRegister, "pjr-index.md"),
      generatedPath: join(absRegister, "generated"),
      controlsGeneratedPath: join(repoRoot, "docs/ja/projects/prj-x/controls/generated"),
      registerDateTimeZone: "UTC",
    };
  }

  function setup(): string {
    const dir = mkdtempSync(join(tmpdir(), "specdojo-reg-state-"));
    git(dir, "init");
    git(dir, "config", "user.name", "SpecDojo Test");
    git(dir, "config", "user.email", "specdojo@example.invalid");
    git(dir, "config", "commit.gpgsign", "false");
    mkdirSync(join(dir, REGISTER_REL, "generated"), { recursive: true });
    mkdirSync(join(dir, "docs/ja/projects/prj-x/controls/generated"), { recursive: true });
    mkdirSync(join(dir, "docs/ja/projects/prj-x"), { recursive: true });
    writeFileSync(join(dir, REGISTER_REL, "pjr-index.md"), "# index\n", "utf8");
    writeFileSync(join(dir, "README.md"), "# r\n", "utf8");
    git(dir, "add", "-A");
    git(dir, "commit", "-m", "initial");
    return dir;
  }

  it("selects only pjr-index and derived views, excluding deliverables and unrelated changes", () => {
    repo = setup();
    // register state changes (should be selected)
    writeFileSync(join(repo, REGISTER_REL, "pjr-index.md"), "# index changed\n", "utf8");
    writeFileSync(join(repo, REGISTER_REL, "generated", "pjr-views.md"), "views\n", "utf8");
    writeFileSync(
      join(repo, "docs/ja/projects/prj-x/controls/generated", "pm-issue-log.md"),
      "issues\n",
      "utf8",
    );
    // non-state changes (should be excluded)
    writeFileSync(join(repo, "docs/ja/projects/prj-x/deliverable.md"), "# d\n", "utf8");
    writeFileSync(join(repo, "README.md"), "# r changed\n", "utf8");

    const selected = registerStatePaths(repo, paths(repo));

    expect(selected).toEqual([
      "docs/ja/projects/prj-x/controls/generated/pm-issue-log.md",
      `${REGISTER_REL}/generated/pjr-views.md`,
      `${REGISTER_REL}/pjr-index.md`,
    ]);
  });

  it("selects the register item file that holds the transitioned status", () => {
    repo = setup();
    const ticketRel = `${REGISTER_REL}/pjr-ab12-topic.md`;
    // 状態遷移の書き込み先は個票 frontmatter（正本）。
    writeFileSync(join(repo, ticketRel), "# PJR-AB12 item\n", "utf8");
    // 同じディレクトリでも対象外の個票は拾わない。
    writeFileSync(join(repo, REGISTER_REL, "pjr-cd34-other.md"), "# PJR-CD34 other\n", "utf8");

    const selected = registerStatePaths(repo, paths(repo), join(repo, ticketRel));

    expect(selected).toEqual([ticketRel]);
  });

  it("returns an empty list when no register state changed", () => {
    repo = setup();
    writeFileSync(join(repo, "docs/ja/projects/prj-x/deliverable.md"), "# d\n", "utf8");

    expect(registerStatePaths(repo, paths(repo))).toEqual([]);
  });
});
