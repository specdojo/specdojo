---
specdojo:
  id: prj-0001:pjr-0033-yaml-md
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: ARC
  due_on: "2026-05-17"
  completed_at: "2026-05-17T12:00:00Z"
  conclusion: "`specdojo catalog build` で自動生成"
  register_events:
    - v: 1
      id: reg_2e5a37b684d39334ca0ce808b14d60d7
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
          to: 成果物カタログのyamlからmd生成
        - field: description
          from: ""
          to: 可読性向上のため、yamlからmdへの変換を自動化
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
          to: "2026-05-17"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "`specdojo catalog build` で自動生成"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
    - v: 1
      id: reg_71634aa1554ab694670bcba45c5adc1c
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-05-17"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_2e5a37b684d39334ca0ce808b14d60d7
---

# PJR-0033 成果物カタログのyamlからmd生成

## 1. 概要

可読性向上のため、yamlからmdへの変換を自動化

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
