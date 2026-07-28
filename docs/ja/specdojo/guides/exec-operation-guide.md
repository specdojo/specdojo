---
specdojo:
  id: exec-operation-guide
  type: guide
  status: draft
---

# exec運用ガイド

Exec Operation Guide

`specdojo exec` によるタスク実行、実行経路（schedule / register / routine）の使い分け、状態追跡、自動実行、手動実行、blocked 復帰を説明します。コマンド一覧は [CLIコマンドリファレンス](../references/specdojo-command-reference.md) を参照します。

**対象読者**

- Schedule や登録簿のタスクを人またはエージェントで実行・監視する開発者、運用者

**この文書で分かること**

- 実行経路の選び方、自動・手動実行、状態遷移、blocked 復帰、再実行、routine による定期実行、human タスクの扱い

**次に読む文書**

- エージェント設定は [exec設定ガイド](exec-config-guide.md)、plan・result の管理は [plan/resultライフサイクルガイド](plan-result-lifecycle-guide.md)、手動隔離実行は [exec worktree運用ガイド](exec-worktree-guide.md) を参照してください。

## 1. execの基本

exec が扱う関心事、タスクの出どころによる実行経路の選び方、代表的なユースケースを示します。

### 1.1. execの関心事

`exec` は次の関心事を分けて扱います。

| 関心事           | 内容                                                      | 代表コマンド                                   |
| ---------------- | --------------------------------------------------------- | ---------------------------------------------- |
| plan生成         | schedule または catalog から作業指示を作る                | `exec plan` / `exec run`                       |
| 状態追跡         | claim / complete / reopen / block などの event を記録する | `exec claim` / `exec complete` / `exec reopen` |
| 隔離             | task worktree で成果物変更を隔離する                      | `exec run --worktree` / `exec worktree`        |
| スケジューリング | Ready と CPM から次タスクを選んで claim する              | `exec scheduler` / `exec run --auto`           |

既定の `exec run --task` はカレントリポジトリで単発実行し、状態イベントや worktree を作りません。

### 1.2. 実行経路の使い分け

agent にタスクを実行させる経路は、実行対象の出どころによって schedule 実行と register 実行の 2 つがあります。routine はそれらを時刻条件で発火させるトリガー層で、それ自体は実行機構を持ちません。「何を実行するか」（schedule / register）と「いつ実行するか」（人が起動する / routine が定期起動する）は独立に選べます。

| 観点         | schedule 実行                             | register 実行                                     | routine（トリガー層）                    |
| ------------ | ----------------------------------------- | ------------------------------------------------- | ---------------------------------------- |
| 実行対象     | `sch-track-*.yaml` のタスク（依存グラフ） | `pjr-index.md` の項目                             | `rtn-*.yaml` の定義（実体は左の 2 経路） |
| 代表コマンド | `exec run --task` / `exec run --auto`     | `exec run --register`                             | `routine run --due`                      |
| 起動         | 人、または routine（`kind: exec-auto`）   | 人、または routine（`kind: register`）            | 外部スケジューラ（cron / CI）            |
| 状態追跡     | exec events（claim / complete / block）   | register の遷移（in-progress / review / waiting） | `last_run` の記録のみ                    |
| 隔離         | worktree（`--worktree` / `--auto`）       | in-place のみ                                     | -（実行経路へ委譲）                      |
| 終端の扱い   | `complete` event（human finalize で確定） | 人が確認して `register close`                     | -（発火の記録のみ）                      |
| 典型用途     | 計画された成果物の作成・レビュー・確定    | 突発の TODO・課題対応・調査                       | 日次スイープ・夜間バッチなどの定期実行   |

迷った場合は次で判断します。

- 成果物カタログと依存関係に基づく計画済みの作業は schedule 実行を使う（`exec run --auto` / `--task`）。
- 計画外に発生した単発の対応・調査で、台帳として追跡したいものは register 実行を使う（`register add` で登録して `exec run --register`）。
- 上記のどちらかを決まった時刻条件で繰り返したい場合は routine を使う（`rtn-*.yaml` を定義して外部スケジューラから `routine run --due` を呼ぶ）。

