---
id: sysd-claude-agent-settings
type: project
status: draft
rulebook: sysd-rulebook
---

# Claude Code エージェント設定

SpecDojo CLI と Claude Code を組み合わせてマルチエージェント実行を行うための設定・構成を定義する。

## 1. 設計方針

SpecDojo・Claude Code・`specdojo exec run` の3層に責務を分割し、それぞれの関心事を分離する。

- **SpecDojo CLI**: タスク管理（validate / build / claim / complete / block）および `exec run` によるエージェント起動制御
- **Claude Code agent**: タスク内容の解釈・Web 検索・成果物の編集
- **`specdojo exec run`**: マルチエージェントの起動・並列制御（別途 runner スクリプト不要）

Claude Code は Anthropic API 経由でクラウドモデルを使用する。ローカルLLMが不要な環境や Web 検索能力が必要なタスクに適する。

- **Anthropic API 使用**: `ANTHROPIC_API_KEY` または `claude auth login` で認証する。
- **用途別モデル分担**: 標準作業（edit/review）を `sonnet`、複雑な設計判断・詳細分析を `opus` で分担する。
- **非対話モード（print mode）**: `claude -p` フラグで TUI を起動せず、プロンプトを渡して応答後に終了する。自動化・CI 用途の標準方式。
- **エージェント別プロンプトは `.claude/prompts/` に集約**: `--append-system-prompt-file` でエージェントごとのシステムプロンプトを注入する。
- **プロジェクト共通ルールは `CLAUDE.md`**: セッション開始時に自動読み込みされる。エージェント固有の指示は `.claude/prompts/` に分離する。
- **プロジェクト指定は `current_project` に委ねる**: `specdojo.config.json` の `current_project` を参照するため、コマンドに `--project` を明記しない。worktree に分離しても git 管理下の config が自動的に引き継がれる。
- **exec-strategy による割り当て制御**: `pm-members.yaml` と `exec-strategy-<track>.yaml` でフェーズに応じた担当エージェントを定義する。詳細は [specdojo-exec-strategy-guide](../../specdojo/guides/specdojo-exec-strategy-guide.md) を参照。
- **worktree 分離はデフォルト構成**: 複数 `edit-agent` を並列実行する際は instance ごとに worktree を割り当て、Git 競合を防ぐ。

## 2. 責務分担

| 層                  | 責務                                                                                                                  | 責務外                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| SpecDojo CLI        | validate / build / ready 抽出 / claim / complete / block / lock / CPM / worktree 管理・エージェント起動（`exec run`） | タスク内容の理解・成果物の編集     |
| Claude Code agent   | タスク内容の解釈・Web 検索・関連ドキュメントの読解・成果物の編集・complete / block の判断                            | タスク取得の排他制御・並列起動制御 |
| `specdojo exec run` | フェーズ順序制御・並列数・worktree 割り当て・rate limit フォールバック                                                | タスク管理ロジック・成果物の編集   |

## 3. 全体フロー

```text
schedule yaml（owner フィールドでロールを定義）
   ↓
specdojo exec build          # --project 省略: current_project を参照
   ↓
ready.json / claim-next.json
   ↓
[edit]   specdojo exec run --auto --parallel 3
         → claude-edit-agent × N が claude -p ... で並列起動
         → task.owner を読んでロール文脈を判断
         → 必要に応じて WebSearch / WebFetch で外部情報を取得
         → 成果物を作成・編集
         → specdojo exec complete / block

[review] specdojo exec run --by claude-review-agent
         → claude-review-agent が claude -p ... で起動
         → 完了タスクを state.json から特定
         → done_criteria.roles の各ロール観点で検証
```

edit と review に順序制約はない。exec-strategy の `assignment_rules` でどのフェーズに edit・review を割り当てるかを定義し、スケジュール構造に応じて組み合わせる。

## 4. ディレクトリ構成

