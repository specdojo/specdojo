---
specdojo:
  id: prj-0001:xer-t-kata-review-all-gl-sample-130-20261126t140832z-c6e4c726
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-gl-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-gl-sample-130/T-KATA-REVIEW-ALL-gl-sample-130-20261126T140832Z-c6e4c726/plan.md
  started_at: "2026-11-26T14:08:44.033Z"
  completed_at: "2026-11-26T14:15:38.892Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:gl-sample
    - specdojo:gl-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、`gl-sample.yaml` の用語の定義・例・備考に文の直しを入れた。主語の明示、指示語の置き換え、長い文の分割が中心である。意味と判断基準は変えていない。
- executor は schema 検査と Prettier の検査を実行し、どちらも通った。runner の `lint-md-changed`、`lint-fm-changed`、`lint-mermaid`、`lint-d2`、`test-docs`、`validate-schema` も通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R3-1 | R3 | terms.tm-reorder-point.definition | 「在庫数量がこの値を下回ったときに」の「この値」が、定義する語そのものを指している。発注候補とみなす対象（商品）も書かれていない。 | 「在庫数量が下回った商品を発注候補とみなす基準数量。」にした。 | W4, W1 | - |
| R3-2 | R3 | terms.tm-reorder-point.example | 何が発注点を下回り、誰が発注するかが読めない。この例文だけ引用符付きで、ほかの例文と書き方がそろっていない。 | 「きなこ棒の在庫数量が発注点を下回ったため、店主代表が追加発注を行う。」にし、引用符を外した。 | W1, vp-ux-language-consistency | - |
| R3-3 | R3 | terms.tm-safety-stock.notes | 「安全在庫を下回る前に発注候補に挙がる」の主語（何が下回り、何が挙がるか）が読めない。主語を足すと読点が 3 つを超える。 | 「発注点は、…水準とする。このため、在庫数量が安全在庫を下回る前に、その商品が発注候補に挙がる。」と、理由と結論の 2 文に分けた。 | W1, W3 | - |
| R3-4 | R3 | terms.tm-inventory-stockout.example | 代わりの商品を案内する主体がない。 | 「入荷までは店番の家族が代わりの商品を案内する。」にした。 | W1 | - |
| R3-5 | R3 | terms.tm-accounts-receivable.example | つけにして後で支払う主体がない。 | 「常連客が今日の買い物をつけにして、次回の来店時に支払う。」にした。 | W1 | - |
| R3-6 | R3 | terms.tm-sales-credit-balance.notes | 「常連客から受け取った支払いを差し引く」で、何から差し引くかが読めない。 | 「つけによる販売代金の合計から、常連客から受け取った支払いを差し引く。」にした。 | W1 | - |
| R3-7 | R3 | terms.tm-sales-credit-balance.example | 確認して伝える主体と相手がない。 | 「店番の家族がつけ残高を確認して、常連客に今回支払う金額を伝える。」にした。 | W1 | - |
| R3-8 | R3 | terms.tm-sales-credit-limit.notes | 何が限度額を超えるのか、誰が案内するのかがない。 | 「新たな買い物でつけ残高が限度額を超える場合は、店番の家族が現金での支払いを案内する。」にした。 | W1 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/gl-sample.yaml`: 発注点・安全在庫・在庫切れ・売掛・つけ残高・つけ限度額・常連客に関する用語の定義、例、備考を直した。主語や対象を補い、指示語を具体的な語に置き換え、長い文を 2 文に分けた。例文の書き方もそろえた。8 行を追加し 8 行を削除した。

## 3. 申し送り

- R3-8 は「要判断」である。店番は「店番の家族」に統一した。店番を用語として足す案は、用語の追加が R1 の範囲になるため採らなかった。
- R3-1: R3 / terms.tm-reorder-point.definition / 「在庫数量がこの値を下回ったときに」の「この値」が定義する語そのものを指し、発注候補とみなす対象（商品）も書かれていない / 「在庫数量が下回った商品を発注候補とみなす基準数量。」にした / W4, W1 / -
- R3-2: R3 / terms.tm-reorder-point.example / 何が発注点を下回り、誰が発注するかが読めない。この例文だけ引用符付きで、ほかの例文と書き方がそろっていない / 「きなこ棒の在庫数量が発注点を下回ったため、店主代表が追加発注を行う。」にし、引用符を外した / W1, vp-ux-language-consistency / -
- R3-3: R3 / terms.tm-safety-stock.notes / 「安全在庫を下回る前に発注候補に挙がる」の主語（何が下回り、何が挙がるか）が読めない。主語を足すと読点が 3 つを超える / 「発注点は、…水準とする。このため、在庫数量が安全在庫を下回る前に、その商品が発注候補に挙がる。」と理由と結論の 2 文に分けた / W1, W3 / -
- R3-4: R3 / terms.tm-inventory-stockout.example / 代わりの商品を案内する主体がない / 「入荷までは店番の家族が代わりの商品を案内する。」にした / W1 / -
- R3-5: R3 / terms.tm-accounts-receivable.example / つけにして後で支払う主体がない / 「常連客が今日の買い物をつけにして、次回の来店時に支払う。」にした / W1 / -
- R3-6: R3 / terms.tm-sales-credit-balance.notes / 「常連客から受け取った支払いを差し引く」で、何から差し引くかが読めない / 「つけによる販売代金の合計から、常連客から受け取った支払いを差し引く。」にした / W1 / -
- R3-7: R3 / terms.tm-sales-credit-balance.example / 確認して伝える主体と相手がない / 「店番の家族がつけ残高を確認して、常連客に今回支払う金額を伝える。」にした / W1 / -
- R3-8: R3 / terms.tm-sales-credit-limit.notes / 何が限度額を超えるのか、誰が案内するのかがない / 「新たな買い物でつけ残高が限度額を超える場合は、店番の家族が現金での支払いを案内する。」にした / W1 / 要判断（店番は「店番の家族」に統一した。tm-sales-regular-customer の書き方に合わせたもの。店番を用語として足す案は、用語の追加が R1 の範囲になるため採らなかった）
- 適用外の検証: `markdownlint`（変更したのは `*.yaml` だけで、`*.md` を変更していない）
- 適用外の検証: `npm run validate:history-links`（plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従い、R3（読みやすさ）の観点で文章のチェック項目 W1、W3、W4 を `gl-sample.yaml` に適用した。plan に展開された grade の finding と、成果物から届いた Kata が原因の finding はどちらもなかった。そのため根拠不足による見送りはない。`gl.schema.yaml` に対する schema 検査は通った。frontmatter の `status` は変更していない。
