---
specdojo:
  id: prj-0001:pjr-b6m3-quick-start-environment-patterns
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T13:17:02Z"
  depends_on:
    - PJR-7EZR
    - PJR-GA72
  commit_type: docs
  commit_scope: guide
---

# PJR-B6M3 環境のパターン別のクイックスタートを書く

## 1. 概要

6 つのパターンごとに、最初の todo を起票し agent に 1 件流すまでの手順をクイックスタートに足す

## 2. 入力

- 利用者の依頼（2026-11-23）: 多くの人に使ってもらうため、Dev Container・Dev Container ＋ tmux・mac・mac ＋ tmux・WSL・WSL ＋ tmux のパターンですぐに使えるようにする
- v0.10.0 に入れる。実装はオーケストレーターが会話の中で行う（利用者の指定）

## 3. 完了条件

- クイックスタートに、6 つのパターン（Dev Container・Dev Container ＋ tmux・macOS・macOS ＋ tmux・WSL・WSL ＋ tmux）ごとに、コピーして貼るだけで「最初の todo を起票し、agent に 1 件流す」まで進める手順を足す。前提（`specdojo doctor`）を最初に確かめる。
- WSL の注意（作業ツリーを Linux 側に置く、Docker Desktop との連携）と、tmux のセッションの入り方を書く。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run lint:md`・`npm run lint:fm` を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
