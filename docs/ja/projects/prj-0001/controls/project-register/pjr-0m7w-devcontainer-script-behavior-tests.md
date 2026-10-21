---
specdojo:
  id: prj-0001:pjr-0m7w-devcontainer-script-behavior-tests
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-20T11:08:11Z"
  completed_at: "2026-10-20T11:41:28Z"
  conclusion: tests/src/devcontainer/scaffold.integration.test.ts に、生成した specdojo-tmux.sh と post-create.sh を偽物の docker・devcontainer・sudo・curl と組み合わせて動かす統合テストを加えた。ssh の RemoteCommand と同じ最小の PATH での CLI の見つけ方と docker exec の引数、見つからないときの案内、~/.local の持ち主の戻し方とインストーラより前の ~/.local/bin の作成、2 つのスクリプトの文法を確かめる。6 件が通った
  derived_from:
    - PJR-EJ4F
---

# PJR-0M7W devcontainer の scaffold が作るシェルスクリプトの動きを、docker なしでテストする

## 1. 概要

specdojo-tmux.sh.sample と post-create.sh を、偽物の docker・devcontainer・sudo・curl と組み合わせて実際に動かし、PATH の追加（ssh の RemoteCommand と同じ最小の PATH で）・docker exec の利用者と tmux の引数・~/.local の持ち主の戻し方と ~/.local/bin の作成・見つからないときの案内を確かめる統合テストを足す。生成したシェルスクリプトは bash -n と shellcheck でも確かめる（2026-10-20、利用者が承認。0.4.1 の範囲）

## 2. 完了条件

- PJR-EJ4F の完了後に行う（EJ4F で直したサンプルの動きを確かめるため）。
- 統合テスト（`*.integration.test.ts`）で、一時ディレクトリに `devcontainer scaffold` の出力を作り、次を確かめる。
  - `specdojo-tmux.sh`: 偽物の `docker`・`devcontainer`（呼ばれた引数を記録するだけのスクリプト）を置き、`env -i` で ssh の `RemoteCommand` と同じ最小の PATH にして動かす。`node_bin_dir` を足すと CLI が見つかること、`docker exec` に `-u node` と `tmux new-session -A -s <名前>` が渡ること、`devcontainer` や `docker` が見つからないときに PATH と確かめ方が出て終了コード 1 で終わること。
  - `post-create.sh`: `HOME` を一時ディレクトリにし、偽物の `sudo`・`curl`・`npm` などで動かす。`~/.local`・`~/.local/share` の持ち主を戻す呼び出しがあること、agent の CLI のインストーラより前に `~/.local/bin` が作られること。
- 生成したシェルスクリプト（`post-create.sh`・`specdojo-tmux.sh.sample`）を `bash -n` で確かめる。shellcheck が入っている環境では shellcheck でも確かめ、入っていなければ確かめを飛ばす（テストを失敗にしない）。
- テストは実際のネットワークと docker に触れない。偽物のコマンドは一時ディレクトリに作り、テストの後で消す。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG には記載しない（テストだけの変更のため）。

## 3. 作業内容

| No  | 作業                                                | 担当 | 状態 | メモ |
| --- | --------------------------------------------------- | ---- | ---- | ---- |
| 1   | devcontainer のシェルスクリプトの動きのテストを足す | DEV  | done | -    |

## 4. 対応結果

- `tests/src/devcontainer/scaffold.integration.test.ts` を追加し、一時ディレクトリへ実際の scaffold 出力を生成して検証するようにした。
- `specdojo-tmux.sh.sample` は偽の `docker`・`devcontainer` と ssh `RemoteCommand` 相当の最小 PATH で実行し、`node_bin_dir` による CLI の検出、停止中の devcontainer の起動、`docker exec` の `-u node`、作業ディレクトリ、`tmux new-session -A -s specdojo` の引数を確認する。各コマンドが見つからない場合は終了コード 1 と PATH・確認方法の案内も確認する。
- `post-create.sh` は偽の `sudo`・`curl`・`npm`・`git` で実行し、`${HOME}/.local` と `${HOME}/.local/share` を非再帰で chown する呼び出し、`${HOME}/.local/bin` の作成、agent installer より先に同ディレクトリが存在することを確認する。
- テスト中は実ネットワークと Docker daemon を使用せず、一時ディレクトリと偽コマンドは各テスト後に削除する。生成した両シェルスクリプトはテスト内で `bash -n` を実行し、shellcheck がある環境では shellcheck も実行する。
- executor で一時生成した両スクリプトに対する `bash -n` と shellcheck、および変更ファイルの Prettier 整形が合格した。親 runner が型検査・lint・単体テスト・統合テスト・schema 検証を実行する。
- 残課題: なし。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ej4f-remote-tmux-sample-path]]（元の項目）
- [[prj-0001:pjr-ghbp-devcontainer-local-bin-and-tmux-user]]（関係する不具合）
