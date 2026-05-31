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

SpecDojo・opencode・`specdojo exec run` の3層に責務を分割し、それぞれの関心事を分離する。

- **SpecDojo CLI**: タスク管理（validate / build / claim / complete / block）および `exec run` によるエージェント起動制御
- **opencode agent**: タスク内容の解釈と成果物の編集
- **`specdojo exec run`**: マルチエージェントの起動・並列制御（別途 runner スクリプト不要）

本設定では opencode の provider を Ollama（ローカルLLM）に限定する。API キー不要・ネットワーク不要で動作するが、モデルのメモリ制約とロード時間が制約条件になる。

- **Ollama 専用**: provider は `ollama-local` のみ。外部 API への依存を持たない。接続設定の詳細は [tsd-ollama-opencode](../030-architecture/020-infrastructure/tsd-ollama-opencode.md) を参照。
- **用途別モデル分担**: 通常作業（edit）を `qwen3.6:27b-mlx-work-32k`、レビューを `qwen3.6:27b-mlx-work-64k` で分担する。
- **エージェント定義は `.opencode/agents/` に集約**: エージェントごとに Markdown ファイルを置き、フロントマターでモデル・モード・権限を定義する。`opencode.json` への inline agent 定義は使わない。
- **メモリ制約を前提とした設計**: `OLLAMA_MAX_LOADED_MODELS=2` 制約下で、2つの27Bモデルの同時ロードに注意する。edit と review を分離して実行することを推奨する。
- **agent は機能で分類**: `edit-agent` / `review-agent` の2分類を基本とする。
- **プロジェクト指定は `current_project` に委ねる**: `specdojo.config.json` の `current_project` を参照するため、コマンドに `--project` を明記しない。worktree に分離しても git 管理下の config が自動的に引き継がれる。
- **exec-strategy による割り当て制御**: `pm-members.yaml` と `exec-strategy-<track>.yaml` でフェーズに応じた担当エージェントを定義する。詳細は [specdojo-exec-strategy-guide](../../specdojo/guides/specdojo-exec-strategy-guide.md) を参照。
- **worktree 分離はデフォルト構成**: 複数 `edit-agent` を並列実行する際は instance ごとに worktree を割り当て、Git 競合を防ぐ。

## 2. 責務分担

| 層                  | 責務                                                                                                                  | 責務外                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| SpecDojo CLI        | validate / build / ready 抽出 / claim / complete / block / lock / CPM / worktree 管理・エージェント起動（`exec run`） | タスク内容の理解・成果物の編集     |
| opencode agent      | タスク内容の解釈・関連ドキュメントの読解・成果物の編集・complete / block の判断                                       | タスク取得の排他制御・並列起動制御 |
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
         → edit-agent × N が "opencode run --agent edit-agent" で並列起動
         → task.owner を読んでロール文脈を判断
         → 成果物を作成・編集
         → specdojo exec complete / block

[review] specdojo exec run --by opencode-review-agent
         → review-agent が "opencode run --agent review-agent" で起動
         → 完了タスクを state.json から特定
         → done_criteria.roles の各ロール観点で検証
```

edit と review に順序制約はない。exec-strategy の `assignment_rules` でどのフェーズに edit・review を割り当てるかを定義し、スケジュール構造に応じて組み合わせる。

## 4. ディレクトリ構成

```text
repo-root/
├─ opencode.json                  # provider・グローバルモデル設定
├─ .opencode/
│  ├─ AGENTS.md                   # プロジェクト共通ルール（全エージェント共有）
│  └─ agents/
│     ├─ edit-agent.md            # edit-agent 定義（フロントマター + システムプロンプト）
│     └─ review-agent.md          # review-agent 定義（フロントマター + システムプロンプト）
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

worktree は repo-root の外に作成する。task_id をディレクトリ名・ブランチ名に使い、タスクごとに作成・破棄する。

```text
worktrees/
├─ T-ARC-base-arch-010/      # ブランチ: exec/T-ARC-base-arch-010（実行中タスク）
├─ T-BA-user-story-020/      # ブランチ: exec/T-BA-user-story-020（実行中タスク）
└─ T-DEV-api-impl-010/       # ブランチ: exec/T-DEV-api-impl-010（実行中タスク）
```

## 5. `opencode.json` 設定

プロジェクト直下に `opencode.json` を置く。役割は **provider 定義とグローバルデフォルトモデルの設定のみ**とし、agent 定義は `.opencode/agents/` に分離する。

### 5.1. provider 設定

ローカルLLM専用として `ollama-local` のみを定義する。Ollama の OpenAI互換 API（`/v1/*`）を使い、devcontainer 内から `host.docker.internal` で Host Mac の Ollama に接続する。

