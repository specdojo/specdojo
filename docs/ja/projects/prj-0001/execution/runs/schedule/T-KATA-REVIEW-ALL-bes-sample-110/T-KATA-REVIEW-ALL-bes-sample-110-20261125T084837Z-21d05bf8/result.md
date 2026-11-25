---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bes-sample-110-20261125t084837z-21d05bf8
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bes-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bes-sample-110/T-KATA-REVIEW-ALL-bes-sample-110-20261125T084837Z-21d05bf8/plan.md
  started_at: "2026-11-25T08:48:47.173Z"
  completed_at: "2026-11-25T09:03:17.022Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bes-sample
    - specdojo:bes-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）として `docs/ja/specdojo/samples/bes-sample.md` の「発生条件」の場面表を 1 行直した。確定記録の成立が不明なまま停止した場面を「発生しない」と断定せず、「照合するまで未判定」に改めた。rulebook の「対象外と適用未判定は区別」に合わせた。これで F005・F007・F008 を解消した。
- F010 は参照先の整合を扱う R5 の担当のため、R1 では直していない。F002・F011 は sample に足さず、template 側の見直しに回した。F001・F003・F004・F006・F012・F013 は kata のレビューで使わない観点のため扱っていない。F009 は R2 の観点のため扱っていない。
- executor が実行した `npx prettier --write` は通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。ほかの検査は変更種別により `not_applicable` と記録されている。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bes-sample.md`: 「発生条件」の場面表にある「確定の記録が成立したか分からないまま停止」の行を修正した。発生有無・回数は「照合するまで未判定。成立していれば一回、未成立なら発生しない」とした。判断根拠は「受領や停止だけから発生有無を推定しない。照合は販売プロセスで行う」とした。変更は 9 行の追加と 9 行の削除で、prettier で表を整形した。

## 3. 申し送り

- 指摘一覧（No・段・箇所・指摘・直した案・根拠・印） | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | 1 | R1 | `bes-sample.md`「発生条件」の場面表、「確定の記録が成立したか分からないまま停止」の行 | 確定記録の成立が不明な状態を「発生しない」と言い切っている。rulebook の「対象外と適用未判定は区別」に反する（F005/F007/F008） | 発生有無・回数を「照合するまで未判定。成立していれば一回、未成立なら発生しない」に直した。判断根拠は「受領や停止だけから発生有無を推定しない。照合は販売プロセスで行う」に直した | `specdojo:bes-rulebook` の全体方針、記述ガイドの何が起きたか・発生条件 | なし | | 2 | R1（R5 へ申し送り） | `bes-sample.md`「発生条件」の委譲の文 | `specdojo:br-sample` は在庫不足判定の仕様で、販売金額計算と端数処理を定義していない（F010） | R1 では直さない。R5 で販売金額の業務ルールへの参照に直すか、未作成なら仮置き ID と未確認である旨に置き換える | `br-sample.md` の H1。参照先の整合は kata-guide で R5 の担当 | なし | | 3 | R1 | `bes-sample.md`「何が起きたか」と `bes-template.md` の第1章 | template の第1章は承認者・判断時期・承認条件・記録先の記入を求める（F002/F011）。一方、Sample 記述標準は sample 本文に役割の割り当てや承認の進み具合を書かないと定め、承認は登録簿の個票で追う | sample には足さない。template の第1章の記入指示を削るか、承認は登録簿で追う旨に直す案を、template の見直しの段に回す | `specdojo:sample-authoring-standard` の記述ガイドと禁止事項、`specdojo:bes-rulebook` の全体方針 | 要判断 | | 4 | R1 | `bes-sample.md`「発生条件」の `_UNDECIDED_` | F001/F003/F004/F006/F012/F013 は kata のレビューで使わない観点のため扱わない。F009 は R2 の観点で、本文に確認担当・決定者を足すと Sample 記述標準に当たる | 変更しない。template の第4章の未決事項の記入指示と Sample 記述標準の食い違いは、No 3 と合わせて判断する | `kata-guide.md` の「kata の観点の組」、`specdojo:sample-authoring-standard` の記述ガイド | 要判断 |
- No: 1 / 段: R1 / 箇所: docs/ja/specdojo/samples/bes-sample.md「発生条件」の場面表「確定の記録が成立したか分からないまま停止」の行 / 指摘: 確定記録の成立が不明な状態を「発生しない」と言い切っており、rulebook の「対象外と適用未判定は区別」（全体方針）と「適用未判定の業務を確認済みの対象や恒久的な対象外にしません」（記述ガイドの何が起きたか）に反する（grade F005/F007/F008） / 直した案: 発生有無・回数を「照合するまで未判定。成立していれば一回、未成立なら発生しない」に、判断根拠を「受領や停止だけから発生有無を推定しない。照合は販売プロセスで行う」に直した / 根拠: `specdojo:bes-rulebook` の全体方針、記述ガイドの何が起きたか・発生条件 / 印: なし
- No: 2 / 段: R1（R5 へ申し送り） / 箇所: docs/ja/specdojo/samples/bes-sample.md「発生条件」の委譲の文 / 指摘: `[[specdojo:br-sample|販売金額計算の業務ルールサンプル]]` の参照先 br-sample は「駄菓子屋きぬや 在庫不足判定」で、金額計算と端数処理を定義していない（grade F010） / 直した案: R1 では直さない。R5 で販売金額の業務ルールへの参照に直すか、未作成なら仮置き ID と未確認である旨に置き換える / 根拠: docs/ja/specdojo/samples/br-sample.md の H1。参照先の整合は kata-guide で R5 の担当 / 印: なし
- No: 3 / 段: R1 / 箇所: docs/ja/specdojo/samples/bes-sample.md「何が起きたか」と docs/ja/specdojo/templates/bes-template.md の第1章 / 指摘: template の第1章は業務定義・公開可否の承認者、判断時期、承認条件、記録先の記入を求める（grade F002/F011）。一方、Sample 記述標準の記述ガイドと禁止事項は、sample の本文に役割の割り当てや承認の進み具合を書かないと定め、承認は登録簿の個票で追う。rulebook も承認をドキュメントメタ情報標準に委ねている / 直した案: sample には足さない。template の第1章の記入指示を削るか、承認は登録簿で追う旨の指示に直す案を、template の見直しの段に回す / 根拠: `specdojo:sample-authoring-standard` の記述ガイドと禁止事項、`specdojo:bes-rulebook` の全体方針（共通の運用） / 印: 要判断
- No: 4 / 段: R1 / 箇所: docs/ja/specdojo/samples/bes-sample.md「発生条件」の `_UNDECIDED_` / 指摘: grade F001/F003/F004/F006/F012/F013 は、kata のレビューで使わない観点（decision-readiness、pm 系、ba-stakeholder、ops 系）のため扱わない。F009（vp-qe-omissions-consistency）は R2 の観点で、本文に確認担当・決定者を足すと Sample 記述標準に当たる / 直した案: 変更しない。template の第4章の未決事項の記入指示（決定者・確認担当）と Sample 記述標準の食い違いは、No 3 と合わせて判断する / 根拠: docs/ja/specdojo/guides/kata-guide.md の「kata の観点の組」、`specdojo:sample-authoring-standard` の記述ガイド / 印: 要判断

## 4. 進め方と実践の型の適用

根拠とした規範は、`specdojo:bes-rulebook` の全体方針と記述ガイド、`specdojo:sample-authoring-standard`、`bes-template.md`、`kata-guide.md` の R1 の定義である。まず plan に展開された finding のうち R1 の確かめに当たるものを選んだ。確定記録の不明な場面を未判定として区別する F005/F007/F008 を、場面表の 1 行の修正で解消した。この箇所は rulebook の「対象外と適用未判定は区別」に合っており、維持すべき記述と矛盾しない。残る finding は未解消のまま次のとおり扱う。F010 は R5 で参照先を直す。F002/F011 は template と Sample 記述標準が食い違うため、template の見直しの段で判断する（要判断）。F009 の担当は R2 で、template 第4章との食い違いは F002/F011 と合わせて判断する（要判断）。F001/F003/F004/F006/F012/F013 は kata のレビューで使わない観点のため、扱っていない。根拠不足による見送りではなく、担当の段へ回したものである。grade result のサイドカーは編集していない。
