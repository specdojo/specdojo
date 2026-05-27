---
id: tsd-vllm-mlx
type: architecture
status: draft
rulebook: tsd-rulebook
---

# vllm-mlx 技術スタック定義

SpecDojoでは、ドキュメント作成、コード生成、レビューなどでLLMを活用することを想定しており、Apple Silicon 向けの高スループットなローカル実行基盤として vllm-mlx を技術スタック候補として定義する。なお、vllm-mlx の使用は必須ではない。

## 1. vllm-mlx実行環境

vllm-mlx は Apple Silicon Mac 上で MLX を利用して LLM を実行するサーバーを対象とする。OpenAI互換の `/v1/*` API と Anthropic互換の `/v1/messages` API を同一プロセスから提供できるため、複数AgentやOpenAI SDK互換ツールから利用しやすい。

Ollama よりも、以下を重視する場合に採用候補とする。

- OpenAI互換APIで既存ツールから接続したい
- Anthropic互換APIで Claude Code / opencode 系ツールから接続したい
- continuous batching や prefix cache を使い、複数リクエストの処理効率を上げたい
- Apple Silicon の unified memory と Metal / MLX を前提にした推論基盤を使いたい

## 2. mise + uv ベースの実行環境

vllm-mlx は Python ベースのCLIとして提供されるため、Python と uv は mise で管理する。PyPI 上の vllm-mlx は Python `>=3.10` を要求し、3.10〜3.13 系に対応しているが、SpecDojo では依存パッケージの安定性を優先して **Python 3.12** を標準とする。

まず、mise をインストールする。

```bash
brew install mise
```

Python 3.12 と uv を mise でインストールする。

```bash
mise install python@3.12 uv@latest
```

グローバル既定として使う場合は、以下を設定する。

```bash
mise use -g python@3.12 uv@latest
```

リポジトリ単位で固定したい場合は、リポジトリルートで以下を実行する。

```bash
mise use python@3.12 uv@latest
```

有効化を確認する。

```bash
python --version
uv --version
mise current
```

vllm-mlx は uv tool としてインストールする。`--python 3.12` を明示し、mise で入れた Python 3.12 を使う前提にする。

```bash
uv tool install --python 3.12 vllm-mlx
```

インストール後、CLI が見えることを確認する。

```bash
vllm-mlx --help
```

## 3. vllm-mlxモデルの選定

vllm-mlx では Hugging Face 上の MLX 形式モデルを指定する。SpecDojo では、まず `mlx-community` 名前空間のモデルを優先する。Ollama の `gemma4:*` や `qwen3.6:*` とはモデルIDが異なるため、用途ごとに vllm-mlx 用のモデルIDを明示する。

| 用途                           | 推奨モデル例                                  | 備考                         |
| ------------------------------ | --------------------------------------------- | ---------------------------- |
| コーディング                   | `mlx-community/Qwen3.6-27B-4bit`              | Qwen3.6-27B の mlx-community 版 MLX 4bit 変換 |
| Markdown設計書の作成・レビュー | `mlx-community/gemma-4-26b-a4b-it-4bit`       | 品質優先                     |
| 軽めの設計書整理・要約         | `mlx-community/gemma-4-e4b-it-4bit`           | 速度・常駐性優先             |

Markdown用途では `gemma-4-26b-a4b-it-4bit` を標準とし、メモリや応答速度を優先する場合に `gemma-4-e4b-it-4bit` へ切り替える。Code用途では `Qwen3.6-27B-4bit` を標準とする。

## 4. メモリ安定化設定

複数Agentを使う場合、巨大モデルと長いコンテキストを同時に扱うと unified memory を圧迫しやすい。vllm-mlx では、まず小さなモデルと短めのコンテキストで疎通確認し、必要に応じて continuous batching や cache 関連オプションを有効にする。

基本方針:

- 疎通確認は `gemma-4-e4b-it-4bit` から始める
- Markdown品質優先時は `gemma-4-26b-a4b-it-4bit` を使う
- Code用途は `Qwen3.6-27B-4bit` を使い、同時実行数を絞る
- 長文レビュー用途では SSD cache の利用を検討する
- 生成品質と安定性を見ながら temperature / max tokens をツール側で調整する

