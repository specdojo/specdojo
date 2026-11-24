---
specdojo:
  id: prj-0001:xer-pjr-4vd6-20261124t003347z-e359e99c
  type: exec-result
  task_id: PJR-4VD6
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-4VD6/pjr-4vd6-20261124T003347Z-e359e99c/plan.md
  started_at: "2026-11-24T00:33:51.302Z"
  completed_at: "2026-11-24T01:08:19.060Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 親の検証 test-integration で落ちた E2E の 3 件を直した。原因はテストの誤りで、実装は変えていない。1 つ目は fixture の個票 `id` がファイル名と合わず、`--commit` 経路の記帳前の検査で start が止まっていたこと。2 つ目はヘルパー `execWorktreePath` が register 専用の worktree を exec の worktree と取り違えていたこと。指示の vitest のコマンドでファイルの 57 件がすべて通った。判断は個票の対応結果に書いた。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/guides/exec-worktree-guide.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+3 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/references/specdojo-config-reference.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/standards/git-branching-standard.md`: 変更、+1 / -1 行
- `src/exec/run/register-core.ts`: 変更、+40 / -14 行
- `src/exec/run/register-state.ts`: 変更、+7 / -3 行
- `src/exec/run/register-worktree.ts`: 変更、+8 / -1 行
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: 変更、+120 / -1 行
- `tests/src/register/register-branch.integration.test.ts`: 変更、+104 / -0 行
- `src/exec/run/register-sync.ts`: 追加、+103 / -0 行

## 3. 申し送り

- 再開時の判断: E2E の 3 件の失敗はテストの誤りとして直した。fixture の個票 `id`（`test:pjr-ab12-topic`）をファイル名に合わせて `test:pjr-ab12-pipeline-test` にし、`execWorktreePath` は `.git/specdojo/register/` 配下の専用 worktree を除外する。記帳前の id とファイル名の検査は既存の register CLI の規約なので緩めない。
- 統合の後に orchestrator が、新しい runner プロセスで `exec smoke` と実際の `exec run --register` を各 1 回流して確かめてから close する（作業内容の表の No.5 は open のまま）。実際の agent CLI と利用枠を使うため、executor の sandbox では実施できない。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
