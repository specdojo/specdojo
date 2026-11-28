---
specdojo:
  id: prj-0001:pjr-ca6g-note-closable
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: high
  owner: BA
  registered_at: "2026-11-28T07:19:56Z"
  due_on: "2026-11-30"
---

# PJR-CA6G note を done で close できるようにする

## 1. 背景

使い終わった note（中身を別の項目・文書へ移した、古くなった）を done で close し、移した先または古くなった理由を conclusion に残す。rejected・deferred は note に使わない

## 2. 入力

- 利用者の問題提起（2026-11-28）: note は気軽に起票できるが、終わらせられないため open がたまる
- 比べた案: A note を done で close できるようにする / B 終わらせず一覧で追記の新旧を分ける / C 今のまま。indie が A を選んだ（2026-11-28）
- v0.10.0 に入れる。担当 BA・期限 2026-11-30 は indie の指示（2026-11-28）

## 3. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 4. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 5. 採択理由

- _TODO_: 判断根拠を記載する。

## 6. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 8. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
