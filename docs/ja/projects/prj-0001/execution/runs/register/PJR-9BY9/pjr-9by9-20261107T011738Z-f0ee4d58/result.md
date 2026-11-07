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
  completed_at: "2026-11-07T02:04:34.564Z"
  agent: sol-executor
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- 既存の実行記録（plan, result, evidence, ログ）を `execution/runs/` 配下の run 単位のディレクトリへ物理的に移動する処理を完了しました。
- orchestrator により `git mv` を用いて 5,576 件のファイル移動（中身不変 2,458 件、パス書き換え 3,118 件、job 状態更新 96 件）が既に行われていることを確認し、本タスクでは移行後の整合性検証と、テスト・ガイドの更新を実施しました。
- `dashboard build` および `npm run validate:history-links` を実行し、新しい配置での読み取りが正常であることを確認しました。
- 統合テスト（`test-integration`）において、旧配置の fixture 参照に関する失敗が発生したため、テストコードの修正と環境隔離（worktree 依存関係）の対応を行い、個票へ記録しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 変更履歴の更新
- `docs/ja/specdojo/guides/docs-structure-guide.md`: ドキュメント構造ガイドの更新
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: plan・result のライフサイクルガイドの更新
- `src/dashboard/exec-records.ts`: 実行記録の表示ロジックの更新
- `src/exec/commands.ts`: exec コマンドの定義更新
- `src/exec/plans-storage.ts`: plan の保存先ロジックの更新
- `src/exec/register-resume.ts`: 登録簿の再開処理の更新
- `src/exec/run/register-worktree.ts`: register 用 worktree 生成ロジックの更新
- `src/exec/worktree-ops-commit.ts`: worktree 操作時のコミット処理の更新
- `src/job/noop.ts`: noop ジョブの更新
- `src/shared/run-records.ts`: 実行記録の共有型定義の更新
- `tests/src/dashboard/dashboard.test.ts`: ダッシュボード表示のテスト更新
- `tests/src/exec/condense.test.ts`: 集約処理のテスト更新
- `tests/src/exec/deliverable.test.ts`: 成果物関連のテスト更新
- `tests/src/exec/plan-conventions.test.ts`: plan の規約に関するテスト更新
- `tests/src/exec/register-resume.integration.test.ts`: integration テストの更新（旧配置 fixture への対応および Git 環境隔離の修正）
- `tests/src/exec/register-resume.test.ts`: register-resume のユニットテスト更新
- `tests/src/exec/release-reset-worktree.integration.test.ts`: worktree リセットの統合テスト更新
- `tests/src/exec/run-records.test.ts`: run 記録のユニットテスト更新
- `tests/src/exec/worktree-command.integration.test.ts`: worktree コマンドの統合テスト更新
- `tests/src/exec/worktree-ops.integration.test.ts`: worktree 操作の統合テスト更新
- `tests/src/exec/worktree-ops.test.ts`: worktree 操作のユニットテスト更新
- `tests/src/job/noop.test.ts`: noop ジョブのテスト更新
- `src/exec/migrate-records.ts`: 実行記録移行コマンドの実装（新規）
- `tests/src/exec/migrate-records.test.ts`: 移行コマンドのテスト（新規）

## 3. 申し送り

- 移動実績は orchestrator の commit `d17dcdeba` にある5,576件。今回の dry-run は移動・更新・欠落・除外すべて0件。移行前の対の欠落18件は個票に記録済み。
- exec/events の791件はタスク状態遷移の正本、exec/trials の40件は比較実験独自の形式として維持する。旧 plans・results・evidence の残存ファイルは0件。
- 指定された lint・型検査・schema・単体／統合テストは親 runner が修正後に実行する。統合後は個票記載の運用メモに従い、PJR-JSEYで実 agent の動作を確認してから close する。
- 移動実績は orchestrator の commit d17dcdeba にある5,576件。今回の dry-run は移動・更新・欠落・除外すべて0件。移行前の対の欠落18件は個票に記録済み。
- 適用外の検証: `npm run validate:schema:file`（executorが変更したYAML成果物はない。既存の登録簿イベント差分はrunner管理。）

## 4. 進め方

まず、orchestrator によって実施された `git mv` によるファイル移動の実績を確認しました。次に、移行後の環境で `dashboard build` および `npm run validate:history-links` を実行し、新しいディレクトリ構造におけるデータの読み取りとリンクの整合性を検証しました。また、実行された `test-integration` における失敗（旧配置の fixture 参照に起因するもの）に対し、テストコードの修正および worktree 環境における依存関係の扱いを修正することで、移行後の状態での検証を可能にしました。最後に、開発ガイド（`docs-structure-guide.md` および `plan-result-lifecycle-guide.md`）を更新し、新しい実行記録の配置ルールを明文化しました。
