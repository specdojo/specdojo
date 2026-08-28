---
specdojo:
  id: prj-0001:pjr-0053-template
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  due_on: "2026-05-20"
  completed_at: "2026-05-21T12:00:00Z"
  conclusion: PJR-0055, 0056が残件
  register_events:
    - v: 1
      id: reg_dbd7580f28209e2081aaf57fb5b93f91
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
          to: templateのプレースホルダーの変更
        - field: description
          from: ""
          to: "*CAPITAL_CASE*の形式に見直し"
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
          to: "2026-05-20"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: PJR-0055, 0056が残件
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
    - v: 1
      id: reg_e6beb8fc037c6f686e33ef617074afd5
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-05-21"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_dbd7580f28209e2081aaf57fb5b93f91
    - v: 1
      id: reg_69da491a7f1f2b544eb4c50c72405112
      ts: "2026-08-16T10:04:37Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "docs: complete PJR-ZP0B system design restructure"
      changes:
        - field: description
          from: "*CAPITAL_CASE*の形式に見直し"
          to: "`*CAPITAL_CASE*`の形式に見直し"
      legacy_commit: bf5276ca6a5d527e30d46b4f9ceb54e890b8eabf
      previous_event_id: reg_e6beb8fc037c6f686e33ef617074afd5
---

<!-- markdownlint-disable MD049 -->

# PJR-0053 templateのプレースホルダーの変更

## 1. 概要

`*CAPITAL_CASE*`の形式に見直し

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
