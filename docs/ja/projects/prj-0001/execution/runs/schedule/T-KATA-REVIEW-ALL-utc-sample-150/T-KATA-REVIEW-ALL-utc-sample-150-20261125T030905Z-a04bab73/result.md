---
specdojo:
  id: prj-0001:xer-t-kata-review-all-utc-sample-150-20261125t030905z-a04bab73
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-utc-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-utc-sample-150/T-KATA-REVIEW-ALL-utc-sample-150-20261125T030905Z-a04bab73/plan.md
  started_at: "2026-11-25T03:09:14.484Z"
  completed_at: "2026-11-25T03:21:47.228Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:utc-sample
    - specdojo:utc-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `utc-sample.md` を、同じ接頭辞の `utc-index-sample` と `tsp-index-sample` に照らして見直した。
- TR-05 のリンク表示名を `tsp-index-sample` の題名に合わせ、全ケースの暫定の証跡を `utc-index-sample` の共通カラムの書き方に合わせた。
- F001・F002・F009 は、kata-guide の「kata の観点の組」が段のレビューで使わないと決めている観点のため、R5 では扱っていない。
- F008 は、前の段の直しで境界/依存の列に例外の適用がすでに書かれていたため、追加の直しはしていない。
- F003・F004・F005 の扱いは evidence に記載がない。F004・F005 は、証跡の列に `tests/unit/sales-checkout.test.ts` のパスと実行結果を入れた直しで関連する範囲が解消した可能性があるが、evidence からは断定できない。
- executor の検証では `npx prettier --write` と `npx markdownlint` が通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。
- 相手側（`utc-index-sample`）を直す案は 2 件あり、handoff に残した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/utc-sample.md`: TR-05 のリンクの表示名を「テスト戦略・方針」に直した。6 ケースの証跡の列を「暫定: `tests/unit/sales-checkout.test.ts` のローカル実行結果（2026-06-10・コミット `3f2a9c1`・6件失敗0件）、CI 整備後に差し替え」に揃えた。値は架空の例である。表の列幅は prettier で整形した。

## 3. 申し送り

- R5-2 の証跡の値（実行日・コミット・件数）は架空の例である。値を入れず書き方だけを示す案は、完成例として具体値のほうが手本になるため採っていない。要判断。
- R5-3（F007）の相手側の案: `utc-index-sample` の `utc-sales-checkout` の責務を「請求額の計算と、会計確定時の在庫引当」にし、観点名の例「釣銭計算の正しさ」を「請求額計算の正しさ」にする。根拠は、`bac-sample` の C-01・C-02 では受領額と請求額が同額で釣銭の条件がないこと。本書に釣銭の責務とケースを足す案は、BAC に根拠がなく仮定が増えるため採っていない。要判断。
- R5-4（F006）の相手側の案: `utc-index-sample` の共通カラムの記入例（`case_id` `ut-sales-checkout-stock-allocation-020`）の条件と期待値を、本書の行と同じ文言にする。トレースと受領額はすでに揃っている。
- R5-1: R5 / 5. トレース / TR-05 のリンクの表示名「テスト戦略」が tsp-index-sample の題名「テスト戦略・方針」と、utc-index-sample での呼び名と違う / 表示名を「テスト戦略・方針」にした / vp-qe-kata-conformance（kata 相互の整合） / -
- R5-2: R5 / 6. テスト観点とケース（全ケース表の証跡の列） / utc-index-sample の「ケース表の共通カラム」は暫定の証跡を「暫定: ローカル実行結果（実行日・コミット・実行件数）、CI 整備後に差し替え」と定めているが、本書には実行日・コミット・実行件数がない / 6 ケースの証跡を「暫定: `tests/unit/sales-checkout.test.ts` のローカル実行結果（2026-06-10・コミット `3f2a9c1`・6件失敗0件）、CI 整備後に差し替え」にした / vp-qe-kata-conformance。値は架空の例。値を入れずに書き方を表の前の 1 文で示す案は、完成例として具体値を示すほうが手本になるため採らなかった / 要判断
- R5-3: R5 / 1. 概要・2. 責務 / utc-index-sample の「テスト対象の括り方と分割基準」は utc-sales-checkout の責務を「請求額・釣銭の計算」とし、「観点の立て方（共通）」で「釣銭計算の正しさ」に触れるが、本書の責務とケースに釣銭がない（F007） / - / 相手側の案: utc-index-sample の表の責務を「請求額の計算と、会計確定時の在庫引当」にし、観点名の例の「釣銭計算の正しさ」を「請求額計算の正しさ」にする。bac-sample の C-01・C-02 は受領額と請求額が同じ額で、釣銭の条件がないため。本書に釣銭の責務とケースを足す案は、BAC に根拠がなく仮定を増やすため採らなかった / 要判断
- R5-4: R5 / 6.1.2. 条件・ケース表 / utc-index-sample の共通カラムの記入例（同じ `case_id` `ut-sales-checkout-stock-allocation-020`）とは、トレースと受領額はすでにそろっている。残る差は条件の「環境: なし」と期待値の言い回し（「1件確定し、在庫が5個から0個になる」と「確定し、在庫が0個になる（負にならない）」）（F006） / - / vp-qe-kata-conformance。相手側の案: utc-index-sample の記入例の条件と期待値を本書の行と同じ文言にする / -
- R5-5: R5 / 6.3.2. 条件・ケース表 / F008（印刷要求のケースに例外の適用がない）は、前の段の直しで境界/依存の列に「`receipt-print` Mock（例外: 印刷要求データへの変換のみ）」がすでに書かれ、index が求める適用した例外と依存の制御方法の両方がある / - / vp-qe-kata-conformance。追加の直しは要らない / -
- F001・F002・F009（vp-po-decision-readiness・vp-pm-dependency-risk・vp-ops-release-readiness）は、kata-guide の「kata の観点の組」が段のレビューで使わないと決めている観点のため、R5 では扱っていない。

## 4. 進め方と実践の型の適用

根拠は、同じ接頭辞の `utc-index-sample`、参照先の `tsp-index-sample` と `bac-sample`、rulebook、kata-guide の R5 の定義である。指摘のうち R5 の観点（`vp-qe-kata-conformance`）に当たるものだけを扱い、sample 側を直した。相手側を直すべき点は変更せず、案として handoff に残した。構造・必須項目・禁止事項は rulebook を正とした。成果物の `status` は `draft` のまま据え置いた。
