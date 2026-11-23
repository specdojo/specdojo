---
specdojo:
  id: prj-0001:pjr-7ezr-init-environment-patterns
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T13:16:51Z"
  derived_from:
    - PJR-8PXJ
  commit_type: feat
  commit_scope: init
---

# PJR-7EZR specdojo init で使う環境のパターン（Dev Container・手元 × tmux）を選べるようにする

## 1. 概要

init で Dev Container か手元かと tmux を選び、パターンに合う設定・tmux のスクリプト・次の手順を出す。PJR-8PXJ の本体スクリプトの件を含む

## 2. 入力

- 利用者の依頼（2026-11-23）: 多くの人に使ってもらうため、Dev Container・Dev Container ＋ tmux・mac・mac ＋ tmux・WSL・WSL ＋ tmux のパターンですぐに使えるようにする
- v0.10.0 に入れる。実装はオーケストレーターが会話の中で行う（利用者の指定）

## 3. 完了条件

- `specdojo init` で、使う環境のパターン（Dev Container・Dev Container ＋ tmux・手元（macOS・WSL・Linux）・手元 ＋ tmux）を選べるようにする（利用者の依頼、2026-11-23）。対話では Dev Container を使うかの次に、tmux でセッションを保つかを聞く。`--tmux`・`--no-tmux` を足す。
- Dev Container ＋ tmux では、Dev Container の tmux と、常時稼働ホストで使う本体スクリプト（`.specdojo/host/devcontainer-tmux.sh`）を作る（取り下げた PJR-8PXJ の内容）。手元 ＋ tmux では、手元で tmux のセッションを作るか入るスクリプト（`.specdojo/host/local-tmux.sh`）を作る。
- 最後の案内に、選んだパターンの次の手順だけを出す（tmux のセッションへの入り方、Dev Container の開き方、`specdojo doctor` で前提を確かめることなど）。
- 単体テストで、4 つのパターンの組み合わせ（`--yes` を含む）と、作るファイルを確かめる。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を通す。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
