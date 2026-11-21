---
specdojo:
  id: prj-0001:xer-pjr-qtb6-20261117t233542z-6b739c35
  type: exec-result
  task_id: PJR-QTB6
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-QTB6/pjr-qtb6-20261117T233542Z-6b739c35/plan.md
  started_at: "2026-11-17T23:35:43.365Z"
  completed_at: "2026-11-17T23:55:19.812Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- Compared the old sample-gcs-product (74 files) and sample-gcs-story (13 files) with the current specdojo samples type by type. Only the three migration documents had useful concrete examples missing from the current samples, so mip-index-sample was rewritten into the rulebook's 9-section structure with them. Removed the two sample-gcs rows from the docs/ja/index.md table. Wrote the per-type decision table, the procedure and impact of removing the paths from git history (left as `_UNDECIDED_`), and CHANGELOG draft lines in the ticket. Did not move or delete `docs/ja/sample-gcs-*` and did not rewrite or push history.

## 2. 変更ファイル

- `docs/ja/index.md`: 変更、+0 / -2 行
- `docs/ja/specdojo/samples/mip-index-sample.md`: 変更、+98 / -20 行

## 3. 申し送り

- Work item No.5 (copy docs/ja/sample-gcs-product, sample-gcs-projects and sample-gcs-story to local/ and git rm them) stays open: after integration the orchestrator does it with the user's approval.
- `_UNDECIDED_:` whether to remove the paths from git history. Procedure (draft): finish all worktrees and stashes, keep a mirror clone as backup, install git filter-repo (not installed now), run git filter-repo --invert-paths for 6 paths (the 3 current ones plus the pre-rename docs/sample-gcs-product-docs, docs/sample-gcs-project-docs, docs/sample-gcs-story), force-push all branches and tags, ask GitHub support to purge cached refs, and recreate every clone and worktree. Impact: about 11,540 of 11,703 commits get new hashes (from 40bee99f4, 2026-01-02). Files with 40-char hashes: 260 register events, 6 tickets, 170 execution/runs, 7 execution/exec, 1 execution/reports, plus tests/src/exec/repo-trace.test.ts and docs-structure-guide.md. 18 worktrees, 71 branches and 28 tags are affected. Also decide whether to keep the old-to-new hash map (.git/filter-repo/commit-map).
- Not verified: whether the same content existed under another directory name before 40bee99f4 (the executor could not read the older tree). The orchestrator should check before rewriting history.
- Decision: opd-access-control-sample and opd-monitoring-sample were not updated because they are generic, not in the shared Kinuya sample context, and adding one Kinuya row would mix subjects. Proposed follow-up item: rewrite both in the shared sample context.
- Decision: mip-index-sample was rewritten to the 9-section rulebook structure instead of appending bullets. The sibling migration samples (dmd-index-sample, mtp-sample, cop-index-sample, otp-index-sample) are still minimal placeholders; decide whether to make them Kinuya-specific to match.
- CHANGELOG draft (not applied): Changed - mip-index-sample rewritten to the 9-section rulebook structure with the Kinuya parallel-recording, final stocktake and cutover timeline examples. Removed - old Kinuya sample rows (sample-gcs-projects/, sample-gcs-product/) removed from the docs/ja/index.md table.
- Unstaged change in docs/ja/projects/prj-0001/controls/project-register/events/pjr-qtb6.yaml after the docs build; the executor did not inspect it or check whether the build or the runner wrote it.

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
