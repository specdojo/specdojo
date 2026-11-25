---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-support-sample-120-20261125t074736z-0e543a5c
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-support-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-support-sample-120/T-KATA-REVIEW-ALL-opr-support-sample-120-20261125T074736Z-0e543a5c/plan.md
  started_at: "2026-11-25T07:47:45.747Z"
  completed_at: "2026-11-25T07:59:21.257Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-support-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として `opr-support-sample.md` を直した。手順適用範囲・前提の表を template の行構成にそろえ、手順の模擬の 4 件を証跡の章へ移した。
- R2 の観点に当たらない grade finding（F001〜F004）は本段では扱わず、扱う段へ申し送った。
- executor の `prettier` と `markdownlint-cli2` は成功した。runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` も成功した。変更種別により対象外の検査は `not_applicable` である。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-support-sample.md`: 第 2 章「手順適用範囲・前提」の表を template の行（対象・対象外・時間帯・必要権限・使用手段・連絡先）に合わせた。独自の「問い合わせ者」「一次対応者」の行を廃し、前者を「対象」へ、後者を末尾の「連絡先」へまとめた。手順の模擬の 4 件と導入文を第 11 章「証跡」へ移し、結果の残し方の文の前に置いた。第 2 章の「結果の記録は証跡に従う」の文は不要になったため削った。

## 3. 申し送り

- R2-1: 指摘は「手順適用範囲・前提」の表の行が template と違うこと。独自の「問い合わせ者」「一次対応者」の行があり、「連絡先」の行がなかった。直した案は、「問い合わせ者」を「対象」の行に、「一次対応者」を最後の「連絡先」の行にまとめること（窓口は `OPS`、引き継ぎ先は `DEV`・`PO`・`OPS`）。根拠は `vp-arc-document-structure` と `vp-qe-omissions-consistency`。印は無し。
- R2-2: 指摘は、手順の模擬の 4 件が第 2 章にあり、前提から結論の順に読めないこと。結果の記録は第 11 章にあり、同じ話題が 2 か所に分かれていた。直した案は、4 件と導入文を証跡の章へ移すこと。根拠は `vp-arc-document-structure`。rulebook は確認結果を証跡の章に残すと定めており、`opr-sample` も同じ配置である。印は無し。
- R2-3: 対象は F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）。R2 では扱わず、変更していない。根拠は kata-guide の「kata の観点の組」で、kata の段のレビューでは使わない観点とされていること。承認と ready 化は登録簿で追うため、本文には足さない。印は無し。
- R2-4: F002（保管期間の判定値、`vp-qe-verifiability`）は R4 に任せる。F003（関連ドキュメント導線で `opr-incident` を「予定」としているが `opr-incident-sample` は実在する点と、`opr-sample` を `opr-index` と呼ぶ点、`vp-qe-kata-conformance`）は R5 に任せる。根拠は kata-guide の「kata の観点の組」で、これらの観点を R4・R5 が受け持つこと。印は無し。
- R2-5: 箇所は編集対象の解決。plan は編集対象を `opr-sample.md` と解決しているが、レビュー対象と finding は `opr-support-sample` を指す。`opr-sample.md` は変更せず、`opr-support-sample.md` だけを直した。根拠は、plan の targets に `specdojo:opr-support-sample` が含まれていることと、`opr-sample.md` は R2 の対象ではないこと。印は「要判断」。
- R2-1: R2 / 2. 手順適用範囲・前提 / 表の行が template（対象・対象外・時間帯・必要権限・使用手段・連絡先）と違う。独自の「問い合わせ者」「一次対応者」の行があり、「連絡先」の行がない / 「問い合わせ者」を「対象」の行に、「一次対応者」を template の順で最後に置いた「連絡先」の行にまとめた（窓口は `OPS`、引き継ぎ先は `DEV`・`PO`・`OPS`） / `vp-arc-document-structure`（template の手順適用範囲・前提の表）、`vp-qe-omissions-consistency`（連絡先の欠落） / -
- R2-2: R2 / 2. 手順適用範囲・前提 → 11. 証跡 / 手順の模擬の 4 件が第 2 章にあり、まだ説明していない分類と完了条件を前提にしているため、前提から結論の順に読めない。結果の記録は第 11 章にあり、同じ話題が 2 か所に分かれている / 4 件の箇条書きと導入の文を証跡の章へ移し、結果の残し方の文の前に置いた。「結果の残し方は証跡に従う」は不要になったので削った / `vp-arc-document-structure`。rulebook の「運用作業の受入確認」は確認結果を証跡の章に残すと定めており、`opr-sample` も証跡の章に置いている / -
- R2-3: R2 / 1. 概要〜12. 関連ドキュメント導線 / grade の F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）を確かめた / - / kata-guide の「kata の観点の組」で、kata の段のレビューでは使わない観点とされている。承認と ready 化は登録簿で追うため、本文には足さない / -
- R2-4: R2 / 11. 証跡・12. 関連ドキュメント導線 / F002（保管期間の判定値、`vp-qe-verifiability`）は R4、F003（関連ドキュメント導線で `opr-incident` を「予定」としているが `opr-incident-sample` は実在する。`opr-sample` を `opr-index` と呼んでいる点の整合、`vp-qe-kata-conformance`）は R5 で扱う / - / kata-guide の「kata の観点の組」で、R4・R5 が受け持つ観点 / -
- R2-5: R2 / 編集対象 / plan は編集対象を `opr-sample.md` と解決しているが、レビュー対象と finding は `opr-support-sample` を指す。`opr-sample.md` は変更せず、`opr-support-sample.md` だけを直した / - / plan の targets に `specdojo:opr-support-sample` が含まれている。`opr-sample.md` を直す案は選ばなかった（R2 の対象ではないため） / 要判断

## 4. 進め方と実践の型の適用

plan と kata-guide の R2（構成）の観点に従い、R1 の後の版を対象に、template の行構成との差と章の配置を確かめた。変更は sample のみで、rulebook など sample 以外は変更していない。直した 2 点は、表の行を template にそろえたことと、模擬の 4 件を証跡の章へ移したことである。plan に展開された finding F001〜F004 は R2 の観点に当たらないため、本段では扱わず、扱う段へ申し送った。F001 と F004 は kata の段のレビューでは使わない観点で、F002 は R4、F003 は R5 が受け持つ。これらの指摘は未解消のまま残る。grade result サイドカーは直接編集していない。
