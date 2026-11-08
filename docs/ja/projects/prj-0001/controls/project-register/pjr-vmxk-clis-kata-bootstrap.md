---
specdojo:
  id: prj-0001:pjr-vmxk-clis-kata-bootstrap
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T06:48:18Z"
  derived_from:
    - PJR-2GD6
    - PJR-RMMM
  approach: rulebook-authoring
  targets:
    - specdojo:clis-rulebook
  sources:
    - specdojo:uis-rulebook
    - specdojo:uis-sample
---

# PJR-VMXK CLI 仕様（clis）の型を新しく作る

## 1. 概要

SpecDojo 自身の CLI を利用者から見た仕様を書く新しい種類 clis の rulebook と sample を作る。PJR-0YNQ で uis に足した CLI の部分を土台にし、コマンドリファレンスを参照して操作の流れ・出力の要点・終了とエラーと次の手に絞る

## 2. 入力

- PJR-RMMM（indie が決定、2026-11-08）: CLI を新しい種類 clis（CLI Specification）に分け、uis は GUI の画面仕様だけにする。
- clis は SpecDojo 自身の CLI を利用者から見た仕様で、SpecDojo が起動する外部の CLI との約束である ifx-cmd とは分ける。

## 3. 完了条件

- `docs/ja/specdojo/rulebooks/clis-rulebook.md`（`specdojo:clis-rulebook`）と `docs/ja/specdojo/samples/clis-sample.md`（`specdojo:clis-sample`）を作っている。[[specdojo:rulebook-authoring-standard]] の章立てに従い、rulebook にサンプルの章を置かず、frontmatter の `sample` で sample を宣言している。recipe と template の要否を決め、frontmatter に書いている。
- rulebook に、次の規則を書いている。
  - clis は SpecDojo 自身の CLI のコマンド群を、利用者から見た仕様として書く。SpecDojo が起動する外部の CLI との約束（ifx-cmd）とは分ける。
  - 引数・オプションの表と使い方の詳細は書かず、コマンドリファレンスを参照する。
  - 文書には、利用目的、操作の流れ（どのコマンドからどのコマンドへ進むか）、出力と作るファイルの要点、終了コードとエラー表示と利用者の次の手を書く。
- PJR-0YNQ で `uis-rulebook`・`uis-sample` に足した CLI の部分を土台にし、CLI に合わない GUI の章（画面の表示項目・遷移など）は持ち込んでいない。
- `clis-sample` は、駄菓子屋の販売管理システムの CLI のコマンド群を題材にした完成例である。
- ID の命名の標準・成果物のリファレンス・文書サイトの sidebar・レビューの観点の設定など、種類の一覧を持つ文書と設定に clis を足している。保護された設定に当たるものは executor が変えず、変更案を個票の対応結果と報告の `handoff` に書いている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている（PJR-PJYJ で人が判断する材料にする）。
- uis の型と、prj-0001 のカタログは変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分（追加・変更・不具合修正など）と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `specdojo index build`・`npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                                                   | 担当   | 状態 | メモ |
| --- | ---------------------------------------------------------------------- | ------ | ---- | ---- |
| 1   | uis の型の CLI の部分とコマンドリファレンスを読み、clis の規則を決める | _TODO_ | open | -    |
| 2   | clis の rulebook と sample を作り、種類の一覧に足す                    | _TODO_ | open | -    |
| 3   | 検査を流し、決めた点と理由を対応結果に書く                             | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 決定: [[prj-0001:pjr-rmmm-uis-kata-confirm]]
- 土台: [[specdojo:uis-rulebook]]、[[specdojo:uis-sample]]
- 後続: [[prj-0001:pjr-pjyj-clis-uis-kata-confirm]]
