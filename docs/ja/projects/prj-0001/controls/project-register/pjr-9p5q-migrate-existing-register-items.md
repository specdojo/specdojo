---
specdojo:
  id: prj-0001:pjr-9p5q-migrate-existing-register-items
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  owner: ARC
  registered_on: "2026-08-09"
  due_on: "2026-08-31"
---

# PJR-9P5Q 既存登録項目を個票 frontmatter へ一括移行する

## 1. 概要

[[prj-0001:pjr-es57-register-file-ssot-migration]] の分割4。現行の登録項目一覧に存在する全行を個票へ移行する。個票を持たない項目には新たに個票を生成し、既に個票を持つ項目には表の構造化フィールドを frontmatter へ移す。

## 2. 完了条件

- 一覧の全行が個票として存在し、構造化フィールドが frontmatter へ移されている。
- 個票が既にある項目で、本文の記述内容が失われていない。
- 移行前後で項目数、ID、処理状態、結論が一致する。差分が検証で確認できる。
- 移行後の一覧生成結果が、移行前の一覧と項目単位で同じ内容になる。
- 移行処理が再実行可能で、途中失敗時に部分適用が残らない。

## 3. 作業内容

| No  | 作業                             | 担当 | 状態 | メモ                                             |
| --- | -------------------------------- | ---- | ---- | ------------------------------------------------ |
| 1   | 移行処理を実装する               | ARC  | open | 表の行から個票 frontmatter を生成する            |
| 2   | 個票が無い項目の個票を生成する   | ARC  | open | 本文は type 別テンプレートの最小構成とする       |
| 3   | 既存個票へ構造化フィールドを移す | ARC  | open | 本文の重複記述を残さない                         |
| 4   | 移行前後の突き合わせ検証を行う   | ARC  | open | 項目数・ID・処理状態・結論を比較する             |
| 5   | 移行を実行して結果を確認する     | ARC  | open | 実行前に作業ツリーがクリーンであることを確認する |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-rf3b-register-item-frontmatter-schema]]: 移行先のスキーマ定義
- [[prj-0001:pjr-rzr3-pjr-index-as-generated-view]]: 移行結果の検証に用いる一覧生成
- [[prj-0001:pjr-index]]: 移行対象の登録項目一覧
