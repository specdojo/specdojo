---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-charter-sample-150-20261126t094431z-6f30ae5f
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-charter-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-charter-sample-150/T-KATA-REVIEW-ALL-prj-charter-sample-150-20261126T094431Z-6f30ae5f/plan.md
  started_at: "2026-11-26T09:44:43.301Z"
  completed_at: "2026-11-26T09:54:53.606Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-charter-sample
    - specdojo:prj-charter-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`prj-charter-sample` の未決事項・ハイレベルスコープ・初期ステークホルダーの語と扱いを、管理計画（U-01・U-03）、前提・制約（ACD-D03）、スコープ、概要、ステークホルダー登録簿の各 sample に合わせて直した。
- 未決事項の 3 項目に、管理計画の U-01・U-03 と前提・制約の ACD-D03 への wikilink を置いた。これにより F002 の引き継ぎ先は本文から辿れる。
- F003（template の合格条件列）と F004（「店主」の表記ゆれ）は前の段で解消済みだった。F001 は kata の段のレビューでは使わない観点のため扱っていない。
- 相手側（概要・ステークホルダー登録簿 sample、憲章 template）を直す案は、変更せず findings と handoff に記した。
- executor が実行した整形と markdownlint は成功した。runner の `lint:md:changed`、`lint:fm:changed`、`validate:schema`、`test:docs` なども成功した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 9. 未決事項（費用上限） | 「詳細計画の承認前に確定する」は、管理計画 sample の U-01 が計画内で未決のまま準備着手の条件になっていることと食い違う。 | 影響を「支出を伴う作業と予算枠を判定できない」にした。当面の扱いを「管理計画の U-01 で店主代表が承認するまで、外部支出を行わない」に改め、U-01 への wikilink を置いた。 | `vp-qe-kata-conformance`（`pm-plan-sample` の U-01・M-03、`prj-assumptions-constraints-dependencies-sample` の ACD-C02） | - |
| R5-2 | R5 | 9. 未決事項（リリース目標日） | 論点名がスコープ・管理計画 sample の「初期リリース」とそろわず、決める時期と記録先が管理計画の U-03 につながっていない。 | 論点名を「初期リリースの目標日」にした。当面の扱いを「管理計画の U-03 で、準備着手前に候補を合意し、初期リリース前に確定する」に改めた。 | `vp-qe-kata-conformance`（`pm-plan-sample` の U-03、`prj-scope-sample` の初期対象期間） | - |
| R5-3 | R5 | 9. 未決事項（オフライン時の扱い）、3. ハイレベルスコープ（未確定） | 「詳細計画の承認前に、スコープで対象か対象外かを決める」は、スコープ sample で通信断の日の記録がすでに受入の対象外と決まっていること、前提・制約 sample の ACD-D03 で店主代表が初期運用開始前に運用方針を決めることと食い違う。 | 論点名を「オフライン時の運用方針」、影響を「通信断の日の記録と受入条件が変わる」にした。当面の扱いを「前提・制約の ACD-D03 で、店主代表が初期運用開始前に決める。決めるまで受入の対象外とする」に改めた。ハイレベルスコープの未確定の行も同じ語にした。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`（`prj-scope-sample` のスコープ外の注記、`prj-assumptions-constraints-dependencies-sample` の ACD-D03） | - |
| R5-4 | R5 | 3. ハイレベルスコープ（対象外） | 「EC」「仕入れ先とのシステム連携」が、概要 sample の前提条件の書き方（EC 連携、仕入れ先システム連携）とずれている。 | 「EC 連携」「仕入れ先システム連携」に改めた。 | `vp-qe-kata-conformance`（`prj-overview-sample` の前提条件） | - |
| R5-5 | R5 | 4. 初期ステークホルダー（`STH-SHOP-OWNER`） | 「優先順位」「リリース可否」が、ステークホルダー登録簿 sample の「優先機能」、スコープ sample の「初期リリース」とずれている。 | 「目的、優先機能、予算枠、初期リリースの可否を判断する」に改めた。 | `vp-qe-kata-conformance`（`prj-stakeholder-register-sample` の関係者一覧） | - |
| R5-6 | R5 | 全体（相手側: `prj-overview-sample`、`prj-stakeholder-register-sample`） | 概要 sample とステークホルダー登録簿 sample は「初期公開」、スコープ sample と管理計画 sample は「初期リリース」を使い、kata どうしで語がそろっていない。用語集（`gl-*.yaml`）にはどちらの語もない。 | 相手側の案: 概要 sample とステークホルダー登録簿 sample の「初期公開」を「初期リリース」へ統一する。または、用語集に一方を登録して他方を言い換える。憲章は直接の詳細化先（スコープ・管理計画）に合わせて「初期リリース」を選んだ。 | `vp-qe-kata-conformance`。概要 sample は「初期公開（店頭で使い始める最初の版の提供）」と定義しており、どちらを正とするかは PO の判断が要る。 | 要判断 |
| R5-7 | R5 | 1. 認可対象（相手側: `prj-charter-template`） | rulebook の「認可対象」は、承認に条件が付く場合だけ「認可条件」の行を足すと定めているが、template はこの行を常に置いており、sample（条件なし）と構成がずれる。 | 相手側の案: `prj-charter-template` の「認可条件」の行に、条件がない場合は行を削ることを示す `_TODO_` を添える。 | `vp-qe-kata-conformance` | - |
| R5-8 | R5 | grade の finding の扱い | F003（template に合格条件の列がない）と F004（「店主」の表記ゆれ）は、前の段ですでに直っていた（template の 7 章に合格条件の列があり、開発担当の行は「店主代表に示す」）。F001・F002 は `vp-pm-plan-feasibility`・`vp-pm-control-reporting` で、kata の段のレビューでは使わない観点のため扱わない。 | R5-1〜R5-3 で未決事項を U-01・U-03・ACD-D03 へつないだため、F002 の引き継ぎ先は本文から辿れる。 | kata-guide の「kata の観点の組」 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-charter-sample.md`: 未決事項表を管理計画の U-01・U-03 と前提・制約の ACD-D03 に対応づけ、論点名を「初期リリースの目標日」「オフライン時の運用方針」に改めた。ハイレベルスコープの未確定の行と対象外の語（EC 連携、仕入れ先システム連携）、店主代表の判断対象（目的、優先機能、予算枠、初期リリースの可否）を、他の sample の語に揃えた。

