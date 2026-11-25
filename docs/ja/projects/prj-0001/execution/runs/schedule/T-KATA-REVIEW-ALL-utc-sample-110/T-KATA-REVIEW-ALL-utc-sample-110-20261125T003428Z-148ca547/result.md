---
specdojo:
  id: prj-0001:xer-t-kata-review-all-utc-sample-110-20261125t003428z-148ca547
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-utc-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-utc-sample-110/T-KATA-REVIEW-ALL-utc-sample-110-20261125T003428Z-148ca547/plan.md
  started_at: "2026-11-25T00:34:37.841Z"
  completed_at: "2026-11-25T00:47:05.835Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:utc-sample
    - specdojo:utc-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）として `utc-sample.md` を見直し、rulebook が求めて欠けていた 3 点（入口の公開関数名、証跡のテストコードのパス、`receipt-print` の UT 例外の明記）を足した。
- sample 以外の直しが要る指摘と他段で扱う指摘は、sample を変更せず handoff に残した。
- | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R1-1 | R1 | 4. 境界/依存 | 入口が「会計確定の操作」だけで、rulebook が求める公開 API・関数名がない（F003） | 入口を公開関数 `confirmCheckout` にした | `vp-qe-kata-conformance`（utc-rulebook「境界/依存」） | 要判断 | | R1-2 | R1 | 6. テスト観点とケース（全ケースの証跡列） | 証跡にテストコードのパスがない（F004・F005） | 全 6 ケースの証跡に `tests/unit/sales-checkout.test.ts` を足した | `vp-qe-kata-conformance`（utc-rulebook「条件・ケース表」） | - | | R1-3 | R1 | 6.3.2. 条件・ケース表 | print-request のケースに `receipt-print` の UT 例外の適用が書かれていない（F008） | 2 ケースの境界/依存に「例外: 印刷要求データへの変換のみ」を明記した | `vp-qe-kata-conformance`（utc-rulebook「対象外」、utc-index-sample「対象外・除外理由（共通）」） | - | | R1-4 | R1 | 2. 責務 | index は釣銭計算を責務に挙げるが、本書に釣銭の責務とケースがない（F007） | sample は変更せず、index 側の責務と観点の例を寄せる案とした | `vp-qe-kata-conformance`（kata 相互、R5 で扱う） | 要判断 | | R1-5 | R1 | 6.1.2. 条件・ケース表 | index の記入例と本書で条件・トレースの書き方が違う（F006） | sample は変更せず、index の記入例を本書に揃える案とした | `vp-qe-kata-conformance`（kata 相互、R5 で扱う） | - | | R1-6 | R1 | 5. トレース（TR-04）と全ケースの証跡 | `_ASSUMPTION_` の判断者、上流への差し戻し、ready 化前の解消条件（F001・F002・F009） | 本文は変更しない | これらの観点は kata の段のレビューでは使わない | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/utc-sample.md`: 入口を公開関数 `confirmCheckout` として明記した。全ケースの証跡にテストコードのパス `tests/unit/sales-checkout.test.ts` を足した。print-request の 2 ケースの境界/依存に `receipt-print` の UT 例外（印刷要求データへの変換のみ）を明記した。13 行追加・13 行削除。

## 3. 申し送り

- R1-4 は index 側で責務のまとまりを「請求額の計算と、会計確定時の在庫引当」にし、観点の例を「請求額計算の正しさ」へ寄せる案を R5 に回す。本書に釣銭を足す案は、bac-sample に釣銭の条件がなく根拠のない仕様になるため選ばなかった。
- R1-5 は index の記入例を本書の行に揃える案を R5 に回す。あわせて index の暫定証跡の書式（実行日・コミット・実行件数）を本書に入れるか、index 側を簡略にするかも R5 で揃える。
- rulebook への案として、utc-rulebook「全体方針」の `_UNDECIDED_`「sample は本文要件の見出し構成へ未整合」は、現在の sample が本文要件の見出し構成に揃っているため外す案がある。rulebook は本タスクで変更していない。
- R1-1 の関数名 `confirmCheckout` は、Sample 記述標準の禁止事項（具体クラス名・詳細 API 設計を書かない）と緊張する。関数名 1 つに留めたが、妥当性は R4 でも確かめる。
- R1-1: 段 R1 / 箇所 4. 境界/依存 / 指摘: 入口が「会計確定の操作」だけで、rulebook の「境界/依存」が求める公開API・関数・クラスの名前がない（grade F003） / 直した案: 入口を「会計確定サービスの公開関数 `confirmCheckout`（入力は購入明細と受領額）」にした / 根拠: `vp-qe-kata-conformance`（utc-rulebook「境界/依存」）。迷った理由: Sample 記述標準の禁止事項（具体クラス名・詳細API設計を書かない）と緊張するため、関数名 1 つに留めた。選ばなかった案: 名前を書かず「会計確定サービスの公開関数」とだけ書く案（rulebook の要求を満たしにくい）。関数名の妥当性は R4 でも確かめる / 印: 要判断
- R1-2: 段 R1 / 箇所 6. テスト観点とケース（全条件・ケース表の証跡列） / 指摘: 証跡が「暫定: ローカル実行結果」だけで、rulebook の「条件・ケース表」が求めるテストコードのパスがない（grade F004・F005） / 直した案: 全 6 ケースの証跡に `tests/unit/sales-checkout.test.ts` を足した（パスは utc-index-sample の記入例と同じ架空例） / 根拠: `vp-qe-kata-conformance`（utc-rulebook「条件・ケース表」） / 印: -
- R1-3: 段 R1 / 箇所 6.3.2. 条件・ケース表 / 指摘: utc-index-sample「対象外・除外理由（共通）」が receipt-print の UT 例外を適用する term にはケース表の境界/依存へ適用した例外を書くよう定めているのに、print-request のケースに例外の適用が書かれていない（grade F008） / 直した案: 2 ケースの境界/依存を「`receipt-print` Mock（例外: 印刷要求データへの変換のみ）」にした / 根拠: `vp-qe-kata-conformance`（utc-rulebook「対象外」の UT で扱う例外の書き方、utc-index-sample「対象外・除外理由（共通）」） / 印: -
- R1-4: 段 R1 / 箇所 2. 責務 / 指摘: utc-index-sample は utc-sales-checkout の責務を「請求額・釣銭の計算」とし観点の例に「釣銭計算の正しさ」も挙げるが、本書に釣銭の責務とケースがない（grade F007） / 直した案: - / 根拠: `vp-qe-kata-conformance`（kata 相互、R5 で扱う）。bac-sample に釣銭の条件（受領額が請求額を超える場合）がなく、sample に足すと根拠のない仕様を作るため足さなかった。相手側の案: utc-index-sample の責務のまとまりを「請求額の計算と、会計確定時の在庫引当」にし、観点の例の「釣銭計算の正しさ」を「請求額計算の正しさ」へ寄せる。選ばなかった案: 本書に釣銭の責務とケースを足し、BAC に釣銭の条件を足す / 印: 要判断
- R1-5: 段 R1 / 箇所 6.1.2. 条件・ケース表 / 指摘: utc-index-sample の共通カラムの記入例（同じ `case_id` ut-sales-checkout-stock-allocation-020）と本書で条件・トレースの書き方が違う（grade F006） / 直した案: - / 根拠: `vp-qe-kata-conformance`（kata 相互、R5 で扱う）。rulebook のトレースの規則に合うのは本書の側。相手側の案: index の記入例を本書の行に揃える。あわせて index の暫定証跡の書式（実行日・コミット・実行件数）を本書の暫定表記に入れるか、index 側を簡略にするかも R5 で揃える / 印: -
- R1-6: 段 R1 / 箇所 5. トレース（TR-04）と全ケースの証跡 / 指摘: TR-04 の `_ASSUMPTION_` の判断者・上流への差し戻し・ready 化前の解消条件を書く指摘（grade F001・F002・F009） / 直した案: - / 根拠: `vp-po-decision-readiness`・`vp-pm-dependency-risk`・`vp-ops-release-readiness` は kata-guide「kata の観点の組」で kata の段のレビューでは使わない観点（承認と ready 化は登録簿で追う）のため本文は変えない。bac-sample の `_ASSUMPTION_`（合意した請求額の現金を受領してから確定）から受領額不足の確定拒否を解釈するのは、目的に照らして妥当 / 印: -
- 申し送り（rulebook への案）: utc-rulebook「全体方針」の `_UNDECIDED_` に「sample は本文要件の見出し構成へ未整合」とあるが、現在の utc-sample は本文要件の見出し構成（1〜6 と 6.n / 6.n.1 / 6.n.2）に揃っているため、その一文を外す案。rulebook は本タスクで変更していない。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/utc-sample.md のみで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）
- 適用外の検証: `specdojo catalog validate`（変更は docs/ja/specdojo/ 配下の sample のみで docs/ja/projects/ に届かない）

## 4. 進め方と実践の型の適用

根拠は、plan の finding 9 件、utc-rulebook、utc-index-sample、Sample 記述標準、kata-guide の「kata の観点の組」である。R1 の観点に当たる F003・F004・F005・F008 は、rulebook が求める要素の欠落を埋める差分として sample に反映した。F006・F007 は kata 相互の整合で R5 の範囲のため、sample は変更せず相手側の直し案を handoff に残した。F001・F002・F009 は kata の段のレビューで使わない観点（承認と ready 化は登録簿で追う）のため見送った。bac-sample の `_ASSUMPTION_` から受領額不足の確定拒否を解釈するのは目的に照らして妥当と判断し、維持した。rulebook は変更していない。frontmatter の `status` は `draft` のまま据え置いた。検査では、executor の prettier と markdownlint、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` が通った。
