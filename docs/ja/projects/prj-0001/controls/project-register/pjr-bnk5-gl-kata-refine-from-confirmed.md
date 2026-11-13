---
specdojo:
  id: prj-0001:pjr-bnk5-gl-kata-refine-from-confirmed
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: hard
  owner: sol-executor
  registered_at: "2026-11-13T13:11:51Z"
  block_reason: "parent validation failed: test-integration"
  derived_from:
    - PJR-960C
    - PJR-6XQ4
    - PJR-2RHB
  commit_type: docs
  commit_scope: kata
  approach: rulebook-maintenance
  targets:
    - specdojo:gl-rulebook
---

# PJR-BNK5 用語集の型（gl）を、確定した用語集 6 件を手本に磨き込む

## 1. 概要

確定した用語集 6 件と確定のレビューで決めた決まりを、gl-rulebook と gl-sample に反映し、grade で pass にする

## 2. 入力

- 用語集 6 件（gl-common など）を 2026-11-13 に確定した。PJR-960C に足すとゲートで 7 種類の確定が止まるため、別の todo にした（orchestrator の判断、indie が進め方を承認）

## 3. 完了条件

- 確定した用語集 6 件（`docs/ja/product/010-business-specs/060-glossary/gl-*.yaml`）の実績から、[[specdojo:gl-rulebook]] を見直している。用語集そのものは変えない。
- [[specdojo:rulebook-authoring-standard]] の章立てに合わせ、rulebook にサンプルの章を置かず、見出しに連番を付け、記述ガイドに章ごとの判断の基準と良い例・悪い例を書いている。
- 確定のレビューで決めた次の決まりを rulebook に足している（PJR-2RHB の入力にある型の分）。
  - 英語名と英語の用語は小文字で書く。SpecDojo の概念の名前として大文字で定着しているもの（Kata など）と固有名詞（SpecDojo など）だけを例外にする。
  - 用語の見出し（`term`）は、利用者がガイド・CLI の表示・コマンド名で目にする言い方に合わせ、言い換えは別名に置く。
  - 注記（`notes`）には読み手向けの補足（前提・例外・使う文脈）だけを書き、`category` や `relatedTerms` の指定のしかたなど YAML の書き方を書かない。項目名の羅列を避け、長くなる場合は用語を分ける。
  - 領域別の用語集に分けるときは、横断の用語を `-common` に置き、同じ用語を 2 つの用語集で定義しない。用語 ID には領域の接頭辞を付けて、用語集をまたいで重ならないようにする。
  - ほかの用語の分類に使う用語を立て、分類（`category`）でまとめる。schema の条件付きの決まりは、用語の関係として短く書き、条件を写さない。
  - 確定した後は用語 ID を変えない。
- [[specdojo:gl-sample]] を、改訂した rulebook に沿う駄菓子屋の共通サンプル文脈の完成例にしている（分類の用語・英語名・注記の書き方の手本になる程度の厚さ）。
- recipe と template の要否を決め、rulebook の frontmatter に宣言している。
- rulebook の「本文要件」と、`relatedTerms`・`category` を同じ用語集の中に限る決まり（領域別の用語集をまたぐ参照の扱い）が、6 件の実績と食い違わないかを確かめ、食い違えば直している。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` と親の検証が通っている。型の grade は統合の後に orchestrator が流す。grade を流せないことを理由に未完了としない。

## 4. 作業内容

| No  | 作業                        | 担当         | 状態 | メモ |
| --- | --------------------------- | ------------ | ---- | ---- |
| 1   | rulebook と sample を見直す | executor     | open | -    |
| 2   | 統合の後に型の grade を流す | orchestrator | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-6xq4-glossary]]
- [[prj-0001:pjr-2rhb-glossary-alignment-outside]]
