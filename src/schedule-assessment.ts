// Readiness assessment (sch-assessment-<track>.yaml): the agent judgment artifact that sits
// between the deliverable catalogs and the deterministic strategy generator. Facts about the
// deliverable document and its Kata (rulebook / recipe / sample / template) are collected here by
// code, so the agent never searches files, derives ids, or decides existence. The agent only adds
// the semantic judgment ("is this content usable as a basis for the target deliverable") and the
// task intent; the recommended approach is then derived from those by a fixed rule.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import yaml from "js-yaml";
import Ajv2020Module from "ajv/dist/2020.js";
import type { ValidateFunction } from "ajv";
import { collectResolvedDeliverables, type ResolvedDeliverable } from "./catalog-build.js";
// 差分表示は dct-plan と同じ LCS 実装を共用し、上書き前のレビュー体験を揃える。
import { diffPlanText } from "./catalog-plan.js";
import { resolveBasePath } from "./catalog-paths.js";
import type { DctDoc, DctKind, DctValidationResult } from "./catalog-types.js";
import { readYaml } from "./exec-shared.js";
import { readSpecdojoNamespace } from "./frontmatter-namespace.js";
import {
  KATA_MISSING,
  loadRulebookRefs,
  resolveDeliverableSchemaRef,
  resolveKataRefs,
  type KataRefs,
} from "./kata.js";
import type { Approach } from "./exec-types.js";

export const SCH_ASSESSMENT_SCHEMA_VERSION = 1;
export const SCH_ASSESSMENT_SCHEMA_PATH = "docs/specdojo/schemas/v1/sch-assessment.schema.yaml";

export type KataKindKey = keyof KataRefs;

export const KATA_KINDS: readonly KataKindKey[] = ["rulebook", "recipe", "sample", "template"];

export const KATA_CHECKS = [
  "target-fit",
  "substantive-content",
  "internal-consistency",
  "standard-alignment",
] as const;

export type KataCheckId = (typeof KATA_CHECKS)[number];
export type KataCheckResult = "pass" | "fail" | "unknown";
export type AssessmentConfidence = "high" | "medium" | "low";
export type KataDeclaration =
  | "declared"
  | "conventional"
  | "none"
  | "undecided"
  | "not-needed"
  | "unresolved";
export type KataUsability = "usable" | "unusable" | "unknown";
/** Usability as seen by the recommendation rule; 'absent' is machine-derived, never judged. */
export type EffectiveUsability = KataUsability | "absent" | "not-needed";

export type TaskIntent =
  | "author-deliverable"
  | "bootstrap-kata-set"
  | "reflect-implementation"
  | "deduplicate-across-deliverables"
  | "improve-kata"
  | "confirm-deliverable"
  | "confirm-with-kata-set";

export type RecommendedApproach = Approach | "undecided";

// Why an approach is chosen. Only 'readiness' is decided by how well the Kata set is prepared;
// the others are purpose-specific phases and must be selected from the task intent.
export type ApproachPurpose =
  | "readiness"
  | "kata-bootstrap"
  | "implementation"
  | "cross-deliverable"
  | "kata-maintenance"
  | "human-confirmation";

export type KataFact = {
  declaration: KataDeclaration;
  id?: string;
  path?: string;
  exists: boolean;
  status?: string;
  broken_reference: boolean;
};

export type EvidenceFact = {
  path: string;
  purpose?: string;
  exists: boolean;
};

export type AssessmentFacts = {
  deliverable: { path?: string; exists: boolean; status?: string };
  kata: Record<KataKindKey, KataFact>;
  schema?: { path: string; exists: boolean };
  evidence_refs: EvidenceFact[];
};

export type KataCheck = {
  check: KataCheckId;
  result: KataCheckResult;
  note: string;
};

export type KataJudgment = {
  usability: KataUsability;
  checks: KataCheck[];
  rationale: string;
  confidence: AssessmentConfidence;
};

export type AssessmentJudgment = {
  intent: TaskIntent;
  intent_rationale: string;
  kata_target?: KataKindKey;
  bootstrap_scope?: KataKindKey[];
  kata: Partial<Record<KataKindKey, KataJudgment>>;
  recommended_approach: RecommendedApproach;
  rationale: string;
  evidence: string[];
  confidence: AssessmentConfidence;
};

export type AssessedDeliverable = {
  local_id: string;
  name: string;
  catalog_id: string;
  facts: AssessmentFacts;
  judgment?: AssessmentJudgment;
};

export type AssessmentOpenQuestion = {
  topic: string;
  question: string;
  blocking: boolean;
  reason: string;
  next_action?: string;
};

