---
specdojo:
  id: prj-0001:xer-pjr-macp-20261128t103941z-d92b705a
  type: exec-result
  task_id: PJR-MACP
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-MACP/pjr-macp-20261128T103941Z-d92b705a/plan.md
  started_at: "2026-11-28T10:39:50.039Z"
  completed_at: "2026-11-28T10:54:51.425Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- 同期用の worktree で commit する前に、git 管理外の登録簿の一覧（generated/pjr-index.md）が無いか壊れている登録簿だけを作る ensureSyncWorktreeRegisterIndexes を追加した。exec のイベントの記帳・個票の対応結果の公開・register --commit の 3 か所から commit の直前に呼ぶ。一覧が無いと失敗する pre-commit hook を置いた統合テストを足し、修正を外すと報告と同じ失敗になることも確かめた。個票の影響範囲と対応結果（方式を選んだ理由と CHANGELOG の文案を含む）を埋めた。

## 2. 変更ファイル

- `src/exec/events.ts`: 変更、+2 / -0 行
- `src/exec/run/register-sync.ts`: 変更、+2 / -0 行
- `src/register/register.ts`: 変更、+2 / -0 行
- `tests/src/register/sync-branches.integration.test.ts`: 変更、+42 / -2 行
- `src/register/sync-worktree-index.ts`: 追加、+53 / -0 行

## 3. 申し送り

- 方式の決定: hook を飛ばす案は採らず、runner が commit の前に一覧を作る案にした。`--no-verify` は `evidence-secret-scan` などほかの hook もまとめて飛ばし、`LEFTHOOK_EXCLUDE=index-build` は配布する CLI がこのリポジトリの hook 名に依存するため。この案なら保護された `lefthook.yml` を変えずに済む。
- 一覧の生成に失敗した場合は警告だけを出して commit へ進む。hook のないリポジトリでは記帳を止めず、hook のあるリポジトリでは hook 自身のエラーが出る。
- close の前に残る確認: 統合の後に、オーケストレーターが人の actor の exec の記帳（終わったタスクの `exec reopen` と、元に戻す記帳）を 1 回流し、止まらずに同期のブランチへ送られることを確かめる。
- CHANGELOG に書く事項（区分 Fixed）の文案は、個票の対応結果の「CHANGELOG に書く事項」に置いた。`CHANGELOG.md` は変えていない。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
