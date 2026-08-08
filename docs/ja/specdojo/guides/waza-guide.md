---
specdojo:
  id: specdojo:waza-guide
  type: guide
  status: ready
---

# 遂行の技活用ガイド

Waza Guide

`specdojo` CLI の全体像、初期設定、代表的な実行フローを説明します。個別コマンドの詳細は [CLIコマンドリファレンス](../references/command-reference.md) を参照します。

SpecDojo は道場のメタファーとして、`specdojo` CLI のコマンド群を「Waza（遂行の技）」と呼びます。「Waza」は本ガイドで CLI 全体像を説明するための愛称・分類であり、CLI のコマンド名（`specdojo exec run` など）や frontmatter のフィールド名を変更するものではありません。実際のコマンド名・フィールド名は従来どおりです。

**対象読者**

- SpecDojo CLI を導入し、成果物の計画・生成・実行管理を始める利用者

**この文書で分かること**

- CLI の役割、標準ディレクトリ、初期設定、project の解決順序、代表的な実行フロー

**次に読む文書**

- 初期設定から1タスクの完了まで試す場合は [Quick Startガイド](quick-start-guide.md) を参照してください。
- 計画設計は [Schedule設計ガイド](schedule-design-guide.md)、コマンド詳細は [CLIコマンドリファレンス](../references/command-reference.md) を参照してください。

## 1. CLIの役割

`specdojo` は Git リポジトリ内でプロジェクト実行管理を行う CLI です。主に次のファイル群を扱います。

| 対象                       | 代表ファイル               | 主なコマンド   |
| -------------------------- | -------------------------- | -------------- |
| 成果物カタログ             | `dct-*.yaml`               | `catalog`      |
| 成果物ファイル             | `prj-charter.md` など      | `deliverable`  |
| Schedule                   | `sch-*.yaml`               | `schedule`     |
| 実行イベント               | `exec/events/*.json`       | `exec`         |
| 実行生成物                 | `generated/*`              | `exec refresh` |
| プロジェクト登録簿         | `pjr-index.md`             | `register`     |
| 定期実行定義               | `rtn-*.yaml`               | `routine`      |
| ドキュメントIDインデックス | `.specdojo/doc-index.json` | `index`        |

### 1.1. 生成系動詞の標準

生成や実行を伴うコマンドは、出力の性質と副作用に応じて次の動詞を使います。

| 動詞       | 用途                                                         | 再実行と上書きの原則                                         | 代表例                                     |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------ |
| `scaffold` | 人が編集する正本や設定の初期雛形を作る                       | 既存ファイルを既定で保護し、上書きは `--force` で明示する    | `catalog scaffold`、`deliverable scaffold` |
| `build`    | 正本から再現可能な派生物を組み立てる                         | 同じ入力から繰り返し生成でき、派生物の置換を許容する         | `catalog build`、`schedule build`、`build` |
| `refresh`  | イベントやScheduleから変化する実行状態スナップショットを更新 | 実行履歴や正本を変更せず、現在状態を安全に再計算する         | `exec refresh`                             |
| `run`      | タスク、routine、agentなどの処理を実際に実行する             | 状態遷移、外部プロセス起動、成果物編集などの副作用を許容する | `exec run`、`routine run`                  |

`scaffold` と `build` の違いは、生成後のファイルを人が正本として編集するか、入力から再生成できる派生物かです。`refresh` は build 可能な一般成果物ではなく、イベントを反映して時点ごとに変わる実行状態に限定します。`run` はファイル生成そのものではなく、処理の遂行を表します。

## 2. 標準ディレクトリ構成

プロジェクト文書は `docs/ja/projects/<project-id>/` 配下に置きます。代表的な構成は次のとおりです。

