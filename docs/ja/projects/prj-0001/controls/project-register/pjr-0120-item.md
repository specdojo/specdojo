---
specdojo:
  id: prj-0001:pjr-0120-item
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: high
  owner: PO
  due_on: null
  completed_at: "2026-07-24T12:00:00Z"
  conclusion: 採用ライセンスを MIT、貢献導線を GitHub issue / pull request として確定
  register_events:
    - v: 1
      id: reg_4830927ae69fff087fb7b61d15631d37
      ts: "2026-08-09T10:55:22Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: decided
      reason: "exec(register PJR-9P5Q): 既存登録項目を個票 frontmatter へ一括移行する"
      changes:
        - field: status
          from: ""
          to: decided
        - field: title
          from: ""
          to: 初期公開の範囲・ライセンス・貢献導線の確定
        - field: description
          from: ""
          to: 初期公開の対象範囲、ライセンス、貢献導線を PO の判断で確定する（旧 ACD-D03）
        - field: type
          from: ""
          to: decision
        - field: priority
          from: ""
          to: high
        - field: owner
          from: ""
          to: PO
        - field: registered
          from: ""
          to: _TODO_
        - field: due
          from: ""
          to: "-"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: 採用ライセンスを MIT、貢献導線を GitHub issue / pull request として確定
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: dbac152079df02ec9bbad154a3253c043e10655a
    - v: 1
      id: reg_5dd0f93b515e540686b566a18fad59a6
      ts: "2026-08-09T14:39:40Z"
      action: update
      actor: SpecDojo Test
      from_status: decided
      to_status: decided
      reason: "exec(register PJR-EQAQ): 登録簿日時をregistered_at・completed_atへ移行する"
      changes:
        - field: completed
          from: "-"
          to: "2026-07-24"
      legacy_commit: 38201bef867f3cc1454db6b748fc979ed3f2fa8f
      previous_event_id: reg_4830927ae69fff087fb7b61d15631d37
---

# PJR-0120 初期公開の範囲・ライセンス・貢献導線の確定

## 1. 背景

初期公開の対象範囲、ライセンス、貢献導線を PO の判断で確定する（旧 ACD-D03）

## 2. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 3. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 4. 採択理由

- _TODO_: 判断根拠を記載する。

## 5. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
