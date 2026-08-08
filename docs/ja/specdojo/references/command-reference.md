---
specdojo:
  id: specdojo:command-reference
  type: reference
  status: draft
  supersedes:
    - command-reference-guide
---

# CLIコマンドリファレンス

CLI Command Reference

`specdojo` CLI の主要コマンドを、用途、代表例、主要オプションに絞って説明します。背景や運用手順は各専門ガイドを参照します。

**対象範囲**

- `specdojo` CLI の主要コマンド（config / catalog / deliverable / schedule / register / exec / index / watch / build / routine）

**ここで引けるもの**

- コマンドごとの用途と実行例、全体で共通のオプション、コマンド別の主要オプション

**詳細の参照先**

- CLI 全体の流れは [CLI概要ガイド](../guides/cli-overview-guide.md)、運用上の判断と手順は各コマンド節からリンクした専門ガイドを参照してください。

## 1. 共通オプション

| オプション        | 用途                                               | 主な対象                            |
| ----------------- | -------------------------------------------------- | ----------------------------------- |
| `--project <id>`  | 対象 project を明示する                            | project に紐づくコマンド            |
| `--dry-run`       | 書き込みや実行を行わず予定内容を表示する           | scaffold / build / run / worktree   |
| `--force`         | 既存ファイルの上書きや通常拒否される操作を明示する | scaffold / schedule build / release |
| `--scope <scope>` | build / watch の対象範囲を絞る                     | `build` / `watch`                   |

project の解決順序と設定は [CLI概要ガイド](../guides/cli-overview-guide.md) を参照します。

## 2. config / project

| コマンド       | 用途                              | 例                      |
| -------------- | --------------------------------- | ----------------------- |
| `config init`  | `specdojo.config.json` を作成する | `specdojo config init`  |
| `project list` | 登録済み project を表示する       | `specdojo project list` |

`current_project` を設定しておくと、多くのコマンドで `--project` を省略できます。

## 3. catalog / deliverable

`catalog` は成果物カタログ（`dct-*.yaml`）を扱います。

| コマンド           | 用途                                     | 例                                             |
| ------------------ | ---------------------------------------- | ---------------------------------------------- |
| `catalog scaffold` | テンプレートから `dct-*.yaml` を生成する | `specdojo catalog scaffold --project prj-0001` |
| `catalog where`    | catalog 関連パスを表示する               | `specdojo catalog where --project prj-0001`    |
| `catalog validate` | `dct-*.yaml` を検証する                  | `specdojo catalog validate --project prj-0001` |
| `catalog build`    | `generated/dct-*.md` を生成する          | `specdojo catalog build --project prj-0001`    |

`deliverable` はカタログが指す、人が編集する成果物ファイル本体を扱います。

| コマンド               | 用途                                            | 例                                                 |
| ---------------------- | ----------------------------------------------- | -------------------------------------------------- |
| `deliverable scaffold` | `dct-*.yaml` が指す成果物ファイル本体を生成する | `specdojo deliverable scaffold --project prj-0001` |

主要オプション:

| オプション           | 用途                                                                      |
| -------------------- | ------------------------------------------------------------------------- |
| `--size <size>`      | `small` / `medium` / `large` の成果物セットを選ぶ                         |
| `--project-id <id>`  | 生成ファイルに埋め込む project ID を上書きする                            |
| `--domain <domain>`  | `catalog scaffold` の対象をtemplateの`domain`で絞る（反復・カンマ区切り） |
| `--var <NAME=value>` | `catalog scaffold` で`_NAME_` placeholderを置換する（反復可能）           |
| `--dct <name>`       | `deliverable scaffold` の対象を特定の `dct-*.yaml` に絞る（後述）         |
| `--force`            | 既存ファイルを上書きする                                                  |

`catalog scaffold`は、`--domain`を省略すると従来どおりすべてのDCT templateを対象にします。指定した場合は、ファイル名ではなくtemplate内の`domain`が一致するものだけを生成します。存在しないdomainを指定した場合は、部分的な生成を行わずエラーで終了します。

`--var`はtemplate内の文字列に含まれる`_NAME_`を置換します。`local_id`、`path`、`depends_on`、名称、概要、注記も同じ値で展開されます。`PROJECT_ID`は予約済みであり、project IDの上書きには`--project-id`を使用します。変数指定後もplaceholderが残る成果物は従来どおり生成対象から除外し、除外した`local_id`を警告します。

