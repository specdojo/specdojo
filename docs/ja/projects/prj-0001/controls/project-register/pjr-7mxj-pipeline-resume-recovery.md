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
  register_events:
    - v: 1
      id: reg_8f0714b0398372c459916d93de6a467c
      ts: "2026-08-10T06:36:41Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): add executor reporter pipeline todos"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: パイプラインの再実行と復旧制御を実装する
        - field: description
          from: ""
          to: pipeline-stateを永続化し、reporter失敗時はexecutorを再実行せずreporterから再開できるようにする。ステージ別agent指定CLIも追加する。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-10"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 05c3d3781552e051565e003506dd009eb1312db5
    - v: 1
      id: reg_5fde9a6b7c3c46ae2a37f174018cd3d2
      ts: "2026-08-10T07:44:40Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-7MXJ): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: c89d964f3a5a8c82fc75aba1f6d8737de02897ff
      previous_event_id: reg_8f0714b0398372c459916d93de6a467c
    - v: 1
      id: reg_96ca3b3a38ffc9125f3c33dc534680c1
      ts: "2026-08-10T08:01:30Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-7MXJ): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: 99444178dc22133965da43b18a3609bb9e7d0f10
      previous_event_id: reg_5fde9a6b7c3c46ae2a37f174018cd3d2
    - v: 1
      id: reg_b3f5e4911f849da9b5cdd555d5c35518
      ts: "2026-08-10T22:46:50Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "exec(register PJR-TC43): executor / reporterパイプラインのE2E検証と文書化"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-11"
        - field: conclusion
          from: "-"
          to: run-scoped pipeline-state.jsonの永続化・検証、exec resumeでのreporterのみ再開（executor再実行抑止）、--executor-by/--reporter-byを実装。運用・設定ガイドへ復旧手順を反映。対象57件成功。
      legacy_commit: 095189d5df7fcb58163a4c5c1f6e847a113a1db3
      previous_event_id: reg_96ca3b3a38ffc9125f3c33dc534680c1
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
