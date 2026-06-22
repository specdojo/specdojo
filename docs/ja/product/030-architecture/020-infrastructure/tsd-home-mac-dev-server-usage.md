---
id: tsd-home-mac-dev-server-usage
type: architecture
status: draft
rulebook: tsd-rulebook
part_of:
  - tsd-index
based_on:
  - tsd-home-mac-dev-server
  - sysd-agent-settings
  - sysd-opencode-agent-settings
  - sysd-claude-agent-settings
  - sysd-codex-agent-settings
  - sysd-github-copilot-agent-settings
---

# 自宅 MacBook Pro 開発サーバ運用ガイド

[[tsd-home-mac-dev-server|自宅 MacBook Pro 開発サーバ技術スタック定義]] で構築した接続基盤を使い、devcontainer 内で tmux、SpecDojo、agent CLI を運用するための手順を定義する。

## 1. 前提と責務

本書は日常の接続、切断復帰、長時間実行、SpecDojo agent 実行を対象とする。Tailscale、Remote Login、SSH、VS Code Remote SSH、devcontainer の初期設定は、先に [[tsd-home-mac-dev-server|自宅 MacBook Pro 開発サーバ技術スタック定義]] の 4.1〜4.10 を完了する。

開発コマンド、build、test、SpecDojo、agent CLI は devcontainer 内で実行する。Host Mac 側の tmux は Docker Desktop、Tailscale、Ollama の運用確認だけに使い、SpecDojo の編集・実行は devcontainer 内 tmux に寄せる。

## 2. 接続と再接続

### 2.1. VS Code 接続断後の再接続

Host Mac、Docker Desktop、devcontainer が動作している間は、VS Code の Remote SSH を再接続して同じワークスペースを開ける。`shutdownAction: "none"` により、VS Code の切断だけで devcontainer は停止しない。ただし、再接続によって切断時のコマンドや agent の応答が自動で再実行・再開されるわけではない。

VS Code terminal の persistent session は再接続を補助するが、長時間の build、test、agent 実行の完了を保証しない。これらは tmux 内で実行し、再接続後は次で同じ session に戻る。

```bash
tmux new-session -A -s specdojo
```

Claude Code、Codex、GitHub Copilot CLI の会話履歴はそれぞれの CLI が保存する。進行中の応答が切断された場合は、再接続後に必要に応じて Claude Code は `claude --continue` または `claude --resume`、Codex は `codex resume --last`、Copilot CLI は VS Code の Copilot Chat の Sessions view から `Resume in Terminal` を使って明示的に再開する。VS Code 拡張のチャット履歴の復元は拡張ごとに異なり、進行中の応答の自動再開は前提にしない。

## 3. tmux

tmux の導入、`.tmux.conf`、接続先 Mac の helper、SSH alias は、[[tsd-home-mac-dev-server|初期設定文書]] の 4.11 で設定する。日常の SpecDojo 作業は devcontainer 内の tmux を標準とし、Host Mac 側 tmux は Docker Desktop、Tailscale、Ollama の状態確認用途に留める。

標準セッション名は `specdojo` とする。

```bash
tmux new-session -A -s specdojo
```

`-s specdojo` は session 名を `specdojo` に指定する。`-A` は同名の session があれば attach し、なければ新規作成する。そのため、再接続時も同じコマンドを使える。

既存セッションへ戻る。

```bash
tmux attach -t specdojo
```

セッション一覧を見る。

```bash
tmux ls
```

`specdojo exec run --loop` は tmux 内で実行する。

```bash
tmux new -s specdojo-exec
specdojo exec run --auto --loop --parallel 3
```

VS Code terminal から tmux を使う場合は、VS Code の terminal が閉じても tmux session は残る。Remote SSH の再接続後、devcontainer terminal で `tmux attach -t specdojo` を実行して作業へ戻る。

Windows Terminal または別の Mac の terminal から Host Mac 側 tmux に接続する場合は、まず Host Mac へ SSH 接続してから `host-mac` session を作成または再接続する。

```bash
ssh -t home-mbp
tmux new-session -A -s host-mac
```

切断後も session は Host Mac 上に残る。再接続時も同じ2行を実行する。`home-mbp-tmux` は初期設定文書の 4.11.2 で設定する devcontainer 内 tmux 専用の alias であり、Host Mac 側 tmux には使用しない。

## 4. tmux の利用ユースケース

