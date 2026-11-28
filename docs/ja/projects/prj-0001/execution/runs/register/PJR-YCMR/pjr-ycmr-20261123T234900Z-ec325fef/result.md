---
specdojo:
  id: prj-0001:xer-pjr-ycmr-20261123t234900z-ec325fef
  type: exec-result
  task_id: PJR-YCMR
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-YCMR/pjr-ycmr-20261123T234900Z-ec325fef/plan.md
  started_at: "2026-11-23T23:49:01.762Z"
  completed_at: "2026-11-23T23:54:47.482Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- parseQueueStepSpec が先頭の specdojo を受け付けるようにし、単体テストと個票の対応結果（CHANGELOG 文案を含む）を追加した。

## 2. 変更ファイル

- `src/exec/queue.ts`: 変更、+3 / -1 行
- `tests/src/exec/queue.test.ts`: 変更、+8 / -0 行

## 3. 申し送り

- 両方の書き方を受け付ける方にした（表示側は変更していない）。
- 親 runner の test-integration を含む検証結果の確認が必要。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
