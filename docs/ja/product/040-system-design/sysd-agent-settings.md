---
specdojo:
  id: sysd-agent-settings
  type: project
  status: draft
  rulebook: sysd-rulebook
---

# エージェント共通設定

SpecDojo CLI と外部エージェント CLI を組み合わせてマルチエージェント実行を行う際の共通設計を定義する。

個別の CLI、provider、モデル、認証、権限、agent 定義は次の子設計で定義する。

- [Claude Code エージェント設定](sysd-claude-agent-settings.md)
- [Codex エージェント設定](sysd-codex-agent-settings.md)
- [GitHub Copilot エージェント設定](sysd-github-copilot-agent-settings.md)
- [OpenCode エージェント設定（Ollama）](sysd-opencode-agent-settings.md)

## 1. 設計方針

SpecDojo CLI、agent、`specdojo exec run` の3層に責務を分割する。

- **SpecDojo CLI**: タスク状態、依存関係、実行計画、結果、イベントを管理する。
- **agent**: 渡された plan を解釈し、関連文書を読み、成果物の編集またはレビューと result の記録を行う。
- **`specdojo exec run`**: member 選択、起動、フェーズ順序、並列数、worktree、フォールバックを制御する。

共通方針は次のとおりとする。

- agent は scheduler として動作せず、渡された1件の plan だけを処理する。
- edit と review は `mode` で分離し、review agent に成果物の編集権限を与えない。
- phase の `capabilities` と `proficiency` を member の属性と照合して agent を選択する。
- 複数の edit agent を並列実行する場合は、タスクごとに worktree を割り当てる。
- 認証情報は環境または各 CLI の認証ストアから注入し、リポジトリへ保存しない。
- CLI 固有の権限機構を使用し、無制限のファイル操作や確認回避を通常運用に含めない。
- rate limit、session limit、quota、timeout などの失敗理由は、共通層では正規化した状態に写像し、元の CLI 固有シグナルは別フィールドで保持する。

## 2. 責務分担

| 層                  | 責務                                                                                             | 責務外                             |
| ------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------- |
| SpecDojo CLI        | validate / build / ready 抽出 / claim / complete / block / lock / CPM / plan・result・event 管理 | タスク内容の理解・成果物の編集     |
| agent               | plan の解釈・関連文書の読解・成果物の編集またはレビュー・done criteria の確認・result の記録     | タスク取得の排他制御・並列起動制御 |
| `specdojo exec run` | member 選択・フェーズ順序・並列数・worktree 割り当て・agent 起動・終了状態の反映・フォールバック | タスク内容の判断・成果物の編集     |

各 agent CLI の設定ファイル、モデル、権限、非対話コマンドは子設計の責務とする。

## 3. 共通実行フロー

```text
schedule yaml（owner・phase・mode・capabilities・proficiency を定義）
   ↓
specdojo exec build
   ↓
generated/ready.json / exec/plans/<task-id>-plan.md
   ↓
specdojo exec run
   → ready task を claim
   → exec/results/<task-id>-result.md を scaffold 生成
   → phase 要件に適合する member を選択
   → edit task では必要に応じて task 単位の worktree を作成
   → provider の command template（または member の command 上書き）から解決した
     コマンドで agent CLI を非対話起動し、plan を渡す
   → agent が成果物の編集またはレビューと result の記録を実行
   → 終了コード 0 は complete、失敗はポリシーに従って retry / fallback / block
   → worktree をクリーンアップ
```

edit と review の順序は固定しない。`sch-strategy-<track>.yaml` の phase に `mode: edit` または `mode: review` を定義し、スケジュール構造で順序を表現する。

## 4. 共通ディレクトリ

```text
docs/ja/projects/prj-0001/030-project-management/
├─ 020-organization/
│  └─ pm-members.yaml                 # agent CLI の起動定義と選択属性
├─ schedule/
│  └─ sch-strategy-<track>.yaml       # phase の mode・capabilities・proficiency
└─ execution/
   ├─ exec/
   │  ├─ plans/                       # agent に渡す plan
   │  ├─ results/                     # agent が確認結果を記録する result
   │  └─ events/                      # append-only の状態変更イベント
   └─ generated/
      └─ ready.json                   # exec build の生成物
```

agent CLI 固有のプロジェクト設定と agent 定義の配置は子設計で定義する。

## 5. エージェント割り当て

### 5.1. `pm-members.yaml`

`pm-members.yaml` の member は、少なくとも次の属性で実行方法と選択条件を定義する。

