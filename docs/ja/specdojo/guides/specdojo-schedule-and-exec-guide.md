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

| 定義する内容     | 担当ファイル                   |
| ---------------- | ------------------------------ |
| WHAT / DONE      | 成果物カタログ（`dct-*.yaml`） |
| WHEN / ORDER     | Schedule（`sch-*.yaml`）       |
| エージェント定義 | `pm-members.yaml`              |
| 実行共通設定     | `.specdojo/exec-defaults.yaml` |

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
specdojo schedule build --track <track> --force
        ↓
sch-track-<track>.yaml（Task / Milestone が展開された実行スケジュール）
        ↓
specdojo exec build
        ↓
generated/timeline.svg・ready.json など（plan は exec plan / exec run が生成）
```

`sch-strategy-<track>.yaml` には成果物の `local_id` 単位で `phase` と `owner` を定義する。個別 `phase_set` の反復は `iterations`、選択した `phase_sets` シーケンス全体の反復は `cycles` で指定する。

### 3.1. `phase_sets` の反復指定

個別 `phase_set` の反復と、`phase_sets` シーケンス全体の反復は別の階層として扱う。

- `iterations`: 個別 `phase_set` の総実行回数。省略時は `1`
- `cycles`: `sequence` に指定した `phase_sets` 全体の総実行回数。省略時は `1`

```yaml
default_phase_sets:
  cycles: 2
  sequence:
    - phase_set: first-pass
      iterations: 2
    - phase_set: finalize-pass
```

この例は次の順序に展開される。

```text
cycle 1: first-pass #1 -> first-pass #2 -> finalize-pass
cycle 2: first-pass #1 -> first-pass #2 -> finalize-pass
```

`owner_rules[].phase_sets` にも同じ構造を指定できる。シーケンス全体を反復しない場合は配列形式を使用し、必要な `phase_set` だけに `iterations` を指定できる。

```yaml
owner_rules:
  - local_ids: [prj-comparison-of-alternatives]
    owner: ARC
    phase_sets:
      - phase_set: research-first-pass
        iterations: 3
      - phase_set: finalize-pass
```

反復しない既存の記述は簡略記法として維持する。

```yaml
default_phase_sets: [first-pass, finalize-pass]
```

`cycles` と `iterations` は `1` 以上の整数であり、いずれも追加回数ではなく総実行回数を表す。生成順序は cycle 内の sequence、phase_set 内の iteration、phase_set 内の phase の順とする。次の cycle は前の cycle の最終タスクに依存し、`phase_gates` は各 cycle 内の対象 `phase_set` の最終 iteration 後に適用する。複数 cycle のゲート ID には `-C01`、`-C02` のような cycle 識別子を付ける。

カタログまたは `cross_domain_dependencies` による成果物間依存は、両成果物に共通する最初の `phase_gate` の内側で解決する。たとえば first-edit と alignment の間にゲートがある場合、後続成果物の先頭タスクは前提成果物の first-edit 完了を待ち、alignment 完了までは待たない。これにより、ゲートが全成果物の first-edit 完了を待つ構成でも循環依存を作らない。

反復途中までを初期完了状態にする場合は、位置を完全形で指定する。

```yaml
completed_through:
  phase_set: first-pass
  phase: review
  cycle: 1
  iteration: 2
```

反復しないワークフローでは `completed_through: review` の簡略記法も使用できる。

## 4. フェーズと AI エージェント選択

`sch-strategy-<track>.yaml` の各フェーズには `execution: agent` または `execution: human` が設定されており、`agent` フェーズのみがエージェント実行の対象となる。
`execution: agent` のフェーズには、必要に応じて `capabilities` と `proficiency` を直接定義する。`exec run --auto` はその要件を使い、`pm-members.yaml` からエージェントを選択する。

### 4.1. exec 実行時のフェーズ解決フロー

`sch-track-<track>.yaml` はタスクの `local_id`・`phase_suffix`・依存関係・`duration_days`・`owner` を保持し、反復タスクでは `cycle`・`iteration` も保持する。タスク ID は `T-<TRACK>-<local_id>-<phase_suffix>` を基礎とし、反復する場合だけ `-C<cycle>`・`-I<iteration>` を末尾に付けて自動導出される（`id:` フィールドは YAML に書かない）。

```text
# 反復なし
T-LAUNCH-prj-overview-010

# phase_sets 全体のみ反復
T-LAUNCH-prj-overview-010-C01

# 個別 phase_set のみ反復
T-LAUNCH-prj-overview-010-I01

