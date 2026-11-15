---
specdojo:
  id: prj-0001:xer-pjr-1gcd-20261115t143301z-d758d137
  type: exec-result
  task_id: PJR-1GCD
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-1GCD/pjr-1gcd-20261115T143301Z-d758d137/plan.md
  started_at: "2026-11-15T14:35:30.658Z"
  completed_at: "2026-11-15T15:06:54.692Z"
  agent: opus-executor
  block_reason: "parent validation failed: validate-schema"
---

# Edit Result

## 1. 実施内容

- `condense_records` が欠落している場合の executor の失敗判定および、それに基づいた再開フローの改善を行いました。
- reporter の起動直前に検査を実行するように `schedule-task.ts`、`in-place.ts`、`agent-pipeline.ts` を修正し、reporter だけの再開時にも一貫した検査が適用されるようにしました。
- schedule の `--resume-from executor` において、executor の段が `blocked` であり `completion_status: incomplete` である実行（evidence）も受け付けるよう `lifecycle-commands.ts` および `selectScheduleExecutorResume` を拡張しました。
- 回帰テストおよび関連する各種ガイド・ソースコード・テストコードの更新を実施しました。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-config-guide.md`: executor の設定に関するガイドを更新しました。
- `docs/ja/specdojo/guides/exec-operation-guide.md`: executor の運用に関するガイドを更新しました。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: plan から result へのライフサイクルに関するガイドを更新しました。
- `docs/ja/specdojo/references/command-reference.md`: コマンドリファレンスを更新しました。
- `src/exec/evidence.ts`: evidence の型定義および構造を変更しました。
- `src/exec/register-resume.ts`: 登録簿からの再開処理に関するロジックを更新しました。
- `src/exec/run/agent-pipeline.ts`: agent パイプライン内の reporter 起動シーケンス（検査の挿入）を修正しました。
- `src/exec/run/in-place.ts`: in-place 実行時の処理を修正しました。
- `src/exec/run/lifecycle-commands.ts`: ライフサイクルコマンドにおける再開条件の判定ロジックを拡張しました。
- `src/exec/run/register-resume.ts`: 登録簿再開に関する実装を更新しました。
- `src/exec/run/register-worktree.ts`: worktree 登録に関する実装を更新しました。
- `src/exec/run/schedule-task.ts`: schedule タスクの実行フロー（検査の挿入）を修正しました。
- `tests/src/exec/register-resume.test.ts`: register-resume に関するテストを更新しました。
- `tests/src/exec/executor-report-contract.test.ts`: 追加、+135 / -0 行

## 3. 申し送り

- 検査は reporter の起動直前に置いた（`schedule-task.ts`、`in-place.ts`、`agent-pipeline.ts` の `runReporterStage`）。reporter だけの再開にも同じ検査が効くため。
- schedule の `--resume-from executor` の前提を、executor の段が `blocked` かつ evidence が `completion_status: incomplete` の run にも広げた（`lifecycle-commands.ts`、`selectScheduleExecutorResume`）。保護機構による block など、従来拒否していた状態は変えていない。
- ほかの approach への当てはめ: `executorReportContractFailure` に条件を足せば当てはめられる。現時点で executor の報告に追加の必須項目を持つのは `condense` だけのため、ほかは足していない。
- in-place 実行の block 理由の案内は schedule の `exec resume` を指す。in-place の run を executor の段から再開できるかは確かめていない。
- CHANGELOG に書く事項は個票の対応結果の「CHANGELOG に書く事項」の節に書いた（CHANGELOG.md は変えていない）。
- 検査は reporter の起動直前に置いた（schedule-task.ts、in-place.ts、agent-pipeline.ts の `runReporterStage`）。reporter だけの再開にも同じ検査が効くため。

## 4. 進め方

executor が `condense_records` を出力しなかった場合に、reporter のエラーとしてではなく executor の失敗として扱い、後続の `schedule` などのコマンドから executor の段から再開できるようにする対応を行いました。具体的には、再開条件の緩和と、reporter 起動時のバリデーション注入を行いました。
