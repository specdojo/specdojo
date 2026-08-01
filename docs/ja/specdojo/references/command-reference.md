---
specdojo:
  id: command-reference
  type: reference
  status: draft
  supersedes:
    - command-reference-guide
---

# CLIコマンドリファレンス

CLI Command Reference

`specdojo` CLI の主要コマンドを、用途、代表例、主要オプションに絞って説明します。背景や運用手順は各専門ガイドを参照します。

**対象範囲**

- `specdojo` CLI の主要コマンド（config / catalog / schedule / register / exec / index / watch / build / routine）

**ここで引けるもの**

- コマンドごとの用途と実行例、全体で共通のオプション、コマンド別の主要オプション

**詳細の参照先**

- CLI 全体の流れは [CLI概要ガイド](../guides/cli-overview-guide.md)、運用上の判断と手順は各コマンド節からリンクした専門ガイドを参照してください。

## 1. 共通オプション

| オプション        | 用途                                               | 主な対象                                       |
| ----------------- | -------------------------------------------------- | ---------------------------------------------- |
| `--project <id>`  | 対象 project を明示する                            | project に紐づくコマンド                       |
| `--dry-run`       | 書き込みや実行を行わず予定内容を表示する           | scaffold / generate / build / run / worktree   |
| `--force`         | 既存ファイルの上書きや通常拒否される操作を明示する | scaffold / generate / schedule build / release |
| `--scope <scope>` | build / watch の対象範囲を絞る                     | `build` / `watch`                              |

project の解決順序と設定は [CLI概要ガイド](../guides/cli-overview-guide.md) を参照します。

## 2. config / project

| コマンド       | 用途                              | 例                      |
| -------------- | --------------------------------- | ----------------------- |
| `config init`  | `specdojo.config.json` を作成する | `specdojo config init`  |
| `project list` | 登録済み project を表示する       | `specdojo project list` |

`current_project` を設定しておくと、多くのコマンドで `--project` を省略できます。

## 3. catalog

`catalog` は成果物カタログ（`dct-*.yaml`）を扱います。

| コマンド           | 用途                                            | 例                                             |
| ------------------ | ----------------------------------------------- | ---------------------------------------------- |
| `catalog scaffold` | テンプレートから `dct-*.yaml` を生成する        | `specdojo catalog scaffold --project prj-0001` |
| `catalog where`    | catalog 関連パスを表示する                      | `specdojo catalog where --project prj-0001`    |
| `catalog validate` | `dct-*.yaml` を検証する                         | `specdojo catalog validate --project prj-0001` |
| `catalog build`    | `generated/dct-*.md` を生成する                 | `specdojo catalog build --project prj-0001`    |
| `catalog generate` | `dct-*.yaml` が指す成果物ファイル本体を生成する | `specdojo catalog generate --project prj-0001` |

主要オプション:

| オプション          | 用途                                                          |
| ------------------- | ------------------------------------------------------------- |
| `--size <size>`     | `small` / `medium` / `large` の成果物セットを選ぶ             |
| `--project-id <id>` | 生成ファイルに埋め込む project ID を上書きする                |
| `--dct <name>`      | `catalog generate` の対象を特定の `dct-*.yaml` に絞る（後述） |
| `--force`           | 既存ファイルを上書きする                                      |

`--dct <name>` で対象を特定の `dct-*.yaml` に絞れます。`name` は `dct-` プレフィックスや `.yaml` の有無を問わず、ドメイン名（例: `project-definition`）でも一致します。カンマ区切りまたは複数回指定で複数のカタログを対象にできます。指定名に一致する `dct-*.yaml` がない場合はエラーで終了します。

```bash
specdojo catalog generate --project prj-0001 --dct project-definition
specdojo catalog generate --project prj-0001 --dct dct-project-definition.yaml,dct-project-management.yaml
```

`catalog generate` の生成方針と `specdojo build` に含めない理由は [CLI概要ガイド](../guides/cli-overview-guide.md) の `catalog generateの生成方針`、成果物カタログから Schedule への展開は [Schedule設計ガイド](../guides/schedule-design-guide.md) の `成果物カタログとの責務分担` を参照します。

## 4. schedule

