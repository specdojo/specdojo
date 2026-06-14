---
id: sysd-opencode-agent-settings
type: project
status: draft
rulebook: sysd-rulebook
part_of:
  - sysd-agent-settings
based_on:
  - tsd-ollama-opencode
---

# OpenCode エージェント設定（Ollama）

SpecDojo CLI と OpenCode を組み合わせ、Ollama のローカルLLMでマルチエージェント実行を行うための設定・構成を定義する。

## 1. 設計方針

共通の責務分担、実行フロー、割り当て、失敗処理、worktree は [エージェント共通設定](sysd-agent-settings.md) に従う。本書では OpenCode と Ollama 固有の設定だけを定義する。

本設計では OpenCode の provider を `ollama-local` に限定する。API key と外部クラウドLLMを必要としない一方、ホスト側 Ollama の稼働状態、モデルロード時間、メモリ容量が制約になる。

- **非対話実行は `opencode run`**: TUI を起動せず、SpecDojo が生成した plan を標準入力で渡す。
- **provider とモデル一覧は `opencode.json`**: 実際に利用可能なローカルモデルをプロジェクト設定として共有する。
- **agent 定義は `.opencode/agents/*.md`**: モデル、primary / subagent、permission、システムプロンプトを分離する。
- **共通ルールは project root の `AGENTS.md` を基本とする**: `.opencode/AGENTS.md` を使う場合は `opencode.json` の `instructions` に明示する。
- **permission を安全境界とする**: edit agent は必要な編集操作を許可し、review agent は `edit: deny` とする。
- **モデルは用途別に分担する**: 通常 edit、長文 review、軽作業、重い実装にモデルを割り当てる。

## 2. 責務分担

3層の共通責務は親設計に従う。OpenCode agent は、OpenCode 固有の permission、モデル、agent 定義を使用して plan を処理する。Ollama はモデルのロード、推論、OpenAI 互換 API の提供だけを担い、タスク管理やファイル編集は行わない。

## 3. 全体フロー

```text
specdojo exec run
   → member.command の opencode run --agent <name> を起動
   → plan を標準入力で渡す
   → OpenCode agent が成果物または result を編集
   → OpenCode CLI の終了状態を共通フローへ返す
```

edit / review の選択と終了後の状態遷移は親設計に従う。

## 4. ディレクトリ構成

```text
repo-root/
├─ opencode.json                       # provider・モデル・プロジェクト設定
├─ AGENTS.md                           # OpenCodeを含む共通プロジェクトルール（推奨）
├─ .opencode/
│  ├─ AGENTS.md                        # instructions で明示して使うOpenCode固有ルール
│  └─ agents/
│     ├─ edit-agent.md                 # 通常 edit primary agent
│     ├─ review-agent.md               # 通常 review primary agent
│     ├─ light-edit-agent.md           # 軽作業用 primary agent（任意）
│     └─ expert-edit-agent.md          # 重い実装用 primary agent（任意）
```

OpenCode の設定は複数箇所からマージされる。主な優先順は remote config、global config、`OPENCODE_CONFIG`、project root の `opencode.json`、`.opencode/`、`OPENCODE_CONFIG_CONTENT` の順で、後の設定が競合キーを上書きする。

SpecDojo の project management 配下と worktree の共通構成は親設計を参照する。

## 5. `opencode.json` 設定

### 5.1. 現在の実設定

