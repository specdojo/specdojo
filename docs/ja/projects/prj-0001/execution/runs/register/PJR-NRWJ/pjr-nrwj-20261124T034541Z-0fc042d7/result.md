---
specdojo:
  id: prj-0001:xer-pjr-nrwj-20261124t034541z-0fc042d7
  type: exec-result
  task_id: PJR-NRWJ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-NRWJ/pjr-nrwj-20261124T034541Z-0fc042d7/plan.md
  started_at: "2026-11-24T03:45:42.122Z"
  completed_at: "2026-11-24T03:52:14.908Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- register の run の checkpoint を、項目の targets の grade の結果だけに絞った（register-worktree と resume の経路）。テストを追加し、個票の対応結果を更新した。

## 2. 変更ファイル

- `src/exec/run/register-resume.ts`: 変更、+7 / -0 行
- `src/exec/run/register-state.ts`: 変更、+3 / -1 行
- `src/exec/run/register-worktree.ts`: 変更、+10 / -1 行
- `tests/src/exec/worktree-ops.integration.test.ts`: 変更、+21 / -0 行
- `src/exec/run/register-grade-scope.ts`: 追加、+35 / -0 行

## 3. 申し送り

- lifecycle-commands.ts は schedule のタスクの統合再開で register の項目を扱わないため変えていない。worktree-command.ts は項目を持たない汎用の操作のため従来どおり全件を扱う。理由は個票の対応結果に記載済み。
- CHANGELOG に書く事項は個票の対応結果に記載済み（区分は Fixed）。
- registerGradeResultPaths は targets を catalog の成果物へ解決する。catalog 外の対象（kata の sample など）は grade の結果を持たない扱いになり、その項目の checkpoint に grade の結果は入らない。catalog に載った対象を解決する経路は、追加したテストで確かめていない。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
