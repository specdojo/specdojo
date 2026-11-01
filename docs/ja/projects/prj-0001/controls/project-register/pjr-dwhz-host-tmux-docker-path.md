---
specdojo:
  id: prj-0001:pjr-dwhz-host-tmux-docker-path
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: waiting
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-01T07:10:43Z"
  due_on: "2026-11-30"
  block_reason: "parent validation failed: test-integration"
  derived_from:
    - PJR-Q8KP
---

# PJR-DWHZ ssh で入るとホストの tmux スクリプトが docker を見つけられない（mac・WSL2・Linux）

## 1. 課題内容

ssh で入ったホストの非対話シェルでは PATH に docker がなく、devcontainer-tmux.sh が line 46 で docker: command not found になる。mac・WSL2・Linux で docker を探せるようにし、見つからない・動かせないときは OS に合ったヒントを出す

## 2. 入力

- 利用者が tmux でリモートから入ると、devcontainer-tmux.sh の line 46 で docker: command not found になる（2026-11-01）
- ssh で入ると mac のログインシェルの設定が読まれず、PATH は /usr/bin:/bin:/usr/sbin:/sbin になる。以前のホストのスクリプトは /opt/homebrew/bin と /usr/local/bin を PATH に足していた
- 今の本体は devcontainer up を呼ぶときだけ PATH を補い、最初の docker ps では補っていない
- ラッパーは小さく保ち、PATH の補いは本体で行う。mac・Windows（WSL2）・Linux で動くようにする（2026-11-01 の利用者の要望）
- 探し方は、今の PATH、ログインシェル（"$SHELL" -lc）への問い合わせ、よくある場所の順とし、環境変数 `SPECDOJO_DOCKER_BIN` で直接指定もできるようにする（2026-11-01 の対話で承認）
- 実機で確かめられるのは利用者の mac だけ。WSL2 と Linux は単体テストでの確認にとどめ、実機が未確認であることを記録する

## 3. 影響範囲

| 観点         | 影響                                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `templates/devcontainer/remote-host/devcontainer-tmux.sh` と、それを書き出した `.specdojo/host/devcontainer-tmux.sh`。ラッパーは変えない |
| スケジュール | リモートから devcontainer に入れず、PJR-Q8KP と PJR-NV5T のホストでの確認が止まっている                                                  |
| コスト       | 本体のスクリプトとテストの修正。文書の追記                                                                                               |
| 品質         | ssh の非対話シェルで docker が見つからず、接続に失敗する                                                                                 |
| 関係者       | DEV（ホストから接続する利用者）                                                                                                          |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | ssh で入った非対話シェルでは、ログインシェルの設定が読まれず PATH に docker がない。本体は devcontainer up を呼ぶときだけ PATH を補い、最初の `docker ps` では補っていない                  |
| 対応策   | 本体で docker を、今の PATH、ログインシェルへの問い合わせ、よくある場所の順に探す。`SPECDOJO_DOCKER_BIN` で直接指定もできる。見つからない・動かせないときは OS に合ったヒントを出して止まる |
| 依存事項 | なし                                                                                                                                                                                        |
| 完了条件 | 下記の条件をすべて満たすこと                                                                                                                                                                |

完了条件の内訳。

- 本体のスクリプトが、最初に `docker` を呼ぶ前に、次の順で `docker` を探す。見つかった場所は PATH の先頭に足し、以降の `docker` と `devcontainer up` で使う。
  1. 環境変数 `SPECDOJO_DOCKER_BIN`（`docker` を置いたディレクトリ）が指定されていれば、そこを使う。
  2. 今の PATH で探す。
  3. 利用者のログインシェル（`"$SHELL" -lc`）に `command -v docker` を尋ねる。シェルの起動時の出力に影響されず、実行できるファイルのパスだけを採る。
  4. よくある場所を順に探す（`/usr/local/bin`、`/opt/homebrew/bin`、`$HOME/.docker/bin`、`/Applications/Docker.app/Contents/Resources/bin`、`/snap/bin`、`/usr/bin`）。
- どこにもなければ、探した場所と、OS に合ったヒントを標準エラーに出して exit 1 で止まる。OS は `uname` と WSL の判定（`/proc/version` などに `microsoft` を含むか）で見分ける。ヒントは、mac では Docker Desktop の導入、WSL2 では Docker Desktop の WSL integration の有効化、Linux では Docker Engine の導入とする。
- `docker` が見つかっても `docker info` が失敗する場合は、OS に合ったヒントを出して exit 1 で止まる。mac では Docker Desktop の起動、WSL2 では Docker Desktop の起動と WSL integration、Linux では docker サービスの起動と `docker` グループへの所属とする。
- 単体テスト（`tests/src/devcontainer/host-script.test.ts` か、同じ場所の新しいテスト）で、偽の `docker` と偽のログインシェルを一時ディレクトリに置き、次を確かめる。`SPECDOJO_DOCKER_BIN` で見つかる、PATH で見つかる、ログインシェルで見つかる、どこにもないとヒントを出して止まる、`docker info` が失敗するとヒントを出して止まる。
- shellcheck を通す（既存のテストや lint で shellcheck を使っていれば、それに従う）。
- `docs/ja/specdojo/guides/remote-host-development-guide.md` に、docker の探し方と `SPECDOJO_DOCKER_BIN` を追記する。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証を通す。CHANGELOG は未公開の版の節に書き、公開済みの版の節は変えない。
- `.specdojo/host/devcontainer-tmux.sh` は保護されたファイルなので executor は書き換えない。統合の後に orchestrator が `devcontainer host-script` で書き出し直す。
- 実機で確かめられない WSL2 と Linux は、単体テストでの確認にとどめ、実機が未確認であることを個票の対応結果に記録する。mac での実機の確認は利用者が行う。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:remote-host-development-guide]]
- [[specdojo:command-reference]]
