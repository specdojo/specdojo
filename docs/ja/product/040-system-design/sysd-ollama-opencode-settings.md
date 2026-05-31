---
id: sysd-ollama-opencode-settings
type: project
status: draft
rulebook: sysd-rulebook
based_on:
  - tsd-ollama-opencode
---

# opencode ローカルLLM設定（Ollama）

SpecDojo CLI と opencode を組み合わせてマルチエージェント実行を行うための、Ollama（ローカルLLM）専用の設定・構成を定義する。

## 1. 設計方針

SpecDojo・opencode・runner の3層に責務を分割し、それぞれの関心事を分離する。

- **SpecDojo CLI**: タスク管理（validate / build / claim / complete / block）
- **opencode**: タスク内容の解釈と成果物の編集
- **runner スクリプト**: マルチエージェントの起動制御

本設定では opencode の provider を Ollama（ローカルLLM）に限定する。API キー不要・ネットワーク不要で動作するが、モデルのメモリ制約とレイテンシが制約条件になる。

- **Ollama 専用**: provider は `ollama-local` のみ。外部 API への依存を持たない。
- **用途別モデル分担**: 通常作業を `qwen3.6:27b-mlx-work-32k`、軽作業を `gemma4:e4b-light-8k`、重い実装を `qwen3.6:27b-coding-mxfp8-64k` で分担する。接続設定の詳細は [tsd-ollama-opencode](../030-architecture/020-infrastructure/tsd-ollama-opencode.md) を参照。
- **メモリ制約を前提とした設計**: `OLLAMA_MAX_LOADED_MODELS=2` 制約下で、重いモデルの常時複数ロードを避ける。並列数は `3` を上限の目安とする。
- **agent は機能で分類**: `coordinate-agent` / `edit-agent` / `review-agent` の機能分類を維持する。
- **exec-strategy による割り当て制御**: `pm-members.yaml` と `exec-strategy-<track>.yaml` でフェーズ・難易度に応じた担当エージェントを定義する。詳細は [specdojo-exec-strategy-guide](../../specdojo/guides/specdojo-exec-strategy-guide.md) を参照。
- **worktree 分離はデフォルト構成**: 複数 `edit-agent` を並列実行する際は instance ごとに worktree を割り当て、Git 競合を防ぐ。

## 2. 責務分担

| 層                | 責務                                                                                                                  | 責務外                             |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| SpecDojo CLI      | validate / build / ready 抽出 / claim / complete / block / lock / CPM / worktree 管理・エージェント起動（`exec run`） | タスク内容の理解・成果物の編集     |
| opencode agent    | タスク内容の解釈・関連ドキュメントの読解・成果物の編集・complete / block の判断                                       | タスク取得の排他制御・並列起動制御 |
| runner スクリプト | フェーズ順序制御（`exec run` の呼び出し順序・並列数）                                                                 | タスク管理ロジック・worktree 管理  |

## 3. 全体フロー

```text
schedule yaml（owner フィールドでロールを定義）
   ↓
specdojo exec build
   ↓
ready.json / claim-next.json
   ↓
[Phase 1] edit-agent × N が --by edit-agent で並列 claim
          → task.owner を読んでロール文脈を判断
          → 成果物を作成・編集
          → specdojo exec complete / block
   ↓
[Phase 2] review-agent によるレビュー
          → 完了タスクを state.json から特定
          → specdojo review plan でレビュー計画を生成（rvp-*.yaml）
          → specdojo review result でレビュー結果をスキャフォールド（rvr-*.yaml）
          → done_criteria.roles の各ロール観点で検証し rvr-*.yaml を記入
```

## 4. ディレクトリ構成

