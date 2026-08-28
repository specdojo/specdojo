---
specdojo:
  id: prj-0001:pjr-0123-register
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: QE
  due_on: "2026-07-31"
  completed_at: "2026-07-26T12:00:00Z"
  conclusion: 重複した記述や個票間での違いを修正
  register_events:
    - v: 1
      id: reg_851a1762c2b09523668db133acaa75c6
      ts: "2026-08-09T10:55:22Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: done
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: ""
          to: done
        - field: title
          from: ""
          to: registerの個票の内容を見直し
        - field: description
          from: ""
          to: idや基本情報を見直し
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: QE
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: "2026-07-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: 重複した記述や個票間での違いを修正
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
    - v: 1
      id: reg_6c7ed885cedaa7521e32751c766750c1
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-07-26"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_851a1762c2b09523668db133acaa75c6
---

# PJR-0123 registerの個票の内容を見直し

## 1. 概要

idや基本情報を見直し

## 2. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 3. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
