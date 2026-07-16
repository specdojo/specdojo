---
specdojo:
  id: prj-0001:xer-t-launch-prj-stakeholder-register-140
  type: exec-result
  task_id: T-LAUNCH-prj-stakeholder-register-140
  mode: edit
  status: in_progress
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-prj-stakeholder-register-140-plan.md
  started_at: "2026-07-16T11:05:41.399Z"
  agent: indie
  approach: bootstrap-finalize
  targets:
    - prj-0001:prj-stakeholder-register
    - prj-stakeholder-register-rulebook
    - prj-stakeholder-register-recipe
    - prj-stakeholder-register-sample
    - prj-stakeholder-register-template
---

# Finalize Result

## 1. 確認チェックリスト

done_criteria の各項目を確認し、満たしていればチェックを付ける。満たせない項目がある場合は「確定判断」を差し戻しにし、理由を「実施内容」に記録する。

- [ ] 関係者の役割・関心・影響度が業務観点で確認できる形で一覧化されていること（BA / vp-ba-stakeholder-clarity）
- [ ] 合意対象と意思決定者が識別できること（PO / vp-po-decision-readiness）
- [ ] 関与方針・合意事項がコミュニケーション統制の入力として確認できること（PM / vp-pm-control-reporting）

## 2. 参考資料の確認

参考資料を種別ごとに確認し、満たしていればチェックを付ける。「確定対象」に無い種別はスキップし、行を削除する。

- [ ] rulebook: 章構成・必須項目・禁止事項・判定基準が完成版の成果物と整合している
- [ ] recipe: 問い・観点・深掘り手順が完成版の作成過程に照らして有効である
- [ ] sample: 粒度・文体・表の書き方が完成例として適切である
- [ ] template: 章構成の骨組みとプレースホルダが雛形として再利用できる
- [ ] 共通: プロジェクト固有の内容が一般化されており、他プロジェクトでも再利用できる

## 3. 確定対象

最終確認と frontmatter の `status` の `ready` への昇格が済んだ対象にチェックを付ける。既に `ready` の参考資料は、劣化がないことを確認してチェックを付ける。

- [ ] 成果物: `docs/ja/projects/prj-0001/020-project-definition/prj-stakeholder-register.md`
- [ ] rulebook: `docs/ja/specdojo/rulebooks/prj-stakeholder-register-rulebook.md`
- [ ] recipe: `docs/ja/specdojo/recipes/prj-stakeholder-register-recipe.md`
- [ ] sample: `docs/ja/specdojo/samples/prj-stakeholder-register-sample.md`
- [ ] template: `docs/ja/specdojo/templates/prj-stakeholder-register-template.md`

## 4. 実施内容

_TODO_: 実施した内容の要約を記入する。対象ごとの確認結果と、修正した場合はその内容を残す。

## 5. 変更ファイル

_TODO_: 変更したファイルのパスを記入する。

## 6. 申し送り

_TODO_: 後続タスクへの申し送り事項を記入する（なければ削除）。

## 7. 確定判断

- judgement: _TODO_（承認 / 差し戻し）
