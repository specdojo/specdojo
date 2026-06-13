---
id: specdojo-schedule-and-exec-guide
type: guide
status: draft
---

# SpecDojo スケジューリングガイド

本ドキュメントは SpecDojo におけるスケジュール設計の考え方と運用フローを説明する。
ファイル形式や各フィールドの詳細は `sch-rulebook.md` を参照すること。

## 1. Schedule の役割

Schedule は「いつ・どの順序で・誰が実行するか」を定義する層である。

| 定義する内容     | 担当ファイル                           |
| ---------------- | -------------------------------------- |
| WHAT / DONE      | 成果物カタログ（`dct-*.yaml`）         |
| WHEN / ORDER     | Schedule（`sch-*.yaml`）               |
| エージェント定義 | `pm-members.yaml`                      |
| 実行共通設定     | `.specdojo/exec-defaults.yaml`         |

Schedule は成果物カタログを参照するが、成果物パスや完了条件を直接持たない。

## 2. ファイル構成

Schedule は用途別に 4 種類のファイルで管理する。

| ファイル                    | 役割                                              |
| --------------------------- | ------------------------------------------------- |
| `sch-milestones.yaml`       | プロジェクト全体のマイルストーン計画              |
| `sch-defaults.yaml`         | 全 Schedule 共通のカレンダー・開始日デフォルト値  |
| `sch-track-<track>.yaml`    | トラックごとの Task / Milestone 定義（実行対象）  |
| `sch-strategy-<track>.yaml` | `sch-track-<track>.yaml` の自動生成ルール（入力） |

`sch-strategy-<track>.yaml` はコードジェネレータへの入力であり、生成後は `sch-track-<track>.yaml` を正とする。

## 3. `sch-strategy` による自動生成フロー

`sch-track-<track>.yaml` は手書きではなく、次のフローで生成する。

```text
成果物カタログ（dct-*.yaml）
        ↓
sch-strategy-<track>.yaml（スコープ・フェーズ・owner ルール定義）
        ↓
specdojo exec build（または sch コードジェネレータ）
        ↓
sch-track-<track>.yaml（Task / Milestone が展開された実行スケジュール）
```

`sch-strategy-<track>.yaml` には成果物の `local_id` 単位で `phase` と `owner` を定義する。

## 4. フェーズと AI エージェント選択

`sch-strategy-<track>.yaml` の各フェーズには `execution: agent` または `execution: human` が設定されており、`agent` フェーズのみがエージェント実行の対象となる。
`execution: agent` のフェーズには、必要に応じて `capabilities` と `proficiency` を直接定義する。`exec run --auto` はその要件を使い、`pm-members.yaml` からエージェントを選択する。

### 4.1. exec 実行時のフェーズ解決フロー

`sch-track-<track>.yaml` はタスクの `local_id`・`phase_suffix`・依存関係・`duration_days`・`owner` のみを保持する。タスク ID は `T-<TRACK>-<local_id>-<phase_suffix>` の形式で自動導出される（`id:` フィールドは YAML に書かない）。

フェーズ解決は **exec build 時**と **exec run 時**の2段階で行われる。

#### exec build 時（plan 生成）

`sch-track-<track>.yaml` はタスクを実行するために必要な情報（`local_id`・`phase_suffix`・`name`・`description`・`depends_on`・`duration_days`・`owner`）を保持する。生成ルールや設計意図（`phase_sets` の定義・`owner_rules`・`cross_domain_dependencies`）はストラテジーに留める。詳細は `sch-rulebook.md` の「トラック展開の設計指針」を参照。

