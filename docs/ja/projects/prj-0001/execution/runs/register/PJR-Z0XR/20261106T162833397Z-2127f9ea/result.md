---
specdojo:
  id: prj-0001:xer-pjr-z0xr-20261106t150914z-684ce215
  type: exec-result
  task_id: PJR-Z0XR
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-Z0XR/20261106T162833397Z-2127f9ea/plan.md
  started_at: "2026-11-06T15:09:15.345Z"
  completed_at: "2026-11-06T16:49:01.258Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 実行記録の配置を `execution/runs/&lt;出どころ&gt;/&lt;項目 ID&gt;/&lt;run ID&gt;/` に基づく形式に変更し、読み書きのロジックを 1 つのモジュールに集約しました。
- `src/shared/run-records.ts` を新規作成して配置ロジックを共通化し、`src/exec/run-records.ts` から再エクスポートすることで、`job` から `exec` への直接的な依存を回避しました。
- 既存の実行記録との互換性を維持するためのロジックを実装しました。
- `src/docs/frontmatter-namespace.ts` を共有層 (`src/shared/`) へ移動し、フロントマッター操作の共通利用を可能にしました。
- 多数の関連モジュールのパス指定を新方式に適合するように修正し、一連のテストおよびビルドが成功することを確認しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 変更履歴の更新。
- `src/dashboard/exec-records.ts`: 実行記録の表示に関連するコードの更新。
- `src/docs/frontmatter-namespace.ts`: フロントマッターの名前空間管理の変更。
- `src/exec/commands.ts`: 実行コマンドの更新。
- `src/exec/core.ts`: コアロジックの更新。
- `src/exec/evidence.ts`: エビデンス管理の更新。
- `src/exec/handoff.ts`: 申し送り事項管理の更新。
- `src/exec/pipeline-state.ts`: パイプライン状態遷移の更新。
- `src/exec/plans-condense-findings.ts`: プランの要約に関する更新。
- `src/exec/plans-core.ts`: プラン管理コアの更新。
- `src/exec/plans-generation.ts`: プラン生成ロジックの更新。
- `src/exec/plans-storage.ts`: プラン保存ロジックの更新。
- `src/exec/register-resume.ts`: 登録簿の再開ロジックの更新。
- `src/exec/register.ts`: 登録プロセス関連の更新。
- `src/exec/reporter.ts`: レポーター機能の更新。
- `src/exec/results.ts`: 結果管理の更新。
- `src/exec/run/agent-pipeline.ts`: エージェントパイプラインの更新。
- `src/exec/run/in-place.ts`: インプレイス実行関連の更新。
- `src/exec/run/job.ts`: ジョブ管理関連の更新。
- `src/exec/run/lifecycle-commands.ts`: ライフサイクルコマンドの更新。
- `src/exec/run/mode-shared.ts`: モード共有ロジックの更新。
- `src/exec/run/register-command.ts`: 登録コマンドの更新。
- `src/exec/run/register-core.ts`: 登録コア処理の更新。
- `src/exec/run/register-mode.ts`: 登録モード関連の更新。
- `src/exec/run/register-post-review.ts`: レビュー後処理の更新。
- `src/exec/run/register-resume.ts`: 登録再開処理の更新。
- `src/exec/run/register-state.ts`: 登録状態管理の更新。
- `src/exec/run/register-worktree.ts`: ワークツリーに関連する登録処理の更新。
- `src/exec/run/schedule-prepare.ts`: スケジュール準備処理の更新。
- `src/exec/run/schedule-task.ts`: スケジュールタスク管理の更新。
- `src/exec/worktree-command.ts`: ワークツリー操作コマンドの更新。
- `src/exec/worktree-ops-commit.ts`: ワークツリー操作コミットの更新。
- `src/job/job.ts`: ジョブ定義の更新。
- `tests/src/dashboard/dashboard.test.ts`: ダッシュボードのテスト更新。
- `tests/src/exec/deliverable.test.ts`: 成果物管理のテスト更新。
- `tests/src/exec/evidence.test.ts`: エビデンス管理のテスト更新。
- `tests/src/exec/job-worktree.integration.test.ts`: ジョブとワークツリーの結合テスト更新。
- `tests/src/exec/pipeline-e2e.integration.test.ts`: パイプラインの E2E 結合テスト更新。
- `tests/src/exec/pipeline-state.test.ts`: パイプライン状態管理のテスト更新。
- `tests/src/exec/plan-markdownlint.integration.test.ts`: プランの MarkdownLint 結合テスト更新。
- `tests/src/exec/plans.test.ts`: プラン管理のテスト更新。
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: 登録パイプラインの E2E 結合テスト更新。
- `tests/src/exec/register-resume.integration.test.ts`: 登録再開の結合テスト更新。
- `tests/src/exec/results.test.ts`: 結果管理のテスト更新。
- `tests/src/exec/run/inplace.test.ts`: インプレイス実行のテスト更新。
- `tests/src/exec/scheduler-command.test.ts`: スケジューラーコマンドのテスト更新。
- `src/exec/run-records.ts`: 配置モジュールのエクスポート用ファイル。
- `src/shared/frontmatter-namespace.ts`: 共有層へ移動したフロントマッター名前空間管理。
- `src/shared/run-records.ts`: 実行記録の配置ロジックを格納する新規モジュール。
- `tests/src/exec/run-records.test.ts`: 配置ロジックのテストファイル。

