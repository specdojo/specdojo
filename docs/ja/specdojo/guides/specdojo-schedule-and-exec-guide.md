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
  → exec/plans/<task-id>-plan.md を読み込み、pm-members.yaml の command フィールドの agent コマンドに plan を渡して実行
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

`generated/ready.json`、`generated/claim-next.json`、`exec/plans/` が更新される。

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

`run --task --dry-run` を使うと、対象タスクの `phase_set`、`phase.id`、`mode`、`approach`、マッチした `capabilities`・`proficiency`、agent command、execution plan の有無を確認できる。`approach` が省略されたタスクは標準テンプレートで扱われる。

```sh
specdojo exec run --project <project-id> --task <task-id> --dry-run
```

このコマンドは実際のエージェントを起動せず、解決されたコマンドと plan の文字数だけを表示する。
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

`exec run` は、worktree の準備、エージェント起動、result 回収、状態更新を一括で行う自動実行コマンドである。各段階を人が確認しながら進める場合は、`exec worktree` 配下の分割コマンドを使う。

| コマンド                | 責務                                           | Git変更 | イベント変更 |
| ----------------------- | ---------------------------------------------- | ------- | ------------ |
| `worktree prepare`      | worktree とタスク実行ファイルを準備する        | あり    | なし         |
| `worktree status`       | worktree、result、Git差分の状態を確認する      | なし    | なし         |
| `worktree agent`        | worktree内でagent commandを1回実行する         | agent次第 | なし       |
| `worktree collect`      | worktree内のresultを元の作業ツリーへ回収する   | あり    | なし         |
| `worktree commit`       | 成果物変更をexecブランチへcommitする           | あり    | なし         |
| `worktree merge`        | execブランチを現在のブランチへGit mergeする    | あり    | なし         |
| `worktree remove`       | 統合済みworktreeを削除する                     | あり    | なし         |

すべてのサブコマンドは `--project <project-id>` と `--task <task-id>` で対象を特定する。`--worktree-base <path>` を指定した場合は `run.worktree_base` より優先する。`--dry-run` を持つコマンドでは、変更を行わずに対象パスと実行予定操作を表示する。

| コマンド  | 固有オプション                                       |
| --------- | ---------------------------------------------------- |
| `prepare` | `--worktree-base <path>`、`--dry-run`                |
| `status`  | `--worktree-base <path>`                             |
| `agent`   | `--by <actor>`、`--agent-cmd <command>`、`--dry-run` |
| `collect` | `--force`、`--dry-run`                               |
| `commit`  | `--message <message>`、`--dry-run`                   |
| `merge`   | `--ff-only`、`--dry-run`                             |
| `remove`  | `--delete-branch`、`--force`、`--dry-run`            |

分割コマンドは `claim`、`complete`、`block` を暗黙に実行しない。対象タスクは9.4の手順でclaim済みであり、stateが `doing` でなければならない。SpecDojoのタスク状態とGitの統合状態は別々に管理し、最後に人が9.6の状態更新を行う。

各コマンドは、Git common directoryの `specdojo/worktrees/<task-id-slug>.json` に実行コンテキストを保存する。通常のリポジトリでは `.git/specdojo/worktrees/<task-id-slug>.json` に相当する。このファイルにはproject ID、task ID、claim actor、worktreeパス、ブランチ、準備時のbase commit、plan/resultのパスとハッシュを記録する。実行コンテキストはGit管理対象にせず、後続コマンド間の引き継ぎと同時編集の検出に使う。

##### 9.5.1.1. `exec worktree prepare`

claim済みタスク専用のworktreeを作成し、エージェントが作業を開始できる状態にする。

```sh
specdojo exec worktree prepare \
  --project <project-id> \
  --task <task-id>
```

このコマンドは次の処理を行う。

