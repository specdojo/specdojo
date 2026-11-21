---
specdojo:
  id: specdojo:schedule-operation-guide
  type: guide
  status: ready
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
exec refresh
  -> ready.json に Ready タスクを出力
exec run --auto [--loop]
  -> Ready タスクを選択
  -> phase 要件と .specdojo/agent-members.yaml から agent を解決
  -> plan / result を生成
  -> claim
  -> task worktree を作成
  -> exec branch に checkpoint commit
  -> agent command を実行
  -> 成功: result と成果物を commit / merge commit 1件で統合 / complete
  -> 失敗: result を blocked に更新 / block / worktree を保持
exec refresh
  -> 次の Ready タスクを更新
run の終わり
  -> runner が書いたイベントと run の記録を記帳の commit 1件にまとめる
```

`--loop --parallel <n>` では、最初に最大 `n` 件を起動した後、1件の agent が終了するたびに root 側の統合処理を終えて `exec refresh` を実行し、空いた枠へ次の Ready タスクを投入します。他の実行中 task の完了を待たないため、長時間 task と短時間 task が混在しても短時間 task の枠を継続利用できます。`--loop` を指定しない場合は、開始時に選択した最大 `n` 件だけを実行して終了します。

代表コマンド:

```bash
# 1バッチ実行して終了する
specdojo exec run --project <project-id> --auto --parallel 5

# Ready がなくなるまで連続実行する
specdojo exec run --project <project-id> --auto --loop --parallel 5

# FIFO順で実行する
specdojo exec run --project <project-id> --auto --strategy fifo

# 指定した track だけから最大 3 件を選ぶ（実行前の確認）
specdojo exec run --project <project-id> --auto --track data-flow-uc-rewrite --parallel 3 --dry-run

