import type { Approach } from "../exec/types.js";
import type { ApproachRule } from "./approach.js";
import {
  AUTHOR_PHASE_SETS,
  PHASE_SET_ORDER,
  profileFor,
  renderPhase,
  STRATEGY_PHASE_SETS,
} from "./strategy-profiles.js";
import {
  artifactNameFromCatalogTitle,
  type StrategyCatalogRef,
} from "./strategy-generate-scope.js";

export type StrategyDeliverable = {
  local_id: string;
  catalog_id: string;
  approach: Approach;
  not_needed_kata?: Array<"rulebook" | "recipe" | "sample" | "template">;
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
  approachRules: ApproachRule[];
};

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

  const maintenanceKind = (
    approach: Approach,
  ): "rulebook" | "recipe" | "sample" | "template" | undefined => {
    const match = approach.match(/^(rulebook|recipe|sample|template)-maintenance$/);
    return match?.[1] as "rulebook" | "recipe" | "sample" | "template" | undefined;
  };
  const eligibleDeliverables = input.deliverables.filter((deliverable) => {
    const kind = maintenanceKind(deliverable.approach);
    if (!kind || !deliverable.not_needed_kata?.includes(kind)) return true;
    errors.push(
      `${deliverable.local_id}: ${kind} は not-needed と宣言されているため ${kind}-maintenance を生成しない。`,
    );
    return false;
  });

  const sorted = [...eligibleDeliverables].sort((left, right) =>
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
      catalogs: input.catalogs.map((catalog) => ({
        id: catalog.id,
        path: catalog.path,
        ...(catalog.local_ids ? { local_ids: catalog.local_ids } : {}),
      })),
      include_kinds: input.includeKinds,
    },
    approach_rules: input.preserved.approachRules,
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
