---
specdojo:
  id: specdojo:specdojo-config-reference
  type: reference
  status: draft
---

# SpecDojo設定リファレンス

SpecDojo Configuration Reference

`.specdojo/specdojo.config.json` のキー、既定値、パスの基準、利用するコマンドを一覧します。設定の型とパス解決の正本は CLI 実装です。

**対象範囲**

- `.specdojo/specdojo.config.json` のトップレベル、project、`run`、`repos` の設定キー

**ここで引けるもの**

- 各キーの役割、既定値、パスの基準、必要とする主なコマンド
- register だけの最小構成から catalog / schedule / exec へ進むときに追加するキー

**詳細の参照先**

- 初期導入の手順は [[specdojo:quick-start-guide|Quick Startガイド]]、agent と provider の設定は [[specdojo:exec-config-guide|exec設定ガイド]] を参照してください。
- 標準配置は [[specdojo:directory-layout-reference|ディレクトリレイアウトリファレンス]]、個別コマンドは [[specdojo:command-reference|CLIコマンドリファレンス]] を参照してください。

## 1. 最小構成

`npx specdojo config init` は、register を開始できる次の最小構成を生成します。catalog や schedule の未使用キーは生成しません。

```json
{
  "version": 1,
  "current_project": "prj-0001",
  "projects": {
    "prj-0001": {
      "base_path": "docs/ja/projects/prj-0001",
      "project_register_path": "controls/project-register",
      "project_context": ["prj-overview"],
      "run": {
        "worktree_base": "../app1-worktrees"
      }
    }
  }
}
```

この構成では `config init`、`register scaffold` / `add` / `build`、`dashboard build`、`exec plan --register` を利用できます。catalog へ進むときは `catalog_path`、schedule へ進むときは後述の関連キーを段階的に追加します。

最小構成は `repos` を含みません。プロダクトリポジトリ（既定の別リポジトリ構成では `../app1`）をタスクの変更対象にする場合は、`config init` の次の手順の案内に従い、後述の「`repos`のキー」を追加します。生成時に存在しないリポジトリを宣言すると設定の読み込みがエラーになるため、雛形には書き込みません。

## 2. トップレベルのキー

| キー              | 必須 | 既定値                                 | 役割・利用箇所                                                                                  |
| ----------------- | ---- | -------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `version`         | 必須 | なし。現行値は `1`                     | 設定形式のバージョンです。すべての config 利用コマンドが検証します。                            |
| `current_project` | 任意 | コマンドにより `projects` の先頭を使用 | `--project` と `SPECDOJO_PROJECT` を省略したときの対象 project です。                           |
| `projects`        | 必須 | なし                                   | project ID をキー、project 設定を値とするオブジェクトです。複数 project を1ファイルで扱えます。 |

対象 project の一般的な解決順序は、`--project <id>`、`SPECDOJO_PROJECT`、`current_project`、`projects` の先頭です。一部のコマンドは `current_project` を参照せず `projects` の先頭へフォールバックするため、複数 project では `--project` を明示してください。

## 3. projectのパスキー

`projects.<project-id>` に指定するキーです。`base_path` 以外の表中のパスは、`base_path` があればそこからの相対パス、無ければリポジトリルートからの相対パスとして解決します。

