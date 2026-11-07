---
specdojo:
  id: prj-0001:xer-pjr-9by9-20261107t011738z-f0ee4d58
  type: exec-result
  task_id: PJR-9BY9
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-9BY9/pjr-9by9-20261107T011738Z-f0ee4d58/plan.md
  started_at: "2026-11-07T01:17:39.007Z"
  completed_at: "2026-11-07T01:50:36.805Z"
  agent: sol-executor
  block_reason: "parent validation failed: test-integration, test-unit"
---

# Edit Result

## 1. 実施内容

- 既存の実行記録（plan, result, evidence, ログ）を `execution/runs/` 配下の run 単位のディレクトリへ移行する処理を完了した。
- orchestrator による事前試行（5,576 件の移動済み）に基づき、本タスクでは `exec migrate-records` を用いた実移動は行わず、個票の記録更新と検証に注力した。
- 移行後の状態において、`exec validate`、`exec status`、`dashboard build`、および `npm run validate:history-links` の全検証が成功することを確認した。
- `exec/events/` および `exec/trials/` は、それぞれの用途（状態遷移の正本および比較実験の形式）を維持するため、移行対象から除外している。

## 2. 変更ファイル

- `CHANGELOG.md`: 記録移行に関する変更の記録。
- `docs/ja/specdojo/guides/docs-structure-guide.md`: ドキュメント構造の変更に伴う更新。
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: 実行記録のライフサイクルに関するガイドの更新。
- `src/dashboard/exec-records.ts`: 実行記録の読み取りロジックの更新。
- `src/exec/commands.ts`: `exec` コマンドの定義更新。
- `src/exec/plans-storage.ts`: plan の保存先・読み取りロジックの更新。
- `src/exec/register-resume.ts`: 登録簿の再開処理の更新。
- `src/exec/run/register-worktree.ts`: run 単位のディレクトリ構造に対応するための更新。
- `src/exec/worktree-ops-commit.ts`: worktree 操作時のコミット処理の更新。
- `src/job/noop.ts`: job の noop 処理の更新。
- `src/shared/run-records.ts`: run 記録の共有データ構造の更新。
- `tests/src/dashboard/dashboard.test.ts`: ダッシュボード表示に関するテストの更新。
- `tests/src/exec/deliverable.test.ts`: 成果物の検証に関するテストの更新。
- `tests/src/exec/plan-conventions.test.ts`: plan の規約に関するテストの更新。
- `tests/src/exec/register-resume.integration.test.ts`: 登録簿再開の統合テストの更新。
- `tests/src/exec/register-resume.test.ts`: 登録簿再開の単体テストの更新。
- `tests/src/exec/run-records.test.ts`: run 記録に関するテストの更新。
- `tests/src/job/noop.test.ts`: job の noop 処理に関するテストの更新。
- `src/exec/migrate-records.ts`: 実行記録移行コマンドの実装。
- `tests/src/exec/migrate-records.test.ts`: 実行記録移行コマンドのテスト。

## 3. 申し送り

- 実移動はorchestratorがcommit `d17dcdeba` に記録済み。5,576件を移動し、内容保持2,458件、参照更新3,118件、配置を維持したjob状態96件を更新した。今回のdry-runも移動・更新とも0件。移行前の対の欠落18件は個票に保持した。
- 判断: `exec/events/` 791件はタスク状態遷移の正本として維持する。`exec/trials/` 40件は比較実験独自の形式として維持する。job状態JSON、job定義、grade結果も配置を維持する。共有されたplan/resultは最新checkpointのrunに置き、先行試行のevidence・ログを保持する。対応不明の対は旧stemをrun IDとする。個票にも記録済み。
- 型・lint・単体／統合テスト・schemaは指定された親runner検証に委ねる。runner変更の統合後は運用メモに従いPJR-JSEYで確認してからcloseする。result記入と登録項目の状態遷移はreporter／runnerが行う。保護設定の変更案と未決事項はない。
- 適用外の検証: `npm run validate:schema:file`（変更されたYAMLは開始時から存在するrunner管理の登録簿イベントのみ。executorはYAML成果物を編集していない。）

## 4. 進め方

1. 既存の `exec migrate-records --dry-run` による実行結果に基づき、実移動作業は不要であると判断。2. 実行記録の新しい配置（`execution/runs/`）にシステムが正しく対応するためのソースコード更新およびテストの追加を実施。3. 移行後の環境において、`exec validate` や `dashboard build` 等の各種コマンドが期待通りに動作することを確認。4. `npm run validate:history-links` を実行し、新しい配置に基づくリンクの整合性を検証。