| 項目                 | 用途                                                                |
| -------------------- | ------------------------------------------------------------------- |
| `nickname`           | event、result、`--by` で使用する member 識別子                      |
| `type`               | agent member は `agent`                                             |
| `provider`           | member を起動する agent runtime（失敗処理の provider 別解決に使う） |
| `mode`               | `edit` または `review`                                              |
| `capabilities`       | Web 検索など、その member が提供できる能力                          |
| `proficiency`        | `normal` または `expert`                                            |
| `priority`           | 同じ要件に適合する member 間の優先順位                              |
| `command`            | 任意。provider の command template を使わない場合の上書きコマンド   |
| `scheduler_strategy` | ready task の選択順序。edit は `critical-first` を基本とする        |

member を起動する非対話コマンドは、原則として `.specdojo/exec-defaults.yaml` の `providers.<provider>.command_template` から解決する（`起動コマンドの解決` を参照）。`pm-members.yaml` は「誰が・どの能力で・どの優先度か」だけを表し、CLI フラグやモデル名などの実行基盤設定を持ち込まない。テンプレートで表現できない特殊構成（`provider: custom` など）に限り、member の `command` で上書きする。

解決後のコマンドには agent CLI と実行オプションだけが含まれる。plan 本文はコマンド文字列へ埋め込まず、`specdojo exec run` から標準入力で渡す。

### 5.2. `sch-strategy-<track>.yaml`

phase は `mode`、`capabilities`、`proficiency` で作業要件を宣言する。`specdojo exec run` は要件を満たす member を選択する。

```yaml
phase_sets:
  first-pass:
    - id: enrich
      mode: edit
      proficiency: normal

  finalize-pass:
    - id: align
      mode: review
      proficiency: expert
```

CLI 名やモデル名は phase に記述しない。実行環境の差し替えは `pm-members.yaml` で行う。

詳細は [specdojo-exec-config-guide](../../specdojo/guides/specdojo-exec-config-guide.md) を参照する。

## 6. 実行と失敗処理

### 6.1. 非対話実行

agent CLI は TUI を起動しない非対話モードで実行する。plan は標準入力で渡し、YAML frontmatter や本文がコマンドラインオプションとして解釈されないようにする。

agent は次の契約に従う。

- plan に指定された対象と done criteria だけを処理する。
- edit agent は成果物を編集し、review agent は成果物を変更せず所見を result に記録する。
- result の done criteria 確認欄を更新してから終了する。
- agent 自身は claim、complete、block を実行しない。
- 権限不足や判断不能な状態では権限を拡大せず、非0で終了して block 判断を呼び出し元へ戻す。

共通の実行例は次のとおりとする。

```bash
# 1バッチ実行
specdojo exec run --auto --parallel 3

# ready task がなくなるまで実行
specdojo exec run --auto --loop --parallel 3

# member を明示して実行
specdojo exec run --by <member-nickname>
```

### 6.2. `.specdojo/exec-defaults.yaml`

agent の起動コマンドテンプレート、rate limit と一時障害の検出条件、および retry / fallback / block のポリシーは `.specdojo/exec-defaults.yaml` で管理する。検出対象となる終了コード、stderr pattern、待機時間は provider ごとに異なるため、共通設計はグローバル既定値と provider 別上書きの2層で構成する。起動コマンドは provider 固有の情報のため、グローバル既定は持たず `providers.<provider>` にのみ置く（`起動コマンドの解決` を参照）。

- グローバル既定: top-level の `rate_limit_detection` / `rate_limit_policy`。provider 別上書きを持たない member に適用する。
- provider 別上書き: `providers.<provider>` 配下に `rate_limit_detection` / `rate_limit_policy` を置く。キーは `pm-members.yaml` の `provider` と一致させる。

`specdojo exec run` は、対象 member の `provider` に一致する上書きがあればそれを、なければグローバル既定を解決して使用する。上書きで与えたキーは、その provider の member に対してグローバルの同名キーを丸ごと置き換える（与えなかったキーはグローバルにフォールバックする）。`rate_limit_detection` と `rate_limit_policy` は独立に解決するため、一方だけ上書きしても他方はグローバルに残る。これにより、ある provider 固有のシグナル（例: OpenCode のロード待ちや timeout）が他 provider の検出へ混入しない。

解決の粒度は次のとおり。検出条件はフォールバック候補ごとに各 member の `provider` で解決する（候補が provider をまたぐ場合に各々の正しいパターンで判定する）。run 単位の retry / backoff の policy は、最優先候補（先頭候補）の `provider` で解決する。

