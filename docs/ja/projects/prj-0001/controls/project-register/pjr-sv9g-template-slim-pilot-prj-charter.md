---
specdojo:
  id: prj-0001:pjr-sv9g-template-slim-pilot-prj-charter
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: BA
  registered_at: "2026-11-17T23:24:32Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-WYTX
  depends_on:
    - PJR-7M9J
---

# PJR-SV9G prj-charter の template から文書の運用の記述を外す試行をし、template の一覧を作る

## 1. 概要

template には簡潔にする手本がないため、rulebook と sample を見直し済みの prj-charter で試行し、外す記述・残す記述・参照の形の一覧を作る。

## 2. 入力

- 利用者の決定（2026-11-18）: template は schedule に入れる前に prj-charter で試行する。手本は PJR-8S4T の rulebook と sample の一覧と、PJR-7M9J の recipe の一覧

## 3. 完了条件

- `docs/ja/specdojo/templates/prj-charter-template.md` から、どの成果物にも共通する文書の運用の記述（役割の段落、承認と agent の段落、文書品質の検査の行、未決事項の管理台帳の列と登録の段落など）と、rulebook の判断の言い直しを外す。手本は [[prj-0001:pjr-8s4t-sld-kata-slim-pilot|PJR-8S4T]] の一覧、[[prj-0001:pjr-7m9j-recipe-slim-pilot-prj-charter|PJR-7M9J]] の recipe の一覧と、見直し済みの [[specdojo:prj-charter-sample|prj-charter-sample]] である。
- template は記入の枠として、章の構成・必須の表の列・`_TODO_` などの目印を保つ。章と列は rulebook と sample に合わせ、記入の説明は 1 行の要点にして判断の基準は rulebook を参照する。
- 大きさは、空白を除いた文字数で今の 7 割以下を目安にし、前後の文字数を個票の対応結果に書く。
- 個票の対応結果に、ほかの template へ広げるときの「外す記述・残す記述・参照の形」の一覧を書く。schedule の段の指示にそのまま使える形にする。
- 直すのは template だけとする。rulebook・sample・recipe は変えず、合わせて直すべき点は変更案として個票の対応結果に書く。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                         | 担当         | 状態 | メモ |
| --- | -------------------------------------------- | ------------ | ---- | ---- |
| 1   | prj-charter の template から運用の記述を外す | BA           | open | -    |
| 2   | template へ広げるときの一覧を書く            | BA           | open | -    |
| 3   | 統合の後に型を grade し、結果を書く          | orchestrator | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-8s4t-sld-kata-slim-pilot]]
