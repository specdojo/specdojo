---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-charter-sample-120-20261125t230926z-33542b73
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-charter-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-charter-sample-120/T-KATA-REVIEW-ALL-prj-charter-sample-120-20261125T230926Z-33542b73/plan.md
  started_at: "2026-11-25T23:09:36.879Z"
  completed_at: "2026-11-25T23:17:17.221Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-charter-sample
    - specdojo:prj-charter-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として prj-charter-sample を rulebook の本文構成と template に照らして確認した。章の順は rulebook と一致していたため、章の移動・分割・統合は行っていない。
- 直したのは 2 件。1 件目は、未承認の扱いを「認可対象」の表の `認可条件` 行から「承認」の章の表の後へ移した。2 件目は、「初期ステークホルダー」の表の後に、詳細の正本を登録簿とする 1 文を足した。
- 展開された grade の F001〜F004 は、R2 の観点に当たらないか解消済みのため sample では直していない。理由は handoff に書いた。
- executor が実行した prettier と markdownlint、runner の `npm run lint:md:changed`、`npm run lint:fm:changed`、`npm run lint:mermaid`、`npm run lint:d2`、`npm run test:docs`、`npm run validate:schema` は通過した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 1. 認可対象・8. 承認 | 「認可対象」の表の `認可条件` 行に、承認に付く条件ではなく、未承認の間の扱い（承認日と証跡が記録されるまで未承認とする）が書かれていた。template はこの扱いを「承認」の章の表の後に置いている。 | `認可条件` 行を消し、「承認」の章の表の後に「承認日と証跡リンクが記録されるまで、立ち上げ認可は未承認として扱う。」を移した。選ばなかった案は、`認可条件` 行を残して「承認」の章から参照する形。 | `vp-arc-document-structure`。rulebook の記述ガイド「認可対象」は、承認に条件が付く場合だけ `認可条件` 行を足すとしている。template の「承認」の章の後の未承認の場合の扱いとも合う。 | 要判断 |
| R2-2 | R2 | 4. 初期ステークホルダー | 「プロジェクトの目的」と「ハイレベルスコープ」は表の後に詳細の正本へ委ねる 1 文があるのに、この章にはなかった。template は表の後に正本の登録簿を書くよう求めている。 | 表の後に「関係者ごとの期待、懸念、必要な合意は [[specdojo:prj-stakeholder-register-sample\|ステークホルダー登録簿]] を正とする。」を足した。 | `vp-qe-omissions-consistency`。template の「初期ステークホルダー」の記述と、rulebook の記述ガイド「初期ステークホルダー」（登録簿を要約し、再掲しない）。 | - |
| R2-3 | R2 | 9. 未決事項 | grade の F001（担当がない）と F002（引き継ぎ先の記録がない）は、`vp-pm-plan-feasibility` と `vp-pm-control-reporting` の指摘である。kata-guide の「kata の観点の組」は、この 2 つを kata の段のレビューでは使わないとしている。 | - | kata-guide の「kata の観点の組」。列を足すなら rulebook の記述ガイド「承認と未決事項」と template の未決事項の表を先に変える必要があり、sample だけを変えると型の間で食い違う。 | - |
| R2-4 | R2 | 7. 本格実行開始の GO / Not GO 判断 | grade の F003（template に合格条件の列がない）は、今の template の 91 行目に `合格条件` の列があり、解消済みである。rulebook・template・sample の 4 列はそろっている。 | - | `vp-qe-omissions-consistency`、`docs/ja/specdojo/templates/prj-charter-template.md`。 | - |
| R2-5 | R2 | 4. 初期ステークホルダー | grade の F004（「店主」を「店主代表（`PO`）」にそろえる）は、`vp-ux-language-consistency` の文言の指摘で、R3 の観点に当たる。R2 では直さず R3 に渡す。 | - | kata-guide の「kata の観点の組」（R3 は `vp-ux-language-consistency`）。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-charter-sample.md`: 「認可対象」の表から `認可条件` 行を削除し、「承認」の章の表の後に未承認の扱いの 1 文を移した。「初期ステークホルダー」の表の後に、ステークホルダー登録簿を正とする 1 文を追加した。

## 3. 申し送り

- R2 で直した 2 件のうち R2-1 は、承認の条件として `認可条件` 行を残したい場合もありうるため「要判断」の印を付けている。PO の判断を待つ。
- R2-1: 段=R2 / 箇所=1. 認可対象・8. 承認 / 指摘=「認可対象」の表の `認可条件` 行に、承認に付く条件ではなく未承認の間の扱い（承認日と証跡が記録されるまで未承認とする）が書かれていた。template はこの扱いを「承認」の章の表の後に置いている / 直した案=`認可条件` 行を消し、「承認」の章の表の後に「承認日と証跡リンクが記録されるまで、立ち上げ認可は未承認として扱う。」を移した / 根拠=`vp-arc-document-structure`。rulebook の記述ガイド「認可対象」は、承認に条件が付く場合だけ `認可条件` 行を足し、承認の記録要件は「承認と未決事項」に従うとしている。template の `_AUTHORIZATION_CONDITION_OR_NONE_` と「承認」の章の後の `_TODO_`（未承認の場合の扱い）とも合う。迷った理由は、店主代表が承認の条件として残したい場合もありうるため。選ばなかった案は、`認可条件` 行を残し「承認」の章から参照する形 / 印=要判断
- R2-2: 段=R2 / 箇所=4. 初期ステークホルダー / 指摘=「プロジェクトの目的」と「ハイレベルスコープ」は表の後に詳細の正本へ委ねる 1 文があるのに、この章にはなかった。template は表の後に正本の登録簿を書くよう求めている / 直した案=表の後に「関係者ごとの期待、懸念、必要な合意は [[specdojo:prj-stakeholder-register-sample\|ステークホルダー登録簿]] を正とする。」を足した / 根拠=`vp-qe-omissions-consistency`。template の「初期ステークホルダー」の `_TODO_` と、rulebook の記述ガイド「初期ステークホルダー」（登録簿を要約し、再掲しない） / 印=-
- R2-3: 段=R2 / 箇所=9. 未決事項 / 指摘=grade の F001（担当がない）と F002（引き継ぎ先の記録がない）は、`vp-pm-plan-feasibility` と `vp-pm-control-reporting` の指摘である。kata-guide の「kata の観点の組」はこの 2 つを kata の段のレビューでは使わないとしている / 直した案=- / 根拠=kata-guide の「kata の観点の組」。列を足すなら rulebook の記述ガイド「承認と未決事項」と template の未決事項の表を先に変える必要があり、sample だけを変えると型の間で食い違う / 印=-
- R2-4: 段=R2 / 箇所=7. 本格実行開始の GO / Not GO 判断 / 指摘=grade の F003（template に合格条件の列がない）は、今の template の 91 行目に `合格条件` の列があり、解消済みである。rulebook・template・sample の 4 列はそろっている / 直した案=- / 根拠=`vp-qe-omissions-consistency`、`docs/ja/specdojo/templates/prj-charter-template.md` / 印=-
- R2-5: 段=R2 / 箇所=4. 初期ステークホルダー / 指摘=grade の F004（「店主」を「店主代表（`PO`）」にそろえる）は、`vp-ux-language-consistency` の文言の指摘で、R3 の観点に当たる。R2 では直さず R3 に渡す / 直した案=- / 根拠=kata-guide の「kata の観点の組」（R3 は `vp-ux-language-consistency`） / 印=-

## 4. 進め方と実践の型の適用

根拠にしたのは rulebook の記述ガイド（「認可対象」「初期ステークホルダー」「承認と未決事項」）、`docs/ja/specdojo/templates/prj-charter-template.md`、kata-guide の「kata の観点の組」。構造は rulebook を正とし、template と食い違う箇所だけを sample 側で直した。F001 と F002 は kata の段のレビューでは使わない観点で、列を足すには rulebook と template を先に変える必要があるため見送った。F003 は template に `合格条件` の列が既にあり解消済みと確認した。F004 は文言の観点で R3 に渡す。grade result のサイドカーは直接編集していない。
