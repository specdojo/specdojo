---
specdojo:
  id: prj-0001:pjr-jxv7-executor-evidence-collection
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-10T06:28:43Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-10T22:42:18Z"
  conclusion: executor stageの選択・専用promptとevidence.json生成（差分統計・検証・ログ抜粋・秘匿化・上限）をrunnerに実装。exec-evidence.schema.yaml追加。対象48件成功、typecheck/lint/schema検証成功。
  register_events:
    - v: 1
      id: reg_78ef18ee74a0cb64fd90f5b6ff5cdf4d
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
          to: executorステージとevidence収集を実装する
        - field: description
          from: ""
          to: executorには成果物編集だけを担当させ、差分、変更ファイル、検証結果、ログ参照を構造化evidenceとして保存する。
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
      id: reg_e655291db87d9cb45febec0c874dfd4a
      ts: "2026-08-10T07:03:35Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-JXV7): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 73b04d494e4a086d535b36e0faf2df7cfe23371e
      previous_event_id: reg_78ef18ee74a0cb64fd90f5b6ff5cdf4d
    - v: 1
      id: reg_be923468df593cdd274f510827fe3bc3
      ts: "2026-08-10T07:22:09Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-JXV7): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: b9068819ffd0bd38bf47372d99a907ecfcfa0786
      previous_event_id: reg_e655291db87d9cb45febec0c874dfd4a
    - v: 1
      id: reg_b1f6f9f2c8491ab1021ac206786a0aa3
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
          to: executor stageの選択・専用promptとevidence.json生成（差分統計・検証・ログ抜粋・秘匿化・上限）をrunnerに実装。exec-evidence.schema.yaml追加。対象48件成功、typecheck/lint/schema検証成功。
      legacy_commit: 095189d5df7fcb58163a4c5c1f6e847a113a1db3
      previous_event_id: reg_be923468df593cdd274f510827fe3bc3
---

# PJR-JXV7 executorステージとevidence収集を実装する

## 1. 概要

executorには成果物編集だけを担当させ、差分、変更ファイル、検証結果、ログ参照を構造化evidenceとして保存する。

## 2. 完了条件

- pipeline 対象タスクでは、runner が executor ステージを選択・起動し、終了状態を記録できる。
- executor は plan に従って成果物を編集・検証し、result ファイルを直接編集しない。
- 変更ファイル、差分要約、検証コマンドと結果、最終メッセージ、ログ参照を `evidence.json` に保存できる。
- evidence に認証情報や無制限の生ログを含めず、reporter に必要な情報だけを引き渡せる。

## 3. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ                         |
| --- | ----------------------------------------------- | ---- | ---- | ---------------------------- |
| 1   | executor ステージの起動処理を実装する           | ARC  | open | pipeline 対象だけに適用する  |
| 2   | executor 用 plan から result 記述指示を分離する | ARC  | open | 成果物編集と検証に限定する   |
| 3   | evidence のスキーマと保存処理を実装する         | ARC  | open | run ID 単位で保持する        |
| 4   | evidence の秘匿・容量制御とテストを追加する     | ARC  | open | 生ログは参照と抜粋に限定する |

## 4. 対応結果

- strategy の `agent_pipeline` を Ready task まで伝播し、pipeline 対象では executor stage の `capabilities`、`proficiency`、`stage_role` だけで agent を選択・起動する経路を runner に追加した。明示指定 agent も `stage_role: executor` との一致を必須にした。
- executor へ渡す prompt に stage 固有の責務境界と機械可読な検証報告契約を追加し、plan 内の result 更新・状態遷移指示を reporter / runner の責務として明示的に分離した。
- `exec-evidence.schema.yaml` と保存処理を追加し、run ID 単位で変更ファイル、差分統計、検証コマンドと結果、最終メッセージ、executor 終了状態、ログ抜粋参照を `evidence.json` に記録できるようにした。
- evidence とログ抜粋に認証情報の秘匿化、件数・文字数・64 KiB の容量上限を適用した。executor の失敗・rate limit・後続 reporter 待ちの block event には `pipeline_stage` と `evidence_ref` を記録する。
- pipeline 未指定タスクの単一 agent 選択と既存 result 完了判定は維持し、pipeline metadata、executor prompt、選択境界、evidence の構造・秘匿・schema 適合を単体テストで固定した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-jfwq-executor-reporter-pipeline-schema]]
- [[prj-0001:pjr-nsxt-executor-reporter-agent-definitions]]
- [[specdojo:exec-operation-guide]]
- [[specdojo:plan-result-lifecycle-guide]]
