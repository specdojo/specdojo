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

| ファイル | 役割                             | 生成タイミング                                                          |
| -------- | -------------------------------- | ----------------------------------------------------------------------- |
| plan     | agent または人に渡す作業指示     | `exec plan` / `exec run`（`execution: human` は `exec build` でも生成） |
| result   | 実行結果、確認結果、残課題の記録 | `exec claim` / `exec run`                                               |

plan と result は git 管理対象の通常ファイルとして扱います。`generated/` のような再生成物ではありません。

plan / result の frontmatter には `targets`（対象文書の doc id リスト）を必須項目として焼き込みます。先頭は対象成果物の project 修飾 doc id（`<project-id>:<local_id>`）、以降は `approach` に応じて変更・確定の対象になる参考資料の doc id です（`bootstrap` / `bootstrap-finalize` は rulebook / recipe / sample / template、`<kind>-maintenance` は対象の 1 種。解決できない参考資料は含めません）。いずれも doc-index（`index lookup`）でパスへ解決できるため、schedule やファイル名の命名規約に依存せず、plan / result 単体から対象文書を機械的に取得できます。

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

| 操作                            | plan                                                     | result                                    | 状態event                                 |
| ------------------------------- | -------------------------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| `exec plan --task`              | 生成する                                                 | 生成しない                                | 変更しない                                |
| `exec plan --deliverable`       | 生成する                                                 | 生成しない                                | 変更しない                                |
| `exec claim`                    | 生成しない                                               | scaffold 生成する                         | `claim` を記録する                        |
| `exec run --task`               | なければ生成する                                         | scaffold 生成し、終了コードで status 更新 | 変更しない                                |
| `exec run --task --track-state` | なければ生成する                                         | scaffold 生成し、終了コードで status 更新 | `claim` / `complete` / `block` を記録する |
| `exec run --plan`               | 既存 plan を使う                                         | plan 名から導出する                       | 変更しない                                |
| `exec build`                    | `execution: human` の Ready タスクの未生成分のみ生成する | 生成しない                                | 変更しない                                |

`exec build` は state、Ready、CPM などの `generated/` 更新に専念し、agent タスクの plan は生成・削除しません。ただし `execution: human` のタスク（finalize など）は `exec run` の対象外で、他に plan を生成する導線がありません。このため build は Ready になった human タスクの plan を、まだ存在しない分だけ生成します（既存 plan は着手中の編集を保護するため上書きしません）。agent タスクの plan は従来どおり `exec plan` / `exec run` でオンデマンド生成します。

## 7. planテンプレート

plan は `execution` / `mode` / `approach` に応じたテンプレートから生成します。

| 条件                                                | 代表テンプレート                           |
| --------------------------------------------------- | ------------------------------------------ |
| `mode: edit`                                        | `xep-template.md`                          |
| `mode: review`                                      | `xrp-template.md`                          |
| `execution: human` + `approach: finalize`           | `xep-human-finalize-template.md`           |
| `execution: human` + `approach: bootstrap-finalize` | `xep-human-bootstrap-finalize-template.md` |
| `execution: human`（`approach` なし）               | `xep-human-template.md`                    |

`execution: human` のタスクは最優先で human 用テンプレートを使い、agent の実行プロトコル（異常終了・終了コード・runner への申し送り）を持ちません。`approach` が指定されていれば `xep-human-<approach>-template.md` を先に探し、無ければ汎用の `xep-human-template.md` へフォールバックします。`finalize` は成果物のみの確定（done_criteria の確認チェックリストと、frontmatter の `status` を `ready` に更新する確定手順）、`bootstrap-finalize` は bootstrap と対になる確定で、成果物に加えて参考資料（rulebook / recipe / sample / template）の確認と `ready` 昇格を含みます。あわせて共通規約も human 用の `xep-human-conventions-template.md` を注入し、確定対象の `status` を `ready` に昇格させることを完了条件として明示します。

`execution: human` でない場合、`approach` が指定されていれば `xep-fully-guided-template.md`、`xep-recipe-guided-template.md`、`xep-freeform-template.md`、`xep-rulebook-maintenance-template.md` のような approach 別テンプレートを優先します。該当テンプレートが存在しない場合は標準テンプレートにフォールバックします。

参考資料の扱いは [specdojo-reference-materials-guide.md](specdojo-reference-materials-guide.md) を参照します。

## 8. resultテンプレート

result は plan と対になる実行記録です。`claim` または `exec run` が scaffold 生成します。

| 条件                                          | 代表テンプレート                           |
| --------------------------------------------- | ------------------------------------------ |
| `mode: edit`                                  | `xer-template.md`                          |
| `mode: review`                                | `xrr-template.md`                          |
| `mode: edit` + `approach: finalize`           | `xer-human-finalize-template.md`           |
| `mode: edit` + `approach: bootstrap-finalize` | `xer-human-bootstrap-finalize-template.md` |

review の result には、scaffold 時に catalog から観点別セクション（RVP）を焼き込みます。同様に `finalize` / `bootstrap-finalize` の result には、done_criteria の確認チェックリスト（roles / viewpoint 注記付き）と確定対象（`status` を `ready` へ昇格する対象）のチェックリストを焼き込みます。plan は「何を確認するか」の指示、result は「何を確認して確定したか」の記録という分担で、チェックの記録は result 側に残します。plan は完了後にアーカイブ・再生成される一時物ですが、result は review などから参照される恒久記録だからです。

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
