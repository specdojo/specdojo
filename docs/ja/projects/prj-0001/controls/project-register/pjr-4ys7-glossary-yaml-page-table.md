---
specdojo:
  id: prj-0001:pjr-4ys7-glossary-yaml-page-table
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: sol-executor
  registered_at: "2026-11-12T13:33:36Z"
  derived_from:
    - PJR-6XQ4
  commit_type: feat
  commit_scope: docs
---

# PJR-4YS7 用語集の YAML の表示用ページを、分類ごとの表で描く

## 1. 概要

yaml-pages が type: glossary の YAML を、コードブロックではなく分類ごとの表で描き、YAML の正本は折りたたんで残す

## 2. 入力

- 用語集の確定の段の前に、表示用ページが YAML をコードブロックに埋めただけでレビューしにくいと indie が気づいた。表示の案を orchestrator が出し、indie が承認した（2026-11-12）

## 3. 完了条件

- `src/docs/yaml-pages.ts` が、`type: glossary` の YAML（`gl.schema.yaml` に従うもの）の表示用ページを次の形で描く。成果物カタログのテンプレートを表で描く既存の分岐にならう。
  - 冒頭に、生成元の注記と、ID・言語・状態・用語の数の表を置く。
  - 用語を分類（`category`）ごとの番号付きの章（`## 1. <分類>` など）に分け、各章を 1 つの表にする。分類のない用語は「その他」の章にまとめる。章の順は YAML の中で分類が最初に現れた順とする。
  - 表の列は、用語（用語 ID を添える）・英語名と別名・定義・補足（`notes`・`example`・`source` をまとめる）・関連（`relatedTerms` を、同じページの用語へのリンクにする）の 5 列とする。
  - セルの中の改行は空白につなぎ、`|` は `\|` に置き換える。表が壊れないことを確かめる。
  - 最後の章に、YAML の正本を `<details>` で折りたたんで残す（今のコードブロックと同じ中身）。
- 用語集以外の YAML の表示は変えない。
- `gl-sample.yaml` と、用語集の 6 件（`docs/ja/product/010-business-specs/060-glossary/`）で、表が正しく描けることを単体テストで確かめている（分類のない用語、改行や `|` を含むセル、関連のリンクを含む）。
- 生成されたページが `npm run lint:md` の決まり（見出しの番号など）に合っている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。文書サイトのビルド（`npm run docs:build`）は orchestrator が統合の後に流して確かめる。

## 4. 作業内容

| No  | 作業                                             | 担当         | 状態 | メモ |
| --- | ------------------------------------------------ | ------------ | ---- | ---- |
| 1   | 用語集の表示用ページの描き方を足し、テストを足す | executor     | open | -    |
| 2   | 統合の後に文書サイトのビルドで確かめる           | orchestrator | open | -    |
| 3   | 表示を見て確かめる                               | indie        | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-6xq4-glossary]]
- [[specdojo:gl-rulebook]]
