---
specdojo:
  id: prj-0001:pjr-0ynq-uis-kata-reference-to-command-reference
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T04:00:16Z"
  derived_from:
    - PJR-2GD6
  approach: rulebook-maintenance
  targets:
    - specdojo:uis-rulebook
---

# PJR-0YNQ 画面仕様（uis）の型を、コマンドリファレンスと同じことを書かない形に手入れする

## 1. 概要

画面仕様の型を手入れする。CLI のコマンド群を画面に見立てる uis で、引数・オプションの表は持たずコマンドリファレンスを参照し、利用目的・操作の流れ・表示・エラー表示の要点に絞る

## 2. 入力

- uis も実装と同じことを書かない対象に加える（indie が推奨どおりと決定、2026-11-08）。
- rulebook にあわせて uis-sample も揃える。

## 3. 完了条件

- [[specdojo:uis-rulebook]] に、次の規則を書いている。
  - CLI のコマンド群を画面に見立てる uis では、引数・オプションの表や使い方の詳細は書かず、コマンドリファレンスを参照する。
  - 文書には、利用目的・操作の流れ（どのコマンドからどのコマンドへ進むか）・表示される項目の要点・エラー表示と利用者の次の手を書く。
- `uis-sample` を新しい規則に合わせている。
- 型の変更に合わせて schema を変える必要があれば変え、今の形の文書も検査を通る（後方互換）。変えたかどうかと理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている（PJR-RMMM で人が判断する材料にする）。
- 成果物の文書とカタログ、ほかの種類の型を変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の `### CHANGELOG に書く事項` の節に、区分（追加・変更・不具合修正など）と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run validate:schema`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                                                           | 担当   | 状態 | メモ |
| --- | ------------------------------------------------------------------------------ | ------ | ---- | ---- |
| 1   | 今の rulebook と uis-sample を読み、コマンドリファレンスと重なる記述を洗い出す | _TODO_ | open | -    |
| 2   | rulebook に参照の規則を書き、uis-sample を揃える                               | _TODO_ | open | -    |
| 3   | 検査を流し、決めた点と理由を対応結果に書く                                     | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 対象: [[specdojo:uis-rulebook]]
- 後続: [[prj-0001:pjr-rmmm-uis-kata-confirm]]
