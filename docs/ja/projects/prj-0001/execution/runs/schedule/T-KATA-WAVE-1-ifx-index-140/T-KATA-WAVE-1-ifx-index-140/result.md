---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-ifx-index-140
  type: exec-result
  task_id: T-KATA-WAVE-1-ifx-index-140
  mode: edit
  status: in_progress
  project_id: prj-0001
  started_at: "2026-11-15T10:30:57.914Z"
  agent: indie
  execution: human
  approach: bootstrap-finalize
  targets:
    - ifx-index
    - specdojo:ifx-index-rulebook
    - specdojo:ifx-index-recipe
    - specdojo:ifx-index-sample
    - specdojo:ifx-index-template
---

# Finalize Result

## 1. 実施基準

- 実施手順: [[specdojo:exec-human-finalize-recipe|Human Finalize 実行レシピ]]
- 共通規約: [[specdojo:exec-human-finalize-standard|Human Finalize 実行標準]]

この result を作業指示と確認記録の正本とし、frontmatter の `targets` に含まれる成果物と実践の型だけを確認・修正・確定する。

## 2. 確認チェックリスト

done_criteria の各項目を確認し、満たしていればチェックを付ける。満たせない項目がある場合は「確定判断」を差し戻しにし、理由を「備考」に記録する。

- [x] 外部連携の一覧・連携方式・タイミングが業務観点で整理されていること（BA / vp-ba-requirements-completeness）
- [x] 外部連携のスコープと方式を承認できること（PO / vp-po-purpose-alignment）
- [ ] 外部システム連携設計（プロトコル・認証・エラー処理）の入力として参照できること（ARC / vp-arc-technical-constraints）（未充足。人間の PO が留保付きで承認（2026-11-15）。Git・GitHub の契約は PJR-CJMN で作る）
- [x] 外部結合テストの対象が識別できること（QE / vp-qe-verifiability）
- [x] 外部I/F実装スコープの参照として使えること（DEV / vp-dev-implementation-readiness）

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

- [x] 成果物: `docs/ja/product/020-external-interface-specs/ifx-index.yaml`
- [x] rulebook: `docs/ja/specdojo/rulebooks/ifx-index-rulebook.md`
- [x] recipe: `docs/ja/specdojo/recipes/ifx-index-recipe.md`
- [x] sample: `docs/ja/specdojo/samples/ifx-index-sample.yaml`
- [x] template: `docs/ja/specdojo/templates/ifx-index-template.yaml`

## 5. 確定判断

- judgement: 承認（留保付き）

## 6. 備考

- 人間の PO（indie）が 2026-11-15 に留保付きで承認した（PJR-TN43）。成果物の grade は、本文に PO の判断と留保を書いたうえで grade し直し 82 点（pass）で完了条件 4/5。型の grade は rulebook 100・sample 100（pass）。
- 未充足の DC-003（ARC）は、Git・GitHub 連携の契約がまだ TBD であることによる。PO が期限付きの留保として承認しており、PJR-CJMN で詳細仕様を作って解消する。
