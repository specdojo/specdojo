---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sf-sample-140-20261126t062322z-90efa0a5
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sf-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sf-sample-140/T-KATA-REVIEW-ALL-sf-sample-140-20261126T062322Z-90efa0a5/plan.md
  started_at: "2026-11-26T06:23:33.372Z"
  completed_at: "2026-11-26T06:33:39.236Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sf-sample
    - specdojo:sf-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として `sf-sample` の主張を schema、参照先の sample、標準と突き合わせた。type と rulebook、wikilink 先 id、P-03〜P-06 の名称、プロジェクト方針、`_UNDECIDED_` の目印、`V-02` の金額計算は一致した。
- F003（在庫反映結果の必須性）と F006（税込単価と税抜単価の食い違い）を `docs/ja/specdojo/samples/sf-sample.md` で直した。F005 は `Q-01` の行で直し済みと executor が報告している。
- `br-tax-calculation`、`sf-inventory`、`ifx-api-store-sales` など 7 件の参照先は文書がなく、確かめられなかった。バッククォートで仮置きしている。
- runner の検査は `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed。変更種別に合わない検査は `not_applicable`。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 正しさ | `docs/ja/specdojo/samples/sf-sample.md` 入出力の表（在庫反映結果の行） | 在庫反映結果と保存済みの販売・処理結果が「確定要求時」に必須と読め、保存済み結果のない初回確定にも要求されるように見えた。 | 初回確定・再送・結果照合ごとの必須性と、未記録・未反映の場合の扱いに分けた。 | F003（vp-dev-implementation-readiness）。 | 直し済み |
| 2 | R4 正しさ | `docs/ja/specdojo/samples/sf-sample.md` `Q-01`・入力の表の販売単価の行 | `uis-sample` は税込単価、`bdd-sample.yaml` の販売単価は税抜で食い違う。sf-sample は業務データ辞書を正本とするが、表示・計算・保存に使う価格の対応が特定できない。 | `Q-01` に税込単価と税抜の販売単価の対応の確定を書き足した。`V-02` に税区分・端数処理の条件を加えることも明記した。どちらにそろえるかは R5 の段で判断する。 | F006（vp-qe-kata-conformance）、F005。`uis-sample.md` 42・55 行目と `bdd-sample.yaml` 142 行目との突き合わせ。 | 直し済み（正本の判断は R5 へ） |
| 3 | R4 正しさ | `docs/ja/specdojo/samples/sf-sample.md` 参照先の文書 id 7 件 | `br-tax-calculation`、`sf-inventory`、`ifx-api-store-sales`、`ifx-cmd-receipt-printer`、`opr-pos-operation`、`opr-sales-recovery`、`stsd-sales-transaction` は文書がなく、記述を確かめられなかった。 | - | executor の確かめの表（No8）。バッククォートで仮置きしている。 | 確認不能 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sf-sample.md`: 入出力の表の在庫反映結果の行を、初回確定・再送・結果照合ごとの必須性と、未記録・未反映の場合の扱いに分けた（F003）。`Q-01` に、画面の税込単価と業務データ辞書の税抜の販売単価の対応を明記した。確定後に見直す箇所を `FR-02`・`FR-03` と、税区分・端数処理の条件を加えた `V-02`、`V-04`・`V-05` の照合へ広げた（F004・F005・F006）。prettier で整形した。

## 3. 申し送り

- `uis-sample` は税込単価、`bdd-sample.yaml` の販売単価は税抜で食い違う。どちらにそろえるかは R5 の段で判断が要る。
- F001・F002 は vp-pm-plan-feasibility と vp-pm-control-reporting の指摘で、executor によれば kata-guide のレビューに使わない観点のため扱っていない。
- F004 は R5 の段で扱う観点で、`Q-01`・`Q-02` の確定後に見直す箇所の列で手当て済みと executor が報告している。
- R4 確かめの表: No1 type requirement と rulebook specdojo:sf-rulebook — 正本 deliverable-frontmatter.schema.yaml・sf-rulebook.md — grep — 一致（schema の 8 行目、rulebook の `deliverable_type:` requirement）。No2 wikilink 先の id 6 件 — 各 frontmatter — grep — 一致。No3 P-03〜P-06 の名称 — cdfd-overview-sample.md の 44〜53 行目 — 一致。No4 まず記録する・タブレット 1 台・単一店舗 — prj-overview-sample.md の 42・105 行目と sample-authoring-standard.md の 74 行目 — 一致。No5 `_UNDECIDED_` の目印 — document-metadata-standard.md の 146 行目 — 一致。No6 販売単価の正本は業務データ辞書 — uis-sample.md の 42・55 行目（税込）と bdd-sample.yaml の 142 行目（税抜） — 不一致、Q-01 に対応の確定を書き足した。No7 V-02 の 108 円と釣銭 0 円・92 円 — uis-sample の内税の計算 — 一致。No8 br-tax-calculation・sf-inventory・ifx-api-store-sales・ifx-cmd-receipt-printer・opr-pos-operation・opr-sales-recovery・stsd-sales-transaction — 文書がない — 確かめられない（バッククォートで仮置き）。
- 指摘 F003（vp-dev-implementation-readiness）: 入出力の表で在庫反映結果の行が「確定要求時と結果照合時に必須」となっていた。初回確定・再送・結果照合ごとの必須性と、未記録・未反映の場合の扱いに分けて直した。
- 指摘 F006（不一致）: sf-sample は販売単価の正本を業務データ辞書とする。一方、uis-sample は税込単価、bdd-sample.yaml の販売単価は税抜で、両者が食い違う。sf-sample の Q-01 に対応の確定を書き足した。uis-sample と bdd-sample のどちらにそろえるかは R5 の段で判断してほしい。
- F001・F002 は vp-pm-plan-feasibility・vp-pm-control-reporting で、kata-guide では kata のレビューに使わない観点のため扱わなかった。F004 は R5 の段で扱う観点で、Q-01・Q-02 の確定後に見直す箇所の列で手当て済み。F005 は Q-01 の行で直し済み。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/sf-sample.md だけで、plan・result・個票を変えていないため）

## 4. 進め方と実践の型の適用

根拠は `deliverable-frontmatter.schema.yaml`、`sf-rulebook.md`、`cdfd-overview-sample.md`、`prj-overview-sample.md`、`uis-sample.md`、`bdd-sample.yaml`、`sample-authoring-standard.md`、`document-metadata-standard.md`。主張ごとの確かめは次のとおり。type と rulebook は一致。wikilink 先 id 6 件は一致。P-03〜P-06 の名称は一致。方針（まず記録する・タブレット 1 台・単一店舗）は一致。`_UNDECIDED_` の目印は一致。`V-02` の 108 円と釣銭 0 円・92 円は一致。販売単価の正本（税込と税抜）は不一致のため `Q-01` に書き足した。`br-tax-calculation`、`sf-inventory`、`ifx-api-store-sales`、`ifx-cmd-receipt-printer`、`opr-pos-operation`、`opr-sales-recovery`、`stsd-sales-transaction` は文書がなく確かめられなかった。F003 と F006 は直した。F005 は直し済み。F001・F002 は kata で使わない観点、F004 は R5 の段で手当て済みとして見送った。
