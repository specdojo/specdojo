---
specdojo:
  id: prj-0001:xer-pjr-m120-20261124t231805z-cf850f78
  type: exec-result
  task_id: PJR-M120
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-M120/pjr-m120-20261124T231805Z-cf850f78/plan.md
  started_at: "2026-11-24T23:18:05.952Z"
  completed_at: "2026-11-24T23:31:17.921Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- Added `specdojo register branch-push --project &lt;project-id&gt; [--dry-run]`: it pushes only to the `register_sync` remote and branch, handles first-time setup (create from the integration branch, or only create the local branch when it exists only on the remote), recovers a stopped sync (continue rebase, then `pull --rebase` and push; stops on conflicts with file list and fix), runs the `branch-check` checks before pushing, and runs inside the same lock as the sync. Added unit and integration tests and updated the register operation guide, config reference and command reference. Filled in the ticket's work table, results and CHANGELOG draft.

## 2. 変更ファイル

- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+11 / -7 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+4 / -1 行
- `docs/ja/specdojo/references/specdojo-config-reference.md`: 変更、+1 / -1 行
- `src/register/branch-commands.ts`: 変更、+29 / -0 行
- `src/shared/register-branch.ts`: 変更、+82 / -11 行
- `src/register/branch-push.ts`: 追加、+400 / -0 行
- `tests/src/register/branch-push.test.ts`: 追加、+83 / -0 行
- `tests/src/register/register-branch-push.integration.test.ts`: 追加、+299 / -0 行

## 3. 申し送り

- After integration, the orchestrator must try first-time setup, recovery and `--dry-run` in a temporary repository with a bare remote before close (ticket work table No 5, left `open`).
- Decision: `--dry-run` takes no lock and does not fetch (reads the remote tip with `git ls-remote`). It exits 1 when the real run would stop (check violations, conflicts, uncommitted changes).
- Decision: if the dedicated worktree has uncommitted changes outside a rebase, recovery does not commit them; it lists them and stops with exit code 1, so that a claim the user has not adopted is never published automatically.
- Decision: a branch that exists only locally (not covered by the completion conditions) is checked and pushed as a new remote branch. The integration branch must exist locally; if it is not on the remote yet, its commits fail the scope check and the message says to push the integration branch first.
- Changed the sync failure message (`recoveryError` in `src/shared/register-branch.ts`) to point to `specdojo register branch-push` instead of manual `git pull --rebase` / `git push`; the phrases the existing tests assert are kept. Also fixed the worktree lookup so a worktree with a stopped rebase (detached HEAD) is found through the rebase `head-name`.
- CHANGELOG draft is in the ticket section 5.3 (Added: `register branch-push`; Changed: sync failure guidance now points to it). `CHANGELOG.md` was not changed.
- The uncommitted sync-settings changes in `../worktrees/feature-prj-0001-register-sync` and `../worktrees/feature-prj-0002-register-sync` (CLAUDE.md, orchestrator text) may still describe manual git steps; if so, switch them to `register branch-push` on that side. Not changed in this item.

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
