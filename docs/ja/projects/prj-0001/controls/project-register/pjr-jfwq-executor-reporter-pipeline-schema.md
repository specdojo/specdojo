---
specdojo:
  id: prj-0001:pjr-jfwq-executor-reporter-pipeline-schema
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-10T06:28:41Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-10T22:42:10Z"
  conclusion: sch-strategyのagent_pipeline.stagesとpm-membersのstage_roleをschema化し、既存strategy/rosterとの後方互換性を単体テストで固定。対象37件・全体993件成功（worktree系16件はsandbox制約、この実行環境では全1050件成功を確認済み）。
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

- `sch-strategy` の phase に任意の `agent_pipeline.stages` を追加し、`executor`、`reporter` の 2 stage と順序を schema で固定した。各 stage は任意の `capabilities` と `proficiency` を実行要件として持ち、member nickname は保持しない。
- `pm-members` に agent 専用の任意 `stage_role`（`executor` / `reporter`）を追加した。未指定 member は従来フロー専用、指定 member は一致する pipeline stage 専用として自動選択候補を分離した。
- pipeline を省略した既存 strategy と `stage_role` を省略した既存 roster が引き続き有効であり、従来の候補順が変わらないことを単体テストで固定した。
- pipeline の順序、human phase との併用禁止、member の値制約、stage 別候補選択を schema / 選択規則の単体テストへ追加した。

## 5. 関連ドキュメント

- [[specdojo:exec-config-guide]]
- [[specdojo:pm-members-rulebook]]
- [[specdojo:schedule-design-guide]]
