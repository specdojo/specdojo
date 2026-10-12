---
specdojo:
  id: prj-0001:pjr-pv5b-devcontainer-scaffold-observations
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: note
  item_status: open
  priority: medium
  registered_at: "2026-10-12T03:21:44Z"
---

# PJR-PV5B devcontainer scaffold の実機確認で気づいた点

## 1. メモ

scaffold の devcontainer は親フォルダを /workspaces/specdojo-workspace に固定でマウントし、利用者のフォルダ名と無関係な名前になる。--tmux などの任意機能は指定しないと入らず、完了時の案内からも分からない（tmux が無いことにコンテナの作成後に気づいた）

## 2. 背景・文脈

_TODO_: このメモを残す理由、関連する経緯、参照時の注意点を記載する。

## 3. フォローアップ

_TODO_: 対応が必要な場合は内容を記載する。参照のみの場合は `-` とする。

## 4. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
