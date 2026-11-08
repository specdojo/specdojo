---
specdojo:
  id: prj-0001:pjr-8j47-catalog-uis-to-clis
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  registered_at: "2026-11-08T06:49:16Z"
  derived_from:
    - PJR-2GD6
    - PJR-RMMM
  depends_on:
    - PJR-PJYJ
    - PJR-025M
---

# PJR-8J47 カタログの uis の 2 件を clis に付け替える

## 1. 概要

prj-0001 のカタログの uis-index・uis-exec-commands を clis-index・clis-exec-commands にし、rulebook と overview と done_criteria を確定した clis の型に合わせる

## 2. 入力

- PJR-RMMM（indie が決定、2026-11-08）: uis の代表は作らず（SpecDojo に GUI はない）、clis の代表 clis-exec-commands を作る。成果物も schedule のタスクもまだないため、名前を変えるだけで済む。

## 3. 完了条件

- `dct-user-interface-model.yaml` の `uis-index`・`uis-exec-commands` を `clis-index`・`clis-exec-commands` にし、`path`・`rulebook`（`specdojo:clis-rulebook`。索引に専用の rulebook がなければ、その扱いを決めて書く）・`overview`・`done_criteria`・`note`・`depends_on` を確定した clis の型に合わせている。引数・オプションを書くという記述は外している。
- 成果物も schedule のタスクもまだないため、古い `uis-*` の項目は残していない。ほかのカタログで `uis-index`・`uis-exec-commands` を参照している箇所（`sf-index` の説明など）があれば直している。
- ほかの項目とカタログを変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分（追加・変更・不具合修正など）と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `specdojo catalog validate --project prj-0001`・`npm run validate:schema`・`npm run lint:md` が通っている。

## 4. 作業内容

| No  | 作業                                                     | 担当   | 状態 | メモ |
| --- | -------------------------------------------------------- | ------ | ---- | ---- |
| 1   | 確定した clis の型と、カタログの uis の 2 件と参照を読む | _TODO_ | open | -    |
| 2   | 2 件を clis に付け替え、参照を直す                       | _TODO_ | open | -    |
| 3   | 検査を流し、対応結果に書く                               | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 決定: [[prj-0001:pjr-rmmm-uis-kata-confirm]]
- 先行: [[prj-0001:pjr-pjyj-clis-uis-kata-confirm]]
