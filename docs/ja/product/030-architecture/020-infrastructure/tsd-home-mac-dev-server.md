---
id: tsd-home-mac-dev-server
type: architecture
status: draft
rulebook: tsd-rulebook
part_of:
  - tsd-index
based_on:
  - tsd-ollama
  - sysd-agent-settings
  - sysd-opencode-agent-settings
  - sysd-claude-agent-settings
  - sysd-codex-agent-settings
  - sysd-github-copilot-agent-settings
---

# 自宅 MacBook Pro 開発サーバ技術スタック定義

MacBook Pro を自宅用の常時起動開発サーバとして利用し、Mac 上の devcontainer を主作業環境にして、ローカル LLM、SSH、VS Code Remote SSH、SpecDojo agent 実行の接続先にするための構成を定義する。本構成は個人または小規模開発用途を対象とし、インターネットへ SSH や LLM API を直接公開しない。

## 1. 位置付け

本書は、Host Mac 上で動作する Docker Desktop / devcontainer / Ollama と、外部端末からの VS Code Remote SSH 接続をつなぐ実行基盤の設定を扱う。ローカル LLM 自体のモデル構成は [tsd-ollama](tsd-ollama.md) を正本とし、SpecDojo agent の責務分担と agent CLI 個別設定は [sysd-agent-settings](../../040-system-design/sysd-agent-settings.md) と子設計を正本とする。

本書では、MacBook Pro を開発サーバとして安定稼働させ、リモート端末から devcontainer 内の SpecDojo CLI と agent CLI を安全に使うための周辺設定だけを定義する。

対象範囲:

- MacBook Pro の常時起動設定
- Tailscale tailnet 経由の SSH 接続
- VS Code Remote SSH と Dev Containers によるリモート開発接続
- tmux による devcontainer 内の長時間実行セッション維持
- devcontainer 内からの `specdojo exec run`
- devcontainer 内の OpenCode / Claude Code / Codex / GitHub Copilot CLI 利用
- Ollama API への安全な到達方法

対象外:

- 本番サーバとしての可用性設計
- グローバル IP、ルータのポート開放、Tailscale Funnel による公開
- API key、SSH 秘密鍵、個人の tailnet 名などの機密値

## 2. 全体構成

```text
Developer device
  └─ VS Code UI
       ↓ Remote SSH over Tailscale

Tailscale tailnet
       ↓ MagicDNS / Tailscale IP

Home MacBook Pro
  ├─ macOS Remote Login (sshd)
  ├─ VS Code Server
  ├─ Docker Desktop
  ├─ devcontainer
  │  ├─ specdojo CLI
  │  ├─ opencode / claude / codex / copilot
  │  ├─ tmux
  │  └─ VS Code extensions
  ├─ Ollama      : 127.0.0.1:11434 or host.docker.internal:11434
  └─ Amphetamine : sleep 抑止
```

開発コマンドは外部端末ではなく Mac 上の devcontainer 内で実行する。外部端末は VS Code の UI としてのみ使い、SpecDojo CLI、agent CLI、Git、Node.js、テスト実行は devcontainer 内に閉じる。

LLM API は原則として Host Mac の `localhost` に閉じる。devcontainer からは Docker Desktop が提供する `host.docker.internal` で Host Mac の Ollama に接続する。外部端末から直接 `11434` を叩く必要はなく、外部端末上のツールから LLM API を使う場合だけ SSH local forwarding を追加する。

## 3. 採用設定

