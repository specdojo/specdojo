---
specdojo:
  id: prj-0001:xer-jbr-grade-kata-5aef174f1ae5
  type: exec-result
  task_id: JBR-grade-kata-5aef174f1ae5
  mode: edit
  status: complete
  project_id: prj-0001
  origin: job
  job_id: job-grade-kata
  run_id: JBR-grade-kata-5aef174f1ae5
  plan_ref: runs/job/JBR-grade-kata-5aef174f1ae5/JBR-grade-kata-5aef174f1ae5/plan.md
  started_at: "2026-11-10T20:02:20.699Z"
  completed_at: "2026-11-10T20:49:52.568Z"
  agent: gemma-reporter
---

# Edit Result

## 1. 実施内容

- 評価パイプラインは正常に完了し、選択された 15 件の文書すべてで評価が実施されました。終了コードは 0 であり、未完了の段や `retry_exhausted` となった文書はありません。
- 評価結果の分布は以下の通りです： - `pass`: 8件 - `needs-work`: 6件 - `fail`: 1件 (`docs/ja/specdojo/rulebooks/pm-risk-register-rulebook.md`) スコアは 69 から 100 の範囲に分布しており、特に `pm-` 系のルールブックで `needs-work` が多く見られる傾向にあります。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.bdd-rulebook.yaml`: 評価結果（スコア 96, `pass`）を記録しました。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.bes-rulebook.yaml`: 評価結果（スコア 97, `pass`）を記録しました。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.br-rulebook.yaml`: 評価結果（スコア 99, `pass`）を記録しました。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.ccd-mermaid-rulebook.yaml`: 評価結果（スコア 96, `pass`）を記録しました。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.cdt-rulebook.yaml`: 評価結果（スコア 100, `pass`）を記録しました。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.ifx-cmd-recipe.yaml`: 評価結果（スコア 100, `pass`）を記録しました。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.imp-test-rulebook.yaml`: 評価結果（スコア 86, `needs-work`）を記録しました。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.mm-rulebook.yaml`: 評価結果（スコア 77, `pass`）を記録しました。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pm-change-request-log-rulebook.yaml`: 評価結果（スコア 83, `needs-work`）を記録しました。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pm-issue-log-rulebook.yaml`: 評価結果（スコア 91, `needs-work`）を記録しました。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pm-quality-management-plan-rulebook.yaml`: 評価結果（スコア 81, `needs-work`）を記録しました。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pm-raci-rulebook.yaml`: 評価結果（スコア 82, `needs-work`）を記録しました。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pm-risk-register-rulebook.yaml`: 評価結果（スコア 69, `fail`）を記録しました。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.bes-recipe.yaml`: 評価結果（スコア 95, `pass`）を記録しました。
- `docs/ja/projects/prj-0001/execution/grade/results/specdojo.br-recipe.yaml`: 評価結果（スコア 100, `pass`）を記録しました。
- `docs/ja/projects/prj-0001/execution/jobs/runs/JBR-grade-kata-5aef174f1ae5.json`: Job Run の実行ステータスを更新しました。

## 3. 申し送り

- なし

## 4. 進め方

executor が実行した `tools/grade/run-per-document.sh` の終了コードおよび標準出力の `results.tsv` を解析し、各文書の評価ステータス (`status`)、判定 (`verdict`)、スコア (`score`) の分布を確認して報告をまとめました。
