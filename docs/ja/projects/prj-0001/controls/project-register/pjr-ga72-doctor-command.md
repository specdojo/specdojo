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

| No  | 作業                                                          | 担当                  | 状態 | メモ      |
| --- | ------------------------------------------------------------- | --------------------- | ---- | --------- |
| 1   | `src/commands/doctor.ts` を作り、`src/specdojo.ts` に登録する | specdojo-orchestrator | done | 482fcc65e |
| 2   | コマンドの実行を差し替えられる形で、判定の単体テストを書く    | specdojo-orchestrator | done | 9 件      |
| 3   | develop へ統合し、空のリポジトリで `doctor --tmux` を流す     | specdojo-orchestrator | done | 8b631dd14 |

## 5. 対応結果

- `specdojo doctor` を足した。Node.js（22.17 以上）、git と `user.name`・`user.email`、agent の CLI（claude・codex・opencode・copilot のどれか）を確かめる。`--devcontainer` では Docker と Dev Container CLI（tmux も使う場合は必須、使わない場合は警告）、`--tmux` では tmux を確かめる。Dev Container の中ではホスト側の道具を省く。
- 今いる場所（コンテナの中か、macOS・WSL・Linux か）を出す。WSL で作業ツリーが `/mnt/` の下にあると警告する。足りないものには OS に合う入れ方（`brew install`・`sudo apt install`・Docker Desktop の WSL 連携など）を出し、必須のものが足りないと終了コード 1 で終える。
- 検証: 単体テスト 9 件（local・古い Node・git の名前なし・agent なし・macOS の tmux・Dev Container の外と中・WSL の置き場所・出力の整形）を足し、`npm run typecheck`・`npm run lint:ts`（エラー 0）・`npm run test:unit`（4351 件）を通した。統合の後、作業用の空のリポジトリで `doctor --tmux` が全項目 ok で終了コード 0 になることを確かめた。
- 残り: macOS と WSL の実機での確かめは PJR-F636 で行う。

CHANGELOG に書く事項（Added）:

- 導入の前提を確かめる `specdojo doctor` を足した。Node.js・git の名前とメール・agent の CLI を確かめ、`--devcontainer` では Docker と Dev Container CLI、`--tmux` では tmux も確かめる。足りないものは入れ方を出して終了コード 1 で終える。

## 6. 関連ドキュメント

- [[specdojo:command-reference|コマンドリファレンス]]: `doctor` の説明。
- 関連: PJR-7EZR（init の環境のパターン。最後の案内で `doctor` を勧める）、PJR-B6M3、PJR-F636。