| 領域           | 採用技術 / 設定                                     | 方針                                                                                              |
| -------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 常時起動       | Amphetamine                                         | 電源接続中に system sleep を抑止する。display sleep は許可してよい                                |
| 閉域接続       | Tailscale                                           | tailnet 内の MagicDNS 名または Tailscale IP で Mac に到達する                                     |
| SSH            | macOS Remote Login                                  | Tailscale SSH 機能ではなく、macOS 標準 sshd を tailnet 経由で使う                                 |
| エディタ       | VS Code Remote SSH + Dev Containers                 | SSH 接続先の Mac 上で VS Code Server と devcontainer を起動する                                   |
| 作業環境       | `.devcontainer/devcontainer.json`                   | agent CLI、VS Code 拡張、認証用 named volume を定義する                                           |
| 端末セッション | tmux                                                | devcontainer 内の長時間実行、切断復帰、ログ確認を安定させる                                       |
| SpecDojo 実行  | `specdojo exec run`                                 | devcontainer 内から agent CLI を非対話起動する                                                    |
| Agent CLI      | OpenCode / Claude Code / Codex / GitHub Copilot CLI | `pm-members.yaml` の member として起動方法を管理する                                              |
| LLM Serving    | Ollama                                              | [tsd-ollama](tsd-ollama.md) の起動方式に従い、devcontainer から `host.docker.internal` で接続する |
| 外部公開       | なし                                                | ルータのポート開放、Tailscale Funnel、Tailscale Serve は使わない                                  |

Tailscale SSH 機能そのものは、macOS では利用条件が標準の Tailscale アプリ構成と異なる場合がある。そのため本構成では、macOS の Remote Login を有効化し、Tailscale を安全なネットワーク経路として使う。

## 4. セットアップ

### 4.1. Mac の識別名

Tailscale の管理画面で対象 Mac の machine name を `home-mbp` のような短い名前にする。MagicDNS が有効であれば、接続元端末から次の形式で到達できる。

```bash
ssh <mac-login-user>@home-mbp
```

名前解決できない端末では、Tailscale IP または MagicDNS の完全修飾名を使う。

```bash
ssh <mac-login-user>@<tailscale-ip>
ssh <mac-login-user>@home-mbp.<tailnet-name>.ts.net
```

### 4.2. Tailscale

Tailscale は Homebrew cask の `tailscale-app` で macOS 版の Standalone variant を導入する。Mac App Store 版は、Homebrew cask を導入できない場合や、組織の配布方針として App Store 管理が必要な場合だけ選ぶ。Standalone variant と Mac App Store 版を同じ Mac に同時導入しない。

Homebrew の `tailscale` formula は CLI / daemon 用であり、本構成の標準インストール手順では使わない。

Mac 側のインストール:

1. Homebrew が未導入の場合は、先に Homebrew を導入する。
2. Mac 側で Tailscale app を Homebrew cask からインストールする。

   ```bash
   brew install --cask tailscale-app
   ```

3. `Tailscale.app` を起動する。

   ```bash
   open -a Tailscale
   ```

4. macOS から VPN / System Extension の許可を求められた場合は許可する。
5. Tailscaleのメニューバーアイコンに赤い「!」マークが出て、メニューに`System Extension Approval Required`が出た場合はmacの再起動を試す。
6. Tailscale にサインインし、対象 tailnet に参加する。
7. Tailscale をログイン時に起動する設定にする。

MacBook Pro と接続元端末の両方を同じ tailnet に参加させる。接続元端末にも Tailscale を入れ、同じアカウントまたは許可済みユーザーでサインインする。Mac 側では再起動後も tailnet に戻ることを確認する。

確認:

```bash
tailscale status
tailscale ip -4
```

tailnet ACL を使う場合は、MacBook Pro の SSH 先 `22/tcp` を自分のユーザーまたは管理端末だけに許可する。ローカル LLM の `11434` は ACL で開けるのではなく、SSH local forwarding で使う。

### 4.3. macOS Remote Login

Mac 側で System Settings から Remote Login を有効化する。

```text
System Settings
  → General
  → Sharing
  → Remote Login
  → On
```

`Allow access for` は `Only these users` を選び、開発に使う macOS ユーザーだけを許可する。ディスク全体へのアクセスが必要な運用でなければ、remote users の full disk access は有効化しない。

接続元端末から疎通確認する。

```bash
ssh <mac-login-user>@home-mbp
```

### 4.4. SSH クライアント設定

接続元端末の `~/.ssh/config` に、開発用 host を定義する。

```sshconfig
Host home-mbp
  HostName home-mbp
  User <mac-login-user>
  ForwardAgent no
  ServerAliveInterval 30
  ServerAliveCountMax 3
```