register 実行は exec events を記録しないため、schedule の Ready・CPM・phase gate には影響しません。schedule の進捗として扱いたい作業は register 項目のままにせず、schedule のタスクとして計画します。

登録の判断、type の選び方、個票分離などの台帳運用は [登録簿運用ガイド](register-operation-guide.md) を参照します。

### 1.3. ユースケース別の選び方

| やりたいこと                            | 代表コマンド                          | 状態追跡        | worktree |
| --------------------------------------- | ------------------------------------- | --------------- | -------- |
| 1 task をカレントで軽く実行する         | `exec run --task`                     | なし            | なし     |
| 1 task をカレントで実行し進捗へ反映する | `exec run --task --track-state`       | あり            | なし     |
| 1 task を隔離して実行する               | `exec run --task --worktree`          | あり            | あり     |
| Ready 順に自動実行する                  | `exec run --auto`                     | あり            | あり     |
| 登録簿の項目を agent に実行させる       | `exec run --register`                 | register の遷移 | なし     |
| 登録簿の複数項目を指定順に直列実行する  | `exec run --register PJR-A PJR-B`     | register の遷移 | なし     |
| plan を確認してから実行する             | `exec plan` -> `exec run --plan`      | 任意            | 任意     |
| worktree の各段階を人が確認する         | `exec worktree prepare` から `remove` | 手動            | あり     |

`exec run --register ... --register-commit` は、各IDのcommit後にhookによる整形差分を同じcommitへ収束させ、対象差分が残っていないことを検証します。登録簿・派生ビュー・当該plan/resultはrunner管理パスとして扱い、その他の実行前からある利用者変更はcommitしません。過去の未commit plan/resultを検出した場合は、現在のIDへ混ぜず警告します。

## 2. 自動実行

`exec run --auto` で Ready タスクを選び、worktree 隔離と状態追跡を伴って実行する経路です。

### 2.1. 自動実行フロー

`exec run --auto` は Ready タスクを選び、worktree 隔離と状態追跡を伴って実行します。

```text
exec build
  -> ready.json に Ready タスクを出力
exec run --auto [--loop]
  -> Ready タスクを選択
  -> phase 要件と pm-members.yaml から agent を解決
  -> plan / result を生成
  -> claim
  -> root に checkpoint commit
  -> task worktree を作成
  -> agent command を実行
  -> 成功: result と成果物を commit / merge / complete
  -> 失敗: result を blocked に更新 / block / worktree を保持
exec build
  -> 次の Ready タスクを更新
```

`--loop --parallel <n>` では、最初に最大 `n` 件を起動した後、1件の agent が終了するたびに root 側の統合処理を終えて `exec build` を実行し、空いた枠へ次の Ready タスクを投入します。他の実行中 task の完了を待たないため、長時間 task と短時間 task が混在しても短時間 task の枠を継続利用できます。`--loop` を指定しない場合は、開始時に選択した最大 `n` 件だけを実行して終了します。

代表コマンド:

```bash
# 1バッチ実行して終了する
specdojo exec run --project <project-id> --auto --parallel 5

# Ready がなくなるまで連続実行する
specdojo exec run --project <project-id> --auto --loop --parallel 5

# FIFO順で実行する
specdojo exec run --project <project-id> --auto --strategy fifo
```

### 2.2. auto実行中の注意点

`--auto` と `--loop` は root の現在ブランチへ checkpoint commit と merge を繰り返します。同じ作業ツリーで並行して手作業を行う場合は、次の安全ガードに注意します。

| 状況                                           | 挙動                                              |
| ---------------------------------------------- | ------------------------------------------------- |
| root index に stage 済み変更がある             | checkpoint 前に停止する                           |
| root の未commit変更と merge 対象パスが重複する | merge 前に停止する                                |
| agent が失敗して `blocked` になる              | worktree を保持し、auto の Ready 選択から除外する |
| プロセス中断で `doing` が残る                  | `exec resume` で再開する                          |

parallel 実行中でも、claim、checkpoint、merge、complete、`exec build` は runner が直列化します。agent プロセスだけを並列に走らせ、root 側の状態更新や Ready 再計算は1件ずつ処理します。

