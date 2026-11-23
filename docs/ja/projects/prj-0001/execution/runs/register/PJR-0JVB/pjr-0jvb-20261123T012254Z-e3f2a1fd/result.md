---
specdojo:
  id: prj-0001:xer-pjr-0jvb-20261123t012254z-e3f2a1fd
  type: exec-result
  task_id: PJR-0JVB
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-0JVB/pjr-0jvb-20261123T012254Z-e3f2a1fd/plan.md
  started_at: "2026-11-23T01:22:55.125Z"
  completed_at: "2026-11-23T01:27:49.216Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- 飛ばした人のタスクを ready の数から除き、人のタスクだけが残ったときは待ちの数を出して終了コード 0 で終えるようにした。準備の失敗があるときは従来どおり失敗にする。単体テストを追加し、個票の対応結果と CHANGELOG 案を更新した。

## 2. 変更ファイル

- `src/exec/run/schedule-mode.ts`: 変更、+24 / -12 行
- `tests/src/exec/run/human-task-skip.test.ts`: 追加、+148 / -0 行

## 3. 申し送り

- 判断: 人のタスクだけが残ったとき、dry-run と通常実行のどちらも「no executable tasks — N task(s) waiting for human completion — exit」を出して終了コード 0 にした。理由は個票の完了条件の 2 つ目に従うため。
- 判断: 飛ばしたタスクは `attempted` に入れず、loop の各 round で再判定して `humanWaiting` に数える。
- 統合後に orchestrator が `exec smoke` を流し、prj-0001 で `exec run --auto --dry-run --edit-by sol-executor` が終了コード 0 になることを確かめてから close する。
- CHANGELOG に書く事項（区分: Fixed）: `exec cycle` と `exec run --auto` が `--edit-by` / `--review-by` 指定時に `execution: human` のタスクを拾って失敗する問題を修正した。人のタスクだけが残ったときは、待ちの数を表示して終了コード 0 で終える。
- eslint は `schedule-mode.ts` の `runBatchMode` が 200 行超という警告を 1 件出す。エラーではなく、今回の変更で行数は増えたため、分割は別項目で扱うのがよい。
- 人の確認が必要: `exec smoke`（orchestrator が統合後に流す。executor の sandbox では実行しない）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