# 両方を反復
T-LAUNCH-prj-overview-010-C01-I01
```

`cycles` が `2` 以上の場合だけ `C`、`iterations` が `2` 以上の場合だけ `I` を付与する。両方を使用する場合の順序は `C`、`I` とする。反復を指定しない既存タスクの ID は変化しない。

フェーズ解決は **exec build 時**（フェーズ情報を `ready.json` へ確定）と **exec run 時**（エージェント選択・実行）の2段階で行われる。plan ファイル自体は `exec build` では生成せず、`exec plan` / `exec run` が確定済みのフェーズ情報を使ってオンデマンドで生成する。

#### exec build 時（フェーズ情報の解決）

`sch-track-<track>.yaml` はタスクを実行するために必要な情報（`local_id`・`phase_suffix`・`name`・`description`・`depends_on`・`duration_days`・`owner`、反復時の `cycle`・`iteration`）を保持する。生成ルールや設計意図（`phase_sets` の定義・`owner_rules`・`cross_domain_dependencies`）はストラテジーに留める。詳細は `sch-rulebook.md` の「トラック展開の設計指針」を参照。

```text
sch-track の各タスク（例）
  local_id: prj-overview, phase_suffix: "020", cycle: 1, iteration: 2
  → タスク ID: T-LAUNCH-prj-overview-020-C01-I02

  ↓ sch-strategy を参照してフェーズ情報を解決

  "prj-overview" → phaseSet: "first-pass", cycle: 1, iteration: 2
  "first-pass:020" → phaseId: "enrich"

  ↓ sch-strategy の phase メタデータを解決する

  mode 未指定      → mode = "edit"（デフォルト）
  approach 未指定  → 標準テンプレートで生成（存在するすべての参考資料を活用）
  capabilities / proficiency は phase の定義を引き継ぐ

  ↓ 解決したフェーズ情報を ready.json に記録

  ready.json（mode / approach / phase_set / phaseId / capabilities / proficiency）

  ↓ exec plan / exec run が plan をオンデマンド生成

  exec/plans/T-LAUNCH-prj-overview-020-C01-I02-plan.md（mode: edit or review）
```

フェーズ解決では ID の末尾を `phase_suffix` として解析せず、タスクに保持された `phase_suffix`・`cycle`・`iteration` を使用する。

#### exec run 時（エージェント選択・実行）

```text
ready.json のタスク（phase_set / phaseId / cycle / iteration / mode / approach / capabilities / proficiency が記録済み）

  execution: agent のフェーズ
    → capabilities / proficiency で pm-members からエージェントを選択
    → exec/plans/<task-id>-plan.md をプロンプトとして渡して起動

  execution: human のフェーズ
    → auto モードではスキップ（人間の実行待ち）
```

`sch-strategy-<track>.yaml` は生成後も参照され続けるが、`exec build` は既存の `sch-track-<track>.yaml` に含まれるタスクを入力とし、トラック自体は再生成しない。`mode`・`approach`・`execution`・`capabilities`・`proficiency` だけを変更した場合は plan やエージェント選択へ反映される。一方、`phase_sets`・`cycles`・`iterations`・フェーズの追加削除・`phase_suffix`・依存関係・ゲートを変更した場合は、先に次を実行する。

```sh
specdojo schedule build --project <project-id> --track <track> --force
specdojo exec build --project <project-id>
```

strategy が対応する track より新しい場合、`exec validate` と `exec build` は再生成を促す警告を表示する。

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
exec run --auto [--loop]
  → ready.json から次のタスクを読み取り
  → phase の capabilities / proficiency と pm-members.yaml でエージェントを解決
  → exec/plans/<task-id>-plan.md をオンデマンド生成（edit-plan / review-plan）
  → exec claim でタスクを claim する
    （claim と同時に exec/results/<task-id>-result.md を scaffold 生成）
  → plan / result / claim event を実行開始 checkpoint として root に commit し、その commit から worktree を作成
  → worktree 内で agent コマンドに plan を渡して実行
  → 終了コード 0
      → result の status を complete に更新
      → result と成果物を exec ブランチへ commit し、現在ブランチへ merge
      → worktree を削除し exec complete
  → 終了コード 1
      → result の status を blocked に更新し exec block（worktree は調査用に保持）
exec build（再実行）
  → 状態を更新して次の Ready タスクを計算（直前の merge を含む root から次タスクが分岐）
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

`generated/ready.json`、`generated/claim-next.json` が更新される。plan ファイルは生成されない（`exec plan` / `exec run` がオンデマンド生成する）。

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

claim したタスクを実行する。既定の `exec run --task` はカレントリポジトリで実行し、worktree も状態イベントも作らない（差分は手動で確認・コミットする）。

```sh
specdojo exec run --project <project-id> --task <task-id>
```

worktree 隔離と状態記録（claim/complete）を伴う一括実行にするには `--worktree` を付ける。9.4 で claim 済みのタスクを再開し、成功時に complete まで自動記録するため、9.6 の手動 complete は不要になる。

```sh
specdojo exec run --project <project-id> --task <task-id> --worktree
```

各段階を人が確認しながら進める場合は、9.5.1 の `exec worktree` 分割コマンドを使う（complete は自動記録しないため、最後に 9.6 で状態を更新する）。コマンドを明示的に上書きしたい場合だけ `--agent-cmd` を指定する。

```sh
specdojo exec run \
  --project <project-id> \
  --task <task-id> \
  --agent-cmd "opencode run --agent opencode-edit-agent"
