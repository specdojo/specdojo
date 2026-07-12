---
specdojo:
  id: specdojo-cli-overview-guide
  type: guide
  status: draft
---

# SpecDojo CLI概要ガイド

SpecDojo CLI Overview Guide

`specdojo` CLI の全体像、初期設定、代表的な実行フローを説明します。個別コマンドの詳細は [specdojo-command-reference-guide.md](specdojo-command-reference-guide.md) を参照します。

## 1. CLIの役割

`specdojo` は Git リポジトリ内でプロジェクト実行管理を行う CLI です。主に次のファイル群を扱います。

| 対象                       | 代表ファイル               | 主なコマンド |
| -------------------------- | -------------------------- | ------------ |
| 成果物カタログ             | `dct-*.yaml`               | `catalog`    |
| Schedule                   | `sch-*.yaml`               | `schedule`   |
| 実行イベント               | `exec/events/*.json`       | `exec`       |
| 実行生成物                 | `generated/*`              | `exec build` |
| プロジェクト登録簿         | `pjr-index.md`             | `register`   |
| 定期実行定義               | `rtn-*.yaml`               | `routine`    |
| ドキュメントIDインデックス | `.specdojo/doc-index.json` | `index`      |

## 2. 標準ディレクトリ構成

プロジェクト文書は `docs/ja/projects/<project-id>/` 配下に置きます。代表的な構成は次のとおりです。

```text
repo-root/
├─ specdojo.config.json
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
│           │  ├─ schedule/
│           │  │  ├─ sch-milestones.yaml
│           │  │  ├─ sch-defaults.yaml
│           │  │  ├─ sch-strategy-<track>.yaml
│           │  │  └─ sch-track-<track>.yaml
│           │  ├─ routines/
│           │  │  └─ rtn-*.yaml
│           │  └─ controls/
│           │     ├─ project-register/
│           │     └─ reviews/
│           └─ 070-execution/
│              ├─ exec/
│              │  ├─ events/
│              │  ├─ plans/
│              │  ├─ results/
│              │  └─ .locks/
│              └─ generated/
└─ tools/
```

実際のパスは `specdojo.config.json` の project 設定で変更できます。

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

`specdojo.config.json` は複数プロジェクトを扱うためのレジストリです。

```json
{
  "version": 1,
  "current_project": "prj-0001",
  "projects": {
    "prj-0001": {
      "base_path": "docs/ja/projects/prj-0001",
      "catalog_path": "010-deliverables-catalog",
      "schedule_path": "030-project-management/schedule",
      "execution_path": "070-execution",
      "project_register_path": "030-project-management/controls/project-register",
      "routines_path": "030-project-management/routines",
      "members_path": "030-project-management/020-organization/pm-members.yaml",
      "reviews_path": "030-project-management/controls/reviews",
      "viewpoints_path": "030-project-management/010-management-plan/pm-review-viewpoints.yaml",
      "run": {
        "exec_defaults": ".specdojo/exec-defaults.yaml"
      }
    }
  }
}
```

`base_path` を指定すると、`catalog_path`、`schedule_path`、`execution_path` などを `base_path` からの相対パスとして書けます。`run.exec_defaults` と `run.worktree_base` はリポジトリルート相対のまま扱います。

## 5. プロジェクト解決順序

プロジェクトに紐づくコマンドは、次の順序で対象 project を解決します。

1. `--project <id>`
2. `SPECDOJO_PROJECT`
3. `specdojo.config.json` の `current_project`
4. `specdojo.config.json` の `projects` に定義された先頭 project

通常は `current_project` を使います。ブランチや worktree ごとに `specdojo.config.json` を Git 管理すれば、`.env` のコピーは不要です。

## 6. 代表フロー

新規プロジェクトの基本フローは次のとおりです。

```bash
# 1. 設定を作成する
specdojo config init

# 2. 成果物カタログを作成・検証・Markdown生成する
specdojo catalog scaffold --project prj-0001
specdojo catalog validate --project prj-0001
specdojo catalog build --project prj-0001

# 3. strategy から track schedule を生成する
specdojo schedule build --project prj-0001 --track launch --force

# 4. 実行状態、Ready、CPMを生成する
specdojo exec build --project prj-0001

# 5. Readyタスクを実行する
specdojo exec run --project prj-0001 --auto --parallel 5
```

全生成物をまとめて更新したい場合は `specdojo build` を使います。

```bash
specdojo build --project prj-0001
```

## 7. 定期実行と登録項目の実行

schedule に基づく実行のほかに、次の 2 つの実行経路があります。コマンドの詳細は [specdojo-command-reference-guide.md](specdojo-command-reference-guide.md) を、経路ごとの使い分けの基準は [specdojo-exec-operation-guide.md](specdojo-exec-operation-guide.md) の `実行経路の使い分け` を参照します。

| 機能                  | 概要                                                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `routine`             | `rtn-*.yaml` の定義に基づき、時刻条件でタスクを定期実行する。外部スケジューラから `routine run --due` を冪等に呼び出す  |
| `exec run --register` | 登録簿（`pjr-index.md`）の項目を agent に実行させる。状態は register の遷移（in-progress / review / waiting）で追跡する |

## 8. 詳細ガイド

| 目的                                                 | 参照先                                                                                   |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| コマンドの例と主要オプションを引く                   | [specdojo-command-reference-guide.md](specdojo-command-reference-guide.md)               |
| 成果物カタログからScheduleへ展開する考え方を確認する | [specdojo-deliverables-to-schedule-guide.md](specdojo-deliverables-to-schedule-guide.md) |
| Scheduleを設計する                                   | [specdojo-schedule-design-guide.md](specdojo-schedule-design-guide.md)                   |
| execを運用する                                       | [specdojo-exec-operation-guide.md](specdojo-exec-operation-guide.md)                     |
| worktree隔離実行を手動で進める                       | [specdojo-exec-worktree-guide.md](specdojo-exec-worktree-guide.md)                       |
| plan/resultの扱いを確認する                          | [specdojo-plan-result-lifecycle-guide.md](specdojo-plan-result-lifecycle-guide.md)       |
| エージェント選択と実行設定を変更する                 | [specdojo-exec-config-guide.md](specdojo-exec-config-guide.md)                           |
