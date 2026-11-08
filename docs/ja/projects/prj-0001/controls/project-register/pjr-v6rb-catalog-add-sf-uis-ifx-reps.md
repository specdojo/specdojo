---
specdojo:
  id: prj-0001:pjr-v6rb-catalog-add-sf-uis-ifx-reps
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T00:31:26Z"
  derived_from:
    - PJR-2GD6
---

# PJR-V6RB カタログに sf・uis・ifx の代表を 1 件ずつ足す

## 1. 概要

システム化機能・画面・外部 I/F のカタログには索引しかないため、代表として作る個別の文書を 1 件ずつ足す

## 2. 入力

- 候補（indie が推奨どおりと決定）: sf はタスクの実行の機能、uis は exec コマンド群、ifx は AI provider CLI の起動（ifx-cmd）。

## 3. 完了条件

- 次の 3 つのカタログに、代表として作る個別の文書を 1 件ずつ足している。成果物の文書そのものは作らない。
  - `dct-system-functions.yaml`: タスクの実行の機能（`sf-<term>`、rulebook は `specdojo:sf-rulebook`）
  - `dct-user-interface-model.yaml`: `exec` コマンド群の画面仕様（`uis-<term>`、rulebook は `specdojo:uis-rulebook`）
  - `dct-external-interface-specs.yaml`: AI provider CLI の起動（`ifx-cmd-<term>`、rulebook は `specdojo:ifx-cmd-rulebook`）
- 各項目は、同じカタログの既存の項目と [[specdojo:dct-rulebook]] に揃えて `local_id`・`name`・`kind: work`・`overview`・`path`・`rulebook`・`evidence_refs`（実装のパスと目的）・`done_criteria`（roles と viewpoint）・`depends_on` を持つ。`local_id` の `<term>` は [[specdojo:id-and-file-naming-standard]] に従って executor が決め、理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `evidence_refs` は実在する実装のパスを指している。sf と uis は `src/exec/` のタスクの実行の実装、ifx は AI provider CLI の起動を組み立てる実装を指す。
- `sf-index` の `note`（個別の sf は作らないという記述）を、代表を 1 件作ることになった経緯に合わせて直している。`uis-index`・`ifx-index` に同様の記述があれば同じく直している。
- 3 つのカタログ以外のファイル、`src/`・`tests/`、ほかのカタログの項目を変えていない。
- `specdojo catalog validate --project prj-0001`・`npm run validate:schema`・`npm run lint:md` が通っている。

## 4. 作業内容

| No  | 作業                                                                 | 担当   | 状態 | メモ |
| --- | -------------------------------------------------------------------- | ------ | ---- | ---- |
| 1   | 既存の項目と rulebook を読み、3 件の `local_id` と根拠の実装を決める | _TODO_ | open | -    |
| 2   | 3 つのカタログに項目を足し、索引の `note` を直す                     | _TODO_ | open | -    |
| 3   | 検査を流し、決めた名前と理由を対応結果に書く                         | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 規範: [[specdojo:dct-rulebook]]、[[specdojo:id-and-file-naming-standard]]
