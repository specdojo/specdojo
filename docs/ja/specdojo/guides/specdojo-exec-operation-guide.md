---
specdojo:
  id: specdojo-exec-operation-guide
  type: guide
  status: draft
---

# SpecDojo exec運用ガイド

SpecDojo Exec Operation Guide

`specdojo exec` によるタスク実行、実行経路（schedule / register / routine）の使い分け、状態追跡、自動実行、手動実行、blocked 復帰を説明します。コマンド一覧は [specdojo-command-reference-guide.md](specdojo-command-reference-guide.md) を参照します。

## 1. execの関心事

`exec` は次の関心事を分けて扱います。

| 関心事           | 内容                                             | 代表コマンド                            |
| ---------------- | ------------------------------------------------ | --------------------------------------- |
| plan生成         | schedule または catalog から作業指示を作る       | `exec plan` / `exec run`                |
| 状態追跡         | claim / complete / block などの event を記録する | `exec claim` / `exec complete`          |
| 隔離             | task worktree で成果物変更を隔離する             | `exec run --worktree` / `exec worktree` |
| スケジューリング | Ready と CPM から次タスクを選ぶ                  | `exec scheduler` / `exec run --auto`    |

既定の `exec run --task` はカレントリポジトリで単発実行し、状態イベントや worktree を作りません。

## 2. 実行経路の使い分け

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

登録の判断、type の選び方、個票分離などの台帳運用は [specdojo-register-operation-guide.md](specdojo-register-operation-guide.md) を参照します。

## 3. 自動実行フロー

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

代表コマンド:

```bash
# 1バッチ実行して終了する
specdojo exec run --project <project-id> --auto --parallel 5

# Ready がなくなるまでラウンド実行する
specdojo exec run --project <project-id> --auto --loop --parallel 5

# FIFO順で実行する
specdojo exec run --project <project-id> --auto --strategy fifo
```

## 4. auto実行中の注意点

`--auto` と `--loop` は root の現在ブランチへ checkpoint commit と merge を繰り返します。同じ作業ツリーで並行して手作業を行う場合は、次の安全ガードに注意します。

| 状況                                           | 挙動                                              |
| ---------------------------------------------- | ------------------------------------------------- |
| root index に stage 済み変更がある             | checkpoint 前に停止する                           |
| root の未commit変更と merge 対象パスが重複する | merge 前に停止する                                |
| agent が失敗して `blocked` になる              | worktree を保持し、auto の Ready 選択から除外する |
| プロセス中断で `doing` が残る                  | `exec resume` で再開する                          |

auto 実行と並行して人が作業する場合は、別ブランチの worktree を作成して編集します。

```bash
git worktree add ../specdojo-edit -b <edit-branch>
```

## 5. blockedタスクの復帰

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
  --by <actor> \
  --msg "abandon blocked attempt; reset to todo"

specdojo exec build --project <project-id>
```

調査用 worktree も即座に破棄したい場合だけ `--reset-worktree` を付けます。

```bash
specdojo exec release \
  --project <project-id> \
  --task <task-id> \
  --by <actor> \
  --msg "reset blocked task" \
  --reset-worktree
```

`--reset-worktree` は未commitの result や成果物変更を破棄します。内容を確認したい場合は、先に [specdojo-exec-worktree-guide.md](specdojo-exec-worktree-guide.md) の `status` を使います。

## 6. 手動実行フロー

`exec run --auto` の処理を手で分ける場合は、次の順に実行します。

```bash
# 1. Ready と CPM を最新化する
specdojo exec build --project <project-id>

# 2. 次のタスクを確認する
specdojo exec scheduler --project <project-id> --by <actor> --dry-run

# 3. 実行コマンドと agent 解決結果を確認する
specdojo exec run --project <project-id> --task <task-id> --dry-run

# 4. claim する
specdojo exec claim \
  --project <project-id> \
  --task <task-id> \
  --by <actor> \
  --msg "manual run"

# 5. 実行する
specdojo exec run --project <project-id> --task <task-id>

# 6. 完了を記録する
specdojo exec complete \
  --project <project-id> \
  --task <task-id> \
  --by <actor> \
  --msg "manual run done"