```yaml
# グローバル既定（上書きの無い provider 向け）
rate_limit_detection:
  exit_codes: [1]
  stderr_patterns:
    - "rate limit"
    - "429"

rate_limit_policy:
  on_non_critical:
    action: skip
  on_critical:
    action: try_next
    retry:
      max_attempts: 3
      initial_wait_seconds: 60
      backoff_multiplier: 3 # 60s -> 180s -> 540s
      max_wait_seconds: 600
    on_exhausted: block

# provider 別上書き（キーは pm-members[].provider）
providers:
  opencode:
    rate_limit_detection:
      exit_codes: [] # ローカル実行では exit 1 は実失敗。stderr で判定する
      stderr_patterns:
        - "timeout"
        - "out of memory"
        - "model is loading"
```

検出条件には汎用的な `exit_codes: [1]` を使わない。多くの agent CLI は通常失敗と agent 自身の block も exit 1 で返すため、素の exit 1 だけでは rate limit と block を区別できない（`非対話実行` の終了契約を参照）。検出は provider 固有の `stderr_patterns` に寄せ、グローバルの `exit_codes: [1]` は上書きの無い provider 向けの後方互換フォールバックとして最小限にとどめる。

`stderr_patterns` は終了コードと併用して判定する。`stderr_requires_nonzero_exit` が `true`（既定）のとき、stderr pattern はプロセスが非ゼロ終了（または異常終了）した場合にのみ rate limit シグナルとして扱う。agent が成功（exit 0）したまま、編集対象ファイルに含まれる `rate limit` 等の語を stderr へ出力しても誤検出しない。`exit_codes` に列挙したコードは従来どおり単独でシグナルとして成立する。終了コードに依らず stderr のみで判定したい provider は `stderr_requires_nonzero_exit: false` を明示する。

子設計には、その provider 固有のシグナルと、`providers.<provider>` に置く上書きの内容・運用上の注意だけを記述する。

### 6.3. 起動コマンドの解決

member を起動する非対話コマンドは、`providers.<provider>` の `command_template` と `command_params` から member 属性で展開して解決する。同一 provider の member 間でモデル名・フラグ・設定ファイルパスが重複しないよう、可変部分だけをプレースホルダにする。

```yaml
providers:
  claude:
    command_template: "claude -p --verbose --agent {nickname} --settings .specdojo/claude/settings.{mode}.json"

  codex:
    command_template: 'codex exec --ephemeral --sandbox workspace-write -c approval_policy="never" -c sandbox_workspace_write.network_access=false --model {model} -c model_reasoning_effort="{effort}"'
    command_params:
      by_proficiency:
        normal: { model: gpt-5.4-mini, effort: medium }
        expert: { model: gpt-5.5, effort: high }
```

解決規則は次のとおりとする。

- プレースホルダの記法は `{lower_snake}` とする。実行のたびに展開される実行時変数であり、scaffold 用テンプレートの記入プレースホルダ `_UPPER_SNAKE_`（一度埋めたら消える）とは区別する。
- 組み込みプレースホルダは `{nickname}`、`{mode}`、`{proficiency}` とし、member の同名属性で展開する。
- 追加プレースホルダは `command_params.by_mode.<member.mode>` と `command_params.by_proficiency.<member.proficiency>` の変数表で展開する。同名キーが `by_mode` と `by_proficiency` の両方に存在する定義は検証エラーとする。
- member に `command` がある場合はテンプレートを使わず、その値をそのまま使う（上書き）。
- 上書きが無く、`command_template` も無い provider の agent は、`exec run --auto` の候補にしない。
- 展開後に未解決のプレースホルダが残る場合は、その member を起動せず検証エラーとして報告する。
- `command_template`、`command_params`、member の `command` のいずれにも、認証情報、秘密鍵、トークン、個人環境に閉じたパスを記載しない。

`--cmd` によるコマンド直接指定は従来どおり member 解決より優先する。nickname 指定時はこの解決規則で得たコマンドを使う。

### 6.4. 制限情報と使用量の共通設計

4系統の agent CLI で共通取得できるのは、主に「今回の実行が継続可能か」「再試行価値があるか」という実行状態である。rate limit、session limit、quota 残量、premium request 残数、reset 時刻は CLI ごとに露出の粒度と取得方法が異なるため、共通 API で同一意味にそろえる前提を置かない。

共通層では次の正規化結果を扱う。

