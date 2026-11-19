---
specdojo:
  id: prj-0001:xer-pjr-y3xs-20261119t110351z-916ff7d1
  type: exec-result
  task_id: PJR-Y3XS
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-Y3XS/pjr-y3xs-20261119T110351Z-916ff7d1/plan.md
  started_at: "2026-11-19T11:03:55.369Z"
  completed_at: "2026-11-19T11:24:20.104Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- Fixed the three PJR-Y3XS issues. 1) Schedule-task integration now also takes the project lifecycle lock (`withExecLifecycleMutex`), so it waits for an in-progress `register ... --commit` instead of failing on its staged files. 2) `register` `-m` is repeatable and the values are joined as paragraphs like `git commit -m`; previously commander kept only the last `-m` (the body), commitlint rejected it, and the failure message ended with an argument fragment. A failed commit now lists the written-but-uncommitted files and exits 1, and git argument summaries are folded onto one line. 3) After a pathspec (`--only`) commit, `restoreIndexAfterPathspecCommit` resets index entries the hook's `stage_fixed` left behind; it runs in both `register ... --commit` and `specdojo git -- commit ... -- &lt;pathspec&gt;`. Added unit and integration tests, updated command-reference and register-operation-guide, and wrote causes, decisions, verification and CHANGELOG draft lines in the ticket's 対応結果. Nothing was run locally: the parent runs typecheck/lint/tests, and the sandbox blocked an ad-hoc Git reproduction, so cause 3 is inferred from Git behavior and confirmed only by the new integration tests.

## 2. 変更ファイル

- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+3 / -3 行
- `src/commands/git.ts`: 変更、+24 / -1 行
- `src/exec/run/schedule-task.ts`: 変更、+28 / -1 行
- `src/register/command-types.ts`: 変更、+2 / -1 行
- `src/register/register.ts`: 変更、+42 / -6 行
- `src/shared/git.ts`: 変更、+54 / -1 行
- `tests/src/commands/git.integration.test.ts`: 変更、+24 / -0 行
- `tests/src/commands/git.test.ts`: 変更、+14 / -0 行
- `tests/src/exec/worktree.test.ts`: 変更、+12 / -0 行
- `tests/src/register/commit.integration.test.ts`: 変更、+71 / -0 行
- `tests/src/exec/run/schedule-integration-lock.test.ts`: 追加、+89 / -0 行
- `tests/src/register/commit-message.test.ts`: 追加、+21 / -0 行

## 3. 申し送り

- Decision: integration vs register-commit contention is resolved by waiting (schedule integration takes the same exec-lifecycle CrossProcessMutex as `register ... --commit` / `specdojo git` / register worktree runs), not by excluding the register files from the integration check.
- Not covered: job-mode integration (`src/exec/run/job.ts`) and manual `exec worktree merge` still do not take the cross-process lifecycle lock; apply `withExecLifecycleMutex` in a separate item if the same symptom appears there.
- Not covered: a separate `specdojo git -- add` followed later by `specdojo git -- commit` leaves staged files unlocked in between; recommend recording via `register ... --commit` or a single pathspec `specdojo git -- commit`.
- `specdojo git` index restoration applies only to `commit ... -- &lt;pathspec&gt;` (with `--`); `git commit &lt;path&gt;` without `--` is not detected.
- No protected configuration changes (`lefthook.yml`, `package.json`) were needed.
- CHANGELOG draft lines (不具合修正 x3) are in the ticket's `### 5.5. CHANGELOG に書く事項`; `CHANGELOG.md` was not changed.

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
