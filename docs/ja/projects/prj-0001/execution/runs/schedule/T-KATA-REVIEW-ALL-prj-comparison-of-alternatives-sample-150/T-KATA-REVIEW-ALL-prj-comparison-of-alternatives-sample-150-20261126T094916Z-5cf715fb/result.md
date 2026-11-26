---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-comparison-of-alternatives-sample-150-20261126t094916z-5cf715fb
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-comparison-of-alternatives-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-comparison-of-alternatives-sample-150/T-KATA-REVIEW-ALL-prj-comparison-of-alternatives-sample-150-20261126T094916Z-5cf715fb/plan.md
  started_at: "2026-11-26T09:49:27.719Z"
  completed_at: "2026-11-26T09:59:32.141Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-comparison-of-alternatives-sample
    - specdojo:prj-comparison-of-alternatives-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、代替案比較 sample を、同じ接頭辞の sample（スコープ、成功基準と受入条件、pm-plan）と照合し、sample 側の食い違い 3 件を直しました。
- 直した内容は、用語を「両代表」と「簡易レポート」にそろえたことと、決定記録を `dec-sample` への wikilink にしたことです。
- 準備期間 2 週間の出典が参照先に見当たらず、どちらを正とするか判断できない 1 件は、変更せず案を残しました（要判断）。
- 整形と、親 runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は成功しました。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 3. 評価軸と評価基準、4.1. D-01、4.3. 比較試行の完了条件 | 「両利用者」が、成功基準と受入条件の sample で定義された「両代表」（店主代表と家族利用者代表）と表記が食い違う。 | 本文と表の「両利用者」をすべて「両代表」に置き換えた。 | vp-qe-kata-conformance（[[specdojo:prj-success-criteria-and-acceptance-criteria-sample]] の判定対象と範囲の段落の定義） | - |
| R5-2 | R5 | 1. 比較目的と前提条件、2.1. D-01 | 「簡易一覧」が、スコープ sample の対象システムの名称「簡易レポート」と食い違う。 | 根拠資料の要約と ALT-04 の主な構成要素を「簡易レポート」にした。 | vp-qe-kata-conformance（[[specdojo:prj-scope-sample]] の対象システムの表） | - |
| R5-3 | R5 | 6. 決定と見直し | 記録先の「決定記録」が素の文字列で、スコープ sample は同じ記録先を dec-sample へのリンクで示している。 | [[specdojo:dec-sample\|決定記録]] の wikilink にした。 | vp-dev-change-impact（参照先を辿れるようにする。[[specdojo:prj-scope-sample]] のスコープ変更方針の記法） | - |
| R5-4 | R5 | 1. 比較目的と前提条件（`_ASSUMPTION_`）、3. 評価軸と評価基準（期間） | 「期間評価の目安は準備着手の承認から2週間」が指す区間は準備期間である。pm-plan-sample の M-02 とスコープ・概要の sample では、2週間は受入後の店頭試用・定着の期間を指し、読み手が取り違えるおそれがある。 | 変更を見送った。直す案: この sample の `_ASSUMPTION_` に「準備期間の目安であり、M-02 の店頭試用2週間とは別」と付記する。または pm-plan-sample の M-02 に準備期間の目安を足して出典を一つにする。準備期間 2 週間の出典が参照先に見当たらず、どちらを正とするか判断できない。 | vp-qe-kata-conformance | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-comparison-of-alternatives-sample.md`: 「両利用者」を「両代表」に、「簡易一覧」を「簡易レポート」に置き換えて、参照先の sample の用語にそろえました。「6. 決定と見直し」の「決定記録」は `dec-sample` への wikilink にしました。prettier で表の列幅を整えました。

## 3. 申し送り

- R5-4 の準備期間 2 週間と M-02 の試用 2 週間の区別は、どちらを正とするか人の判断が要ります。sample の `_ASSUMPTION_` に付記するか、pm-plan-sample の M-02 に準備期間の目安を足すかを決めてください。
- R5-1: R5 / 3. 評価軸と評価基準、4.1. D-01、4.3. 比較試行の完了条件 / 「両利用者」が、成功基準と受入条件の sample で定義された「両代表」（店主代表と家族利用者代表）と表記が食い違う / 本文と表の「両利用者」をすべて「両代表」に置き換えた / vp-qe-kata-conformance（[[specdojo:prj-success-criteria-and-acceptance-criteria-sample]] の判定対象と範囲の段落の定義） / -
- R5-2: R5 / 1. 比較目的と前提条件、2.1. D-01 / 「簡易一覧」が、スコープ sample の対象システムの名称「簡易レポート」と食い違う / 根拠資料の要約と ALT-04 の主な構成要素を「簡易レポート」にした / vp-qe-kata-conformance（[[specdojo:prj-scope-sample]] の対象システムの表） / -
- R5-3: R5 / 6. 決定と見直し / 記録先の「決定記録」が素の文字列で、スコープ sample は同じ記録先を dec-sample へのリンクで示している / [[specdojo:dec-sample|決定記録]] の wikilink にした / vp-dev-change-impact（参照先を辿れるようにする。[[specdojo:prj-scope-sample]] のスコープ変更方針の記法） / -
- R5-4: R5 / 1. 比較目的と前提条件（`_ASSUMPTION_`）、3. 評価軸と評価基準（期間） / 「期間評価の目安は準備着手の承認から2週間」が指す区間は準備期間である。pm-plan-sample の M-02 とスコープ・概要の sample では、2週間は受入後の店頭試用・定着の期間を指し、読み手が取り違えるおそれがある / - / vp-qe-kata-conformance。直す案: この sample の `_ASSUMPTION_` に「準備期間の目安であり、M-02 の店頭試用2週間とは別」と付記する。または pm-plan-sample の M-02 に準備期間の目安を足して出典を一つにする。準備期間 2 週間の出典が参照先に見当たらず、どちらを正とするか判断できないため、変更を見送った / 要判断

## 4. 進め方と実践の型の適用

根拠としたのは、スコープ sample の対象システムの表とスコープ変更方針、成功基準と受入条件の sample の判定対象と範囲、pm-plan-sample の M-02 です。食い違いのうち sample 側で解消できるものは直しました。相手側を直す必要がある準備期間の件は、推測で改訂せず案だけを残して見送りました。