```text
workspace/
├─ repo-root/
│  ├─ opencode.json
│  ├─ AGENTS.md
│  ├─ .specdojo/
│  │  └─ exec-agent.yaml       # rate limit 検出設定（グローバル）
│  ├─ .opencode/
│  │  └─ prompts/
│  │     ├─ coordinate-agent.md
│  │     ├─ edit-agent.md
│  │     └─ review-agent.md
│  └─ tools/
│     └─ specdojo/
│        └─ run-agents.sh
└─ docs/
   └─ ja/
      └─ projects/
         └─ prj-0001/
            ├─ 000-project-management/
            │  └─ pm-members.yaml        # エージェント定義
            └─ execution/
               └─ exec-strategy-<track>.yaml  # フェーズ別割り当てルール
```

worktree は repo-root の外に作成する。

```text
worktrees/
├─ edit-agent-1/        # ブランチ: exec/edit-agent-1
└─ edit-agent-2/        # ブランチ: exec/edit-agent-2
```

## 5. `opencode.json` 設定

プロジェクト直下に `opencode.json` を置く。

### 5.1. provider 設定

ローカルLLM専用として `ollama-local` のみを定義する。Ollama の OpenAI互換 API（`/v1/*`）を使い、devcontainer 内から `host.docker.internal` で Host Mac の Ollama に接続する。

| provider       | 種別     | 認証方法         | `opencode.json` への provider 定義 |
| -------------- | -------- | ---------------- | ---------------------------------- |
| `ollama-local` | カスタム | なし（ローカル） | 必要                               |

```jsonc
{
  "provider": {
    "ollama-local": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama Local",
      "options": {
        "baseURL": "http://host.docker.internal:11434/v1",
        "apiKey": "not-needed",
      },
      "models": {
        "qwen3.6:27b-mlx-work-32k": {
          "name": "Qwen3.6 27B-MLX 通常作業用 (32k)",
        },
        "gemma4:e4b-light-8k": {
          "name": "Gemma 4 E4B 軽作業用 (8k)",
        },
        "qwen3.6:27b-coding-mxfp8-64k": {
          "name": "Qwen3.6 27B Coding MXFP8 重い実装用 (64k)",
        },
      },
    },
  },
}
```

### 5.2. agent 設定

agent ごとにモデルを割り当てる。`expert-agent` は `qwen3.6:27b-coding-mxfp8-64k` を使うため、`edit-agent` と同時常駐させない運用を推奨する。

