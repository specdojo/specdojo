---
id: prj-0001:xrp-t-launch-prj-overview-030
type: exec-plan
rulebook: xep-rulebook
task_id: T-LAUNCH-prj-overview-030
name: 一次版レビュー
mode: review
status: ready
project_id: prj-0001
owner: BA
on_critical_path: true
viewpoints_ref: /docs/ja/projects/prj-0001/030-project-management/010-management-plan/pm-review-viewpoints.yaml
---

# Review Plan: T-LAUNCH-prj-overview-030

## 1. このフェーズで行うこと

担当ロールが補強後の内容を確認し、承認・修正指示・差し戻しを判断する。
修正が軽微な場合は直接編集して承認とみなす。
差し戻しの場合は修正箇所と理由を明記する。

## 2. 対象成果物

- path: `/docs/ja/projects/prj-0001/020-project-definition/prj-overview.md`
- rulebook: `prj-overview-rulebook`
- result: `exec/results/T-LAUNCH-prj-overview-030-result.md`

## 3. レビュー観点

<!-- markdownlint-disable MD055 MD056 -->
| ID | ロール | viewpoint_id | 確認基準 |
|---|---|---|---|
| RVP-001 | BA | vp-ba-business-value | プロジェクトの目的・背景・ゴールが業務観点で確認できる粒度で記述されていること |
| RVP-002 | PO | vp-po-purpose-alignment | プロジェクトの目的・スコープを承認できる情報が含まれていること |
| RVP-003 | ARC | vp-arc-technical-constraints | 技術的前提・制約を読み取れる情報が含まれていること |
| RVP-004 | QE | vp-qe-verifiability | 成功判定の輪郭が確認できること |
| RVP-005 | PM | vp-pm-plan-feasibility | プロジェクトの目的・スコープを計画立案の基礎として確認できること |
<!-- markdownlint-enable MD055 MD056 -->

### RVP-001（BA: vp-ba-business-value）

**確認基準**: プロジェクトの目的・背景・ゴールが業務観点で確認できる粒度で記述されていること

**coverage_required:**

- stakeholder
- business_goal
- use_case
- business_event
- traceability

**チェック観点:** 成果物の記述が業務目的、利用者、業務課題、期待効果と対応しているか。

**エビデンス例:** 背景、目的、利用者、業務フロー、価値、成功基準。

### RVP-002（PO: vp-po-purpose-alignment）

**確認基準**: プロジェクトの目的・スコープを承認できる情報が含まれていること

**coverage_required:**

- business_goal
- scope_boundary
- traceability

**チェック観点:** 成果物の内容がプロジェクト目的、スコープ、優先順位、公開方針と矛盾していないか。

**エビデンス例:** 目的、対象範囲、対象外、判断理由、関連成果物への参照。

### RVP-003（ARC: vp-arc-technical-constraints）

**確認基準**: 技術的前提・制約を読み取れる情報が含まれていること

**coverage_required:**

- scope_boundary
- data
- integration
- non_functional

**チェック観点:** 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。

**エビデンス例:** 技術制約、外部依存、schema、validate 手順、構成方針。

### RVP-004（QE: vp-qe-verifiability）

**確認基準**: 成功判定の輪郭が確認できること

**coverage_required:**

- exception_case
- state_transition
- non_functional
- acceptance

**チェック観点:** 成功基準、受入条件、品質基準、設定値が pass / fail を判定できる表現になっているか。

**エビデンス例:** 判定条件、数値、状態、必須項目、チェック手順。

### RVP-005（PM: vp-pm-plan-feasibility）

**確認基準**: プロジェクトの目的・スコープを計画立案の基礎として確認できること

**チェック観点:** 成果物の内容がタスク化、順序付け、所要時間見積もり、進捗確認に使える粒度になっているか。

**エビデンス例:** 依存関係、作業単位、完了条件、担当 Role code、期限または判断タイミング。

## 4. 進め方

- exec plan frontmatter の `approach_mode` ・ `task_kind` を確認する。
- `task_kind` が `reference-maintenance` 以外（`deliverable` または未指定）の場合は、対象成果物に紐づく rulebook / recipe / sample の有無を確認し、`approach_mode` に応じて確認の基準を決める。
  - `fully-guided`: rulebook の必須要素・禁止事項、recipe の問いとレビュー観点、sample の粒度・文体との整合を確認する。
  - `recipe-guided`: recipe の問いとレビュー観点に照らして確認する（rulebook / sample の構造・文体は基準にしない）。
  - `freeform`: 参考資料より、類似成果物の実例やプロジェクト文脈との整合を確認する。
  - 未指定の場合は、存在するすべての参考資料をそれぞれの役割に沿って確認の基準にする。
- `task_kind` が `reference-maintenance` の場合は、確認の向きを「成果物 → rulebook / recipe / sample」に切り替え、対象の参考資料が見直しに値するかを確認する。
- 複数の文書間で記述に矛盾がある場合、確認の基準に rulebook を含む `approach_mode`（`fully-guided` など）では rulebook を正とする。
- 存在しない、または確認の基準から外れた文書がある場合は、他に存在する文書、類似成果物、対象領域の慣行と整合しているかを確認し、判断の根拠を review result に残す。

詳細は [[specdojo-reference-materials-guide]] を参照する。

## 5. 完了手順

1. レビュー観点ごとに pass / fail / unclear を判定し、根拠を記入する。
2. result の各レビュー観点セクションに記入する。

## 6. 異常終了の条件

- done_criteria を満たさない・対象ファイル不明・依存未解決の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; criterion=<id>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
