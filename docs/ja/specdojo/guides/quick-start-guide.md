---
specdojo:
  id: quick-start-guide
  type: guide
  status: draft
---

# Quick Start ガイド

Quick Start Guide

SpecDojo CLI の初期設定から始め、目的に応じて schedule、register、routine のいずれかを最短手順で試します。

**対象読者**

- SpecDojo CLI を初めて使い、プロジェクトの作業を登録・実行してみたい開発者、運用者

**この文書で分かること**

- CLI の初期設定と、schedule / register / routine の使い分け
- 各実行経路を最小構成で試す手順

**次に読む文書**

- CLI の全体像と詳しい初期設定は [CLI概要ガイド](cli-overview-guide.md)、各コマンドのオプションは [CLIコマンドリファレンス](../references/command-reference.md) を参照してください。
- 実行経路の詳しい選び方と状態管理は [exec運用ガイド](exec-operation-guide.md) を参照してください。

## 1. CLIを初期設定する

リポジトリのルートで依存パッケージを導入し、SpecDojo の設定ファイルを作成します。

```bash
npm install
specdojo config init
```

`specdojo config init` は `.specdojo/specdojo.config.json` が存在しない場合に雛形を作成し、既存ファイルは上書きしません。作成された設定を開き、対象プロジェクトの ID と各パスを実際のディレクトリ構成に合わせてください。

設定したプロジェクトを確認します。

```bash
specdojo project list
```

以降の例では、対象プロジェクトを `<project-id>` と表記します。`current_project` を設定している場合も、最初は対象を確認しやすいように `--project` を明示します。

## 2. 実行経路を選ぶ

実施したい作業に応じて、次の経路を選びます。

| ユースケース                                         | 選ぶ経路 | 例                                       | 最初に試す章                         |
| ---------------------------------------------------- | -------- | ---------------------------------------- | ------------------------------------ |
| 成果物カタログと依存関係に基づく計画済みの作業       | schedule | 要求、設計、テスト文書を順番に作成する   | `scheduleで計画済みタスクを実行する` |
| プロジェクト進行中に発生した単発の対応               | register | 課題、調査、変更要求を記録して対応する   | `registerで単発の対応を管理する`     |
| 時刻条件で schedule または register の実行を繰り返す | routine  | 日次スイープ、夜間実行、利用制限後の再開 | `routineで定期実行する`              |

`routine` は作業そのものを定義する経路ではなく、schedule または register の実行を時刻条件で起動するトリガー層です。まず委譲先となる schedule または register が動作することを確認してから設定します。

## 3. scheduleで計画済みタスクを実行する

この経路では、成果物カタログ（`dct-<domain>.yaml`）とトラック戦略（`sch-strategy-<track>.yaml`）から Schedule を生成し、依存関係に従ってタスクを実行します。

### 3.1. 成果物カタログを作成する

成果物カタログは「何を、どこに作り、何を満たせば完了か」を定義する `dct-<domain>.yaml` です。`specdojo.config.json` の `catalog_path` を設定してから、次の順に実行します。

```bash
# プロジェクト規模に応じた dct-*.yaml をテンプレートから生成する
specdojo catalog scaffold --project <project-id> --size small

# カタログの構造、ID、依存関係などを検証する
specdojo catalog validate --project <project-id>

# カタログが指す成果物ファイル本体を初回だけ生成する
specdojo catalog generate --project <project-id>

# カタログの Markdown 派生ビューを生成する
specdojo catalog build --project <project-id>
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

`specdojo.config.json` の `schedule_path` 配下に、例えば `sch-strategy-launch.yaml` を作成します。次は `prj-overview` を BA が1回編集する最小例です。`<project-id>` とカタログのパスは実際の値へ置き換えてください。

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
      execution: agent
      mode: edit
      approach: fully-guided
      task_suffix: "010"
      duration_days: 1
      description: 成果物カタログの完了条件と rulebook に従って初稿を作成する。

default_phase_set: first-pass

owner_rules:
  - local_ids:
      - prj-overview
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
specdojo schedule build --project <project-id> --track <track> --force
specdojo exec build --project <project-id>
```

`exec build` により、着手可能なタスクが `generated/ready.json` に出力されます。

`schedule build` は strategy と対象カタログから、実行対象となる `sch-track-<track>.yaml` を生成します。`exec build` はそこから Ready タスク、CPM、タイムラインなどを生成します。

### 3.4. 1タスクを実行する

次のタスクを確認し、claim、実行、完了記録の順に進めます。

```bash
# 次のタスクを確認する（claim はしない）
specdojo exec scheduler --project <project-id> --by <actor> --dry-run

# 確認した task-id を claim する
specdojo exec claim --project <project-id> --task <task-id> --by <actor>

# 実行する
specdojo exec run --project <project-id> --task <task-id>

# 完了を記録する
specdojo exec complete --project <project-id> --by <actor>

# 次の Ready タスクを更新する
specdojo exec build --project <project-id>
```

成果物の変更は作業ツリーに、実行結果は `execution/exec/results/` に記録されます。自動実行や並列実行は [Schedule実行運用ガイド](schedule-operation-guide.md) を参照してください。

## 4. registerで単発の対応を管理する

この経路では、計画外に発生した課題、調査、変更要求などをプロジェクト登録簿へ追加し、完了まで追跡します。

### 4.1. 登録簿を用意して項目を追加する

```bash
specdojo register scaffold --project <project-id>
specdojo register add \
  --project <project-id> \
  --type todo \
  --priority high \
  --title "確認事項に対応する"
```

`register add` の出力に表示された `PJR-XXXX` を、以降の `<pjr-id>` に指定します。

### 4.2. 項目を実行して完了する

```bash
# agent に実行させる
specdojo exec run --project <project-id> --register <pjr-id>

# 結果を確認した後、人が完了を記録する
specdojo register close \
  --project <project-id> \
  --id <pjr-id> \
  --conclusion "対応内容または判断結果"

# 派生ビューを更新する
specdojo register build --project <project-id>
```

`exec run --register` が成功すると項目は `review` になります。agent は項目を完了状態にしないため、人が結果を確認して `register close` を実行します。type の選び方や手動での状態遷移は [登録簿運用ガイド](register-operation-guide.md) を参照してください。

## 5. routineで定期実行する

この経路では、動作確認済みの schedule または register の実行を、`rtn-*.yaml` に定義した間隔で起動します。次の例は、登録簿の open な高優先度 todo を毎日最大3件実行します。

`specdojo.config.json` の `routines_path` 配下に `rtn-daily-register-sweep.yaml` を作成します。

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
specdojo routine validate --project <project-id>
specdojo routine list --project <project-id>
specdojo routine run --project <project-id> --id rtn-daily-register-sweep --dry-run
specdojo routine run --project <project-id> --id rtn-daily-register-sweep
```

継続運用では、cron や CI の scheduled workflow から次のコマンドを定期的に呼び出します。CLI 自体は常駐しません。

```bash
specdojo routine run --project <project-id> --due
```

schedule の自動実行や利用制限後の再開を起動する定義、`interval` と `last_run` の扱いは [routine運用ガイド](routine-operation-guide.md) を参照してください。
