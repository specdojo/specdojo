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

opencode の内部で「複数 agent を完全自動で無限実行」するより、外側に runner を置いて `opencode run` を複数起動する方が安全である。

## 2. 責務分担

| 層                | 責務                                                                            | 責務外                             |
| ----------------- | ------------------------------------------------------------------------------- | ---------------------------------- |
| SpecDojo CLI      | validate / build / ready 抽出 / claim / complete / block / lock / CPM           | タスク内容の理解・成果物の編集     |
| opencode agent    | タスク内容の解釈・関連ドキュメントの読解・成果物の編集・complete / block の判断 | タスク取得の排他制御・並列起動制御 |
| runner スクリプト | マルチエージェントの起動制御・並列数の管理                                      | タスク管理ロジック・編集ロジック   |

## 3. 全体フロー

```text
schedule yaml
   ↓
specdojo exec build
   ↓
ready.json / claim-next.json
   ↓
specdojo exec scheduler --by <agent-id>
   ↓
claim event 追加
   ↓
opencode run --agent <agent-name>
   ↓
成果物編集
   ↓
specdojo exec complete / block
```

`specdojo exec scheduler` の排他ロック（`exec/.locks/scheduler.lock`）がタスク取得の衝突を防ぐ。opencode の各プロセスは並列に動くが、claim は scheduler 経由のため衝突しない。

## 4. ディレクトリ構成

最小構成：

```text
repo-root/
├─ opencode.json
├─ AGENTS.md
├─ .opencode/
│  └─ prompts/
│     ├─ specdojo-coordinator.md
│     ├─ specdojo-docs.md
│     ├─ specdojo-reviewer.md
│     └─ specdojo-fixer.md
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

`OPENAI_API_KEY` を環境変数にセットする。provider セクションは不要。

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

カスタム provider として定義が必要。`tsd-local-llm` で定義したカスタムモデルを使う。`baseURL` は Docker コンテナ内から Host Mac の Ollama を参照する。

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
  "model": "ollama-local/gemma4:e4b-8k",
  "small_model": "ollama-local/gemma4:e4b-8k",
}
```

### 5.2. agent 設定

`agent` セクションは provider に依存しない。`model` に使用する provider のモデル ID を指定する。
以下は Local LLM を使う場合の例。

```jsonc
{
  "$schema": "https://opencode.ai/config.json",

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

  "model": "ollama-local/gemma4:e4b-8k",
  "small_model": "ollama-local/gemma4:e4b-8k",

  "instructions": ["AGENTS.md", "docs/ja/handbook/**/*.md", "docs/ja/projects/**/*.md"],

  "agent": {
    "specdojo-coordinator": {
      "description": "SpecDojo schedule から ready task を確認し、実行方針を整理する調整役。",
      "mode": "primary",
      "model": "ollama-local/gemma4:26b-32k",
      "prompt": "{file:.opencode/prompts/specdojo-coordinator.md}",
      "permission": {
        "read": "allow",
        "glob": "allow",
        "grep": "allow",
        "list": "allow",
        "bash": "allow",
        "edit": "ask",
      },
    },

    "specdojo-docs": {
      "description": "SpecDojo の Markdown 仕様書・設計書・ガイドラインを作成・更新する agent。",
      "mode": "subagent",
      "model": "ollama-local/gemma4:26b-32k",
      "prompt": "{file:.opencode/prompts/specdojo-docs.md}",
      "permission": {
        "read": "allow",
        "glob": "allow",
        "grep": "allow",
        "list": "allow",
        "bash": "allow",
        "edit": "allow",
      },
    },

    "specdojo-reviewer": {
      "description": "SpecDojo 成果物の整合性・Frontmatter・参照関係・命名規則をレビューする agent。",
      "mode": "subagent",
      "model": "ollama-local/gemma4:31b-32k",
      "prompt": "{file:.opencode/prompts/specdojo-reviewer.md}",
      "permission": {
        "read": "allow",
        "glob": "allow",
        "grep": "allow",
        "list": "allow",
        "bash": "allow",
        "edit": "deny",
      },
    },

    "specdojo-fixer": {
      "description": "レビューで見つかった軽微な不整合・リンク切れ・Frontmatter 不備を修正する agent。",
      "mode": "subagent",
      "model": "ollama-local/gemma4:e4b-8k",
      "prompt": "{file:.opencode/prompts/specdojo-fixer.md}",
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
      "agent": "specdojo-coordinator",
      "template": "Execute exactly one SpecDojo task for project shj-0001 as $ARGUMENTS. First run validate/build, then scheduler, then implement the claimed task, then complete or block it.",
    },
  },

  "share": "disabled",
  "autoupdate": "notify",
}
```