`schedule` は `sch-strategy-<track>.yaml` から `sch-track-<track>.yaml` を生成します。

| コマンド         | 用途                                    | 例                                                                  |
| ---------------- | --------------------------------------- | ------------------------------------------------------------------- |
| `schedule build` | strategy から track schedule を生成する | `specdojo schedule build --project prj-0001 --track launch --force` |
| `schedule where` | schedule 関連パスを表示する             | `specdojo schedule where --project prj-0001`                        |

主要オプション:

| オプション        | 用途                                         |
| ----------------- | -------------------------------------------- |
| `--track <track>` | 生成対象 track を指定する                    |
| `--force`         | 既存の `sch-track-<track>.yaml` を上書きする |
| `--dry-run`       | 生成予定を確認する                           |

Schedule設計の詳細は [Schedule設計ガイド](../guides/schedule-design-guide.md) を参照します。

## 5. register

`register` はプロジェクト登録簿（`pjr-index.md`）と派生ビューを扱います。

| コマンド            | 用途                                         | 例                                                                          |
| ------------------- | -------------------------------------------- | --------------------------------------------------------------------------- |
| `register scaffold` | 登録簿を初期生成する                         | `specdojo register scaffold --project prj-0001`                             |
| `register add`      | issue / todo / question などの項目を追加する | `specdojo register add --project prj-0001 --type issue --title "確認事項"`  |
| `register build`    | 派生ビューを生成する                         | `specdojo register build --project prj-0001`                                |
| `register update`   | 登録項目を更新する                           | `specdojo register update --project prj-0001 --id PJR-001 --field owner=PM` |
| `register start`    | 項目を対応中へ変更する                       | `specdojo register start --project prj-0001 --id PJR-001`                   |
| `register wait`     | 項目を待ち状態へ変更する                     | `specdojo register wait --project prj-0001 --id PJR-001`                    |
| `register review`   | 項目をレビュー状態へ変更する                 | `specdojo register review --project prj-0001 --id PJR-001`                  |
| `register close`    | 項目を完了にし、個票を `ready` へ昇格する    | `specdojo register close --project prj-0001 --id PJR-001`                   |
| `register reject`   | 項目を却下にし、個票を `deprecated` にする   | `specdojo register reject --project prj-0001 --id PJR-001`                  |
| `register defer`    | 項目を延期にする                             | `specdojo register defer --project prj-0001 --id PJR-001`                   |
| `register reopen`   | 終了済み項目を再オープンする                 | `specdojo register reopen --project prj-0001 --id PJR-001`                  |
| `register renumber` | 重複・衝突した PJR-ID を未使用の ID へ移す   | `specdojo register renumber --project prj-0001 --id PJR-0137 --to PJR-0140` |

主要オプション:

| オプション                      | 用途                                                                              | 対象               |
| ------------------------------- | --------------------------------------------------------------------------------- | ------------------ |
| `--to <PJR-ID>`                 | 移動先の PJR-ID を指定する                                                        | `renumber`         |
| `--reserve`                     | 統合ブランチへ登録行だけを追記して PJR-ID を予約する（個票は作らない）            | `add`              |
| `--integration-branch <name>`   | 予約先の統合ブランチ（既定は `run.register_integration_branch`、無ければ `main`） | `add --reserve`    |
| `--integration-worktree <path>` | 予約先の worktree をパスで直接指定する                                            | `add --reserve`    |
| `--commit-message <text>`       | 予約 commit のメッセージを上書きする                                              | `add --reserve`    |
| `--dry-run`                     | 書き込みを行わず変更対象を表示する                                                | `renumber` / `add` |

登録項目を agent に実行させるには `exec run --register` を使います（`exec` の章を参照）。

`renumber` による ID 重複の復旧手順、`add --reserve` による予約起票の運用、登録の判断、type の選び方、状態遷移、個票分離などの台帳運用は [登録簿運用ガイド](../guides/register-operation-guide.md) を参照します。

## 6. exec

`exec` は schedule に基づいたタスクの実行、状態追跡、plan/result 生成、worktree 隔離実行を扱います。

