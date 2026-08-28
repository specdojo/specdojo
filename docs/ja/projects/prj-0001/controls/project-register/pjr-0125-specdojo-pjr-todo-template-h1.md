---
specdojo:
  id: prj-0001:pjr-0125-specdojo-pjr-todo-template-h1
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  due_on: "2026-07-31"
  completed_at: "2026-07-24T12:00:00Z"
  conclusion: pjr-todo-template.mdのH1を_TODO_TITLE_へ修正。他type同様にタイトルが置換されることを確認
  register_events:
    - v: 1
      id: reg_31ac01389858ec990873e02d795d3200
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
          to: specdojo:pjr-todo-templateのH1プレースホルダ不整合を修正
        - field: description
          from: ""
          to: pjr-todo-template.mdのH1がTASK_TITLE表記で、register addの生成ロジック（TODO_TITLE）と不一致。todo個票のタイトルが未置換で残る。他type同様のTYPE_TITLE規約へ揃える
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
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
          to: pjr-todo-template.mdのH1を_TODO_TITLE_へ修正。他type同様にタイトルが置換されることを確認
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
    - v: 1
      id: reg_394093292c1413c1814276957fc83c40
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: done
      to_status: done
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-07-24"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_31ac01389858ec990873e02d795d3200
---

# PJR-0125 specdojo:pjr-todo-templateのH1プレースホルダ不整合を修正

## 1. 概要

pjr-todo-template.mdのH1がTASK_TITLE表記で、register addの生成ロジック（TODO_TITLE）と不一致。todo個票のタイトルが未置換で残る。他type同様のTYPE_TITLE規約へ揃える

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
