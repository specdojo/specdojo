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

- opencode から oMLX の Ornith-1.5 35B または Qwen3.6 35B-A3B を利用したい
- 2 つの opencode agent から同じモデルを並列に使いたい
- 既存の Claude、Codex、Ollama などの provider を残したまま、oMLX を追加したい

## 2. 前提条件

事前に [[tsd-omlx]] の手順で、次が完了していることを前提とする。

- Mac ホスト上の oMLX が、Admin UI で待ち受けを `0.0.0.0:8000`、API key ありに設定され、メニューバーから起動されていること
- `mlx-works/Ornith-1.5-35B-A3B-oQ4e-mtp` がダウンロード済みで、Model Alias `ornith-1.5-35b` が設定されていること
- `mlx-community/Qwen3.6-35B-A3B-4bit` がダウンロード済みで、Model Alias `qwen3.6-35b-a3b` が設定されていること
- devcontainer 内から `http://host.docker.internal:8000/v1/models` でモデル一覧を取得できること

## 3. 接続方式

`opencode.json` の custom provider で接続先を明示する。oMLX は API key が必須のため、API key の扱いが Ollama（`apiKey: "not-needed"`）と異なる。

API key は `opencode.json` に直接書かない。opencode の credential store に保存する。

1. opencode を起動し、`/connect` を実行する。
2. `Other` を選ぶ。
3. Provider ID に `omlx` を入力する。
4. API key に、Mac ホストの oMLX Admin UI で設定した API key と同じ値を入力する。

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
            "context": 65536,
            "output": 8192,
          },
          "options": {
            "chat_template_kwargs": { "enable_thinking": false },
            "top_k": 20,
            "min_p": 0.05,
            "presence_penalty": 0.0,
            "repetition_penalty": 1.0,
          },
        },
        "qwen3.6-35b-a3b": {
          "name": "Qwen3.6 35B-A3B 4bit",
          "limit": {
            "context": 131072,
            "output": 32768,
          },
          "options": {
            "chat_template_kwargs": {
              "enable_thinking": true,
              "preserve_thinking": true,
            },
            "temperature": 0.6,
            "top_p": 0.95,
            "top_k": 20,
            "min_p": 0.0,
            "presence_penalty": 0.0,
            "repetition_penalty": 1.0,
          },
        },
      },
    },
  },
}
```

`limit` の各値は次の方針で決める。

| モデル  | `limit.context` | `limit.output` | 方針                                                                                                   |
| ------- | --------------- | -------------- | ------------------------------------------------------------------------------------------------------ |
| Ornith  | 65536           | 8192           | thinking を使わないため、tool call 単位の編集にも、grade の 23 観点の判定にも十分な出力とする          |
| Qwen3.6 | 131072          | 32768          | 公式が thinking 能力の維持に推奨する 128K context と、通常の問い合わせに推奨する 32K output を確保する |

opencode は `limit.context` から `limit.output` を差し引いた量を入力に使える量とみなし、超えそうになると会話を圧縮（compaction）する。Ornith は約 57K、Qwen3.6 は約 98K を入力に使える。

### 4.3. サンプリングと thinking

各モデルのサンプリングの値と thinking の有無は、opencode の設定で指定する。oMLX はリクエストで指定された値を、Admin UI のモデル設定より優先する。Admin UI の値は、opencode を介さないリクエストのための既定値として、[[tsd-omlx]] の「モデル設定」で同じ値にそろえる。

モデル全体の値は、`opencode.json` のモデルの `options` に書く。opencode はこれをリクエストの本文へそのまま加える。Ornith は既存の実測に基づいて thinking を無効にする。Qwen3.6 は公式の agent 用推奨に従い thinking と過去ターンの thinking の保持を有効にし、precise coding tasks 向けの値を使う。

| 項目                                   | 値      | 方針                                                                                                        |
| -------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| `chat_template_kwargs.enable_thinking` | `false` | thinking を使わない。2026-10-04 の計測で、thinking ON は約3倍遅く、判定が甘く、検証の通過率も上がらなかった |
| `top_k`                                | 20      | Qwen 系の推奨値                                                                                             |
| `min_p`                                | 0.05    | 確率の低いトークンを外し、中国語の字体や崩れた語の混入を抑える                                              |
| `presence_penalty`                     | 0.0     | 上げると言語の混在が増える                                                                                  |
| `repetition_penalty`                   | 1.0     | executor の文の書き写しや、コードで同じ字句を繰り返すことを妨げないよう無効にする                           |

Qwen3.6 固有の値は次のとおり。

| 項目                                      | 値        | 方針                                                                 |
| ----------------------------------------- | --------- | -------------------------------------------------------------------- |
| `chat_template_kwargs.enable_thinking`    | `true`    | Qwen3.6 の既定動作を維持する                                         |
| `chat_template_kwargs.preserve_thinking`  | `true`    | agent の過去ターンの reasoning を保持し、重複した reasoning を減らす |
| `temperature`                             | 0.6       | precise coding tasks 向けの公式推奨値                                |
| `top_p`                                   | 0.95      | precise coding tasks 向けの公式推奨値                                |
| `top_k` / `min_p`                         | 20 / 0    | precise coding tasks 向けの公式推奨値                                |
| `presence_penalty` / `repetition_penalty` | 0.0 / 1.0 | coding での言語混在や、正当な字句の繰り返しへのペナルティを避ける    |

Qwen3.6 は、用途別の agent をまだ定義していないため、`temperature` と `top_p` もモデルの `options` に書く。agent の frontmatter とモデルの `options` の両方に `temperature` がある場合にどちらが優先されるかは確認していない。Qwen3.6 の agent を追加するときは、Ornith と同じく `temperature` と `top_p` を agent 側へ移し、モデルの `options` からは外す。

Ornith の `temperature` と `top_p` は、用途ごとに `.opencode/agents/ornith-*.md` の frontmatter で指定する。opencode は agent の値をリクエストで送る。

| agent                    | `temperature` | `top_p` | 方針                                                                                                                                                                                                                     |
| ------------------------ | ------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ornith-executor`        | 0.7           | 0.8     | Qwen 系が thinking なしで推奨する値                                                                                                                                                                                      |
| `ornith-expert-executor` | 0.3           | 0.8     | grade など厳密な出力形式を求める作業向けに、確率の低い候補を選びにくくする。grade の判定（根拠と finding）は英語で出力する。英語では日本語より判定が厳しくなり、中国語の字体が混ざらなかった（2026-10-04、検証通過 5/6） |
| `ornith-reporter`        | 0.1           | 0.8     | 渡された内容を構造化結果へ写すだけのため、ほぼ決定的にする                                                                                                                                                               |