```

#### 9.5.1. worktree を作成してエージェントを手動実行する

`exec run --worktree`（および `exec run --auto`）は、worktree の準備、エージェント起動、result 回収、状態更新を一括で行う。各段階を人が確認しながら進める場合は、`exec worktree` 配下の分割コマンドを使う。

| コマンド           | 責務                                           | Git変更   | イベント変更 |
| ------------------ | ---------------------------------------------- | --------- | ------------ |
| `worktree prepare` | 実行管理ファイルをcommitし、worktreeを準備する | あり      | なし         |
| `worktree status`  | worktree、result、Git差分の状態を確認する      | なし      | なし         |
| `worktree agent`   | worktree内でagent commandを1回実行する         | agent次第 | なし         |
| `worktree commit`  | resultと成果物変更をexecブランチへcommitする   | あり      | なし         |
| `worktree merge`   | execブランチを現在のブランチへGit mergeする    | あり      | なし         |
| `worktree remove`  | 統合済みworktreeを削除する                     | あり      | なし         |

すべてのサブコマンドは `--project <project-id>` と `--task <task-id>` で対象を特定する。`--worktree-base <path>` を指定した場合は `run.worktree_base` より優先する。`--dry-run` を持つコマンドでは、変更を行わずに対象パスと実行予定操作を表示する。

| コマンド  | 固有オプション                                       |
| --------- | ---------------------------------------------------- |
| `prepare` | `--worktree-base <path>`、`--dry-run`                |
| `status`  | `--worktree-base <path>`                             |
| `agent`   | `--by <actor>`、`--agent-cmd <command>`、`--dry-run` |
| `commit`  | `--message <message>`、`--dry-run`                   |
| `merge`   | `--ff-only`、`--dry-run`                             |
| `remove`  | `--delete-branch`、`--force`、`--dry-run`            |

分割コマンドは `claim`、`complete`、`block` を暗黙に実行しない。対象タスクは9.4の手順でclaim済みであり、stateが `doing` でなければならない。SpecDojoのタスク状態とGitの統合状態は別々に管理し、最後に人が9.6の状態更新を行う。

分割コマンドは独自のJSONや状態ファイルを作成しない。後続コマンドに必要な情報は、毎回次の標準情報から導出する。

| 情報                 | 導出元                                                       |
| -------------------- | ------------------------------------------------------------ |
| worktree名・ブランチ | task IDから `<task-id-slug>` と `exec/<task-id-slug>` を導出 |
| worktreeパス         | `git worktree list --porcelain` からexecブランチを検索       |
| plan/resultパス      | SpecDojoのproject設定とtask IDから導出                       |
| claim actor          | `exec/events/` のclaim eventから導出                         |
| 比較起点commit       | `git merge-base HEAD <exec-branch>` で都度導出               |
| merge先              | `worktree merge` を実行した現在のブランチ                    |

比較起点commitは保存しない。rootブランチが別タスクのcheckpoint commitやmergeによって進んだ場合も、現在のrootブランチとexecブランチの共通祖先を `git merge-base` で再計算する。

plan、result、claim eventは、worktree作成前にrootの現在ブランチへ実行開始checkpointとしてcommitする。worktreeへ未commitファイルをコピーせず、Git commitをタスク実行の開始点とする。agentが更新したresultは成果物と同じexecブランチでcommitし、`worktree merge` でrootへ統合するため、独立した回収コマンドは設けない。

複数agentを起動する場合、`prepare` と `merge` は同じプロジェクトロックを取得し、rootのHEADを更新するcheckpoint commitとGit mergeを直列化する。agentの実行自体は、タスク別worktreeで並列に行える。タスクごとにplan、result、claim eventのパスが異なるため、実行管理ファイル同士は競合しない。同じ成果物を複数タスクが変更した場合は、`worktree merge` 時に通常のGit競合として検出する。

##### 9.5.1.1. `exec worktree prepare`

claim済みタスク専用のworktreeを作成し、エージェントが作業を開始できる状態にする。

```sh
specdojo exec worktree prepare \
  --project <project-id> \
  --task <task-id>
