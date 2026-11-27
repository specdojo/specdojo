---
specdojo:
  id: prj-0001:xer-pjr-aewp-20261127t125900z-e6d69e9e
  type: exec-result
  task_id: PJR-AEWP
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-AEWP/pjr-aewp-20261127T125900Z-e6d69e9e/plan.md
  started_at: "2026-11-27T12:59:04.825Z"
  completed_at: "2026-11-27T13:16:44.616Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 準備段の状態保存・復元、最新 run の選択、統合再開の前提検査を修正した。pipeline-state の型と schema、register の実行・再開処理、worktree checkpoint、回帰テスト、運用ガイド、個票を更新した。result・登録簿の状態・保護設定は変更していない。型検査・lint・単体／統合テストは親 runner の検証に委ねる。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+16 / -12 行
- `docs/specdojo/schemas/v1/pipeline-state.schema.yaml`: 変更、+4 / -1 行
- `src/exec/pipeline-state.ts`: 変更、+3 / -1 行
- `src/exec/register-resume.ts`: 変更、+176 / -8 行
- `src/exec/run/agent-pipeline.ts`: 変更、+3 / -0 行
- `src/exec/run/register-mode.ts`: 変更、+6 / -6 行
- `src/exec/run/register-resume.ts`: 変更、+119 / -6 行
- `src/exec/run/register-worktree.ts`: 変更、+134 / -32 行
- `src/exec/worktree-ops-lifecycle.ts`: 変更、+14 / -0 行
- `tests/src/exec/pipeline-state.test.ts`: 変更、+11 / -0 行
- `tests/src/exec/register-resume.integration.test.ts`: 変更、+171 / -0 行
- `tests/src/exec/register-resume.test.ts`: 変更、+120 / -0 行

## 3. 申し送り

- なし

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
