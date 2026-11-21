---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-sysd-critical-flows-140
  type: exec-result
  task_id: T-KATA-WAVE-1-sysd-critical-flows-140
  mode: edit
  status: in_progress
  project_id: prj-0001
  started_at: "2026-11-15T10:30:35.509Z"
  agent: indie
  execution: human
  approach: bootstrap-finalize
  targets:
    - sysd-critical-flows
    - specdojo:sysd-critical-flows-rulebook
    - specdojo:sysd-critical-flows-recipe
    - specdojo:sysd-critical-flows-sample
    - specdojo:sysd-critical-flows-template
---

# Finalize Result

## 1. 実施基準

- 実施手順: [[specdojo:exec-human-finalize-recipe|Human Finalize 実行レシピ]]
- 共通規約: [[specdojo:exec-human-finalize-standard|Human Finalize 実行標準]]

この result を作業指示と確認記録の正本とし、frontmatter の `targets` に含まれる成果物と実践の型だけを確認・修正・確定する。

## 2. 確認チェックリスト

done_criteria の各項目を確認し、満たしていればチェックを付ける。満たせない項目がある場合は「確定判断」を差し戻しにし、理由を「備考」に記録する。

- [x] 重要フローの選定理由と業務影響が確認できること（BA / vp-ba-business-value）
- [x] 重要フローの内容を承認できること（PO / vp-po-decision-readiness）
- [x] フローの境界・永続化点・再実行性・失敗時挙動が定義されていること（ARC / vp-arc-technical-constraints）
- [x] 重要フローのテストシナリオ設計に活用できること（QE / vp-qe-verifiability）
- [x] フロー実装の共通理解として参照できること（DEV / vp-dev-implementation-readiness）

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

- [x] 成果物: `docs/ja/product/040-system-design/sysd-critical-flows.md`
- [x] rulebook: `docs/ja/specdojo/rulebooks/sysd-critical-flows-rulebook.md`
- [x] recipe: `docs/ja/specdojo/recipes/sysd-critical-flows-recipe.md`
- [x] sample: `docs/ja/specdojo/samples/sysd-critical-flows-sample.md`
- [x] template: `docs/ja/specdojo/templates/sysd-critical-flows-template.md`

## 5. 確定判断

- judgement: 承認

## 6. 備考

- 人間の PO（indie）が 2026-11-15 に承認した（PJR-TN43）。成果物の grade は 89 点で完了条件 5/5、型の grade は rulebook 100・sample 97（pass）。recipe と template は個別に grade していない。
- 未決事項 CF-U01〜04 は期限付きの留保として PJR-Y2X4 で、CF-U05 は運用方針・手順の整備で追う。カタログの依存先を現行の CDFD へ付け替えた。
