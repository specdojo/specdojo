import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "../shared/yaml.js";
import type {
  DctDoc,
  DctIndexDoc,
  DctIndexDomainGroup,
  DctIndexGroup,
  DctSection,
  DctValidationResult,
} from "./types.js";
import { isDctCatalogFileName } from "./types.js";
import { declaredIncludes, declaredKata } from "../kata/kata.js";
import { readSpecdojoNamespace } from "../docs/frontmatter-namespace.js";
import { flattenTemplateFrontmatter } from "../docs/template-frontmatter.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";
import {
  buildMarkdown,
  isRecord,
  isDctTemplateCatalog,
  renderCatalogTemplateBody,
} from "./build-render.js";
import { collectResolvedDeliverables, validateBasedOn } from "./build-references.js";
import {
  resolveSpecdojoPath,
  resolveSpecdojoPathIfExists,
  specdojoDirectoryPaths,
  specdojoResourceCandidates,
} from "../docs/template-resolution.js";

type CatalogKataKind = "rulebook" | "recipe" | "sample" | "template";

const CATALOG_RULEBOOK_ID_PATTERN = /^(?:[a-z][a-z0-9-]*:)?[a-z0-9][a-z0-9-]*-rulebook$/;

const CATALOG_KATA_DIRS: Record<CatalogKataKind, string> = {
  rulebook: "rulebooks",
  recipe: "recipes",
  sample: "samples",
  template: "templates",
};

function declaredKataCandidates(repoRoot: string, kind: CatalogKataKind, id: string): string[] {
  const localId = id.includes(":") ? id.split(":").slice(1).join(":") : id;
  const extensions = kind === "rulebook" || kind === "recipe" ? ["md"] : ["md", "yaml", "json"];
  return extensions.map((extension) => {
    const relativePath = `docs/ja/specdojo/${CATALOG_KATA_DIRS[kind]}/${localId}.${extension}`;
    return (
      resolveSpecdojoPathIfExists(relativePath, { repositoryRoot: repoRoot }) ??
      specdojoResourceCandidates(relativePath, { repositoryRoot: repoRoot }).repositoryPath
    );
  });
}

