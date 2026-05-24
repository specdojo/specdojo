---
id: tsd-local-llm
type: architecture
status: draft
rulebook: tsd-rulebook
---

# ローカルLLM 技術スタック定義

SpecDojoでは、ドキュメント作成、コード生成、レビューなどでLLMを活用することを想定しており、ローカルでLLMを実行する環境の構築も技術スタックの一部として定義する。なお、ローカルLLMの使用については必須ではない。

## 1. ローカルLLM実行環境

Ollamaを想定。以下、macOSでの設定と常駐のさせ方をまとめる。LinuxやWindowsでの設定については、今後追記予定。

## 2. ローカルLLMの選定

| 用途                           | 推奨モデル                                 |
| ------------------------------ | ------------------------------------------ |
| Markdown設計書の作成・レビュー | **Gemma 4 26B A4B** または **Gemma 4 31B** |
| 軽めの設計書整理・要約         | **Gemma 4 E4B**                            |
| コーディング                   | **Qwen3-Coder** または **Gemma 4 31B**     |
| 日本語の自然な文章化           | Gemma 4 / Qwen3 の両方を比較               |
| 最終判断・難しい設計レビュー   | Claude Code / Codex                        |

## 3. メモリ安定化設定

複数Agentを使う場合、重いモデルを常時複数ロードしない方が安定するため、環境変数を設定して Ollama を起動する運用を採用する。

```bash
export OLLAMA_KEEP_ALIVE=10m
export OLLAMA_MAX_LOADED_MODELS=2
```

LLAMA_MAX_LOADED_MODELS=2 にしておくと、重いモデルの同時常駐を抑えやすくなる。

但し、macOSで常駐させる場合は、Homebrew serviceの起動方法では環境変数を渡せないため、LaunchAgentを作成して環境変数を渡す方法を採用する（次章参照）。

## 4. macOSでの設定と常駐のさせ方

homebrewでインストールした後、起動は以下のコマンドをターミナルで実行することを推奨されますが、環境変数を渡す方法をまとめる。

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

## 5. モデルのチューニング（コンテキスト長を分けたモデルを作成）

複数Agent運用前提のため、すべてのモデルを巨大コンテキストで動かさない設定を適用。
Host Mac で以下のディレクトリを作成して、そこに以下のモデルファイルを作成する。

```bash
mkdir -p ~/ollama-modelfiles
cd ~/ollama-modelfiles
```

### Gemma 4 E4B 軽量常駐用

`gemma4-e4b-8k/Modelfile`：

```text
FROM gemma4:e4b
PARAMETER num_ctx 8192
PARAMETER temperature 0.3
```

作成：

```bash
ollama create gemma4:e4b-8k -f gemma4-e4b-8k/Modelfile
```

### Gemma 4 26B 設計書レビュー用

`gemma4-26b-32k/Modelfile`：

```text
FROM gemma4:26b
PARAMETER num_ctx 32768
PARAMETER temperature 0.2
```

作成：

```bash
ollama create gemma4:26b-32k -f gemma4-26b-32k/Modelfile
```

### Gemma 4 31B 深い設計レビュー専用

`gemma4-31b-32k/Modelfile`：

```text
FROM gemma4:31b
PARAMETER num_ctx 32768
PARAMETER temperature 0.2
```

作成：

```bash
ollama create gemma4:31b-32k -f gemma4-31b-32k/Modelfile
```

### Qwen3-Coder 30B コーディング用

`qwen3-coder-30b-32k/Modelfile`：

```text
FROM qwen3-coder:30b
PARAMETER num_ctx 32768
PARAMETER temperature 0.2
```

作成：

```bash
ollama create qwen3-coder:30b-32k -f qwen3-coder-30b-32k/Modelfile
```

### Qwen3-Coder 30B 複数コーディング用

`qwen3-coder-30b-64k/Modelfile`：

```text
FROM qwen3-coder:30b
PARAMETER num_ctx 65536
PARAMETER temperature 0.2
```

作成：

```bash
ollama create qwen3-coder:30b-64k -f qwen3-coder-30b-64k/Modelfile
```

### Qwen3-Coder 30B 主力レビュー用

`qwen3-coder-30b-128k/Modelfile`：

```text
FROM qwen3-coder:30b
PARAMETER num_ctx 131072
PARAMETER temperature 0.2
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.05
```

作成：

```bash
ollama create qwen3-coder:30b-128k -f qwen3-coder-30b-128k/Modelfile
```

### Qwen3-Coder 30B 横断レビュー用

`qwen3-coder-30b-256k/Modelfile`：

```text
FROM qwen3-coder:30b
PARAMETER num_ctx 262144
PARAMETER temperature 0.2
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.05
```

作成：

```bash
ollama create qwen3-coder:30b-256k -f qwen3-coder-30b-256k/Modelfile
```

### 動作確認

```bash
ollama run gemma4:e4b-8k "短い設計書のタイトル案を3つ出してください。"
```

```bash
ollama run gemma4:26b-32k "Markdown設計書レビューの観点を箇条書きで出してください。"
```

```bash
ollama run gemma4:31b-32k "Markdown設計書の深いレビュー観点を列挙してください。"
```

```bash
ollama run qwen3-coder:30b-32k "TypeScriptのテスト設計の観点を出してください。"
ollama run qwen3-coder:30b-64k "TypeScriptのテスト設計の観点を出してください。"
ollama run qwen3-coder:30b-128k "TypeScriptのテスト設計の観点を出してください。"
ollama run qwen3-coder:30b-256k "TypeScriptのテスト設計の観点を出してください。"
```