プロジェクト直下の [opencode.json](../../../../opencode.json) は、Ollama provider、利用可能モデル、グローバルデフォルトモデルを定義している。

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama-local": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama Local",
      "options": {
        "baseURL": "http://host.docker.internal:11434/v1",
        "apiKey": "not-needed"
      },
      "models": {
        "qwen3.6:27b-mlx-work-32k": {
          "name": "Qwen3.6 27B-MLX 通常作業用 (32k)"
        },
        "qwen3.6:27b-mlx-work-64k": {
          "name": "Qwen3.6 27B-MLX レビュー・長文用 (64k)"
        },
        "gemma4:e4b-light-8k": {
          "name": "Gemma 4 E4B 軽作業用 (8k)"
        },
        "qwen3.6:27b-coding-mxfp8-64k": {
          "name": "Qwen3.6 27B Coding MXFP8 重い実装用 (64k)"
        }
      }
    }
  },
  "model": "ollama-local/qwen3.6:27b-mlx-work-64k"
}
```

### 5.2. provider 設計

| 項目     | 設定値                                  | 意図                                         |
| -------- | --------------------------------------- | -------------------------------------------- |
| provider | `ollama-local`                          | 外部 provider と区別するプロジェクト内識別子 |
| npm      | `@ai-sdk/openai-compatible`             | Ollama の OpenAI互換 API を利用              |
| baseURL  | `http://host.docker.internal:11434/v1`  | devcontainer からホスト側 Ollama に接続      |
| apiKey   | `not-needed`                            | SDKの必須項目を満たすダミー値                |
| model    | `ollama-local/qwen3.6:27b-mlx-work-64k` | agent 未指定時の長文対応デフォルト           |

ホスト外や Linux ホストで実行する場合は、`host.docker.internal` の名前解決と Ollama の listen address を別途確認する。

### 5.3. モデル分担

| モデルID                       | 用途                 | agent 例            | 注意点                           |
| ------------------------------ | -------------------- | ------------------- | -------------------------------- |
| `qwen3.6:27b-mlx-work-32k`     | 通常の文書作成・編集 | `edit-agent`        | 通常作業の標準                   |
| `qwen3.6:27b-mlx-work-64k`     | 長文読解・レビュー   | `review-agent`      | 現在のグローバルデフォルト       |
| `gemma4:e4b-light-8k`          | 要約・整形・軽作業   | `light-edit-agent`  | 長文・複雑な判断には使用しない   |
| `qwen3.6:27b-coding-mxfp8-64k` | 重い実装・修正       | `expert-edit-agent` | メモリ使用量とロード時間が大きい |

### 5.4. 推奨する追加設定

`.opencode/AGENTS.md` を共通指示として利用し、利用可能 provider をローカル Ollama に限定する場合は、次の設定を `opencode.json` に追加する。

```jsonc
{
  "instructions": [".opencode/AGENTS.md"],
  "enabled_providers": ["ollama-local"],
  "share": "disabled",
  "autoupdate": "notify",
}
```

`instructions` がない現在の実設定では、`.opencode/AGENTS.md` は自動読込対象ではない。project root の `AGENTS.md` を作るか、上記設定を追加する必要がある。

## 6. 共通指示の設計

OpenCode は project root から上位方向に `AGENTS.md` を探索する。project root に `AGENTS.md` がある場合は、それをプロジェクト共通ルールの正本とする。

OpenCode 固有ルールを `.opencode/AGENTS.md` に分離する場合は、`opencode.json` の `instructions` で明示的に読み込む。`instructions` で指定したファイルは `AGENTS.md` と結合される。

共通指示は次の内容に限定する。

- 言語、命名、Markdown frontmatter の規則
- 変更前に読むべき設計書と既存パターン
- 渡された plan だけを実行する SpecDojo ワークフロー
- result ファイルへの done criteria 記録
- `.env`、secrets、破壊的操作、`git push` の禁止
- 利用可能なモデルIDと用途

現在の `.opencode/AGENTS.md` に記載された `gemma4:e4b`、`gemma4:26b`、`qwen3-coder:30b` は `opencode.json` のモデルIDと一致しないため、agent 運用開始前に5.3節のモデルIDへ更新する。

## 7. `.opencode/agents/` エージェント定義

OpenCode の project agent は `.opencode/agents/<name>.md` に定義する。ファイル名が `--agent` で指定する agent 名になる。YAML frontmatter に agent 設定、本文にシステムプロンプトを記述する。

