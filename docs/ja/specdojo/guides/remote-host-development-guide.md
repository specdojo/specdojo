---
specdojo:
  id: specdojo:remote-host-development-guide
  type: guide
  status: draft
---

# 常時稼働ホスト運用ガイド

Remote Host Development Guide

agent の実行を止めずに開発を続けるため、常時稼働するホストへリモート接続して作業する構成例を示します。この文書は特定の製品構成を推奨するものではなく、**構成例**です。

**対象読者**

- `routine` の定期実行や長時間の `exec run` を、作業端末の状態に依存せず継続したい開発者

**この文書で分かること**

- なぜ常時稼働ホストが要るか、どの部分がどの機能に対応するか、切断と再接続の扱い

**次に読む文書**

- 定期実行の設定は [routine運用ガイド](routine-operation-guide.md)、agent の実行設定は [exec設定ガイド](exec-config-guide.md) を参照してください。

## 1. なぜ常時稼働ホストが要るか

SpecDojo は自律実行を前提とします。次の 2 つが作業端末の状態に依存します。

| 機能                             | 依存                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| `routine`（`routine run --due`） | cron などの定期実行。ホストが動いていないと起動しない        |
| `exec run`                       | 1 回あたり数分から数十分。完了前に端末が切断されると中断する |

ノート PC で作業する場合、蓋を閉じる、スリープする、移動する、といった操作で実行が止まります。作業端末とは別に、**動き続けるホストで実行する**構成にすると、この依存が切れます。

`exec run --worktree` は worktree を保持するため、中断しても `--resume` で再開できます。ただし再開の操作は人が行う必要があり、夜間の `routine` では翌朝まで止まります。

## 2. 構成の要素

次の 4 つを組み合わせます。いずれも SpecDojo の機能ではなく、一般的なツールです。

| 要素                 | 役割                       | 代替                                           |
| -------------------- | -------------------------- | ---------------------------------------------- |
| 常時稼働ホスト       | 実行の場所                 | 手元のデスクトップ、自宅サーバ、クラウドの VM  |
| ネットワーク到達手段 | 外出先からホストへ接続する | Tailscale、WireGuard、VPN、ポート開放 + 鍵認証 |
| 端末多重化           | 切断しても shell を保つ    | tmux、GNU Screen、Zellij                       |
| 実行環境             | 依存とツールを固定する     | devcontainer、ローカルの Node.js 環境          |

この文書では Tailscale + SSH + tmux + devcontainer の組み合わせを例にしますが、役割が満たせれば置き換えて構いません。

### 2.1. Dev Container を生成する（任意）

利用リポジトリに `.devcontainer/` がない場合は、指定した provider の CLI を含む最小構成を生成できます。まず dry-run で対象を確認します。

```bash
npx specdojo devcontainer scaffold --provider claude,codex --preset recommended --dry-run
npx specdojo devcontainer scaffold --provider claude,codex --preset recommended
```

用途に合わせて、provider とは別に次の preset を選びます。

| preset        | 内容                                                                                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `minimal`     | 選んだ provider の CLI と SpecDojo の動作に必要な最小構成。preset を省略した場合と同じ。                                                             |
| `recommended` | `minimal` に GitHub CLI（`gh`）、端末版 Emacs と Vim、tmux、SpecDojo の文書作業向け VS Code 拡張・設定を追加する。                                   |
| `full`        | `recommended` に ripgrep、fd、fzf、yq、shellcheck、shfmt、Ollama 接続、cron を追加する。fd は `fd-find` package から `fd` コマンドとして利用できる。 |

`recommended` / `full` のエディタ設定は既存設定を上書きしません。VS Code 拡張は Git Graph、markdownlint、YAML、Prettier、remark、Markdown All in One、Code Spell Checker、EditorConfig、Error Lens、Even Better TOML で、選択した provider の拡張もその provider の分だけ追加します。Markdown と YAML は保存時に Prettier で整形し、主要な SpecDojo YAML を `docs/specdojo/schemas/v1/` の schema へ関連付けます。同じ拡張は `.vscode/extensions.json` の recommendation にも追加されます。

