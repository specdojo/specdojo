---
specdojo:
  id: prj-0001:pjr-0m7w-devcontainer-script-behavior-tests
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-20T11:08:11Z"
  derived_from:
    - PJR-EJ4F
---

# PJR-0M7W devcontainer の scaffold が作るシェルスクリプトの動きを、docker なしでテストする

## 1. 概要

specdojo-tmux.sh.sample と post-create.sh を、偽物の docker・devcontainer・sudo・curl と組み合わせて実際に動かし、PATH の追加（ssh の RemoteCommand と同じ最小の PATH で）・docker exec の利用者と tmux の引数・~/.local の持ち主の戻し方と ~/.local/bin の作成・見つからないときの案内を確かめる統合テストを足す。生成したシェルスクリプトは bash -n と shellcheck でも確かめる（2026-10-20、利用者が承認。0.4.1 の範囲）

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
