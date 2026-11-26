import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  KATA_STAGING_DIR_NAME,
  stageBundledKata,
} from "../../../packages/docs-site/.vitepress/kata-staging.js";
import {
  buildProductRepoSidebarSection,
  collectProductDocIndex,
  loadProductRepos,
  readMarkdownDocId,
  resolveLocalConfigPath,
  stageProductRepoDocs,
} from "../../../packages/docs-site/.vitepress/product-repos.js";

function write(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf8");
}

function writeConfig(workspace: string, projects: Record<string, unknown>): void {
  write(
    join(workspace, ".specdojo/specdojo.config.json"),
    JSON.stringify({ version: 1, projects }),
  );
}

function productDoc(id: string, title: string): string {
  return `---\nspecdojo:\n  id: ${id}\n  type: spec\n  status: draft\n---\n\n# ${title}\n`;
}

describe("docs-site product repos", () => {
  const originalPackageRoot = process.env.SPECDOJO_PACKAGE_ROOT;
  let root: string;
  let workspace: string;
  let warnings: string[];
  const warn = (message: string): void => {
    warnings.push(message);
  };

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "specdojo-product-repos-"));
    workspace = join(root, "project");
    mkdirSync(workspace, { recursive: true });
    warnings = [];
    // kata の複製を起こさないよう、workspace 自身を package ルートに見せる。
    process.env.SPECDOJO_PACKAGE_ROOT = workspace;
  });

  afterEach(() => {
    if (originalPackageRoot === undefined) delete process.env.SPECDOJO_PACKAGE_ROOT;
    else process.env.SPECDOJO_PACKAGE_ROOT = originalPackageRoot;
    rmSync(root, { recursive: true, force: true });
  });

  describe("loadProductRepos", () => {
    it("各 project の repos を読み、ローカルの設定の path 差し替えと追加を反映する", () => {
      writeConfig(workspace, {
        "prj-b": { repos: [{ name: "shop", path: "../shop" }] },
        "prj-a": { repos: [{ name: "api", path: "../api" }] },
      });
      write(
        join(workspace, ".specdojo/specdojo.local.config.json"),
        JSON.stringify({
          version: 1,
          projects: {
            "prj-b": {
              repos: [
                { name: "shop", path: "../local-shop" },
                { name: "extra", path: "../extra" },
              ],
            },
          },
        }),
      );

      const repos = loadProductRepos(workspace, {}, warn);

      expect(repos).toEqual([
        { name: "api", root: join(root, "api") },
        { name: "shop", root: join(root, "local-shop") },
        { name: "extra", root: join(root, "extra") },
      ]);
      expect(warnings).toEqual([]);
    });

    it("repos を宣言していない project だけなら空を返す", () => {
      writeConfig(workspace, { "prj-0001": { base_path: "docs/ja/projects/prj-0001" } });

      expect(loadProductRepos(workspace, {}, warn)).toEqual([]);
    });

    it("名前の規則に合わないリポジトリは警告して飛ばす", () => {
      writeConfig(workspace, { "prj-a": { repos: [{ name: "Bad_Name", path: "../bad" }] } });

      expect(loadProductRepos(workspace, {}, warn)).toEqual([]);
      expect(warnings).toEqual([expect.stringMatching(/skip repository "Bad_Name" of prj-a/)]);
    });
  });

  describe("resolveLocalConfigPath", () => {
    it("linked worktree では SPECDOJO_LOCAL_CONFIG の絶対パスを使う", () => {
      write(join(workspace, ".git"), `gitdir: ${join(root, "main/.git/worktrees/task")}\n`);
      const fromEnv = join(root, "main/.specdojo/specdojo.local.config.json");

      expect(resolveLocalConfigPath(workspace, { SPECDOJO_LOCAL_CONFIG: fromEnv })).toBe(fromEnv);
    });

    it("linked worktree で環境変数が無ければ本体の作業ツリーのファイルを使う", () => {
      write(join(workspace, ".git"), `gitdir: ${join(root, "main/.git/worktrees/task")}\n`);

      expect(resolveLocalConfigPath(workspace, {})).toBe(
        join(root, "main/.specdojo/specdojo.local.config.json"),
      );
    });
  });

  describe("stageProductRepoDocs", () => {
    it("docs/ja/product/ を docs/ja/product/<リポジトリ名>/ へ複製し、入口のページを置く", () => {
      const staging = join(root, "staging");
      write(
        join(root, "shop/docs/ja/product/010-business-specs/bds-cart.md"),
        productDoc("bds-cart", "カート"),
      );

      const staged = stageProductRepoDocs(
        workspace,
        staging,
        [{ name: "shop", root: join(root, "shop") }],
        warn,
      );

      expect(staged).toEqual([
        {
          name: "shop",
          root: join(root, "shop"),
          docsRelativeDir: "ja/product/shop",
          files: [
            join("docs/ja/product/shop/010-business-specs/bds-cart.md"),
            join("docs/ja/product/shop/index.md"),
          ],
        },
      ]);
      expect(
        readFileSync(join(staging, "docs/ja/product/shop/010-business-specs/bds-cart.md"), "utf8"),
      ).toContain("# カート");
      expect(readFileSync(join(staging, "docs/ja/product/shop/index.md"), "utf8")).toContain(
        "# プロダクト: shop",
      );
      expect(warnings).toEqual([]);
    });

    it("リポジトリが見つからないときは警告して飛ばし、例外にしない", () => {
      const staging = join(root, "staging");

      const staged = stageProductRepoDocs(
        workspace,
        staging,
        [{ name: "missing", root: join(root, "missing") }],
        warn,
      );

      expect(staged).toEqual([]);
      expect(warnings).toEqual([`skip repository "missing": ${join(root, "missing")} not found`]);
      expect(existsSync(join(staging, "docs/ja/product/missing"))).toBe(false);
    });

    it("リポジトリに docs/ja/product/ が無いときは警告して飛ばす", () => {
      mkdirSync(join(root, "empty"), { recursive: true });

      const staged = stageProductRepoDocs(
        workspace,
        join(root, "staging"),
        [{ name: "empty", root: join(root, "empty") }],
        warn,
      );

      expect(staged).toEqual([]);
      expect(warnings).toEqual([
        `skip repository "empty": ${join(root, "empty/docs/ja/product")} not found`,
      ]);
    });

    it("project のリポジトリに同じ名前の docs/ja/product/<名前>/ があれば project 側を残して飛ばす", () => {
      write(join(workspace, "docs/ja/product/shop/own.md"), "# own\n");
      write(join(root, "shop/docs/ja/product/a.md"), "# a\n");

      const staged = stageProductRepoDocs(
        workspace,
        join(root, "staging"),
        [{ name: "shop", root: join(root, "shop") }],
        warn,
      );

      expect(staged).toEqual([]);
      expect(warnings).toEqual([
        expect.stringMatching(
          /skip repository "shop": .* already exists in the project repository/,
        ),
      ]);
    });
  });

  describe("stageBundledKata with product repos", () => {
    it("project 自身の docs/ja/product/ と分けて取り込み、外すと次の起動で消える", () => {
      write(join(workspace, "docs/ja/product/010-business-specs/own.md"), "# own\n");
      write(join(root, "shop/docs/ja/product/010-business-specs/own.md"), "# shop\n");
      const stagingDocs = join(workspace, KATA_STAGING_DIR_NAME, "docs/ja/product");

      const first = stageBundledKata(workspace, {
        productRepos: [{ name: "shop", root: join(root, "shop") }],
        warn,
      });

      expect(first.productRepos.map((repo) => repo.name)).toEqual(["shop"]);
      expect(readFileSync(join(stagingDocs, "010-business-specs/own.md"), "utf8")).toBe("# own\n");
      expect(readFileSync(join(stagingDocs, "shop/010-business-specs/own.md"), "utf8")).toBe(
        "# shop\n",
      );

      const second = stageBundledKata(workspace, { warn });

      expect(second.productRepos).toEqual([]);
      expect(existsSync(join(stagingDocs, "shop"))).toBe(false);
      expect(existsSync(join(stagingDocs, "010-business-specs/own.md"))).toBe(true);
    });

    it("repos が無いときは今までどおり workspace の docs だけをステージする", () => {
      write(join(workspace, "docs/ja/product/010-business-specs/own.md"), "# own\n");

      const result = stageBundledKata(workspace);

      expect(result.productRepos).toEqual([]);
      expect(
        existsSync(
          join(workspace, KATA_STAGING_DIR_NAME, "docs/ja/product/010-business-specs/own.md"),
        ),
      ).toBe(true);
      expect(warnings).toEqual([]);
    });
  });

  describe("collectProductDocIndex", () => {
    it("取り込んだ文書の id とリポジトリ名で修飾した別名を引け、project の索引を優先する", () => {
      const staging = join(root, "staging");
      write(join(staging, "docs/ja/product/shop/a.md"), productDoc("bds-cart", "カート"));
      write(join(staging, "docs/ja/product/shop/b.md"), productDoc("prj-0001-overview", "重複"));
      write(join(staging, "docs/ja/product/shop/index.md"), "# 入口\n");

      const entries = collectProductDocIndex(
        staging,
        [
          {
            name: "shop",
            root: join(root, "shop"),
            docsRelativeDir: "ja/product/shop",
            files: [
              join("docs/ja/product/shop/a.md"),
              join("docs/ja/product/shop/b.md"),
              join("docs/ja/product/shop/index.md"),
            ],
          },
        ],
        new Set(["prj-0001-overview"]),
        warn,
      );

      expect(entries).toEqual({
        "bds-cart": "docs/ja/product/shop/a.md",
        "shop:bds-cart": "docs/ja/product/shop/a.md",
        "shop:prj-0001-overview": "docs/ja/product/shop/b.md",
      });
      expect(warnings).toEqual([
        expect.stringMatching(/doc id "prj-0001-overview" .* keeping the project's/),
      ]);
    });
  });

  describe("readMarkdownDocId", () => {
    it("specdojo 名前空間の id を優先し、無ければトップレベルの id を読む", () => {
      expect(readMarkdownDocId(productDoc("bds-cart", "カート"))).toBe("bds-cart");
      expect(readMarkdownDocId('---\nid: "legacy-id"\n---\n\n# x\n')).toBe("legacy-id");
      expect(readMarkdownDocId("# no frontmatter\n")).toBeUndefined();
    });
  });

  describe("buildProductRepoSidebarSection", () => {
    it("走査起点からの相対リンクを公開 URL へ付け替え、リポジトリごとの節に包む", () => {
      const section = buildProductRepoSidebarSection(
        { name: "shop", docsRelativeDir: "ja/product/shop" },
        [
          { text: "index", link: "index" },
          {
            text: "010-business-specs",
            collapsed: true,
            items: [{ text: "bds-cart", link: "010-business-specs/bds-cart" }],
          },
        ],
      );

      expect(section).toEqual({
        text: "プロダクト: shop",
        link: "/ja/product/shop/",
        collapsed: false,
        items: [
          {
            text: "010-business-specs",
            collapsed: true,
            items: [{ text: "bds-cart", link: "/ja/product/shop/010-business-specs/bds-cart" }],
          },
        ],
      });
    });
  });
});
