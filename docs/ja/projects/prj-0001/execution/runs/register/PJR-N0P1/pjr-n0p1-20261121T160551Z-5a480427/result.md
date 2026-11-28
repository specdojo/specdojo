---
specdojo:
  id: prj-0001:xer-pjr-n0p1-20261121t160551z-5a480427
  type: exec-result
  task_id: PJR-N0P1
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-N0P1/pjr-n0p1-20261121T160551Z-5a480427/plan.md
  started_at: "2026-11-21T16:05:51.965Z"
  completed_at: "2026-11-21T16:15:08.056Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- review の段でプロダクトの worktree を provider ごとに読み取りへ絞った（claude・opencode）。codex・copilot は絞れないため、review 後の変更を検出して block する。個票の対応結果と CHANGELOG 文案を記入した。「項目が waiting になる」テストは書いておらず、runWithRetry 経由の block 統合テストもない（個票と handoff に記録）。

## 2. 変更ファイル

- `src/exec/opencode-permissions.ts`: 変更、+3 / -2 行
- `src/exec/run/agent-pipeline.ts`: 変更、+16 / -2 行
- `src/exec/run/agent.ts`: 変更、+45 / -2 行
- `src/exec/run/schedule-task.ts`: 変更、+3 / -0 行
- `src/exec/task-repos.ts`: 変更、+25 / -2 行
- `src/exec/worktree-command.ts`: 変更、+12 / -2 行
- `tests/src/exec/task-repos.test.ts`: 変更、+78 / -0 行

## 3. 申し送り

- codex と copilot は `--add-dir` が書き込みを許すため読み取りだけにできない。review 後のプロダクトの変更を runner が検出して block する。
- schedule の review の段は `protectionBlock` で failure になり既存の block の経路で止まる。register の run は mode が常に `edit` で review の段を持たないため、register の `waiting` 遷移はこの件では足していない。
- `runWithRetry` を通した block の統合テストは未作成。検出関数 `changedProductStatuses` の単体テストのみ。必要なら別項目にする。
- CHANGELOG 文案は個票の `### 5.1. CHANGELOG に書く事項` に記載済み（区分: 変更）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
