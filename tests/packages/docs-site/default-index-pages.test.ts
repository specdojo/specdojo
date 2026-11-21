import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { readProjectEntries } from "../../../packages/docs-site/.vitepress/default-index-pages.js";
import {
  KATA_STAGING_DIR_NAME,
  stageBundledKata,
} from "../../../packages/docs-site/.vitepress/kata-staging.js";

const PROJECT_DIR = "docs/ja/projects/prj-0001";
const REGISTER_INDEX = `${PROJECT_DIR}/controls/project-register/generated/pjr-index.md`;
const STATUS_VIEW = `${PROJECT_DIR}/controls/project-register/generated/pjr-views-by-status.md`;
const DECISION_LOG = `${PROJECT_DIR}/controls/generated/pm-decision-log.md`;

function writeText(root: string, relativePath: string, content: string): void {
  const absolutePath = join(root, relativePath);
  mkdirSync(dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, content, "utf8");
}

function writeConfig(workspaceRoot: string, projects: Record<string, unknown>): void {
  writeText(
    workspaceRoot,
    ".specdojo/specdojo.config.json",
    JSON.stringify({ version: 1, current_project: "prj-0001", projects }),
  );
}

function readStaged(workspaceRoot: string, relativePath: string): string {
  return readFileSync(join(workspaceRoot, KATA_STAGING_DIR_NAME, relativePath), "utf8");
}

describe("docs-site default index pages", () => {
  const originalPackageRoot = process.env.SPECDOJO_PACKAGE_ROOT;
  let root: string;
  let workspaceRoot: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "specdojo-default-index-"));
    workspaceRoot = join(root, "workspace");
    const packageRoot = join(root, "package");
    writeText(packageRoot, "docs/ja/specdojo/index.md", "# SpecDojo ハンドブック\n");
    process.env.SPECDOJO_PACKAGE_ROOT = packageRoot;
    writeConfig(workspaceRoot, {
      "prj-0001": {
        base_path: PROJECT_DIR,
        project_register_path: "controls/project-register",
      },
    });
  });

  afterEach(() => {
    if (originalPackageRoot === undefined) delete process.env.SPECDOJO_PACKAGE_ROOT;
    else process.env.SPECDOJO_PACKAGE_ROOT = originalPackageRoot;
    rmSync(root, { recursive: true, force: true });
  });

  it("index.md が無いとサイトのトップへ SpecDojo の文書と project へのリンクを置く", () => {
    stageBundledKata(workspaceRoot);

    const top = readStaged(workspaceRoot, "docs/index.md");
    expect(top).toContain("- [SpecDojo の文書](./ja/specdojo/index.md)");
    expect(top).toContain("- [prj-0001](./ja/projects/prj-0001/index.md)");
    expect(existsSync(join(workspaceRoot, "docs/index.md"))).toBe(false);
  });

  it("project のトップへ存在する登録簿の一覧・派生ビュー・管理ログだけをリンクする", () => {
    writeText(workspaceRoot, REGISTER_INDEX, "# プロジェクト登録簿\n");
    writeText(workspaceRoot, STATUS_VIEW, "# 台帳ビュー（状態別）\n");
    writeText(workspaceRoot, DECISION_LOG, "# 決定記録\n");

    stageBundledKata(workspaceRoot);

    const page = readStaged(workspaceRoot, `${PROJECT_DIR}/index.md`);
    expect(page).toContain(
      "- [プロジェクト登録簿](./controls/project-register/generated/pjr-index.md)",
    );
    expect(page).toContain(
      "- [台帳ビュー（状態別）](./controls/project-register/generated/pjr-views-by-status.md)",
    );
    expect(page).toContain("- [決定記録](./controls/generated/pm-decision-log.md)");
    expect(page).not.toContain("pjr-views-by-owner");
    expect(page).not.toContain("pm-issue-log");
  });

  it("利用リポジトリの index.md があるときはそちらを採用して上書きしない", () => {
    writeText(workspaceRoot, "docs/index.md", "# 利用者のトップ\n");
    writeText(workspaceRoot, `${PROJECT_DIR}/index.md`, "# 利用者の project トップ\n");

    stageBundledKata(workspaceRoot);

    expect(readStaged(workspaceRoot, "docs/index.md")).toBe("# 利用者のトップ\n");
    expect(readStaged(workspaceRoot, `${PROJECT_DIR}/index.md`)).toBe(
      "# 利用者の project トップ\n",
    );
  });

  it("dev 中に利用側の index.md を消すと用意したトップのページへ戻す", () => {
    writeText(workspaceRoot, "docs/index.md", "# 利用者のトップ\n");
    const staging = stageBundledKata(workspaceRoot);

    rmSync(join(workspaceRoot, "docs/index.md"));
    staging.syncFile(join(workspaceRoot, "docs/index.md"));

    expect(readStaged(workspaceRoot, "docs/index.md")).toContain("# 文書サイト");
  });

  it("base_path が無い project は docs/ja/projects/<id> に、docs 外の project は対象外にする", () => {
    writeConfig(workspaceRoot, {
      "prj-0002": { project_register_path: "docs/ja/projects/prj-0002/register" },
      "prj-0003": { base_path: "projects/prj-0003" },
    });

    expect(readProjectEntries(workspaceRoot)).toEqual([
      {
        id: "prj-0002",
        projectDir: join("docs", "ja", "projects", "prj-0002"),
        registerDir: join("docs", "ja", "projects", "prj-0002", "register"),
      },
      { id: "prj-0003", projectDir: join("projects", "prj-0003"), registerDir: undefined },
    ]);

    stageBundledKata(workspaceRoot);

    expect(
      existsSync(join(workspaceRoot, KATA_STAGING_DIR_NAME, "docs/ja/projects/prj-0002/index.md")),
    ).toBe(true);
    expect(
      existsSync(join(workspaceRoot, KATA_STAGING_DIR_NAME, "projects/prj-0003/index.md")),
    ).toBe(false);
    expect(readStaged(workspaceRoot, "docs/index.md")).not.toContain("prj-0003");
  });
});
