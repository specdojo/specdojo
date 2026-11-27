---
specdojo:
  id: prj-0001:xer-pjr-7vtz-20261127t124745z-dc0123e9
  type: exec-result
  task_id: PJR-7VTZ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-7VTZ/pjr-7vtz-20261127T124745Z-dc0123e9/plan.md
  started_at: "2026-11-27T12:47:56.545Z"
  completed_at: "2026-11-27T12:56:43.919Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- inRegisterBranchSync now blocks synchronously (up to `REGISTER_BRANCH_SYNC_WAIT_MS` = 120s) for the register branch lock via the new acquirePoolSlotSync, failing with the branch, waited time and limit on timeout, and failing at once only when the holder is this process. Added 3 unit and 2 integration tests and updated the ticket's response section, including the CHANGELOG draft.

## 2. 変更ファイル

- `src/shared/cross-process-lock.ts`: 変更、+43 / -0 行
- `src/shared/register-branch.ts`: 変更、+34 / -5 行
- `tests/src/exec/slot-lock.test.ts`: 変更、+90 / -2 行
- `tests/src/register/register-branch.integration.test.ts`: 変更、+50 / -1 行

## 3. 申し送り

- CHANGELOG に書く事項（`CHANGELOG.md` は未変更）: 区分「利用者から見て動きが変わる点」、文案「`exec refresh`・claim・complete などの exec のイベントの書き込みは、専用ブランチが `register ... --commit` などで使用中でも、すぐ失敗せずに最大 120 秒待ってから書きます。上限を超えると、ブランチ名と待った時間を示して止まります（PJR-7VTZ）。」
- 待ち方は同期のまま待つ方式（`Atomics.wait`）を採用。イベント API が同期で呼び出し元が多いため。同じプロセスの非同期の書き手が枠を持つ場合だけは、待つと解放されないため即時に失敗する。
- 上限の既定値は `REGISTER_BRANCH_SYNC_WAIT_MS` = 120 秒で、設定項目は設けていない（1 回の `register ... --commit` の fetch・rebase・push は通常数秒〜1 分程度、停止した持ち主は 30 秒の stale 判定で奪えるため）。保護された設定の変更は不要。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
