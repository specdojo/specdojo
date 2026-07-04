---
id: specdojo-command-reference-guide
type: guide
status: draft
---

# SpecDojoコマンドリファレンス

SpecDojo Command Reference Guide

`specdojo` CLI の主要コマンドを、用途、代表例、主要オプションに絞って説明します。背景や運用手順は各専門ガイドを参照します。

## 1. 共通オプション

| オプション        | 用途                                               | 主な対象                            |
| ----------------- | -------------------------------------------------- | ----------------------------------- |
| `--project <id>`  | 対象 project を明示する                            | project に紐づくコマンド            |
| `--dry-run`       | 書き込みや実行を行わず予定内容を表示する           | scaffold / build / run / worktree   |
| `--force`         | 既存ファイルの上書きや通常拒否される操作を明示する | scaffold / schedule build / release |
| `--scope <scope>` | build / watch の対象範囲を絞る                     | `build` / `watch`                   |

project の解決順序と設定は [specdojo-cli-overview-guide.md](specdojo-cli-overview-guide.md) を参照します。

## 2. config / project

| コマンド       | 用途                              | 例                      |
| -------------- | --------------------------------- | ----------------------- |
| `config init`  | `specdojo.config.json` を作成する | `specdojo config init`  |
| `project list` | 登録済み project を表示する       | `specdojo project list` |

`current_project` を設定しておくと、多くのコマンドで `--project` を省略できます。

## 3. catalog

`catalog` は成果物カタログ（`dct-*.yaml`）を扱います。

| コマンド           | 用途                                     | 例                                             |
| ------------------ | ---------------------------------------- | ---------------------------------------------- |
| `catalog scaffold` | テンプレートから `dct-*.yaml` を生成する | `specdojo catalog scaffold --project prj-0001` |
| `catalog where`    | catalog 関連パスを表示する               | `specdojo catalog where --project prj-0001`    |
| `catalog validate` | `dct-*.yaml` を検証する                  | `specdojo catalog validate --project prj-0001` |
| `catalog build`    | `generated/dct-*.md` を生成する          | `specdojo catalog build --project prj-0001`    |

主要オプション:

| オプション          | 用途                                              |
| ------------------- | ------------------------------------------------- |
| `--size <size>`     | `small` / `medium` / `large` の成果物セットを選ぶ |
| `--project-id <id>` | 生成ファイルに埋め込む project ID を上書きする    |
| `--force`           | 既存ファイルを上書きする                          |

成果物カタログから Schedule への展開は [specdojo-deliverables-to-schedule-guide.md](specdojo-deliverables-to-schedule-guide.md) を参照します。

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

Schedule設計の詳細は [specdojo-schedule-design-guide.md](specdojo-schedule-design-guide.md) を参照します。

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
| `register close`    | 項目を完了にする                             | `specdojo register close --project prj-0001 --id PJR-001`                   |
| `register reject`   | 項目を却下にする                             | `specdojo register reject --project prj-0001 --id PJR-001`                  |
| `register defer`    | 項目を延期にする                             | `specdojo register defer --project prj-0001 --id PJR-001`                   |
| `register reopen`   | 終了済み項目を再オープンする                 | `specdojo register reopen --project prj-0001 --id PJR-001`                  |

## 6. exec

`exec` は schedule に基づいたタスクの実行、状態追跡、plan/result 生成、worktree 隔離実行を扱います。

| コマンド         | 用途                                       | 例                                                                                                                 |
| ---------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `exec where`     | execution 関連パスを表示する               | `specdojo exec where --project prj-0001`                                                                           |
| `exec validate`  | schedule と event を検証する               | `specdojo exec validate --project prj-0001`                                                                        |
| `exec build`     | state、Ready、CPM、timeline を生成する     | `specdojo exec build --project prj-0001`                                                                           |
| `exec scheduler` | 次に claim するタスクを選ぶ                | `specdojo exec scheduler --project prj-0001 --by agent-1 --dry-run`                                                |
| `exec claim`     | タスクを `doing` にする                    | `specdojo exec claim --project prj-0001 --task <task-id> --by agent-1 --msg "start"`                               |
| `exec complete`  | タスクを `done` にする                     | `specdojo exec complete --project prj-0001 --task <task-id> --by agent-1 --msg "done"`                             |
| `exec block`     | タスクを `blocked` にする                  | `specdojo exec block --project prj-0001 --task <task-id> --by agent-1 --msg "waiting"`                             |
| `exec unblock`   | `blocked` を `doing` に戻す                | `specdojo exec unblock --project prj-0001 --task <task-id> --by agent-1 --msg "resume"`                            |
| `exec release`   | `doing` / `blocked` を `todo` に戻す       | `specdojo exec release --project prj-0001 --task <task-id> --by agent-1 --msg "retry"`                             |
| `exec cancel`    | `todo` を `cancelled` にする               | `specdojo exec cancel --project prj-0001 --task <task-id> --by agent-1 --msg "scope removed"`                      |
| `exec note`      | メモイベントを残す                         | `specdojo exec note --project prj-0001 --task <task-id> --by agent-1 --msg "memo"`                                 |
| `exec link`      | 外部参照イベントを残す                     | `specdojo exec link --project prj-0001 --task <task-id> --by agent-1 --msg "PR" --ref pr=https://example.com/pr/1` |
| `exec estimate`  | 見積もりイベントを残す                     | `specdojo exec estimate --project prj-0001 --task <task-id> --by agent-1 --msg "estimate" --meta duration_days=1`  |
| `exec run`       | plan を生成してエージェントを実行する      | `specdojo exec run --project prj-0001 --task <task-id>`                                                            |
| `exec resume`    | `doing` のタスクを既存 worktree で再開する | `specdojo exec resume --project prj-0001`                                                                          |
| `exec status`    | 実行状態を表示する                         | `specdojo exec status --project prj-0001 --state blocked`                                                          |
| `exec scaffold`  | 実行関連の補助設定を生成する               | `specdojo exec scaffold --project prj-0001`                                                                        |
| `exec plan`      | plan だけを生成する                        | `specdojo exec plan --project prj-0001 --task <task-id>`                                                           |
| `exec archive`   | 完了済み plan を `done/` へ移動する        | `specdojo exec archive --project prj-0001 --task <task-id>`                                                        |

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

# Ready がなくなるまでラウンド実行する
specdojo exec run --project prj-0001 --auto --loop --parallel 5
```

exec運用の詳細は [specdojo-exec-operation-guide.md](specdojo-exec-operation-guide.md) を参照します。

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

詳細な安全条件は [specdojo-exec-worktree-guide.md](specdojo-exec-worktree-guide.md) を参照します。

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

## 10. 関連ガイド

| 詳細                | 参照先                                                                             |
| ------------------- | ---------------------------------------------------------------------------------- |
| CLI全体像と初期設定 | [specdojo-cli-overview-guide.md](specdojo-cli-overview-guide.md)                   |
| Schedule設計        | [specdojo-schedule-design-guide.md](specdojo-schedule-design-guide.md)             |
| exec運用            | [specdojo-exec-operation-guide.md](specdojo-exec-operation-guide.md)               |
| worktree隔離実行    | [specdojo-exec-worktree-guide.md](specdojo-exec-worktree-guide.md)                 |
| plan/result         | [specdojo-plan-result-lifecycle-guide.md](specdojo-plan-result-lifecycle-guide.md) |
| エージェント設定    | [specdojo-exec-config-guide.md](specdojo-exec-config-guide.md)                     |
