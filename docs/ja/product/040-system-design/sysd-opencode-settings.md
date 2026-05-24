---
id: sysd-opencode-settings
type: project
status: draft
rulebook: sysd-rulebook
---

# opencode 設定

SpecDojo CLI と opencode を組み合わせてマルチエージェント実行を行うための設定・構成を定義する。

## 1. 設計方針

SpecDojo・opencode・runner の3層に責務を分割し、それぞれの関心事を分離する。

- **SpecDojo CLI**: タスク管理（validate / build / claim / complete / block）
- **opencode**: タスク内容の解釈と成果物の編集
- **runner スクリプト**: マルチエージェントの起動制御

opencode の agent は **機能** で分類する（`coordinate-agent` / `edit-agent` / `review-agent`）。

- **ロール文脈はタスクデータから取得する**。スケジュールの `owner` フィールドと `done_criteria` の `roles` フィールドがロール情報を保持するため、agent 名にロールを含める必要はない。
- **`--by` はアクターの識別子**。`--by edit-agent` でタスクを claim し、ロール文脈は claim 後に task の `owner` を読んで判断する。
- **作成と検証の分離**。`edit-agent` は `edit: allow`、`review-agent` は `edit: deny` でツールレベルで保護する。

## 2. 責務分担

| 層                | 責務                                                                            | 責務外                             |
| ----------------- | ------------------------------------------------------------------------------- | ---------------------------------- |
| SpecDojo CLI      | validate / build / ready 抽出 / claim / complete / block / lock / CPM           | タスク内容の理解・成果物の編集     |
| opencode agent    | タスク内容の解釈・関連ドキュメントの読解・成果物の編集・complete / block の判断 | タスク取得の排他制御・並列起動制御 |
| runner スクリプト | マルチエージェントの起動制御・並列数の管理                                      | タスク管理ロジック・編集ロジック   |

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

`specdojo exec scheduler` の排他ロック（`exec/.locks/scheduler.lock`）により、並列起動した複数の `edit-agent` はそれぞれ別のタスクを claim する。

## 4. ディレクトリ構成

最小構成：

```text
repo-root/
├─ opencode.json
├─ AGENTS.md
├─ .opencode/
│  └─ prompts/
│     ├─ coordinate-agent.md
│     ├─ edit-agent.md
│     └─ review-agent.md
├─ tools/
│  └─ specdojo/
│     └─ run-agents.sh
└─ docs/
   └─ ja/
      └─ projects/
         └─ prj-0001/
```

## 5. `opencode.json` 設定

プロジェクト直下に `opencode.json` を置く。

### 5.1. provider 設定

opencode は **ビルトイン provider** と **カスタム provider** の2種類をサポートする。

| provider         | 種別       | 認証方法                          | `opencode.json` への provider 定義 |
| ---------------- | ---------- | --------------------------------- | ---------------------------------- |
| `github-copilot` | ビルトイン | `/connect` コマンドでデバイス認証 | 不要                               |
| `openai`         | ビルトイン | `OPENAI_API_KEY` 環境変数         | 不要                               |
| `ollama-local`   | カスタム   | なし（ローカル）                  | 必要                               |

ビルトイン provider は `opencode.json` に provider セクションを書かず、`model` にプレフィックス付きのモデル ID を指定するだけで使える。

#### 5.1.1. GitHub Copilot

opencode TUI 内で `/connect` を実行し、`GitHub Copilot` を選択する。表示される URL とコードを使ってデバイス認証を完了させる。

```text
/connect → GitHub Copilot → https://github.com/login/device にアクセス
```

認証後は `opencode.json` のモデル指定のみで動作する（一部モデルは Pro+ プランが必要）。

```jsonc
{
  "model": "github-copilot/gpt-4.1",
  "small_model": "github-copilot/gpt-4.1-mini",
}
```

#### 5.1.2. Codex（OpenAI）

`OPENAI_API_KEY` を環境変数にセットする。provider セクションは不要。コード生成精度が高く、DEV タスクで特に有効。

```bash
export OPENAI_API_KEY=sk-...
```

```jsonc
{
  "model": "openai/codex-mini-latest",
  "small_model": "openai/codex-mini-latest",
}
```

#### 5.1.3. Local LLM（Ollama）

カスタム provider として定義が必要。`baseURL` は Docker コンテナ内から Host Mac の Ollama を参照する。ネットワーク不要・コスト不要だが、モデルサイズに応じてレイテンシが高い。

```jsonc
{
  "provider": {
    "ollama-local": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama Local",
      "options": {
        "baseURL": "http://host.docker.internal:11434/v1",
        "apiKey": "ollama",
      },
      "models": {
        "gemma4:e4b-8k": { "name": "Gemma 4 E4B 8K - Fast" },
        "gemma4:26b-32k": { "name": "Gemma 4 26B 32K - Design" },
        "gemma4:31b-32k": { "name": "Gemma 4 31B 32K - Deep Review" },
        "qwen3-coder:30b-32k": { "name": "Qwen3-Coder 30B 32K - Coding" },
      },
    },
  },
}
```

