---
specdojo:
  id: prj-0001:pjr-ccxn-devcontainer-remote-host-samples
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-18T10:46:30Z"
  derived_from:
    - PJR-8GQ4
---

# PJR-CCXN devcontainer の scaffold で常時稼働ホストへの接続のサンプルを作る

## 1. 概要

devcontainer scaffold（init --devcontainer を含む）で、常時稼働ホストで devcontainer を起動して tmux へ入る接続用のスクリプトと、接続元の ssh の config（alias と devcontainer の公開ポートの LocalForward）のサンプルを .devcontainer/remote-host/ に作り、最後の案内で置き場所とコピー先を示す。今は自宅の Mac 向けの設計書にしかなく、利用者に届いていない（2026-10-18、ポートの転送の不足で開発サーバへつながらなかった件を受けて）

## 2. 完了条件

- `devcontainer scaffold`（`init --devcontainer` を含む）で、`.devcontainer/remote-host/` に次の 2 つのサンプルを作る。既にある場合は `--force` のときだけ上書きする。
  - `specdojo-tmux.sh.sample`: 常時稼働ホストで使う。devcontainer が止まっていれば起動し、container の中で `tmux new-session -A -s <名前>` へ入る。起動に使うコマンド（`devcontainer` CLI か docker か）と、前提のツールを冒頭のコメントに書く。
  - `ssh-config.sample`: 接続元の端末の `~/.ssh/config` に写す。ホストの alias、tmux へ直接入る alias（`RemoteCommand` と `RequestTTY`）、`devcontainer.json` の公開ポート（`appPort`・`forwardPorts`）ごとの `LocalForward` の行を含む。公開ポートがない場合は、書き方の例をコメントで示す。
- ホスト名・ユーザー・パスは仮の値（`<host>` など）にし、実在の値や秘密を書かない。
- 接続用のスクリプトは container の中の tmux を前提にするため、`init --devcontainer` で tmux を入れるか（今は入れない）を決めて実装し、理由を result に書く。
- scaffold の最後の案内に、2 つのサンプルの置き場所とコピー先を 1〜2 行で示す。
- [[specdojo:remote-host-development-guide]] の Dev Container を生成する節に、2 つのサンプルの使い方と、公開ポートを増やしたときは `LocalForward` も足すことを書く。
- 単体テストで、公開ポートがある場合とない場合の `ssh-config.sample` の中身と、既にあるサンプルを `--force` なしで上書きしないことを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [0.4.0] - 未定` の節に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ         |
| --- | ----------------------------------------------------- | ---- | ---- | ------------ |
| 1   | scaffold で接続のサンプルを作り、案内とガイドを改める | DEV  | done | 0.4.0 の範囲 |

## 4. 対応結果

- 解決内容: `devcontainer scaffold`（`init --devcontainer` を含む）で、`.devcontainer/remote-host/` に `specdojo-tmux.sh.sample` と `ssh-config.sample` を生成するようにした。既にある場合は `--force` のときだけ上書きする。
- 接続用スクリプト（`specdojo-tmux.sh.sample`）: 常時稼働ホスト上で devcontainer の起動（`devcontainer up`）と tmux セッション（`specdojo`）への直接接続（`docker exec`）を行う。前提ツール（Docker、`@devcontainers/cli`、tmux）と起動コマンドを冒頭コメントに記載し、ホスト名・パス・ユーザー名は仮の値（プレースホルダー）とした。
- SSH 設定サンプル（`ssh-config.sample`）: 接続元の `~/.ssh/config` に写すホスト alias、tmux 接続用 alias（`RemoteCommand` / `RequestTTY force`）、`devcontainer.json` の公開ポート（`appPort`・`forwardPorts`）ごとの `LocalForward` を含む。公開ポートがない場合は書き方の例をコメントで示した。
- `init --devcontainer` の tmux: 接続スクリプトがコンテナ内の tmux を前提とするため、`init --devcontainer` で `tmux: true` としてコンテナ内 tmux を自動で導入するように実装した。
- 案内とガイド: scaffold 完了時の Next steps でサンプルの置き場所とコピー先を示し、[[specdojo:remote-host-development-guide]]・`docs/ja/specdojo/references/command-reference.md`・CHANGELOG にサンプルの使い方と `LocalForward` の追加手順を記載した。
- 単体テスト: 公開ポートの抽出、公開ポート有無に応じた `ssh-config.sample` の内容、`--force` なしでの上書き防止、`--force` での上書き、dry-run 表示、および `init --devcontainer` での tmux 有効化を単体テストで検証した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-8gq4-devcontainer-workspace-dir-fixed]]（元の項目）
- [[specdojo:remote-host-development-guide]]（影響先）
- [[tsd-home-mac-dev-server]]（自宅の Mac 向けの接続の例）
