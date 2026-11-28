---
specdojo:
  id: prj-0001:xer-pjr-fgkb-20261121t152029z-94ed92f3
  type: exec-result
  task_id: PJR-FGKB
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-FGKB/pjr-fgkb-20261121T152029Z-94ed92f3/plan.md
  started_at: "2026-11-21T15:20:29.865Z"
  completed_at: "2026-11-21T15:32:46.871Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- PJR-FGKB: when a resumed executor misses lower-bound targets, its evidence is now marked incomplete with the missing targets and resume command in `block_reason`; the executor stage becomes blocked and the item waiting, so `--resume --resume-from executor` works without `--force-restart` (schedule path treated the same). Lower-bound paths absent from the working tree and git status are excluded and recorded in the new evidence field `excluded_coverage_targets` (schema updated). Found during the work and fixed: resuming the same run overwrote `evidence.json` and lost the first attempt's lower bound; archived `evidence.attempt-&lt;n&gt;.json` files are now read for it. Added and updated unit and integration tests, updated the resume section of exec-operation-guide, and filled in the ticket's results with CHANGELOG wording.

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+2 / -2 行
- `docs/specdojo/schemas/v1/exec-evidence.schema.yaml`: 変更、+21 / -0 行
- `src/exec/evidence.ts`: 変更、+54 / -1 行
- `src/exec/pipeline-state.ts`: 変更、+31 / -0 行
- `src/exec/register-resume.ts`: 変更、+11 / -2 行
- `src/exec/run/agent-pipeline.ts`: 変更、+17 / -5 行
- `src/exec/run/agent.ts`: 変更、+45 / -2 行
- `src/exec/run/schedule-task.ts`: 変更、+17 / -3 行
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: 変更、+105 / -3 行
- `tests/src/exec/register-resume.test.ts`: 変更、+63 / -0 行
- `tests/src/exec/run/resumed-coverage.test.ts`: 追加、+122 / -0 行

## 3. 申し送り

- runner の動きを変えたため、統合の後に実際の `exec run --register` を 1 回流して確かめる（オーケストレーターが行う。個票の完了条件）。
- `_ASSUMPTION_:` 「統合先との差分にもない」は、作業ツリーにファイルがなく git status にも出ない（HEAD にも無い）ことで判定した。task ブランチの commit で消したファイルは判定できないが、worktree 実行では commit が統合の時だけに作られるため実害はないと判断した。
- CHANGELOG の文案は個票の `### 5.1. CHANGELOG に書く事項` に書いた（区分: 不具合修正）。`CHANGELOG.md` は変えていない。
- sandbox で、対象の統合テスト 2 件（`-t "lower bound"`）と、変更した単体テスト 3 ファイル（71 件）を流して通した。全件の検証は親 runner の結果を正とする。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
