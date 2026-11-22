---
specdojo:
  id: prj-0001:pjr-ys9m-opencode-executor-allow-commands
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  registered_at: "2026-11-22T03:13:50Z"
  derived_from:
    - PJR-7KQT
---

# PJR-YS9M opencode の executor が sandbox で検証のコマンドとファイルの削除を流せない

## 1. 概要

qwen（opencode）の executor は npx・rm・git rm を拒まれ、検証を流せないまま報告する。PJR-7KQT は claude の分だけを直した。opencode の executor にも検証のコマンドを許す設定を足し、easy に振る基準も見直す。

## 2. 入力

- 2026-11-22、F6MC は検証を流せず 2 回止まり、HCHH は 2 ファイルを消せず止まった。
- 利用者の承認（2026-11-22、indie）で起票した。

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
