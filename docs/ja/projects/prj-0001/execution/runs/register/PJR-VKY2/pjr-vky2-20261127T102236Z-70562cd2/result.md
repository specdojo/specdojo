---
specdojo:
  id: prj-0001:xer-pjr-vky2-20261127t102236z-70562cd2
  type: exec-result
  task_id: PJR-VKY2
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-VKY2/pjr-vky2-20261127T102236Z-70562cd2/plan.md
  started_at: "2026-11-27T10:22:40.711Z"
  completed_at: "2026-11-27T11:27:17.021Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- Split `register_sync` into project/&lt;id&gt;/sync/register and project/&lt;id&gt;/sync/exec-events (new `sync` config with per-kind `branches`; legacy `register_sync` kept as one-branch compatibility). Covers commands, auto-merge, guard, check, push, and the dedicated worktree location. Docs, schema and tests are updated. Per the resume instruction, the protected CI workflow and config changes are satisfied by the written proposals. Prettier and validate:history-links pass.

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/guides/exec-worktree-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+32 / -10 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+25 / -25 行
- `docs/ja/specdojo/references/specdojo-config-reference.md`: 変更、+29 / -12 行
- `docs/ja/specdojo/standards/git-branching-standard.md`: 変更、+18 / -17 行
- `docs/specdojo/schemas/v1/specdojo-config.schema.yaml`: 変更、+36 / -1 行
- `src/exec/events.ts`: 変更、+4 / -4 行
- `src/exec/run/register-sync.ts`: 変更、+6 / -6 行
- `src/exec/run/register-worktree.ts`: 変更、+9 / -4 行
- `src/register/branch-commands.ts`: 変更、+44 / -23 行
- `src/register/branch-push.ts`: 変更、+45 / -12 行
- `src/register/cross-project.ts`: 変更、+2 / -1 行
- `src/register/external-project.ts`: 変更、+3 / -2 行
- `src/register/push-check.ts`: 変更、+34 / -18 行
- `src/shared/register-branch.ts`: 変更、+112 / -30 行
- `src/shared/register-merge.ts`: 変更、+76 / -39 行
- `src/shared/specdojo-config.ts`: 変更、+49 / -3 行
- `tests/src/register/branch-push.test.ts`: 変更、+8 / -0 行
- `tests/src/register/push-check.test.ts`: 変更、+1 / -0 行
- `tests/src/shared/register-sync-config.test.ts`: 変更、+59 / -1 行
- `tests/src/register/sync-branches.integration.test.ts`: 追加、+210 / -0 行

## 3. 申し送り

- Protected change proposal (needs user approval, feature branch): .github/workflows/check-register-push.yml. Add `"project/*/sync/register"` and `"project/*/sync/exec-events"` to on.push.branches, keeping `"project/*/register"` until the migration completes. Change project extraction from `project="${project%/register}"` to `project="${project%%/*}"`. branch-check picks the branch scope from --remote-ref, so nothing else changes. Ticket work row 5 stays open because executor cannot write .github/workflows/.
- Migration of prj-0001 from project/prj-0001/register to the two sync branches, to be done by the orchestrator when no run, queue or routine is active: (1) publish any stopped sync with register branch-push; (2) run register branch-merge on develop and push develop; (3) create project/prj-0001/sync/register and project/prj-0001/sync/exec-events from the merged develop tip and push them; (4) replace `"register_sync":` {"enabled": true} with "sync": {"enabled": true} in .specdojo/specdojo.config.json via a feature branch; (5) check that register branch-push --project prj-0001 --dry-run reports both as already on origin, then remove the old dedicated worktree; (6) delete the old branch once other users have switched. Ticket work row 9 stays open for this.
- Decision: legacy `register_sync` is not aliased to `sync`. Aliasing would switch writes to not-yet-existing branches as soon as the CLI is upgraded. Setting both is a config error.
- Decision: when one operation writes both branches, register goes first and exec-events second, one at a time and not nested (the lock is shared). A register failure stops before exec-events. An exec-events failure keeps the published register bookkeeping, and recovery is `register branch-push --sync exec-events` followed by a retry. No current operation writes both.
- CHANGELOG lines (Added / Migration notes) are drafted in the ticket section 'CHANGELOG に書く事項'. CHANGELOG.md was not edited.

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
