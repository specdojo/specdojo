---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-msg-sample-150-20261126t075103z-90a9b694
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-msg-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-msg-sample-150/T-KATA-REVIEW-ALL-ifx-msg-sample-150-20261126T075103Z-90a9b694/plan.md
  started_at: "2026-11-26T07:51:14.042Z"
  completed_at: "2026-11-26T07:55:06.077Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:ifx-msg-sample
    - specdojo:ifx-msg-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `docs/ja/specdojo/samples/ifx-msg-sample.yaml` を、業務データ辞書 `specdojo:bdd-sample` の `product_id` の例 PRD-001 に合わせて直した。商品IDの書式と `subject` の例を揃えた。
- grade の F001〜F003 は前の段で解消済みだった。F004 は sample の側では対応済みで、相手側の `ifx-index-sample` に行を足す案を findings と handoff に残した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | `components.schemas.StockChangedData.properties.product_id` と `CloudEventStockChanged.properties.subject` | 商品IDの書式（例 PROD-0001、`pattern` が `^PROD-[0-9]{4}$`）が、業務データ辞書 `specdojo:bdd-sample` の `product_id` の例 PRD-001 と食い違っていた。 | `pattern` を `^PRD-[0-9]{3}$` にし、`subject` の例を `product/PRD-001` にした。`description` に業務データ辞書の `product_id` と書き足した。相手側への案は、`bdd-sample` の `product_id` の constraints に書式（`pattern`）を足して桁数を確定すること。 | vp-qe-kata-conformance、vp-dev-change-impact。`bdd-sample` には例だけで `pattern` がないため、3桁は例からの推測になる。PROD-0001 を残して `bdd-sample` の例を直す案は、`bdd-sample` が ready で正本のため選ばなかった。 | 要判断 |
| R5-2 | R5 | `x-spec-meta.based_on` と `info.description` | `based_on` の `specdojo:ifx-index-sample` に「本部への在庫変更通知」の行がない（grade F004）。sample の側は、連携名と一覧に未掲載であることを `info.description` と `based_on` のコメントに書いてあり、直す必要はない。 | 相手側への案: `docs/ja/specdojo/samples/ifx-index-sample.yaml` の `interfaces` に「本部への在庫変更通知」の行を足す。source は店舗端末の販売管理 CLI、target は本部の在庫集計、direction は outbound、kind はメッセージ、timing は販売の確定・仕入れの登録・棚卸しの訂正で在庫数が変わった時、`spec_ref` は `specdojo:ifx-msg-sample` とする。そのうえで `ifx-msg-sample` の `based_on` のコメントと `info.description` の「一覧に未掲載」を消す。 | vp-qe-kata-conformance。`ifx-index-sample` は単一店舗の CLI の3連携に範囲を絞っているため、行を足すかは PO の判断になる。 | 要判断 |
| R5-3 | R5 | `info.description` と `channels.inventory.stock.changed.description` | 発行者の名前「店舗端末の在庫管理」が、`ifx-index-sample` の店舗側システムの名前「店舗端末の販売管理 CLI」と揃っていない。 | sample はそのまま残した。相手側への案: `ifx-index-sample` に行を足すときに、source を「店舗端末の販売管理 CLI」にするか「店舗端末の在庫管理」にするかを揃え、rulebook の良い例も同じ名前にする。 | vp-qe-kata-conformance。rulebook の記述ガイド「向きと送信者・受信者」の良い例が「店舗端末の在庫管理」なので、sample は変えなかった。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-msg-sample.yaml`: 商品IDの `pattern` を `^PROD-[0-9]{4}$` から `^PRD-[0-9]{3}$` に変え、`subject` の例を `product/PRD-001` にした。`description` に業務データ辞書の `product_id` と対応することを書き足した（3行追加・3行削除）。

## 3. 申し送り

- `npx prettier --check` と runner の `lint:md:changed`、`lint:fm:changed`、`validate:schema` などは passed。`validate:schema:file` は、対象が `specdojo-schema: none` の AsyncAPI のため `not_applicable`。
- grade の finding F001〜F003 は前の段で直っており、この段では F004 だけを扱った。
- R5-1: R5 / `components.schemas.StockChangedData.properties.product_id` と CloudEventStockChanged.properties.subject / 商品ID の書式（例 PROD-0001、pattern ^PROD-[0-9]{4}$）が業務データ辞書 specdojo:bdd-sample の `product_id` の例 PRD-001 と食い違う / pattern を ^PRD-[0-9]{3}$、subject の例を product/PRD-001 にし、description に業務データ辞書の `product_id` と書き足した / vp-qe-kata-conformance（kata 相互と適用先）、vp-dev-change-impact。bdd-sample には例しかなく pattern がないため、桁数（3 桁）は例 PRD-001 からの推測になる。選ばなかった案は、PROD-0001 を残して bdd-sample の例を直すこと（bdd-sample が ready で正本のため選ばなかった）。相手側への案: bdd-sample の `product_id` の constraints に書式（pattern）を足して桁数を確定する / 要判断
- R5-2: R5 / `x-spec-meta.based_on` と info.description / `based_on` の specdojo:ifx-index-sample に「本部への在庫変更通知」の行がない（grade F004）。sample の側は、連携名と一覧にまだ載っていないことを info.description と `based_on` のコメントに書いてあり、直さなくてよい / - / vp-qe-kata-conformance。相手側への案: docs/ja/specdojo/samples/ifx-index-sample.yaml の interfaces に「本部への在庫変更通知」の行（source: 店舗端末の販売管理 CLI、target: 本部の在庫集計、direction: outbound、kind: メッセージ、timing: 販売の確定・仕入れの登録・棚卸しの訂正で在庫数が変わった時、`spec_ref:` specdojo:ifx-msg-sample）を足す。そのうえで ifx-msg-sample の `based_on` のコメントと info.description の「一覧に未掲載」を消す。ifx-index-sample は単一店舗の CLI の 3 連携に範囲を絞っており、行を足すかは PO の判断になる / 要判断
- R5-3: R5 / info.description・channels.inventory.stock.changed.description / 発行者の名前「店舗端末の在庫管理」が、ifx-index-sample の店舗側システムの名前「店舗端末の販売管理 CLI」と揃っていない / - / vp-qe-kata-conformance。rulebook の記述ガイド「向きと送信者・受信者」の良い例が「店舗端末の在庫管理」なので、sample はそのまま残した。相手側への案: ifx-index-sample に行を足すときに、source を「店舗端末の販売管理 CLI」にするか「店舗端末の在庫管理」にするかを揃え、rulebook の良い例も同じ名前にする / 要判断
- 適用外の検証: `npm run validate:schema:file`（対象ファイルは先頭行の `# specdojo-schema: none reason=external-asyncapi` で SpecDojo の schema の対象外になっており、--schema に渡す schema がない）
- 適用外の検証: `npm run validate:history-links`（変えたのは docs/ja/specdojo/samples/ifx-msg-sample.yaml だけで、plan・result・個票を変えていない）

## 4. 進め方と実践の型の適用

sample メンテナンスの進め方に従い、同じ接頭辞の sample、`bdd-sample`、rulebook の記述ガイドを突き合わせて食い違いを確かめた。sample の側だけを直した。相手側を直すべき点は変更せず、案を findings に書いた。桁数の `pattern` は例 PRD-001 からの推測になる。このため `bdd-sample` 側に書式を足す案を要判断とした。
