---
specdojo:
  id: prj-0001:xer-pjr-xsrf-20261124t001625z-441218ab
  type: exec-result
  task_id: PJR-XSRF
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-XSRF/pjr-xsrf-20261124T001625Z-441218ab/plan.md
  started_at: "2026-11-24T00:16:26.306Z"
  completed_at: "2026-11-24T00:22:41.814Z"
  agent: terra-executor
---

# Edit Result

## 1. 実施内容

- auto dry-run の plan 書き出し、refresh、ロック取得を防止し、作業ツリー不変の統合テストと個票を更新した。

## 2. 変更ファイル

- `src/exec/run/register-command.ts`: 変更、+9 / -6 行
- `src/exec/run/schedule-prepare.ts`: 変更、+23 / -11 行
- `src/exec/run/shared.ts`: 変更、+4 / -0 行
- `tests/src/exec/plan-markdownlint.integration.test.ts`: 変更、+25 / -9 行

## 3. 申し送り

- CHANGELOG に書く事項（不具合修正）: `exec run --auto --dry-run` が plan ファイルを残さず、予定パスを表示するようにした。
- ドライランは既存の `ready.json` を使用する。最新の対象を確認する場合は事前に `exec refresh` を実行する。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
