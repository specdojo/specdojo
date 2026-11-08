---
specdojo:
  id: prj-0001:pjr-x3t8-uis-kata-gui-only
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T06:48:38Z"
  derived_from:
    - PJR-2GD6
    - PJR-RMMM
  depends_on:
    - PJR-VMXK
  approach: rulebook-maintenance
  targets:
    - specdojo:uis-rulebook
---

# PJR-X3T8 画面仕様（uis）の型を GUI の画面仕様だけにし、サンプルの章を外す

## 1. 概要

PJR-0YNQ で uis に足した CLI 向けの部分を外して GUI の画面仕様だけにし、rulebook の「8. サンプル」の章を消す

## 2. 入力

- PJR-RMMM（indie が決定、2026-11-08）: uis は GUI の画面仕様だけにし、rulebook の「8. サンプル」の章を消す（完成例は uis-sample にあるため）。

## 3. 完了条件

- [[specdojo:uis-rulebook]] を GUI の画面仕様だけの規則にしている。PJR-0YNQ で CLI 向けに足した記述（CLI のコマンド群を画面に見立てる、コマンドからコマンドへの流れなど）を外し、CLI は clis（`specdojo:clis-rulebook`）で書くと案内している。
- rulebook の「8. サンプル」の章を消し、後の章の番号を詰めている。完成例は frontmatter の `sample`（`uis-sample`）で示す。
- `uis-sample` を GUI の画面の完成例にしている（駄菓子屋の販売管理システムの画面）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている（PJR-PJYJ の材料にする）。
- clis の型と、prj-0001 のカタログは変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分（追加・変更・不具合修正など）と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                             | 担当   | 状態 | メモ |
| --- | ------------------------------------------------ | ------ | ---- | ---- |
| 1   | uis の型から CLI 向けの記述を洗い出す            | _TODO_ | open | -    |
| 2   | GUI だけの規則と sample にし、サンプルの章を消す | _TODO_ | open | -    |
| 3   | 検査を流し、決めた点と理由を対応結果に書く       | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 決定: [[prj-0001:pjr-rmmm-uis-kata-confirm]]
- 対象: [[specdojo:uis-rulebook]]
- 後続: [[prj-0001:pjr-pjyj-clis-uis-kata-confirm]]