#### 5.1.4. ハイブリッド設計の考え方

3 agent はそれぞれ要求する推論品質が異なるため、provider を使い分けることでコストと品質を最適化できる。

| agent              | 実際の処理             | 推奨 provider 層                                    |
| ------------------ | ---------------------- | --------------------------------------------------- |
| `coordinate-agent` | コマンド実行のみ       | `small_model`（`gpt-4.1-mini` / local）             |
| `edit-agent`       | 文書・コードの作成     | `model`（`gpt-4.1` / DEV タスクは `codex-mini`）   |
| `review-agent`     | 多観点推論・品質確認   | `model`（`gpt-4.1` などの cloud 推奨）              |

`coordinate-agent` は shell コマンドを順番に実行するだけなので、`small_model` や local LLM で十分。`edit-agent` は DEV タスクの場合に Codex が特に有効。`review-agent` は多観点での整合確認のため、品質を優先して cloud を推奨する。

### 5.2. agent 設定

機能ベースの3 agent 構成。GitHub Copilot をデフォルト cloud とし、`coordinate-agent` のみ `small_model` を使うハイブリッド設定の例。

```jsonc
{
  "$schema": "https://opencode.ai/config.json",

  // デフォルト: GitHub Copilot（edit-agent / review-agent に適用）
  "model": "github-copilot/gpt-4.1",
  "small_model": "github-copilot/gpt-4.1-mini",

  // Ollama を追加する場合は provider セクションを追記し、
  // coordinate-agent の model を "ollama-local/gemma4:e4b-8k" に変更する
  // "provider": { "ollama-local": { /* 5.1.3 参照 */ } },

  "instructions": ["AGENTS.md", "docs/ja/handbook/**/*.md", "docs/ja/projects/**/*.md"],

  "agent": {
    "coordinate-agent": {
      "description": "SpecDojo coordinator。TUI モードで validate/build/scheduler を実行し、edit-agent へ委譲する。",
      "mode": "primary",
      // コマンド実行のみのため small_model で十分。Ollama 利用時は "ollama-local/gemma4:e4b-8k" に変更する
      "model": "github-copilot/gpt-4.1-mini",
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

    "edit-agent": {
      "description": "タスクの owner からロール文脈を判断し、成果物を作成・編集する。--by edit-agent でタスクを claim する。",
      "mode": "subagent",
      // 文書系タスク（BA/ARC/PM/UX/OPS）は Copilot で十分。
      // DEV タスクが多い場合は "openai/codex-mini-latest" への変更を推奨
      "model": "github-copilot/gpt-4.1",
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

    "review-agent": {
      "description": "review plan/result を生成し、done_criteria の各ロール観点で rvr-*.yaml を記入する。",
      "mode": "subagent",
      // 多観点での推論品質を優先するため cloud を使用する
      "model": "github-copilot/gpt-4.1",
      "prompt": "{file:.opencode/prompts/review-agent.md}",
      "permission": {
        "read": "allow",
        "glob": "allow",
        "grep": "allow",
        "list": "allow",
        "bash": "allow",
        // rvr-*.yaml への記入のため allow。成果物ファイルは編集しない（プロンプトで制約）
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

| agent 名            | mode     | 機能                                                           | 推奨 provider 層         | edit  |
| ------------------- | -------- | -------------------------------------------------------------- | ------------------------ | ----- |
| `coordinate-agent`  | primary  | TUI 調整役。validate/build/scheduler を実行し委譲              | `small_model`（cheap）   | ask   |
| `edit-agent`        | subagent | task.owner を読んでロール文脈を判断し成果物を作成              | `model`（cloud / local） | allow |
| `review-agent`      | subagent | review plan/result を生成し、各ロール観点で rvr-*.yaml を記入 | `model`（cloud 推奨）    | allow |

`edit-agent` が参照するロール文脈と推奨 provider：

| task.owner | ロール文脈                   | 推奨 provider                                |
| ---------- | ---------------------------- | -------------------------------------------- |
| BA         | 要件・受入条件・利用者視点   | Copilot `gpt-4.1` / local                    |
| ARC        | 文書体系・構成方針・命名     | Copilot `gpt-4.1` / local                    |
| PM         | 計画・進捗・マイルストーン   | Copilot `gpt-4.1` / local                    |
| DEV        | 実装・設定・スクリプト       | **Codex `codex-mini-latest` 推奨**           |
| UX         | 利用者導線・文書体験         | Copilot `gpt-4.1` / local                    |
| OPS        | リリース・公開・変更管理     | Copilot `gpt-4.1` / local                    |

主な利用パターンと `opencode.json` の model 設定：

| パターン               | coordinate-agent                    | edit-agent                          | review-agent                        |
| ---------------------- | ----------------------------------- | ----------------------------------- | ----------------------------------- |
| Copilot（デフォルト）  | `gpt-4.1-mini`（copilot）           | `gpt-4.1`（copilot）                | `gpt-4.1`（copilot）                |
| DEV 重視（Codex）      | `gpt-4.1-mini`（copilot）           | `codex-mini-latest`（openai）       | `gpt-4.1`（copilot）                |
| コスト最適（hybrid）   | `gemma4:e4b-8k`（ollama-local）     | `gpt-4.1`（copilot）                | `gpt-4.1`（copilot）                |
| ローカル完結           | `gemma4:e4b-8k`（ollama-local）     | `gemma4:26b-32k`（ollama-local）    | `gemma4:31b-32k`（ollama-local）    |

### 5.4. custom command

`opencode.json` の `command` で TUI から呼び出すショートカットを定義できる。

```text
/dojo-exec edit-agent
```

ただし、この custom command は人が opencode TUI 内で呼ぶ用途に向いている。完全自動で複数 agent を並列実行する場合は、外側の runner スクリプトを使う。

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
3. For each done task, identify the deliverable's local_id (from the task's deliverables field or schedule).
4. Generate a review plan:
   Run: specdojo review plan --project prj-0001 --local-id <local_id> --stage draft
5. Read the generated rvp-<local_id>-draft.yaml to see review_items and assigned roles.
6. For each role listed in review_items:
   a. Run: specdojo review result --project prj-0001 --local-id <local_id> --stage draft --role <ROLE>
   b. Read the scaffolded rvr-<local_id>-draft-<role>.yaml.
   c. Read the target deliverable file specified in rvp target.path.
   d. For each review_result entry in the file:
      - Check the done_criterion against the deliverable content.
      - Set result: "pass", "fail", or "partial".
      - Add evidence and notes explaining your assessment.
   e. Run machine checks as listed in machine_checks (e.g., specdojo exec validate, lint:md).
   f. Set findings and unverified_scope if applicable.
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
- Do not modify deliverable files (docs/**/*.md, docs/**/*.yaml outside reviews/).
- Do not mark a review as "pass" unless all criteria are verifiably met.
```

