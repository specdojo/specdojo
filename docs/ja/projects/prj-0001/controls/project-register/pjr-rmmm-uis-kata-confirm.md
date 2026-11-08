---
specdojo:
  id: prj-0001:pjr-rmmm-uis-kata-confirm
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-11-08T04:01:13Z"
  derived_from:
    - PJR-2GD6
  depends_on:
    - PJR-0YNQ
---

# PJR-RMMM 画面仕様（uis）の手入れした型を確定する

## 1. 背景

uis も実装と同じことを書かない対象に加えたため（2026-11-08）、PJR-0YNQ で手入れした uis の型を人が確かめて確定する。確定した型で、カタログの説明の直し（PJR-6MCW）と代表の作成を進める。

## 2. 入力

- 型の確定は人が行う（PJR-RZ9Q と同じ扱い）。

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

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 型の手入れ: [[prj-0001:pjr-0ynq-uis-kata-reference-to-command-reference]]
- 前例: [[prj-0001:pjr-rz9q-business-specs-reps-kata-confirm]]