既存の `.devcontainer/` は通常実行では上書きしません。置き換える場合だけ `--force` を指定します。生成設定は provider の設定ディレクトリを名前付きボリュームへ保存し、ホストの認証情報・秘密鍵・`.env` は既定でマウントしません。GitHub へのログインは自動では行わないため、利用者が必要なときだけコンテナ内で `gh auth login` を実行します。認証は同じリポジトリのコンテナを作り直しても名前付き volume に残りますが、同じ利用者で動く agent からも見えます。このため配布する agent 権限では `git push` と `gh` の書き込みを拒否します。pipeline executor・review executor・reporter は読み取りを含む全 `gh` を拒否し、対話型オーケストレーターは役割別設定を持てる Claude Code と OpenCode でだけ `gh pr view`・`gh run view` などの読み取りを許可します。Codex と Antigravity は権限が役割共通のため全 `gh` を拒否します。preset に個別の `--ollama`・`--cron`・`--tmux`・`--editor` を加えることもできます。本書の構成図のようにホスト側の tmux でコンテナ自体を包む場合、tmux を含めない `minimal` も選べます。

生成する `devcontainer.json` は、利用リポジトリ単体ではなく、その親ディレクトリをホスト側と同じ名前の `/workspaces/<親名>` へマウントします。例えば `app1-workspace/app1-specdojo` の作業ディレクトリは `/workspaces/app1-workspace/app1-specdojo` です。別リポジトリ構成では `repos` の参照先（例: `../app1`）と `worktree_base`（例: `../app1-specdojo-worktrees`）が利用リポジトリの外にあるためです。これらの Git リポジトリと worktree は `safe.directory` の対象になります。一方、同じ親ディレクトリに置いたその他のファイルもコンテナから見えるため、秘密情報などコンテナへ公開しないファイルは別の場所へ置いてください。

親名に空白や `/` などがある場合は scaffold が停止するため、`--workspace-name <name>` で英数字・`.`・`_`・`-` だけの名前を指定します。また、コンテナ内で作成した Git worktree は絶対パスを記録します。ホスト側の親ディレクトリ名を変えて `.devcontainer/` を作り直す場合は、`--workspace-name` に以前の名前を指定し、コンテナ内のパスを維持してください。

端末版 Emacs と TypeScript・Markdown・YAML・Bash の LSP 環境を追加する場合は `--editor emacs` を指定します。

```bash
npx specdojo devcontainer scaffold --provider claude,codex --editor emacs
```

生成される `.devcontainer/emacs/init.el` は、`~/.emacs`、`~/.emacs.el`、`~/.emacs.d/init.el`、`~/.config/emacs/init.el` のいずれも無い場合だけコピーされます。空の `~/.emacs.d` があればその中の `init.el` へ、なければ `~/.config/emacs/init.el` へ配置し、配置先を出力します。初回作成前の既定値は生成されたテンプレートで変更でき、作成後は出力されたコピー先を編集します。dotfiles が設定を配置していれば上書きされません。

scaffold は、常時稼働ホストへの接続と tmux セッションの維持に使えるサンプルを `.devcontainer/remote-host/` に生成します。

- `specdojo-tmux.sh.sample`: 常時稼働ホストの `~/bin/specdojo-tmux.sh` などへコピーし、実行権限（`chmod +x`）を付与して使います。ラベル（`devcontainer.local_folder`）が一致するコンテナだけを探して接続し、停止していれば `devcontainer up` で起動してからコンテナ内の tmux セッション（`specdojo`）へ接続します。ホスト名や作業パスはプレースホルダーになっているため、ホストの環境に合わせて調整してください。
- `ssh-config.sample`: 接続元端末の `~/.ssh/config` へ追加して使います。ホストへの通常接続エイリアスと、`RemoteCommand` と `RequestTTY force` で `specdojo-tmux.sh` を直接呼び出すエイリアス（`Host <host>-tmux`）を含みます。`RemoteCommand` では端末の `PATH` の設定が読み込まれないため、接続元から `ssh <host> 'command -v devcontainer'` を実行して Dev Container CLI が見つかるか確かめられます。

`devcontainer.json` の `appPort` や `forwardPorts` で開発サーバなどの公開ポートを設定している場合は、接続用エイリアスに `LocalForward` の行が含まれます。開発サーバのポートを増やしたときは、`~/.ssh/config` の tmux 接続用エイリアスにも `LocalForward <ポート> 127.0.0.1:<ポート>` を追加してください。

生成される `devcontainer.json` は `remoteEnv` で `/home/node/.local/bin`（利用者が別の場合は `/home/<remoteUser>/.local/bin`）を `PATH` の先頭に追加するため、コンテナ作成後に開く端末や VS Code のターミナルでも `~/.local/bin` に入った Claude Code などの CLI がそのまま利用できます。また、`shutdownAction: "none"` を設定しているため、VS Code などのクライアントを切断したりウィンドウを閉じたりしてもコンテナが停止せず、tmux セッションやバックグラウンド処理を維持できます。

