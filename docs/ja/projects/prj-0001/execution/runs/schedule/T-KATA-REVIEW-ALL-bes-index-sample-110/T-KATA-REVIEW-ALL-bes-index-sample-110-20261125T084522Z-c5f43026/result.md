---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bes-index-sample-110-20261125t084522z-c5f43026
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bes-index-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bes-index-sample-110/T-KATA-REVIEW-ALL-bes-index-sample-110-20261125T084522Z-c5f43026/plan.md
  started_at: "2026-11-25T08:45:32.270Z"
  completed_at: "2026-11-25T08:58:22.300Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bes-index-sample
    - specdojo:bes-index-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）として `bes-index-sample` を見直し、3.2 節を照合結果の表に改めた。対応 rulebook の「検証と引き渡し」が求める照合結果の記録が不足していた指摘（F003）に対応した。
- F001（`vp-pm-plan-feasibility`）と F002（`vp-pm-control-reporting`）は採らなかった。kata ガイドは両観点を kata の段のレビューで使わないとしている。Sample 記述標準は役割の割り当てや承認の進み具合を本文に書くことを禁じている。
- 検証では、`npx prettier --check` と runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。その他の検査は変更種別により非適用だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bes-index-sample.md`: 3.2 節を「照合の結果と確定入力として扱う条件」に改め、確かめたこと・結果・確定入力としての扱いの 3 列の表にした。上位 CDFD との対応（10 領域・10 行。`P-03` と `P-05` は起点イベントの文言に差がある）、必須列の空欄 0 件、ID の形式違反・重複 0 件、発生・不成立の判定、詳細化の対応（`bes-cash-sale-confirmed` は一致、`bes-credit-sale-over-limit` は未作成のため未実施）、事実データの照合（未実施）を記録した。

## 3. 申し送り

- `P-03`（`bes-cash-sale-confirmed`）と `P-05`（`bes-stock-movement-recorded`）の 2 行は、cdfd-overview-sample の起点イベントの文言と異なる。executor の handoff No.4 のとおり、R5 で CDFD 側と一覧側のどちらを直すかを決める必要がある（要判断）。決まるまで 2 行は確定入力にしない扱いにしている。
- 事実データとデータモデルの照合、および `bes-credit-sale-over-limit` の個別 BES の作成は未実施で、3.2 節の表に未実施として記録している。
- No: 1 / 段: R1 / 箇所: 「未決事項と承認条件」の 3.2 節（旧「確定入力として扱う条件」） / 指摘: rulebook の「検証と引き渡し」は照合結果を残すよう求めているが、本節は確定入力の条件だけを示し、照合した結果を記録していなかった（F003、`vp-qe-kata-conformance`） / 直した案: 節名を「照合の結果と確定入力として扱う条件」に改め、確かめたこと・結果・確定入力としての扱いの 3 列の表にした。上位 CDFD との対応（10 領域・10 行・欠落なし、`P-03`・`P-05` は起点イベントの文言と差あり）、必須列の空欄 0 件、ID の形式違反・重複 0 件、発生・不成立を判定できること、詳細化の対応（`bes-cash-sale-confirmed` は一致、`bes-credit-sale-over-limit` は未作成のため未実施）、事実データの照合（未実施）を記録した / 根拠: `specdojo:bes-index-rulebook` の「検証と引き渡し」と「本文要件」の『未決事項と承認条件』、cdfd-overview-sample のプロセス領域表、bes-sample の 17 行目 / 印: -
- No: 2 / 段: R1 / 箇所: 3.1 節の『事実データが…未照合』の行 / 指摘: F001（`vp-pm-plan-feasibility`）は、照合と未作成の BES の作成に作業担当の Role code を対応付けるよう求めている / 直した案: 採らない。kata ガイドの「kata の観点の組」は `vp-pm-plan-feasibility` を kata の段のレビューで使わない観点としており、Sample 記述標準の「記述ガイド」も文書の役割の割り当てを本文に書くことを禁じている / 根拠: `docs/ja/specdojo/guides/kata-guide.md` の「kata の観点の組」、`specdojo:sample-authoring-standard` の「記述ガイド」と「禁止事項」 / 印: -
- No: 3 / 段: R1 / 箇所: 3.1 節の『発注のない納品』の行 / 指摘: F002（`vp-pm-control-reporting`）は、未決事項に報告先や決定記録の転記先を対応付けるよう求めている / 直した案: 採らない。この観点は kata の段のレビューで使わず、承認と留保は登録簿の個票で追うと Sample 記述標準が定めている / 根拠: `docs/ja/specdojo/guides/kata-guide.md` の「kata の観点の組」、`specdojo:sample-authoring-standard` の「記述ガイド」 / 印: -
- No: 4 / 段: R1（R5 へ申し送り） / 箇所: 業務イベント一覧の `bes-cash-sale-confirmed`（`P-03`）・`bes-stock-movement-recorded`（`P-05`）の行と冒頭の概要 / 指摘: 冒頭は起点イベントの文言を上位 CDFD を正本とすると述べているが、2 行のイベント名が cdfd-overview-sample の起点イベント（「顧客が売場の商品を持って会計を申し出た」「販売が記録された」）と異なる。照合の表では、決まるまで 2 行を確定入力にしないとした / 直した案: R5 で、cdfd-overview-sample の起点イベントの文言を直すか、一覧の行名と発生条件を CDFD に合わせるかを決める。`P-03` は bes-sample が「購入した」の行を前提にしているため、両方を合わせて直す必要がある / 根拠: cdfd-overview-sample の 44 行目・52 行目、bes-sample の 17 行目 / 印: 要判断

## 4. 進め方と実践の型の適用

根拠にしたのは、kata ガイドの「kata の観点の組」と、`specdojo:sample-authoring-standard` の「記述ガイド」「禁止事項」、`specdojo:bes-index-rulebook` の「検証と引き渡し」と「本文要件」である。cdfd-overview-sample のプロセス領域表と bes-sample も照合に使った。rulebook を正とし、F003 は照合結果の記録を足して解消した。F001 と F002 は、kata の段で使わない `vp-pm` 観点であり、本文に作業担当や報告先を書くことが標準で禁じられているため見送った。見送りの理由と次のアクションは handoff に記録した。維持した記述は、10 領域の行と 8 列の構成、ID の形式、3.1 節の未決事項である。
