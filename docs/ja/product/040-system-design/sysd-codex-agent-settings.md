---
id: sysd-codex-agent-settings
type: project
status: draft
rulebook: sysd-rulebook
part_of:
  - sysd-agent-settings
---

# Codex エージェント設定

SpecDojo CLI と Codex CLI を組み合わせてマルチエージェント実行を行うための設定・構成を定義する。

## 1. 設計方針

共通の責務分担、実行フロー、割り当て、失敗処理、worktree は [エージェント共通設定](sysd-agent-settings.md) に従う。本書では Codex CLI 固有の設定だけを定義する。

Codex CLI は非対話実行、sandbox、reasoning effort、構造化出力を組み合わせられるため、自動化・CI・複雑な実装タスクに適する。

- **非対話実行は `codex exec`**: TUI を起動せず、タスクプロンプトを渡して応答後に終了する。`--ask-for-approval` は存在しないが、`codex exec` は元々非対話モードであり、sandbox の範囲内は自動実行・sandbox 外はブロックとなる。
- **用途別モデル分担**: 標準作業を高速・低コストモデル、複雑な設計判断を高性能モデルで分担する。
- **共有設定は `.codex/config.toml`**: trusted project で読み込まれるプロジェクトデフォルトを定義する。
- **プロジェクト共通ルールは `AGENTS.md`**: セッション開始時に自動読み込みされる。
- **custom agent は `.codex/agents/*.toml`**: 親 Codex が明示的に spawn する subagent の定義に使用する。SpecDojo が直接起動する worker とは分離する。
- **権限は最小化する**: edit は `workspace-write`、review は `read-only` を使用する。`danger-full-access` と `--yolo` は使用しない。

## 2. 責務分担

3層の共通責務は親設計に従う。Codex agent は、Codex 固有の sandbox、reasoning effort、モデル、構造化出力を使用して plan を処理する。claim、complete、block、並列起動、worktree 管理は行わない。

## 3. 全体フロー

```text
specdojo exec run
   → member.command の codex exec --ephemeral ... を起動
   → plan を標準入力で渡す
   → Codex agent が成果物または result を編集
   → Codex CLI の終了状態を共通フローへ返す
```

edit / review の選択と終了後の状態遷移は親設計に従う。

## 4. ディレクトリ構成

```text
repo-root/
├─ AGENTS.md                          # プロジェクト共通ルール
├─ .codex/
│  ├─ config.toml                     # プロジェクト共通設定
│  └─ agents/
│     ├─ specdojo-editor.toml         # 必要時に親 Codex が spawn する edit subagent
│     └─ specdojo-reviewer.toml       # 必要時に親 Codex が spawn する review subagent
```

個人設定・認証情報・CLI profile は `~/.codex/` に置き、リポジトリへコミットしない。

SpecDojo の project management 配下と worktree の共通構成は親設計を参照する。

## 5. 認証・モデル設定

### 5.1. 認証方法

| 方式               | 用途                          | 設定方法                                    |
| ------------------ | ----------------------------- | ------------------------------------------- |
| ChatGPT サインイン | 個人開発・対話利用            | `codex login` / `codex login --device-auth` |
| OpenAI API key     | CI/CD・自動化・利用量課金     | API key を使用して `codex login`            |
| `CODEX_API_KEY`    | 単一の `codex exec` 自動実行  | 実行プロセスだけに環境変数を注入            |
| Codex access token | Enterprise の信頼済み自動実行 | 管理者が許可した trusted runner で使用      |

API key はジョブ全体の環境変数に設定せず、`codex exec` 実行時だけ注入する。`~/.codex/auth.json` は秘密情報として扱い、コミットしない。

### 5.2. モデル選択

モデルは `.codex/config.toml` の `model` または `codex exec --model` で指定する。モデル名と推奨モデルは Codex の更新に合わせて見直す。

