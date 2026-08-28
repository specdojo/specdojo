import { spawnSync } from "node:child_process";
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { commitRegisterItemChanges } from "../../src/exec-run.js";
import { gitEnvironment } from "../../src/exec-worktree.js";
import type { PjrItem } from "../../src/register.js";

function git(cwd: string, ...args: string[]): string {
  const result = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    env: gitEnvironment(),
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    const detail = [result.error?.message, result.stdout, result.stderr].filter(Boolean).join("\n");
    throw new Error(`git ${args.join(" ")} failed${detail ? `:\n${detail}` : ""}`);
  }
  return result.stdout.trimEnd();
}

function createGitRepository(): string {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-register-commit-"));
  git(repo, "init");
  mkdirSync(join(repo, "src"), { recursive: true });
  mkdirSync(join(repo, "docs"), { recursive: true });
  writeFileSync(join(repo, "src", "target.ts"), 'const value = "initial";\n', "utf8");
  writeFileSync(join(repo, "docs", "user.md"), "initial\n", "utf8");
  writeFileSync(join(repo, "docs", "pjr-index.md"), "open\n", "utf8");
  git(repo, "add", ".");
  git(repo, "commit", "-m", "initial");
  return repo;
}

function makeItem(id = "PJR-0001"): PjrItem {
  return {
    id,
    status: "in-progress",
    title: "register commit test",
    description: "test",
    type: "issue",
    priority: "high",
    owner: "ARC",
    registeredAt: "_TODO_",
    due: "-",
    completedAt: "-",
    conclusion: "-",
    ticket: "-",
  };
}

describe("commitRegisterItemChanges", () => {
  it("hookが整形した対象を同じIDのcommitへ収束させ、次IDでも同じパスをcommitできる", () => {
    const repo = createGitRepository();
    try {
      const hookPath = join(repo, ".git", "hooks", "pre-commit");
      writeFileSync(
        hookPath,
        [
          "#!/bin/sh",
          "if grep -q UNFORMATTED src/target.ts; then",
          '  printf "const value = \\"formatted\\";\\n" > src/target.ts',
          "  git add src/target.ts",
          "fi",
          "",
        ].join("\n"),
        "utf8",
      );
      chmodSync(hookPath, 0o755);

      writeFileSync(join(repo, "docs", "user.md"), "user change\n", "utf8");
      const firstPreexisting = ["docs/user.md"];
      writeFileSync(join(repo, "src", "target.ts"), "UNFORMATTED\n", "utf8");

      const first = commitRegisterItemChanges(repo, makeItem("PJR-0001"), firstPreexisting, []);

      expect(first.committed).toBe(true);
      expect(git(repo, "show", "HEAD:src/target.ts")).toBe('const value = "formatted";');
      expect(git(repo, "status", "--porcelain")).toBe(" M docs/user.md");

      const secondPreexisting = ["docs/user.md"];
      writeFileSync(join(repo, "src", "target.ts"), "UNFORMATTED second\n", "utf8");

      const second = commitRegisterItemChanges(repo, makeItem("PJR-0002"), secondPreexisting, []);

      expect(second.committed).toBe(true);
      expect(git(repo, "show", "HEAD:src/target.ts")).toBe('const value = "formatted";');
      expect(git(repo, "status", "--porcelain")).toBe(" M docs/user.md");
      expect(git(repo, "rev-list", "--count", "HEAD")).toBe("3");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it("runner管理パスを含めつつ、開始前からある利用者変更は残す", () => {
    const repo = createGitRepository();
    try {
      writeFileSync(join(repo, "docs", "user.md"), "user change\n", "utf8");
      writeFileSync(join(repo, "docs", "pjr-index.md"), "in-progress\n", "utf8");
      const preexisting = ["docs/pjr-index.md", "docs/user.md"];

      mkdirSync(join(repo, "exec", "plans"), { recursive: true });
      writeFileSync(join(repo, "docs", "pjr-index.md"), "review\n", "utf8");
      writeFileSync(join(repo, "exec", "plans", "pjr-plan.md"), "plan\n", "utf8");

      const result = commitRegisterItemChanges(repo, makeItem(), preexisting, [
        "docs/pjr-index.md",
        "exec/plans/pjr-plan.md",
      ]);

      expect(result.committed).toBe(true);
      expect(git(repo, "show", "HEAD:docs/pjr-index.md")).toBe("review");
      expect(git(repo, "show", "HEAD:exec/plans/pjr-plan.md")).toBe("plan");
      expect(readFileSync(join(repo, "docs", "user.md"), "utf8")).toBe("user change\n");
      expect(git(repo, "status", "--porcelain")).toBe(" M docs/user.md");
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });
});
