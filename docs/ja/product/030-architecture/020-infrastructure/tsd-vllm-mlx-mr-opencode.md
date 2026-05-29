---
id: tsd-vllm-mlx-mr-opencode
type: architecture
status: draft
rulebook: tsd-rulebook
part_of:
  - tsd-index
based_on:
  - tsd-vllm-mlx-mr
---

# vllm-mlx Model Registry の opencode 接続定義

本書では、[tsd-vllm-mlx-mr](tsd-vllm-mlx-mr.md) の Model Registry 構成を前提に、opencode 側の接続方法を定義する。

## 1. 位置付け

本構成は、Host Mac 上で動く vllm-mlx の Model Registry を devcontainer 内の opencode から利用するための接続定義である。単一モデル構成とは異なり、opencode 側から `model` 名を切り替えることで、用途別の論理モデルを使い分ける。

本書の対象は以下とする。

- opencode からローカル LLM を利用したい
- 1つの base URL で用途別モデルを切り替えたい
- `opencode.json` の custom provider で接続したい
- Model Registry 構成の不安定さを許容できる

安定運用の第一候補は [tsd-vllm-mlx-opencode](tsd-vllm-mlx-opencode.md) の単一モデル構成である。本書は用途別モデル切り替えが必要な場合の検証構成とする。

## 2. 前提条件

事前に [tsd-vllm-mlx-mr](tsd-vllm-mlx-mr.md) の手順で、Host Mac 上の vllm-mlx Model Registry が起動していることを前提とする。SpecDojo の検証構成では、少なくとも以下の論理モデル名が `/v1/models` に公開される。

- `code`
- `markdown`
- `markdown-fast`

devcontainer 内から Host Mac に接続するため、接続先は `localhost` ではなく `host.docker.internal` を使う。

まず、devcontainer のターミナルで疎通確認する。

```bash
curl http://host.docker.internal:8000/v1/models
```

返却されるモデル ID が `code`、`markdown`、`markdown-fast` と一致していることを確認する。異なる ID を使う場合は、以後の `opencode.json` の `models` 定義をその値に合わせる。

## 3. 接続方式

opencode では、OpenAI のビルトイン provider に `OPENAI_BASE_URL` を渡す方式ではなく、`opencode.json` の custom provider を使って接続先を明示する。これは OpenAI 本家 API とローカル OpenAI互換 endpoint を分離し、利用可能な論理モデル名を明示的に管理するためである。

このため、以下の環境変数は opencode 接続の必須条件ではない。

```bash
export OPENAI_BASE_URL=http://host.docker.internal:8000/v1
export OPENAI_API_KEY=not-needed
```

これらは OpenAI SDK 互換ツール向けには有効だが、opencode では `opencode.json` の provider 設定を優先して管理する。

## 4. `opencode.json` 設定

### 4.1. provider 追加方針

既存の `ollama-local` や単一モデル向けの `vllm-mlx-local` を置き換えるのではなく、Model Registry 専用の `vllm-mlx-registry` を追加して併存させる。これにより、`model` と `small_model` を差し替えるだけで単一モデル構成と Registry 構成を切り替えられる。

`baseURL` は OpenAI互換 API のルートである `http://host.docker.internal:8000/v1` を指定する。Chat Completions の個別 URL である `/v1/chat/completions` を直接書かない。

### 4.2. 設定例

