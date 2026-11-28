---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-sac-sample-050-20261123t133037z-c0f24098
  type: exec-result
  task_id: T-KATA-WAVE-4-sac-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-sac-sample-050/T-KATA-WAVE-4-sac-sample-050-20261123T133037Z-c0f24098/plan.md
  started_at: "2026-11-23T13:30:45.912Z"
  completed_at: "2026-11-23T13:44:03.014Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sac-sample
    - specdojo:sac-sample
---

# Edit Result

## 1. 実施内容

- sac-sample.md を「システム受入条件: 性能」の完成例に書き直しました。
- frontmatter に `based_on` を追加し、`rulebook` に即した 3 章構成（概要、受入条件、メモ / 将来課題）へと再構成しました。
- 受入条件として `SAC-PERF-01` から `SAC-PERF-04` を定義し、rulebook が推奨するシナリオ形式（前提・操作・期待結果・判定方法）を用いて、具体的な検証可能な内容を記述しました。
- 決める必要がある値（応答時間の基準、処理件数、ホスティング環境のプランなど）は、`_UNDECIDED_` を用いて、将来の論点およびその影響と共に「メモ / 将来課題」に記述しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sac-sample.md`: `rulebook` の標準構成に従い、抽象的なカテゴリリストから、駄菓子屋きぬやの具体的な性能目標（会計確定、日次締めなど）に基づいた検証可能な受入条件の完成例へとリライトしました。また、`based_on` による根拠の紐付けや、未確定事項の扱いについても整備しました。

## 3. 申し送り

- F004（役割コード・責任者）と F024（ready にするための終了条件・レビュー担当）は、PJR-76N9 の決まりに従い本文に足していない。sac-rulebook 側でも判定する人の割り当てを本文で求めていないため、rulebook の変更は不要と判断した。
- 商品検索の応答（nfr-perf-004）は根拠の NFR で値を記録するだけになっているため、受入条件を置かずメモ / 将来課題に回した。基準が決まったら SAC-PERF-05 を追加する。
- 決める必要のある値 (すべて `_UNDECIDED_` のまま、正本は nfr-performance-sample): 会計確定の応答時間の基準（P95・P99）、ピーク時の処理件数、つけ残高表示の応答時間の基準、日次締めの完了時間、商品検索の応答時間の基準、商品数と保持する販売記録の件数、ホスティング環境のプラン。
- 文書間の整合: nfr-performance / nfr-reliability / nfr-availability / nfr-integrity の各 sample は受入条件を `sac-performance` などの仮の名前で参照しており、tsp-index-sample は「SAC の条件 ID が未整備」としている。この sample（specdojo:sac-sample = 性能）へ接続するかどうかは、別のタスクで判断と修正が必要。
- sac-rulebook の変更案: rulebook 内に「サンプル（簡易）」の節はもう無いため、F021 は sample 側の対応だけで解消している。rulebook の変更案はない。
- 決める必要のある値（すべて `_UNDECIDED_` のまま、正本は nfr-performance-sample）: 会計確定の応答時間の基準（P95・P99）、ピーク時の処理件数、つけ残高表示の応答時間の基準、日次締めの完了時間、商品検索の応答時間の基準、商品数と保持する販売記録の件数、ホスティング環境のプラン。

## 4. 進め方と実践の型の適用

rulebook に基づき、`sac-sample.md` を「システム受入条件（性能）」の具体的な完成例として厚くしました。`grade` の指摘（finding）に従い、抽象的な記述を具体的な受入条件（シナリオ形式）へと置き換え、`based_on` による根拠の明示や、未決定事項の `_UNDECIDED_` による管理を行うことで、実践的なサンプルへと昇華させました。