1. task stateが `doing` であることとclaim actorを確認する。
2. task IDから `<task-id-slug>` と `exec/<task-id-slug>` ブランチを導出する。
3. `<worktree-base>/<task-id-slug>` を作成する。登録済みの場合は同じブランチであることを確認して再利用する。
4. planをworktreeへコピーする。再実行時は元の作業ツリーにあるplanで更新する。
5. resultをworktreeへコピーする。既存resultは上書きせず、途中経過を保持する。
6. 実行コンテキストを保存し、worktreeパスとブランチを表示する。

`prepare` はagent commandを起動せず、依存関係もインストールしない。Git worktreeは親の作業ツリーにある `node_modules` を共有しないため、必要な場合は表示されたパスに対して `npm ci` などを明示的に実行する。

```sh
npm --prefix <worktree-path> ci
```

##### 9.5.1.2. `exec worktree status`

分割実行の現在地を確認する読み取り専用コマンドである。

```sh
specdojo exec worktree status \
  --project <project-id> \
  --task <task-id>
```

task state、claim actor、worktreeパス、ブランチ、base commit、agent command、plan/resultの有無、resultの回収要否、commitされていない成果物変更、現在のブランチへmerge済みかを表示する。worktreeが未準備の場合もエラーにせず `not prepared` と表示する。

以下のコマンド例では、`prepare` が保存した実行コンテキストから `REPO_ROOT`、`WORKTREE`、`EXEC_BRANCH`、`BASE_COMMIT`、`PLAN_REL`、`RESULT_REL` を解決済みとする。`status` は主に次のGitコマンドとファイル検査を行う。

```sh
# SpecDojoのtask stateとclaim actorを確認
specdojo exec status --project <project-id> --state doing

# worktreeの登録先とブランチを確認
git -C "${REPO_ROOT}" worktree list --porcelain
git -C "${WORKTREE}" branch --show-current

# 現在のcommitと、未commitの変更を確認
git -C "${WORKTREE}" rev-parse HEAD
git -C "${WORKTREE}" status --short
git -C "${WORKTREE}" diff --name-only
git -C "${WORKTREE}" diff --cached --name-only

# execブランチが現在のブランチへmerge済みか確認
git -C "${REPO_ROOT}" merge-base --is-ancestor \
  "${EXEC_BRANCH}" HEAD
```

plan/resultの有無は `PLAN_REL` と `RESULT_REL` をworktreeパスへ連結して確認する。resultの回収要否は、実行コンテキストに保存したハッシュと現在のファイルハッシュを比較して判定する。実装ではファイル名の空白や改行を安全に扱うため、Git出力は可能な限り `-z` 形式で取得して解析する。

##### 9.5.1.3. `exec worktree agent`

準備済みworktreeをカレントディレクトリとして、OpenCodeやClaude Codeなどのagent commandを1回起動する。

```sh
specdojo exec worktree agent \
  --project <project-id> \
  --task <task-id>
```

このコマンドはphase要件と `pm-members.yaml` から、claim actorに対応するagent commandを解決する。plan内の `[[id]]` は `index replace --format markdown --missing keep` 相当の処理で展開し、標準入力へ渡す。worktree内のscheduleとexecutionの絶対パスを `SPECDOJO_SCHEDULE_PATH` と `SPECDOJO_EXECUTION_PATH` に設定する。

agent commandを明示する場合は `--agent-cmd` を使う。`--by` を指定した場合はclaim actorとの一致を検証する。

```sh
specdojo exec worktree agent \
  --project <project-id> \
  --task <task-id> \
  --by <actor> \
  --agent-cmd "opencode run --agent edit-agent"
```

`agent` はrate limit時のリトライ、別agentへのfallback、resultの回収、commit、merge、イベント更新を行わない。終了コードはagent commandの終了コードをそのまま返すため、失敗後も内容を確認して同じコマンドを再実行できる。

OpenCodeを使う場合、内部で行う処理は次のコマンドに相当する。`set -o pipefail` により、参照展開またはagent commandのどちらかが失敗した場合に非0で終了する。