## 8. runner スクリプト設計

`tools/specdojo/run-agents.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail

PROJECT="${SPECDOJO_PROJECT:-prj-0001}"
PARALLEL_EDITORS="${PARALLEL_EDITORS:-3}"

run_editor() {
  local instance="$1"
  echo "==> [Phase 1] edit-agent (instance ${instance})"

  opencode run --agent edit-agent "
You are edit-agent (instance ${instance}).

Run the SpecDojo execution workflow:

1. specdojo exec validate --project ${PROJECT}
2. specdojo exec build --project ${PROJECT}
3. specdojo exec scheduler --project ${PROJECT} --by edit-agent
4. Read the claimed task. Identify the task's owner role and adopt that perspective.
5. Execute only that claimed task.
6. Run validation/build.
7. Complete the task if successful.
8. Block it with a clear reason if not possible.

Do not claim more than one task.
Do not modify unrelated files.
"
}

run_reviewer() {
  echo "==> [Phase 2] review-agent"

  opencode run --agent review-agent "
Review all recently completed deliverables in project ${PROJECT}.

1. Run specdojo exec build to get the latest state.
2. Read generated/state.json to identify tasks with status done.
3. For each done task:
   a. Run specdojo review plan to generate rvp-*.yaml.
   b. Run specdojo review result for each role to scaffold rvr-*.yaml.
   c. Read the deliverable and fill in each rvr-*.yaml with review results.
4. Only edit rvr-*.yaml files in reviews/results/. Do not modify deliverables.
5. Report a summary of findings by viewpoint.
"
}

# Phase 1: 並列作成
for i in $(seq 1 "${PARALLEL_EDITORS}"); do
  run_editor "$i" &
done
wait
echo "==> Phase 1 complete"

# Phase 2: レビュー
run_reviewer
echo "==> Phase 2 complete"
```

起動コマンド：

```bash
SPECDOJO_PROJECT=prj-0001 bash tools/specdojo/run-agents.sh
```

並列数を指定する場合：

```bash
SPECDOJO_PROJECT=prj-0001 PARALLEL_EDITORS=5 bash tools/specdojo/run-agents.sh 2>&1 | tee run-agents.log
```

## 9. worktree 分離（本格運用向け）

同じ作業ディレクトリで複数 `edit-agent` を並列実行すると Git working tree 上で衝突する可能性がある。本格運用では instance ごとに worktree を分離する。`review-agent` は読み取り専用のため worktree 分離は不要。

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

`owner_role` フィールドにより、`edit-agent` はタスクを読んだ時点でロール文脈を把握できる。
