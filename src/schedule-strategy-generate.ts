// Deterministic strategy generator: turns the deliverable catalogs (DCT), the track plan
// (Timeline), the agent readiness assessment (sch-assessment-<track>.yaml) and the standard
// strategy profiles into sch-strategy-<track>.yaml. The agent decides the approach per
// deliverable; scope, owner rules, phase sets, gates, cross-deliverable passes, milestones and
// schema conformance are decided here so `schedule build` and `exec refresh` stay unchanged.

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, relative, resolve } from "node:path";
import yaml from "js-yaml";
import Ajv2020Module from "ajv/dist/2020.js";
import type { ValidateFunction } from "ajv";
import { collectResolvedDeliverables } from "./catalog-build.js";
import { resolveBasePath } from "./catalog-paths.js";
import { diffPlanText } from "./catalog-plan.js";
import type { DctDoc, DctKind } from "./catalog-types.js";
import { readYaml } from "./exec-shared.js";
import type { Approach } from "./exec-types.js";
import { buildScheduleTrack } from "./schedule-build.js";
import { collectCatalogFilesByDomain, loadTimelineIndex } from "./timeline-build.js";
import {
  assessmentFileName,
  collectAssessmentFacts,
  validateAssessment,
  validateAssessmentSchema,
  type AssessmentFacts,
  type SchAssessment,
  type StrategyScope,
} from "./schedule-assessment.js";
import {
  AUTHOR_PHASE_SETS,
  PHASE_SET_ORDER,
  profileFor,
  renderPhase,
  STRATEGY_PHASE_SETS,
} from "./schedule-strategy-profiles.js";

export const SCH_STRATEGY_SCHEMA_PATH = "docs/specdojo/schemas/v1/sch-strategy.schema.yaml";

export type StrategyCatalogRef = {
  id: string;
  /** Repository-root absolute path as required by sch-strategy.schema.yaml (leading slash). */
  path: string;
  domain: string;
  title?: string;
};

export type StrategyDeliverable = {
  local_id: string;
  catalog_id: string;
  approach: Approach;
};

