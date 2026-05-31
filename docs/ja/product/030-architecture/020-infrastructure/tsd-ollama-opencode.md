---
id: tsd-ollama-opencode
type: architecture
status: draft
rulebook: tsd-rulebook
part_of:
  - tsd-index
based_on:
  - tsd-ollama
---

# Ollama の opencode 接続定義

本書では、[tsd-ollama](tsd-ollama.md) の複数モデル構成を前提に、opencode 側の設定方法を定義する。

## 1. 位置付け

本構成は、Host Mac 上で動く Ollama を devcontainer 内の opencode から利用するための接続定義である。Ollama は OpenAI互換の `/v1/*` API を提供しており、SpecDojo の opencode 連携では `opencode.json` の custom provider 方式に合わせて OpenAI互換 API を標準とする。

本書の対象は以下とする。

- opencode からローカル LLM（Ollama）を利用したい
- [tsd-ollama](tsd-ollama.md) の複数モデル構成を前提にしたい
- `opencode.json` の custom provider で接続したい

## 2. 前提条件

事前に [tsd-ollama](tsd-ollama.md) の手順で以下が完了していることを前提とする。

- Host Mac 上の Ollama が起動していること
- 利用するモデルがダウンロード済みであること
- 用途別の派生モデル（`qwen3.6:27b-mlx-work-32k`、`qwen3.6:27b-mlx-work-64k`、`gemma4:e4b-light-8k`、`qwen3.6:27b-coding-mxfp8-64k`）が作成済みであること

devcontainer 内から Host Mac に接続するため、接続先は `localhost` ではなく `host.docker.internal` を使う。

まず、devcontainer のターミナルで疎通確認する。

```bash
curl http://host.docker.internal:11434/v1/models
```

`data` 配列に作成済みモデルが含まれていれば、本書の設定値をそのまま使える。モデルが見えない場合は、Host Mac 側で `ollama list` を実行してモデルが存在することを確認する。

## 3. 接続方式

opencode では、`OLLAMA_HOST` 環境変数を渡す方式ではなく、`opencode.json` の custom provider を使って接続先を明示する。これにより、OpenAI 本家 API とローカル Ollama endpoint を役割分離できる。

このため、以下の環境変数は opencode 接続の必須条件ではない。

```bash
export OLLAMA_HOST=http://host.docker.internal:11434
```

これは `ollama` CLI 向けには有効だが、opencode では `opencode.json` の provider 設定を優先して管理する。

## 4. `opencode.json` 設定

### 4.1. provider 追加方針

既存の provider を置き換えるのではなく、`ollama-local` を追加して併存させる。これにより、ローカル LLM の切り替えを `model` と `small_model` の差し替えだけで行える。

`baseURL` は OpenAI互換 API のルートである `http://host.docker.internal:11434/v1` を指定する。Chat Completions の個別 URL である `/v1/chat/completions` を直接書かない。

### 4.2. 設定例

`opencode.json` の provider に以下を追加する。

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama-local": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama Local",
      "options": {
        "baseURL": "http://host.docker.internal:11434/v1",
        "apiKey": "not-needed",
      },
      "models": {
        "qwen3.6:27b-mlx-work-32k": {
          "name": "Qwen3.6 27B-MLX コンテキスト節約用 (32k)",
        },
        "qwen3.6:27b-mlx-work-64k": {
          "name": "Qwen3.6 27B-MLX 常用 (64k)",
        },
        "gemma4:e4b-light-8k": {
          "name": "Gemma 4 E4B 軽作業用 (8k)",
        },
        "qwen3.6:27b-coding-mxfp8-64k": {
          "name": "Qwen3.6 27B Coding MXFP8 重い実装用 (64k)",
        },
      },
    },
  },
  "model": "ollama-local/qwen3.6:27b-mlx-work-64k",
  "small_model": "ollama-local/gemma4:e4b-light-8k",
}
```

常用は `qwen3.6:27b-mlx-work-64k` とし、`small_model` には軽作業向けの `gemma4:e4b-light-8k` を割り当てる。重い実装が必要な作業では、`model` を `ollama-local/qwen3.6:27b-coding-mxfp8-64k` に一時的に切り替え、完了後は `ollama-local/qwen3.6:27b-mlx-work-64k` へ戻す。

## 5. 接続確認

設定後は、まず API 側が応答することを確認する。確認には軽量モデルを使い、初回ロード時間を抑える。

```bash
curl http://host.docker.internal:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer not-needed" \
  -d '{
    "model": "gemma4:e4b-light-8k",
    "messages": [
      {"role": "user", "content": "短く疎通確認してください。"}
    ],
    "max_tokens": 32,
    "stream": false
  }'
```

次に、opencode 側で対象モデルが使われるように実行する。

```bash
opencode run --agent edit-agent "SpecDojo task を1件実行してください"
```

失敗時は、まず `curl` の疎通確認に戻る。`curl` が通らない状態で opencode 側だけを調べても切り分けにならない。

## 6. 運用上の注意

### 6.1. model 名の整合

Ollama のカスタムモデル名は `ollama list` で確認できる。`opencode.json` の `models` キーは Ollama が認識するモデル名と一致させる必要がある。名前が一致しない場合は Chat Completions リクエストがエラーになる。モデルを再作成した場合も名前を合わせて `opencode.json` を更新する。

### 6.2. 重い実装用モデルへの切り替え

`qwen3.6:27b-mlx-work-64k` を常用の `model` とする。同ベースの `qwen3.6:27b-mlx-work-32k` への切り替えコストは低いが、コンテキスト長が問題にならない限り常用で使い続ける。

`qwen3.6:27b-coding-mxfp8-64k` は容量が大きく、ロードに時間がかかる。通常作業中に常駐させると `OLLAMA_MAX_LOADED_MODELS=2` の制約を圧迫する。重い実装が必要な作業でだけ `model` を `ollama-local/qwen3.6:27b-coding-mxfp8-64k` に切り替え、完了後は `ollama-local/qwen3.6:27b-mlx-work-64k` へ戻す。

### 6.3. 疎通確認は短い非 stream リクエストから始める

初回確認では、短いプロンプトと小さい `max_tokens` を使い、`stream: false` を明示する。長い履歴や大きい `max_tokens` のまま opencode から実行すると、初回トークンまでの待ち時間が長くなり、Ollama 側の問題を切り分けにくくなる。

### 6.4. Ollama の起動確認

Host Mac 側で Ollama が停止していると、devcontainer からの接続がタイムアウトになる。接続できない場合は、Host Mac 側で以下を確認する。

- Ollama が起動していること: `curl http://localhost:11434/api/tags`
- モデルが存在すること: `ollama list`
- devcontainer が Docker Desktop 上で動作していること
- `host.docker.internal` が名前解決できること: `getent hosts host.docker.internal`

## 7. 参照

- [tsd-ollama](tsd-ollama.md)
- [tsd-vllm-mlx-opencode](tsd-vllm-mlx-opencode.md)