# 7. 次の Ready を更新する
specdojo exec build --project <project-id>
```

worktree 隔離を人が段階確認しながら実行する場合は [specdojo-exec-worktree-guide.md](specdojo-exec-worktree-guide.md) を参照します。

## 7. ユースケース別の選び方

| やりたいこと                            | 代表コマンド                          | 状態追跡        | worktree |
| --------------------------------------- | ------------------------------------- | --------------- | -------- |
| 1 task をカレントで軽く実行する         | `exec run --task`                     | なし            | なし     |
| 1 task をカレントで実行し進捗へ反映する | `exec run --task --track-state`       | あり            | なし     |
| 1 task を隔離して実行する               | `exec run --task --worktree`          | あり            | あり     |
| Ready 順に自動実行する                  | `exec run --auto`                     | あり            | あり     |
| 登録簿の項目を agent に実行させる       | `exec run --register`                 | register の遷移 | なし     |
| plan を確認してから実行する             | `exec plan` -> `exec run --plan`      | 任意            | 任意     |
| worktree の各段階を人が確認する         | `exec worktree prepare` から `remove` | 手動            | あり     |

## 8. planを確認してから実行する

plan を先に生成して内容を確認・編集してから実行できます。

```bash
specdojo exec plan --project <project-id> --task <task-id>
specdojo exec run --project <project-id> --plan <execution-path>/exec/plans/<task-id>-plan.md
```

schedule に無い成果物を catalog から直接 plan 化する場合は `--deliverable <local_id>` を使います。

```bash
specdojo exec plan --project <project-id> --deliverable <local_id>
```

plan / result の命名、再実行、アーカイブは [specdojo-plan-result-lifecycle-guide.md](specdojo-plan-result-lifecycle-guide.md) を参照します。

## 9. 完了済みタスクの再実行

完了済み（`done`）タスクをやり直す場合は、既定の軽量実行でそのまま実行します。状態イベントは追加されず、変更は作業ツリーに残ります。

```bash
specdojo exec run --project <project-id> --task <task-id>
```

スケジュール進捗として再度記録したい場合は、`claim`、`run`、`complete` を明示的に行います。

## 10. レートリミット対応

AI モデルの rate limit に達した場合、`exec run` は `.specdojo/exec-defaults.yaml` の `rate_limit_policy` に従います。

| タスク         | 代表対応                                         |
| -------------- | ------------------------------------------------ |
| 非クリティカル | skip または block して次へ進む                   |
| クリティカル   | 次候補 agent へ切り替え、必要に応じて retry する |

provider別の `max_concurrency` や agent 選択は [specdojo-exec-config-guide.md](specdojo-exec-config-guide.md) を参照します。

## 11. humanタスクの実行

`execution: human` のタスク（finalize など）はエージェントを起動しません。`exec run` / `exec worktree` はこれらのタスクを拒否し、`--agent-cmd` などの override を要求します。人が直接、最終確認・修正と確定を行います。

plan は `exec build` が自動生成します。対象タスクが Ready になると、`exec build` は未生成の human plan を `exec/plans/<task-id>-plan.md` に作成します。この plan は agent 向けの実行プロトコルを持たず、done_criteria の確認チェックリストと確定手順で構成されます。既存 plan は上書きしません。

確定作業のスコープは `approach` で明示します。`finalize` は成果物のみを確定し、`bootstrap-finalize` は bootstrap と対になり、成果物と参考資料（rulebook / recipe / sample / template）をまとめて確定します。claim が scaffold する result には、done_criteria の確認チェックリストと確定対象のチェックリストが焼き込まれます。確認・昇格の記録はこの result のチェックリストに残します。`sch-strategy-<track>.yaml` の finalize フェーズに `approach` を指定すると、対応する human 用テンプレートから plan が生成されます（テンプレート選択は [specdojo-plan-result-lifecycle-guide.md](specdojo-plan-result-lifecycle-guide.md) を参照）。

実行者に依らず、進捗（Ready・phase gate・CPM）へ反映するため状態イベントを記録します。

```bash
# 1. plan を生成する（Ready なら build が human plan を作る）
specdojo exec build --project <project-id>

# 2. claim する
specdojo exec claim \
  --project <project-id> \
  --task <task-id> \
  --by <actor> \
  --msg "finalize"

# 3. 人が最終確認・修正し、成果物 frontmatter の status を ready に更新する
#    result の 確認チェックリスト / 確定対象 にチェックを付け、
#    実施内容 / 変更ファイル / 確定判断 を記入する

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
