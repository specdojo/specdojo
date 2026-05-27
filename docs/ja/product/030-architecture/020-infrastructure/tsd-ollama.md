---
id: tsd-ollama
type: architecture
status: draft
rulebook: tsd-rulebook
---

# Ollama 技術スタック定義

SpecDojoでは、ドキュメント作成、コード生成、レビューなどでLLMを活用することを想定しており、ローカル実行基盤として Ollama を技術スタックの一部として定義する。なお、Ollama の使用は必須ではない。

## 1. Ollama実行環境

Ollama を対象とする。以下、macOSでの設定、常駐のさせ方、devcontainer からの疎通確認、モデル定義をまとめる。LinuxやWindowsでの設定については、今後追記予定。

## 2. mise + uv ベースの共通ツール環境

Ollama 本体は macOS の常駐アプリケーションとして Homebrew で管理する。一方、LLM 周辺の補助CLIや vllm-mlx などの Python ベースのローカルLLMサーバーと合わせて運用できるように、Python と uv は mise で管理する。

SpecDojo では、ローカルLLM関連ツールの標準 Python を **Python 3.12** とする。Python 3.12 は主要な ML / CLI パッケージとの互換性が安定しており、Python 3.13 固有の依存解決差分を避けやすい。

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

Ollama 本体は Homebrew でインストールする。

```bash
brew install ollama
```

## 3. Ollamaモデルの選定

Ollama では、Ollama の公式ライブラリタグを優先して指定する。vllm-mlx で使う `mlx-community/...` 形式の MLX モデルIDとは異なるため、同じ用途でもランタイムごとにモデル名を分けて管理する。

| 用途                           | 推奨モデル                                      | 備考                                      |
| ------------------------------ | ----------------------------------------------- | ----------------------------------------- |
| コーディング                   | `qwen3.6:27b`                         | Qwen3.6-27B の Ollama 公式ライブラリ版を標準とする |
| Markdown設計書の作成・レビュー | `gemma4:26b`                                    | Gemma 4 26B A4B 系。品質優先              |
| 軽めの設計書整理・要約         | `gemma4:e4b`                                    | Gemma 4 E4B 系。速度・常駐性優先          |
| 日本語の自然な文章化           | `gemma4:26b` または `gemma4:e4b`                | 文書量と応答速度で使い分ける              |
| 最終判断・難しい設計レビュー   | Claude Code / Codex                             | ローカルLLMの結果を必要に応じて補完する   |

`qwen3.6:27b` は Ollama 公式ライブラリ側のモデルタグであり、vllm-mlx 側では MLX 形式の `mlx-community/Qwen3.6-27B-4bit` などを使う。サードパーティ名前空間のモデルは、公式ライブラリに必要な量子化やタグがない場合の代替候補として扱う。

## 4. メモリ安定化設定

複数Agentを使う場合、重いモデルを常時複数ロードしない方が安定するため、環境変数を設定して Ollama を起動する運用を採用する。

```bash
export OLLAMA_KEEP_ALIVE=10m
export OLLAMA_MAX_LOADED_MODELS=2
```

LLAMA_MAX_LOADED_MODELS=2 にしておくと、重いモデルの同時常駐を抑えやすくなる。

但し、macOSで常駐させる場合は、Homebrew serviceの起動方法では環境変数を渡せないため、LaunchAgentを作成して環境変数を渡す方法を採用する（次章参照）。

## 5. macOSでの設定と常駐のさせ方

Ollama 本体を Homebrew でインストールした後、起動は以下のコマンドをターミナルで実行できる。ただし、SpecDojo では環境変数を渡すため、最終的には LaunchAgent で常駐させる。

```bash
brew services start ollama
```

まず、Homebrew serviceを止める。

```bash
brew services stop ollama
```

LaunchAgentを作る。

```bash
code ~/Library/LaunchAgents/org.specdojo.ollama.plist
```

内容は`ops/local/launchd/org.specdojo.ollama.plist`を参照。環境変数を渡すために、`EnvironmentVariables`セクションを追加している

読み込み：

```bash
# launchctl unload ~/Library/LaunchAgents/org.specdojo.ollama.plist 2>/dev/null || true
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.ollama.plist
launchctl kickstart -k gui/$(id -u)/org.specdojo.ollama
```

確認：

```bash
curl http://localhost:11434/api/tags
```

ログを見る場合：

```bash
tail -f /tmp/ollama.err.log
```

## 6. devcontainerからの疎通確認

devcontainer 内から Host Mac 上の Ollama に接続する場合、`localhost` は devcontainer 自身を指すため、Docker Desktop が提供する `host.docker.internal` を使う。

まず、devcontainer のターミナルで Ollama API に到達できることを確認する。

```bash
curl http://host.docker.internal:11434/api/tags
```

モデル一覧の JSON が返れば、devcontainer から Host Mac の Ollama に疎通できている。

生成APIまで確認する場合は、軽量モデルで短いプロンプトを送る。

```bash
curl http://host.docker.internal:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"gemma4:e4b-md-8k","prompt":"devcontainer から疎通確認しています。短く返答してください。","stream":false}'
```

`response` フィールドに文章が返れば、モデルのロードと生成まで確認できている。

CLIやアプリケーションから Ollama を参照する場合は、devcontainer 内で `OLLAMA_HOST` を設定する。