| コマンド         | 用途                                                                 | 例                                                                                                      |
| ---------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `exec where`     | execution 関連パスを表示する                                         | `specdojo exec where --project prj-0001`                                                                |
| `exec validate`  | schedule と event を検証する                                         | `specdojo exec validate --project prj-0001`                                                             |
| `exec build`     | state、Ready、CPM、timeline を生成する                               | `specdojo exec build --project prj-0001`                                                                |
| `exec scheduler` | 次のタスクを自動選択して claim する（`--dry-run` で選択のみ）        | `specdojo exec scheduler --project prj-0001 --by agent-1`                                               |
| `exec claim`     | タスクを `doing` にする                                              | `specdojo exec claim --project prj-0001 --task <task-id> --by agent-1`                                  |
| `exec complete`  | タスクを `done` にする（actor の `doing` が1件なら `--task` 省略可） | `specdojo exec complete --project prj-0001 --by agent-1`                                                |
| `exec reopen`    | 誤って完了したタスクを `done` から `todo` に戻す                     | `specdojo exec reopen --project prj-0001 --task <task-id> --by indie --msg "completion criteria unmet"` |
| `exec block`     | タスクを `blocked` にする                                            | `specdojo exec block --project prj-0001 --task <task-id> --by agent-1 --msg "waiting"`                  |
| `exec unblock`   | `blocked` を `doing` に戻す                                          | `specdojo exec unblock --project prj-0001 --task <task-id> --by agent-1 --msg "resume"`                 |
| `exec release`   | `doing` / `blocked` を `todo` に戻す                                 | `specdojo exec release --project prj-0001 --task <task-id> --by agent-1`                                |
| `exec cancel`    | `todo` を `cancelled` にする                                         | `specdojo exec cancel --project prj-0001 --task <task-id> --by agent-1 --msg "scope removed"`           |
| `exec note`      | メモイベントを残す                                                   | `specdojo exec note --project prj-0001 --task <task-id> --by agent-1 --msg "memo"`                      |
| `exec link`      | 外部参照イベントを残す                                               | `specdojo exec link --project prj-0001 --task <task-id> --by agent-1 --ref pr=https://example.com/pr/1` |
| `exec estimate`  | 見積もりイベントを残す                                               | `specdojo exec estimate --project prj-0001 --task <task-id> --by agent-1 --meta duration_days=1`        |
| `exec run`       | plan を生成してエージェントを実行する                                | `specdojo exec run --project prj-0001 --task <task-id>`                                                 |
| `exec resume`    | `doing`、または due な利用制限延期 task を既存 worktree で再開する   | `specdojo exec resume --project prj-0001 --due`                                                         |
| `exec status`    | 実行状態を表示する                                                   | `specdojo exec status --project prj-0001 --state blocked`                                               |
| `exec scaffold`  | 実行補助設定や provider 設定一式を生成する                           | `specdojo exec scaffold --provider claude`                                                              |
| `exec plan`      | plan だけを生成する                                                  | `specdojo exec plan --project prj-0001 --task <task-id>`                                                |
| `exec archive`   | 完了済み plan を `done/` へ移動する                                  | `specdojo exec archive --project prj-0001 --task <task-id>`                                             |

状態イベントの `--msg` は、イベント種別によって必須・省略可が分かれます。

| コマンド                                               | `--msg` | 省略時に記録される固定メッセージ                                                  |
| ------------------------------------------------------ | ------- | --------------------------------------------------------------------------------- |
| `claim` / `complete` / `release` / `link` / `estimate` | 省略可  | `claim task` / `complete task` / `release task` / `link refs` / `update estimate` |
| `note` / `block` / `unblock` / `reopen` / `cancel`     | 必須    | -（内容・理由・再開根拠をメッセージ自体が表すため）                               |

主要オプション:

