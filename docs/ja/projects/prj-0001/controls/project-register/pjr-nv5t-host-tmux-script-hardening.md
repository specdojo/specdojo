---
specdojo:
  id: prj-0001:pjr-nv5t-host-tmux-script-hardening
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: easy
  owner: DEV
  registered_at: "2026-10-31T13:54:15Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-Q8KP
---

# PJR-NV5T ホストの tmux の script でマウント元のパスを正規化して比べる

## 1. 概要

PJR-Q8KP で配った devcontainer-tmux.sh は、docker inspect が返すマウント元のパスを文字列のまま前方一致で比べる。Docker Desktop for Mac では workspaceMount の source が `<親>`/specdojo/.. の形で返るため一致せず、ホストで接続できない。bind のマウントだけを正規化して比べ、shellcheck の SC2295・SC2034 も直す。sample のラッパーは bash 経由で本体を呼ぶ形にする

## 2. 入力

- PJR-Q8KP の close の前の確かめで、shellcheck が SC2295（info）と SC2034（`m_type` の未使用）を出した（2026-10-31）
- ラッパーを bash 経由の起動に直すことは 2026-10-31 の対話で利用者が推奨を採用した
- 利用者のホスト（macOS・Docker Desktop）で ~/bin/specdojo-tmux を実行すると「Could not determine container workspace directory from mounts for: /Users/naoto/workspaces/specdojo-workspace/specdojo」で止まった（2026-10-31）
- 同じホストの docker inspect の Mounts は bind の Source を /Users/naoto/workspaces/specdojo-workspace/specdojo/..、Destination を /workspaces/specdojo-workspace と返した。ほかは volume のマウント（Source は /var/lib/docker/volumes/`<名前>``/_data`）だった
- マウント元の正規化の不具合は本項目の範囲に含め、優先度を high にすることを 2026-10-31 の対話で利用者が選んだ（案 A）

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