```sh
set -o pipefail

specdojo index replace --format markdown --missing keep \
  "${WORKTREE}/${PLAN_REL}" | (
    cd "${WORKTREE}"
    export SPECDOJO_SCHEDULE_PATH="${WORKTREE}/${SCHEDULE_REL}"
    export SPECDOJO_EXECUTION_PATH="${WORKTREE}/${EXECUTION_REL}"
    exec opencode run --agent edit-agent
  )
```

Claude Codeを使う場合は、標準入力の渡し先だけが異なる。

```sh
set -o pipefail

specdojo index replace --format markdown --missing keep \
  "${WORKTREE}/${PLAN_REL}" | (
    cd "${WORKTREE}"
    export SPECDOJO_SCHEDULE_PATH="${WORKTREE}/${SCHEDULE_REL}"
    export SPECDOJO_EXECUTION_PATH="${WORKTREE}/${EXECUTION_REL}"
    exec claude -p \
      --agent claude-edit-agent \
      --permission-mode auto
  )
```

実装では解決済みのagent commandを `WORKTREE` をカレントディレクトリとする子プロセスとして起動し、展開済みplanを子プロセスのstdinへ書き込む。シェルのパイプ文字列を組み立てて再実行する必要はない。

##### 9.5.1.4. `exec worktree collect`

worktree内で更新されたresultを、コマンドを実行した元の作業ツリーへコピーする。

```sh
specdojo exec worktree collect \
  --project <project-id> \
  --task <task-id>
```

`collect` はresultだけを回収し、成果物ファイルやGit commitは操作しない。`prepare` 時点または直前の `collect` 時点から、元のresultとworktree側resultの両方が変更されている場合は、同時編集として上書きを拒否する。worktree側を正として上書きする場合のみ `--force` を指定する。回収に成功したら実行コンテキストのresultハッシュを更新し、agentの再実行後に再度 `collect` できるようにする。

resultのstatus更新や `complete` / `block` イベントの記録は行わない。回収後にresultを読み、エージェントの実施内容と残課題を確認する。

同時編集の検出とコピーは、次のコマンドに相当する。`BASE_RESULT_HASH` は `prepare` または直前の `collect` で実行コンテキストに保存した値である。

```sh
WORKTREE_RESULT="${WORKTREE}/${RESULT_REL}"
ROOT_RESULT="${REPO_ROOT}/${RESULT_REL}"

WORKTREE_RESULT_HASH="$(git hash-object --no-filters -- "${WORKTREE_RESULT}")"
ROOT_RESULT_HASH="$(git hash-object --no-filters -- "${ROOT_RESULT}")"

# 両方が基準値から変更され、内容も異なる場合は上書きを拒否する
test "${WORKTREE_RESULT_HASH}" = "${BASE_RESULT_HASH}" || \
  test "${ROOT_RESULT_HASH}" = "${BASE_RESULT_HASH}" || \
  test "${WORKTREE_RESULT_HASH}" = "${ROOT_RESULT_HASH}"

mkdir -p "$(dirname "${ROOT_RESULT}")"
cp "${WORKTREE_RESULT}" "${ROOT_RESULT}"
```

resultがまだ存在しない場合も考慮し、実装では存在しないファイルを専用の値として扱う。`--force` 指定時はハッシュ比較による拒否を省略するが、コピー元resultが存在しない場合はエラーとする。

##### 9.5.1.5. `exec worktree commit`

エージェントが変更した成果物をexecブランチへcommitし、Git merge可能な形にする。

```sh
specdojo exec worktree commit \
  --project <project-id> \
  --task <task-id>
```

`commit` はworktree内の変更と未追跡ファイルを表示し、次の実行管理ファイルを除いた変更をstageしてcommitする。

- 対象タスクのplanとresult
- `exec/events/` 配下
- `generated/` 配下

