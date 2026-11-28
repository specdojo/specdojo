---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bdd-sample-110-20261125t083122z-57e31985
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bdd-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bdd-sample-110/T-KATA-REVIEW-ALL-bdd-sample-110-20261125T083122Z-57e31985/plan.md
  started_at: "2026-11-25T08:31:32.624Z"
  completed_at: "2026-11-25T08:46:09.165Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:bdd-sample
    - specdojo:bdd-sample
---

# Edit Result

## 1. 実施内容

- kata のレビューの段 R1（目的の過不足）を実施した。`bdd-sample` の `支払い` エンティティが、`ifx-api-sample` に存在しない `CreatePaymentResponse` を `schema_ref` で参照していた。決済サービスは共通サンプル文脈と `ccd-sample` の対象外でもある。そこで実在する `CreateSaleResponse` を参照する `本部売上受付` に差し替えた。
- `売上記録` の説明にあった決済サービスへの言及も、本部の受付に言い換えた。
- schema 検査（`bdd.schema.yaml`）と Prettier の検査は通過した。runner の検査では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通過した。
- 指摘は 4 件。内訳は直した 2 件、要判断 1 件、見送り 1 件で、要判断の指摘は R1-1 と R1-3。R1-4 は R5 に回した。次の表にまとめる。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R1-1 | R1 | `entities` の `支払い`（現 `本部売上受付`） | `schema_ref` が `ifx-api-sample` にない `CreatePaymentResponse` を指し、題材の決済サービスも対象外 | `本部売上受付`（`hq_sale_acceptance`）に差し替え、`schema_ref` を `CreateSaleResponse` にした。注釈は `sale_id` と `status` の 2 項目 | `vp-po-purpose-alignment`、`vp-qe-kata-conformance`、bdd-rulebook | 要判断 | | R1-2 | R1 | `売上記録` の `sold_at`・`payment_method` の説明 | 対象外の決済サービスを区別の相手として説明していた | 「本部が売上を受け付けた時点」「本部への登録の受付状態とは別の判断軸」に言い換えた | `vp-qe-kata-conformance`、R1-1 との一貫性 | - | | R1-3 | R1 | `entities` 全体 | rulebook が挙げる `type_ref` の例が sample にない | 変更なし。架空のパスはデッドリンクになるため見送った | rulebook の悪い例（推測の参照） | 要判断 | | R1-4 | R1 | `売上明細` の `unit_price`、`売上記録` の `sale_id` | `ifx-api-sample` は税込、`bdd-sample` は税抜で、売上IDと取引IDの関係も未提示 | 変更なし。R5 で正を決める | `vp-qe-kata-conformance`（kata 相互） | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bdd-sample.yaml`: `支払い` エンティティを、実在する `CreateSaleResponse` を `schema_ref` で参照する `本部売上受付`（`hq_sale_acceptance`）に差し替えた。注釈は `sale_id` と `status` の 2 項目にした。`売上記録` の `sold_at`・`payment_method` の説明から決済サービスへの言及を外し、本部の受付に言い換えた。差分は 15 行追加、19 行削除。

## 3. 申し送り

- R1-1（要判断）: 選ばなかった案として、`支払い` エンティティを削って `schema_ref` の例をなくす案がある。この案は rulebook の 3 形態のうち 2 つしか示せなくなるため採らなかった。差し替えは R4・R5 の範囲にもかかるため、人が採否を決める。
- R1-3（要判断）: rulebook に「題材に型の正本がない場合は `type_ref` の例を省いてよい」と書くか、sample の対象範囲を人が決める。
- R1-4: `bdd-sample` と `ifx-api-sample` のどちらを正とするかは R5 で決める。rulebook など sample 以外は変更していない。
- R1-1: R1 / entities の 支払い（現 本部売上受付） / `schema_ref` が ifx-api-sample に存在しない `#/components/schemas/CreatePaymentResponse` を指し、rulebook の「schema があるエンティティ」の例として成り立っていない。題材の決済サービスは共通サンプル文脈の対象外で、ccd-sample も「決済サービスの応答は対象外」としている / エンティティを `本部売上受付`（`hq_sale_acceptance`）に差し替え、`schema_ref` を `docs/ja/specdojo/samples/ifx-api-sample.yaml#/components/schemas/CreateSaleResponse` にした。注釈は `sale_id`（本部が採番、店舗の売上IDと読み替えない）と `status`（`allowed_values_detailed` は `ACCEPTED` のみ）の 2 項目とし、`type`・`constraints` は再掲しない / `vp-po-purpose-alignment`、`vp-qe-kata-conformance`（種別の責務: 共通サンプル文脈に統一・デッドリンク禁止）、bdd-rulebook の「schema があるエンティティ（スキーマ参照: `schema_ref`）」 / 要判断（選ばなかった案: 支払いエンティティを削り `schema_ref` の例をなくす案は、rulebook の 3 形態のうち 2 つしか示せなくなるため採らなかった。差し替えは R4・R5 の範囲にもかかるため、人が採否を決める）
- R1-2: R1 / entities の 売上記録（`sold_at`・`payment_method` の説明） / 対象外の決済サービスを区別の相手として説明していた（「外部決済の応答時点」「決済サービスの処理状態とは別の判断軸」） / 「本部が売上を受け付けた時点」「本部への登録の受付状態とは別の判断軸」に言い換えた / `vp-qe-kata-conformance`（共通サンプル文脈に統一）、R1-1 との一貫性 / -
- R1-3: R1 / entities 全体 / rulebook の「schema のないエンティティの選定基準」が挙げる TypeScript 型参照（`type_ref`）の例が sample にない / - / 駄菓子屋の題材には参照できる TypeScript 型の正本がなく、架空のパスを足すとデッドリンク禁止に反するため見送った。rulebook 側に「題材に型の正本がない場合は `type_ref` の例を省いてよい」と書くか、sample の対象範囲を人が決める / 要判断（選ばなかった案: 架空の `src/types/...` を `type_ref` に置く案はデッドリンクと推測の参照（rulebook の悪い例）に当たるため採らなかった）
- R1-4: R1 / 売上明細の `unit_price`、売上記録の `sale_id` / bdd-sample は販売単価を税抜とするが、ifx-api-sample の `SaleLine.unit_price` は「販売単価（税込みの円）」。店舗の売上ID（`SALE-001`）と API の取引ID（`TX-...`）の関係も示されていない / - / 種別の責務の範囲外で、sample 相互の食い違いにあたる。R5 で bdd-sample と ifx-api-sample のどちらを正とするかを決める（`vp-qe-kata-conformance`（kata 相互）） / -
- 適用外の検証: `npx markdownlint`（変更したファイルは YAML の sample のみで、Markdown を変更していない）
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/bdd-sample.yaml のみで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

根拠にしたのは、bdd-rulebook の「schema があるエンティティ」の定義、共通サンプル文脈、`ccd-sample` の対象範囲、`ifx-api-sample` の実在するスキーマ、`vp-po-purpose-alignment`、`vp-qe-kata-conformance` である。plan に展開された grade の finding と condense の finding はなかった。種別の責務（共通サンプル文脈への統一、デッドリンク禁止）と rulebook の目的に照らし、対象外の決済サービスを前提にした記述と、存在しない `schema_ref` の参照を直した。rulebook と整合する記述は維持した。R1 の範囲を超える税込・税抜の食い違いと、`type_ref` の例の扱いは、推測で直さずに申し送りとして残した。
