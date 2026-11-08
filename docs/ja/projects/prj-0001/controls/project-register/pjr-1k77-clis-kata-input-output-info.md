---
specdojo:
  id: prj-0001:pjr-1k77-clis-kata-input-output-info
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T08:51:42Z"
  derived_from:
    - PJR-2GD6
    - PJR-025M
  approach: rulebook-maintenance
  targets:
    - specdojo:clis-rulebook
---

# PJR-1K77 CLI 仕様（clis）の入出力を、ファイルに限らない入力情報と出力情報に直す

## 1. 概要

clis の 5 章を「入力と出力の要点」にし、入力情報と出力情報に分けて、ファイル・標準入力・環境変数・対話の入力・API を種類の列で並べる。API は ifx-api を参照する

## 2. 入力

- PJR-025M（indie が決定、2026-11-08）: CLI の中から API を呼び出すこともあるため、読むファイル・作る変えるファイルではなく入力情報・出力情報とする。

## 3. 完了条件

- [[specdojo:clis-rulebook]] の本文要件の 5 章を「入力と出力の要点」にし、小節を「入力情報」と「出力情報」の 2 つにしている。標準出力の要点は出力情報にまとめている。
- 記述ガイドに、次の規則を書いている。
  - 入力情報の表は、種類（ファイル・標準入力・環境変数・対話での入力・API の応答）・対象・役割・正本の参照・ない／壊れている／届かないときの扱い、を持つ。
  - 出力情報の表は、種類（標準出力・標準エラー・作る／変えるファイル・API への送信）・対象・役割・正本の参照、を持つ。
  - 中身は書かず正本を参照する。ファイルはその rulebook か schema、API は外部 I/F の仕様（[[specdojo:ifx-api-rulebook]] に従う文書）を参照し、clis にはどのコマンドがどの API をなぜ呼ぶかと失敗時の扱いだけを書く。
  - API の失敗（つながらない・時間切れ・拒否）を含む入力情報の失敗を、終了コードとエラー表示・利用者の次の手の章の表につなげる。
  - 認証情報（API キーなど）は環境変数などの名前と用途だけを書き、値は書かない。
  - 取得と更新の両方を行う API の呼び出しは、入力情報と出力情報の両方に挙げる。
- 用語の定義・位置づけの図など、ほかの章の「読むファイル」「作るファイル」の記述も入力情報・出力情報に揃えている。
- `clis-sample` を新しい章立てにし、ファイルのほかに環境変数と API（例: 商品マスタを API から取る、売上を API へ送る）の例と、その失敗のエラーの例を載せている。
- `##` 以下の見出しにはすべて連番を付けている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている（PJR-K4PM で人が判断する材料にする）。
- uis の型、ほかの型、カタログを変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run lint:md`・`npm run lint:fm`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                                          | 担当   | 状態 | メモ |
| --- | ------------------------------------------------------------- | ------ | ---- | ---- |
| 1   | clis の型と ifx-api・ifx-cmd の型の入出力の書き方を読み比べる | _TODO_ | open | -    |
| 2   | 5 章と記述ガイドを入力情報・出力情報に直し、sample を揃える   | _TODO_ | open | -    |
| 3   | 検査を流し、決めた点と理由を対応結果に書く                    | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 決定: [[prj-0001:pjr-025m-clis-kata-confirm-input-files]]
- 対象: [[specdojo:clis-rulebook]]
- 参照先の型: [[specdojo:ifx-api-rulebook]]
- 後続: [[prj-0001:pjr-k4pm-clis-kata-confirm-input-output-info]]
