---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-business-sample-150-20261126t075228z-0cc911d0
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-business-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-business-sample-150/T-KATA-REVIEW-ALL-imp-business-sample-150-20261126T075228Z-0cc911d0/plan.md
  started_at: "2026-11-26T07:52:39.257Z"
  completed_at: "2026-11-26T07:58:34.559Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-business-sample
    - specdojo:imp-business-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として imp-business-sample を同系列 sample の用語・参照に合わせて修正しました。
- 在庫補充の「商品コード未登録」を「バーコード値未登録」に改め、論点名を「バーコード値未登録時の記録様式」にしました。
- 値引き内訳の集計単位を「値引き理由別・商品別」に改めました。
- imp-test と imp-data の仮置きを wikilink に置き換えました。この変更は迷いがあるため「要判断」としました。
- 前の段の F001 は、現状値が未解決事項 `PJR-B4Q4`（期限 2026-05-13、担当 `BA`）を指す形に直っていると確認し、追加修正はしていません。
- 整形と lint は通過しました。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 4. 影響詳細一覧・5. 対応方針・6. 未解決事項（在庫補充） | 読み取りに要る未登録の値を「商品コード」と書いていました。2. 変更要求の概要では商品コードは手入力に使う値で、imp-data・imp-interface はバーコード値を登録するとしており、文書内でも系列でも食い違っていました。 | 「商品コード未登録」「上位 30 品目の商品コード登録」を「バーコード値未登録」「上位 30 品目のバーコード値の登録」にしました。論点名は「バーコード値未登録時の記録様式」にしました。 | `vp-qe-kata-conformance`（kata 相互）、`vp-dev-change-impact` | - |
| R5-2 | R5 | 6. 未解決事項（値引き内訳の確認項目の確定） | 集計単位の候補「種別別」が、imp-data の値引き理由と、imp-operations の締めの「値引き理由別の合計」と合っていませんでした。 | 「種別別・商品別」を「値引き理由別・商品別」にしました。 | `vp-qe-kata-conformance`（kata 相互） | - |
| R5-3 | R5 | 1. 目的と適用範囲・4. 影響詳細一覧の備考 | 影響調査（テスト）と影響調査（データ）は sample が存在するのに、バッククォートで仮置きしていました。imp-data・imp-interface・imp-operations は imp-business-sample を wikilink で参照しています。迷った点は、imp-test-sample が imp-business と imp-data をバッククォートのまま参照しており、仮置きを系列の慣行とみる案もあることです。選ばなかった案は、仮置きのまま残すことです。 | `[[specdojo:imp-test-sample\|影響調査（テスト）サンプル]]` の wikilink にしました。表のセルでは `[[specdojo:imp-data-sample\|影響調査（データ）]]` のようにエスケープした wikilink にしました。 | Sample 記述標準の記述ガイド「リンクはファイルがある場合に記載」 | 要判断 |
| R5-4 | R5 | 相手側 imp-data-sample の 1. 目的と適用範囲 | 変更要求の ID を `PJR-C4A1` としており、imp-business・imp-test・imp-interface・imp-operations の `cr-2026-004` と食い違っています。 | 相手側の imp-data-sample を `cr-2026-004` にそろえ、`based_on` にも `cr-2026-004` を足す案です。用語集 gl-register.yaml では変更要求が登録簿の項目の分類（change-request）なので、逆に系列全体を PJR の ID へそろえる案もあります。 | `vp-qe-kata-conformance`（kata 相互）、用語集 gl-register.yaml | 要判断 |
| R5-5 | R5 | 相手側 imp-interface-sample の全体 | 「本部」との連携（本部商品マスタの照会・本部への売上登録）を前提にしています。共通サンプル文脈の前提条件は単一店舗の運用で、仕入れ先とのシステム連携を初期リリースの対象外としています。 | imp-interface-sample（および前提の ifx-index-sample）の連携先を、共通サンプル文脈と矛盾しない相手へ見直す案です。あるいは、共通サンプル文脈に外部 I/F の前提を足す案です。 | Sample 記述標準の共通サンプル文脈 | 要判断 |
| R5-6 | R5 | 相手側 imp-test-sample の 1. 目的と適用範囲 | imp-business・imp-data の参照がバッククォートの仮置きのままです。 | imp-test-sample を `[[specdojo:imp-business-sample\|影響調査（業務）サンプル]]` などの wikilink にする案です。R5-3 の扱いと合わせて決めます。 | Sample 記述標準の記述ガイド「リンクはファイルがある場合に記載」 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-business-sample.md`: 在庫補充の読み取り用の値を「商品コード」から「バーコード値」に統一しました。値引き内訳の集計単位を「値引き理由別・商品別」にしました。影響調査（テスト）と影響調査（データ）の仮置きを wikilink（表のセル内は `\|` でエスケープ）にしました。

## 3. 申し送り

- 相手側の修正案は findings の R5-4、R5-5、R5-6 に記載しました。今回の差分では相手側の sample を変更していません。
- R5-1: R5 / 4. 影響詳細一覧・5. 対応方針・6. 未解決事項（在庫補充） / 読み取りに要る未登録の値を「商品コード」と書いていた。2. 変更要求の概要では商品コードを手入力に使う値としており、imp-data・imp-interface はバーコード値を登録するとしているため、文書の中でも系列の中でも食い違っていた / 「商品コード未登録」「上位 30 品目の商品コード登録」を「バーコード値未登録」「上位 30 品目のバーコード値の登録」にし、論点名を「バーコード値未登録時の記録様式」にした / `vp-qe-kata-conformance`（kata 相互）、`vp-dev-change-impact` / -
- R5-2: R5 / 6. 未解決事項（値引き内訳の確認項目の確定） / 集計単位の候補「種別別」が、imp-data の値引き理由と、imp-operations の締めの「値引き理由別の合計」と合わない / 「種別別・商品別」を「値引き理由別・商品別」にした / `vp-qe-kata-conformance`（kata 相互） / -
- R5-3: R5 / 1. 目的と適用範囲・4. 影響詳細一覧の備考 / 影響調査（テスト）と影響調査（データ）を、sample が存在するのにバッククォートで仮置きしていた。imp-data・imp-interface・imp-operations は imp-business-sample を wikilink で参照している / `[[specdojo:imp-test-sample|影響調査（テスト）サンプル]]` と、表のセルでは `[[specdojo:imp-data-sample\|影響調査（データ）]]` などのエスケープした wikilink にした / Sample 記述標準の記述ガイド「リンクはファイルがある場合に記載」。迷った理由: imp-test-sample は imp-business と imp-data をバッククォートのまま参照しており、仮置きを系列の慣行とみる案もある。選ばなかった案は、仮置きのまま残すこと / 要判断
- R5-4: R5 / 相手側 imp-data-sample の 1. 目的と適用範囲 / 変更要求の ID を `PJR-C4A1` としており、imp-business・imp-test・imp-interface・imp-operations の `cr-2026-004` と食い違う / - / 相手側の imp-data-sample を `cr-2026-004` にそろえ、`based_on` にも cr-2026-004 を足す案。用語集 gl-register.yaml では変更要求が登録簿の項目の分類（change-request）なので、逆に系列全体を PJR の ID へそろえる案もある / 要判断
- R5-5: R5 / 相手側 imp-interface-sample の全体 / 「本部」との連携（本部商品マスタの照会・本部への売上登録）を前提にしているが、共通サンプル文脈の前提条件は単一店舗の運用で、仕入れ先とのシステム連携を初期リリースの対象外としている / - / imp-interface-sample（および前提の ifx-index-sample）の連携先を、共通サンプル文脈と矛盾しない相手へ見直す案。あるいは、共通サンプル文脈に外部 I/F の前提を足す案 / 要判断
- R5-6: R5 / 相手側 imp-test-sample の 1. 目的と適用範囲 / imp-business・imp-data の参照がバッククォートの仮置きのまま / - / imp-test-sample を `[[specdojo:imp-business-sample|影響調査（業務）サンプル]]` などの wikilink にする案（R5-3 の扱いと合わせて決める） / -
- F001（前の段の grade の指摘）: 成功条件の現状値は、未解決事項「会計時間の現状値の計測」（`PJR-B4Q4`、期限 2026-05-13、担当 `BA`）を指す形に直っており、解消を確かめた。追加の修正はしていない。
- 適用外の検証: `npm run validate:history-links`（変更したのは sample だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

根拠は、同じ接頭辞の imp-data・imp-interface・imp-operations・imp-test の各 sample、用語集、Sample 記述標準の共通サンプル文脈、kata ガイドの R5 段の定義です。この sample の側で直せる食い違い（用語・参照）だけを修正し、相手側を直すべき点は変更せずに案を findings に残しました。F001 は前の段までで解消済みと確認しました。R5-3 の wikilink 化は、imp-test-sample 側がバッククォートの仮置きを使っているため、系列の慣行との関係で判断を人に委ねます。
