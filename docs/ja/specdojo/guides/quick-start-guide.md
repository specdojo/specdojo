---
specdojo:
  id: quick-start-guide
  type: guide
  status: draft
---

# Quick Start ガイド

Quick Start Guide

SpecDojo CLI の初期設定から始め、register で課題と判断を整理し、成果物カタログ、schedule、routine へ展開する基本フローを最短手順で試します。

**対象読者**

- SpecDojo CLI を初めて使い、プロジェクトの作業を登録・実行してみたい開発者、運用者

**この文書で分かること**

- CLI の初期設定と、register / schedule / routine の使い分け
- issue / decision / todo から成果物カタログと Schedule へ展開する手順

**次に読む文書**

- register のtypeと状態遷移は [登録簿運用ガイド](register-operation-guide.md) を参照してください。
- Scheduleの自動・手動実行は [Schedule実行運用ガイド](schedule-operation-guide.md)、agent設定は [exec設定ガイド](exec-config-guide.md) を参照してください。

各コマンドには、`npm run orch:sonnet` で起動するオーケストレーター（`specdojo-orchestrator`）へチャットで指示する場合の文言を `# チャット:` として併記します。オーケストレーターは指示を対応する `specdojo` サブコマンドへ変換し、状態を変える操作は実行前に内容を提示して承認を求めます（[オーケストレーター運用ガイド](orchestrator-operation-guide.md)）。`<project-id>` などのプレースホルダは実際の値に読み替えてください。

## 1. CLIを初期設定する

リポジトリのルートで依存パッケージを導入し、SpecDojo の設定ファイルを作成します。

```bash
npm install
# チャット:「<project-id> の SpecDojo 設定を初期化して」
specdojo config init
```

`specdojo config init` は `.specdojo/specdojo.config.json` が存在しない場合に雛形を作成し、既存ファイルは上書きしません。作成された設定を開き、対象プロジェクトの ID と各パスを実際のディレクトリ構成に合わせてください。

設定したプロジェクトを確認します。

```bash
# チャット:「設定済みのプロジェクト一覧を見せて」
specdojo project list
```

以降の例では、対象プロジェクトを `<project-id>` と表記します。`current_project` を設定している場合も、最初は対象を確認しやすいように `--project` を明示します。

このガイドの基本手順は、provider 未設定でも完了できるように人が作業する経路を使います。agent に実行させる箇所は、`pm-members.yaml` と provider を [exec設定ガイド](exec-config-guide.md) に従って設定した後に試してください。

## 2. registerで課題と判断を整理する

プロジェクトの開始時点では、解決すべき問題、判断が必要な事項、実施する作業が混在しています。まず register に個票として記録し、issue → decision → todo の順に具体化します。

```text
issue（何が問題か）
  -> decision（何を対象とするか）
  -> todo（成果物カタログを作成する）
  -> dct-<domain>.yaml
  -> schedule
```

### 2.1. 登録簿を用意する

`.specdojo/specdojo.config.json` の `project_register_path` を設定し、登録簿を初期生成します。

```bash
# チャット:「<project-id> の登録簿を用意して」
specdojo register scaffold --project <project-id>
```

### 2.2. issue、decision、todoを登録する

次の例では、初期スコープと必要な成果物が未確定な状態から、成果物カタログを作成する作業までを3つの個票で追跡します。コマンドはまとめて示していますが、実運用では issue の調査結果を受けて decision を起票し、決定後に todo を起票します。

```bash
# 1. 解決すべき問題を記録する
# チャット:「issue を起票して。タイトルは『初期スコープと必要成果物が未確定』、個票あり、topic は clarify-initial-scope」
specdojo register add \
  --project <project-id> \
  --type issue \
  --title "初期スコープと必要成果物が未確定" \
  --ticket --topic clarify-initial-scope

# 2. 選択肢と決定を記録する
# チャット:「decision を起票して。タイトルは『初期スコープと対象成果物を決定する』、個票あり、topic は decide-initial-scope」
specdojo register add \
  --project <project-id> \
  --type decision \
  --title "初期スコープと対象成果物を決定する" \
  --ticket --topic decide-initial-scope

# 3. 決定内容を実行可能な作業にする
# チャット:「高優先度の todo を起票して。タイトルは『プロジェクト定義の成果物カタログを作成する』、個票あり、topic は create-project-definition-catalog」
specdojo register add \
  --project <project-id> \
  --type todo \
  --priority high \
  --title "プロジェクト定義の成果物カタログを作成する" \
  --ticket --topic create-project-definition-catalog
```

