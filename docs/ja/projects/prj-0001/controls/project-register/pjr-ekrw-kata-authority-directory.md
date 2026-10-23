---
specdojo:
  id: prj-0001:pjr-ekrw-kata-authority-directory
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-23T13:47:59Z"
  block_reason: "agent exited with non-zero code: parent validation failed: lint-md, test-unit"
  derived_from:
    - PJR-8QT0
---

# PJR-EKRW 利用者の kata の置き場所を authority ごとのディレクトリに直す

## 1. 概要

0.4.3 では利用者の kata を docs/ja/kata の下に作るが、authority がディレクトリに出ず本体とも形が違う。PJR-8QT0 の決定に従い、docs/ja/specdojo の種類ごとのディレクトリの下の authority のサブディレクトリに置くよう直す

## 2. 完了条件

- v0.4.4 の範囲とする（2026-10-23、利用者が承認）。[[prj-0001:pjr-8qt0-variant-kata-packages]] の決定内容 5 に従う。
- `specdojo:` 以外の authority の kata の置き場所を、`docs/ja/kata/<種類>s/<local-id>.md` から `docs/ja/specdojo/<種類>s/<authority>/<local-id>.md` に変える。本体の kata（`specdojo:`）の置き場所 `docs/ja/specdojo/<種類>s/<local-id>.md` は変えない。
- `<種類>-authoring` の plan、kata の解決（`kata list`・`kata show`・plan の kata の参照）、id のインデックスが、新しい置き場所を使う。
- 互換のため、0.4.4 のあいだは古い `docs/ja/kata/` の kata も読み、見つけたときは新しい置き場所へ移すよう案内を出す。同じ id が新旧の両方にあれば、新しい置き場所を優先し、警告を出す。
- `docs/ja/specdojo/<種類>s/` の中をたどる既存の処理（本体の kata の一覧・grade・docs-site のステージング・kata の索引など）が、authority のサブディレクトリの kata を本体の kata として数えないことを確かめ、必要なら直す。どの処理を確かめたかを result に書く。
- [[specdojo:id-and-file-naming-standard]]・[[specdojo:practice-system-composition-guide]]・[[specdojo:kata-guide]] と、コマンドリファレンス・設定リファレンス・CHANGELOG の置き場所の記述を直す。
- 単体テストで、authority ごとの置き場所の解決、古い置き場所の読み込みと案内、新旧の重複の扱いを確かめる。統合テストで、一時のリポジトリで `kata_authority` を設定して rulebook を作ったとき、新しい置き場所に作られることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- exec の plan の生成を変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 3. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ   |
| --- | ----------------------------------------------- | ---- | ---- | ------ |
| 1   | 利用者の kata の置き場所を authority ごとに直す | DEV  | open | v0.4.4 |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-8qt0-variant-kata-packages]]
- PJR-CT6G（kata を新しく作る approach の実装）
