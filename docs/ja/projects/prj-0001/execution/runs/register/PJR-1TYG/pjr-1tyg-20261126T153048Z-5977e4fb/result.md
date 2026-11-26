---
specdojo:
  id: prj-0001:xer-pjr-1tyg-20261126t153048z-5977e4fb
  type: exec-result
  task_id: PJR-1TYG
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-1TYG/pjr-1tyg-20261126T153048Z-5977e4fb/plan.md
  started_at: "2026-11-26T15:30:49.142Z"
  completed_at: "2026-11-26T15:38:48.897Z"
  agent: terra-executor
---

# Edit Result

## 1. 実施内容

- 停止要求の終了コードを先行する失敗より優先し、列の停止・再開を修正した。個票とコマンドリファレンスを更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/references/command-reference.md`: 変更、+1 / -1 行
- `src/exec/run/lifecycle-commands.ts`: 変更、+1 / -1 行
- `src/exec/run/schedule-mode.ts`: 変更、+2 / -5 行
- `tests/src/exec/run/track-filter.test.ts`: 変更、+74 / -0 行

## 3. 申し送り

- 終了コードは停止と失敗を同時に表せないため、列の再開を可能にする停止を優先した。失敗の詳細は各タスクの記録で確認する。
- 統合後、オーケストレーターが実際の run で動作を確認してから close する。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