```bash
specdojo catalog scaffold \
  --project prj-0001 \
  --size large \
  --domain data-flow,data-model \
  --domain business-model \
  --var TERM=specdojo \
  --var DOMAIN=specdojo
```

`--dct <name>` で対象を特定の `dct-*.yaml` に絞れます。`name` は `dct-` プレフィックスや `.yaml` の有無を問わず、ドメイン名（例: `project-definition`）でも一致します。カンマ区切りまたは複数回指定で複数のカタログを対象にできます。指定名に一致する `dct-*.yaml` がない場合はエラーで終了します。

```bash
specdojo deliverable scaffold --project prj-0001 --dct project-definition
specdojo deliverable scaffold --project prj-0001 --dct dct-project-definition.yaml,dct-project-management.yaml
```

`deliverable scaffold` の生成方針と `specdojo build` に含めない理由は [CLI概要ガイド](../guides/cli-overview-guide.md) の `deliverable scaffold の生成方針`、生成系動詞の使い分けは同ガイドの `生成系動詞の標準`、成果物カタログから Schedule への展開は [Schedule設計ガイド](../guides/schedule-design-guide.md) の `成果物カタログとの責務分担` を参照します。

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

`--track` で指定した `sch-track-<track>.yaml` だけを生成・上書きします。プロジェクト共通の `sch-milestones.yaml` は、同じ `schedule_path` にある全 `sch-strategy-*.yaml` から再構築するため、指定外 track のマイルストーンも保持されます。既存 ID の表示順は維持し、新規 ID は末尾へ追加します。全 strategy のいずれかが不正、project ID が不一致、またはマイルストーン ID が重複している場合は、生成物を書き込まずに停止します。

Schedule設計の詳細は [Schedule設計ガイド](../guides/schedule-design-guide.md) を参照します。

## 5. register

`register` はプロジェクト登録簿（`pjr-index.md`）と派生ビューを扱います。

| コマンド            | 用途                                                   | 例                                                                          |
| ------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------- |
| `register scaffold` | 登録簿を初期生成する                                   | `specdojo register scaffold --project prj-0001`                             |
| `register add`      | issue / todo / question などの項目を追加する           | `specdojo register add --project prj-0001 --type issue --title "確認事項"`  |
| `register build`    | 派生ビューを生成する                                   | `specdojo register build --project prj-0001`                                |
| `register update`   | 登録項目を更新する                                     | `specdojo register update --project prj-0001 --id PJR-001 --field owner=PM` |
| `register start`    | 項目を対応中へ変更する                                 | `specdojo register start --project prj-0001 --id PJR-001`                   |
| `register wait`     | 項目を待ち状態へ変更する                               | `specdojo register wait --project prj-0001 --id PJR-001`                    |
| `register review`   | 項目をレビュー状態へ変更する                           | `specdojo register review --project prj-0001 --id PJR-001`                  |
| `register close`    | 項目を完了にし、個票を `ready` へ昇格する              | `specdojo register close --project prj-0001 --id PJR-001`                   |
| `register reject`   | 項目を却下にし、個票を `deprecated` にする             | `specdojo register reject --project prj-0001 --id PJR-001`                  |
| `register defer`    | 項目を延期にする                                       | `specdojo register defer --project prj-0001 --id PJR-001`                   |
| `register reopen`   | 終了済み項目を再オープンする                           | `specdojo register reopen --project prj-0001 --id PJR-001`                  |
| `register renumber` | 重複・衝突した PJR-ID を未使用の ID へ移す             | `specdojo register renumber --project prj-0001 --id PJR-0137 --to PJR-0140` |
| `register where`    | 統合ブランチ worktree のパスを表示する（読み取り専用） | `specdojo register where --integration --project prj-0001`                  |

`register add` は ID を省略すると自動採番します。ID は乱数部分を持ち、曖昧文字（`I` / `L` / `O` / `U`）を除いた英大文字+数字の 32 文字セットによる 4 桁（例: `PJR-4B7K`）です。旧来の数字4桁 ID とも混在可能です。予約経路では採番の直前に統合 worktree で `git fetch` + `git merge --ff-only` を自動実行して最新化します（fetch 失敗時は既定で警告継続、`--strict-sync` で中断）。`git push` は組み込まず、`register where --integration` が返すパスと素の git を使う npm script（`register:sync-pull` / `register:sync-push`）へ委譲します。`register` 系コマンドはすべて、成功時の通常出力（更新内容・生成パス・警告など）を標準出力へ書き、エラーメッセージは標準エラー出力へ分離します。とくに `register where` は成功時のパスのみを標準出力へ書くため、統合ブランチ worktree 未用意時でも、コマンド置換で解決したパスに `git -C` の不正な引数としてエラー文字列が混入しません。なお、このエラー出力先の統一は `register` 系コマンドに限定した方針で、`catalog` / `schedule` など同種のパターンを持つ他コマンドへの拡張は本項目のスコープ外です。

