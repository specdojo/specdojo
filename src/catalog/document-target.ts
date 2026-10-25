import { existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { collectResolvedDeliverables } from "./build.js";
import { resolveBasePath } from "./paths.js";
import type { DctDeliverableItem, DctDoc } from "./types.js";
import { readSpecdojoNamespace } from "../docs/frontmatter-namespace.js";
import { load } from "../shared/yaml.js";
import { listFilesRecursive } from "../shared/fs.js";
import { isDctPlanFileName } from "./plan.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";

export type DeliverableInfo = {
  catalogless?: boolean;
  deliverable: DctDeliverableItem;
  resolvedPath: string;
};
export type ResolvedDeliverable = {
  domain: string;
  localId: string;
  slug: string;
  info: DeliverableInfo;
};

// Existing document metadata is authoritative; uncreated product docs use a bare id.
export function deliverableDocId(
  projectId: string,
  localId: string,
  resolvedPath: string | undefined,
  repoRoot: string = specdojoRootDir(),
): string {
  if (resolvedPath) {
    const absolutePath = resolve(repoRoot, resolvedPath);
    if (existsSync(absolutePath)) {
      try {
        const id = readSpecdojoNamespace(readFileSync(absolutePath, "utf8")).id;
        if (typeof id === "string" && id.trim()) return id.trim();
      } catch {
        // Invalid metadata falls back to the placement convention.
      }
    }
    const normalized = resolvedPath.replaceAll("\\", "/").replace(/^\/+/, "");
    if (/^docs\/[a-z]{2}\/product(?:\/|$)/.test(normalized)) return localId;
  }
  return projectId ? `${projectId}:${localId}` : localId;
}

export function loadPlanCatalogDocs(catalogPath: string): DctDoc[] {
  if (!catalogPath || !existsSync(catalogPath)) return [];
  // Catalog scans walk subdirectories, so agent judgment plans (plans/dct-plan-*.yaml)
  // must be excluded; they share the dct- prefix but carry no catalog structure.
  const files = listFilesRecursive(catalogPath)
    .filter((f) => {
      const name = basename(f);
      return /^dct-.+\.ya?ml$/i.test(name) && !isDctPlanFileName(name);
    })
    .sort();

  const docs: DctDoc[] = [];
  for (const filePath of files) {
    try {
      docs.push(load(readFileSync(filePath, "utf8")) as DctDoc);
    } catch {
      continue;
    }
  }
  return docs;
}

export function resolveDeliverableByDocId(
  catalogPath: string,
  projectId: string,
  targetId: string,
  repoRoot: string = specdojoRootDir(),
): ResolvedDeliverable {
  const matches: ResolvedDeliverable[] = [];
  for (const doc of loadPlanCatalogDocs(catalogPath)) {
    const deliverables: Parameters<typeof collectResolvedDeliverables>[2] = [];
    collectResolvedDeliverables(doc.groups, resolveBasePath("", doc.base_path), deliverables);
    for (const { item, resolvedPath } of deliverables) {
      if (
        targetId === deliverableDocId(projectId, item.local_id, resolvedPath, repoRoot) ||
        targetId === item.local_id ||
        targetId === `${projectId}:${item.local_id}`
      ) {
        matches.push({
          domain: doc.domain,
          localId: item.local_id,
          slug: item.local_id,
          info: { deliverable: item, resolvedPath },
        });
      }
    }
  }
  if (matches.length === 0)
    throw new Error(`catalog deliverable target not found for document id: ${targetId}`);
  if (matches.length > 1)
    throw new Error(
      `ambiguous catalog deliverable target for document id ${targetId}: ${matches.map((match) => match.localId).join(", ")}`,
    );
  return matches[0];
}
