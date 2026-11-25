---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-charter-sample-110-20261125t145528z-adc960c3
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-charter-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-charter-sample-110/T-KATA-REVIEW-ALL-prj-charter-sample-110-20261125T145528Z-adc960c3/plan.md
  started_at: "2026-11-25T14:55:37.358Z"
  completed_at: "2026-11-25T15:05:05.125Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-charter-sample
    - specdojo:prj-charter-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を実施した。`prj-charter-sample` の GO / Not GO 判断の表の「体制」の行に、rulebook の記述ガイドが求める組織定義との照合を足した。
- ほかの必須内容（冒頭文、認可しない範囲、AI Agent の委譲範囲、留保する判断、予算枠、GO / Not GO の 5 観点、承認の 4 列）は rulebook の要求とそろっており、要らない内容もないため変更していない。
- 展開された F001〜F004 は R1 の観点に当たらないか、すでに解消しているため、sample には反映していない。割り当てと理由は findings に示す。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R1 | `docs/ja/specdojo/samples/prj-charter-sample.md` 「本格実行開始の GO / Not GO 判断」の表の「体制」の行 | rulebook の記述ガイドは「体制は組織定義と照合」を求めるが、この行は RACI だけを見ていて、組織定義との照合が欠けていた。 | 確認内容を「組織定義の役割と各作業の責任の割り当て」にし、記録先に組織定義の wikilink を足した。sample に反映済み。 | `specdojo:prj-charter-rulebook` の記述ガイド（本格実行開始の GO / Not GO 判断）、`vp-qe-kata-conformance` | - |
| 2 | R1 | sample 全体 | rulebook の必須の 8 章と任意の未決事項の章は、求められた要素と列がそろっていた。詳細スコープ、受入条件、設計の先取りといった要らない内容もない。 | 変更なし | `specdojo:prj-charter-rulebook` の本文構成と記述ガイド、Sample 記述標準の構成の原則と内容充実化、`dct-kata.yaml` の `prj-charter-sample` の `done_criteria` | - |
| 3 | R1（範囲外） | 「未決事項」の表（F001 `vp-pm-plan-feasibility`、F002 `vp-pm-control-reporting`） | 担当の Role code と引き継ぎ先の管理記録を足す求め。kata guide の「kata の観点の組」は `vp-pm-*` を kata の段のレビューで使わない観点としている。rulebook も未決事項の列を論点・影響・当面の扱いと定めているため、sample は変えない。 | 変更なし。grade の観点の組から `vp-pm-*` を外すかを人が判断する。 | kata guide の「kata の観点の組」、rulebook の記述ガイド（承認と未決事項） | 要判断 |
| 4 | R1（範囲外） | `docs/ja/specdojo/templates/prj-charter-template.md` の「本格実行開始の GO / Not GO 判断」の表（F003） | template に「合格条件」列がないという指摘だが、いまの template には `判断観点・確認内容・合格条件・記録先` の 4 列があり、すでに解消している。 | 変更なし | template の「本格実行開始の GO / Not GO 判断」の表 | - |
| 5 | R3 に回す | 「初期ステークホルダー」の表の `STH-DEVELOPER` の行（F004 `vp-ux-language-consistency`） | 「変更影響を店主に示す」が、ほかの箇所の「店主代表」と表記が違う。 | R3 で「店主代表（`PO`）に示す」へそろえる。 | kata guide の段の分担（`vp-ux-language-consistency` は R3） | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-charter-sample.md`: 「本格実行開始の GO / Not GO 判断」の表の「体制」の行について、確認内容を「組織定義の役割と各作業の責任の割り当て」にし、記録先に組織定義の wikilink を足した。1 行の変更。

## 3. 申し送り

- F001 と F002 は `vp-pm-*` の観点で、kata guide の「kata の観点の組」では kata の段のレビューに使わない観点とされている。grade の観点の組から `vp-pm-*` を外すかどうかは人の判断が要る。
- F004 は R3 の担当で、この段では扱っていない。
- `prj-charter-sample` の frontmatter `status` は変更していない。
- No: 1 / 段: R1 / 箇所: `docs/ja/specdojo/samples/prj-charter-sample.md` 「本格実行開始の GO / Not GO 判断」の表の「体制」の行 / 指摘: rulebook の記述ガイド（本格実行開始の GO / Not GO 判断）は「体制は組織定義と照合」を求めるが、この行は RACI だけを見ていて組織定義との照合が欠けていた / 直した案: 確認内容を「組織定義の役割と各作業の責任の割り当て」にし、記録先に `[[specdojo:pm-organization-sample\|組織定義]]` を足した（sample に反映済み） / 根拠: `specdojo:prj-charter-rulebook` の記述ガイド（本格実行開始の GO / Not GO 判断）、`vp-qe-kata-conformance` / 印: なし
- No: 2 / 段: R1 / 箇所: sample 全体 / 指摘: rulebook の必須の 8 章と任意の未決事項の章は、求められた要素と列がそろっていた（冒頭文、認可しない範囲、AI Agent の委譲範囲、留保する判断、予算枠が決まっていないことと決めるまでの扱い、決める時期、GO / Not GO の 5 観点、承認の 4 列）。詳細スコープ・受入条件・設計の先取りといった要らない内容もない / 直した案: 変更なし / 根拠: `specdojo:prj-charter-rulebook` の本文構成と記述ガイド、Sample 記述標準の構成の原則と内容充実化、`dct-kata.yaml` の `prj-charter-sample` の `done_criteria` / 印: なし
- No: 3 / 段: R1（範囲外） / 箇所: 「未決事項」の表（F001 `vp-pm-plan-feasibility`、F002 `vp-pm-control-reporting`） / 指摘: 担当の Role code と、引き継ぎ先の管理記録を足す求め。kata guide の「kata の観点の組」は `vp-pm-*` を kata の段のレビューで使わない観点としており、rulebook も未決事項の列を論点・影響・当面の扱いと定めているため、sample は変えない / 直した案: 変更なし。grade の観点の組から `vp-pm-*` を外すかを人が判断する / 根拠: kata guide の「kata の観点の組」、rulebook の記述ガイド（承認と未決事項） / 印: 要判断
- No: 4 / 段: R1（範囲外） / 箇所: `docs/ja/specdojo/templates/prj-charter-template.md` の GO / Not GO 判断の表（F003） / 指摘: template に「合格条件」列がないという指摘だが、いまの template には `判断観点・確認内容・合格条件・記録先` の 4 列があり、すでに解消している / 直した案: 変更なし / 根拠: template の「本格実行開始の GO / Not GO 判断」の表 / 印: なし
- No: 5 / 段: R3 に回す / 箇所: 「初期ステークホルダー」の表の `STH-DEVELOPER` の行（F004 `vp-ux-language-consistency`） / 指摘: 「変更影響を店主に示す」が、ほかの箇所の「店主代表」と表記が違う / 直した案: R3 で「店主代表（`PO`）に示す」へそろえる / 根拠: kata guide の段の分担（`vp-ux-language-consistency` は R3） / 印: なし

## 4. 進め方と実践の型の適用

参照の向きを成果物から sample へ切り替え、`specdojo:prj-charter-rulebook` の本文構成と記述ガイド、Sample 記述標準、kata guide の段の分担に照らして R1 の過不足を確かめた。不足は「体制」の行の組織定義との照合だけで、これを rulebook を正として足した。F001・F002 は kata の観点の組の方針と、rulebook が未決事項の列を論点・影響・当面の扱いと定めていることを根拠に、sample を変えず要判断とした。F003 は template にすでに「合格条件」列があるため解消済みとした。F004 は R3 に回した。
