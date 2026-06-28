import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import yaml from "js-yaml";
import type {
  DctDeliverableItem,
  DctDoc,
  DctKind,
  DctSection,
  DctValidationResult,
} from "./catalog-types.js";
import { declaredReferences } from "./reference-materials.js";
import { resolveBasePath, resolveDeliverablePath } from "./catalog-paths.js";

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
  const lines: string[] = ["---"];
  lines.push(`id: ${doc.id}`);
  lines.push(`type: ${doc.type}`);
  lines.push(`status: ${doc.status}`);
  if (doc.part_of && doc.part_of.length > 0) {
    lines.push("part_of:");
    for (const p of doc.part_of) {
      const val = p.includes(":") ? `'${p}'` : p;
      lines.push(`  - ${val}`);
    }
  }
  lines.push("rulebook: dct-rulebook");
  lines.push("---");
  return lines;
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

// Collects every local_id across all dct-*.yaml in a catalog directory.
// Used to resolve cross-file depends_on references (same project, other file).
export function collectCatalogLocalIds(catalogPath: string): Set<string> {
  const ids = new Set<string>();
  const files = readdirSync(catalogPath)
    .filter((f) => /^dct-.+\.yaml$/.test(f))
    .sort();
  for (const f of files) {
    let doc: DctDoc;
    try {
      doc = yaml.load(readFileSync(join(catalogPath, f), "utf8")) as DctDoc;
    } catch {
      continue;
    }
    if (!doc || !Array.isArray(doc.groups)) continue;
    const walk = (sections: DctSection[]): void => {
      for (const section of sections) {
        for (const item of section.deliverables ?? []) ids.add(item.local_id);
        if (section.groups) walk(section.groups);
      }
    };
    walk(doc.groups);
  }
  return ids;
}

// Cross-file check: each `domain` must be unique across the project's catalogs
// (catalog build output is keyed by domain).
export function validateCatalogDomains(catalogPath: string): DctValidationResult {
  const errors: string[] = [];
  const seen = new Map<string, string>();
  const files = readdirSync(catalogPath)
    .filter((f) => /^dct-.+\.yaml$/.test(f))
    .sort();
  for (const f of files) {
    const filePath = join(catalogPath, f);
    let doc: DctDoc;
    try {
      doc = yaml.load(readFileSync(filePath, "utf8")) as DctDoc;
    } catch {
      continue;
    }
    const domain = doc?.domain;
    if (!domain) continue;
    const prev = seen.get(domain);
    if (prev) {
      errors.push(`duplicate domain '${domain}': ${prev} and ${filePath}`);
    } else {
      seen.set(domain, filePath);
    }
  }
  return { ok: errors.length === 0, errors, warnings: [] };
}

// Cross-file check: each `local_id` must be unique across the project's catalogs,
// so that a bare `local_id` (in `--deliverable` or a scheduled task) resolves to a
// single deliverable. Returns warnings (not errors); per-file duplicates are caught
// as errors by validateDctDoc.
export function validateCatalogLocalIds(catalogPath: string): DctValidationResult {
  const warnings: string[] = [];
  const seen = new Map<string, string>();
  const reported = new Set<string>();
  const files = readdirSync(catalogPath)
    .filter((f) => /^dct-.+\.yaml$/.test(f))
    .sort();
  for (const f of files) {
    const filePath = join(catalogPath, f);
    let doc: DctDoc;
    try {
      doc = yaml.load(readFileSync(filePath, "utf8")) as DctDoc;
    } catch {
      continue;
    }
    if (!doc || !Array.isArray(doc.groups)) continue;
    const walk = (sections: DctSection[]): void => {
      for (const section of sections) {
        for (const item of section.deliverables ?? []) {
          const prev = seen.get(item.local_id);
          if (prev === undefined) {
            seen.set(item.local_id, filePath);
          } else if (prev !== filePath && !reported.has(item.local_id)) {
            reported.add(item.local_id);
            warnings.push(
              `local_id '${item.local_id}' is defined in multiple catalogs: ${prev}, ${filePath}`,
            );
          }
        }
        if (section.groups) walk(section.groups);
      }
    };
    walk(doc.groups);
  }
  return { ok: true, errors: [], warnings };
}

