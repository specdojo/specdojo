---
specdojo:
  id: prj-0001:pjr-kbs6-stsd-rulebook-end-point
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-05T10:44:52Z"
  derived_from:
    - PJR-3APD
    - PJR-00NY
  approach: rulebook-maintenance
  targets:
    - specdojo:stsd-rulebook
---

# PJR-KBS6 stsd の rulebook に、終了点を置かない境界の書き方を足す

## 1. 概要

3APD の段 6。差し戻せる完了や記録が残る中止のように、業務の終了と状態管理の継続が分かれる場合の、終了点と継続状態の書き方を stsd-rulebook に足す

## 2. 入力

- PJR-Q9AW の磨き込みで、完了は差し戻せ、中止の後も記録が残るため、stsd-task-execution では終了点を置かず理由を「概要」に書いた。rulebook は終了点を省く場合を「継続状態」で説明するが、この境界の書き方がない

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
