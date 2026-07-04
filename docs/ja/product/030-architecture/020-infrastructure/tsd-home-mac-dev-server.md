---
specdojo:
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

本書は、Host Mac 上で動作する Docker Desktop / devcontainer / Ollama と、外部端末からの VS Code Remote SSH 接続をつなぐ実行基盤の設定を扱う。ローカル LLM 自体のモデル構成は [[tsd-ollama]] を正本とし、SpecDojo agent の責務分担と agent CLI 個別設定は [[sysd-agent-settings]] と子設計を正本とする。

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
  ├─ VS Code Server (Remote SSH が自動管理)
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

| 領域           | 採用技術 / 設定                                     | 方針                                                                                 |
| -------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 常時起動       | Amphetamine                                         | 電源接続中に system sleep を抑止する。display sleep は許可してよい                   |
| 閉域接続       | Tailscale                                           | tailnet 内の MagicDNS 名または Tailscale IP で Mac に到達する                        |
| SSH            | macOS Remote Login                                  | Tailscale SSH 機能ではなく、macOS 標準 sshd を tailnet 経由で使う                    |
| エディタ       | VS Code Remote SSH + Dev Containers                 | SSH 接続先の Mac 上で VS Code Server と devcontainer を起動する                      |
| 作業環境       | `.devcontainer/devcontainer.json`                   | agent CLI、VS Code 拡張、認証用 named volume を定義する                              |
| 端末セッション | tmux                                                | devcontainer 内の長時間実行、切断復帰、ログ確認を安定させる                          |
| SpecDojo 実行  | `specdojo exec run`                                 | devcontainer 内から agent CLI を非対話起動する                                       |
| Agent CLI      | OpenCode / Claude Code / Codex / GitHub Copilot CLI | `pm-members.yaml` の member として起動方法を管理する                                 |
| LLM Serving    | Ollama                                              | [[tsd-ollama]] の起動方式に従い、devcontainer から `host.docker.internal` で接続する |
| 外部公開       | なし                                                | ルータのポート開放、Tailscale Funnel、Tailscale Serve は使わない                     |

Tailscale SSH 機能そのものは、macOS では利用条件が標準の Tailscale アプリ構成と異なる場合がある。そのため本構成では、macOS の Remote Login を有効化し、Tailscale を安全なネットワーク経路として使う。

## 4. セットアップ

以下を上から順に実施する。接続元・接続先の両方が Tailscale に参加してから SSH を設定・確認する。

1. 接続先 Mac を常時稼働の開発サーバとして準備する（4.1〜4.5）。
2. 接続元端末を準備する。Windows は 4.6、Mac は 4.7 だけを実施する。
3. SSH 鍵認証と必要に応じた local forwarding を設定する（4.8）。
4. VS Code Remote SSH から devcontainer を起動する（4.9〜4.10）。
5. devcontainer と tmux の初期設定を確認する（4.9〜4.11）。SpecDojo と tmux の日常運用は [[tsd-home-mac-dev-server-usage|自宅 MacBook Pro 開発サーバ運用ガイド]] に従う。

### 4.1. 接続先 Mac に Tailscale を導入する

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

### 4.2. 接続先 Mac の識別名を設定する

Tailscale の管理画面で、4.1 で参加させた対象 Mac の machine name を `home-mbp` のような短い名前にする。MagicDNS を有効にする。この時点ではまだ SSH 接続を試さない。Remote Login を有効にした後の 4.8 で接続を確認する。

MagicDNS を使えない場合に備え、対象 Mac の Tailscale IP と完全修飾名も控えておく。

```text
<tailscale-ip>
home-mbp.<tailnet-name>.ts.net
```

### 4.3. 接続先 Mac の Remote Login を有効にする

Mac 側で System Settings から Remote Login を有効化する。

```text
System Settings
  → General
  → Sharing
  → Remote Login
  → On
```

`Allow access for` は `Only these users` を選び、開発に使う macOS ユーザーだけを許可する。ディスク全体へのアクセスが必要な運用でなければ、remote users の full disk access は有効化しない。

ここまで完了すると、接続先 Mac の SSH サーバーが待受を開始する。接続元端末側の準備と SSH 接続確認は 4.6〜4.8 で行う。

