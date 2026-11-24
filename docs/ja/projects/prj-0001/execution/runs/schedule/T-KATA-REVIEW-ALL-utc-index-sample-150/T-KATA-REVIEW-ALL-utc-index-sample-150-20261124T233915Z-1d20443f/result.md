---
specdojo:
  id: prj-0001:xer-t-kata-review-all-utc-index-sample-150-20261124t233915z-1d20443f
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-utc-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-utc-index-sample-150/T-KATA-REVIEW-ALL-utc-index-sample-150-20261124T233915Z-1d20443f/plan.md
  started_at: "2026-11-24T23:39:27.025Z"
  completed_at: "2026-11-24T23:52:47.555Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:utc-index-sample
    - specdojo:utc-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として `utc-index-sample` を、同系列の sample、参照先、用語集、共通サンプル文脈と照合した。本書側の食い違い 4 点（`trace_key` の参照、印刷要求の優先度、記入例の受領額とトレース、報告先の PJR）を直した。
- 相手側を直すべき 6 点（R5-5〜R5-10）は変更せず、直す案を申し送りに残した。
- plan の F001〜F009 は R5 の観点に当たらないため、この段では扱っていない。executor の説明では F001〜F008 は前の段で解消済み、F009 は kata のレビューで使わない観点である。
- 指摘の一覧は申し送りに No・段・箇所・指摘・直した案・根拠・印の形で 1 件ずつある。迷った指摘は R5-3、R5-7、R5-9 で、いずれも印は「要判断」である。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/utc-index-sample.md`: 整合のために 11 行を修正した。対象は次の 4 点。(1) 分配方針の `トレース` の記述を、条件 ID を「トレース」の表に書き、ケース表から `trace_key` で参照する形にした。(2) 記入例の `トレース` を `TR-02` にし、条件に受領額150円を足した。(3) `優先度` に、記録に影響しない印刷要求を P1 とする旨を足した。(4) メモ / 将来課題の報告先に `kinuya:pjr-i003` を添え、AC-02 の行の書き方を揃えた。

## 3. 申し送り

- R5-3（要判断）: 印刷要求のケースを P0 にする案もあった。テスト戦略では印刷失敗でも会計を維持するため、記録に影響しない P1 とした。この判断は人が確認すること。
- R5-7（要判断）: 本書から記録サービス Stub を消す案もあった。tsp-index-sample の単体テスト環境が記録サービスをスタブにするため、本書を正とした。相手側（utc-sample）の直す案は、依存の表に記録サービス Stub を足し、保存失敗で確定しないケースを足すこと。
- R5-9（要判断）: 本書から釣銭を消す案と、utc-sample の責務と観点に釣銭の計算を足す案がある。どちらを正にするかは業務の扱いの判断になるため、直していない。人が決めること。
- 相手側の修正案（R5-5）: utc-sample の対象外（業務記録 DB への保存）の代替を `PATH-02`・`PATH-03` にする。
- 相手側の修正案（R5-6）: utc-sample の対象外（印刷失敗時の会計維持）の代替を「外部結合テスト（`receipt-print` 連携）」にする。
- 相手側の修正案（R5-8）: utc-sample の各行の `証跡` を、本書の書き方（実行日・コミット・実行件数）に合わせる。
- 相手側の修正案（R5-10）: utc-index-rulebook の `トレース` の説明を「`utc-&lt;term&gt;` のトレースの表の `trace_key`」にする。
- R5-1: 段 R5 / 箇所 観点/条件の採用基準と対象別への分配方針 / 指摘 分配結果をケース表の `トレース` に BAC・AC の条件 ID で書くとしており、utc-rulebook の「観点・ケース表は `trace_key`（`TR-xx`）で参照する」と utc-sample の書き方と食い違う / 直した案 「トレース」の表に条件 ID を書き、ケース表の `トレース` から `trace_key` で参照する文にした / 根拠 `vp-qe-kata-conformance`（utc-rulebook のトレースの章、utc-sample のトレースの章） / 印 -
- R5-2: 段 R5 / 箇所 ケース表の共通カラム（記入例） / 指摘 記入例の `トレース` が「BAC-01 / C-02」で、utc-sample の同じケース `ut-sales-checkout-stock-allocation-020` は `TR-02`。条件にも受領額がなく、utc-sample の「商品A×5・受領額150円」と食い違う / 直した案 `トレース` を `TR-02` にし、BAC-01 の C-02 を指す `trace_key` だと 1 文で添えた。条件に受領額150円を足した / 根拠 `vp-qe-kata-conformance`、`vp-dev-change-impact`（utc-sample のトレースとケース表、bac-sample の C-02） / 印 -
- R5-3: 段 R5 / 箇所 ケース表の共通カラム（`優先度`） / 指摘 utc-sample は印刷要求のケースを P1 にしているが、本書の決め方（P0: 誤課金・在庫の誤更新、P1: 入力検証、P2: 表示の書式変換）のどれにも当たらない / 直した案 P1 に「記録に影響しない印刷要求の回数と内容」を足した / 根拠 `vp-qe-kata-conformance`。迷った理由: 印刷要求を P0 にする案もあったが、テスト戦略では印刷失敗でも会計を維持するため、記録に影響しない P1 を選んだ / 印 要判断
- R5-4: 段 R5 / 箇所 メモ / 将来課題 / 指摘 通信不能時の販売継続の報告先が「PM へリスクとして報告」だけで、tsp-index-sample が同じ論点の引き継ぎ先にしている `kinuya:pjr-i003` と結びついていない。あわせて AC-02 の行の「`トレース` に書く」も R5-1 の書き方に合わせる必要がある / 直した案 報告先に `kinuya:pjr-i003` を添えた。AC-02 の行は「「トレース」の表の仕様ID」に書く文にした / 根拠 `vp-dev-change-impact`（tsp-index-sample のメモ / 将来課題） / 印 -
- R5-5: 段 R5 / 箇所 utc-sample の対象外（業務記録 DB への保存） / 指摘 代替の経路を内部結合テスト `PATH-01` としているが、ifd-sample では `PATH-01` は画面の取得で、DB の保存は `PATH-02`・`PATH-03`。utc-index-sample の対象外の表とも食い違う / 直した案 - / 根拠 `vp-qe-kata-conformance`。相手側の直す案: utc-sample の該当行を「代替: 内部結合テスト `PATH-02`・`PATH-03`」にする / 印 -
- R5-6: 段 R5 / 箇所 utc-sample の対象外（印刷失敗時の会計維持） / 指摘 代替を外部結合テスト `PATH-05` としているが、ifd-sample では `PATH-05` は復元用保管サービスへの転送で、`receipt-print` の経路ではない / 直した案 - / 根拠 `vp-qe-kata-conformance`。相手側の直す案: utc-sample の該当行を「代替: 外部結合テスト（`receipt-print` 連携）」にする / 印 -
- R5-7: 段 R5 / 箇所 テスト対象の括り方と分割基準（`utc-sales-checkout` の依存の扱い） / 指摘 本書は `utc-sales-checkout` が記録サービスを Stub にするとしているが、utc-sample の依存の表に記録サービスがなく、保存失敗のケースもない / 直した案 - / 根拠 `vp-qe-kata-conformance`。相手側の直す案: utc-sample の依存の表に「記録サービス: Stub（保存成功・保存失敗を返す）」を足し、保存失敗で確定しないケースを足す。迷った理由: 本書から記録サービス Stub を消す案も考えたが、tsp-index-sample の単体テスト環境が記録サービスをスタブにするとしているため、本書を正とした / 印 要判断
- R5-8: 段 R5 / 箇所 utc-sample のケース表の `証跡` / 指摘 本書は CI 整備前の `証跡` に「暫定: ローカル実行結果（実行日・コミット・実行件数）、CI 整備後に差し替え」と書くとしているが、utc-sample は実行日・コミット・実行件数を書いていない / 直した案 - / 根拠 `vp-qe-kata-conformance`。相手側の直す案: utc-sample の各行の `証跡` を本書の書き方に合わせる / 印 -
- R5-9: 段 R5 / 箇所 テスト対象の括り方と分割基準、観点の立て方（共通） / 指摘 本書は `utc-sales-checkout` の責務に釣銭の計算を含め、`釣銭計算の正しさ` を観点の例にしているが、utc-sample の責務と観点には釣銭がなく、bac-sample の条件も受領額と請求額が同じで釣銭が出ない / 直した案 - / 根拠 `vp-qe-kata-conformance`。相手側の直す案: utc-sample の責務と観点に釣銭の計算を足す。迷った理由: 本書から釣銭を消す案もあるが、どちらを正にするかは業務の扱いの判断になるため直さなかった / 印 要判断
- R5-10: 段 R5 / 箇所 utc-index-rulebook のケース表の共通カラム（`トレース`） / 指摘 utc-index-rulebook は `トレース` の値を「req/spec/ac/issue 等のID」としているが、utc-rulebook は `trace_key`（`TR-xx`）で参照するとしており、rulebook どうしが食い違う / 直した案 - / 根拠 `vp-qe-kata-conformance`。相手側の直す案: utc-index-rulebook の `トレース` の説明を「`utc-&lt;term&gt;` のトレースの表の `trace_key`（上位仕様の ID はトレースの表に書く）」にする / 印 -

## 4. 進め方と実践の型の適用

同系列の sample（utc-sample）、参照先（tsp-index-sample、bac-sample、ifd-sample）、utc-index-rulebook、utc-rulebook、用語集、共通サンプル文脈を照合した。構造と必須項目は rulebook を正とした。本書側の食い違いは直し、相手側の食い違いは変更せずに直す案として残した。成果物の frontmatter の `status` は `draft` のままである。runner 検査では `lint:md:changed`、`lint:fm:changed`、`validate:schema`、`test:docs` などが passed、変更の種類に当たらない検査は `not_applicable` だった。
