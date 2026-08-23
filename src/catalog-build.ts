import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import type {
  DctDeliverableItem,
  DctDoc,
  DctIndexDoc,
  DctIndexDomainGroup,
  DctIndexGroup,
  DctKind,
  DctSection,
  DctTemplateDoc,
  DctValidationResult,
} from "./catalog-types.js";
import { isDctCatalogFileName } from "./catalog-types.js";
import { declaredIncludes, declaredKata } from "./kata.js";
import { resolveBasePath, resolveDeliverablePath } from "./catalog-paths.js";
import { buildSpecdojoFrontmatter, readSpecdojoNamespace } from "./frontmatter-namespace.js";
import { flattenTemplateFrontmatter } from "./template-frontmatter.js";
import { specdojoRootDir } from "./specdojo-config.js";

type CatalogKataKind = "rulebook" | "recipe" | "sample" | "template";

const CATALOG_KATA_ID_PATTERNS: Record<CatalogKataKind, RegExp> = {
  rulebook: /^(?:[a-z][a-z0-9-]*:)?[a-z0-9][a-z0-9-]*-rulebook$/,
  recipe: /^(?:[a-z][a-z0-9-]*:)?[a-z0-9][a-z0-9-]*-recipe$/,
  sample: /^(?:[a-z][a-z0-9-]*:)?[a-z0-9][a-z0-9-]*-sample$/,
  template: /^(?:[a-z][a-z0-9-]*:)?[a-z0-9][a-z0-9-]*-template$/,
};

const CATALOG_KATA_DIRS: Record<CatalogKataKind, string> = {
  rulebook: "rulebooks",
  recipe: "recipes",
  sample: "samples",
  template: "templates",
};

function declaredKataCandidates(repoRoot: string, kind: CatalogKataKind, id: string): string[] {
  const localId = id.includes(":") ? id.split(":").slice(1).join(":") : id;
  const extensions = kind === "rulebook" || kind === "recipe" ? ["md"] : ["md", "yaml", "json"];
  return extensions.map((extension) =>
    join(repoRoot, "docs/ja/specdojo", CATALOG_KATA_DIRS[kind], `${localId}.${extension}`),
  );
}

function readPracticeDocumentId(filePath: string): string | undefined {
  const content = readFileSync(filePath, "utf8");
  if (filePath.endsWith(".md")) {
    const id = readSpecdojoNamespace(content).id;
    return typeof id === "string" ? id : undefined;
  }
  const parsed = yaml.load(content);
  if (!isRecord(parsed)) return undefined;
  const nested = isRecord(parsed.specdojo) ? parsed.specdojo.id : undefined;
  const extensionMetadata = isRecord(parsed["x-spec-meta"]) ? parsed["x-spec-meta"].id : undefined;
  const id =
    typeof parsed.id === "string"
      ? parsed.id
      : typeof nested === "string"
        ? nested
        : extensionMetadata;
  return typeof id === "string" ? id : undefined;
}

const DCT_INDEX_FILE = "dct-index.yaml";
const DCT_INDEX_TEMPLATE = "dct-index-template.md";

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