```jsonc
{
  "$schema": "https://opencode.ai/config.json",

  // グローバルデフォルト（agent 個別設定で上書き）
  "model": "ollama-local/qwen3.6:27b-mlx-work-32k",
  "small_model": "ollama-local/gemma4:e4b-light-8k",

  "provider": {
    "ollama-local": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama Local",
      "options": {
        "baseURL": "http://host.docker.internal:11434/v1",
        "apiKey": "not-needed",
      },
      "models": {
        "qwen3.6:27b-mlx-work-32k": {
          "name": "Qwen3.6 27B-MLX 通常作業用 (32k)",
        },
        "gemma4:e4b-light-8k": {
          "name": "Gemma 4 E4B 軽作業用 (8k)",
        },
        "qwen3.6:27b-coding-mxfp8-64k": {
          "name": "Qwen3.6 27B Coding MXFP8 重い実装用 (64k)",
        },
      },
    },
  },

  "instructions": ["AGENTS.md", "docs/ja/handbook/**/*.md", "docs/ja/projects/**/*.md"],

  "agent": {
    // コマンド実行専用（軽量モデルで十分）
    "coordinate-agent": {
      "description": "SpecDojo coordinator。validate/build/scheduler を実行し委譲する。",
      "mode": "primary",
      "model": "ollama-local/gemma4:e4b-light-8k",
      "prompt": "{file:.opencode/prompts/coordinate-agent.md}",
      "permission": {
        "read": "allow",
        "glob": "allow",
        "grep": "allow",
        "list": "allow",
        "bash": "allow",
        "edit": "ask",
      },
    },

    // tier: small（整合性修正・フォーマット整形）
    "small-edit-agent": {
      "description": "既存文書の修正・確認・フォーマット整形を担当。",
      "mode": "subagent",
      "model": "ollama-local/gemma4:e4b-light-8k",
      "prompt": "{file:.opencode/prompts/edit-agent.md}",
      "permission": {
        "read": "allow",
        "glob": "allow",
        "grep": "allow",
        "list": "allow",
        "bash": "allow",
        "edit": "allow",
      },
    },

    // tier: full（標準的な文書・コードの新規作成）
    "edit-agent": {
      "description": "標準的な文書・コードの新規作成を担当。",
      "mode": "subagent",
      "model": "ollama-local/qwen3.6:27b-mlx-work-32k",
      "prompt": "{file:.opencode/prompts/edit-agent.md}",
      "permission": {
        "read": "allow",
        "glob": "allow",
        "grep": "allow",
        "list": "allow",
        "bash": "allow",
        "edit": "allow",
      },
    },

    // tier: expert（複雑な分析・アーキテクチャ判断）
    "expert-agent": {
      "description": "複雑な分析・多観点推論・アーキテクチャ判断を担当。",
      "mode": "subagent",
      "model": "ollama-local/qwen3.6:27b-coding-mxfp8-64k",
      "prompt": "{file:.opencode/prompts/edit-agent.md}",
      "permission": {
        "read": "allow",
        "glob": "allow",
        "grep": "allow",
        "list": "allow",
        "bash": "allow",
        "edit": "allow",
      },
    },

    // review 専用
    "review-agent": {
      "description": "review plan/result を生成し、各ロール観点で rvr-*.yaml を記入する。",
      "mode": "subagent",
      "model": "ollama-local/qwen3.6:27b-mlx-work-32k",
      "prompt": "{file:.opencode/prompts/review-agent.md}",
      "permission": {
        "read": "allow",
        "glob": "allow",
        "grep": "allow",
        "list": "allow",
        "bash": "allow",
        "edit": "allow",
      },
    },
  },

  "command": {
    "dojo-exec": {
      "description": "SpecDojo の ready task を1件 claim して実行する",
      "agent": "coordinate-agent",
      "template": "Execute exactly one SpecDojo task for project prj-0001 as $ARGUMENTS. First run validate/build, then scheduler, then implement the claimed task, then complete or block it.",
    },
  },

  "share": "disabled",
  "autoupdate": "notify",
}
```

### 5.3. agent 一覧

| agent 名           | 用途                                   | モデル                         | edit  |
| ------------------ | -------------------------------------- | ------------------------------ | ----- |
| `coordinate-agent` | validate/build/scheduler を実行し委譲  | `gemma4:e4b-light-8k`          | ask   |
| `small-edit-agent` | 既存文書の修正・確認・フォーマット整形 | `gemma4:e4b-light-8k`          | allow |
| `edit-agent`       | 標準的な文書・コードの新規作成         | `qwen3.6:27b-mlx-work-32k`     | allow |
| `expert-agent`     | 複雑な分析・多観点推論                 | `qwen3.6:27b-coding-mxfp8-64k` | allow |
| `review-agent`     | review plan/result の生成と記入        | `qwen3.6:27b-mlx-work-32k`     | allow |

tier とモデルの対応：

| tier     | agent              | モデル                         |
| -------- | ------------------ | ------------------------------ |
| `small`  | `small-edit-agent` | `gemma4:e4b-light-8k`          |
| `full`   | `edit-agent`       | `qwen3.6:27b-mlx-work-32k`     |
| `expert` | `expert-agent`     | `qwen3.6:27b-coding-mxfp8-64k` |

`expert-agent` を使う作業では `edit-agent` と同時常駐させない。`OLLAMA_MAX_LOADED_MODELS=2` の制約上、両者を同時ロードするとメモリを圧迫する。

### 5.4. custom command

opencode TUI から1件のタスクを手動実行する場合：

```text
/dojo-exec edit-agent
```

完全自動で複数 agent を並列実行する場合は、runner スクリプトを使う。

## 6. `AGENTS.md` 設計

プロジェクトルートに `AGENTS.md` を置く。opencode はプロジェクト固有ルールとして読み込む。