`register add` の出力に表示された `PJR-XXXX` を控えます。`--ticket` を指定すると、一覧行に加えて、背景、選択肢、完了条件、結論などを記録する type 別の個票が生成されます。成果物カタログを複数ドメインに分ける場合は、原則として `dct-<domain>.yaml` ごとに todo 個票を起票すると、対象と完了条件を追跡しやすくなります。

| type       | 記録する内容                           | 完了状態  | agent実行                                  |
| ---------- | -------------------------------------- | --------- | ------------------------------------------ |
| `issue`    | 発生している問題、影響、原因、対応結果 | `done`    | `exec run --register` で対応できる         |
| `decision` | 判断の背景、選択肢、決定内容、決定理由 | `decided` | 対象外。人が判断して `register close` する |
| `todo`     | 実施内容、完了条件、作業結果           | `done`    | `exec run --register` で対応できる         |

### 2.3. 判断を確定してカタログ作成へ進む

issue に人が着手し、個票へ問題、影響、原因、対応方針を記入して完了させます。

```bash
# チャット:「issue <issue-id> に着手して」
specdojo register start --project <project-id> --id <issue-id>

# issue 個票を編集して調査結果を記録する

# チャット:「issue <issue-id> を『問題、影響、対応方針を整理』で完了して」
specdojo register close \
  --project <project-id> \
  --id <issue-id> \
  --conclusion "問題、影響、対応方針を整理"
```

issue の結論を基に、decision 個票へ選択肢、決定内容、理由を記入します。decision は agent の実行対象ではないため、人が判断して完了させます。

```bash
# チャット:「decision <decision-id> に着手して」
specdojo register start --project <project-id> --id <decision-id>

# decision 個票を編集して判断内容を記録する

# チャット:「decision <decision-id> を『採用するスコープと成果物を決定』で完了して」
specdojo register close \
  --project <project-id> \
  --id <decision-id> \
  --conclusion "採用するスコープと成果物を決定"
```

agent 設定が完了している場合、`issue` や `todo` は次のコマンドでも実行できます。成功後は `review` になるため、人が結果を確認して `register close` します。

```bash
# チャット:「issue または todo <issue-or-todo-id> を agent に実行させて」
specdojo exec run --project <project-id> --register <issue-or-todo-id>
```

個票内の `_TODO_` を解消してから `register close` すると、個票の文書状態も `ready` になります。基本手順では、成果物カタログ作成の todo を `open` のまま残し、次章で `dct-<domain>.yaml` を作成・検証した後に完了させます。登録簿は立ち上げ時の課題・判断・作業履歴、成果物カタログは合意後の管理対象成果物の正本です。同じ計画済み作業を register と schedule の両方で継続管理しません。

## 3. 成果物カタログからscheduleへ展開する

この経路では、成果物カタログ（`dct-<domain>.yaml`）とトラック戦略（`sch-strategy-<track>.yaml`）から Schedule を生成し、依存関係に従ってタスクを実行します。

### 3.1. 成果物カタログを作成する

成果物カタログは「何を、どこに作り、何を満たせば完了か」を定義する `dct-<domain>.yaml` です。`.specdojo/specdojo.config.json` の `catalog_path` を設定してから、次の順に実行します。

```bash
# プロジェクト規模に応じた dct-*.yaml をテンプレートから生成する
# チャット:「<project-id> の成果物カタログを small サイズで作成して」
specdojo catalog scaffold --project <project-id> --size small

# カタログの構造、ID、依存関係などを検証する
# チャット:「成果物カタログを検証して」
specdojo catalog validate --project <project-id>

# カタログが指す成果物ファイル本体を初回だけ生成する
# チャット:「カタログが指す成果物ファイルを一括生成して」
specdojo catalog generate --project <project-id>

# カタログの Markdown 派生ビューを生成する
# チャット:「カタログの派生ビューをビルドして」
specdojo catalog build --project <project-id>

# dct-project-definition.yaml の作成 todo を完了する
# チャット:「todo <catalog-todo-id> を『対象成果物を dct-project-definition.yaml に定義し、検証を完了』で完了して」
specdojo register close \
  --project <project-id> \
  --id <catalog-todo-id> \
  --conclusion "対象成果物を dct-project-definition.yaml に定義し、検証を完了"
```