function isRecord(value: unknown): value is Record<string, unknown> {
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

// Collects every local_id across all dct-*.yaml in a catalog directory.
// Used to resolve cross-file depends_on references (same project, other file).
export function collectCatalogLocalIds(catalogPath: string): Set<string> {
  const ids = new Set<string>();
  const files = readdirSync(catalogPath).filter(isDctCatalogFileName).sort();
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

// A parsed dct-*.yaml with its source file identity, used to merge multiple
// physical files that share one logical `domain` into a single domain catalog.
export type LoadedDctDoc = {
  file: string; // bare file name (e.g. dct-data-model-sales.yaml)
  filePath: string; // catalog-relative or absolute path used in messages
  doc: DctDoc;
};

// A domain catalog produced by merging one or more dct-*.yaml parts that share the
// same `domain`. `doc` carries the primary part's metadata with all parts' groups
// merged in file order. `errors` collects merge-blocking inconsistencies.
export type MergedDomainCatalog = {
  domain: string;
  doc: DctDoc;
  files: string[]; // source file names in merge order
  errors: string[];
};

// Reads and parses every dct-*.yaml in a catalog directory in sorted file order.
// Files that fail to parse or have no groups are skipped (structural validation
// and parse-error reporting are handled by the caller / validateDctDoc).
export function loadCatalogDocs(catalogPath: string): LoadedDctDoc[] {
  const loaded: LoadedDctDoc[] = [];
  const files = readdirSync(catalogPath).filter(isDctCatalogFileName).sort();
  for (const f of files) {
    const filePath = join(catalogPath, f);
    let doc: DctDoc;
    try {
      doc = yaml.load(readFileSync(filePath, "utf8")) as DctDoc;
    } catch {
      continue;
    }
    if (!doc || !Array.isArray(doc.groups)) continue;
    loaded.push({ file: f, filePath, doc });
  }
  return loaded;
}

// Collect (local_id -> first-seen file) across a section tree, appending an error
// for any local_id that first appears in a different file (cross-file duplicate).
function collectMergedLocalIds(
  sections: DctSection[],
  filePath: string,
  domain: string,
  seen: Map<string, string>,
  reported: Set<string>,
  errors: string[],
): void {
  for (const section of sections) {
    for (const item of section.deliverables ?? []) {
      const prev = seen.get(item.local_id);
      if (prev === undefined) {
        seen.set(item.local_id, filePath);
      } else if (prev !== filePath && !reported.has(item.local_id)) {
        reported.add(item.local_id);
        errors.push(
          `domain '${domain}': duplicate local_id '${item.local_id}' across merged files: ${prev}, ${filePath}`,
        );
      }
    }
    if (section.groups) {
      collectMergedLocalIds(section.groups, filePath, domain, seen, reported, errors);
    }
  }
}

function cloneSection(section: DctSection): DctSection {
  return {
    ...section,
    ...(section.deliverables ? { deliverables: [...section.deliverables] } : {}),
    ...(section.groups ? { groups: section.groups.map(cloneSection) } : {}),
  };
}

// Merge groups contributed by one physical file into groups accumulated from
// earlier files. Only a named group that already existed before this file is a
// merge target, so duplicate headings inside a single file keep their legacy
// shape. Unnamed groups are never keyed and remain heading-less concatenations.
//
// The first occurrence owns scalar metadata (base_path, note, min_size). Later
// matching groups contribute deliverables in definition order and child groups,
// which are merged recursively by the same sibling-level name rule.
function mergeSectionGroups(accumulated: DctSection[], incoming: DctSection[]): DctSection[] {
  const result = accumulated.map(cloneSection);
  const namedTargets = new Map<string, number>();

  for (const [index, section] of result.entries()) {
    if (section.name && !namedTargets.has(section.name)) {
      namedTargets.set(section.name, index);
    }
  }

  for (const section of incoming) {
    const targetIndex = section.name ? namedTargets.get(section.name) : undefined;
    if (targetIndex === undefined) {
      result.push(cloneSection(section));
      continue;
    }

    const target = result[targetIndex];
    result[targetIndex] = {
      ...target,
      ...(section.deliverables
        ? { deliverables: [...(target.deliverables ?? []), ...section.deliverables] }
        : {}),
      ...(section.groups
        ? { groups: mergeSectionGroups(target.groups ?? [], section.groups) }
        : {}),
    };
  }

  return result;
}

// Groups loaded dct docs by their logical `domain` and merges each group's parts
// into a single domain catalog. Merge order is the sorted file order captured by
// loadCatalogDocs, so the result is deterministic and file-listing-order agnostic.
//
// Parts of one domain must agree on `project_id` and `base_path` (both anchor how
// the merged groups resolve), and their `local_id`s must stay unique across parts;
// violations are reported as per-domain errors instead of silently merging.
export function mergeDomainCatalogs(loaded: LoadedDctDoc[]): MergedDomainCatalog[] {
  const order: string[] = [];
  const groups = new Map<string, LoadedDctDoc[]>();
  const sorted = [...loaded].sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0));
  for (const entry of sorted) {
    const domain = entry.doc.domain;
    if (!domain) continue;
    const existing = groups.get(domain);
    if (existing) {
      existing.push(entry);
    } else {
      groups.set(domain, [entry]);
      order.push(domain);
    }
  }

  const merged: MergedDomainCatalog[] = [];
  for (const domain of order) {
    const parts = groups.get(domain);
    if (!parts || parts.length === 0) continue;
    const primary = parts[0];
    const errors: string[] = [];

    for (const part of parts.slice(1)) {
      if (part.doc.project_id !== primary.doc.project_id) {
        errors.push(
          `domain '${domain}': project_id mismatch between ${primary.filePath} (${primary.doc.project_id}) and ${part.filePath} (${part.doc.project_id})`,
        );
      }
      const primaryBase = primary.doc.base_path ?? "";
      const partBase = part.doc.base_path ?? "";
      if (partBase !== primaryBase) {
        errors.push(
          `domain '${domain}': base_path mismatch between ${primary.filePath} (${primaryBase || "-"}) and ${part.filePath} (${partBase || "-"}); parts of one domain must share base_path`,
        );
      }
    }

    let mergedGroups: DctSection[] = [];
    const seen = new Map<string, string>();
    const reported = new Set<string>();
    for (const part of parts) {
      mergedGroups = mergeSectionGroups(mergedGroups, part.doc.groups);
      collectMergedLocalIds(part.doc.groups, part.filePath, domain, seen, reported, errors);
    }

    merged.push({
      domain,
      doc: { ...primary.doc, groups: mergedGroups },
      files: parts.map((p) => p.file),
      errors,
    });
  }
  return merged;
}