// Cross-file check: each rulebook referenced by a catalog deliverable that declares
// recipe / sample / template in its frontmatter must point at files that exist.
// Returns warnings (not errors); a declared-but-missing reference is a soft signal
// to author the asset, not a build blocker. Each rulebook is checked once.
export function validateRulebookReferenceMaterials(catalogPath: string): DctValidationResult {
  const warnings: string[] = [];
  const checked = new Set<string>();
  const files = readdirSync(catalogPath)
    .filter((f) => /^dct-.+\.yaml$/.test(f))
    .sort();
  for (const f of files) {
    let doc: DctDoc;
    try {
      doc = yaml.load(readFileSync(join(catalogPath, f), "utf8")) as DctDoc;
    } catch {
      continue;
    }
    if (!doc || !Array.isArray(doc.groups)) continue;
    const walk = (sections: DctSection[]): void => {
      for (const section of sections) {
        for (const item of section.deliverables ?? []) {
          const rulebookId = item.rulebook;
          if (!rulebookId || rulebookId === "none" || checked.has(rulebookId)) continue;
          checked.add(rulebookId);
          for (const ref of declaredReferences(rulebookId)) {
            if (!existsSync(ref.fsPath)) {
              warnings.push(
                `rulebook '${rulebookId}' declares ${ref.kind} '${ref.id}' but the file is missing: ${ref.fsPath}`,
              );
            }
          }
        }
        if (section.groups) walk(section.groups);
      }
    };
    walk(doc.groups);
  }
  return { ok: true, errors: [], warnings };
}

// When knownLocalIds is provided, depends_on references are resolved against the
// whole catalog (all dct-*.yaml of the project), so cross-file dependencies do
// not warn. When omitted, resolution falls back to same-file local_ids only.
export function validateDctDoc(
  doc: DctDoc,
  filePath: string,
  knownLocalIds?: Set<string>,
): DctValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const localIdPattern = /^[a-z0-9][a-z0-9-]*$/;
  const instanceIdPattern =
    /^(?=.*\{[a-z][a-z0-9-]*\})[a-z0-9]+(?:-(?:[a-z0-9]+|\{[a-z][a-z0-9-]*\}))*$/;

  if (!doc.id) errors.push(`${filePath}: missing required field: id`);
  if (doc.type !== "project") errors.push(`${filePath}: type must be 'project', got: ${doc.type}`);
  if (!["draft", "ready", "deprecated"].includes(doc.status)) {
    errors.push(`${filePath}: invalid status: ${doc.status}`);
  }
  if (!doc.project_id) errors.push(`${filePath}: missing required field: project_id`);
  if (!doc.domain) errors.push(`${filePath}: missing required field: domain`);
  if (!doc.groups || !Array.isArray(doc.groups) || doc.groups.length === 0) {
    errors.push(`${filePath}: groups must be a non-empty array`);
  }

  const localIds = new Set<string>();

  function collectIds(sections: DctSection[]): void {
    for (const section of sections) {
      if (section.deliverables) {
        for (const item of section.deliverables) {
          if (!localIdPattern.test(item.local_id)) {
            errors.push(`${filePath}: invalid local_id: ${item.local_id}`);
          }
          if (
            item.instance_id_pattern !== undefined &&
            !instanceIdPattern.test(item.instance_id_pattern)
          ) {
            errors.push(
              `${filePath}: ${item.local_id}: invalid instance_id_pattern: ${item.instance_id_pattern}`,
            );
          }
          if (localIds.has(item.local_id)) {
            errors.push(`${filePath}: duplicate local_id: ${item.local_id}`);
          } else {
            localIds.add(item.local_id);
          }
          if (item.kind === "work") {
            if (!item.path) errors.push(`${filePath}: ${item.local_id}: kind:work requires path`);
            if (!item.done_criteria || item.done_criteria.length === 0) {
              errors.push(`${filePath}: ${item.local_id}: kind:work requires done_criteria`);
            }
          }
        }
      }
      if (section.groups) collectIds(section.groups);
    }
  }

  if (doc.groups) collectIds(doc.groups);

  const depLookup = knownLocalIds ?? localIds;
  const depScope = knownLocalIds ? "catalog" : "this file";

  function checkDeps(sections: DctSection[]): void {
    for (const section of sections) {
      if (section.deliverables) {
        for (const item of section.deliverables) {
          if (item.depends_on) {
            for (const dep of item.depends_on) {
              if (!depLookup.has(dep)) {
                warnings.push(
                  `${filePath}: ${item.local_id}: depends_on '${dep}' not found in ${depScope}`,
                );
              }
            }
          }
        }
      }
      if (section.groups) checkDeps(section.groups);
    }
  }

  if (doc.groups) checkDeps(doc.groups);

  return { ok: errors.length === 0, errors, warnings };
}

