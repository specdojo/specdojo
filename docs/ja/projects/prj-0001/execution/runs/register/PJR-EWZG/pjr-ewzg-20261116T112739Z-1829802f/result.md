---
specdojo:
  id: prj-0001:xer-pjr-ewzg-20261116t112739z-1829802f
  type: exec-result
  task_id: PJR-EWZG
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-EWZG/pjr-ewzg-20261116T112739Z-1829802f/plan.md
  started_at: "2026-11-16T11:29:31.163Z"
  completed_at: "2026-11-16T11:48:20.960Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- The sync before a register resume now keeps the exec branch's ticket text (the executor's results) and takes only the frontmatter status fields from develop when the ticket conflicts. A regression test of the incident (text present only on the exec branch, waiting state only on develop) passes, and the ticket's results section is filled in.

## 2. 変更ファイル

- `src/exec/repo-integration-sync.ts`: 変更、+26 / -5 行
- `src/exec/repo-integration.ts`: 変更、+1 / -0 行
- `src/exec/run/register-resume.ts`: 変更、+32 / -1 行
- `src/exec/run/register-state.ts`: 変更、+21 / -7 行
- `tests/src/exec/register-resume.test.ts`: 変更、+67 / -0 行
- `tests/src/exec/task-repos.integration.test.ts`: 変更、+66 / -0 行

## 3. 申し送り

- Decision: of the two options in the ticket, I chose keeping the ticket text in the sync before resume (`registerResumeConflictPaths` plus `overlayRegisterTicketLifecycle`). This covers both the retry-without-result case and this incident, where the wait commit failed and the bookkeeping was committed by hand.
- Decision: if develop's ticket cannot be parsed, the sync fails and the resume is refused instead of falling back to develop's version, which would lose the text. Fix the ticket in the worktree and resume again.
- Not handled: event files (`events/pjr-*.yaml`) still take develop's version on conflict, so the exec branch's start and review events can be dropped. Left for PJR-9MWH.
- CHANGELOG line (written only in the ticket's results section, `CHANGELOG.md` not changed): Fixed: `exec run` register resume keeps the executor's ticket text through the sync before resume, even after the wait commit was retried without the result or the bookkeeping was committed by hand (PJR-EWZG).
- Protected settings: no change and no proposal.
- `npm run check` was not run as a whole. Most of its parts are parent-runner checks; the rest (`npm run check:src-imports`, `npm run validate:catalog`, `npm run validate:history-links`) passed in the executor.

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
