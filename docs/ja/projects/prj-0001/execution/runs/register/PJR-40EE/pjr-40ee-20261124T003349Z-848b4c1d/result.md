---
specdojo:
  id: prj-0001:xer-pjr-40ee-20261124t003349z-848b4c1d
  type: exec-result
  task_id: PJR-40EE
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-40EE/pjr-40ee-20261124T003349Z-848b4c1d/plan.md
  started_at: "2026-11-24T00:35:42.575Z"
  completed_at: "2026-11-24T00:54:09.729Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- Added `specdojo orchestrator watch-scan`, which finds stalled schedule tasks, register items, and queues and classifies why they stopped. It appends one line per stall to `execution/watch/watch-events.jsonl` without re-adding open stalls, rewrites the daily morning report under `execution/reports/watch-scan/`, and takes no action. Added routine `rtn-exec-watch-scan` (`interval: 30m`, `kind: specdojo`, no exec lock), unit tests that reproduce the 2026-11-13 to 14 night, and updates to the register and routine guides, the CLI reference, the Job execution design, and the ticket.

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-job-execution.md`: 変更、+6 / -0 行
- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+42 / -0 行
- `docs/ja/specdojo/guides/routine-operation-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+14 / -0 行
- `src/commands/orchestrator.ts`: 変更、+2 / -0 行
- `docs/ja/projects/prj-0001/routines/rtn-exec-watch-scan.yaml`: 追加、+16 / -0 行
- `src/commands/watch-scan.ts`: 追加、+93 / -0 行
- `src/exec/watch-scan-classify.ts`: 追加、+296 / -0 行
- `src/exec/watch-scan.ts`: 追加、+628 / -0 行
- `tests/src/exec/watch-scan-classify.test.ts`: 追加、+263 / -0 行
- `tests/src/exec/watch-scan.test.ts`: 追加、+330 / -0 行

## 3. 申し送り

- Decision: the scanner is `orchestrator watch-scan`, not an `exec` subcommand. `exec watch` belongs to PJR-T4E0, routine `kind: specdojo` rejects `exec`, and Jobs wait for the project exec lock, so the scanner sits under `orchestrator` and takes no lock.
- Decision: the 2026-11-14 night example for a mismatched branch is the hook failure `unknown option '--reserve'`, classified as `needs_target_sync` (`target_ahead`).
- Decision: the block message is checked first, then run logs in rule order. Rules that need a decision take precedence over load timeouts. Usage-limit and `overloaded` wording is matched only against the block message, and `executor.log` is never read, to avoid false matches from test names and plan text. `index.lock` contention is classified as `load_timeout` (`git_index_lock`). Blocks without a pipeline stage or limit marker are `manual_block`. Register items in `review` are `review_pending`. Interrupted means no live exec run lock and an update older than `--stale-after` (default 2h).
- Protected configuration was not changed. The devcontainer cron calls `routine run --due` hourly, so the 30m interval effectively runs hourly. Changing the cron interval is a human decision.
- Remaining before close (orchestrator, after integration): run `exec smoke` and one real `specdojo routine run --project prj-0001 --id rtn-exec-watch-scan`, then confirm that the watch log and the morning report are written. Ticket work row 6 stays `open` for this.
- The CHANGELOG entry draft is in ticket section 5.2. `CHANGELOG.md` was not changed.
- 人の確認が必要: `specdojo exec smoke`（Run by the orchestrator after integration, together with one real routine run, before close）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
