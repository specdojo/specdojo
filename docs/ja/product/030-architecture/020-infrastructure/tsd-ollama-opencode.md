---
specdojo:
  id: tsd-ollama-opencode
  type: architecture
  status: draft
  rulebook: specdojo:tsd-rulebook
  part_of:
    - tsd-index
  based_on:
    - tsd-ollama
  grade:
    rubric: grade-rubric-v1
    target: deliverable
    verdict: needs-work
    score: 84
    graded_at: "2026-09-14T00:52:34.197Z"
    graded_by: gemma-expert-executor
    content_hash: 6a2e8a914c823d523d7a196b491bdce4f73bed40bda70d055f7f15823711f4cd
    categories:
      consistency: { score: 100 }
      usability: { score: 75 }
      architecture: { score: 100 }
      quality: { score: 67 }
    viewpoints:
      vp-arc-cross-document-consistency: { level: 4, score: 100 }
      vp-arc-conciseness: { level: 4, score: 100 }
      vp-arc-single-responsibility: { level: 4, score: 100 }
      vp-qe-done-criteria: { level: 2, score: 50 }
      vp-qe-verifiability: { level: 2, score: 50 }
      vp-qe-omissions-consistency: { level: 4, score: 100 }
      vp-ux-readability: { level: 2, score: 50 }
      vp-ux-user-flow: { level: 4, score: 100 }
      vp-ux-language-consistency: { level: 2, score: 50 }
      vp-arc-document-structure: { level: 4, score: 100 }
      vp-qe-config-validity: { level: 4, score: 100 }
    findings: { blocker: 0, major: 4, minor: 0, note: 0 }
    done_criteria:
      satisfied: 4
      total: 5
      unsatisfied:
        DC-004: [QE]
      detail_ref: tsd-ollama-opencode-grade-criteria
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
- 用途別の派生モデル（`qwen3.8:27b-mlx-work-64k`、`gemma4:31b-mlx-work-64k`、`gemma4:e4b-mlx-light-8k`）が作成済みであること

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
        "qwen3.8:27b-mlx-work-64k": {
          "name": "Qwen3.8 27B-MLX 常用 (64k)",
        },
        "gemma4:31b-mlx-work-64k": {
          "name": "Gemma 4 31B-MLX 常用 (64k)",
        },
        "gemma4:e4b-mlx-light-8k": {
          "name": "Gemma 4 E4B 軽作業用 (8k)",
        },
      },
    },
  },
  "model": "ollama-local/qwen3.8:27b-mlx-work-64k",
  "small_model": "ollama-local/gemma4:e4b-mlx-light-8k",
}
```

agent ごとに Qwen 3.8 または Gemma 4 を明示して選ぶ。expert agent は同じモデルタグに `reasoningEffort: high` を指定して thinking を有効化する。

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

同一の `opencode` provider では `max_concurrency: 1` を維持し、Qwen と Gemma が同時にロードされないようにする。モデル別 agent は名前で明示して選択し、thinking 用の派生モデルタグは作成しない。

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

<!-- specdojo:finding id=F001 severity=major rule=vp-qe-done-criteria line=141 検証用コマンドのモデル名に誤記があり、完了条件 DC-004 を十分に満たしていない。 -->
<!-- specdojo:finding id=F002 severity=major rule=vp-qe-verifiability line=141 検証用コマンドのモデル名 (`gemma4:e4b-light-8k`) が, 4.2節で定義したモデル名 (`gemma4:e4b-mlx-light-8k`) と不整合であり、そのままでは動作しない。 -->
<!-- specdojo:finding id=F003 severity=major rule=vp-ux-readability line=141 検証用コマンドのモデル名に誤記があり、正しく疎通確認が行えないため, 読者に誤解を招く。 -->
<!-- specdojo:finding id=F004 severity=major rule=vp-ux-language-consistency line=141 4.2節で定義した `gemma4:e4b-mlx-light-8k` と、109行目の `gemma4:e4b-light-8k` で表記が揺れており、不整合が生じている。 -->
