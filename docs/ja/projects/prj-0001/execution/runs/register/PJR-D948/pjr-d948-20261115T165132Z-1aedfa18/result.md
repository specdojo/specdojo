---
specdojo:
  id: prj-0001:xer-pjr-d948-20261115t165132z-1aedfa18
  type: exec-result
  task_id: PJR-D948
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-D948/pjr-d948-20261115T165132Z-1aedfa18/plan.md
  started_at: "2026-11-15T16:51:48.634Z"
  completed_at: "2026-11-15T17:19:49.461Z"
  agent: opus-executor
  approach: sample-maintenance
  targets:
    - specdojo:bds-sample
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- bds の sample を最新の grade 指摘に基づいて手直ししました。
- 営業日の根拠として、販売記録だけでなく `cdsd-sample` で定義されている日次締め記録を参照するように変更し、休業日と記録漏れを区別できるようにしました。
- 未整備の業務イベント（つけ販売の確定、欠品記録）については、暫定的に販売数と営業日数のみを受入対象とし、欠品情報や補充候補は判断事項として扱うよう構成を変更しました。
- 補充候補の基準や、報告の公開・承認に関する条件、未解決事項の分類方法を具体化しました。
- 検証コマンドについても、本リポジトリでの実行例として記述を調整しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bds-sample.md`: grade の指摘（F001〜F019）に基づき、営業日の根拠への日次締め記録の追加、例外（明細なし）と詳細表示の整合性確保、未決事項の分類と担当 Role code の明記、検証コマンドの記述調整を行いました。

## 3. 申し送り

- `grade run --target kata` で `specdojo:bds-rulebook` と `specdojo:bds-sample` を再 grade し、sample が pass になったかを PJR-D948 の対応結果に追記する。
- `grade run --target kata` で specdojo:bds-rulebook と specdojo:bds-sample を再 grade し、sample が pass になったかを PJR-D948 の対応結果に追記する（実際の agent CLI を起動するため executor では未実行）。
- 判断: 販売記録だけでは休業日と記録漏れを区別できないため、cdsd-sample に定義済みの日次締め記録を営業日の根拠にした。
- 判断: 業務イベント（つけ販売の確定・`bes-stock-out-recorded`）が揃うまでは、販売数と営業日数だけを受入の対象とし、欠品回数と補充候補は参考表示にする案を PO の判断事項として記載した。補充候補の基準が決まるまでは欠品 1 回以上を候補とする。
- 判断: rulebook が文書検査を『利用リポジトリの設定から決める』としているため、検査コマンドは『本リポジトリでは』と前置きした例示にとどめた。
- 引き継ぎ先の PJR（`specdojo:pjr-bds-sales-events`、`specdojo:pjr-restock-threshold`）は未登録のため、バッククォートで仮置きしている。
- 人の確認が必要: `grade run --target kata`（実際の agent CLI を起動するため人間または runner が実行し、sample が pass になったかを確認する）

## 4. 進め方と実践の型の適用

帳票の sample を最新の grade の指摘で修正する。判明している指摘事項を解消するため、根拠となる業務イベントや記録の定義を具体化し、業務上の例外ケース（休業日や記録漏れ）への対応方針を明記した。
