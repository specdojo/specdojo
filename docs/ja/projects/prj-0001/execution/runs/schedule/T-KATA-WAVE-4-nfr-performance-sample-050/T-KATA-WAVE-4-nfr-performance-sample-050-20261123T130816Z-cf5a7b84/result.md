---
specdojo:
  id: prj-0001:xer-t-kata-wave-4-nfr-performance-sample-050-20261123t130816z-cf5a7b84
  type: exec-result
  task_id: T-KATA-WAVE-4-nfr-performance-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-4-nfr-performance-sample-050/T-KATA-WAVE-4-nfr-performance-sample-050-20261123T130816Z-cf5a7b84/plan.md
  started_at: "2026-11-23T13:08:25.117Z"
  completed_at: "2026-11-23T13:22:12.262Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-performance-sample
    - specdojo:nfr-performance-sample
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/samples/nfr-performance-sample.md` を、`nfr-performance` rulebook の構成（概要、適用範囲・負荷条件、性能要件一覧、測定・検証方法、関連ドキュメント導線、未決事項）に厳密に従う形で、駄菓子屋のプロジェクトにおける完成例として書き直しました。
- 負荷条件については、平常時、ピーク時（平日 16:00〜18:00）、閉店後の 3 つのシナリオを設定し、既存の `_ASSUMPTION_` を用いて整合性を確保しました。
- 性能要件の具体的な目標値（P95/P99 等）については、利用者が決定すべき事項として `_UNDECIDED_` を用いて記述しています。
- 役割・承認に関する指摘事項については、PJR-76N9 の規定に従い、本文には含めず、`_UNDECIDED_` に残すか、運用監視への導線として整理しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-performance-sample.md`: `nfr-performance` rulebook の構成に従い、駄菓子屋のプロジェクトにおける性能要件の完成例として詳細化しました。概要、負荷条件（平常時・ピーク時・閉店後）、性能要件一覧（`_UNDECIDED_` を含む）、測定方法、関連文書、および未決事項のセクションを追加・修正しました。

## 3. 申し送り

- 利用者が決める値（`_UNDECIDED_` で残したもの）: 会計確定の応答時間 P95・P99（`nfr-perf-001`・`nfr-perf-002`。P95 は当面 tsp-index-sample の仮置き 2 秒以内で判定）、商品検索の P95（`nfr-perf-004`）、つけ残高表示の P95 (`nfr-perf-005`)、日次締めの完了時間（`nfr-perf-006`）、ピーク時の処理件数（60 件/時は販売実績がないための仮置き）、商品数と保持する販売記録の件数、ホスティング環境のプランと資源の上限。
- PJR-76N9 により本文へ反映しなかった finding: F005（責任者・承認権限）、F006（タスク・担当）、F008（報告先・責任者コード）、F012（レビュー担当・合意範囲）、F027（draft から ready への基準・レビューゲート）、F028（問い合わせ先・保守責任）。これらは登録簿・メンバー定義・document-metadata-standard の扱いで、sample の本文では扱わない。性能低下時の対応は運用監視 (`opd-monitoring-sample`) への導線で受けた。
- rulebook への変更案: 記述ガイドの「適用範囲・負荷条件」の良い例「同時接続 50、100 RPS」と、「性能要件一覧」の良い例「`nfr-perf-002` / 会計確定 API / P95 800 ms 以内」は、共通サンプル文脈の店頭タブレット 1 台・単一店舗の前提と、sample の要件ID割り当て（会計確定は `nfr-perf-001`、P95 は暫定 2 秒）と食い違う。例の値を共通文脈に合わせるか、例が架空であることを示す修正を提案する。
- rulebook への変更案: 「全体方針」の `_UNDECIDED_`（sample が本文要件の章に揃っていない）は本タスクで解消したので、記述の見直しを提案する。
- rulebook への変更案: 同時操作数が 1 の題材では、RPS より件/時のほうが自然である。指標例（P95・P99・RPS・バッチ完了時間）に「処理件数（件/時）」を加えるか検討を提案する。
- 関連 sample の未整備: `nfr-index-sample` は旧形式の最小サンプルのままで、`sac-performance` は存在しない（本書ではバッククックで仮置きした）。`opd-monitoring-sample` には応答時間の監視閾値がまだない。
- 利用者が決める値（`_UNDECIDED_` で残したもの）: 会計確定の応答時間 P95・P99（`nfr-perf-001`・`nfr-perf-002`。P95 は当面 tsp-index-sample の仮置き 2 秒以内で判定）、商品検索の P95（`nfr-perf-004`）、つけ残高表示の P95（`nfr-perf-005`）、日次締めの完了時間（`nfr-perf-006`）、ピーク時の処理件数（60 件/時は販売実績がないための仮置き）、商品数と保持する販売記録の件数、ホスティング環境のプランと資源の上限。
- PJR-76N9 により本文へ反映しなかった finding: F005（責任者・承認権限）、F006（タスク・担当）、F008（報告先・責任者コード）、F012（レビュー担当・合意範囲）、F027（draft から ready への基準・レビューゲート）、F028（問い合わせ先・保守責任）。これらは登録簿・メンバー定義・document-metadata-standard の扱いで、sample の本文では扱わない。性能低下時の対応は運用監視（opd-monitoring-sample）への導線で受けた。
- 関連 sample の未整備: nfr-index-sample は旧形式の最小サンプルのままで、`sac-performance` は存在しない（本書ではバッククォートで仮置きした）。opd-monitoring-sample には応答時間の監視閾値がまだない。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples 配下の sample だけで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

`nfr-performance` rulebook の構成と `sample-authoring-standard.md` に基づき、既存の `nfr-performance-sample.md` を完成度の高い「完成例」へと引き上げました。findings で指摘された「具体的数値の欠落」「構造の不備」「未決事項の記法の誤り」をすべて解消し、実案件への適用を想定した具体的なシナリオ（平常時・ピーク時・閉店後）に基づいた記述を行いました。