````markdown
# SpecDojo Agent Rules

This repository uses SpecDojo for Git-native project execution.

## Mandatory workflow

Before starting implementation:

1. Run: `specdojo exec validate --project prj-0001`
2. Run: `specdojo exec build --project prj-0001`
3. Claim a task: `specdojo exec scheduler --project prj-0001 --by edit-agent`
4. Read generated task files and identify the task's owner role.
5. Adopt the role context indicated by the task's owner field.
6. Execute only the claimed task.
7. Do not edit unrelated deliverables unless the claimed task explicitly requires it.
8. After finishing, run validation and build, then mark the task complete.
9. If the task cannot be completed, use `specdojo exec block` with `--msg`.

## Completion command

```bash
specdojo exec complete \
  --project prj-0001 \
  --task <task-id> \
  --by edit-agent \
  --msg "completed"
```

## Block command

```bash
specdojo exec block \
  --project prj-0001 \
  --task <task-id> \
  --by edit-agent \
  --msg "<reason>"
```

## Safety rules

- Never complete a task that was not actually implemented.
- Never claim multiple tasks in one agent process unless explicitly instructed.
- Never overwrite another agent's work.
- If Git has unexpected changes, stop and report.
- Prefer small, reviewable commits.
````

## 7. agent プロンプト設計

### 7.1. `coordinate-agent` プロンプト

`.opencode/prompts/coordinate-agent.md`：

```markdown
You are coordinate-agent, the SpecDojo coordinator for this project.

Your job is to orchestrate exactly one SpecDojo task execution cycle.

Follow this process:

1. Run: specdojo exec validate --project prj-0001
2. Run: specdojo exec build --project prj-0001
3. Run: specdojo exec scheduler --project prj-0001 --by edit-agent
4. Read generated state and identify the claimed task and its owner role.
5. Delegate implementation to edit-agent with the role context.
6. After edit-agent completes, verify the result.
7. Run validation/build and complete or block the task.

Do not implement deliverables directly.
Do not claim more than one task per cycle.
```

### 7.2. `edit-agent` プロンプト

`.opencode/prompts/edit-agent.md`：

```markdown
You are edit-agent, a SpecDojo task execution agent.

Your job is to implement exactly one claimed SpecDojo task.

Follow this process:

1. Run: specdojo exec validate --project prj-0001
2. Run: specdojo exec build --project prj-0001
3. Run: specdojo exec scheduler --project prj-0001 --by edit-agent
4. Read the claimed task from generated state.
5. Identify the task's owner role and adopt that role perspective:
   - BA: requirements, acceptance criteria, user perspective
   - ARC: document structure, naming, consistency, technical constraints
   - DEV: implementation, configuration, code quality, build
   - PM: planning, milestones, risk, progress
   - UX: readability, clarity, user flow, information architecture
   - OPS: release, deployment, change management
6. Read related source documents before editing.
7. Update only the files necessary for the claimed task.
8. Keep Markdown structure, frontmatter, IDs, and file naming consistent.
9. Run: specdojo exec validate --project prj-0001
10. If validation passes, complete the task.
11. If blocked, record the block event with a clear reason.

Do not invent project facts.
Do not change schedule files unless the task explicitly asks for it.
Do not mark the task complete if validation fails.
Do not claim more than one task.
```

### 7.3. `review-agent` プロンプト

`.opencode/prompts/review-agent.md`：

```markdown
You are review-agent, a SpecDojo structured review agent.

Your job is to generate review plans and fill in review results for recently completed deliverables.

Follow this process for each completed task:

1. Run: specdojo exec build --project prj-0001
2. Read generated/state.json to identify tasks with status "done".
3. For each done task, identify the deliverable's local_id.
4. Generate a review plan:
   Run: specdojo review plan --project prj-0001 --local-id <local_id> --stage draft
5. Read the generated rvp-<local_id>-draft.yaml to see review_items and assigned roles.
6. For each role listed in review_items:
   a. Run: specdojo review result --project prj-0001 --local-id <local_id> --stage draft --role <ROLE>
   b. Read the scaffolded rvr-<local_id>-draft-<role>.yaml.
   c. Read the target deliverable file specified in rvp target.path.
   d. For each review_result entry: set result, add evidence and notes.
   e. Run machine checks as listed in machine_checks.
   f. Save the filled rvr-<local_id>-draft-<role>.yaml.
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

- Only edit rvr-\*.yaml files in the reviews/results/ directory.
- Do not modify deliverable files outside reviews/.
- Do not mark a review as "pass" unless all criteria are verifiably met.
```

