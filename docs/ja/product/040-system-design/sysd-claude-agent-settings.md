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
- **エージェント定義は `.claude/agents/*.md`**: YAML frontmatter でモデル・ツール・権限モードを設定し、本文がシステムプロンプトになる。プロジェクト固有の定義はリポジトリにチェックインしてチームで共有する。
- **非対話モード（print mode）**: `claude -p --agent <name>` で TUI を起動せず、タスクプロンプトを渡して応答後に終了する。自動化・CI 用途の標準方式。
- **プロジェクト共通ルールは `CLAUDE.md`**: セッション開始時に自動読み込みされる。エージェント固有の指示は `.claude/agents/` に分離する。
- **exec-strategy による割り当て制御**: `pm-members.yaml` と `exec-strategy-<track>.yaml` でフェーズに応じた担当エージェントを定義する。詳細は [specdojo-exec-strategy-guide](../../specdojo/guides/specdojo-exec-strategy-guide.md) を参照。
- **worktree 分離はデフォルト構成**: 複数 `edit-agent` を並列実行する際は instance ごとに worktree を割り当て、Git 競合を防ぐ。

## 2. 責務分担

| 層                  | 責務                                                                                                                  | 責務外                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| SpecDojo CLI        | validate / build / ready 抽出 / claim / complete / block / lock / CPM / worktree 管理・エージェント起動（`exec run`） | タスク内容の理解・成果物の編集     |
| Claude Code agent   | タスク内容の解釈・Web 検索・関連ドキュメントの読解・成果物の編集・complete / block の判断                             | タスク取得の排他制御・並列起動制御 |
| `specdojo exec run` | フェーズ順序制御・並列数・worktree 割り当て・rate limit フォールバック                                                | タスク管理ロジック・成果物の編集   |

## 3. 全体フロー

```text
schedule yaml（owner フィールドでロールを定義）
   ↓
specdojo exec build
   ↓
ready.json / exec/plans/<task-id>-plan.md（edit-plan or review-plan）
   ↓
[edit]   specdojo exec run --auto --loop --parallel 3
         → exec build で ready.json・exec/plans/ を最新化
         → exec run が exec/results/<task-id>-result.md をscaffold生成
         → claude-edit-agent × N が claude -p --agent claude-edit-agent "<plan>" で並列起動
         → plan に従いロール文脈を判断して成果物を作成・編集
         → result ファイルの done_criteria_checked セクションを記入
         → 終了コード 0 → exec complete / 終了コード 1 → exec block

[review] specdojo exec run --auto
         → exec-strategy の assignment_rules で mode: review のエージェントが選択される
         → exec run が exec/results/<task-id>-result.md をscaffold生成
         → claude-review-agent が review-plan の各観点を確認し result に記入
```

edit と review に順序制約はない。exec-strategy の `assignment_rules` の `mode` フィールドでどのフェーズに edit・review を割り当てるかを定義し、スケジュール構造に応じて組み合わせる。

## 4. ディレクトリ構成