| フィールド                | 用途                            | 値の例                                                                                |
| ------------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| `availability_state`      | 次の制御判断に使う共通状態      | `available` / `limited` / `transient_failure` / `fatal_failure`                       |
| `retryable`               | wait や別 member への切替対象か | `true` / `false`                                                                      |
| `provider_signal.kind`    | CLI 固有の元理由                | `rate_limit` / `session_limit` / `quota_exhausted` / `overloaded` / `timeout` / `oom` |
| `provider_signal.message` | stderr や JSON event の原文     | 例: `You've hit your session limit`                                                   |
| `observed_usage`          | 取得できた usage 情報だけを保持 | token usage、cost、AIU、session stats など                                            |

この設計での原則は次のとおりとする。

- 共通層は raw message を解釈して `availability_state` を返すが、CLI ごとの語彙差を吸収しすぎない。
- 検出パターンとポリシーは provider 別に `providers.<provider>` で宣言し、member の `provider` で解決する。グローバル既定は上書きの無い provider のフォールバックとして使う。
- `session limit` は `rate limit` に畳み込まず、`provider_signal.kind` では区別して保持する。
- quota の残量や reset 時刻は、取得できる CLI だけ `observed_usage` や `provider_signal.metadata` に保持する。
- 取得できない値は推定しない。`unknown` として扱い、message pattern と exit code に基づいて制御する。
- retry / fallback / block の判断は共通層で行い、残量表示や診断 UI は CLI 固有情報を参照して補足表示する。
- `try_next` は次候補が別 provider / 別アカウントである場合に即時切替として有効に働く。OpenCode のように同一ホスト・単一モデルを共有する provider では、同 provider 内の `try_next` だけでは復旧しないため、`providers.<provider>` の policy で wait+backoff の再試行を主たる回復手段に設定する。

limit は provider ごとに種類とリセット周期（reset horizon）が異なる。同じ `availability_state: limited` でも、rate limit のように数分で回復するものと、週次・月次の利用枠のように run 内では回復しないものがあるため、`retryable` と回復戦略は `provider_signal.kind` と reset horizon で判断する。

| `provider_signal.kind` | reset horizon | `availability_state` | `retryable` | 主な回復戦略                                                 |
| ---------------------- | ------------- | -------------------- | ----------- | ------------------------------------------------------------ |
| `rate_limit`           | 秒〜分        | `limited`            | true        | wait+backoff、または別 provider への `try_next`              |
| `overloaded`           | 秒〜分        | `transient_failure`  | true        | wait+backoff                                                 |
| `timeout` / `oom`      | 秒〜分        | `transient_failure`  | true        | 同 member で wait+retry                                      |
| `session_limit`        | 時間          | `limited`            | 条件付き    | 別 provider / 別アカウントへ `try_next`。reset 間近なら wait |
| `quota_exhausted`      | 日〜月        | `limited`            | false       | 別 provider へ `try_next`、無ければ block して人間に委ねる   |

どの `kind` が存在するかは provider ごとに異なり、子設計の limit 表に従う。reset 時刻が取得できる場合のみ `observed_usage` / `provider_signal.metadata` に保持し、取得できない場合は推定せず message pattern と exit code で制御する。

## 7. 外部エージェント CLI の更新

外部エージェント CLI はすべて devcontainer 内で使用する。Host Mac や接続元端末にはインストールせず、更新も devcontainer 内で行う。対象と導入方法は次のとおりである。

| CLI                | devcontainer 内の導入方法                            | 実行中コンテナを最新化するコマンド         |
| ------------------ | ---------------------------------------------------- | ------------------------------------------ |
| Codex              | `.devcontainer/post-create.sh` の npm global install | `sudo npm install -g @openai/codex@latest` |
| OpenCode           | `.devcontainer/post-create.sh` の npm global install | `sudo npm install -g opencode-ai@latest`   |
| Claude Code        | `claude-code` Dev Container Feature                  | `claude update`                            |
| GitHub Copilot CLI | `copilot-cli` Dev Container Feature                  | `copilot update`                           |

