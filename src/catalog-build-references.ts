import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "./yaml.js";
import { resolveBasePath, resolveDeliverablePath } from "./catalog-paths.js";
import type {
  DctDeliverableItem,
  DctDoc,
  DctKind,
  DctSection,
  DctValidationResult,
} from "./catalog-types.js";
import { isDctCatalogFileName } from "./catalog-types.js";
import { readSpecdojoNamespace } from "./docs/frontmatter-namespace.js";

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
      doc = load(readFileSync(filePath, "utf8")) as DctDoc;
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
