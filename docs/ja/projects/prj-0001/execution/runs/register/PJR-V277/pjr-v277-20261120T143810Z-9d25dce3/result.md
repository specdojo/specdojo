---
specdojo:
  id: prj-0001:xer-pjr-v277-20261120t143810z-9d25dce3
  type: exec-result
  task_id: PJR-V277
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-V277/pjr-v277-20261120T143810Z-9d25dce3/plan.md
  started_at: "2026-11-20T14:38:10.835Z"
  completed_at: "2026-11-20T14:50:18.264Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- Parent validations now run in their own process group on POSIX. On timeout the runner sends SIGTERM to the whole group, then SIGKILL after 10s; if the output pipes are still open 5s later it returns as timed out and moves to the next validation. The stop is recorded as a `validation-timeout-stop` metrics entry. Added an integration test reproducing a grandchild that keeps the pipes open, documented the metrics entry in exec-operation-guide, and updated the ticket's impact, response and related-document sections.

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+8 / -7 行
- `src/exec/parent-validation.ts`: 変更、+82 / -15 行
- `src/exec/validation-process-group.ts`: 追加、+101 / -0 行
- `tests/src/exec/parent-validation-timeout.integration.test.ts`: 追加、+163 / -0 行

## 3. 申し送り

- Decision: grace periods are 10s from SIGTERM to SIGKILL (`VALIDATION_KILL_GRACE_MS`) and 5s from SIGKILL to the pipes closing (`VALIDATION_CLOSE_GRACE_MS`). Reason: give vitest time to clean up while still moving on about 15s after the time limit in unattended runs.
- Decision: Windows does not use process groups. It signals only the direct child, as before, but stops waiting for the pipes after the grace period. Tree kill with `taskkill /T` was left out because it could not be tested here.
- Decision: because a separate process group no longer receives the terminal's Ctrl-C, the runner forwards SIGINT, SIGTERM, SIGHUP and its own exit to the active validation groups while a validation runs. With no other listener it re-sends the signal so the default exit still happens.
- Proposed CHANGELOG line (do not edit CHANGELOG.md; also in ticket section 5.5): Bug fix: when a parent validation times out, its descendants such as vitest are stopped too, and the runner moves on to the next validation even if a process keeps the output pipes open.

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
