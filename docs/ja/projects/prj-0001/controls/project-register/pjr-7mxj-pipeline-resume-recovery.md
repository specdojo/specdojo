---
specdojo:
  id: prj-0001:pjr-7mxj-pipeline-resume-recovery
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-08-10T06:28:45Z"
  due_on: "2026-08-31"
---

# PJR-7MXJ パイプラインの再実行と復旧制御を実装する

## 1. 概要

pipeline-stateを永続化し、reporter失敗時はexecutorを再実行せずreporterから再開できるようにする。ステージ別agent指定CLIも追加する。

## 2. 完了条件

- run 単位の `pipeline-state.json` に各ステージの状態、成果物参照、試行回数を永続化できる。
- reporter 失敗時の block event に `pipeline_stage=reporter` を記録し、resume で reporter から再開できる。
- executor 完了後の evidence が有効なら、復旧時に executor を重複実行しない。
- CLI から executor と reporter を個別指定でき、未指定時は要件と優先度から自動選択できる。
- claim、統合、complete が従来どおりタスク単位で一度だけ成立する。

## 3. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ                       |
| --- | ------------------------------------------- | ---- | ---- | -------------------------- |
| 1   | pipeline state machine と保存形式を実装する | ARC  | open | ステージ境界で更新する     |
| 2   | block event に失敗ステージ情報を追加する    | ARC  | open | 原因と再開位置を保持する   |
| 3   | ステージ単位の resume を実装する            | ARC  | open | 有効な成果物を再利用する   |
| 4   | ステージ別 agent 指定 CLI を追加する        | ARC  | open | 自動選択も維持する         |
| 5   | claim、統合、complete の冪等性を検証する    | ARC  | open | Schedule task は分割しない |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-jxv7-executor-evidence-collection]]
- [[prj-0001:pjr-rg7c-reporter-result-generation]]
- [[specdojo:exec-operation-guide]]
- [[specdojo:exec-worktree-guide]]
