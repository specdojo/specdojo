---
specdojo:
  id: prj-0001:xer-pjr-tahv-20261123t224707z-7c2ff764
  type: exec-result
  task_id: PJR-TAHV
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-TAHV/pjr-tahv-20261123T224707Z-7c2ff764/plan.md
  started_at: "2026-11-23T22:47:08.693Z"
  completed_at: "2026-11-23T22:53:37.979Z"
  agent: terra-executor
---

# Edit Result

## 1. 実施内容

- 変更範囲の予約待ちを再評価し、待機理由と件数を表示するよう修正。単体テストと運用ガイド、個票を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/schedule-operation-guide.md`: 変更、+2 / -0 行
- `src/exec/run/change-scope.ts`: 変更、+3 / -1 行
- `src/exec/run/schedule-mode.ts`: 変更、+23 / -2 行
- `tests/src/exec/run/human-task-skip.test.ts`: 変更、+21 / -0 行

## 3. 申し送り

- CHANGELOG の不具合修正文案: `exec run --auto --loop` で変更範囲の待ちが解除されたタスクを次の回に再選択し、待ちの理由と件数を表示する。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
