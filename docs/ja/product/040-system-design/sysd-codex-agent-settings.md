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

- **非対話実行は `codex exec`**: TUI を起動せず、タスクプロンプトを渡して応答後に終了する。`approval_policy="never"` を指定し、sandbox 外の操作は承認待ちにせず失敗としてrunnerへ返す。
- **用途別モデル分担**: 標準作業を高速・低コストモデル、複雑な設計判断を高性能モデルで分担する。
- **制限情報は実行結果から扱う**: token usage は JSONL から取得できるが、session limit や quota 残量を返す専用 status API を前提にしない。
- **共有設定は `.codex/config.toml`**: trusted project で読み込まれるプロジェクトデフォルトを定義する。
- **プロジェクト共通ルールは `AGENTS.md`**: セッション開始時に自動読み込みされる。
- **custom agent は `.codex/agents/*.toml`**: 親 Codex が明示的に spawn する subagent の定義に使用する。SpecDojo が直接起動する worker とは分離する。
- **権限は最小化する**: edit / review ともresult更新のため `workspace-write` を使用する。reviewはplanで成果物変更を禁止する。`danger-full-access` と `--yolo` は使用しない。

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
│     ├─ codex-edit-agent.toml        # 必要時に親 Codex が spawn する edit subagent
│     ├─ codex-review-agent.toml      # 必要時に親 Codex が spawn する review subagent
│     ├─ codex-expert-edit-agent.toml # 複雑な作業用の expert edit subagent
│     └─ codex-expert-review-agent.toml # 複雑なレビュー用の expert review subagent
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
| `codex-review-agent`        | review | `gpt-5.4-mini` | `medium`         | `workspace-write` | done_criteria の多観点レビュー     |
| `codex-expert-edit-agent`   | edit   | `gpt-5.5`      | `high`           | `workspace-write` | 複雑な設計判断・詳細分析を伴う実装 |
| `codex-expert-review-agent` | review | `gpt-5.5`      | `high`           | `workspace-write` | 高品質な多観点レビュー             |

### 8.2. `.codex/agents/*.toml`

custom agent は親 Codex セッションが明示的に spawn する subagent である。SpecDojo が複数 worker を起動する仕組みとは別であり、1つの複雑な plan 内で探索・レビューなどを委譲する場合だけ使用する。

必須フィールドは `name`・`description`・`developer_instructions`。モデル、reasoning effort、sandbox などは親セッションから継承するか、agent ファイルで上書きする。本文には最小限の実行契約だけを置き、タスク固有の手順は edit / review plan を正本とする。

`codex-edit-agent` は成果物と result を更新するため `workspace-write` を使用する。

実際のファイル: `.codex/agents/codex-edit-agent.toml`

`codex-review-agent` は成果物を変更せず result だけを更新する。Codex の sandbox はパス単位の書き込み制御を提供しないため `workspace-write` を使用し、成果物変更禁止を `developer_instructions` と plan で制約する。

実際のファイル: `.codex/agents/codex-review-agent.toml`

`codex-expert-edit-agent` は複雑な分析・設計判断を伴う edit plan を担当し、`gpt-5.5` と reasoning effort `high` を使用する。

実際のファイル: `.codex/agents/codex-expert-edit-agent.toml`

`codex-expert-review-agent` は複雑な多観点 review plan を担当し、成果物を変更せず result だけを更新する。

実際のファイル: `.codex/agents/codex-expert-review-agent.toml`

| ファイル名                       | モデル         | reasoning effort | sandbox           | 用途          |
| -------------------------------- | -------------- | ---------------- | ----------------- | ------------- |
| `codex-edit-agent.toml`          | `gpt-5.4-mini` | `medium`         | `workspace-write` | 標準 edit     |
| `codex-review-agent.toml`        | `gpt-5.4-mini` | `medium`         | `workspace-write` | 標準 review   |
| `codex-expert-edit-agent.toml`   | `gpt-5.5`      | `high`           | `workspace-write` | expert edit   |
| `codex-expert-review-agent.toml` | `gpt-5.5`      | `high`           | `workspace-write` | expert review |