opencode の `reasoningEffort` は、oMLX では thinking の切り替えに使われない。thinking を agent ごとに変える場合は、agent の frontmatter に `chat_template_kwargs` を書く。agent の値は `opencode.json` の値より優先される。

```yaml
chat_template_kwargs:
  enable_thinking: true
```

`.opencode/AGENTS.md` は日本語での回答を求めるが、agent の定義が出力の言語を指定する場合はそれを優先する。計測の経緯と結果は [[prj-0001:pjr-vqb5-agent-grade-comparison]] の「ornith の executor の改善（2026-10-04）」に記録している。

### 4.4. 既定のモデルにする場合

既定のモデルにする場合は、トップレベルに次を追加する。

```jsonc
{
  "model": "omlx/ornith-1.5-35b",
}
```

最初は既定のモデルにせず、`/models` から選んで、Ollama の Gemma / Qwen と比べてから決める。

Qwen3.6 を既定にする場合は、`model` を `omlx/qwen3.6-35b-a3b` にする。

## 5. 接続確認

opencode で `/models` を実行し、次のように表示されれば認識できている。

```text
oMLX
  Ornith 1.5 35B-A3B oQ4e
  Qwen3.6 35B-A3B 4bit
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

両方で同じモデル（`omlx/ornith-1.5-35b` または `omlx/qwen3.6-35b-a3b`）を選び、oMLX の Admin UI で Concurrent Requests が 2 になっていることを確認する。

## 7. 使い分け

| 担当                | 向いている作業                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ornith（oMLX）      | 既存コードの調査、小～中規模の実装、テストの修正、lint の修正、仕様 Markdown とコードの同期、単純なリファクタ、速度を優先する並列タスク                                   |
| Qwen3.6（oMLX）     | repository-level reasoning、tool call を伴う agentic coding、長めの文脈を使う実装、Ornith との品質比較                                                                    |
| Claude Code / Codex | 大規模な設計判断、複数の仕様にまたがる高度な整合性の判断、難しい根本原因の解析、大規模なリファクタの最終レビュー、セキュリティに関わる変更、ローカル LLM の結果のレビュー |

```text
Claude / Codex
      │
      ├─ 難しい設計・レビュー
      │
      └─ Orchestrator
              │
              ├─ local agent A
              └─ local agent B
