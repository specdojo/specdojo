---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-etc-index-sample-050-20261121t124017z-5da72356
  type: exec-result
  task_id: T-KATA-WAVE-3-etc-index-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-etc-index-sample-050/T-KATA-WAVE-3-etc-index-sample-050-20261121T124017Z-5da72356/plan.md
  started_at: "2026-11-21T12:40:29.331Z"
  completed_at: "2026-11-21T12:50:58.892Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:etc-index-sample
    - specdojo:etc-index-sample
---

# Edit Result

## 1. 実施内容

- rulebook の必須構成（第1章〜第8章）に基づき、`docs/ja/specdojo/samples/etc-index-sample.md` を駄菓子屋きぬやの外部結合テストカタログの完成例として全面的に再構成しました。
- 題材は、`tsp-index-sample` および `ifd-sample` の範囲に含まれる `receipt-print`（レシート印刷）と `backup-storage`（復元用保管サービス）を採用し、共通サンプル文脈としての整合性を確保しました。
- 指摘事項（F001〜F027）に対応するため、適用範囲の明記、対象外事項の表形式での定義、外部依存（sandbox/スタブ・テスト用資格情報の管理）の具体例、および `case_id` の形式を含むケース表の作成を行いました。
- これらにより、成果物としての完成度（品位）を高めています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/etc-index-sample.md`: rulebook の構成（第1章〜第8章）に沿って、駄菓子屋きぬやの外部結合テストカタログの完成例として全面的に書き直しました。題材は `receipt-print` と `backup-storage` に設定し、対象外事項や外部依存のリスク、`case_id` の生成規則、および合格基準の具体例を盛り込んでいます。

## 3. 申し送り

- rulebook への変更案: `etc-index-rulebook` の記述ガイド 6.3・6.6・6.8 の良い例・悪い例は決済連携（本番決済口座、`etc-payment-gateway`、`et-payment-gateway-retry-idempotency-010`）を使っている。共通サンプル文脈と `tsp-index-sample` では、キャッシュレス決済と仕入れ先連携は初期リリースの対象外である。そのため sample では `receipt-print` と `backup-storage` の例に置き換え、決済・仕入れ先連携は対象外の表に入れた。rulebook の例も印刷か保管サービスに揃えるかを判断してほしい。
- F004・F008・F013 が例として挙げた決済端末連携・仕入れ先への発注ファイル連携・`et-payment-gateway-idempotency-001` は、題材の整合を優先して採用しなかった。指摘の趣旨（`&lt;term&gt;` の分割と主担当、対象外の4列表、`case_id` の記入例）は、印刷と保管サービスの例で満たした。
- 兄弟の `etc-sample.md` (`specdojo:etc-sample`) は旧来の「最小サンプル」形式のまま残っている。本 sample で決めた分割（`etc-receipt-print` / `etc-backup-storage`）に合わせて厚くする後続タスクが必要である。
- cspell は実行の承認が下りず、走らせていない。
- rulebook への変更案: etc-index-rulebook の記述ガイド 6.3・6.6・6.8 の良い例・悪い例は決済連携（本番決済口座、`etc-payment-gateway`、`et-payment-gateway-retry-idempotency-010`）を使っている。共通サンプル文脈と tsp-index-sample では、キャッシュレス決済と仕入れ先連携は初期リリースの対象外である。そのため sample では receipt-print と復元用保管サービスの例に置き換え、決済・仕入れ先連携は対象外の表に入れた。rulebook の例も印刷か保管サービスに揃えるかを判断してほしい。
- 兄弟の etc-sample.md（specdojo:etc-sample）は旧来の「最小サンプル」形式のまま残っている。本 sample で決めた分割（`etc-receipt-print` / `etc-backup-storage`）に合わせて厚くする後続タスクが必要である。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/etc-index-sample.md だけで、plan・result・個票などの履歴ファイルを変更していないため）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 配下だけで、docs/ja/projects/ 配下の成果物に変更がないため）

## 4. 進め方と実践の型の適用

rulebook の指示に従い、`etc-index-sample.md` を「入力情報」や「記述内容」といった手引きの形式から、具体的な「完成例」へと書き換えました。`tsp-index-sample` との依存関係を `based_on` で明示し、業務リスク（レシート印刷の失敗やデータ復元の不備）に即した観点を定義しています。