```text
sch-track の各タスク（例）
  local_id: prj-overview, phase_suffix: "020"
  → タスク ID: T-LAUNCH-prj-overview-020

  ↓ sch-strategy を参照してフェーズ情報を解決

  "prj-overview" → phaseSet: "first-pass"
  "first-pass:020" → phaseId: "enrich"

  ↓ sch-strategy の phase メタデータを解決する

  mode 未指定      → mode = "edit"（デフォルト）
  approach 未指定  → 標準テンプレートで生成（存在するすべての参考資料を活用）
  capabilities / proficiency は phase の定義を引き継ぐ

  ↓ plan ファイルを生成

  exec/plans/T-LAUNCH-prj-overview-020-plan.md（mode: edit or review）
```

#### exec run 時（エージェント選択・実行）

```text
ready.json のタスク（phase_set / phaseId / mode / approach / capabilities / proficiency が記録済み）

  execution: agent のフェーズ
    → capabilities / proficiency で pm-members からエージェントを選択
    → exec/plans/<task-id>-plan.md をプロンプトとして渡して起動

  execution: human のフェーズ
    → auto モードではスキップ（人間の実行待ち）
```

`sch-strategy-<track>.yaml` は生成後も参照され続けるため、フェーズ定義を変更した場合は `sch-track-<track>.yaml` を再生成しなくても exec の挙動に即時反映される。

### 4.2. エージェント選択フロー

```text
(sch-strategy phase の capabilities / proficiency)
        ↓
capabilities・proficiency の条件で pm-members.yaml をフィルタ
  1. capabilities フィルタ（必要な全ツールを持つ agent）
  2. proficiency フィルタ（指定あれば一致のみ）
  3. 余剰 capabilities 数 → priority でソート
        ↓
candidates[0] が primary、以降は rate limit 時のフォールバック
        ↓
pm-members.yaml の command フィールド → agent コマンド
```

`sch-strategy-<track>.yaml` は、フェーズの作業要件（mode・approach・capabilities・proficiency）を持つ。エージェント定義（capabilities・proficiency・priority・command）は `pm-members.yaml` に集約する。

## 5. Task 粒度

Task は AI Agent が一度の実行で完了できる粒度に設計する。

| 指標            | 推奨値     |
| --------------- | ---------- |
| `duration_days` | 0.125 〜 1 |
| 変更ファイル数  | 1 〜 5     |
| 責務            | 1 つ       |

粒度が大きすぎる場合は Task を分割し、小さすぎて独立完了できない場合は統合する。

## 6. Dependency 設計

依存関係は最小限にする。依存が多いほど並列実行できる Ready タスクが減り、スループットが低下する。

```text
良い例（最小依存）:
  migration → repository → api endpoint

悪い例（過剰依存）:
  migration → repository → api → test → docs → release
```

Ready タスク数の目安は同時に 5 〜 20 件。これを下回る状態が続く場合は依存関係を見直す。

## 7. CPM とクリティカルパス

`specdojo exec build` は Schedule から CPM（Critical Path Method）を計算し、各 Task の ES / EF / LS / LF / Slack を求める。

```text
generated/cpm.md          — CPM 計算結果
generated/critical-path.md — クリティカルパス一覧
```

Slack が 0 の Task がクリティカルパスに乗る。これらの遅延はプロジェクト全体の遅延に直結するため、優先して Ready にする。

## 8. AI 実行フロー

`specdojo exec run --auto` は次の手順でタスクを自動実行する。

```text
exec build
  → ready.json に Ready タスクを出力（mode / approach / capabilities / proficiency も記録）
  → exec/plans/<task-id>-plan.md を生成（Frontmatter+Markdown 形式の edit-plan / review-plan）
exec run --auto [--loop]
  → ready.json から次のタスクを読み取り
  → phase の capabilities / proficiency と pm-members.yaml でエージェントを解決
  → exec claim でタスクを claim する
    （claim と同時に exec/results/<task-id>-result.md を scaffold 生成）
  → exec/plans/<task-id>-plan.md を読み込み、pm-members.yaml の command フィールドの agent コマンドに brief を渡して実行
  → 終了コード 0 → exec complete（result の status を complete に更新）
  → 終了コード 1 → exec block（result の status を blocked に更新）
exec build（再実行）
  → 状態を更新して次の Ready タスクを計算
```