commit messageのデフォルトは `exec(<task-id>): apply task changes` とし、`--message <message>` で上書きできる。除外対象以外に変更がない場合はcommitを作成せず終了する。`commit` はresultの回収やイベント更新を行わない。

実行管理ファイルを自動commit対象から除くのは、元の作業ツリーで管理するclaim/result/eventと、成果物を変更するexecブランチの責務を分離するためである。

変更確認、stage、commitは次のコマンドに相当する。除外パスはプロジェクトごとの `EXECUTION_REL` と対象task IDから組み立てる。

```sh
git -C "${WORKTREE}" status --short

git -C "${WORKTREE}" add -A -- . \
  ":(exclude)${EXECUTION_REL}/exec/plans/${TASK_ID}-plan.md" \
  ":(exclude)${EXECUTION_REL}/exec/results/${TASK_ID}-result.md" \
  ":(exclude)${EXECUTION_REL}/exec/events/**" \
  ":(exclude)${EXECUTION_REL}/generated/**"

# stageされた成果物を確認
git -C "${WORKTREE}" diff --cached --name-status

# stageされた変更がある場合だけcommit
git -C "${WORKTREE}" diff --cached --quiet || \
  git -C "${WORKTREE}" commit \
    -m "exec(${TASK_ID}): apply task changes"
```

実装では除外後の変更パスを先に列挙し、対象が0件なら `git add` と `git commit` を実行しない。`--message` が指定された場合は、その値を `git commit -m` へ渡す。

##### 9.5.1.6. `exec worktree merge`

execブランチにcommitされた成果物変更を、コマンドを実行した現在のブランチへ統合する。

```sh
specdojo exec worktree merge \
  --project <project-id> \
  --task <task-id>
```

`merge` は次の安全条件を確認する。

1. execブランチにbase commit以降のcommitが存在する。
2. worktree内にcommit対象となる未コミット変更が残っていない。
3. 現在のブランチが対象execブランチではない。
4. 現在の作業ツリーの未コミット変更と、merge対象commitの変更パスが重複しない。

条件を満たした場合、`git merge --no-ff --no-edit exec/<task-id-slug>` 相当で統合する。現在の作業ツリーにclaim eventや回収済みresultが未コミットで残っていても、変更パスが重複しなければmergeできる。競合した場合はGitの競合状態を保持して非0で終了し、自動abortや自動解決は行わない。

`--ff-only` を指定した場合はmerge commitを作らず、fast-forward可能な場合だけ統合する。`merge` はworktreeの削除、ブランチ削除、result回収、イベント更新を行わない。

reviewタスクなど成果物変更がない場合は、`commit` と `merge` を省略して `collect` だけを実行する。

resultは `collect` で元の作業ツリーへ回収し、成果物の変更は `commit` と `merge` でGit統合する。resultファイルをexecブランチのmerge対象に含めないことで、実行記録と成果物変更が同じmergeで競合することを避ける。

安全条件の確認とmergeは、次のコマンドに相当する。

```sh
# execブランチにbase commit以降のcommitがあることを確認
test "$(git -C "${REPO_ROOT}" rev-list --count \
  "${BASE_COMMIT}..${EXEC_BRANCH}")" -gt 0

# worktreeにcommit対象の変更が残っていないことを確認
test -z "$(git -C "${WORKTREE}" status --porcelain -- . \
  ":(exclude)${EXECUTION_REL}/exec/plans/${TASK_ID}-plan.md" \
  ":(exclude)${EXECUTION_REL}/exec/results/${TASK_ID}-result.md" \
  ":(exclude)${EXECUTION_REL}/exec/events/**" \
  ":(exclude)${EXECUTION_REL}/generated/**")"

# 現在のブランチがexecブランチではないことを確認
test "$(git -C "${REPO_ROOT}" branch --show-current)" != \
  "${EXEC_BRANCH}"

# 通常のmerge
git -C "${REPO_ROOT}" merge --no-ff --no-edit "${EXEC_BRANCH}"

# --ff-only指定時
git -C "${REPO_ROOT}" merge --ff-only "${EXEC_BRANCH}"
```

