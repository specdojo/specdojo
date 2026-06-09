---
id: sysd-opencode-agent-settings
type: project
status: draft
rulebook: sysd-rulebook
based_on:
  - tsd-ollama-opencode
---

# OpenCode エージェント設定（Ollama）

SpecDojo CLI と OpenCode を組み合わせ、Ollama のローカルLLMでマルチエージェント実行を行うための設定・構成を定義する。

## 1. 設計方針

SpecDojo・OpenCode・`specdojo exec run` の3層に責務を分割し、それぞれの関心事を分離する。

- **SpecDojo CLI**: タスク管理（validate / build / claim / complete / block）とエージェント起動制御
- **OpenCode agent**: plan の解釈・関連文書の読解・成果物の編集またはレビュー
- **`specdojo exec run`**: フェーズ順序・並列数・worktree・フォールバックの制御

本設計では OpenCode の provider を `ollama-local` に限定する。API key と外部クラウドLLMを必要としない一方、ホスト側 Ollama の稼働状態、モデルロード時間、メモリ容量が制約になる。

- **非対話実行は `opencode run`**: TUI を起動せず、SpecDojo が生成した plan を標準入力で渡す。
- **provider とモデル一覧は `opencode.json`**: 実際に利用可能なローカルモデルをプロジェクト設定として共有する。
- **agent 定義は `.opencode/agents/*.md`**: モデル、primary / subagent、permission、システムプロンプトを分離する。
- **共通ルールは project root の `AGENTS.md` を基本とする**: `.opencode/AGENTS.md` を使う場合は `opencode.json` の `instructions` に明示する。
- **permission を安全境界とする**: edit agent は必要な編集操作を許可し、review agent は `edit: deny` とする。
- **モデルは用途別に分担する**: 通常 edit、長文 review、軽作業、重い実装にモデルを割り当てる。
- **phase 要件で割り当てる**: `mode`・`capabilities`・`proficiency` に応じて担当 agent を選択する。
- **並列 edit は worktree で分離する**: タスクごとに作業ツリーを分け、Git 競合を防ぐ。

## 2. 責務分担

| 層                  | 責務                                                                                                                  | 責務外                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| SpecDojo CLI        | validate / build / ready 抽出 / claim / complete / block / lock / CPM / worktree 管理・エージェント起動（`exec run`） | タスク内容の理解・成果物の編集     |
| OpenCode agent      | plan の解釈・関連ドキュメントの読解・成果物の編集・done criteria の確認                                               | タスク取得の排他制御・並列起動制御 |
| `specdojo exec run` | フェーズ順序制御・並列数・worktree 割り当て・rate limit フォールバック                                                | タスク管理ロジック・成果物の編集   |
| Ollama              | モデルのロード・推論・OpenAI互換 API の提供                                                                           | タスク管理・ファイル編集           |

## 3. 全体フロー

```text
schedule yaml（owner・phase・difficulty・execution を定義）
   ↓
specdojo exec build
   ↓
generated/ready.json / exec/plans/<task-id>-plan.md
   ↓
[edit]   specdojo exec run --auto --loop --parallel 3
         → exec run が result ファイルを scaffold 生成
         → plan を標準入力で opencode run --agent edit-agent に渡す
         → edit-agent が成果物と result を編集
         → 終了コード 0 → exec complete / 終了コード 1 → exec block

[review] specdojo exec run --auto
         → phase.mode: review と phase の要件から member を選択
         → plan を標準入力で opencode run --agent review-agent に渡す
         → review-agent が成果物を変更せず result に所見を記録
```

OpenCode agent 自身が scheduler でタスクを claim する構成にはしない。claim・plan scaffold・complete / block は `specdojo exec run` が管理し、agent は渡された1件の plan だけを処理する。

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
└─ docs/ja/projects/prj-0001/030-project-management/
   ├─ 020-organization/pm-members.yaml
   ├─ schedule/sch-strategy-<track>.yaml
   └─ execution/
      ├─ exec/plans/
      ├─ exec/results/
      └─ generated/
