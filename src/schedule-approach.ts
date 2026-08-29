// Deterministic approach selection for schedule strategy generation. Task intent is declared in
// sch-strategy-<track>.yaml; deliverable/Kata facts and stored grades are read on every run.

import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import yaml from "js-yaml";
import { collectResolvedDeliverables, type ResolvedDeliverable } from "./catalog-build.js";
import { resolveBasePath } from "./catalog-paths.js";
import type { DctDoc, DctKind } from "./catalog-types.js";
import { readYaml } from "./exec-shared.js";
import { readSpecdojoNamespace } from "./frontmatter-namespace.js";
import { validateGradedMarkdown } from "./grade.js";
import { KATA_MISSING, loadRulebookRefs, resolveKataRefs, type KataRefs } from "./kata.js";
import type { Approach } from "./exec-types.js";

export type KataKindKey = keyof KataRefs;
export const KATA_KINDS: readonly KataKindKey[] = ["rulebook", "recipe", "sample", "template"];

export type TaskIntent =
  | "author-deliverable"
  | "bootstrap-kata-set"
  | "reflect-implementation"
  | "deduplicate-across-deliverables"
  | "improve-kata"
  | "confirm-deliverable"
  | "confirm-with-kata-set";

export type ApproachRule = {
  local_ids: string[];
  intent: TaskIntent;
  kata_target?: KataKindKey;
  bootstrap_scope?: KataKindKey[];
};

export type StrategyScope = {
  strategyId: string;
  track: string;
  projectId: string;
  catalogs: Array<{ id: string; path: string }>;
  includeKinds: DctKind[];
};

type GradeFact = { verdict: "pass" | "needs-work" | "fail" };
type KataDeclaration =
  | "declared"
  | "conventional"
  | "none"
  | "undecided"
  | "not-needed"
  | "unresolved";
type KataFact = {
  declaration: KataDeclaration;
  exists: boolean;
  broken_reference: boolean;
  grade?: GradeFact;
};
type DeliverableFacts = {
  deliverableExists: boolean;
  resolvedEvidenceCount: number;
  kata: Record<KataKindKey, KataFact>;
};
type EffectiveUsability = "usable" | "unusable" | "unknown" | "absent" | "not-needed";
type RecommendedApproach = Approach | "undecided";

