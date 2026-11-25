---
specdojo:
  id: prj-0001:xer-t-kata-review-all-etc-sample-150-20261125t024734z-dcc014c4
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-etc-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-etc-sample-150/T-KATA-REVIEW-ALL-etc-sample-150-20261125T024734Z-dcc014c4/plan.md
  started_at: "2026-11-25T02:47:43.033Z"
  completed_at: "2026-11-25T03:00:44.830Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:etc-sample
    - specdojo:etc-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として `docs/ja/specdojo/samples/etc-sample.md` を etc-index と ifx-cmd-sample に照らして見直し、sample 側で直せる食い違いを修正した。
- 主な修正は、「認証・認可」を立てない理由の追記、観点「印刷応答待ちの上限遵守」（`perspective_key: response-timeout`）の追加、依存の扱いへの遅延の追記、`_UNDECIDED_` 段落の更新範囲の拡張である。
- etc-index-sample と ifx-cmd-sample 側を直すべき点は変更せず、handoff に直す案を残した。
- executor の検証（prettier、markdownlint）と runner の検証（`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema`）は passed。ほかは変更種別により `not_applicable`。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/etc-sample.md`: etc-index の観点の型・スタブの分担に合わせて整合させた（+19/-2 行）。観点の章の冒頭に「認証・認可」を立てない理由を1行追記した。観点「印刷応答待ちの上限遵守」を追加し、9秒遅延で成功するケースと、途中の stdout の後に無応答となり10秒で子プロセスが終わり `unknown` になるケースを置いた。「依存の扱い」に遅延を追加した。`_UNDECIDED_` 段落は、更新対象を `failure-handling-010`・`failure-handling-020`・`response-timeout-010` と本表のタイムアウトに広げ、役割の割り当て（「QE が」）を消し、追う場所を `etc-index` の「メモ / 将来課題」とした。

## 3. 申し送り

- F002・F005（終了コード `2` のケース漏れ）、F003（`failure-handling-030` の「終了コード `1`」の主語）、F004（`failure-handling-010` の印字状態 `unknown`）、F007（警告の呼び方）の扱いは、executor の handoff に項目がない。差分の概要からは解消の有無を確認できない。再評価で確認が要る。
- F001 は、観点 `vp-pm-control-reporting` が kata のレビューに使われないため、登録簿（PJR）への転記を書いていない（executor の判断）。
- R5-1: R5 / 6. テスト観点とケース / etc-index の「観点の立て方（共通）」は、当てはまらない観点の型の理由を `etc-&lt;term&gt;` に1行で残すよう求めているが、「認証・認可」を立てない理由がなかった / 章の冒頭に「`receipt-print` は端末内のコマンドで認証を持たないため立てない。権限不足（終了コード `5`）は「印刷結果の判別」で扱う」を足した / `vp-qe-kata-conformance`（etc-index の「観点の立て方（共通）」） / -
- R5-2: R5 / 6.5. 観点: 印刷応答待ちの上限遵守 / etc-index が `etc-receipt-print` 用に名前を挙げている観点「印刷応答待ちの上限遵守」（ET で扱う範囲の非機能）と、「条件の立て方（共通）」の境界「応答待ち上限の1秒前（9秒）」のケースがなかった。責務の「子プロセスを終了させ、不完全な stdout を採用しない」を確かめるケースもなかった / `perspective_key: response-timeout` の観点を足し、9秒の遅延で成功するケース（010）と、途中の stdout の後に無応答となり10秒で子プロセスが終わり `unknown` になるケース（020）を置いた / `vp-qe-kata-conformance`、ifx-cmd-sample の `error_handling.timeout_action` / -
- R5-3: R5 / 4. 境界/依存/環境 / 「依存の扱い」のスタブで再現するものに遅延がなく、遅延スタブを使う `et-receipt-print-duplicate-prevention-020` や、etc-index の「無応答・遅延・再送上限はスタブで再現する」と合っていなかった / 「無応答・遅延・応答 JSON の欠落・送信前ビジー」にした / `vp-qe-kata-conformance`（etc-index の「外部結合テスト共通の境界/依存/環境の扱い」） / -
- R5-4: R5 / 4. 境界/依存/環境 の `_UNDECIDED_` / 値がそろったときに直すケースが `et-receipt-print-failure-handling-020` だけで、10秒に依存する `et-receipt-print-failure-handling-010`・`et-receipt-print-response-timeout-010`・本表のタイムアウトが抜けていた。前の段で入った「QE が」は、Sample 記述標準の「文書を作る役割の割り当てを本文に書かない」に反していた。追う場所も書かれていなかった（F001 の指摘の実質） / 更新の範囲を3ケースと本表のタイムアウトに広げ、「QE が」を消し、追う場所を `etc-index` の「メモ / 将来課題」とした / `vp-qe-kata-conformance`、`vp-dev-change-impact`、Sample 記述標準の「記述ガイド」。F001 の観点 `vp-pm-control-reporting` は kata-guide で kata のレビューに使わない観点のため、登録簿への転記は書いていない / -
- R5-5: R5 / 4. 境界/依存/環境 の `_UNDECIDED_`（F006） / ifx-cmd-sample の `execution.timeout_seconds: 30`・`error_handling.retry.max_attempts: 3`（`transient_failure`）と、etc-index・本書の「応答待ち10秒・自動再送なし」が相反したまま / - / 相手側を直す案: ifx-cmd-sample は ready の連携仕様で I/F 契約の正本のため、etc-index の「外部結合テスト共通の境界/依存/環境の扱い」と「条件の立て方（共通）」の遅延の境界を30秒（境界は29秒）と送信前ビジーの再試行3回に合わせ、そのうえで etc-sample の `failure-handling-010`・`failure-handling-020`・`response-timeout-010` を直す。迷った理由: 業務上の待ち時間として10秒を採る判断が etc-index 側にある可能性があり、ifx-cmd-sample の側を10秒・再試行なしに変える案も選べる。rulebook の禁止事項（etc-index の上書き）により、sample 側だけでは決められない。`vp-qe-kata-conformance` / 要判断
- R5-6: R5 / etc-index-sample の「ケース表の共通カラム」 / 記入例の行（`et-receipt-print-failure-handling-010`）の期待値「印刷失敗の警告」と観測点（印字状態がない）が、etc-sample の同じケース（印字状態 `unknown`、結果不明の警告、観測点に印字状態）と食い違う / - / 相手側を直す案: etc-index-sample の記入例の期待値を「10秒で打ち切り、印字状態が `unknown`、販売記録が1件のまま、結果不明の警告を表示する」に、観測点を「印字状態、販売記録の件数、印刷要求の回数、警告の表示」にする。`vp-qe-kata-conformance`、`vp-ux-language-consistency` / -
- R5-7: R5 / etc-index-sample の「外部結合テスト共通の境界/依存/環境の扱い」 / 合格基準の例「応答待ち10秒で打ち切り、…店番に印刷失敗の警告を表示する」が、無応答を結果不明として区別する etc-sample の責務、および ifx-cmd-sample の `timeout_action`（印字結果不明として通知）と食い違う / - / 相手側を直す案: etc-index-sample の例を「…店番に結果不明の警告を表示する」にする。`vp-qe-kata-conformance`、`vp-ux-language-consistency` / -

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に沿い、etc-sample を etc-index、ifx-cmd-sample、Sample 記述標準に照らして R5（整合）の観点で見直した。sample 側で直せる点は差分で直した。相手側（etc-index-sample、ifx-cmd-sample）の食い違いは変更せず、直す案を handoff に残した。根拠は `vp-qe-kata-conformance`、`vp-dev-change-impact`、`vp-ux-language-consistency` である。応答待ち10秒・自動再送なしと、ifx-cmd-sample の `timeout_seconds: 30`・`retry.max_attempts: 3` の食い違い（F006）は未解消で、「要判断」の印を付けている。etc-index の上書きは rulebook の禁止事項に当たるため、sample 側だけでは決められない。`status` は `draft` のまま据え置いた。
