import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { collectDocIndexEntries } from "../docs/doc-index.js";
import { readSpecdojoNamespace } from "../docs/frontmatter-namespace.js";
import { resolveKataRefs, type KataRefs } from "../kata/kata.js";
import { isCondenseRecords } from "../shared/condense-records.js";
import { listFilesRecursive } from "../shared/fs.js";
import { load } from "../shared/yaml.js";
import { getProjectExecutionPath, loadConfig, specdojoRootDir } from "../shared/specdojo-config.js";
import { inlineCode } from "./plans-grade-findings.js";
import {
  isGeneratedGradeTarget,
  isTrashedGradeTarget,
  resolveSafeMarkdownPath,
  resolveSafeRepositoryPath,
} from "../grade/targets.js";

/** Latest completed condense result per deliverable, independent of grade freshness. */
export function condenseKataFindingsText(
  projectId: string,
  kind: keyof KataRefs,
  kataPath: string,
): string[] {
  const root = specdojoRootDir();
  const project = loadConfig(root).config?.projects[projectId];
  if (!project) return [];
  const latest = new Map<string, { meta: Record<string, unknown>; path: string; time: number }>();
  const resultsDir = resolve(root, getProjectExecutionPath(project), "exec/results");
  for (const path of listFilesRecursive(resultsDir).sort()) {
    if (!path.endsWith(".md")) continue;
    try {
      const meta = readSpecdojoNamespace(readFileSync(path, "utf8"));
      if (
        meta.type !== "exec-result" ||
        meta.project_id !== projectId ||
        meta.approach !== "condense" ||
        meta.mode !== "edit" ||
        meta.status !== "complete"
      )
        continue;
      if (
        !Array.isArray(meta.targets) ||
        meta.targets.length !== 1 ||
        typeof meta.targets[0] !== "string"
      )
        continue;
      const timestamp = meta.completed_at ?? meta.started_at;
      const time = typeof timestamp === "string" ? Date.parse(timestamp) : NaN;
      if (!Number.isFinite(time)) continue;
      const previous = latest.get(meta.targets[0]);
      if (!previous || previous.time <= time) latest.set(meta.targets[0], { meta, path, time });
    } catch {
      // An unreadable result is not evidence for editing a Kata.
    }
  }
  if (latest.size === 0) return [];
  const entries = collectDocIndexEntries(resolve(root, "docs"), root);
  const lines: string[] = [];
  for (const [document, { meta, path: resultPath }] of latest) {
    try {
      // Select the latest result before validating records: an empty or invalid latest result
      // must never revive records from an older condense run.
      if (!isCondenseRecords(meta.condense_records)) continue;
      const indexed = entries[document];
      if (!indexed) continue;
      const indexedPath = indexed.replace(/:\d+$/, "");
      const path = indexedPath.endsWith(".md")
        ? resolveSafeMarkdownPath(indexedPath, root, projectId)
        : resolveSafeRepositoryPath(indexedPath, "condense target");
      if (isGeneratedGradeTarget(path, root) || isTrashedGradeTarget(path, root)) continue;
      const content = readFileSync(path, "utf8");
      const parsed: unknown = path.endsWith(".md") ? readSpecdojoNamespace(content) : load(content);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) continue;
      const metadata = parsed as Record<string, unknown>;
      const documentMeta =
        metadata.specdojo && typeof metadata.specdojo === "object"
          ? (metadata.specdojo as Record<string, unknown>)
          : metadata;
      if (documentMeta.id !== document || typeof documentMeta.rulebook !== "string") continue;
      const refs = resolveKataRefs(documentMeta.rulebook);
      if (resolve(root, refs[kind]) !== resolve(root, kataPath)) continue;
      for (const record of meta.condense_records) {
        if (record.cause.type !== "kata" || record.cause.kind !== kind) continue;
        lines.push(
          `- source=condense; result=${inlineCode(String(meta.id ?? resultPath))}; document=${inlineCode(document)}; location=${inlineCode(record.location)}; category=${inlineCode(record.category)}; action=${inlineCode(record.action)}; reason=${inlineCode(record.reason)}; cause=kata:${kind}; location=${inlineCode(record.cause.location)}`,
        );
      }
    } catch {
      // Missing documents or unresolved declarations cannot identify the target Kata.
    }
  }
  return lines;
}
