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
  completed_at: "2026-11-15T20:06:28.815Z"
  agent: opus-executor
  approach: sample-maintenance
  targets:
    - specdojo:bds-sample
  block_reason: "agent exited with non-zero code: parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- bds の sample を最新の grade の指摘（F001〜F19）に沿って手直ししました。
- 営業日の根拠として、`cdsd-sample` に定義されている日次締め記録を使用するように変更し、休業日と記録漏れを区別できるようにしました。
- 未接続の業務イベント（つけ販売の確定・欠品記録）に関する事項を、受入対象と参考表示の境界として PO の判断事項に整理しました。
- 販売記録がない場合の明細表示に関する矛盾（欠品がある場合の表示ルール）を解消しました。
- 検証手順の記述において、本リポジトリでの実行例として提示する形に調整しました。
- 未解決事項の分類（課題・リスク・変更要求・決定待ち）と、将来の PJR 登録候補への引き継ぎ先を明記しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bds-sample.md`: grade の `major` 指摘に基づき、営業日の根拠（日次締め記録の利用）、業務イベントが未接続の間の受入範囲と補充候補の扱い、販売記録がない場合の明細表示ルール、および検証手順の記載方法を修正しました。また、未解決事項の分類と将来の PJR への引き継ぎ先（`specdojo:pjr-bds-sales-events` 等）を追記しました。

## 3. 申し送り

- `grade run --target kata` で `specdojo:bds-rulebook` と `specdojo:bds-sample` を再 grade し、sample が pass になったかを PJR-D948 の対応結果に追記する。
- 判断: 販売記録だけでは休業日と記録漏れを区別できないため、`cdsd-sample` に定義済みの日次締め記録を営業日の根拠にした。
- 判断: 業務イベント（つけ販売の確定・`bes-stock-out-recorded`）が揃うまでは、販売数と営業日数だけを受入の対象とし、欠品回数と補充候補は参考表示にする案を PO の判断事項として記載した。補充候補の基準が決まるまでは欠品 1 回以上を候補とする。
- 判断: rulebook が文書検査を『利用リポジトリの設定から決める』としているため、検査コマンドは『本リポジトリでは』と前置きした例示にとどめた。
- 引き継ぎ先の PJR (`specdojo:pjr-bds-sales-events`、`specdojo:pjr-restock-threshold`) は未登録のため、バッククォートで仮置きしている。
- `grade run --target kata` で specdojo:bds-rulebook と specdojo:bds-sample を再 grade し、sample が pass になったかを PJR-D948 の対応結果に追記する（実際の agent CLI を起動するため executor では未実行）。
- 判断: 販売記録だけでは休業日と記録漏れを区別できないため、cdsd-sample に定義済みの日次締め記録を営業日の根拠にした。
- 引き継ぎ先の PJR（`specdojo:pjr-bds-sales-events`、`specdojo:pjr-restock-threshold`）は未登録のため、バッククォートで仮置きしている。
- 人の確認が必要: `grade run --target kata`（実際の agent CLI を起動するため人間または runner が実行し、sample が pass になったかを確認する）

## 4. 進め方と実践の型の適用

帳票の sample を最新の grade の指摘に基づき、仕様の具体化・依存関係の明示・例外処理の定義・検証可能性の向上を目的として編集しました。
