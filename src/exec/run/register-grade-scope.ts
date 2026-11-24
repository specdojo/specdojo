import { resolve } from "node:path";
import { resolveDeliverableByDocId } from "../../catalog/document-target.js";
import { reviewGradeFreshness } from "../../review/grade.js";
import { repoRelative } from "../../shared/git.js";

/**
 * Repo-relative grade result sidecars of the documents a register item targets (PJR-NRWJ).
 * Targets outside the catalog or without a grade subject own no sidecar, so an item whose
 * documents are not graded carries none of the root's other grade results.
 */
export function registerGradeResultPaths(params: {
  repoRoot: string;
  projectId: string;
  catalogPath: string | undefined;
  item: { targets?: readonly string[] };
}): string[] {
  const { repoRoot, projectId, catalogPath, item } = params;
  if (!catalogPath) return [];
  const sidecars = new Set<string>();
  for (const target of item.targets ?? []) {
    let subjectPath: string;
    try {
      subjectPath = resolveDeliverableByDocId(catalogPath, projectId, target, repoRoot).info
        .resolvedPath;
    } catch {
      continue;
    }
    const freshness = reviewGradeFreshness({ subjectPath, projectId, rootDir: repoRoot });
    if ("sidecarPath" in freshness && freshness.sidecarPath) {
      sidecars.add(repoRelative(repoRoot, resolve(repoRoot, freshness.sidecarPath)));
    }
  }
  return [...sidecars].sort();
}
