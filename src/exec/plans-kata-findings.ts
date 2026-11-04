import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveKataRefs, type KataRefs } from "../kata/kata.js";
import {
  isGeneratedGradeTarget,
  isTrashedGradeTarget,
  resolveSafeMarkdownPath,
} from "../grade/targets.js";
import { listFilesRecursive } from "../shared/fs.js";
import {
  gradeContentHash,
  gradeResultPathForDocument,
  readGradeResult,
  resolveGradeResultsDirectory,
} from "../shared/grade-result.js";
import { readSpecdojoNamespace } from "../docs/frontmatter-namespace.js";
import { specdojoRootDir } from "../shared/specdojo-config.js";
import { MISSING } from "../shared/plan-templates.js";
import { inlineCode, planGradeFindingText } from "./plans-grade-findings.js";

/** Pull current deliverable findings into maintenance of the declared Kata. */
export function kataCauseFindingsText(
  projectId: string,
  kind: keyof KataRefs,
  kataPath: string,
): string {
  if (!kataPath || kataPath === MISSING) return "- なし";
  const root = specdojoRootDir();
  const lines: string[] = [];
  let sidecars: string[];
  try {
    sidecars = listFilesRecursive(resolveGradeResultsDirectory(projectId)).sort();
  } catch {
    return "- なし";
  }
  for (const sidecar of sidecars) {
    if (!/\.ya?ml$/.test(sidecar)) continue;
    try {
      const result = readGradeResult(sidecar);
      if (!result || result.target !== "deliverable") continue;
      const path = resolveSafeMarkdownPath(result.path, root, projectId);
      if (isGeneratedGradeTarget(path, root) || isTrashedGradeTarget(path, root)) continue;
      const content = readFileSync(path, "utf8");
      if (gradeContentHash(content) !== result.content_hash) continue;
      // Historical copies and moved documents must not resurrect superseded findings.
      if (
        resolve(gradeResultPathForDocument({ documentPath: path, project: projectId })) !==
        resolve(sidecar)
      )
        continue;
      const metadata = readSpecdojoNamespace(content);
      if (metadata.id !== result.document) continue;
      const rulebook = typeof metadata?.rulebook === "string" ? metadata.rulebook : undefined;
      const refs = resolveKataRefs(rulebook);
      if (refs[kind] === MISSING || resolve(root, refs[kind]) !== resolve(root, kataPath)) continue;
      for (const finding of result.findings) {
        if (finding.cause?.type !== "kata" || finding.cause.kind !== kind) continue;
        lines.push(
          `- ${inlineCode(result.document)} (${inlineCode(result.path)}) ${inlineCode(finding.id)} ${planGradeFindingText(finding, true)}`,
        );
      }
    } catch {
      // Missing, unreadable, or invalid source results are not evidence for a Kata edit.
      continue;
    }
  }
  return lines.join("\n") || "- なし";
}
