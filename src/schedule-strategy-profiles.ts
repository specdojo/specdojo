// Standard strategy profiles: the single place that maps a deterministically derived approach
// to the phase sequence a deliverable runs through. Profiles are
// code constants rather than free-form YAML so every generated sch-strategy-<track>.yaml uses
// the same phase ids, task suffixes, durations, modes and execution kinds.

import type { Approach, Proficiency } from "./exec-types.js";

export type PhaseExecution = "agent" | "human";
export type PhaseMode = "edit" | "review";

export type StrategyPhaseDefinition = {
  id: string;
  name: string;
  task_suffix: string;
  duration_days: number;
  execution: PhaseExecution;
  mode: PhaseMode;
  approach: Approach;
  /** Omitted for human phases; agent phases always run the executor/reporter pipeline. */
  pipeline?: { executor: Proficiency; reporter: Proficiency };
  description: string;
};

export type StrategyProfile = {
  /** Recommended approach this profile is selected by. */
  approach: Approach;
  /** Ordered phase set names applied to the deliverable. */
  phase_sets: string[];
  /** Approach used for the human confirmation phase. */
  finalize_approach: Extract<Approach, "finalize" | "bootstrap-finalize">;
};

const EXPERT_PIPELINE = { executor: "expert", reporter: "normal" } as const;
const NORMAL_PIPELINE = { executor: "normal", reporter: "normal" } as const;

function maintenancePhase(
  kind: "rulebook" | "recipe" | "sample" | "template",
): StrategyPhaseDefinition {
  return {
    id: `${kind}-maintenance`,
    name: `${kind} の見直し`,
    task_suffix: "040",
    duration_days: 0.5,
    execution: "agent",
    mode: "edit",
    approach: `${kind}-maintenance` as Approach,
    pipeline: EXPERT_PIPELINE,
    description:
      `完成済みの成果物の実績から ${kind} を見直す。実際に書かれた内容と ${kind} の記述が食い違う箇所を洗い出し、` +
      `再現可能な規則として ${kind} 側へ反映する。成果物本体はこのフェーズで書き換えない。`,
  };
}