| キー                    | 既定値           | 主な役割                                                 | 必要とする主なコマンド                                        |
| ----------------------- | ---------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| `base_path`             | リポジトリルート | project 文書に共通するパス接頭辞                         | project に紐づく各コマンド                                    |
| `project_register_path` | なし             | 個票、event、登録簿の配置先                              | `register *`、`exec plan/run --register`                      |
| `catalog_path`          | なし             | `dct-*.yaml` と生成ビューの配置先                        | `catalog *`、`deliverable scaffold`、catalog を使う grade 等  |
| `schedule_path`         | `schedule`       | strategy、track、Schedule の配置先                       | `schedule *`、schedule 対象の `exec *`                        |
| `execution_path`        | `execution`      | plan、result、実行状態、grade / Job Run の配置先         | `exec *`、`grade *`、`job *`、`dashboard build`               |
| `timeline_path`         | `timeline`       | Timeline の正本と生成物の配置先                          | `timeline *`、`dashboard build`、`schedule strategy generate` |
| `members_path`          | なし             | 人・agent、ロール、provider を定義する `pm-members.yaml` | actor 検証、agent 実行、owner 検証、`grade apply --by`        |
| `roles_path`            | なし             | role 定義ファイルの配置先                                | `schedule strategy generate`、owner を解決する `exec plan`    |
| `viewpoints_path`       | なし             | review / grade 観点ファイルの配置先                      | `grade *`、review plan、`exec scaffold --project`             |
| `routines_path`         | なし             | `rtn-*.yaml` と routine 状態の配置先                     | `routine *`、routine を集約する `dashboard build`             |
| `jobs_path`             | なし             | `job-*.yaml` の配置先                                    | `job *`、`exec run --job`                                     |

`schedule_path`、`execution_path`、`timeline_path` には解決時の既定値があります。ただし `schedule` コマンドや一括 `build` の対象判定ではキーの明示が必要なため、catalog から Schedule と exec へ進む構成では省略しないでください。

## 4. projectの非パスキー

| キー              | 既定値             | 役割・利用箇所                                                                                                                                      |
| ----------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `project_context` | `["prj-overview"]` | edit / review plan へ常に渡す project 共通文書のローカル ID です。空配列 `[]` で無効化できます。`depends_on` や成果物の `based_on` は変更しません。 |
| `run`             | `{}`               | agent 実行、worktree、登録日の表示に関する project 単位の設定です。                                                                                 |
| `repos`           | なし               | project のタスクが変更するプロダクトリポジトリの宣言です。詳細は「`repos`のキー」を参照してください。                                               |

## 5. `run`のキー

`projects.<project-id>.run` に指定します。これらのパスは `base_path` の影響を受けず、リポジトリルート基準です。

| キー                     | 既定値         | 役割・利用箇所                                                                                                |
| ------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------- |
| `exec_defaults`          | なし           | provider、権限、リトライなどを定義する exec defaults ファイルです。agent を起動する `exec run` が参照します。 |
| `agent_config`           | なし           | `exec_defaults` の旧キーです。互換目的でのみ利用し、新しい設定では `exec_defaults` を使います。               |
| `worktree_base`          | `../worktrees` | `exec run --worktree` / `--auto` と `exec trial` が作る worktree の親です。リポジトリ外を指定します。         |
| `register_date_timezone` | `UTC`          | 登録簿の「登録日」「完了日」を日時から暦日へ変換する IANA タイムゾーン名です。例は `Asia/Tokyo` です。        |

`config init` は別リポジトリ構成の標準配置に合わせ、一般既定の `../worktrees` ではなく `../app1-worktrees` を `worktree_base` へ明示します。

`config init` は、設定した配置から生成物を除外する `.gitignore` の行も導きます。既定の行は `.specdojo/doc-index.json`、`docs/**/generated/*`、`!docs/**/generated/.gitkeep`、`docs/**/execution/exec/.locks/` です。`base_path` が `docs/` の外にある場合は `<base_path>/**/generated/*` などを追加し、`base_path` が無い場合は各パス設定から導いた行を追加します。リポジトリ外を指すパスは対象にしません。配置を変えた後は `config init` を再実行すると、足りない行だけが追記されます。

## 6. `repos`のキー

`projects.<project-id>.repos` は、プロジェクトリポジトリとは別のプロダクトリポジトリを配列で宣言します。プロジェクトリポジトリ自身は宣言しません。キーを省略した project（または空配列）は、従来どおりプロジェクトリポジトリ 1 つだけを扱います。

