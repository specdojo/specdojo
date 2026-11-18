---
specdojo:
  id: prj-0001:pjr-0vpb-kata-slim-ifx-api-msg-dec
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-17T23:21:54Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-DJZD
---

# PJR-0VPB ifx-api・ifx-msg・dec の rulebook と sample から文書の運用の記述を外す

## 1. 概要

SpecDojo に実物がなくカタログに代表を作らない 3 つの型を、sample だけを相手に kata-slim と同じ一覧で簡潔にする。

## 2. 入力

- 利用者の決定（2026-11-18）: SpecDojo には REST API・非同期メッセージの連携・dec 文書がないため、カタログに代表を作らない（捏造を避ける）。dec を非推奨にするかは別の decision で決める

## 3. 完了条件

- `ifx-api-rulebook`・`ifx-msg-rulebook`・`dec-rulebook` から、どの成果物にも共通する文書の運用の記述を外し、共通の正本への参照にする。手本は [[prj-0001:pjr-8s4t-sld-kata-slim-pilot|PJR-8S4T]] の対応結果の「他の型へ広げるときの一覧」と、見直し済みの [[specdojo:sld-rulebook|sld-rulebook]] である。大きさは空白を除いた文字数で今の 8 割以下を目安にする。
- `ifx-api-sample`・`ifx-msg-sample`・`dec-sample` から、文書の運用の記述と同じ判断の言い直しを外す。OpenAPI と AsyncAPI の標準の構造と、結論（値・判断の基準・例外）は変えない。markdown の sample は空白を除いた文字数で今の 7 割以下を目安にする。YAML の sample は説明の文（`description` など）の言い直しだけを外し、構造を保つ。
- 前後の文字数を、文書ごとに個票の対応結果に書く。
- `dec` を非推奨にするかは [[prj-0001:pjr-3vjm-dec-deprecation|PJR-3VJM]] で決めるため、この項目では非推奨の記述を足さない。
- 成果物本体と recipe・template は変えない。合わせて直すべき点は変更案として個票の対応結果に書く。
- YAML の sample は `npm run validate:schema` を通す。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- 保護された設定（`lefthook.yml`・`.agents/`・`.claude/`・`.codex/`・`package.json`・`.specdojo/` など）は変えない。変更が要る場合は、変更案を個票の対応結果に書き、報告の `handoff` にも書く。反映は利用者の承認のもと feature ブランチで行う。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm` と親の検証が通る。

## 4. 作業内容

| No  | 作業                                         | 担当         | 状態 | メモ |
| --- | -------------------------------------------- | ------------ | ---- | ---- |
| 1   | 3 つの rulebook から運用の記述を外す         | BA           | open | -    |
| 2   | 3 つの sample から運用の記述と言い直しを外す | BA           | open | -    |
| 3   | 統合の後に型を grade し、結果を書く          | orchestrator | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-8s4t-sld-kata-slim-pilot]]
