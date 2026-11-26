---
specdojo:
  id: prj-0001:xer-pjr-3m4m-20261125t125945z-2e39e15e
  type: exec-result
  task_id: PJR-3M4M
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-3M4M/pjr-3m4m-20261125T125945Z-2e39e15e/plan.md
  started_at: "2026-11-25T12:59:47.113Z"
  completed_at: "2026-11-25T13:18:10.423Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- Added exec-defaults watch.remedies so orchestrator watch-scan launches fixed remedies (wait for the limit or switch agents, rerun timed-out parent validations, sync with the integration target) through the existing exec resume and exec run --register --resume, detached and one per scan. Every remedy defaults to none. Added a per-target attempt cap, remedy and `remedy_stopped` watch-log lines, a schedule note event by watch-scan, and a remedies section in the morning report. Added unit tests and an integration test reproducing the 2026-11-13 to 14 limit and load timeout, updated the schema, guides, CLI reference, design doc, routine, and ticket.

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-job-execution.md`: 変更、+4 / -2 行
- `docs/ja/projects/prj-0001/routines/rtn-exec-watch-scan.yaml`: 変更、+4 / -3 行
- `docs/ja/specdojo/guides/exec-config-guide.md`: 変更、+34 / -0 行
- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+46 / -17 行
- `docs/ja/specdojo/guides/routine-operation-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+4 / -2 行
- `docs/specdojo/schemas/v1/exec-defaults.schema.yaml`: 変更、+66 / -0 行
- `src/commands/watch-scan.ts`: 変更、+88 / -59 行
- `src/exec/agent-config.ts`: 変更、+4 / -0 行
- `src/exec/watch-scan.ts`: 変更、+238 / -19 行
- `tests/src/exec/watch-scan.test.ts`: 変更、+209 / -1 行
- `src/exec/watch-remedy.ts`: 追加、+417 / -0 行
- `tests/src/commands/watch-scan.integration.test.ts`: 追加、+269 / -0 行
- `tests/src/exec/watch-remedy.test.ts`: 追加、+280 / -0 行

## 3. 申し送り

- Decision: remedies reuse the existing exec resume and exec run --register --resume, launched detached with output under `execution/watch/remedies/`, one per scan, and only while no other exec run holds the project lock. This keeps the watch lock-free and gives the same sync, conflict stop, and agent switch behavior as a manual resume.
- Decision: attempts are counted per target (kind and id) within `attempt_window`, not per stall `key`, because each re-block after a remedy creates a new key. Defaults: `max_attempts` 3, `attempt_window` 24h, `switch_after` 12h, `unknown_resume_wait` 1h.
- Decision: register remedies are recorded in the watch log and the morning report only. The register event log cannot hold an entry without a field change, so the register itself only shows the transition events the resumed run writes. Schedule tasks also get a `note` event by `watch-scan`, without meta so the `limit_*` and `pipeline_*` markers stay.
- Decision: `needs_target_sync` on an executor or reporter stage uses `--resume-from executor`, which restarts the executor and uses an agent. The integrate stage uses the integration retry, which syncs before commit. Schedule tasks without a pipeline stage get only `--due`.
- Proposed protected-config change (not applied): to use remedies in prj-0001, add to `.specdojo/exec-defaults.yaml`: watch: { remedies: { `usage_limit:` { action: wait, `fallback_executor_by:` sonnet-executor, `fallback_reporter_by:` sonnet-reporter, `switch_after:` 12h }, `load_timeout:` { action: rerun }, `needs_target_sync:` { action: sync } }, `max_attempts:` 2 }. Do not enable `rtn-exec-limit-resume` at the same time as `usage_limit` wait.
- After integration, orchestrator runs `exec smoke` and one real `specdojo routine run --project prj-0001 --id rtn-exec-watch-scan` to confirm the log and the morning report (remedies section shows none by default) before close. Ticket work row 7 stays open for this.
- CHANGELOG draft (Added): exec-defaults `watch.remedies` for orchestrator watch-scan (usage limit wait or fallback, load-timeout rerun, target sync), off by default, capped by `max_attempts` and `attempt_window`. watch-scan gains `--exec-defaults` and `--no-remedy`, `remedy` and `remedy_stopped` log lines, and a remedies report section.

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