type ResolvedDeliverable = {
  item: DctDeliverableItem;
  resolvedPath: string; // repo-relative path (no leading slash) to the deliverable document
};

// Walk all deliverables, resolving each one's document path using the
// leading-slash base_path convention (same rules as renderSections / dct build).
function collectResolvedDeliverables(
  sections: DctSection[],
  parentBase: string,
  out: ResolvedDeliverable[],
): void {
  for (const section of sections) {
    const sectionBase = resolveBasePath(parentBase, section.base_path);
    for (const item of section.deliverables ?? []) {
      out.push({ item, resolvedPath: resolveDeliverablePath(sectionBase, item.path) });
    }
    if (section.groups) collectResolvedDeliverables(section.groups, sectionBase, out);
  }
}

// A deliverable node in the project-global catalog graph, keyed by canonical id
// (`<project_id>:<local_id>`). depends_on is resolved to canonical ids.
type CatalogNode = {
  fullId: string;
  projectId: string;
  localId: string;
  kind: DctKind;
  dependsOn: string[]; // canonical ids
  filePath: string;
  resolvedDocPath?: string; // repo-relative document path (work items with path only)
};

// Builds the project-global graph across all dct-*.yaml in the catalog directory.
// depends_on references are same-project local_ids, so they resolve to
// `<project_id>:<dep>`; this lets the graph span multiple catalog files.
function buildCatalogGraph(catalogPath: string): Map<string, CatalogNode> {
  const nodes = new Map<string, CatalogNode>();
  const files = readdirSync(catalogPath)
    .filter((f) => /^dct-.+\.yaml$/.test(f))
    .sort();

  for (const f of files) {
    const filePath = join(catalogPath, f);
    let doc: DctDoc;
    try {
      doc = yaml.load(readFileSync(filePath, "utf8")) as DctDoc;
    } catch {
      continue;
    }
    if (!doc || !Array.isArray(doc.groups) || !doc.project_id) continue;

    const projectId = doc.project_id;
    const deliverables: ResolvedDeliverable[] = [];
    collectResolvedDeliverables(doc.groups, resolveBasePath("", doc.base_path), deliverables);

    for (const { item, resolvedPath } of deliverables) {
      const fullId = `${projectId}:${item.local_id}`;
      nodes.set(fullId, {
        fullId,
        projectId,
        localId: item.local_id,
        kind: item.kind,
        dependsOn: (item.depends_on ?? []).map((dep) => `${projectId}:${dep}`),
        filePath,
        resolvedDocPath: item.path ? resolvedPath : undefined,
      });
    }
  }
  return nodes;
}

// Transitive closure of a node's depends_on edges over the project-global graph.
function transitiveDependsOn(startId: string, nodes: Map<string, CatalogNode>): Set<string> {
  const seen = new Set<string>();
  const stack = [...(nodes.get(startId)?.dependsOn ?? [])];
  while (stack.length > 0) {
    const current = stack.pop();
    if (current === undefined || seen.has(current)) continue;
    seen.add(current);
    for (const dep of nodes.get(current)?.dependsOn ?? []) {
      if (!seen.has(dep)) stack.push(dep);
    }
  }
  return seen;
}

type RefResolution =
  | { kind: "catalog"; fullId: string } // same-project catalog deliverable (closure-checked)
  | { kind: "external" } // global / product / other-project / non-catalog project doc
  | { kind: "unresolved" }; // matches nothing known

// Resolves a based_on reference per id-and-file-naming-standard §5.2.
// Bare references resolve to the same project first, then to a global/product id.
function resolveReference(
  ref: string,
  projectId: string,
  nodes: Map<string, CatalogNode>,
  knownIds: Set<string>,
): RefResolution {
  if (ref.includes(":")) {
    if (nodes.has(ref)) {
      return ref.startsWith(`${projectId}:`)
        ? { kind: "catalog", fullId: ref }
        : { kind: "external" };
    }
    return knownIds.has(ref) ? { kind: "external" } : { kind: "unresolved" };
  }

  const sameProjectId = `${projectId}:${ref}`;
  if (nodes.has(sameProjectId)) return { kind: "catalog", fullId: sameProjectId };
  if (knownIds.has(sameProjectId)) return { kind: "external" }; // same project, not a catalog deliverable
  if (knownIds.has(ref)) return { kind: "external" }; // global / product doc
  return { kind: "unresolved" };
}