人間による実行が必要なタスクは `execution: human` を指定する。

## 9. 手動実行手順

`specdojo exec run --auto` が行う処理を、コマンドを使ってステップバイステップで再現する手順を示す。
エージェントの動作確認やトラブルシュートでは、`generated/ready.json` を直接読むより、`specdojo exec scheduler` と `specdojo exec run --task --dry-run` を使う。

以下では、実行主体を `<actor>`、実行対象タスクを `<task-id>` と表記する。

### 9.1. `exec build` でスケジュールを最新化する

```sh
specdojo exec build --project <project-id>
```

`generated/ready.json`、`generated/claim-next.json`、`generated/agent-briefs/` が更新される。

### 9.2. 次のタスクを確認する

次に claim されるタスクは `scheduler --dry-run` で確認する。

```sh
specdojo exec scheduler --project <project-id> --by <actor> --dry-run
```

出力されたタスクIDが次の実行対象（以降 `<task-id>`）。
既定では `critical-first` 戦略で選択される。FIFO順で確認したい場合は `--strategy fifo` を指定する。

```sh
specdojo exec scheduler --project <project-id> --by <actor> --strategy fifo --dry-run
```

owner が一致しない Ready タスクも確認したい場合は、明示的に `--allow-owner-mismatch` を付ける。

```sh
specdojo exec scheduler \
  --project <project-id> \
  --by <actor> \
  --allow-owner-mismatch \
  --dry-run
```

`exec scheduler --by <actor>` は、`pm-members.yaml` の `type: agent` のメンバーに対して `execution: human` タスクを自動的にスキップする。また、エージェントに `mode` フィールドが設定されている場合は、タスクの `mode` と一致しないタスクもスキップする。

### 9.3. 実行コマンドとエージェント選択を確認する

`run --task --dry-run` を使うと、対象タスクの `phase_set`、`phase.id`、`mode`、`approach`、マッチした `capabilities`・`proficiency`、agent command、agent brief の有無を確認できる。`approach` が省略されたタスクは標準テンプレートで扱われる。

```sh
specdojo exec run --project <project-id> --task <task-id> --dry-run
```

このコマンドは実際のエージェントを起動せず、解決されたコマンドとブリーフ文字数だけを表示する。
`sch-strategy-*.yaml` や `pm-members.yaml` を手作業で追う必要があるのは、解決結果が期待と違う場合に限定する。

### 9.4. タスクを claim する

次のタスクを安全に claim する場合は `scheduler` を使う。`scheduler` はプロジェクトロックを取得し、Ready 判定・owner 判定・戦略順序を評価したうえで claim イベントを書き込む。

```sh
specdojo exec scheduler --project <project-id> --by <actor> --msg "manual run"
```

既に対象タスクが決まっており、そのタスクを明示的に claim したい場合は `claim` を使う。

```sh
specdojo exec claim \
  --project <project-id> \
  --task <task-id> \
  --by <actor> \
  --msg "manual run"
```

owner 不一致を許可する場合は、理由を残したうえで `--allow-owner-mismatch` を付ける。

```sh
specdojo exec claim \
  --project <project-id> \
  --task <task-id> \
  --by <actor> \
  --allow-owner-mismatch \
  --msg "manual run with owner override"
```

`claim` は state を `todo` から `doing` に遷移させると同時に、タスクの `mode`（edit / review）に応じた `exec/results/<task-id>-result.md` を scaffold 生成する。`exec run` を介さず手動で claim した場合も同様に生成されるため、人が直接結果を記入できる。既にファイルが存在する場合は上書きしない。

### 9.5. エージェントを実行する

claim したタスクを実行する。

```sh
specdojo exec run --project <project-id> --task <task-id>
```

コマンドを明示的に上書きしたい場合だけ `--agent-cmd` を指定する。

