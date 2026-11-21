---
specdojo:
  id: prj-0001:xer-pjr-r8dm-20261121t154614z-e700a343
  type: exec-result
  task_id: PJR-R8DM
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-R8DM/pjr-r8dm-20261121T154614Z-e700a343/plan.md
  started_at: "2026-11-21T15:46:15.303Z"
  completed_at: "2026-11-21T15:52:04.236Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- exec run --task が、ready にないタスクについて未完了の先行タスクIDや done/cancelled を示して止まるよう修正。track は schedule 定義から引く。単体テスト追加、個票更新済み。

## 2. 変更ファイル

- `src/exec/run/schedule-mode.ts`: 変更、+50 / -11 行
- `tests/src/exec/run/explain-unrunnable-task.test.ts`: 追加、+72 / -0 行

## 3. 申し送り

- 個票の対応結果 5.1 に CHANGELOG の区分（不具合修正）と文案を記載済み。CHANGELOG.md は未変更。
- 依存の判定は直接の依存のみで、cancelled の依存は完了扱いにしている。
- 実機の exec run --task --dry-run による再現確認は未実施（単体テストのみ）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
