---
specdojo:
  id: prj-0001:pjr-jfwq-executor-reporter-pipeline-schema
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-08-10T06:28:41Z"
  due_on: "2026-08-31"
---

# PJR-JFWQ executor / reporterパイプラインのスキーマを設計する

## 1. 概要

sch-strategyのagent_pipelineとpm-membersのstage_roleを定義し、既存strategyおよび既存agent設定との後方互換性を維持する。

## 2. 完了条件

- `sch-strategy` の phase に、`executor`、`reporter` の順序と各ステージの実行要件を表す任意の `agent_pipeline` を定義できる。
- `pm-members` に任意の `stage_role` を定義でき、`executor`、`reporter`、従来エージェントを区別できる。
- `agent_pipeline` または `stage_role` を持たない既存ファイルの検証結果とエージェント選択が変わらない。
- スキーマ、選択規則、後方互換性を単体テストで確認できる。

## 3. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ                              |
| --- | ----------------------------------------------- | ---- | ---- | --------------------------------- |
| 1   | `agent_pipeline.stages` の構造と制約を設計する  | ARC  | open | phase 単位の任意設定とする        |
| 2   | `stage_role` の値と既存メンバーの扱いを設計する | ARC  | open | 未指定は従来フロー専用とする      |
| 3   | strategy と member のスキーマを拡張する         | ARC  | open | 既存 YAML を有効なまま保つ        |
| 4   | エージェント選択規則と互換性テストを追加する    | ARC  | open | nickname を strategy に固定しない |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:exec-config-guide]]
- [[specdojo:pm-members-rulebook]]
- [[specdojo:schedule-design-guide]]
