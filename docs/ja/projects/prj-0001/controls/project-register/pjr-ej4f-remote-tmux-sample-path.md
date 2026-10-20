---
specdojo:
  id: prj-0001:pjr-ej4f-remote-tmux-sample-path
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-20T11:00:35Z"
  derived_from:
    - PJR-GHBP
---

# PJR-EJ4F 接続のスクリプトを ssh から動かすと Dev Container CLI が見つからない

## 1. 課題内容

specdojo-tmux.sh.sample を ssh の RemoteCommand で動かすと、ログインも対話もしないシェルで動くため、Mac の端末で読み込まれる Homebrew・nvm などの PATH の設定が入らず、「Dev Container CLI is not installed」で止まる（2026-10-20、利用者が報告）。サンプルは PATH の追加をコメントで書いているだけで、自宅の Mac 向けの設計書の helper にある node_bin_dir と /opt/homebrew/bin・/usr/local/bin の追加が引き継がれていない

## 2. 影響範囲

| 観点         | 影響                                                                     |
| ------------ | ------------------------------------------------------------------------ |
| スコープ     | `src/devcontainer/scaffold.ts`（`specdojo-tmux.sh.sample` の生成）       |
| スケジュール | 高い。接続のサンプルのとおりに ssh で入ると、devcontainer を起動できない |
| コスト       | 利用者が原因を調べて PATH を足す手間                                     |
| 品質         | サンプルがそのままでは動かない                                           |
| 関係者       | 常時稼働ホストへ ssh で入る利用者                                        |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                           |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | ssh の `RemoteCommand` はログインも対話もしないシェルで動くため、`~/.zshrc` などの PATH の設定が入らない。サンプルは PATH の追加をコメントで案内するだけである |
| 対応策   | サンプルで、node と Dev Container CLI のあるディレクトリと、よく使われる場所を既定で PATH の先頭に足す。見つからないときの案内を具体的にする                   |
| 依存事項 | なし                                                                                                                                                           |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                         |

### 3.1. 完了条件

- `specdojo-tmux.sh.sample` に `node_bin_dir` の変数を設け、`/opt/homebrew/bin`・`/usr/local/bin` と合わせて、既定で PATH の先頭に足す。`node_bin_dir` に入れる値の確かめ方（`dirname "$(command -v devcontainer)"`）と、Homebrew・nvm・mise の例を冒頭のコメントに書く（[[tsd-home-mac-dev-server]] の helper と同じ形）。
- `devcontainer` と `docker` が見つからないときの案内に、その時点の PATH と、置き場所の確かめ方を出す。
- `ssh-config.sample` と [[specdojo:remote-host-development-guide]] に、`RemoteCommand` では端末の PATH の設定が読み込まれないことと、確かめ方（`ssh <host> 'command -v devcontainer'`）を書く。
- 単体テストで、生成したサンプルに PATH の追加と案内があることを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [0.4.1] - 未定` の節に書く。公開済みの版の節は変えない。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ghbp-devcontainer-local-bin-and-tmux-user]]（元の項目）
- [[tsd-home-mac-dev-server]]（helper の PATH の書き方）
