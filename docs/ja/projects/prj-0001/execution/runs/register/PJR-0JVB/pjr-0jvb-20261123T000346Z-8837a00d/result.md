---
specdojo:
  id: prj-0001:xer-pjr-0jvb-20261123t000346z-8837a00d
  type: exec-result
  task_id: PJR-0JVB
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-0JVB/pjr-0jvb-20261123T000346Z-8837a00d/plan.md
  started_at: "2026-11-23T00:05:12.167Z"
  completed_at: "2026-11-23T00:10:12.881Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- mode 単位の --edit-by/--review-by では execution: human のタスクを自動選択せず skip するよう修正。schedule-mode.ts と schedule-prepare.ts を変更し、個票を更新した。

## 2. 変更ファイル

- `src/exec/run/schedule-mode.ts`: 変更、+10 / -0 行
- `src/exec/run/schedule-prepare.ts`: 変更、+17 / -0 行

## 3. 申し送り

- 専用の回帰テスト（--edit-by 指定時に human タスクが skip されること）は未追加。tests/src/exec/run/ への追加を推奨。
- skip 時は failure でなくログ出力のみ。cycle の集計表示の変更は行っていない。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
