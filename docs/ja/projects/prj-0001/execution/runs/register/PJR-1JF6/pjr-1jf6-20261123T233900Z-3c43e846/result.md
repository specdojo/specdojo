---
specdojo:
  id: prj-0001:xer-pjr-1jf6-20261123t233900z-3c43e846
  type: exec-result
  task_id: PJR-1JF6
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-1JF6/pjr-1jf6-20261123T233900Z-3c43e846/plan.md
  started_at: "2026-11-23T23:39:10.923Z"
  completed_at: "2026-11-23T23:51:27.078Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- Added `register branch-merge`, which merges the register branch into the current branch one way with `--no-ff`. Added `register branch-guard` (`--staged` / `--range`), which flags register files edited directly outside the register branch. `exec run --register --worktree` now merges the register branch before creating the worktree. Both commands only act when `register_sync` is enabled. Added an integration test, updated the command reference, register operation guide and Git branching standard, and filled in the ticket.

## 2. 変更ファイル

- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+2 / -0 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+21 / -15 行
- `docs/ja/specdojo/standards/git-branching-standard.md`: 変更、+1 / -1 行
- `src/exec/run/register-worktree.ts`: 変更、+20 / -0 行
- `src/register/register.ts`: 変更、+2 / -0 行
- `src/register/branch-commands.ts`: 追加、+78 / -0 行
- `src/shared/register-merge.ts`: 追加、+225 / -0 行
- `tests/src/register/register-branch-merge.integration.test.ts`: 追加、+208 / -0 行

## 3. 申し送り

- Merging is done by the CLI and runner, not GitHub Actions. Actions would need the right to push past develop's PR protection (roughly the GitHub App setup that PJR-2TX0 rejected) and changes to the protected `.github/`. With the CLI, each person uses their own credentials and the merge commits reach develop through normal PRs.
- Guard rule: a change to a register file is allowed only if its content matches the merge base of a merged-in parent and the register branch. Commits on the register branch itself are not checked. Register changes that reach a feature branch through develop pass; squashed or hand-made edits fail.
- Only `exec run --register --worktree` merges the register branch before work. Schedule runs already read events from the register branch since PJR-N5J8, so they were left alone.
- Protected-config proposal (not applied): add `register-branch-guard` to the `lefthook.yml` pre-commit with the command `[ ! -f dist/specdojo.js ] || node dist/specdojo.js register branch-guard --project prj-0001 --staged`. Add a job to `.github/workflows/` that runs `specdojo register branch-guard --project prj-0001 --range &lt;base&gt;..&lt;head&gt;` on pushes and PRs to develop, with `fetch-depth: 0` and a fetch of the register branch.
- Add the guard to hooks only after the runner writes ticket updates to the register branch (2a). Until then, the runner's current way of bringing ticket updates from the exec branch into develop counts as a violation.
- CHANGELOG draft: Added (v0.10.0): `register branch-merge` merges the register branch into develop one way with `--no-ff`, and `register branch-guard` flags register files edited directly on develop. `exec run --register --worktree` merges the register branch before creating the worktree. Both only act in projects with `register_sync` enabled (PJR-1JF6).

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
