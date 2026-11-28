---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bac-sample-150-20261126t065052z-92a91168
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bac-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bac-sample-150/T-KATA-REVIEW-ALL-bac-sample-150-20261126T065052Z-92a91168/plan.md
  started_at: "2026-11-26T06:51:03.754Z"
  completed_at: "2026-11-26T06:59:20.628Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bac-sample
    - specdojo:bac-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `bac-sample` を、参照先の `bes-sample` と突き合わせて見直した。BAC-01 の操作と根拠が、業務イベントの発生条件と事実データにある釣銭の確認を含んでいなかったため、これを直した。
- grade の F001 は前の段で解消済みだった。`based_on` は `prj-success-criteria-and-acceptance-criteria-sample` と `bes-sample` に接続されており、`kinuya-bps-cash-sale` の記述は本文に残っていない。この段では変更していない。
- 相手側の文書を直すべき食い違い 2 件は、本文を変えずに findings へ渡した。どちらも要判断である。
- executor は `npx prettier --check` を実行し、通過した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 2.1. BAC-01 現金販売を確定して記録を照合する（根拠、2.1.2. 操作） | 操作と根拠が釣銭の確認を含んでいなかった。`bes-sample` の「発生条件」3（受領と釣銭の確認）や、「事実データ」の釣銭金額（釣銭なしも識別する）と食い違っていた。 | 操作を「受領額と釣銭がないことを確認して販売を確定する」に、根拠を「商品明細・請求金額・受領金額・釣銭金額」に直した。 | `vp-qe-kata-conformance`（参照先の `bes-sample` と整合） | - |
| R5-2 | R5 | 2.1.4. 判定方法（BAC-01） | BAC-01 は AC-01 を具体化したものだが、`prj-success-criteria-and-acceptance-criteria-sample` の AC-01 の確認者は「両代表」である。BAC-01 の C-01・C-02 の確認者は「同行レビュー担当」で、確認者が食い違う。 | -（本文は変更していない）。案A: BAC-01 の確認者を両代表に変える。案B: `prj-success-criteria-and-acceptance-criteria-sample` に、詳細化した受入条件では確認者を分けてよいと注記する。 | `vp-qe-kata-conformance`。迷った理由: 操作者（店番担当＝両代表）と確認者を分けるのは、詳細化として妥当とも読める。 | 要判断 |
| R5-3 | R5 | 1. 概要（対象範囲）と 2.2. BAC-02 | `tsp-index-sample` の 55 行目は「確定前の取消」を BAC-01〜BAC-03 に含めるが、`bac-sample` に確定前の取消のシナリオはない。近いのは BAC-02 の在庫不足のときの購入中止だけである。`atc-index-sample` の 40 行目も、BAC-02・BAC-03 と並べて確定前の取消を挙げている。 | -（`bac-sample` は変更していない）。相手側の案: `tsp-index-sample` の 55 行目から「確定前の取消」を外し、BAC の対象外か別の受入条件へ委ねる。もう一つの案は、`trc-requirements-to-tests-sample` の 99 行目が挙げるとおり、`bac-sample` に確定前の取消の受入条件を足すことである。後者は店主代表の業務判断が要る。 | `vp-qe-kata-conformance`、`vp-dev-change-impact` | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bac-sample.md`: BAC-01 の操作を「受領額と釣銭がないことを確認して販売を確定する」に直した。根拠には商品明細・請求金額・受領金額・釣銭金額を挙げた。これで `bes-sample` の発生条件 3 と事実データの釣銭金額に揃った。変更は 2 行の差し替えだけで、`status` は変えていない。

## 3. 申し送り

- R5-1: R5 / 2.1. BAC-01 現金販売を確定して記録を照合する（根拠、2.1.2. 操作） / 操作と根拠が釣銭の確認を含まず、[[specdojo:bes-sample]] の「発生条件」3（受領と釣銭の確認）と「事実データ」の釣銭金額（釣銭なしも識別する）と食い違っていた / 操作を「受領額と釣銭がないことを確認して販売を確定する」に、根拠を「商品明細・請求金額・受領金額・釣銭金額」に直した / `vp-qe-kata-conformance`（参照先の bes-sample と整合） / -
- R5-2: R5 / 2.1.4. 判定方法（BAC-01） / BAC-01 は AC-01 を具体化したものだが、[[specdojo:prj-success-criteria-and-acceptance-criteria-sample]] の AC-01 の確認者は「両代表」、BAC-01 の C-01・C-02 の確認者は「同行レビュー担当」で、確認者が食い違う / - / `vp-qe-kata-conformance`。迷った理由: 操作者（店番担当＝両代表）と確認者を分けるのは詳細化として妥当とも読める。案A: BAC-01 の確認者を両代表に変える。案B: prj-success-criteria-and-acceptance-criteria-sample に、詳細化した受入条件では確認者を分けてよいと注記する。どちらも採らず本文は変えなかった / 要判断
- R5-3: R5 / 1. 概要（対象範囲）と 2.2. BAC-02 / [[specdojo:tsp-index-sample]] の 55 行目は「確定前の取消」を BAC-01〜BAC-03 に含めるが、bac-sample に確定前の取消のシナリオはない（近いのは BAC-02 の在庫不足のときの購入中止だけ）。atc-index-sample の 40 行目も BAC-02・BAC-03 と並べて確定前の取消を挙げている / - / `vp-qe-kata-conformance`、`vp-dev-change-impact`。相手側の案: tsp-index-sample の 55 行目から「確定前の取消」を外し、BAC の対象外か別の受入条件へ委ねる。もう一つの案は、trc-requirements-to-tests-sample の 99 行目が挙げるとおり bac-sample に確定前の取消の受入条件を足すことで、店主代表の業務判断が要る / 要判断
- F001（grade、`vp-qe-kata-conformance`）: 前の段で解消済み。anchor の文（`kinuya-bps-cash-sale`）は本文になく、`based_on` は prj-success-criteria-and-acceptance-criteria-sample と bes-sample に接続済み。残っている `bps-sales-order-flow` の未接続は「メモ / 将来課題」の `_TODO_` の行で追っており、この段では変えていない。
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（pjr 個票・plan・result）を変更していないため）

## 4. 進め方と実践の型の適用

根拠にしたのは、`bac-sample` の `based_on` が指す `bes-sample` と `prj-success-criteria-and-acceptance-criteria-sample`、および `tsp-index-sample`、`atc-index-sample`、`trc-requirements-to-tests-sample` である。`bes-sample` に合わない記述は sample 側で直した。相手側を直すべき点は、変更せずに案を findings に残した。F001 は前の段の修正で解消済みと確認し、追加の改訂はしていない。`bps-sales-order-flow` の未接続は「メモ / 将来課題」の `_TODO_` 行で追っているため、この段では扱っていない。
