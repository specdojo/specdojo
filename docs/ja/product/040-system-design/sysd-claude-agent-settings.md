---
specdojo:
  id: sysd-claude-agent-settings
  type: project
  status: draft
  rulebook: sysd-rulebook
  part_of:
    - sysd-agent-settings
---

# Claude Code エージェント設定

SpecDojo CLI と Claude Code を組み合わせてマルチエージェント実行を行うための設定・構成を定義する。

## 1. 設計方針

共通の責務分担、実行フロー、割り当て、失敗処理、worktree は [エージェント共通設定](sysd-agent-settings.md) に従う。本書では Claude Code 固有の設定だけを定義する。

Claude Code は Anthropic API 経由でクラウドモデルを使用する。ローカルLLMが不要な環境や Web 検索能力が必要なタスクに適する。

- **Anthropic API 使用**: `ANTHROPIC_API_KEY` または `claude auth login` で認証する。
- **用途別モデル分担**: 標準作業（edit/review）を `sonnet`、複雑な設計判断・詳細分析を `opus` で分担する。
- **エージェント定義は `.claude/agents/*.md`**: YAML frontmatter でモデル・ツール・権限モードを設定し、本文には最小限の実行契約を記述する。タスク固有の指示は edit / review plan を正本とする。
- **非対話モード（print mode）**: `claude -p --agent <name>` で TUI を起動せず、タスクプロンプトを渡して応答後に終了する。自動化・CI 用途の標準方式。
- **制限情報は print mode の結果で扱う**: JSON / stream-json 出力、認証 status、予算上限は利用できるが、provider quota の残量や reset 時刻を返す専用 status API は前提にしない。
- **プロジェクト共通ルールは `CLAUDE.md`**: セッション開始時に自動読み込みされる。エージェント固有の指示は `.claude/agents/` に分離する。

## 2. 責務分担

3層の共通責務は親設計に従う。Claude Code agent は、Claude 固有の Web ツール、権限モード、モデル、agent 定義を使用して plan を処理する。claim、complete、block、並列起動、worktree 管理は行わない。

## 3. 全体フロー

```text
specdojo exec run
   → providers.claude の command template から解決した claude -p --agent <name> を起動
   → plan を標準入力で渡す
   → Claude Code agent が成果物または result を編集
   → Claude CLI の終了状態を共通フローへ返す
```