```

このコマンドは次の処理を行う。

1. task stateが `doing` であることとclaim actorを確認する。
2. プロジェクトロックを取得し、他の `scheduler` / `claim` / `prepare` と競合しない状態にする。
3. 対象タスクのplan、result、claim eventを確認する。plan が無ければ `exec plan` 相当でオンデマンド生成する（既存のplanは上書きしない）。
4. rootのindexにstage済み変更がないことを確認する。
5. plan、result、claim eventに未commit変更があれば、実行開始checkpointとしてcommitする。
6. task IDから `<task-id-slug>` と `exec/<task-id-slug>` ブランチを導出する。
7. checkpoint commitである現在の `HEAD` を起点に `<worktree-base>/<task-id-slug>` を作成する。登録済みの場合は同じブランチであることを確認して再利用する。
8. ロックを解放し、worktreeパスとexecブランチを表示する。

checkpoint commitは対象タスクの実行管理ファイルだけを含める。rootにある無関係な未commit変更はcommitしない。commit messageのデフォルトは `exec(<task-id>): prepare execution` とする。

主なGit操作は次のコマンドに相当する。

```sh
# indexにstage済み変更がないことを確認
git -C "${REPO_ROOT}" diff --cached --quiet

# 対象タスクの実行管理ファイルだけをstageしてcommit
git -C "${REPO_ROOT}" add -- \
  "${PLAN_REL}" \
  "${RESULT_REL}" \
  "${CLAIM_EVENT_REL}"

git -C "${REPO_ROOT}" diff --cached --quiet || \
  git -C "${REPO_ROOT}" commit \
    -m "exec(${TASK_ID}): prepare execution" -- \
    "${PLAN_REL}" \
    "${RESULT_REL}" \
    "${CLAIM_EVENT_REL}"

# execブランチとworktreeをcheckpoint commitから作成
git -C "${REPO_ROOT}" worktree add \
  "${WORKTREE}" \
  -b "${EXEC_BRANCH}" \
  HEAD
```

既存のexecブランチを再利用する場合は `git worktree add "${WORKTREE}" "${EXEC_BRANCH}"` 相当を使う。再利用時はrootで新しいcheckpoint commitを追加せず、既存ブランチの状態をそのまま使う。

`prepare` 完了後は、表示されたworktreeパスへ移動し、以降の `status`、`agent`、`commit` をそのworktree内で実行する。CLIの子プロセスから呼び出し元シェルのカレントディレクトリは変更できないため、`prepare` 自身は `cd` を行わない。

```sh
cd <worktree-path>

git branch --show-current
# → exec/<task-id-slug>
```

`worktree` サブコマンドは `--task` とGit worktree情報から対象を解決するため、worktree内から実行できる。Git worktreeは親の作業ツリーにある `node_modules` を共有しないため、必要な場合は移動後に `npm ci` などを明示的に実行する。

```sh
npm ci
```

`merge` はコマンドを実行した現在のブランチへ統合するため、worktree内では実行しない。`commit` の完了後にrootの統合先ブランチへ戻ってから実行する。

##### 9.5.1.2. `exec worktree status`

分割実行の現在地を確認する読み取り専用コマンドである。

```sh
specdojo exec worktree status \
  --project <project-id> \
  --task <task-id>
```

task state、claim actor、worktreeパス、ブランチ、現在の比較起点commit、agent command、plan/resultの有無、resultと成果物の未commit変更、現在のブランチへmerge済みかを表示する。worktreeが未準備の場合もエラーにせず `not prepared` と表示する。

以下のコマンド例では、`REPO_ROOT`、`EXEC_BRANCH`、`PLAN_REL`、`RESULT_REL` をtask IDとproject設定から導出し、`WORKTREE`をGit worktree一覧から取得済みとする。`status` は主に次のGitコマンドとファイル検査を行う。

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

# 現在のrootブランチとの比較起点を導出
COMPARE_BASE="$(git -C "${REPO_ROOT}" merge-base \
  HEAD "${EXEC_BRANCH}")"

# execブランチが現在のブランチへmerge済みか確認
git -C "${REPO_ROOT}" merge-base --is-ancestor \
  "${EXEC_BRANCH}" HEAD
```

