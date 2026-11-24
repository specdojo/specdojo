---
specdojo:
  id: prj-0001:xer-pjr-n5j8-20261123t224718z-2f792eb5
  type: exec-result
  task_id: PJR-N5J8
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-N5J8/pjr-n5j8-20261123T224718Z-2f792eb5/plan.md
  started_at: "2026-11-23T22:48:40.985Z"
  completed_at: "2026-11-23T23:10:07.370Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 専用ブランチへの記帳・push・rebase 再試行、schedule と外部起票の連携、統合テスト、関連文書を実装しました。追加検査は通過し、型検査・lint・テストは親 runner に委任しています。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+26 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+3 / -1 行
- `docs/ja/specdojo/references/specdojo-config-reference.md`: 変更、+25 / -0 行
- `docs/ja/specdojo/standards/git-branching-standard.md`: 変更、+2 / -0 行
- `docs/specdojo/schemas/v1/specdojo-config.schema.yaml`: 変更、+15 / -0 行
- `src/exec/events.ts`: 変更、+71 / -2 行
- `src/register/cross-project.ts`: 変更、+3 / -0 行
- `src/register/external-project.ts`: 変更、+11 / -0 行
- `src/register/register.ts`: 変更、+33 / -1 行
- `src/shared/specdojo-config.ts`: 変更、+19 / -1 行
- `tests/src/register/external-project.test.ts`: 変更、+19 / -0 行
- `src/shared/register-branch.ts`: 追加、+266 / -0 行
- `tests/src/register/register-branch.integration.test.ts`: 追加、+423 / -0 行
- `tests/src/shared/register-sync-config.test.ts`: 追加、+53 / -0 行

## 3. 申し送り

- 設定は project の `register_sync` に集約し、`enabled` は既定 false、`branch` は `project/&lt;project-id&gt;/register`、`remote` は origin とした。既存動作を保つため明示時だけ切り替える。保護された設定は変更していない。有効化案は `projects.prj-0001.register_sync = { "enabled": true }`。移行準備後に適用する。
- 専用 worktree を保持し、共通ロックで同期を直列化する。同期 API を維持するため schedule は busy 時に再実行を案内する。push は最大3回で、non-fast-forward のみ rebase 後に再試行する。未公開記帳を伴う失敗は復旧待ちとして保持し、手動復旧後に clean な HEAD がリモートに含まれることを確認して再開する。
- 初期ブランチは設定を含む develop から手動作成・push する手順をガイドに記載した。hook の依存関係等が必要なら既存 worktree をセットアップする。記帳範囲外の参照を変える改名・再採番は停止して feature と PR で扱う。runner の対応結果転送、自動 merge、hook・CI の保護、v0.10.0 の版上げは後続の移行・リリース手順へ引き継ぐ。
- CHANGELOG 文案（Added、v0.10.0）: project の `register_sync` 設定により、register の `--commit`、schedule の実行イベント、外部 project からの起票を専用ブランチへ commit・push できる。non-fast-forward は rebase 後に再試行し、失敗時はローカルの記帳と復旧手順を保持する（PJR-N5J8）。個票にも記載済み。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
