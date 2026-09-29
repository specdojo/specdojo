---
specdojo:
  id: tsd-omlx-opencode
  type: architecture
  status: draft
  rulebook: specdojo:tsd-rulebook
  part_of:
    - tsd-index
  based_on:
    - tsd-omlx
---

# oMLX の opencode 接続定義

本書では、[[tsd-omlx]] の構成を前提に、devcontainer 内の opencode から Mac ホスト上の oMLX を利用するための設定方法を定義する。

## 1. 位置付け

oMLX は OpenAI 互換の `/v1/*` API を提供する。SpecDojo の opencode 連携では、`opencode.json` の custom provider 方式で OpenAI 互換 API に接続する。Ollama への接続（[[tsd-ollama-opencode]]）と同じ方式であり、両方の provider を併存させられる。

本書の対象は次のとおり。

- opencode から oMLX の Ornith-1.5 35B を利用したい
- 2 つの opencode agent から同じモデルを並列に使いたい
- 既存の Claude、Codex、Ollama などの provider を残したまま、oMLX を追加したい

## 2. 前提条件

事前に [[tsd-omlx]] の手順で、次が完了していることを前提とする。

- Mac ホスト上の oMLX が、`0.0.0.0:8000` で API key を付けて起動していること
- `mlx-works/Ornith-1.5-35B-A3B-oQ4e-mtp` がダウンロード済みで、Model Alias `ornith-1.5-35b` が設定されていること
- devcontainer 内から `http://host.docker.internal:8000/v1/models` でモデル一覧を取得できること

## 3. 接続方式

`opencode.json` の custom provider で接続先を明示する。oMLX は API key が必須のため、API key の扱いが Ollama（`apiKey: "not-needed"`）と異なる。

API key は `opencode.json` に直接書かない。opencode の credential store に保存する。

1. opencode を起動し、`/connect` を実行する。
2. `Other` を選ぶ。
3. Provider ID に `omlx` を入力する。
4. API key に、Mac ホストで設定した `OMLX_API_KEY` と同じ値を入力する。

## 4. `opencode.json` 設定

### 4.1. provider 追加方針

既存の provider を置き換えず、`omlx` を追加して併存させる。Provider ID は、`/connect` で入力した値（`omlx`）と一致させる。

`baseURL` は OpenAI 互換 API のルートである `http://host.docker.internal:8000/v1` を指定する。Chat Completions の個別の URL（`/v1/chat/completions`）は書かない。

### 4.2. 設定例

プロジェクトの `opencode.json` の `provider` に、次を追加する。既存の設定へ merge する。

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "omlx": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "oMLX",
      "options": {
        "baseURL": "http://host.docker.internal:8000/v1",
      },
      "models": {
        "ornith-1.5-35b": {
          "name": "Ornith 1.5 35B-A3B oQ4e",
          "limit": {
            "context": 32768,
            "output": 8192,
          },
        },
      },
    },
  },
}
```

`limit.context` は、[[tsd-omlx]] のモデル設定の Max Context Window（32768）に合わせる。

### 4.3. 既定のモデルにする場合

既定のモデルにする場合は、トップレベルに次を追加する。

```jsonc
{
  "model": "omlx/ornith-1.5-35b",
}
```

最初は既定のモデルにせず、`/models` から選んで、Ollama の Gemma / Qwen と比べてから決める。

## 5. 接続確認

opencode で `/models` を実行し、次のように表示されれば認識できている。

```text
oMLX
  Ornith 1.5 35B-A3B oQ4e
```

次に、tool call を伴う短い依頼で動作を確かめる。

1. ファイルの読み取り: 「このリポジトリの package.json を読んで、npm test で実行されるコマンドだけ答えてください。」
2. shell の実行: 「npm test を実行してください。失敗した場合は原因だけ報告し、まだファイルは修正しないでください。」

ファイルの読み取り、shell の実行、tool call、reasoning、最終回答が正しく分かれていればよい。

失敗した場合は、まず [[tsd-omlx]] の「devcontainerからの接続」の `curl` による確認に戻る。`curl` が通らない状態で opencode 側だけを調べても、切り分けにならない。

## 6. 2つのagentの並列実行

2 つの opencode を、別々の worktree で起動する。同じ作業ツリーを 2 つの agent で同時に編集しない。

```bash
cd /workspaces/specdojo-workspace/worktrees/task-a
opencode
```

```bash
cd /workspaces/specdojo-workspace/worktrees/task-b
opencode
```

両方で `omlx/ornith-1.5-35b` を選び、oMLX の Admin UI で Concurrent Requests が 2 になっていることを確認する。

## 7. 使い分け

| 担当                | 向いている作業                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ornith（oMLX）      | 既存コードの調査、小～中規模の実装、テストの修正、lint の修正、仕様 Markdown とコードの同期、リポジトリ内の検索、単純なリファクタ、バックグラウンドの agent、並列のタスク |
| Claude Code / Codex | 大規模な設計判断、複数の仕様にまたがる高度な整合性の判断、難しい根本原因の解析、大規模なリファクタの最終レビュー、セキュリティに関わる変更、Ornith の結果のレビュー       |

```text
Claude / Codex
      │
      ├─ 難しい設計・レビュー
      │
      └─ Orchestrator
              │
              ├─ Ornith agent A
              └─ Ornith agent B
```

## 8. Qwen3.8との比較

[[tsd-omlx]] の「段階的な最適化」のフェーズ1では、Ollama の Qwen3.8（[[tsd-ollama-opencode]]）と同じ実タスクで比べる。公平に比べるため、同じ commit から始める。

タスクの例は次のとおり。

1. 既存の仕様を読み、関連するコードを修正し、テストを実行して仕様の Markdown も更新する。
2. 既存のテストの失敗の原因を調べ、最小の変更で直す。
3. 3～5 ファイルにまたがる小規模な機能を追加し、テストとドキュメントまで完了する。

比較する項目は、総時間、Prompt / Prefill、Generation、thinking の量、tool call の回数、テストの成功、修正漏れ、不要な変更、人間が修正にかけた時間とする。最も重視する指標は、人間が最終的に作業を完了するまでの総時間である。

## 9. 運用上の注意

### 9.1. model 名の整合

`opencode.json` の `models` のキーは、oMLX の Model Alias（`ornith-1.5-35b`）と一致させる。一致しない場合、Chat Completions のリクエストがエラーになる。alias を変えた場合は、`opencode.json` も合わせて更新する。

### 9.2. API key の管理

API key は opencode の credential store と、Mac ホストのシェルの環境変数だけに置く。`opencode.json` や、リポジトリ内のファイルに書かない。

### 9.3. oMLX の起動確認

Mac ホスト側で oMLX が止まっていると、devcontainer からの接続はタイムアウトになる。接続できない場合は、Mac ホスト側で次を確認する。

- oMLX が起動していること: `curl http://127.0.0.1:8000/v1/models`
- `0.0.0.0` で待ち受けていること
- devcontainer が Docker Desktop 上で動いていること
- `host.docker.internal` を名前解決できること: `getent hosts host.docker.internal`

## 10. 参照

- [[tsd-omlx]]
- [[tsd-ollama-opencode]]