### 5.3. agent 一覧

| agent 名               | mode     | 役割                                              | 推奨モデル（Local LLM） | edit 権限 |
| ---------------------- | -------- | ------------------------------------------------- | ----------------------- | --------- |
| `specdojo-coordinator` | primary  | validate / build / scheduler 実行、実行方針の整理 | `gemma4:26b-32k`        | ask       |
| `specdojo-docs`        | subagent | Markdown 仕様書・設計書の作成・更新               | `gemma4:26b-32k`        | allow     |
| `specdojo-reviewer`    | subagent | 成果物のレビュー（読み取り専用）                  | `gemma4:31b-32k`        | deny      |
| `specdojo-fixer`       | subagent | レビュー指摘の軽微修正                            | `gemma4:e4b-8k`         | allow     |

Codex / GitHub Copilot を使う場合は `model` を各 provider のモデル ID に差し替える。

| 用途               | Local LLM                     | Codex                      | GitHub Copilot       |
| ------------------ | ----------------------------- | -------------------------- | -------------------- |
| 調整・設計書作成   | `ollama-local/gemma4:26b-32k` | `openai/codex-mini-latest` | `github/gpt-4o`      |
| 深いレビュー       | `ollama-local/gemma4:31b-32k` | `openai/codex-mini-latest` | `github/gpt-4o`      |
| 軽微修正・高速処理 | `ollama-local/gemma4:e4b-8k`  | `openai/codex-mini-latest` | `github/gpt-4o-mini` |

### 5.4. custom command

`opencode.json` の `command` で TUI から呼び出すショートカットを定義できる。

```text
/dojo-exec agent-docs
```

ただし、この custom command は人が opencode TUI 内で呼ぶ用途に向いている。完全自動で複数 agent を並列実行する場合は、外側の runner スクリプトを使う。

## 6. `AGENTS.md` 設計

プロジェクトルートに `AGENTS.md` を置く。opencode はプロジェクト固有ルールとして読み込む。

````markdown
# SpecDojo Agent Rules

This repository uses SpecDojo for Git-native project execution.

## Mandatory workflow

Before starting implementation:

1. Run: `specdojo exec validate --project shj-0001`
2. Run: `specdojo exec build --project shj-0001`
3. Claim a task: `specdojo exec scheduler --project shj-0001 --by <agent-id>`
4. Read generated task files:
   - `docs/ja/projects/prj-0001/070-execution/generated/state.json`
   - `docs/ja/projects/prj-0001/070-execution/generated/ready.json`
   - `docs/ja/projects/prj-0001/070-execution/generated/claim-next.json`
5. Execute only the claimed task.
6. Do not edit unrelated deliverables unless the claimed task explicitly requires it.
7. After finishing, run validation and build, then mark the task complete.
8. If the task cannot be completed, use `specdojo exec block` with `--msg`.

## Completion command

```bash
specdojo exec complete \
  --project shj-0001 \
  --task <task-id> \
  --by <agent-id> \
  --msg "completed"
```

## Block command

```bash
specdojo exec block \
  --project shj-0001 \
  --task <task-id> \
  --by <agent-id> \
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

### 7.1. `specdojo-docs` プロンプト

`.opencode/prompts/specdojo-docs.md`：

```markdown
You are a SpecDojo documentation execution agent.

Your job is to implement exactly one claimed SpecDojo task.

Follow this process:

1. Confirm the claimed task from SpecDojo generated state.
2. Identify the expected deliverable.
3. Read related source documents before editing.
4. Update only the files necessary for the claimed task.
5. Keep Markdown structure, frontmatter, IDs, and file naming consistent.
6. Run validation.
7. If successful, complete the task.
8. If blocked, record the block event with a clear reason.

