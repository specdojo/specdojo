---
specdojo:
  id: prj-0001:pjr-ga72-doctor-command
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
  registered_at: "2026-11-23T13:16:57Z"
  commit_type: feat
  commit_scope: cli
---

# PJR-GA72 前提を確かめる specdojo doctor を作る

## 1. 概要

Node・git・agent の CLI、Dev Container のときは Docker と Dev Container CLI、tmux のときは tmux を確かめ、足りないものと入れ方を出す

## 2. 入力

- 利用者の依頼（2026-11-23）: 多くの人に使ってもらうため、Dev Container・Dev Container ＋ tmux・mac・mac ＋ tmux・WSL・WSL ＋ tmux のパターンですぐに使えるようにする
- v0.10.0 に入れる。実装はオーケストレーターが会話の中で行う（利用者の指定）

## 3. 完了条件

- 前提を確かめる `specdojo doctor` を作る。Node（`engines` の版）・git と `user.name`・`user.email`・agent の CLI（claude・codex・opencode・copilot のどれか）を確かめる。`--devcontainer` のときは Docker と Dev Container CLI、`--tmux` のときは tmux を確かめる。
- 今いる場所（Dev Container の中か、macOS・WSL・Linux か）を出す。WSL で作業ツリーが `/mnt/` の下にあるときは、遅く権限で詰まりやすいことを警告する。
- 足りないものと入れ方を出し、必須のものが足りないときは終了コード 1 で終える。
- 単体テストで、判定の組み合わせを確かめる（コマンドの実行は差し替えられるようにする）。
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
