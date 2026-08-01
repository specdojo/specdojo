import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it, vi } from "vitest";
import { gitEnvironment } from "../../src/exec-worktree.js";
import {
  type ReservationFields,
  planReservationRow,
  reservePjrIdOnIntegration,
  resolveIntegrationWorktree,
} from "../../src/register.js";

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", env: gitEnvironment() }).trim();
}

const PJR_INDEX_REL = "docs/ja/projects/prj-0001/controls/project-register/pjr-index.md";

function buildIndex(rows: string[]): string {
  return [
    "# Project Register",
    "",
    "## 1. Registered Items",
    "",
    "<!-- prettier-ignore -->",
    "| ID | Status | Title | Description | Type | Priority | Owner | Due | Completed | Conclusion | Ticket |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}

const EXISTING_ROW =
  "| PJR-0001 | open | first | desc | todo | high | ARC | 2026-01-01 | - | - | - |";

const DEFAULT_FIELDS: ReservationFields = {
  type: "todo",
  title: "reserve title",
  description: "_TODO_",
  priority: "medium",
  status: "open",
  owner: "_TODO_",
  due: "_TODO_",
  completed: "-",
  conclusion: "-",
};

// integration branch "main" を持つ git リポジトリを一時ディレクトリに作り、pjr-index.md を commit する。
function createIntegrationRepo(rows: string[] = [EXISTING_ROW]): string {
  const repo = mkdtempSync(join(tmpdir(), "specdojo-reserve-repo-"));
  git(repo, "init");
  git(repo, "config", "user.name", "SpecDojo Test");
  git(repo, "config", "user.email", "specdojo@example.invalid");
  git(repo, "config", "commit.gpgsign", "false");
  writeFileSync(join(repo, "README.md"), "# test\n", "utf8");
  git(repo, "add", "README.md");
  git(repo, "commit", "-m", "initial");
  git(repo, "branch", "-M", "main");
  mkdirSync(join(repo, "docs/ja/projects/prj-0001/controls/project-register"), { recursive: true });
  writeFileSync(join(repo, PJR_INDEX_REL), buildIndex(rows), "utf8");
  git(repo, "add", PJR_INDEX_REL);
  git(repo, "commit", "-m", "add pjr-index");
  return repo;
}

describe("planReservationRow — 予約行と割り当て ID の算出", () => {
  it("ID を省略すると最大値 +1 で採番し、ticket セルは `-` になる", () => {
    const result = planReservationRow({
      content: buildIndex([EXISTING_ROW]),
      fields: DEFAULT_FIELDS,
    });

    expect(result.assignedId).toBe("PJR-0002");
    expect(result.newRow).toContain("| PJR-0002 | open | reserve title |");
    expect(result.newRow.trimEnd().endsWith("| - |")).toBe(true);
    expect(result.newContent).toContain("| PJR-0001 | open | first |");
    expect(result.newContent).toContain("| PJR-0002 | open | reserve title |");
  });

  it("明示 ID が既存と競合する場合はエラーで終了する", () => {
    expect(() =>
      planReservationRow({
        content: buildIndex([EXISTING_ROW]),
        explicitId: "PJR-0001",
        fields: DEFAULT_FIELDS,
      }),
    ).toThrow(/ID already exists in pjr-index.md: PJR-0001/);
  });

  it("ticketTopic を渡すと ticket セルに個票リンクを埋め、個票ファイル名を返す", () => {
    const result = planReservationRow({
      content: buildIndex([EXISTING_ROW]),
      fields: DEFAULT_FIELDS,
      ticketTopic: "inventory-seed",
    });

    expect(result.assignedId).toBe("PJR-0002");
    expect(result.ticketFilename).toBe("pjr-0002-inventory-seed.md");
    expect(result.newRow).toContain("| [pjr-0002-inventory-seed](./pjr-0002-inventory-seed.md) |");
  });
});

describe("resolveIntegrationWorktree — 統合ブランチ worktree の解決", () => {
  let repo: string | undefined;

  afterEach(() => {
    if (repo) rmSync(repo, { recursive: true, force: true });
    repo = undefined;
  });

  it("branch 名に一致する worktree を返す", () => {
    repo = createIntegrationRepo();

    const target = resolveIntegrationWorktree(repo, { branch: "main" });

    expect(resolve(target.path)).toBe(resolve(repo));
    expect(target.branch).toBe("main");
  });

  it("該当 branch の worktree が無い場合はエラーで終了する", () => {
    repo = createIntegrationRepo();

    expect(() => resolveIntegrationWorktree(repo!, { branch: "does-not-exist" })).toThrow(
      /No worktree is checked out on integration branch "does-not-exist"/,
    );
  });
});

describe("reservePjrIdOnIntegration — 統合ブランチへの予約", () => {
  let repo: string | undefined;

  afterEach(() => {
    vi.restoreAllMocks();
    if (repo) rmSync(repo, { recursive: true, force: true });
    repo = undefined;
  });

  it("登録行だけを追記・commit し、割り当て ID を stdout へ返す", () => {
    repo = createIntegrationRepo();
    const stdout = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = reservePjrIdOnIntegration({
      worktreePath: repo,
      pjrIndexRel: PJR_INDEX_REL,
      fields: DEFAULT_FIELDS,
      dryRun: false,
    });

    expect(result.assignedId).toBe("PJR-0002");
    const content = readFileSync(join(repo, PJR_INDEX_REL), "utf8");
    expect(content).toContain("| PJR-0002 | open | reserve title |");
    // 個票は作らない: ticket セルは `-`
    expect(content).toContain(
      "| PJR-0002 | open | reserve title | _TODO_ | todo | medium | _TODO_",
    );

    // commit は pjr-index.md のみを対象とする
    const committedFiles = git(repo, "show", "--name-only", "--pretty=format:", "HEAD")
      .split("\n")
      .filter(Boolean);
    expect(committedFiles).toEqual([PJR_INDEX_REL]);
    expect(git(repo, "log", "-1", "--pretty=format:%s")).toContain("PJR-0002");

    // 割り当て ID が stdout の最終行として返る
    const printed = stdout.mock.calls.map((call) => String(call[0])).join("");
    expect(printed.trim().split("\n").pop()).toBe("PJR-0002");
  });

  it("ticket を渡すと登録行と個票を同じ commit に含め、行に個票リンクを埋める", () => {
    repo = createIntegrationRepo();
    vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = reservePjrIdOnIntegration({
      worktreePath: repo,
      pjrIndexRel: PJR_INDEX_REL,
      fields: DEFAULT_FIELDS,
      dryRun: false,
      ticket: {
        topic: "inventory-seed",
        makeContent: (assignedId) => `# ${assignedId} ticket body\n`,
      },
    });

    expect(result.assignedId).toBe("PJR-0002");

    const ticketRel = PJR_INDEX_REL.replace("pjr-index.md", "pjr-0002-inventory-seed.md");
    expect(readFileSync(join(repo, ticketRel), "utf8")).toBe("# PJR-0002 ticket body\n");

    const index = readFileSync(join(repo, PJR_INDEX_REL), "utf8");
    expect(index).toContain("| [pjr-0002-inventory-seed](./pjr-0002-inventory-seed.md) |");

    // 登録行と個票が同じ commit に含まれる
    const committedFiles = git(repo, "show", "--name-only", "--pretty=format:", "HEAD")
      .split("\n")
      .filter(Boolean)
      .sort();
    expect(committedFiles).toEqual([PJR_INDEX_REL, ticketRel].sort());
  });

  it("統合ブランチ側の他の変更を予約 commit に巻き込まない", () => {
    repo = createIntegrationRepo();
    // 予約とは無関係な未 commit の変更を worktree に作る
    writeFileSync(join(repo, "README.md"), "# test changed\n", "utf8");
    vi.spyOn(process.stdout, "write").mockReturnValue(true);

    reservePjrIdOnIntegration({
      worktreePath: repo,
      pjrIndexRel: PJR_INDEX_REL,
      fields: DEFAULT_FIELDS,
      dryRun: false,
    });

    // 予約 commit には README.md を含めない
    const committedFiles = git(repo, "show", "--name-only", "--pretty=format:", "HEAD")
      .split("\n")
      .filter(Boolean);
    expect(committedFiles).toEqual([PJR_INDEX_REL]);
    // README.md の変更は worktree に未 commit で残る
    expect(git(repo, "status", "--porcelain=v1", "--", "README.md")).toContain("README.md");
  });

  it("pjr-index.md に未 commit の変更がある場合は書き込まずにエラーで終了する", () => {
    repo = createIntegrationRepo();
    const before = readFileSync(join(repo, PJR_INDEX_REL), "utf8");
    // pjr-index.md をコミットせずに変更しておく
    writeFileSync(join(repo, PJR_INDEX_REL), before + "\n<!-- dirty -->\n", "utf8");
    const dirty = readFileSync(join(repo, PJR_INDEX_REL), "utf8");

    expect(() =>
      reservePjrIdOnIntegration({
        worktreePath: repo!,
        pjrIndexRel: PJR_INDEX_REL,
        fields: DEFAULT_FIELDS,
        dryRun: false,
      }),
    ).toThrow(/uncommitted changes to .*pjr-index\.md/);

    // ファイルは書き換えられていない（予約行が追記されていない）
    expect(readFileSync(join(repo, PJR_INDEX_REL), "utf8")).toBe(dirty);
  });

  it("既存 ID と競合する予約は書き込まずにエラーで終了する", () => {
    repo = createIntegrationRepo();
    const before = readFileSync(join(repo, PJR_INDEX_REL), "utf8");

    expect(() =>
      reservePjrIdOnIntegration({
        worktreePath: repo!,
        pjrIndexRel: PJR_INDEX_REL,
        explicitId: "PJR-0001",
        fields: DEFAULT_FIELDS,
        dryRun: false,
      }),
    ).toThrow(/ID already exists in pjr-index.md: PJR-0001/);

    expect(readFileSync(join(repo, PJR_INDEX_REL), "utf8")).toBe(before);
  });

  it("dry-run では書き込まず、割り当て予定 ID を表示する", () => {
    repo = createIntegrationRepo();
    const before = readFileSync(join(repo, PJR_INDEX_REL), "utf8");
    const stdout = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = reservePjrIdOnIntegration({
      worktreePath: repo,
      pjrIndexRel: PJR_INDEX_REL,
      fields: DEFAULT_FIELDS,
      dryRun: true,
    });

    expect(result.assignedId).toBe("PJR-0002");
    expect(readFileSync(join(repo, PJR_INDEX_REL), "utf8")).toBe(before);
    const previewed = stdout.mock.calls.some((call) => String(call[0]).includes("Would reserve"));
    expect(previewed).toBe(true);
  });
});