```sh
specdojo exec run \
  --project <project-id> \
  --task <task-id> \
  --agent-cmd "opencode run --agent edit-agent"
```

#### 9.5.1. worktree を作成してエージェントを手動実行する

`exec run` を使わず、worktree の作成からエージェント起動までを手動で確認したい場合は、次の手順で実行する。
ここでは `<schedule-path>` と `<execution-path>` をリポジトリルートからの相対パスとして表記する。

最初に、リポジトリルートで worktree の配置先、インスタンス名、ブランチ名を設定する。worktree はリポジトリの外に作成する。

```sh
REPO_ROOT="$(git rev-parse --show-toplevel)"
WORKTREE_BASE="${REPO_ROOT}/../worktrees"
TASK_ID="<task-id>"
INSTANCE="$(printf '%s' "${TASK_ID}" | tr ':' '-')"
WORKTREE="${WORKTREE_BASE}/${INSTANCE}"
BRANCH="exec/${INSTANCE}"

mkdir -p "${WORKTREE_BASE}"
```

`INSTANCE` は task_id を使い、`:` を `-` に置換した値とする。例えば `prj-0001:T-LAUNCH-pm-plan-010` は `prj-0001-T-LAUNCH-pm-plan-010` になる。

初回は、専用ブランチと worktree を作成する。

```sh
git worktree add "${WORKTREE}" -b "${BRANCH}"
```

同じ worktree が既に `git worktree list` に表示される場合は、再作成せずそのまま再利用する。worktree は存在しないがブランチだけが残っている場合は、既存ブランチから再作成する。

```sh
git worktree add "${WORKTREE}" "${BRANCH}"
```

Git worktree は親の作業ツリーにある `node_modules` を共有しない。グローバルにインストールされた agent command と `specdojo` コマンドだけを使う場合、依存関係のインストールは不要である。

`npm test`、`npm run lint:*`、`npm run build` など、このリポジトリのnpm scriptを実行するタスクでは、worktree作成後に依存関係を用意する。`package-lock.json` に固定された依存関係を再現するため、`npm install` ではなく `npm ci` を使う。

```sh
cd "${WORKTREE}"
npm ci
```

既にworktree内に `node_modules` があり、`package-lock.json` に変更がない場合は再実行不要である。

`exec claim` が生成した plan と result は元の作業ツリーにある未コミットファイルの場合があるため、エージェント起動前にworktreeへコピーする。

```sh
SCHEDULE_REL="<schedule-path>"
EXECUTION_REL="<execution-path>"

mkdir -p "${WORKTREE}/${EXECUTION_REL}/exec/plans"
mkdir -p "${WORKTREE}/${EXECUTION_REL}/exec/results"

cp "${REPO_ROOT}/${EXECUTION_REL}/exec/plans/${TASK_ID}-plan.md" \
  "${WORKTREE}/${EXECUTION_REL}/exec/plans/${TASK_ID}-plan.md"
cp "${REPO_ROOT}/${EXECUTION_REL}/exec/results/${TASK_ID}-result.md" \
  "${WORKTREE}/${EXECUTION_REL}/exec/results/${TASK_ID}-result.md"
```

worktreeへ移動する。worktree内の `.specdojo/specdojo.config.json` が自動的に参照されるため、`SPECDOJO_SCHEDULE_PATH` と `SPECDOJO_EXECUTION_PATH` の設定は不要である。

親の作業ツリー向けにこれらの環境変数を設定済みの場合は、設定ファイルより直接パス指定が優先されるため、エージェント起動前に解除する。

```sh
cd "${WORKTREE}"
unset SPECDOJO_SCHEDULE_PATH SPECDOJO_EXECUTION_PATH
```

9.3の `exec run --task --dry-run` で確認したコマンドを使用し、planの内容を標準入力から渡す。例えば OpenCode を使う場合は次のように実行する。

