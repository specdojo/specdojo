---
specdojo:
  id: prj-0001:pjr-jb6s-design-system-kata
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  registered_at: "2026-11-10T12:46:14Z"
  derived_from:
    - PJR-MXQB
  autopilot: approved
---

# PJR-JB6S GUI のデザインのルール（デザインシステム）の型を新しく作る

## 1. 概要

uis はワイヤーフレームとレイアウトを含めないため、画面をまたいで見た目を揃えるデザインのルール（色・文字・余白などの基本の値、部品、レイアウトの型、アクセシビリティ）を、設計の新しい種類として定める rulebook と sample を作る

## 2. 入力

- indie の要望（2026-11-10）: uis はワイヤーフレームを含めないので、デザインシステムを別途設計として定める型を作る。
- orchestrator の案（PJR-MXQB の入力、2026-11-08）: デザインのルールは設計の範疇で、実装の共通ルールを扱う sysd-cross-cutting-policy とは分けた新しい型にする。ワイヤーフレームは文書として保守せず、uis とデザインのルールから agent に試作を作らせ、プロダクトのリポジトリに置く。nfr-usability は測れる目標を決める要求で、デザインのルールはそれを満たす設計の決まりにあたる。
- 略号・ID・置き場所（設計の文書の階層）は executor が既存の命名の標準と設計の型を読んで決め、理由を個票の対応結果に書く。

## 3. 完了条件

- デザインのルールの新しい種類の略号・ID・成果物の置き場所を、[[specdojo:id-and-file-naming-standard]] と既存の設計の型（sysd 系）を読んで決め、既存の略号と紛れないことを確かめ、理由を個票の対応結果に書いている。
- その種類の rulebook と sample を作っている。[[specdojo:rulebook-authoring-standard]] の章立てに従い、rulebook にサンプルの章を置かず、見出しに連番を付けている。
- rulebook に、次の範囲と分け方を書いている。
  - 扱うもの: 色・文字・余白・角丸などの基本の値（デザイントークン）、部品（ボタン・入力・表・ダイアログなど）の使い方、レイアウトの型、状態（エラー・無効・読み込み中など）の見せ方、アクセシビリティの決まり。
  - 扱わないもの: 画面ごとの利用目的・項目・操作・遷移（uis が持つ）、画面ごとのワイヤーフレーム（文書として保守せず、uis とこの型から試作を作る）、実装の共通ルール（sysd-cross-cutting-policy が持つ）。
  - 使いやすさの測れる目標（nfr-usability）との関係（目標は nfr、それを満たす決まりはこの型）。
  - デザインツールや実装のトークンの正本がある場合は、その中身を繰り返さず参照する（PJR-2GD6 の方針）。
- sample は、駄菓子屋の販売管理システムの GUI のデザインのルールの完成例で、[[specdojo:clis-sample]] 程度の厚さにしている。
- recipe と template の要否を決め、frontmatter に書いている。
- ID の命名の標準・成果物のリファレンス・文書サイトの sidebar・レビューの観点の設定など、種類の一覧を持つ文書と設定に足している。保護された設定に当たるものは executor が変えず、変更案を個票の対応結果と報告の `handoff` に書いている。
- uis-rulebook の「扱わないもの」の記述から、この型を案内している。
- 2 回目の実行（2026-11-11 追加）: 1 回目の後の grade（run id `uis-dss-20261111`）で、dss-rulebook は pass 97、dss-sample は needs-work 94 だった。次を直し、grade で dss-rulebook と dss-sample がどちらも pass になっている（grade は orchestrator が流してよい）。
  - dss-rulebook に、[[specdojo:rulebook-authoring-standard]] の「運用ルール」の章を足す（ほかの型と同じ章立てにする）。
  - 記述ガイドに、章ごとの判断の基準と良い例・悪い例を足し、[[specdojo:clis-rulebook]] 程度の厚さにする。
  - dss-sample の grade の指摘を直す。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `specdojo index build`・`npm run lint:md`・`npm run lint:fm`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                               | 担当   | 状態 | メモ |
| --- | -------------------------------------------------- | ------ | ---- | ---- |
| 1   | 命名の標準と設計の型を読み、略号と置き場所を決める | _TODO_ | open | -    |
| 2   | rulebook と sample を作り、種類の一覧に足す        | _TODO_ | open | -    |
| 3   | 検査を流し、決めた点と理由を対応結果に書く         | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 由来: [[prj-0001:pjr-mxqb-gui-wireframe-design-rules]]
- 関係する型: [[specdojo:uis-rulebook]]、[[specdojo:nfr-usability-rulebook]]、[[specdojo:sysd-cross-cutting-policy-rulebook]]
