# CONTRIBUTING

このリポジトリでは、**devcontainer の起動は VS Code で行い**、日常的なターミナル作業は **`docker exec -it` で起動済みコンテナに入る**運用を前提にします。

## 1. この運用にする理由

- VS Code では **`Dev Containers: Reopen in Container`** を使うことで、`.devcontainer/devcontainer.json` に沿った正しい開発環境で開けます。
- GitHub Copilot Chat も、**実行中のコンテナにアタッチ**するより、**Reopen in Container** のほうが安定しやすいです。
- 日常のシェル作業は `docker exec -it` で十分です。
- `devcontainer CLI` は便利ですが、このリポジトリの日常運用では必須ではありません。

## 2. 前提

以下がインストールされていることを前提とします。

- Docker
- Visual Studio Code
- Dev Containers 拡張機能
- GitHub Copilot / GitHub Copilot Chat（必要な場合）

## 3. Quick Start

### 3.1. 起動

- VS Code でリポジトリを開く
- **`Dev Containers: Reopen in Container`** を実行する

### 3.2. 日常のシェル作業

- ローカル端末から **`npm run dc:bash`** でコンテナに入る

### 3.3. Copilot Chat

- VS Code 上の Copilot Chat を使う
- **`Attach to Running Container` は基本的に使わない**

## 4. いつもの使い方

### 4.1. VS Code で devcontainer を起動する

1. このリポジトリを VS Code で開く
2. コマンドパレットを開く
3. **`Dev Containers: Reopen in Container`** を実行する

初回は build に少し時間がかかることがあります。

### 4.2. 起動中のコンテナ名を確認する

ローカル端末で以下を実行します。

```bash
npm run dc:ps
```

もしくは、以下を使っても同様の情報が得られます。

```bash
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
```

例:

```bash
awesome_app_devcontainer   vsc-awesome-app-123456   Up 2 hours
```

この例では、コンテナ名は `awesome_app_devcontainer` です。

なお、`npm run dc:name` を使うと、**このリポジトリの devcontainer に該当するコンテナ名だけ**が得られます。

### 4.3. コンテナの中に入る

```bash
npm run dc:bash
```

もしくは、 以下を使っても同様の操作ができます。

```bash
docker exec -it <container_name> bash
```

例:

```bash
docker exec -it awesome_app_devcontainer bash
```

### 4.4. 残った VS Code Server のプロセスを掃除する

`devcontainer.json` は `"shutdownAction": "none"` でコンテナを生かし続けるため、VS Code の再接続や更新のたびに旧 server や親を失った extension host がコンテナ内に残り、メモリを圧迫することがあります。`"init": true` で PID 1 を init にして孤児プロセスを回収し、接続時（`postAttachCommand`）に残骸を自動で停止します。

手動で確認・停止する場合は次を使います。

```bash
npm run vscode:ps          # vscode-server 系プロセスをメモリ順に表示する
npm run vscode:kill-stale  # 最新 commit 以外の server と孤児プロセスを停止する
```

停止対象は「最新 commit 以外の `server-main.js` とその子孫」と「PID 1 の子になった vscode-server 系プロセス」だけで、稼働中の接続は対象にしません。`bash .devcontainer/kill-stale-vscode.sh --dry-run` で対象を表示だけできます。

`init` の変更はコンテナの rebuild（`Dev Containers: Rebuild Container`）後に有効になります。

### 4.5. AI CLI の設定の永続化

Claude Code の設定ファイルは `CLAUDE_CONFIG_DIR=/home/node/.claude` により、名前付きボリューム `specdojo-claude` に置かれます（`~/.claude/.claude.json`）。以前は `~/.claude.json` を別ボリューム `specdojo-claude-state` への symlink にしていましたが、`.devcontainer/prepare-agent-dirs.sh` が起動時に旧ファイルの内容を一度だけ写して symlink を外すため、rebuild 後も手作業は不要です。rebuild 後に `docker volume rm specdojo-claude-state` で旧ボリュームを削除できます。cron から起動する routine には `.devcontainer/specdojo-routine.cron` で同じ `CLAUDE_CONFIG_DIR` を渡しています。

Antigravity CLI（`agy`）は `post-create.sh` が `~/.local/bin` に導入し、`~/.config/antigravity`（`config.toml`）と `~/.gemini`（OAuth トークン `antigravity-cli/antigravity-oauth-token`、会話履歴、`mcp_config.json`、skills 用の `config/`）を名前付きボリューム（`specdojo-antigravity` / `specdojo-gemini`）で永続化します。コンテナ内では資格情報はキーリングではなく `~/.gemini` 配下のファイルに保存されるため（2026-09-21 に確認）、`ANTIGRAVITY_API_KEY` を渡す必要はありません。

## 7. 推奨しない使い方

### 7.1. 実行中のコンテナに VS Code で直接アタッチする

**`Dev Containers: Attach to Running Container...`** は、このリポジトリの日常運用では推奨しません。

理由:

- `devcontainer.json` ベースの起動と挙動がずれることがある
- Copilot Chat の警告や互換性問題が出やすい
- 拡張機能の実行場所が変わり、挙動が不安定になることがある

### 7.2. VS Code を2つ開いて同じディレクトリを同時に編集する

同じコンテナを使う場合でも、**同じディレクトリを2つの VS Code ウィンドウで同時に開く**運用は避けてください。

必要なら:

- 片方は VS Code 本体
- 片方は Chat 専用ウィンドウ
- または別サブディレクトリを開く
