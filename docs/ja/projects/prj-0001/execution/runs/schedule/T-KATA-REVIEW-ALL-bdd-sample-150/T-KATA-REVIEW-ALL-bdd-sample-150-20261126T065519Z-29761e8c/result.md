---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bdd-sample-150-20261126t065519z-29761e8c
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bdd-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bdd-sample-150/T-KATA-REVIEW-ALL-bdd-sample-150-20261126T065519Z-29761e8c/plan.md
  started_at: "2026-11-26T06:55:29.087Z"
  completed_at: "2026-11-26T07:05:24.660Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:bdd-sample
    - specdojo:bdd-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として `docs/ja/specdojo/samples/bdd-sample.yaml` を、ほかの sample と用語集に照らして見直し、食い違い 2 件を sample 側で直した。
- 直した内容は次の 2 点。価格の説明を税込に統一し、合計金額の例を 108 から 100 に変えた。つけの対象を常連客に限定し、`related_terms` に常連客を足した。
- 相手側（`sf-sample` の Q-01）を直す案と、ID の例の扱い（要判断）は handoff と findings に残した。
- executor の schema 検査と prettier は通過した。runner の `lint:md:changed`、`lint:fm:changed`、`validate:schema` なども通過した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 商品.標準販売価格、売上明細.販売単価、売上記録.合計金額 | 標準販売価格と販売単価を税抜としており、`ifx-api-sample` の `unit_price`（税込みの円）、`uis-sample` の税込単価、`dmd-sample`・`cdr-sample` の税込の円と食い違う。合計金額の例 108 は税抜 100 円に税を足した値で、ほかの sample の税込単価と合わない。`sf-sample` の Q-01 もこの食い違いを未決として挙げていた。 | 標準販売価格と販売単価の説明を一個あたりの税込価格に変え、合計金額の例を 108 から 100（100 円×1 個）に変えた。選ばなかった案は、`bdd-sample` を税抜のまま残し、`ifx-api`・`uis`・`dmd`・`cdr` の各 sample を税抜に直す案。業務上の意味が変わるため人が確かめる。 | vp-qe-kata-conformance（kata 相互）、vp-dev-change-impact。税込とする sample が 4 つある。 | 要判断 |
| R5-2 | R5 | 売上記録.支払方法、売上記録.顧客ID、売上記録`.related_terms` | 用語集（`gl-sample`）では、つけ（`tm-accounts-receivable`）を使えるのは店主代表が認めた常連客（`tm-sales-regular-customer`）だけ。`bdd-sample` の `credit` の表記と顧客IDの説明は「顧客のつけ」となっており、対象が常連客に限られることが読めない。 | `credit` の label を「常連客のつけとして後日受領する」、顧客IDの説明を「請求先の常連客を特定する」にし、売上記録の `related_terms` に `tm-sales-regular-customer` を足した。 | vp-qe-kata-conformance（kata 相互）。`gl-sample` の `tm-sales-regular-customer` の定義「顧客のうち、店主代表がつけの利用を認めた人」。 | - |
| R5-3 | R5 | `docs/ja/specdojo/samples/sf-sample.md` の Q-01（相手側） | R5-1 を採った場合、`sf-sample` の Q-01 の「画面の税込単価と業務データ辞書の税抜の販売単価の対応」が古い記述になる。 | 相手側は変更していない。直す案は、Q-01 の該当部分を「業務データ辞書も税込の販売単価とし、税区分と端数処理の条件は未決」に直すか、税抜との対応の項目を Q-01 から外すこと。R5-1 を戻す場合は不要。 | vp-dev-change-impact | - |
| R5-4 | R5 | 売上記録.売上ID、商品.商品ID の example | 売上IDの例 SALE-001 と商品IDの例 PRD-001 が、ほかの sample の ID の形と合わない。`uis-sample`・`ifx-file-sample`・`etc-sample`・`bes-sample` は取引番号を TX-YYYYMMDD-NNNN とし、`ifx-api-sample` の商品コードは 4〜13 桁の数字、`uis-sample` は 8 桁の数字としている。本部売上受付では、店舗の売上IDと本部売上IDの照合の手がかり（API の `transaction_id`）が `bdd-sample` から読めない。 | 例を変えなかった。売上IDを取引番号と同じものとしてよいか、商品IDを商品コードと同じものとしてよいかの根拠が見つからず（取り消した取引にも取引番号は振られ、`ccd-sample` も売上ID・商品IDの名前を使う）、変更を見送った。選ばなかった案は、売上IDの例を TX-20261108-0012、商品IDの例を 8 桁の数字に変え、本部売上IDの説明に照合は店舗の取引番号（`transaction_id`）で行うと足す案。人が同じものとしてよいかを決めたら `bdd-sample` と `ccd-sample` を一緒に直す。 | vp-qe-kata-conformance（kata 相互） | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bdd-sample.yaml`: 商品の標準販売価格と売上明細の販売単価の説明を税込の一個あたり価格に変え、売上記録の合計金額の例を 108 から 100 に変更した。支払方法 `credit` の label を「常連客のつけとして後日受領する」、顧客ID の説明を「請求先の常連客を特定する」に変え、売上記録の `related_terms` に `tm-sales-regular-customer` を追加した。

## 3. 申し送り

- `sf-sample` の Q-01 を直す作業は本タスクの対象外で、未実施。R5-1 を採る場合に別途必要になる。
- R5-1 と R5-4 は人の判断待ち。R5-4 は決まったら `bdd-sample` と `ccd-sample` を一緒に直す。
- R5-1: 段 R5 / 箇所 商品.標準販売価格、売上明細.販売単価、売上記録.合計金額 / 指摘 標準販売価格と販売単価を税抜としており、ifx-api-sample の `unit_price`（税込みの円）、uis-sample の税込単価、dmd-sample・cdr-sample の税込の円と食い違う。合計金額の例 108 は税抜 100 円に税を足した値で、ほかの sample の税込単価と合わない / 直した案 標準販売価格と販売単価の説明を一個あたりの税込価格に変え、合計金額の例を 108 から 100（100 円×1 個）に変えた / 根拠 vp-qe-kata-conformance（kata 相互）、vp-dev-change-impact。税込とする sample が 4 つで、sf-sample の Q-01 もこの食い違いを未決として挙げていた。選ばなかった案は、bdd-sample を税抜のまま残し、ifx-api・uis・dmd・cdr の sample を税抜に直す案。業務上の意味が変わるため人が確かめる / 印 要判断
- R5-2: 段 R5 / 箇所 売上記録.支払方法、売上記録.顧客ID、売上記録`.related_terms` / 指摘 用語集（gl-sample）では、つけ（tm-accounts-receivable）を使えるのは店主代表が認めた常連客（tm-sales-regular-customer）だけ。bdd-sample の credit の表記と顧客IDの説明は「顧客のつけ」となっており、対象が常連客に限られることが読めない / 直した案 credit の label を「常連客のつけとして後日受領する」、顧客IDの説明を「請求先の常連客を特定する」にし、売上記録の `related_terms` に tm-sales-regular-customer を足した / 根拠 vp-qe-kata-conformance（kata 相互）。gl-sample の tm-sales-regular-customer の定義「顧客のうち、店主代表がつけの利用を認めた人」 / 印 -
- R5-3: 段 R5 / 箇所 sf-sample の Q-01（相手側） / 指摘 R5-1 を採った場合、sf-sample の Q-01 の「画面の税込単価と業務データ辞書の税抜の販売単価の対応」が古い記述になる / 直した案 - / 根拠 vp-dev-change-impact。相手側の文書は docs/ja/specdojo/samples/sf-sample.md。直す案は、Q-01 の該当部分を「業務データ辞書も税込の販売単価とし、税区分と端数処理の条件は未決」に直すか、税抜との対応の項目を Q-01 から外すこと。R5-1 を戻す場合は不要 / 印 -
- R5-4: 段 R5 / 箇所 売上記録.売上ID、商品.商品ID の example / 指摘 売上IDの例 SALE-001 と商品IDの例 PRD-001 が、ほかの sample の ID の形と合わない。uis-sample・ifx-file-sample・etc-sample・bes-sample は取引番号を TX-YYYYMMDD-NNNN とし、ifx-api-sample の商品コードは 4〜13 桁の数字、uis-sample は 8 桁の数字としている。本部売上受付では、店舗の売上IDと本部売上IDの照合の手がかり（API の `transaction_id`）が bdd-sample から読めない / 直した案 - / 根拠 vp-qe-kata-conformance（kata 相互）。売上IDを取引番号と同じものとしてよいか、商品IDを商品コードと同じものとしてよいかの根拠が見つからず（取り消した取引にも取引番号は振られ、ccd-sample も売上ID・商品IDの名前を使う）、例を変えなかった。選ばなかった案は、売上IDの例を TX-20261108-0012、商品IDの例を 8 桁の数字に変え、本部売上IDの説明に照合は店舗の取引番号（`transaction_id`）で行うと足す案。人が同じものとしてよいかを決めたら bdd-sample と ccd-sample を一緒に直す / 印 要判断

## 4. 進め方と実践の型の適用

根拠にしたのは、同じ接頭辞の関連 sample（`ifx-api-sample`、`uis-sample`、`dmd-sample`、`cdr-sample`、`sf-sample`、`gl-sample` など）、用語集、`bdd.schema.yaml`、`sample-authoring-standard.md` である。基準は `vp-qe-kata-conformance`（kata 相互の整合）と `vp-dev-change-impact`。plan に展開された grade の finding と condense の記録はなかった。他の sample と用語集で根拠が揃った価格の税込統一と、つけの対象の限定は sample 側を直した。取引番号や商品コードとの対応は、同じものとしてよいかの根拠が見つからなかったため、推測で改訂せず見送って要判断とした。frontmatter の `status` は変更していない。
