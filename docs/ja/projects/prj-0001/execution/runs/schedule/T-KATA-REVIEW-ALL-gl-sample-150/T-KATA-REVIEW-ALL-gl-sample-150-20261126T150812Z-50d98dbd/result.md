---
specdojo:
  id: prj-0001:xer-t-kata-review-all-gl-sample-150-20261126t150812z-50d98dbd
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-gl-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-gl-sample-150/T-KATA-REVIEW-ALL-gl-sample-150-20261126T150812Z-50d98dbd/plan.md
  started_at: "2026-11-26T15:08:24.596Z"
  completed_at: "2026-11-26T15:15:13.267Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:gl-sample
    - specdojo:gl-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `gl-sample.yaml` を、ほかの sample や共通サンプル文脈と照合し、食い違い 3 点を sample 側で直した。
- 発注点の定義を `br-sample` の販売可能数による判定に合わせた。
- `tm-sales-credit-limit` の見出しを、ほかの sample の呼び方「つけ上限」に合わせた。
- 上限を超えたときの扱いを、`sf-index-sample`・`bes-index-sample`・`cdr-sample` と同じ未決（`_UNDECIDED_`）に戻した。
- 相手側の sample を直すべき点 1 件は変更せず、直す案だけを指摘に残した。
- スキーマ検査と Prettier の整形確認は通っている。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 用語 `tm-reorder-point`（発注点）の定義と例文 | 定義と例文が「在庫数量が下回る」となっていた。`br-sample` は予約分を除いた販売可能数で判定するため、食い違っていた。 | 定義を「販売可能数が下回った定番商品を発注候補とみなす基準数量」に変えた。注記に販売可能数の意味と `br-sample` の在庫不足判定への参照を足し、例文を販売可能数に直した。 | `vp-qe-kata-conformance`（`br-sample` の「概要」「入力」、`bdd-sample` の発注点の項目） | - |
| R5-2 | R5 | 用語 `tm-sales-credit-limit`（つけ限度額）の見出し | 見出しが「つけ限度額」だった。`cdfd-overview-sample`・`dmd`・`cdr`・`sf-index`・`bes-index`・`otp-index`・`cdsd` の各 sample はすべて「つけ上限」と書いている。 | term を「つけ上限」に変え、aliases を「つけ限度額」「つけ上限額」にした。ID は変えていない。選ばなかった案は、7 つの sample の表記を「つけ限度額」に直すこと（変更の範囲が広い）。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`、gl-rulebook「用語の見出し・英語名の判断」（term は実際の呼び方に合わせる）。迷った理由は、rulebook の良い例の注記が「限度額」という語を使っているため。 | 要判断 |
| R5-3 | R5 | 用語 `tm-sales-credit-limit` の notes | 「上限を超える場合は現金での支払いを案内する」と扱いを言い切っていた。`sf-index-sample` の Q-02、`bes-index-sample`、`cdr-sample` では、超えたときの扱い（店主代表の承認で受けるか断るか）が未決（`_UNDECIDED_`）のままだった。 | notes を「未設定の常連客には上限を設けない。`_UNDECIDED_:` 上限を超えるつけの申し出を、店主代表の承認で受け付けるか断るか。」に直した。「未設定は上限なし」は `dmd-sample`・`cdr-sample` と同じ。 | `vp-qe-kata-conformance`、共通サンプル文脈「前提条件」（未確定の事項は `_UNDECIDED_` で示す） | - |
| R5-4 | R5 | 用語 `tm-sales-regular-customer`（常連客）と、`bes-index-sample` の `bes-credit-use-requested`、`cdfd-overview-sample` の P-07 | 用語集の常連客は「店主代表がつけの利用を認めた人」である。ところが `bes-index-sample` は「顧客台帳に未登録の常連客が、つけを使いたいと申し出た」、`cdfd-overview-sample` の P-07 は「常連客がつけの利用を申し出た」と書いており、まだ認められていない人を常連客と呼んでいる。 | 相手側の直す案（本タスクでは変更していない）: `bes-index-sample` の `bes-credit-use-requested` の名前・説明・主体と、`cdfd-overview-sample` の P-07 のきっかけを「顧客がつけの利用を申し出た」に直す。 | `vp-qe-kata-conformance` | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/gl-sample.yaml`: `tm-reorder-point` の定義・注記・例文を、在庫数量ではなく販売可能数で判定する内容に直した。`tm-sales-credit-limit` は term を「つけ上限」にし、aliases を「つけ限度額」「つけ上限額」にした。notes は、上限超過時の扱いを未決（`_UNDECIDED_`）として書き直した。ID は変えていない。

