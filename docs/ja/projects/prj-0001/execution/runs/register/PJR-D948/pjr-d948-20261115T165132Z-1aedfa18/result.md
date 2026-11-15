---
specdojo:
  id: prj-0001:xer-pjr-d948-20261115t165132z-1aedfa18
  type: exec-result
  task_id: PJR-D948
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-D948/pjr-d948-20261115T165132Z-1aedfa18/plan.md
  started_at: "2026-11-15T16:51:48.634Z"
  completed_at: "2026-11-15T21:20:05.747Z"
  agent: opus-executor
  approach: sample-maintenance
  targets:
    - specdojo:bds-sample
---

# Edit Result

## 1. 実施内容

- bds-sample を grade の F001〜F019 に合わせて直した（営業日の根拠に日次締め記録を追加、例外と明細の規則の矛盾を解消、閲覧範囲・確定条件・未整備事項の分類と引き継ぎ先を追加）。rulebook は変えていない。個票の対応結果に実施内容・判断・残課題を記入した。再 grade は agent CLI を起動するため未実行。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bds-sample.md`: 変更、+47 / -36 行

## 3. 申し送り

- `grade run --target kata` で specdojo:bds-rulebook と specdojo:bds-sample を再 grade し、sample が pass になったかを PJR-D948 の対応結果に追記する（実際の agent CLI を起動するため executor では未実行）。
- 判断: 販売記録だけでは休業日と記録漏れを区別できないため、cdsd-sample に定義済みの日次締め記録を営業日の根拠にした。
- 判断: 業務イベント（つけ販売の確定・`bes-stock-out-recorded`）が揃うまでは、販売数と営業日数だけを受入の対象とし、欠品回数と補充候補は参考表示にする案を PO の判断事項として記載した。補充候補の基準が決まるまでは欠品 1 回以上を候補とする。
- 判断: rulebook が文書検査を『利用リポジトリの設定から決める』としているため、検査コマンドは『本リポジトリでは』と前置きした例示にとどめた。
- 引き継ぎ先の PJR（`specdojo:pjr-bds-sales-events`、`specdojo:pjr-restock-threshold`）は未登録のため、バッククォートで仮置きしている。
- 人の確認が必要: `grade run --target kata`（実際の agent CLI を起動するため人間または runner が実行し、sample が pass になったかを確認する）

## 4. 進め方と実践の型の適用

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
