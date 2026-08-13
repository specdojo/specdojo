// Moves a deliverable's document file into a project's `trash/` directory
// (id-and-file-naming-standard.md 9.1 経路A: rename-only, id-stable) and updates the
// catalog entry's `path` in place. `local_id` never changes, so Schedule and past task
// IDs derived from it are unaffected.
//
// The catalog file is edited as text (not a full YAML parse+dump) so unrelated
// comments and formatting in dct-*.yaml are preserved. The specific deliverable's
// `path:` field is located by matching its exact sibling-field indentation (two
// spaces past the `- local_id:` list marker), which keeps it from matching the
// unrelated nested `evidence_refs[].path` field.

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import yaml from "js-yaml";
import { type DctDoc, type DctSection } from "./catalog-types.js";
import { resolveBasePath, resolveDeliverablePath } from "./catalog-paths.js";
import { readSpecdojoNamespace } from "./frontmatter-namespace.js";
import { gitOutput } from "./exec-worktree.js";

export type TrashPlan = {
  localId: string;
  catalogFile: string; // repo-relative path to the dct-*.yaml holding the entry
  oldDocPath: string; // repo-relative, no leading slash
  newDocPath: string; // repo-relative, no leading slash
  frontmatterStatus: string | null; // null when the doc has no readable specdojo.status
};

export type TrashResult = TrashPlan & { moved: boolean };

function findCatalogFiles(catalogDir: string): string[] {
  return readdirSync(catalogDir)
    .filter((f) => /^dct-.+\.yaml$/.test(f))
    .sort();
}

function findDeliverablePath(
  sections: DctSection[],
  parentBase: string,
  localId: string,
): string | null {
  for (const section of sections) {
    const sectionBase = resolveBasePath(parentBase, section.base_path);
    for (const item of section.deliverables ?? []) {
      if (item.local_id === localId) return resolveDeliverablePath(sectionBase, item.path);
    }
    if (section.groups) {
      const found = findDeliverablePath(section.groups, sectionBase, localId);
      if (found) return found;
    }
  }
  return null;
}

function locateDeliverable(
  catalogDir: string,
  localId: string,
): { catalogFile: string; docPath: string; projectId: string } | null {
  for (const file of findCatalogFiles(catalogDir)) {
    const fullPath = join(catalogDir, file);
    let doc: DctDoc;
    try {
      doc = yaml.load(readFileSync(fullPath, "utf8")) as DctDoc;
    } catch {
      continue;
    }
    if (!doc || !Array.isArray(doc.groups)) continue;

    const docPath = findDeliverablePath(doc.groups, resolveBasePath("", doc.base_path), localId);
    if (docPath) return { catalogFile: fullPath, docPath, projectId: doc.project_id };
  }
  return null;
}

// Resolve the trash destination for a repo-relative document path. Only
// docs/ja/product/** and docs/ja/projects/<project-id>/** are supported (2026-08:
// the two content trees this convention currently applies to).
function resolveTrashDestination(oldDocPath: string, projectId: string): string {
  const name = basename(oldDocPath);
  if (oldDocPath.startsWith("docs/ja/product/")) return `docs/ja/product/trash/${name}`;
  const projectPrefix = `docs/ja/projects/${projectId}/`;
  if (oldDocPath.startsWith(projectPrefix)) return `docs/ja/projects/${projectId}/trash/${name}`;
  throw new Error(
    `Unsupported location for trash: ${oldDocPath} ` +
      `(only docs/ja/product/** and docs/ja/projects/${projectId}/** are supported)`,
  );
}

// Replace the deliverable's own `path:` field in the raw catalog YAML text, without
// re-serializing the whole document (which would drop comments/formatting).
function rewriteCatalogPath(rawYaml: string, localId: string, newDocPath: string): string {
  const lines = rawYaml.split("\n");
  const startRe = new RegExp(`^(\\s*)- local_id:\\s*${localId}\\s*$`);

  let itemIndent: string | null = null;
  let startIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(startRe);
    if (match) {
      itemIndent = match[1];
      startIndex = i;
      break;
    }
  }
  if (itemIndent === null || startIndex < 0) {
    throw new Error(`local_id '${localId}' not found as a '- local_id:' list entry`);
  }

  const siblingIndent = `${itemIndent}  `;
  const pathRe = new RegExp(`^${siblingIndent}path:\\s*.*$`);
  const listIndentLength = itemIndent.length;

  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    const leading = line.match(/^\s*/)?.[0] ?? "";
    if (leading.length <= listIndentLength && line.trim() !== "") {
      break; // left this entry's block without finding an own path: field
    }
    if (pathRe.test(line)) {
      // Written with a leading "/" so it re-anchors at the repo root regardless of the
      // entry's section base_path (resolveDeliverablePath / catalog-paths.ts convention).
      lines[i] = `${siblingIndent}path: /${newDocPath}`;
      return lines.join("\n");
    }
  }
  throw new Error(`local_id '${localId}' has no own 'path:' field to rewrite`);
}

export function planTrash(repoRoot: string, catalogDir: string, localId: string): TrashPlan {
  const located = locateDeliverable(catalogDir, localId);
  if (!located) {
    throw new Error(`local_id '${localId}' not found in any dct-*.yaml under ${catalogDir}`);
  }
  const newDocPath = resolveTrashDestination(located.docPath, located.projectId);
  const absOldPath = join(repoRoot, located.docPath);
  const frontmatterStatus = existsSync(absOldPath)
    ? ((readSpecdojoNamespace(readFileSync(absOldPath, "utf8")).status as string | undefined) ??
      null)
    : null;

  return {
    localId,
    catalogFile: relative(repoRoot, located.catalogFile),
    oldDocPath: located.docPath,
    newDocPath,
    frontmatterStatus,
  };
}

export function applyTrash(repoRoot: string, plan: TrashPlan): TrashResult {
  const absOldPath = join(repoRoot, plan.oldDocPath);
  const absNewPath = join(repoRoot, plan.newDocPath);
  const absCatalogFile = join(repoRoot, plan.catalogFile);

  if (!existsSync(absOldPath)) {
    throw new Error(`Document not found: ${plan.oldDocPath}`);
  }
  if (existsSync(absNewPath)) {
    throw new Error(`Destination already exists: ${plan.newDocPath}`);
  }

  const rawYaml = readFileSync(absCatalogFile, "utf8");
  const rewritten = rewriteCatalogPath(rawYaml, plan.localId, plan.newDocPath);

  // Verify the rewrite parses and resolves to the expected path before touching the
  // filesystem, so a formatting assumption that doesn't hold aborts cleanly.
  const reparsed = yaml.load(rewritten) as DctDoc;
  const resolvedAfter = reparsed?.groups
    ? findDeliverablePath(reparsed.groups, resolveBasePath("", reparsed.base_path), plan.localId)
    : null;
  if (resolvedAfter !== plan.newDocPath) {
    throw new Error(
      `Catalog rewrite verification failed for '${plan.localId}': ` +
        `expected path '${plan.newDocPath}', got '${String(resolvedAfter)}'`,
    );
  }

  mkdirSync(dirname(absNewPath), { recursive: true });
  gitOutput(repoRoot, ["mv", plan.oldDocPath, plan.newDocPath]);
  writeFileSync(absCatalogFile, rewritten, "utf8");

  return { ...plan, moved: true };
}