長文・複数Agent向けに起動する場合の例（「モデル取得と動作確認」でモデルを取得済みの前提）:

```bash
vllm-mlx serve ~/vllm-mlx-models/qwen3.6-27b-4bit \
  --port 8002 \
  --continuous-batching \
  --ssd-cache-dir ~/.cache/vllm-mlx/kv-cache
```

## 5. モデル取得と動作確認

vllm-mlx は Hugging Face 上の MLX 形式モデルを直接利用できる。事前にモデルの情報を確認する場合は `model inspect` を使う。

```bash
vllm-mlx model inspect mlx-community/Qwen3.6-27B-4bit
```

モデルを明示的に取得しておきたい場合は `model acquire` を使う。後続のすべての起動手順はローカルパスを前提とするため、ここで3つのモデルをすべて取得しておく。

```bash
mkdir -p ~/vllm-mlx-models
vllm-mlx model acquire mlx-community/Qwen3.6-27B-4bit \
  --target-dir ~/vllm-mlx-models/qwen3.6-27b-4bit

vllm-mlx model acquire mlx-community/gemma-4-26b-a4b-it-4bit \
  --target-dir ~/vllm-mlx-models/gemma-4-26b-a4b-it-4bit

vllm-mlx model acquire mlx-community/gemma-4-e4b-it-4bit \
  --target-dir ~/vllm-mlx-models/gemma-4-e4b-it-4bit
```

### 5.1. Markdown軽量モデルの動作確認

`model acquire` で取得済みのローカルパスを指定する。Hugging Face ID を渡すと再ダウンロードが走るため、ここでは `~/vllm-mlx-models/` 配下のパスを使う。

```bash
vllm-mlx serve ~/vllm-mlx-models/gemma-4-e4b-it-4bit \
  --port 8000 \
  --continuous-batching
```

### 5.2. Code向けモデルの動作確認

```bash
vllm-mlx serve ~/vllm-mlx-models/qwen3.6-27b-4bit \
  --port 8002 \
  --continuous-batching
```

## 6. macOSでの設定と起動のさせ方

macOS では、「モデル取得と動作確認」で取得したローカルパスのモデルを使って起動する。まずはフォアグラウンドで起動し、初回ロードを確認する。

```bash
vllm-mlx serve ~/vllm-mlx-models/gemma-4-e4b-it-4bit \
  --port 8000 \
  --continuous-batching
```

確認:

```bash
curl http://localhost:8000/v1/models
```

OpenAI互換の chat completions まで確認する。

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer not-needed" \
  -d '{"model":"default","messages":[{"role":"user","content":"短く疎通確認の返答をしてください。"}],"stream":false}'
```

Anthropic互換APIとして使う場合は、ツール側に以下を設定する。

```bash
export ANTHROPIC_BASE_URL=http://localhost:8000
export ANTHROPIC_API_KEY=not-needed
```

### 6.1. LaunchAgentで常駐させる場合

取得済みの3モデルそれぞれを独立したポートで起動できるよう、モデルごとに起動スクリプトと LaunchAgent を用意する。3つを同時に起動すると unified memory を大きく消費するため、用途に応じて必要なモデルのみを起動する。

| モデル                      | スクリプト                               | ポート |
| --------------------------- | ---------------------------------------- | ------ |
| `gemma-4-e4b-it-4bit`       | `specdojo-vllm-mlx-gemma-e4b.sh`         | 8000   |
| `gemma-4-26b-a4b-it-4bit`   | `specdojo-vllm-mlx-gemma26b.sh`          | 8001   |
| `qwen3.6-27b-4bit`          | `specdojo-vllm-mlx-qwen.sh`              | 8002   |

まず、起動スクリプトを作成する。

```bash
mkdir -p ~/bin
```

`~/bin/specdojo-vllm-mlx-gemma-e4b.sh`（ポート 8000 / Markdown 軽量用）:

```bash
#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

exec vllm-mlx serve "$HOME/vllm-mlx-models/gemma-4-e4b-it-4bit" \
  --port 8000 \
  --continuous-batching
```

`~/bin/specdojo-vllm-mlx-gemma26b.sh`（ポート 8001 / Markdown 品質優先用）:

```bash
#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

