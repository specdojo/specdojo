import type { DctDoc } from "./types.js";
import { resolveBasePath } from "./paths.js";
import { buildSpecdojoFrontmatter } from "../docs/frontmatter-namespace.js";
import {
  isRecord,
  isDctTemplateCatalog,
  renderCatalogTemplateBody,
  renderSections,
} from "../shared/catalog-render.js";

export { isRecord, isDctTemplateCatalog, renderCatalogTemplateBody };

function buildFrontmatter(doc: DctDoc): string[] {
  const inner: string[] = [];
  inner.push(`id: ${doc.id}`);
  inner.push(`type: ${doc.type}`);
  inner.push(`status: ${doc.status}`);
  if (doc.part_of && doc.part_of.length > 0) {
    inner.push("part_of:");
    for (const p of doc.part_of) {
      const val = p.includes(":") ? `'${p}'` : p;
      inner.push(`  - ${val}`);
    }
  }
  inner.push("rulebook: specdojo:dct-rulebook");
  return buildSpecdojoFrontmatter(inner).split("\n");
}

export function buildMarkdown(doc: DctDoc): string {
  const lines: string[] = [];

  lines.push(...buildFrontmatter(doc));
  lines.push("");
  lines.push(`# 成果物カタログ: ${doc.domain}`);
  lines.push("");
  lines.push(`- project-id: \`${doc.project_id}\``);
  lines.push(`- ドメイン: \`${doc.domain}\``);

  const topBase = resolveBasePath("", doc.base_path);
  lines.push(...renderSections(doc.groups, topBase, 1, []));
  lines.push("");

  return lines.join("\n");
}