// Reads the based_on list from a deliverable document's frontmatter.
// Returns null when the document file does not exist.
function readBasedOn(docFsPath: string): string[] | null {
  if (!existsSync(docFsPath)) return null;
  const content = readFileSync(docFsPath, "utf8");
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return [];
  let frontmatter: unknown;
  try {
    frontmatter = yaml.load(match[1]);
  } catch {
    return [];
  }
  if (typeof frontmatter !== "object" || frontmatter === null) return [];
  const based = (frontmatter as Record<string, unknown>).based_on;
  if (!Array.isArray(based)) return [];
  return based.filter((value): value is string => typeof value === "string");
}

// Validates the invariant: every same-project catalog deliverable referenced in
// a document's based_on must lie within that deliverable's transitive depends_on
// closure (project-global). A basis document must be produced before the document
// based on it, so it has to be a (transitive) prerequisite in the WBS.
//
// References are resolved per id-and-file-naming-standard §5.2:
//   - bare refs resolve to the same project first, then to a global/product id;
//   - `<project_id>:<local_id>` and other-project refs use the explicit id.
// `knownIds` is the universe of valid document ids (from the doc index); a
// reference that resolves to neither a catalog deliverable nor a known id is
// reported as an error (typo detection / resolve-or-error).
export function validateBasedOn(
  catalogPath: string,
  rootDir: string,
  knownIds: Set<string>,
): DctValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const nodes = buildCatalogGraph(catalogPath);

  for (const node of nodes.values()) {
    if (node.kind !== "work" || !node.resolvedDocPath) continue;

    const basedOn = readBasedOn(join(rootDir, node.resolvedDocPath));
    if (basedOn === null) {
      warnings.push(
        `${node.filePath}: ${node.localId}: based_on を検証する文書が見つかりません (${node.resolvedDocPath})`,
      );
      continue;
    }

    const closure = transitiveDependsOn(node.fullId, nodes);
    for (const ref of basedOn) {
      const resolution = resolveReference(ref, node.projectId, nodes, knownIds);

      if (resolution.kind === "unresolved") {
        errors.push(
          `${node.filePath}: ${node.localId}: based_on '${ref}' を解決できません（プロジェクト内 deliverable にもグローバル ID にも一致しません）`,
        );
        continue;
      }
      if (resolution.kind === "external") continue; // 他プロジェクト/グローバル参照は閉包検査の対象外

      if (resolution.fullId === node.fullId) {
        errors.push(`${node.filePath}: ${node.localId}: based_on が自分自身を参照しています`);
        continue;
      }
      if (!closure.has(resolution.fullId)) {
        errors.push(
          `${node.filePath}: ${node.localId}: based_on '${ref}' (${resolution.fullId}) が depends_on の推移閉包に含まれていません（根拠ドキュメントは先行成果物である必要があります）`,
        );
      }
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}

export function buildCatalog(catalogPath: string): { generated: string[]; errors: string[] } {
  const outputDir = join(catalogPath, "generated");
  mkdirSync(outputDir, { recursive: true });

  const generated: string[] = [];
  const errors: string[] = [];

  const files = readdirSync(catalogPath)
    .filter((f) => /^dct-.+\.yaml$/.test(f))
    .sort();

  const knownLocalIds = collectCatalogLocalIds(catalogPath);

  for (const f of files) {
    const filePath = join(catalogPath, f);
    try {
      const raw = readFileSync(filePath, "utf8");
      const doc = yaml.load(raw) as DctDoc;
      const validation = validateDctDoc(doc, filePath, knownLocalIds);
      if (!validation.ok) {
        errors.push(...validation.errors);
        continue;
      }
      const md = buildMarkdown(doc);
      const outName = basename(f, ".yaml") + ".md";
      const outPath = join(outputDir, outName);
      writeFileSync(outPath, md, "utf8");
      generated.push(outPath);
    } catch (err) {
      errors.push(`${filePath}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { generated, errors };
}