exec vllm-mlx serve "$HOME/vllm-mlx-models/gemma-4-26b-a4b-it-4bit" \
  --port 8001 \
  --continuous-batching \
  --ssd-cache-dir "$HOME/.cache/vllm-mlx/kv-cache"
```

`~/bin/specdojo-vllm-mlx-qwen.sh`（ポート 8002 / コーディング用）:

```bash
#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

exec vllm-mlx serve "$HOME/vllm-mlx-models/qwen3.6-27b-4bit" \
  --port 8002 \
  --continuous-batching \
  --ssd-cache-dir "$HOME/.cache/vllm-mlx/kv-cache"
```

実行権限を付与する。

```bash
chmod +x ~/bin/specdojo-vllm-mlx-gemma-e4b.sh
chmod +x ~/bin/specdojo-vllm-mlx-gemma26b.sh
chmod +x ~/bin/specdojo-vllm-mlx-qwen.sh
```

LaunchAgent を作成する。

```bash
code ~/Library/LaunchAgents/org.specdojo.vllm-mlx-gemma-e4b.plist
code ~/Library/LaunchAgents/org.specdojo.vllm-mlx-gemma26b.plist
code ~/Library/LaunchAgents/org.specdojo.vllm-mlx-qwen.plist
```

`org.specdojo.vllm-mlx-gemma-e4b.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>org.specdojo.vllm-mlx-gemma-e4b</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-lc</string>
    <string>$HOME/bin/specdojo-vllm-mlx-gemma-e4b.sh</string>
  </array>
  <key>RunAtLoad</key>
  <false/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/tmp/vllm-mlx-gemma-e4b.out.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/vllm-mlx-gemma-e4b.err.log</string>
</dict>
</plist>
```

`org.specdojo.vllm-mlx-gemma26b.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>org.specdojo.vllm-mlx-gemma26b</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-lc</string>
    <string>$HOME/bin/specdojo-vllm-mlx-gemma26b.sh</string>
  </array>
  <key>RunAtLoad</key>
  <false/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/tmp/vllm-mlx-gemma26b.out.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/vllm-mlx-gemma26b.err.log</string>
</dict>
</plist>
```

`org.specdojo.vllm-mlx-qwen.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>org.specdojo.vllm-mlx-qwen</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-lc</string>
    <string>$HOME/bin/specdojo-vllm-mlx-qwen.sh</string>
  </array>
  <key>RunAtLoad</key>
  <false/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/tmp/vllm-mlx-qwen.out.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/vllm-mlx-qwen.err.log</string>
</dict>
</plist>
```

3つの LaunchAgent を登録する。

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.vllm-mlx-gemma-e4b.plist
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.vllm-mlx-gemma26b.plist
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.vllm-mlx-qwen.plist
```

必要なモデルを起動する（例: Markdown 軽量用のみ起動）。

```bash
launchctl kickstart -k gui/$(id -u)/org.specdojo.vllm-mlx-gemma-e4b
```

用途に応じて他のモデルを追加起動できる。

```bash
launchctl kickstart -k gui/$(id -u)/org.specdojo.vllm-mlx-gemma26b
launchctl kickstart -k gui/$(id -u)/org.specdojo.vllm-mlx-qwen
```

ログを見る場合:

```bash
tail -f /tmp/vllm-mlx-gemma-e4b.err.log
tail -f /tmp/vllm-mlx-gemma26b.err.log
tail -f /tmp/vllm-mlx-qwen.err.log
```

## 7. devcontainerからの疎通確認

devcontainer 内から Host Mac 上の vllm-mlx に接続する場合、`localhost` は devcontainer 自身を指すため、Docker Desktop が提供する `host.docker.internal` を使う。

まず、devcontainer のターミナルで OpenAI互換APIに到達できることを確認する（`gemma-4-e4b-it-4bit` をポート 8000 で起動済みの前提）。

```bash
curl http://host.docker.internal:8000/v1/models
```

モデル一覧の JSON が返れば、devcontainer から Host Mac の vllm-mlx に疎通できている。

生成APIまで確認する場合は、短いプロンプトを送る。

