---
specdojo:
  id: prj-0001:pjr-9170-orchestrator-playbook-kata-docs
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-23T02:38:48Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2P7C
  depends_on:
    - PJR-2P7C
  commit_type: docs
  commit_scope: kata
---

# PJR-9170 オーケストレーターの運用メモの型（rulebook・template・sample）を作る

## 1. 概要

prj-0001 の運用メモを手本に、章立て・知見の育て方・handoff と question との分け方を定める型を作る

## 2. 入力

- 利用者の問い（2026-11-23）: オーケストレーターのプロジェクトごとの知見を playbook にまとめているが、正式な機能か。オーケストレーターの答えは、正式ではない（型・置き場所・見つけ方が決まっていない）

## 3. 完了条件

- PJR-2P7C の決定に従い、オーケストレーターの運用メモの型を作る。rulebook・template・sample をそろえ、frontmatter で対応を宣言する。
- 章立ては、prj-0001 の `pm-orchestrator-playbook` を手本にする（目的と適用範囲、agent の使い分けと止まり方、実行の運び方、close の判断、保護された設定、リリースの手順など）。プロジェクトに固有の章は任意にする。
- rulebook に、知見の育て方（本体 → 運用メモ → コマンドの順に残す。手作業の回避策が運用メモに 2 回以上出たら、コマンドにする項目を起票する）と、handoff（PJR-5RY7）・`question` との分け方を書く。
- sample は、prj-0001 の運用メモを共通のサンプル文脈（駄菓子屋きぬや）に直して作る。prj-0001 の固有の事実（項目の ID・日付・agent の名前）を持ち込まない。
- PJR-76N9 の決まり（文書の役割の割り当てと承認の進み具合を書かない）に従う。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json`・`CLAUDE.md`・`AGENTS.md`・`templates/` の agent の定義など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema` を通し、親の検証を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
