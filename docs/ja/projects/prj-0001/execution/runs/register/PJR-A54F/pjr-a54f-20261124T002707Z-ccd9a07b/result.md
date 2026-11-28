---
specdojo:
  id: prj-0001:xer-pjr-a54f-20261124t002707z-ccd9a07b
  type: exec-result
  task_id: PJR-A54F
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-A54F/pjr-a54f-20261124T002707Z-ccd9a07b/plan.md
  started_at: "2026-11-24T00:27:08.336Z"
  completed_at: "2026-11-24T00:32:24.802Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- checkpoint の grade results をタスク自身の対象に絞り、並べて流したタスクの sample 衝突の原因を除いた。テストと個票の対応結果を追加した。

## 2. 変更ファイル

- `src/exec/grade-checkpoint.ts`: 変更、+14 / -4 行
- `src/exec/run/schedule-prepare.ts`: 変更、+28 / -3 行
- `tests/src/exec/worktree-ops.integration.test.ts`: 変更、+14 / -0 行

## 3. 申し送り

- 引数を省いた gradeCheckpointPaths の呼び出し（worktree-command.ts、register-worktree.ts、lifecycle-commands.ts、register-state.ts）は全件取り込みのまま。register や job の経路で同じ衝突が出たら同じ絞り込みを渡す。
- 2 つのタスクが同じ sample の結果を変えたときの統合と再開の通しテストは追加していない。checkpoint の絞り込みだけをテストした。通しの確認は親の test-integration に任せる。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