```

## 8. Qwen3.8との比較

[[tsd-omlx]] の「段階的な最適化」のフェーズ1では、Ollama の Qwen3.8（[[tsd-ollama-opencode]]）と同じ実タスクで比べる。公平に比べるため、同じ commit から始める。

タスクの例は次のとおり。

1. 既存の仕様を読み、関連するコードを修正し、テストを実行して仕様の Markdown も更新する。
2. 既存のテストの失敗の原因を調べ、最小の変更で直す。
3. 3～5 ファイルにまたがる小規模な機能を追加し、テストとドキュメントまで完了する。

比較する項目は、総時間、Prompt / Prefill、Generation、thinking の量、tool call の回数、テストの成功、修正漏れ、不要な変更、人間が修正にかけた時間とする。最も重視する指標は、人間が最終的に作業を完了するまでの総時間である。

Qwen3.6 は thinking を有効にし、Thinking Budget を設定しない。同じ Qwen 系の Ornith では、grade の計測で thinking を有効にすると約3倍遅くなり、判定の質と出力形式の安定性も上がらなかった（[[prj-0001:pjr-vqb5-agent-grade-comparison]]）。agentic coding の比較では thinking の量と総時間を必ず記録する。grade など厳密な出力形式を求める用途に Qwen3.6 を使う場合は、計測してから採否を決める。

## 9. 運用上の注意

### 9.1. model 名の整合

`opencode.json` の `models` のキーは、oMLX の Model Alias（`ornith-1.5-35b`、`qwen3.6-35b-a3b`）と一致させる。一致しない場合、Chat Completions のリクエストがエラーになる。alias を変えた場合は、`opencode.json` も合わせて更新する。

### 9.2. API key の管理

API key は opencode の credential store に保存する。Mac ホストでは oMLX が `~/.omlx/settings.json` に永続化するため、このファイルや API key を `opencode.json`、Git、またはリポジトリ内のファイルに書かない。

### 9.3. oMLX の起動確認

Mac ホスト側で oMLX が止まっていると、devcontainer からの接続はタイムアウトになる。接続できない場合は、Mac ホスト側で次を確認する。

- メニューバーで oMLX サーバーが起動中であること
- Admin UI のサーバー全体の設定で、待ち受けが `0.0.0.0`、ポートが `8000`、API key が設定済みであること
- 設定変更後にメニューバーからサーバーを再起動したこと
- Mac ホストで、[[tsd-omlx]] の「devcontainerからの接続」の確認を接続先 `http://127.0.0.1:8000` で実行し、モデル一覧を取得できること（API key は `read -s` で読み込み、確認後に `unset` で破棄する）
- devcontainer が Docker Desktop 上で動いていること
- `host.docker.internal` を名前解決できること: `getent hosts host.docker.internal`

## 10. 参照

- [[tsd-omlx]]
- [[tsd-ollama-opencode]]
- <https://github.com/TomLeeLive/jundot-omlx>
- <https://huggingface.co/mlx-community/Qwen3.6-35B-A3B-4bit>
- <https://huggingface.co/Qwen/Qwen3.6-35B-A3B>
- <https://jacar.es/en/omlx-api-key-port-endpoints/>