| オプション                      | 用途                                                                                                   | 対象                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| `--task <task-id>`              | 対象タスクを指定する                                                                                   | 状態遷移系 / `run` / `plan`                |
| `--by <actor>`                  | 実行 actor を指定する                                                                                  | 状態遷移系                                 |
| `--strategy <name>`             | 選択戦略を切り替える（`critical-first` 既定 / `fifo`）                                                 | `scheduler` / `run --auto`                 |
| `--auto` / `--loop`             | Ready タスクを自動選択する / Ready がなくなるまで繰り返す                                              | `run`                                      |
| `--parallel <n>`                | 同時に走らせる agent 数の上限を指定する                                                                | `run --auto` / `run --register --worktree` |
| `--worktree`                    | worktree に隔離して実行する                                                                            | `run --task` / `run --register`            |
| `--track-state`                 | claim / complete の状態イベントを記録する                                                              | `run --task`                               |
| `--register <PJR-ID>`           | 登録簿の項目を実行する（空白・カンマ区切りで複数可。既定は in-place、`--worktree` で隔離）             | `run` / `plan`                             |
| `--register-commit`             | 成功したIDごとに、その実行で生じた変更を1コミットにまとめる（`--worktree` 時は常に commit のため無視） | `run --register`                           |
| `--on-failure <stop\|continue>` | 途中失敗時に残りのIDを停止するか継続するか（既定は `stop`）                                            | `run --register`                           |
| `--due`                         | 再開時刻を迎えた利用制限延期 task を対象にする                                                         | `resume`                                   |

`exec scheduler` の claim 保護と選択戦略、`--auto --loop --parallel` の枠管理は [Schedule実行運用ガイド](../guides/schedule-operation-guide.md)、`exec reopen` の実行条件は [exec運用ガイド](../guides/exec-operation-guide.md) を参照します。

代表的な `exec run`:

```bash
# カレントリポジトリで単発実行する
specdojo exec run --project prj-0001 --task <task-id>

# claim/complete まで記録する
specdojo exec run --project prj-0001 --task <task-id> --by agent-1 --track-state

# worktree 隔離で単発実行する
specdojo exec run --project prj-0001 --task <task-id> --worktree

# Ready タスクを自動実行する
specdojo exec run --project prj-0001 --auto --parallel 5

# Ready がなくなるまで連続実行する
specdojo exec run --project prj-0001 --auto --loop --parallel 5

# 登録簿の項目を実行する（開始で in-progress、成功で review、失敗で waiting へ遷移）
specdojo exec run --project prj-0001 --register PJR-0012

# 複数の項目を指定順に直列実行し、成功IDごとにcommitする
specdojo exec run --project prj-0001 --register PJR-0012 PJR-0013 --register-commit

# 途中で失敗しても残りの項目を続行する（既定は失敗時に停止）
specdojo exec run --project prj-0001 --register PJR-0012,PJR-0013 --on-failure continue
```

`--register` は登録簿（`pjr-index.md`）の項目を in-place 実行します。実行対象になるのは type が `todo` / `issue` / `change-request` / `question` / `risk` の項目で、`decision` / `dependency` / `note` は対象外です。worktree を使わない直列実行のため、`--worktree` と `--parallel` は併用できません。

register 実行の対応内容、状態追跡、commit の扱いは [登録簿運用ガイド](../guides/register-operation-guide.md)、実行フロー全体は [exec運用ガイド](../guides/exec-operation-guide.md) を参照します。

## 7. exec worktree

`exec worktree` は、claim 済みタスクを段階ごとに確認しながら隔離実行するための分割コマンドです。

| サブコマンド | 用途                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| `prepare`    | plan、result、claim event を checkpoint commit し、task worktree を作成する |
| `status`     | task state、actor、worktree、差分、統合状態を表示する                       |
| `agent`      | task worktree 内で agent command を1回実行する                              |
| `commit`     | 対象 result と成果物変更を exec ブランチへ commit する                      |
| `merge`      | exec ブランチを現在のブランチへ merge する                                  |
| `remove`     | 統合済み task worktree を削除する                                           |

```bash
specdojo exec worktree prepare --project prj-0001 --task <task-id>
cd <worktree-path>
specdojo exec worktree agent --project prj-0001 --task <task-id>
specdojo exec worktree commit --project prj-0001 --task <task-id>
cd <merge-target-worktree>
specdojo exec worktree merge --project prj-0001 --task <task-id>
specdojo exec worktree remove --project prj-0001 --task <task-id> --delete-branch
```

詳細な安全条件は [exec worktree運用ガイド](../guides/exec-worktree-guide.md) を参照します。

## 8. index

