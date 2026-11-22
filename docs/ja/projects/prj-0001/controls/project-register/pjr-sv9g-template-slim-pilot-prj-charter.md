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

- `prj-charter-template` から、どの成果物にも共通する文書の運用の記述（役割の割り当て、`status` の昇格と承認、公開の承認条件、改訂と廃止の手順、文書の品質の検査など）と、rulebook の言い直しを外す。手本は PJR-8S4T の「他の型へ広げるときの一覧」と PJR-7M9J の「他の recipe へ広げるときの一覧」とする。
- template に残すのは、章の骨組み・表の列・記入の目印など、成果物を作るときに埋める枠とする。章の構成は rulebook と合わせたまま保つ。
- 前後の大きさ（空白を除いた文字数）を、個票の対応結果に書く。
- 個票の対応結果に、ほかの template へ広げるときの「外す記述・残す記述・参照の形」の一覧を書く。schedule の段の指示にそのまま使える形にする。
- 直すのは template だけとする。rulebook・recipe・sample は変えず、合わせて直すべき点は変更案として個票の対応結果に書く。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。

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