| provider       | 種別     | 認証方法         | `opencode.json` への provider 定義 |
| -------------- | -------- | ---------------- | ---------------------------------- |
| `ollama-local` | カスタム | なし（ローカル） | 必要                               |

### 5.2. 設定例

```jsonc
{
  "$schema": "https://opencode.ai/config.json",

  // グローバルデフォルト（agent 定義ファイルで上書き）
  "model": "ollama-local/qwen3.6:27b-mlx-work-64k",

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
        "qwen3.6:27b-mlx-work-64k": {
          "name": "Qwen3.6 27B-MLX レビュー・長文用 (64k)",
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

  "instructions": ["AGENTS.md", ".opencode/AGENTS.md"],

  "share": "disabled",
  "autoupdate": "notify",
}
```

## 6. `.opencode/AGENTS.md` 設計

`.opencode/AGENTS.md` はプロジェクト共通ルールを記述し、すべての opencode エージェントが読み込む。エージェント固有のシステムプロンプトは `.opencode/agents/<name>.md` に分離する。

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
- ファイル削除、広範囲置換、ディレクトリ移動は慎重に行う。
- Never complete a task that was not actually implemented.
- Never claim multiple tasks in one agent process unless explicitly instructed.
- If Git has unexpected changes, stop and report.
```

## 7. `.opencode/agents/` エージェント定義

エージェントは `.opencode/agents/<name>.md` に Markdown 形式で定義する。YAML フロントマターにモデル・モード・権限を記述し、本文がシステムプロンプトになる。`opencode run --agent <name>` でエージェントを指定して起動する。

### 7.1. `edit-agent.md`

`.opencode/agents/edit-agent.md`：

```markdown
---
description: 'SpecDojo タスクを1件実行する標準作業エージェント。文書作成・実装・設定変更を担当する。'
mode: primary
model: ollama-local/qwen3.6:27b-mlx-work-32k
temperature: 0.3
permission:
  read: allow
  glob: allow
  grep: allow
  list: allow
  bash: allow
  edit: allow
---

You are edit-agent, a SpecDojo task execution agent.

Your job is to implement exactly one claimed SpecDojo task.

Follow this process:

1. Run: specdojo exec validate
2. Run: specdojo exec build
3. Run: specdojo exec scheduler --by opencode-edit-agent
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
9. Run: specdojo exec validate
10. If validation passes, complete the task:
    specdojo exec complete --task <task-id> --by opencode-edit-agent --msg "completed"
11. If blocked, record the block event with a clear reason:
    specdojo exec block --task <task-id> --by opencode-edit-agent --msg "<reason>"

Do not invent project facts.
Do not change schedule files unless the task explicitly asks for it.
Do not mark the task complete if validation fails.
Do not claim more than one task.
```

### 7.2. `review-agent.md`

`.opencode/agents/review-agent.md`：

```markdown
---
description: 'SpecDojo の完了タスクをレビューするエージェント。done_criteria を多観点で検証する。'
mode: primary
model: ollama-local/qwen3.6:27b-mlx-work-64k
temperature: 0.2
permission:
  read: allow
  glob: allow
  grep: allow
  list: allow
  bash: allow
  edit: allow
---

You are review-agent, a SpecDojo structured review agent.

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

### 7.3. エージェント一覧

| ファイル名        | `--agent` 指定名 | pm-members nickname     | モード    | モデル                     | 用途                           |
| ----------------- | ---------------- | ----------------------- | --------- | -------------------------- | ------------------------------ |
| `edit-agent.md`   | `edit-agent`     | `opencode-edit-agent`   | `primary` | `qwen3.6:27b-mlx-work-32k` | 文書・コードの新規作成・実装   |
| `review-agent.md` | `review-agent`   | `opencode-review-agent` | `primary` | `qwen3.6:27b-mlx-work-64k` | done_criteria の多観点レビュー |

## 8. エージェント割り当て設定

エージェント割り当てのより詳細な設計は [specdojo-exec-strategy-guide](../../specdojo/guides/specdojo-exec-strategy-guide.md) を参照。

### 8.1. `pm-members.yaml`

`docs/ja/projects/prj-0001/030-project-management/020-organization/pm-members.yaml` にエージェントをプロジェクトメンバーとして定義する。`command` フィールドが `exec run` から直接呼び出されるコマンドになる。

