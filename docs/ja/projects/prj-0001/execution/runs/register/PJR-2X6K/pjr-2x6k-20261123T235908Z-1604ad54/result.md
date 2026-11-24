---
specdojo:
  id: prj-0001:xer-pjr-2x6k-20261123t235908z-1604ad54
  type: exec-result
  task_id: PJR-2X6K
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-2X6K/pjr-2x6k-20261123T235908Z-1604ad54/plan.md
  started_at: "2026-11-23T23:59:09.686Z"
  completed_at: "2026-11-24T00:05:20.367Z"
  agent: terra-executor
---

# Edit Result

## 1. 実施内容

- タスク未指定の一括再開に reporter・統合段の blocked タスクを追加し、選択テストと説明を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/references/command-reference.md`: 変更、+3 / -1 行
- `src/exec/run/lifecycle-commands.ts`: 変更、+30 / -16 行
- `tests/src/exec/run/resume.test.ts`: 変更、+27 / -0 行

## 3. 申し送り

- CHANGELOG の不具合修正文案: `exec resume` がタスク未指定でも reporter・統合段で停止したタスクを並列に再開するよう修正。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
