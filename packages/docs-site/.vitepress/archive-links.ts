import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { GitHubSource } from "./exec-record-links.js";

// 公開索引には含めない旧文書の参照先。過去の plan / result の ID を書き換えずに保つ。
export function loadArchiveLinks(workspaceRoot: string): Record<string, string> {
  const manifest = join(workspaceRoot, "archive/ja/product/trash/links.json");
  if (!existsSync(manifest)) return {};
  const parsed: unknown = JSON.parse(readFileSync(manifest, "utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Invalid archive links: ${manifest}`);
  }
  const links: Record<string, string> = {};
  for (const [id, target] of Object.entries(parsed)) {
    if (
      !/^[a-z][a-z0-9:_-]+$/.test(id) ||
      typeof target !== "string" ||
      !/^archive\/ja\/product\/trash\/[a-z0-9-]+\.md$/.test(target) ||
      !existsSync(join(workspaceRoot, target))
    ) {
      throw new Error(`Invalid archive link: ${id} in ${manifest}`);
    }
    links[id] = target;
  }
  return links;
}

export function resolveArchiveWikilink(
  inner: string,
  archiveLinks: Readonly<Record<string, string>>,
  source: GitHubSource,
): { displayText: string; href: string } | undefined {
  const pipeIndex = inner.indexOf("|");
  const id = pipeIndex === -1 ? inner : inner.slice(0, pipeIndex);
  if (!Object.hasOwn(archiveLinks, id)) return undefined;
  return {
    displayText: pipeIndex === -1 ? id : inner.slice(pipeIndex + 1),
    href: `${source.repositoryUrl.replace(/\/+$/, "")}/blob/${source.branch}/${archiveLinks[id]}`,
  };
}