### 4.4. 接続先 Mac のスリープを抑止する

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

### 4.5. 接続先 Mac のローカル LLM を準備する

ローカル LLM は Ollama を前提とし、設定とモデル管理は [[tsd-ollama]] に従う。

開発サーバ構成での共通方針:

- LLM runtime は launchd / LaunchAgent で起動する
- API は Host Mac 側の `localhost` bind を基本とする
- devcontainer からの利用は `host.docker.internal` に限定する
- 外部端末からの直接利用は必要時だけ SSH local forwarding に限定する
- `opencode.json` や SDK 設定では、実行場所に応じた base URL を使い分ける

devcontainer 内から Ollama を使う例は、devcontainer を開く 4.9〜4.10 で設定する。

### 4.6. 接続元が Windows の場合

Windows から接続する場合に必須なのは、Tailscale、VS Code、Remote - SSH 拡張、Dev Containers 拡張、OpenSSH Client である。Docker Desktop は Windows 側では不要であり、Host Mac 側で起動している Docker Desktop を VS Code Remote SSH 経由で使う。

#### 4.6.1. Tailscale

1. [Tailscale for Windows](https://tailscale.com/download/windows) から Windows 用 installer を取得してインストールする。
2. Tailscale を起動し、接続先 Mac と同じ tailnet に参加するアカウントでサインインする。
3. タスクトレイの Tailscale アイコンが接続済みであることを確認する。
4. PowerShell で tailnet への参加を確認する。

   ```powershell
   tailscale status
   tailscale ip -4
   ```

接続先 Mac が `home-mbp` として表示されない場合は、接続先 Mac 側の Tailscale ログイン状態、MagicDNS、tailnet ACL を確認する。

#### 4.6.2. VS Code

VS Code は [Windows 用 User setup](https://code.visualstudio.com/docs/setup/windows) を使用する。User setup は通常、管理者権限を必要とせず、自動更新にも適する。

1. VS Code User setup をダウンロードして実行する。
2. インストール完了後に PowerShell を開き直す。
3. `code` コマンドが使えることを確認する。

   ```powershell
   code --version
   ```

#### 4.6.3. VS Code 拡張

Windows 側の VS Code に、次の拡張をインストールする。

| 拡張           | Marketplace ID                       | 用途                                 |
| -------------- | ------------------------------------ | ------------------------------------ |
| Remote - SSH   | `ms-vscode-remote.remote-ssh`        | Tailscale 経由で Host Mac に接続する |
| Dev Containers | `ms-vscode-remote.remote-containers` | Host Mac 上の devcontainer を開く    |

VS Code の Extensions 画面からインストールするか、PowerShell で次を実行する。

```powershell
code --install-extension ms-vscode-remote.remote-ssh
code --install-extension ms-vscode-remote.remote-containers
```

この構成の開発・agent 実行は Host Mac 上の devcontainer で行う。Windows 側では PowerShell または Windows Terminal を利用する。

#### 4.6.4. OpenSSH Client

Windows 側では SSH サーバーは不要であり、OpenSSH Client だけを導入する。管理者として PowerShell を起動し、導入状態を確認する。

```powershell
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH.Client*'
```

`State : NotPresent` の場合は、次を実行する。

```powershell
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

導入後、PowerShell を開き直して確認する。

```powershell
ssh -V
```

鍵認証の設定は 4.8.1〜4.8.6 に従う。秘密鍵や passphrase はリポジトリ、VS Code 設定、tmux の scrollback に記録しない。

### 4.7. 接続元が Mac の場合

別の Mac から接続する場合は、接続元 Mac に Tailscale、VS Code、Remote - SSH 拡張、Dev Containers 拡張を入れる。接続元 Mac 側の Docker Desktop は不要であり、Host Mac 側の Docker Desktop を使う。

続けて 4.8 の SSH 設定を行う。

### 4.8. SSH クライアントを設定して接続を確認する

接続元端末で鍵を作成し、接続先 Mac へ公開鍵を登録してから SSH client を設定する。パスワードでの接続確認は不要であり、4.8.3 の鍵限定接続で確認する。

#### 4.8.1. ED25519 鍵を作成する

接続元端末ごとに ED25519 鍵を1組作成する。複数の Windows / Mac から接続する場合も、秘密鍵を端末間でコピーせず、端末ごとに別の鍵を作る。

Windows PowerShell:

```powershell
ssh-keygen -t ed25519 -a 100 -f "$env:USERPROFILE\.ssh\id_ed25519"
```

macOS terminal:

```bash
ssh-keygen -t ed25519 -a 100 -f ~/.ssh/id_ed25519
```

鍵生成時は passphrase を設定する。公開鍵の末尾が `.pub` のファイルだけを接続先 Mac に登録し、秘密鍵 `id_ed25519` は接続元端末から持ち出さない。

#### 4.8.2. 接続先 Mac に公開鍵を登録する

接続先 Mac のローカル console で、Remote Login を許可した macOS ユーザーとして次を実行する。

```bash
install -d -m 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod go-w ~
```

`~/.ssh/authorized_keys` をエディタで開き、接続元端末の公開鍵を1行単位で追記する。

```bash
nano ~/.ssh/authorized_keys
```

登録後、権限を確認する。

```bash
ls -ld ~ ~/.ssh
ls -l ~/.ssh/authorized_keys
```

公開鍵は端末ごとに1行追加する。端末を紛失した場合や不要になった場合は、該当する公開鍵の1行だけを `authorized_keys` から削除する。

#### 4.8.3. 鍵認証を使うように SSH client を設定する

接続元端末の SSH config に、接続先、鍵ファイル、公開鍵認証をまとめて定義する。Mac では `~/.ssh/config`、Windows では `C:\Users\<windows-user>\.ssh\config` を使う。

```ssh-config
Host home-mbp
  HostName home-mbp
  User <mac-login-user>
  ForwardAgent no
  ServerAliveInterval 30
  ServerAliveCountMax 3
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes
  PreferredAuthentications publickey
  PasswordAuthentication no
  KbdInteractiveAuthentication no
```

`HostName` は MagicDNS 名で解決できない場合、4.2 で控えた Tailscale IP または `home-mbp.<tailnet-name>.ts.net` に置き換える。Windows の `~/.ssh/id_ed25519` は `C:\Users\<windows-user>\.ssh\id_ed25519` を指し、Mac では `~/.ssh/id_ed25519` を指す。

別の PowerShell / terminal を開き、既存の SSH セッションを切断せずに鍵認証だけで接続できることを確認する。

```bash
ssh -o PreferredAuthentications=publickey -o PasswordAuthentication=no -o KbdInteractiveAuthentication=no home-mbp
```

`<mac-login-user>@home-mbp's password:` が表示されず、鍵の passphrase 入力後に接続できれば鍵認証への移行は完了である。接続できない場合は、`ssh -vvv home-mbp` で使用鍵と拒否理由を確認し、4.8.2 のユーザー、公開鍵内容、ファイル権限を見直す。

#### 4.8.4. 接続元の SSH agent に秘密鍵を記憶させる（任意）

秘密鍵の passphrase は接続先 Mac のログインパスワードとは別物であり、秘密鍵ファイルを保護するためのものである。passphrase を空にせず、接続元の SSH agent に記憶させる。SSH agent forwarding は有効化せず、4.8.3 の `ForwardAgent no` を維持する。

##### Windows

Windows の OpenSSH `ssh-agent` service は既定で無効な場合がある。初回だけ、管理者として開いた PowerShell で service を自動起動に設定して開始する。

```powershell
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent
Get-Service ssh-agent
```

`Status` が `Running` であることを確認した後、通常の PowerShell で秘密鍵を agent に追加する。初回の追加時だけ秘密鍵の passphrase を入力する。

```powershell
ssh-add "$env:USERPROFILE\.ssh\id_ed25519"
ssh-add -l
```

`ssh-add -l` に鍵の fingerprint が表示されれば、以後の `ssh home-mbp` では passphrase の入力を通常は要求されない。接続元 PC を共有しないこと、画面ロックを有効にすること、秘密鍵ファイルを安全にバックアップすることを前提とする。

##### macOS

macOS では接続元 Mac の SSH agent と Keychain を使う。接続元 Mac の terminal で一度だけ次を実行する。

```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
ssh-add -l
```

同じ接続元 Mac の `~/.ssh/config` にある `Host home-mbp` へ次を追加する。

```ssh-config
  AddKeysToAgent yes
  UseKeychain yes
```

`ssh-add -l` に鍵の fingerprint が表示され、`ssh home-mbp` で接続できることを確認する。Keychain に保存された passphrase の利用には接続元 Mac のログイン状態が必要であるため、接続元 Mac のアカウントと画面ロックを保護する。

agent を利用しても、秘密鍵ファイルを無保護にする必要はない。passphrase を削除する場合は `ssh-keygen -p -f <private-key-path>` で変更できるが、秘密鍵がコピー・窃取された時点で利用可能になるため、本構成では推奨しない。

#### 4.8.5. パスワード認証を無効にする（任意）

パスワード認証を止めるのは、4.8.3 の鍵認証が別 terminal から成功し、接続先 Mac の物理 console にもアクセスできることを確認してからにする。設定を誤ると SSH で復旧できなくなるため、鍵認証が未確認の段階では実施しない。

まず、接続先 Mac の `/etc/ssh/sshd_config` が drop-in 設定を読み込むか確認する。

```bash
sudo grep -nE '^[[:space:]]*Include[[:space:]]+' /etc/ssh/sshd_config
```

`/etc/ssh/sshd_config.d/*` を読み込む `Include` が表示された場合は、次の drop-in を作成する。

```bash
sudo mkdir -p /etc/ssh/sshd_config.d
sudo tee /etc/ssh/sshd_config.d/99-key-only.conf >/dev/null <<'EOF'
PubkeyAuthentication yes
PasswordAuthentication no
KbdInteractiveAuthentication no
EOF
```

`Include` が表示されない場合は、drop-in を作成しても sshd は読み込まない。`/etc/ssh/sshd_config` を直接編集する。このときは、既存の global scope の `PubkeyAuthentication`、`PasswordAuthentication`、`KbdInteractiveAuthentication` を次の値へ変更するか、最初の有効な同名設定より前かつ最初の `Match` 行より前に追加する。同じキーワードは原則として最初に得た値が使われるため、同じ設定をファイル末尾へ重複追加しても無効化できない場合がある。

```text
PubkeyAuthentication yes
PasswordAuthentication no
KbdInteractiveAuthentication no
```

直接編集する場合も、編集前のバックアップを作り、`sudoedit` で編集する。

```bash
sudo cp -p /etc/ssh/sshd_config /etc/ssh/sshd_config.before-key-only
sudoedit /etc/ssh/sshd_config
```

設定後は、sshd の構文と有効値を確認する。`sshd -t` は構文検査だけであり、パスワード認証が実際に無効になったことは `sshd -T` の出力で確認する。

```bash
sudo /usr/sbin/sshd -t
sudo /usr/sbin/sshd -T | grep -E '^(passwordauthentication|kbdinteractiveauthentication|pubkeyauthentication) '
```

出力に含まれる各設定値が、次と一致しなければならない。

```text
passwordauthentication no
kbdinteractiveauthentication no
pubkeyauthentication yes
```

`Match` 条件を使っている場合は、接続ユーザーと Tailscale IP を指定して有効値を確認する。

```bash
sudo /usr/sbin/sshd -T -C user=<mac-login-user>,host=home-mbp,addr=<tailscale-ip> | grep -E '^(passwordauthentication|kbdinteractiveauthentication|pubkeyauthentication) '
```

期待値を確認できてから sshd を再起動する。

```bash
sudo launchctl kickstart -k system/com.openssh.sshd
```

この操作後も、現在の SSH session は閉じずに残す。新しい terminal から 4.8.3 の鍵限定コマンドを再実行して成功を確認する。`Enter passphrase for key ...` は接続元の秘密鍵の passphrase であり、パスワード認証ではない。`<mac-login-user>@home-mbp's password:` が表示される場合は、sshd の有効値が期待どおりでないか、接続先が想定と異なる。`sshd -T` の出力、`ssh -G home-mbp | grep -E '^(hostname|passwordauthentication|kbdinteractiveauthentication) '`、`ssh -vvv home-mbp` で確認する。失敗した場合は Mac の物理 console から `99-key-only.conf` を削除するか、直接編集のバックアップを復元してから、`sudo launchctl kickstart -k system/com.openssh.sshd` で戻す。

#### 4.8.6. ローカル LLM API を接続元端末から使う場合（任意）

外部端末上の CLI から Host Mac の Ollama API を直接使う場合だけ、`Host home-mbp` の設定へ次を追加する。VS Code Remote SSH + devcontainer だけで開発する場合は不要である。

```ssh-config
  LocalForward 11434 127.0.0.1:11434
```

新しく SSH 接続した後、接続元端末から確認する。

```bash
curl http://localhost:11434/v1/models
```

### 4.9. VS Code Remote SSH と Dev Containers

接続元端末に VS Code の Remote - SSH 拡張と Dev Containers 拡張を入れ、`home-mbp` host に接続する。クライアント側に Docker は不要であり、Docker Desktop は Host Mac 上で動かす。

VS Code Server を Host Mac で手動起動・常駐設定する必要はない。`Remote-SSH: Connect to Host...` の初回接続時に、接続元の VS Code が対応する VS Code Server を Mac 側のユーザーディレクトリへ自動導入して起動する。VS Code を更新した場合も、次回接続時に必要な Server 版へ自動更新される。

接続手順:

1. `Remote-SSH: Connect to Host...` で `home-mbp` に接続する。
2. Mac 側のリポジトリディレクトリを開く。
3. `Dev Containers: Reopen in Container` を実行する。
4. VS Code の左下が `Dev Container: specdojo` になっていることを確認する。

推奨ディレクトリ:

```text
~/workspaces/specdojo-workspace/specdojo
~/workspaces/<project-name>
```

> 注意: macOS のプライバシー保護により、SSH の `sshd` 経由では同じ macOS ユーザーでも `~/Documents`、`~/Desktop`、`~/Downloads` の操作が `Operation not permitted` で拒否されることがある。開発用リポジトリと worktree はこれらの保護フォルダに置かず、`~/workspaces` 配下へ置く。SSH の `sshd` へ Full Disk Access を付与する方法はアクセス範囲が広いため、通常運用の解決策にはしない。

VS Code Remote SSH は SSH 設定を利用するため、`~/.ssh/config` の設定が接続時に使われる。devcontainer を開いた後の VS Code terminal はコンテナ内で実行されるため、Host Mac のサービスへは `host.docker.internal` で接続する。

| 実行場所                               | Ollama URL                             |
| -------------------------------------- | -------------------------------------- |
| Mac 側 shell / VS Code remote terminal | `http://localhost:11434/v1`            |
| devcontainer 内                        | `http://host.docker.internal:11434/v1` |
| 接続元端末（local forwarding 使用時）  | `http://localhost:11434/v1`            |

#### 4.9.1. 日常運用への引継ぎ

VS Code 接続断後の復帰、tmux session の維持、SpecDojo と agent CLI の実行は、[[tsd-home-mac-dev-server-usage|自宅 MacBook Pro 開発サーバ運用ガイド]] を参照する。

### 4.10. devcontainer 設定

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

### 4.11. tmux の導入と初期設定

devcontainer 内の tmux は、4.10 の `features.apt-packages` で導入する。devcontainer を開いた後に次を実行し、利用できることを確認する。

```bash
tmux -V
```

推奨 `.tmux.conf` は個人設定として `/home/node/.tmux.conf` に置く。リポジトリへ共通設定として置く場合も、prefix やキーバインドなど個人差が大きい項目は強制しない。

最小例:

```text
set -g history-limit 50000
set -g mouse on
set -g status-interval 5
setw -g mode-keys vi
```

Host Mac 側でも Docker Desktop、Tailscale、Ollama の状態確認に tmux を使う場合は、Homebrew で導入する。

```bash
brew install tmux
```

#### 4.11.1. 接続先 Mac の tmux attach helper

Windows Terminal や別の Mac の terminal から devcontainer 内 tmux へ直接入るため、接続先 Mac に `~/bin/specdojo-tmux` を置く。helper は起動中の `vsc-specdojo` image を持つ container を探し、見つからない場合は `devcontainer up` で devcontainer を起動してから、container 内で `tmux new-session -A` を実行する。

この自動起動には、接続先 Mac に Dev Container CLI が必要である。接続先 Mac の terminal で一度だけインストールして確認する。

```bash
npm install -g @devcontainers/cli
devcontainer --version
```

VS Code の Command Palette から `Dev Containers: Install devcontainer CLI` を実行して導入してもよい。Docker Desktop は helper 実行前に起動済みでなければならない。helper から Docker Desktop の GUI 起動は行わない。

`ssh` の `RemoteCommand` は非対話実行のため、Mac の通常 terminal で読み込まれる `.zshrc` の Node.js バージョン管理ツール設定が反映されないことがある。その場合、`devcontainer` はインストール済みでも helper から見つからない。接続先 Mac の通常 terminal で、Node.js と Dev Container CLI が同じディレクトリにあることを確認する。

```bash
dirname "$(command -v node)"
dirname "$(command -v devcontainer)"
```

Homebrew の Node.js では通常どちらも `/opt/homebrew/bin`（Intel Mac では `/usr/local/bin`）になる。nvm、fnm、mise などを使う場合は、表示された version 固有の共通ディレクトリを次の helper の `node_bin_dir` に設定する。Dev Container CLI はその Node.js 環境の `npm install -g @devcontainers/cli` で導入し、`node_bin_dir` に置かれることを前提とする。`ssh -t` は TTY を割り当てるだけであり、この `PATH` の問題を解決しない。

`~/bin` がない場合は作成する。

```bash
mkdir -p ~/bin
```

`~/bin/specdojo-tmux`:

```bash
#!/usr/bin/env bash
set -euo pipefail

container_workspace_dir="/workspaces/specdojo-workspace/specdojo"
workspace_dir="$HOME$container_workspace_dir"

# Mac の通常 terminal で確認した実際のディレクトリへ置き換える。
# Homebrew の例: node_bin_dir="/opt/homebrew/bin"
# nvm の例: node_bin_dir="$HOME/.nvm/versions/node/v22.0.0/bin"
# mise の例: node_bin_dir="$HOME/.local/share/mise/installs/node/24/bin"
# node と Dev Container CLI は同じ node_bin_dir にあることを前提とする。
node_bin_dir="/absolute/path/to/node/bin"
export PATH="$node_bin_dir:/opt/homebrew/bin:/usr/local/bin:$PATH"

find_container() {
  docker ps --format '{{.Names}}\t{{.Image}}' | awk '$2 ~ /^vsc-specdojo/ {print $1; exit}'
}

if [ ! -f "$workspace_dir/.devcontainer/devcontainer.json" ]; then
  echo "devcontainer.json was not found: $workspace_dir" >&2
  echo "Set workspace_dir to the SpecDojo repository path." >&2
  exit 1
fi

if ! command -v devcontainer >/dev/null 2>&1; then
  echo "Dev Container CLI is not installed. Run: npm install -g @devcontainers/cli" >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker Desktop is not running on the Host Mac." >&2
  exit 1
fi

container_name="$(find_container)"

if [ -z "$container_name" ]; then
  echo "Starting the SpecDojo devcontainer..." >&2
  devcontainer up --workspace-folder "$workspace_dir"
  container_name="$(find_container)"
fi

if [ -z "$container_name" ]; then
  echo "The SpecDojo devcontainer did not start." >&2
  exit 1
fi

exec docker exec -it --detach-keys="ctrl-]" -w "$container_workspace_dir" "$container_name" tmux new-session -A -s specdojo
```

実行権限を付ける。

```bash
chmod +x ~/bin/specdojo-tmux
```

- `container_workspace_dir` は devcontainer 内の `/workspaces/specdojo-workspace/specdojo` を前提にし、`workspace_dir` はそのパスに `$HOME` を付けて Host Mac 側の `~/workspaces/specdojo-workspace/specdojo` としている。
- リポジトリを別の場所に置いた場合は、`container_workspace_dir` を実際のコンテナ内パスに変更し、Host Mac 側のパスが `$HOME$container_workspace_dir` と一致しないときは `workspace_dir` を実際のパスへ直接設定する。
- `node_bin_dir` は、上記の確認結果で Node.js と Dev Container CLI が共通して置かれているディレクトリに変更する。
- `--detach-keys="ctrl-]"` は Docker の標準 detach キーである `Ctrl-P Ctrl-Q` を変更し、container 内の bash や tmux で `Ctrl-P` を1回で使えるようにする。
- Docker から切断する場合は `Ctrl-]` を入力する。tmux session を新規作成する場合は `container_workspace_dir` で開始する。
- 既存 session に attach する場合は、session 内で最後にいたディレクトリを維持する。初回起動や devcontainer 再作成時は image build、Feature 導入、lifecycle command の実行に時間がかかることがある。

helper の作成後は、4.11.2 の手順で terminal から tmux session に接続する。

#### 4.11.2. Windows Terminal / macOS Terminal から tmux へ直接接続する

4.11.1 の helper を作成すると、Windows Terminal、PowerShell、または別の Mac の terminal から同じ tmux session に接続できる。devcontainer が停止している場合は helper が起動を完了してから接続する。

```bash
ssh -t home-mbp ~/bin/specdojo-tmux
```

毎回 command を指定しない場合は、4.8.3 にある SSH config へ専用 alias を追加する。

```ssh-config
Host home-mbp-tmux
  HostName home-mbp
  User <mac-login-user>
  ForwardAgent no
  RequestTTY force
  RemoteCommand ~/bin/specdojo-tmux
```

以後は次で接続する。

```bash
ssh home-mbp-tmux
```

VS Code から接続した場合は、Remote SSH で Mac に入り `Dev Containers: Reopen in Container` を実行した後、VS Code の devcontainer terminal で同じ session に入る。

```bash
tmux new-session -A -s specdojo
```

## 5. 初期セットアップの確認

Mac の再起動後、次の順で確認する。

```bash
tailscale status
ssh <mac-login-user>@home-mbp
```

Mac 側では sleep 抑止状態を確認する。

```bash
pmset -g assertions
```

VS Code からは `Remote-SSH: Connect to Host...` で `home-mbp` に接続し、`Dev Containers: Reopen in Container` 後に devcontainer terminal で `pwd`、`git status`、devcontainer 内から Host Mac の LLM API へ到達できることを確認する。tmux、SpecDojo、agent CLI の運用確認は [[tsd-home-mac-dev-server-usage|自宅 MacBook Pro 開発サーバ運用ガイド]] に従う。

## 6. セキュリティ方針

- ルータで `22`、`11434` をポート開放しない
- Tailscale Funnel / Serve で LLM API を公開しない
- Remote Login は必要な macOS ユーザーだけに許可する
- SSH agent forwarding は無効にする
- FileVault と画面ロックを有効にする
- tailnet ACL で SSH 到達元を絞る
- API key、SSH 秘密鍵、個人の tailnet 名はドキュメントに書かない
- devcontainer の named volume に保存される CLI 認証状態を秘密情報として扱う

## 7. トラブルシュート

### 7.1. MagicDNS 名で SSH できない

まず Tailscale IP で接続できるか確認する。

```bash
ssh <mac-login-user>@<tailscale-ip>
```

IP で接続できる場合は、Tailscale 管理画面の MagicDNS と machine name を確認する。macOS の `host` や `nslookup` は MagicDNS を正しく確認できないことがあるため、`ssh`、`ping`、`tailscale status` で切り分ける。

### 7.2. Mac が sleep して SSH が切れる

Amphetamine の Trigger が有効か、電源接続中か、低バッテリー終了条件に入っていないかを確認する。macOS 側では次のコマンドで sleep 抑止の assertion を見る。

```bash
pmset -g assertions
```

クラムシェル時だけ切れる場合は、closed-display mode の追加設定、電源供給、外部ディスプレイやダミープラグの要否を確認する。

### 7.3. devcontainer が開けない

Mac 側で Docker Desktop が起動していることを確認する。接続元端末ではなく、Remote SSH 先の Mac 上で Docker が動作している必要がある。

VS Code の接続順序は、Remote SSH で Mac に入ってから Dev Containers で reopen する。ローカル端末で直接 devcontainer を開くと、Mac 上の Docker Desktop ではなく手元端末の Docker を使おうとする。

tmux helper による devcontainer の自動起動、または tmux session への再接続が失敗する場合は、[[tsd-home-mac-dev-server-usage|自宅 MacBook Pro 開発サーバ運用ガイド]] の 6 章を参照する。

### 7.4. Windows から SSH できない

PowerShell で `ssh home-mbp` が失敗する場合は、Windows 側の `C:\Users\<windows-user>\.ssh\config` が参照されているか確認する。

Tailscale 側では、Windows 端末と Host Mac の両方が同じ tailnet に online として表示されることを確認する。

### 7.5. Mac から SSH できない

接続元 Mac で `ssh home-mbp` が失敗する場合は、`~/.ssh/config` の `HostName` を Tailscale IP に置き換えて試す。IP で通る場合は MagicDNS または machine name の問題として切り分ける。

### 7.6. LLM API に接続できない

Mac 側で runtime が応答するか確認する。

```bash
curl http://localhost:11434/v1/models
```

Mac 側では応答し、devcontainer では失敗する場合は、devcontainer 内から `host.docker.internal` を使っているかを確認する。

```bash
curl http://host.docker.internal:11434/v1/models
```

接続元端末から直接使う場合だけ、SSH 接続に `LocalForward` が反映されているかを確認する。既存の SSH セッションには設定変更が反映されないため、接続し直す。

### 7.7. SSH で `Documents` などに入れない

`ls ~/Documents`、`ls ~/Desktop`、`ls ~/Downloads` が `Operation not permitted` になる場合は、macOS のプライバシー保護によるアクセス拒否である。接続元端末や SSH 鍵の問題ではない。

開発用のリポジトリは保護フォルダから `~/workspaces` へ移し、VS Code は移動後のパスを開く。

```bash
mkdir -p ~/workspaces
mv ~/Documents/<project-name> ~/workspaces/
```

業務上どうしても保護フォルダへの SSH アクセスが必要な場合だけ、接続先 Mac のローカル画面で `System Settings → Privacy & Security → Full Disk Access` を確認する。ただし `sshd` への許可はリモートセッション全体のアクセス範囲を広げるため、開発用途では `~/workspaces` への配置を優先する。

## 8. 参照

- [[tsd-ollama]]
- [[sysd-agent-settings]]
- [[sysd-opencode-agent-settings]]
- [[sysd-claude-agent-settings]]
- [[sysd-codex-agent-settings]]
- [[sysd-github-copilot-agent-settings]]
- [Tailscale SSH](https://tailscale.com/docs/features/tailscale-ssh)
- [Tailscale MagicDNS](https://tailscale.com/docs/features/magicdns)
- [Apple: Allow a remote computer to access your Mac](https://support.apple.com/guide/mac-help/allow-a-remote-computer-to-access-your-mac-mchlp1066/mac)
- [Amphetamine App Store](https://apps.apple.com/us/app/amphetamine/id937984704)
- [VS Code Remote SSH](https://code.visualstudio.com/docs/remote/ssh)
- [VS Code Terminal persistent sessions](https://code.visualstudio.com/docs/terminal/advanced)
- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
- [VS Code Dev Container CLI](https://code.visualstudio.com/docs/devcontainers/devcontainer-cli)
- [npm folders](https://docs.npmjs.com/cli/v11/configuring-npm/folders)
- [Tailscale for Windows](https://tailscale.com/download/windows)
- [VS Code on Windows](https://code.visualstudio.com/docs/setup/windows)
- [Microsoft: OpenSSH Client for Windows](https://learn.microsoft.com/windows-server/administration/openssh/openssh_install_firstuse)
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli)
- [GitHub Copilot CLI sessions in VS Code](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/connecting-vs-code)
- [Claude Code sessions](https://code.claude.com/docs/en/sessions)
- [Codex CLI features](https://developers.openai.com/codex/cli/features)