// Cross-file check: multiple dct-*.yaml may share a `domain` (physical split of one
// logical domain); build merges them into a single domain catalog. This validates
// that same-domain parts are mergeable — consistent project_id / base_path and
// project-wide-unique local_ids — rather than forbidding the shared domain outright.
export function validateCatalogDomains(catalogPath: string): DctValidationResult {
  const errors = mergeDomainCatalogs(loadCatalogDocs(catalogPath)).flatMap((m) => m.errors);
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
  const files = readdirSync(catalogPath).filter(isDctCatalogFileName).sort();
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

// Reads the specdojo `type` from a rulebook file. Returns undefined when the file
// has no frontmatter or the field is absent.
function readRulebookType(fsPath: string): string | undefined {
  if (!existsSync(fsPath)) return undefined;
  const fm = readSpecdojoNamespace(readFileSync(fsPath, "utf8"));
  return typeof fm.type === "string" ? fm.type : undefined;
}

// Cross-file check: each rulebook referenced by a catalog deliverable that declares
// recipe / sample / template (or includes other rulebooks) in its frontmatter must
// point at files that exist. Returns warnings (not errors); a declared-but-missing
// reference is a soft signal to author the asset, not a build blocker. Each rulebook
// is checked once.
export function validateRulebookKata(catalogPath: string): DctValidationResult {
  const warnings: string[] = [];
  const checked = new Set<string>();
  const files = readdirSync(catalogPath).filter(isDctCatalogFileName).sort();
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
          if (
            !rulebookId ||
            rulebookId === "none" ||
            rulebookId === "not-needed" ||
            checked.has(rulebookId)
          ) {
            continue;
          }
          checked.add(rulebookId);
          for (const ref of declaredKata(rulebookId)) {
            if (!existsSync(ref.fsPath)) {
              warnings.push(
                `rulebook '${rulebookId}' declares ${ref.kind} '${ref.id}' but the file is missing: ${ref.fsPath}`,
              );
            }
          }
          for (const inc of declaredIncludes(rulebookId)) {
            if (inc.selfReference) {
              warnings.push(`rulebook '${rulebookId}' includes itself; remove the self-reference`);
              continue;
            }
            if (!existsSync(inc.fsPath)) {
              warnings.push(
                `rulebook '${rulebookId}' includes '${inc.id}' but the file is missing: ${inc.fsPath}`,
              );
              continue;
            }
            const type = readRulebookType(inc.fsPath);
            if (type !== "rulebook") {
              warnings.push(
                `rulebook '${rulebookId}' includes '${inc.id}' but it is not a rulebook (type: ${type ?? "unknown"})`,
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
  repoRoot?: string,
): DctValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const localIdPattern = /^[a-z0-9][a-z0-9-]*$/;
  const instanceIdPattern =
    /^(?=.*\{[a-z][a-z0-9-]*\})[a-z0-9]+(?:-(?:[a-z0-9]+|\{[a-z][a-z0-9-]*\}))*$/;
  const overlyBroadEvidencePaths = new Set([
    "src",
    "tools",
    "docs",
    "tests",
    "templates",
    "public",
    ".github",
    ".agents",
    ".codex",
    ".specdojo",
  ]);

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
          for (const kind of ["rulebook", "recipe", "sample", "template"] as const) {
            const declaration = item[kind];
            if (declaration === undefined || declaration === "not-needed") continue;
            if (!CATALOG_KATA_ID_PATTERNS[kind].test(declaration)) {
              errors.push(
                `${filePath}: ${item.local_id}: ${kind} must be a ${kind} document id or 'not-needed': ${declaration}`,
              );
              continue;
            }
            if (!repoRoot) continue;
            const existing = declaredKataCandidates(repoRoot, kind, declaration).find((candidate) =>
              existsSync(candidate),
            );
            if (!existing) {
              errors.push(
                `${filePath}: ${item.local_id}: declared ${kind} document id does not exist: ${declaration}`,
              );
              continue;
            }
            const actualId = readPracticeDocumentId(existing);
            if (actualId !== undefined && actualId !== declaration) {
              errors.push(
                `${filePath}: ${item.local_id}: declared ${kind} document id '${declaration}' does not match '${actualId ?? "<missing>"}' in ${existing}`,
              );
            }
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
          if (item.evidence_refs !== undefined) {
            if (!Array.isArray(item.evidence_refs) || item.evidence_refs.length === 0) {
              errors.push(`${filePath}: ${item.local_id}: evidence_refs must be a non-empty array`);
            } else {
              const evidencePaths = new Set<string>();
              for (const rawRef of item.evidence_refs as unknown[]) {
                if (!isRecord(rawRef)) {
                  errors.push(
                    `${filePath}: ${item.local_id}: evidence_refs entries must be objects`,
                  );
                  continue;
                }
                if (rawRef.kind !== "implementation") {
                  errors.push(
                    `${filePath}: ${item.local_id}: evidence_refs kind must be 'implementation'`,
                  );
                }
                const evidencePath = typeof rawRef.path === "string" ? rawRef.path : "";
                const segments = evidencePath.split("/");
                const canonical =
                  evidencePath.length > 0 &&
                  !evidencePath.startsWith("/") &&
                  !evidencePath.includes("\\") &&
                  !evidencePath.includes("//") &&
                  !/\s/.test(evidencePath) &&
                  segments.every(
                    (segment) => segment !== "" && segment !== "." && segment !== "..",
                  );
                if (!canonical) {
                  errors.push(
                    `${filePath}: ${item.local_id}: evidence_refs path must be canonical repo-relative: ${evidencePath || "<missing>"}`,
                  );
                  continue;
                }
                if (evidencePaths.has(evidencePath)) {
                  errors.push(
                    `${filePath}: ${item.local_id}: duplicate evidence_refs path: ${evidencePath}`,
                  );
                } else {
                  evidencePaths.add(evidencePath);
                }
                if (overlyBroadEvidencePaths.has(evidencePath)) {
                  errors.push(
                    `${filePath}: ${item.local_id}: evidence_refs path is overly broad: ${evidencePath}`,
                  );
                }
                if (repoRoot && !existsSync(join(repoRoot, evidencePath))) {
                  errors.push(
                    `${filePath}: ${item.local_id}: evidence_refs path does not exist: ${evidencePath}`,
                  );
                }
                if (typeof rawRef.purpose !== "string" || rawRef.purpose.trim().length === 0) {
                  errors.push(
                    `${filePath}: ${item.local_id}: evidence_refs purpose must be a non-empty string`,
                  );
                }
              }
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

export type ResolvedDeliverable = {
  item: DctDeliverableItem;
  resolvedPath: string; // repo-relative path (no leading slash) to the deliverable document
};

// Walk all deliverables, resolving each one's document path using the
// leading-slash base_path convention (same rules as renderSections / dct build).
export function collectResolvedDeliverables(
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
  const files = readdirSync(catalogPath).filter(isDctCatalogFileName).sort();

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

// Resolves a based_on reference per specdojo:id-and-file-naming-standard §5.2.
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
  // based_on は Markdown frontmatter の `specdojo:` 名前空間配下にある。
  const based = readSpecdojoNamespace(content).based_on;
  if (!Array.isArray(based)) return [];
  return based.filter((value): value is string => typeof value === "string");
}

// Validates the invariant: every same-project catalog deliverable referenced in
// a document's based_on must lie within that deliverable's transitive depends_on
// closure (project-global). A basis document must be produced before the document
// based on it, so it has to be a (transitive) prerequisite in the WBS.
//
// References are resolved per specdojo:id-and-file-naming-standard §5.2:
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

function validateDctIndexStructure(doc: DctIndexDoc, filePath: string): DctValidationResult {
  const errors: string[] = [];
  if (!doc || typeof doc !== "object") {
    return { ok: false, errors: [`${filePath}: document must be an object`], warnings: [] };
  }
  if (!doc.id) errors.push(`${filePath}: missing required field: id`);
  if (doc.type !== "project") errors.push(`${filePath}: type must be 'project', got: ${doc.type}`);
  if (!(["draft", "ready", "deprecated"] as unknown[]).includes(doc.status)) {
    errors.push(`${filePath}: invalid status: ${doc.status}`);
  }
  if (!doc.title) errors.push(`${filePath}: missing required field: title`);
  if (doc.rulebook !== "specdojo:dct-index-rulebook") {
    errors.push(`${filePath}: rulebook must be 'specdojo:dct-index-rulebook'`);
  }
  if (!/^prj-[0-9]{4,}$/.test(doc.project_id ?? "")) {
    errors.push(`${filePath}: invalid project_id: ${doc.project_id}`);
  } else if (doc.id !== `${doc.project_id}:dct-index`) {
    errors.push(`${filePath}: id must be '${doc.project_id}:dct-index', got: ${doc.id}`);
  }
  if (!(["small", "medium", "large"] as unknown[]).includes(doc.size)) {
    errors.push(`${filePath}: size must be one of: small|medium|large`);
  }
  if (!Array.isArray(doc.groups) || doc.groups.length === 0) {
    errors.push(`${filePath}: groups must be a non-empty array`);
  } else {
    const domains = new Set<string>();
    const validateGroups = (groups: unknown[], path: string, depth: number): void => {
      const groupNames = new Set<string>();
      for (const [groupIndex, value] of groups.entries()) {
        const groupAt = `${path}[${groupIndex}]`;
        if (!isRecord(value)) {
          errors.push(`${groupAt}: group must be an object`);
          continue;
        }

        const name = value.name;
        if (typeof name !== "string" || name.trim().length === 0) {
          errors.push(`${groupAt}: name must be a non-empty string`);
        } else if (/[|\r\n]/.test(name)) {
          errors.push(`${groupAt}: name must not contain a table delimiter or newline`);
        } else if (groupNames.has(name)) {
          errors.push(`${groupAt}: duplicate group name: ${name}`);
        } else {
          groupNames.add(name);
        }

        const hasDomains = Object.hasOwn(value, "domains");
        const hasGroups = Object.hasOwn(value, "groups");
        if (hasDomains === hasGroups) {
          errors.push(`${groupAt}: exactly one of domains or groups must be specified`);
          continue;
        }

        if (hasGroups) {
          if (depth >= 1) {
            errors.push(`${groupAt}: groups may only be nested one level`);
            continue;
          }
          if (!Array.isArray(value.groups) || value.groups.length === 0) {
            errors.push(`${groupAt}: groups must be a non-empty array`);
            continue;
          }
          validateGroups(value.groups, `${groupAt}.groups`, depth + 1);
          continue;
        }

        if (!Array.isArray(value.domains) || value.domains.length === 0) {
          errors.push(`${groupAt}: domains must be a non-empty array`);
          continue;
        }
        for (const [domainIndex, domainValue] of value.domains.entries()) {
          const at = `${groupAt}.domains[${domainIndex}]`;
          if (!isRecord(domainValue)) {
            errors.push(`${at}: domain declaration must be an object`);
            continue;
          }
          const domain = domainValue.domain;
          if (typeof domain !== "string" || !/^[a-z0-9][a-z0-9-]{0,62}$/.test(domain)) {
            errors.push(`${at}: invalid domain: ${String(domain)}`);
          } else if (domains.has(domain)) {
            errors.push(`${at}: duplicate domain declaration: ${domain}`);
          } else {
            domains.add(domain);
          }
          for (const field of ["name", "overview"] as const) {
            const fieldValue = domainValue[field];
            if (typeof fieldValue !== "string" || fieldValue.trim().length === 0) {
              errors.push(`${at}: ${field} must be a non-empty string`);
            } else if (/[|\r\n]/.test(fieldValue)) {
              errors.push(`${at}: ${field} must not contain a table delimiter or newline`);
            }
          }
        }
      }
    };
    validateGroups(doc.groups, `${filePath}: groups`, 0);
  }
  return { ok: errors.length === 0, errors, warnings: [] };
}

function flattenDctIndexDomains(groups: DctIndexGroup[]): DctIndexDomainGroup["domains"] {
  return groups.flatMap((group) =>
    "domains" in group ? group.domains : group.groups.flatMap((child) => child.domains),
  );
}

export function loadDctIndex(catalogPath: string): DctIndexDoc | null {
  const filePath = join(catalogPath, DCT_INDEX_FILE);
  if (!existsSync(filePath)) return null;
  return yaml.load(readFileSync(filePath, "utf8")) as DctIndexDoc;
}

// The index declaration and physical domain files must describe exactly the same domain set.
// Multiple physical files for one domain intentionally collapse to one declaration.
export function validateCatalogIndex(catalogPath: string): DctValidationResult {
  const filePath = join(catalogPath, DCT_INDEX_FILE);
  if (!existsSync(filePath)) {
    return {
      ok: false,
      errors: [`${filePath}: missing dct-index.yaml; declare every catalog domain in this file`],
      warnings: [],
    };
  }

  let doc: DctIndexDoc;
  try {
    doc = loadDctIndex(catalogPath) as DctIndexDoc;
  } catch (error) {
    return {
      ok: false,
      errors: [`${filePath}: ${error instanceof Error ? error.message : String(error)}`],
      warnings: [],
    };
  }
  const structural = validateDctIndexStructure(doc, filePath);
  if (!structural.ok) return structural;

  const declared = new Set(flattenDctIndexDomains(doc.groups).map((item) => item.domain));
  const actual = new Set(loadCatalogDocs(catalogPath).map((entry) => entry.doc.domain));
  const errors: string[] = [];
  for (const domain of [...declared].sort()) {
    if (!actual.has(domain)) {
      errors.push(`${filePath}: declared domain '${domain}' has no dct-*.yaml source`);
    }
  }
  for (const domain of [...actual].sort()) {
    if (!declared.has(domain)) {
      errors.push(`${filePath}: domain '${domain}' from dct-*.yaml is not declared`);
    }
  }
  return { ok: errors.length === 0, errors, warnings: [] };
}

function injectDctIndexSlot(content: string, tables: string): string {
  const marker = "<!-- specdojo:view-slot=domain-tables -->";
  if (!content.includes(marker)) {
    throw new Error(`View-slot not found in template: domain-tables`);
  }
  return content.replace(marker, tables);
}

export function buildDctIndexMarkdown(doc: DctIndexDoc, templateRaw: string): string {
  const template = flattenTemplateFrontmatter(templateRaw)
    .replaceAll("_PROJECT_ID_", doc.project_id)
    .replaceAll("_STATUS_", doc.status);
  const renderGroups = (groups: DctIndexGroup[], prefix: number[], level: number): string[] =>
    groups.flatMap((group, groupIndex) => {
      const numbers = [...prefix, groupIndex + 1];
      const heading = `${"#".repeat(level)} ${numbers.join(".")}. ${group.name}`;
      if ("groups" in group) {
        return [heading, "", ...renderGroups(group.groups, numbers, level + 1)];
      }
      const rows = group.domains.map(
        (entry) =>
          `| \`${entry.domain}\` | ${entry.name} | [dct-${entry.domain}](./dct-${entry.domain}.md) | ${entry.overview} |`,
      );
      return [
        heading,
        "",
        "<!-- prettier-ignore -->",
        "| ドメイン | 名称 | 成果物カタログ | 概要 |",
        "| --- | --- | --- | --- |",
        ...rows,
        "",
      ];
    });
  const tables = renderGroups(doc.groups, [2], 3).join("\n").trimEnd();
  return `${injectDctIndexSlot(template, tables).trimEnd()}\n`;
}

export function buildCatalog(catalogPath: string): { generated: string[]; errors: string[] } {
  const outputDir = join(catalogPath, "generated");
  mkdirSync(outputDir, { recursive: true });

  const generated: string[] = [];
  const errors: string[] = [];

  const files = readdirSync(catalogPath).filter(isDctCatalogFileName).sort();

  const knownLocalIds = collectCatalogLocalIds(catalogPath);

  // Per-file structural validation first. Files that pass become merge inputs;
  // a domain with any invalid part is skipped so we never emit a partial catalog.
  const loaded: LoadedDctDoc[] = [];
  const invalidDomains = new Set<string>();
  for (const f of files) {
    const filePath = join(catalogPath, f);
    let doc: DctDoc;
    try {
      doc = yaml.load(readFileSync(filePath, "utf8")) as DctDoc;
    } catch (err) {
      errors.push(`${filePath}: ${err instanceof Error ? err.message : String(err)}`);
      continue;
    }
    const validation = validateDctDoc(doc, filePath, knownLocalIds);
    if (!validation.ok) {
      errors.push(...validation.errors);
      if (doc?.domain) invalidDomains.add(doc.domain);
      continue;
    }
    loaded.push({ file: f, filePath, doc });
  }

  // Merge same-domain parts into one domain catalog, keyed and named by `domain`
  // so a single file (dct-<domain>.yaml) keeps its previous dct-<domain>.md output.
  for (const catalog of mergeDomainCatalogs(loaded)) {
    if (invalidDomains.has(catalog.domain)) continue;
    if (catalog.errors.length > 0) {
      errors.push(...catalog.errors);
      continue;
    }
    try {
      const md = buildMarkdown(catalog.doc);
      const outPath = join(outputDir, `dct-${catalog.domain}.md`);
      writeFileSync(outPath, md, "utf8");
      generated.push(outPath);
    } catch (err) {
      errors.push(`dct-${catalog.domain}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  const indexPath = join(catalogPath, DCT_INDEX_FILE);
  if (existsSync(indexPath)) {
    const indexValidation = validateCatalogIndex(catalogPath);
    if (!indexValidation.ok) {
      errors.push(...indexValidation.errors);
    } else {
      try {
        const index = loadDctIndex(catalogPath) as DctIndexDoc;
        const templatePath = join(
          specdojoRootDir(),
          "docs/ja/specdojo/templates",
          DCT_INDEX_TEMPLATE,
        );
        if (!existsSync(templatePath)) throw new Error(`Template not found: ${templatePath}`);
        const outputPath = join(outputDir, "dct-index.md");
        const markdown = buildDctIndexMarkdown(index, readFileSync(templatePath, "utf8"));
        writeFileSync(outputPath, markdown, "utf8");
        generated.push(outputPath);
      } catch (error) {
        errors.push(`dct-index: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  return { generated, errors };
}
