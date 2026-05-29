---
id: tsd-vllm-mlx-opencode
type: architecture
status: draft
rulebook: tsd-rulebook
part_of:
  - tsd-index
based_on:
  - tsd-vllm-mlx
---

# vllm-mlx の opencode 接続定義

本書では、[tsd-vllm-mlx](tsd-vllm-mlx.md) の単一モデル構成を前提に、opencode 側の設定方法を定義する。

## 1. 位置付け

本構成は、Host Mac 上で動く vllm-mlx を devcontainer 内の opencode から利用するための接続定義である。vllm-mlx は OpenAI互換の `/v1/*` API と Anthropic互換の `/v1/messages` API を提供できるが、SpecDojo の opencode 連携では既存の custom provider 方式に合わせて OpenAI互換 API を標準とする。

本書の対象は以下とする。

- opencode からローカル LLM を利用したい
- vllm-mlx の単一モデル構成を前提にしたい
- `opencode.json` の custom provider で接続したい

## 2. 前提条件

事前に [tsd-vllm-mlx](tsd-vllm-mlx.md) の手順で、Host Mac 上の vllm-mlx が起動していることを前提とする。SpecDojo の標準構成では `--served-model-name default` を付けて起動するため、OpenAI互換 API の `model` には `default` を指定する。

安定優先の単一モデル構成では、まず `--continuous-batching` を付けずに起動する。continuous batching は複数リクエストの処理効率を上げるための検証用オプションであり、単一リクエストでの通常生成が安定してから有効化する。

devcontainer 内から Host Mac に接続するため、接続先は `localhost` ではなく `host.docker.internal` を使う。

まず、devcontainer のターミナルで疎通確認する。

```bash
curl http://host.docker.internal:8000/v1/models
```

`data[0].id` に `default` が見えていれば、本書の設定値をそのまま使える。別の ID が返る場合は、以後の `model` 設定をその ID に合わせる。

## 3. 接続方式

opencode では、OpenAI のビルトイン provider に `OPENAI_BASE_URL` を渡す方式ではなく、`opencode.json` の custom provider を使って接続先を明示する。これは、OpenAI 本家 API とローカル OpenAI互換 endpoint を役割分離するためである。

このため、以下の環境変数は opencode 接続の必須条件ではない。

```bash
export OPENAI_BASE_URL=http://host.docker.internal:8000/v1
export OPENAI_API_KEY=not-needed
```

これらは OpenAI SDK 互換ツール向けには有効だが、opencode では `opencode.json` の provider 設定を優先して管理する。

## 4. `opencode.json` 設定

### 4.1. provider 追加方針

既存の `ollama-local` provider を置き換えるのではなく、`vllm-mlx-local` を追加して併存させる。これにより、ローカル LLM の切り替えを `model` と `small_model` の差し替えだけで行える。

`baseURL` は OpenAI互換 API のルートである `http://host.docker.internal:8000/v1` を指定する。Chat Completions の個別 URL である `/v1/chat/completions` を直接書かない。

### 4.2. 設定例

`opencode.json` の provider に以下を追加する。

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "vllm-mlx-local": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "vllm-mlx Local",
      "options": {
        "baseURL": "http://host.docker.internal:8000/v1",
        "apiKey": "not-needed",
      },
      "models": {
        "default": {
          "name": "Qwen3.6 27B 4bit - vllm-mlx",
        },
      },
    },
  },
  "model": "vllm-mlx-local/default",
  "small_model": "vllm-mlx-local/default",
}
```

`small_model` も同じモデルにしているのは、SpecDojo の vllm-mlx 標準構成が単一モデル運用だからである。軽量用途だけ Ollama に戻したい場合は、`small_model` だけ `ollama-local/gemma4:e4b-8k` に切り替えてよい。

## 5. 接続確認

設定後は、まず API 側が応答することを確認する。

```bash
curl http://host.docker.internal:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer not-needed" \
  -d '{
    "model": "default",
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

### 6.1. `model` 名の整合

vllm-mlx を `--served-model-name default` なしで起動すると、OpenAI互換 API の `model` 名がモデルパスや別 ID になることがある。その場合は `curl http://host.docker.internal:8000/v1/models` の結果に合わせて、`opencode.json` の `models` キーと `model` / `small_model` を変更する。

### 6.2. continuous batching は初期設定にしない

本書は [tsd-vllm-mlx](tsd-vllm-mlx.md) の安定優先な単一モデル構成を前提にする。そのため、起動コマンドに `--continuous-batching` を最初から含めない。continuous batching は複数リクエストが待ち行列に入る状況で効果を発揮するが、単発利用では恩恵が小さい一方で、スケジューリングや stream 管理が複雑になる。

複数 agent から同時利用する検証が必要な場合だけ、単一リクエストでの通常生成が安定してから段階的に有効化する。

### 6.3. 疎通確認は短い非 stream リクエストから始める

初回確認では、短いプロンプトと小さい `max_tokens` を使い、`stream: false` を明示する。長い履歴や大きい `max_tokens` のまま opencode から実行すると、初回トークンまでの待ち時間が長くなり、vllm-mlx / MLX 側の不安定さを切り分けにくくなる。

### 6.4. server abort が出る場合

回答生成後に server が abort し、`There is no Stream(gpu, 2) in current thread.` のような例外が出る場合は、opencode の provider 設定ミスではなく、vllm-mlx またはその下の MLX / Metal ランタイム側の stream cleanup 問題を疑う。まず以下の順で切り分ける。

- `--continuous-batching` を外して再起動する
- `curl` で `stream: false` の短いリクエストを確認する
- opencode 側でも短い質問から試す
- `uv tool upgrade vllm-mlx` で更新する

安定運用を優先する場合は、continuous batching を無効のままにし、短めの応答上限で運用する。

### 6.5. Model Registry 構成とは分ける

本書は単一モデル構成専用である。用途別モデルを `model` 名で切り替えたい場合は、[tsd-vllm-mlx-mr](tsd-vllm-mlx-mr.md) の Model Registry 構成を参照する。ただし、Model Registry は単一モデル構成より不安定になりやすいため、通常運用の第一候補にはしない。

## 7. 参照

- [tsd-vllm-mlx](tsd-vllm-mlx.md)
- [tsd-vllm-mlx-mr](tsd-vllm-mlx-mr.md)