### 2.2. 生成した Dev Container をホストで実地確認する

SpecDojo 本体の開発者は、Docker daemon と Dev Container CLI を利用できる Mac のホストで、次の E2E を実行できます。ホストとコンテナで `node_modules` を共有しているため `tsx` は使えません。スクリプトは Node の標準ライブラリだけを使っており、Node 22.18 以上（型を外して直接動かせる版）が必要です。

```bash
node tools/e2e/devcontainer-host-e2e.ts
```

このスクリプトは、手元のソースを npm tarball にし、新しい一時リポジトリで `specdojo init --yes --provider claude --devcontainer` と `devcontainer up` を実行します。作成したコンテナでは、利用者、`~/.local/bin` の所有者、tmux、Vim、Emacs、Claude Code CLI の配置を項目ごとに検査します。また、agent にホストの権限を渡さない前提を守るため、開発用コンテナに Docker CLI がないことも検査します。

通常は、検査の成否にかかわらず一時ディレクトリ、コンテナ、テスト用の名前付き volume、テストで新しく作られた container image を最後に削除します。失敗状態を調べる場合は `--keep` を付けて残し、表示された一時ディレクトリと Docker resource を調査後に手動で削除してください。

```bash
node tools/e2e/devcontainer-host-e2e.ts --keep
```

Docker または Dev Container CLI を利用できない場合、スクリプトは確認コマンドと Dev Container CLI の導入方法を表示し、終了コード 1 で終了します。Dev Container CLI は次のコマンドで導入できます。

```bash
npm install --global @devcontainers/cli
```

## 3. 構成例

```text
作業端末（任意の場所）
  └─ SSH（Tailscale などの到達手段）
       └─ 常時稼働ホスト
            └─ tmux セッション
                 └─ devcontainer
                      └─ specdojo exec run / routine
```

要点は、**SpecDojo の実行を tmux セッションの中で開始する**ことです。SSH が切れても tmux のセッションは残り、再接続して同じ状態へ戻れます。

## 4. 切断と再接続

### 4.1. セッションへ入る

接続のたびに新規作成せず、既存があればそれへ入ります。

```bash
tmux new-session -A -s specdojo
```

`-A` は「あれば attach、なければ作成」です。セッション名を固定すると、複数端末から同じ場所へ戻れます。

### 4.2. 実行はセッションの中で始める

```bash
tmux new-session -A -s specdojo
npx specdojo exec run --project <project-id> --register <PJR-XXXX> --worktree
```

エディタの統合ターミナルで直接実行すると、エディタの接続が切れた時点で終了する場合があります。長時間の実行は tmux の中で始めます。

### 4.3. 切断された実行の扱い

再接続しても、実行中だった処理が自動で再開されるわけではありません。

| 対象                       | 再開方法                                                     |
| -------------------------- | ------------------------------------------------------------ |
| `exec run --worktree`      | `exec run --register <id> --resume --worktree`               |
| agent CLI の対話セッション | CLI ごとの再開機能（会話履歴は各 CLI が保持する）            |
| `routine`                  | 次の起動時刻を待つか、`routine run --id <id>` で明示実行する |

`exec run` は worktree と pipeline の状態を保持するため、executor が完了していれば reporter 段だけを再開できます。

### 4.4. セッションが消える場合

実行環境を作り直すとセッションも消えます。

| 操作                     | tmux セッション |
| ------------------------ | --------------- |
| SSH の切断・再接続       | 残る            |
| エディタの再接続         | 残る            |
| コンテナの再起動・再作成 | **消える**      |

コンテナを作り直す前に、実行中の処理がないことを確認します。

## 5. 定期実行

`routine` はホスト側で動き続ける必要があります。cron を使う場合、実行環境の中で cron を動かし、コンテナ停止時に定期実行も止まることを前提にします。

```cron
0 * * * * cd /path/to/project && npx specdojo routine run --due >> /var/log/specdojo-routine.log 2>&1
```

設定の詳細は [routine運用ガイド](routine-operation-guide.md) を参照してください。取りこぼした実行枠の扱い（`missed_run`）と重複起動の扱い（`overlap`）は routine 定義で指定します。

## 6. 既知の制限

### 6.1. 入れ子のリモート接続でポート転送が届かない

