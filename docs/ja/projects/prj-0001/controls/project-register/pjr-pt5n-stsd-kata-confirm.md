---
specdojo:
  id: prj-0001:pjr-pt5n-stsd-kata-confirm
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  registered_at: "2026-11-05T11:23:37Z"
  derived_from:
    - PJR-3APD
    - PJR-00NY
---

# PJR-PT5N 手入れした stsd の Kata を確定する

## 1. 背景

3APD の段 7。段 6 で手入れした stsd の Kata（rulebook・図の rulebook・sample）を確定し、retrofit に使ってよいかを決める

## 2. 入力

- 段 6 で stsd-rulebook（PJR-KBS6）・stsd-mermaid-rulebook（PJR-EAKN）・stsd-sample（PJR-KM8C）を手入れした。recipe と template は変えていない
- KM8C で sample の図が分割の例だけになり、1 図の例がなくなった。rulebook は閾値以下の図を分けなくてよいとしているため、このまま確定し、retrofit の後の磨き込みと review で小さな図を分けていないかを確かめる（2026-11-05 利用者が推奨の案 A を選んだ）

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