auto 実行と並行して人が作業する場合は、別ブランチの worktree を作成して編集します。

```bash
git worktree add ../specdojo-edit -b <edit-branch>
```

## 3. 手動実行

自動実行がまとめて行う各段階を、人が確認しながら順に進める経路です。

### 3.1. 手動実行フロー

`exec run --auto` の処理を手で分ける場合は、次の順に実行します。タスクを確認せず次のタスクをそのまま claim してよい場合は、手順 2〜4 の代わりに `--dry-run` なしの `exec scheduler` を 1 回実行します（自動選択と claim をまとめて行う）。

`exec scheduler` は、タスクIDを指定せずに次のタスクを claim するためのコマンドです。claim にあたって次の保護が働きます。

- プロジェクトレベルのロックを取得し、複数の runner が同じタスクを同時に claim しません。
- `owner` と actor のロール整合をチェックし、担当ロールの一致しないタスクは選びません。
- 同じ actor に `doing` のタスクが残っている場合は、多重 claim を防ぐため拒否します。

選択戦略は `--strategy` で切り替えます（`critical-first` 既定 / `fifo`）。選択結果の確認だけを行う場合は `--dry-run` を付けます。

```bash
# 1. Ready と CPM を最新化する
specdojo exec build --project <project-id>

# 2. 次のタスクを確認する
specdojo exec scheduler --project <project-id> --by <actor> --dry-run

# 3. 実行コマンドと agent 解決結果を確認する
specdojo exec run --project <project-id> --task <task-id> --dry-run

# 4. claim する（--msg 省略時は固定メッセージ "claim task" が記録される）
specdojo exec claim \
  --project <project-id> \
  --task <task-id> \
  --by <actor>

# 5. 実行する
specdojo exec run --project <project-id> --task <task-id>

# 6. 完了を記録する（--msg 省略時は固定メッセージ "complete task" が記録される）
specdojo exec complete \
  --project <project-id> \
  --by <actor>

# 7. 次の Ready を更新する
specdojo exec build --project <project-id>
```

`exec complete` は `--task` を省略できます。`--by` で指定した actor の `doing` タスクが1件だけの場合は、そのタスクを完了対象として解決します。対象が0件の場合はエラー、複数件の場合は曖昧性を避けるため `--task <task-id>` の指定を要求します。

worktree 隔離を人が段階確認しながら実行する場合は [exec worktree運用ガイド](exec-worktree-guide.md) を参照します。

### 3.2. planを確認してから実行する

plan を先に生成して内容を確認・編集してから実行できます。

```bash
specdojo exec plan --project <project-id> --task <task-id>
specdojo exec run --project <project-id> --plan <execution-path>/exec/plans/<task-id>-plan.md
```

schedule に無い成果物を catalog から直接 plan 化する場合は `--deliverable <local_id>` を使います。

```bash
specdojo exec plan --project <project-id> --deliverable <local_id>
```

plan / result の命名、再実行、アーカイブは [plan/resultライフサイクルガイド](plan-result-lifecycle-guide.md) を参照します。

## 4. routineによる定期実行

`routine` は `rtn-*.yaml` の定義に基づき、Schedule の依存グラフとは独立にタスクを定期実行します。CLI は常駐しません。外部スケジューラ（cron / CI の scheduled workflow）から `routine run --due` を冪等に呼び出す前提です。

定義は `specdojo.config.json` の `routines_path` 配下に `rtn-<slug>.yaml` として置き、`id` はファイル名と一致させます。

```yaml
id: rtn-daily-register-sweep
name: 登録簿 open todo の日次スイープ
enabled: true
interval: 1d
action:
  kind: register
  filter:
    types:
      - todo
    priorities:
      - high
    statuses:
      - open
  limit: 3
```

最終実行時刻は `<routines-path>/generated/routine-state.json` に記録され、`interval`（`30m` / `6h` / `1d` / `1w` 形式）が経過したものを due と判定します。多重起動は lock で防ぐため、外部スケジューラが重複起動しても同じ routine が二重に走ることはありません。

`action.kind` で、どの実行経路を発火させるかを選びます。

