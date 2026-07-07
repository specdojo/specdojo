---
specdojo:
  id: prj-0001:xer-t-launch-prj-scope-140
  type: exec-result
  task_id: T-LAUNCH-prj-scope-140
  mode: edit
  status: in_progress
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-prj-scope-140-plan.md
  started_at: "2026-07-07T12:39:13.184Z"
  agent: indie
  approach: bootstrap-finalize
  targets:
    - prj-0001:prj-scope
    - prj-scope-rulebook
    - prj-scope-recipe
    - prj-scope-sample
    - prj-scope-template
---

# Finalize Result

## 1. 確認チェックリスト

done_criteria の各項目を確認し、満たしていればチェックを付ける。満たせない項目がある場合は「確定判断」を差し戻しにし、理由を「実施内容」に記録する。

- [ ] 業務スコープ・除外範囲・利用者影響が業務観点で確認できること（BA / vp-ba-requirements-completeness）
- [ ] 対象範囲・対象外を承認できること（PO / vp-po-purpose-alignment）
- [ ] 技術的スコープ境界（外部連携の有無など）が識別できること（ARC / vp-arc-technical-constraints）
- [ ] スコープ境界をスケジュール計画の前提として確認できること（PM / vp-pm-plan-feasibility）

## 2. 参考資料の確認

参考資料を種別ごとに確認し、満たしていればチェックを付ける。「確定対象」に無い種別はスキップし、行を削除する。

- [ ] rulebook: 章構成・必須項目・禁止事項・判定基準が完成版の成果物と整合している
- [ ] recipe: 問い・観点・深掘り手順が完成版の作成過程に照らして有効である
- [ ] sample: 粒度・文体・表の書き方が完成例として適切である
- [ ] template: 章構成の骨組みとプレースホルダが雛形として再利用できる
- [ ] 共通: プロジェクト固有の内容が一般化されており、他プロジェクトでも再利用できる

## 3. 確定対象

最終確認と frontmatter の `status` の `ready` への昇格が済んだ対象にチェックを付ける。既に `ready` の参考資料は、劣化がないことを確認してチェックを付ける。

- [ ] 成果物: `docs/ja/projects/prj-0001/020-project-definition/prj-scope.md`
- [ ] rulebook: `docs/ja/specdojo/rulebooks/prj-scope-rulebook.md`
- [ ] recipe: `docs/ja/specdojo/recipes/prj-scope-recipe.md`
- [ ] sample: `docs/ja/specdojo/samples/prj-scope-sample.md`
- [ ] template: `docs/ja/specdojo/templates/prj-scope-template.md`

## 4. 実施内容

_TODO_: 実施した内容の要約を記入する。対象ごとの確認結果と、修正した場合はその内容を残す。

## 5. 変更ファイル

_TODO_: 変更したファイルのパスを記入する。

## 6. 申し送り

_TODO_: 後続タスクへの申し送り事項を記入する（なければ削除）。

## 7. 確定判断

- judgement: _TODO_（承認 / 差し戻し）