```

OpenCode の設定は複数箇所からマージされる。主な優先順は remote config、global config、`OPENCODE_CONFIG`、project root の `opencode.json`、`.opencode/`、`OPENCODE_CONFIG_CONTENT` の順で、後の設定が競合キーを上書きする。

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

| 項目       | 設定値                                      | 意図                                                |
| ---------- | ------------------------------------------- | --------------------------------------------------- |
| provider   | `ollama-local`                              | 外部 provider と区別するプロジェクト内識別子        |
| npm        | `@ai-sdk/openai-compatible`                 | Ollama の OpenAI互換 API を利用                     |
| baseURL    | `http://host.docker.internal:11434/v1`      | devcontainer からホスト側 Ollama に接続             |
| apiKey     | `not-needed`                                | SDKの必須項目を満たすダミー値                        |
| model      | `ollama-local/qwen3.6:27b-mlx-work-64k`     | agent 未指定時の長文対応デフォルト                  |

ホスト外や Linux ホストで実行する場合は、`host.docker.internal` の名前解決と Ollama の listen address を別途確認する。

### 5.3. モデル分担

| モデルID                           | 用途                 | agent 例             | 注意点                         |
| ---------------------------------- | -------------------- | -------------------- | ------------------------------ |
| `qwen3.6:27b-mlx-work-32k`         | 通常の文書作成・編集 | `edit-agent`         | 通常作業の標準                 |
| `qwen3.6:27b-mlx-work-64k`         | 長文読解・レビュー   | `review-agent`       | 現在のグローバルデフォルト     |
| `gemma4:e4b-light-8k`              | 要約・整形・軽作業   | `light-edit-agent`   | 長文・複雑な判断には使用しない |
| `qwen3.6:27b-coding-mxfp8-64k`     | 重い実装・修正       | `expert-edit-agent`  | メモリ使用量とロード時間が大きい |

### 5.4. 推奨する追加設定

`.opencode/AGENTS.md` を共通指示として利用し、利用可能 provider をローカル Ollama に限定する場合は、次の設定を `opencode.json` に追加する。

```jsonc
{
  "instructions": [".opencode/AGENTS.md"],
  "enabled_providers": ["ollama-local"],
  "share": "disabled",
  "autoupdate": "notify"
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

| フィールド    | 必須 | 説明                                                                 |
| ------------- | ---- | -------------------------------------------------------------------- |
| `description` | ○    | agent の用途と選択条件                                               |
| `mode`        | -    | `primary` / `subagent` / `all`。SpecDojo 直接起動では `primary`      |
| `model`       | -    | `provider/model-id`。省略時はグローバルモデル                        |
| `temperature` | -    | 出力のランダム性                                                     |
| `permission`  | -    | `allow` / `ask` / `deny` またはコマンド別パターン                    |
| `steps`       | -    | agent の最大ステップ数                                               |

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
    "*": deny
    "docs/ja/projects/**/execution/exec/results/**": allow
  webfetch: deny
  websearch: deny
  external_directory: deny
---

Read the review plan and target deliverables.
Report findings by severity with evidence. Do not modify deliverables.
```

### 7.4. エージェント一覧

| ファイル名              | `--agent` 指定名   | mode      | モデル                             | 用途                     |
| ----------------------- | ------------------ | --------- | ---------------------------------- | ------------------------ |
| `edit-agent.md`         | `edit-agent`       | `primary` | `qwen3.6:27b-mlx-work-32k`         | 通常 edit                |
| `review-agent.md`       | `review-agent`     | `primary` | `qwen3.6:27b-mlx-work-64k`         | 長文 review              |
| `light-edit-agent.md`   | `light-edit-agent` | `primary` | `gemma4:e4b-light-8k`              | 軽い要約・整形           |
| `expert-edit-agent.md`  | `expert-edit-agent`| `primary` | `qwen3.6:27b-coding-mxfp8-64k`     | 重い実装・複雑な修正     |

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
    command: "opencode run --agent edit-agent"
    scheduler_strategy: critical-first

  - nickname: opencode-review-agent
    type: agent
    mode: review
    proficiency: normal
    capabilities: []
    command: "opencode run --agent review-agent"
    scheduler_strategy: fifo
