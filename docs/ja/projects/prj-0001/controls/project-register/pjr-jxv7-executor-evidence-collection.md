---
specdojo:
  id: prj-0001:pjr-jxv7-executor-evidence-collection
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-jfwq-executor-reporter-pipeline-schema]]
- [[prj-0001:pjr-nsxt-executor-reporter-agent-definitions]]
- [[specdojo:exec-operation-guide]]
- [[specdojo:plan-result-lifecycle-guide]]