export type PreservedStrategyFields = {
  status?: string;
  title?: string;
  settings?: Record<string, unknown>;
  initial_state?: Record<string, unknown>;
  cross_domain_dependencies?: Array<{ dependent: string; requires: string; note?: string }>;
  gateOwner?: string;
  milestoneOwner?: string;
  passOwner?: string;
  ownerByLocalId: Map<string, string>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toRepoAbsolute(absolutePath: string, repoRoot: string): string {
  return `/${relative(repoRoot, absolutePath).replace(/\\/g, "/")}`;
}

// ---- scope resolution ---------------------------------------------------------

// Artifact label shown in the timeline for gates and milestones. Catalog titles follow
// `成果物カタログ（<name>）`; anything else is left unset rather than guessed.
export function artifactNameFromCatalogTitle(title: string | undefined): string | undefined {
  const match = title?.match(/^成果物カタログ（(.+)）$/);
  return match ? match[1] : undefined;
}

export type ScopeResolution = {
  catalogs: StrategyCatalogRef[];
  source: "strategy" | "timeline";
  warnings: string[];
  errors: string[];
};

// Resolves the catalogs a track covers. An existing strategy is authoritative (a human may have
// narrowed the scope on purpose); otherwise the Timeline track plan decides which domains belong
// to the track, and every catalog file of those domains (including physical splits) is included.
export function resolveTrackScopeCatalogs(opts: {
  repoRoot: string;
  catalogPath: string;
  timelinePath: string;
  track: string;
  existingStrategy?: Record<string, unknown> | null;
}): ScopeResolution {
  const { repoRoot, catalogPath, timelinePath, track } = opts;
  const warnings: string[] = [];
  const errors: string[] = [];

  const byDomain = collectCatalogFilesByDomain(catalogPath);
  const refFor = (filePath: string): StrategyCatalogRef | null => {
    const doc = readYaml(filePath) as DctDoc | null;
    if (!doc?.id || !doc.domain) {
      errors.push(`${filePath}: id / domain が読み取れないため scope に含められない。`);
      return null;
    }
    return {
      id: doc.id,
      path: toRepoAbsolute(filePath, repoRoot),
      domain: doc.domain,
      ...(doc.title ? { title: doc.title } : {}),
    };
  };

  const timelineCatalogs: StrategyCatalogRef[] = [];
  const indexFile = join(timelinePath, "tml-index.yaml");
  if (existsSync(indexFile)) {
    const { index, errors: loadErrors } = loadTimelineIndex(indexFile);
    if (loadErrors.length > 0) {
      warnings.push(`${basename(indexFile)}: ${loadErrors.join(" / ")}`);
    }
    const plan = index.tracks.find((entry) => entry.track === track);
    if (plan) {
      for (const domain of plan.domains) {
        const files = byDomain.get(domain) ?? [];
        if (files.length === 0) {
          warnings.push(
            `timeline: track '${track}' の domain '${domain}' に対応する dct-*.yaml が無い（scope から除外）。`,
          );
          continue;
        }
        for (const filePath of files) {
          const ref = refFor(filePath);
          if (ref) timelineCatalogs.push(ref);
        }
      }
      if (plan.catalog_status !== "primary") {
        warnings.push(
          `timeline: track '${track}' の catalog_status は '${plan.catalog_status}'。` +
            `strategy 生成では昇格させないため、確認後に人間が primary へ更新する。`,
        );
      }
    } else {
      warnings.push(`timeline: track '${track}' が tml-index.yaml に無い。`);
    }
  }

  const existingScope = isRecord(opts.existingStrategy?.scope)
    ? opts.existingStrategy.scope
    : undefined;
  const existingCatalogs = Array.isArray(existingScope?.catalogs) ? existingScope.catalogs : [];
  if (existingCatalogs.length > 0) {
    const catalogs: StrategyCatalogRef[] = [];
    for (const entry of existingCatalogs) {
      if (!isRecord(entry) || typeof entry.path !== "string") continue;
      const filePath = resolve(repoRoot, entry.path.replace(/^\//, ""));
      if (!existsSync(filePath)) {
        errors.push(`scope.catalogs: カタログが見つからない: ${entry.path}`);
        continue;
      }
      const ref = refFor(filePath);
      if (ref) catalogs.push(ref);
    }
    const known = new Set(catalogs.map((catalog) => catalog.id));
    for (const catalog of timelineCatalogs) {
      if (known.has(catalog.id)) continue;
      warnings.push(
        `timeline の domain から解決した ${catalog.id} が既存 scope に無い。scope を広げる場合は ` +
          `sch-strategy-${track}.yaml の scope.catalogs を先に更新する。`,
      );
    }
    return { catalogs, source: "strategy", warnings, errors };
  }

  if (timelineCatalogs.length === 0) {
    errors.push(
      `track '${track}' の scope を解決できない。tml-index.yaml の domains と ` +
        `dct-<domain>.yaml を用意するか、既存 strategy の scope.catalogs を先に定義する。`,
    );
  }
  return { catalogs: timelineCatalogs, source: "timeline", warnings, errors };
}

export type CatalogDeliverable = {
  local_id: string;
  catalog_id: string;
  depends_on: string[];
};

// Deliverables of the scoped catalogs, in catalog order. `include_kinds` mirrors the strategy
// scope (work by default).
export function collectScopeDeliverables(opts: {
  repoRoot: string;
  catalogs: StrategyCatalogRef[];
  includeKinds: string[];
}): { deliverables: CatalogDeliverable[]; errors: string[] } {
  const errors: string[] = [];
  const deliverables: CatalogDeliverable[] = [];
  for (const catalog of opts.catalogs) {
    const filePath = resolve(opts.repoRoot, catalog.path.replace(/^\//, ""));
    const doc = readYaml(filePath) as DctDoc | null;
    if (!doc?.groups) {
      errors.push(`${catalog.path}: groups が無い。`);
      continue;
    }
    const collected: Array<{ item: { local_id: string; kind: string; depends_on?: string[] } }> =
      [];
    collectResolvedDeliverables(doc.groups, resolveBasePath("", doc.base_path), collected as never);
    for (const { item } of collected) {
      if (!opts.includeKinds.includes(item.kind)) continue;
      deliverables.push({
        local_id: item.local_id,
        catalog_id: catalog.id,
        depends_on: item.depends_on ?? [],
      });
    }
  }
  return { deliverables, errors };
}

// ---- owner resolution ---------------------------------------------------------

export type OwnerResolution = {
  owners: Map<string, string>;
  errors: string[];
  warnings: string[];
};

// Owner derivation rule, in priority order:
//   1. explicit --owner <local_id>=<ROLE>
//   2. the owner already recorded in the existing strategy's owner_rules
//   3. --default-owner <ROLE>
// `done_criteria.roles` is deliberately not consulted: those are review viewpoints, not the
// role that performs the work. When no rule applies, generation stops instead of guessing.
export function resolveDeliverableOwners(opts: {
  localIds: string[];
  overrides: Map<string, string>;
  previous: Map<string, string>;
  defaultOwner?: string;
  knownRoles?: Set<string>;
}): OwnerResolution {
  const owners = new Map<string, string>();
  const errors: string[] = [];
  const warnings: string[] = [];
  const unresolved: string[] = [];

  for (const localId of opts.localIds) {
    const owner = opts.overrides.get(localId) ?? opts.previous.get(localId) ?? opts.defaultOwner;
    if (!owner) {
      unresolved.push(localId);
      continue;
    }
    if (opts.knownRoles && opts.knownRoles.size > 0 && !opts.knownRoles.has(owner)) {
      errors.push(`owner '${owner}' は pm-roles.yaml に存在しない (${localId})。`);
      continue;
    }
    owners.set(localId, owner);
  }

  for (const localId of opts.overrides.keys()) {
    if (opts.localIds.includes(localId)) continue;
    warnings.push(`--owner ${localId} は scope に含まれない成果物を指している（無視する）。`);
  }

  if (unresolved.length > 0) {
    errors.push(
      `主担当ロールを決定できない成果物がある: ${unresolved.join(", ")}。` +
        `--owner <local_id>=<ROLE> または --default-owner <ROLE> で明示する` +
        `（done_criteria.roles はレビュー観点であり主担当ではない）。`,
    );
  }

  return { owners, errors, warnings };
}

export function loadKnownRoles(repoRoot: string, rolesPath: string | undefined): Set<string> {
  if (!rolesPath) return new Set();
  const filePath = resolve(repoRoot, rolesPath);
  if (!existsSync(filePath)) return new Set();
  const doc = readYaml(filePath);
  if (!isRecord(doc) || !Array.isArray(doc.roles)) return new Set();
  const codes = doc.roles
    .map((role) => (isRecord(role) && typeof role.code === "string" ? role.code : ""))
    .filter(Boolean);
  return new Set(codes);
}

// ---- document construction ----------------------------------------------------

export type BuildStrategyInput = {
  projectId: string;
  track: string;
  catalogs: StrategyCatalogRef[];
  deliverables: StrategyDeliverable[];
  dependsOn: Map<string, string[]>;
  owners: Map<string, string>;
  gateOwner: string;
  milestoneOwner: string;
  passOwnerOverride?: string;
  bootstrapOrdering: boolean;
  includeKinds: string[];
  preserved: PreservedStrategyFields;
};

export type BuildStrategyResult = {
  doc: Record<string, unknown>;
  warnings: string[];
  errors: string[];
};

function phaseSetsOf(approach: Approach): string[] {
  return profileFor(approach).phase_sets;
}

function orderPhaseSets(names: Iterable<string>): string[] {
  const unique = [...new Set(names)];
  return unique.sort(
    (left, right) => PHASE_SET_ORDER.indexOf(left) - PHASE_SET_ORDER.indexOf(right),
  );
}

// Transitive catalog dependency check used to keep generated bootstrap ordering acyclic.
function dependsTransitively(
  from: string,
  target: string,
  dependsOn: Map<string, string[]>,
): boolean {
  const seen = new Set<string>();
  const stack = [...(dependsOn.get(from) ?? [])];
  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === target) return true;
    if (seen.has(current)) continue;
    seen.add(current);
    stack.push(...(dependsOn.get(current) ?? []));
  }
  return false;
}

export function buildStrategyDocument(input: BuildStrategyInput): BuildStrategyResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const trackUpper = input.track.toUpperCase();

  const sorted = [...input.deliverables].sort((left, right) =>
    left.local_id.localeCompare(right.local_id),
  );

  // --- owner_rules: one rule per (owner, approach) pair -------------------------
  const groups = new Map<string, { owner: string; approach: Approach; localIds: string[] }>();
  for (const deliverable of sorted) {
    const owner = input.owners.get(deliverable.local_id);
    if (!owner) {
      errors.push(`${deliverable.local_id}: owner が解決できていない。`);
      continue;
    }
    const key = JSON.stringify([owner, deliverable.approach]);
    const group = groups.get(key) ?? { owner, approach: deliverable.approach, localIds: [] };
    group.localIds.push(deliverable.local_id);
    groups.set(key, group);
  }
  const orderedGroups = [...groups.values()].sort((left, right) =>
    left.owner === right.owner
      ? left.approach.localeCompare(right.approach)
      : left.owner.localeCompare(right.owner),
  );

  // The most common profile becomes default_phase_sets so rules that follow it stay compact.
  const byApproach = new Map<Approach, number>();
  for (const deliverable of sorted) {
    byApproach.set(deliverable.approach, (byApproach.get(deliverable.approach) ?? 0) + 1);
  }
  const defaultApproach = [...byApproach.entries()].sort((left, right) =>
    right[1] === left[1] ? left[0].localeCompare(right[0]) : right[1] - left[1],
  )[0]?.[0];
  const defaultSequence = defaultApproach ? phaseSetsOf(defaultApproach) : [];

  const usedPhaseSets = orderPhaseSets(sorted.flatMap((d) => phaseSetsOf(d.approach)));
  const phaseSets: Record<string, unknown> = {};
  for (const name of usedPhaseSets) {
    const definition = STRATEGY_PHASE_SETS[name];
    if (!definition) {
      errors.push(`未定義の phase_set '${name}' が profile から参照された。`);
      continue;
    }
    phaseSets[name] = definition.map(renderPhase);
  }

  const ownerRules = orderedGroups.map((group) => {
    const sequence = phaseSetsOf(group.approach);
    const sameAsDefault =
      sequence.length === defaultSequence.length &&
      sequence.every((name, index) => name === defaultSequence[index]);
    const finalizeApproach = profileFor(group.approach).finalize_approach;
    return {
      local_ids: [...group.localIds].sort(),
      owner: group.owner,
      ...(sameAsDefault ? {} : { phase_sets: sequence.map((name) => ({ phase_set: name })) }),
      ...(finalizeApproach === "bootstrap-finalize"
        ? { phase_overrides: [{ phase: "finalize", approach: "bootstrap-finalize" }] }
        : {}),
    };
  });

  // --- phase gates -------------------------------------------------------------
  const countUsing = (phaseSetName: string): number =>
    sorted.filter((d) => phaseSetsOf(d.approach).includes(phaseSetName)).length;

  const authorPhaseSets = orderPhaseSets(
    usedPhaseSets.filter((name) => AUTHOR_PHASE_SETS.includes(name)),
  );
  const catalogScope = { catalogs: input.catalogs.map((catalog) => catalog.id) };
  const artifactName =
    input.catalogs.length === 1 ? artifactNameFromCatalogTitle(input.catalogs[0].title) : undefined;
  const withArtifact = artifactName ? { artifact_name: artifactName } : {};

  const dedupLocalIds = sorted
    .filter((d) => d.approach === "cross-deliverable-dedup")
    .map((d) => d.local_id);

  const authorPassDeliverables = sorted.filter((d) =>
    phaseSetsOf(d.approach).some((name) => AUTHOR_PHASE_SETS.includes(name)),
  ).length;

  const firstPassGateId = `G-${trackUpper}-first-pass`;
  const gates: Array<Record<string, unknown>> = [];
  const needsFirstPassGate =
    authorPhaseSets.length > 0 && (authorPassDeliverables >= 2 || dedupLocalIds.length >= 2);
  if (needsFirstPassGate) {
    gates.push({
      id: firstPassGateId,
      name: "初回パス完了",
      ...withArtifact,
      after_phase_sets: authorPhaseSets,
      owner: input.gateOwner,
      scope: catalogScope,
    });
  }
  if (countUsing("refine-pass") >= 2) {
    gates.push({
      id: `G-${trackUpper}-refine-pass`,
      name: "磨き込み完了",
      ...withArtifact,
      after_phase_sets: ["refine-pass"],
      owner: input.gateOwner,
      scope: catalogScope,
    });
  }
  const reviewPhaseSets = orderPhaseSets(
    usedPhaseSets.filter((name) => name === "review-pass" || name === "retrofit-review-pass"),
  );
  if (reviewPhaseSets.length > 0 && sorted.length >= 2) {
    gates.push({
      id: `G-${trackUpper}-review-pass`,
      name: "レビュー完了",
      ...withArtifact,
      after_phase_sets: reviewPhaseSets,
      owner: input.gateOwner,
      scope: catalogScope,
    });
  }
  if (gates.length > 0 && !input.gateOwner) {
    errors.push(
      "phase gate の owner を決定できない。--gate-owner <ROLE> または --default-owner <ROLE> で明示する。",
    );
  }

  // --- cross-deliverable pass --------------------------------------------------
  const crossPasses: Array<Record<string, unknown>> = [];
  if (dedupLocalIds.length === 1) {
    errors.push(
      `cross-deliverable-dedup と判定された成果物が 1 件しかない (${dedupLocalIds[0]})。` +
        `横断タスクは 2 件以上の成果物を対象にする。判定を見直す。`,
    );
  } else if (dedupLocalIds.length >= 2) {
    if (!needsFirstPassGate) {
      errors.push(
        `cross-deliverable-dedup を配置する前段フェーズが無い。` +
          `対象 track に author フェーズ（bootstrap / retrofit / draft）を持つ成果物が必要。`,
      );
    }
    const passOwners = new Set(
      dedupLocalIds.map((localId) => input.owners.get(localId) ?? "").filter(Boolean),
    );
    const passOwner =
      input.passOwnerOverride ?? (passOwners.size === 1 ? [...passOwners][0] : undefined);
    if (!passOwner) {
      errors.push(
        `横断タスクの主担当を決定できない（対象成果物の owner が ${[...passOwners].join(", ")}）。` +
          `--owner ${input.track}-dedup=<ROLE> で明示する。`,
      );
    } else {
      crossPasses.push({
        id: `${input.track}-dedup`,
        name: "成果物間の正本選択・重複整理",
        ...withArtifact,
        task_suffix: "060",
        duration_days: 0.5,
        owner: passOwner,
        after_gate: firstPassGateId,
        before_phase_set: "refine-pass",
        execution: "agent",
        mode: "edit",
        approach: "cross-deliverable-dedup",
        agent_pipeline: {
          stages: [
            { stage_role: "executor", proficiency: "expert" },
            { stage_role: "reporter", proficiency: "normal" },
          ],
        },
        description:
          "対象成果物を横断し、同じ事実・手順・定義が複数文書へ重複していないか確認する。" +
          "各情報の正本を選び、他の文書は必要な要約と参照へ整理する。各成果物の固有責務と " +
          "done_criteria は維持し、用語と受け渡しを統一する。\n",
        scope: { local_ids: [...dedupLocalIds].sort() },
      });
    }
  }

  // --- cross domain dependencies ----------------------------------------------
  const crossDeps: Array<{ dependent: string; requires: string; note?: string }> = [
    ...(input.preserved.cross_domain_dependencies ?? []),
  ];
  const declared = new Set(crossDeps.map((dep) => JSON.stringify([dep.dependent, dep.requires])));
  if (input.bootstrapOrdering) {
    const bootstrapIds = sorted
      .filter((d) => d.approach === "bootstrap")
      .map((d) => d.local_id)
      .sort();
    for (const deliverable of sorted) {
      if (deliverable.approach === "bootstrap") continue;
      if (deliverable.approach === "finalize" || deliverable.approach === "bootstrap-finalize") {
        continue;
      }
      for (const bootstrapId of bootstrapIds) {
        const catalogOf = sorted.find((d) => d.local_id === bootstrapId)?.catalog_id;
        if (catalogOf !== deliverable.catalog_id) continue;
        if ((input.dependsOn.get(deliverable.local_id) ?? []).includes(bootstrapId)) continue;
        if (dependsTransitively(bootstrapId, deliverable.local_id, input.dependsOn)) {
          warnings.push(
            `bootstrap 順序: ${bootstrapId} が ${deliverable.local_id} に依存しているため、` +
              `逆向きの待ち合わせは生成しない。`,
          );
          continue;
        }
        const key = JSON.stringify([deliverable.local_id, bootstrapId]);
        if (declared.has(key)) continue;
        declared.add(key);
        crossDeps.push({
          dependent: deliverable.local_id,
          requires: bootstrapId,
          note: "代表成果物の初期整備（bootstrap）で整った実践の型を前提にする",
        });
      }
    }
  }

  // --- group milestones --------------------------------------------------------
  const groupMilestones = input.catalogs.map((catalog) => {
    const label = artifactNameFromCatalogTitle(catalog.title);
    const sameDomainCount = input.catalogs.filter((item) => item.domain === catalog.domain).length;
    const catalogLocalId = catalog.id.includes(":")
      ? catalog.id.split(":").slice(1).join(":")
      : catalog.id;
    const milestoneSuffix =
      sameDomainCount > 1 ? catalogLocalId.replace(/^dct-/, "") : catalog.domain;
    return {
      catalog_id: catalog.id,
      milestone: {
        id: `M-${trackUpper}-${milestoneSuffix}`,
        name: "ドメイン完了",
        ...(label ? { artifact_name: label } : {}),
        owner: input.milestoneOwner,
      },
    };
  });
  if (groupMilestones.length > 0 && !input.milestoneOwner) {
    errors.push(
      "group milestone の owner を決定できない。--milestone-owner <ROLE> または --default-owner <ROLE> で明示する。",
    );
  }

  const doc: Record<string, unknown> = {
    kind: "strategy",
    id: `${input.projectId}:sch-strategy-${input.track}`,
    type: "project",
    status: input.preserved.status ?? "draft",
    title: input.preserved.title ?? `スケジュール戦略（${input.track}）`,
    rulebook: "specdojo:sch-rulebook",
    track: input.track,
    ...(input.preserved.settings && Object.keys(input.preserved.settings).length > 0
      ? { settings: input.preserved.settings }
      : {}),
    scope: {
      catalogs: input.catalogs.map((catalog) => ({ id: catalog.id, path: catalog.path })),
      include_kinds: input.includeKinds,
    },
    phase_sets: phaseSets,
    ...(defaultSequence.length > 0
      ? { default_phase_sets: defaultSequence.map((name) => ({ phase_set: name })) }
      : {}),
    owner_rules: ownerRules,
    ...(crossPasses.length > 0 ? { cross_deliverable_passes: crossPasses } : {}),
    ...(gates.length > 0 ? { phase_gates: gates } : {}),
    ...(crossDeps.length > 0 ? { cross_domain_dependencies: crossDeps } : {}),
    ...(groupMilestones.length > 0 ? { group_milestones: groupMilestones } : {}),
    ...(input.preserved.initial_state ? { initial_state: input.preserved.initial_state } : {}),
  };

  if (ownerRules.length === 0) {
    errors.push("owner_rules が空になる。判定済みの成果物が 1 件も無い。");
  }

  return { doc, warnings, errors };
}

// ---- assessment -> deliverables ------------------------------------------------

export type AssessmentReadResult = {
  deliverables: StrategyDeliverable[];
  errors: string[];
  warnings: string[];
};

// Reads the approach decisions out of an assessment. Unjudged or undecided entries stop
// generation: the strategy must never encode a guess where the agent recorded a question.
export function readAssessmentApproaches(assessment: SchAssessment): AssessmentReadResult {
  const deliverables: StrategyDeliverable[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const entry of assessment.deliverables) {
    const judgment = entry.judgment;
    if (!judgment) {
      errors.push(`${entry.local_id}: 判定 (judgment) が無い。assessment を先に完了する。`);
      continue;
    }
    if (judgment.recommended_approach === "undecided") {
      errors.push(
        `${entry.local_id}: recommended_approach が undecided。blocking な open_questions を解消する。`,
      );
      continue;
    }
    if (judgment.confidence === "low") {
      warnings.push(`${entry.local_id}: 判定の confidence が low。生成結果を人間が確認する。`);
    }
    deliverables.push({
      local_id: entry.local_id,
      catalog_id: entry.catalog_id,
      approach: judgment.recommended_approach,
    });
  }

  for (const question of assessment.open_questions) {
    if (!question.blocking) continue;
    errors.push(
      `blocking な open_questions が残っている (${question.topic}): ${question.question}`,
    );
  }

  return { deliverables, errors, warnings };
}

// ---- serialization & validation ------------------------------------------------

export function dumpStrategy(doc: Record<string, unknown>): string {
  return yaml.dump(doc, {
    lineWidth: 120,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
  });
}

const Ajv2020 = Ajv2020Module.default;

let compiledSchemaCache: { schemaPath: string; validate: ValidateFunction } | null = null;

function compileStrategySchema(repoRoot: string): ValidateFunction {
  const schemaPath = join(repoRoot, SCH_STRATEGY_SCHEMA_PATH);
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
        `Failed to read strategy schema: ${filePath} (${error instanceof Error ? error.message : String(error)})`,
      );
    }
  };
  // Relative $refs resolve against the empty base URI, so the referenced files are registered
  // under their bare file names first.
  ajv.addSchema(load("sch-common.schema.yaml") as object, "sch-common.schema.yaml");
  ajv.addSchema(load("exec-common.schema.yaml") as object, "exec-common.schema.yaml");
  const validate = ajv.compile(load(basename(SCH_STRATEGY_SCHEMA_PATH)) as object);
  compiledSchemaCache = { schemaPath, validate };
  return validate;
}

