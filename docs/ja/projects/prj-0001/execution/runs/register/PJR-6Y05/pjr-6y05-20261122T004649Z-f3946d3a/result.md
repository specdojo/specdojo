---
specdojo:
  id: prj-0001:xer-pjr-6y05-20261122t004649z-f3946d3a
  type: exec-result
  task_id: PJR-6Y05
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-6Y05/pjr-6y05-20261122T004649Z-f3946d3a/plan.md
  started_at: "2026-11-22T00:46:50.219Z"
  completed_at: "2026-11-22T00:50:23.611Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- job-grade-kata / job-grade-deliverable に必須入力 by を足して --by の agy 固定を外した。description と観点から agy を外し、generated を再生成した。個票の対応結果を更新した。by なしで止まること、dry-run で評価者が表示されることを確認した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/jobs/job-grade-deliverable.yaml`: 変更、+7 / -3 行
- `docs/ja/projects/prj-0001/jobs/job-grade-kata.yaml`: 変更、+7 / -3 行

## 3. 申し送り

- routine（rtn-grade-kata・rtn-grade-recheck・rtn-grade-deliverable-recheck）は enabled: false のまま変更していない。評価者が決まったら、各 routine の action.inputs に `by: "&lt;名簿の agent&gt;"` を足して enabled: true にする案。by がない routine を有効にすると job の必須入力で止まる。
- 両 job の `run.idempotency_key` に `by` は含めていない。評価者を変えて同じ枠で再実行する場合は必要に応じて足す。
- CHANGELOG.md は変更していない（個票 5.1 に「なし」と記載）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
