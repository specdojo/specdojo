---
specdojo:
  id: prj-0001:xer-jbr-grade-kata-5a5519c3090b
  type: exec-result
  task_id: JBR-grade-kata-5a5519c3090b
  mode: edit
  status: complete
  project_id: prj-0001
  origin: job
  job_id: job-grade-kata
  run_id: JBR-grade-kata-5a5519c3090b
  plan_ref: exec/plans/JBR-grade-kata-5a5519c3090b-plan.md
  started_at: "2026-10-21T20:00:58.217Z"
  completed_at: "2026-10-21T20:51:58.298Z"
  agent: gemma-reporter
---

# Edit Result

## 1. 実施内容

- grade pipeline を実行し、選択された15件の文書すべてについて処理を完了しました。
- 終了コードは 0 であり、未完了の段や `failed` の段、`retry_exhausted` の文書は存在しません。
- 評価結果 (`results.tsv`) では、14件の文書が `pass`（スコア 91-100）となり、1件のみ `fail`（`docs/ja/specdojo/samples/utc-sample.md`、スコア 46）となりました。
- 大部分の文書が高得点を記録しており、評価設定に極端な偏りはないと考えられますが、`utc-sample.md` のみの低さは個別の文書品質に起因するものと判断されます。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.bps-template.yaml`: 評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cdfd-overview-template.yaml`: 評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cdfd-template.yaml`: 評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cdfd-uc-template.yaml`: 評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.dct-index-template.yaml`: 評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-template.yaml`: 評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pjr-change-request-template.yaml`: 評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pjr-decision-template.yaml`: 評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pjr-index-template.yaml`: 評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pjr-issue-template.yaml`: 評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pjr-note-template.yaml`: 評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pjr-question-template.yaml`: 評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pjr-risk-template.yaml`: 評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.utc-sample.yaml`: 評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pjr-derived-items-template.yaml`: 評価結果の更新
- `docs/ja/projects/prj-0001/execution/jobs/runs/JBR-grade-kata-5a5519c3090b.json`: 実行状態の記録更新

## 3. 申し送り

- なし

## 4. 進め方

決定論的コマンドとして定義された `tools/grade/run-per-document.sh` の実行結果（`stdout` の `results.tsv` 内容）を分析し、各文書の `verdict` および `score` をもとに、パイプラインの完了状態と評価分布の傾向を判断しました。