`opencode.json` の provider に以下を追加する。

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "vllm-mlx-registry": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "vllm-mlx Registry",
      "options": {
        "baseURL": "http://host.docker.internal:8000/v1",
        "apiKey": "not-needed",
      },
      "models": {
        "code": {
          "name": "Qwen3.6 27B 4bit - Coding",
        },
        "markdown": {
          "name": "Gemma 4 26B A4B - Markdown Review",
        },
        "markdown-fast": {
          "name": "Gemma 4 E4B - Fast Markdown",
        },
      },
    },
  },
  "model": "vllm-mlx-registry/code",
  "small_model": "vllm-mlx-registry/markdown-fast",
}
```

`model` は標準の編集系 agent 用に `code` を使う。`small_model` は軽い要約や整理用に `markdown-fast` を使う。Gemma 4 系モデルの相性問題を避けたい場合は、`small_model` も `vllm-mlx-registry/code` に揃えてよい。

### 4.3. 設定方針

Registry 構成では、各 agent が使うモデル名を論理名で揃える。論理名は vllm-mlx の `models.yaml` と `opencode.json` の両方で一致していなければならない。

基本方針:

- `code` を標準の編集系モデルにする
- `markdown-fast` を軽量用途の初期値にする
- `markdown` は品質比較や重いレビュー用途でのみ使う
- Gemma 4 系で不安定な場合は `code` に寄せる

## 5. 接続確認

設定後は、まず API 側が応答することを確認する。

```bash
curl http://host.docker.internal:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer not-needed" \
  -d '{
    "model": "code",
    "messages": [
      {"role": "user", "content": "短く疎通確認してください。"}
    ],
    "max_tokens": 32,
    "stream": false
  }'
```

次に、`markdown-fast` でも短い確認を行う。

```bash
curl http://host.docker.internal:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer not-needed" \
  -d '{
    "model": "markdown-fast",
    "messages": [
      {"role": "user", "content": "短く疎通確認してください。"}
    ],
    "max_tokens": 32,
    "stream": false
  }'
```

その後、opencode 側で対象モデルが使われるように実行する。

```bash
opencode run --agent edit-agent "SpecDojo task を1件実行してください"
```

失敗時は、まず `curl` の疎通確認に戻る。`curl` が通らない状態で opencode 側だけを調べても切り分けにならない。

## 6. 運用上の注意

### 6.1. 論理モデル名を厳密に合わせる

Model Registry 構成では、OpenAI互換 API に公開される `model` 名は物理パスではなく論理モデル名になる。`models.yaml` の `name` と `opencode.json` の `models` キー、および `model` / `small_model` の指定は一致していなければならない。

### 6.2. Gemma 4 系は初期設定で batching を有効化しない

[tsd-vllm-mlx-mr](tsd-vllm-mlx-mr.md) の通り、Gemma 4 系モデルは batching patch との相性で不安定になることがある。`models.yaml` の Gemma 4 系モデルでは `continuous_batching: false` を初期値にし、起動コマンドでも `--continuous-batching` を付けない。

### 6.3. 疎通確認は短い非 stream リクエストから始める

初回確認では、短いプロンプトと小さい `max_tokens` を使い、`stream: false` を明示する。長い履歴や大きい `max_tokens` のまま opencode から実行すると、どの論理モデルで不安定なのか切り分けにくくなる。

### 6.4. `model=None` の 500 は Registry 特有の症状として切り分ける

生成後に `ChatCompletionResponse` の `model` が `None` になり、`Input should be a valid string` で 500 になる場合は、推論後の OpenAI互換レスポンス生成で論理モデル名が引き継がれていない。まず `uv tool upgrade vllm-mlx` を実行し、それでも再現する場合は Registry 構成を中断して単一モデル構成へ戻す。

### 6.5. server abort が出る場合

回答生成後に server が abort し、`There is no Stream(gpu, 2) in current thread.` のような例外が出る場合は、opencode の provider 設定ミスではなく、vllm-mlx またはその下の MLX / Metal ランタイム側の stream cleanup 問題を疑う。まず以下の順で切り分ける。

- `curl` で `stream: false` の短いリクエストを各論理モデルで確認する
- Gemma 4 系モデルの利用を一時的に止め、`code` だけに寄せる
- `uv tool upgrade vllm-mlx` で更新する
- 安定しない場合は単一モデル構成へ戻す

### 6.6. 安定運用の第一候補にはしない

Model Registry は複数モデルを1プロセスで切り替えられる一方で、単一モデル構成よりもレスポンス生成処理やモデル固有実装の影響を受けやすい。通常運用では [tsd-vllm-mlx-opencode](tsd-vllm-mlx-opencode.md) の単一モデル構成を優先し、本書は用途別モデル切り替えが必要な場合だけ使う。

## 7. 参照

- [tsd-vllm-mlx-mr](tsd-vllm-mlx-mr.md)
- [tsd-vllm-mlx-opencode](tsd-vllm-mlx-opencode.md)