## 3. 申し送り

- 配置の実装は `src/shared/run-records.ts` に集約した。`job` から `exec` への依存を避け、`src/exec/run-records.ts` は再エクスポートのみとした。frontmatter の共通処理も共有層へ移し、既存の公開口を維持した。個票にも記録済み。
- register・schedule の executor 再開は同一 run とし、前回の `state`・`evidence`・ログを `*.attempt-N.*` に退避する。review は元の項目の下の別 run とする。schedule の新規 run には既存のユニークな stem 生成と文書 ID 生成関数を使う。個票にも判断と理由を記録済み。
- 保護設定の変更案: `.prettierignore` に `docs/ja/projects/**/execution/runs/**/plan.md` と `docs/ja/projects/**/execution/runs/**/result.md` を追加し、履歴本文を整形対象から保護する。設定は未変更で、個票にも記録済み。
- 既存記録の移動とガイド更新は PJR-9BY9、配置検査と CI 対応の R3 は PJR-JT5J、ガイド照合の R4 は後続項目で扱う。job の状態管理用 JSON と `grade/results` は従来の配置を維持する。
- 配置の実装は `src/shared/run-records.ts` に集約した。job から exec への依存を避け、`src/exec/run-records.ts` は再エクスポートのみとした。frontmatter の共通処理も共有層へ移し、既存の公開口を維持した。個票にも記録済み。
- register・schedule の executor 再開は同一 run とし、前回の state・evidence・ログを `*.attempt-N.*` に退避する。review は元の項目の下の別 run とする。schedule の新規 run には既存のユニークな stem 生成と文書 ID 生成関数を使う。個票にも判断と理由を記録済み。
- 適用外の検証: `npm run validate:schema:file`（executor が編集した YAML ファイルはない。既存差分の登録簿イベント YAML は runner 管理の変更である。）

## 4. 進め方

1. 実行記録の配置を `execution/runs/&lt;出どころ&gt;/&lt;項目 ID&gt;/&lt;run ID&gt;/` という run 単位のディレクトリ構造に変更するためのロジックを `src/shared/run-records.ts` に実装しました。 2. `job` モジュールが `exec` 内の `run-records.ts` に依存しないよう、`src/shared/` を経由した依存関係の設計を行いました。 3. フロントマッターの名前空間管理 (`src/docs/frontmatter-namespace.ts`) を `src/shared/` へ移動し、モジュール間での共有を容易にしました。 4. 既存の（古い配置の）実行記録を読み取れる互換性を実装しました。 5. 変更に伴う広範囲の依存関係の修正と、それに関連するテストの更新を実施しました。