```sh
cat "${EXECUTION_REL}/exec/plans/${TASK_ID}-plan.md" | \
  opencode run --agent edit-agent
```

エージェント終了後、resultを元の作業ツリーへ戻す。

```sh
cp "${WORKTREE}/${EXECUTION_REL}/exec/results/${TASK_ID}-result.md" \
  "${REPO_ROOT}/${EXECUTION_REL}/exec/results/${TASK_ID}-result.md"
```

成果物の変更は `${BRANCH}` に残る。元の作業ツリーへ自動では統合されないため、差分を確認し、必要な統合を終えてから9.6の `complete` または `block` を記録する。

```sh
git -C "${WORKTREE}" status --short
git -C "${WORKTREE}" diff
```

### 9.6. 完了イベントを記録する

エージェントが正常終了したら `complete` イベントを書き込む。

```sh
specdojo exec complete \
  --project <project-id> \
  --task <task-id> \
  --by <actor> \
  --msg "manual run done"
```

途中で仕様確認や外部待ちになった場合は、`complete` ではなく `block` または `note` を使う。

```sh
specdojo exec block \
  --project <project-id> \
  --task <task-id> \
  --by <actor> \
  --msg "waiting for clarification"
```

### 9.7. `exec build` を再実行して次の Ready タスクを更新する

```sh
specdojo exec build --project <project-id>
```

完了したタスクの後続タスクが新たに Ready になり、`ready.json`、`claim-next.json`、`ready.md` が更新される。

### 9.8. 最小コマンド例

次の Ready タスクを1件だけ手動実行する最小例。

```sh
specdojo exec build --project <project-id>
task_id=$(specdojo exec scheduler --project <project-id> --by <actor> --dry-run)
specdojo exec run --project <project-id> --task "$task_id" --dry-run
specdojo exec scheduler --project <project-id> --by <actor> --msg "manual run"
specdojo exec run --project <project-id> --task "$task_id"
specdojo exec complete --project <project-id> --task "$task_id" --by <actor> --msg "manual run done"
specdojo exec build --project <project-id>
```

完全自動でよい場合は、上記を個別に実行せず `exec run --auto` を使う。

```sh
# 1バッチ実行して終了
specdojo exec run --project <project-id> --auto

# ready タスクがなくなるまで繰り返す
specdojo exec run --project <project-id> --auto --loop
```

## 10. レートリミット対応

AI モデルのレートリミットに達した場合、`exec run` は `exec-defaults.yaml` の `rate_limit_policy` に従って自動対応する。

| タスクの種別   | `cpm.slack` | 対応                                                                                                                                                                                    |
| -------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 非クリティカル | `> 0`       | skip：`block` イベントを記録し次のタスクへ                                                                                                                                              |
| クリティカル   | `== 0`      | `try_next` で candidates（capabilities+proficiency でソート済み）の次のエージェントへ切り替えて再試行。バックオフ付きで `max_attempts` 回まで試行し、全員失敗なら `on_exhausted` に従う |

クリティカルパス上のタスクはスキップせず、必ず完了させることでプロジェクト完了日への影響を防ぐ。
設定の詳細は `specdojo-command-usage-guide.md` の `exec run` セクションを参照すること。

## 11. Anti-patterns

| Anti-pattern                     | 問題点                                                                                               |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 巨大 Task（1日以上）             | AI が一度の実行で完了できず、途中状態が残りやすい                                                    |
| 過剰依存チェーン                 | Ready タスクが常に少なく、並列実行の恩恵を得られない                                                 |
| `duration_days: 0` の Task       | ゼロ期間は Milestone を使う                                                                          |
| `depends_on` の省略              | 前提なしでも `[]` と明示する                                                                         |
| 成果物パスを Schedule に直接記載 | パスは成果物カタログが管理する                                                                       |
| `sch-strategy` に agent 個体を記載 | `sch-strategy` は phase の作業要件のみを持ち、エージェント定義は `pm-members.yaml` に集約する |
