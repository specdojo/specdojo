import type { DctDeliverableItem, DctDoc, DctSection, DctTemplateDoc } from "./catalog-types.js";
import { resolveBasePath } from "./catalog-paths.js";
import { buildSpecdojoFrontmatter } from "./frontmatter-namespace.js";

function formatDependsOn(deps: string[] | undefined): string {
  if (!deps || deps.length === 0) return "-";
  return deps.map((d) => `\`${d}\``).join(", ");
}

function renderTable(deliverables: DctDeliverableItem[]): string[] {
  const lines: string[] = ["<!-- prettier-ignore -->"];
  const hasInstanceIdPattern = deliverables.some((item) => item.instance_id_pattern);
  if (hasInstanceIdPattern) {
    lines.push("| local-id | 実体IDパターン | 成果物名 | 種別 | 根拠 | 概要 |");
    lines.push("| --- | --- | --- | --- | --- | --- |");
  } else {
    lines.push("| local-id | 成果物名 | 種別 | 根拠 | 概要 |");
    lines.push("| --- | --- | --- | --- | --- |");
  }
  for (const item of deliverables) {
    const localId = `\`${item.local_id}\``;
    const deps = formatDependsOn(item.depends_on);
    if (hasInstanceIdPattern) {
      const instanceIdPattern = item.instance_id_pattern ? `\`${item.instance_id_pattern}\`` : "-";
      lines.push(
        `| ${localId} | ${instanceIdPattern} | ${item.name} | ${item.kind} | ${deps} | ${item.overview} |`,
      );
    } else {
      lines.push(`| ${localId} | ${item.name} | ${item.kind} | ${deps} | ${item.overview} |`);
    }
  }
  return lines;
}

function renderDoneCriteria(deliverables: DctDeliverableItem[]): string[] {
  const lines: string[] = [];
  for (const item of deliverables) {
    if (item.kind !== "work" || !item.done_criteria || item.done_criteria.length === 0) continue;
    lines.push("");
    lines.push(`**\`${item.local_id}\`** の完了条件:`);
    lines.push("");
    for (const criterion of item.done_criteria) {
      lines.push(`- ${criterion.text}`);
    }
  }
  return lines;
}

function renderSections(
  sections: DctSection[],
  parentBase: string,
  depth: number,
  prefix: number[],
): string[] {
  const lines: string[] = [];
  const hashes = "#".repeat(depth + 1);
  let counter = 0;

  for (const section of sections) {
    const sectionBase = resolveBasePath(parentBase, section.base_path);

    if (!section.name) {
      // Unnamed section: output content without heading
      if (section.base_path) {
        lines.push("");
        lines.push(`- 配置先: \`${sectionBase}\``);
      }
      if (section.note) {
        lines.push("");
        lines.push(section.note);
      }
      if (section.deliverables && section.deliverables.length > 0) {
        lines.push("");
        lines.push(...renderTable(section.deliverables));
        lines.push(...renderDoneCriteria(section.deliverables));
      }
      if (section.groups && section.groups.length > 0) {
        lines.push(...renderSections(section.groups, sectionBase, depth, prefix));
      }
      continue;
    }

    counter++;
    const nums = [...prefix, counter];
    const numStr = nums.join(".");

    lines.push("");
    lines.push(`${hashes} ${numStr}. ${section.name}`);

    if (section.base_path) {
      lines.push("");
      lines.push(`- 配置先: \`${sectionBase}\``);
    }

    if (section.note) {
      lines.push("");
      lines.push(section.note);
    }

    if (section.deliverables && section.deliverables.length > 0) {
      lines.push("");
      lines.push(...renderTable(section.deliverables));
      lines.push(...renderDoneCriteria(section.deliverables));
    }

    if (section.groups && section.groups.length > 0) {
      lines.push(...renderSections(section.groups, sectionBase, depth + 1, nums));
    }
  }

  return lines;
}

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

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// dct 成果物カタログのテンプレート（type: template）YAML かを判定する。
// テンプレートはインスタンス（type: project）と違い project_id を持たず local_id に
// プレースホルダを含むため、validateDctDoc/buildMarkdown は適用できない。yaml-pages の
// 表示ページで、YAML 丸写しのコードブロックではなく可読な表形式で描画するために使う。
export function isDctTemplateCatalog(
  yamlRelPath: string,
  parsed: unknown,
): parsed is DctTemplateDoc {
  if (!/\/templates\/dct-.+-template\.ya?ml$/.test(yamlRelPath)) return false;
  if (!isRecord(parsed)) return false;
  return (
    parsed.type === "template" && typeof parsed.domain === "string" && Array.isArray(parsed.groups)
  );
}

// dct テンプレートの本文（成果物表＋完了条件）を描画する。frontmatter・H1・注記は
// 呼び出し側（yaml-pages 表示ページ）が付与するため、ここでは本文セクションのみ返す。
// インスタンス（buildMarkdown）と同じ renderSections を共用し、表現を一致させる。
export function renderCatalogTemplateBody(doc: DctTemplateDoc): string {
  const topBase = resolveBasePath("", doc.base_path);
  return renderSections(doc.groups, topBase, 1, []).join("\n").trim();
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
