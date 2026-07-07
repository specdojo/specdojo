---
specdojo:
  id: specdojo-exec-operation-guide
  type: guide
  status: draft
---

# SpecDojo exec運用ガイド

SpecDojo Exec Operation Guide

`specdojo exec` によるタスク実行、状態追跡、自動実行、手動実行、blocked 復帰を説明します。コマンド一覧は [specdojo-command-reference-guide.md](specdojo-command-reference-guide.md) を参照します。

## 1. execの関心事

`exec` は次の関心事を分けて扱います。

| 関心事           | 内容                                             | 代表コマンド                            |
| ---------------- | ------------------------------------------------ | --------------------------------------- |
| plan生成         | schedule または catalog から作業指示を作る       | `exec plan` / `exec run`                |
| 状態追跡         | claim / complete / block などの event を記録する | `exec claim` / `exec complete`          |
| 隔離             | task worktree で成果物変更を隔離する             | `exec run --worktree` / `exec worktree` |
| スケジューリング | Ready と CPM から次タスクを選ぶ                  | `exec scheduler` / `exec run --auto`    |

既定の `exec run --task` はカレントリポジトリで単発実行し、状態イベントや worktree を作りません。

## 2. 自動実行フロー

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

## 3. auto実行中の注意点

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

## 4. blockedタスクの復帰

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

## 5. 手動実行フロー

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

## 6. ユースケース別の選び方

| やりたいこと                            | 代表コマンド                          | 状態追跡 | worktree |
| --------------------------------------- | ------------------------------------- | -------- | -------- |
| 1 task をカレントで軽く実行する         | `exec run --task`                     | なし     | なし     |
| 1 task をカレントで実行し進捗へ反映する | `exec run --task --track-state`       | あり     | なし     |
| 1 task を隔離して実行する               | `exec run --task --worktree`          | あり     | あり     |
| Ready 順に自動実行する                  | `exec run --auto`                     | あり     | あり     |
| plan を確認してから実行する             | `exec plan` -> `exec run --plan`      | 任意     | 任意     |
| worktree の各段階を人が確認する         | `exec worktree prepare` から `remove` | 手動     | あり     |

## 7. planを確認してから実行する

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

## 8. 完了済みタスクの再実行

完了済み（`done`）タスクをやり直す場合は、既定の軽量実行でそのまま実行します。状態イベントは追加されず、変更は作業ツリーに残ります。

```bash
specdojo exec run --project <project-id> --task <task-id>
```

スケジュール進捗として再度記録したい場合は、`claim`、`run`、`complete` を明示的に行います。

## 9. レートリミット対応

AI モデルの rate limit に達した場合、`exec run` は `.specdojo/exec-defaults.yaml` の `rate_limit_policy` に従います。

| タスク         | 代表対応                                         |
| -------------- | ------------------------------------------------ |
| 非クリティカル | skip または block して次へ進む                   |
| クリティカル   | 次候補 agent へ切り替え、必要に応じて retry する |

provider別の `max_concurrency` や agent 選択は [specdojo-exec-config-guide.md](specdojo-exec-config-guide.md) を参照します。

## 10. humanタスクの実行

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
