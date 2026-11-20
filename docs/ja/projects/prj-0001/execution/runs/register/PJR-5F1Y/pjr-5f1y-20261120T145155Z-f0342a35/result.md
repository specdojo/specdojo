---
specdojo:
  id: prj-0001:xer-pjr-5f1y-20261120t145155z-f0342a35
  type: exec-result
  task_id: PJR-5F1Y
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-5F1Y/pjr-5f1y-20261120T145155Z-f0342a35/plan.md
  started_at: "2026-11-20T14:51:56.329Z"
  completed_at: "2026-11-20T23:23:26.941Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- Verified the `--resume-note` implementation from the first attempt against the completion conditions. Re-ran the two validations that were `not_run`: `validate:history-links` and a schema check of a `pipeline-state.json` that contains `resume_notes`. Both passed. Recorded an existing schema gap (`artifacts` is missing from the schema) in the ticket's remaining issues.

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+13 / -0 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+6 / -0 行
- `docs/specdojo/schemas/v1/pipeline-state.schema.yaml`: 変更、+18 / -0 行
- `src/exec/pipeline-state.ts`: 変更、+29 / -0 行
- `src/exec/run/agent-pipeline.ts`: 変更、+6 / -0 行
- `src/exec/run/register-command.ts`: 変更、+13 / -0 行
- `src/exec/run/register-resume.ts`: 変更、+23 / -1 行
- `src/exec/run/shared.ts`: 変更、+2 / -0 行
- `src/shared/plan-conventions.ts`: 変更、+12 / -0 行
- `src/exec/run/resume-notes.ts`: 追加、+60 / -0 行
- `tests/src/exec/run/resume-notes.test.ts`: 追加、+183 / -0 行

## 3. 申し送り

- Options and decisions: the option name is `--resume-note &lt;text&gt;` (repeatable). It applies only to `exec run --register` with a single ID. Notes are inserted before the conventions reference in the worktree plan and recorded in `resume_notes` in `pipeline-state.json`. The reasons are in the ticket's response section.
- CHANGELOG (Added): `exec run --register &lt;PJR-ID&gt; --resume --resume-from executor` gains `--resume-note &lt;text&gt;` (repeatable). Before resuming, it adds a resume-instructions section before the conventions reference in the run's plan and records the notes and time in `resume_notes` in `pipeline-state.json` (PJR-5F1Y).
- Existing gap outside this item: `docs/specdojo/schemas/v1/pipeline-state.schema.yaml` lacks the `artifacts` field written by `src/exec/pipeline-state.ts`, so real run `pipeline-state.json` files fail `npm run validate:schema:file` with additional properties. Handle the schema addition in a separate register item.

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
