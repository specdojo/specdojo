---
specdojo:
  id: prj-0001:pjr-4n3r-ifx-cmd-kata-reference-to-implementation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T00:35:12Z"
  derived_from:
    - PJR-2GD6
  depends_on:
    - PJR-HMV6
  approach: rulebook-maintenance
  targets:
    - specdojo:ifx-cmd-rulebook
---

# PJR-4N3R 外部 I/F（コマンド）（ifx-cmd）の型を、実装と同じことを書かない形に手入れする

## 1. 概要

外部 I/F（コマンド）の型を手入れする。引数・オプションの表は持たずコマンドリファレンスを参照し、入出力の約束（終了コード・作るファイル・副作用）に絞る

## 2. 入力

- 方針（indie が決定、2026-11-08）: 引数・オプションの表は持たずコマンドリファレンスを参照し、入出力の約束（終了コード・作るファイル・副作用）に絞る。
- rulebook にあわせて ifx-cmd-recipe・ifx-cmd-sample・ifx-cmd-template も揃える。

## 3. 完了条件

- [[specdojo:ifx-cmd-rulebook]] に、次の規則を書いている。
  - 引数・オプションの表は持たず、正本を参照する。SpecDojo 自身のコマンドならコマンドリファレンス、SpecDojo が起動する外部の CLI（AI provider CLI など）なら、その起動を定める設定（`exec-defaults.yaml` の `command_template`）と [[specdojo:exec-config-guide]] を正本とする。
  - 文書には、入出力の約束（渡すもの・受け取るもの・終了コードの意味・作るファイル・副作用・失敗の扱い）を書く。
- `ifx-cmd-recipe`・`ifx-cmd-sample`・`ifx-cmd-template` を新しい規則に合わせている。
- 型の変更に合わせて schema（`docs/specdojo/schemas/v1/`）を変える必要があれば変えている。その場合も、今の形で書かれた既存の文書が引き続き検査を通る（後方互換）。schema を変えたかどうかと理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- 規則と sample の書き方で迷った点や、決めきれない点は `_UNDECIDED_` で残さず executor が決め、決めた内容と理由を個票の対応結果に書いている。型の確定（PJR-RZ9Q）で人が判断する材料にする。
- 成果物の文書（`docs/ja/product/` 配下）は作らず、ほかの種類の型も変えていない。ただし、この型を参照している別の型の記述（例: 関連する型の「〜との関係」の節）が食い違う場合は、その箇所だけを直している。
- CHANGELOG の未公開の版の節に型の変更を書き、公開済みの版の節を変えていない。
- `npm run lint:md`・`npm run validate:schema`・`npm run test:unit` が通っている。

## 4. 作業内容

| No  | 作業                                                                                                                             | 担当   | 状態 | メモ |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | ------ | ---- | ---- |
| 1   | 今の rulebook と `ifx-cmd-recipe`・`ifx-cmd-sample`・`ifx-cmd-template` を読み、実装・schema・リファレンスと重なる記述を洗い出す | _TODO_ | open | -    |
| 2   | rulebook に参照の規則を書き、`ifx-cmd-recipe`・`ifx-cmd-sample`・`ifx-cmd-template` を揃える                                     | _TODO_ | open | -    |
| 3   | 検査を流し、決めた点と理由を対応結果に書く                                                                                       | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 対象: [[specdojo:ifx-cmd-rulebook]]
- 後続: [[prj-0001:pjr-rz9q-business-specs-reps-kata-confirm]]