```bash
curl http://host.docker.internal:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer not-needed" \
  -d '{"model":"default","messages":[{"role":"user","content":"devcontainer から疎通確認しています。短く返答してください。"}],"stream":false}'
```

`choices[0].message.content` に文章が返れば、モデルのロードと生成まで確認できている。

他のモデルを使う場合は、それぞれのポートを指定する。

| モデル                      | ポート | devcontainer からの接続先              |
| --------------------------- | ------ | -------------------------------------- |
| `gemma-4-e4b-it-4bit`       | 8000   | `http://host.docker.internal:8000`     |
| `gemma-4-26b-a4b-it-4bit`   | 8001   | `http://host.docker.internal:8001`     |
| `qwen3.6-27b-4bit`          | 8002   | `http://host.docker.internal:8002`     |

OpenAI SDK 互換ツールから参照する場合は、devcontainer 内で base URL を設定する。

```bash
export OPENAI_BASE_URL=http://host.docker.internal:8000/v1
export OPENAI_API_KEY=not-needed
```

Anthropic互換ツールから参照する場合は、devcontainer 内で base URL を設定する。

```bash
export ANTHROPIC_BASE_URL=http://host.docker.internal:8000
export ANTHROPIC_API_KEY=not-needed
```

接続できない場合は、Host Mac 側で以下を確認する。

- vllm-mlx が起動していること: `curl http://localhost:8000/v1/models`
- devcontainer が Docker Desktop 上で動作していること
- `host.docker.internal` が名前解決できること: `getent hosts host.docker.internal`
- ポート 8000 を他プロセスが使用していないこと: `lsof -i :8000`

## 8. アンインストール

vllm-mlx を削除する場合は、常駐設定、CLI、モデルデータを分けて扱う。モデルデータは容量が大きく、削除すると再ダウンロードが必要になるため、必要な場合だけ削除する。

### 8.1. 常駐設定の停止

SpecDojo 用の LaunchAgent を使っている場合は、先に停止する。

```bash
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.vllm-mlx-gemma-e4b.plist 2>/dev/null || true
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.vllm-mlx-gemma26b.plist 2>/dev/null || true
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.vllm-mlx-qwen.plist 2>/dev/null || true
rm ~/Library/LaunchAgents/org.specdojo.vllm-mlx-gemma-e4b.plist
rm ~/Library/LaunchAgents/org.specdojo.vllm-mlx-gemma26b.plist
rm ~/Library/LaunchAgents/org.specdojo.vllm-mlx-qwen.plist
rm ~/bin/specdojo-vllm-mlx-gemma-e4b.sh
rm ~/bin/specdojo-vllm-mlx-gemma26b.sh
rm ~/bin/specdojo-vllm-mlx-qwen.sh
```

### 8.2. vllm-mlx CLIの削除

`uv tool` でインストールした vllm-mlx を削除する。

```bash
uv tool uninstall vllm-mlx
```

pip / venv でインストールしていた場合は、該当環境で削除する。

```bash
pip uninstall vllm-mlx
```

削除後、API が応答しないことを確認する。

```bash
curl http://localhost:8000/v1/models
```

接続エラーになれば、常駐プロセスは停止している。

### 8.3. モデルデータとキャッシュの削除（任意）

明示的に取得したモデルや cache も削除する場合は、作成したディレクトリを削除する。

```bash
rm -rf ~/vllm-mlx-models
rm -rf ~/.cache/vllm-mlx
```

Hugging Face cache まで削除する場合は、他ツールのモデルも消える可能性があるため、用途を確認してから削除する。

```bash
rm -rf ~/.cache/huggingface
```

### 8.4. ログファイルの削除（任意）

LaunchAgent で出力していたログが不要なら削除する。

```bash
rm -f /tmp/vllm-mlx-gemma-e4b.out.log /tmp/vllm-mlx-gemma-e4b.err.log
rm -f /tmp/vllm-mlx-gemma26b.out.log /tmp/vllm-mlx-gemma26b.err.log
rm -f /tmp/vllm-mlx-qwen.out.log /tmp/vllm-mlx-qwen.err.log
```

## 9. 参考

- [vllm-mlx PyPI](https://pypi.org/project/vllm-mlx/)
- [vllm-mlx GitHub](https://github.com/waybarrios/vllm-mlx)
