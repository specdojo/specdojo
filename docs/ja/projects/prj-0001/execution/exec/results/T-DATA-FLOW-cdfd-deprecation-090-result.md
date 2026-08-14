---
specdojo:
  id: prj-0001:xrr-t-data-flow-cdfd-deprecation-090
  type: exec-result
  task_id: T-DATA-FLOW-cdfd-deprecation-090
  mode: review
  status: in_progress
  project_id: prj-0001
  plan_ref: exec/plans/T-DATA-FLOW-cdfd-deprecation-090-plan.md
  started_at: "2026-08-14T03:12:23.978Z"
  agent: opencode-review-executor
  execution: agent
  approach: fully-guided
  targets:
    - prj-0001:cdfd-deprecation
---

# Review Result

## 1. レビュー観点別結果

各 RVP セクションの `result` / `evidence` / `notes` を記入する。`evidence` の参照は `[[id]]` 形式（Obsidian wikilink）で記載し、行番号アンカーや絶対パスは使わない。位置の補足が必要な場合は `evidence` 本文で述べる。

### RVP-001（BA: vp-ba-requirements-completeness）

**確認基準**: 非推奨化の判断から、id移行経路（ファイル名のみ変更・新IDへの切替）の使い分け、trashディレクトリへの物理移動までの流れが表と図で確認できること

- result: _TODO_（pass / fail / unclear）
- evidence: _TODO_
- notes: _TODO_

### RVP-002（ARC: vp-arc-technical-constraints）

**確認基準**: local_idとSchedule task IDを変更せず、成果物カタログのpathフィールドだけを更新して `docs/ja/product/trash/` または `docs/ja/projects/<project-id>/trash/` へ配置する対応関係が識別できること

- result: _TODO_（pass / fail / unclear）
- evidence: _TODO_
- notes: _TODO_

### RVP-003（QE: vp-qe-omissions-consistency）

**確認基準**: 移動先が既に存在する場合、対象文書またはcatalogエントリが見つからない場合の停止条件が確認できること

- result: _TODO_（pass / fail / unclear）
- evidence: _TODO_
- notes: _TODO_

### RVP-004（PO: vp-po-decision-readiness）

**確認基準**: 非推奨化の承認境界と、恒久的な削除・復元の方針が本領域の対象外として未定義のままであることを承認できること

- result: _TODO_（pass / fail / unclear）
- evidence: _TODO_
- notes: _TODO_

## 2. findings

_TODO_: 問題点・指摘事項を記入する（なければ削除）。

## 3. 実践の型との整合確認

_TODO_: `approach` に従ってどう確認したか（`fully-guided` で rulebook の必須要素・禁止事項、recipe の作り方、sample の粒度・文体、template の章構成との整合、`recipe-guided` で recipe のみを基準にした確認、`freeform` で実践の型より優先した実例やプロジェクト文脈との整合、`retrofit` で実際に参照した実装パス・成果物との対応判定・乖離ごとの修正対象候補・未確認範囲、`rulebook-maintenance` などの maintenance 系で見直した実践の型とその根拠、など）を記入する。複数文書間に矛盾があり rulebook を正として判定した箇所、確認の基準から外れていた文書とその代わりに根拠にした内容があれば、あわせて記録する。

## 4. decision

- recommendation: _TODO_（approve / revise / reject）