```text
repo-root/
├─ .specdojo/
│  └─ specdojo.config.json
├─ docs/
│  └─ ja/
│     ├─ specdojo/
│     │  ├─ guides/
│     │  ├─ rulebooks/
│     │  └─ templates/
│     └─ projects/
│        └─ prj-0001/
│           ├─ 010-deliverables-catalog/
│           │  ├─ dct-index.md
│           │  └─ dct-*.yaml
│           ├─ 030-project-management/
│           ├─ schedule/
│           │  ├─ sch-milestones.yaml
│           │  ├─ sch-defaults.yaml
│           │  ├─ sch-strategy-<track>.yaml
│           │  └─ sch-track-<track>.yaml
│           ├─ routines/
│           │  └─ rtn-*.yaml
│           ├─ jobs/
│           │  └─ job-*.yaml
│           ├─ controls/
│           │  ├─ project-register/
│           │  └─ reviews/
│           └─ execution/
│              ├─ exec/
│              │  ├─ events/
│              │  ├─ plans/
│              │  ├─ results/
│              │  └─ .locks/
│              └─ generated/
└─ tools/
```

実際のパスは `.specdojo/specdojo.config.json` の project 設定で変更できます。ファイル単位の完全なディレクトリ構成は [ディレクトリレイアウトリファレンス](../references/directory-layout-reference.md) を参照してください。

## 3. 初期設定

このリポジトリでは `npm install` 後に root package の `src/` がビルドされ、VS Code 統合ターミナルでは `node_modules/.bin` が `PATH` に追加されます。新しいターミナルを開けば、通常は `specdojo` を直接実行できます。

```bash
npm install
specdojo config init
```

VS Code 統合ターミナル以外では、必要に応じて次のように実行します。

```bash
./node_modules/.bin/specdojo config init
```

## 4. プロジェクト設定

`.specdojo/specdojo.config.json` は複数プロジェクトを扱うためのレジストリです。

```json
{
  "version": 1,
  "current_project": "prj-0001",
  "projects": {
    "prj-0001": {
      "base_path": "docs/ja/projects/prj-0001",
      "catalog_path": "010-deliverables-catalog",
      "schedule_path": "schedule",
      "execution_path": "execution",
      "project_register_path": "controls/project-register",
      "routines_path": "routines",
      "jobs_path": "jobs",
      "members_path": "030-project-management/pm-members.yaml",
      "reviews_path": "controls/reviews",
      "viewpoints_path": "030-project-management/pm-review-viewpoints.yaml",
      "project_context": ["prj-overview"],
      "run": {
        "exec_defaults": ".specdojo/exec-defaults.yaml"
      }
    }
  }
}
```

`base_path` を指定すると、`catalog_path`、`schedule_path`、`execution_path` などを `base_path` からの相対パスとして書けます。`run.exec_defaults` と `run.worktree_base` はリポジトリルート相対のまま扱います。`run.exec_defaults` が指すファイルの中身（エージェント、provider、権限、リトライ）は [exec設定ガイド](exec-config-guide.md) を参照します。

`project_context` は、`depends_on` と独立して成果物の edit / review plan に渡すプロジェクト共通文書の ID リストです。省略時は `["prj-overview"]`、空配列 `[]` は opt-out を表します。project context は plan の参照範囲にだけ作用し、schedule、`based_on`、commit scope は変更しません。

## 5. プロジェクト解決順序

プロジェクトに紐づくコマンドは、次の順序で対象 project を解決します。

1. `--project <id>`
2. `SPECDOJO_PROJECT`
3. `.specdojo/specdojo.config.json` の `current_project`
4. `.specdojo/specdojo.config.json` の `projects` に定義された先頭 project

通常は `current_project` を使います。ブランチや worktree ごとに `.specdojo/specdojo.config.json` を Git 管理すれば、`.env` のコピーは不要です。

## 6. 代表フロー

新規プロジェクトの基本フローは次のとおりです。

