import { resolveBasePath } from "./catalog-paths.js";

export type DctKind = "work" | "control" | "generated";
export type DctStatus = "draft" | "ready" | "deprecated";

export type CriteriaItem = {
  text: string;
  roles: string[];
  viewpoint: string;
};

export type EvidenceRef = {
  kind: "implementation";
  path: string;
  purpose: string;
};

export type DctDeliverableItem = {
  local_id: string;
  instance_id_pattern?: string;
  name: string;
  kind: DctKind;
  depends_on?: string[];
  overview: string;
  path?: string;
  rulebook?: string | "undecided" | "not-needed";
  evidence_refs?: EvidenceRef[];
  done_criteria?: CriteriaItem[];
  note?: string;
  min_size?: string; // template-only: 'small' | 'medium' | 'large'
};

export type DctSection = {
  name?: string;
  base_path?: string;
  note?: string;
  min_size?: string; // template-only: 'small' | 'medium' | 'large'
  groups?: DctSection[];
  deliverables?: DctDeliverableItem[];
};

export type DctTemplateDoc = {
  id: string;
  type: "template";
  status: DctStatus;
  title?: string;
  rulebook?: string;
  part_of?: string[];
  domain: string;
  base_path?: string;
  groups: DctSection[];
};

function formatDependsOn(deps: string[] | undefined): string {
  if (!deps || deps.length === 0) return "-";
  return deps.map((d) => `\`${d}\``).join(", ");
}

export function renderTable(deliverables: DctDeliverableItem[]): string[] {
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

export function renderDoneCriteria(deliverables: DctDeliverableItem[]): string[] {
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

export function renderSections(
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
