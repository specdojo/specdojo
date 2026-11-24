---
specdojo:
  id: prj-0001:xer-t-kata-wave-5-dmd-index-sample-050-20261123t072020z-c6f3367c
  type: exec-result
  task_id: T-KATA-WAVE-5-dmd-index-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-dmd-index-sample-050/T-KATA-WAVE-5-dmd-index-sample-050-20261123T072020Z-c6f3367c/plan.md
  started_at: "2026-11-23T07:20:28.904Z"
  completed_at: "2026-11-23T07:37:32.449Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:dmd-index-sample
    - specdojo:dmd-index-sample
---

# Edit Result

## 1. 実施内容

- sample 文書 `docs/ja/specdojo/samples/dmd-index-sample.md` を、駄菓子屋きぬやの共通サンプル文脈に基づいた完成例へと更新しました。
- grade による指摘事項（F001〜F017）に対し、概要への目的・範囲の追記、検証手順と証跡保管先の定義、`mip-index` との整合性、および `_UNDECIDED_` を用いた未解決事項の明示を行うことで、型としての厚みを確保しました。
- `run_id` の表記揺れをインラインコードで統一し、`_UNDECIDED_` を用いて、利用者が決定すべき事項（作業フォルダの扱い、照合表の保管期間）を明示しました。
- `prettier` および `markdownlint` による静的検査をパスしています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dmd-index-sample.md`: 共通サンプル文脈（駄菓子屋きぬや）に合わせて、移行の目的、範囲、検証手順、証跡保管先、および `_UNDECIDED_` を用いた未決定事項を追記し、型としての完成度を高めました。

## 3. 申し送り

- `_UNDECIDED_` の値 2 件は店主代表が決める: 移行作業フォルダ `migration/&lt;run_id&gt;/` の控えをタブレットの外に残すかとその置き場所、照合表と旧ノートを残す期間（`mip-index` が `dmd-index` に決定を任せた値）。
- rulebook への変更案: 対象一覧の推奨列には、`mip-index` との対応や除外の理由を書く列がない。sample では「`mip-index` との対応・除外の理由」列を足した。rulebook の推奨列に加えるか判断が必要。
- 対象別の `dmd-item-data`・`dmd-stock-data`・`dmd-credit-data` は未作成のため、バッククォートで仮置きした。既存の `dmd-sample.md` は受注データの題材のままで、本 sample と題材がそろっていない。直す場合は別タスクで扱う。
- F008（照合の合否を誰が決めるか）: PJR-76N9 の決まりを守るため、文書を作る・確かめる・承認する役割は書かず、`mip-index` の成功条件にある判定者を参照する形にした。判定者は移行の業務の役割であり、文書の承認ではない。
- 適用外の検証: `npm run validate:history-links`（変更したのは `docs/ja/specdojo/samples/` 配下の sample だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown だけで、`*.yaml` / `*.yml` を変更していない）

## 4. 進め方と実践の型の適用

「成果物 → sample」の参照向きに基づき、`grade` の各 `finding` を解消するように `docs/ja/specdojo/samples/dmd-index-sample.md` を編集しました。通用性の低い汎用的な記述（受注・請求・監査ログ等）を、共通の業務文脈（駄菓子屋きぬやの販売記録・在庫・つけ台高）に書き換え、`_UNDECIDED_` を活用して、決定が必要な値を明確にすることで、型としての実例としての厚みを持たせました。
