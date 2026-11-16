---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-sf-index-140
  type: exec-result
  task_id: T-KATA-WAVE-1-sf-index-140
  mode: edit
  status: in_progress
  project_id: prj-0001
  started_at: "2026-11-15T10:30:54.745Z"
  agent: indie
  execution: human
  approach: bootstrap-finalize
  targets:
    - sf-index
    - specdojo:sf-index-rulebook
    - specdojo:sf-index-sample
---

# Finalize Result

## 1. 実施基準

- 実施手順: [[specdojo:exec-human-finalize-recipe|Human Finalize 実行レシピ]]
- 共通規約: [[specdojo:exec-human-finalize-standard|Human Finalize 実行標準]]

この result を作業指示と確認記録の正本とし、frontmatter の `targets` に含まれる成果物と実践の型だけを確認・修正・確定する。

## 2. 確認チェックリスト

done_criteria の各項目を確認し、満たしていればチェックを付ける。満たせない項目がある場合は「確定判断」を差し戻しにし、理由を「備考」に記録する。

- [ ] 機能一覧が業務仕様と対応し、スコープが網羅されていること（BA / vp-ba-requirements-completeness）
- [ ] システム化機能のスコープを承認できること（PO / vp-po-purpose-alignment）
- [ ] 機能分割・コンポーネント設計の入力として参照できること（ARC / vp-arc-technical-constraints）
- [ ] テスト対象機能の網羅性が確認できること（QE / vp-qe-omissions-consistency）
- [ ] 実装スコープ・機能境界の参照として使えること（DEV / vp-dev-implementation-readiness）

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

- [ ] 成果物: `docs/ja/product/010-business-specs/050-system-functions/sf-index.md`
- [ ] rulebook: `docs/ja/specdojo/rulebooks/sf-index-rulebook.md`
- [ ] sample: `docs/ja/specdojo/samples/sf-index-sample.md`

## 5. 確定判断

- judgement: 差し戻し

## 6. 備考

- 差し戻し（人間の PO（indie）が 2026-11-15 に判断、PJR-TN43）。本文に PO の判断と留保を書いたうえで grade し直したが、needs-work 75 点で完了条件 0/5。
- 主な理由: `SF-ROUT-02` が実行の行になっているが、対応する P-06 はジョブの定義の領域で、機能の境界がずれている（DC-001・002・003・005）。全機能 ID と業務領域をテスト対象と照らした記録がない（DC-004）。
- 手直しは register の todo（fully-guided、最新の grade の指摘を取り込む）で行い、grade し直してから確定に戻す。Q-01・Q-03 の留保（PJR-AK5V）はそのまま。
