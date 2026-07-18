---
specdojo:
  id: prj-0001:xer-t-launch-pm-communication-plan-140
  type: exec-result
  task_id: T-LAUNCH-pm-communication-plan-140
  mode: edit
  status: in_progress
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-pm-communication-plan-140-plan.md
  started_at: "2026-07-18T04:30:27Z"
  agent: indie
  approach: bootstrap-finalize
  targets:
    - prj-0001:pm-communication-plan
    - pm-communication-plan-rulebook
    - pm-communication-plan-recipe
    - pm-communication-plan-sample
    - pm-communication-plan-template
---

# Finalize Result

## 1. 確認チェックリスト

done_criteria の各項目を確認し、満たしていればチェックを付ける。満たせない項目がある場合は「確定判断」を差し戻しにし、理由を「備考」に記録する。

- [ ] 報告・連絡・会議体の計画を承認できる粒度で記述されていること（PO / vp-po-decision-readiness）
- [ ] 進捗・課題・リスクの報告経路が定義されていること（PM / vp-pm-control-reporting）
- [ ] 関係者ごとの情報要求・関与方針が業務観点で確認できること（BA / vp-ba-stakeholder-clarity）

## 2. 参考資料の確認

参考資料を種別ごとに確認し、満たしていればチェックを付ける。「確定対象」に無い種別はスキップし、行を削除する。

- [ ] rulebook: 章構成・必須項目・禁止事項・判定基準が完成版の成果物と整合している
- [ ] recipe: 問い・観点・深掘り手順が完成版の作成過程に照らして有効である
- [ ] sample: 粒度・文体・表の書き方が完成例として適切である
- [ ] template: 章構成の骨組みとプレースホルダが雛形として再利用できる
- [ ] 共通: プロジェクト固有の内容が一般化されており、他プロジェクトでも再利用できる

## 3. 確定対象

最終確認と frontmatter の `status` の `ready` への昇格が済んだ対象にチェックを付ける。既に `ready` の参考資料は、劣化がないことを確認してチェックを付ける。

- [ ] 成果物: `docs/ja/projects/prj-0001/030-project-management/010-management-plan/pm-communication-plan.md`
- [ ] rulebook: `docs/ja/specdojo/rulebooks/pm-communication-plan-rulebook.md`
- [ ] recipe: `docs/ja/specdojo/recipes/pm-communication-plan-recipe.md`
- [ ] sample: `docs/ja/specdojo/samples/pm-communication-plan-sample.md`
- [ ] template: `docs/ja/specdojo/templates/pm-communication-plan-template.md`

## 4. 確定判断

- judgement: _TODO_（承認 / 差し戻し）

## 5. 備考

_TODO_: 差し戻し理由、確定対象以外に修正した内容、後続タスクへの申し送りなど、必要な場合のみ記入する（なければ削除）。