主要オプション:

| オプション                      | 用途                                                                                              | 対象               |
| ------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------ |
| `--to <PJR-ID>`                 | 移動先の PJR-ID を指定する                                                                        | `renumber`         |
| `--registered <date>`           | 登録日（`YYYY-MM-DD` または `_TODO_`）。省略時は `run.register_date_timezone`（既定 UTC）での当日 | `add`              |
| `--reserve`                     | 統合ブランチ上でも予約経路を強制する（登録行を commit。`--ticket` 併用可）                        | `add`              |
| `--strict-sync`                 | 予約直前の `git fetch` が失敗したら警告継続せず中断する（既定は警告継続）                         | `add`              |
| `--local`                       | 自動ルーティングせず現在ブランチの `pjr-index.md` に追記する（ID 衝突の恐れ）                     | `add`              |
| `--integration`                 | 統合ブランチ worktree のパスを表示する                                                            | `where`            |
| `--integration-branch <name>`   | 統合ブランチ（既定は `run.register_integration_branch`、無ければ `project/<project-id>/develop`） | `add` / `where`    |
| `--integration-worktree <path>` | 統合ブランチ worktree をパスで直接指定する                                                        | `add` / `where`    |
| `--commit-message <text>`       | 予約 commit のメッセージを上書きする                                                              | `add`              |
| `--dry-run`                     | 書き込みを行わず変更対象を表示する                                                                | `renumber` / `add` |

`register add` は登録行に「登録日」列（起票日、`YYYY-MM-DD`）を自動記入します。日付は OS / コンテナの `TZ` 環境変数に依存せず、config の `run.register_date_timezone`（IANA タイムゾーン名、既定 `UTC`）で明示的に解決します。`register close` / `register reject` の「完了日」も同じ基準で導出されます。

登録項目を agent に実行させるには `exec run --register` を使います（`exec` の章を参照）。

`renumber` による ID 重複の復旧手順、`add --reserve` による予約起票の運用、登録の判断、type の選び方、状態遷移、個票分離などの台帳運用は [登録簿運用ガイド](../guides/register-operation-guide.md) を参照します。

## 6. exec

`exec` は schedule に基づいたタスクの実行、状態追跡、plan/result 生成、worktree 隔離実行を扱います。

| コマンド         | 用途                                                                   | 例                                                                                                      |
| ---------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `exec where`     | execution 関連パスを表示する                                           | `specdojo exec where --project prj-0001`                                                                |
| `exec validate`  | schedule と event を検証する                                           | `specdojo exec validate --project prj-0001`                                                             |
| `exec refresh`   | state、Ready、CPM、timeline を再計算する                               | `specdojo exec refresh --project prj-0001`                                                              |
| `exec scheduler` | 次のタスクを自動選択して claim する（`--dry-run` で選択のみ）          | `specdojo exec scheduler --project prj-0001 --by agent-1`                                               |
| `exec claim`     | タスクを `doing` にする                                                | `specdojo exec claim --project prj-0001 --task <task-id> --by agent-1`                                  |
| `exec complete`  | タスクを `done` にする（actor の `doing` が1件なら `--task` 省略可）   | `specdojo exec complete --project prj-0001 --by agent-1`                                                |
| `exec reopen`    | 誤って完了したタスクを `done` から `todo` に戻す                       | `specdojo exec reopen --project prj-0001 --task <task-id> --by indie --msg "completion criteria unmet"` |
| `exec block`     | タスクを `blocked` にする                                              | `specdojo exec block --project prj-0001 --task <task-id> --by agent-1 --msg "waiting"`                  |
| `exec unblock`   | `blocked` を `doing` に戻す                                            | `specdojo exec unblock --project prj-0001 --task <task-id> --by agent-1 --msg "resume"`                 |
| `exec release`   | `doing` / `blocked` を `todo` に戻す                                   | `specdojo exec release --project prj-0001 --task <task-id> --by agent-1`                                |
| `exec cancel`    | `todo` を `cancelled` にする                                           | `specdojo exec cancel --project prj-0001 --task <task-id> --by agent-1 --msg "scope removed"`           |
| `exec note`      | メモイベントを残す                                                     | `specdojo exec note --project prj-0001 --task <task-id> --by agent-1 --msg "memo"`                      |
| `exec link`      | 外部参照イベントを残す                                                 | `specdojo exec link --project prj-0001 --task <task-id> --by agent-1 --ref pr=https://example.com/pr/1` |
| `exec estimate`  | 見積もりイベントを残す                                                 | `specdojo exec estimate --project prj-0001 --task <task-id> --by agent-1 --meta duration_days=1`        |
| `exec run`       | plan を生成してエージェントを実行する                                  | `specdojo exec run --project prj-0001 --task <task-id>`                                                 |
| `exec resume`    | `doing`、または due な利用制限延期 task を既存 worktree で再開する     | `specdojo exec resume --project prj-0001 --due`                                                         |
| `exec cycle`     | 延期 task 再開・状態再計算・`--auto` loop を単一ロック内で順次実行する | `specdojo exec cycle --project prj-0001 --loop`                                                         |
| `exec status`    | 実行状態を表示する                                                     | `specdojo exec status --project prj-0001 --state blocked`                                               |
| `exec scaffold`  | 実行補助設定や provider 設定一式を生成する                             | `specdojo exec scaffold --provider claude`                                                              |
| `exec plan`      | plan だけを生成する                                                    | `specdojo exec plan --project prj-0001 --task <task-id>`                                                |
| `exec archive`   | 完了済み plan を `done/` へ移動する                                    | `specdojo exec archive --project prj-0001 --task <task-id>`                                             |