各コマンドの役割は次のとおりです。

| コマンド           | 作成・確認するもの                               | 再実行時の扱い                                                    |
| ------------------ | ------------------------------------------------ | ----------------------------------------------------------------- |
| `catalog scaffold` | 規模別テンプレートから `dct-*.yaml` を作成する   | 既存ファイルは上書きしない。作り直す場合だけ `--force` を指定する |
| `catalog validate` | カタログの構造、ID、依存関係を検証する           | カタログを変更するたびに実行する                                  |
| `catalog generate` | カタログの `path` が指す成果物ファイル本体を作る | 既存成果物は上書きしない。通常は初期作成時に1回実行する           |
| `catalog build`    | `generated/dct-*.md` のカタログ派生ビューを作る  | 正本の `dct-*.yaml` を変更した後に再実行する                      |

`--size` には `small` / `medium` / `large` を指定します。`catalog scaffold` 後は、生成された全成果物をそのまま採用するのではなく、プロジェクトのスコープに合わせて `dct-*.yaml` の成果物、依存関係、完了条件を確認してください。

### 3.2. トラック戦略を作成する

`sch-strategy-<track>.yaml` は、成果物カタログを実行タスクへ展開するための生成入力です。成果物カタログが WHAT / DONE を持つのに対し、strategy は対象カタログ、作業フェーズ、担当ロールを定義します。`schedule build` が生成する `sch-track-<track>.yaml` とは異なり、strategy はプロジェクトに合わせて人が作成・編集します。

`catalog generate` で作成した `pm-members.yaml` の `members` に、タスクを実行する人を登録します。次の例では `<actor>` が BA ロールを担当します。

```yaml
members:
  - nickname: <actor>
    display_name: Quick Start Operator
    email: null
    roles: [BA]
    type: human
```

`.specdojo/specdojo.config.json` の `schedule_path` 配下に、例えば `sch-strategy-launch.yaml` を作成します。次は small の `dct-project-definition.yaml` に含まれる3成果物を、依存順に BA が1回ずつ作成・確認する例です。最初の Ready タスクは `prj-overview` になります。`<project-id>` とカタログのパスは実際の値へ置き換えてください。この strategy はコマンドで生成できませんが、オーケストレーターに「launch トラックの sch-strategy-launch.yaml を作って。対象カタログは dct-project-definition、first-pass で BA が各成果物を1回ずつ作成・確認する構成にして」と伝えると、この雛形をドラフトできます。

```yaml
kind: strategy
id: <project-id>:sch-strategy-launch
type: project
status: ready
title: スケジュール戦略（launch）
rulebook: sch-rulebook
track: launch

scope:
  catalogs:
    - id: <project-id>:dct-project-definition
      path: /docs/ja/projects/<project-id>/010-deliverables-catalog/dct-project-definition.yaml
  include_kinds:
    - work

phase_sets:
  first-pass:
    - id: draft
      name: 初稿作成
      execution: human
      mode: edit
      approach: finalize
      task_suffix: "010"
      duration_days: 1
      description: 成果物カタログの完了条件と rulebook に従って成果物を作成・確認する。

default_phase_set: first-pass

owner_rules:
  - local_ids:
      - prj-overview
      - prj-scope
      - prj-success-criteria-and-acceptance-criteria
    owner: BA
```

主要フィールドの意味は次のとおりです。

| フィールド            | 意味                                                                        |
| --------------------- | --------------------------------------------------------------------------- |
| `track`               | トラックID。ファイル名の `<track>` および `schedule build --track` と揃える |
| `scope.catalogs`      | 対象 `dct-<domain>.yaml` のIDと、`/` から始まるリポジトリルート基準パス     |
| `scope.include_kinds` | カタログからタスクへ展開する成果物種別。通常は `work`                       |
| `phase_sets`          | 各成果物に適用する作業フェーズ、実行方法、タスク接尾辞、所要日数            |
| `default_phase_set`   | 個別指定がない成果物へ適用する既定のフェーズセット                          |
| `owner_rules`         | 成果物の `local_id` と担当ロールの対応                                      |