```bash
export OLLAMA_HOST=http://host.docker.internal:11434
ollama list
```

`ollama` CLI が devcontainer 内にない場合でも、HTTP API の `curl` 確認が通れば、アプリケーションからは同じURLで接続できる。

接続できない場合は、Host Mac 側で以下を確認する。

- Ollama が起動していること: `curl http://localhost:11434/api/tags`
- devcontainer が Docker Desktop 上で動作していること
- `host.docker.internal` が名前解決できること: `getent hosts host.docker.internal`

## 7. モデルのダウンロードとチューニング

Ollama のモデルは Host Mac 側でダウンロードする。devcontainer から利用する場合でも、モデル実体は Host Mac 上の Ollama が管理する。

まず、利用する元モデルを `ollama pull` で取得する。

```bash
ollama pull qwen3.6:27b
ollama pull gemma4:26b
ollama pull gemma4:e4b
```

取得済みモデルを確認する。

```bash
ollama list
```

モデルを試しに実行し、初回ロードまで確認する。

```bash
ollama run qwen3.6:27b "TypeScript の関数例を1つ示してください。"
ollama run gemma4:26b "Markdown設計書レビューの観点を箇条書きで出してください。"
ollama run gemma4:e4b "短い設計書のタイトル案を3つ出してください。"
```

不要になった元モデルまたは派生モデルは `ollama rm` で削除する。

```bash
ollama rm qwen3.6:27b
ollama rm gemma4:26b
ollama rm gemma4:e4b
```

複数Agent運用前提のため、すべてのモデルを巨大コンテキストで動かさない設定を適用する。ダウンロード済みの元モデルを `FROM` に指定し、用途ごとにコンテキスト長を分けた派生モデルを作成する。

Host Mac で以下のディレクトリを作成して、そこに以下のモデルファイルを作成する。

```bash
mkdir -p ~/ollama-modelfiles
cd ~/ollama-modelfiles
```

### 7.1. Qwen3.6-27B コーディング用

`qwen3.6-27b-code-32k/Modelfile`:

```text
FROM qwen3.6:27b
PARAMETER num_ctx 32768
PARAMETER temperature 0.2
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.05
```

作成:

```bash
ollama create qwen3.6-27b:code-32k -f qwen3.6-27b-code-32k/Modelfile
```

### 7.2. Qwen3.6-27B コードレビュー用

`qwen3.6-27b-code-64k/Modelfile`:

```text
FROM qwen3.6:27b
PARAMETER num_ctx 65536
PARAMETER temperature 0.2
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.05
```

作成:

```bash
ollama create qwen3.6-27b:code-64k -f qwen3.6-27b-code-64k/Modelfile
```

### 7.3. Gemma 4 26B A4B Markdownレビュー用

`gemma4-26b-a4b-md-32k/Modelfile`:

```text
FROM gemma4:26b
PARAMETER num_ctx 32768
PARAMETER temperature 0.2
PARAMETER top_p 0.9
```

作成:

```bash
ollama create gemma4:26b-md-32k -f gemma4-26b-a4b-md-32k/Modelfile
```

### 7.4. Gemma 4 E4B Markdown軽量用

`gemma4-e4b-md-8k/Modelfile`:

```text
FROM gemma4:e4b
PARAMETER num_ctx 8192
PARAMETER temperature 0.3
PARAMETER top_p 0.9
```

作成:

```bash
ollama create gemma4:e4b-md-8k -f gemma4-e4b-md-8k/Modelfile
```

### 7.5. 動作確認

```bash
ollama run qwen3.6-27b:code-32k "TypeScriptのテスト設計の観点を出してください。"
```

```bash
ollama run gemma4:26b-md-32k "Markdown設計書レビューの観点を箇条書きで出してください。"
```

```bash
ollama run gemma4:e4b-md-8k "短い設計書のタイトル案を3つ出してください。"
```

## 8. アンインストール

Ollama を削除する場合は、常駐設定、Homebrew パッケージ、モデルデータを分けて扱う。モデルデータは容量が大きく、削除すると再ダウンロードが必要になるため、必要な場合だけ削除する。

### 8.1. 常駐設定の停止

SpecDojo 用の LaunchAgent を使っている場合は、先に停止する。

```bash
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/org.specdojo.ollama.plist 2>/dev/null || true
rm ~/Library/LaunchAgents/org.specdojo.ollama.plist
```

Homebrew service で起動していた場合は、以下で停止する。

```bash
brew services stop ollama
```

### 8.2. Ollama 本体の削除

Homebrew でインストールした Ollama を削除する。

```bash
brew uninstall ollama
```

削除後、API が応答しないことを確認する。

```bash
curl http://localhost:11434/api/tags
```

接続エラーになれば、常駐プロセスは停止している。

### 8.3. モデルデータの削除（任意）

モデルデータも削除する場合は、Ollama のデータディレクトリを削除する。

```bash
rm -rf ~/.ollama
```

SpecDojo 用に作成した Modelfile 作業ディレクトリも不要なら削除する。

```bash
rm -rf ~/ollama-modelfiles
```

### 8.4. ログファイルの削除（任意）

LaunchAgent で出力していたログが不要なら削除する。

```bash
rm -f /tmp/ollama.out.log /tmp/ollama.err.log
```