| 用途                 | モデル例       | reasoning effort | 方針                               |
| -------------------- | -------------- | ---------------- | ---------------------------------- |
| 標準 edit / review   | `gpt-5.4-mini` | `medium`         | 高速・低コストな通常作業           |
| expert edit / review | `gpt-5.5`      | `high`           | 複雑な分析・設計判断・重要レビュー |

## 6. `.codex/config.toml` 設計

`.codex/config.toml` は trusted project で読み込まれるプロジェクト共通設定である。認証・provider・個人 profile は置かず、チームで共有可能な実行デフォルトのみ定義する。

実際のファイル: `.codex/config.toml`

```toml
model = "gpt-5.5"
model_reasoning_effort = "high"
approval_policy = "on-request"
sandbox_mode = "workspace-write"
web_search = "cached"

[agents]
max_threads = 6
max_depth = 1
```

自動実行では `pm-members.yaml` の command で sandbox を明示する。CLI flag と `-c key=value` は `.codex/config.toml` より優先される。`--profile` は `~/.codex/<profile-name>.config.toml` を読み込む個人設定であり、プロジェクト共有設定としては使用しない。

## 7. `AGENTS.md` 設計

リポジトリルートの `AGENTS.md` は、すべての Codex セッションが読み込む共通ルールを記述する。Language・Project Policy・Safety の3セクションで構成する。

Codex は Git root から現在の作業ディレクトリまで `AGENTS.md` を探索し、より近いディレクトリの指示を後から適用する。局所ルールは対象ディレクトリの `AGENTS.md`、一時的な上書きは `AGENTS.override.md` に記述する。

```markdown
# Agent Instructions

## Language

- 回答は原則として日本語で行う。

## Project Policy

- 変更前に関連する設計書を確認する。
- タスクに関係しない変更を行わない。

## Safety

- 認証情報、秘密鍵、`.env`、`secrets/` を読み込まない。
- 破壊的変更や `git push` を行わない。
```

SpecDojo のタスク実行手順（plan の読み方・result の記入方法）は exec plan ファイル自体に記載されるため、`AGENTS.md` には含めない。`AGENTS.md` はプロジェクト全体の言語・ポリシー・安全規則のみを定義する。

## 8. Codex worker と custom agent の設計

### 8.1. SpecDojo worker

`specdojo exec run` が直接起動する Codex プロセスを worker と呼ぶ。worker は `pm-members.yaml` の command でモデル・reasoning effort・sandbox を指定し、渡された plan を1件だけ実行する。

| nickname                    | mode   | モデル例       | reasoning effort | sandbox           | 用途                               |
| --------------------------- | ------ | -------------- | ---------------- | ----------------- | ---------------------------------- |
| `codex-edit-agent`          | edit   | `gpt-5.4-mini` | `medium`         | `workspace-write` | 標準的な文書作成・実装             |
| `codex-review-agent`        | review | `gpt-5.4-mini` | `medium`         | `read-only`       | done_criteria の多観点レビュー     |
| `codex-expert-edit-agent`   | edit   | `gpt-5.5`      | `high`           | `workspace-write` | 複雑な設計判断・詳細分析を伴う実装 |
| `codex-expert-review-agent` | review | `gpt-5.5`      | `high`           | `read-only`       | 高品質な多観点レビュー             |

### 8.2. `.codex/agents/*.toml`

custom agent は親 Codex セッションが明示的に spawn する subagent である。SpecDojo が複数 worker を起動する仕組みとは別であり、1つの複雑な plan 内で探索・レビューなどを委譲する場合だけ使用する。

必須フィールドは `name`・`description`・`developer_instructions`。モデル、reasoning effort、sandbox などは親セッションから継承するか、agent ファイルで上書きする。

```toml
name = "specdojo-reviewer"
description = "Read-only reviewer for done criteria, regressions, and missing tests."
model = "gpt-5.4-mini"
model_reasoning_effort = "medium"
sandbox_mode = "read-only"
developer_instructions = """
Review the assigned scope only.
Prioritize correctness, regressions, consistency, and missing verification.
"""
```

