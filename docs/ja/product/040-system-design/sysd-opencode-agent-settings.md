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

複数モデルを同時にロードするとメモリを圧迫するため、本設計ではローカルLLMを `qwen3.6:27b-mlx-work-64k` の1モデルに統一し、すべての agent でこのモデルを使用する。

コンテキスト長は 64k とする。fully-guided の磨き込みタスクは rulebook / recipe と `depends_on` 成果物、対象成果物をまとめて読み込むため、32k では作業セットが収まらず agent がツール呼び出しに至らないまま終了（result 未記入のまま exit 0）する事象が確認された。64k にして作業セットに余裕を持たせる。ただし KV キャッシュは 32k 比でおおよそ倍のメモリを消費するため、ホスト側 Ollama の空きメモリを前提として確認する。

- **非対話実行は `opencode run`**: TUI を起動せず、SpecDojo が生成した plan を標準入力で渡す。
- **provider とモデル一覧は `opencode.json`**: 実際に利用可能なローカルモデルをプロジェクト設定として共有する。
- **agent 定義は `.opencode/agents/*.md`**: モデル、primary / subagent、permission、最小限の実行契約を定義する。タスク固有の指示は edit / review plan を正本とする。
- **共通ルールは project root の `AGENTS.md` を基本とする**: `.opencode/AGENTS.md` を使う場合は `opencode.json` の `instructions` に明示する。
- **permission を安全境界とする**: edit agent は必要な編集操作を許可し、review agent は result ファイル以外の編集を禁止する。
- **モデルは単一に統一する**: メモリ圧迫を避けるため、edit / review いずれの agent も `qwen3.6:27b-mlx-work-64k` を使用する。

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
│     ├─ opencode-edit-agent.md        # 通常 edit primary agent
│     └─ opencode-review-agent.md      # 通常 review primary agent
```

OpenCode の設定は複数箇所からマージされる。主な優先順は remote config、global config、`OPENCODE_CONFIG`、project root の `opencode.json`、`.opencode/`、`OPENCODE_CONFIG_CONTENT` の順で、後の設定が競合キーを上書きする。

SpecDojo の project management 配下と worktree の共通構成は親設計を参照する。

## 5. `opencode.json` 設定

### 5.1. 現在の実設定

プロジェクト直下の `opencode.json` を provider、利用モデル、グローバルデフォルトモデルの正本とする。本書には設定値の意図だけを記載し、JSON 全文は重複させない。

実際のファイル: `opencode.json`

### 5.2. provider 設計

| 項目     | 設定値                                  | 意図                                         |
| -------- | --------------------------------------- | -------------------------------------------- |
| provider | `ollama-local`                          | 外部 provider と区別するプロジェクト内識別子 |
| npm      | `@ai-sdk/openai-compatible`             | Ollama の OpenAI互換 API を利用              |
| baseURL  | `http://host.docker.internal:11434/v1`  | devcontainer からホスト側 Ollama に接続      |
| apiKey   | `not-needed`                            | SDKの必須項目を満たすダミー値                |
| model    | `ollama-local/qwen3.6:27b-mlx-work-64k` | agent 未指定時のデフォルト（統一モデル）     |

ホスト外や Linux ホストで実行する場合は、`host.docker.internal` の名前解決と Ollama の listen address を別途確認する。

### 5.3. 使用モデル

複数モデルの同時ロードによるメモリ圧迫を避けるため、edit / review を含むすべての用途で単一モデルを使用する。

| モデルID                   | 用途                           | agent 例                                        | 注意点                                      |
| -------------------------- | ------------------------------ | ----------------------------------------------- | ------------------------------------------- |
| `qwen3.6:27b-mlx-work-64k` | 文書作成・編集・レビューの全般 | `opencode-edit-agent` / `opencode-review-agent` | 全 agent 共通。これ以外のモデルは併用しない |

### 5.4. 追加設定方針

