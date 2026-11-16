---
specdojo:
  id: prj-0001:xer-pjr-1gcd-20261115t143301z-d758d137
  type: exec-result
  task_id: PJR-1GCD
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-1GCD/pjr-1gcd-20261115T143301Z-d758d137/plan.md
  started_at: "2026-11-15T14:35:30.658Z"
  completed_at: "2026-11-15T22:17:41.577Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- condense の edit で executor の報告に `condense_records` がない、または形式が正しくない場合、reporter の起動前に executor の段の失敗として止めるようにした。evidence を `completion_status: incomplete` とし、`block_reason` に再開の操作（`--resume-from executor`、`--executor-by`）を残す。reporter の段で止まった既存の run を reporter だけで再開しても executor の段へ戻す。schedule の `--resume-from executor` は、executor の段で止まり evidence が `incomplete` の run も受け付けるよう広げた。回帰テストと文書・個票を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-config-guide.md`: 変更、+1 / -0 行
- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+1 / -1 行
- `src/exec/evidence.ts`: 変更、+53 / -0 行
- `src/exec/register-resume.ts`: 変更、+11 / -7 行
- `src/exec/run/agent-pipeline.ts`: 変更、+34 / -1 行
- `src/exec/run/in-place.ts`: 変更、+25 / -1 行
- `src/exec/run/lifecycle-commands.ts`: 変更、+5 / -2 行
- `src/exec/run/register-resume.ts`: 変更、+3 / -0 行
- `src/exec/run/register-worktree.ts`: 変更、+2 / -0 行
- `src/exec/run/schedule-task.ts`: 変更、+35 / -0 行
- `tests/src/exec/register-resume.test.ts`: 変更、+16 / -0 行
- `tests/src/exec/executor-report-contract.test.ts`: 追加、+135 / -0 行

## 3. 申し送り

- 検査は reporter の起動直前に置いた（schedule-task.ts、in-place.ts、agent-pipeline.ts の `runReporterStage`）。reporter だけの再開にも同じ検査が効くため。
- schedule の `--resume-from executor` の前提を、executor の段が `blocked` かつ evidence が `completion_status: incomplete` の run にも広げた（`lifecycle-commands.ts`、`selectScheduleExecutorResume`）。保護機構による block など、従来拒否していた状態は変えていない。
- ほかの approach への当てはめ: `executorReportContractFailure` に条件を足せば当てはめられる。現時点で executor の報告に追加の必須項目を持つのは `condense` だけのため、ほかは足していない。
- in-place 実行の block 理由の案内は schedule の `exec resume` を指す。in-place の run を executor の段から再開できるかは確かめていない。
- CHANGELOG に書く事項は個票の対応結果の「CHANGELOG に書く事項」の節に書いた（CHANGELOG.md は変えていない）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
