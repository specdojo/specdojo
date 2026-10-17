---
specdojo:
  id: prj-0001:xer-pjr-bhmh-20261017t231644z-abed
  type: exec-result
  task_id: PJR-BHMH
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-bhmh-20261017T231644Z-abed-plan.md
  started_at: "2026-10-17T23:16:44.642Z"
  completed_at: "2026-10-17T23:45:06.662Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- 指名 agent（`--executor-by` 指定）が rate limit に達した場合の挙動を、stop・wait・fallback から選べるようにした。CLI 引数と exec-defaults の既定の両方で設定でき、`--resume` にも対応する。
- wait は解除時刻まで待って同じ stage を同じ agent で再開し、fallback は指定した代替 agent へ切り替えて続行する。いずれも履歴（evidence / pipeline-state）に記録する。
- 設定、挙動、履歴の各スキーマ、CLI 実装、ドキュメント、テストを更新した。
- runner が実行した検証（`lint-ts`、`lint-fm`、`lint-md`、`typecheck`、`test-unit`、`test-integration`、`validate-schema`）はすべて passed。`lint-ts` は既存の `max-lines-per-function` 警告のみで、エラーは 0 件だった。
- executor が実行した Prettier、catalog 検証、`register build`、`git diff --check` も passed。

## 2. 変更ファイル

- `CHANGELOG.md`: 指名 agent の rate limit ポリシー（wait / fallback の選択）の追加を記録した。
- `docs/ja/specdojo/guides/exec-config-guide.md`: exec-defaults での指名 agent の上限時ポリシー設定方法を追記した。
- `docs/ja/specdojo/references/command-reference.md`: 上限時に待つか切り替えるかを選ぶ CLI 引数をコマンドリファレンスに追記した。
- `docs/specdojo/schemas/v1/exec-defaults.schema.yaml`: 指名 agent の上限時ポリシーの設定項目を exec-defaults スキーマに追加した。
- `docs/specdojo/schemas/v1/exec-evidence.schema.yaml`: 上限検知時の wait / fallback の履歴を記録するため、evidence スキーマを拡張した。
- `docs/specdojo/schemas/v1/pipeline-state.schema.yaml`: wait / fallback の状態を保持できるよう、pipeline-state スキーマを拡張した。
- `src/exec/agent-config.ts`: 指名 agent の上限時ポリシーを、CLI 引数と exec-defaults から解決する処理を追加した。
- `src/exec/evidence.ts`: 上限時ポリシーに関する履歴を evidence に記録する処理を追加した。
- `src/exec/limit.ts`: 指名 agent の上限判定と、待機時刻・代替 agent の決定ロジックを追加した。
- `src/exec/pipeline-state.ts`: wait / fallback の状態を pipeline-state に保持・復元できるようにした。
- `src/exec/results.ts`: 上限時の対応内容を result に反映できるようにした。
- `src/exec/run/agent-pipeline.ts`: pipeline の各 stage で、指名 agent の上限時に wait / fallback を実行するようにした。
- `src/exec/run/agent.ts`: agent 実行で、上限時ポリシーを受け取って適用するようにした。
- `src/exec/run/in-place.ts`: in-place 実行でも、指名 agent の上限時ポリシーを適用するようにした。
- `src/exec/run/lifecycle-commands.ts`: ライフサイクル系コマンドで、上限時ポリシーを引き回すようにした。
- `src/exec/run/register-command.ts`: `exec run --register` に上限時ポリシーの CLI 引数を追加した。
- `src/exec/run/register-core.ts`: register 実行の中核処理に、上限時ポリシーを反映した。
- `src/exec/run/register-resume.ts`: `--resume` 時に、保存済みの上限時ポリシーを引き継ぐようにした。
- `src/exec/run/register-worktree.ts`: worktree 実行でも、上限時ポリシーを引き継ぐようにした。
- `src/exec/run/schedule-mode.ts`: schedule モードに、上限時ポリシーの指定を反映した。
- `src/exec/run/schedule-prepare.ts`: schedule 準備処理で、上限時ポリシーを解決するようにした。
- `src/exec/run/schedule-task.ts`: schedule タスク実行に、上限時ポリシーを引き回すようにした。
- `src/exec/run/shared.ts`: run 系で共有する上限時ポリシーの型・補助処理を追加した。
- `templates/init-exec-defaults.yaml`: 初期 exec-defaults テンプレートに、上限時ポリシーの既定項目を追加した。
- `tests/src/exec/agent-config.test.ts`: 上限時ポリシーの設定解決に関するテストを追加・更新した。
- `tests/src/exec/limit.test.ts`: 上限判定と待機時刻・代替先決定に関するテストを追加・更新した。
- `tests/src/exec/run/pinned-rate-limit.test.ts`: 指名 agent の wait / fallback 動作を検証する新規テストを追加した。

## 3. 申し送り

- 統合後に、実 agent を使った `specdojo exec run --register` を1回完走させ、close 条件を確認する必要がある。executor 側の検証は `requires_human` のままである。
- executor evidence の対象に個票 `pjr-bhmh-pinned-agent-rate-limit-policy.md` が含まれる。ただしこの個票は `changes` に現れていないため、個票の更新内容は evidence から確認できない。
- catalog 検証には、既存の参照先未配置に関する警告が出ている。今回の変更に起因するかどうかは evidence から判断できない。
- `lint-ts` に `max-lines-per-function` の警告が28件ある。エラーは 0 件である。
- 人の確認が必要: `specdojo exec run --register &lt;post-integration-smoke-target&gt;`（統合後に orchestrator が実 agent を使う register 実行を1回完走させ、close 条件を確認する。）

## 4. 進め方と実践の型の適用

executor が、指名 agent の rate limit 時ポリシー（stop・wait・fallback）を CLI 引数と exec-defaults の両方から選べるように実装した。あわせて、resume 対応、履歴記録のスキーマ拡張、ドキュメント、テストも整備した。runner の検証（lint、typecheck、unit、integration、schema）がすべて通ったことを根拠に、成果物を完了と判断した。
