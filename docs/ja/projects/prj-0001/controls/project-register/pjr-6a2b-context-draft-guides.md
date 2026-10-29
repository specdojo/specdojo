---
specdojo:
  id: prj-0001:pjr-6a2b-context-draft-guides
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-10-28T22:23:23Z"
  derived_from:
    - PJR-65DS
  depends_on:
    - PJR-JRSY
    - PJR-6DD7
    - PJR-YKMA
    - PJR-E45K
---

# PJR-6A2B 文脈を渡して成果物を作る流れをガイドにまとめる

## 1. 概要

scaffold・文脈の記入・draft・fully-guided・finalize の流れと、_CONTEXT_・--input・brief の使い分けを関連ガイドと tsd-recipe に書く

## 2. 完了条件

- exec-operation-guide に、register 経由で雛形・文脈の記入・`draft`・`fully-guided`・`finalize` を個票に分け、`depends_on` でつないで流す手順を書く。
- ryu-guide に、`draft` と `fully-guided` の使い分けと、文脈の置き場所（成果物内の `_CONTEXT_`、個票の `入力`、カタログの `brief`）の使い分けを書く。
- `tsd-recipe` の「作成前に集める情報」を、集めた答えを `_CONTEXT_`・`--input`・`brief` のどこに書くかが分かる形に直す。
- tsd を「静的サイトで主流の技術スタックで書く」と指示して作る例を、いずれかのガイドに載せる。
- 変更した文書で `npm run lint:md` と `npm run lint:fm` が通る。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。`0.5.0` と公開済みの版の節は変えない。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。保護された設定に触れる必要がある場合は、変更せずに案を本個票の対応結果と `handoff` に書く。

## 3. 作業内容

| No  | 作業                                         | 担当     | 状態 | メモ |
| --- | -------------------------------------------- | -------- | ---- | ---- |
| 1   | exec-operation-guide と ryu-guide を更新する | executor | open | -    |
| 2   | tsd-recipe を更新し、例を載せる              | executor | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-65ds-deliverable-context-draft-approach]]
- [[specdojo:ryu-guide]]