```

ローカルLLM agent は外部 Web 検索を使わないため `capabilities: []` とする。重い実装用 agent を追加する場合は `proficiency: expert` の member と `.opencode/agents/expert-edit-agent.md` を同時に追加する。

### 8.2. `sch-strategy-<track>.yaml`

```yaml
phase_sets:
  first-pass:
  - id: enrich
    mode: edit
    proficiency: normal

  finalize-pass:
  - id: align
    mode: edit
    proficiency: normal
```

### 8.3. `.specdojo/exec-defaults.yaml`

```yaml
rate_limit_policy:
  on_non_critical:
    action: skip
  on_critical:
    action: try_next
    retry:
      max_attempts: 3
      initial_wait_seconds: 60
      backoff_multiplier: 2
      max_wait_seconds: 600
    on_exhausted: block
```

Ollama では API rate limit より、モデルロード待ち、メモリ不足、接続タイムアウトが主な失敗要因になる。`try_next` を有効にする場合は、同じ mode と proficiency に適合する代替 member を定義する。

グローバルな rate limit 検出設定は [exec-defaults.yaml](../../../../.specdojo/exec-defaults.yaml) に定義する。現在は `rate limit` と `429` を検出する。Ollama のタイムアウトをフォールバック対象にする場合は、誤検出範囲を確認してから stderr pattern を追加する。

### 8.4. 実行コマンド

```bash
# 1バッチ実行
specdojo exec run --auto --parallel 3

# ready タスクがなくなるまで実行
specdojo exec run --auto --loop --parallel 3

# OpenCode agent を明示して実行
specdojo exec run --by opencode-edit-agent
```

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

複数 edit agent を並列実行する場合はタスクごとに worktree を作成する。review agent は成果物を変更しない構成のため、原則として worktree 分離を不要とする。

| タイミング          | 操作                                                        |
| ------------------- | ----------------------------------------------------------- |
| claim 時            | `git worktree add ../worktrees/<task-id> -b exec/<task-id>` |
| complete / block 時 | `git worktree remove ../worktrees/<task-id>`                |

```bash
TASK_ID=T-ARC-base-arch-010
git worktree add ../worktrees/${TASK_ID} -b exec/${TASK_ID}
cd ../worktrees/${TASK_ID}
opencode run --agent edit-agent "SpecDojo task ${TASK_ID} を実行してください"
git worktree remove ../worktrees/${TASK_ID}
```

イベントファイル名は `<timestamp>-<by>-<task-id>-<event-type>.json` とし、worktree 間の衝突を防ぐ。

## 12. 現状差分と導入順序

| 項目                         | 現状                                         | 導入時の対応                                      |
| ---------------------------- | -------------------------------------------- | ------------------------------------------------- |
| `opencode.json`              | provider・4モデル・デフォルトモデルを定義済み | 必要に応じて `instructions` と provider 制限を追加 |
| `.opencode/AGENTS.md`        | 存在するがモデルIDが実設定と不一致           | モデル用途を5.3節へ合わせて更新                   |
| `.opencode/agents/*.md`      | 未作成                                       | edit / review agent を作成                        |
| `pm-members.yaml`            | edit / review の command を定義済み          | agent ファイル作成後に実行確認                    |
| `exec-defaults.yaml`         | `rate limit` / `429` を検出                  | Ollama固有エラーを必要に応じて追加                |

導入は `AGENTS.md` 読込方法の確定、agent ファイル作成、`opencode agent list` による認識確認、単一タスク実行、並列実行の順で進める。

## 13. 公式仕様参照

- [OpenCode Config](https://opencode.ai/docs/config/)
- [OpenCode Agents](https://opencode.ai/docs/agents/)
- [OpenCode Rules](https://opencode.ai/docs/rules/)
- [OpenCode CLI](https://opencode.ai/docs/cli/)
