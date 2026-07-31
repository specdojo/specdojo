---
specdojo:
  id: schedule-operation-guide
  type: guide
  status: draft
---

# Schedule実行運用ガイド

Schedule Execution Operation Guide

Schedule（`sch-track-*.yaml`）から生成したタスクを、自動実行または手動実行する手順を説明します。3つの実行経路（schedule / register / routine）の比較と選び方は [exec運用ガイド](exec-operation-guide.md) を、Schedule自体の設計は [Schedule設計ガイド](schedule-design-guide.md) を参照します。

**対象読者**

- Schedule のタスクを自動または手動で実行する開発者、運用者

**この文書で分かること**

- 自動実行のフローと注意点、手動実行の各ステップ、plan を確認してから実行する方法

**次に読む文書**

- 実行経路の選び方は [exec運用ガイド](exec-operation-guide.md)、register 実行は [登録簿運用ガイド](register-operation-guide.md)、時刻条件による起動は [routine運用ガイド](routine-operation-guide.md) を参照してください。
- エージェント設定は [exec設定ガイド](exec-config-guide.md)、worktree隔離の段階操作は [exec worktree運用ガイド](exec-worktree-guide.md) を参照してください。

## 1. 自動実行

`exec run --auto` で Ready タスクを選び、worktree 隔離と状態追跡を伴って実行する経路です。

### 1.1. 自動実行フロー

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

### 1.2. auto実行中の注意点

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

## 2. 手動実行

自動実行がまとめて行う各段階を、人が確認しながら順に進める経路です。

### 2.1. 手動実行フロー

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

### 2.2. planを確認してから実行する

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