以下では「ローカル」を接続先の Home MacBook Pro を直接操作する状態、「リモート」を Tailscale 経由で別の端末から接続する状態として区別する。いずれの場合も作業対象の tmux は devcontainer 内の `specdojo` session とし、Host Mac 側の `host-mac` session と混同しない。

tmux を detach するときは、session 内で `Ctrl-b`、続けて `d` を入力する。SSH や VS Code の terminal をそのまま閉じても session は残るが、長時間実行を意図して離席する前には明示的に detach する。複数の端末から同じ session に同時 attach することもできるが、同じ shell と pane を共有するため、通常は先の端末で detach してから引き継ぐ。

### 4.1. リモートから devcontainer 内 tmux に接続し、切断後に再接続する

外出先などのリモート端末から長時間の build、test、`specdojo exec run` を開始し、ネットワーク切断や端末の移動後に同じ作業へ戻るケースである。

1. 接続元端末を Tailscale に接続し、devcontainer 内 tmux 専用 alias で Home MacBook Pro へ入る。

   ```bash
   ssh home-mbp-tmux
   ```

   alias を設定していない場合は、同等の helper を明示して実行する。

   ```bash
   ssh -t home-mbp ~/bin/specdojo-tmux
   ```

2. 初回は helper が devcontainer を起動し、container 内で `tmux new-session -A -s specdojo` を実行する。既存 session がある場合はそのまま attach されるため、必要なコマンドを開始または状態を確認する。

   ```bash
   specdojo exec run --auto --loop --parallel 3
   ```

3. 離席前は `Ctrl-b`、`d` で detach してから SSH を終了する。通信が不意に切れた場合も tmux session とその中のプロセスは devcontainer 内に残る。
4. 再接続後、同じ `ssh home-mbp-tmux` を実行する。helper が既存の `specdojo` session に attach するため、実行中の出力、終了結果、ログを確認できる。進行中だった対話型 agent 応答そのものが自動再開するわけではないため、必要に応じて各 CLI の resume 機能を使う。

### 4.2. ローカルで devcontainer の tmux に接続し、その後リモートから再接続する

Home MacBook Pro の前で作業を開始し、外出後に別端末から同じ session を引き継ぐケースである。ローカルで VS Code を使う場合も、リポジトリを devcontainer として開き、Host Mac の terminal ではなく devcontainer terminal で tmux を起動する。

1. Home MacBook Pro 上で VS Code から対象リポジトリを開き、`Dev Containers: Reopen in Container` を実行する。
2. VS Code の devcontainer terminal で session を作成または attach する。

   ```bash
   tmux new-session -A -s specdojo
   ```

3. build、test、agent 実行などを開始する。リモートへ引き継ぐ前に `Ctrl-b`、`d` で session を detach する。devcontainer の再作成や Docker Desktop の再起動をしない限り、session は残る。
4. リモート端末を Tailscale に接続し、`ssh home-mbp-tmux` を実行する。初期設定文書の 4.11.1 の helper が同じ devcontainer を見つけ、既存の `specdojo` session に attach する。
5. リモート側で作業を終えたら、同様に detach する。Home MacBook Pro に戻った後は、devcontainer terminal で `tmux new-session -A -s specdojo` を実行すれば再び同じ session に戻れる。

### 4.3. リモートからローカルの tmux に接続し、その後 devcontainer 内 tmux に接続する

Docker Desktop、Tailscale、Ollama など Host Mac 側の状態を調べてから、実際の SpecDojo 作業を devcontainer で行うケースである。この経路では Host Mac 側と devcontainer 側で別々の tmux session を使う。

1. リモート端末から Host Mac 側の運用確認用 session へ接続する。

   ```bash
   ssh -t home-mbp
   tmux new-session -A -s host-mac
   ```

2. `host-mac` session で Docker Desktop や Tailscale の状態を確認する。ここでは SpecDojo の編集・test・agent 実行は開始しない。

   ```bash
   docker info
   tailscale status
   ```

3. Host Mac 側の確認が済んだら、`host-mac` session の shell から helper を直接実行する。

   ```bash
   ~/bin/specdojo-tmux
   ```

