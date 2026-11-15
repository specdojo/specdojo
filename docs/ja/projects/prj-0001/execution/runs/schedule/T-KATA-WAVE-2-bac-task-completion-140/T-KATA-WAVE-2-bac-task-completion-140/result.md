---
specdojo:
  id: prj-0001:xer-t-kata-wave-2-bac-task-completion-140
  type: exec-result
  task_id: T-KATA-WAVE-2-bac-task-completion-140
  mode: edit
  status: in_progress
  project_id: prj-0001
  started_at: "2026-11-15T12:20:54.242Z"
  agent: indie
  execution: human
  approach: bootstrap-finalize
  targets:
    - bac-task-completion
    - specdojo:bac-rulebook
    - specdojo:bac-recipe
    - specdojo:bac-sample
    - specdojo:bac-template
---

# Finalize Result

## 1. 実施基準

- 実施手順: [[specdojo:exec-human-finalize-recipe|Human Finalize 実行レシピ]]
- 共通規約: [[specdojo:exec-human-finalize-standard|Human Finalize 実行標準]]

この result を作業指示と確認記録の正本とし、frontmatter の `targets` に含まれる成果物と実践の型だけを確認・修正・確定する。

## 2. 確認チェックリスト

done_criteria の各項目を確認し、満たしていればチェックを付ける。満たせない項目がある場合は「確定判断」を差し戻しにし、理由を「備考」に記録する。

- [ ] 業務シナリオ・受入条件・前提・期待結果が業務観点で記述されていること（BA / vp-ba-requirements-completeness）
- [ ] 受入条件の業務的妥当性と判定基準を承認できること（PO / vp-po-decision-readiness）
- [ ] システム実装が受入条件を満たせる設計になっていること（ARC / vp-arc-technical-constraints）
- [ ] 受入テスト設計の基礎として活用できること（QE / vp-qe-verifiability）

- [ ] 確定対象の成果物と実践の型の本文に未反映の `_CONTEXT_:` が残っていない（残っていれば承認せず、draft へ差し戻す）

## 3. 実践の型の確認

実践の型を種別ごとに確認し、満たしていればチェックを付ける。「確定対象」に無い種別はスキップし、行を削除する。

- [ ] rulebook: 章構成・必須項目・禁止事項・判定基準が完成版の成果物と整合している
- [ ] recipe: 問い・観点・深掘り手順が完成版の作成過程に照らして有効である
- [ ] sample: 粒度・文体・表の書き方が完成例として適切である
- [ ] template: 章構成の骨組みとプレースホルダが雛形として再利用できる
- [ ] 共通: プロジェクト固有の内容が一般化されており、他プロジェクトでも再利用できる

## 4. 確定対象

最終確認と frontmatter の `status` の `ready` への昇格が済んだ対象にチェックを付ける。既に `ready` の実践の型は、劣化がないことを確認してチェックを付ける。

- [ ] 成果物: `docs/ja/product/050-business-acceptance-criteria/bac-task-completion.md`
- [ ] rulebook: `docs/ja/specdojo/rulebooks/bac-rulebook.md`
- [ ] recipe: `docs/ja/specdojo/recipes/bac-recipe.md`
- [ ] sample: `docs/ja/specdojo/samples/bac-sample.md`
- [ ] template: `docs/ja/specdojo/templates/bac-template.md`

## 5. 確定判断

- judgement: 差し戻し

## 6. 備考

- 差し戻し（人間の PO（indie）が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 95 点で完了条件 3/4、型は pass。受入の条件を実装で満たせることを確かめる設計の参照がない（DC-003、ARC）。本文に未決の目印が 2 か所ある。
- 設計の参照を足す小さな手直しの todo の後に確定する。
