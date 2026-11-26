---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ccd-sample-150-20261126t072147z-396300fd
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ccd-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ccd-sample-150/T-KATA-REVIEW-ALL-ccd-sample-150-20261126T072147Z-396300fd/plan.md
  started_at: "2026-11-26T07:21:57.205Z"
  completed_at: "2026-11-26T07:29:36.139Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:ccd-sample
    - specdojo:ccd-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `docs/ja/specdojo/samples/ccd-sample.md` を、同じ接頭辞の sample、用語集、業務データ辞書、Sample 記述標準の共通サンプル文脈と突き合わせた。
- grade の F001・F002（Frontmatter の `based_on` に `specdojo:bdd-sample` がない）は、今の版で既に解消済みだった。未作成の `specdojo:bdd-customer` は `based_on` に含まれていない。
- 用語集の常連客の定義と業務データ辞書の `customer_id` の説明に合わせ、つけ販売の請求先を常連客に限る旨を「図だけでは表せない整合性条件」に書き足した（1 行の変更）。
- 主キー、多重度、対象範囲、単一店舗の前提などは参照先と食い違わなかった。相手側を直す案はない。
- executor の `npx prettier --check` と、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` は通過した。そのほかの検査は変更の種類により `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R5 | docs/ja/specdojo/samples/ccd-sample.md の Frontmatter `based_on` と「参照業務データ辞書」 | F001・F002 が求める `based_on` への `specdojo:bdd-sample` の記録は、今の版に既にある。未作成の `specdojo:bdd-customer` は含まれていない。 | 変更なし（解消済み） | ccd-mermaid-rulebook の `based_on` の規定（作成済みの直接の根拠だけを記録し、未作成の辞書は加えない） | - |
| 2 | R5 | docs/ja/specdojo/samples/ccd-sample.md の「図だけでは表せない整合性条件」3 項目め | 「つけ販売では請求先の顧客を必須とする」では、つけを使える範囲が用語集の常連客（店主代表がつけの利用を認めた顧客）と業務データ辞書の `customer_id`（請求先の常連客）より広く読める。 | 「つけ販売では請求先の顧客を必須とし、その顧客は店主代表がつけの利用を認めた常連客に限る。」に改めた（反映済み） | gl-sample.yaml の `tm-sales-regular-customer`・`tm-accounts-receivable`、bdd-sample.yaml の sale.`customer_id` の description | - |
| 3 | R5 | docs/ja/specdojo/samples/ccd-sample.md 全体と、bdd-sample.yaml・clis-sample.md・共通サンプル文脈 | 主キー（`product_id`・`sale_id`・`line_number`・`customer_id`）、売上明細の多重度 `1..*`、確定済みの売上だけを扱う範囲、つけ販売を CLI の対象外とする点、単一店舗の前提と役割名の使い方は、どれも参照先と食い違わない。同じ接頭辞の sample はほかになく、相手側を直す案はない。 | 変更なし | bdd-sample.yaml の各 entity の `key_fields` と description、clis-sample.md の対象範囲、sample-authoring-standard の共通サンプル文脈 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ccd-sample.md`: 「図だけでは表せない整合性条件」の 3 項目めを、「つけ販売では請求先の顧客を必須とし、その顧客は店主代表がつけの利用を認めた常連客に限る。」に改めた。用語集の常連客の定義と業務データ辞書の `customer_id` の説明に合わせ、つけを使える範囲を明確にした。

## 3. 申し送り

- No: 1 / 段: R5 / 箇所: docs/ja/specdojo/samples/ccd-sample.md の Frontmatter `based_on` と「参照業務データ辞書」 / 指摘: F001・F002 が求める `based_on` への `specdojo:bdd-sample` の記録は、今の版に既にある。未作成の `specdojo:bdd-customer` は含まれていない / 直した案: 変更なし（解消済み） / 根拠: ccd-mermaid-rulebook の `based_on` の規定（作成済みの直接の根拠だけを記録し、未作成の辞書は加えない） / 印: なし
- No: 2 / 段: R5 / 箇所: docs/ja/specdojo/samples/ccd-sample.md の「図だけでは表せない整合性条件」3 項目め / 指摘: 「つけ販売では請求先の顧客を必須とする」では、つけを使える範囲が用語集の常連客（店主代表がつけの利用を認めた顧客）と業務データ辞書の `customer_id`（請求先の常連客）より広く読める / 直した案: 「つけ販売では請求先の顧客を必須とし、その顧客は店主代表がつけの利用を認めた常連客に限る。」に改めた（反映済み） / 根拠: gl-sample.yaml の `tm-sales-regular-customer`・`tm-accounts-receivable`、bdd-sample.yaml の sale.`customer_id` の description / 印: なし
- No: 3 / 段: R5 / 箇所: docs/ja/specdojo/samples/ccd-sample.md 全体と、bdd-sample.yaml・clis-sample.md・共通サンプル文脈 / 指摘: 主キー（`product_id`・`sale_id`・`line_number`・`customer_id`）、売上明細の多重度 `1..*`、確定済みの売上だけを扱う範囲、つけ販売を CLI の対象外とする点、単一店舗の前提と役割名の使い方は、どれも参照先と食い違わない。同じ接頭辞の sample はほかになく、相手側を直す案はない / 直した案: 変更なし / 根拠: bdd-sample.yaml の各 entity の `key_fields` と description、clis-sample.md の対象範囲、sample-authoring-standard の共通サンプル文脈 / 印: なし

## 4. 進め方と実践の型の適用

根拠にした資料は、ccd-mermaid-rulebook の `based_on` 規定、`gl-sample.yaml` の `tm-sales-regular-customer` と `tm-accounts-receivable`、`bdd-sample.yaml` の各 entity の `key_fields` と description、`clis-sample.md` の対象範囲、sample-authoring-standard の共通サンプル文脈。F001・F002 は `based_on` に `specdojo:bdd-sample` が既にあり、未作成の辞書を含まないため、変更せず維持した。つけ販売の請求先の記述は用語集・業務データ辞書より広く読めたため、常連客に限る形に直した。Frontmatter の `status` は変更していない。他の記述は参照先と整合するため維持した。根拠不足で見送った finding はない。