`HostName` は MagicDNS 名で解決できない場合、Tailscale IP または `home-mbp.<tailnet-name>.ts.net` に置き換える。

外部端末上の CLI から Host Mac の LLM API を直接使う場合だけ、次の local forwarding を追加する。VS Code Remote SSH + devcontainer だけで開発する場合は不要である。

```sshconfig
  LocalForward 11434 127.0.0.1:11434
```

local forwarding を使う場合は、SSH 接続後に接続元端末から確認する。

```bash
curl http://localhost:11434/v1/models
```

VS Code Remote SSH + devcontainer だけで開発する場合、接続元端末向けの `LocalForward` は不要である。外部端末上の CLI から Ollama API を直接使う場合だけ追加する。

### 4.5. Windows から接続する場合

Windows から接続する場合は、Windows 側に Tailscale、VS Code、Remote - SSH 拡張、Dev Containers 拡張を入れる。Docker Desktop は Windows 側では不要であり、Host Mac 側で起動している Docker Desktop を VS Code Remote SSH 経由で使う。

Windows の SSH config は次のパスに置く。

```text
C:\Users\<windows-user>\.ssh\config
```

設定例:

```sshconfig
Host home-mbp
  HostName home-mbp
  User <mac-login-user>
  ForwardAgent no
  ServerAliveInterval 30
  ServerAliveCountMax 3
```

PowerShell から疎通確認する。

```powershell
ssh home-mbp
```

VS Code では次の順で開く。

1. `Remote-SSH: Connect to Host...` で `home-mbp` を選ぶ。
2. Mac 側のリポジトリを開く。
3. `Dev Containers: Reopen in Container` を実行する。
4. terminal が `/workspaces/specdojo-workspace/specdojo` を指していることを確認する。

Windows 側で Git Bash / WSL / PowerShell を混在させる場合でも、VS Code Remote SSH が参照する SSH config は Windows ユーザーの `.ssh/config` に揃える。WSL 側の `~/.ssh/config` は、WSL 内から直接 `ssh home-mbp` する場合だけ使う。

### 4.6. Mac から接続する場合

別の Mac から接続する場合は、接続元 Mac に Tailscale、VS Code、Remote - SSH 拡張、Dev Containers 拡張を入れる。接続元 Mac 側の Docker Desktop は不要であり、Host Mac 側の Docker Desktop を使う。

Mac の SSH config は次のパスに置く。

```text
~/.ssh/config
```

設定例:

```sshconfig
Host home-mbp
  HostName home-mbp
  User <mac-login-user>
  ForwardAgent no
  ServerAliveInterval 30
  ServerAliveCountMax 3
```

terminal から疎通確認する。

```bash
ssh home-mbp
```

VS Code では Windows と同じく、`Remote-SSH: Connect to Host...` で `home-mbp` に接続し、Mac 側のリポジトリを開いてから `Dev Containers: Reopen in Container` を実行する。

### 4.7. VS Code Remote SSH と Dev Containers

接続元端末に VS Code の Remote - SSH 拡張と Dev Containers 拡張を入れ、`home-mbp` host に接続する。クライアント側に Docker は不要であり、Docker Desktop は Host Mac 上で動かす。

接続手順:

1. `Remote-SSH: Connect to Host...` で `home-mbp` に接続する。
2. Mac 側のリポジトリディレクトリを開く。
3. `Dev Containers: Reopen in Container` を実行する。
4. VS Code の左下が `Dev Container: specdojo` になっていることを確認する。

推奨ディレクトリ:

```text
~/workspaces/specdojo
~/workspaces/<project-name>
```

VS Code Remote SSH は SSH 設定を利用するため、`~/.ssh/config` の設定が接続時に使われる。devcontainer を開いた後の VS Code terminal はコンテナ内で実行されるため、Host Mac のサービスへは `host.docker.internal` で接続する。

| 実行場所                               | Ollama URL                             |
| -------------------------------------- | -------------------------------------- |
| Mac 側 shell / VS Code remote terminal | `http://localhost:11434/v1`            |
| devcontainer 内                        | `http://host.docker.internal:11434/v1` |
| 接続元端末（local forwarding 使用時）  | `http://localhost:11434/v1`            |

