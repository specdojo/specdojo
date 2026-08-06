---
specdojo:
  id: specdojo:plan-result-lifecycle-guide
  type: guide
  status: ready
---

# plan/resultライフサイクルガイド

Plan and Result Lifecycle Guide

`exec plan` / `exec run` / `exec claim` が扱う plan と result の生成、命名、再実行、アーカイブを説明します。exec の実行手順は [exec運用ガイド](exec-operation-guide.md) を参照します。

**対象読者**

- exec plan と result の生成・保管・再実行を運用または保守する開発者、実行管理者

**この文書で分かること**

- plan・result の役割、配置、命名、生成ルール、テンプレート、アーカイブ、再実行時の扱い

**次に読む文書**

- 実行手順は [exec運用ガイド](exec-operation-guide.md)、plan が参照する資料の使い分けは [実践の型活用ガイド](kata-guide.md) を参照してください。

## 1. planとresultの基本

plan と result が持つ役割と、それぞれの配置場所を示します。

### 1.1. planとresultの役割

| ファイル | 役割                                               | 生成タイミング            |
| -------- | -------------------------------------------------- | ------------------------- |
| plan     | agent に渡す作業指示                               | `exec plan` / `exec run`  |
| result   | 実行結果の記録。human では作業指示と確認記録の正本 | `exec claim` / `exec run` |

plan と result は git 管理対象の通常ファイルとして扱います。`generated/` のような再生成物ではありません。

plan / result の frontmatter には `targets`（対象文書の doc id リスト）を必須項目として焼き込みます。通常タスクの先頭は対象成果物の project 修飾 doc id（`<project-id>:<local_id>`）、以降は `approach` に応じて変更・確定の対象になる実践の型の doc id です（`bootstrap` / `bootstrap-finalize` は rulebook / recipe / sample / template、`<kind>-maintenance` は対象の 1 種。解決できない実践の型は含めません）。`cross-deliverable-dedup` では schedule の `target_local_ids` に対応する複数成果物だけを列挙し、実践の型は変更対象に含めません。いずれも doc-index（`index lookup`）でパスへ解決できます。agent は plan、human は result を正本にするため、schedule やファイル名の命名規約に依存せず対象文書を機械的に取得できます。

### 1.2. 配置

| 種別          | 配置                                |
| ------------- | ----------------------------------- |
| plan          | `<execution_path>/exec/plans/`      |
| 完了後の plan | `<execution_path>/exec/plans/done/` |
| result        | `<execution_path>/exec/results/`    |

result は完了記録であり、review などから参照されるため `done/` へ移動しません。

## 2. 命名規則

task identity の有無によるファイル名の決め方と、対象成果物の解決方法を示します。

### 2.1. task identityありの命名

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

### 2.2. task identityなしの命名

`--deliverable <local_id>` や ad-hoc 実行では、task ID がないためユニーク名を使います。

```text
exec/plans/<stem>-plan.md
exec/results/<stem>-result.md
```

`<stem>` は plan と result の連結キーです。同じ plan から実行する result は同じ `<stem>` を使います。

### 2.3. stemの決定順序

`<stem>` は次の優先順位で決まります。

1. `--out <path>` または `--plan <path>` を指定した場合は、そのファイル名から導出します。
2. `--task <task-id>` がある場合は、`<stem> = <task-id>` とします。
3. task identity がない場合は、`<slug>-<UTC>-<rand>` のユニーク名を採番します。

これにより、task 実行は固定名で扱い、schedule 非依存の実行は実行ごとの証跡を残せます。

### 2.4. deliverable指定の解決

`--deliverable <local_id>` は成果物カタログ全体から `local_id` を検索します。

| 一致件数 | 挙動                                  |
| -------- | ------------------------------------- |
| 0件      | エラー                                |
| 1件      | その成果物を対象にする                |
| 2件以上  | エラーにし、`local_id` の一意化を促す |

先頭一致や domain の暗黙選択は行いません。`local_id` はプロジェクト全体で一意にします。

## 3. 生成とテンプレート

どの操作が plan / result を生成するか、`mode` / `approach` に応じたテンプレートの選び方を示します。

### 3.1. 生成ルール

| 操作                            | plan             | result                                    | 状態event                                 |
| ------------------------------- | ---------------- | ----------------------------------------- | ----------------------------------------- |
| `exec plan --task`              | 生成する         | 生成しない                                | 変更しない                                |
| `exec plan --deliverable`       | 生成する         | 生成しない                                | 変更しない                                |
| `exec claim`                    | 生成しない       | scaffold 生成する                         | `claim` を記録する                        |
| `exec run --task`               | なければ生成する | scaffold 生成し、終了コードで status 更新 | 変更しない                                |
| `exec run --task --track-state` | なければ生成する | scaffold 生成し、終了コードで status 更新 | `claim` / `complete` / `block` を記録する |
| `exec reopen`                   | 変更しない       | 変更しない                                | `reopen` を記録する                       |
| `exec run --plan`               | 既存 plan を使う | plan 名から導出する                       | 変更しない                                |
| `exec build`                    | 生成しない       | 生成しない                                | 変更しない                                |