```text
repo-root/
├─ CLAUDE.md                          # プロジェクト共通ルール（全エージェント共有）
├─ .claude/
│  ├─ settings.json                   # 権限・モデルデフォルト（チーム共有）
│  ├─ settings.local.json             # 個人ローカル設定（gitignore）
│  ├─ rules/
│  │  └─ *.md                         # パス別ルール（既存）
│  └─ prompts/
│     ├─ edit-agent.md                # edit-agent システムプロンプト
│     └─ review-agent.md             # review-agent システムプロンプト
└─ docs/
   └─ ja/
      └─ projects/
         └─ prj-0001/
            ├─ 030-project-management/
            │  ├─ 020-organization/
            │  │  └─ pm-members.yaml          # エージェント定義
            │  └─ execution/
            │     └─ exec-strategy-<track>.yaml  # フェーズ別割り当てルール
            └─ execution/
               └─ generated/                  # exec build 生成物
```

worktree は repo-root の外に作成する。

```text
worktrees/
├─ edit-agent-1/        # ブランチ: exec/edit-agent-1
├─ edit-agent-2/        # ブランチ: exec/edit-agent-2
└─ edit-agent-3/        # ブランチ: exec/edit-agent-3
```

## 5. 認証・API設定

### 5.1. 認証方法

Claude Code は2種類の認証方式を持つ。

| 方式              | 用途                                     | 設定方法                               |
| ----------------- | ---------------------------------------- | -------------------------------------- |
| Claude サブスク   | 個人開発・試験運用                       | `claude auth login`                    |
| Anthropic API Key | CI/CD・自動化・チーム共有環境            | `ANTHROPIC_API_KEY` 環境変数           |
| 長期 OAuth Token  | CI スクリプト（サブスク経由の API 利用） | `claude setup-token` で生成            |

devcontainer や CI 環境では `ANTHROPIC_API_KEY` を環境変数で注入する。

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

### 5.2. モデル選択

`--model` フラグにはエイリアスまたはフルモデル ID を指定する。

| エイリアス | モデル例                    | 用途                                     |
| ---------- | --------------------------- | ---------------------------------------- |
| `sonnet`   | `claude-sonnet-4-6`         | 標準的な文書作成・実装・レビュー（推奨） |
| `opus`     | `claude-opus-4-8`           | 複雑な分析・アーキテクチャ判断           |
| `haiku`    | `claude-haiku-4-5-20251001` | 軽量な確認・整形処理                     |

エイリアスは常に最新モデルに解決されるため、モデル更新時もコマンドを変更不要。

## 6. `.claude/settings.json` 設定

`.claude/settings.json` はプロジェクト全体で共有する設定ファイル。権限のデフォルトを定義し、エージェント実行時の許可確認を最小化する。

```jsonc
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(specdojo *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(npm run *)",
      "Read(**)",
      "WebSearch",
      "WebFetch"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Read(./**/*secret*)",
      "Bash(git push *)",
      "Bash(git reset --hard *)",
      "Bash(rm -rf *)"
    ],
    "ask": [
      "Bash(git push *)"
    ]
  }
}
```

自動化環境（`specdojo exec run` からの起動）では `--permission-mode auto` フラグを組み合わせることで、安全と判定された操作に対する確認ダイアログを省略できる。

## 7. `CLAUDE.md` 設計

`CLAUDE.md` はプロジェクトルートに置き、全エージェントが自動的に読み込む共通ルールを記述する。エージェント固有のシステムプロンプトは `.claude/prompts/` に分離する。

`CLAUDE.md` は200行以内を目安にし、具体的・判定可能な記述に限定する。