### 4.8. devcontainer 設定

本リポジトリの `.devcontainer/devcontainer.json` を devcontainer 設定の正本とする。現在の構成では、次を devcontainer 内に用意する。

| 設定                               | 内容                                                                                     | 用途                                                  |
| ---------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `remoteUser`                       | `node`                                                                                   | agent CLI と開発コマンドの実行ユーザー                |
| `workspaceMount`                   | `source=${localWorkspaceFolder}/..`                                                      | worktree を含む親ディレクトリをコンテナへ bind mount  |
| `shutdownAction`                   | `none`                                                                                   | VS Code 切断時もコンテナを即停止しない                |
| `features.copilot-cli`             | GitHub Copilot CLI                                                                       | `copilot` コマンドを devcontainer 内に用意            |
| `features.claude-code`             | Claude Code                                                                              | `claude` コマンドを devcontainer 内に用意             |
| `features.apt-packages`            | `tmux` などの補助 CLI                                                                    | 長時間実行、ログ確認、shell 整備                      |
| `Dockerfile`                       | `@openai/codex` / `opencode-ai` を npm global install                                    | `codex` / `opencode` コマンドを devcontainer 内に用意 |
| `mounts`                           | `.claude` / `.codex` / `.copilot` / `.config/opencode` / `.config/gh` を named volume 化 | CLI 認証状態をコンテナ再作成後も保持                  |
| `containerEnv`                     | `OLLAMA_BASE_URL` / `LOCAL_OPENAI_BASE_URL`                                              | devcontainer から Host Mac の LLM API へ接続          |
| `customizations.vscode.extensions` | Claude Code / ChatGPT / GitHub Copilot / GitHub Copilot Chat 等                          | VS Code 側の補助機能                                  |

認証情報は `.devcontainer/devcontainer.json` へ書かず、各 CLI のログイン結果を named volume に保持する。API key を使う場合も、個人の shell profile、1回限りの export、または Docker / VS Code の secret 注入に留め、リポジトリへ保存しない。

ローカル LLM は Ollama を前提とし、`OLLAMA_BASE_URL` と `LOCAL_OPENAI_BASE_URL` は Host Mac 側 Ollama を参照する。

```jsonc
{
  "containerEnv": {
    "OLLAMA_BASE_URL": "http://host.docker.internal:11434",
    "LOCAL_OPENAI_BASE_URL": "http://host.docker.internal:11434/v1",
  },
}
```

### 4.9. tmux

tmux は devcontainer 内で起動し、`specdojo exec run --loop`、LLM API のログ確認、長時間の build / test を切断に強くするために使う。Host Mac 側 shell で tmux を使うこともできるが、SpecDojo 作業の標準は devcontainer 内 tmux とする。

devcontainer 内で確認する。

```bash
tmux -V
```

標準セッション名は `specdojo` とする。

```bash
tmux new -s specdojo
```

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

推奨 `.tmux.conf` は個人設定として `/home/node/.tmux.conf` に置く。リポジトリへ共通設定として置く場合も、prefix やキーバインドなど個人差が大きい項目は強制しない。

最小例:

```tmux
set -g history-limit 50000
set -g mouse on
set -g status-interval 5
setw -g mode-keys vi
```

VS Code terminal から tmux を使う場合は、VS Code の terminal が閉じても tmux session は残る。Remote SSH の再接続後、devcontainer terminal で `tmux attach -t specdojo` を実行して作業へ戻る。

Host Mac 側の通常 shell でも tmux を使う場合は、Homebrew で入れる。

```bash
brew install tmux
```

Host Mac 側 tmux は Docker Desktop、Tailscale、Ollama のログ確認用途に留め、SpecDojo の編集・実行は devcontainer 内 tmux に寄せる。

### 4.10. Amphetamine

Amphetamine は Mac App Store から導入する。Home MacBook Pro の sleep 抑止用途では、アプリ本体だけを使い、追加の常駐スクリプトや非公式配布物は初期構成に含めない。

インストール:

