---
specdojo:
  id: prj-0001:pjr-pgyd-integration-actor-github-app
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: deferred
  priority: low
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-15T14:26:31Z"
  due_on: null
  derived_from:
    - PJR-11EX
  commit_type: feat
  commit_scope: exec
---

# PJR-PGYD 統合専用 actor（GitHub App と Actions）で develop へ統合する仕組みを作る

## 1. 概要

PJR-11EX の C を実装する。複数人の運用に移る準備として着手する

## 2. 入力

- PJR-11EX で、統合専用 actor を GitHub Actions 上の GitHub App とし、runner は exec・記帳の branch を push するだけにすると決めた（2026-11-15、利用者が承認）
- 作業: runner の統合を手元の merge から branch の push へ変える。Actions の workflow で層 3 の許可リストと必須の検査を確かめて develop へ --no-ff で merge する。App の権限を exec の merge と記帳だけに絞る。claim のイベントを先に develop へ入れ、push の競合を claim の失敗とみなす
- 着手の時期: 単独運用の間は今の方式のままとし、複数人の運用に移る準備として deferred から戻す（2026-11-15、利用者が推奨のとおり承認）

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