### 7.1. frontmatter フィールド

| フィールド    | 必須 | 説明                                                            |
| ------------- | ---- | --------------------------------------------------------------- |
| `description` | ○    | agent の用途と選択条件                                          |
| `mode`        | -    | `primary` / `subagent` / `all`。SpecDojo 直接起動では `primary` |
| `model`       | -    | `provider/model-id`。省略時はグローバルモデル                   |
| `temperature` | -    | 出力のランダム性                                                |
| `permission`  | -    | `allow` / `ask` / `deny` またはコマンド別パターン               |
| `steps`       | -    | agent の最大ステップ数                                          |

`tools` は非推奨のため、新規設定では `permission` を使用する。

### 7.2. `edit-agent.md`

通常 edit agent は `qwen3.6:27b-mlx-work-32k` を使用する。SpecDojo が plan を渡すため、agent 自身は scheduler、claim、complete、block を実行しない。

```markdown
---
description: SpecDojo の edit plan を1件実行する通常作業エージェント。
mode: primary
model: ollama-local/qwen3.6:27b-mlx-work-32k
temperature: 0.2
permission:
  read: allow
  glob: allow
  grep: allow
  list: allow
  bash: allow
  edit: allow
  webfetch: deny
  websearch: deny
  external_directory: deny
---

Read the SpecDojo plan provided in the prompt.
Implement only that task, verify the done criteria, and update the result file.
Do not claim, complete, or block tasks directly.
```

### 7.3. `review-agent.md`

review agent は長文対応モデルを使用し、成果物を変更しない。SpecDojo の result ファイルだけを更新できるよう、`edit` permission をパス単位で許可する。

```markdown
---
description: SpecDojo の review plan を多観点で検証するレビューエージェント。
mode: primary
model: ollama-local/qwen3.6:27b-mlx-work-64k
temperature: 0.1
permission:
  read: allow
  glob: allow
  grep: allow
  list: allow
  bash: allow
  edit:
    '*': deny
    'docs/ja/projects/**/execution/exec/results/**': allow
  webfetch: deny
  websearch: deny
  external_directory: deny
---

Read the review plan and target deliverables.
Report findings by severity with evidence. Do not modify deliverables.
```

### 7.4. エージェント一覧

| ファイル名             | `--agent` 指定名    | mode      | モデル                         | 用途                 |
| ---------------------- | ------------------- | --------- | ------------------------------ | -------------------- |
| `edit-agent.md`        | `edit-agent`        | `primary` | `qwen3.6:27b-mlx-work-32k`     | 通常 edit            |
| `review-agent.md`      | `review-agent`      | `primary` | `qwen3.6:27b-mlx-work-64k`     | 長文 review          |
| `light-edit-agent.md`  | `light-edit-agent`  | `primary` | `gemma4:e4b-light-8k`          | 軽い要約・整形       |
| `expert-edit-agent.md` | `expert-edit-agent` | `primary` | `qwen3.6:27b-coding-mxfp8-64k` | 重い実装・複雑な修正 |

## 8. エージェント割り当て設定

### 8.1. `pm-members.yaml`

`pm-members.yaml` の `command` を `specdojo exec run` が直接起動する。現在の設定は通常 edit / review の2メンバーである。

```yaml
members:
  - nickname: opencode-edit-agent
    type: agent
    mode: edit
    proficiency: normal
    capabilities: []
    command: 'opencode run --agent edit-agent'
    scheduler_strategy: critical-first

  - nickname: opencode-review-agent
    type: agent
    mode: review
    proficiency: normal
    capabilities: []
    command: 'opencode run --agent review-agent'
    scheduler_strategy: fifo
```

ローカルLLM agent は外部 Web 検索を使わないため `capabilities: []` とする。重い実装用 agent を追加する場合は `proficiency: expert` の member と `.opencode/agents/expert-edit-agent.md` を同時に追加する。

