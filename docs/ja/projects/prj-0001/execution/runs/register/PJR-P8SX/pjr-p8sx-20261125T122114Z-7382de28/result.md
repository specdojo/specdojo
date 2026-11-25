---
specdojo:
  id: prj-0001:xer-pjr-p8sx-20261125t122114z-7382de28
  type: exec-result
  task_id: PJR-P8SX
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-P8SX/pjr-p8sx-20261125T122114Z-7382de28/plan.md
  started_at: "2026-11-25T12:21:15.622Z"
  completed_at: "2026-11-25T12:44:22.596Z"
  agent: opus-executor
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- `exec run --parallel` の統合段で、hook が走る commit が runner の event loop を止めていた。これを非同期の起動に改め、別タスクの親の検証が終わっても枠を長く手放せない問題に対処した。
- `gitResultAsync`、`commitWorktreeChangesAsync`、`stabilizeCommitTargetsAsync`、`commitRegisterStateAsync` を追加し、`integrateTaskRepositories` を非同期化した。同じ process 内の統合を 1 件ずつに保つ `withTaskIntegrationLock` も追加した。
- 親の検証ごとに、枠を持った時間を子の時間と runner が気づくまでの遅れに分けて記録する計測（`validation-exit-timing`）は残し、別ファイルへ移した。
- 個票の対応結果と CHANGELOG の文案を更新した。
- executor の検証では、型検査、eslint、prettier、対象の単体テストと統合テストが通った。runner の検証では `npm run test:integration` が失敗した。失敗は `tests/src/exec/parent-validation-timeout.integration.test.ts` の 162 行目で、メトリクスの行が空配列を期待しているのに実際には行が出ている。この失敗は未解消である。他の runner 検証（`lint-ts`、`typecheck`、`test-unit` など）は通った。

## 2. 変更ファイル

- `src/exec/parent-validation-output.ts`: 親の検証の出力まわりを変更した。計測の分離と非同期化に合わせた修正と見られる。
- `src/exec/parent-validation.ts`: 親の検証の本体を変更した。計測部分を `validation-exit-timing.ts` へ分け、ファイルの行数を減らした。
- `src/exec/repo-integration.ts`: `integrateTaskRepositories` を非同期にした。同じ process の統合を 1 件ずつに保つ `withTaskIntegrationLock` を追加した。
- `src/exec/run/register-state.ts`: register の遷移の commit を非同期版（`commitRegisterStateAsync`）に切り替えた。
- `src/exec/run/register-worktree.ts`: 統合が非同期になったことに合わせて呼び出し側を変更した。
- `src/exec/run/schedule-task.ts`: 統合が非同期になったことに合わせて呼び出し側を変更した。
- `src/exec/worktree-ops-commit.ts`: hook が走る commit を非同期で起動する `commitWorktreeChangesAsync` と `stabilizeCommitTargetsAsync` を追加した。
- `src/exec/worktree-ops.ts`: 非同期の commit 関数を公開し、統合の処理から使えるようにした。
- `src/shared/git.ts`: event loop を止めずに git を実行する `gitResultAsync` を追加した。
- `tests/src/exec/parent-validation-output.integration.test.ts`: 検証の出力と計測の変更に合わせてテストを更新した。
- `tests/src/exec/parent-validation.test.ts`: 計測を別ファイルへ移したことに合わせてテストを更新した。
- `tests/src/exec/task-repos.integration.test.ts`: 統合の非同期化に合わせてテストを更新した。
- `tests/src/shared/git.test.ts`: `gitResultAsync` のテストを追加した。
- `src/exec/validation-exit-timing.ts`: 新規ファイル。親の検証ごとの枠の保持時間と、runner が検証の終了に気づくまでの遅れを計測して記録する処理を `parent-validation.ts` から移した。
- `tests/src/exec/repo-integration.test.ts`: 新規ファイル。統合の非同期化と、同じ process の統合を 1 件ずつに保つ排他のテストを追加した。

## 3. 申し送り

- `npm run test:integration` が `tests/src/exec/parent-validation-timeout.integration.test.ts:162` で失敗している。原因は executor の evidence からは確認できず、`validation-exit-timing` の記録が既存テストの期待（メトリクス行が空）と食い違っている可能性がある。close の前に、このテストの期待か実装を直す必要がある。
- close の前に、本変更を入れた runner で `exec run --auto --parallel 4` を流す。`parent-validation-metrics.jsonl` の `validation-exit-timing` で `detection_lag_ms` が小さいことを確かめる。検証の時間が直接流した場合（`validate:schema` は約 5〜23 秒）に近くなることも確かめる。
- 統合の commit の hook を待つ間に、同じ process の別タスクの同期の処理（`prepare execution` の commit、register の遷移など）が root を変えうる。root への merge は `mergeWorktreeIntoCurrent` が自分の検査をしてから行うため、壊れる経路は見当たらない。実際の並列実行で統合の失敗が増えないかもあわせて見る。
- `CHANGELOG.md` は変更していない。文案は個票の「CHANGELOG に書く事項」に書いた。
- `npm ci`・`specdojo build`・root への merge の commit などの同期の処理は、今回の計測で目立たないため同期のまま残した。再計測で遅れが残れば、別の項目で扱う。

## 4. 進め方

原因は、統合段の commit の hook を同期で待つ間に runner の event loop が止まり、別タスクの親の検証が終わったことに気づくのが遅れて枠が長く占有されることだった。hook を伴う commit と統合を非同期の起動に改めて event loop を止めないようにし、計測の記録を別ファイルへ分けた。
