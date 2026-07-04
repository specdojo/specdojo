---
specdojo:
  id: specdojo-plan-result-lifecycle-guide
  type: guide
  status: draft
---

# SpecDojo plan/resultライフサイクルガイド

SpecDojo Plan and Result Lifecycle Guide

`exec plan` / `exec run` / `exec claim` が扱う plan と result の生成、命名、再実行、アーカイブを説明します。exec の実行手順は [specdojo-exec-operation-guide.md](specdojo-exec-operation-guide.md) を参照します。

## 1. planとresultの役割

| ファイル | 役割                             | 生成タイミング            |
| -------- | -------------------------------- | ------------------------- |
| plan     | agent または人に渡す作業指示     | `exec plan` / `exec run`  |
| result   | 実行結果、確認結果、残課題の記録 | `exec claim` / `exec run` |

plan と result は git 管理対象の通常ファイルとして扱います。`generated/` のような再生成物ではありません。

## 2. 配置

| 種別          | 配置                                |
| ------------- | ----------------------------------- |
| plan          | `<execution_path>/exec/plans/`      |
| 完了後の plan | `<execution_path>/exec/plans/done/` |
| result        | `<execution_path>/exec/results/`    |

result は完了記録であり、review などから参照されるため `done/` へ移動しません。

## 3. task identityありの命名

`--task <task-id>` を使う場合、plan と result は task ID を使った固定名になります。

```text
exec/plans/<task-id>-plan.md
exec/results/<task-id>-result.md
```

対象:

| 操作                     | 命名                 |
| ------------------------ | -------------------- |
| `exec plan --task`       | 固定名 plan          |
| `exec run --task`        | 固定名 plan / result |
| `exec claim`             | 固定名 result        |
| `exec run --track-state` | 固定名 plan / result |
| `exec run --worktree`    | 固定名 plan / result |

同じ task の再生成や再実行では同じファイルを上書きします。過去内容は Git 履歴、完了の事実は event と commit 履歴で追跡します。

## 4. task identityなしの命名

`--deliverable <local_id>` や ad-hoc 実行では、task ID がないためユニーク名を使います。

```text
exec/plans/<stem>-plan.md
exec/results/<stem>-result.md
```

`<stem>` は plan と result の連結キーです。同じ plan から実行する result は同じ `<stem>` を使います。

## 5. stemの決定順序

`<stem>` は次の優先順位で決まります。

1. `--out <path>` または `--plan <path>` を指定した場合は、そのファイル名から導出する。
2. `--task <task-id>` がある場合は、`<stem> = <task-id>` とする。
3. task identity がない場合は、`<slug>-<UTC>-<rand>` のユニーク名を採番する。

これにより、task 実行は固定名で扱い、schedule 非依存の実行は実行ごとの証跡を残せます。

## 6. 生成ルール

| 操作                            | plan             | result                                    | 状態event                                 |
| ------------------------------- | ---------------- | ----------------------------------------- | ----------------------------------------- |
| `exec plan --task`              | 生成する         | 生成しない                                | 変更しない                                |
| `exec plan --deliverable`       | 生成する         | 生成しない                                | 変更しない                                |
| `exec claim`                    | 生成しない       | scaffold 生成する                         | `claim` を記録する                        |
| `exec run --task`               | なければ生成する | scaffold 生成し、終了コードで status 更新 | 変更しない                                |
| `exec run --task --track-state` | なければ生成する | scaffold 生成し、終了コードで status 更新 | `claim` / `complete` / `block` を記録する |
| `exec run --plan`               | 既存 plan を使う | plan 名から導出する                       | 変更しない                                |
| `exec build`                    | 生成しない       | 生成しない                                | 変更しない                                |

`exec build` は state、Ready、CPM などの `generated/` 更新に専念し、plan を生成・削除しません。

## 7. planテンプレート

plan は `mode` と `approach` に応じたテンプレートから生成します。

| mode     | 代表テンプレート  |
| -------- | ----------------- |
| `edit`   | `xep-template.md` |
| `review` | `xrp-template.md` |

`approach` が指定されている場合は、`xep-fully-guided-template.md`、`xep-recipe-guided-template.md`、`xep-freeform-template.md`、`xep-rulebook-maintenance-template.md` のような approach 別テンプレートを優先します。存在しない場合は標準テンプレートにフォールバックします。

参考資料の扱いは [specdojo-reference-materials-guide.md](specdojo-reference-materials-guide.md) を参照します。

## 8. resultテンプレート

result は plan と対になる実行記録です。`claim` または `exec run` が scaffold 生成します。

| mode     | 代表テンプレート  |
| -------- | ----------------- |
| `edit`   | `xer-template.md` |
| `review` | `xrr-template.md` |

既に result が存在する場合は上書きせず、既存ファイルを使います。エージェントや人は result に実行内容、検証結果、残課題を記録します。

## 9. アーカイブ

完了後の plan は `exec/plans/done/` へ移動できます。

```bash
specdojo exec archive --project <project-id> --task <task-id>
```

| ケース                          | アーカイブ                        |
| ------------------------------- | --------------------------------- |
| `exec complete`                 | 対象 plan を自動移動する          |
| `exec run --track-state` 成功時 | 対象 plan を自動移動する          |
| 軽量実行（状態追跡なし）        | `exec archive` で明示的に移動する |
| `exec run --archive-on-success` | 成功時に移動する                  |

固定名 plan を `done/` へ移動する場合は、UTC タイムスタンプと短い乱数を付けて衝突を避けます。

```text
exec/plans/done/<slug>-<UTC>-<rand>-plan.md
```

不要な plan は `done/` へ移動せず削除してもかまいません。plan は catalog と schedule から再生成でき、result が記録として残るためです。

## 10. 再実行

完了済み task を軽くやり直す場合は、固定名 plan / result を再生成してカレントリポジトリで実行します。

```bash
specdojo exec run --project <project-id> --task <task-id>
```

状態イベントは追加されません。スケジュール進捗へ再度反映したい場合は、`claim`、`run`、`complete` を明示的に実行します。

```bash
specdojo exec claim --project <project-id> --task <task-id> --by <actor> --msg "rerun"
specdojo exec run --project <project-id> --task <task-id>
specdojo exec complete --project <project-id> --task <task-id> --by <actor> --msg "rerun done"
```

## 11. deliverable指定の解決

`--deliverable <local_id>` は成果物カタログ全体から `local_id` を検索します。

| 一致件数 | 挙動                                  |
| -------- | ------------------------------------- |
| 0件      | エラー                                |
| 1件      | その成果物を対象にする                |
| 2件以上  | エラーにし、`local_id` の一意化を促す |

先頭一致や domain の暗黙選択は行いません。`local_id` はプロジェクト全体で一意にします。
