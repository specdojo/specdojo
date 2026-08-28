---
specdojo:
  id: prj-0001:pjr-0030-wbs-to-schedule-strategy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: rejected
  priority: high
  owner: ARC
  due_on: "2026-05-10"
  completed_at: "2026-05-17T12:00:00Z"
  conclusion: WBS統合により却下
  register_events:
    - v: 1
      id: reg_6b0f8a197cfe0cb9a73532122f371e9d
      ts: "2026-08-09T10:55:22Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: rejected
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: ""
          to: rejected
        - field: title
          from: ""
          to: wbs to schedule strategyの見直し
        - field: description
          from: ""
          to: WBS統合により不要
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: high
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: "2026-05-10"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: WBS統合により却下
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
    - v: 1
      id: reg_ae02e552cf5780f936fe63c883e3421f
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: rejected
      to_status: rejected
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-05-17"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_6b0f8a197cfe0cb9a73532122f371e9d
---

# PJR-0030 wbs to schedule strategyの見直し

## 1. 概要

WBS統合により不要

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