## 3. 申し送り

- R5-1: R5 / 用語 tm-reorder-point（発注点） / 定義と例文が「在庫数量が下回る」となっていた。br-sample は予約分を除いた販売可能数で判定するため食い違っていた / 定義を「販売可能数が下回った定番商品を発注候補とみなす基準数量」に変え、注記に販売可能数の意味と [[specdojo:br-sample|在庫不足判定]] への参照を足し、例文を販売可能数に直した / vp-qe-kata-conformance（br-sample「概要」・「入力」、bdd-sample の発注点の項目） / -
- R5-2: R5 / 用語 tm-sales-credit-limit（つけ限度額） / 見出しが「つけ限度額」だったが、cdfd-overview・dmd・cdr・sf-index・bes-index・otp-index・cdsd の各 sample はすべて「つけ上限」と書いている / term を「つけ上限」に変え、aliases を [つけ限度額, つけ上限額] にした。ID は変えていない / vp-qe-kata-conformance、vp-dev-change-impact、gl-rulebook「用語の見出し・英語名の判断」（term は実際の呼び方に合わせる）。迷った理由は、rulebook の良い例の注記が「限度額」という語を使っているため。選ばなかった案は、7 つの sample の表記を「つけ限度額」に直すこと（変更の範囲が広い） / 要判断
- R5-3: R5 / 用語 tm-sales-credit-limit の notes / 「上限を超える場合は現金での支払いを案内する」と扱いを言い切っていた。sf-index-sample の Q-02、bes-index-sample、cdr-sample では、超えたときの扱いは店主代表の承認で受けるか断るかが未決（`_UNDECIDED_`）のまま / notes を「未設定の常連客には上限を設けない。`_UNDECIDED_:` 上限を超えるつけの申し出を、店主代表の承認で受け付けるか断るか。」に直した（「未設定は上限なし」は dmd-sample・cdr-sample と同じ） / vp-qe-kata-conformance、共通サンプル文脈「前提条件」（未確定の事項は `_UNDECIDED_` で示す） / -
- R5-4: R5 / 用語 tm-sales-regular-customer（常連客）と相手側の sample / 用語集の常連客は「店主代表がつけの利用を認めた人」。ところが bes-index-sample の bes-credit-use-requested は「顧客台帳に未登録の常連客が、つけを使いたいと申し出た」、cdfd-overview-sample の P-07 は「常連客がつけの利用を申し出た」と書いており、まだ認められていない人を常連客と呼んでいる / - / vp-qe-kata-conformance。相手側の直す案: bes-index-sample の bes-credit-use-requested の名前・説明・主体と、cdfd-overview-sample の P-07 のきっかけを「顧客がつけの利用を申し出た」に直す / -
- 適用外の検証: `npm run validate:history-links`（executor は plan・result・個票などの履歴ファイルを変更していないため）
- 適用外の検証: `markdownlint`（変更したのは YAML の sample だけで、`*.md` は変更していないため）

## 4. 進め方と実践の型の適用

根拠にしたのは、同じ接頭辞を含む関連 sample（`br-sample`、`bdd-sample`、`cdfd-overview-sample`、`dmd`、`cdr`、`sf-index`、`bes-index`、`otp-index`、`cdsd` など）、gl-rulebook の「用語の見出し・英語名の判断」、共通サンプル文脈の「前提条件」、`vp-qe-kata-conformance` である。sample 側で直せる 3 点は修正し、相手側の sample に関わる点は変更せず、直す案を指摘として残した。「つけ上限」と「つけ限度額」のどちらに揃えるかは要判断とした。
