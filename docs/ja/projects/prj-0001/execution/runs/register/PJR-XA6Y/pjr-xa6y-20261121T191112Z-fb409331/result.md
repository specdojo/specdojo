---
specdojo:
  id: prj-0001:xer-pjr-xa6y-20261121t191112z-fb409331
  type: exec-result
  task_id: PJR-XA6Y
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-XA6Y/pjr-xa6y-20261121T191112Z-fb409331/plan.md
  started_at: "2026-11-21T19:11:12.935Z"
  completed_at: "2026-11-21T19:16:40.989Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- grade run に --fallback-by を追加し、rate limit 時に同じ run id で代わりの評価者へ切り替えて続けるようにした。job 入力 `fallback_by`、単体テスト 3 件、command-reference、個票を更新した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/jobs/job-grade-deliverable.yaml`: 変更、+8 / -1 行
- `docs/ja/projects/prj-0001/jobs/job-grade-kata.yaml`: 変更、+8 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+3 / -1 行
- `src/grade/command-run.ts`: 変更、+2 / -0 行
- `src/grade/run.ts`: 変更、+37 / -9 行
- `tests/src/grade/run.test.ts`: 変更、+48 / -0 行

## 3. 申し送り

- --fallback-by は明示指定のみで exec-defaults.yaml からの既定は引かない。評価者が未決で、暗黙に agent が変わるのを避けるため。
- prj-0001 の routine は変更していない。評価者が決まったら rtn-grade-recheck と rtn-grade-deliverable-recheck の inputs に `fallback_by`（例: sol）を足せば切り替わる。rtn-grade-recheck は現在 enabled: false。
- job の --by agy-expert-executor は固定のまま。評価者を入力にする案は評価者の決定後に検討する。
- CHANGELOG 案: 区分 Added。grade run に --fallback-by &lt;nickname&gt; を追加し、評価者が rate limit のときに代わりの評価者へ切り替えて同じ run を続けられるようにした。
- --fallback-by は run request の digest に含まれるため、再開時は同じ指定が必要。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