並列 write は競合しやすいため、親セッションからsubagentをspawnする場合も同一ファイルを複数agentへ割り当てない。

### 8.3. agent 選択の仕組み

Codex連携には、SpecDojo workerの選択とCodex custom subagentの選択という2段階がある。command lineの引数だけで `.codex/agents/*.toml` を選択する仕組みではない。

```text
sch-strategy の phase 要件
   ↓
SpecDojo が pm-members.yaml から worker を選択
   ↓
選択した member.command で codex exec を起動
   ↓
Codex が AGENTS.md と標準入力の plan を読み込む
   ↓
必要な場合だけ、親 Codex が .codex/agents/*.toml の custom subagent を spawn
```

#### SpecDojo workerの選択

`specdojo exec run` は、taskのphase要件と `pm-members.yaml` の各memberを次の順で照合する。

1. `type: agent` であり、`command` が定義されているmemberだけを候補にする。
2. taskの `mode` とmemberの `mode` が一致する候補だけを残す。
3. taskが要求する `capabilities` をすべて持つ候補だけを残す。
4. taskに `proficiency` が指定されている場合は、同じ値の候補だけを残す。
5. `priority` の数値が小さい候補を優先する。
6. `priority` が同じ場合は、task要件に対する余分なcapabilityが少ない候補を優先する。

並べ替え後の先頭候補が通常の実行workerになる。critical path上でrate limitが発生し、fallback方針が `try_next` の場合は、同じ条件に適合する後続候補を順に試す。

たとえば、phaseが `mode: edit`、`proficiency: expert`、`capabilities: [web_search]` を要求する場合、`codex-expert-edit-agent` がCodex候補になる。選択後に実行されるcommandは次のとおりである。

```bash
codex exec \
  --ephemeral \
  --sandbox workspace-write \
  --model gpt-5.5 \
  -c approval_policy='"never"' \
  -c model_reasoning_effort='"high"'
```

このcommandの `--model`、`--sandbox`、`model_reasoning_effort` は、選択済みworkerの実行設定であり、worker名を選択する引数ではない。`codex exec` にはOpenCodeやClaude Codeの `--agent <name>` に相当する直接worker選択オプションはない。

memberを明示して実行する場合は `--cmd` にnicknameを指定する。

```bash
specdojo exec run --cmd codex-edit-agent
specdojo exec run --cmd codex-expert-review-agent
```

`--by` はeventやresultに記録するactor名の上書きであり、member選択には使用しない。

#### Codex custom subagentの選択

`.codex/agents/*.toml` は、起動済みの親Codexが内部で追加agentへ委譲する場合の定義である。SpecDojoと `codex exec` のcommand lineは、このファイルを直接選択しない。

- `codex-edit-agent.toml`: 親Codexが標準edit作業を分担させる場合のsubagent
- `codex-review-agent.toml`: 親Codexが標準reviewを分担させる場合のsubagent
- `codex-expert-edit-agent.toml`: 親Codexが複雑なedit作業を分担させる場合のsubagent
- `codex-expert-review-agent.toml`: 親Codexが複雑なreviewを分担させる場合のsubagent

親Codexはsubagentのnameとdescriptionを参照し、必要な場合に明示的にspawnする。spawnしない場合、`.codex/agents/*.toml` はworker実行へ影響せず、workerは `AGENTS.md`、`pm-members.yaml` のcommand、標準入力のplanだけで動作する。

workerのnicknameとcustom subagentのnameは運用上同じ名称に揃えているが、Codex CLIが自動的に両者を関連付けるわけではない。たとえば `pm-members.yaml` で `codex-expert-edit-agent` が選ばれても、`.codex/agents/codex-expert-edit-agent.toml` が自動適用されることはない。

## 9. エージェント割り当て設定

### 9.1. `pm-members.yaml` のコマンド設計

