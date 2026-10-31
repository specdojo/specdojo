---
specdojo:
  id: prj-0001:xer-jbr-grade-kata-b671f1d3f602
  type: exec-result
  task_id: JBR-grade-kata-b671f1d3f602
  mode: edit
  status: complete
  project_id: prj-0001
  origin: job
  job_id: job-grade-kata
  run_id: JBR-grade-kata-b671f1d3f602
  plan_ref: exec/plans/JBR-grade-kata-b671f1d3f602-plan.md
  started_at: "2026-10-29T20:01:05.410Z"
  completed_at: "2026-10-29T20:50:08.302Z"
  agent: gemma-reporter
---

# Edit Result

## 1. 実施内容

- `tools/grade/run-per-document.sh` を実行し、15件の対象成果物の品質評価を完了しました。
- 全15件の文書について `status` が `passed` であり、未完了の段や `failed` の文書、および `retry_exhausted` の文書は観測されませんでした。
- `verdict` と `score` の分布を確認したところ、`pass`（4件）に対し `needs-work`（11件）となっており、特に `rulebooks/` 配下の文書で `needs-work` への偏りが見られます。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.bps-recipe.yaml`: 品質評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cdfd-overview-recipe.yaml`: 品質評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cdfd-recipe.yaml`: 品質評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cdfd-uc-recipe.yaml`: 品質評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cdsd-rulebook.yaml`: 品質評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cld-rulebook.yaml`: 品質評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cnd-mermaid-rulebook.yaml`: 品質評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cnd-rulebook.yaml`: 品質評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cop-index-rulebook.yaml`: 品質評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cop-rulebook.yaml`: 品質評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cpd-mermaid-rulebook.yaml`: 品質評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cpd-rulebook.yaml`: 品質評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cstd-rulebook.yaml`: 品質評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.exec-human-finalize-recipe.yaml`: 品質評価結果の更新
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.tsd-recipe.yaml`: 品質評価結果の更新
- `docs/ja/projects/prj-0001/execution/jobs/runs/JBR-grade-kata-b671f1d3f602.json`: ジョブ実行状態の更新

## 3. 申し送り

- なし

## 4. 進め方

executor による `tools/grade/run-per-document.sh` の実行結果（stdout）および `results.tsv` を分析し、完了ステータス、失敗の有無、スコア分布を確認して報告しました。
