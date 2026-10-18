---
specdojo:
  id: prj-0001:pjr-s64h-glossary-kicho-kihyo
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: BA
  registered_at: "2026-10-12T06:48:15Z"
  due_on: "2026-10-31"
---

# PJR-S64H 用語集 gl-common に記帳と起票を加える

## 1. 概要

起票（1 件の項目を新しく作ること）と記帳（起票・状態遷移・結論の記録・commit を含む、台帳への書き込み全般。register の Waza としての呼び名）の使い分けを、用語集 gl-common に定義する

## 2. 完了条件

- `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml` に次の 2 語を加えている。

  | id                  | 用語 | englishName      | 定義                                                                                                               | relatedTerms                       |
  | ------------------- | ---- | ---------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
  | `tm-filing`         | 起票 | `filing`         | 登録簿に 1 件の項目を新しく作ること。`register add` に当たる                                                       | `tm-register`、`tm-record-keeping` |
  | `tm-record-keeping` | 記帳 | `record-keeping` | 登録簿へ書き込むこと全般。起票、状態遷移、結論の記録、commit を含む。`register` の技（Waza）としての呼び名でもある | `tm-register`、`tm-filing`         |

- 起票が記帳の一部であることが、定義または `notes` から読み取れる。
- 記帳の定義が、[[prj-0001:pjr-9g9y-practice-execution-terminology]] と PJR-34F2 で決まった技の名前と矛盾しない（[[specdojo:specdojo-overview-guide]] の「`register` を『記帳』と呼びます」）。
- `relatedTerms` と `category` が用語集の中の ID を指す（PJR-CF15 の検証が通る）。
- 用語集の schema の検証（`npm run validate:schema`）と `npm run lint:md` が通る。

## 3. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ |
| --- | ---------------------------------------- | ---- | ---- | ---- |
| 1   | 2 語を `gl-common.yaml` に加えて検証する | BA   | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-hepk-lp-content]]: 記帳と起票の使い分けが問われた LP の項目。
- [[prj-0001:pjr-9g9y-practice-execution-terminology]]: 体系の用語の決定。
- [[prj-0001:pjr-qd81-gl-common]]: 用語集 gl-common を作成した項目。
