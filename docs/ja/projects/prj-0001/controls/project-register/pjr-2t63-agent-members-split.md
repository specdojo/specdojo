---
specdojo:
  id: prj-0001:pjr-2t63-agent-members-split
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-05T22:59:51Z"
  due_on: null
---

# PJR-2T63 agent の定義を pm-members.yaml から保護された設定へ分ける

## 1. 概要

pm-members.yaml には人と agent の定義が同居している。agent の定義（provider・コマンド・モデル・役割）を .specdojo/ 配下など保護された設定へ移し、人は pm-members.yaml に残す。名簿の読み込みは両方を合わせ、ニックネームの一意性を検査する。schema・rulebook・scaffold も合わせて直す。

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