更新コマンドの詳細は、[Codex CLI](https://github.com/openai/codex#installing-and-running-codex-cli)、[OpenCode CLI](https://dev.opencode.ai/docs/cli/)、[Claude Code CLI reference](https://code.claude.com/docs/en/cli-usage)、[GitHub Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) を参照する。

更新前に、`specdojo exec run`、build、test、対話中の agent CLI が実行中でないことを確認する。更新済みバイナリは新たに開始する CLI プロセスから使用されるため、実行中の agent を更新して再開する運用は行わない。

### 7.1. SSH 経由で実行中の devcontainer を更新する

[[tsd-home-mac-dev-server|自宅 MacBook Pro 開発サーバ技術スタック定義]] の 4.11.2 で `home-mbp-tmux` を設定済みであれば、接続元端末から次で devcontainer 内の `specdojo` tmux session に入る。

```bash
ssh home-mbp-tmux
```

tmux 内で、必要な CLI だけを更新する。Codex と OpenCode は `post-create.sh` で root 権限により npm global install されるため、`node` ユーザーからは `sudo` を付ける。

```bash
# Codex / OpenCode
sudo npm install -g @openai/codex@latest opencode-ai@latest

# Claude Code / GitHub Copilot CLI
claude update
copilot update
```

更新後は、同じ devcontainer 内でバージョンを確認する。

```bash
codex --version
opencode --version
claude --version
copilot version
```

`claude update`、`copilot update`、OpenCode の `opencode upgrade` は各 CLI の公式更新コマンドである。ただし本構成の Codex / OpenCode は npm で導入しているため、導入方法と一致する npm コマンドで更新する。認証、設定、会話履歴は named volume に置かれており、これらの更新コマンドで削除しない。

### 7.2. コンテナ再作成後も維持する更新

7.1 の更新は実行中のコンテナだけに反映される。`Dev Containers: Rebuild Container`、`devcontainer up --remove-existing-container`、Docker Desktop の再作成などでコンテナを作り直すと失われるため、通常は以下の手順で Feature lockfile を更新し、コンテナ作成時の `post-create.sh` で Codex / OpenCode を再導入する。

接続元端末から Host Mac に SSH 接続し、Host Mac 側で実行する。

```bash
ssh -t home-mbp
cd ~/workspaces/specdojo-workspace/specdojo

# 現在の lockfile で更新可能な Feature を確認する。
devcontainer outdated --workspace-folder .

# Claude Code / GitHub Copilot CLI を導入する Feature の lockfile を更新する。
devcontainer upgrade --workspace-folder .

# post-create.sh の npm global install も再実行するため、コンテナを作り直す。
devcontainer up --workspace-folder . --remove-existing-container
```

`devcontainer upgrade` は `.devcontainer/devcontainer-lock.json` を変更する。差分を確認し、通常のリポジトリ変更としてレビューしてコミットする。`--remove-existing-container` は devcontainer 内の tmux session を終了させるが、認証・設定を保持する named volume は削除しない。再構築完了後は 7.1 のバージョン確認を行い、`ssh home-mbp-tmux` で tmux session を作り直す。

## 8. worktree 分離

複数の edit agent を並列実行する場合は、タスクごとに worktree とブランチを作成して Git working tree の競合を防ぐ。review agent が成果物を変更しない場合、review task の worktree 分離は不要とする。

| タイミング          | 操作                                                        |
| ------------------- | ----------------------------------------------------------- |
| claim 時            | `git worktree add ../worktrees/<task-id> -b exec/<task-id>` |
| complete / block 時 | `git worktree remove ../worktrees/<task-id>`                |

`specdojo exec run` がライフサイクルを管理し、agent の作業ディレクトリを割り当てた worktree に設定する。手動実行でも同じ命名規則を使用する。

```text
repo/
worktrees/
├─ T-ARC-base-arch-010/      # branch: exec/T-ARC-base-arch-010
└─ T-DEV-api-impl-010/       # branch: exec/T-DEV-api-impl-010
```

worktree 間で append-only event が衝突しないよう、イベントファイル名は次の形式とする。

```text
<timestamp>-<by>-<task-id>-<event-type>.json
```

task ID を含めることで、同じ member が同時に複数 task を処理してもファイル名を一意にする。

worktree は working tree を分離するが、`.git` は共有するため index は単一の `.git/index.lock` で直列化される。`--parallel` 実行では、ルート index への prepare 操作と、並列 worktree commit が起動する lefthook pre-commit フック内の git とが lock を奪い合い、`Unable to create '.../index.lock'` が断続的に発生しうる。lock 取得失敗は git が index を変更する前に起きるため、同一コマンドの再試行は冪等で安全である。`specdojo exec run` は git 実行を index.lock 競合検出時に短いバックオフで数回リトライし、それでも解消しない場合のみ従来どおり該当 task の setup を失敗としてスキップする（`--loop` 時は次ラウンドで再試行される）。
