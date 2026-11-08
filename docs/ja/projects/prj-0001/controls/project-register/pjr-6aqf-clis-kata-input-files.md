---
specdojo:
  id: prj-0001:pjr-6aqf-clis-kata-input-files
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T08:11:27Z"
  derived_from:
    - PJR-2GD6
    - PJR-PJYJ
  approach: rulebook-maintenance
  targets:
    - specdojo:clis-rulebook
---

# PJR-6AQF CLI 仕様（clis）の型に入力ファイルの規則を足す

## 1. 概要

clis の本文の「出力と生成ファイルの要点」を「入力と出力のファイルの要点」にし、コマンドが読むファイルと作る・変えるファイルを分けて書く規則と、sample の例を足す

## 2. 入力

- PJR-PJYJ（indie が決定、2026-11-08）: clis は入力ファイルの規則を足して直す。読むファイルの中身は書かず、そのファイルの rulebook か schema を参照する。

## 3. 完了条件

- [[specdojo:clis-rulebook]] の本文要件の「出力と生成ファイルの要点」を「入力と出力のファイルの要点」にし、記述ガイドに次の規則を書いている。
  - コマンドが読むファイル（設定・正本・前のコマンドが作ったファイル）と、作る・変えるファイルを分けて書く。
  - 読むファイルごとに、ない場合と形式が壊れている場合の扱い（止まるか、既定で進むか）を書く。
  - 読むファイルの中身（項目や形式）は書かず、そのファイルの rulebook か schema を参照する。
  - 読むファイルの誤りで出るエラーは、終了コードとエラー表示・利用者の次の手の章の表につなげる。
- `clis-sample` に、読むファイル（商品マスタなど）の例と、そのファイルがない・壊れているときのエラーの例を足している。
- 確定した ifx-cmd の型（渡すファイルと作るファイル）と、用語と考え方が食い違っていない。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている（PJR-025M で人が判断する材料にする）。
- uis の型、ほかの型、カタログを変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run lint:md`・`npm run lint:fm`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                                   | 担当   | 状態 | メモ |
| --- | ------------------------------------------------------ | ------ | ---- | ---- |
| 1   | clis の型と ifx-cmd の型の入出力の書き方を読み比べる   | _TODO_ | open | -    |
| 2   | rulebook に入力ファイルの規則を書き、sample に例を足す | _TODO_ | open | -    |
| 3   | 検査を流し、決めた点と理由を対応結果に書く             | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 決定: [[prj-0001:pjr-pjyj-clis-uis-kata-confirm]]
- 対象: [[specdojo:clis-rulebook]]
- 揃える相手: [[specdojo:ifx-cmd-rulebook]]
- 後続: [[prj-0001:pjr-025m-clis-kata-confirm-input-files]]
