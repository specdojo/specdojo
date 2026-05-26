---
id: tsd-vllm-mlx
type: architecture
status: draft
rulebook: tsd-rulebook
---

# vllm-mlx 技術スタック定義

SpecDojoでは、ドキュメント作成、コード生成、レビューなどでLLMを活用することを想定しており、Apple Silicon 向けの高スループットなローカル実行基盤として vllm-mlx を技術スタック候補として定義する。なお、vllm-mlx の使用は必須ではない。

## 1. vllm-mlx実行環境

vllm-mlx は Apple Silicon Mac 上で MLX を利用して LLM / Vision / Audio / Embedding などを実行するサーバーを対象とする。OpenAI互換の `/v1/*` API と Anthropic互換の `/v1/messages` API を同一プロセスから提供できるため、複数AgentやOpenAI SDK互換ツールから利用しやすい。

Ollama よりも、以下を重視する場合に採用候補とする。

- OpenAI互換APIで既存ツールから接続したい
- Anthropic互換APIで Claude Code / opencode 系ツールから接続したい
- continuous batching や prefix cache を使い、複数リクエストの処理効率を上げたい
- Apple Silicon の unified memory と Metal / MLX を前提にした推論基盤を使いたい

## 2. vllm-mlxモデルの選定

| 用途                           | 推奨モデル例                                      |
| ------------------------------ | ------------------------------------------------- |
| 軽めの疎通確認                 | `mlx-community/Llama-3.2-3B-Instruct-4bit`        |
| Markdown設計書の作成・レビュー | `mlx-community/Qwen3-8B-4bit`                     |
| コーディング補助               | `mlx-community/Qwen3-Coder-30B-A3B-Instruct-4bit` |
| Vision入力の確認               | `mlx-community/Qwen3-VL-4B-Instruct-3bit`         |
| Embedding                      | `mlx-community/all-MiniLM-L6-v2-4bit`             |

モデルは Hugging Face の `mlx-community` 配布を優先し、Mac のメモリ容量と用途に応じて 3B / 8B / 30B クラスを使い分ける。

## 3. メモリ安定化設定

複数Agentを使う場合、巨大モデルと長いコンテキストを同時に扱うと unified memory を圧迫しやすい。vllm-mlx では、まず小さなモデルと短めのコンテキストで疎通確認し、必要に応じて continuous batching や cache 関連オプションを有効にする。

基本方針:

- 疎通確認は 3B / 4bit クラスで行う
- Agent常用は 8B / 4bit クラスから始める
- 30B クラスは同時実行数を絞る
- 長文レビュー用途では SSD cache の利用を検討する
- 生成品質と安定性を見ながら temperature / max tokens をツール側で調整する

長文・複数Agent向けに起動する場合の例:

```bash
vllm-mlx serve mlx-community/Qwen3-8B-4bit \
  --port 8000 \
  --continuous-batching \
  --ssd-cache-dir ~/.cache/vllm-mlx/kv-cache
```

## 4. macOSでの設定と起動のさせ方

macOS では、Python環境を壊さないため `uv tool` で CLI としてインストールする運用を採用する。

```bash
brew install uv
uv tool install vllm-mlx
```

まずはフォアグラウンドで起動する。

```bash
vllm-mlx serve mlx-community/Llama-3.2-3B-Instruct-4bit \
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

### 4.1. LaunchAgentで常駐させる場合

常駐させる場合は、`vllm-mlx serve` を直接 plist に書くのではなく、起動用スクリプトを作成してから LaunchAgent で呼び出す。`uv tool` のインストール先や PATH 差異を吸収しやすくするためである。

```bash
mkdir -p ~/bin
code ~/bin/specdojo-vllm-mlx-serve.sh
chmod +x ~/bin/specdojo-vllm-mlx-serve.sh
```

内容例:

```bash
#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

exec vllm-mlx serve mlx-community/Qwen3-8B-4bit \
  --port 8000 \
  --continuous-batching \
  --ssd-cache-dir "$HOME/.cache/vllm-mlx/kv-cache"
```

LaunchAgentを作る。

```bash
code ~/Library/LaunchAgents/org.specdojo.vllm-mlx.plist
```

内容例:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>org.specdojo.vllm-mlx</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-lc</string>
    <string>$HOME/bin/specdojo-vllm-mlx-serve.sh</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/tmp/vllm-mlx.out.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/vllm-mlx.err.log</string>
</dict>
</plist>
```

