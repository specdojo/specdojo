---
specdojo:
  id: prj-0001:xer-jbr-grade-kata-0946a04e624d
  type: exec-result
  task_id: JBR-grade-kata-0946a04e624d
  mode: edit
  status: complete
  project_id: prj-0001
  origin: job
  job_id: job-grade-kata
  run_id: JBR-grade-kata-0946a04e624d
  plan_ref: exec/plans/JBR-grade-kata-0946a04e624d-plan.md
  started_at: "2026-10-15T21:00:57.198Z"
  completed_at: "2026-10-15T21:44:24.829Z"
  agent: gemma-reporter
---

# Edit Result

## 1. 実施内容

- grade pipeline を実行した結果、選択された 15 件の文書すべてが正常に処理されました（`incomplete` または `exhausted` な段はありません）。
- `failed` (status が `fail`) の段はなく、すべての文書で `passed` となっています。
- `retry_exhausted` となる文書も観測されませんでした。
- verdict の分布については、`fail` 8件、`needs-work` 7件となっており、全件が `pass` していないため品質評価上の課題があることが分かります。score は 47 から 88 まで分散しており、特に `fail` 判定の文書に低いスコアが集中しています。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/execution/grade/pipeline/mip-index-sample-e9c791b00c2e.json`: 削除
- `docs/ja/projects/prj-0001/execution/grade/pipeline/nfr-index-sample-8756d8fcbc97.json`: 削除
- `docs/ja/projects/prj-0001/execution/grade/pipeline/nfr-maintainability-sample-8c8be7b7a882.json`: 削除
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.mip-index-sample.yaml`: 更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.nfr-index-sample.yaml`: 更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.nfr-maintainability-sample.yaml`: 更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.nfr-performance-sample.yaml`: 更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.nfr-reliability-sample.yaml`: 更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.nfr-security-safety-sample.yaml`: 更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.nfr-usability-sample.yaml`: 更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.ntp-sample.yaml`: 更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opd-access-control-sample.yaml`: 更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opd-incident-management-sample.yaml`: 更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opd-index-sample.yaml`: 更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opd-monitoring-sample.yaml`: 更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opd-sample.yaml`: 更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-access-control-sample.yaml`: 更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-backup-restore-sample.yaml`: 更新
- `docs/ja/projects/prj-0001/execution/jobs/runs/JBR-grade-kata-0946a04e624d.json`: reporter の説明がないため、変更差分を参照。

## 3. 申し送り

- なし

## 4. 進め方と実践の型の適用

executor が実行した `tools/grade/run-per-document.sh` の結果（`results.tsv`）を解析し、未完了段の有無、失敗段の切り分け、`retry_exhausted` の確認、および `verdict` と `score` の分布分析を行いました。
