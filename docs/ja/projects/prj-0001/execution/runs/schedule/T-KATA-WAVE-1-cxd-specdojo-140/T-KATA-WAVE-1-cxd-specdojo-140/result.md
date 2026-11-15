---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-cxd-specdojo-140
  type: exec-result
  task_id: T-KATA-WAVE-1-cxd-specdojo-140
  mode: edit
  status: in_progress
  project_id: prj-0001
  started_at: "2026-11-15T10:30:28.943Z"
  agent: indie
  execution: human
  approach: bootstrap-finalize
  targets:
    - cxd-specdojo
    - specdojo:cxd-rulebook
    - specdojo:cxd-recipe
    - specdojo:cxd-sample
    - specdojo:cxd-template
---

# Finalize Result

## 1. 実施基準

- 実施手順: [[specdojo:exec-human-finalize-recipe|Human Finalize 実行レシピ]]
- 共通規約: [[specdojo:exec-human-finalize-standard|Human Finalize 実行標準]]

この result を作業指示と確認記録の正本とし、frontmatter の `targets` に含まれる成果物と実践の型だけを確認・修正・確定する。

## 2. 確認チェックリスト

done_criteria の各項目を確認し、満たしていればチェックを付ける。満たせない項目がある場合は「確定判断」を差し戻しにし、理由を「備考」に記録する。

- [x] 対象システムと外部システム・ユーザーの関係が業務観点で正確に表現されていること（BA / vp-ba-requirements-completeness）
- [x] システム境界とステークホルダーを承認できること（PO / vp-po-purpose-alignment）
- [x] アーキテクチャ全体構造の共通理解として参照できること（ARC / vp-arc-technical-constraints）
- [x] システム境界・外部依存のテスト観点が識別できること（QE / vp-qe-verifiability）

- [x] 確定対象の成果物と実践の型の本文に未反映の `_CONTEXT_:` が残っていない（残っていれば承認せず、draft へ差し戻す）

## 3. 実践の型の確認

実践の型を種別ごとに確認し、満たしていればチェックを付ける。「確定対象」に無い種別はスキップし、行を削除する。

- [x] rulebook: 章構成・必須項目・禁止事項・判定基準が完成版の成果物と整合している
- [x] recipe: 問い・観点・深掘り手順が完成版の作成過程に照らして有効である
- [x] sample: 粒度・文体・表の書き方が完成例として適切である
- [x] template: 章構成の骨組みとプレースホルダが雛形として再利用できる
- [x] 共通: プロジェクト固有の内容が一般化されており、他プロジェクトでも再利用できる

## 4. 確定対象

最終確認と frontmatter の `status` の `ready` への昇格が済んだ対象にチェックを付ける。既に `ready` の実践の型は、劣化がないことを確認してチェックを付ける。

- [x] 成果物: `docs/ja/product/030-architecture/010-c4/cxd-specdojo.md`
- [x] rulebook: `docs/ja/specdojo/rulebooks/cxd-rulebook.md`
- [x] recipe: `docs/ja/specdojo/recipes/cxd-recipe.md`
- [x] sample: `docs/ja/specdojo/samples/cxd-sample.md`
- [x] template: `docs/ja/specdojo/templates/cxd-template.md`

## 5. 確定判断

- judgement: 承認

## 6. 備考

- 人間の PO（indie）が 2026-11-15 に承認した（PJR-TN43）。成果物の grade は 95 点で完了条件 4/4、型の grade は rulebook 97・sample 100（pass）。recipe と template は個別に grade していないが、kata-wave-1 の 045・060 で rulebook に合わせて同期した。
- 本文の構成の仮定（利用者の作業環境で動かす構成）は、今の構成として承認した。
