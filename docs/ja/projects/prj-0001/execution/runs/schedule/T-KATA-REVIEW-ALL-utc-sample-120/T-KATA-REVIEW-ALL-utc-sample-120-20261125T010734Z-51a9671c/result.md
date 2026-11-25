---
specdojo:
  id: prj-0001:xer-t-kata-review-all-utc-sample-120-20261125t010734z-51a9671c
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-utc-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-utc-sample-120/T-KATA-REVIEW-ALL-utc-sample-120-20261125T010734Z-51a9671c/plan.md
  started_at: "2026-11-25T01:07:43.396Z"
  completed_at: "2026-11-25T01:20:00.975Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:utc-sample
    - specdojo:utc-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `utc-sample.md` の章の順・観点配下の見出し・ケースの並びを rulebook の本文要件と照合した。照合の結果、構成は要件に沿っていた。
- トレース表の TR-05 だけ、補足が要点の列に入り備考が空だったため、列の分担に合わせて直した。
- rulebook は変更していない。rulebook 側の直し案は handoff に残した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/utc-sample.md`: トレース表の TR-05 を直した。要点を「会計確定後にレシートを印刷する」とし、補足「UT は印刷要求データのみ」を備考へ移した。TR-01〜03 の書き方に合わせ、`utc-rulebook` の列定義（要点は判断のポイント、備考は補足）に沿わせた。prettier で表の列幅をそろえた。

## 3. 申し送り

- 指摘一覧（No・段・箇所・指摘・直した案・根拠・印）を表にまとめると、次のとおり。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | 1 | R2 | `utc-sample.md` トレース TR-05 | 補足が要点の列に入り、備考が空だった | 要点と備考を分けた（sample に反映済み） | `utc-rulebook` トレースの列定義、`vp-arc-document-structure` | なし | | 2 | R2 | `utc-rulebook.md` 全体方針の `_UNDECIDED_` | 「sample は本文要件の見出し構成へ未整合」とあるが、sample は本文要件の 6 章と観点配下の見出しにすでに沿っている | 当該文を削るか「整合済み」に改める。`recipe`・`template` の要否が未判断である点は残す（本タスクでは rulebook を変更しない） | `utc-rulebook` 本文要件と sample の見出しの照合、`vp-qe-omissions-consistency` | 要判断 | | 3 | R2 | grade の finding の扱い | F005 は R1 で解消済み。F003・F004・F008 も R1 で直っており、残りの確かめは R4 に任せる。F006・F007 は R5 に任せる。F001・F002・F009 は kata の段のレビューから外す観点のため、この段では扱わない | なし | `kata-guide.md`「kata を agent でレビューする」 | なし | | 4 | R2 | 比較に使う template | `template: undecided` のため、template との構成の照合ができない | template を作るときに本 sample の章構成を基にする（PJR-WYTX） | `utc-rulebook` の frontmatter と全体方針 | なし |
- No: 1 / 段: R2 / 箇所: docs/ja/specdojo/samples/utc-sample.md「トレース」TR-05 / 指摘: 補足「（UT は要求データのみ）」が要点の列に入り、備考が空で、表の列の分担が崩れていた / 直した案: 要点を「会計確定後にレシートを印刷する」、備考を「UT は印刷要求データのみ」にした（sample に反映済み） / 根拠: utc-rulebook「トレース」の列定義（要点はケース作成の判断に使ったポイントを1行、備考は補足）、同じ表の TR-01〜03 の書き方、観点 `vp-arc-document-structure` / 印: なし
- No: 2 / 段: R2 / 箇所: docs/ja/specdojo/rulebooks/utc-rulebook.md「全体方針」の `_UNDECIDED_` / 指摘: 「sample は『本文要件』の見出し構成へ未整合」とあるが、sample は本文要件の 6 章と観点配下の見出し（`### 6.n. 観点:`・`#### 6.n.1. 意図`・`#### 6.n.2. 条件・ケース表`）にすでに沿っており、記述が古い / 直した案: rulebook の当該文を削るか「整合済み」に改める。`recipe`・`template` の要否が未判断である点は残す（rulebook は本タスクでは変更しない） / 根拠: utc-rulebook「本文要件」と sample の見出しの照合、観点 `vp-qe-omissions-consistency` / 印: 要判断
- No: 3 / 段: R2 / 箇所: grade の finding の扱い / 指摘: F005（`vp-qe-omissions-consistency`、証跡のパス）は R1 で全ケースの証跡に `tests/unit/sales-checkout.test.ts` が入り解消済み。F003・F004・F008 も R1 で直っており、残りの確かめは R4 に任せる。F006・F007（index との食い違い）は R5 に任せる。F001・F002・F009 は kata-guide「kata の観点の組」で kata の段のレビューから外す観点（`vp-po-decision-readiness`・`vp-pm-dependency-risk`・`vp-ops-release-readiness`）のため、この段では扱わない / 直した案: なし / 根拠: docs/ja/specdojo/guides/kata-guide.md「kata を agent でレビューする」 / 印: なし
- No: 4 / 段: R2 / 箇所: 比較に使う template / 指摘: utc-rulebook の frontmatter で `template: undecided` のため、template との構成の照合はできない / 直した案: template を作るときに本 sample の章構成を基にする（PJR-WYTX） / 根拠: utc-rulebook の frontmatter と「全体方針」 / 印: なし
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/utc-sample.md だけで、plan・result・個票などの履歴ファイルは変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

`utc-rulebook` の本文要件と `utc-sample.md` の見出し構成を照合し、構成上の不整合として TR-05 の列の分担だけを直した。F005・F003・F004・F008 は R1 で解消済みと確認した。F006・F007 は R5 に、残りの確かめは R4 に任せた。F001・F002・F009 は kata の段のレビューから外す観点のため扱っていない。rulebook は変更せず、直し案は handoff に残した。template は未決定のため照合できていない。検証では、runner の `lint:md:changed`・`lint:fm:changed`・`validate:schema` などが通過した。