```markdown
# Agent Instructions

## Language

- 回答は原則として日本語で行う。
- コード、ファイル名、識別子は英語を優先する。
- Markdown 設計書は自然な日本語で、曖昧な表現を避ける。

## Project Policy

- 変更前に関連する設計書を確認する。
- `docs/` 配下の Markdown では、frontmatter の `id`・`based_on`・`status` を尊重する。
- 既存の命名規則・ディレクトリ規則を優先する。
- 大きな変更は、まず設計書に反映してからコードを変更する。

## SpecDojo Workflow

Before starting implementation:

1. Run: `specdojo exec validate`
2. Run: `specdojo exec build`
3. Claim a task via the scheduler (see agent-specific prompt for details).
4. Read generated task files and identify the task's owner role.
5. Adopt the role context indicated by the task's owner field.
6. Execute only the claimed task.
7. Do not edit unrelated deliverables unless the claimed task explicitly requires it.
8. After finishing, run validate/build, then mark the task complete or block it.

## Safety

- `.env`、`.env.*`、`secrets/`、認証情報、秘密鍵は読み込まない。
- 破壊的変更を行う前に git diff を確認する。
- Never complete a task that was not actually implemented.
- Never claim multiple tasks in one agent process unless explicitly instructed.
- If Git has unexpected changes, stop and report.
```

## 8. エージェント別プロンプト設計

エージェント固有のシステムプロンプトを `.claude/prompts/` に置き、`--append-system-prompt-file` で注入する。`CLAUDE.md` のプロジェクト共通ルールに追記される形で動作する。

### 8.1. `edit-agent.md`

`.claude/prompts/edit-agent.md`：

```markdown
You are an edit-agent, a SpecDojo task execution agent with web search capability.

Your job is to implement exactly one claimed SpecDojo task.

Follow this process:

1. Run: specdojo exec validate
2. Run: specdojo exec build
3. Run: specdojo exec scheduler --by claude-edit-agent
4. Read the claimed task from generated state.
5. Identify the task's owner role and adopt that role perspective:
   - BA: requirements, acceptance criteria, user perspective
   - ARC: document structure, naming, consistency, technical constraints
   - DEV: implementation, configuration, code quality, build
   - PM: planning, milestones, risk, progress
   - UX: readability, clarity, user flow, information architecture
   - OPS: release, deployment, change management
6. Use WebSearch and WebFetch to gather external information when the task requires it.
7. Read related source documents before editing.
8. Update only the files necessary for the claimed task.
9. Keep Markdown structure, frontmatter, IDs, and file naming consistent.
10. Run: specdojo exec validate
11. If validation passes, complete the task:
    specdojo exec complete --task <task-id> --by claude-edit-agent --msg "completed"
12. If blocked, record the block event with a clear reason:
    specdojo exec block --task <task-id> --by claude-edit-agent --msg "<reason>"

Do not invent project facts.
Do not change schedule files unless the task explicitly asks for it.
Do not mark the task complete if validation fails.
Do not claim more than one task.
```

### 8.2. `review-agent.md`

`.claude/prompts/review-agent.md`：

```markdown
You are a review-agent, a SpecDojo structured review agent with web search capability.

Your job is to generate review plans and fill in review results for recently completed deliverables.

Follow this process for each completed task:

1. Run: specdojo exec build
2. Read generated/state.json to identify tasks with status "done".
3. For each done task, identify the deliverable's local_id.
4. Generate a review plan:
   Run: specdojo review plan --local-id <local_id> --stage draft
5. Read the generated rvp-<local_id>-draft.yaml to see review_items and assigned roles.
6. For each role listed in review_items:
   a. Run: specdojo review result --local-id <local_id> --stage draft --role <ROLE>
   b. Read the scaffolded rvr-<local_id>-draft-<role>.yaml.
   c. Read the target deliverable file specified in rvp target.path.
   d. Use WebSearch to verify technical facts, standards, or external references if needed.
   e. For each review_result entry: set result, add evidence and notes.
   f. Run machine checks as listed in machine_checks.
   g. Save the filled rvr-<local_id>-draft-<role>.yaml.
7. After all roles are filled, identify any cross-viewpoint contradictions.
8. Report a summary of all findings by viewpoint.

Role viewpoint guidelines:

- BA: 業務価値・要件の網羅性・ステークホルダー明確さ
- PO: 目的整合・意思決定可能な情報の有無
- ARC: 文書構成・技術制約・ドキュメント間整合
- PM: 計画実現性・進捗報告可能性
- DEV: 実装可能性・ビルド・テスト観点
- QE: 検証可能性・抜け漏れ・矛盾
- UX: 読みやすさ・明確さ・情報構造

Safety rules:

- Only edit rvr-*.yaml files in the reviews/results/ directory.
- Do not modify deliverable files outside reviews/.
- Do not mark a review as "pass" unless all criteria are verifiably met.
```

