---
specdojo:
  id: prj-0001:xer-pjr-bz9j-20261017t082307z-faa9
  type: exec-result
  task_id: PJR-BZ9J
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-bz9j-20261017T082307Z-faa9-plan.md
  started_at: "2026-10-17T08:23:07.882Z"
  completed_at: "2026-10-17T08:42:06.063Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- `src/exec` の `run-` ソース18件を `src/exec/run/` へ、`schedule-` ソース11件を `src/exec/schedule/` へ codemod で移動した。ファイル名の `run-` と `schedule-` の接頭辞は外した。例外として `run.ts` は `run/run.ts`、`schedule.ts` は `schedule/schedule.ts` になった。
- 対応するテスト17件も `tests/src/exec/run/` と `tests/src/exec/schedule/` へ移し、同様に接頭辞を外した。
- 移動したファイルを参照する import は、`src/commands`、`src/dashboard`、`src/exec`、`src/grade`、`src/register`、`src/routine` と関連テストで更新した。
- `docs/ja/product/040-system-design/sysd-antigravity-agent-settings.md` も変更されている。evidence にはパス参照の更新と読めるが、変更内容そのものは示されていない。
- executor の検証は次のとおり成功した。`npm run build`、dist freshness 確認、移動前後の CLI help 全123件の完全一致、新旧 dist 出力パスの検査、`register build`、`catalog validate`、`git diff --check`。
- runner の検証も成功した。`lint-ts`（警告のみ、エラー0）、`lint-fm`、`lint-md`、`typecheck`、`test-unit`、`test-integration`、`validate-schema`。
- run と schedule 以外のファイルは `src/exec` に残した。PJR-V23P の決定の4（移した後の実態を見て決める）に沿って、追加の分割は行っていない。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-antigravity-agent-settings.md`: 移動に伴うパス参照の更新と推測される。evidence には変更内容の記載がない。
- `src/commands/agent.ts`: 移動後のパスを参照するよう import を更新した。
- `src/dashboard/dashboard-timeline.ts`: 移動後のパスを参照するよう import を更新した。
- `src/exec/commands.ts`: 移動後のパスを参照するよう import を更新した。
- `src/exec/core.ts`: 移動後のパスを参照するよう import を更新した。
- `src/exec/plans-core.ts`: 移動後のパスを参照するよう import を更新した。
- `src/exec/run-agent-pipeline.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run-agent.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run-in-place.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run-job.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run-lifecycle-commands.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run-lock.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run-mode-shared.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run-register-command.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run-register-core.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run-register-mode.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run-register-resume.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run-register-state.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run-register-worktree.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run-schedule-mode.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run-schedule-prepare.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run-schedule-task.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run-shared.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule-calendar.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule-cpm.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule-gantt-chart-render.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule-gantt-chart-scope.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule-gantt-chart.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule-hash.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule-index.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule-initial.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule-progress.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule-ready.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/task-view.ts`: 移動後のパスを参照するよう import を更新した。
- `src/exec/trial-commands.ts`: 移動後のパスを参照するよう import を更新した。
- `src/exec/worktree-command.ts`: 移動後のパスを参照するよう import を更新した。
- `src/grade/target-discovery.ts`: 移動後のパスを参照するよう import を更新した。
- `src/register/register.ts`: 移動後のパスを参照するよう import を更新した。
- `src/routine/routine.ts`: 移動後のパスを参照するよう import を更新した。
- `tests/src/dashboard/dashboard.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/cycle.integration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/exec.test.ts`: 移動後のパスを参照するよう更新した。
- `tests/src/exec/register-multiple-ids.integration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/register-resume.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/register-worktree.integration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/register.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/run-downgrade-unfilled.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/run-inplace.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/run-lock-command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/run-lock.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/run-parent-validation-gate.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/run-resolve-claiming-actor.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/run-resolve-command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/run-worker-pool.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/run.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/schedule-calendar.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/schedule-cpm.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/schedule-gantt-chart-render.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/schedule-gantt-chart-scope.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/schedule-hash.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/schedule-progress.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/schedule-ready.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/schedule-validation.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/register/commit.integration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/schedule/build.test.ts`: 移動後のパスを参照するよう更新した。
- `tests/src/shared/dist-freshness.test.ts`: dist の出力パス変更に合わせて更新した。
- `src/exec/run/agent-pipeline.ts`: `run-agent-pipeline.ts` を移動した。
- `src/exec/run/agent.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run/in-place.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run/job.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run/lifecycle-commands.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run/lock.ts`: `run-lock.ts` を移動した。
- `src/exec/run/mode-shared.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run/register-command.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run/register-core.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run/register-mode.ts`: `run-register-mode.ts` を移動した。
- `src/exec/run/register-resume.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run/register-state.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run/register-worktree.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run/run.ts`: `src/exec/run.ts` を移動した。
- `src/exec/run/schedule-mode.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run/schedule-prepare.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run/schedule-task.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/run/shared.ts`: `run-shared.ts` を移動した。
- `src/exec/schedule/calendar.ts`: `schedule-calendar.ts` を移動した。
- `src/exec/schedule/cpm.ts`: `schedule-cpm.ts` を移動した。
- `src/exec/schedule/gantt-chart-render.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule/gantt-chart-scope.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule/gantt-chart.ts`: `schedule-gantt-chart.ts` を移動した。
- `src/exec/schedule/hash.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule/index.ts`: `schedule-index.ts` を移動した。
- `src/exec/schedule/initial.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule/progress.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule/ready.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec/schedule/schedule.ts`: `src/exec/schedule.ts` を移動した。
- `tests/src/exec/run/downgrade-unfilled.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/run/inplace.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/run/lock-command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/run/lock.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/run/parent-validation-gate.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/run/resolve-claiming-actor.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/run/resolve-command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/run/run.test.ts`: `tests/src/exec/run.test.ts` を `run/` 配下へ移動した。
- `tests/src/exec/run/worker-pool.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/schedule/calendar.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/schedule/cpm.test.ts`: `schedule-cpm.test.ts` を `schedule/` 配下へ移動した。
- `tests/src/exec/schedule/gantt-chart-render.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/schedule/gantt-chart-scope.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/schedule/hash.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/schedule/progress.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/schedule/ready.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec/schedule/validation.test.ts`: reporter の説明がないため、変更差分を参照。
- `tmp/exec-run-schedule-mapping.json`: 移動前後のパス対応表。作業用ファイルで、`tmp/` 配下のため commit 対象外。
- `tmp/pjr-bz9j-help-after.json`: 移動後の CLI help 出力。比較用の作業ファイル。
- `tmp/pjr-bz9j-help-before.json`: 移動前の CLI help 出力。比較用の作業ファイル。

## 3. 申し送り

- `node dist/specdojo.js exec run --register &lt;PJR-ID&gt; --worktree` が `requires_human` のまま残っている。本変更の統合後に orchestrator が register 実行を1回流し、統合完了まで確認するのが close 条件である。
- `lint-ts` に `max-lines-per-function` の警告が25件ある（エラー0）。evidence に見える範囲では、本タスクで変更していないファイルの警告もある。
- `tmp/` 配下の作業ファイル3件は残っている。commit 対象外だが、不要なら削除する。
- 登録簿と個票の状態は変更していない。個票は runner が管理している。
- 人の確認が必要: `node dist/specdojo.js exec run --register &lt;PJR-ID&gt; --worktree`（本変更の統合後、orchestratorがregister実行を1回流して統合完了まで確認するclose条件）

## 4. 進め方と実践の型の適用

codemod で `run-` 18件と `schedule-` 11件のソース、および対応テストを新しいサブディレクトリへ移し、接頭辞を外した。import は参照元をすべて更新した。振る舞いが変わっていないことは、CLI help 全123件の移動前後での完全一致と、dist 出力パスの新旧検査で確認した。ビルド、型検査、lint、unit/integration テスト、スキーマ検証もすべて成功した。