`index` は frontmatter の `id` とファイルパスのインデックスを扱います。

| コマンド        | 用途                                              | 例                                                 |
| --------------- | ------------------------------------------------- | -------------------------------------------------- |
| `index build`   | `.specdojo/doc-index.json` を生成する             | `specdojo index build`                             |
| `index lookup`  | ID からパスを返す                                 | `specdojo index lookup prj-overview-rulebook`      |
| `index replace` | `[[id]]` を Markdown リンクまたは path に展開する | `specdojo index replace --format path <plan-path>` |

`exec run` は agent に plan を渡す直前に `index replace --format path --missing keep` 相当の処理を行います。

## 9. watch / build

| コマンド | 用途                                        | 例                                               |
| -------- | ------------------------------------------- | ------------------------------------------------ |
| `watch`  | ファイル変更を監視して対象 build を実行する | `specdojo watch --project prj-0001 --scope exec` |
| `build`  | 全生成物または指定 scope を一括再生成する   | `specdojo build --project prj-0001 --scope all`  |

`--scope` は `exec`、`catalog`、`register`、`index`、`all` を指定します。

## 10. routine

`routine` は `rtn-*.yaml` の定義に基づき、schedule の依存グラフとは独立にタスクを定期実行します。CLI は常駐せず、外部スケジューラ（cron / CI の scheduled workflow）から `routine run --due` を冪等に呼び出します。

| コマンド           | 用途                                           | 例                                              |
| ------------------ | ---------------------------------------------- | ----------------------------------------------- |
| `routine list`     | 定義・due 状態・最終実行を表示する             | `specdojo routine list --project prj-0001`      |
| `routine validate` | `rtn-*.yaml` を検証する                        | `specdojo routine validate --project prj-0001`  |
| `routine run`      | due な routine を実行し、`last_run` を記録する | `specdojo routine run --project prj-0001 --due` |
| `routine where`    | routine 関連パスを表示する                     | `specdojo routine where --project prj-0001`     |

主要オプション:

| オプション  | 用途                                            |
| ----------- | ----------------------------------------------- |
| `--due`     | due と判定された routine だけを対象にする       |
| `--id <id>` | due 判定と無関係に特定の routine を即時実行する |
| `--dry-run` | 実行も `last_run` 記録も行わず、対象を表示する  |

`action.kind` は `register` / `exec-auto` / `exec-resume` の 3 種類です。定義ファイルの配置、`interval` の書式、due 判定、kind ごとの動作は [routine運用ガイド](../guides/routine-operation-guide.md) を参照します。

```bash
# due な routine をまとめて実行する（cron / CI から呼ぶ想定）
specdojo routine run --project prj-0001 --due

# 特定の routine を due 判定と無関係に即時実行する
specdojo routine run --project prj-0001 --id rtn-daily-register-sweep

# 実行内容を確認する（実行も last_run 記録もしない）
specdojo routine run --project prj-0001 --due --dry-run
```

schedule / register / routine の使い分けの基準は [exec運用ガイド](../guides/exec-operation-guide.md) の `実行経路の使い分け` を参照します。

## 11. 関連ガイド

| 詳細                     | 参照先                                                                      |
| ------------------------ | --------------------------------------------------------------------------- |
| CLI全体像と初期設定      | [CLI概要ガイド](../guides/cli-overview-guide.md)                            |
| Schedule設計             | [Schedule設計ガイド](../guides/schedule-design-guide.md)                    |
| exec運用（経路の選び方） | [exec運用ガイド](../guides/exec-operation-guide.md)                         |
| Schedule実行運用         | [Schedule実行運用ガイド](../guides/schedule-operation-guide.md)             |
| routine運用              | [routine運用ガイド](../guides/routine-operation-guide.md)                   |
| 登録簿運用               | [登録簿運用ガイド](../guides/register-operation-guide.md)                   |
| worktree隔離実行         | [exec worktree運用ガイド](../guides/exec-worktree-guide.md)                 |
| plan/result              | [plan/resultライフサイクルガイド](../guides/plan-result-lifecycle-guide.md) |
| エージェント設定         | [exec設定ガイド](../guides/exec-config-guide.md)                            |