| kind          | 動作                                                                                                                 |
| ------------- | -------------------------------------------------------------------------------------------------------------------- |
| `register`    | 登録簿から `filter`（`types` / `priorities` / `statuses`）と `limit` で選んだ項目を `exec run --register` で実行する |
| `exec-auto`   | `exec run --auto` を実行する（`strategy` / `parallel` / `loop` / `max_rounds` を指定できる）                         |
| `exec-resume` | 再開時刻を迎えた retryable な利用制限 task を `exec resume --due` で排他的に再開する（`parallel` を指定できる）      |

```bash
# due な routine をまとめて実行する（cron / CI から呼ぶ想定）
specdojo routine run --project <project-id> --due

# 特定の routine を due 判定と無関係に即時実行する
specdojo routine run --project <project-id> --id rtn-daily-register-sweep

# 実行内容を確認する（実行も last_run 記録もしない）
specdojo routine run --project <project-id> --due --dry-run
```

routine 自体は実行機構を持たないトリガー層です。何を実行するかは `action.kind` が指す schedule 実行または register 実行に委ねられ、状態追跡もそれぞれの経路の規則に従います。routine が記録するのは `last_run` だけです。

## 5. 中断・訂正・再実行

実行が途中で止まった場合、完了判定そのものを訂正する場合、利用制限で中断した場合の戻し方を扱います。

### 5.1. blockedタスクの復帰

`blocked` は人の判断や外部対応が必要な障害を表します。状況に応じて次のコマンドを使います。

| 状況                             | コマンド       | 結果                   |
| -------------------------------- | -------------- | ---------------------- |
| 中断で `doing` のまま            | `exec resume`  | 既存 worktree 上で継続 |
| 障害を解消し同じ試行を続ける     | `exec unblock` | `blocked -> doing`     |
| 試行を破棄して最初からやり直す   | `exec release` | `blocked -> todo`      |
| 着手前のタスクを恒久的に中止する | `exec cancel`  | `todo -> cancelled`    |

`release` は `doing` / `blocked` の試行を破棄して `todo` に戻します。`cancel` は `todo` のタスクを終端状態にする操作です。

```bash
specdojo exec release \
  --project <project-id> \
  --task <task-id> \
  --by <actor>

specdojo exec build --project <project-id>
```

調査用 worktree も即座に破棄したい場合だけ `--reset-worktree` を付けます。

```bash
specdojo exec release \
  --project <project-id> \
  --task <task-id> \
  --by <actor> \
  --reset-worktree
```

`--reset-worktree` は未commitの result や成果物変更を破棄します。内容を確認したい場合は、先に [exec worktree運用ガイド](exec-worktree-guide.md) の `status` を使います。

### 5.2. 完了済みタスクをtodoに戻す

完了条件を満たしていないのに `complete` した場合など、完了判定そのものを訂正するときは `exec reopen` を使います。単に追加作業が発生した場合は、完了履歴を訂正せず新しい schedule task として計画します。

```bash
specdojo exec reopen \
  --project <project-id> \
  --task <task-id> \
  --by <human-actor> \
  --msg "completion criteria unmet"

specdojo exec build --project <project-id>
```

`reopen` は `reopen` event を追記し、`done -> todo` へ遷移させます。対応する `complete` event は削除しないため、「一度完了と判断した後、理由を記録して再開した」という履歴が残ります。

次の条件をすべて満たす必要があります。

- 対象が schedule に存在する task で、現在の状態が `done` です。
- `--task`、`--by`、`--msg` を明示します。
- `--by` が `pm-members.yaml` で `type: human` の member です。
- 対象に依存する後続 task に `doing`、`blocked`、`done` がありません。

後続 task も完了済みの場合は、依存グラフの下流から順に `reopen` します。後続 task が `doing` / `blocked` の場合は、先に同じ試行を完了させるか、`exec release` で `todo` に戻します。これにより、完了していない依存先を前提に後続 task が進行・完了している状態を防ぎます。

`reopen` は plan、result、成果物、Git 履歴を削除・復元しません。完了済み plan は `exec/plans/done/` に残り、次の `exec plan` / `exec run` で新しい固定名 plan を生成します。再 claim 時は固定名 result を再利用し、新しい試行の状態と時刻に更新します。