| キー                 | 必須 | 既定値                         | 役割・利用箇所                                                                                           |
| -------------------- | ---- | ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `name`               | 必須 | なし                           | `targets`・`paths` の接頭辞に使うリポジトリ名です。`[a-z0-9-]` だけを使い、project 内で一意です。        |
| `path`               | 必須 | なし                           | リポジトリのルートです。SpecDojo ルートからの相対パスで書き、実在するディレクトリを指します。            |
| `integration_branch` | 任意 | そのリポジトリの現在のブランチ | exec が変更を統合する先のブランチです。                                                                  |
| `setup`              | 任意 | なし                           | worktree 作成時の準備の有無です。`install`（依存導入）と `build`（生成物の build）を真偽値で指定します。 |

```json
{
  "base_path": "docs/ja/projects/prj-0001",
  "project_register_path": "controls/project-register",
  "repos": [
    {
      "name": "app1",
      "path": "../app1",
      "integration_branch": "main",
      "setup": { "install": true, "build": false }
    }
  ]
}
```

`targets`（個票・job）と `paths`（job）では、`<repo>:<path>`（例: `app1:src/auth/token.ts`）でプロダクトリポジトリ内のパスを指定します。値の区別は次の規則に従います。

- `:` より前の接頭辞が宣言済みのリポジトリ名なら、そのリポジトリのルートからの相対パスとして扱います。空のパス、絶対パス、リポジトリの外へ出るパス（`..` を含むもの）はエラーです。
- それ以外の値は従来どおりです。`targets` では doc id（例: `prj-0001:pjr-index`、`ifx-cmd`）、`paths` ではプロジェクトリポジトリ内のパスとして扱います。
- プロダクトリポジトリの文書は doc id では引けません。パスで指定します。

宣言の検証と書式の解決は、設定の読み込みと解決関数として提供します。exec がプロダクトリポジトリの worktree を作り、変更を commit・統合する処理は段階的に追加中です。

設定の読み込み時に、次の誤りを対象（`projects.<project-id>.repos[<n>]`）と原因を示すエラーにします。誤りは全 project 分をまとめて表示します。

- `name` が `[a-z0-9-]` 以外の文字を含む、または同じ project 内で重複している。
- `name` がいずれかの project ID と同じである。`<name>:<...>` が doc id とリポジトリのパスのどちらか区別できなくなるためです。
- `path` が空、絶対パス、存在しない、またはディレクトリでない。
- 宣言に無いキーがある、`integration_branch` が空文字、`setup` の値が真偽値でない。

設定の形は `docs/specdojo/schemas/v1/specdojo-config.schema.yaml` でも検証できます。リポジトリ名と project ID の重複と `path` の実在は schema で表せないため、CLI の読み込み時の検証が正本です。

## 7. catalog・schedule・execへ進む設定例

register の最小構成から成果物カタログと Schedule へ進む場合は、対象 project へ必要なキーを追加します。次は Quick Start の代表例です。

```json
{
  "base_path": "docs/ja/projects/prj-0001",
  "catalog_path": "010-deliverables-catalog",
  "schedule_path": "schedule",
  "execution_path": "execution",
  "timeline_path": "timeline",
  "members_path": "030-project-management/pm-members.yaml",
  "roles_path": "030-project-management/pm-roles.yaml",
  "viewpoints_path": "030-project-management/pm-review-viewpoints.yaml",
  "project_register_path": "controls/project-register",
  "project_context": ["prj-overview"],
  "run": {
    "exec_defaults": ".specdojo/exec-defaults.yaml",
    "worktree_base": "../app1-worktrees"
  }
}
```

routine / Job を使う段階で、同じ project 設定へ `routines_path` と `jobs_path` を追加します。未使用のキーまで最初から埋める必要はありません。

## 8. 設定不足時の確認順序

1. エラーに表示されたキーが対象 project にあるか確認します。
2. `base_path` と対象パスを連結した先が意図した配置か確認します。
3. 複数 project では `npx specdojo <command> --project <project-id>` のように対象を明示します。
4. `npx specdojo project list` で project と解決された Schedule / execution のパスを確認します。

`catalog_path not set` は、`config init` が register 用の最小構成だけを生成するために表示されます。`catalog_path` を追加してから `catalog scaffold` を再実行してください。
