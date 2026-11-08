---
specdojo:
  id: prj-0001:pjr-1d1x-clis-kata-diagram-references
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T11:53:28Z"
  derived_from:
    - PJR-2GD6
    - PJR-K4PM
  approach: rulebook-maintenance
  targets:
    - specdojo:clis-rulebook
---

# PJR-1D1X CLI 仕様（clis）の図を単純にし、自システムの API と外部コマンドの参照先を足す

## 1. 概要

clis の位置づけの図を入力情報・出力情報の仕様への線だけにし、入力と出力の規則に自システムの API と CLI が起動する外部コマンドの参照先を足す

## 2. 入力

- PJR-K4PM（indie が決定、2026-11-08）: 図に ifx-cmd を参照先として結ぶと、clis と ifx-cmd が別物であることがかえって分かりにくくなるため、図は入力情報・出力情報の仕様への線だけにする。

## 3. 完了条件

- [[specdojo:clis-rulebook]] の「成果物としての位置づけ」の図を、次の 4 つの箱と 3 本の線だけにしている。ifx-cmd・ファイル・ifx-api の個別の箱は図から外している。
  - sf → clis
  - clis → コマンドリファレンス（構文・引数の正本参照）
  - clis → 入力情報の仕様（中身の正本参照）
  - clis → 出力情報の仕様（中身の正本参照）
- clis と ifx-cmd の違いを、全体方針と役割分担の文で示している（clis は利用者がシステムを操作する側、ifx-cmd はシステムが外部を呼ぶ側）。
- 入力と出力の要点の記述ガイドに、参照する正本を種類ごとに書いている。
  - ファイル: その rulebook か schema
  - 外部システムの API: [[specdojo:ifx-api-rulebook]] に従う文書
  - 自システムの API: システム設計の索引（[[specdojo:sysd-index-rulebook]] に従う文書）が案内する内部 API の定義。まだない段階では API の名前と用途だけを書く
  - CLI が起動する外部コマンド: [[specdojo:ifx-cmd-rulebook]] に従う文書。渡すものは出力情報、受け取る結果は入力情報に挙げる
- 入力情報・出力情報の「種類」の値に、自システムの API と外部コマンドの起動を足している。種類の名前は executor が決め、理由を個票の対応結果に書いている。
- `clis-sample` に、外部コマンドを起動する例（例: レシートを印刷するコマンドを起動する）を入力情報と出力情報に足し、その失敗のエラーを終了コードとエラーの章の表に足している。
- `##` 以下の見出しにはすべて連番を付けている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている（PJR-25B9 で人が判断する材料にする）。
- uis・ifx-cmd・ifx-api の型と、カタログを変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run lint:md`・`npm run lint:fm`・`npm run lint:mermaid`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                              | 担当   | 状態 | メモ |
| --- | ------------------------------------------------- | ------ | ---- | ---- |
| 1   | 図と入力と出力の規則を読み、直す箇所を決める      | _TODO_ | open | -    |
| 2   | 図を単純にし、参照先と種類を足し、sample を揃える | _TODO_ | open | -    |
| 3   | 検査を流し、決めた点と理由を対応結果に書く        | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 決定: [[prj-0001:pjr-k4pm-clis-kata-confirm-input-output-info]]
- 対象: [[specdojo:clis-rulebook]]
- 後続: [[prj-0001:pjr-25b9-clis-kata-confirm-diagram-references]]
