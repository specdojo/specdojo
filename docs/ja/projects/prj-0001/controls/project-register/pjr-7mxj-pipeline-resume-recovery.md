---
specdojo:
  id: prj-0001:pjr-7mxj-pipeline-resume-recovery
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-10T06:28:45Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-10T22:42:26Z"
  conclusion: run-scoped pipeline-state.jsonの永続化・検証、exec resumeでのreporterのみ再開（executor再実行抑止）、--executor-by/--reporter-byを実装。運用・設定ガイドへ復旧手順を反映。対象57件成功。
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
| 1   | pipeline state machine と保存形式を実装する | ARC  | done | ステージ境界で更新する     |
| 2   | block event に失敗ステージ情報を追加する    | ARC  | done | 原因と再開位置を保持する   |
| 3   | ステージ単位の resume を実装する            | ARC  | done | 有効な成果物を再利用する   |
| 4   | ステージ別 agent 指定 CLI を追加する        | ARC  | done | 自動選択も維持する         |
| 5   | claim、統合、complete の冪等性を検証する    | ARC  | done | Schedule task は分割しない |

## 4. 対応結果

- run 単位の `exec/evidence/<task>/<run>/pipeline-state.json` と JSON Schema を追加し、executor / reporter の状態、actor、試行回数、開始・終了時刻、evidence / result 参照を各ステージ境界で原子的に保存するようにした。
- pipeline の block event に `pipeline_stage`、`evidence_ref`、`pipeline_state_ref`、`pipeline_run_id` を記録し、失敗した stage と再開に必要な run-scoped artifact を保持するようにした。
- `exec resume --task` が明示された blocked reporter task を同じ task claim のまま再開し、pipeline state と succeeded executor evidence の task ID / run ID が一致する場合だけ executor を省略するようにした。不整合・欠損時は新しい executor run へ安全にフォールバックする。
- `exec run` / `exec resume` / `exec cycle` に `--executor-by` と `--reporter-by` を追加した。指定 member の `stage_role` を検証し、未指定 stage は従来どおり要件と優先度で自動選択する。
- pipeline state、evidence 再利用条件、stage 別 CLI、reporter 成否、block metadata を単体・in-place 統合テストで固定した。task の claim、worktree 統合、complete は既存の task 単位 lifecycle を維持し、reporter resume では新しい claim を作らない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-jxv7-executor-evidence-collection]]
- [[prj-0001:pjr-rg7c-reporter-result-generation]]
- [[specdojo:exec-operation-guide]]
- [[specdojo:exec-worktree-guide]]