## 8. エージェント割り当て設定

エージェント割り当てのより詳細な設計は [specdojo-exec-strategy-guide](../../specdojo/guides/specdojo-exec-strategy-guide.md) を参照。

### 8.1. `pm-members.yaml`

`docs/ja/projects/prj-0001/000-project-management/pm-members.yaml` にエージェントをプロジェクトメンバーとして定義する。`command` フィールドが `exec run` から直接呼び出されるコマンドになる。

```yaml
members:
  - nickname: edit-agent
    display_name: Edit Agent
    type: agent
    capabilities: []
    command: 'opencode run --agent edit-agent'
    scheduler_strategy: critical-first
    note: 成果物の新規作成・文書化を担当する標準エージェント。

  - nickname: small-edit-agent
    display_name: Small Edit Agent
    type: agent
    capabilities: []
    command: 'opencode run --agent small-edit-agent'
    scheduler_strategy: critical-first
    note: 整合性修正・フォーマット整形を担当する軽量エージェント。

  - nickname: expert-agent
    display_name: Expert Agent
    type: agent
    capabilities: []
    command: 'opencode run --agent expert-agent'
    scheduler_strategy: critical-first
    note: 複雑な分析・アーキテクチャ判断を担当するエージェント。

  - nickname: review-agent
    display_name: Review Agent
    type: agent
    capabilities: []
    command: 'opencode run --agent review-agent'
    scheduler_strategy: critical-first
    note: 多観点レビューを担当するエージェント。
```

### 8.2. `exec-strategy-<track>.yaml`

`docs/ja/projects/prj-0001/execution/exec-strategy-<track>.yaml` にフェーズ・難易度に応じたエージェント割り当てを定義する。

```yaml
assignment_rules:
  # difficulty:expert → 高性能エージェント（phase_set 非依存）
  - difficulty: expert
    members:
      - expert-agent
      - edit-agent # フォールバック

  # first-pass.enrich → 標準補強
  - phase_set: first-pass
    phase: enrich
    members:
      - edit-agent
      - small-edit-agent

  # finalize-pass.align → 整合性確認・修正
  - phase_set: finalize-pass
    phase: align
    members:
      - edit-agent
      - small-edit-agent

rate_limit_policy:
  on_non_critical:
    action: skip
  on_critical:
    action: try_next
    retry:
      max_attempts: 3
      initial_wait_seconds: 60
      backoff_multiplier: 3
      max_wait_seconds: 600
    on_exhausted: block
```

Ollama ではモデルのロードが遅く、rate limit の代わりにタイムアウトが発生する場合がある。その場合も `try_next` で次のメンバーへフォールバックする。

### 8.3. `.specdojo/exec-agent.yaml`

グローバルな rate limit 検出設定を定義する。

```yaml
rate_limit_detection:
  exit_codes: [1]
  stderr_patterns:
    - 'rate limit'
    - '429'
    - 'timeout'
```

### 8.4. runner スクリプト

`tools/specdojo/run-agents.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail

PROJECT="${SPECDOJO_PROJECT:-prj-0001}"
# Ollama はメモリ制約があるため並列数を抑える（OLLAMA_MAX_LOADED_MODELS=2 前提）
PARALLEL="${PARALLEL:-3}"

# Phase 1: assignment_rules に従いエージェントを自動選択して並列実行
echo "==> Phase 1: auto × ${PARALLEL}"
specdojo exec run \
  --project "${PROJECT}" \
  --auto \
  --parallel "${PARALLEL}"
echo "==> Phase 1 complete"

# Phase 2: review（常に review-agent のため明示指定）
echo "==> Phase 2: review"
specdojo exec run \
  --project "${PROJECT}" \
  --cmd "opencode run --agent review-agent" \
  --by review-agent
echo "==> Phase 2 complete"
```

