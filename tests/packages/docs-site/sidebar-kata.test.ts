import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  buildSpecdojoSidebarItems,
  type SidebarItem,
} from "../../../packages/docs-site/.vitepress/sidebar-config.js";
import {
  buildKataMenus,
  kataLabelFromTitle,
  readKataMetadata,
  rulebookLabelFromTitle,
} from "../../../packages/docs-site/.vitepress/sidebar-kata.js";
import type { KataMenuConfig } from "../../../packages/docs-site/.vitepress/sidebar-kata-config.js";

const KINDS = ["rulebooks", "recipes", "samples", "templates"] as const;

function collectSidebarLinks(items: SidebarItem[]): SidebarItem[] {
  let list: SidebarItem[] = [];
  for (const item of items) {
    if (item.link) list.push(item);
    if (item.items) list = list.concat(collectSidebarLinks(item.items));
  }
  return list;
}

type KataItem = {
  kind: (typeof KINDS)[number];
  fileName: string;
  status: string;
  expectedLink: string;
};

// メニューの組み立てとは別の読み方で、置き場所にある型の文書をすべて数える。
function readAllKata(specdojoDir: string): KataItem[] {
  const items: KataItem[] = [];
  for (const kind of KINDS) {
    const dir = path.join(specdojoDir, kind);
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) continue;
      const fileName = entry.name;
      const isYaml = fileName.endsWith(".yaml");
      if (!fileName.endsWith(".md") && !isYaml) continue;
      const content = readFileSync(path.join(dir, fileName), "utf8");
      const status = content.match(/status:\s*([^\r\n]+)/)?.[1].trim() ?? "unknown";
      const baseName = fileName.replace(/\.(md|yaml)$/, "");
      const expectedLink = isYaml
        ? `/ja/specdojo/${kind}/generated/${baseName}`
        : `/ja/specdojo/${kind}/${baseName}`;
      items.push({ kind, fileName, status, expectedLink });
    }
  }
  return items;
}

describe("specdojo sidebar kata menus", () => {
  const specdojoDir = path.join(process.cwd(), "docs", "ja", "specdojo");
  const sidebarLinks = collectSidebarLinks(buildSpecdojoSidebarItems(specdojoDir));
  const linkSet = new Set(sidebarLinks.map((item) => item.link));
  const allKata = readAllKata(specdojoDir);

  it("covers all non-deprecated rulebooks, recipes, samples, and templates", () => {
    const missing = allKata
      .filter((kata) => kata.status !== "deprecated" && !linkSet.has(kata.expectedLink))
      .map((kata) => ({ kind: kata.kind, file: kata.fileName, expectedLink: kata.expectedLink }));

    expect(missing).toEqual([]);
  });

  it("does not include deprecated kata in sidebar links", () => {
    const includedDeprecated = allKata.filter(
      (kata) => kata.status === "deprecated" && linkSet.has(kata.expectedLink),
    );

    expect(includedDeprecated).toEqual([]);
  });

  it("lists each kata only once", () => {
    const links = sidebarLinks
      .map((item) => item.link)
      .filter((link): link is string => link?.startsWith("/ja/specdojo/") ?? false);
    const duplicated = links.filter((link, index) => links.indexOf(link) !== index);

    expect(duplicated).toEqual([]);
  });

  it("resolves all kata sidebar links to real files", () => {
    const deadLinks: { text?: string; link?: string; resolvedPath: string }[] = [];

    for (const item of sidebarLinks) {
      if (!item.link?.startsWith("/ja/specdojo/")) continue;
      const relPath = item.link.slice("/ja/specdojo/".length);
      const parts = relPath.split("/");
      // generated/ の閲覧ページは docs-site のビルドで YAML から作られ Git 管理外のため、元の YAML で確かめる。
      const isGeneratedViewer = parts[1] === "generated";
      const fileRelPath = isGeneratedViewer
        ? path.join(parts[0], `${parts.slice(2).join("/")}.yaml`)
        : `${relPath}.md`;
      const targetFile = path.join(specdojoDir, fileRelPath);
      if (!existsSync(targetFile)) {
        deadLinks.push({ text: item.text, link: item.link, resolvedPath: targetFile });
      }
    }

    expect(deadLinks).toEqual([]);
  });
});

