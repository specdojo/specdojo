import { spawnSync } from "node:child_process";
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  formatRegisterRunSummary,
  isRegisterFailureMode,
  parseRegisterIds,
  registerRunExitCode,
  selectRegisterCommitPaths,
  selectRegisterRunArtifactResidue,
  type RegisterItemSummary,
} from "../../src/exec-register.js";
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

function canSpawnGit(): boolean {
  const probe = mkdtempSync(join(tmpdir(), "specdojo-register-git-probe-"));
  try {
    const result = spawnSync("git", ["init"], {
      cwd: probe,
      encoding: "utf8",
      env: gitEnvironment(),
      stdio: ["ignore", "pipe", "pipe"],
    });
    return result.status === 0 && result.error === undefined;
  } finally {
    rmSync(probe, { recursive: true, force: true });
  }
}

function createGitRepository(): string {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-register-commit-"));
  git(repo, "init");
  git(repo, "config", "user.name", "SpecDojo Test");
  git(repo, "config", "user.email", "specdojo@example.invalid");
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

describe("parseRegisterIds", () => {
  it("単一の文字列を1件のリストへ正規化する", () => {
    expect(parseRegisterIds("pjr-0012")).toEqual({ ids: ["PJR-0012"], duplicates: [] });
  });

  it("カンマ区切りを指定順のリストへ展開する", () => {
    expect(parseRegisterIds("PJR-0001, pjr-0002 ,PJR-0003")).toEqual({
      ids: ["PJR-0001", "PJR-0002", "PJR-0003"],
      duplicates: [],
    });
  });

  it("variadic 配列とカンマ区切りの混在を許容する", () => {
    expect(parseRegisterIds(["PJR-0001,PJR-0002", "pjr-0003"])).toEqual({
      ids: ["PJR-0001", "PJR-0002", "PJR-0003"],
      duplicates: [],
    });
  });

  it("重複は最初の出現のみ残し、除外分を duplicates に記録する", () => {
    expect(parseRegisterIds(["PJR-0001", "pjr-0001", "PJR-0002", "PJR-0002"])).toEqual({
      ids: ["PJR-0001", "PJR-0002"],
      duplicates: ["PJR-0001", "PJR-0002"],
    });
  });

  it("IDが1件も無い場合はエラーを投げる", () => {
    expect(() => parseRegisterIds(undefined)).toThrow(/No register item ID/);
    expect(() => parseRegisterIds("  ,  ")).toThrow(/No register item ID/);
  });

  it("PJR-XXXX 形式以外はエラーを投げる", () => {
    expect(() => parseRegisterIds(["PJR-0001", "T-LAUNCH-001"])).toThrow(
      /Invalid register item ID/,
    );
  });
});

describe("isRegisterFailureMode", () => {
  it("stop / continue のみ許容する", () => {
    expect(isRegisterFailureMode("stop")).toBe(true);
    expect(isRegisterFailureMode("continue")).toBe(true);
    expect(isRegisterFailureMode("halt")).toBe(false);
  });
});

describe("selectRegisterCommitPaths", () => {
  it("実行後に新しく現れたパスだけを対象にする", () => {
    const preexisting = ["docs/user-edit.md"];
    const current = [
      "docs/user-edit.md",
      "exec/results/pjr-0001-result.md",
      "exec/plans/pjr-0001-plan.md",
    ];

    expect(selectRegisterCommitPaths(preexisting, current)).toEqual([
      "exec/plans/pjr-0001-plan.md",
      "exec/results/pjr-0001-result.md",
    ]);
  });

  it("実行前から存在する利用者の変更は除外する", () => {
    const preexisting = ["src/user-change.ts", "docs/user-note.md"];
    const current = ["src/user-change.ts", "docs/user-note.md"];

    expect(selectRegisterCommitPaths(preexisting, current)).toEqual([]);
  });

  it("runner管理パスは実行前からdirtyでも対象にする", () => {
    const preexisting = ["docs/pjr-index.md", "docs/user-note.md"];
    const current = ["docs/pjr-index.md", "docs/user-note.md", "exec/results/pjr-result.md"];

    expect(
      selectRegisterCommitPaths(preexisting, current, [
        "docs/pjr-index.md",
        "exec/results/pjr-result.md",
      ]),
    ).toEqual(["docs/pjr-index.md", "exec/results/pjr-result.md"]);
  });

  it("重複を除きソートして返す", () => {
    expect(selectRegisterCommitPaths([], ["b.md", "a.md", "b.md"])).toEqual(["a.md", "b.md"]);
  });
});

describe("selectRegisterRunArtifactResidue", () => {
  it("未commitのregister plan/resultだけを抽出する", () => {
    expect(
      selectRegisterRunArtifactResidue([
        "docs/project/execution/exec/plans/pjr-0001-20260726T010203Z-ab12-plan.md",
        "docs/project/execution/exec/results/pjr-0001-20260726T010203Z-ab12-result.md",
        "docs/project/execution/exec/results/T-001-result.md",
        "docs/user.md",
      ]),
    ).toEqual([
      "docs/project/execution/exec/plans/pjr-0001-20260726T010203Z-ab12-plan.md",
      "docs/project/execution/exec/results/pjr-0001-20260726T010203Z-ab12-result.md",
    ]);
  });
});

describe.skipIf(!canSpawnGit())("commitRegisterItemChanges", () => {
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

describe("registerRunExitCode", () => {
  const base: RegisterItemSummary = {
    id: "PJR-0001",
    title: "t",
    outcome: "success",
    transition: "review",
    commit: "off",
  };

  it("failure が1件でもあれば 1 を返す", () => {
    const summaries: RegisterItemSummary[] = [
      base,
      { ...base, id: "PJR-0002", outcome: "failure", transition: "waiting" },
    ];

    expect(registerRunExitCode(summaries)).toBe(1);
  });

  it("success と skipped のみなら 0 を返す", () => {
    const summaries: RegisterItemSummary[] = [
      base,
      { ...base, id: "PJR-0002", outcome: "skipped", transition: "none", commit: "skipped" },
    ];

    expect(registerRunExitCode(summaries)).toBe(0);
  });
});

describe("formatRegisterRunSummary", () => {
  it("ID別の成否・状態遷移・commit結果・理由を一覧化する", () => {
    const summaries: RegisterItemSummary[] = [
      {
        id: "PJR-0001",
        title: "one",
        outcome: "success",
        transition: "review",
        commit: "committed abc1234",
      },
      {
        id: "PJR-0002",
        title: "two",
        outcome: "failure",
        transition: "waiting",
        commit: "off",
        reason: "agent exited with non-zero code (exit 1)",
      },
      {
        id: "PJR-0003",
        title: "-",
        outcome: "skipped",
        transition: "none",
        commit: "skipped",
        reason: "stopped after an earlier failure (--on-failure stop)",
      },
      {
        id: "PJR-0004",
        title: "four",
        outcome: "failure",
        transition: "waiting",
        commit: "incomplete",
        reason: "register commit incomplete: target remained dirty",
      },
    ];

    const actual = formatRegisterRunSummary(summaries);

    expect(actual).toBe(
      [
        "Register run summary:",
        "  PJR-0001  success  transition=review  commit=committed abc1234",
        "  PJR-0002  failure  transition=waiting  commit=off  reason=agent exited with non-zero code (exit 1)",
        "  PJR-0003  skipped  transition=none  commit=skipped  reason=stopped after an earlier failure (--on-failure stop)",
        "  PJR-0004  failure  transition=waiting  commit=incomplete  reason=register commit incomplete: target remained dirty",
      ].join("\n"),
    );
  });
});
