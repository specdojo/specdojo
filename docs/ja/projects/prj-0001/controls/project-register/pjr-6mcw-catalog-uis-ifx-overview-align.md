---
specdojo:
  id: prj-0001:pjr-6mcw-catalog-uis-ifx-overview-align
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  registered_at: "2026-11-08T04:01:37Z"
  derived_from:
    - PJR-2GD6
  depends_on:
    - PJR-RMMM
---

# PJR-6MCW カタログの uis・ifx の代表の説明を、確定した型に合わせる

## 1. 概要

カタログの uis-exec-commands と ifx-cmd-ai-provider-cli の overview と done_criteria が「引数・オプションを書く」としているため、確定した型（正本を参照し、要点や入出力の約束に絞る）に合わせる

## 2. 入力

- PJR-V6RB の確認で、2 件の overview に引数・オプションを書く記述があると分かった（2026-11-08）。直すことは indie が推奨どおりと決定。

## 3. 完了条件

- `dct-external-interface-specs.yaml` の `ifx-cmd-ai-provider-cli` の `overview` と `done_criteria` を、確定した型（[[specdojo:ifx-cmd-rulebook]]）に合わせている。引数・オプションを書くという記述を外し、正本の参照と入出力の約束（渡すもの・受け取るもの・終了コードの意味・作るファイル・副作用・失敗の扱い）を書く形にする。
- uis の項目は、PJR-RMMM の決定で clis に付け替える（PJR-8J47）ため、この項目では変えない（2026-11-08 に範囲を ifx だけに絞った）。
- ほかの項目とカタログを変えていない。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分（追加・変更・不具合修正など）と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `specdojo catalog validate --project prj-0001`・`npm run validate:schema` が通っている。

## 4. 作業内容

| No  | 作業                                | 担当   | 状態 | メモ |
| --- | ----------------------------------- | ------ | ---- | ---- |
| 1   | 確定した型と 2 件の項目を読み比べる | _TODO_ | open | -    |
| 2   | overview と done_criteria を直す    | _TODO_ | open | -    |
| 3   | 検査を流し、対応結果に書く          | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 由来: [[prj-0001:pjr-v6rb-catalog-add-sf-uis-ifx-reps]]