起動コマンド：

```bash
SPECDOJO_PROJECT=prj-0001 bash tools/specdojo/run-agents.sh
```

並列数を変更する場合：

```bash
SPECDOJO_PROJECT=prj-0001 PARALLEL=2 bash tools/specdojo/run-agents.sh 2>&1 | tee run-agents.log
```

expert-agent を使う作業が多い場合は `PARALLEL=1` として同時ロードを避ける。

## 9. worktree 分離セットアップ

複数 `edit-agent` を並列実行する場合は instance ごとに worktree を分離し、Git working tree の競合を防ぐ。`specdojo exec run` が初回実行時に自動でセットアップする。`review-agent` は成果物を読み取るだけなので worktree 分離は不要。

### 9.1. worktree セットアップ

```bash
git worktree add ../worktrees/edit-agent-1 -b exec/edit-agent-1
git worktree add ../worktrees/edit-agent-2 -b exec/edit-agent-2
git worktree add ../worktrees/edit-agent-3 -b exec/edit-agent-3
```

### 9.2. ディレクトリ構成

```text
repo/
worktrees/
  edit-agent-1/
  edit-agent-2/
  edit-agent-3/
```

### 9.3. worktree での実行

```bash
cd ../worktrees/edit-agent-1
opencode run --agent edit-agent "SpecDojo task を1件実行してください"
```

### 9.4. イベントファイルの命名規則

worktree 分離時は `exec/events/` への append-only イベントがブランチ間で衝突しやすい。イベントファイル名は必ずユニークにする。

形式：`<timestamp>-<by>-<task-id>-<event-type>.json`

```text
exec/events/
  20260305T031000Z-edit-agent-T-ARC-010-claim.json
  20260305T031530Z-edit-agent-T-ARC-010-complete.json
  20260305T031000Z-edit-agent-T-BA-020-claim.json
```

タスク ID がユニークなため、`--by edit-agent` が重複しても衝突しない。

## 10. scheduler コマンド出力仕様

opencode 連携を安定させるため、`specdojo exec scheduler` は claim 後に agent が読むための **task handoff JSON** を出力する。

```bash
specdojo exec scheduler \
  --project prj-0001 \
  --by edit-agent \
  --out docs/ja/projects/prj-0001/070-execution/generated/edit-agent-task.json
```

### 10.1. task handoff JSON フォーマット

```json
{
  "project": "prj-0001",
  "by": "edit-agent",
  "task_id": "T-ARC-010",
  "task_name": "implement system design doc",
  "status": "claimed",
  "owner_role": "ARC",
  "task_phase": "draft",
  "model_tier": "full",
  "schedule_file": "sch-track-launch.yaml",
  "depends_on": ["T-PM-001"],
  "deliverables": ["docs/ja/projects/prj-0001/040-system-design/sysd-auth.md"],
  "acceptance_criteria": [
    "Document structure follows ARC conventions",
    "Cross-references are valid",
    "Frontmatter is consistent"
  ]
}
```

`owner_role` フィールドにより、`edit-agent` はタスクを読んだ時点でロール文脈を把握できる。`model_tier` フィールドにより、`exec-strategy` はフェーズに適切なエージェントを選択できる。

`task_phase` / `model_tier` の設定ルール：

| task_phase | ステップ番号 | model_tier | 担当 agent         |
| ---------- | ------------ | ---------- | ------------------ |
| `draft`    | 010          | `full`     | `edit-agent`       |
| `review`   | 020 / 030    | `small`    | `small-edit-agent` |
| `finalize` | 030 / 040    | `small`    | `small-edit-agent` |
