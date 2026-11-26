---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bes-sample-140-20261126t033506z-1217ea03
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bes-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bes-sample-140/T-KATA-REVIEW-ALL-bes-sample-140-20261126T033506Z-1217ea03/plan.md
  started_at: "2026-11-26T03:35:18.469Z"
  completed_at: "2026-11-26T03:43:24.403Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bes-sample
    - specdojo:bes-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、bes-sample の事実を schema、関連 sample、bes-rulebook と照合した。誤りは F010 の1件だった。
- 金額計算と端数処理の委ね先が `specdojo:br-sample` だった。br-sample は在庫不足判定の仕様で、販売金額も端数も定義していない。そのため委ね先を仮置き ID `br-sales-amount` に直した。この ID は未作成で未照合である。
- F005・F007・F008 は、前の段の直しで確定記録の照合までは未判定になっており、解消済みと判断した。
- F001〜F004、F006、F009、F012、F013 は kata のレビューに使わない観点なので、この段では直していない。F002 と F011 は R4 の観点ではなく、承認者と記録先を追う方針に合わせて扱う段へ任せた。
- 主張ごとの確かめの結果は handoff に記載した。一致が多く、確かめられなかったのは状態定義 `cdsd-order-status` とデータモデル `bdd-sales-record` の2件。どちらも正本が未作成である。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 | 4. 発生条件 / 金額計算と端数処理の委ね先 | `[[specdojo:br-sample]]` を販売金額計算と端数処理の委ね先にしているが、br-sample は在庫不足判定の仕様で、販売金額も端数も定義していない（F010）。 | 仮置き ID `br-sales-amount`（未作成で未照合）に置き換えた。 | vp-arc-technical-constraints、vp-qe-verifiability。`docs/ja/specdojo/samples/br-sample.md` の H1「駄菓子屋きぬや 在庫不足判定」 | - |
| R4-2 | R4 | 4. 発生条件 / 条件1 | `payment_status` / `unconfirmed` は照合先の正本がない物理名で、rulebook の記述ガイド「事実データ」（物理項目名を推測して確定しない）と禁止事項（物理カラムを正本として書かない）に触れるおそれがある。 | - | vp-dev-implementation-readiness。仮置きと `_UNDECIDED_` で未照合を示しているため残した。選ばなかった案は、物理名を外して「会計がまだ確定していない」に絞ること。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bes-sample.md`: 「発生条件」章で、金額計算と端数処理の委ね先を `specdojo:br-sample`（在庫不足判定）から、未作成で未照合の仮置き ID `br-sales-amount` に差し替えた（1行の変更）。

## 3. 申し送り

- `docs/ja/specdojo/samples/bes-sample.md` の条件1にある `payment_status` / `unconfirmed` は、照合先の正本がない物理名である。rulebook の「事実データ」の記述ガイドと禁止事項に触れるおそれがあるが、仮置きと `_UNDECIDED_` で未照合を示しているため残した。選ばなかった案は、物理名を外して「会計がまだ確定していない」に絞ることである。この点は人の判断が要る。
- R4-1: R4 / 4. 発生条件 / 金額計算と端数処理の委ね先が `[[specdojo:br-sample]]` になっているが、br-sample は在庫不足判定で販売金額や端数を定義していない（F010） / 仮置き ID `br-sales-amount`（未作成で未照合）に置き換えた / vp-arc-technical-constraints、vp-qe-verifiability。docs/ja/specdojo/samples/br-sample.md の H1「駄菓子屋きぬや 在庫不足判定」 / -
- R4-2: R4 / 4. 発生条件 / 条件1の `payment_status` / `unconfirmed` は照合先の正本がない物理名で、rulebook の記述ガイド「事実データ」（物理項目名を推測して確定しない）と禁止事項（物理カラムを正本として書かない）に触れるおそれがある / - / vp-dev-implementation-readiness。仮置きと `_UNDECIDED_` で未照合を示しているので残した。選ばなかった案は「会計がまだ確定していない」に絞って物理名を外すこと / 要判断
- 確かめ1: frontmatter（`type: requirement`、`rulebook`、`based_on`、`supersedes`） / docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml、common-frontmatter.schema.yaml、bes-rulebook / 読み取り / 一致 / requirement は deliverableType の enum にあり、`based_on` と `supersedes` は common-frontmatter の72〜75行目で定義されている
- 確かめ2: 導入の `bes-cash-sale-confirmed`（「顧客が商品を購入した」、`P-03`） / docs/ja/specdojo/samples/bes-index-sample.md / grep / 一致 / 25行目と38行目
- 確かめ3: `P-03` が店頭販売 / docs/ja/specdojo/samples/cdfd-overview-sample.md / grep / 一致 / 44行目
- 確かめ4: 2. いつ（確定の記録時点で、控えの印字を待たない） / bes-index-sample.md / 読み取り / 一致 / 25行目
- 確かめ5: 5. 事実データの8項目 / bes-index-sample.md / 読み取り / 一致 / 25行目の事実データ列
- 確かめ6: br-sample が販売金額計算のルールである / docs/ja/specdojo/samples/br-sample.md / 読み取り / 不一致 / 在庫不足判定の仕様だったため R4-1 で直した
- 確かめ7: `payment_status` / `unconfirmed`（`cdsd-order-status`） / docs/ja/specdojo/samples 配下 / grep / 確かめられない / samples に出てこない。状態定義の正本が要る
- 確かめ8: `bps-sales-order-flow` が未作成 / sf-sample.md、bac-sample.md / grep / 一致 / どちらも未作成として扱っている
- 確かめ9: `bdd-sales-record` / samples 配下 / grep / 確かめられない / 出てこない。本文の `_UNDECIDED_` に書いてあるとおりで、データモデルの正本が要る
- F005・F007・F008（確定の成立が不明な場面）は、前の段の直しで「照合するまで未判定」になっており解消済み。F001〜F004、F006、F009、F012、F013 は kata ガイドの「kata の観点の組」で kata のレビューには使わない観点なので直していない。F002 と F011（承認者と記録先）は R4 の観点ではなく、kata の承認は登録簿で追う方針なので扱う段に任せた。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/bes-sample.md だけで、plan・result・個票は変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したのは Markdown だけで、`*.yaml` / `*.yml` は変更していない）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 配下だけ）

## 4. 進め方と実践の型の適用

sample メンテナンスの進め方に従い、R4 として sample の主張を schema、関連 sample、rulebook と突き合わせた。誤りの確証が得られた F010 だけを直した。正本が未作成の主張は推測で直さず、仮置きと未決の記述のまま確かめられなかったものとして残した。kata の観点の組で別の段が扱う finding は、その段に任せた。status は `ready` のまま変えていない。