// Named phase sets. Keys are the phase_set names written into the generated strategy.
export const STRATEGY_PHASE_SETS: Record<string, StrategyPhaseDefinition[]> = {
  "bootstrap-pass": [
    {
      id: "bootstrap",
      name: "代表成果物・実践の型の初期整備",
      task_suffix: "005",
      duration_days: 0.5,
      execution: "agent",
      mode: "edit",
      approach: "bootstrap",
      pipeline: EXPERT_PIPELINE,
      description:
        "実践の型の作成条件から要否を判断し、代表成果物と必要な rulebook / recipe / sample / template を" +
        "同じタスクで初期整備する。不要な3種は rulebook frontmatter へ not-needed と宣言し、必要な一式の構造・" +
        "用語・粒度を整合させる。判断できない前提は推測せず result に残す。",
    },
  ],
  "retrofit-pass": [
    {
      id: "retrofit",
      name: "実装調査・草案反映",
      task_suffix: "010",
      duration_days: 0.5,
      execution: "agent",
      mode: "edit",
      approach: "retrofit",
      pipeline: EXPERT_PIPELINE,
      description:
        "成果物カタログの evidence_refs から現在動作を調査し、既存成果物・決定記録・プロジェクト文脈が示す" +
        "意図された仕様、および done_criteria と照合する。一致する内容は成果物へ反映し、乖離は実装へ" +
        "無条件に合わせず result に記録する。",
    },
  ],
  "guided-pass": [
    {
      id: "draft",
      name: "草案作成（実践の型に沿う）",
      task_suffix: "020",
      duration_days: 0.5,
      execution: "agent",
      mode: "edit",
      approach: "fully-guided",
      pipeline: NORMAL_PIPELINE,
      description:
        "必要と宣言され、整備済みの rulebook / recipe / sample / template に沿って草案を作成する。" +
        "利用可能な実践の型を正本とし、根拠を確認できない内容は書かずに result へ確認事項として残す。",
    },
  ],
  "recipe-guided-pass": [
    {
      id: "draft",
      name: "草案作成（recipe 主導）",
      task_suffix: "020",
      duration_days: 0.5,
      execution: "agent",
      mode: "edit",
      approach: "recipe-guided",
      pipeline: NORMAL_PIPELINE,
      description:
        "利用可能な recipe を主基準にして草案を作成する。sample / template が無い、または利用できない前提で、" +
        "recipe の手順と成果物カタログの done_criteria を突き合わせながら構成を決める。",
    },
  ],
  "freeform-pass": [
    {
      id: "draft",
      name: "草案作成（基準なし）",
      task_suffix: "020",
      duration_days: 0.5,
      execution: "agent",
      mode: "edit",
      approach: "freeform",
      pipeline: EXPERT_PIPELINE,
      description:
        "基準にできる実践の型が無い状態で草案を作成する。成果物カタログの done_criteria、対応 schema、" +
        "既存の類似成果物を根拠にし、参考にした文書と決めきれなかった論点を result に明示する。",
    },
  ],
  "rulebook-maintenance-pass": [maintenancePhase("rulebook")],
  "recipe-maintenance-pass": [maintenancePhase("recipe")],
  "sample-maintenance-pass": [maintenancePhase("sample")],
  "template-maintenance-pass": [maintenancePhase("template")],
  "refine-pass": [
    {
      id: "refine",
      name: "磨き込み・整合性確認",
      task_suffix: "070",
      duration_days: 0.25,
      execution: "agent",
      mode: "edit",
      approach: "fully-guided",
      pipeline: NORMAL_PIPELINE,
      description:
        "整備済みの実践の型と先行・隣接成果物を参照し、既存の草案を保守的に磨き込む。責務境界と depends_on に" +
        "沿った情報の受け渡しを確認し、不足や不整合だけを最小限修正して done_criteria を満たす状態へ整える。",
    },
  ],
  "review-pass": [
    {
      id: "review",
      name: "完成版レビュー",
      task_suffix: "090",
      duration_days: 0.25,
      execution: "agent",
      mode: "review",
      approach: "fully-guided",
      pipeline: NORMAL_PIPELINE,
      description:
        "完成版を変更せず、実践の型と done_criteria、先行成果物との整合を照合する。判定結果と修正対象候補を" +
        "根拠付きで review result に記録する。",
    },
  ],
  "retrofit-review-pass": [
    {
      id: "review",
      name: "完成版レビュー（実装照合）",
      task_suffix: "090",
      duration_days: 0.25,
      execution: "agent",
      mode: "review",
      approach: "retrofit",
      pipeline: NORMAL_PIPELINE,
      description:
        "完成版を変更せず、evidence_refs が示す現在動作、意図された仕様、done_criteria を照合する。" +
        "実装との一致・乖離・未確認範囲を判定し、根拠と修正対象候補を review result に記録する。",
    },
  ],
  "finalize-pass": [
    {
      id: "finalize",
      name: "完成版確定",
      task_suffix: "140",
      duration_days: 0.125,
      execution: "human",
      mode: "edit",
      approach: "finalize",
      description:
        "担当ロールがレビュー結果と done_criteria を最終確認し、成果物を完成版として確定する。" +
        "bootstrap 対象では、同じタスクで整備した rulebook / recipe / sample / template もあわせて確認する。",
    },
  ],
};

// Presentation order of phase_sets in the generated strategy. Keeps regenerated files stable
// regardless of which approach happens to appear first in the assessment.
export const PHASE_SET_ORDER: string[] = [
  "bootstrap-pass",
  "retrofit-pass",
  "guided-pass",
  "recipe-guided-pass",
  "freeform-pass",
  "rulebook-maintenance-pass",
  "recipe-maintenance-pass",
  "sample-maintenance-pass",
  "template-maintenance-pass",
  "refine-pass",
  "review-pass",
  "retrofit-review-pass",
  "finalize-pass",
];