```yaml
members:
  - nickname: opencode-edit-agent
    display_name: OpenCode Edit Agent
    type: agent
    capabilities: []
    command: 'opencode run --agent edit-agent'
    scheduler_strategy: critical-first
    note: 成果物の新規作成・文書化を担当する標準エージェント。

  - nickname: opencode-review-agent
    display_name: OpenCode Review Agent
    type: agent
    capabilities: []
    command: 'opencode run --agent review-agent'
    scheduler_strategy: fifo
    note: 多観点レビューを担当するエージェント。ファイルの編集は行わない。
```

### 8.2. `exec-strategy-<track>.yaml`

`docs/ja/projects/prj-0001/execution/exec-strategy-<track>.yaml` にフェーズに応じたエージェント割り当てを定義する。

```yaml
assignment_rules:
  - phase_set: first-pass
    members:
      - opencode-edit-agent

  - phase_set: finalize-pass
    members:
      - opencode-edit-agent

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

### 8.4. `exec run` による実行

`specdojo exec run` でフェーズを順に実行する。runner スクリプトは不要。

```bash
# edit: edit-agent で並列実行（PARALLEL はデフォルト値を使う）
specdojo exec run --auto --parallel 3

# review: review-agent（edit-agent と異なるモデルを使用するため別コマンドで実行）
specdojo exec run --by opencode-review-agent
```

## 9. `opencode serve` 常駐モード

Ollama は27Bモデルのロードに数秒〜数十秒かかる。`opencode run` を毎回コールドスタートすると、呼び出しごとにこのオーバーヘッドが生じる。`opencode serve` で常駐サーバーを起動し、`--attach` で接続することでロード時間を削減できる。

```bash
# 常駐サーバーを起動（バックグラウンド）
opencode serve &
OPENCODE_URL=http://localhost:4096

# タスク実行を常駐サーバーにアタッチ
opencode run --attach "${OPENCODE_URL}" --agent edit-agent \
  "SpecDojo task を1件実行してください"
```

`pm-members.yaml` の `command` フィールドに `--attach` を組み込む場合は、`OPENCODE_URL` 環境変数を `specdojo exec run` の起動前に export しておく。

```bash
export OPENCODE_URL=http://localhost:4096
opencode serve &
specdojo exec run --auto --parallel 3
```

常駐モードを使う場合は、edit フェーズと review フェーズでモデルが異なるため、フェーズ切り替え時にサーバーを再起動してモデルをアンロードすることを推奨する。

## 10. worktree 分離セットアップ

複数 `edit-agent` を並列実行する場合は **タスクごとに** worktree を作成し、Git working tree の競合を防ぐ。worktree 名とブランチ名は task_id を使う。`specdojo exec run` が claim 時に自動でセットアップし、complete / block 後に破棄する。`review-agent` は成果物を読み取るだけなので worktree 分離は不要。

### 10.1. ライフサイクル

| タイミング          | 操作                                                          |
| ------------------- | ------------------------------------------------------------- |
| claim 時            | `git worktree add ../worktrees/<task-id> -b exec/<task-id>`   |
| complete / block 時 | `git worktree remove ../worktrees/<task-id>` でクリーンアップ |

`specdojo exec run` がこのライフサイクルを自動管理するため、手動セットアップは原則不要。

### 10.2. ディレクトリ構成

```text
repo/
worktrees/
  T-ARC-base-arch-010/      # ブランチ: exec/T-ARC-base-arch-010（実行中）
  T-BA-user-story-020/      # ブランチ: exec/T-BA-user-story-020（実行中）
  T-DEV-api-impl-010/       # ブランチ: exec/T-DEV-api-impl-010（実行中）
```

並列実行中のタスク数だけ worktree が存在する。task_id で一目でどのタスクが動いているかがわかる。

### 10.3. 手動実行時の worktree セットアップ

`specdojo exec run` を使わず手動で実行する場合：

```bash
TASK_ID=T-ARC-base-arch-010
git worktree add ../worktrees/${TASK_ID} -b exec/${TASK_ID}

cd ../worktrees/${TASK_ID}
opencode run --agent edit-agent "SpecDojo task ${TASK_ID} を実行してください"

# 完了後クリーンアップ
git worktree remove ../worktrees/${TASK_ID}
```

### 10.4. イベントファイルの命名規則

worktree 分離時は `exec/events/` への append-only イベントがブランチ間で衝突しやすい。イベントファイル名は必ずユニークにする。

形式：`<timestamp>-<by>-<task-id>-<event-type>.json`

```text
exec/events/
  20260305T031000Z-opencode-edit-agent-T-ARC-base-arch-010-claim.json
  20260305T031530Z-opencode-edit-agent-T-ARC-base-arch-010-complete.json
  20260305T031000Z-opencode-edit-agent-T-BA-user-story-020-claim.json
```

task_id がユニークなため、同じエージェントが並列実行しても衝突しない。
