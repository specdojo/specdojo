---
specdojo:
  id: prj-0001:pjr-qwg7-kata-slim-mm-pr
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-18T00:14:41Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-DJZD
---

# PJR-QWG7 議事録（mm）と進捗報告（pr）の rulebook と sample から文書の運用の記述を外す

## 1. 概要

mm と pr はカタログで日付ごとに作る記録の型（instance_id_pattern）で schedule の対象にならないため、kata-slim と同じ一覧で個別に簡潔にする。

## 2. 入力

- orchestrator の調べ（2026-11-18）: kata-slim-2 の schedule の生成で、mm-meeting-minutes と pr-progress-report（kind: control、`instance_id_pattern` あり、path なし）は scope に入らなかった

## 3. 完了条件

- `mm-rulebook`・`pr-rulebook` から、どの成果物にも共通する文書の運用の記述を外し、共通の正本への参照にする。手本は [[prj-0001:pjr-8s4t-sld-kata-slim-pilot|PJR-8S4T]] の対応結果の「他の型へ広げるときの一覧」と、見直し済みの [[specdojo:sld-rulebook|sld-rulebook]] である。大きさは空白を除いた文字数で今の 8 割以下を目安にする。
- `mm-sample`・`pr-sample` から、文書の運用の記述と同じ判断の言い直しを外す。結論（値・判断の基準・例外）は変えない。大きさは空白を除いた文字数で今の 7 割以下を目安にする。
- 前後の文字数を、文書ごとに個票の対応結果に書く。
- 成果物本体と recipe・template は変えない。合わせて直すべき点は変更案として個票の対応結果に書く。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                         | 担当         | 状態 | メモ |
| --- | -------------------------------------------- | ------------ | ---- | ---- |
| 1   | 2 つの rulebook から運用の記述を外す         | BA           | open | -    |
| 2   | 2 つの sample から運用の記述と言い直しを外す | BA           | open | -    |
| 3   | 統合の後に型を grade し、結果を書く          | orchestrator | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-8s4t-sld-kata-slim-pilot]]
