---
specdojo:
  id: prj-0001:xer-t-kata-review-all-itc-sample-140-20261125t021043z-3e468dbd
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-itc-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-itc-sample-140/T-KATA-REVIEW-ALL-itc-sample-140-20261125T021043Z-3e468dbd/plan.md
  started_at: "2026-11-25T02:10:53.377Z"
  completed_at: "2026-11-25T02:23:37.604Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:itc-sample
    - specdojo:itc-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）として、`itc-sample` の主張 14 件を schema・rulebook・`itc-index-sample` などの正本と突き合わせた。誤り 2 件を直し、変更は `docs/ja/specdojo/samples/itc-sample.md` だけである。
- 直した誤りは次の 2 件である。(1) TR-05 の備考が参照する `itc-index-sample` の章の名前を、実在する「観点/条件の採用基準と対象別への分配方針（共通）」に直した。(2) `_ASSUMPTION_` の引き継ぎ先を PJR から index の扱い（PM へ決定事項として報告）に直した。
- 一致を確認した主張は frontmatter、範囲 `PATH-02`・`PATH-03`、TR-01〜06 の BAC と条件、境界/依存の扱い、環境前提、ケース表の列と `case_id` の形式、`perspective_key` の宣言行、対象外の参照、`out-of-stock` である。`checkout-failed`・`duplicate-transaction`・`pending-product`・`pending-quantity` は業務の値で正本がなく、共通サンプル文脈とも食い違わないため、確かめの対象にしなかった。
- 「DB 停止・接続断は採用しない」は `itc-index-sample` の観点の立て方・条件の立て方と不一致だった。F002 に当たり R5 の範囲のため、本段では直していない。
- F001 と F003 は前の段で解消済みであることを確認した。F001 は観点の型の表に理由と代わりのケース `it-sales-checkout-persistence-integrity-010` がある。F003 は導入段落が「観点の型／本書での扱い／理由・代わり」の表になっている。
- 検証は `prettier` と `markdownlint` が成功した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。ほかの runner 検査は変更種別により `not_applicable` である。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/itc-sample.md`: 正しさの誤り 2 件を直した。TR-05 の備考が参照する `itc-index-sample` の章の名前を実在の見出しに合わせた。`_ASSUMPTION_` の引き継ぎ先を PJR から index の扱い（PM へ決定事項として報告）に改めた。あわせて `prettier` で表の列幅を整え直した。差分は 9 行追加・9 行削除である。

## 3. 申し送り

- F002（`vp-qe-kata-conformance`）は R5 の範囲で未解消である。`itc-index-sample` は「依存障害時の挙動」に DB 停止時の扱いを割り当て、条件の例に接続断も挙げているが、本書は DB 停止・接続断を採用しない。次のアクションは、R5 で index を更新拒否に改めるか、本書に DB 停止のケースを足すかを決めることである。
- 欠落（R1・R5 の範囲）: `itc-index-sample` の分配方針は、応答欠落時の照合待ちの識別と `PATH-02` の遅延・無応答の主担当を `itc-sales-checkout` にしている。本書には対応する観点もケースもない。次のアクションは、本書に観点を足すか、index の分配を見直すかを決めることである。
- ほかの kata（`itc-index-sample`）: ケース表の例で `トレース` の列が `BAC-01 / C-01` になっている。rulebook ではこの列を `trace_key`（TR-xx）で参照する。`itc-index-sample` の見直しで直す。
- ほかの kata（`utc-sample`）: 対象外が DB 保存の代わりに「内部結合テスト PATH-01」を挙げている。`itc-index-sample` では `PATH-01` は画面資材の取得で、販売記録の保存は `PATH-02`・`PATH-03` である。`utc-sample` の見直しで直す。
- 確かめの表（No｜主張｜正本｜結果｜根拠）: 1 frontmatter の `type: test`・`rulebook`｜deliverable-frontmatter.schema.yaml・itc-rulebook｜一致｜schema の enum に test がある / 2 `based_on` に tsp-index・itc-index｜itc-rulebook の推奨ルール｜一致 / 3 範囲 PATH-02・PATH-03｜itc-index-sample の括り方の表｜一致 / 4 TR-01〜06 の BAC と条件（商品A 30円・在庫5個）｜bac-sample・tsp-index-sample｜一致 / 5 TR-05 の備考の章の名前｜itc-index-sample の見出し｜不一致→「観点/条件の採用基準と対象別への分配方針（共通）」に直した / 6 境界/依存の扱いの章の名前と内容（DB 実接続、印刷の Stub、Asia/Tokyo、採番）｜itc-index-sample の同じ章｜一致 / 7 環境前提（kinuya-it-compose、`it_&lt;CI run 番号&gt;`、kinuya-test-data の seed）｜itc-index-sample のテスト環境・データの共通方針｜一致 / 8 `_ASSUMPTION_` の引き継ぎ先｜itc-index-sample のメモ / 将来課題｜不一致→index の扱い（PM へ決定事項として報告）に直した / 9 ケース表の列の順・`case_id` の形式・automated・証跡｜itc-index-sample のケース表の共通カラム、itc-rulebook｜一致 / 10 観点の見出しと `perspective_key` の宣言行｜itc-rulebook の本文要件｜一致 / 11 対象外の参照（utc-sample、etc-receipt-print、itc-credit-balance）｜各 sample｜一致 / 12 out-of-stock｜utc-sample｜一致 / 13 checkout-failed・duplicate-transaction・pending-product・pending-quantity｜なし｜確かめられない（業務の値で正本がなく、共通サンプル文脈とも食い違わない） / 14 「DB 停止・接続断は採用しない」｜itc-index-sample の観点の立て方・条件の立て方｜不一致（R5 へ申し送り）
- F001（vp-qe-omissions-consistency）: 前の段で解消済み。観点の型の表の「状態遷移の整合性」の行に、理由と代わりのケース `it-sales-checkout-persistence-integrity-010` が書かれている。
- F003（vp-ux-readability）: 前の段で解消済み。導入段落が「観点の型／本書での扱い／理由・代わり」の表になっている。
- F002（vp-qe-kata-conformance、R5 の範囲で未解消）: itc-index-sample は「依存障害時の挙動」に「DB 停止時に未保存を成功表示しない」をこの対象に割り当て、条件の例にも「DB の更新拒否・接続断」を挙げている。本書は DB 停止・接続断を採用しないと書いている。rulebook は index の共通方針を勝手に上書きすることを禁じている。次のアクション: R5 で index を更新拒否に改めて接続断を外すか、本書に DB 停止のケースを足すかを決める。
- 欠落（R1・R5 の範囲）: itc-index-sample の分配方針は「応答欠落時の照合待ちの識別／PATH-02 の遅延・無応答」の主担当を itc-sales-checkout にしているが、本書に観点もケースもない。index の境界/依存の表にも照合待ちの Stub の例外がある。次のアクション: 本書に観点を足すか、index の分配を見直す。
- ほかの kata（itc-index-sample）: ケース表の例の `トレース` の列が `BAC-01 / C-01` になっている。rulebook ではこの列を `trace_key`（TR-xx）で参照する。次のアクション: itc-index-sample の見直しで直す。
- ほかの kata（utc-sample）: 対象外は DB 保存の代わりに「内部結合テスト PATH-01」を挙げている。itc-index-sample では PATH-01 は画面資材の取得で、販売記録の保存は PATH-02・PATH-03。次のアクション: utc-sample の見直しで直す。

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として、sample の事実主張 14 件を schema、`itc-rulebook`、`itc-index-sample`、`bac-sample`、`tsp-index-sample`、`utc-sample` と突き合わせた。 確かめの結果は次のとおり。 | 結果 | 件数 | 内容 | | --- | --- | --- | | 一致 | 10 | frontmatter、`based_on`、範囲、TR-01〜06 の BAC と条件、境界/依存の扱い、環境前提、ケース表の列と `case_id` の形式、観点の見出しと `perspective_key`、対象外の参照、`out-of-stock`。 | | 不一致で直した | 2 | TR-05 の備考の章の名前、`_ASSUMPTION_` の引き継ぎ先。 | | 不一致で R5 へ申し送り | 1 | DB 停止・接続断を採用しない点。F002 に当たる。 | | 確かめられない | 1 | `checkout-failed`・`duplicate-transaction`・`pending-product`・`pending-quantity`。業務の値で正本がなく、共通サンプル文脈と食い違わない。 | plan の finding F001 と F003 は前の段で解消済みで、維持した。F002 は R4 の観点ではなく、index と本書のどちらを直すかの判断が要るため、推測で改訂せず申し送りにした。成果物の `status` は変更していない。