1. Mac 側で [Amphetamine App Store](https://apps.apple.com/us/app/amphetamine/id937984704) を開く。
2. Amphetamine をインストールする。
3. `Applications` から Amphetamine を起動する。
4. メニューバーに Amphetamine が表示されることを確認する。

Amphetamine はログイン時に起動し、MacBook Pro が電源接続中の間だけ system sleep を抑止する設定にする。

推奨設定:

- `Launch at Login` を有効にする
- `Power Adapter Connected` を条件にした Trigger を作る
- session 中は system sleep を抑止する
- display sleep は許可する
- 低バッテリー時には session を終了する

クラムシェル運用をする場合は、Apple Silicon Mac の closed-display mode で Amphetamine の追加スクリプトや認証が必要になることがある。初期運用では、電源接続、十分な排熱、画面を閉じた状態での SSH 維持を短時間で確認してから常用する。

### 4.11. ローカル LLM

ローカル LLM は Ollama を前提とし、設定とモデル管理は [tsd-ollama](tsd-ollama.md) に従う。

開発サーバ構成での共通方針:

- LLM runtime は launchd / LaunchAgent で起動する
- API は Host Mac 側の `localhost` bind を基本とする
- devcontainer からの利用は `host.docker.internal` に限定する
- 外部端末からの直接利用は必要時だけ SSH local forwarding に限定する
- `opencode.json` や SDK 設定では、実行場所に応じた base URL を使い分ける

devcontainer 内から Ollama を使う例:

```bash
export OPENAI_BASE_URL=http://host.docker.internal:11434/v1
export OPENAI_API_KEY=not-needed
```

## 5. SpecDojo agent 実行

SpecDojo の agent 実行は、必ず devcontainer 内の terminal から行う。外部端末の shell、Mac 側の通常 shell、devcontainer 内 shell が混在すると、認証ストア、Node.js、CLI バージョン、Git 設定がずれやすい。

基本実行:

```bash
tmux new -s specdojo-exec
specdojo exec run --auto --parallel 3
specdojo exec run --auto --loop --parallel 3
specdojo exec run --by opencode-edit-agent
```

`specdojo exec run --auto --loop` のような長時間実行は tmux 内で起動する。`pm-members.yaml` の `command` は、devcontainer 内で実行できるコマンドだけを指定する。plan は `specdojo exec run` から stdin で渡されるため、command へ plan 本文を埋め込まない。

### 5.1. Agent CLI の認証

各 CLI は devcontainer 内でログインし、認証状態を named volume に保持する。

| CLI                | 初回確認             | 認証状態の保存先                                   | 用途                      |
| ------------------ | -------------------- | -------------------------------------------------- | ------------------------- |
| OpenCode           | `opencode --version` | `/home/node/.config/opencode`                      | ローカル LLM agent        |
| Claude Code        | `claude --version`   | `/home/node/.claude` と `/home/node/.claude-state` | Claude agent              |
| Codex              | `codex --version`    | `/home/node/.codex`                                | Codex agent               |
| GitHub Copilot CLI | `copilot --version`  | `/home/node/.copilot`                              | Copilot CLI agent         |
| GitHub CLI         | `gh auth status`     | `/home/node/.config/gh`                            | Copilot / GitHub 操作補助 |

API key や token はリポジトリ、`.devcontainer/devcontainer.json`、`pm-members.yaml` に書かない。

### 5.2. `pm-members.yaml` の配置方針

OpenCode / Claude Code / Codex の member は、それぞれの SYSD に従う。devcontainer 前提では、command の実行場所が devcontainer 内であることだけを追加前提にする。

例:

```yaml
members:
  - nickname: opencode-edit-agent
    type: agent
    mode: edit
    capabilities: [web_search]
    proficiency: normal
    priority: 4
    command: 'opencode run --agent opencode-edit-agent'
    scheduler_strategy: critical-first

  - nickname: claude-edit-agent
    type: agent
    mode: edit
    capabilities: [web_search]
    proficiency: normal
    priority: 3
    command: 'claude -p --agent claude-edit-agent'
    scheduler_strategy: critical-first

  - nickname: codex-edit-agent
    type: agent
    mode: edit
    capabilities: [web_search]
    proficiency: normal
    priority: 2
    command: 'codex exec --ephemeral --sandbox workspace-write --model gpt-5.4-mini -c approval_policy="never" -c model_reasoning_effort="medium"'
    scheduler_strategy: critical-first
```

優先順位は、クラウドモデルを主系にするか、ローカル LLM を主系にするかで調整する。ローカル LLM を節約・オフライン寄りの主系にする場合は OpenCode の priority を小さくし、品質優先の場合は Codex / Claude / Copilot の priority を小さくする。

### 5.3. GitHub Copilot CLI を SpecDojo から使う場合

GitHub Copilot CLI の agent 定義、custom instructions、モデル、権限、`pm-members.yaml` の command は [sysd-github-copilot-agent-settings](../../040-system-design/sysd-github-copilot-agent-settings.md) を正本とする。

SpecDojo から使う場合は、`pm-members.yaml` の `command` に `copilot -p --agent <name>` を直接定義する。plan 本文は `specdojo exec run` から stdin で渡されるため、command へ plan 本文を埋め込まない。非対話実行では `--no-ask-user` を指定し、必要な権限は `--allow-tool` / `--deny-tool` で最小化する。

設定例:

```yaml
members:
  - nickname: copilot-edit-agent
    type: agent
    mode: edit
    capabilities: [web_search]
    proficiency: normal
    priority: 4
    command: 'copilot -p --agent copilot-edit-agent --model claude-sonnet-4.6 --reasoning-effort medium -s --no-ask-user --allow-tool="read,write,shell(npm:*),shell(test:*),shell(git status),shell(git diff),shell(git ls-files),shell(rg:*),url(docs.github.com),url(github.com)" --deny-tool="read(.env),read(secrets/*),shell(git push),shell(git reset --hard),shell(git clean),shell(rm:*)"'
    scheduler_strategy: critical-first
```

Copilot CLI はファイル変更や shell 実行を行えるため、`--allow-all`、`--allow-all-tools`、`--allow-all-paths`、`--yolo` は通常運用では使わない。GitHub.com 上で PR 作成や push まで行わせる運用も、SpecDojo の通常実行では対象外にし、必要な場合は人間が明示的に手動実行する。

### 5.4. 導入確認

devcontainer 内で次を確認する。

```bash
pwd
git status --short
specdojo --version
opencode --version
claude --version
codex --version
copilot --version
tmux -V
curl http://host.docker.internal:11434/v1/models
```

Ollama が応答することを確認する。

## 6. 運用確認

Mac の再起動後、次の順で確認する。

```bash
tailscale status
ssh <mac-login-user>@home-mbp
```

Mac 側では sleep 抑止状態を確認する。

```bash
pmset -g assertions
```

VS Code からは `Remote-SSH: Connect to Host...` で `home-mbp` に接続し、`Dev Containers: Reopen in Container` 後に devcontainer terminal で `pwd`、`git status`、`specdojo --version`、agent CLI の version、`tmux -V` を確認する。

## 7. セキュリティ方針

- ルータで `22`、`11434` をポート開放しない
- Tailscale Funnel / Serve で LLM API を公開しない
- Remote Login は必要な macOS ユーザーだけに許可する
- SSH agent forwarding は無効にする
- FileVault と画面ロックを有効にする
- tailnet ACL で SSH 到達元を絞る
- API key、SSH 秘密鍵、個人の tailnet 名はドキュメントに書かない
- devcontainer の named volume に保存される CLI 認証状態を秘密情報として扱う
- tmux pane の scrollback に機密値を残さない
- Copilot CLI の `--allow-all-tools`、Claude Code の bypass 系権限、OpenCode の `--dangerously-skip-permissions`、Codex の `danger-full-access` は通常運用で使わない
- `git push`、破壊的削除、秘密情報読み取りは agent の deny 方針と plan の両方で禁止する

## 8. トラブルシュート

### 8.1. MagicDNS 名で SSH できない

まず Tailscale IP で接続できるか確認する。

```bash
ssh <mac-login-user>@<tailscale-ip>
```

IP で接続できる場合は、Tailscale 管理画面の MagicDNS と machine name を確認する。macOS の `host` や `nslookup` は MagicDNS を正しく確認できないことがあるため、`ssh`、`ping`、`tailscale status` で切り分ける。

### 8.2. Mac が sleep して SSH が切れる

Amphetamine の Trigger が有効か、電源接続中か、低バッテリー終了条件に入っていないかを確認する。macOS 側では次のコマンドで sleep 抑止の assertion を見る。

```bash
pmset -g assertions
```

クラムシェル時だけ切れる場合は、closed-display mode の追加設定、電源供給、外部ディスプレイやダミープラグの要否を確認する。

### 8.3. devcontainer が開けない

Mac 側で Docker Desktop が起動していることを確認する。接続元端末ではなく、Remote SSH 先の Mac 上で Docker が動作している必要がある。

VS Code の接続順序は、Remote SSH で Mac に入ってから Dev Containers で reopen する。ローカル端末で直接 devcontainer を開くと、Mac 上の Docker Desktop ではなく手元端末の Docker を使おうとする。

### 8.4. Windows から SSH できない

PowerShell で `ssh home-mbp` が失敗する場合は、Windows 側の `C:\Users\<windows-user>\.ssh\config` が参照されているか確認する。WSL の `~/.ssh/config` だけを更新しても、Windows 版 VS Code の Remote SSH には反映されない。

Tailscale 側では、Windows 端末と Host Mac の両方が同じ tailnet に online として表示されることを確認する。

### 8.5. Mac から SSH できない

接続元 Mac で `ssh home-mbp` が失敗する場合は、`~/.ssh/config` の `HostName` を Tailscale IP に置き換えて試す。IP で通る場合は MagicDNS または machine name の問題として切り分ける。

### 8.6. tmux session に戻れない

devcontainer を再作成した場合、コンテナ内の tmux session は消える。VS Code の再接続だけであれば session は残るが、container rebuild / recreate / Docker restart では残らない。

まず session 一覧を確認する。

```bash
tmux ls
```

session がない場合は新しく作る。

```bash
tmux new -s specdojo
```

### 8.7. agent CLI の認証が毎回消える

`.devcontainer/devcontainer.json` の named volume mount が有効か確認する。特に次の volume がない場合、コンテナ再作成時に認証状態が消える。

```text
specdojo-claude
specdojo-claude-state
specdojo-codex
specdojo-copilot
specdojo-opencode
specdojo-gh
```

### 8.8. LLM API に接続できない

Mac 側で runtime が応答するか確認する。

```bash
curl http://localhost:11434/v1/models
```

Mac 側では応答し、devcontainer では失敗する場合は、devcontainer 内から `host.docker.internal` を使っているかを確認する。

```bash
curl http://host.docker.internal:11434/v1/models
```

接続元端末から直接使う場合だけ、SSH 接続に `LocalForward` が反映されているかを確認する。既存の SSH セッションには設定変更が反映されないため、接続し直す。

## 9. 参照

- [tsd-ollama](tsd-ollama.md)
- [sysd-agent-settings](../../040-system-design/sysd-agent-settings.md)
- [sysd-opencode-agent-settings](../../040-system-design/sysd-opencode-agent-settings.md)
- [sysd-claude-agent-settings](../../040-system-design/sysd-claude-agent-settings.md)
- [sysd-codex-agent-settings](../../040-system-design/sysd-codex-agent-settings.md)
- [sysd-github-copilot-agent-settings](../../040-system-design/sysd-github-copilot-agent-settings.md)
- [Tailscale SSH](https://tailscale.com/docs/features/tailscale-ssh)
- [Tailscale MagicDNS](https://tailscale.com/docs/features/magicdns)
- [Apple: Allow a remote computer to access your Mac](https://support.apple.com/guide/mac-help/allow-a-remote-computer-to-access-your-mac-mchlp1066/mac)
- [Amphetamine App Store](https://apps.apple.com/us/app/amphetamine/id937984704)
- [VS Code Remote SSH](https://code.visualstudio.com/docs/remote/ssh)
- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)