未commit変更とのパス重複は、現在の作業ツリーの変更一覧とmerge対象の変更一覧の積集合で判定する。次は読みやすさを優先した等価例であり、実装では `-z` 形式で取得して比較する。

```sh
CURRENT_DIRTY_PATHS="$({
  git -C "${REPO_ROOT}" diff --name-only
  git -C "${REPO_ROOT}" diff --cached --name-only
  git -C "${REPO_ROOT}" ls-files --others --exclude-standard
} | sort -u)"

MERGE_PATHS="$(git -C "${REPO_ROOT}" diff --name-only \
  "${BASE_COMMIT}..${EXEC_BRANCH}" | sort -u)"

OVERLAP="$(comm -12 \
  <(printf '%s\n' "${CURRENT_DIRTY_PATHS}") \
  <(printf '%s\n' "${MERGE_PATHS}"))"

test -z "${OVERLAP}"
```

競合が発生した場合、利用者は `git status` で競合ファイルを確認して解決するか、明示的に `git merge --abort` する。`worktree merge` 自身はどちらも自動実行しない。

##### 9.5.1.7. `exec worktree remove`

不要になったworktreeを安全に削除する。

```sh
specdojo exec worktree remove \
  --project <project-id> \
  --task <task-id>
```

`remove` は未回収result、commit対象の未コミット変更、未統合commitがないことを確認してから `git worktree remove` 相当を実行し、実行コンテキストを削除する。execブランチは履歴確認のため既定では残し、`--delete-branch` を指定した場合だけmerge済みブランチを削除する。

安全条件を満たさない場合は削除を拒否する。`--force` はGit worktreeの強制削除を意味するため、未回収resultと未統合変更が失われることを警告し、明示指定時だけ許可する。

通常の安全な削除は、次のコマンドに相当する。

```sh
# execブランチが現在のブランチへmerge済みであることを確認
git -C "${REPO_ROOT}" merge-base --is-ancestor \
  "${EXEC_BRANCH}" HEAD

# worktreeを削除
git -C "${REPO_ROOT}" worktree remove "${WORKTREE}"

# --delete-branch指定時。-dは未mergeブランチの削除を拒否する
git -C "${REPO_ROOT}" branch -d "${EXEC_BRANCH}"
```

これらを実行する前に、`collect` と同じハッシュ比較で未回収resultがないこと、`commit` と同じ除外規則でcommit対象の未commit変更がないことを確認する。削除後は実行コンテキストファイルをファイルシステムAPIで削除する。

`--force` 指定時は `git worktree remove --force "${WORKTREE}"` 相当を使う。ただし、execブランチの削除には常に `git branch -d` を使い、未mergeブランチを `-D` で強制削除しない。

##### 9.5.1.8. 分割コマンドの実行例

editタスクの標準的な手動実行フローは次のとおり。

```sh
specdojo exec worktree prepare --project <project-id> --task <task-id>
specdojo exec worktree status --project <project-id> --task <task-id>
specdojo exec worktree agent --project <project-id> --task <task-id>
specdojo exec worktree collect --project <project-id> --task <task-id>
specdojo exec worktree commit --project <project-id> --task <task-id>
specdojo exec worktree merge --project <project-id> --task <task-id>
specdojo exec worktree remove --project <project-id> --task <task-id> --delete-branch
```

この後、統合された成果物と回収したresultを確認し、9.6の `complete` または `block` を実行する。途中で問題が見つかった場合は、worktreeを削除せず `agent` から再開する。

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

`exec run` で次のReadyタスクを1件だけ実行する最小例。各段階を個別に確認する場合は9.5.1の分割コマンドを使う。

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