状態イベントの `--msg` は、イベント種別によって必須・省略可が分かれます。

| コマンド                                               | `--msg` | 省略時に記録される固定メッセージ                                                  |
| ------------------------------------------------------ | ------- | --------------------------------------------------------------------------------- |
| `claim` / `complete` / `release` / `link` / `estimate` | 省略可  | `claim task` / `complete task` / `release task` / `link refs` / `update estimate` |
| `note` / `block` / `unblock` / `reopen` / `cancel`     | 必須    | -（内容・理由・再開根拠をメッセージ自体が表すため）                               |

主要オプション:

| オプション                      | 用途                                                                                                   | 対象                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `--task <task-id>`              | 対象タスクを指定する                                                                                   | 状態遷移系 / `run` / `plan`                      |
| `--by <actor>`                  | 実行 actor / agent の nickname を指定する（手動ターゲットの agent 選択も兼ねる）                       | 状態遷移系 / `run` / `resume` / `worktree agent` |
| `--edit-by <nickname>`          | `--auto` バッチで edit タスクに使う agent nickname                                                     | `run --auto` / `resume`                          |
| `--review-by <nickname>`        | `--auto` バッチで review タスクに使う agent nickname                                                   | `run --auto` / `resume`                          |
| `--strategy <name>`             | 選択戦略を切り替える（`critical-first` 既定 / `fifo`）                                                 | `scheduler` / `run --auto`                       |
| `--auto` / `--loop`             | Ready タスクを自動選択する / Ready がなくなるまで繰り返す                                              | `run`                                            |
| `--parallel <n>`                | 同時に走らせる agent 数の上限を指定する                                                                | `run --auto` / `run --register --worktree`       |
| `--worktree`                    | worktree に隔離して実行する                                                                            | `run --task` / `run --register`                  |
| `--track-state`                 | claim / complete の状態イベントを記録する                                                              | `run --task`                                     |
| `--register <PJR-ID>`           | 登録簿の項目を実行する（空白・カンマ区切りで複数可。既定は in-place、`--worktree` で隔離）             | `run` / `plan`                                   |
| `--register-commit`             | 成功したIDごとに、その実行で生じた変更を1コミットにまとめる（`--worktree` 時は常に commit のため無視） | `run --register`                                 |
| `--on-failure <stop\|continue>` | 途中失敗時に残りのIDを停止するか継続するか（既定は `stop`）                                            | `run --register`                                 |
| `--due`                         | 再開時刻を迎えた利用制限延期 task を対象にする                                                         | `resume`                                         |

agent の指定は roster nickname（`pm-members.yaml`）へ一本化します。手動ターゲット（`--task` / `--register` など）では `--by <nickname>`、`--auto` バッチでは mode 別に `--edit-by` / `--review-by` を使い、バッチ起動は `--auto` に一本化します。解決の優先順位は「単体指定（`--by`）＞ mode 別指定（`--edit-by` / `--review-by`）＞ 自動選択」です。

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