```bash
# 1. 設定を作成する
specdojo config init

# 2. 未整理の課題・判断があれば登録簿で整理する
specdojo register scaffold --project prj-0001

# 3. 成果物カタログを作成・検証する
specdojo catalog scaffold --project prj-0001 --size small
specdojo catalog validate --project prj-0001

# 3.1 カタログが指す成果物ファイル本体を一括生成する
specdojo deliverable scaffold --project prj-0001
specdojo catalog build --project prj-0001

# 4. sch-strategy-launch.yaml を用意し、track schedule を生成する
specdojo schedule build --project prj-0001 --track launch --force

# 5. 実行状態、Ready、CPMを生成する
specdojo exec refresh --project prj-0001

# 6. pm-members.yaml と provider 設定を用意して Readyタスクを実行する
specdojo exec run --project prj-0001 --auto --parallel 5
```

全生成物をまとめて更新したい場合は `specdojo build` を使います。

```bash
specdojo build --project prj-0001
```

register から成果物カタログへ移す手順は [Quick Startガイド](quick-start-guide.md)、成果物カタログのどの情報が Schedule のどのタスクになるかは [Schedule設計ガイド](schedule-design-guide.md) の `成果物カタログとの責務分担`、agent の最小設定は [exec設定ガイド](exec-config-guide.md) を参照します。

### 6.1. deliverable scaffold の生成方針

`catalog scaffold` は `--size` で選んだ成果物セットで `dct-*.yaml` を生成し、`deliverable scaffold` はその `dct-*.yaml` を辿って成果物ファイル本体（`prj-charter.md` など）を一括生成します。カタログ自体がサイズ別に生成済みのため、`deliverable scaffold` はプロジェクトのサイズ相当の成果物集合をまとめて材料化します。

成果物ごとの生成方針は次のとおりです。

| 条件                                    | 生成内容                                                                                                                                                                                             |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `local_id` に対応するテンプレートがある | `<local_id>-template.md` / `<local_id>-template.yaml` から生成する。`frontmatter_template` を平坦化し、`_PROJECT_ID_` を実プロジェクトIDへ置換する（`_TODO_` などの記入プレースホルダは残す）        |
| テンプレートがない                      | カタログ情報から埋められる範囲で最小雛形を生成する（`id` / `type` / `status` / `rulebook` / `depends_on` 由来の `based_on` を持つ Frontmatter、`name` の H1、`overview` 本文、記入用の `_TODO_` 行） |
| すでにファイルが存在する                | 上書きしない（`--force` を指定した場合のみ上書きする）                                                                                                                                               |

`deliverable scaffold` は成果物本体を一度だけ材料化し、以後は人手で記入・編集します。そのため、冪等な再生成をまとめる `specdojo build` には含めません（`build` に含めると記入済みの本文を上書きしてしまうため）。プロジェクト初期化時に `catalog scaffold` → `catalog validate` の後で 1 回だけ実行します。

対象を特定のカタログに絞る場合は `--dct <name>` を使います。オプションの詳細は [CLIコマンドリファレンス](../references/command-reference.md) を参照します。

## 7. 定期実行と登録項目の実行

register は立ち上げ時の未整理事項と進行中の計画外事項を扱い、schedule は成果物カタログから展開した計画済み作業を扱います。Jobは入力ごとに新しい反復作業のRunを生成し、routineはこれらを時刻条件で起動します。コマンドの詳細は [CLIコマンドリファレンス](../references/command-reference.md) を、使い分けは [exec運用ガイド](exec-operation-guide.md) の `実行経路の使い分け` を参照します。

| 機能                  | 概要                                                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `routine`             | `rtn-*.yaml` の定義に基づき、時刻条件でタスクを定期実行する。外部スケジューラから `routine run --due` を冪等に呼び出す  |
| `exec run --register` | 登録簿（`pjr-index.md`）の項目を agent に実行させる。状態は register の遷移（in-progress / review / waiting）で追跡する |
| `exec run --job`      | `job-*.yaml`から入力とcheckpointを解決し、一意なJob Runを生成してagentに実行させる                                      |