export type SchAssessment = {
  kind: "assessment";
  id: string;
  type: "project";
  status: "draft" | "ready" | "deprecated";
  title: string;
  rulebook: string;
  schema_version: number;
  project_id: string;
  track: string;
  strategy: { id: string; path: string };
  include_kinds: DctKind[];
  deliverables: AssessedDeliverable[];
  open_questions: AssessmentOpenQuestion[];
  confidence: AssessmentConfidence;
  notes?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// ---- canonical location ------------------------------------------------------

export function assessmentFileName(track: string): string {
  return `sch-assessment-${track}.yaml`;
}

// Assessments live in a dedicated directory so every scan that reads sch-*.yaml directly under
// the schedule directory (strategy / track / milestones) never treats them as schedule input.
export function resolveAssessmentsDir(schedulePath: string): string {
  return join(schedulePath, "assessments");
}

export function resolveAssessmentPath(schedulePath: string, track: string): string {
  return join(resolveAssessmentsDir(schedulePath), assessmentFileName(track));
}

export function trackFromAssessmentFileName(fileName: string): string | null {
  const match = basename(fileName).match(/^sch-assessment-(.+)\.yaml$/);
  return match ? match[1] : null;
}

// ---- schema validation -------------------------------------------------------

const Ajv2020 = Ajv2020Module.default;

let compiledSchemaCache: { schemaPath: string; validate: ValidateFunction } | null = null;

function compileAssessmentSchema(repoRoot: string): ValidateFunction {
  const schemaPath = join(repoRoot, SCH_ASSESSMENT_SCHEMA_PATH);
  if (compiledSchemaCache && compiledSchemaCache.schemaPath === schemaPath) {
    return compiledSchemaCache.validate;
  }
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const load = (fileName: string): unknown => {
    const filePath = join(repoRoot, "docs/specdojo/schemas/v1", fileName);
    try {
      return yaml.load(readFileSync(filePath, "utf8"));
    } catch (error) {
      throw new Error(
        `Failed to read assessment schema: ${filePath} (${error instanceof Error ? error.message : String(error)})`,
      );
    }
  };
  // sch-common は相対 $ref（./sch-common.schema.yaml）で参照される。ajv は $id 無しの
  // schema を基準 URI "" で解決するため、ファイル名をキーに先に登録する。
  ajv.addSchema(load("sch-common.schema.yaml") as object, "sch-common.schema.yaml");
  const validate = ajv.compile(load(basename(SCH_ASSESSMENT_SCHEMA_PATH)) as object);
  compiledSchemaCache = { schemaPath, validate };
  return validate;
}

// Validates a parsed assessment against sch-assessment.schema.yaml. Errors carry the failing
// instance path so an agent can fix the exact field instead of rewriting the file.
export function validateAssessmentSchema(assessment: unknown, repoRoot: string): string[] {
  const validate = compileAssessmentSchema(repoRoot);
  if (validate(assessment)) return [];
  return (validate.errors ?? []).map((error) => {
    const at = error.instancePath || "/";
    const params = isRecord(error.params) ? error.params : {};
    const detail =
      typeof params.additionalProperty === "string"
        ? ` (${params.additionalProperty})`
        : typeof params.missingProperty === "string"
          ? ` (${params.missingProperty})`
          : Array.isArray(params.allowedValues)
            ? ` (allowed: ${params.allowedValues.join(", ")})`
            : "";
    return `${at}: ${error.message ?? "schema violation"}${detail}`;
  });
}

// ---- fact collection ---------------------------------------------------------

type StrategyScopeCatalog = { id: string; path: string };

type StrategyHead = {
  id?: string;
  track?: string;
  scope?: { catalogs?: StrategyScopeCatalog[]; include_kinds?: string[] };
};

export type StrategyScope = {
  strategyId: string;
  track: string;
  projectId: string;
  catalogs: StrategyScopeCatalog[];
  includeKinds: DctKind[];
};

export function loadStrategyScope(strategyPath: string): StrategyScope {
  const doc = readYaml(strategyPath) as StrategyHead | null;
  if (!doc?.scope?.catalogs || doc.scope.catalogs.length === 0) {
    throw new Error(`${strategyPath}: missing scope.catalogs`);
  }
  const strategyId = String(doc.id ?? "");
  const projectId = strategyId.split(":")[0] ?? "";
  if (!projectId) {
    throw new Error(`${strategyPath}: id must be '<project-id>:sch-strategy-<track>'`);
  }
  const includeKinds = (doc.scope.include_kinds ?? ["work"]).filter(
    (kind): kind is DctKind => kind === "work" || kind === "control" || kind === "generated",
  );
  if (includeKinds.length === 0) {
    throw new Error(`${strategyPath}: scope.include_kinds has no valid deliverable kind`);
  }
  return {
    strategyId,
    track: String(doc.track ?? ""),
    projectId,
    catalogs: doc.scope.catalogs,
    includeKinds,
  };
}

// Frontmatter / top-level status of a document. Markdown keeps it under the `specdojo:`
// namespace; YAML and JSON deliverables keep it at the top level.
function readDocStatus(repoRoot: string, relPath: string): string | undefined {
  const filePath = join(repoRoot, relPath);
  if (!existsSync(filePath)) return undefined;
  let content: string;
  try {
    content = readFileSync(filePath, "utf8");
  } catch {
    return undefined;
  }
  if (relPath.endsWith(".md")) {
    const status = readSpecdojoNamespace(content).status;
    return typeof status === "string" && status !== "" ? status : undefined;
  }
  let parsed: unknown;
  try {
    parsed = relPath.endsWith(".json") ? JSON.parse(content) : yaml.load(content);
  } catch {
    return undefined;
  }
  if (!isRecord(parsed)) return undefined;
  const nested = isRecord(parsed.specdojo) ? parsed.specdojo.status : undefined;
  const status = typeof parsed.status === "string" ? parsed.status : nested;
  return typeof status === "string" && status !== "" ? status : undefined;
}

// Resolves one Kata reference into facts. The resolution rules themselves stay in kata.ts;
// this only classifies how the reference was resolved so the assessment can distinguish
// "not declared" from "declared but missing" (broken reference).
function collectKataFact(
  repoRoot: string,
  kind: KataKindKey,
  rulebookId: string | undefined,
  refs: KataRefs,
  declaredId: string | undefined,
): KataFact {
  const refPath = refs[kind];
  const resolvedPath = refPath === KATA_MISSING ? undefined : refPath;
  const declaredValue = kind === "rulebook" ? rulebookId : declaredId;

  let declaration: KataDeclaration;
  if (declaredValue === "not-needed") {
    declaration = "not-needed";
  } else if (declaredValue === "undecided") {
    declaration = "undecided";
  } else if (declaredValue === "none") {
    declaration = "none";
  } else if (declaredValue) {
    declaration = "declared";
  } else if (resolvedPath) {
    declaration = "conventional";
  } else {
    declaration = "unresolved";
  }

  const exists = resolvedPath ? existsSync(join(repoRoot, resolvedPath)) : false;
  const status = resolvedPath && exists ? readDocStatus(repoRoot, resolvedPath) : undefined;

  return {
    declaration,
    ...(declaration === "declared" && declaredValue ? { id: declaredValue } : {}),
    ...(resolvedPath ? { path: resolvedPath } : {}),
    exists,
    ...(status ? { status } : {}),
    broken_reference: declaration === "declared" && !exists,
  };
}

export type CollectFactsResult = {
  deliverables: AssessedDeliverable[];
  warnings: string[];
  errors: string[];
};

// Collects every fact an agent would otherwise have to discover: the deliverable document,
// the four Kata references, the validation schema, and the declared implementation evidence.
export function collectAssessmentFacts(opts: {
  repoRoot: string;
  scope: StrategyScope;
}): CollectFactsResult {
  const { repoRoot, scope } = opts;
  const deliverables: AssessedDeliverable[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const ref of scope.catalogs) {
    const catalogPath = resolve(repoRoot, ref.path.replace(/^\//, ""));
    if (!existsSync(catalogPath)) {
      errors.push(`Catalog not found: ${ref.path}`);
      continue;
    }
    const doc = readYaml(catalogPath) as DctDoc | null;
    if (!doc?.groups) {
      errors.push(`${ref.path}: missing groups field`);
      continue;
    }

    const collected: ResolvedDeliverable[] = [];
    collectResolvedDeliverables(doc.groups, resolveBasePath("", doc.base_path), collected);

    for (const { item, resolvedPath } of collected) {
      if (!scope.includeKinds.includes(item.kind)) continue;
      if (seen.has(item.local_id)) {
        warnings.push(`Duplicate local_id in scope (kept first): ${item.local_id}`);
        continue;
      }
      seen.add(item.local_id);

      const docPath = item.path ? resolvedPath : undefined;
      const refs = resolveKataRefs(item.rulebook, {
        recipe: item.recipe,
        sample: item.sample,
        template: item.template,
      });
      const declared =
        item.rulebook &&
        item.rulebook !== "none" &&
        item.rulebook !== "undecided" &&
        item.rulebook !== "not-needed"
          ? loadRulebookRefs(item.rulebook)
          : {};
      const hasCatalogKataSet = (["recipe", "sample", "template"] as const).some(
        (kind) => item[kind] !== undefined,
      );
      const kata = {
        rulebook: collectKataFact(repoRoot, "rulebook", item.rulebook, refs, undefined),
        recipe: collectKataFact(
          repoRoot,
          "recipe",
          item.rulebook,
          refs,
          hasCatalogKataSet ? item.recipe : declared.recipe,
        ),
        sample: collectKataFact(
          repoRoot,
          "sample",
          item.rulebook,
          refs,
          hasCatalogKataSet
            ? item.sample
            : Array.isArray(declared.sample)
              ? declared.sample[0]
              : declared.sample,
        ),
        template: collectKataFact(
          repoRoot,
          "template",
          item.rulebook,
          refs,
          hasCatalogKataSet ? item.template : declared.template,
        ),
      };

      const schemaRef = resolveDeliverableSchemaRef(item.rulebook, item.local_id);
      const docExists = docPath ? existsSync(join(repoRoot, docPath)) : false;
      const docStatus = docPath && docExists ? readDocStatus(repoRoot, docPath) : undefined;
      const facts: AssessmentFacts = {
        deliverable: {
          ...(docPath ? { path: docPath } : {}),
          exists: docExists,
          ...(docStatus ? { status: docStatus } : {}),
        },
        kata,
        ...(schemaRef !== KATA_MISSING
          ? { schema: { path: schemaRef, exists: existsSync(join(repoRoot, schemaRef)) } }
          : {}),
        evidence_refs: (item.evidence_refs ?? []).map((evidence) => ({
          path: evidence.path,
          ...(evidence.purpose ? { purpose: evidence.purpose } : {}),
          exists: existsSync(join(repoRoot, evidence.path.replace(/^\//, ""))),
        })),
      };

      deliverables.push({
        local_id: item.local_id,
        name: item.name,
        catalog_id: ref.id,
        facts,
      });
    }
  }

  deliverables.sort((left, right) =>
    left.catalog_id === right.catalog_id
      ? left.local_id.localeCompare(right.local_id)
      : left.catalog_id.localeCompare(right.catalog_id),
  );

  return { deliverables, warnings, errors };
}

// ---- recommendation rule -----------------------------------------------------

const MAINTENANCE_APPROACH: Record<KataKindKey, Approach> = {
  rulebook: "rulebook-maintenance",
  recipe: "recipe-maintenance",
  sample: "sample-maintenance",
  template: "template-maintenance",
};

const APPROACH_PURPOSE: Record<Approach, ApproachPurpose> = {
  "fully-guided": "readiness",
  "recipe-guided": "readiness",
  freeform: "readiness",
  bootstrap: "kata-bootstrap",
  retrofit: "implementation",
  "cross-deliverable-dedup": "cross-deliverable",
  "rulebook-maintenance": "kata-maintenance",
  "recipe-maintenance": "kata-maintenance",
  "sample-maintenance": "kata-maintenance",
  "template-maintenance": "kata-maintenance",
  finalize: "human-confirmation",
  "bootstrap-finalize": "human-confirmation",
};

// Approaches whose selection is a phase purpose decision, not a readiness measurement.
export function approachPurpose(approach: Approach): ApproachPurpose {
  return APPROACH_PURPOSE[approach];
}

// Approaches executed by a human (they promote status to ready).
export function isHumanConfirmationApproach(approach: RecommendedApproach): boolean {
  return approach !== "undecided" && APPROACH_PURPOSE[approach] === "human-confirmation";
}

export function effectiveUsability(
  facts: AssessmentFacts,
  judgment: AssessmentJudgment | undefined,
  kind: KataKindKey,
): EffectiveUsability {
  if (facts.kata[kind].declaration === "not-needed") return "not-needed";
  if (!facts.kata[kind].exists) return "absent";
  return judgment?.kata[kind]?.usability ?? "unknown";
}

export type ApproachDecision = {
  approach: RecommendedApproach;
  reasons: string[];
};

// Derives the recommended approach from the task intent and the per-Kata usability judgments.
// Readiness alone never selects a purpose-specific approach: bootstrap, retrofit,
// cross-deliverable-dedup, *-maintenance, finalize and bootstrap-finalize are only reachable
// through an explicit intent, so "one Kata is missing" cannot silently become bootstrap.
export function resolveRecommendedApproach(input: {
  intent: TaskIntent;
  usability: Record<KataKindKey, EffectiveUsability>;
  deliverableExists: boolean;
  resolvedEvidenceCount: number;
  kataTarget?: KataKindKey;
  bootstrapScope?: KataKindKey[];
}): ApproachDecision {
  const { intent, usability } = input;

  switch (intent) {
    case "improve-kata": {
      if (!input.kataTarget) {
        return {
          approach: "undecided",
          reasons: ["intent improve-kata には kata_target（対象の実践の型）が必要"],
        };
      }
      if (usability[input.kataTarget] === "not-needed") {
        return {
          approach: "undecided",
          reasons: [`${input.kataTarget} は not-needed と宣言されており、見直し対象ではない`],
        };
      }
      return {
        approach: MAINTENANCE_APPROACH[input.kataTarget],
        reasons: [`${input.kataTarget} を成果物の実績から見直す目的別フェーズ`],
      };
    }
    case "confirm-deliverable":
      return { approach: "finalize", reasons: ["human が成果物のみを確定する目的別フェーズ"] };
    case "confirm-with-kata-set": {
      if (!input.bootstrapScope || input.bootstrapScope.length === 0) {
        return {
          approach: "undecided",
          reasons: ["intent confirm-with-kata-set には bootstrap_scope が必要"],
        };
      }
      return {
        approach: "bootstrap-finalize",
        reasons: ["human が成果物と実践の型一式をまとめて確定する目的別フェーズ"],
      };
    }
    case "deduplicate-across-deliverables":
      return {
        approach: "cross-deliverable-dedup",
        reasons: ["成果物群を横断して重複を整理する目的別フェーズ"],
      };
    case "reflect-implementation": {
      if (input.resolvedEvidenceCount === 0) {
        return {
          approach: "undecided",
          reasons: ["実装エビデンス（evidence_refs）が 1 件も解決できないため retrofit にできない"],
        };
      }
      return {
        approach: "retrofit",
        reasons: [
          `解決済みの実装エビデンス ${input.resolvedEvidenceCount} 件を現在動作の根拠にする`,
        ],
      };
    }
    case "bootstrap-kata-set": {
      const scope = input.bootstrapScope ?? [];
      if (scope.length === 0) {
        return {
          approach: "undecided",
          reasons: [
            "intent bootstrap-kata-set には、一式で初期整備する実践の型を示す bootstrap_scope が必要",
          ],
        };
      }
      const alreadyUsable = scope.filter((kind) => usability[kind] === "usable");
      const notNeeded = scope.filter((kind) => usability[kind] === "not-needed");
      if (notNeeded.length > 0) {
        return {
          approach: "undecided",
          reasons: [
            `bootstrap_scope に not-needed の実践の型が含まれている: ${notNeeded.join(", ")}`,
          ],
        };
      }
      if (alreadyUsable.length === scope.length) {
        return {
          approach: "undecided",
          reasons: [
            `bootstrap_scope の実践の型（${scope.join(", ")}）はすべて利用可能で、初期整備の対象ではない`,
          ],
        };
      }
      return {
        approach: "bootstrap",
        reasons: [
          `成果物と実践の型（${scope.join(", ")}）を一式で初期整備する` +
            `（成果物の実在: ${input.deliverableExists ? "あり" : "なし"}）`,
        ],
      };
    }
    case "author-deliverable": {
      const requiredKinds = KATA_KINDS.filter((kind) => usability[kind] !== "not-needed");
      const unknownKinds = requiredKinds.filter((kind) => usability[kind] === "unknown");
      if (unknownKinds.length > 0) {
        return {
          approach: "undecided",
          reasons: [`利用可否を判定できない実践の型がある: ${unknownKinds.join(", ")}`],
        };
      }
      const usable = requiredKinds.filter((kind) => usability[kind] === "usable");
      if (usable.length === requiredKinds.length) {
        return {
          approach: "fully-guided",
          reasons: ["必要と宣言された実践の型がすべて利用可能"],
        };
      }
      if (usability.recipe === "usable") {
        return {
          approach: "recipe-guided",
          reasons: [`recipe を主基準として利用できる（利用可能: ${usable.join(", ") || "なし"}）`],
        };
      }
      return {
        approach: "freeform",
        reasons: [
          `基準にできる実践の型がない（利用可能: ${usable.join(", ") || "なし"}）。` +
            `一式で初期整備する場合は intent bootstrap-kata-set を明示する`,
        ],
      };
    }
  }
}

// ---- semantic validation -----------------------------------------------------

export type AssessmentValidationOptions = {
  /** Freshly collected facts, keyed by local_id, used to detect agent-edited facts. */
  currentFacts?: Map<string, AssessmentFacts>;
  /** File name the assessment was loaded from, used to check the track suffix. */
  fileName?: string;
};

function usabilityFromChecks(checks: KataCheck[]): KataUsability {
  if (checks.some((check) => check.result === "fail")) return "unusable";
  if (checks.some((check) => check.result === "unknown")) return "unknown";
  return "usable";
}

function usabilityMap(deliverable: AssessedDeliverable): Record<KataKindKey, EffectiveUsability> {
  const map = {} as Record<KataKindKey, EffectiveUsability>;
  for (const kind of KATA_KINDS) {
    map[kind] = effectiveUsability(deliverable.facts, deliverable.judgment, kind);
  }
  return map;
}

function validateKataJudgments(
  where: string,
  deliverable: AssessedDeliverable,
  errors: string[],
  warnings: string[],
): void {
  const judgment = deliverable.judgment;
  if (!judgment) return;

  for (const kind of KATA_KINDS) {
    const fact = deliverable.facts.kata[kind];
    const kataJudgment = judgment.kata[kind];
    if (!fact.exists) {
      if (kataJudgment) {
        errors.push(
          `${where}: kata.${kind} はファイルが存在しないため利用可否を判定しない（判定は削除する）。`,
        );
      }
      continue;
    }
    if (!kataJudgment) {
      errors.push(`${where}: kata.${kind} (${fact.path}) が存在するため利用可否の判定が必要。`);
      continue;
    }
    const checkIds = kataJudgment.checks.map((check) => check.check);
    const missing = KATA_CHECKS.filter((check) => !checkIds.includes(check));
    if (missing.length > 0) {
      errors.push(`${where}: kata.${kind}: 必須の観点が不足している (${missing.join(", ")})。`);
    }
    if (new Set(checkIds).size !== checkIds.length) {
      errors.push(`${where}: kata.${kind}: 同じ観点を重複して書かない。`);
    }
    const derived = usabilityFromChecks(kataJudgment.checks);
    if (missing.length === 0 && derived !== kataJudgment.usability) {
      errors.push(
        `${where}: kata.${kind}: usability '${kataJudgment.usability}' は checks から導かれる '${derived}' と一致しない。`,
      );
    }
    if (fact.status === "draft" && kataJudgment.usability === "unusable") {
      warnings.push(
        `${where}: kata.${kind}: status draft であること自体は利用不能の根拠にならない。checks の根拠を確認する。`,
      );
    }
  }
}

// Rules the JSON schema cannot express: file/track agreement, fact immutability, per-Kata
// judgment coverage, the intent-to-approach derivation, and the "stop when undecided" rule.
export function validateAssessment(
  assessment: SchAssessment,
  options: AssessmentValidationOptions = {},
): DctValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const prefix = assessment.track ? assessmentFileName(assessment.track) : "sch-assessment";

  if (options.fileName) {
    const fileTrack = trackFromAssessmentFileName(options.fileName);
    if (fileTrack && fileTrack !== assessment.track) {
      errors.push(
        `${options.fileName}: track '${assessment.track}' does not match the file name track '${fileTrack}'.`,
      );
    }
  }

  if (assessment.id !== `${assessment.project_id}:sch-assessment-${assessment.track}`) {
    errors.push(
      `${prefix}: id must be '${assessment.project_id}:sch-assessment-${assessment.track}' (found '${assessment.id}').`,
    );
  }

  if (assessment.schema_version !== SCH_ASSESSMENT_SCHEMA_VERSION) {
    warnings.push(
      `${prefix}: schema_version ${assessment.schema_version} differs from the current version ${SCH_ASSESSMENT_SCHEMA_VERSION}.`,
    );
  }

  const blockingTopics = new Set(
    assessment.open_questions.filter((question) => question.blocking).map((q) => q.topic),
  );

  const seen = new Set<string>();
  let unjudged = 0;

  assessment.deliverables.forEach((deliverable, index) => {
    const where = `${prefix}: deliverables[${index}] (${deliverable.local_id})`;

    if (seen.has(deliverable.local_id)) {
      errors.push(`${where}: duplicate local_id.`);
    }
    seen.add(deliverable.local_id);

    const current = options.currentFacts?.get(deliverable.local_id);
    if (options.currentFacts && !current) {
      errors.push(`${where}: この local_id は strategy の scope に存在しない。`);
    } else if (current && !factsEqual(current, deliverable.facts)) {
      errors.push(
        `${where}: facts が実際の解決結果と一致しない。facts はコードが収集する事実であり編集しない` +
          `（scaffold を再実行して差分を確認する）。`,
      );
    }

    validateKataJudgments(where, deliverable, errors, warnings);

    const judgment = deliverable.judgment;
    if (!judgment) {
      unjudged += 1;
      return;
    }

    if (judgment.intent === "improve-kata") {
      if (!judgment.kata_target) {
        errors.push(`${where}: intent improve-kata には kata_target が必要。`);
      } else if (!deliverable.facts.kata[judgment.kata_target].exists) {
        errors.push(
          `${where}: kata_target '${judgment.kata_target}' のファイルが存在しないため maintenance の対象にできない。`,
        );
      }
    } else if (judgment.kata_target) {
      errors.push(`${where}: kata_target は intent improve-kata でのみ指定する。`);
    }

    const needsScope =
      judgment.intent === "bootstrap-kata-set" || judgment.intent === "confirm-with-kata-set";
    if (needsScope && (judgment.bootstrap_scope ?? []).length === 0) {
      errors.push(`${where}: intent ${judgment.intent} には bootstrap_scope が必要。`);
    }
    if (!needsScope && judgment.bootstrap_scope) {
      errors.push(
        `${where}: bootstrap_scope は intent bootstrap-kata-set / confirm-with-kata-set でのみ指定する。`,
      );
    }

    const decision = resolveRecommendedApproach({
      intent: judgment.intent,
      usability: usabilityMap(deliverable),
      deliverableExists: deliverable.facts.deliverable.exists,
      resolvedEvidenceCount: deliverable.facts.evidence_refs.filter((ref) => ref.exists).length,
      ...(judgment.kata_target ? { kataTarget: judgment.kata_target } : {}),
      ...(judgment.bootstrap_scope ? { bootstrapScope: judgment.bootstrap_scope } : {}),
    });

    if (decision.approach !== judgment.recommended_approach) {
      errors.push(
        `${where}: recommended_approach '${judgment.recommended_approach}' は判定規則の結果 ` +
          `'${decision.approach}' と一致しない (${decision.reasons.join(" / ")})。`,
      );
    }

    if (decision.approach === "undecided" && !blockingTopics.has(deliverable.local_id)) {
      errors.push(
        `${where}: undecided のまま確定できないため、topic '${deliverable.local_id}' の ` +
          `blocking な open_questions が必要。`,
      );
    }

    if (isHumanConfirmationApproach(decision.approach)) {
      warnings.push(
        `${where}: ${decision.approach} は human が実行する確定フェーズであり、status を ready へ昇格させるのは human。`,
      );
    }

    if (judgment.confidence === "low") {
      warnings.push(`${where}: confidence が low。生成前に human の確認が必要。`);
    }
  });

  if (options.currentFacts) {
    for (const localId of options.currentFacts.keys()) {
      if (seen.has(localId)) continue;
      errors.push(
        `${prefix}: strategy の scope に含まれる '${localId}' が deliverables に無い（scaffold を再実行して取り込む）。`,
      );
    }
  }

  for (const question of assessment.open_questions) {
    if (question.blocking) {
      warnings.push(
        `${prefix}: blocking open question (${question.topic}): ${question.question}. ` +
          `strategy 生成はこの項目が解消されるまで停止する。`,
      );
    }
  }

  if (assessment.deliverables.length === 0) {
    warnings.push(`${prefix}: 判定対象の成果物が 0 件。`);
  } else if (unjudged === assessment.deliverables.length) {
    warnings.push(`${prefix}: まだ 1 件も判定されていない（骨組みの状態）。`);
  } else if (unjudged > 0) {
    warnings.push(`${prefix}: 未判定の成果物が ${unjudged} 件ある。`);
  }

  if (assessment.confidence === "low") {
    warnings.push(`${prefix}: 全体の confidence が low。生成前にレビューする。`);
  }

  return { ok: errors.length === 0, errors, warnings };
}

// Facts are compared as serialized YAML so key order and optional-field presence differences
// surface as a single reviewable mismatch instead of a per-field diff walk.
export function factsEqual(left: AssessmentFacts, right: AssessmentFacts): boolean {
  const dump = (facts: AssessmentFacts): string =>
    yaml.dump(facts, { sortKeys: true, noRefs: true, lineWidth: -1 });
  return dump(left) === dump(right);
}

// ---- skeleton ----------------------------------------------------------------

export function buildAssessmentSkeleton(opts: {
  scope: StrategyScope;
  strategyRelPath: string;
  deliverables: AssessedDeliverable[];
}): SchAssessment {
  const { scope, strategyRelPath, deliverables } = opts;
  return {
    kind: "assessment",
    id: `${scope.projectId}:sch-assessment-${scope.track}`,
    type: "project",
    status: "draft",
    title: `実践の型整備状況の判定（${scope.track}）`,
    rulebook: "none",
    schema_version: SCH_ASSESSMENT_SCHEMA_VERSION,
    project_id: scope.projectId,
    track: scope.track,
    strategy: { id: scope.strategyId, path: strategyRelPath },
    include_kinds: scope.includeKinds,
    deliverables,
    open_questions: [
      {
        topic: scope.track,
        question: `track '${scope.track}' の成果物と実践の型の利用可能性を判定する`,
        blocking: true,
        reason: "agent 判定が未実施のため、推奨する進め方が未確定",
        next_action: `specdojo schedule assessment prompt --track ${scope.track} の指示で agent 判定を行う`,
      },
    ],
    confidence: "low",
  };
}

// ---- serialization -----------------------------------------------------------

const ASSESSMENT_KEY_ORDER = [
  "kind",
  "id",
  "type",
  "status",
  "title",
  "rulebook",
  "schema_version",
  "project_id",
  "track",
  "strategy",
  "include_kinds",
  "deliverables",
  "open_questions",
  "confidence",
  "notes",
] as const;

// Re-emits an assessment with a fixed key order so re-running the agent produces reviewable
// diffs instead of noise from arbitrary key ordering.
export function normalizeAssessment(assessment: SchAssessment): SchAssessment {
  const source = assessment as unknown as Record<string, unknown>;
  const normalized: Record<string, unknown> = {};
  for (const key of ASSESSMENT_KEY_ORDER) {
    if (source[key] !== undefined) normalized[key] = source[key];
  }
  for (const key of Object.keys(source)) {
    if (!Object.hasOwn(normalized, key)) normalized[key] = source[key];
  }
  return normalized as unknown as SchAssessment;
}

export function dumpAssessment(assessment: SchAssessment): string {
  return yaml.dump(normalizeAssessment(assessment), {
    lineWidth: 120,
    noRefs: true,
    quotingType: "'",
    forceQuotes: false,
  });
}

export function parseAssessment(content: string, filePath: string): SchAssessment {
  let parsed: unknown;
  try {
    parsed = yaml.load(content);
  } catch (error) {
    throw new Error(
      `${filePath}: failed to parse YAML (${error instanceof Error ? error.message : String(error)})`,
    );
  }
  if (!isRecord(parsed)) {
    throw new Error(`${filePath}: assessment must be a YAML mapping.`);
  }
  return parsed as unknown as SchAssessment;
}

export function loadAssessment(filePath: string): SchAssessment {
  return parseAssessment(readFileSync(filePath, "utf8"), filePath);
}

// ---- write -------------------------------------------------------------------

export type WriteAssessmentResult = {
  path: string;
  written: boolean;
  /** Set when an existing assessment blocked the write or --dry-run suppressed it. */
  skippedReason?: "exists" | "dry-run" | "unchanged";
  diff: string[];
};

// Writes an assessment to its canonical path. An existing assessment is protected: the write is
// skipped and the diff is returned for review unless force is set.
export function writeAssessment(opts: {
  schedulePath: string;
  assessment: SchAssessment;
  force: boolean;
  dryRun: boolean;
}): WriteAssessmentResult {
  const { schedulePath, assessment, force, dryRun } = opts;
  const path = resolveAssessmentPath(schedulePath, assessment.track);
  const next = dumpAssessment(assessment);

  if (existsSync(path)) {
    const current = readFileSync(path, "utf8");
    const diff = diffPlanText(current, next);
    if (diff.length === 0) {
      return { path, written: false, skippedReason: "unchanged", diff };
    }
    if (!force) {
      return { path, written: false, skippedReason: "exists", diff };
    }
    if (dryRun) {
      return { path, written: false, skippedReason: "dry-run", diff };
    }
    writeFileSync(path, next, "utf8");
    return { path, written: true, diff };
  }

  const diff = diffPlanText("", next);
  if (dryRun) {
    return { path, written: false, skippedReason: "dry-run", diff };
  }
  mkdirSync(resolveAssessmentsDir(schedulePath), { recursive: true });
  writeFileSync(path, next, "utf8");
  return { path, written: true, diff };
}
