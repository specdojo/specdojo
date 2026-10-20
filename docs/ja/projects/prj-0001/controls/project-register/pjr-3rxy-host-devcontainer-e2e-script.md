---
specdojo:
  id: prj-0001:pjr-3rxy-host-devcontainer-e2e-script
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-20T11:08:30Z"
  derived_from:
    - PJR-GHBP
---

# PJR-3RXY ホストで本物の devcontainer を作って確かめる E2E のスクリプトを用意する

## 1. 概要

ホストの Mac（docker と Dev Container CLI がある）で実行し、一時ディレクトリに scaffold した devcontainer を devcontainer up で作り、devcontainer exec で利用者が node であること、~/.local/bin が node の持ち物であること、tmux・vim・emacs と agent の CLI が入ったことを確かめ、最後に container と volume を片づけるスクリプトを用意する。開発用の container には docker を入れない（agent にホストの権限を与えないため。2026-10-20、利用者が案 C を選んだ）

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