`owner_rules.owner` は `pm-members.yaml` の `roles` と対応させます。複数フェーズ、反復、レビュー、成果物間のゲートを含む実運用向けの設計は [Schedule設計ガイド](schedule-design-guide.md)、トラックの選び方は [トラック設計ガイド](track-design-guide.md) を参照してください。

### 3.3. Scheduleを生成する

```bash
# チャット:「<track> トラックの schedule を生成して」
specdojo schedule build --project <project-id> --track <track> --force
# チャット:「実行状態と Ready、CPM を生成して」
specdojo exec build --project <project-id>
```

`exec build` により、着手可能なタスクが `generated/ready.json` に出力されます。

`schedule build` は strategy と対象カタログから、実行対象となる `sch-track-<track>.yaml` を生成します。`exec build` はそこから Ready タスク、CPM、タイムラインなどを生成します。

### 3.4. 1タスクを実行する

次のタスクを確認して claim します。`execution: human` のタスクは agent を起動せず、claim 時に確認用resultを生成します。人が成果物とresultを編集してから完了を記録します。

```bash
# 次のタスクを確認する（claim はしない）
# チャット:「次に着手すべきタスクを <actor> で確認して。claim はしないで」
specdojo exec scheduler --project <project-id> --by <actor> --dry-run

# 確認した task-id を claim する
# チャット:「タスク <task-id> を <actor> で claim して」
specdojo exec claim --project <project-id> --task <task-id> --by <actor>

# 成果物と、claim 時に生成された result のチェックリスト・確定判断を編集する

# 完了を記録する
# チャット:「タスク <task-id> を <actor> で完了にして」
specdojo exec complete --project <project-id> --task <task-id> --by <actor>

# 次の Ready タスクを更新する
# チャット:「Ready タスクを更新して」
specdojo exec build --project <project-id>
```

成果物の変更は作業ツリーに、実行結果は `<execution_path>/exec/results/` に記録されます。agent による自動実行や並列実行へ進む場合は、[exec設定ガイド](exec-config-guide.md) で設定してから [Schedule実行運用ガイド](schedule-operation-guide.md) を参照してください。

ここまでで、register による立ち上げ整理から、成果物カタログ、Schedule、1タスクの完了までの Quick Start は終了です。次のroutineは、agent設定後に試す任意の発展手順です。

## 4. routineで定期実行する

この経路では、動作確認済みの schedule または register のagent実行を、`rtn-*.yaml` に定義した間隔で起動します。routine は任意の発展手順です。先に [exec設定ガイド](exec-config-guide.md) に従ってagentを設定し、次のような open かつ高優先度のtodoを用意します。

```bash
# チャット:「高優先度の todo『日次確認事項に対応する』を起票して」
specdojo register add \
  --project <project-id> \
  --type todo \
  --priority high \
  --title "日次確認事項に対応する"
```

次のroutine例は、このようなtodoを毎日最大3件実行します。

`.specdojo/specdojo.config.json` の `routines_path` 配下に `rtn-daily-register-sweep.yaml` を作成します。

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

定義を検証し、実行対象を確認してから1回実行します。

```bash
# チャット:「ルーチン定義を検証して」
specdojo routine validate --project <project-id>
# チャット:「ルーチン一覧を見せて」
specdojo routine list --project <project-id>
# チャット:「rtn-daily-register-sweep を dry-run で確認して」
specdojo routine run --project <project-id> --id rtn-daily-register-sweep --dry-run
# チャット:「rtn-daily-register-sweep を実行して」
specdojo routine run --project <project-id> --id rtn-daily-register-sweep
```

継続運用では、cron や CI の scheduled workflow から次のコマンドを定期的に呼び出します。CLI 自体は常駐しません。

```bash
# チャット:「due なルーチンをまとめて実行して」
specdojo routine run --project <project-id> --due
```

schedule の自動実行や利用制限後の再開を起動する定義、`interval` と `last_run` の扱いは [routine運用ガイド](routine-operation-guide.md) を参照してください。