# 同じ track の Ready がなくなるまで連続実行する
specdojo exec run --project <project-id> --auto --track data-flow-uc-rewrite --parallel 3 --loop
```

`--track <track>` は自動選択を 1 つの track に限定します。`sch-track-<track>.yaml`（または `.yml`）の track 名を大文字・小文字を区別して指定します。戦略による順序は維持され、準備や実行に失敗した後、`--loop` で枠を補充するときも、ほかの track は選びません。対象 track に Ready がなければ正常終了し、存在しない track は claim 前にエラーになります。`--track` は単一指定で `--auto` が必須です。省略時は従来どおり全 track から選びます。依存関係や Ready の計算は引き続きプロジェクト全体で行います。

### 1.2. auto実行中の注意点

`--auto` と `--loop` は root の現在ブランチへ task ごとの merge commit を繰り返します（checkpoint commit は exec branch 側に置き、root には plan / result / claim event の複製が統合まで未commitのまま残ります。統合されずに残った複製は `実行記録の記帳` に従って run の終わりに commit します）。同じ作業ツリーで並行して手作業を行う場合は、次の安全ガードに注意します。

| 状況                                                                        | 挙動                                              |
| --------------------------------------------------------------------------- | ------------------------------------------------- |
| root index の stage 済み変更が checkpoint 対象と重複する                    | checkpoint 前に停止する                           |
| root index に stage 済み変更がある                                          | merge 前に対象パスと解除手順を示して停止する      |
| root の未commit変更（runner が置いた複製を除く）と merge 対象パスが重複する | merge 前に停止する                                |
| agent が失敗して `blocked` になる                                           | worktree を保持し、auto の Ready 選択から除外する |
| プロセス中断で `doing` が残る                                               | `exec resume` で再開する                          |

parallel 実行中でも、claim、checkpoint、merge、complete、`exec refresh` は runner が直列化します。agent プロセスだけを並列に走らせ、root 側の状態更新や Ready 再計算は1件ずつ処理します。

review plan の生成前に runner が実行する grade は、再試行状態を `<execution_path>/grade/generated/runs/<grade-run-id>/pipeline/` へ run ごとに保存します。grade の agent や応答の適用が失敗しても共有の `grade/pipeline/` は変えず、別 review の統合確認を妨げません。失敗内容は review plan に渡され、評価結果の鮮度に応じた review 判定に使います。正本の評価結果・完了条件詳細の checkpoint と統合前の変更検出は引き続き行います。

stage 済み変更による停止では、表示された worktree で対象を commit するか、各パスに `git restore --staged -- <path>` を実行してから `exec resume` します。後者はファイルの内容を残して stage だけを解除します。runner は別タスクや手作業の変更を自動で commit・unstage しません。

agent が成功した後、runner は commit / merge / worktree 削除へ進む前に、最新の event log から task state を再構築し、`exec complete` と同じ完了可否を検証します。task が `doing` でない場合や、実行 actor が claim actor と一致しない場合は統合を中止し、成果物を未統合のまま worktree に保持します。これにより、`exec resume --by` などで別 actor を指定しても、Schedule が `doing` のまま成果物だけが統合される状態を防ぎます。

auto 実行と並行して人が作業する場合は、別ブランチの worktree を作成して編集します。

```bash
git worktree add ../specdojo-edit -b <edit-branch>
```

### 1.3. 実行記録の記帳

統合の merge commit に入るのは、その時点までのイベント（claim）と run の記録だけです。統合の後に書く complete、失敗・延期の block、再開の unblock・release・claim、保持した worktree に対応する root の plan / result の複製は、merge commit に入りません。runner は `exec run`（Schedule の `--auto` と `--task --worktree`）、`exec resume`、`exec cycle` の終わりに、これらを `exec(run): record execution events and run records` という記帳の commit 1件にまとめます。成功・失敗・延期・再開のどれで終わっても、作業ツリーに実行記録を残しません。

| 記帳の commit に入るもの        | 条件                                                                                      |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| `exec/events/*.json`            | `by` が `.specdojo/agent-members.yaml` の agent（runner が書いたイベント）                |
| `runs/schedule/<task-id>/` 配下 | 上のイベントの task の plan・result・evidence・pipeline-state・ログ（退避した試行を含む） |
| `plan-conventions/` 配下        | 上の run の記録を 1 件以上含む場合                                                        |

- 対象は root の未 commit のファイルだけで、前の run で残った runner の記録も次の run の終わりに拾います。
- commit した後に `plan.md`・`result.md`・`evidence.json` がそろわない run（setup や executor の起動前に止まり plan だけを残した run など）は記帳せず、作業ツリーに残してディレクトリと次の操作を標準エラーに出力します。commit すると `exec validate --records-only` が欠落で失敗するためです。run を再開して記録をそろえるか、executor の起動前に止まった run ならディレクトリを消します。result.md を外して再試行するときも、HEAD に result.md がない run は丸ごと外します。
- 人が `exec claim`・`complete`・`block`・`release` などで書いたイベント（`by` が agent でないもの）と、human タスクの run の記録は、従来どおり記帳する人が commit します。
- commit は統合と同じ scheduler lock で直列化し、index.lock の競合は解放を待って再試行します（待ち時間は [exec 設定ガイド](exec-config-guide.md) の `run.git_index_lock_wait_seconds`）。pre-commit hook（整形・markdownlint・実行記録の認証情報検査）は通常どおり実行し、result.md の記法違反で拒否された場合は result.md を外して再試行します。
- それでも commit できない場合、run の終了コードは変えず、残ったファイルと次の操作を標準エラーに出力します。原因を直して commit するか、次の `exec run` / `exec resume` で記帳をやり直します。
- 保持した worktree を後で統合するとき、記帳済みの plan / result と exec branch 側で更新した同じファイルが競合した場合は、その task の run の記録に限って exec branch 側（最新の記録）で解決します。

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
specdojo exec refresh --project <project-id>

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
specdojo exec refresh --project <project-id>
```

`exec complete` は `--task` を省略できます。`--by` で指定した actor の `doing` タスクが1件だけの場合は、そのタスクを完了対象として解決します。対象が0件の場合はエラー、複数件の場合は曖昧性を避けるため `--task <task-id>` の指定を要求します。

worktree 隔離を人が段階確認しながら実行する場合は [exec worktree運用ガイド](exec-worktree-guide.md) を参照します。

### 2.2. planを確認してから実行する

plan を先に生成して内容を確認・編集してから実行できます。

```bash
specdojo exec plan --project <project-id> --task <task-id>
specdojo exec run --project <project-id> --plan <execution-path>/runs/schedule/<task-id>/<run-id>/plan.md
```

schedule のタスクから plan を生成するときは、Prettier による整形・ファイルへの書き込みより前に、phase の `description` を展開した plan 全体を markdownlint で検査します。箇条書きの前に空行がない場合（MD032）などは、タスク ID・plan のパス・生成内容の行番号・規則名を表示して停止し、既存の plan は上書きしません。表示する行番号は strategy YAML ではなく、整形前の plan に対する番号です。strategy の説明を修正し、`schedule build --track <track> --force` でトラックを更新してから plan を再生成してください。

検査には利用リポジトリの markdownlint を優先し、見つからなければ SpecDojo 側のインストールを使います。どちらにもない場合は生成を停止するため、利用リポジトリで `npm install --save-dev markdownlint-cli` を実行してください。規則はリポジトリ直下の `.markdownlint.jsonc` / `.markdownlint.json` / `.markdownlint.yaml` / `.markdownlint.yml`（この順で最初にあるもの）と、上位ディレクトリを含む `.markdownlintrc` を読み、`extends` も解決します。設定がない場合は SpecDojo の標準規則を使います。CLI2 固有の設定や hook の独自ルールはこの検査の対象外です。生成履歴が `.markdownlintignore` に含まれていても、生成時の検査は行います。

同じ検査は `exec run --auto` の plan 生成でも働き、`exec run --auto --dry-run` でも claim・checkpoint commit・agent 起動より前に Markdown の違反を検出できます。`exec run --task <task-id> --dry-run` のように plan を生成しない経路では検査しないため、事前確認には `exec plan --task <task-id>` を使ってください。

schedule に無い成果物を catalog から直接 plan 化する場合は `--deliverable <local_id>` を使います。

```bash
specdojo exec plan --project <project-id> --deliverable <local_id>
```

plan / result の命名、再実行、アーカイブは [plan/resultライフサイクルガイド](plan-result-lifecycle-guide.md) を参照します。