並列 write は競合しやすいため、subagent は探索・レビュー・テスト分析など read-heavy な処理を基本とする。

## 9. エージェント割り当て設定

### 9.1. `pm-members.yaml` のコマンド設計

```yaml
members:
  - nickname: codex-edit-agent
    type: agent
    mode: edit
    capabilities: [web_search]
    proficiency: normal
    priority: 10
    command: 'codex exec --ephemeral --sandbox workspace-write --model gpt-5.4-mini -c model_reasoning_effort="medium"'
    scheduler_strategy: critical-first

  - nickname: codex-review-agent
    type: agent
    mode: review
    capabilities: [web_search]
    proficiency: normal
    priority: 10
    command: 'codex exec --ephemeral --sandbox read-only --model gpt-5.4-mini -c model_reasoning_effort="medium"'
    scheduler_strategy: fifo

  - nickname: codex-expert-edit-agent
    type: agent
    mode: edit
    capabilities: [web_search]
    proficiency: expert
    priority: 20
    command: 'codex exec --ephemeral --sandbox workspace-write --model gpt-5.5 -c model_reasoning_effort="high"'
    scheduler_strategy: critical-first

  - nickname: codex-expert-review-agent
    type: agent
    mode: review
    capabilities: [web_search]
    proficiency: expert
    priority: 20
    command: 'codex exec --ephemeral --sandbox read-only --model gpt-5.5 -c model_reasoning_effort="high"'
    scheduler_strategy: fifo
```

`--ephemeral` はセッション rollout ファイルを保存しない。実行履歴の正本は SpecDojo の event・plan・result とする。

### 9.2. `sch-strategy-<track>.yaml`

phase の共通契約は親設計に従う。Codex の Web 検索が必要な phase は `capabilities: [web_search]` を指定し、複雑な実装や設計判断が必要な場合は `proficiency: expert` を指定する。

### 9.3. `.specdojo/exec-defaults.yaml`

共通の retry / fallback / block 方針は親設計に従う。OpenAI API の rate limit は `429` または rate limit を示すメッセージとして検出する。

実際のファイル: `.specdojo/exec-defaults.yaml`

### 9.4. `exec run` による実行

共通の実行コマンドは親設計を参照する。Codex member は phase の `capabilities` / `proficiency` と `pm-members.yaml` の属性により自動選択される。

## 10. 非対話実行と出力

`codex exec` は進捗を stderr、最終メッセージを stdout に出力する。`--json` を指定すると JSONL イベントを stdout に出力できる。SpecDojo の判定を構造化出力へ拡張する場合は、`--output-schema` と `--output-last-message` の利用を検討する。

```bash
codex exec \
  --ephemeral \
  --sandbox workspace-write \
  --model gpt-5.4-mini \
  -c model_reasoning_effort='"medium"' \
  "SpecDojo task を1件実行してください"
```

`specdojo exec run` との統合では、plan の内容は**引数ではなく stdin** 経由で渡す。YAML frontmatter の `---` がコマンドラインオプションとして誤認されるのを防ぐためである。

```bash
cat exec/plans/<task-id>-plan.md | codex exec \
  --ephemeral \
  --sandbox workspace-write \
  --model gpt-5.4-mini \
  -c model_reasoning_effort='"medium"'
```

非対話実行では新しい承認要求に応答できない。必要な操作が sandbox の範囲を超える場合は、権限を広げて再実行せず、タスクを block して人間へ判断を戻す。

## 11. worktree 分離セットアップ

worktree のライフサイクル、配置、ブランチ名、イベントファイル名は親設計に従う。`codex-edit-agent` と `codex-expert-edit-agent` の並列実行では worktree を使用し、`read-only` の review agent では不要とする。

## 12. 公式仕様参照

- [Codex configuration](https://developers.openai.com/codex/config-basic)
- [Codex CLI reference](https://developers.openai.com/codex/cli/reference)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md)
- [Codex subagents](https://developers.openai.com/codex/subagents)
