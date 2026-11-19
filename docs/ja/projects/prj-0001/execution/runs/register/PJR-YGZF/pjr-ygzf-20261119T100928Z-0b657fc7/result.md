---
specdojo:
  id: prj-0001:xer-pjr-ygzf-20261119t100928z-0b657fc7
  type: exec-result
  task_id: PJR-YGZF
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-YGZF/pjr-ygzf-20261119T100928Z-0b657fc7/plan.md
  started_at: "2026-11-19T10:12:30.302Z"
  completed_at: "2026-11-19T10:38:16.515Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- Detection of directly edited schedule tracks (warning in exec validate and before exec run --auto) and a single strategy-first agent resolution (resolveScheduledTaskAgent) across ready rebuild, task view and run are implemented; unit tests, schedule-design-guide and the ticket's response section are updated.

## 2. 変更ファイル

- `docs/ja/specdojo/guides/schedule-design-guide.md`: 変更、+12 / -9 行
- `src/exec/run/schedule-mode.ts`: 変更、+15 / -11 行
- `src/exec/schedule/schedule.ts`: 変更、+137 / -9 行
- `src/exec/strategy.ts`: 変更、+21 / -0 行
- `src/exec/task-view.ts`: 変更、+4 / -4 行
- `tests/src/exec/schedule/validation.test.ts`: 変更、+154 / -2 行
- `tests/src/exec/strategy.test.ts`: 変更、+104 / -0 行
- `tests/src/exec/task-view.test.ts`: 追加、+91 / -0 行

## 3. 申し送り

- Detection outcome: tracks that differ from the strategy rebuild only produce a warning and do not stop the run. Reason: agents are always resolved from the strategy at runtime, so a direct edit has no effect on execution; the comparison cannot tell a direct edit from a catalog change that has not been rebuilt, so stopping would halt `exec refresh` / `exec cycle` validate on every catalog change.
- Unresolved: in the actual project, `exec validate --schedule-only` warns that `sch-track-planning.yaml` differs from the result rebuilt from the strategy (`depends_on` of `sch-defaults-020`, 4 `tml-index` tasks not generated). Out of scope, so not rebuilt. Next action: the orchestrator decides whether to run `specdojo schedule build --track planning --force` or file a separate item.
- Ready rebuild (`writeGeneratedCore`) and run (`runManualMode`) are verified through the unit tests of the shared `resolveScheduledTaskAgent`; only task view (`buildTaskView`) has a per-path unit test.
- CHANGELOG (written in the ticket's 'CHANGELOG に書く事項'): category bug fix. Draft line: schedule のタスクの agent を、ready の作り直し・タスクの表示・実行のどれでも strategy の `phase_overrides`・phase の `agent` の順で解決するようにし、track を直接編集したときに `exec validate` と `exec run --auto` が作り直した結果との違いを警告するようにした。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
