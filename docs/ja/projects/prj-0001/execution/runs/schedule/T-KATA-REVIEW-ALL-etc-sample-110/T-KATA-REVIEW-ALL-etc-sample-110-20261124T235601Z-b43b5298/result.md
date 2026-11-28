---
specdojo:
  id: prj-0001:xer-t-kata-review-all-etc-sample-110-20261124t235601z-b43b5298
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-etc-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-etc-sample-110/T-KATA-REVIEW-ALL-etc-sample-110-20261124T235601Z-b43b5298/plan.md
  started_at: "2026-11-24T23:56:11.502Z"
  completed_at: "2026-11-25T00:10:12.439Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:etc-sample
    - specdojo:etc-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）として、`etc-sample` に欠けていた入力不正のケースを 1 件追加した。責務の「送信前失敗」と、関連I/F・境界表に挙げた終了コード `2` に当たるケースがなかったため。この追加で F002 と F005 を解消した。
- F001・F003・F004・F006・F007 は R1 の観点に当たらないと判断し、本文は変えず、担当の段（R3・R4・R5）へ回した。F001 は要判断として残した。
- `npx prettier --check` は成功した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。ts や unit などの検査は、変更種別に該当しないため非適用になった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/etc-sample.md`: 「印刷結果の判別」の表にケース `et-receipt-print-contract-050` を 1 行追加した（1 行の追加）。印字形式に適合しないレシートファイルを入力とし、期待値は終了コード `2`・印字状態 `failed`・開発担当への連絡の案内、観測点は印刷要求回数 0、トレースは TR-02 とした。これで終了コード `2` の判別が、概要・関連I/F・境界表の記述とケース表の範囲で揃った。

## 3. 申し送り

- R1-2（F001）は要判断。`_UNDECIDED_` の値の食い違いを登録簿（PJR）へ転記する候補であることと記録先は、本文に足していない。kata-guide は `vp-pm-control-reporting` を kata の段のレビューで使わない観点としている。一方、etc-rulebook は未決事項の登録簿への引き継ぎをドキュメントメタ情報標準に任せている。採らなかった案は、`_UNDECIDED_` の段落に転記先の登録簿を 1 文足すこと。
- F003・F004 は `vp-qe-verifiability` の指摘で、R4 の観点に当たる。R4 では、`et-receipt-print-failure-handling-030` の期待値を「`receipt-print` の終了コード `1`」と明記する案がある。あわせて、`et-receipt-print-failure-handling-010` の期待値と観測点に印字状態 `unknown` を加える案もある。
- F007 は `vp-ux-language-consistency` の指摘で、R3 の観点に当たる。R3 では、`et-receipt-print-contract-030` と `et-receipt-print-failure-handling-010` の警告を「結果不明の警告」に揃える案がある。
- F006 は kata 相互の整合の問題で、R5 の `vp-qe-kata-conformance` で扱う。`ifx-cmd-sample.yaml` は `timeout_seconds: 30`・`retry.max_attempts: 3` を定め、etc-index-sample と本書は「応答待ち10秒・自動再送なし」としていて、両者が食い違っている。R5 では、相手側のどちらの値を揃えるかを判断する。
- R1-1: R1 / 6.1. 観点: 印刷結果の判別 / 責務『印字完了・送信前失敗・結果不明を区別』と関連I/F・境界表に挙げた終了コード `2`（入力不正）を判別するケースがなく、責務に対し要る内容が欠けている（grade F002・F005） / `et-receipt-print-contract-050` を追加した（入力: 印字形式に適合しないレシートファイル、期待値: 終了コード `2`・印字状態 `failed`・開発担当への連絡を案内、観測点: 印刷要求回数 0、TR-02） / vp-qe-kata-conformance、vp-po-purpose-alignment、etc-rulebook『記述ガイド』の受入確認 2、ifx-cmd-sample.yaml `exit_codes` の code 2（`input_error`、プリンタへ未送信） / -
- R1-2: R1 / 4. 境界/依存/環境 の `_UNDECIDED_` / 値の食い違いを登録簿（PJR）へ転記する候補であることと記録先が書かれていない（grade F001、`vp-pm-control-reporting`） / - / kata-guide『kata の観点の組』は `vp-pm-control-reporting` を kata の段のレビューで使わない観点としているため、本文に記録先は足さなかった。ただし etc-rulebook『全体方針』は未決事項の登録簿への引き継ぎをドキュメントメタ情報標準に任せている。採らなかった案は、`_UNDECIDED_` の段落に転記先の登録簿を 1 文足すこと / 要判断
- R1-3: R1 / 6.1・6.2 のケース表 / 期待値の主語の明示（F003）と、無応答の打ち切り後の印字状態 `unknown`（F004）は正しさ・検証可能性の指摘で、R1 の観点に当たらない / - / vp-qe-verifiability は R4 の観点。R4 で `et-receipt-print-failure-handling-030` の期待値を『`receipt-print` の終了コード `1`』と明記し、`et-receipt-print-failure-handling-010` の期待値と観測点に印字状態 `unknown` を加える案 / -
- R1-4: R1 / 6.1・6.2 のケース表 / 印字状態 `unknown` の行を『印刷失敗の警告』と呼んでいる（F007） / - / vp-ux-language-consistency は R3 の観点。R3 で `et-receipt-print-contract-030`・`et-receipt-print-failure-handling-010` を『結果不明の警告』にそろえる案 / -
- R1-5: R1 / 4. 境界/依存/環境 の `_UNDECIDED_` / ifx-cmd-sample.yaml の `timeout_seconds: 30`・`retry.max_attempts: 3` と、etc-index-sample・本書の『応答待ち10秒・自動再送なし』が食い違っている（F006） / - / kata 相互の整合は R5 の `vp-qe-kata-conformance` で扱う。相手側の ifx-cmd-sample か etc-index-sample の値をそろえる案を R5 で判断する / -

## 4. 進め方と実践の型の適用

根拠とした規範は、kata-guide の R1 の段、sample-authoring-standard、etc-rulebook の「記述ガイド」の受入確認 2、ifx-cmd-sample.yaml の `exit_codes`（code 2 の `input_error`）、観点 `vp-po-purpose-alignment` と `vp-qe-kata-conformance` である。rulebook を正として、責務と関連I/Fに挙げた内容にケースが対応するよう不足を足した。既存の記述のうち、根拠と整合するものは維持した。未解消の finding は F001（要判断）、F006（R5 で相手側の値を判断）、F003・F004・F007（R3・R4 で対応）で、いずれも handoff に理由と次のアクションを記した。grade result のサイドカーは編集していない。
