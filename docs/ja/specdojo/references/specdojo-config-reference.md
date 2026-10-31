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

- `.specdojo/specdojo.config.json` のトップレベル、project、`run`、`repos`、`external_projects` の設定キー

**ここで引けるもの**

- 各キーの役割、既定値、パスの基準、必要とする主なコマンド
- register だけの最小構成から catalog / schedule / exec へ進むときに追加するキー

**詳細の参照先**

- 初期導入の手順は [[specdojo:quick-start-guide|Quick Startガイド]]、agent と provider の設定は [[specdojo:exec-config-guide|exec設定ガイド]] を参照してください。
- 標準配置は [[specdojo:directory-layout-reference|ディレクトリレイアウトリファレンス]]、個別コマンドは [[specdojo:command-reference|CLIコマンドリファレンス]] を参照してください。

## 1. 最小構成

`npx specdojo config init` は、register を開始できる次の最小構成を生成します。catalog や schedule の未使用キーは生成しません。

あわせて、markdownlint の設定がなければリポジトリ直下に `.markdownlint.yaml` を生成します。
MD013・MD024・MD033・MD036・MD041・MD060 を無効にし、日本語の長い行や SpecDojo の文書構成を許容します。
既存設定は上書きしません。既存リポジトリでは `config init --dry-run` で確認してから再実行すると追加できます。
exec の result の commit 前検査にも、利用リポジトリに設定がないときは同じ基本規則が適用されます。
設定の優先順位と hook / CLI2 の配置は [[specdojo:command-reference|CLIコマンドリファレンス]] を参照してください。

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
        "worktree_base": "../app1-specdojo-worktrees"
      }
    }
  }
}
```

この構成では `config init`、`register scaffold` / `add` / `build`、`dashboard build`、`exec plan --register` を利用できます。catalog へ進むときは `catalog_path`、schedule へ進むときは後述の関連キーを段階的に追加します。

最小構成は `repos` を含みません。プロダクトリポジトリ（既定の別リポジトリ構成では `../app1`）をタスクの変更対象にする場合は、`config init` の次の手順の案内に従い、後述の「`repos`のキー」を追加します。生成時に存在しないリポジトリを宣言すると設定の読み込みがエラーになるため、雛形には書き込みません。

## 2. トップレベルのキー

| キー                 | 必須 | 既定値                                 | 役割・利用箇所                                                                                              |
| -------------------- | ---- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `version`            | 必須 | なし。現行値は `1`                     | 設定形式のバージョンです。すべての config 利用コマンドが検証します。                                        |
| `current_project`    | 任意 | コマンドにより `projects` の先頭を使用 | `--project` と `SPECDOJO_PROJECT` を省略したときの対象 project です。                                       |
| `agent_members_path` | 任意 | `.specdojo/agent-members.yaml`         | 全 project が共有する保護済み agent 定義です。`.specdojo/` 配下の YAML だけを指定できます。                 |
| `kata_authority`     | 任意 | リポジトリのディレクトリ名             | 利用者が新しく作る kata のリポジトリ単位の authority です。英小文字・数字・ハイフンで指定します。           |
| `projects`           | 必須 | なし                                   | project ID をキー、project 設定を値とするオブジェクトです。複数 project を1ファイルで扱えます。             |
| `external_projects`  | 任意 | なし                                   | 別リポジトリの project をローカルの別名で宣言します。`register add` と `orchestrator launch` が使用します。 |

対象 project の一般的な解決順序は、`--project <id>`、`SPECDOJO_PROJECT`、`current_project`、`projects` の先頭です。一部のコマンドは `current_project` を参照せず `projects` の先頭へフォールバックするため、複数 project では `--project` を明示してください。

`kata_authority` は project ごとではなくリポジトリ全体で共有します。省略時は元リポジトリのディレクトリ名を小文字・ハイフン形式へ正規化した値です。worktree でも元リポジトリの名前を使います。利用者の kata は `docs/ja/specdojo/<種類>s/<kata_authority>/` 配下に置かれ、この authority の ID だけを利用者リポジトリから解決します。値は英小文字から始め、英小文字・数字・ハイフンだけを使います。project ID と区別するため `prj-` で始めず、SpecDojo 本体専用の `specdojo` も使いません。0.4.4 のあいだは旧 `docs/ja/kata/` も移行元として読みます。

### 2.1. `external_projects`のキー

別リポジトリの登録簿へ起票する場合は、トップレベルの `external_projects` に、呼び出し元だけで使う別名をキーとして、相手のリポジトリと project ID を宣言します。

```json
{
  "external_projects": {
    "customer": {
      "path": "../customer-specdojo",
      "project_id": "prj-0002"
    }
  }
}
```

| キー         | 必須 | 役割                                                                       |
| ------------ | ---- | -------------------------------------------------------------------------- |
| `path`       | 必須 | このリポジトリのルートから相手のリポジトリへの相対パスです。               |
| `project_id` | 必須 | 相手の `specdojo.config.json` の `projects` にある実際の project ID です。 |

別名は `[a-z0-9-]+` とし、ローカルの `projects` の ID と重ねられません。`path` は存在するディレクトリでなければならず、絶対パスは使えません。起票時は相手の `node_modules/.bin/specdojo` を使うため、相手に SpecDojo 0.4.2 以上が必要です。`orchestrator launch` は `repos` に加えて、宣言したすべての外部リポジトリにも provider 別の編集許可を付けます。

相手に `node_modules/.bin/specdojo` がなく、相手の `package.json` の `name` が `specdojo` の場合は、呼び出し元と同じ Node.js で `node <相手>/dist/specdojo.js` を起動します。SpecDojo 自身のリポジトリを指定する場合は、相手で `npm install` と `npm run build` を実行してください。`dist/specdojo.js` がなければ `npm run build` を案内して停止します。CLI の版はこの起動方法でも 0.4.2 以上が必要です。

## 3. projectのパスキー

`projects.<project-id>` に指定するキーです。`base_path` 以外の表中のパスは、`base_path` があればそこからの相対パス、無ければリポジトリルートからの相対パスとして解決します。

| キー                    | 既定値           | 主な役割                                          | 必要とする主なコマンド                                        |
| ----------------------- | ---------------- | ------------------------------------------------- | ------------------------------------------------------------- |
| `base_path`             | リポジトリルート | project 文書に共通するパス接頭辞                  | project に紐づく各コマンド                                    |
| `project_register_path` | なし             | 個票、event、登録簿の配置先                       | `register *`、`exec plan/run --register`                      |
| `catalog_path`          | なし             | `dct-*.yaml` と生成ビューの配置先                 | `catalog *`、`deliverable scaffold`、catalog を使う grade 等  |
| `schedule_path`         | `schedule`       | strategy、track、Schedule の配置先                | `schedule *`、schedule 対象の `exec *`                        |
| `execution_path`        | `execution`      | plan、result、実行状態、grade / Job Run の配置先  | `exec *`、`grade *`、`job *`、`dashboard build`               |
| `timeline_path`         | `timeline`       | Timeline の正本と生成物の配置先                   | `timeline *`、`dashboard build`、`schedule strategy generate` |
| `members_path`          | なし             | 人間と対応 Role code を定義する `pm-members.yaml` | actor 検証、owner 検証、合成名簿の project 側入力             |
| `roles_path`            | なし             | role 定義ファイルの配置先                         | `schedule strategy generate`、owner を解決する `exec plan`    |
| `viewpoints_path`       | なし             | review / grade 観点ファイルの配置先               | `grade *`、review plan、`exec scaffold --project`             |
| `routines_path`         | なし             | `rtn-*.yaml` と routine 状態の配置先              | `routine *`、routine を集約する `dashboard build`             |
| `jobs_path`             | なし             | `job-*.yaml` の配置先                             | `job *`、`exec run --job`                                     |

`schedule_path`、`execution_path`、`timeline_path` には解決時の既定値があります。ただし `schedule` コマンドや一括 `build` の対象判定ではキーの明示が必要なため、catalog から Schedule と exec へ進む構成では省略しないでください。

## 4. projectの非パスキー

| キー                 | 既定値                         | 役割・利用箇所                                                                                                                                      |
| -------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `integration_branch` | `project/<project-id>/develop` | 別 project の作業ツリーから `register add --project <project-id> --commit` で直接記帳する統合ブランチです。                                         |
| `project_context`    | `["prj-overview"]`             | edit / review plan へ常に渡す project 共通文書のローカル ID です。空配列 `[]` で無効化できます。`depends_on` や成果物の `based_on` は変更しません。 |
| `commit_types`       | なし                           | 登録項目 type（`todo`・`issue` 等）から Conventional Commits type への対応マッピングです。                                                          |
| `run`                | `{}`                           | agent 実行、worktree、登録日の表示に関する project 単位の設定です。                                                                                 |
| `repos`              | なし                           | project のタスクが変更するプロダクトリポジトリの宣言です。詳細は「`repos`のキー」を参照してください。                                               |

project の `integration_branch` は、`repos[].integration_branch` とは別の設定です。前者は project リポジトリ内の登録簿へ直接記帳するブランチ、後者は exec が各プロダクトリポジトリへ変更を統合するブランチを表します。指定した project の統合ブランチはローカルに存在していなければなりません。

## 5. `run`のキー

`projects.<project-id>.run` に指定します。これらのパスは `base_path` の影響を受けず、リポジトリルート基準です。

| キー                         | 既定値         | 役割・利用箇所                                                                                                               |
| ---------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `exec_defaults`              | なし           | provider、権限、リトライなどを定義する exec defaults ファイルです。agent を起動する `exec run` が参照します。                |
| `agent_config`               | なし           | `exec_defaults` の旧キーです。互換目的でのみ利用し、新しい設定では `exec_defaults` を使います。                              |
| `parent_validations`         | `[]`           | この project だけで追加する親 runner の検証です。`exec_defaults` の `pipeline.parent_validations` の後ろへ指定順に加えます。 |
| `parent_validations_exclude` | `[]`           | 共有の `pipeline.parent_validations` から除外する ID と実行先の組です。除外後に `parent_validations` を追記します。          |
| `worktree_base`              | `../worktrees` | `exec run --worktree` / `--auto` と `exec trial` が作る worktree の親です。リポジトリ外を指定します。                        |
| `register_date_timezone`     | `UTC`          | 登録簿の「登録日」「完了日」を日時から暦日へ変換する IANA タイムゾーン名です。例は `Asia/Tokyo` です。                       |

`parent_validations` の要素は、共有 defaults と同じく検証 ID、または `{ "id": "<id>", "repo": "<repo>" }` です。共有 defaults を複製せず、プロダクトリポジトリを持つ project だけに検証を追加できます。たとえば `prj-0002` だけで `specdojo-lp` の型と lint を検査する設定は次のとおりです。

```json
{
  "projects": {
    "prj-0002": {
      "repos": [{ "name": "specdojo-lp", "path": "../specdojo-lp" }],
      "run": {
        "exec_defaults": ".specdojo/exec-defaults.yaml",
        "parent_validations": [
          { "id": "typecheck", "repo": "specdojo-lp" },
          { "id": "lint-ts", "repo": "specdojo-lp" }
        ]
      }
    }
  }
}
```

除外を指定しない場合、有効な一覧は「共有 defaults の `pipeline.parent_validations` → project の `run.parent_validations`」の順です。同じ ID と実行先の組が両方にある場合は重複として agent 起動前にエラーになります。追加も除外も省略した project には共有 defaults だけが適用されるため、`repos` を持たない別 project はプロダクトリポジトリ向けの追加検証に影響されません。許可される ID と実行結果の記録は [[specdojo:exec-config-guide|exec設定ガイド]] を参照してください。

共有検証を減らす場合は `run.parent_validations_exclude` を指定します。要素の形式は `parent_validations` と同じです。有効な一覧は「共有の `pipeline.parent_validations` から除外 → `run.parent_validations` を追記」の順になり、共有一覧の残りと追記分の順序を保ちます。除外を省略するか `[]` にした project は従来どおりです。共有 defaults のほかの設定や、別 project の検証は変わりません。

たとえば共有一覧が `lint-fm`・`lint-md`・`lint-ts`・`typecheck`・`test-unit`・`test-integration`・`validate-schema` の場合、`prj-0002` の `run` を次のようにすると、`lint-fm`・`lint-md` と `specdojo-lp` の `typecheck` だけが有効になります。`repos` は上の例と同じ宣言を使います。

```json
{
  "exec_defaults": ".specdojo/exec-defaults.yaml",
  "parent_validations_exclude": [
    "lint-ts",
    "typecheck",
    "test-unit",
    "test-integration",
    "validate-schema"
  ],
  "parent_validations": [{ "id": "typecheck", "repo": "specdojo-lp" }]
}
```

除外の ID だけの指定は `{ "id": "<id>", "repo": "project" }` と同じで、同じ ID の別リポジトリ向け検証には一致しません。未知の ID、不正な要素、共有一覧に存在しない ID と実行先の組の除外、除外一覧内または最終一覧内の組の重複は agent 起動前に設定エラーになります。除外前の共有一覧自体も検証します。除外は project の追加分には適用せず、除外した組を `parent_validations` で末尾に戻すことはできます。共有 defaults に新しく追加された検証は、除外に指定しない限り継承します。

`config init` は一般既定の `../worktrees` ではなく、実行したリポジトリのディレクトリ名から作る `../<リポジトリ名>-worktrees` を `worktree_base` へ明示します。例えば `app1-specdojo/` で実行した場合は `../app1-specdojo-worktrees` です。

`config init` は、設定した配置から生成物を除外する `.gitignore` の行も導きます。既定の行は `node_modules/`、`.specdojo/doc-index.json`、`docs/**/generated/*`、`!docs/**/generated/.gitkeep`、`docs/**/execution/exec/.locks/` です。`base_path` が `docs/` の外にある場合は `<base_path>/**/generated/*` などを追加し、`base_path` が無い場合は各パス設定から導いた行を追加します。リポジトリ外を指すパスは対象にしません。配置を変えた後は `config init` を再実行すると、足りない行だけが追記されます。

## 6. `repos`のキー

`projects.<project-id>.repos` は、プロジェクトリポジトリとは別のプロダクトリポジトリを配列で宣言します。プロジェクトリポジトリ自身は宣言しません。キーを省略した project（または空配列）は、従来どおりプロジェクトリポジトリ 1 つだけを扱います。

| キー                   | 必須 | 既定値                         | 役割・利用箇所                                                                                                                            |
| ---------------------- | ---- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                 | 必須 | なし                           | `targets`・`paths` の接頭辞に使うリポジトリ名です。`[a-z0-9-]` だけを使い、project 内で一意です。`project` は予約名で使えません。         |
| `path`                 | 必須 | なし                           | リポジトリのルートです。SpecDojo ルートからの相対パスで書き、実在するディレクトリを指します。                                             |
| `integration_branch`   | 任意 | そのリポジトリの現在のブランチ | exec が変更を統合する先のブランチです。exec branch もこのブランチの先端から作ります。                                                     |
| `integration_strategy` | 任意 | `merge`                        | `merge` はローカルの merge commit で統合します。`branch-only` は exec branch に commit して保持し、プロダクト側の PR レビューに渡します。 |
| `setup`                | 任意 | 両方 `true`                    | worktree 作成時の準備の有無です。`install`（依存導入）と `build`（生成物の build）を真偽値で指定します。                                  |
| `commit_types`         | 任意 | なし                           | このリポジトリ固有の登録項目 type から Conventional Commits type への対応マッピングです。project の指定より優先されます。                 |

register の worktree 実行では、`exec run --integration-branch <repo>=<branch>` により `integration_branch` を run ごとに上書きできます。統合先の優先順位は「run の指定 → `repos[].integration_branch` → そのリポジトリの現在のブランチ」です。指定方法、ローカルブランチの検査、並列実行と再開時の扱いは [[specdojo:command-reference]] を参照してください。

`commit_types` は項目の type ごとに既定の commit type を上書きします。値は個票の `commit_type` と同じ 11 種類（`feat`・`fix`・`docs`・`refactor`・`test`・`chore`・`perf`・`build`・`ci`・`style`・`revert`）です。空文字や一覧外の値は設定読み込み時にエラーになります。未指定のキーは「個票の `commit_type` → `repos[].commit_types` → `projects.<project-id>.commit_types` → 既定対応」の順に解決します。`commit_scope` は個票で指定した場合だけ使います。

既定対応は `issue` が `fix`、`todo`・`change-request`・`epic` が `feat`、`decision`・`note`・`question`・`risk` が `docs` です。未知の type は `chore` にフォールバックします。たとえば、project に `"commit_types": { "todo": "chore", "issue": "fix" }`、ドキュメント用の repo に `"commit_types": { "todo": "docs" }` を設定すると、その repo の todo は `docs`、他の repo の todo は `chore` になります。個票で `commit_type` を明示すれば、設定より優先されます。

この設定は後続処理向けの解決情報です。現時点の exec の commit メッセージとブランチ名は変わりません。

GitHub flow などで PR レビューを必須にするリポジトリには、`"integration_strategy": "branch-only"` を指定します。`integration_branch` は exec branch の作成元と、プロダクト側で PR を作る際の統合先の目安です。runner は統合先へ merge せず、push・PR 作成（`gh` を含む）も行いません。プロダクトの commit とプロジェクトの記帳が成功すると、プロジェクト側は通常どおり `review` へ進み、result に `branch-only`（未統合）、exec branch 名、trace key を残します。プロダクト側のレビューやリリースが完了したことは意味しません。

成功後は全 worktree を撤去し、`branch-only` の exec branch だけを残します。利用者はその branch を必要な承認のもと push し、プロダクト側の手順で PR を作成します。squash merge でも追跡できるよう、commit メッセージの `Refs: <project-id>:<item-id>` を保持してください。失敗時は worktree と branch を残して `--resume` で再開し、`branch-only` の worktree へ統合先を自動で取り込みません。同じ項目を新規実行する際に保持済み branch があると停止するため、既存 run を再開するか、プロダクト側の作業を終えて branch を退避・削除してから実行します。`exec worktree prune` は未統合の branch を削除しません。

```json
{
  "base_path": "docs/ja/projects/prj-0001",
  "project_register_path": "controls/project-register",
  "repos": [
    {
      "name": "app1",
      "path": "../app1",
      "integration_branch": "main",
      "integration_strategy": "branch-only",
      "setup": { "install": true, "build": false }
    }
  ]
}
```

`targets`（個票・job）と `paths`（job）では、`<repo>:<path>`（例: `app1:src/auth/token.ts`）でプロダクトリポジトリ内のパスを指定します。値の区別は次の規則に従います。

- `:` より前の接頭辞が宣言済みのリポジトリ名なら、そのリポジトリのルートからの相対パスとして扱います。空のパス、絶対パス、リポジトリの外へ出るパス（`..` を含むもの）はエラーです。
- それ以外の値は従来どおりです。`targets` では doc id（例: `prj-0001:pjr-index`、`ifx-cmd`）、`paths` ではプロジェクトリポジトリ内のパスとして扱います。
- プロダクトリポジトリの文書は doc id では引けません。パスで指定します。

`setup` の `install` は追跡済みの `package-lock.json` ごとの `npm ci`、`build` はリポジトリに `.specdojo/specdojo.config.json` がある場合の `specdojo build` です。対象が無いリポジトリでは、`true` でも何も実行しません。

`repos` を宣言した project の `exec run --worktree` と `exec worktree prepare` は、タスクごとに次の worktree を作ります。宣言の無い project は従来どおり `<worktree_base>/<task-id>/` の直下に 1 つだけ作ります。

- `<worktree_base>/<task-id>/project/`: プロジェクトリポジトリの worktree です。agent の作業ディレクトリ（`cwd`）になります。`project` が予約名なのはこのためです。
- `<worktree_base>/<task-id>/<name>/`: 宣言した各リポジトリの worktree です。exec branch は run の `--integration-branch`、`integration_branch`、現在のブランチの順で解決した統合先の先端から作ります。

agent には、各 worktree の絶対パスを次の環境変数で渡します。

| 環境変数                | 値                                                    |
| ----------------------- | ----------------------------------------------------- |
| `SPECDOJO_REPO_PROJECT` | プロジェクトリポジトリの worktree                     |
| `SPECDOJO_REPO_<NAME>`  | `<name>` の worktree。`<NAME>` は大文字で、`-` は `_` |
| `SPECDOJO_REPO_NAMES`   | 宣言したリポジトリ名を宣言順にカンマで区切ったもの    |

agent の起動コマンドには、provider ごとにプロダクト worktree への書き込み許可を runner が付け足します。`exec-defaults.yaml` の `command_template` を変える必要はありません。

| provider      | 付け足す引数                                                     | 制約                                                                                                                  |
| ------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `claude`      | `--add-dir <path>...` と `--allowedTools 'Edit(//<path>/**)'...` | mode 別 settings の `Edit` 許可は作業ディレクトリ相対のため、絶対パスの許可を別に渡す                                 |
| `codex`       | `--add-dir <path>`（リポジトリの数だけ）                         | `--sandbox workspace-write` の書き込みルートに加わる。`.git` は codex の仕様で読み取り専用のまま                      |
| `antigravity` | `--add-dir <path>`（リポジトリの数だけ）                         | テンプレートの `--add-dir "$(pwd)"` に追加する                                                                        |
| `copilot`     | `--add-dir <path>`（リポジトリの数だけ）                         | 書き込みはテンプレートの `--allow-tool write` に従う                                                                  |
| `opencode`    | なし                                                             | 作業ディレクトリ外は agent 定義の `permission.external_directory` で拒否される。許可には agent 定義の変更が必要になる |

対話型オーケストレーターは `specdojo orchestrator launch` が同じ `repos` を読み、プロダクトリポジトリ本体のルートを許可します。Claude Code、Codex、Antigravity、GitHub Copilot は上表と同じ引数規則です。OpenCode は起動時の inline config で、選択 agent の `permission.external_directory` を「全拒否、宣言済みルートだけ許可」に差し替え、宣言済みルートの `permission.edit` も許可します。この設定はオーケストレーターのプロセスだけに適用され、agent 定義や利用者の設定ファイルは書き換えません。`repos` を省略した project では追加の引数・設定を渡しません。

agent 実行の前後で行う保護設定（`package.json`、CI 設定など）と Git 状態（HEAD・ローカル設定）の検査は、プロダクト worktree にも同じ一覧で行います。evidence の変更ファイルは、プロダクト側を `<name>:<path>` で記録します。

プロダクトリポジトリの変更は、`exec run --worktree` の統合段で runner がリポジトリごとに commit し、宣言順にプロダクトの設定方式を処理し、最後にプロジェクトを統合します。統合の順序、失敗時の部分状態、再開は [[specdojo:docs-structure-guide|ドキュメント構成ガイド]] の「複数リポジトリの worktree と統合順序」と「複数リポジトリの統合の失敗と再開」を参照してください。`exec worktree commit` はプロダクト側を統合しないため、プロダクト worktree に未 commit の変更か exec branch の commit が残るタスクは、プロジェクト側の commit の前に停止します。撤去は、全リポジトリの worktree が撤去できることを確かめてからまとめて行います。

exec worktree の中で設定を読む場合（agent が worktree で `specdojo` を実行する場合など）、`path` の代わりに同じタスクの `<worktree_base>/<task-id>/<name>/` へ解決します。

`repos` を宣言した project では、`specdojo config scaffold --workspace` を実行すると、リポジトリルートに VS Code のマルチルートワークスペース（`<project-id>.code-workspace`）を生成できます。ワークスペースの `folders` にはプロジェクトリポジトリ（`.`）と宣言した各プロダクトリポジトリ（`repos[].path`）が宣言順に並び、VS Code で 1 つのウィンドウから両リポジトリを同時に操作できます。既存のワークスペースファイルは `--force` を付けない限り上書きしません。

設定の読み込み時に、次の誤りを対象（`projects.<project-id>.repos[<n>]`）と原因を示すエラーにします。誤りは全 project 分をまとめて表示します。

- `name` が `[a-z0-9-]` 以外の文字を含む、または同じ project 内で重複している。
- `name` がいずれかの project ID と同じである。`<name>:<...>` が doc id とリポジトリのパスのどちらか区別できなくなるためです。
- `name` が予約名 `project` である。プロジェクトリポジトリの worktree のディレクトリ名と重なるためです。
- `path` が空、絶対パス、存在しない、またはディレクトリでない。
- 宣言に無いキーがある、`integration_branch` が空文字、`integration_strategy` が `merge` / `branch-only` 以外、`setup` の値が真偽値でない。

設定の形は `docs/specdojo/schemas/v1/specdojo-config.schema.yaml` でも検証できます。リポジトリ名と project ID の重複と `path` の実在は schema で表せないため、CLI の読み込み時の検証が正本です。

## 7. catalog・schedule・execへ進む設定例

register の最小構成から成果物カタログと Schedule へ進む場合は、対象 project へ必要なキーを追加します。次は Quick Start の代表例です。

agent 実行を使う場合は、この project オブジェクトとは別にトップレベルへ `"agent_members_path": ".specdojo/agent-members.yaml"` を指定できます。省略時も同じパスが既定です。

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
    "worktree_base": "../app1-specdojo-worktrees"
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
