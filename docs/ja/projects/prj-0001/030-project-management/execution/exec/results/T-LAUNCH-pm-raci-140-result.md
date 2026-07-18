---
specdojo:
  id: prj-0001:xer-t-launch-pm-raci-140
  type: exec-result
  task_id: T-LAUNCH-pm-raci-140
  mode: edit
  status: in_progress
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-pm-raci-140-plan.md
  started_at: "2026-07-18T06:31:27Z"
  agent: indie
  approach: bootstrap-finalize
  targets:
    - prj-0001:pm-raci
    - pm-raci-rulebook
    - pm-raci-recipe
    - pm-raci-sample
    - pm-raci-template
---

# Finalize Result

## 1. 確認チェックリスト

done_criteria の各項目を確認し、満たしていればチェックを付ける。満たせない項目がある場合は「確定判断」を差し戻しにし、理由を「備考」に記録する。

- [ ] 成果物・プロセスごとの責任分担マトリクスを承認できること（PO / vp-po-decision-readiness）
- [ ] 確認者・合意対象など業務観点での責任分担が読み取れること（BA / vp-ba-stakeholder-clarity）
- [ ] RACI の Role code が組織定義の採用ロールと整合していること（ARC / vp-arc-cross-document-consistency）
- [ ] A の集約（1 成果物 1 Accountable）と R/C の抜け漏れがないこと（QE / vp-qe-omissions-consistency）

## 2. 参考資料の確認

参考資料を種別ごとに確認し、満たしていればチェックを付ける。「確定対象」に無い種別はスキップし、行を削除する。

- [ ] rulebook: 章構成・必須項目・禁止事項・判定基準が完成版の成果物と整合している
- [ ] recipe: 問い・観点・深掘り手順が完成版の作成過程に照らして有効である
- [ ] sample: 粒度・文体・表の書き方が完成例として適切である
- [ ] template: 章構成の骨組みとプレースホルダが雛形として再利用できる
- [ ] 共通: プロジェクト固有の内容が一般化されており、他プロジェクトでも再利用できる

## 3. 確定対象

最終確認と frontmatter の `status` の `ready` への昇格が済んだ対象にチェックを付ける。既に `ready` の参考資料は、劣化がないことを確認してチェックを付ける。

- [ ] 成果物: `docs/ja/projects/prj-0001/030-project-management/020-organization/pm-raci.md`
- [ ] rulebook: `docs/ja/specdojo/rulebooks/pm-raci-rulebook.md`
- [ ] recipe: `docs/ja/specdojo/recipes/pm-raci-recipe.md`
- [ ] sample: `docs/ja/specdojo/samples/pm-raci-sample.md`
- [ ] template: `docs/ja/specdojo/templates/pm-raci-template.md`

## 4. 確定判断

- judgement: _TODO_（承認 / 差し戻し）

## 5. 備考

_TODO_: 差し戻し理由、確定対象以外に修正した内容、後続タスクへの申し送りなど、必要な場合のみ記入する（なければ削除）。