「作業端末 → SSH → ホスト → コンテナ」という入れ子構成では、エディタが動的に張るポート転送が作業端末まで届かないことがあります。エディタ側の転送機能は、エディタを起動している接続にのみ有効なためです。

対処として、コンテナ側で固定ポートを公開し、SSH の local forwarding で転送します。

```text
# ~/.ssh/config
Host <ホスト名>
  LocalForward 5173 127.0.0.1:5173
```

`LocalForward` は 1 行につき 1 ポートを転送します。開発サーバを複数使う場合は、公開したポートごとに 1 行ずつ書きます。`LocalForward` はその設定を持つ SSH 接続にだけ有効です。tmux セッションへ直接入る接続用のエントリを別に作っている場合は、そちら側へ設定します。この方式は SSH 接続が張られている間有効で、エディタの起動有無に依存しません。

### 6.2. 実行環境の起動に失敗する

SSH 経由の非対話シェル（`RemoteCommand` など）では、ログインシェルや対話端末で読み込まれる `~/.zshrc` などの `PATH` の設定が読み込まれないため、コンテナ起動用のコマンドが見つからない場合があります。接続元から次を実行して確認します。

```bash
ssh <ホスト名> 'command -v devcontainer'
```

`devcontainer` が見つからない場合は、ホスト側の通常端末で `dirname "$(command -v devcontainer)"` を実行して場所を確認し、`specdojo-tmux.sh` の `node_bin_dir` に設定してください。詳細な `PATH` を確認する場合は次を実行します。

```bash
ssh <ホスト名> 'printf "PATH=%s\n" "$PATH"; command -v node || true; command -v devcontainer || true'
```

### 6.3. コンテナ内の端末で ~/.local/bin の CLI が見つからない

v0.4.0 などで生成した Dev Container 環境では、`devcontainer.json` に `remoteEnv` がないため、コンテナ作成後に開く端末や VS Code のターミナルで `~/.local/bin` が `PATH` に入らず、Claude Code などの CLI が見つからない場合があります。

既存の環境を修正するには、`.devcontainer/devcontainer.json` に `remoteEnv` を追加（または既存の `remoteEnv` に `PATH` を追加）し、コンテナをリビルドしてください。

```json
  "remoteEnv": {
    "PATH": "/home/node/.local/bin:${containerEnv:PATH}"
  }
```

コンテナ内の利用者が `node` 以外の場合は、`/home/<remoteUser>/.local/bin` に合わせてください。

### 6.4. クライアント切断時にコンテナが停止する

以前のバージョンで生成した Dev Container 環境では、`devcontainer.json` に `shutdownAction` が指定されていないため、VS Code などのクライアントを切断した際にコンテナが自動的に停止し、コンテナ内で実行中の tmux セッションやバックグラウンド処理が中断することがあります。

既存の環境を修正するには、`.devcontainer/devcontainer.json` に `"shutdownAction": "none"` を追加してください。

```json
  "workspaceFolder": "/workspaces/<親名>/<リポジトリ名>",
  "shutdownAction": "none",
  "init": true,
```

設定の反映には Dev Container の再起動（VS Code で「Rebuild Container」または `devcontainer up`）を行ってください。なお、切断後もコンテナが停止しない実際の動作確認は、Docker daemon が稼働しているホスト環境（または Dev Container CLI が動作する実環境）で行う必要があります。

## 7. 運用上のセキュリティ

この構成は、常時稼働ホストを外部から到達可能にします。次を守ります。

- ネットワーク到達手段は認証付きのものを使う。SSH を公開する場合は鍵認証のみとし、パスワード認証を無効にする。
- API key、SSH 秘密鍵、tailnet 名などをターミナルの scrollback やコマンド履歴へ残さない。
- agent の認証状態は秘密情報として扱う。リポジトリや設定ファイルへ書かない。
- agent の権限を広げる指定（全ツール許可、権限確認の省略、完全アクセス）は通常運用で使わない。境界は worktree、保護設定、commit 許可リストで作る。詳細は [exec設定ガイド](exec-config-guide.md) を参照してください。

常時稼働させる以上、ホスト自体の更新と監視は利用者の責任範囲です。

## 8. この構成を採らない選択

常時稼働ホストは必須ではありません。次の場合は不要です。

- `routine` を使わず、`exec run` を都度実行する
- 実行のたびに完了まで端末を開いたままにできる
- `register` だけを使い、agent 実行を行わない

`register` の起票・状態遷移・生成物の再構築はいずれも短時間で完了するため、この構成を前提としません。