// Phase sets that author or revise the deliverable itself. A phase gate is placed after these,
// and a cross-deliverable pass is inserted between them and refine-pass.
export const AUTHOR_PHASE_SETS: string[] = [
  "bootstrap-pass",
  "retrofit-pass",
  "guided-pass",
  "recipe-guided-pass",
  "freeform-pass",
  "rulebook-maintenance-pass",
  "recipe-maintenance-pass",
  "sample-maintenance-pass",
  "template-maintenance-pass",
];

// approach -> profile. Every author profile ends with refine-pass, a review pass and the human
// finalize pass, so a cross-deliverable pass can always be placed before refine-pass.
export const STRATEGY_PROFILES: Record<Approach, StrategyProfile> = {
  bootstrap: {
    approach: "bootstrap",
    phase_sets: ["bootstrap-pass", "refine-pass", "retrofit-review-pass", "finalize-pass"],
    finalize_approach: "bootstrap-finalize",
  },
  retrofit: {
    approach: "retrofit",
    phase_sets: ["retrofit-pass", "refine-pass", "retrofit-review-pass", "finalize-pass"],
    finalize_approach: "finalize",
  },
  "fully-guided": {
    approach: "fully-guided",
    phase_sets: ["guided-pass", "refine-pass", "review-pass", "finalize-pass"],
    finalize_approach: "finalize",
  },
  "recipe-guided": {
    approach: "recipe-guided",
    phase_sets: ["recipe-guided-pass", "refine-pass", "review-pass", "finalize-pass"],
    finalize_approach: "finalize",
  },
  freeform: {
    approach: "freeform",
    phase_sets: ["freeform-pass", "refine-pass", "review-pass", "finalize-pass"],
    finalize_approach: "finalize",
  },
  "rulebook-maintenance": {
    approach: "rulebook-maintenance",
    phase_sets: ["rulebook-maintenance-pass", "review-pass", "finalize-pass"],
    finalize_approach: "finalize",
  },
  "recipe-maintenance": {
    approach: "recipe-maintenance",
    phase_sets: ["recipe-maintenance-pass", "review-pass", "finalize-pass"],
    finalize_approach: "finalize",
  },
  "sample-maintenance": {
    approach: "sample-maintenance",
    phase_sets: ["sample-maintenance-pass", "review-pass", "finalize-pass"],
    finalize_approach: "finalize",
  },
  "template-maintenance": {
    approach: "template-maintenance",
    phase_sets: ["template-maintenance-pass", "review-pass", "finalize-pass"],
    finalize_approach: "finalize",
  },
  // The deliverable itself is edited by the shared cross-deliverable pass, so its own sequence
  // starts at refine-pass; the pass is generated separately and blocks that first task.
  "cross-deliverable-dedup": {
    approach: "cross-deliverable-dedup",
    phase_sets: ["refine-pass", "review-pass", "finalize-pass"],
    finalize_approach: "finalize",
  },
  finalize: {
    approach: "finalize",
    phase_sets: ["finalize-pass"],
    finalize_approach: "finalize",
  },
  "bootstrap-finalize": {
    approach: "bootstrap-finalize",
    phase_sets: ["finalize-pass"],
    finalize_approach: "bootstrap-finalize",
  },
};

export function profileFor(approach: Approach): StrategyProfile {
  return STRATEGY_PROFILES[approach];
}

// Serializable phase entry for sch-strategy.schema.yaml.
export function renderPhase(phase: StrategyPhaseDefinition): Record<string, unknown> {
  return {
    id: phase.id,
    name: phase.name,
    execution: phase.execution,
    mode: phase.mode,
    approach: phase.approach,
    ...(phase.pipeline
      ? {
          agent_pipeline: {
            stages: [
              { stage_role: "executor", proficiency: phase.pipeline.executor },
              { stage_role: "reporter", proficiency: phase.pipeline.reporter },
            ],
          },
        }
      : {}),
    task_suffix: phase.task_suffix,
    duration_days: phase.duration_days,
    description: `${phase.description}\n`,
  };
}
