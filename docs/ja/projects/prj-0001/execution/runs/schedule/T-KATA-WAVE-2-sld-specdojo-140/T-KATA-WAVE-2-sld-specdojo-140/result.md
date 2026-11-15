---
specdojo:
  id: prj-0001:xer-t-kata-wave-2-sld-specdojo-140
  type: exec-result
  task_id: T-KATA-WAVE-2-sld-specdojo-140
  mode: edit
  status: in_progress
  project_id: prj-0001
  started_at: "2026-11-15T12:21:03.685Z"
  agent: indie
  execution: human
  approach: bootstrap-finalize
  targets:
    - sld-specdojo
    - specdojo:sld-rulebook
    - specdojo:sld-sample
---

# Finalize Result

## 1. 実施基準

- 実施手順: [[specdojo:exec-human-finalize-recipe|Human Finalize 実行レシピ]]
- 共通規約: [[specdojo:exec-human-finalize-standard|Human Finalize 実行標準]]

この result を作業指示と確認記録の正本とし、frontmatter の `targets` に含まれる成果物と実践の型だけを確認・修正・確定する。

## 2. 確認チェックリスト

done_criteria の各項目を確認し、満たしていればチェックを付ける。満たせない項目がある場合は「確定判断」を差し戻しにし、理由を「備考」に記録する。

- [ ] 保管場所ごとに置くもの・共有の有無・寿命・消してよいかが記述されていること（BA / vp-ba-requirements-completeness）
- [ ] 保管場所の区分が実装の配置と一致していること（ARC / vp-arc-technical-constraints）
- [ ] 運用者が消してよい場所と残すべき場所を判断できること（OPS / vp-ops-operability）

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

- [ ] 成果物: `docs/ja/product/010-business-specs/020-data-model/sld-specdojo.md`
- [ ] rulebook: `docs/ja/specdojo/rulebooks/sld-rulebook.md`
- [ ] sample: `docs/ja/specdojo/samples/sld-sample.md`

## 5. 確定判断

- judgement: 差し戻し

## 6. 備考

- 差し戻し（人間の PO（indie）が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 79 点で完了条件 0/3。`.specdojo` の設定の保管、grade の lock と実行状態の置き場所の区分、片付けてよい範囲（動いている grade のファイルを消してよいとしている誤り）を直す必要がある。型の sample は needs-work 69 点（major 13 件）。
- sample の手直しと成果物の手直しの todo の後に、grade し直してから確定に戻す。