```text
repo-root/
├─ CLAUDE.md                          # プロジェクト共通ルール（全エージェント共有）
├─ .claude/
│  ├─ settings.json                   # 権限・モデルデフォルト（チーム共有）
│  ├─ settings.local.json             # 個人ローカル設定（gitignore）
│  ├─ rules/
│  │  └─ *.md                         # パス別ルール（既存）
│  └─ agents/
│     ├─ claude-edit-agent.md         # sonnet 標準 edit エージェント定義
│     ├─ claude-review-agent.md       # sonnet 標準 review エージェント定義
│     ├─ claude-expert-edit-agent.md  # opus 高性能 edit エージェント定義
│     └─ claude-expert-review-agent.md # opus 高性能 review エージェント定義
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

## 5. 認証・API設定

### 5.1. 認証方法

Claude Code は2種類の認証方式を持つ。

| 方式              | 用途                                     | 設定方法                     |
| ----------------- | ---------------------------------------- | ---------------------------- |
| Claude サブスク   | 個人開発・試験運用                       | `claude auth login`          |
| Anthropic API Key | CI/CD・自動化・チーム共有環境            | `ANTHROPIC_API_KEY` 環境変数 |
| 長期 OAuth Token  | CI スクリプト（サブスク経由の API 利用） | `claude setup-token` で生成  |

devcontainer や CI 環境では `ANTHROPIC_API_KEY` を環境変数で注入する。

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

### 5.2. モデル選択

エージェント定義ファイルの `model` フィールドにエイリアスまたはフルモデル ID を指定する。

| エイリアス | モデル例                    | 用途                                     |
| ---------- | --------------------------- | ---------------------------------------- |
| `sonnet`   | `claude-sonnet-4-6`         | 標準的な文書作成・実装・レビュー（推奨） |
| `opus`     | `claude-opus-4-8`           | 複雑な分析・アーキテクチャ判断           |
| `haiku`    | `claude-haiku-4-5-20251001` | 軽量な確認・整形処理                     |

エイリアスは常に最新モデルに解決されるため、モデル更新時もエージェント定義ファイルを変更不要。

## 6. `.claude/settings.json` 設定

`.claude/settings.json` はプロジェクト全体で共有する設定ファイル。`allow`（specdojo/git/npm/Read/Web）と `deny`（.env/secrets/git push 等）でセッションレベルの権限デフォルトを定義する。エージェント個別の権限は `.claude/agents/*.md` の frontmatter で上書きできる。

実際のファイル: `.claude/settings.json`

## 7. `CLAUDE.md` 設計

`CLAUDE.md` はプロジェクトルートに置き、全エージェントが自動的に読み込む共通ルールを記述する。エージェント固有のシステムプロンプトは `.claude/agents/` に分離する。

`CLAUDE.md` は200行以内を目安にし、具体的・判定可能な記述に限定する。Language・Project Policy・SpecDojo ワークフロー・安全規則の4セクションで構成する。

実際のファイル: `.claude/CLAUDE.md`

## 8. エージェント定義ファイル設計

エージェントは `.claude/agents/<name>.md` に YAML frontmatter とシステムプロンプトで定義する。`name` フィールドが `--agent` フラグで参照される識別子になる。

### 8.1. frontmatter フィールド一覧

| フィールド       | 必須 | 説明                                                                                                                                                   |
| ---------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`           | ○    | 一意の識別子（英小文字・ハイフンのみ）。`--agent` フラグで参照する                                                                                     |
| `description`    | ○    | Claude が自動委譲を判断するための説明文                                                                                                                |
| `tools`          | -    | 使用可能なツールのリスト（省略時は全ツールを継承）                                                                                                     |
| `model`          | -    | `sonnet` / `opus` / `haiku` またはフルモデル ID。省略時は親セッションを継承                                                                            |
| `permissionMode` | -    | `default` / `acceptEdits` / `auto` / `bypassPermissions` / `plan`。自動実行では `bypassPermissions` を使用（`settings.json` の deny リストが安全境界） |
| `maxTurns`       | -    | エージェントの最大ターン数                                                                                                                             |

### 8.2. `claude-edit-agent.md`

sonnet モデルを使用する標準 edit エージェント。plan を読んでタスクを実装し、result ファイルに done_criteria の確認結果を記入する。

実際のファイル: `.claude/agents/claude-edit-agent.md`

### 8.3. `claude-review-agent.md`

sonnet モデルを使用する標準 review エージェント。review plan の各観点に従って成果物をレビューし、result ファイルに記録する。Edit/Write ツールは持たない。

実際のファイル: `.claude/agents/claude-review-agent.md`

### 8.4. `claude-expert-edit-agent.md`

opus モデルを使用する高性能 edit エージェント。複雑な分析・アーキテクチャ判断・詳細設計が必要なタスクを担当する。

実際のファイル: `.claude/agents/claude-expert-edit-agent.md`

### 8.5. `claude-expert-review-agent.md`

opus モデルを使用する高性能 review エージェント。多観点の深い分析が必要なレビューを担当する。Edit/Write ツールは持たない。

実際のファイル: `.claude/agents/claude-expert-review-agent.md`

### 8.6. エージェント一覧

| ファイル名                      | `name`                       | モデル   | tools（主要）                                  | 用途                                       |
| ------------------------------- | ---------------------------- | -------- | ---------------------------------------------- | ------------------------------------------ |
| `claude-edit-agent.md`          | `claude-edit-agent`          | `sonnet` | Read, Edit, Write, Bash, WebSearch/Fetch       | 標準的な文書作成・実装                     |
| `claude-review-agent.md`        | `claude-review-agent`        | `sonnet` | Read, Bash, WebSearch/Fetch（Edit/Write なし） | done_criteria の多観点レビュー             |
| `claude-expert-edit-agent.md`   | `claude-expert-edit-agent`   | `opus`   | Read, Edit, Write, Bash, WebSearch/Fetch       | 複雑な設計判断・詳細分析が必要な作成タスク |
| `claude-expert-review-agent.md` | `claude-expert-review-agent` | `opus`   | Read, Bash, WebSearch/Fetch（Edit/Write なし） | 高品質な多観点レビュー                     |

## 9. エージェント割り当て設定

エージェント割り当てのより詳細な設計は [specdojo-exec-strategy-guide](../../specdojo/guides/specdojo-exec-strategy-guide.md) を参照。

### 9.1. `pm-members.yaml` のコマンド設計

`pm-members.yaml` の `command` フィールドに、`specdojo exec run` から呼び出す完全なコマンドを記述する。

`-p`（print mode）と `--agent <name>` を組み合わせることで、`.claude/agents/<name>.md` に定義されたシステムプロンプト・ツール・モデルを使って確認ダイアログなしの自動実行を実現する。

```yaml
members:
  - nickname: claude-edit-agent
    display_name: Claude Edit Agent
    type: agent
    mode: edit
    capabilities: [web_search]
    proficiency: normal
    priority: 10
    command: 'claude -p --agent claude-edit-agent'
    scheduler_strategy: critical-first
    note: Sonnet モデルを使用する標準エージェント。外部 Web 情報参照が必要なタスクを担当する。

  - nickname: claude-review-agent
    display_name: Claude Review Agent
    type: agent
    mode: review
    capabilities: [web_search]
    proficiency: normal
    priority: 10
    command: 'claude -p --agent claude-review-agent'
    scheduler_strategy: fifo
    note: Sonnet モデルを使用するレビューエージェント。done_criteria を多観点で検証する。

  - nickname: claude-expert-edit-agent
    display_name: Claude Expert Edit Agent
    type: agent
    mode: edit
    capabilities: [web_search]
    proficiency: expert
    priority: 10
    command: 'claude -p --agent claude-expert-edit-agent'
    scheduler_strategy: critical-first
    note: Opus モデルを使用する高性能エージェント。複雑な分析・アーキテクチャ判断が必要なタスクを担当する。

  - nickname: claude-expert-review-agent
    display_name: Claude Expert Review Agent
    type: agent
    mode: review
    capabilities: [web_search]
    proficiency: expert
    priority: 10
    command: 'claude -p --agent claude-expert-review-agent'
    scheduler_strategy: fifo
    note: Opus モデルを使用する高性能レビューエージェント。精度が重要なレビュータスクを担当する。
```

### 9.2. `exec-strategy-<track>.yaml`

`docs/ja/projects/prj-0001/execution/exec-strategy-<track>.yaml` にフェーズに応じた capabilities・proficiency を宣言する。`pm-members.yaml` の対応エージェントが自動選択される。

```yaml
assignment_rules:
  # edit タスク: 標準的な補強（mode: edit / normal 水準）
  - phase_set: first-pass
    phase: enrich
    mode: edit
    proficiency: normal

  # edit タスク: 整合性確認・修正（mode: edit / normal 水準）
  - phase_set: finalize-pass
    phase: align
    mode: edit
    proficiency: normal

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

グローバルな rate limit 検出設定を定義する。`exit_codes` と `stderr_patterns` でレートリミットを検出し、`overloaded` は Anthropic API でモデル負荷が高い場合に返るメッセージ。

実際のファイル: [exec-agent.yaml](../../../../.specdojo/exec-agent.yaml)

### 9.4. `exec run` による実行

```bash
# edit: 1バッチ実行して終了
specdojo exec run --auto --parallel 3

# edit: ready タスクがなくなるまで繰り返す
specdojo exec run --auto --loop --parallel 3

# edit/review: exec-strategy の assignment_rules でエージェントを自動選択
specdojo exec run --auto
```

## 10. バックグラウンドセッションによる並列実行

`specdojo exec run` の並列制御と組み合わせることで、複数タスクを同時進行できる。コスト管理には `--max-budget-usd` でセッションごとの API 利用上限を設定できる（print mode のみ）。

```bash
claude -p \
  --agent claude-edit-agent \
  --permission-mode auto \
  --max-budget-usd 1.00 \
  "SpecDojo task を1件実行してください"
```

並列数とモデル tier に応じて1タスクあたりの予算上限を設定することを推奨する。

## 11. worktree 分離セットアップ

複数 `claude-edit-agent` を並列実行する場合は **タスクごとに** worktree を作成し、Git working tree の競合を防ぐ。worktree 名とブランチ名は task_id を使う。`specdojo exec run` が claim 時に自動でセットアップし、complete / block 後に破棄する。`claude-review-agent` は成果物を読み取るだけなので worktree 分離は不要。

### 11.1. ライフサイクル

| タイミング          | 操作                                                          |
| ------------------- | ------------------------------------------------------------- |
| claim 時            | `git worktree add ../worktrees/<task-id> -b exec/<task-id>`   |
| complete / block 時 | `git worktree remove ../worktrees/<task-id>` でクリーンアップ |

`specdojo exec run` がこのライフサイクルを自動管理するため、手動セットアップは原則不要。

### 11.2. ディレクトリ構成

```text
repo/
worktrees/
  T-ARC-base-arch-010/      # ブランチ: exec/T-ARC-base-arch-010（実行中）
  T-BA-user-story-020/      # ブランチ: exec/T-BA-user-story-020（実行中）
  T-DEV-api-impl-010/       # ブランチ: exec/T-DEV-api-impl-010（実行中）
```

### 11.3. 手動実行時の worktree セットアップ

`specdojo exec run` を使わず手動で実行する場合：

```bash
TASK_ID=T-ARC-base-arch-010
git worktree add ../worktrees/${TASK_ID} -b exec/${TASK_ID}

cd ../worktrees/${TASK_ID}
claude -p \
  --agent claude-edit-agent \
  --permission-mode auto \
  "SpecDojo task ${TASK_ID} を実行してください"

# 完了後クリーンアップ
git worktree remove ../worktrees/${TASK_ID}
```

### 11.4. イベントファイルの命名規則

worktree 分離時は `exec/events/` への append-only イベントがブランチ間で衝突しやすい。イベントファイル名は必ずユニークにする。

形式：`<timestamp>-<by>-<task-id>-<event-type>.json`

```text
exec/events/
  20260305T031000Z-claude-edit-agent-T-ARC-base-arch-010-claim.json
  20260305T031530Z-claude-edit-agent-T-ARC-base-arch-010-complete.json
  20260305T031000Z-claude-edit-agent-T-BA-user-story-020-claim.json
```

task_id がユニークなため、同じエージェントが並列実行しても衝突しない。
