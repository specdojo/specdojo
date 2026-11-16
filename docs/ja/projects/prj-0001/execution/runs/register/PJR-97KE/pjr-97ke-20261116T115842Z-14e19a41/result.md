---
specdojo:
  id: prj-0001:xer-pjr-97ke-20261116t115842z-14e19a41
  type: exec-result
  task_id: PJR-97KE
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-97KE/pjr-97ke-20261116T115842Z-14e19a41/plan.md
  started_at: "2026-11-16T12:02:17.182Z"
  completed_at: "2026-11-16T12:53:42.773Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- A child run that stopped inside the night job's worktree can now be resumed from the main working tree with exec run --register &lt;id&gt; --resume and goes through integration. Before resuming, the runner merges the job-branch commit that holds the wait record (second parent of the latest post-wait sync merge) into main. Because main shares that commit with the job branch, the later job merge does not conflict. When the resume cannot proceed, the output gives the cause and next steps such as --force-restart. Added a regression test, a design paragraph, and the ticket's results section.

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-job-execution.md`: 変更、+2 / -0 行
- `src/exec/run/register-resume.ts`: 変更、+51 / -3 行
- `tests/src/exec/register-resume.integration.test.ts`: 変更、+65 / -0 行
- `src/exec/register-foreign-wait.ts`: 追加、+106 / -0 行

## 3. 申し送り

- Where the records live: when resuming from main, the runner merges into main the job-branch commit that holds the wait record (the second parent of the latest `exec(register &lt;id&gt;): merge &lt;target&gt; after wait` on the exec branch). Copying the records would conflict with the later job merge. Merging the exec branch's tip would make the integration stage treat the run as already merged, so that commit is used instead.
- That commit also carries other items merged into the job branch earlier the same night. They passed their own post-review but reach main before the review of the job as a whole. The job's own output (run record, morning report) comes after the wait and is not brought in. The resume output shows how many commits came in. If the job review should come first, merge the job before resuming.
- Not covered: resuming from main a child run that was already merged into the job branch and only has worktree cleanup left (it has no post-wait merge, so nothing is brought in).
- CHANGELOG draft (bug fix): Register child runs that stopped inside the night job's worktree can now be resumed from the main working tree with `exec run --register &lt;id&gt; --resume`. The resume first brings in the wait record from the job branch, so merging the job later does not conflict. The ticket's "CHANGELOG に書く事項" section has the same text.
- ESLint warning (not an error): `resumeSingleRegisterItemWorktree` in `src/exec/run/register-resume.ts` is now 395 lines against the 200-line guideline. It was already over the limit and this change made it longer. Consider splitting it in a later item.
- Leftover helper script `tmp/fix-ticket.mjs` was not deleted because deletion needed approval. It is under `tmp/` and is not committed.

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
