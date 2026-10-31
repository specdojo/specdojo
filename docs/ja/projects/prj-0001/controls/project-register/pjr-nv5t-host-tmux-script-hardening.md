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
  priority: low
  difficulty: easy
  registered_at: "2026-10-31T13:54:15Z"
  derived_from:
    - PJR-Q8KP
---

# PJR-NV5T ホストの tmux の script の前方一致の判定とラッパーの起動を直す

## 1. 概要

PJR-Q8KP で配った devcontainer-tmux.sh は、マウント元のパスを前方一致で比べる箇所で変数を引用していないため、パスに glob の文字が含まれると判定がずれる（shellcheck SC2295）。また sample のラッパーは本体を直接実行しており、実行権限が無いと動かない。bash 経由で呼ぶ形に直す

## 2. 入力

- PJR-Q8KP の close の前の確かめで、shellcheck が SC2295（info）と SC2034（`m_type` の未使用）を出した（2026-10-31）
- ラッパーを bash 経由の起動に直すことは 2026-10-31 の対話で利用者が推奨を採用した

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
