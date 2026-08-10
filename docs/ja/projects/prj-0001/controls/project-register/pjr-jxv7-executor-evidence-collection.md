---
specdojo:
  id: prj-0001:pjr-jxv7-executor-evidence-collection
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: ARC
  registered_at: "2026-08-10T06:28:43Z"
  due_on: "2026-08-31"
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