利用可能 provider をローカル Ollama に限定する場合は、`opencode.json` の `enabled_providers` に `ollama-local` を指定する。共有無効化、更新通知、追加 instruction ファイルの読込も同ファイルで管理する。

`.opencode/AGENTS.md` は自動読込対象ではないため、使用する場合は `instructions` に明示する。現在は project root の `AGENTS.md` を共通ルールの正本とする。

## 6. 共通指示の設計

OpenCode は project root から上位方向に `AGENTS.md` を探索する。project root に `AGENTS.md` がある場合は、それをプロジェクト共通ルールの正本とする。

OpenCode 固有ルールを `.opencode/AGENTS.md` に分離する場合は、`opencode.json` の `instructions` で明示的に読み込む。`instructions` で指定したファイルは `AGENTS.md` と結合される。

共通指示は次の内容に限定する。

- 言語、命名、Markdown frontmatter の規則
- 変更前に読むべき設計書と既存パターン
- 渡された plan だけを実行する SpecDojo ワークフロー
- result ファイルへの done criteria 記録
- `.env`、secrets、破壊的操作、`git push` の禁止

モデルと permission は agent 定義に置き、SpecDojo exec の具体的な処理手順は edit / review plan に置く。`AGENTS.md` や agent 定義へタスク固有の手順を重複記載しない。

## 7. `.opencode/agents/` エージェント定義

OpenCode の project agent は `.opencode/agents/<name>.md` に定義する。ファイル名が `--agent` で指定する agent 名になる。YAML frontmatter に agent 設定、本文にシステムプロンプトを記述する。

本文は、標準入力で渡された plan に従うこと、agent 自身で claim / complete / block を行わないこと、事実を捏造しないことだけを定める。対象成果物、owner 観点、result の記入方法、検証、正常・異常終了条件は plan に記載する。

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

### 7.2. `opencode-edit-agent.md`

通常 edit agent は exec plan に従って成果物と result を更新する。モデル、permission、最小実行契約は agent 定義ファイル、タスク固有の処理手順は exec plan を正本とする。

実際のファイル: `.opencode/agents/opencode-edit-agent.md`

主な安全境界は次のとおり。

- `.env` と `secrets` の読み取りを禁止する。
- `git push`、`git reset --hard`、`git clean`、`rm` を禁止する。
- Web 検索と検索結果の参照を許可し、外部ディレクトリとsubagentの利用を禁止する。
- agent 自身による claim、complete、block を禁止する。

### 7.3. `opencode-review-agent.md`

通常 review agent は review plan に従って成果物を検証し、成果物を変更せず result に所見と判定を記録する。モデル、permission、最小実行契約は agent 定義ファイル、タスク固有の処理手順は review plan を正本とする。

実際のファイル: `.opencode/agents/opencode-review-agent.md`

主な安全境界は次のとおり。

- 成果物の編集を禁止し、`docs/ja/projects/**/execution/exec/results/**` だけを編集可能とする。
- bash は Git の参照系コマンド、Markdown lint、`specdojo exec validate` だけを許可する。
- `.env` と `secrets` の読み取りを禁止する。Web 検索と検索結果の参照を許可し、外部ディレクトリとsubagentの利用を禁止する。
- 全基準を確認できない場合は pass または approve と判定しない。

### 7.4. エージェント一覧

| ファイル名                 | `--agent` 指定名        | mode      | モデル                     | 用途        |
| -------------------------- | ----------------------- | --------- | -------------------------- | ----------- |
| `opencode-edit-agent.md`   | `opencode-edit-agent`   | `primary` | `qwen3.6:27b-mlx-work-64k` | 通常 edit   |
| `opencode-review-agent.md` | `opencode-review-agent` | `primary` | `qwen3.6:27b-mlx-work-64k` | 通常 review |

## 8. エージェント割り当て設定

### 8.1. `pm-members.yaml`

`pm-members.yaml` の `command` を `specdojo exec run` が直接起動する。agent 定義のファイル名と `--agent` の指定名を一致させる。