const emptyConfig = (overrides: Partial<KataMenuConfig> = {}): KataMenuConfig => ({
  menu: [],
  labels: {},
  children: {},
  attach: {},
  fallbackGroupText: "その他",
  ...overrides,
});

const rulebookFile = (fields: string[], h1: string): string =>
  ["---", "specdojo:", ...fields.map((field) => `  ${field}`), "---", "", `# ${h1}`, ""].join("\n");

const kataFile = (id: string, h1: string, status = "draft"): string =>
  [
    "---",
    "specdojo:",
    `  id: specdojo:${id}`,
    `  status: ${status}`,
    "---",
    "",
    `# ${h1}`,
    "",
  ].join("\n");

describe("buildKataMenus", () => {
  let dir: string;

  const write = (relativePath: string, content: string): void => {
    const target = path.join(dir, relativePath);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, content, "utf8");
  };

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "specdojo-sidebar-kata-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("places a new rulebook by deliverable_type without changing the config", () => {
    write(
      "rulebooks/aaa-rulebook.md",
      rulebookFile(
        ["deliverable_type: data", "sample: specdojo:aaa-sample", "recipe: not-needed"],
        "新しい型（AAA）作成ルール",
      ),
    );
    write("samples/aaa-sample.md", kataFile("aaa-sample", "新しい型 サンプル"));
    const config = emptyConfig({
      menu: [{ text: "業務仕様", deliverableTypes: ["data"], items: [] }],
    });

    const menus = buildKataMenus(dir, config);

    expect(menus.rulebooks).toEqual([
      {
        text: "業務仕様",
        collapsed: true,
        items: [{ text: "新しい型", link: "/ja/specdojo/rulebooks/aaa-rulebook" }],
      },
    ]);
    expect(menus.samples).toEqual([
      {
        text: "業務仕様",
        collapsed: true,
        items: [{ text: "新しい型", link: "/ja/specdojo/samples/aaa-sample" }],
      },
    ]);
    expect(menus.recipes).toEqual([]);
  });

  it("puts a rulebook with an unknown deliverable_type into the fallback group", () => {
    write(
      "rulebooks/zzz-rulebook.md",
      rulebookFile(["deliverable_type: unknown"], "謎 作成ルール"),
    );

    const menus = buildKataMenus(dir, emptyConfig());

    expect(menus.rulebooks).toEqual([
      {
        text: "その他",
        collapsed: true,
        items: [{ text: "謎", link: "/ja/specdojo/rulebooks/zzz-rulebook" }],
      },
    ]);
  });

  it("omits deprecated kata and links YAML kata to the generated viewer page", () => {
    write(
      "rulebooks/old-rulebook.md",
      rulebookFile(["status: deprecated", "sample: specdojo:old-sample"], "旧 作成ルール"),
    );
    write("samples/old-sample.md", kataFile("old-sample", "旧 サンプル", "deprecated"));
    write(
      "rulebooks/yml-rulebook.md",
      rulebookFile(["template: specdojo:yml-template"], "YAML型 作成ルール"),
    );
    write(
      "templates/yml-template.yaml",
      "id: specdojo:yml-template\nstatus: draft\ntitle: YAML型テンプレート\n",
    );

    const menus = buildKataMenus(dir, emptyConfig({ menu: ["old", "yml"] }));

    expect(menus.rulebooks).toEqual([
      { text: "YAML型", link: "/ja/specdojo/rulebooks/yml-rulebook" },
    ]);
    expect(menus.samples).toEqual([]);
    expect(menus.templates).toEqual([
      { text: "YAML型", link: "/ja/specdojo/templates/generated/yml-template" },
    ]);
  });

  it("nests rulebooks included by a single parent and extra samples under the entry", () => {
    write(
      "rulebooks/ops-rulebook.md",
      rulebookFile(
        [
          "includes:",
          "    - specdojo:ops-mermaid-rulebook",
          "sample:",
          "    - specdojo:ops-sample",
          "    - specdojo:ops-extra-sample",
        ],
        "運用 作成ルール",
      ),
    );
    write("rulebooks/ops-mermaid-rulebook.md", rulebookFile([], "運用図 作成ルール"));
    write("samples/ops-sample.md", kataFile("ops-sample", "運用 サンプル"));
    write("samples/ops-extra-sample.md", kataFile("ops-extra-sample", "運用: 追加 サンプル"));

    const menus = buildKataMenus(dir, emptyConfig({ menu: ["ops"] }));

    expect(menus.rulebooks).toEqual([
      {
        text: "運用",
        link: "/ja/specdojo/rulebooks/ops-rulebook",
        collapsed: true,
        items: [{ text: "運用図", link: "/ja/specdojo/rulebooks/ops-mermaid-rulebook" }],
      },
    ]);
    expect(menus.samples).toEqual([
      {
        text: "運用",
        link: "/ja/specdojo/samples/ops-sample",
        collapsed: true,
        items: [{ text: "追加", link: "/ja/specdojo/samples/ops-extra-sample" }],
      },
    ]);
  });

  it("attaches kata the rulebook does not list by file name prefix, attach, or fallback", () => {
    write("rulebooks/reg-rulebook.md", rulebookFile(["template: not-needed"], "登録簿 作成ルール"));
    write("rulebooks/log-rulebook.md", rulebookFile(["template: undecided"], "ログ 作成ルール"));
    write("templates/reg-todo-template.md", kataFile("reg-todo-template", "_TODO_TITLE_"));
    write("templates/reg-index-template.md", kataFile("reg-index-template", "登録簿"));
    write("templates/decision-log-template.md", kataFile("decision-log-template", "決定"));
    write("templates/stray-template.md", kataFile("stray-template", "迷子"));
    const config = emptyConfig({
      menu: ["reg", "log"],
      labels: { "reg-todo-template": "TODO" },
      children: { reg: ["reg-index-template"] },
      attach: { "decision-log-template": "log" },
    });

    const menus = buildKataMenus(dir, config);

    expect(menus.templates).toEqual([
      { text: "登録簿", link: "/ja/specdojo/templates/reg-index-template" },
      { text: "TODO", link: "/ja/specdojo/templates/reg-todo-template" },
      { text: "ログ", link: "/ja/specdojo/templates/decision-log-template" },
      {
        text: "その他",
        collapsed: true,
        items: [{ text: "迷子", link: "/ja/specdojo/templates/stray-template" }],
      },
    ]);
  });
});

