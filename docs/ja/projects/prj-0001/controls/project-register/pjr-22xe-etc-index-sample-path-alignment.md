---
specdojo:
  id: prj-0001:pjr-22xe-etc-index-sample-path-alignment
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
  registered_at: "2026-11-23T04:55:59Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-30PT
  commit_type: docs
  commit_scope: kata
---

# PJR-22XE etc-index-sample の外部結合テストの経路を tsp-index・itc-index とそろえる

## 1. 概要

PATH-04〜07 の扱いが based_on の 2 つの sample と食い違い、保全の取得と復元の回復をどのカタログも扱わない。PJR-30PT の後の grade の major

## 2. 入力

- 利用者の決定（2026-11-23）: オーケストレーターの推奨どおり起票する

## 3. 完了条件

- `etc-index-sample` の外部結合テストの経路（`PATH-04`〜`PATH-07`）を、based_on の `tsp-index-sample`・`itc-index-sample` とそろえる。保全の取得（`PATH-04`）と復元の回復（`PATH-07`）を、どのテストのカタログが扱うかを決め、`backup-storage` の経路と観点（復元の回復を含む）を補う。3 つの sample のどれを直すかは executor が決め、理由を個票の対応結果に書く。
- 2026-11-23 の grade（needs-work 86）の minor のうち、分割の閾値の境界（rulebook の「15 以上・50 行以上」にそろえる）、遅延の具体値、非機能の観点の型、トレース列の ID の 4 件も直す。担当の Role code を示す 2 件は、PJR-76N9 の決まりで採らない。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