```yaml
members:
  - nickname: opencode-edit-agent
    type: agent
    mode: edit
    proficiency: normal
    priority: 1
    capabilities: [web_search]
    command: "opencode run --agent opencode-edit-agent"
    scheduler_strategy: critical-first

  - nickname: opencode-review-agent
    type: agent
    mode: review
    proficiency: normal
    priority: 1
    capabilities: [web_search]
    command: "opencode run --agent opencode-review-agent"
    scheduler_strategy: fifo
```

OpenCode agent は `websearch` と `webfetch` を利用できるため、`capabilities: [web_search]` とする。normal taskでは、Web検索の要否にかかわらず `priority: 1` によりOpenCodeを最初の候補とする。すべてのOpenCode memberは統一モデル `qwen3.6:27b-mlx-work-64k` を使用する。

### 8.2. `sch-strategy-<track>.yaml`

phase の共通契約は親設計に従う。外部Web検索が必要なphaseは `capabilities: [web_search]` とし、OpenCode agentも候補に含める。本設計では全agentが単一モデルを共有するため、`proficiency` でモデルを切り替える運用は行わない。

### 8.3. `.specdojo/exec-defaults.yaml`

共通の retry / fallback / block 方針は親設計に従う。Ollama では API rate limit より、モデルロード待ち、メモリ不足、接続タイムアウトが主な失敗要因になる。待機時間を延長する場合や `try_next` を有効にする場合は、同じ mode と proficiency に適合する代替 member を定義する。

グローバルな rate limit 検出設定は `.specdojo/exec-defaults.yaml` に定義する。現在は `rate limit` と `429` を検出する。Ollama のタイムアウトをフォールバック対象にする場合は、誤検出範囲を確認してから stderr pattern を追加する。

実際のファイル: `.specdojo/exec-defaults.yaml`

### 8.4. 実行コマンド

共通の実行コマンドは親設計を参照する。OpenCode agent を明示する場合は `specdojo exec run --by opencode-edit-agent` を使用する。

## 9. 非対話実行とセッション

`opencode run [message..]` は非対話実行用コマンドである。`--agent` で primary agent、`--model` で一時的なモデル、`--format json` で raw JSON event 出力を指定できる。

```bash
opencode run \
  --agent opencode-edit-agent \
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
  --agent opencode-edit-agent \
  "SpecDojo plan を実行してください"
```

常駐 server は loopback に限定し、共有環境では `OPENCODE_SERVER_PASSWORD` を設定する。モデル本体の保持・アンロードは Ollama 側の設定にも依存する。

## 11. worktree 分離セットアップ

worktree のライフサイクル、配置、ブランチ名、イベントファイル名は親設計に従う。OpenCode の edit agent を並列実行する場合は worktree を使用し、成果物を変更しない review agent では不要とする。

## 12. 現状差分と導入順序

| 項目                    | 現状                                             | 対応                                                |
| ----------------------- | ------------------------------------------------ | --------------------------------------------------- |
| `opencode.json`         | provider・単一モデル・デフォルトモデルを定義済み | 必要に応じて `instructions` と provider 制限を追加  |
| `AGENTS.md`             | project root に共通ルールを定義済み              | OpenCode 固有指示を追加する場合だけ別ファイルを参照 |
| `.opencode/agents/*.md` | edit / review agent を定義済み                   | `opencode debug agent <name>` で認識を確認          |
| `pm-members.yaml`       | `opencode-*-agent` の command を定義済み         | 単一タスク実行で起動を確認                          |
| `exec-defaults.yaml`    | `rate limit` / `429` を検出                      | Ollama 固有エラーを必要に応じて追加                 |

導入確認は agent 認識確認、`pm-members.yaml` の command 更新、単一タスク実行、並列実行の順で行う。

## 13. 公式仕様参照

- [OpenCode Config](https://opencode.ai/docs/config/)
- [OpenCode Agents](https://opencode.ai/docs/agents/)
- [OpenCode Rules](https://opencode.ai/docs/rules/)
- [OpenCode CLI](https://opencode.ai/docs/cli/)