```bash
specdojo exec claim --project <project-id> --task <task-id> --by <actor> --msg "rerun"
specdojo exec run --project <project-id> --task <task-id>
specdojo exec complete --project <project-id> --task <task-id> --by <actor> --msg "rerun done"
```

### 5.3. 完了済みタスクの再実行

完了済み（`done`）タスクをやり直す場合は、既定の軽量実行でそのまま実行します。状態イベントは追加されず、変更は作業ツリーに残ります。

```bash
specdojo exec run --project <project-id> --task <task-id>
```

完了判定を取り消して Schedule の進捗として再度記録する場合は、先に `reopen` して `todo` に戻し、その後 `claim`、`run`、`complete` を明示的に行います。`complete` が正しく、追加作業だけが必要な場合は元の task を `reopen` せず、新しい task として計画します。

### 5.4. レートリミット対応

AI モデルの rate limit に達した場合、`exec run` は `.specdojo/exec-defaults.yaml` の `rate_limit_policy` に従います。

| 状況                             | 代表対応                                                                |
| -------------------------------- | ----------------------------------------------------------------------- |
| 別 provider / agent の候補がある | 次候補へ切り替え、独立した Ready task は継続する                        |
| reset / retry-after を取得できる | 再開時刻と worktree を block event に保持し、`exec resume --due` で再開 |
| 時刻不明で明示 cooldown がある   | 設定済み cooldown から再開時刻を記録する                                |
| 時刻不明で cooldown もない       | 時刻を推定せず、通常の blocked として人に委ねる                         |
| `quota_exhausted`                | 自動再開せず、別 provider が無ければ人に委ねる                          |

定時起動する場合は routine の `exec-resume` action を使います。due 判定と `blocked -> doing` の確保は scheduler lock 内で行われるため、多重起動でも同じ task を重複実行しません。

```yaml
id: rtn-exec-limit-resume
enabled: true
interval: 15m
action:
  kind: exec-resume
  parallel: 2
```

provider別の `max_concurrency` や agent 選択は [exec設定ガイド](exec-config-guide.md) を参照します。

## 6. humanタスクの実行

`execution: human` のタスク（finalize など）はエージェントを起動しません。`exec run` / `exec worktree` はこれらのタスクを拒否し、`--agent-cmd` などの override を要求します。人が result を作業の入口として、最終確認・修正と確定を行います。

human task の plan は生成しません。対象タスクを claim すると、`exec claim` が `execution: human`、`approach`、`targets` を持つ result を scaffold します。この result が作業指示と確認記録の正本です。確定手順は [Human Finalize 実行レシピ](../recipes/exec-human-finalize-recipe.md)、共通規約は [Human Finalize 実行標準](../standards/exec-human-finalize-standard.md)を参照します。

確定作業のスコープは `approach` で明示します。`finalize` は成果物のみを確定し、`bootstrap-finalize` は bootstrap と対になり、成果物と参考資料（rulebook / recipe / sample / template）をまとめて確定します。claim が scaffold する result には、done_criteria の確認チェックリストと確定対象のチェックリストが焼き込まれます。確認・昇格の記録はこの result のチェックリストに残します。

実行者に依らず、進捗（Ready・phase gate・CPM）へ反映するため状態イベントを記録します。

```bash
# 1. Ready を更新する（human plan は生成しない）
specdojo exec build --project <project-id>

# 2. claim して result を生成する
specdojo exec claim \
  --project <project-id> \
  --task <task-id> \
  --by <actor> \
  --msg "finalize"

# 3. 人が result に従って最終確認・修正し、成果物 frontmatter の status を ready に更新する
#    result の 確認チェックリスト / 確定対象 にチェックを付け、
#    確定判断 を記入する（差し戻し理由や修正内容があれば 備考 に残す）

# 4. 完了を記録する
specdojo exec complete \
  --project <project-id> \
  --task <task-id> \
  --by <actor> \
  --msg "finalized"

# 5. 次の Ready を更新する
specdojo exec build --project <project-id>
```

成果物の `status` を `ready` に昇格できるのは人だけです。エージェント実行では、`ready` へ昇格させるコミットは exec のガードで拒否されます。