### 8.2. `sch-strategy-<track>.yaml`

phase の共通契約は親設計に従う。ローカル LLM agent は外部 Web 検索を提供しないため `capabilities: []` とし、重い実装用 agent を要求する場合は `proficiency: expert` を指定する。

### 8.3. `.specdojo/exec-defaults.yaml`

共通の retry / fallback / block 方針は親設計に従う。Ollama では API rate limit より、モデルロード待ち、メモリ不足、接続タイムアウトが主な失敗要因になる。待機時間を延長する場合や `try_next` を有効にする場合は、同じ mode と proficiency に適合する代替 member を定義する。

グローバルな rate limit 検出設定は [exec-defaults.yaml](../../../../.specdojo/exec-defaults.yaml) に定義する。現在は `rate limit` と `429` を検出する。Ollama のタイムアウトをフォールバック対象にする場合は、誤検出範囲を確認してから stderr pattern を追加する。

### 8.4. 実行コマンド

共通の実行コマンドは親設計を参照する。OpenCode agent を明示する場合は `specdojo exec run --by opencode-edit-agent` を使用する。

## 9. 非対話実行とセッション

`opencode run [message..]` は非対話実行用コマンドである。`--agent` で primary agent、`--model` で一時的なモデル、`--format json` で raw JSON event 出力を指定できる。

```bash
opencode run \
  --agent edit-agent \
  --format json \
  "SpecDojo plan を実行してください"
```

`--dangerously-skip-permissions` は明示的に deny していない permission を自動承認するため、SpecDojo の通常運用では使用しない。必要な操作は agent 定義の `permission` で allow / deny を明確にする。

## 10. `opencode serve` 常駐モード

`opencode run` は実行ごとにローカル backend と MCP server を起動する。起動コストを削減する場合は `opencode serve` を常駐させ、`opencode run --attach` で接続する。

```bash
export OPENCODE_SERVER_PASSWORD='<secret>'
opencode serve --hostname 127.0.0.1 --port 4096

opencode run \
  --attach http://127.0.0.1:4096 \
  --username opencode \
  --password "${OPENCODE_SERVER_PASSWORD}" \
  --agent edit-agent \
  "SpecDojo plan を実行してください"
```

常駐 server は loopback に限定し、共有環境では `OPENCODE_SERVER_PASSWORD` を設定する。モデル本体の保持・アンロードは Ollama 側の設定にも依存する。

## 11. worktree 分離セットアップ

worktree のライフサイクル、配置、ブランチ名、イベントファイル名は親設計に従う。OpenCode の edit agent を並列実行する場合は worktree を使用し、成果物を変更しない review agent では不要とする。

## 12. 現状差分と導入順序

| 項目                    | 現状                                          | 導入時の対応                                       |
| ----------------------- | --------------------------------------------- | -------------------------------------------------- |
| `opencode.json`         | provider・4モデル・デフォルトモデルを定義済み | 必要に応じて `instructions` と provider 制限を追加 |
| `.opencode/AGENTS.md`   | 存在するがモデルIDが実設定と不一致            | モデル用途を5.3節へ合わせて更新                    |
| `.opencode/agents/*.md` | 未作成                                        | edit / review agent を作成                         |
| `pm-members.yaml`       | edit / review の command を定義済み           | agent ファイル作成後に実行確認                     |
| `exec-defaults.yaml`    | `rate limit` / `429` を検出                   | Ollama固有エラーを必要に応じて追加                 |

導入は `AGENTS.md` 読込方法の確定、agent ファイル作成、`opencode agent list` による認識確認、単一タスク実行、並列実行の順で進める。

## 13. 公式仕様参照

- [OpenCode Config](https://opencode.ai/docs/config/)
- [OpenCode Agents](https://opencode.ai/docs/agents/)
- [OpenCode Rules](https://opencode.ai/docs/rules/)
- [OpenCode CLI](https://opencode.ai/docs/cli/)