Do not invent project facts.
Do not change schedule files unless the task explicitly asks for it.
Do not mark the task complete if validation fails.
```

### 7.2. `specdojo-reviewer` プロンプト

`.opencode/prompts/specdojo-reviewer.md`：

```markdown
You are a SpecDojo review agent.

You must not edit files.

Review:

- frontmatter consistency
- document IDs
- file naming
- cross references
- schedule/task alignment
- generated execution state
- missing deliverables
- contradictions between documents

Return concrete findings and suggested fixes.
```

## 8. runner スクリプト設計

`tools/specdojo/run-agents.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail

PROJECT="${SPECDOJO_PROJECT:-shj-0001}"
AGENTS=(
  "agent-docs"
  "agent-review"
  "agent-fix"
)

run_agent() {
  local by="$1"

  echo "==> starting $by"

  opencode run "
You are $by.

Run the SpecDojo execution workflow:

1. specdojo exec validate --project ${PROJECT}
2. specdojo exec build --project ${PROJECT}
3. specdojo exec scheduler --project ${PROJECT} --by ${by}
4. Inspect the claimed task from generated state.
5. Execute only that claimed task.
6. Run validation/build.
7. Complete the task if successful.
8. Block it with a clear reason if not possible.

Do not claim more than one task.
Do not modify unrelated files.
"
}

for by in "${AGENTS[@]}"; do
  run_agent "$by" &
done

wait
```

起動コマンド：

```bash
SPECDOJO_PROJECT=shj-0001 bash tools/specdojo/run-agents.sh
```

最初は並列数を抑えた起動を推奨する：

```bash
SPECDOJO_PROJECT=shj-0001 bash tools/specdojo/run-agents.sh 2>&1 | tee run-agents.log
```

## 9. worktree 分離（本格運用向け）

同じ作業ディレクトリで複数 opencode を並列実行すると Git working tree 上で衝突する可能性がある。本格運用では worktree を分離する。

### 9.1. worktree セットアップ

```bash
git worktree add ../worktrees/agent-docs -b exec/agent-docs
git worktree add ../worktrees/agent-review -b exec/agent-review
git worktree add ../worktrees/agent-fix -b exec/agent-fix
```

### 9.2. ディレクトリ構成

```text
repo/
worktrees/
  agent-docs/
  agent-review/
  agent-fix/
```

### 9.3. worktree での実行

```bash
cd ../worktrees/agent-docs
opencode run "SpecDojo task を1件実行してください"
```

### 9.4. イベントファイルの命名規則

worktree 分離時は `exec/events/` への append-only イベントがブランチ間で衝突しやすい。イベントファイル名は必ずユニークにする。

形式：`<timestamp>-<agent-id>-<task-id>-<event-type>.json`

```text
exec/events/
  20260305T031000Z-agent-docs-T-AUTH-API-020-claim.json
  20260305T031530Z-agent-docs-T-AUTH-API-020-complete.json
```

## 10. scheduler コマンド出力仕様

opencode 連携を安定させるため、`specdojo exec scheduler` は claim 後に agent が読むための **task handoff JSON** を出力する。

```bash
specdojo exec scheduler \
  --project shj-0001 \
  --by agent-docs \
  --out docs/ja/projects/prj-0001/070-execution/generated/agent-docs-task.json
```

### 10.1. task handoff JSON フォーマット

```json
{
  "project": "shj-0001",
  "by": "agent-docs",
  "task_id": "T-AUTH-API-020",
  "task_name": "implement login api",
  "status": "claimed",
  "schedule_file": "sch-auth-api.yaml",
  "depends_on": ["T-AUTH-API-010"],
  "recommended_agent": "specdojo-docs",
  "deliverables": ["docs/ja/projects/prj-0001/040-system-design/auth-api.md"],
  "acceptance_criteria": [
    "API design is documented",
    "Error handling is described",
    "Related references are updated"
  ]
}
```

この JSON が存在すると、opencode へのプロンプトが安定し、agent が直接 claim-next.json を読み解く手間を省ける。
