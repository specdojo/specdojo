---
specdojo:
  id: prj-0001:pjr-6v26-comprehension-debt-core-message
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-27T23:37:41Z"
  due_on: "2026-12-31"
  derived_from:
    - PJR-Y5RD
---

# PJR-6V26 理解の負債を中心の課題として、概要・ガイド・philosophy の記述を見直す

## 1. 概要

理解の負債が SpecDojo の解くべき中心の課題であることが、prj-0001 の概要・specdojo-overview-guide・philosophy に書かれていない。PJR-Y5RD の決定に沿って記述を見直す

## 2. 入力

- 「理解の負債」が出てくるのは civic-tech-starter-guide（PJR-BXYM）と pm-comprehension-debt-trial-plan だけで、prj-0001 の prj-overview.md・specdojo-overview-guide.md・specdojo-philosophy.md・needs-to-implementation-philosophy.md には出てこない（2026-11-28 の確認）
- 位置づけは PJR-Y5RD で決めた（kata による理解の負債の解消で、シビックテックを持続可能にする）。測り方は PJR-Q5YP、Gas Town との対比は PJR-Q3W9 で扱う
- 全体的に記述の見直しが要る。まずは忘れないように起票し、見直しの範囲（README・英語版を含めるかなど）と完了条件は後で決める。それまで exec に流さない（indie の指示、2026-11-28）
- 担当 BA・期限 2026-12-31 は indie の指示（2026-11-28）
- 範囲は日本語の 4 文書（prj-0001 の `prj-overview`、`specdojo-overview-guide`、`specdojo-philosophy`、`needs-to-implementation-philosophy`）とする。README と英語版（`docs/en/`）は含めず、英語版は翻訳の古さの検査で追う（indie の決定、2026-11-28）。
- indie が作った LP の文案（2026-11-28）を参考にする。理解の負債の定義、「記して・形にして・磨き続ける」の 3 段、既存の道具と「競うよりつなぐ」関係を使う。「人類最大の借金」はブランドの比喩のため、文書には持ち込まない。文案の本文は prj-0002 の LP の書き直しの todo の入力に載せた。
- Continuous Specification Engineering の略称は CSpE とする。CSE などの別の略称は使わない（indie の指示、2026-11-28）。
- exec に流す前に、この完了条件を indie が確かめる。

## 3. 完了条件

- 理解の負債の定義を `specdojo-philosophy` に正本として 1 か所だけ書き、ほかの文書はそこを wikilink で参照する。定義は「つくったものや決めたことの背景・意図・前提を十分に共有・記録・更新しないことで、将来の理解・変更・引き継ぎに余計な労力が要る状態」とし、問題は文書の不足ではなく判断の経緯と成果物のつながりが失われることだと書く。コードから戻せるのは主に「何をしているか」で、「なぜ」は戻らないことも含める。
- `specdojo-philosophy` と `needs-to-implementation-philosophy` で、理解の負債を SpecDojo の解く中心の課題として位置づけ、Continuous Specification Engineering（CSpE）・型・技・流・Sustainable Participation との関係を書く。略称は CSpE だけを使い、初出は「Continuous Specification Engineering（CSpE）」とする。
- `specdojo-overview-guide` の冒頭に、解く課題（理解の負債）、答え（記して・形にして・磨き続ける。register から成果物へつなぎ、確かめて次につなぐ）、kata による 4 段（復元・確認状態・人の確定・記録）を短く示す。
- prj-0001 の `prj-overview` の背景と目的に、理解の負債を中心の課題として書き、PJR-Y5RD の位置づけ（kata による理解の負債の解消で、シビックテックを持続可能にする）とそろえる。
- シビックテック入門ガイドの「理解の負債と型」と、定義・用語・段の名前が食い違わない。食い違いがあれば、正本の定義に合わせる案を個票の対応結果に書く。
- README・英語版（`docs/en/`）・LP（prj-0002）は変えない。
- `npm run -s lint:md` と `npm run validate:history-links` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ                          |
| --- | ---------------------------------------------- | ---- | ---- | ----------------------------- |
| 1   | 範囲を決める                                   | PO   | done | 日本語の 4 文書（2026-11-28） |
| 2   | philosophy の 2 つの文書に定義と位置づけを書く | BA   | open | -                             |
| 3   | overview-guide と prj-overview を直す          | BA   | open | -                             |
| 4   | シビックテック入門ガイドとの食い違いを確かめる | BA   | open | -                             |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-y5rd-civic-tech-comprehension-debt|PJR-Y5RD]] 理解の負債の位置づけの決定
- [[specdojo:specdojo-philosophy]]
- [[specdojo:needs-to-implementation-philosophy]]
- [[specdojo:specdojo-overview-guide]]
- [[specdojo:civic-tech-starter-guide]]