`exec build` は state、Ready、CPM などの `generated/` 更新に専念し、plan は生成・削除しません。agent タスクの plan は `exec plan` / `exec run` でオンデマンド生成します。`execution: human` のタスクは plan を持たず、`exec claim` が生成する result を使います。

### 3.2. planテンプレート

plan は `mode` / `approach` に応じたテンプレートから生成します。
plan の構造と生成規則は schema・本ガイド・各テンプレートを正本とするため、生成する Frontmatter の `rulebook` は `none` とします。

| 条件                  | 代表テンプレート             |
| --------------------- | ---------------------------- |
| `mode: edit`          | `xep-template.md`            |
| `mode: review`        | `xrp-template.md`            |
| `approach` が指定済み | `xep-<approach>-template.md` |

`execution: human` のタスクに `exec plan` を実行するとエラーになります。human の確定手順は [Human Finalize 実行レシピ](../recipes/exec-human-finalize-recipe.md)、共通規約は [Human Finalize 実行標準](../standards/exec-human-finalize-standard.md)を正本とし、human result から参照します。

`approach` が指定されていれば `xep-fully-guided-template.md`、`xep-recipe-guided-template.md`、`xep-freeform-template.md`、`xep-retrofit-template.md`、`xep-rulebook-maintenance-template.md` のような approach 別テンプレートを優先します。該当テンプレートが存在しない場合は標準テンプレートにフォールバックします。

`approach: retrofit` では、対象成果物の DCT エントリに宣言された `evidence_refs` を edit / review plan の「実装エビデンス」へ展開します。`evidence_refs` がない場合は plan 生成をエラーにします。実装エビデンスは調査入力であり、frontmatter の `targets` には追加しません。実行者は実際に参照したパス、抽出した現在動作、成果物との一致・乖離、未確認範囲を result に記録します。

実践の型の扱いは [実践の型活用ガイド](kata-guide.md) を参照します。

### 3.3. resultテンプレート

result は実行記録です。agent では plan と対になり、human では作業指示も兼ねます。`claim` または `exec run` が scaffold 生成します。

| 条件                                          | 代表テンプレート                           |
| --------------------------------------------- | ------------------------------------------ |
| `mode: edit`                                  | `xer-template.md`                          |
| `mode: review`                                | `xrr-template.md`                          |
| `mode: edit` + `approach: finalize`           | `xer-human-finalize-template.md`           |
| `mode: edit` + `approach: bootstrap-finalize` | `xer-human-bootstrap-finalize-template.md` |

review の result には、scaffold 時に catalog から観点別セクション（RVP）を焼き込みます。同様に `finalize` / `bootstrap-finalize` の result には、done_criteria の確認チェックリスト（roles / viewpoint 注記付き）と確定対象（`status` を `ready` へ昇格する対象）のチェックリストを焼き込みます。human result は `execution: human` と `targets` を持ち、`plan_ref` を持ちません。確定手順・確認対象・確認記録・確定判断を result 側へ一元化し、恒久記録として残します。

既に result が存在する場合は上書きせず、既存ファイルを使います。エージェントや人は result に実行内容、検証結果、残課題を記録します。

## 4. アーカイブと再実行

完了済み plan の扱いと、完了済み task をやり直すときの手順を示します。

### 4.1. アーカイブ

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

### 4.2. 再実行

完了済み task を軽くやり直す場合は、固定名 plan / result を再生成してカレントリポジトリで実行します。

```bash
specdojo exec run --project <project-id> --task <task-id>
```

状態イベントは追加されません。完了判定を取り消して Schedule の進捗へ再度反映したい場合は、`reopen`、`claim`、`run`、`complete` を明示的に実行します。

```bash
specdojo exec reopen --project <project-id> --task <task-id> --by <human-actor> --msg "completion criteria unmet"
specdojo exec build --project <project-id>
specdojo exec claim --project <project-id> --task <task-id> --by <actor> --msg "rerun"
specdojo exec run --project <project-id> --task <task-id>
specdojo exec complete --project <project-id> --task <task-id> --by <actor> --msg "rerun done"
```

`reopen` は完了済み plan を `done/` から戻さず、固定名 result の内容も変更しません。次の `exec plan` / `exec run` で新しい固定名 plan を生成し、再 claim 時に既存 result の `status` を `in_progress`、`started_at` と `agent` を新しい試行の値へ更新し、`completed_at` と `block_reason` を除去します。result 本文は前回の記録を引き継ぎ、過去の完了状態は Git 履歴と `complete` / `reopen` event で追跡します。