```yaml
members:
  - nickname: codex-edit-agent
    type: agent
    mode: edit
    capabilities: [web_search]
    proficiency: normal
    priority: 2
    command: 'codex exec --ephemeral --sandbox workspace-write --model gpt-5.4-mini -c approval_policy="never" -c model_reasoning_effort="medium"'
    scheduler_strategy: critical-first

  - nickname: codex-review-agent
    type: agent
    mode: review
    capabilities: [web_search]
    proficiency: normal
    priority: 2
    command: 'codex exec --ephemeral --sandbox workspace-write --model gpt-5.4-mini -c approval_policy="never" -c model_reasoning_effort="medium"'
    scheduler_strategy: fifo

  - nickname: codex-expert-edit-agent
    type: agent
    mode: edit
    capabilities: [web_search]
    proficiency: expert
    priority: 1
    command: 'codex exec --ephemeral --sandbox workspace-write --model gpt-5.5 -c approval_policy="never" -c model_reasoning_effort="high"'
    scheduler_strategy: critical-first

  - nickname: codex-expert-review-agent
    type: agent
    mode: review
    capabilities: [web_search]
    proficiency: expert
    priority: 1
    command: 'codex exec --ephemeral --sandbox workspace-write --model gpt-5.5 -c approval_policy="never" -c model_reasoning_effort="high"'
    scheduler_strategy: fifo
```

`--ephemeral` はセッション rollout ファイルを保存しない。実行履歴の正本は SpecDojo の event・plan・result とする。

### 9.2. `sch-strategy-<track>.yaml`

phase の共通契約は親設計に従う。Codex の Web 検索が必要な phase は `capabilities: [web_search]` を指定し、複雑な実装や設計判断が必要な場合は `proficiency: expert` を指定する。

### 9.3. `.specdojo/exec-defaults.yaml`

共通の retry / fallback / block 方針は親設計に従う。OpenAI API の rate limit は `429` または rate limit を示すメッセージとして検出する。

Codex では session limit も CLI の stderr message として現れうる。共通層では `limited` として扱うが、provider 固有シグナルでは `session_limit` と `rate_limit` を区別して保持する。

実際のファイル: `.specdojo/exec-defaults.yaml`

### 9.4. `exec run` による実行

共通の実行コマンドは親設計を参照する。Codex member は phase の `capabilities` / `proficiency` と `pm-members.yaml` の属性により自動選択される。

## 10. 非対話実行と出力

`codex exec` は進捗を stderr、最終メッセージを stdout に出力する。`--json` を指定すると JSONL イベントを stdout に出力できる。SpecDojo の判定を構造化出力へ拡張する場合は、`--output-schema` と `--output-last-message` の利用を検討する。

`--json` の `turn.completed` event には usage 情報を含められるため、input token、cached input token、output token などの実測値は取得できる。一方で、残り quota、残り session 枠、reset 時刻を返す documented な共通 status コマンドは前提にしない。`codex login status` は認証状態の確認用であり、利用残量 API ではない。

```bash
codex exec \
  --ephemeral \
  --sandbox workspace-write \
  --model gpt-5.4-mini \
  -c approval_policy='"never"' \
  -c model_reasoning_effort='"medium"' \
  "SpecDojo task を1件実行してください"
```

`specdojo exec run` との統合では、plan の内容は**引数ではなく stdin** 経由で渡す。YAML frontmatter の `---` がコマンドラインオプションとして誤認されるのを防ぐためである。

```bash
cat exec/plans/<task-id>-plan.md | codex exec \
  --ephemeral \
  --sandbox workspace-write \
  --model gpt-5.4-mini \
  -c approval_policy='"never"' \
  -c model_reasoning_effort='"medium"'
```

非対話実行では新しい承認要求に応答できない。必要な操作が sandbox の範囲を超える場合は、権限を広げて再実行せず非0で終了し、runner に block 判断を戻す。

## 11. worktree 分離セットアップ

worktree のライフサイクル、配置、ブランチ名、イベントファイル名は親設計に従う。edit worker の並列実行ではworktreeを使用する。review workerは `workspace-write` だが成果物を変更せずresultだけを更新するため、成果物競合防止を目的としたworktree分離は不要とする。

## 12. 公式仕様参照

- [Codex configuration](https://developers.openai.com/codex/config-basic)
- [Codex CLI reference](https://developers.openai.com/codex/cli/reference)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md)
- [Codex subagents](https://developers.openai.com/codex/subagents)
