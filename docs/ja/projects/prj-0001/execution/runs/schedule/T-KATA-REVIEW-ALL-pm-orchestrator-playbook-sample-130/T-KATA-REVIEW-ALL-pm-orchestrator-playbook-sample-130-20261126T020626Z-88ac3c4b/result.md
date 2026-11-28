---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-orchestrator-playbook-sample-130-20261126t020626z-88ac3c4b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-130/T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-130-20261126T020626Z-88ac3c4b/plan.md
  started_at: "2026-11-26T02:06:36.496Z"
  completed_at: "2026-11-26T02:10:08.898Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-orchestrator-playbook-sample
    - specdojo:pm-orchestrator-playbook-sample
---

# Edit Result

## 1. 実施内容

- R3（読みやすさ）として、W1〜W10 に沿った文の直しを `docs/ja/specdojo/samples/pm-orchestrator-playbook-sample.md` に 9 か所入れた。意味・背景・例外・制約は変えていない。
- grade の finding のうち R3 の観点に当たるものは残っていなかった。F002・F003・F006・F007・F009 は前の段の版で既に直っており、F001・F004 が指していた `pgrep -f` の行も消えていた。
- F005 は R4（`vp-qe-verifiability`）、F008 は R5・R1（`vp-qe-kata-conformance`）が扱うため、この段では直していない。
- 検査は、executor の prettier、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` が通った。ほかの検査は変更の種類により `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R3 | 目的と適用範囲 | 「`PJR-KN12` などの項目 ID」の「など」が指す範囲が読み取れない。「記録先は…に従う」は主語と述語がねじれている。 | 「`PJR-KN12`〜`PJR-KN15` の項目 ID と `kinuya-*` の記録は、未同梱の架空の参照名である。記録先は [[specdojo:pm-plan-sample\|プロジェクト管理計画]] が定める。」に直した。 | W7・W2 | - |
| 2 | R3 | agent の使い分けと癖 | 「表に加えて、次の癖を踏まえて選ぶ」の「表」の指す先と、選ぶ主語が一つに決まらない。 | 「オーケストレーターは、`routing` に加えて次の表の癖を踏まえて agent を選ぶ。」に直した。 | W4・W1 | - |
| 3 | R3 | 実行の運び方 | 「並べると時間切れで落ちた」で、何が落ちたかが分からない。 | 「並べると、統合テストが時間切れで落ちた」に直した。 | W1 | - |
| 4 | R3 | 止まったときの再開 | 「統合の前に範囲外の変更として止まる」で、止める主体が受け身のように消えている。 | 「runner が範囲外の変更とみなして統合の前に止める」に直した。 | W6・W1 | - |
| 5 | R3 | 保護された設定の扱い | 「範囲は `.specdojo/` の設定を正本とする」の「範囲」が何の範囲か一つに決まらない。 | 「書けない範囲の正本は `.specdojo/` の設定とする。」に直した。 | W4 | - |
| 6 | R3 | 保護された設定の扱い | 「変更が要る項目は、executor に…書かせる」に、何の変更かと書かせる主語がない。 | 「保護された設定の変更が要る項目では、オーケストレーターが executor に…書かせる。その後、オーケストレーターが…反映する。」に直した。 | W1 | - |
| 7 | R3 | リリースの手順 | 版の範囲を決める文の読点が 3 つあり、修飾が長い。 | 「版の範囲は店主代表（`PO`）が決める。店主代表は、入れ替えの日の前日までに…選ぶ。」に分けた。 | W3・W5 | - |
| 8 | R3 | リリースの手順 | 手順 1 で、略語の `PO` を初出の後にもう一度添えている。 | 手順 1 の「店主代表（`PO`）」を「店主代表」に直した。 | W8 | - |
| 9 | R3 | リリースの手順 | 手順 2 の「範囲の close の件数」の係りが読みにくい。 | 「集めた件数が範囲の項目の件数と一致したら次へ進む。」に直した。 | W5 | - |
| 10 | R3 | リリースの手順 3 | F005「全件の検査」で流す検査が特定されていない。R4 が扱うため R3 では直さない。 | - | vp-qe-verifiability。R4 の段で、正本のコマンドを確かめて具体的に書く。 | - |
| 11 | R3 | Frontmatter | F008 `based_on` が decision の個票ではなく pm-plan-sample を指している。R5・R1 が扱うため R3 では直さない。 | - | vp-qe-kata-conformance。R5 の段で、rulebook の推奨 Frontmatter 項目と照らす。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-orchestrator-playbook-sample.md`: 文の直しを 9 か所入れた（9 行追加・9 行削除）。参照名の範囲と記録先の主語・述語、agent の選び方の主語、時間切れで落ちたものの明示、再開時に止める主体、保護された設定の範囲と変更の主体、リリースの版の範囲を決める文の分割、略語 `PO` の重複削除、件数の一致の言い方を直した。

## 3. 申し送り

- R4 の段で、リリースの手順 3「全件の検査」に流す検査を、正本のコマンドを確かめて具体的に書く（F005）。
- R5・R1 の段で、Frontmatter の `based_on` が decision の個票でなく pm-plan-sample を指している点を、rulebook の推奨 Frontmatter 項目と照らして確かめる（F008）。
- 1: R3 / 目的と適用範囲 / 「`PJR-KN12` などの項目 ID」の「など」が指す範囲が読み取れない。また「記録先は…に従う」で主語と述語がねじれている / 「`PJR-KN12`〜`PJR-KN15` の項目 ID と `kinuya-*` の記録は、未同梱の架空の参照名である。記録先は [[specdojo:pm-plan-sample|プロジェクト管理計画]] が定める。」に直した / W7・W2 / -
- 2: R3 / agent の使い分けと癖 / 「表に加えて、次の癖を踏まえて選ぶ」の「表」の指す先（`routing` か次の表か）と、選ぶ主語が一つに決まらない / 「オーケストレーターは、`routing` に加えて次の表の癖を踏まえて agent を選ぶ。」に直した / W4・W1 / -
- 3: R3 / 実行の運び方 / 「並べると時間切れで落ちた」で、何が落ちたかが分からない / 「並べると、統合テストが時間切れで落ちた」に直した / W1 / -
- 4: R3 / 止まったときの再開 / 「統合の前に範囲外の変更として止まる」で、止める主体が受け身のように消えている / 「runner が範囲外の変更とみなして統合の前に止める」に直した / W6・W1 / -
- 5: R3 / 保護された設定の扱い / 「範囲は `.specdojo/` の設定を正本とする」の「範囲」が何の範囲か一つに決まらない / 「書けない範囲の正本は `.specdojo/` の設定とする。」に直した / W4 / -
- 6: R3 / 保護された設定の扱い / 「変更が要る項目は、executor に…書かせる」に、何の変更かと書かせる主語がない / 「保護された設定の変更が要る項目では、オーケストレーターが executor に…書かせる。その後、オーケストレーターが…反映する。」に直した / W1 / -
- 7: R3 / リリースの手順 / 版の範囲を決める文の読点が 3 つあり、修飾が長い / 「版の範囲は店主代表（`PO`）が決める。店主代表は、入れ替えの日の前日までに…選ぶ。」に分けた / W3・W5 / -
- 8: R3 / リリースの手順 / 手順 1 で、略語の `PO` を初出の後にもう一度添えている / 手順 1 の「店主代表（`PO`）」を「店主代表」に直した / W8 / -
- 9: R3 / リリースの手順 / 手順 2 の「範囲の close の件数」の係りが読みにくい / 「集めた件数が範囲の項目の件数と一致したら次へ進む。」に直した / W5 / -
- 10: R3 / 全体 / grade の F002・F003・F006・F007・F009 は前の段の版で既に直っていた。F001・F004 が指していた `pgrep -f` の行も消えていた / - / vp-pm-control-reporting・vp-ba-requirements-completeness・vp-qe-omissions-consistency・vp-qe-kata-conformance・vp-pm-dependency-risk・vp-arc-conciseness / -
- 11: R3 / リリースの手順 / F005「全件の検査」で流す検査が特定されていない。これは R4（vp-qe-verifiability）が扱うため、R3 では直さない / - / vp-qe-verifiability。R4 の段で、正本のコマンドを確かめて具体的に書く / -
- 12: R3 / Frontmatter / F008 `based_on` が decision の個票ではなく pm-plan-sample を指している。これは R5・R1（vp-qe-kata-conformance）が扱うため、R3 では直さない / - / vp-qe-kata-conformance。R5 の段で、rulebook の推奨 Frontmatter 項目と照らす / -

## 4. 進め方と実践の型の適用

plan の finding のうち R3 の観点（`vp-ux-readability`・`vp-ux-language-consistency`・`vp-arc-conciseness`）に当たるものを探したが、残りはなかった。前の段の版を読み、ガイドの W1〜W10 に沿って曖昧な係り・主語の欠落・受け身・長い修飾・略語の重複を直した。判断に要る背景・例外・制約は変えていない。F005 と F008 は他の段の観点なので見送った。他の finding は前の段で解消済みと確認した。