4. helper は devcontainer を起動済みならその container を使い、停止中なら起動してから `specdojo` session に attach する。以後の編集、test、`specdojo exec run` はこの devcontainer 内 session で行う。これは Host Mac 側の `host-mac` tmux の pane 内に devcontainer 側の `specdojo` tmux を attach する二段構成になる。
5. devcontainer 側の作業を離れるときは、まず内側の `specdojo` session で `Ctrl-b`、`d` を入力して `host-mac` の shell へ戻る。続けて外側の `host-mac` session でも `Ctrl-b`、`d` を入力して detach し、SSH を終了する。SSH が不意に切れた場合も両方の session は残る。

Host Mac 上の `host-mac` と devcontainer 内の `specdojo` は実行場所もファイルシステムも異なる。`host-mac` に attach したまま `tmux attach -t specdojo` を実行しても devcontainer 側の session には到達できないため、必ず `~/bin/specdojo-tmux` を経由する。

## 5. SpecDojo agent 実行

SpecDojo の agent 実行は、必ず devcontainer 内の terminal から行う。外部端末の shell や Host Mac の通常 shell と混在させない。長時間実行は devcontainer 内の tmux session で開始する。

```bash
tmux new-session -A -s specdojo
specdojo exec run --auto --parallel 3
```

agent の責務分担、`pm-members.yaml`、実行コマンド、モデル、認証、権限は次を正本とする。認証状態は devcontainer の named volume に保存し、API key や token をリポジトリや設定ファイルに記載しない。

- [[sysd-agent-settings|エージェント共通設定]]
- [[sysd-opencode-agent-settings|OpenCode エージェント設定]]
- [[sysd-claude-agent-settings|Claude Code エージェント設定]]
- [[sysd-codex-agent-settings|Codex エージェント設定]]
- [[sysd-github-copilot-agent-settings|GitHub Copilot エージェント設定]]
- [[tsd-ollama|Ollama 構成]]

## 6. 運用時のトラブルシュート

### 6.1. tmux helper による devcontainer 起動に失敗する

`ssh home-mbp-tmux` による自動起動が失敗する場合は、接続先 Mac で `devcontainer --version` と `docker info` を確認する。どちらかが失敗する場合は、それぞれ Dev Container CLI の導入または Docker Desktop の起動を先に行う。

通常 terminal では `devcontainer --version` が成功するのに helper では `Dev Container CLI is not installed` と表示される場合は、接続元から次を実行して非対話 SSH の `PATH` を確認する。

```bash
ssh home-mbp 'printf "PATH=%s\\n" "$PATH"; command -v node || true; command -v devcontainer || true'
```

その後、`~/bin/specdojo-tmux` の `node_bin_dir` を接続先 Mac の通常 terminal で確認した Node.js と Dev Container CLI の共通ディレクトリへ変更する。両者が同じディレクトリにない場合は、使用する Node.js 環境の `npm install -g @devcontainers/cli` を実行し直してから確認する。`devcontainer.json was not found` と表示された場合は、`workspace_dir` をリポジトリの配置先に合わせる。

### 6.2. tmux session に戻れない

devcontainer を再作成した場合、コンテナ内の tmux session は消える。VS Code の再接続だけであれば session は残るが、container rebuild / recreate / Docker restart では残らない。

まず session 一覧を確認する。

```bash
tmux ls
```

session がない場合は新しく作る。

```bash
tmux new -s specdojo
```

### 6.3. agent CLI の認証が毎回消える

`.devcontainer/devcontainer.json` の named volume mount が有効か確認する。特に次の volume がない場合、コンテナ再作成時に認証状態が消える。

```text
specdojo-claude
specdojo-claude-state
specdojo-codex
specdojo-copilot
specdojo-opencode
specdojo-gh
```

## 7. 運用上のセキュリティ

API key、SSH 秘密鍵、個人の tailnet 名を tmux pane の scrollback やコマンド履歴へ残さない。devcontainer の named volume に保存される CLI 認証状態を秘密情報として扱う。

Copilot CLI の `--allow-all-tools`、Claude Code の bypass 系権限、OpenCode の `--dangerously-skip-permissions`、Codex の `danger-full-access` は通常運用で使わない。agent の `git push`、破壊的削除、秘密情報読み取りは、個別設定の deny 方針と実行 plan の両方で禁止する。ネットワーク公開、SSH、Host Mac の基盤設定に関するセキュリティ方針は、[[tsd-home-mac-dev-server|自宅 MacBook Pro 開発サーバ技術スタック定義]] の 6 章を正本とする。
