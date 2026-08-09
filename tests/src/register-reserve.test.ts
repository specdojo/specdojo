import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it, vi } from "vitest";
import { gitEnvironment } from "../../src/exec-worktree.js";
import {
  type ReservationFields,
  PJR_ID_RE,
  collectRegisterItemIds,
  generatePjrId,
  planReservation,
  printCommandError,
  reservePjrIdOnIntegration,
  resolveIntegrationWorktree,
  syncIntegrationWorktree,
} from "../../src/register.js";

function git(cwd: string, ...args: string[]): string {
  return execFileSync("git", args, { cwd, encoding: "utf8", env: gitEnvironment() }).trim();
}

const REGISTER_DIR_REL = "docs/ja/projects/prj-0001/controls/project-register";
const PJR_INDEX_REL = `${REGISTER_DIR_REL}/pjr-index.md`;

function buildIndex(rows: string[]): string {
  return [
    "# Project Register",
    "",
    "## 1. Registered Items",
    "",
    "<!-- prettier-ignore -->",
    "| ID | Status | Title | Description | Type | Priority | Owner | Registered | Due | Completed | Conclusion | Ticket |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}

const EXISTING_ROW =
  "| PJR-0001 | open | first | desc | todo | high | ARC | 2026-01-01 | 2026-01-01 | - | - | - |";

const DEFAULT_FIELDS: ReservationFields = {
  type: "todo",
  title: "reserve title",
  description: "_TODO_",
  priority: "medium",
  status: "open",
  owner: "_TODO_",
  registered: "2026-01-02",
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

describe("planReservation — 個票ファイル名と割り当て ID の算出", () => {
  it("ID を省略すると 32 文字セットの 4 桁ランダム ID を採番し、個票ファイル名を返す", () => {
    const result = planReservation({
      existingIds: ["PJR-0001"],
      fields: DEFAULT_FIELDS,
      topic: "inventory-seed",
    });

    expect(result.assignedId).toMatch(PJR_ID_RE);
    expect(result.assignedId).not.toBe("PJR-0001");
    expect(result.ticketFilename).toBe(`${result.assignedId.toLowerCase()}-inventory-seed.md`);
  });

  it("明示 ID が既存と競合する場合はエラーで終了する", () => {
    expect(() =>
      planReservation({
        existingIds: ["PJR-0001"],
        explicitId: "PJR-0001",
        fields: DEFAULT_FIELDS,
        topic: "inventory-seed",
      }),
    ).toThrow(/ID already exists in the project register: PJR-0001/);
  });

  it("不正な項目値は書き込み前にまとめて検証する", () => {
    expect(() =>
      planReservation({
        existingIds: [],
        fields: { ...DEFAULT_FIELDS, priority: "urgent" },
        topic: "inventory-seed",
      }),
    ).toThrow(/Invalid priority: "urgent"/);
  });
});

describe("collectRegisterItemIds — 採番済み ID の収集", () => {
  let repo: string | undefined;

  afterEach(() => {
    if (repo) rmSync(repo, { recursive: true, force: true });
    repo = undefined;
  });

  it("個票ファイル名と未移行の pjr-index 行の双方から ID を集める", () => {
    repo = createIntegrationRepo();
    const registerDir = join(repo, REGISTER_DIR_REL);
    writeFileSync(join(registerDir, "pjr-ab12-inventory-seed.md"), "# PJR-AB12 seed\n", "utf8");
    // 個票の命名規約に合わないファイルは対象外。
    writeFileSync(join(registerDir, "README.md"), "# readme\n", "utf8");

    expect(collectRegisterItemIds(registerDir)).toEqual(["PJR-0001", "PJR-AB12"]);
  });
});

describe("generatePjrId — ランダム ID 採番と再抽選", () => {
  it("曖昧文字を除いた 32 文字セットの 4 桁 ID を生成する", () => {
    const id = generatePjrId([]);

    expect(id).toMatch(PJR_ID_RE);
    expect(id.slice("PJR-".length)).not.toMatch(/[ILOU]/);
  });

  it("候補が既存 ID と一致した場合は再抽選する", () => {
    const candidates = ["PJR-0001", "PJR-AB12"];
    let index = 0;

    const id = generatePjrId(["PJR-0001"], () => candidates[index++]);

    expect(id).toBe("PJR-AB12");
  });

  it("候補が不適切語ブロックリストに一致した場合は再抽選する", () => {
    const candidates = ["PJR-DAMN", "PJR-AB12"];
    let index = 0;

    const id = generatePjrId([], () => candidates[index++]);

    expect(id).toBe("PJR-AB12");
  });

  it("上限回数内で採番できない場合は文脈付きで失敗する", () => {
    expect(() => generatePjrId(["PJR-0001"], () => "PJR-0001", 3)).toThrow(
      /Failed to generate an unused PJR-ID/,
    );
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

describe("printCommandError — register のエラーを stderr へ分離", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
  });

  it("エラーメッセージを stderr へ書き、stdout を汚さない", () => {
    const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
    const stdout = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    printCommandError(new Error("integration worktree not found"));

    // stdout はコマンド置換で git -C の引数に渡るため、エラー文字列を混ぜてはならない。
    expect(stdout).not.toHaveBeenCalled();
    expect(stderr).toHaveBeenCalledWith("integration worktree not found\n");
    expect(process.exitCode).toBe(1);
  });

  it("Error 以外の値も stderr へ文字列化して書く", () => {
    const stderr = vi.spyOn(process.stderr, "write").mockReturnValue(true);
    const stdout = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    printCommandError("plain failure");

    expect(stdout).not.toHaveBeenCalled();
    expect(stderr).toHaveBeenCalledWith("plain failure\n");
    expect(process.exitCode).toBe(1);
  });
});

describe("reservePjrIdOnIntegration — 統合ブランチへの予約", () => {
  let repo: string | undefined;

  afterEach(() => {
    vi.restoreAllMocks();
    if (repo) rmSync(repo, { recursive: true, force: true });
    repo = undefined;
  });

  const reserve = (
    repoPath: string,
    overrides: Partial<Parameters<typeof reservePjrIdOnIntegration>[0]> = {},
  ): { assignedId: string } =>
    reservePjrIdOnIntegration({
      worktreePath: repoPath,
      registerDirRel: REGISTER_DIR_REL,
      fields: DEFAULT_FIELDS,
      topic: "inventory-seed",
      makeContent: (assignedId) => `# ${assignedId} ticket body\n`,
      dryRun: false,
      ...overrides,
    });

  it("個票だけを作成・commit し、割り当て ID を stdout へ返す", () => {
    repo = createIntegrationRepo();
    const stdout = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const id = reserve(repo).assignedId;

    expect(id).toMatch(PJR_ID_RE);
    const ticketRel = `${REGISTER_DIR_REL}/${id.toLowerCase()}-inventory-seed.md`;
    expect(readFileSync(join(repo, ticketRel), "utf8")).toBe(`# ${id} ticket body\n`);
    // 一覧（pjr-index.md）へは行を追記しない
    expect(readFileSync(join(repo, PJR_INDEX_REL), "utf8")).not.toContain(id);

    // commit は個票のみを対象とする
    const committedFiles = git(repo, "show", "--name-only", "--pretty=format:", "HEAD")
      .split("\n")
      .filter(Boolean);
    expect(committedFiles).toEqual([ticketRel]);
    expect(git(repo, "log", "-1", "--pretty=format:%s")).toContain(id);

    // 割り当て ID が stdout の最終行として返る
    const printed = stdout.mock.calls.map((call) => String(call[0])).join("");
    expect(printed.trim().split("\n").pop()).toBe(id);
  });

  it("統合ブランチ側の他の変更を予約 commit に巻き込まない", () => {
    repo = createIntegrationRepo();
    // 予約とは無関係な未 commit の変更を worktree に作る
    writeFileSync(join(repo, "README.md"), "# test changed\n", "utf8");
    vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const id = reserve(repo).assignedId;

    // 予約 commit には README.md を含めない
    const committedFiles = git(repo, "show", "--name-only", "--pretty=format:", "HEAD")
      .split("\n")
      .filter(Boolean);
    expect(committedFiles).toEqual([`${REGISTER_DIR_REL}/${id.toLowerCase()}-inventory-seed.md`]);
    // README.md の変更は worktree に未 commit で残る
    expect(git(repo, "status", "--porcelain=v1", "--", "README.md")).toContain("README.md");
  });

  it("既存個票と同じ ID の予約は書き込まずにエラーで終了する", () => {
    repo = createIntegrationRepo();
    writeFileSync(
      join(repo, REGISTER_DIR_REL, "pjr-ab12-existing.md"),
      "# PJR-AB12 existing\n",
      "utf8",
    );

    expect(() => reserve(repo!, { explicitId: "PJR-AB12" })).toThrow(
      /ID already exists in the project register: PJR-AB12/,
    );

    expect(existsSync(join(repo, REGISTER_DIR_REL, "pjr-ab12-inventory-seed.md"))).toBe(false);
  });

  it("未移行の pjr-index 行と競合する予約も書き込まずにエラーで終了する", () => {
    repo = createIntegrationRepo();
    const before = readFileSync(join(repo, PJR_INDEX_REL), "utf8");

    expect(() => reserve(repo!, { explicitId: "PJR-0001" })).toThrow(
      /ID already exists in the project register: PJR-0001/,
    );

    expect(readFileSync(join(repo, PJR_INDEX_REL), "utf8")).toBe(before);
  });

  it("dry-run では書き込まず、割り当て予定 ID を表示する", () => {
    repo = createIntegrationRepo();
    const stdout = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    const result = reserve(repo, { dryRun: true });

    expect(result.assignedId).toMatch(PJR_ID_RE);
    expect(
      existsSync(
        join(repo!, REGISTER_DIR_REL, `${result.assignedId.toLowerCase()}-inventory-seed.md`),
      ),
    ).toBe(false);
    const previewed = stdout.mock.calls.some((call) => String(call[0]).includes("Would reserve"));
    expect(previewed).toBe(true);
  });
});

describe("syncIntegrationWorktree — 予約前の fetch + ff-only 同期", () => {
  const repos: string[] = [];

  afterEach(() => {
    vi.restoreAllMocks();
    for (const repo of repos.splice(0)) rmSync(repo, { recursive: true, force: true });
  });

  // origin（bare）と、それを clone した作業リポジトリ 2 つ（a / b）を用意する。
  function createOriginAndClones(): { origin: string; a: string; b: string } {
    const origin = mkdtempSync(join(tmpdir(), "specdojo-sync-origin-"));
    git(origin, "init", "--bare", "--initial-branch=main");

    const a = mkdtempSync(join(tmpdir(), "specdojo-sync-a-"));
    execFileSync("git", ["clone", origin, a], { encoding: "utf8", env: gitEnvironment() });
    git(a, "config", "user.name", "SpecDojo Test");
    git(a, "config", "user.email", "specdojo@example.invalid");
    git(a, "config", "commit.gpgsign", "false");
    writeFileSync(join(a, "f.txt"), "1\n", "utf8");
    git(a, "add", "f.txt");
    git(a, "commit", "-m", "seed");
    git(a, "push", "-u", "origin", "main");

    const b = mkdtempSync(join(tmpdir(), "specdojo-sync-b-"));
    execFileSync("git", ["clone", origin, b], { encoding: "utf8", env: gitEnvironment() });
    git(b, "config", "user.name", "SpecDojo Test");
    git(b, "config", "user.email", "specdojo@example.invalid");
    git(b, "config", "commit.gpgsign", "false");

    repos.push(origin, a, b);
    return { origin, a, b };
  }

  // origin を到達不能なパスに設定し、git fetch を確実に失敗させる。
  function repoWithUnreachableRemote(): string {
    const repo = createIntegrationRepo();
    repos.push(repo);
    git(repo, "remote", "add", "origin", join(tmpdir(), "specdojo-missing-remote-xyzabc.git"));
    return repo;
  }

  it("fetch が失敗しても strictSync=false なら警告して継続する", () => {
    const repo = repoWithUnreachableRemote();
    const stdout = vi.spyOn(process.stdout, "write").mockReturnValue(true);

    expect(() => syncIntegrationWorktree({ worktreePath: repo, strictSync: false })).not.toThrow();

    const warned = stdout.mock.calls.some((call) => String(call[0]).includes("git fetch failed"));
    expect(warned).toBe(true);
  });

  it("fetch が失敗し strictSync=true なら書き込み前に中断する", () => {
    const repo = repoWithUnreachableRemote();

    expect(() => syncIntegrationWorktree({ worktreePath: repo, strictSync: true })).toThrow(
      /Failed to fetch the integration branch/,
    );
  });

  it("upstream に遅れている場合は ff-only で最新化する", () => {
    const { a, b } = createOriginAndClones();
    // b が origin を進め、a を遅らせる
    writeFileSync(join(b, "f.txt"), "2\n", "utf8");
    git(b, "add", "f.txt");
    git(b, "commit", "-m", "advance");
    git(b, "push", "origin", "main");
    vi.spyOn(process.stdout, "write").mockReturnValue(true);

    syncIntegrationWorktree({ worktreePath: a, strictSync: false });

    expect(readFileSync(join(a, "f.txt"), "utf8")).toBe("2\n");
  });

  it("origin から分岐している場合は ff 不可でエラーにする", () => {
    const { a, b } = createOriginAndClones();
    // a はローカル commit を持ち、origin は別の commit で進む → 分岐
    writeFileSync(join(a, "g.txt"), "local\n", "utf8");
    git(a, "add", "g.txt");
    git(a, "commit", "-m", "local-only");
    writeFileSync(join(b, "f.txt"), "2\n", "utf8");
    git(b, "add", "f.txt");
    git(b, "commit", "-m", "remote-only");
    git(b, "push", "origin", "main");

    expect(() => syncIntegrationWorktree({ worktreePath: a, strictSync: false })).toThrow(
      /diverged from .*fast-forward is not possible/s,
    );
  });
});