export function validateStrategySchema(doc: unknown, repoRoot: string): string[] {
  const validate = compileStrategySchema(repoRoot);
  if (validate(doc)) return [];
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

export type StrategyDryRunResult = {
  taskCount: number;
  milestoneIds: string[];
  errors: string[];
  warnings: string[];
};

// `schedule build --dry-run` equivalent for a candidate strategy that is not on disk yet. The
// candidate is evaluated from a temporary file whose name does not match sch-strategy-*.yaml,
// so no other command can pick it up while it exists.
export function dryRunStrategy(opts: {
  repoRoot: string;
  schedulePath: string;
  track: string;
  projectId: string;
  content: string;
}): StrategyDryRunResult {
  const { repoRoot, schedulePath, track, projectId, content } = opts;
  const errors: string[] = [];
  const warnings: string[] = [];
  const candidateDir = mkdtempSync(join(tmpdir(), "specdojo-strategy-candidate-"));
  const candidatePath = join(candidateDir, `sch-strategy-${track}.yaml`);
  const targetFileName = `sch-strategy-${track}.yaml`;

  writeFileSync(candidatePath, content, "utf8");
  try {
    const result = buildScheduleTrack(candidatePath, repoRoot);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
    if (result.projectId !== projectId) {
      errors.push(
        `生成した strategy の project id '${result.projectId}' が '${projectId}' と一致しない。`,
      );
    }

    const milestoneIds = result.milestones.map((milestone) => milestone.id);
    const owners = new Map<string, string>();
    for (const id of milestoneIds) owners.set(id, targetFileName);

    const otherFiles = (existsSync(schedulePath) ? readdirSync(schedulePath) : [])
      .filter((file) => /^sch-strategy-.+\.yaml$/.test(file))
      .filter((file) => file !== targetFileName)
      .sort();
    for (const file of otherFiles) {
      try {
        const other = buildScheduleTrack(join(schedulePath, file), repoRoot);
        for (const milestone of other.milestones) {
          const previous = owners.get(milestone.id);
          if (previous) {
            errors.push(
              `Milestone ID '${milestone.id}' が ${previous} と ${file} で重複している。`,
            );
            continue;
          }
          owners.set(milestone.id, file);
        }
      } catch (error) {
        warnings.push(`${file}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return { taskCount: result.tasks.length, milestoneIds, errors, warnings };
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    return { taskCount: 0, milestoneIds: [], errors, warnings };
  } finally {
    rmSync(candidateDir, { recursive: true, force: true });
  }
}

// ---- write ---------------------------------------------------------------------

export type WriteStrategyResult = {
  path: string;
  written: boolean;
  skippedReason?: "exists" | "dry-run" | "unchanged";
  diff: string[];
};

export function strategyPathFor(schedulePath: string, track: string): string {
  return join(schedulePath, `sch-strategy-${track}.yaml`);
}

// Writes the strategy to its canonical path with the same overwrite protection the other
// generators use: an existing file is never replaced without --force, and the diff is returned
// so the operator can review the change first.
export function writeStrategyFile(opts: {
  schedulePath: string;
  track: string;
  content: string;
  force: boolean;
  dryRun: boolean;
}): WriteStrategyResult {
  const path = strategyPathFor(opts.schedulePath, opts.track);
  const exists = existsSync(path);
  const current = exists ? readFileSync(path, "utf8") : "";
  const diff = diffPlanText(current, opts.content);

  if (exists && diff.length === 0) {
    return { path, written: false, skippedReason: "unchanged", diff };
  }
  if (exists && !opts.force) {
    return { path, written: false, skippedReason: "exists", diff };
  }
  if (opts.dryRun) {
    return { path, written: false, skippedReason: "dry-run", diff };
  }
  mkdirSync(opts.schedulePath, { recursive: true });
  const temporaryPath = join(opts.schedulePath, `.sch-strategy-${opts.track}.${process.pid}.tmp`);
  try {
    writeFileSync(temporaryPath, opts.content, "utf8");
    renameSync(temporaryPath, path);
  } finally {
    rmSync(temporaryPath, { force: true });
  }
  return { path, written: true, diff };
}

// Fields a regenerated strategy keeps from the existing file. They record human decisions
// (start date, completed deliverables, extra ordering, owner assignments) that cannot be
// derived from the catalogs, the timeline or the assessment.
export function readPreservedFields(strategyPath: string): PreservedStrategyFields {
  const ownerByLocalId = new Map<string, string>();
  if (!existsSync(strategyPath)) return { ownerByLocalId };
  const doc = readYaml(strategyPath);
  if (!isRecord(doc)) return { ownerByLocalId };

  for (const rule of Array.isArray(doc.owner_rules) ? doc.owner_rules : []) {
    if (!isRecord(rule) || typeof rule.owner !== "string") continue;
    for (const localId of Array.isArray(rule.local_ids) ? rule.local_ids : []) {
      if (typeof localId === "string") ownerByLocalId.set(localId, rule.owner);
    }
  }

  const crossDeps: Array<{ dependent: string; requires: string; note?: string }> = [];
  for (const dep of Array.isArray(doc.cross_domain_dependencies)
    ? doc.cross_domain_dependencies
    : []) {
    if (!isRecord(dep)) continue;
    if (typeof dep.dependent !== "string" || typeof dep.requires !== "string") continue;
    crossDeps.push({
      dependent: dep.dependent,
      requires: dep.requires,
      ...(typeof dep.note === "string" ? { note: dep.note } : {}),
    });
  }

  const firstOwner = (field: unknown): string | undefined => {
    if (!Array.isArray(field)) return undefined;
    const entry = field.find((item) => isRecord(item) && typeof item.owner === "string");
    return isRecord(entry) && typeof entry.owner === "string" ? entry.owner : undefined;
  };
  const milestoneEntries = Array.isArray(doc.group_milestones)
    ? doc.group_milestones.map((item) => (isRecord(item) ? item.milestone : undefined))
    : [];
  const gateOwner = firstOwner(doc.phase_gates);
  const milestoneOwner = firstOwner(milestoneEntries);
  const passOwner = firstOwner(doc.cross_deliverable_passes);

  return {
    ...(typeof doc.status === "string" ? { status: doc.status } : {}),
    ...(typeof doc.title === "string" ? { title: doc.title } : {}),
    ...(isRecord(doc.settings) ? { settings: doc.settings } : {}),
    ...(isRecord(doc.initial_state) ? { initial_state: doc.initial_state } : {}),
    ...(crossDeps.length > 0 ? { cross_domain_dependencies: crossDeps } : {}),
    ...(gateOwner ? { gateOwner } : {}),
    ...(milestoneOwner ? { milestoneOwner } : {}),
    ...(passOwner ? { passOwner } : {}),
    ownerByLocalId,
  };
}

export function loadStrategyDocument(strategyPath: string): Record<string, unknown> | null {
  if (!existsSync(strategyPath)) return null;
  const doc = readYaml(strategyPath);
  return isRecord(doc) ? doc : null;
}

export type GenerateStrategyFromAssessmentResult = {
  doc: Record<string, unknown> | null;
  content: string;
  taskCount: number;
  milestoneIds: string[];
  errors: string[];
  warnings: string[];
};

// Complete generation pipeline used by the CLI and tests. Every input is re-read and validated
// before a candidate is returned: an assessment cannot silently keep stale facts, omit a work
// deliverable, change its catalog id, or point at another project/track.
export function generateStrategyFromAssessment(opts: {
  repoRoot: string;
  schedulePath: string;
  catalogPath: string;
  timelinePath: string;
  rolesPath?: string;
  projectId: string;
  track: string;
  assessment: SchAssessment;
  ownerOverrides?: Map<string, string>;
  defaultOwner?: string;
  gateOwner?: string;
  milestoneOwner?: string;
  passOwnerOverride?: string;
  bootstrapOrdering?: boolean;
}): GenerateStrategyFromAssessmentResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const targetPath = strategyPathFor(opts.schedulePath, opts.track);
  const existing = loadStrategyDocument(targetPath);
  const preserved = readPreservedFields(targetPath);

  const scope = resolveTrackScopeCatalogs({
    repoRoot: opts.repoRoot,
    catalogPath: opts.catalogPath,
    timelinePath: opts.timelinePath,
    track: opts.track,
    existingStrategy: existing,
  });
  errors.push(...scope.errors);
  warnings.push(...scope.warnings);

  const expectedStrategyId = `${opts.projectId}:sch-strategy-${opts.track}`;
  const expectedStrategyPath = relative(opts.repoRoot, targetPath).replace(/\\/g, "/");
  if (opts.assessment.project_id !== opts.projectId) {
    errors.push(
      `${assessmentFileName(opts.track)}: project_id '${opts.assessment.project_id}' は '${opts.projectId}' と一致しない。`,
    );
  }
  if (opts.assessment.track !== opts.track) {
    errors.push(
      `${assessmentFileName(opts.track)}: track '${opts.assessment.track}' は '${opts.track}' と一致しない。`,
    );
  }
  if (opts.assessment.strategy.id !== expectedStrategyId) {
    errors.push(
      `${assessmentFileName(opts.track)}: strategy.id は '${expectedStrategyId}' でなければならない。`,
    );
  }
  if (opts.assessment.strategy.path !== expectedStrategyPath) {
    errors.push(
      `${assessmentFileName(opts.track)}: strategy.path は '${expectedStrategyPath}' でなければならない。`,
    );
  }
  if (opts.assessment.include_kinds.length !== 1 || opts.assessment.include_kinds[0] !== "work") {
    errors.push(`${assessmentFileName(opts.track)}: include_kinds は [work] でなければならない。`);
  }

  const schemaErrors = validateAssessmentSchema(opts.assessment, opts.repoRoot);
  errors.push(...schemaErrors.map((error) => `${assessmentFileName(opts.track)}${error}`));

  const strategyScope: StrategyScope = {
    strategyId: expectedStrategyId,
    track: opts.track,
    projectId: opts.projectId,
    catalogs: scope.catalogs.map((catalog) => ({ id: catalog.id, path: catalog.path })),
    includeKinds: ["work"] as DctKind[],
  };
  const current = collectAssessmentFacts({ repoRoot: opts.repoRoot, scope: strategyScope });
  errors.push(...current.errors);
  warnings.push(...current.warnings);
  const currentFacts = new Map<string, AssessmentFacts>(
    current.deliverables.map((deliverable) => [deliverable.local_id, deliverable.facts]),
  );
  if (schemaErrors.length === 0) {
    const validation = validateAssessment(opts.assessment, {
      fileName: assessmentFileName(opts.track),
      currentFacts,
    });
    errors.push(...validation.errors);
    warnings.push(...validation.warnings);
  }

  const catalogDeliverables = collectScopeDeliverables({
    repoRoot: opts.repoRoot,
    catalogs: scope.catalogs,
    includeKinds: ["work"],
  });
  errors.push(...catalogDeliverables.errors);
  const catalogByLocalId = new Map<string, CatalogDeliverable>();
  for (const deliverable of catalogDeliverables.deliverables) {
    const previous = catalogByLocalId.get(deliverable.local_id);
    if (previous) {
      errors.push(
        `local_id '${deliverable.local_id}' が ${previous.catalog_id} と ${deliverable.catalog_id} で重複している。`,
      );
      continue;
    }
    catalogByLocalId.set(deliverable.local_id, deliverable);
  }
  for (const assessed of opts.assessment.deliverables) {
    const currentDeliverable = catalogByLocalId.get(assessed.local_id);
    if (currentDeliverable && currentDeliverable.catalog_id !== assessed.catalog_id) {
      errors.push(
        `${assessed.local_id}: assessment の catalog_id '${assessed.catalog_id}' は現在の ` +
          `'${currentDeliverable.catalog_id}' と一致しない。`,
      );
    }
  }

  const approaches = readAssessmentApproaches(opts.assessment);
  errors.push(...approaches.errors);
  warnings.push(...approaches.warnings);
  const approachIds = new Set(approaches.deliverables.map((deliverable) => deliverable.local_id));
  for (const localId of catalogByLocalId.keys()) {
    if (!approachIds.has(localId)) errors.push(`${localId}: strategy profile の選択結果が無い。`);
  }

  if (opts.rolesPath && !existsSync(resolve(opts.repoRoot, opts.rolesPath))) {
    errors.push(`roles_path が見つからない: ${opts.rolesPath}`);
  }
  const knownRoles = loadKnownRoles(opts.repoRoot, opts.rolesPath);
  const owners = resolveDeliverableOwners({
    localIds: [...catalogByLocalId.keys()],
    overrides: opts.ownerOverrides ?? new Map(),
    previous: preserved.ownerByLocalId,
    ...(opts.defaultOwner ? { defaultOwner: opts.defaultOwner } : {}),
    ...(knownRoles.size > 0 ? { knownRoles } : {}),
  });
  errors.push(...owners.errors);
  warnings.push(...owners.warnings);

  const gateOwner = opts.gateOwner ?? preserved.gateOwner ?? opts.defaultOwner ?? "";
  const milestoneOwner =
    opts.milestoneOwner ?? preserved.milestoneOwner ?? opts.defaultOwner ?? gateOwner;
  const passOwnerOverride = opts.passOwnerOverride ?? preserved.passOwner;
  for (const [label, owner] of [
    ["gate", gateOwner],
    ["milestone", milestoneOwner],
    ["cross-deliverable pass", passOwnerOverride],
  ] as const) {
    if (owner && knownRoles.size > 0 && !knownRoles.has(owner)) {
      errors.push(`${label} owner '${owner}' は pm-roles.yaml に存在しない。`);
    }
  }

  const dependsOn = new Map(
    catalogDeliverables.deliverables.map((deliverable) => [
      deliverable.local_id,
      deliverable.depends_on,
    ]),
  );
  const built = buildStrategyDocument({
    projectId: opts.projectId,
    track: opts.track,
    catalogs: scope.catalogs,
    deliverables: approaches.deliverables,
    dependsOn,
    owners: owners.owners,
    gateOwner,
    milestoneOwner,
    ...(passOwnerOverride ? { passOwnerOverride } : {}),
    bootstrapOrdering: opts.bootstrapOrdering ?? true,
    includeKinds: ["work"],
    preserved,
  });
  errors.push(...built.errors);
  warnings.push(...built.warnings);

  const strategySchemaErrors = validateStrategySchema(built.doc, opts.repoRoot);
  errors.push(...strategySchemaErrors.map((error) => `sch-strategy-${opts.track}.yaml${error}`));
  const content = dumpStrategy(built.doc);
  if (errors.length > 0) {
    return { doc: null, content, taskCount: 0, milestoneIds: [], errors, warnings };
  }

  const dryRun = dryRunStrategy({
    repoRoot: opts.repoRoot,
    schedulePath: opts.schedulePath,
    track: opts.track,
    projectId: opts.projectId,
    content,
  });
  errors.push(...dryRun.errors);
  warnings.push(...dryRun.warnings);
  return {
    doc: errors.length === 0 ? built.doc : null,
    content,
    taskCount: dryRun.taskCount,
    milestoneIds: dryRun.milestoneIds,
    errors,
    warnings,
  };
}