function readPracticeDocumentId(filePath: string): string | undefined {
  const content = readFileSync(filePath, "utf8");
  if (filePath.endsWith(".md")) {
    const id = readSpecdojoNamespace(content).id;
    return typeof id === "string" ? id : undefined;
  }
  const parsed = load(content);
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

export { buildMarkdown, isDctTemplateCatalog, renderCatalogTemplateBody };

// Collects every local_id across all dct-*.yaml in a catalog directory.
// Used to resolve cross-file depends_on references (same project, other file).
export function collectCatalogLocalIds(catalogPath: string): Set<string> {
  const ids = new Set<string>();
  const files = readdirSync(catalogPath).filter(isDctCatalogFileName).sort();
  for (const f of files) {
    let doc: DctDoc;
    try {
      doc = load(readFileSync(join(catalogPath, f), "utf8")) as DctDoc;
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
      doc = load(readFileSync(filePath, "utf8")) as DctDoc;
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
      doc = load(readFileSync(filePath, "utf8")) as DctDoc;
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

// Cross-file check: rulebook frontmatter declarations and practice files must agree.
// Declared-but-missing references and existing-but-undeclared counterparts are warnings,
// because the mismatch is an authoring signal rather than a catalog schema failure.
export function validateRulebookKata(catalogPath: string): DctValidationResult {
  const warnings: string[] = [];
  const rulebookIds = new Set<string>();
  const files = readdirSync(catalogPath).filter(isDctCatalogFileName).sort();
  for (const f of files) {
    let doc: DctDoc;
    try {
      doc = load(readFileSync(join(catalogPath, f), "utf8")) as DctDoc;
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
            rulebookId === "undecided" ||
            rulebookId === "not-needed"
          ) {
            continue;
          }
          rulebookIds.add(rulebookId);
        }
        if (section.groups) walk(section.groups);
      }
    };
    walk(doc.groups);
  }

  const repoRoot = specdojoRootDir();
  const rulebooksDirs = specdojoDirectoryPaths("docs/ja/specdojo/rulebooks", {
    repositoryRoot: repoRoot,
  });
  // 実践の型のディレクトリを持たないリポジトリ（テスト用の最小構成など）では、
  // 突き合わせる対象がないため検証を行わない。
  if (rulebooksDirs.length === 0) return { ok: true, errors: [], warnings };
  const seenRulebookFiles = new Set<string>();
  for (const rulebooksDir of rulebooksDirs) {
    for (const file of readdirSync(rulebooksDir).filter((name) => name.endsWith("-rulebook.md"))) {
      if (seenRulebookFiles.has(file)) continue;
      seenRulebookFiles.add(file);
      const fsPath = join(rulebooksDir, file);
      const id = readSpecdojoNamespace(readFileSync(fsPath, "utf8")).id;
      rulebookIds.add(typeof id === "string" ? id : file.replace(/\.md$/, ""));
    }
  }

  const declaredSampleLocalIds = new Set<string>();
  for (const rulebookId of [...rulebookIds].sort()) {
    const refs = declaredKata(rulebookId);
    const declaredPaths = new Set(refs.map((ref) => ref.fsPath));
    for (const ref of refs) {
      if (ref.kind === "sample") {
        declaredSampleLocalIds.add(
          ref.id.includes(":") ? ref.id.split(":").slice(1).join(":") : ref.id,
        );
      }
      if (!existsSync(ref.fsPath)) {
        warnings.push(
          `rulebook '${rulebookId}' declares ${ref.kind} '${ref.id}' but the file is missing: ${ref.fsPath}`,
        );
      }
    }

    const localRulebookId = rulebookId.includes(":")
      ? rulebookId.split(":").slice(1).join(":")
      : rulebookId;
    const prefix = localRulebookId.replace(/-rulebook$/, "");
    for (const kind of ["recipe", "template"] as const) {
      const extensions = kind === "recipe" ? ["md"] : ["md", "yaml", "json"];
      for (const extension of extensions) {
        const fsPath = resolveSpecdojoPathIfExists(
          `docs/ja/specdojo/${CATALOG_KATA_DIRS[kind]}/${prefix}-${kind}.${extension}`,
          { repositoryRoot: repoRoot },
        );
        if (fsPath && !declaredPaths.has(fsPath)) {
          warnings.push(`rulebook '${rulebookId}' does not declare existing ${kind}: ${fsPath}`);
        }
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

  const samplesDirs = specdojoDirectoryPaths("docs/ja/specdojo/samples", {
    repositoryRoot: repoRoot,
  });
  const seenSampleFiles = new Set<string>();
  for (const samplesDir of samplesDirs) {
    const sampleFiles = readdirSync(samplesDir).filter((name) =>
      /-sample\.(?:md|yaml|json)$/.test(name),
    );
    for (const file of sampleFiles) {
      if (seenSampleFiles.has(file)) continue;
      seenSampleFiles.add(file);
      const fsPath = join(samplesDir, file);
      const declaredId = readPracticeDocumentId(fsPath);
      const localId = declaredId
        ? declaredId.includes(":")
          ? declaredId.split(":").slice(1).join(":")
          : declaredId
        : file.replace(/\.(?:md|yaml|json)$/, "");
      if (!declaredSampleLocalIds.has(localId)) {
        warnings.push(`sample '${localId}' exists but no rulebook declares it: ${fsPath}`);
      }
    }
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
          const declaration = item.rulebook;
          if (
            declaration !== undefined &&
            declaration !== "undecided" &&
            declaration !== "not-needed"
          ) {
            if (!CATALOG_RULEBOOK_ID_PATTERN.test(declaration)) {
              errors.push(
                `${filePath}: ${item.local_id}: rulebook must be a rulebook document id, 'undecided', or 'not-needed': ${declaration}`,
              );
            } else if (repoRoot) {
              const existing = declaredKataCandidates(repoRoot, "rulebook", declaration).find(
                (candidate) => existsSync(candidate),
              );
              if (!existing) {
                errors.push(
                  `${filePath}: ${item.local_id}: declared rulebook document id does not exist: ${declaration}`,
                );
              } else {
                const actualId = readPracticeDocumentId(existing);
                if (actualId !== undefined && actualId !== declaration) {
                  errors.push(
                    `${filePath}: ${item.local_id}: declared rulebook document id '${declaration}' does not match '${actualId ?? "<missing>"}' in ${existing}`,
                  );
                }
              }
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

export { collectResolvedDeliverables, validateBasedOn };
export type { ResolvedDeliverable } from "./build-references.js";

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
  return load(readFileSync(filePath, "utf8")) as DctIndexDoc;
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
      doc = load(readFileSync(filePath, "utf8")) as DctDoc;
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
        const templatePath = resolveSpecdojoPath(
          `docs/ja/specdojo/templates/${DCT_INDEX_TEMPLATE}`,
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
