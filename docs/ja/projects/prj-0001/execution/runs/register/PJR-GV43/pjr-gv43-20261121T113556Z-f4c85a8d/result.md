---
specdojo:
  id: prj-0001:xer-pjr-gv43-20261121t113556z-f4c85a8d
  type: exec-result
  task_id: PJR-GV43
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-GV43/pjr-gv43-20261121T113556Z-f4c85a8d/plan.md
  started_at: "2026-11-21T11:35:57.172Z"
  completed_at: "2026-11-21T12:18:23.182Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- where の別名と 9 コマンドを消した後に落ちていた where.integration.test.ts の 13 件を、別名が使えないことを確かめるテストへ直した。直した 13 件は通り、消したコマンドを前提にするテストは tests 配下に残っていない。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/040-user-interface-model/clis-exec-commands.md`: 変更、+13 / -15 行
- `docs/ja/product/040-system-design/sysd-index.md`: 変更、+2 / -2 行
- `docs/ja/specdojo/guides/plan-result-lifecycle-guide.md`: 変更、+1 / -12 行
- `docs/ja/specdojo/guides/register-operation-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/guides/timeline-design-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+31 / -48 行
- `docs/ja/specdojo/rulebooks/pm-members-rulebook.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/rulebooks/tml-rulebook.md`: 変更、+3 / -3 行
- `src/catalog/catalog.ts`: 変更、+0 / -3 行
- `src/dashboard/timeline-build.ts`: 変更、+0 / -39 行
- `src/dashboard/timeline.ts`: 変更、+1 / -98 行
- `src/exec/commands.ts`: 変更、+9 / -54 行
- `src/exec/core.ts`: 変更、+1 / -23 行
- `src/exec/migrate-records.ts`: 削除、+0 / -284 行
- `src/grade/command-inspect.ts`: 変更、+1 / -38 行
- `src/grade/markdown.ts`: 変更、+3 / -133 行
- `src/job/job.ts`: 変更、+0 / -3 行
- `src/register/command-types.ts`: 変更、+0 / -12 行
- `src/register/maintenance-commands.ts`: 変更、+1 / -87 行
- `src/register/migration.ts`: 削除、+0 / -338 行
- `src/register/register.ts`: 変更、+0 / -9 行
- `src/routine/routine.ts`: 変更、+0 / -3 行
- `src/schedule/schedule.ts`: 変更、+0 / -3 行
- `src/shared/specdojo-config.ts`: 変更、+3 / -145 行
- `src/shared/where-alias.ts`: 削除、+0 / -21 行
- `src/specdojo.ts`: 変更、+0 / -2 行
- `tests/src/cli-verb-taxonomy.test.ts`: 変更、+1 / -7 行
- `tests/src/commands/where.integration.test.ts`: 変更、+7 / -16 行
- `tests/src/dashboard/timeline-build.test.ts`: 変更、+0 / -17 行
- `tests/src/exec/event-msg-default.test.ts`: 変更、+0 / -15 行
- `tests/src/exec/migrate-records.test.ts`: 削除、+0 / -204 行
- `tests/src/exec/register-resume.integration.test.ts`: 変更、+1 / -81 行
- `tests/src/grade/repo-results.test.ts`: 変更、+0 / -30 行
- `tests/src/register/commands.test.ts`: 変更、+0 / -73 行
- `tests/src/register/migration.test.ts`: 削除、+0 / -196 行
- `tests/src/register/track-domains.test.ts`: 変更、+0 / -46 行
- `tests/src/schedule/command.test.ts`: 変更、+1 / -1 行
- `tests/src/shared/specdojo-config.test.ts`: 変更、+2 / -33 行

## 3. 申し送り

- なし

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