読み込み:

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.vllm-mlx.plist
launchctl kickstart -k gui/$(id -u)/org.specdojo.vllm-mlx
```

ログを見る場合:

```bash
tail -f /tmp/vllm-mlx.err.log
```

## 5. devcontainerからの疎通確認

devcontainer 内から Host Mac 上の vllm-mlx に接続する場合、`localhost` は devcontainer 自身を指すため、Docker Desktop が提供する `host.docker.internal` を使う。

まず、devcontainer のターミナルで OpenAI互換APIに到達できることを確認する。

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

OpenAI SDK 互換ツールから参照する場合は、devcontainer 内で base URL を `http://host.docker.internal:8000/v1` に設定する。

```bash
export OPENAI_BASE_URL=http://host.docker.internal:8000/v1
export OPENAI_API_KEY=not-needed
```

Anthropic互換ツールから参照する場合は、devcontainer 内で base URL を `http://host.docker.internal:8000` に設定する。

```bash
export ANTHROPIC_BASE_URL=http://host.docker.internal:8000
export ANTHROPIC_API_KEY=not-needed
```

接続できない場合は、Host Mac 側で以下を確認する。

- vllm-mlx が起動していること: `curl http://localhost:8000/v1/models`
- devcontainer が Docker Desktop 上で動作していること
- `host.docker.internal` が名前解決できること: `getent hosts host.docker.internal`
- ポート 8000 を他プロセスが使用していないこと: `lsof -i :8000`

## 6. モデル取得と動作確認

vllm-mlx は Hugging Face 上の MLX 形式モデルを直接利用できる。事前にモデルの情報を確認する場合は `model inspect` を使う。

```bash
vllm-mlx model inspect mlx-community/Llama-3.2-3B-Instruct-4bit
```

モデルを明示的に取得しておきたい場合は `model acquire` を使う。

```bash
mkdir -p ~/vllm-mlx-models
vllm-mlx model acquire mlx-community/Llama-3.2-3B-Instruct-4bit \
  --target-dir ~/vllm-mlx-models/llama-3.2-3b-instruct-4bit
```

### 6.1. 軽量モデルの動作確認

```bash
vllm-mlx serve mlx-community/Llama-3.2-3B-Instruct-4bit \
  --port 8000 \
  --continuous-batching
```

### 6.2. Agent向けモデルの動作確認

```bash
vllm-mlx serve mlx-community/Qwen3-8B-4bit \
  --port 8000 \
  --continuous-batching
```

### 6.3. Embeddingモデルの動作確認

```bash
vllm-mlx serve mlx-community/Qwen3-8B-4bit \
  --port 8000 \
  --embedding-model mlx-community/all-MiniLM-L6-v2-4bit
```

```bash
curl http://localhost:8000/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer not-needed" \
  -d '{"model":"mlx-community/all-MiniLM-L6-v2-4bit","input":["SpecDojo の設計書検索"]}'
```

## 7. アンインストール

vllm-mlx を削除する場合は、常駐設定、CLI、モデルデータを分けて扱う。モデルデータは容量が大きく、削除すると再ダウンロードが必要になるため、必要な場合だけ削除する。

### 7.1. 常駐設定の停止

SpecDojo 用の LaunchAgent を使っている場合は、先に停止する。

```bash
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.vllm-mlx.plist 2>/dev/null || true
rm ~/Library/LaunchAgents/org.specdojo.vllm-mlx.plist
rm ~/bin/specdojo-vllm-mlx-serve.sh
```

### 7.2. vllm-mlx CLIの削除

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

### 7.3. モデルデータとキャッシュの削除（任意）

明示的に取得したモデルや cache も削除する場合は、作成したディレクトリを削除する。

```bash
rm -rf ~/vllm-mlx-models
rm -rf ~/.cache/vllm-mlx
```

Hugging Face cache まで削除する場合は、他ツールのモデルも消える可能性があるため、用途を確認してから削除する。

```bash
rm -rf ~/.cache/huggingface
```

### 7.4. ログファイルの削除（任意）

LaunchAgent で出力していたログが不要なら削除する。

```bash
rm -f /tmp/vllm-mlx.out.log /tmp/vllm-mlx.err.log
```

## 8. 参考

- [vllm-mlx PyPI](https://pypi.org/project/vllm-mlx/)
- [vllm-mlx GitHub](https://github.com/waybarrios/vllm-mlx)