### 8.3. エージェント一覧

| pm-members nickname         | モデル   | プロンプトファイル              | 用途                               |
| --------------------------- | -------- | ------------------------------- | ---------------------------------- |
| `claude-edit-agent`         | `sonnet` | `.claude/prompts/edit-agent.md` | 標準的な文書作成・実装             |
| `claude-review-agent`       | `sonnet` | `.claude/prompts/review-agent.md` | done_criteria の多観点レビュー   |
| `claude-expert-edit-agent`  | `opus`   | `.claude/prompts/edit-agent.md` | 複雑な設計判断・詳細分析が必要な作成タスク |
| `claude-expert-review-agent`| `opus`   | `.claude/prompts/review-agent.md` | 高品質な多観点レビュー           |

## 9. エージェント割り当て設定

エージェント割り当てのより詳細な設計は [specdojo-exec-strategy-guide](../../specdojo/guides/specdojo-exec-strategy-guide.md) を参照。

### 9.1. `pm-members.yaml` のコマンド設計

`pm-members.yaml` の `command` フィールドに、`specdojo exec run` から呼び出す完全なコマンドを記述する。

非対話モード（`-p`）・エージェント別プロンプト注入（`--append-system-prompt-file`）・権限モード（`--permission-mode auto`）を組み合わせることで、確認ダイアログなしの自動実行を実現する。

```yaml
members:
  - nickname: claude-edit-agent
    display_name: Claude Edit Agent
    type: agent
    capabilities:
      - web_search
    command: >-
      claude -p
      --model sonnet
      --allowedTools WebSearch,WebFetch
      --permission-mode auto
      --append-system-prompt-file .claude/prompts/edit-agent.md
    scheduler_strategy: critical-first
    note: Sonnet モデルを使用する標準エージェント。外部 Web 情報参照が必要なタスクを担当する。

  - nickname: claude-review-agent
    display_name: Claude Review Agent
    type: agent
    capabilities:
      - web_search
    command: >-
      claude -p
      --model sonnet
      --allowedTools WebSearch,WebFetch
      --permission-mode auto
      --append-system-prompt-file .claude/prompts/review-agent.md
    scheduler_strategy: fifo
    note: Sonnet モデルを使用するレビューエージェント。done_criteria を多観点で検証する。

  - nickname: claude-expert-edit-agent
    display_name: Claude Expert Edit Agent
    type: agent
    capabilities:
      - web_search
    command: >-
      claude -p
      --model opus
      --allowedTools WebSearch,WebFetch
      --permission-mode auto
      --append-system-prompt-file .claude/prompts/edit-agent.md
    scheduler_strategy: critical-first
    note: Opus モデルを使用する高性能エージェント。複雑な分析・アーキテクチャ判断が必要なタスクを担当する。

  - nickname: claude-expert-review-agent
    display_name: Claude Expert Review Agent
    type: agent
    capabilities:
      - web_search
    command: >-
      claude -p
      --model opus
      --allowedTools WebSearch,WebFetch
      --permission-mode auto
      --append-system-prompt-file .claude/prompts/review-agent.md
    scheduler_strategy: fifo
    note: Opus モデルを使用する高性能レビューエージェント。精度が重要なレビュータスクを担当する。
```

### 9.2. `exec-strategy-<track>.yaml`

`docs/ja/projects/prj-0001/execution/exec-strategy-<track>.yaml` にフェーズに応じたエージェント割り当てを定義する。

```yaml
assignment_rules:
  - phase_set: first-pass
    members:
      - claude-edit-agent

  - phase_set: finalize-pass
    members:
      - claude-edit-agent

rate_limit_policy:
  on_non_critical:
    action: skip
  on_critical:
    action: try_next
    retry:
      max_attempts: 3
      initial_wait_seconds: 30
      backoff_multiplier: 2
      max_wait_seconds: 300
    on_exhausted: block
```