export type StrategyDeliverableApproach = {
  local_id: string;
  catalog_id: string;
  approach: Approach;
  not_needed_kata?: KataKindKey[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readGrade(repoRoot: string, relPath: string): GradeFact | undefined {
  const filePath = join(repoRoot, relPath);
  if (!existsSync(filePath)) return undefined;
  try {
    const content = readFileSync(filePath, "utf8");
    let metadata: Record<string, unknown>;
    if (relPath.endsWith(".md")) {
      if (validateGradedMarkdown(content, relPath).length > 0) return undefined;
      metadata = readSpecdojoNamespace(content);
    } else {
      const parsed = relPath.endsWith(".json") ? JSON.parse(content) : yaml.load(content);
      if (!isRecord(parsed)) return undefined;
      metadata = isRecord(parsed.specdojo) ? parsed.specdojo : parsed;
    }
    const grade = metadata.grade;
    if (
      !isRecord(grade) ||
      (grade.verdict !== "pass" && grade.verdict !== "needs-work" && grade.verdict !== "fail")
    ) {
      return undefined;
    }
    return { verdict: grade.verdict };
  } catch {
    return undefined;
  }
}

function kataFact(
  repoRoot: string,
  kind: KataKindKey,
  rulebookId: string | undefined,
  refs: KataRefs,
  declaredId: string | undefined,
): KataFact {
  const refPath = refs[kind];
  const path = refPath === KATA_MISSING ? undefined : refPath;
  const declared = kind === "rulebook" ? rulebookId : declaredId;
  let declaration: KataDeclaration;
  if (declared === "not-needed") declaration = "not-needed";
  else if (declared === "undecided") declaration = "undecided";
  else if (declared === "none") declaration = "none";
  else if (declared) declaration = "declared";
  else if (path) declaration = "conventional";
  else declaration = "unresolved";
  const exists = path ? existsSync(join(repoRoot, path)) : false;
  const grade = path && exists ? readGrade(repoRoot, path) : undefined;
  return {
    declaration,
    exists,
    broken_reference: declaration === "declared" && !exists,
    ...(grade ? { grade } : {}),
  };
}

export function collectApproachFacts(opts: { repoRoot: string; scope: StrategyScope }): {
  deliverables: Array<{ local_id: string; catalog_id: string; facts: DeliverableFacts }>;
  errors: string[];
  warnings: string[];
} {
  const deliverables: Array<{ local_id: string; catalog_id: string; facts: DeliverableFacts }> = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();
  for (const catalogRef of opts.scope.catalogs) {
    const catalogPath = resolve(opts.repoRoot, catalogRef.path.replace(/^\//, ""));
    if (!existsSync(catalogPath)) {
      errors.push(`Catalog not found: ${catalogRef.path}`);
      continue;
    }
    const doc = readYaml(catalogPath) as DctDoc | null;
    if (!doc?.groups) {
      errors.push(`${catalogRef.path}: missing groups field`);
      continue;
    }
    const collected: ResolvedDeliverable[] = [];
    collectResolvedDeliverables(doc.groups, resolveBasePath("", doc.base_path), collected);
    for (const { item, resolvedPath } of collected) {
      if (!opts.scope.includeKinds.includes(item.kind)) continue;
      if (seen.has(item.local_id)) {
        warnings.push(`Duplicate local_id in scope (kept first): ${item.local_id}`);
        continue;
      }
      seen.add(item.local_id);
      const refs = resolveKataRefs(item.rulebook, item.kind);
      const declared =
        item.rulebook && !["none", "undecided", "not-needed"].includes(item.rulebook)
          ? loadRulebookRefs(item.rulebook)
          : {};
      const derived =
        item.kind === "generated"
          ? "not-needed"
          : item.rulebook === "undecided" || item.rulebook === "not-needed"
            ? item.rulebook
            : undefined;
      const kata = {
        rulebook: kataFact(
          opts.repoRoot,
          "rulebook",
          item.kind === "generated" ? "not-needed" : item.rulebook,
          refs,
          undefined,
        ),
        recipe: kataFact(opts.repoRoot, "recipe", item.rulebook, refs, derived ?? declared.recipe),
        sample: kataFact(
          opts.repoRoot,
          "sample",
          item.rulebook,
          refs,
          derived ?? (Array.isArray(declared.sample) ? declared.sample[0] : declared.sample),
        ),
        template: kataFact(
          opts.repoRoot,
          "template",
          item.rulebook,
          refs,
          derived ?? declared.template,
        ),
      };
      deliverables.push({
        local_id: item.local_id,
        catalog_id: catalogRef.id,
        facts: {
          deliverableExists: !!item.path && existsSync(join(opts.repoRoot, resolvedPath)),
          resolvedEvidenceCount: (item.evidence_refs ?? []).filter((evidence) =>
            existsSync(join(opts.repoRoot, evidence.path.replace(/^\//, ""))),
          ).length,
          kata,
        },
      });
    }
  }
  deliverables.sort((left, right) => left.local_id.localeCompare(right.local_id));
  return { deliverables, errors, warnings };
}

const MAINTENANCE_APPROACH: Record<KataKindKey, Approach> = {
  rulebook: "rulebook-maintenance",
  recipe: "recipe-maintenance",
  sample: "sample-maintenance",
  template: "template-maintenance",
};

export function resolveRecommendedApproach(input: {
  intent: TaskIntent;
  usability: Record<KataKindKey, EffectiveUsability>;
  deliverableExists: boolean;
  resolvedEvidenceCount: number;
  kataTarget?: KataKindKey;
  bootstrapScope?: KataKindKey[];
}): { approach: RecommendedApproach; reasons: string[] } {
  switch (input.intent) {
    case "improve-kata":
      if (!input.kataTarget)
        return { approach: "undecided", reasons: ["improve-kata には kata_target が必要"] };
      if (input.usability[input.kataTarget] === "not-needed")
        return { approach: "undecided", reasons: [`${input.kataTarget} は not-needed`] };
      return {
        approach: MAINTENANCE_APPROACH[input.kataTarget],
        reasons: [`${input.kataTarget} を改善する`],
      };
    case "confirm-deliverable":
      return { approach: "finalize", reasons: ["成果物を人間が確定する"] };
    case "confirm-with-kata-set":
      return input.bootstrapScope?.length
        ? { approach: "bootstrap-finalize", reasons: ["成果物と Kata 一式を人間が確定する"] }
        : { approach: "undecided", reasons: ["confirm-with-kata-set には bootstrap_scope が必要"] };
    case "deduplicate-across-deliverables":
      return { approach: "cross-deliverable-dedup", reasons: ["成果物群の重複を整理する"] };
    case "reflect-implementation":
      return input.resolvedEvidenceCount > 0
        ? { approach: "retrofit", reasons: ["解決済み実装エビデンスを反映する"] }
        : { approach: "undecided", reasons: ["解決済み evidence_refs がない"] };
    case "bootstrap-kata-set": {
      const scope = input.bootstrapScope ?? [];
      if (scope.length === 0)
        return {
          approach: "undecided",
          reasons: ["bootstrap-kata-set には bootstrap_scope が必要"],
        };
      if (scope.some((kind) => input.usability[kind] === "not-needed"))
        return { approach: "undecided", reasons: ["bootstrap_scope に not-needed が含まれる"] };
      if (scope.every((kind) => input.usability[kind] === "usable"))
        return { approach: "undecided", reasons: ["bootstrap_scope はすべて利用可能"] };
      return {
        approach: "bootstrap",
        reasons: [`Kata 一式を初期整備する（成果物実在: ${input.deliverableExists}）`],
      };
    }
    case "author-deliverable": {
      const required = KATA_KINDS.filter((kind) => input.usability[kind] !== "not-needed");
      const unknown = required.filter((kind) => input.usability[kind] === "unknown");
      if (unknown.length)
        return { approach: "undecided", reasons: [`grade がない Kata: ${unknown.join(", ")}`] };
      if (required.every((kind) => input.usability[kind] === "usable"))
        return { approach: "fully-guided", reasons: ["必要な Kata がすべて利用可能"] };
      if (input.usability.recipe === "usable")
        return { approach: "recipe-guided", reasons: ["recipe が利用可能"] };
      return { approach: "freeform", reasons: ["利用可能な recipe がない"] };
    }
  }
}

function usability(fact: KataFact): EffectiveUsability {
  if (fact.declaration === "not-needed") return "not-needed";
  if (!fact.exists) return "absent";
  if (!fact.grade) return "unknown";
  return fact.grade.verdict === "pass" ? "usable" : "unusable";
}

export function deriveApproaches(opts: {
  facts: ReturnType<typeof collectApproachFacts>["deliverables"];
  rules: ApproachRule[];
}): { deliverables: StrategyDeliverableApproach[]; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const byId = new Map(opts.facts.map((item) => [item.local_id, item]));
  const ruleById = new Map<string, ApproachRule>();
  for (const rule of opts.rules) {
    for (const localId of rule.local_ids) {
      if (!byId.has(localId)) errors.push(`approach_rules: scope にない local_id '${localId}'`);
      if (ruleById.has(localId))
        errors.push(`approach_rules: local_id '${localId}' が重複している`);
      ruleById.set(localId, rule);
    }
  }
  const deliverables: StrategyDeliverableApproach[] = [];
  for (const item of opts.facts) {
    const rule = ruleById.get(item.local_id);
    if (!rule) {
      errors.push(`${item.local_id}: approach_rules に intent 宣言がない`);
      continue;
    }
    for (const kind of KATA_KINDS) {
      const fact = item.facts.kata[kind];
      if (fact.broken_reference) errors.push(`${item.local_id}: ${kind} の宣言先が存在しない`);
    }
    const decision = resolveRecommendedApproach({
      intent: rule.intent,
      usability: Object.fromEntries(
        KATA_KINDS.map((kind) => [kind, usability(item.facts.kata[kind])]),
      ) as Record<KataKindKey, EffectiveUsability>,
      deliverableExists: item.facts.deliverableExists,
      resolvedEvidenceCount: item.facts.resolvedEvidenceCount,
      ...(rule.kata_target ? { kataTarget: rule.kata_target } : {}),
      ...(rule.bootstrap_scope ? { bootstrapScope: rule.bootstrap_scope } : {}),
    });
    if (decision.approach === "undecided") {
      errors.push(`${item.local_id}: approach を導出できない (${decision.reasons.join(" / ")})`);
      continue;
    }
    deliverables.push({
      local_id: item.local_id,
      catalog_id: item.catalog_id,
      approach: decision.approach,
      not_needed_kata: KATA_KINDS.filter(
        (kind) => item.facts.kata[kind].declaration === "not-needed",
      ),
    });
  }
  return { deliverables, errors, warnings: [] };
}