describe("readKataMetadata", () => {
  it("reads scalars and block lists under the specdojo namespace", () => {
    const content = [
      "---",
      "specdojo:",
      "  id: specdojo:opr-rulebook",
      '  status: "draft"',
      "  sample:",
      "    - specdojo:opr-sample",
      "    - specdojo:opr-batch-sample",
      "  includes: [specdojo:a-rulebook, specdojo:b-rulebook]",
      "---",
      "",
      "# 運用手順 作成ルール",
    ].join("\n");

    expect(readKataMetadata(content, false)).toEqual({
      id: "specdojo:opr-rulebook",
      status: "draft",
      sample: ["specdojo:opr-sample", "specdojo:opr-batch-sample"],
      includes: ["specdojo:a-rulebook", "specdojo:b-rulebook"],
    });
  });

  it("reads YAML kata metadata from the top level or x-spec-meta", () => {
    const openapi = "openapi: 3.0.3\nx-spec-meta:\n  id: specdojo:api-sample\n  status: draft\n";

    expect(readKataMetadata("id: specdojo:t\nstatus: deprecated\n", true)).toEqual({
      id: "specdojo:t",
      status: "deprecated",
    });
    expect(readKataMetadata(openapi, true)).toMatchObject({ status: "draft" });
  });
});

describe("kata labels from titles", () => {
  it("drops the rulebook suffix and an ASCII-only abbreviation", () => {
    expect(rulebookLabelFromTitle("C4コンテキスト図（CXD）作成ルール")).toBe("C4コンテキスト図");
    expect(rulebookLabelFromTitle("概念データフロー図（全体概要）作成ルール")).toBe(
      "概念データフロー図（全体概要）",
    );
  });

  it("keeps the subject after the colon and ignores placeholder titles", () => {
    expect(kataLabelFromTitle("運用手順: バッチ再実行・失敗対応 サンプル")).toBe(
      "バッチ再実行・失敗対応",
    );
    expect(kataLabelFromTitle("_PJR-XXXX_ _TODO_TITLE_")).toBeUndefined();
  });
});