edit / review の選択と終了後の状態遷移は親設計に従う。

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
```

SpecDojo の project management 配下と worktree の共通構成は親設計を参照する。

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

`CLAUDE.md` はリポジトリルートに置き、コンテキストに関わらず常に読み込まれる。そのため、リポジトリ内のどの作業にも共通する最小限のルールに限定し、特定ディレクトリ・特定ワークフローにしか適用されない指示を混在させない。

- **`CLAUDE.md`（リポジトリルート）**: Language・Project Policy・Safetyなど、SpecDojo ツール自体の開発作業を含むあらゆる作業に共通するルールのみを記述する。100行以内を目安にする。
- **SpecDojo exec ワークフロー固有の指示**: `claim` 手順、exec plan・result ファイルの参照・記入手順など、SpecDojo exec タスク実行時にのみ必要な指示は `CLAUDE.md` に含めない。`.claude/rules/*.md` に `paths` frontmatter（例: `docs/ja/projects/**`）でスコープを限定したルールファイルとして分離し、対象ディレクトリ配下を扱う場合にのみ読み込まれるようにする。`.claude/rules/markdown.md` の構成（パス限定 + 参照リンクのみの薄いラッパー）を踏襲する。
- **エージェント固有の指示**: モデル・ツール・権限と最小実行契約は `.claude/agents/*.md` に置く。対象成果物、owner 観点、result の記入方法、検証、終了条件は edit / review plan に置き、重複記載しない。

こうすることで、SpecDojo ツール自体のソースコード実装（`src/`、`tests/` 等）のように exec ワークフローと無関係な作業でも、不要なワークフロー指示が常に読み込まれる事態を避けられる。

実際のファイル: `CLAUDE.md`

## 8. エージェント定義ファイル設計

エージェントは `.claude/agents/<name>.md` に YAML frontmatter とシステムプロンプトで定義する。`name` フィールドが `--agent` フラグで参照される識別子になる。

システムプロンプトは、標準入力で渡された plan に従うこと、agent 自身で claim / complete / block を行わないこと、事実を捏造しないことだけを定める。タスク固有の実行手順と判定基準は plan を正本とする。

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

エージェント割り当てのより詳細な設計は [specdojo-exec-config-guide](../../specdojo/guides/specdojo-exec-config-guide.md) を参照。

### 9.1. 起動コマンドの設計

起動コマンドは親設計の `起動コマンドの解決` に従い、`.specdojo/exec-defaults.yaml` の `providers.claude.command_template` で定義する。`pm-members.yaml` の member には `command` を書かない。

```yaml
providers:
  claude:
    command_template: "claude -p --verbose --agent {nickname} --settings .specdojo/claude/settings.{mode}.json"
```

- `{nickname}` は member の nickname に展開され、`.claude/agents/<nickname>.md` の agent 定義を選択する。member の nickname と agent 定義のファイル名を一致させる。
- `{mode}` は member の `mode` に展開され、edit / review 別の permission 設定 `.specdojo/claude/settings.<mode>.json` を選択する。
- モデルは agent 定義ファイルの `model` フィールドで指定するため、テンプレートにモデル名を含めない（normal は `sonnet`、expert は `opus`）。

`-p`（print mode）と `--agent <name>` を組み合わせることで、`.claude/agents/<name>.md` に定義されたシステムプロンプト・ツール・モデルを使って確認ダイアログなしの自動実行を実現する。`--permission-mode bypassPermissions` は使わない（`.claude/settings.json` の `disableBypassPermissionsMode: "disable"` で起動自体を拒否する）。

`pm-members.yaml` の member は選択属性だけを持つ。

```yaml
members:
  - nickname: claude-edit-agent
    display_name: Claude Edit Agent
    type: agent
    provider: claude
    mode: edit
    capabilities: [web_search]
    proficiency: normal
    priority: 3
    scheduler_strategy: critical-first
    note: Sonnet モデルを使用する標準エージェント。外部 Web 情報参照が必要なタスクを担当する。

  - nickname: claude-review-agent
    display_name: Claude Review Agent
    type: agent
    provider: claude
    mode: review
    capabilities: [web_search]
    proficiency: normal
    priority: 3
    scheduler_strategy: fifo
    note: Sonnet モデルを使用するレビューエージェント。done_criteria を多観点で検証する。

  - nickname: claude-expert-edit-agent
    display_name: Claude Expert Edit Agent
    type: agent
    provider: claude
    mode: edit
    capabilities: [web_search]
    proficiency: expert
    priority: 2
    scheduler_strategy: critical-first
    note: Opus モデルを使用する高性能エージェント。複雑な分析・アーキテクチャ判断が必要なタスクを担当する。

  - nickname: claude-expert-review-agent
    display_name: Claude Expert Review Agent
    type: agent
    provider: claude
    mode: review
    capabilities: [web_search]
    proficiency: expert
    priority: 2
    scheduler_strategy: fifo
    note: Opus モデルを使用する高性能レビューエージェント。精度が重要なレビュータスクを担当する。
```

### 9.2. `sch-strategy-<track>.yaml`

phase の共通契約は親設計に従う。Claude Code を必要とする phase は `capabilities: [web_search]` を指定し、複雑な設計判断が必要な場合は `proficiency: expert` を指定する。

### 9.3. `.specdojo/exec-defaults.yaml`

共通の retry / fallback / block 方針とグローバル既定 / provider 別上書きの2層構造は親設計に従う。Claude 固有の検出条件は `providers.claude.rate_limit_detection` に置き、`pm-members.yaml` で `provider: claude` の member に適用する。

```yaml
providers:
  claude:
    rate_limit_detection:
      stderr_patterns:
        - "rate limit"
        - "429"
        - "overloaded"
        - "session limit"
```

`429 Too Many Requests` が Anthropic API の rate limit シグナル、`overloaded` はモデル負荷が高い場合に返るメッセージである。`session limit` は実行ログ（`logs/exec-auto.log`）で `You've hit your session limit · resets 4:10am (UTC)` として観測した実文言で、`rate limit` / `429` を含まない。この事例は現状 `exit_codes: [1]` で偶発的に検出されていたが、exit 1 は agent 自身の block 終了と区別できないため、汎用的な `exit_codes: [1]` は使わず、この stderr 文言で明示的に検出する。

実際のファイル: [exec-defaults.yaml](../../../../.specdojo/exec-defaults.yaml)

`try_next` でフォールバックメンバー（`claude-expert-edit-agent` など）に切り替えることで継続実行できる。

Claude Code の limit は次の種類があり、reset horizon が異なるため正規化と回復戦略を変える。共通モデルへの写像は親設計の limit 表に従う。

| limit               | 概要                                                                                                            | reset horizon          | `provider_signal.kind` | 扱い                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------- | ----------------------------------------------------------------------------------------------- |
| rate limit（`429`） | API リクエスト過多による一時制限                                                                                | 秒〜分                 | `rate_limit`           | `limited` / retryable。wait+backoff か try_next                                                 |
| `overloaded`        | モデル負荷が高い場合のメッセージ                                                                                | 秒〜分                 | `overloaded`           | `transient_failure` / retryable。wait+backoff                                                   |
| 5時間枠（session）  | 最初のメッセージから300分のローリング枠で token を集計。stderr に reset 時刻を含む（例: `resets 4:10am (UTC)`） | 時間（初回 prompt+5h） | `session_limit`        | `limited`。別 provider への try_next を優先。reset 時刻は `provider_signal.metadata` へ取り込む |
| 週次上限            | ローリング7日の computing-hour 予算。5時間枠とは別に上限化                                                      | 日〜週                 | `quota_exhausted`      | `limited` だが run 内回復は不可。try_next か block                                              |

`claude auth status` で認証状態は JSON で取得できるが、provider quota の残量、session limit、reset 時刻を返す共通 CLI は前提にしない。残量や reset 時刻は `claude /usage` / `/status` で人が確認する補助情報とし、自動制御は error message と exit code に基づく正規化で行う。

### 9.4. `exec run` による実行

共通の実行コマンドは親設計を参照する。Claude Code の member は phase の `capabilities` / `proficiency` と `pm-members.yaml` の属性により自動選択される。

## 10. バックグラウンドセッションによる並列実行

`specdojo exec run` の並列制御と組み合わせることで、複数タスクを同時進行できる。コスト管理には `--max-budget-usd` でセッションごとの API 利用上限を設定できる（print mode のみ）。

`--output-format json` または `--output-format stream-json` を使うと、自動実行で機械可読なイベント列を取得できる。ここから turn 単位の結果や補助診断は得られるが、`--max-budget-usd` は Claude Code 側の停止条件であり、Anthropic 側 quota の残量を表すものではない。

```bash
claude -p \
  --agent claude-edit-agent \
  --permission-mode auto \
  --max-budget-usd 1.00 \
  "SpecDojo task を1件実行してください"
```

並列数とモデル tier に応じて1タスクあたりの予算上限を設定することを推奨する。

## 11. worktree 分離セットアップ

worktree のライフサイクル、配置、ブランチ名、イベントファイル名は親設計に従う。`claude-edit-agent` と `claude-expert-edit-agent` の並列実行では worktree を使用し、成果物を変更しない review agent では不要とする。