plan/resultの有無は `PLAN_REL` と `RESULT_REL` をworktreeパスへ連結して確認する。resultが比較起点から変更されたかは `git diff "${COMPARE_BASE}" -- "${RESULT_REL}"` 相当で判定する。実装ではファイル名の空白や改行を安全に扱うため、Git出力は可能な限り `-z` 形式で取得して解析する。

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
  --agent-cmd "opencode run --agent opencode-edit-agent"
```

`agent` はrate limit時のリトライ、別agentへのfallback、commit、merge、イベント更新を行わない。終了コードはagent commandの終了コードをそのまま返すため、失敗後も内容を確認して同じコマンドを再実行できる。

OpenCodeを使う場合、内部で行う処理は次のコマンドに相当する。`set -o pipefail` により、参照展開またはagent commandのどちらかが失敗した場合に非0で終了する。

```sh
set -o pipefail

specdojo index replace --format markdown --missing keep \
  "${WORKTREE}/${PLAN_REL}" | (
    cd "${WORKTREE}"
    export SPECDOJO_SCHEDULE_PATH="${WORKTREE}/${SCHEDULE_REL}"
    export SPECDOJO_EXECUTION_PATH="${WORKTREE}/${EXECUTION_REL}"
    exec opencode run --agent opencode-edit-agent
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

##### 9.5.1.4. `exec worktree commit`

エージェントが更新したresultと成果物をexecブランチへcommitし、Git merge可能な形にする。

```sh
specdojo exec worktree commit \
  --project <project-id> \
  --task <task-id>
```

`commit` はworktree内の変更と未追跡ファイルを表示し、次の生成・イベントファイルを除いた変更をstageしてcommitする。

- `exec/plans/` 配下
- 対象タスク以外のresult
- `exec/events/` 配下
- `generated/` 配下

対象タスクのresultはcommit対象に含める。commit messageのデフォルトは `exec(<task-id>): apply task changes` とし、`--message <message>` で上書きできる。除外対象以外に変更がない場合はcommitを作成せず終了する。`commit` はイベント更新を行わない。

planは実行入力でありagentが変更する対象ではないため、自動commit対象から除外する。resultはタスク固有の実行出力であり、成果物変更と同じexecブランチへcommitする。

変更確認、stage、commitは次のコマンドに相当する。除外パスはプロジェクトごとの `EXECUTION_REL` と対象task IDから組み立てる。

```sh
git -C "${WORKTREE}" status --short

git -C "${WORKTREE}" add -A -- . \
  ":(exclude)${EXECUTION_REL}/exec/plans/**" \
  ":(exclude)${EXECUTION_REL}/exec/results/**" \
  ":(exclude)${EXECUTION_REL}/exec/events/**" \
  ":(exclude)${EXECUTION_REL}/generated/**"

# 対象タスクのresultだけは明示的にstage
git -C "${WORKTREE}" add -- "${RESULT_REL}"

# stageされた成果物を確認
git -C "${WORKTREE}" diff --cached --name-status

# stageされた変更がある場合だけcommit
git -C "${WORKTREE}" diff --cached --quiet || \
  git -C "${WORKTREE}" commit \
    -m "exec(${TASK_ID}): apply task changes"
```

実装では除外後の変更パスを先に列挙し、対象が0件なら `git add` と `git commit` を実行しない。`--message` が指定された場合は、その値を `git commit -m` へ渡す。

pre-commit hook がインデックスなどのcommit対象ファイルを追加・更新した場合は、hook終了後に未commitの対象を再検出し、同じcommitへ自動的にamendする。amend後もhookによる変更が繰り返される場合は、無限ループを避けるため規定回数で異常終了する。

##### 9.5.1.5. `exec worktree merge`

execブランチにcommitされた成果物変更を、コマンドを実行した現在のブランチへ統合する。

```sh
specdojo exec worktree merge \
  --project <project-id> \
  --task <task-id>
```

`merge` は次の安全条件を確認する。

1. 現在のブランチとexecブランチの共通祖先以降に、execブランチ側のcommitが存在する。
2. worktree内にcommit対象となる未コミット変更が残っていない。
3. 現在のブランチが対象execブランチではない。
4. 現在の作業ツリーの未コミット変更と、merge対象commitの変更パスが重複しない。

条件を満たした場合、`git merge --no-ff --no-edit exec/<task-id-slug>` 相当で統合する。現在の作業ツリーに無関係な未commit変更が残っていても、変更パスがmerge対象と重複しなければmergeできる。競合した場合はGitの競合状態を保持して非0で終了し、自動abortや自動解決は行わない。

`merge` はプロジェクトロックを取得し、コマンドを実行した現在のブランチへGit mergeを行う。統合先を独自状態として保存しないため、利用者は意図したブランチへ移動してから実行する。`--ff-only` を指定した場合はmerge commitを作らず、fast-forward可能な場合だけ統合する。`merge` はworktreeの削除、ブランチ削除、resultの個別コピー、イベント更新を行わない。

resultは成果物と同じcommitに含め、`merge` でrootへ統合する。reviewタスクのように成果物変更がない場合も、resultの変更を `commit` して `merge` する。

安全条件の確認とmergeは、次のコマンドに相当する。

```sh
# 現在のブランチとexecブランチの共通祖先を導出
COMPARE_BASE="$(git -C "${REPO_ROOT}" merge-base \
  HEAD "${EXEC_BRANCH}")"

# execブランチ側に未統合commitがあることを確認
test "$(git -C "${REPO_ROOT}" rev-list --count \
  "${COMPARE_BASE}..${EXEC_BRANCH}")" -gt 0

# worktreeにcommit対象の変更が残っていないことを確認
test -z "$(git -C "${WORKTREE}" status --porcelain -- . \
  ":(exclude)${EXECUTION_REL}/exec/plans/${TASK_ID}-plan.md" \
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
  "${COMPARE_BASE}..${EXEC_BRANCH}" | sort -u)"

OVERLAP="$(comm -12 \
  <(printf '%s\n' "${CURRENT_DIRTY_PATHS}") \
  <(printf '%s\n' "${MERGE_PATHS}"))"

test -z "${OVERLAP}"
```

競合が発生した場合、利用者は `git status` で競合ファイルを確認して解決するか、明示的に `git merge --abort` する。`worktree merge` 自身はどちらも自動実行しない。

##### 9.5.1.6. `exec worktree remove`

不要になったworktreeを安全に削除する。

```sh
specdojo exec worktree remove \
  --project <project-id> \
  --task <task-id>
```

`remove` はcommit対象の未コミット変更と未統合commitがないことを確認してから `git worktree remove` 相当を実行する。execブランチは履歴確認のため既定では残し、`--delete-branch` を指定した場合だけmerge済みブランチを削除する。

安全条件を満たさない場合は削除を拒否する。`--force` はGit worktreeの強制削除を意味するため、未commitのresultや成果物変更が失われることを警告し、明示指定時だけ許可する。

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

これらを実行する前に、`commit` と同じ除外規則でcommit対象の未commit変更がないことを確認する。独自状態ファイルは存在しないため、削除後にSpecDojo固有ファイルをクリーンアップする処理はない。

`--force` 指定時は `git worktree remove --force "${WORKTREE}"` 相当を使う。ただし、execブランチの削除には常に `git branch -d` を使い、未mergeブランチを `-D` で強制削除しない。

##### 9.5.1.7. 分割コマンドの実行例

editタスクの標準的な手動実行フローは次のとおり。

```sh
REPO_ROOT="$(git rev-parse --show-toplevel)"

specdojo exec worktree prepare --project <project-id> --task <task-id>

# prepareが表示したworktreeパスへ移動
cd <worktree-path>
npm ci

specdojo exec worktree status --project <project-id> --task <task-id>
specdojo exec worktree agent --project <project-id> --task <task-id>
specdojo exec worktree commit --project <project-id> --task <task-id>

# merge先となるrootのブランチへ戻る
cd "${REPO_ROOT}"

specdojo exec worktree merge --project <project-id> --task <task-id>
specdojo exec worktree remove --project <project-id> --task <task-id> --delete-branch
```

この後、統合された成果物とresultを確認し、9.6の `complete` または `block` を実行する。途中で問題が見つかった場合は、worktreeを削除せず `agent` から再開する。

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

### 9.8. ユースケース別 実行例

`exec plan` / `exec run` の代表的なユースケースとコマンド例を示す。隔離（worktree の有無）と状態追跡（claim/complete の記録）の組み合わせで選ぶ。どのコマンドも `--dry-run` を付けると、解決されたエージェントコマンドや対象を表示して実行しない。

各ユースケースで plan / result が作成されるか、成功後に plan が `exec/plans/done/` へアーカイブされるかは次のとおり。

| ユースケース           | 代表コマンド                         | plan       | result            | done 保存                 |
| ---------------------- | ------------------------------------ | ---------- | ----------------- | ------------------------- |
| 9.8.1 カレント・記録なし | `exec run --task`                    | 生成・保持 | scaffold + 完了更新 | △ `--archive-on-success`  |
| 9.8.2 カレント・記録あり | `exec run --task --by --track-state` | 生成・保持 | scaffold + 完了更新 | △ `--archive-on-success`  |
| 9.8.3 worktree         | `exec run --task --worktree`         | 生成・保持 | scaffold + 完了更新 | —                         |
| 9.8.4 auto（順次）     | `exec run --auto`                    | 生成・保持 | scaffold + 完了更新 | —                         |
| 9.8.5 plan 先生成→実行 | `exec plan` → `exec run --plan`      | exec plan で生成 | scaffold しない | —                         |

- plan は `exec/plans/<slug>-plan.md` に生成され、`exec build` では削除されない。「done 保存」は完了した plan を `exec/plans/done/` へ移動することを指す。
- `--archive-on-success`（done 保存）はカレント実行（in-place）でのみ有効。`--worktree` / `--auto` では plan は `exec/plans/` に残る。
- result（`exec/results/<task-id>-result.md`）は、`--task` / `--deliverable` を対象とする `exec run` であれば記録の有無にかかわらず scaffold され、実行後に終了コードへ応じて `status` を complete / blocked に更新する。これは plan のオンデマンド生成と対になる挙動で、エージェントは常に frontmatter（`mode` を含む）が整った result を埋めるだけでよい。既存ファイルがある場合は上書きしない。task identity を持たない持ち込み `--plan` 実行（9.8.5）だけは scaffold しない。claim も従来どおり result を scaffold する（冪等）。

#### 9.8.1. 1 task をカレントリポジトリで実行（記録なし）

plan を自動生成し、エージェントをカレントリポジトリで1回実行する。worktree もイベント（claim/complete）も作らない。変更は作業ツリーに残るので、確認とコミットは手動で行う。タスクの状態（todo/doing/done）は問わないため、`done` のやり直しもこれでよい。

```sh
specdojo exec run --project <project-id> --task <task-id>
```

エージェントは phase の `capabilities` / `mode` から自動選択する。明示する場合は `pm-members.yaml` の nickname を `--cmd` で指定する（例: `--cmd opencode-edit-agent`、`--cmd claude-edit-agent`）。

result（`exec/results/<task-id>-result.md`）はこの実行でも scaffold され、エージェントが記入する。実行後は終了コードに応じて `status` が complete / blocked に更新される。ただし claim/complete イベントは書かないため、スケジュール進捗へ反映したい場合は `exec complete` で完了を記録する（state を `done` にしたい場合は事前に `exec claim` で `doing` にしておく）。

```sh
specdojo exec claim --project <project-id> --task <task-id> --by <actor> --msg "record run"
specdojo exec complete --project <project-id> --task <task-id> --by <actor> --msg "done"
```

生成した plan を `exec/plans/done/` へ退避（アーカイブ）したい場合は `exec archive` を使う（`--archive-on-success` を付けずに後から行う手動版）。`--delete` を付けると移動せず削除する。

```sh
specdojo exec archive --project <project-id> --task <task-id>
```

#### 9.8.2. 1 task をカレントリポジトリで実行（状態追跡あり）

カレントで実行しつつ、スケジュール進捗へ反映するため claim/complete を記録する。`--track-state` は `--task` と `--by` を要求し、実行前に claim、終了コードに応じて complete / block を記録する。worktree は作らない。

```sh
specdojo exec run --project <project-id> --task <task-id> --by <actor> --track-state
```

claim・実行・complete を個別コマンドに分けたい場合は次のようにする。

```sh
specdojo exec claim --project <project-id> --task <task-id> --by <actor> --msg "manual run"
specdojo exec run --project <project-id> --task <task-id>
specdojo exec complete --project <project-id> --task <task-id> --by <actor> --msg "done"
```

#### 9.8.3. 1 task を worktree で隔離実行

worktree を作って隔離実行し、成功時に成果物を現在ブランチへ merge、worktree 削除、complete まで一括で行う。`--worktree` は `--task` が前提で、状態追跡は常に有効になる。

```sh
specdojo exec run --project <project-id> --task <task-id> --worktree
```

各段階を人が確認しながら進める場合は、9.5.1 の `exec worktree` 分割コマンドを使う。

#### 9.8.4. auto でスケジュール順に順次実行（worktree）

`ready.json` の順序でタスクを選び、worktree + 状態追跡で順次実行する。エージェントは phase 要件と `pm-members.yaml` から自動選択する。`exec run` は内部で validate と build を実行するため、事前の `exec build` は必須ではない。

```sh
# 1 バッチ実行して終了
specdojo exec run --project <project-id> --auto --parallel 5

# ready タスクがなくなるまで繰り返す（ラウンド間で exec build）
specdojo exec run --project <project-id> --auto --loop --parallel 5
```

選択戦略は既定 `critical-first`。FIFO 順にする場合は `--strategy fifo` を付ける。

#### 9.8.5. plan を作ってから手動で実行

plan を先に生成して内容を確認・編集してから実行する。`exec plan` は plan を生成するだけで、状態・イベントは変えない。

```sh
# scheduled タスクの plan を生成
specdojo exec plan --project <project-id> --task <task-id>

# 内容を確認・編集後、その plan で実行する（plan は再生成しない）
specdojo exec run --project <project-id> --plan <plan-path>
```

specdojo を介さず自分のエージェントへ直接渡すこともできる（`[[id]]` 参照を展開して標準入力へ）。

```sh
specdojo index replace --format markdown --missing keep <plan-path> \
  | opencode run --agent opencode-edit-agent
```

schedule に無い成果物をカタログから直接 plan 化する場合は `--deliverable <local_id>` を使う。

```sh
specdojo exec plan --project <project-id> --deliverable <local_id>
```

plan の「owner ロールとしての記述ポイント」を埋めたい場合は `--track <track>` を付ける。`sch-strategy-<track>.yaml` の `owner_rules` から成果物の `owner` を解決する（省略時は owner 未設定）。

```sh
specdojo exec plan --project <project-id> --deliverable <local_id> --track <track>
```

#### 9.8.6. その他

- schedule 非依存で catalog の成果物を直接実行する: `exec run --project <project-id> --deliverable <local_id>`（plan 生成 → カレント実行）。
- カレント実行（in-place; `--task` / `--deliverable`）で `--archive-on-success` を付けると、成功後に plan を `exec/plans/done/` へアーカイブする（`--worktree` / `--auto` では無効）。
- 段階確認しながら worktree 実行する: 9.5.1 の `exec worktree prepare … remove`。

### 9.9. 完了済みタスクを再実行する

完了済み（`done`）タスクをやり直したいときは、既定の `exec run`（カレント実行・状態追跡なし・worktree なし）でそのままやり直す。専用コマンドは不要で、`exec run` が plan を再生成してから実行する。plan・result は git 管理対象で、完了後の plan は `exec/plans/done/` へアーカイブされる（`specdojo-command-usage-guide.md` の `plan / result のライフサイクル` を参照）。

```sh
# plan を再生成してカレントで再実行する（状態は変更しない）
specdojo exec run --project <project-id> --task <task-id>
```

`exec run` の軽量実行はタスクの状態（`done`/`doing` など）を前提にせず、claim/complete などのイベントも書かない。plan が無ければ内部で再生成し、エージェントをカレントリポジトリで実行する。worktree 隔離は行わず、変更は作業ツリーに残るため、差分の確認とコミットは手動で行う。詳細は `specdojo-command-usage-guide.md` の `exec run`・`exec plan` を参照する。

plan の生成だけを行い、実行は自分で行いたい場合は `exec plan` を使う。

```sh
specdojo exec plan --project <project-id> --task <task-id>
```

`exec plan` は対象タスクの plan を `exec/plans/<task-id>-plan.md` に再生成するだけで、状態・イベント・他タスクの plan は変更しない。`exec build` は plan を削除しないため、生成した plan はやり直しまで保持される。

## 10. レートリミット対応

AI モデルのレートリミットに達した場合、`exec run` は `exec-defaults.yaml` の `rate_limit_policy` に従って自動対応する。

| タスクの種別   | `cpm.slack` | 対応                                                                                                                                                                                    |
| -------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 非クリティカル | `> 0`       | skip：`block` イベントを記録し次のタスクへ                                                                                                                                              |
| クリティカル   | `== 0`      | `try_next` で candidates（capabilities+proficiency でソート済み）の次のエージェントへ切り替えて再試行。バックオフ付きで `max_attempts` 回まで試行し、全員失敗なら `on_exhausted` に従う |

クリティカルパス上のタスクはスキップせず、必ず完了させることでプロジェクト完了日への影響を防ぐ。
設定の詳細は `specdojo-command-usage-guide.md` の `exec run` セクションを参照すること。

## 11. Anti-patterns

| Anti-pattern                       | 問題点                                                                                        |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| 巨大 Task（1日以上）               | AI が一度の実行で完了できず、途中状態が残りやすい                                             |
| 過剰依存チェーン                   | Ready タスクが常に少なく、並列実行の恩恵を得られない                                          |
| `duration_days: 0` の Task         | ゼロ期間は Milestone を使う                                                                   |
| `depends_on` の省略                | 前提なしでも `[]` と明示する                                                                  |
| 成果物パスを Schedule に直接記載   | パスは成果物カタログが管理する                                                                |
| `sch-strategy` に agent 個体を記載 | `sch-strategy` は phase の作業要件のみを持ち、エージェント定義は `pm-members.yaml` に集約する |
