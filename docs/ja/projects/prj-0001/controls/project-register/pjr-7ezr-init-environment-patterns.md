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

| No  | 作業                                                                                 | 担当                  | 状態 | メモ                        |
| --- | ------------------------------------------------------------------------------------ | --------------------- | ---- | --------------------------- |
| 1   | `src/init/environment.ts` を作る（OS の判定、local-tmux.sh の書き出し、次の手順）    | specdojo-orchestrator | done | 482fcc65e                   |
| 2   | `init` に tmux の問い・`--tmux`・`--no-tmux`・本体スクリプトの作成・次の手順をつなぐ | specdojo-orchestrator | done | 482fcc65e                   |
| 3   | `templates/host/local-tmux.sh` を作る                                                | specdojo-orchestrator | done | 482fcc65e                   |
| 4   | 単体テストを足し、問いの数が変わる既存のテストを合わせる                             | specdojo-orchestrator | done | 4 パターンの it.each を含む |
| 5   | develop へ `--no-ff` で統合し、空のリポジトリで 4 パターンを確かめる                 | specdojo-orchestrator | done | 8b631dd14                   |

## 5. 対応結果

- `specdojo init` の対話で、Dev Container（と preset）の次に「tmux でセッションを保つか」を聞くようにした。既定は Dev Container の recommended・full で yes、ほかは no。非対話では `--tmux`・`--no-tmux` で指定し、既定は同じ。
- tmux を選ぶと、Dev Container では Dev Container の tmux に加えて常時稼働ホストの本体スクリプト `.specdojo/host/devcontainer-tmux.sh` を作り（PJR-8PXJ の内容）、手元では `.specdojo/host/local-tmux.sh`（workspace 名のセッションを作るか入る）を作る。
- 最後の案内に `Environment:` の節を足し、選んだパターンの次の手順だけ（`specdojo doctor` のオプション、Dev Container の開き方、tmux の入り方、WSL の置き場所の注意）を出す。
- 検証: `npm run typecheck` 通過、`npm run lint:ts` はエラー 0（変更したファイルに警告なし）、`npm run test:unit` は 249 ファイル・4351 件通過。統合の後、2026-11-23 に、作業用の空のリポジトリ 4 つで `specdojo init --yes --provider claude` を、オプションなし・`--tmux`・`--devcontainer --devcontainer-preset minimal`・`--devcontainer` で流した。それぞれ終了コード 0 で、`.specdojo/host/` のファイル（なし・`local-tmux.sh`（実行権限付き、`bash -n` 通過）・なし・`devcontainer-tmux.sh`）と、パターンに合う次の手順だけが出ることを確かめた。
- 残り: macOS と WSL の実機での確かめは PJR-F636（CI と WSL のチェックリスト）で行う。

CHANGELOG に書く事項（Added）:

- `specdojo init` で使う環境のパターン（Dev Container・手元と tmux の組み合わせ）を選べるようにした。`--tmux`・`--no-tmux` を足し、tmux を選ぶと Dev Container では常時稼働ホストの本体スクリプト、手元では `.specdojo/host/local-tmux.sh` を作る。最後の案内には選んだパターンの次の手順だけを出す。

## 6. 関連ドキュメント

- [[specdojo:quick-start-guide|クイックスタート]]: 使う環境のパターンの節（PJR-B6M3）。
- [[specdojo:command-reference|コマンドリファレンス]]: `init` の `--tmux`・`--no-tmux`。
- 関連: PJR-GA72（`specdojo doctor`）、PJR-B6M3（パターン別のクイックスタート）、PJR-F636（CI での確かめ）、PJR-8PXJ（取り下げてこの項目にまとめた）。