## 3. 申し送り

- `初期公開` と `初期リリース` の語の統一（R5-6）は、どちらを正とするかの PO 判断が要る。憲章は直接の詳細化先に合わせて `初期リリース` を使った。
- F001（`vp-pm-plan-feasibility`）は、kata-guide の「kata の観点の組」で kata の段のレビューに使わない観点とされているため、扱っていない。
- R5-1: R5 / 9. 未決事項（費用上限） / 「詳細計画の承認前に確定する」は、管理計画 sample の U-01 が計画内で未決のまま準備着手の条件になっていることと食い違う / 影響を「支出を伴う作業と予算枠を判定できない」にし、当面の扱いを「管理計画の U-01 で店主代表が承認するまで、外部支出を行わない」に改め、U-01 への wikilink を置いた / `vp-qe-kata-conformance`（pm-plan-sample の U-01・M-03、prj-assumptions-constraints-dependencies-sample の ACD-C02） / -
- R5-2: R5 / 9. 未決事項（リリース目標日） / 論点名がスコープ・管理計画 sample の「初期リリース」とそろわず、決める時期と記録先が管理計画の U-03 につながっていない / 論点名を「初期リリースの目標日」にし、当面の扱いを「管理計画の U-03 で、準備着手前に候補を合意し、初期リリース前に確定する」に改めた / `vp-qe-kata-conformance`（pm-plan-sample の U-03、prj-scope-sample の初期対象期間） / -
- R5-3: R5 / 9. 未決事項（オフライン時の扱い）と 3. ハイレベルスコープ（未確定） / 「詳細計画の承認前に、スコープで対象か対象外かを決める」は、スコープ sample で通信断の日の記録がすでに受入の対象外と決まっていること、前提・制約 sample の ACD-D03 で店主代表が初期運用開始前に運用方針を決めることと食い違う / 論点名を「オフライン時の運用方針」、影響を「通信断の日の記録と受入条件が変わる」とし、当面の扱いを「前提・制約の ACD-D03 で、店主代表が初期運用開始前に決める。決めるまで受入の対象外とする」に改めた。ハイレベルスコープの未確定の行も同じ語にした / `vp-qe-kata-conformance`、`vp-dev-change-impact`（prj-scope-sample のスコープ外の注記、prj-assumptions-constraints-dependencies-sample の ACD-D03） / -
- R5-4: R5 / 3. ハイレベルスコープ（対象外） / 「EC」「仕入れ先とのシステム連携」が概要 sample の前提条件の書き方（EC 連携、仕入れ先システム連携）とずれている / 「EC 連携」「仕入れ先システム連携」に改めた / `vp-qe-kata-conformance`（prj-overview-sample の前提条件） / -
- R5-5: R5 / 4. 初期ステークホルダー（`STH-SHOP-OWNER`） / 「優先順位」「リリース可否」が、ステークホルダー登録簿 sample の「優先機能」、スコープ sample の「初期リリース」とずれている / 「目的、優先機能、予算枠、初期リリースの可否を判断する」に改めた / `vp-qe-kata-conformance`（prj-stakeholder-register-sample の関係者一覧） / -
- R5-6: R5 / 全体（相手側） / 概要 sample とステークホルダー登録簿 sample は「初期公開」、スコープ sample と管理計画 sample は「初期リリース」を使い、kata どうしで語がそろっていない。用語集（`gl-*.yaml`）にはどちらの語もない / - / `vp-qe-kata-conformance`。相手側の案: prj-overview-sample と prj-stakeholder-register-sample の「初期公開」を「初期リリース」へ統一するか、用語集に一方を登録して他方を言い換える。迷った理由: 概要 sample は「初期公開（店頭で使い始める最初の版の提供）」と定義しており、どちらを正とするかは PO の判断が要る。憲章は直接の詳細化先（スコープ・管理計画）に合わせて「初期リリース」を選び、概要に合わせる案は選ばなかった / 要判断
- R5-7: R5 / 1. 認可対象（相手側: prj-charter-template） / rulebook の「認可対象」は、承認に条件が付く場合だけ「認可条件」の行を足すと定めているが、template はこの行を常に置いており、sample（条件なし）と構成がずれる / - / `vp-qe-kata-conformance`。相手側の案: prj-charter-template の「認可条件」の行に、条件がない場合は行を削ることを示す `_TODO_` を添える / -
- R5-8: R5 / grade の finding の扱い / F003（template に合格条件の列がない）と F004（「店主」の表記ゆれ）は、前の段ですでに直っていた（template の 7 章に合格条件の列があり、開発担当の行は「店主代表に示す」）。F001・F002 は `vp-pm-plan-feasibility`・`vp-pm-control-reporting` で、kata-guide の「kata の観点の組」では kata の段のレビューで使わない観点とされているため扱わない。ただし、R5-1〜R5-3 で未決事項を U-01・U-03・ACD-D03 へつないだため、F002 の引き継ぎ先は本文から辿れる / - / kata-guide の「kata の観点の組」 / -

## 4. 進め方と実践の型の適用

根拠にしたのは、kata-guide の R5 の段の定義、`prj-charter-rulebook` と `prj-charter-template`、および同じ接頭辞の関連 sample（`pm-plan-sample`、`prj-assumptions-constraints-dependencies-sample`、`prj-scope-sample`、`prj-overview-sample`、`prj-stakeholder-register-sample`）である。憲章 sample の側だけを直し、構造・必須項目は rulebook を正とした。F003 と F004 は前の段で解消済みだったため維持した。F001 と F002 は R5 の観点に当たらない。ただし未決事項を U-01・U-03・ACD-D03 に接続したので、F002 の引き継ぎ先は辿れる状態になった。用語集に「初期公開」「初期リリース」のどちらの語もないため、語の統一は要判断として残した。frontmatter の `status` は変更していない。
