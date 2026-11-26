---
specdojo:
  id: prj-0001:xer-pjr-csrm-20261126t154932z-dcdbfdba
  type: exec-result
  task_id: PJR-CSRM
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-CSRM/pjr-csrm-20261126T154932Z-dcdbfdba/plan.md
  started_at: "2026-11-26T15:49:33.814Z"
  completed_at: "2026-11-26T16:24:48.069Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 前回失敗したテストの型注釈とコールバックの戻り値を修正。非同期化した関数の呼び出し元と累積34対象を確認し、個票を更新した。親検証の再実行はrunnerに委ねる。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-worktree-guide.md`: 変更、+4 / -0 行
- `src/exec/commands.ts`: 変更、+6 / -2 行
- `src/exec/core.ts`: 変更、+3 / -3 行
- `src/exec/events.ts`: 変更、+29 / -2 行
- `src/exec/register-foreign-wait.ts`: 変更、+12 / -5 行
- `src/exec/repo-integration.ts`: 変更、+16 / -10 行
- `src/exec/run/agent.ts`: 変更、+2 / -2 行
- `src/exec/run/job.ts`: 変更、+2 / -2 行
- `src/exec/run/lifecycle-commands.ts`: 変更、+2 / -2 行
- `src/exec/run/register-post-review.ts`: 変更、+2 / -2 行
- `src/exec/run/register-resume.ts`: 変更、+3 / -3 行
- `src/exec/run/register-worktree.ts`: 変更、+1 / -1 行
- `src/exec/run/schedule-prepare.ts`: 変更、+6 / -6 行
- `src/exec/task-repos.ts`: 変更、+13 / -10 行
- `src/exec/trial-commands.ts`: 変更、+1 / -1 行
- `src/exec/worktree-command.ts`: 変更、+7 / -7 行
- `src/exec/worktree-ops-lifecycle.ts`: 変更、+32 / -27 行
- `src/exec/worktree-ops-merge.ts`: 変更、+25 / -17 行
- `src/exec/worktree-yaml-pages.ts`: 変更、+27 / -16 行
- `src/exec/worktree.ts`: 変更、+39 / -29 行
- `tests/src/commands/build.integration.test.ts`: 変更、+2 / -2 行
- `tests/src/exec/repo-integration.test.ts`: 変更、+49 / -1 行
- `tests/src/exec/task-repos.integration.test.ts`: 変更、+104 / -100 行
- `tests/src/exec/trailing-records.integration.test.ts`: 変更、+3 / -3 行
- `tests/src/exec/worktree-ops.integration.test.ts`: 変更、+191 / -152 行
- `tests/src/exec/worktree-yaml-pages.integration.test.ts`: 変更、+4 / -4 行
- `tests/src/exec/worktree-yaml-pages.test.ts`: 変更、+8 / -8 行
- `tests/src/exec/worktree.integration.test.ts`: 変更、+43 / -39 行
- `tests/src/exec/worktree.test.ts`: 変更、+8 / -4 行
- `src/exec/worktree-process.ts`: 追加、+87 / -0 行
- `tests/src/exec/scheduler-lock-async.test.ts`: 追加、+65 / -0 行
- `tests/src/exec/worktree-async.test.ts`: 追加、+84 / -0 行
- `tests/src/exec/worktree-process.integration.test.ts`: 追加、+83 / -0 行

## 3. 申し送り

- 親runnerは修正後の型検査・lint・単体／統合テストを再実行する。前回の単体・統合テストは成功していたが、今回の成否は再実行結果を正とする。resultは編集していないため、reporter / runnerが本報告を反映する。
- 統合後、オーケストレーターが `--parallel 3` で数件実行し、`detection_lag_ms` の平均5秒以下・最大30秒以下、統合順序・失敗数を確認する。処理別所要時間の平均・最大も個票へ追記し、確認前にcloseしない。小規模再現計測は実運用の目標達成の証拠ではない。
- 判断: 準備・mergeの同期版と非同期版の重複を避け、呼び出し元までPromiseへ変更した。scheduler lockは待ち方だけを非同期化し、場所・timeout・stale条件・保持範囲を維持した。保護された設定の変更案はない。
- 人の確認が必要: `npx specdojo exec run --project prj-0001 --auto --parallel 3`（統合後にオーケストレーターが実施する。実agentの起動と使用量消費を伴うためexecutorでは実行しない。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
