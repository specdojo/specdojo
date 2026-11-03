import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  specdojoSidebarItems,
  type SidebarItem,
} from "../../../packages/docs-site/.vitepress/sidebar-config.js";

function collectSidebarLinks(items: SidebarItem[]): SidebarItem[] {
  let list: SidebarItem[] = [];
  for (const item of items) {
    if (item.link) list.push(item);
    if (item.items) list = list.concat(collectSidebarLinks(item.items));
  }
  return list;
}

type KataItem = {
  kind: "rulebooks" | "recipes" | "samples" | "templates";
  fileName: string;
  baseName: string;
  isYaml: boolean;
  status: string;
  expectedLink: string;
};

function readAllKata(workspaceRoot: string): KataItem[] {
  const kinds: Array<"rulebooks" | "recipes" | "samples" | "templates"> = [
    "rulebooks",
    "recipes",
    "samples",
    "templates",
  ];
  const items: KataItem[] = [];

  for (const kind of kinds) {
    const dir = path.join(workspaceRoot, "docs", "ja", "specdojo", kind);
    if (!existsSync(dir)) continue;

    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) continue;
      const fileName = entry.name;
      const isMd = fileName.endsWith(".md");
      const isYaml = fileName.endsWith(".yaml");
      if (!isMd && !isYaml) continue;

      const fullPath = path.join(dir, fileName);
      const content = readFileSync(fullPath, "utf8");
      const statusMatch = content.match(/status:\s*([^\r\n]+)/);
      const status = statusMatch ? statusMatch[1].trim() : "unknown";
      const baseName = fileName.replace(/\.(md|yaml)$/, "");

      const expectedLink = isYaml
        ? `/ja/specdojo/${kind}/generated/${baseName}`
        : `/ja/specdojo/${kind}/${baseName}`;

      items.push({
        kind,
        fileName,
        baseName,
        isYaml,
        status,
        expectedLink,
      });
    }
  }

  return items;
}

describe("specdojo sidebar kata menus", () => {
  const workspaceRoot = process.cwd();
  const sidebarLinks = collectSidebarLinks(specdojoSidebarItems);
  const linkSet = new Set(sidebarLinks.map((item) => item.link));
  const allKata = readAllKata(workspaceRoot);

  it("covers all non-deprecated rulebooks, recipes, samples, and templates", () => {
    const missing: { kind: string; file: string; expectedLink: string }[] = [];

    for (const kata of allKata) {
      if (kata.status === "deprecated") continue;
      if (!linkSet.has(kata.expectedLink)) {
        missing.push({
          kind: kata.kind,
          file: kata.fileName,
          expectedLink: kata.expectedLink,
        });
      }
    }

    expect(missing).toEqual([]);
  });

  it("does not include deprecated kata in sidebar links", () => {
    const deprecated = allKata.filter((k) => k.status === "deprecated");
    const includedDeprecated = deprecated.filter((k) => linkSet.has(k.expectedLink));

    expect(includedDeprecated).toEqual([]);
  });

  it("resolves all kata sidebar links to real files", () => {
    const deadLinks: { text?: string; link?: string; resolvedPath: string }[] = [];

    for (const item of sidebarLinks) {
      if (!item.link?.startsWith("/ja/specdojo/")) continue;
      // /ja/specdojo/<kind>/...
      const relPath = item.link.slice("/ja/specdojo/".length);
      const parts = relPath.split("/");
      const kind = parts[0];
      if (!["rulebooks", "recipes", "samples", "templates"].includes(kind)) continue;

      const fileRelPath = `${relPath}.md`;
      const targetFile = path.join(workspaceRoot, "docs", "ja", "specdojo", fileRelPath);

      if (!existsSync(targetFile)) {
        deadLinks.push({
          text: item.text,
          link: item.link,
          resolvedPath: targetFile,
        });
      }
    }

    expect(deadLinks).toEqual([]);
  });
});