# 成果物を worktree に隔離して実行し、統合ブランチへ merge back する
specdojo exec run --project prj-0001 --register PJR-0012 --worktree

# worktree 隔離のまま複数項目を並列実行する
specdojo exec run --project prj-0001 --register PJR-0012 PJR-0013 --worktree --parallel 2

# Job Definitionから期間ごとのRunを生成して実行する
specdojo exec run --project prj-0001 --job job-weekly-report --input period=2026-W32
```

`--register` は登録簿（`pjr-index.md`）の項目を実行します。実行対象になるのは type が `todo` / `issue` / `change-request` / `question` / `risk` の項目で、`decision` / `note` は対象外です。既定は in-place の直列実行です。`--worktree` を付けると成果物の変更を worktree に隔離し、状態遷移（`start` / `review` / `waiting`）は統合ブランチ側で直列化したうえで、成功時に merge back します。`--parallel <n>` は `--worktree` との併用時のみ指定でき、単独で指定するとエラーになります。

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

`prepare` は root と tracked `package-lock.json` を持つ独立 package で `npm ci` を実行し、task worktree 内に書き込み可能な `node_modules` を準備します。過去の共有シンボリックリンクがある場合は、リンク先を変更せず実体ディレクトリへ置き換えます。install に失敗した場合、agent は起動されず task worktree が保持されます。

詳細な安全条件は [exec worktree運用ガイド](../guides/exec-worktree-guide.md) を参照します。

## 8. index

`index` は frontmatter の `id` とファイルパスのインデックスを扱います。

| コマンド        | 用途                                              | 例                                                     |
| --------------- | ------------------------------------------------- | ------------------------------------------------------ |
| `index build`   | `.specdojo/doc-index.json` を生成する             | `specdojo index build`                                 |
| `index lookup`  | ID からパスを返す                                 | `specdojo index lookup specdojo:prj-overview-rulebook` |
| `index replace` | `[[id]]` を Markdown リンクまたは path に展開する | `specdojo index replace --format path <plan-path>`     |

`exec run` は agent に plan を渡す直前に `index replace --format path --missing keep` 相当の処理を行います。

## 9. watch / build

| コマンド | 用途                                        | 例                                               |
| -------- | ------------------------------------------- | ------------------------------------------------ |
| `watch`  | ファイル変更を監視して対象 build を実行する | `specdojo watch --project prj-0001 --scope exec` |
| `build`  | 全生成物または指定 scope を一括再生成する   | `specdojo build --project prj-0001 --scope all`  |

`--scope` は `exec`、`catalog`、`register`、`index`、`all` を指定します。

## 10. job

`job`は再利用可能な`job-*.yaml`と、その定義からmaterializeされたJob Runを扱います。実行自体は`exec run --job`を使います。

| コマンド       | 用途                                       | 例                                         |
| -------------- | ------------------------------------------ | ------------------------------------------ |
| `job list`     | Job Definitionと最終Runを表示する          | `specdojo job list --project prj-0001`     |
| `job validate` | `job-*.yaml`を検証する                     | `specdojo job validate --project prj-0001` |
| `job where`    | Job Definition・Run・stateのパスを表示する | `specdojo job where --project prj-0001`    |

`exec run --job`の`--input <key=value...>`はJob入力を指定し、`--scheduled-at`はroutineやCIが論理実行枠を渡す場合に使います。同じidempotency keyの完了済みRunは再実行せず、失敗済みRunは同じRun IDの次attemptとして実行します。Job Runは現在in-place実行に対応し、`--worktree`との併用は未対応です。

## 11. routine

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

`action.kind` は `register` / `exec-auto` / `exec-resume` / `exec-cycle` / `job` の5種類です。`exec-cycle` は延期 task の再開・状態再計算・`--auto` loop を単一ロック内で順次実行します。定義ファイルの配置、`interval`または`trigger.cron`の書式、due判定、kindごとの動作は [routine運用ガイド](../guides/routine-operation-guide.md) を参照します。

```bash
# due な routine をまとめて実行する（cron / CI から呼ぶ想定）
specdojo routine run --project prj-0001 --due

# 特定の routine を due 判定と無関係に即時実行する
specdojo routine run --project prj-0001 --id rtn-daily-register-sweep

# 実行内容を確認する（実行も last_run 記録もしない）
specdojo routine run --project prj-0001 --due --dry-run
```

schedule / register / job / routine の使い分けの基準は [exec運用ガイド](../guides/exec-operation-guide.md) の `実行経路の使い分け` を参照します。

## 12. 関連ガイド

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
