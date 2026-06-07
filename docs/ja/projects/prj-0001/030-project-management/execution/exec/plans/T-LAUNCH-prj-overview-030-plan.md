---
id: xrp-t-launch-prj-overview-030
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

| ID | ロール | viewpoint_id | 確認基準 |
|---|---|---|---|
| RVP-001 | BA | vp-ba-business-value | プロジェクトの目的・背景・ゴールが業務観点で確認できる粒度で記述されていること |
| RVP-002 | PO | vp-po-purpose-alignment | プロジェクトの目的・スコープを承認できる情報が含まれていること |
| RVP-003 | ARC | vp-arc-technical-constraints | 技術的前提・制約を読み取れる情報が含まれていること |
| RVP-004 | QE | vp-qe-verifiability | 成功判定の輪郭が確認できること |
| RVP-005 | PM | vp-pm-plan-feasibility | プロジェクトの目的・スコープを計画立案の基礎として確認できること |

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

## 4. 完了手順

1. レビュー観点ごとに pass / fail / unclear を判定し、根拠を記入する。
2. result の各レビュー観点セクションに記入する。

## 5. 異常終了の条件

- done_criteria を満たさない・対象ファイル不明・依存未解決の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; criterion=<id>; ref=<path>`）。
- 異常終了時は complete ではなく block を記録する。
