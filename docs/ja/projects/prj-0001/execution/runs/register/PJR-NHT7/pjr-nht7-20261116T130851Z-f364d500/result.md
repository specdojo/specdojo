---
specdojo:
  id: prj-0001:xer-pjr-nht7-20261116t130851z-f364d500
  type: exec-result
  task_id: PJR-NHT7
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-NHT7/pjr-nht7-20261116T130851Z-f364d500/plan.md
  started_at: "2026-11-16T13:11:18.485Z"
  completed_at: "2026-11-16T13:32:56.406Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- Moved post-integration worktree/branch removal outside the exec-lifecycle lock for register and schedule runs; integration and bookkeeping stay inside the lock, post-cleanup bookkeeping reacquires it. Added a per-worktree cleanup lock that makes re-runs, resumes, and `exec worktree remove` refuse while a cleanup is in progress. Added regression tests showing the lock is released before cleanup. Ticket results updated, including the CHANGELOG entry draft.

## 2. 変更ファイル

- `src/exec/run/register-resume.ts`: 変更、+66 / -63 行
- `src/exec/run/register-worktree.ts`: 変更、+181 / -138 行
- `src/exec/run/schedule-task.ts`: 変更、+58 / -45 行
- `src/exec/worktree-command.ts`: 変更、+10 / -1 行
- `src/exec/run/deferred-cleanup.ts`: 追加、+37 / -0 行
- `src/exec/worktree-cleanup-lock.ts`: 追加、+47 / -0 行
- `tests/src/exec/run/deferred-cleanup.test.ts`: 追加、+120 / -0 行
- `tests/src/exec/worktree-cleanup-lock.test.ts`: 追加、+40 / -0 行

## 3. 申し送り

- Decision: post-review runs after the worktree removal (outside the first lock section, reacquiring the lock). When removal fails the item stays in review without post-review, so integration resume redoes cleanup and post-review without running post-review twice.
- Decision: the post-review diff range (`outputCommit`) is fixed to HEAD right after the merge, so commits made by other items while cleanup runs do not widen it.
- Decision: register cleanup takes a per-worktree lock (`exec/.locks/worktree-cleanup/&lt;worktree&gt;`) inside the exec-lifecycle lock. Same-item setup, resume, integration resume, and `exec worktree remove` refuse while it is live. A crashed cleanup leaves a stale lock that the next operation takes over; the next run or `exec worktree prune` removes the remains.
- Decision: schedule (`runPreparedTask`) uses the same deferred-cleanup structure but has no per-worktree lock. Its lifecycle lock is the in-process `SerialAsyncLock`, and the task stays `doing` during cleanup, so the scheduler does not pick it again.
- Decision: register removal failures now use the reason prefix `integrate cleanup failed` in the normal integration path too, distinguishing them from pre-merge `integrate failed`.
- Remaining issue: `removeWorktree` uses `spawnSync`, so the cleanup still blocks the same process's event loop. Other processes (`specdojo git`, `--join` runs, register bookkeeping) no longer wait, but items running in parallel in the same process do not advance during cleanup. Making the removal asynchronous is a candidate for a separate register item.
- CHANGELOG (Fixed): `exec run` の worktree 実行で、統合の後の worktree と exec branch の撤去を exec-lifecycle のロックの外で行うようにした。遅いファイルシステムで撤去に時間がかかっても、別の項目の記帳と `specdojo git` が待たされない。撤去の間は同じ項目の再実行・再開・`exec worktree remove` を拒否する。
- 適用外の検証: `specdojo catalog validate`（Only a project-register ticket under docs/ja/projects changed; no catalog-managed deliverable was changed, and the catalog check is not part of this plan's required validations.）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