Anthropic API では `429 Too Many Requests` が rate limit のシグナル。`try_next` でフォールバックメンバー（`claude-expert-edit-agent` など）に切り替えることで継続実行できる。

### 9.3. `.specdojo/exec-agent.yaml`

グローバルな rate limit 検出設定を定義する。

```yaml
rate_limit_detection:
  exit_codes: [1]
  stderr_patterns:
    - 'rate limit'
    - '429'
    - 'overloaded'
    - 'timeout'
```

`overloaded` は Anthropic API でモデル負荷が高い場合に返るメッセージ。

### 9.4. `exec run` による実行

```bash
# edit: claude-edit-agent で並列実行
specdojo exec run --auto --parallel 3

# review: claude-review-agent でレビュー
specdojo exec run --by claude-review-agent
```

## 10. バックグラウンドセッションによる並列実行

Claude Code は `claude --bg` でエージェントをバックグラウンド起動し、`claude agents` で並列セッションを管理できる。`specdojo exec run` の並列制御と組み合わせることで、複数タスクを同時進行できる。

### 10.1. バックグラウンド起動

```bash
# バックグラウンドでエージェントを起動（セッション ID を返してすぐに戻る）
claude --bg \
  --model sonnet \
  --allowedTools WebSearch,WebFetch \
  --permission-mode auto \
  "SpecDojo task を1件実行してください"

# セッション一覧を JSON で取得（スクリプト向け）
claude agents --json
```

### 10.2. セッション管理コマンド

| コマンド                    | 説明                                   |
| --------------------------- | -------------------------------------- |
| `claude agents`             | 並列セッション一覧を TUI で表示        |
| `claude agents --json`      | セッション一覧を JSON で出力           |
| `claude attach <id>`        | バックグラウンドセッションにアタッチ   |
| `claude logs <id>`          | セッションのログを表示                 |
| `claude stop <id>`          | セッションを停止                       |
| `claude respawn <id>`       | セッションを再起動                     |

### 10.3. コスト管理

`--max-budget-usd` でセッションごとの API 利用上限を設定できる（print mode のみ）。

```bash
claude -p \
  --model sonnet \
  --max-budget-usd 1.00 \
  "SpecDojo task を1件実行してください"
```

並列数とモデル tier に応じて1タスクあたりの予算上限を設定することを推奨する。

## 11. worktree 分離セットアップ

複数 `claude-edit-agent` を並列実行する場合は instance ごとに worktree を分離し、Git working tree の競合を防ぐ。`specdojo exec run` が初回実行時に自動でセットアップする。`claude-review-agent` は成果物を読み取るだけなので worktree 分離は不要。

### 11.1. worktree セットアップ

```bash
git worktree add ../worktrees/edit-agent-1 -b exec/edit-agent-1
git worktree add ../worktrees/edit-agent-2 -b exec/edit-agent-2
git worktree add ../worktrees/edit-agent-3 -b exec/edit-agent-3
```

### 11.2. ディレクトリ構成

```text
repo/
worktrees/
  edit-agent-1/
  edit-agent-2/
  edit-agent-3/
```

### 11.3. worktree での実行

```bash
cd ../worktrees/edit-agent-1
claude -p \
  --model sonnet \
  --allowedTools WebSearch,WebFetch \
  --permission-mode auto \
  --append-system-prompt-file .claude/prompts/edit-agent.md \
  "SpecDojo task を1件実行してください"
```

### 11.4. イベントファイルの命名規則

worktree 分離時は `exec/events/` への append-only イベントがブランチ間で衝突しやすい。イベントファイル名は必ずユニークにする。

形式：`<timestamp>-<by>-<task-id>-<event-type>.json`

```text
exec/events/
  20260305T031000Z-claude-edit-agent-T-ARC-010-claim.json
  20260305T031530Z-claude-edit-agent-T-ARC-010-complete.json
  20260305T031000Z-claude-edit-agent-T-BA-020-claim.json
```

タスク ID がユニークなため、`--by claude-edit-agent` が重複しても衝突しない。
