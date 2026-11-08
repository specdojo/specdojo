---
specdojo:
  id: prj-0001:pjr-6mcw-catalog-uis-ifx-overview-align
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: easy
  registered_at: "2026-11-08T04:01:37Z"
  block_reason: "parent validation failed: test-unit"
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

| No  | 作業                                | 担当 | 状態 | メモ                                                                                                                     |
| --- | ----------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------------------------------ |
| 1   | 確定した型と 2 件の項目を読み比べる | DEV  | done | [[specdojo:ifx-cmd-rulebook]] と既存カタログの記述を照合                                                                 |
| 2   | overview と done_criteria を直す    | DEV  | done | `dct-external-interface-specs.yaml` の `ifx-cmd-ai-provider-cli` を更新。uis は PJR-RMMM / PJR-8J47 の方針どおり据え置き |
| 3   | 検査を流し、対応結果に書く          | DEV  | done | `specdojo catalog validate --project prj-0001` の正常終了を確認                                                          |

## 5. 対応結果

### 5.1. 実施内容

- `dct-external-interface-specs.yaml` の `ifx-cmd-ai-provider-cli` について、確定した型（[[specdojo:ifx-cmd-rulebook]]）に合わせて `overview` と `done_criteria` を更新した。
  - `overview`: 引数に関する記述を外し、正本の参照と入出力の約束（渡すもの・受け取るもの・終了コードの意味・作るファイル・副作用・失敗の扱い）および認証注入を定義する記述へ改めた。
  - `done_criteria`: ARC の項目から「引数契約」を外して「正本参照・入出力の約束・認証注入」へ改め、BA の項目も「入出力の約束」に表現を合わせた。
- `dct-user-interface-model.yaml` の `uis-exec-commands` は、PJR-RMMM の決定で clis に付け替える（PJR-8J47）方針に従い、完了条件の指示どおり本タスクでは変更していない。
- ほかのカタログおよび項目は変更していない。

### 5.2. 検証結果

- `specdojo catalog validate --project prj-0001`（`npm run validate:catalog`）を実行し、exit code 0 で正常終了することを確認した。
- `npm run validate:schema` は親 runner の allowlisted validations に含まれているため、本 executor 終了後に親 runner により検証される。

### 5.3. CHANGELOG に書く事項

なし（prj-0001 内部の成果物カタログの定義記述の整合性修正であり、SpecDojo 利用者への影響はないため）。

### 5.4. 残課題・申し送り

なし。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 由来: [[prj-0001:pjr-v6rb-catalog-add-sf-uis-ifx-reps]]
