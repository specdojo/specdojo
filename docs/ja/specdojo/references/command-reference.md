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

- `specdojo` CLI の主要コマンド（init / config / kata / catalog / deliverable / schedule / register / exec / agent / orchestrator / grade / index / watch / build / routine）

**ここで引けるもの**

- コマンドごとの用途と実行例、全体で共通のオプション、コマンド別の主要オプション

**詳細の参照先**

- CLI 全体の流れは [遂行の技活用ガイド](../guides/waza-guide.md)、運用上の判断と手順は各コマンド節からリンクした専門ガイドを参照してください。

## 1. 共通オプション

| オプション        | 用途                                               | 主な対象                                   |
| ----------------- | -------------------------------------------------- | ------------------------------------------ |
| `--project <id>`  | 対象 project を明示する                            | project に紐づくコマンド、`orchestrator`   |
| `--dry-run`       | 書き込みや実行を行わず予定内容を表示する           | scaffold / build / run / worktree / kata   |
| `--force`         | 既存ファイルの上書きや通常拒否される操作を明示する | scaffold / schedule build / release / kata |
| `--scope <scope>` | build / watch の対象範囲を絞る                     | `build` / `watch`                          |

project の解決順序と設定は [遂行の技活用ガイド](../guides/waza-guide.md) を参照します。

## 2. init / config / project

| コマンド                 | 用途                                                    | 例                                          |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------- |
| `init`                   | project から agent 実行までを質問式で初期設定する       | `specdojo init`                             |
| `config init`            | `specdojo.config.json` と `.gitignore` を個別に用意する | `specdojo config init`                      |
| `config migrate-members` | agent 定義を保護設定へ移す                              | `specdojo config migrate-members --dry-run` |
| `config scaffold`        | provider や VS Code ワークスペースを個別に配置する      | `specdojo config scaffold --provider codex` |
| `project list`           | 登録済み project を表示する                             | `specdojo project list`                     |

`init` は対話できる端末で、project ID と名前、register、人の nickname と表示名、複数指定可能な
provider、exec、Dev Container の順に質問します。Dev Container を選んだ場合だけ、続けて推奨 preset を入れるかを質問します（既定は「入れる」）。成果物カタログは対話では質問せず、`--catalog <size>` を
明示した場合にだけ作成します。既存ファイルは上書きせず、スキップしたパスを表示します。`--dry-run` は
予定だけを表示し、ファイルや `package.json` を変更しません。各回答は質問の直後に検証され、誤りの理由を
表示して同じ質問だけをやり直します。それまでの回答は保持されます。`--exec` を選んだのに provider が
空の場合も、provider の質問だけをやり直します。非対話環境や `--yes` では再質問せず、従来どおり不正な
指定をエラーとして終了します。

非対話環境では質問せず、次の主要オプションと既定値を使います。

| オプション                     | 用途                                                                      | 既定値          |
| ------------------------------ | ------------------------------------------------------------------------- | --------------- |
| `--yes`                        | 質問せず既定値と指定済みオプションで実行する                              | -               |
| `--project <id>`               | project ID                                                                | `prj-0001`      |
| `--name <name>`                | project の表示名                                                          | `My Project`    |
| `--no-register`                | register を作らない                                                       | register を作る |
| `--nickname <nickname>`        | 人の名簿に書く nickname                                                   | `owner`         |
| `--display-name <name>`        | 人の名簿に書く表示名                                                      | `Project Owner` |
| `--provider <names>`           | provider をカンマ区切りで指定する                                         | `codex`         |
| `--exec`                       | executor / reporter の名簿と起動設定を作る                                | 作らない        |
| `--catalog <size>`             | `small` / `medium` / `large` の成果物カタログを作る（対話では質問しない） | 作らない        |
| `--devcontainer`               | 選んだ provider の Dev Container を作る                                   | 作らない        |
| `--devcontainer-preset <name>` | Dev Container の preset（`recommended` / `none`）を選ぶ                   | `recommended`   |
| `--workspace-name <name>`      | Dev Container 内で使う親ディレクトリ名                                    | ホスト側の親名  |
| `--dry-run`                    | 作成・変更予定だけを表示する                                              | 書き込む        |

`init` が作る `.specdojo/agent-members.yaml` と `.specdojo/exec-defaults.yaml` は、選択した
provider だけを含みます。親 runner の検証は、対応する `package.json` の npm script が存在する
ID だけを `pipeline.parent_validations` へ設定し、該当する script がなければこの設定を省略します。
採用した ID と省略理由は実行時に表示します。最後にオーケストレーターの起動コマンド、最初の起票、
オーケストレーターを使わない `--executor-by` / `--reporter-by` の実行例、作成ファイルの commit を
次の一歩として表示します（カタログを作らなかった場合は、後から `catalog scaffold` で追加する案内も含みます）。`run.worktree_base` は `../<リポジトリ名>-worktrees` です。個別に設定する
場合は、以下の `config init`、`config scaffold`、`register scaffold` などを利用します。

`config init` は、register 単体で始められる `prj-0001` の最小設定を作成し、設定確認、任意の
provider 設定、登録簿作成の順に次のコマンドを案内します。`run.worktree_base` は実行した
リポジトリのディレクトリ名から `../<リポジトリ名>-worktrees` として設定します。あわせて、依存の
`node_modules/` と生成物（`generated/` 配下、`.specdojo/doc-index.json`、exec の実行ロック）を除外する行を
`.gitignore` へ追記します。既存の行は変更せず、足りない行だけを追記するため、何度実行しても結果は
変わりません。`node_modules`、`/node_modules`、`**/node_modules` など同じ意味の行が既にある場合、
`node_modules/` は追記しません。設定ファイルが既にある場合も `.gitignore` の確認だけは行います。
追記した行と飛ばした行を表示し、追記があった場合は管理済みの `node_modules/` や生成物を
`git rm -r --cached` で外す手順を案内します。`config init --dry-run` は設定と `.gitignore` を
書き込まず、予定の内容だけを表示します。`config scaffold` の `--provider` には
`antigravity`、`claude`、`codex`、`copilot`、`opencode` を指定でき、`--dry-run` と `--force` も利用できます。

`package.json` がある場合、provider ごとのオーケストレーター起動スクリプトも追加します。Claude Code は `orch:opus`・`orch:sonnet`、Codex は `orch:sol`（`gpt-5.6-sol`）・`orch:terra`（`gpt-5.6-terra`）、Antigravity は `orch:flash`（`gemini-3.8-flash-high`）、OpenCode は `orch:opencode` です。既存のスクリプトは `--force` を付けても上書きしません。

`antigravity` に限り `--global` を指定すると、`~/.gemini/antigravity-cli/settings.json` へ SpecDojo 用の permission rule を追記します。既存キー・既存 rule は保持し、実書き込み前に timestamp 付きバックアップを作ります。`--global` を省略した通常実行はユーザーディレクトリへ触れません。適用前は次の dry-run で追加 rule を確認してください。

```bash
specdojo config scaffold --provider antigravity --global --dry-run
specdojo config scaffold --provider antigravity --global
```

`--force` はリポジトリ内の scaffold ファイルだけを上書きし、グローバル設定の既存項目は上書きしません。従来の `exec scaffold --provider antigravity` でも同じ `--global` / `--dry-run` の挙動を利用できます。

`config scaffold --workspace` は、`.specdojo/specdojo.config.json` の `repos` 宣言から VS Code のマルチルートワークスペース（`<project-id>.code-workspace`）をリポジトリルートに生成します。`folders` にはプロジェクトリポジトリ（`.`）と各プロダクトリポジトリ（`repos[].path`）を宣言順に並べ、別リポジトリ構成でも 1 つの VS Code ウィンドウでプロジェクトとプロダクトを同時に開けます。`--project <id>` で対象 project を指定でき、省略時は `current_project` を使います。既存のファイルは `--force` を指定しない限り上書きしません。`repos` が宣言されていない project ではエラーになります。`--dry-run` は書き込まず予定の内容だけを表示します。

```bash
specdojo config scaffold --workspace
specdojo config scaffold --workspace --project prj-0002 --dry-run
specdojo config scaffold --workspace --force
```

`config migrate-members` は、各 project の `pm-members.yaml` から `type: agent` の member を取り出し、トップレベルの `agent_members_path`（既定 `.specdojo/agent-members.yaml`）へ統合します。通常実行前に `--dry-run` で対象と件数を確認してください。`--project <id>` を指定すると 1 project だけを対象にします。

`current_project` を設定しておくと、多くのコマンドで `--project` を省略できます。

### 2.1. kata

`kata` は、利用リポジトリで上書きした型（Kata）と npm package から参照中の型を確認・取得します。対象種別は rulebook / standard / recipe / sample / template です。同じ正準パスにファイルがある場合は利用リポジトリ側を優先します。

| コマンド         | 用途                                                    | 例                                               |
| ---------------- | ------------------------------------------------------- | ------------------------------------------------ |
| `kata list`      | kata を解決元と eject 可否つきで一覧表示                | `specdojo kata list --all`                       |
| `kata show <id>` | 解決順序に従って kata の内容を表示                      | `specdojo kata show specdojo:pjr-rulebook`       |
| `kata status`    | 参照中 / eject 済みと package 原本との差分を表示        | `specdojo kata status --kind template`           |
| `kata eject`     | package の 1 ファイルを利用リポジトリの正準パスへコピー | `specdojo kata eject --id specdojo:pjr-rulebook` |
| `kata install`   | eject 可能な全種別を利用リポジトリへコピー              | `specdojo kata install --all --dry-run`          |

主要オプション:

| オプション      | 用途                                                                                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--kind <kind>` | `list` / `show` / `status` を対象種別で絞る                                                                                                              |
| `--dry-run`     | コピー系では予定だけを表示する。閲覧系でも共通指定として受理する                                                                                         |
| `--force`       | `eject` / `install --all` で既存ファイルを上書きする                                                                                                     |
| `--all`         | `list` で eject できない `exec-template` / `schema` も表示する。`install` では rulebook / standard / recipe / sample / template の全ファイルを対象にする |

`status` の `ejected` は利用リポジトリ側を参照している状態、`referenced` は package 側を参照している状態です。eject 済みのファイルは package 原本と比較し、`same` / `modified` / `package-missing` を表示します。

`list` は既定で eject できる種別だけを表示します。`EJECTABLE` 列が `no` の `exec-template` と `schema` は `--all` または `--kind exec-template` のように種別を指定したときに表示します。これらの ID は frontmatter を持たないためファイル名由来（`xep-template`、`dct-plan.schema`）になり、`specdojo:` の接頭辞が付きません。`show` は種別を問わず参照できます。

`eject` と `install --all` は既存ファイルを `--force` なしで上書きせず、`skip` として表示します。CLI と同じバージョンで使う必要がある `exec-templates` と `schemas` は個別 eject の対象外で、指定すると参照固定である旨を表示して終了コード 1 で終わります。`install --all` は docs サイト配信やオフライン運用向けの明示的な全量取得であり、通常のセットアップ導線では使用しません。

## 3. catalog / deliverable

`catalog` は成果物カタログ（`dct-*.yaml`）を扱います。

| コマンド           | 用途                                     | 例                                             |
| ------------------ | ---------------------------------------- | ---------------------------------------------- |
| `catalog scaffold` | テンプレートから `dct-*.yaml` を生成する | `specdojo catalog scaffold --project prj-0001` |
| `catalog where`    | catalog 関連パスを表示する               | `specdojo catalog where --project prj-0001`    |
| `catalog validate` | `dct-*.yaml` を検証する                  | `specdojo catalog validate --project prj-0001` |
| `catalog build`    | `generated/dct-*.md` を生成する          | `specdojo catalog build --project prj-0001`    |

`deliverable` はカタログが指す、人が編集する成果物ファイル本体を扱います。

| コマンド               | 用途                                                                    | 例                                                                                 |
| ---------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `deliverable scaffold` | `dct-*.yaml` が指す成果物ファイル本体を生成する                         | `specdojo deliverable scaffold --project prj-0001`                                 |
| `deliverable trash`    | 非推奨化した成果物ファイルを `trash` ディレクトリへ移動する（idは不変） | `specdojo deliverable trash --project prj-0001 --local-id cdfd-register-operation` |

主要オプション:

| オプション           | 用途                                                                      |
| -------------------- | ------------------------------------------------------------------------- |
| `--size <size>`      | `small` / `medium` / `large` の成果物セットを選ぶ                         |
| `--project-id <id>`  | 生成ファイルに埋め込む project ID を上書きする                            |
| `--domain <domain>`  | `catalog scaffold` の対象をtemplateの`domain`で絞る（反復・カンマ区切り） |
| `--var <NAME=value>` | `catalog scaffold` で`_NAME_` placeholderを置換する（反復可能）           |
| `--plan`             | 保存済みの `dct-plan-<domain>.yaml` から決定論的に生成する                |
| `--dry-run`          | `--plan` の生成結果と既存ファイルとの差分を、書き込まずに表示する         |
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

`deliverable scaffold` が使用する template は、各成果物の `rulebook` を辿り、rulebook frontmatter の `template` 文書 ID から解決します。同じ rulebook を参照する成果物は template を共有できます。`template: not-needed`、`template: undecided`、項目省略では template を使用せず、最小雛形を生成します。`local_id` と同名の template を暗黙には探索しません。

```bash
specdojo deliverable scaffold --project prj-0001 --dct project-definition
specdojo deliverable scaffold --project prj-0001 --dct dct-project-definition.yaml,dct-project-management.yaml
```

`deliverable scaffold` の生成方針と `specdojo build` に含めない理由は [遂行の技活用ガイド](../guides/waza-guide.md) の `deliverable scaffold の生成方針`、生成系動詞の使い分けは同ガイドの `生成系動詞の標準`、成果物カタログから Schedule への展開は [Schedule設計ガイド](../guides/schedule-design-guide.md) の `成果物カタログとの責務分担` を参照します。

### 3.1. catalog plan（成果物インスタンスの判定）

`catalog plan` は、data-flow 等の上流成果物からどの成果物インスタンスが必要かを agent が判定した結果（`dct-plan-<domain>.yaml`）を扱います。判定結果はカタログディレクトリ配下の `plans/` に保存し、後続の決定論的ジェネレーターの入力にします。

| コマンド                | 用途                                                          | 例                                                                     |
| ----------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `catalog plan prompt`   | agent へ渡す判定指示（入力文書・出力規約）を出力する          | `specdojo catalog plan prompt --project prj-0001 --domain data-flow`   |
| `catalog plan scaffold` | 判定計画の骨組みを作る、または agent の判定結果を検証保存する | `specdojo catalog plan scaffold --project prj-0001 --domain data-flow` |
| `catalog plan validate` | 保存済みの `dct-plan-*.yaml` を検証する                       | `specdojo catalog plan validate --project prj-0001`                    |

主要オプション:

| オプション          | 用途                                                       |
| ------------------- | ---------------------------------------------------------- |
| `--domain <domain>` | 対象ドメインを指定する（`prompt` / `scaffold` は必須）     |
| `--input <path>`    | data-flow 以外の上流成果物を入力として明示する（反復可能） |
| `--from <path>`     | agent が出力した判定計画を検証して正準パスへ保存する       |
| `--out <path>`      | `catalog plan prompt` の出力をファイルへ書き出す           |
| `--dry-run`         | 書き込まずに差分を表示する                                 |
| `--force`           | 既存の判定計画を上書きする                                 |

運用手順は次のとおりです。

```bash
specdojo catalog plan prompt --project prj-0001 --domain data-flow --out logs/dct-plan-prompt.md
# 上記の指示で agent に判定させ、出力 YAML を保存先候補へ書き出す
specdojo catalog plan scaffold --project prj-0001 --domain data-flow --from <agent-output>.yaml
specdojo catalog plan validate --project prj-0001 --domain data-flow
specdojo catalog scaffold --project prj-0001 --domain data-flow --plan --dry-run
specdojo catalog scaffold --project prj-0001 --domain data-flow --plan
```

`catalog plan scaffold` は、`--from` を省略すると入力文書と未確定事項だけを埋めた骨組みを作ります。既存の判定計画がある場合は上書きせず、差分を表示して終了します。上書きは `--force` で明示します。

判定に使う data-flow 成果物が 1 件も無いドメインでは、`--input` で上流成果物を明示しない限りエラーで終了します。`trash/` へ移動した非推奨成果物は入力に含めません。既に `dct-<domain>.yaml` があるドメインでは、既存カタログを基準線として入力に記録し、差分レビューを促す警告を出します。

検証では、スキーマ適合に加えて、template との対応、placeholder の解決、パターンA / パターンBの整合、`local_id` の重複、`depends_on` の解決を確認します。未解決の placeholder や根拠の無い判断はエラーになり、`open_questions` へ移すよう促されます。スキーマ単体で検証する場合は次を実行します。

`catalog scaffold --plan` は判定済み plan と同じ `domain` の template をすべて読み、通常の scaffold と同じ `min_size`・placeholder・`part_of`・group・base path 規則で `dct-<domain>.yaml` を生成します。物理分割 template は `dct-<domain>-<part>.yaml` のまま生成します。検証エラーや既存ファイル競合が一件でもあれば、その domain のファイルは一件も書き込みません。既存内容を変更する場合は、`--dry-run` の差分を確認してから `--force` を指定します。

```bash
npm run validate:schema:file -- \
  --schema docs/specdojo/schemas/v1/dct-plan.schema.yaml \
  --data "docs/ja/**/plans/dct-plan-*.yaml" --allow-empty
```

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

### 4.1. schedule strategy（決定論的な strategy 生成）

`schedule strategy generate` は、DCT、Timeline、strategy の `approach_rules`、Kata の保存済み grade、標準 strategy profile から `sch-strategy-<track>.yaml` を生成します。先に strategy へ scope と成果物別 intent を宣言してください。

```bash
specdojo schedule strategy generate \
  --project prj-0001 \
  --track data-model \
  --default-owner ARC \
  --gate-owner PM \
  --milestone-owner PM \
  --dry-run
specdojo schedule strategy generate \
  --project prj-0001 \
  --track data-model \
  --default-owner ARC \
  --gate-owner PM \
  --milestone-owner PM
```

主要オプション:

| オプション                 | 用途                                                               |
| -------------------------- | ------------------------------------------------------------------ |
| `--owner <local_id=ROLE>`  | 一成果物の主担当を明示する（反復可能）                             |
| `--default-owner <ROLE>`   | 既存 strategy から解決できない成果物の既定主担当                   |
| `--gate-owner <ROLE>`      | 生成する phase gate の owner                                       |
| `--milestone-owner <ROLE>` | 生成する group milestone の owner                                  |
| `--pass-owner <ROLE>`      | owner が複数にまたがる横断 pass の主担当                           |
| `--no-bootstrap-ordering`  | 非 bootstrap 成果物を代表 bootstrap の後へ置く既定動作を無効にする |
| `--dry-run` / `--force`    | 差分だけを表示する / 確認済みの差分で既存 strategy を上書きする    |

主担当の解決順は `--owner`、既存 strategy の `owner_rules`、`--default-owner` です。DCT の `done_criteria.roles` はレビュー担当であり、主担当として複製しません。主担当、gate / milestone / pass owner を決定できない場合、または `pm-roles.yaml` に存在しない場合は推測せず停止します。

書き込み前に intent の網羅・重複、追加パラメータ、都度収集した facts、必要な grade、scope で選択した全 `kind: work` の網羅、`scope.catalogs[].local_ids` の実在、strategy schema、project ID、参照、milestone ID 重複、`schedule build --dry-run` 相当を検証します。catalog の `local_ids` を省略した場合は従来どおり対象 kind の全成果物、指定した場合はその部分集合だけを生成します。不足時は暫定値で進めず停止します。既存 strategy は `--force` なしで保護し、同一内容の再生成は `Unchanged` として書き込みません。生成後は `schedule build --track <track> --force`、`exec refresh` の順に既存コマンドを実行します。

## 5. timeline

`timeline` は、人間が着手前に決めた `tml-index.yaml`（トラック順序計画）から、着手順序と成果物カタログ作成の準備情報を生成します。`tml-index.yaml` が正本で、生成物は `timeline/generated/` へ出力する一方通行の流れです。

| コマンド         | 用途                                                    | 例                                           |
| ---------------- | ------------------------------------------------------- | -------------------------------------------- |
| `timeline build` | `tml-index.yaml` から着手順序と scaffold 対象を生成する | `specdojo timeline build --project prj-0001` |
| `timeline where` | timeline 関連パスを表示する                             | `specdojo timeline where --project prj-0001` |

主要オプション:

| オプション  | 用途                                     |
| ----------- | ---------------------------------------- |
| `--dry-run` | 生成内容を標準出力へ表示し、書き込まない |

生成物は次の3つです。

| ファイル              | 内容                                                                     |
| --------------------- | ------------------------------------------------------------------------ |
| `timeline-order.md`   | `order` / `parallel_group` / `depends_on` から算出した着手 wave 一覧     |
| `catalog-scaffold.md` | `dct-<domain>.yaml` が未作成のドメインと `catalog scaffold` 実行コマンド |
| `timeline.json`       | 後続コマンドが読む機械可読サマリー                                       |

`depends_on` の未定義参照・循環、`depends_on` と `order` の矛盾、track id の重複を検出した場合は、生成物を書き込まずに終了コード 1 で停止します。`catalog_status` と実カタログの有無が食い違う場合は警告のみを出します。カタログの突き合わせはファイル名ではなく各 `dct-*.yaml` の `domain` 値で行うため、1 ドメインが複数ファイルに分割されていても検出できます。

`timeline_path` は未設定の場合、プロジェクト直下の `timeline` を既定とします。記述ルールは [タイムライン作成ルール](../rulebooks/tml-rulebook.md)、生成フローと運用タイミングは [Timeline設計ガイド](../guides/timeline-design-guide.md)、トラックの標準構成と実行順序は [トラック設計ガイド](../guides/track-design-guide.md) を参照します。

## 6. register

`register` は個票を正本とするプロジェクト登録簿と、その生成ビューを扱います。

| コマンド            | 用途                                           | 例                                                                          |
| ------------------- | ---------------------------------------------- | --------------------------------------------------------------------------- |
| `register scaffold` | 登録簿ディレクトリと生成ビューを初期化する     | `specdojo register scaffold --project prj-0001`                             |
| `register add`      | issue / todo / question などの項目を追加する   | `specdojo register add --project prj-0001 --type issue --title "確認事項"`  |
| `register build`    | 個票から登録項目一覧と派生ビューを生成する     | `specdojo register build --project prj-0001`                                |
| `register update`   | 登録項目を更新する                             | `specdojo register update --project prj-0001 --id PJR-001 --owner PM`       |
| `register start`    | 項目を対応中へ変更する                         | `specdojo register start --project prj-0001 --id PJR-001`                   |
| `register wait`     | 項目を待ち状態へ変更する                       | `specdojo register wait --project prj-0001 --id PJR-001`                    |
| `register review`   | 項目をレビュー状態へ変更する                   | `specdojo register review --project prj-0001 --id PJR-001`                  |
| `register close`    | 項目を完了にし、個票を `ready` へ昇格する      | `specdojo register close --project prj-0001 --id PJR-001`                   |
| `register reject`   | 項目を却下にし、個票を `deprecated` にする     | `specdojo register reject --project prj-0001 --id PJR-001`                  |
| `register defer`    | 項目を延期にする                               | `specdojo register defer --project prj-0001 --id PJR-001`                   |
| `register reopen`   | 終了済み項目を再オープンする                   | `specdojo register reopen --project prj-0001 --id PJR-001`                  |
| `register renumber` | 重複・衝突した PJR-ID を未使用の ID へ移す     | `specdojo register renumber --project prj-0001 --id PJR-0137 --to PJR-0140` |
| `register history`  | 追記型 event と旧 Git 履歴から変更を再構成する | `specdojo register history --project prj-0001 --since 2026-08-01`           |
| `register migrate`  | 旧形式の登録簿データを現行形式へ移行する       | `specdojo register migrate --project prj-0001 --dry-run`                    |

`register add` は ID を省略すると自動採番し、現在の project では現在の作業ツリーに type 別の個票を作成します。別 project を `--project` で指定して `--commit` を付けると、対象 project の統合ブランチを開いている worktree、または CLI が作る一時 worktree で起票・再生成・commit を完了します。ID は乱数部分を持ち、曖昧文字（`I` / `L` / `O` / `U`）を除いた英大文字+数字の 32 文字セットによる 4 桁（例: `PJR-4B7K`）です。個票 Frontmatter が分類、処理状態、優先度、担当、日付、結論の正本であり、`register build` は個票から一覧と派生ビューを生成します。`register` 系コマンドはすべて、成功時の通常出力を標準出力へ、エラーメッセージを標準エラー出力へ書きます。

主要オプション:

| オプション                | 用途                                                          | 対象                                             |
| ------------------------- | ------------------------------------------------------------- | ------------------------------------------------ |
| `--to <PJR-ID>`           | 移動先の PJR-ID を指定する                                    | `renumber`                                       |
| `--registered <datetime>` | 起票日時（タイムゾーン付き RFC 3339）。省略時は実行時刻       | `add`                                            |
| `--completed <datetime>`  | 完了・却下日時（タイムゾーン付き RFC 3339）。省略時は実行時刻 | `close` / `reject`                               |
| `--by <actor>`            | 名簿または予約一覧の actor を追記型 event に記録する          | `add` / 更新 / 遷移コマンド                      |
| `--reason <text>`         | event の理由を記録（`wait` では `block_reason` も更新）       | `add` / 更新 / 遷移コマンド                      |
| `--conclusion <text>`     | 終端時の結論を記録・更新（`update` では `-` で削除）          | `add` / `update` / 終端コマンド                  |
| `--block-reason <text>`   | `waiting` の理由を更新（`-` で削除）                          | `update`                                         |
| `--approach <approach>`   | 個票の進め方を指定（`update` では `-` で削除）                | `add` / `update`                                 |
| `--target <doc-id>`       | 対象文書 ID を指定（繰り返し可、`update` では `-` で削除）    | `add` / `update`                                 |
| `--topic <slug>`          | 個票ファイル名と文書 ID の論点部分を指定・更新する            | `add` / `update`                                 |
| `--commit`                | `register lifecycle` 枠内で記帳・再生成・commitを行う         | `add` / `update` / `renumber` / 遷移             |
| `-m, --message <message>` | `--commit` のcommitメッセージを上書きする                     | `add` / `update` / `renumber` / 遷移             |
| `--dry-run`               | 書き込みを行わず変更対象を表示する                            | `add` / `update` / `renumber` / 遷移 / `migrate` |
| `--since <date>`          | 対象コミットの開始日（`YYYY-MM-DD`、当日を含む）              | `history`                                        |
| `--until <date>`          | 対象コミットの終了日（`YYYY-MM-DD`、当日を含む）              | `history`                                        |
| `--id <PJR-ID...>`        | 出力する項目を限定する（空白・カンマ区切りで複数可）          | `history`                                        |
| `--status-only`           | 追加・削除・状態遷移だけを出力する                            | `history`                                        |
| `--limit <count>`         | 走査するコミット数の上限                                      | `history`                                        |
| `--json`                  | イベントを JSON で出力する                                    | `history`                                        |

`register add` は個票 Frontmatter の `registered_at`（起票日時）を、`register close` / `register reject` は `completed_at`（完了・却下日時）を自動記入します。値は UTC の RFC 3339・秒精度（例: `2026-08-09T14:08:51Z`）で、OS / コンテナの `TZ` 環境変数には依存しません。`register reopen` は `completed_at` を削除します。

`register` の `--by` は、project の `pm-members.yaml` にある人の nickname、`.specdojo/agent-members.yaml` にある agent の nickname または alias、予約 actor の `SpecDojo`・`specdojo-orchestrator`・`night-orchestrator` だけを受け付けます。agent alias は実体名で event に記録し、未知の値は書き込み前に拒否します。省略時は `SpecDojo` です。決定・承認では `PO` などの Role code や予約 actor ではなく、本人の nickname を指定します。

`--approach` を指定する場合、`--target` は 1 件だけ必須です。成果物を作成・修正する approach の対象は成果物カタログの doc id で解決するため、まだ文書がない成果物も指定できます。kata maintenance の対象は文書索引で解決し、approach に対応する kata 種別との一致も書き込み前に検証します。

`item_type: note` は `open` のまま更新する記録です。`register close` / `register reject` / `register defer` は終了コード 1 で拒否し、対応・回答・判断が必要な場合は `todo` / `question` / `decision` など目的に合う別の `item_type` で起票するよう案内します。本文の追記や修正には `register update` を使用できます。

`--registered` / `--completed` にはタイムゾーン付きの RFC 3339 値（`2026-08-09T14:08:51Z` または `2026-08-09T23:08:51+09:00`）を指定し、保存時に UTC へ正規化します。タイムゾーンを含まない値は解釈が実行環境に依存するため受け付けません。期限（`--due`）は瞬間ではなく暦日のため `YYYY-MM-DD` のままです。

`register update --topic <slug>` は個票のファイル名と Frontmatter の文書 ID を同時に変更し、`docs/ja` 配下の旧文書 ID 参照を更新してから生成ビューを再生成します。変更は `action: update` の event に文書 ID の変更として記録されます。形式は英小文字・数字・単一ハイフン区切りに限り、変更先ファイルが存在する場合は書き込み前に停止します。

`register add --from <ID>` は、起票の元になった登録項目を個票 Frontmatter の `derived_from` へ記録します。`--from` は複数回指定でき、同じ project の項目は `PJR-XXXX`、別 project の項目は `<project-id>:PJR-XXXX` を使います。自己参照、未設定の project、存在しない項目は書き込み前に拒否します。別 project の項目は、その project の `integration_branch`（省略時は `project/<project-id>/develop`）の Git tree を読んで存在を確認します。`register update --from <ID>` は一覧を置換し、`--from -` で削除します。`register build` は `generated/pjr-derived-items.md` を生成し、元の項目から派生先を逆引きできるようにします。decision から todo を起票するときも、この関係を追跡先として使います。

`register add --approach <approach> --target <doc-id>` は、個票 Frontmatter に進め方と対象を書きます。`approach` を指定すると対象は 1 件だけ必須です。成果物を作成・修正する進め方は成果物カタログにある文書を、`rulebook-maintenance` などの保守の進め方は名前に対応する kata 種別を対象にします。文書索引で解決できない ID、対象種別の不一致、複数対象との組み合わせは書き込み前に拒否します。`approach` を指定しない `--target` は複数回指定でき、従来どおり変更網羅検証の対象宣言として使えます。`register update` でも同じ検証を行います。

記帳系コマンドの `--commit` は、register の worktree 実行と同じ project の `register lifecycle` 枠を取得してから、記帳、`register build` 相当の検証・派生ビュー再生成、pathspec を限定した commit を行います。commit 対象はコマンドが新たに変更した個票・event・参照文書だけで、開始前からあるほかの変更を含めません。対象個票・event・参照文書に開始前の未 commit 変更がある場合は、既存差分との混在を避けるため記帳前に停止します。既定件名は `docs(register PJR-XXXX): <command> <title>` で、`-m` / `--message` により上書きできます。`--dry-run --commit` は変更予定だけを表示し、枠の取得と commit は行いません。

別 project への `register add` は `--commit` が必須です。対象 project の登録簿に未 commit 変更がある場合、または統合ブランチがローカルに存在しない場合は、何も書き込まず終了コード 1 で停止します。元の worktree とブランチは変更しません。`close`、`reject` など別 project の状態遷移は受け付けず、対象 project の worktree での実行を案内します。

一覧・派生ビューの「登録日」「完了日」は、保存した日時を config の `run.register_date_timezone`（IANA タイムゾーン名、既定 `UTC`）へ変換して導出する表示値です。

`register migrate` は旧形式の登録簿データを現行形式へ移す一度限りの移行コマンドです。追跡対象だった `pjr-index.md` の表を個票 Frontmatter へ移し、旧日時を UTC へ変換し、個票内の `register_events` を `events/pjr-XXXX.yaml` へ分離します。イベントがまだない項目は、利用可能な Git 履歴を項目別イベントファイルへ変換します。event ID は commit・項目 ID・変更内容から決定的に生成するため、再実行で重複しません。

`register history` は `events/pjr-XXXX.yaml` を読み、個票単位の追加（`added`）と変更（`updated`）を発生順に出力します。event 導入前または未移行の期間だけ Git 履歴を読み、削除（`removed`）を含む従来の履歴と統合します。event は発生日時・actor・action・reason・遷移前後状態・変更フィールドを保持するため、複数遷移を1コミットへまとめても粒度を失いません。比較対象は登録項目一覧の列と `block_reason`、`approach`、`targets`、`derived_from` です。

各書き込みコマンドは現在値を個票へ、event を項目別イベントファイルへ反映します。同じ現在値になる操作の再実行では event を追加しません。`register build` は個票とイベントファイルの対応、event の schema、ID 一意性、時刻順、直前イベント参照、状態連鎖、最新 event と現在値の一致を検証します。

登録項目を agent に実行させるには `exec run --register` を使います（`exec` の章を参照）。

`renumber` による ID 重複の復旧手順、登録の判断、type の選び方、状態遷移、個票の作成などの台帳運用は [登録簿運用ガイド](../guides/register-operation-guide.md) を参照します。

## 7. exec

`exec` は schedule に基づいたタスクの実行、状態追跡、plan/result 生成、worktree 隔離実行を扱います。

| コマンド         | 用途                                                                                                          | 例                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `exec where`     | execution 関連パスを表示する                                                                                  | `specdojo exec where --project prj-0001`                                                                |
| `exec validate`  | schedule と event を検証する                                                                                  | `specdojo exec validate --project prj-0001`                                                             |
| `exec refresh`   | state、Ready、CPM、gantt-chart を再計算する                                                                   | `specdojo exec refresh --project prj-0001`                                                              |
| `exec scheduler` | 次のタスクを自動選択して claim する（`--dry-run` で選択のみ）                                                 | `specdojo exec scheduler --project prj-0001 --by agent-1`                                               |
| `exec claim`     | タスクを `doing` にする                                                                                       | `specdojo exec claim --project prj-0001 --task <task-id> --by agent-1`                                  |
| `exec complete`  | タスクを `done` にする（actor の `doing` が1件なら `--task` 省略可）                                          | `specdojo exec complete --project prj-0001 --by agent-1`                                                |
| `exec reopen`    | 誤って完了したタスクを `done` から `todo` に戻す                                                              | `specdojo exec reopen --project prj-0001 --task <task-id> --by indie --msg "completion criteria unmet"` |
| `exec block`     | タスクを `blocked` にする                                                                                     | `specdojo exec block --project prj-0001 --task <task-id> --by agent-1 --msg "waiting"`                  |
| `exec unblock`   | `blocked` を `doing` に戻す                                                                                   | `specdojo exec unblock --project prj-0001 --task <task-id> --by agent-1 --msg "resume"`                 |
| `exec release`   | `doing` / `blocked` を `todo` に戻す                                                                          | `specdojo exec release --project prj-0001 --task <task-id> --by agent-1`                                |
| `exec cancel`    | `todo` を `cancelled` にする                                                                                  | `specdojo exec cancel --project prj-0001 --task <task-id> --by agent-1 --msg "scope removed"`           |
| `exec note`      | メモイベントを残す                                                                                            | `specdojo exec note --project prj-0001 --task <task-id> --by agent-1 --msg "memo"`                      |
| `exec link`      | 外部参照イベントを残す                                                                                        | `specdojo exec link --project prj-0001 --task <task-id> --by agent-1 --ref pr=https://example.com/pr/1` |
| `exec estimate`  | 見積もりイベントを残す                                                                                        | `specdojo exec estimate --project prj-0001 --task <task-id> --by agent-1 --meta duration_days=1`        |
| `exec run`       | plan を生成してエージェントを実行する                                                                         | `specdojo exec run --project prj-0001 --task <task-id>`                                                 |
| `exec handoff`   | block された保護設定の提案差分を確認し、統合先へ適用して commit する                                          | `specdojo exec handoff apply --project prj-0001 --register PJR-0012`                                    |
| `exec resume`    | `doing`、または due な利用制限延期 task を既存 worktree で再開する                                            | `specdojo exec resume --project prj-0001 --due`                                                         |
| `exec cycle`     | 延期 task 再開・doc-index 再構築・古い track の再生成・状態再計算・`--auto` loop を単一ロック内で順次実行する | `specdojo exec cycle --project prj-0001 --loop`                                                         |
| `exec slots`     | 同じ project の exec run が共有する枠（`--join`・provider・親検証など）の上限と使用数を表示する               | `specdojo exec slots --project prj-0001`                                                                |
| `exec trial`     | 同一planを複数agentで隔離試行し、比較・評価・採否を管理する                                                   | `specdojo exec trial run --project prj-0001 --plan <path> --agent agent-a agent-b`                      |
| `exec status`    | 実行状態を表示する                                                                                            | `specdojo exec status --project prj-0001 --state blocked`                                               |
| `exec scaffold`  | 共通レビュー観点を継承するプロジェクト差分を生成する                                                          | `specdojo exec scaffold --project prj-0001`                                                             |
| `exec plan`      | plan だけを生成する                                                                                           | `specdojo exec plan --project prj-0001 --task <task-id>`                                                |
| `exec archive`   | 完了済み plan を `done/` へ移動する                                                                           | `specdojo exec archive --project prj-0001 --task <task-id>`                                             |

`exec scaffold --project <project-id>` は、対象 project の `viewpoints_path` へ `extends: specdojo:pm-review-viewpoints` を持つ空の差分ファイルを生成します。共通正本は [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] であり、scaffold 時点の全量コピーは作りません。そのため、共通側の更新は次回の review plan 生成時に継承 project へ反映されます。既存ファイルは既定で保持し、`--force` の指定時だけ差分雛形で置き換えます。

プロジェクト差分の upsert、無効化、独自ロールの宣言規則は [[specdojo:review-guide|レビューガイド]] を参照してください。provider 設定の推奨入口は `config scaffold --provider <name>` です。従来の `exec scaffold --provider <name>` も互換入口として同じ設定一式を生成します。

状態イベントの `--msg` は、イベント種別によって必須・省略可が分かれます。

| コマンド                                               | `--msg` | 省略時に記録される固定メッセージ                                                  |
| ------------------------------------------------------ | ------- | --------------------------------------------------------------------------------- |
| `claim` / `complete` / `release` / `link` / `estimate` | 省略可  | `claim task` / `complete task` / `release task` / `link refs` / `update estimate` |
| `note` / `block` / `unblock` / `reopen` / `cancel`     | 必須    | -（内容・理由・再開根拠をメッセージ自体が表すため）                               |

主要オプション:

| オプション                             | 用途                                                                                                     | 対象                                                                            |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `--task <task-id>`                     | 対象タスクを指定する                                                                                     | 状態遷移系 / `run` / `plan`                                                     |
| `--by <actor>`                         | 実行 actor / agent の nickname を指定する（手動ターゲットの agent 選択も兼ねる）                         | 状態遷移系 / `run` / `resume` / `worktree agent`                                |
| `--edit-by <nickname>`                 | `--auto` バッチで edit タスクに使う agent nickname                                                       | `run --auto` / `resume`                                                         |
| `--review-by <nickname>`               | `--auto` の review タスク、または register の統合後 review に使う agent nickname                         | `run --auto` / `run --register --post-review` / `resume`                        |
| `--strategy <name>`                    | 選択戦略を切り替える（`critical-first` 既定 / `fifo`）                                                   | `scheduler` / `run --auto`                                                      |
| `--auto` / `--loop`                    | Ready タスクを自動選択する / Ready がなくなるまで繰り返す                                                | `run`                                                                           |
| `--parallel <n>`                       | 同時に走らせる agent 数の上限を指定する                                                                  | `run --auto` / register の worktree モード                                      |
| `--worktree`                           | worktree に隔離して実行する                                                                              | `run --task` / `run --register`                                                 |
| `--in-place`                           | register 項目を現在の作業ツリーで実行する（`run.register_execution` を上書き）                           | `run --register`                                                                |
| `--track-state`                        | claim / complete の状態イベントを記録する                                                                | `run --task`                                                                    |
| `--register <PJR-ID>`                  | 登録簿の項目を実行する（空白・カンマ区切りで複数可。場所の既定は `run.register_execution`）              | `run` / `plan`                                                                  |
| `--register-filter`                    | 登録簿項目を type / priority / status / limit の条件で決定論的に選ぶ                                     | `run`                                                                           |
| `--register-commit`                    | 成功したIDごとに、その実行で生じた変更を1コミットにまとめる（worktree モードでは常に commit のため無視） | `run --register`                                                                |
| `--post-review`                        | worktree 統合後に完了 review を行い、todo / issue を verdict に応じて close または waiting にする        | `run --register --worktree`                                                     |
| `--on-failure <stop\|continue>`        | 途中失敗時に残りのIDを停止するか継続するか（既定は `stop`）                                              | `run --register`                                                                |
| `--integration-branch <repo>=<branch>` | run ごとのプロダクトリポジトリの統合先（繰り返し可）を指定する                                           | register の worktree モード                                                     |
| `--resume`                             | run が止まった段（executor / reporter / 統合）を既存 worktree と checkpoint で再開する                   | register の worktree モード                                                     |
| `--resume-from executor`               | reporter 段から再開可能な run を、既存成果を保持したまま executor 段から再開する                         | register の worktree モード（`--resume` と併用）                                |
| `--force-restart`                      | 再開可能な run の成果があっても、worktree を破棄して項目全体を再実行する                                 | register の worktree モード                                                     |
| `--join`                               | 実行中の register worktree 実行の終了を待たずに合流して並行実行する（上限は `run.max_concurrent_runs`）  | register の worktree モード                                                     |
| `--executor-by <nickname>`             | executor 段の agent。register では `PJR-ID=nickname,...` による項目別指定も可能                          | `run --auto` / `resume` / `run --register` / `run --plan` / `run --deliverable` |
| `--reporter-by <nickname>`             | executor/reporter パイプラインの reporter 段に使う agent nickname                                        | `run --auto` / `resume` / `run --register` / `run --plan` / `run --deliverable` |
| `--on-rate-limit <action>`             | 指名した agent の上限時の扱い。`stop` / `wait` / `fallback`                                              | `run` / `resume`                                                                |
| `--fallback-executor-by <name>`        | rate limit の `fallback` または接続不能時に executor 段を1回だけ引き継ぐ agent                           | `run` / `resume`                                                                |
| `--fallback-reporter-by <name>`        | rate limit の `fallback` または接続不能時に reporter 段を1回だけ引き継ぐ agent                           | `run` / `resume`                                                                |
| `--due`                                | 再開時刻を迎えた利用制限延期 task を対象にする                                                           | `resume`                                                                        |

`--plan` と `--deliverable` も Schedule のパイプライン宣言を持たないため、`--executor-by` / `--reporter-by` の少なくとも一方を指定したときだけ executor/reporter 2段階で実行します。指定しなかった段は `stage_role` による自動選択で決まります。`--plan` では reporter が scaffold 済みの result を記入するため、frontmatter に `task_id` を持つ plan が必要です。`--by` との併用はエラーです。`--by` に `stage_role` を持つ pipeline 用 agent を指定すると、result 未記入の blocked にはせず、`--executor-by` / `--reporter-by` を使うよう案内するエラーで実行前に拒否します。

指名した agent の rate limit は既定では `stop` です。`wait` は provider の reset / retry-after、次に `rate_limit_policy.cooldown_seconds` を使い、`rate_limit_policy.pinned.max_wait_seconds`（既定8時間）以内なら同じ段を同じ agent で再開します。`fallback` は対応する fallback flag または `rate_limit_policy.pinned.fallback_executor_by` / `fallback_reporter_by` の agent へ1回だけ切り替えます。fallback 未指定時と fallback agent も上限になった場合は停止します。CLI が `exec-defaults.yaml` より優先します。待機中は project の実行ロックを保持します。

`connection_error_detection` に一致する接続不能は `--on-rate-limit` の値とは独立して扱い、対応する fallback flag または設定上の fallback agent があれば1回だけ切り替えます。fallback 未指定時は通常の失敗として停止し、同じ agent の再開待ちは行いません。切替元・切替先・時刻・原因は rate limit の切替と同じ pipeline state、evidence、result の経路へ記録します。

agent の指定は repository 共通 roster nickname（`.specdojo/agent-members.yaml`）へ一本化します。手動ターゲット（`--task` / `--register` など）では `--by <nickname>`、`--auto` バッチでは mode 別に `--edit-by` / `--review-by` を使い、バッチ起動は `--auto` に一本化します。解決の優先順位は「単体指定（`--by`）＞ mode 別指定（`--edit-by` / `--review-by`）＞ 自動選択」です。

Schedule タスクの `agent_pipeline`（`sch-strategy-<track>.yaml` の phase 設定）と同じ executor/reporter 2段階（`stage_role: executor` が成果物を編集・検証し、`stage_role: reporter` が evidence から result を描画する）は、`--register` の既定の実行方式です。register 項目は Schedule のような per-item のパイプライン宣言を持たないため、owner・role からの agent 選択は行いません。`--executor-by <nickname>` と `--reporter-by <nickname>` を **両方セットで** 指定すると、その agent で実行します。`--by` と `--executor-by` / `--reporter-by` をいずれも指定しない場合は、`stage_role: executor`（`mode: edit` または `mode` 未指定）と `stage_role: reporter` の agent から `priority` 順に自動で選びます。`stage_role` を持たない agent（翻訳専用など）は自動選択の候補に入りません。どちらかの段に該当する agent がいない場合は、`--executor-by` / `--reporter-by` の指定を求めるエラーで実行前に止まります。複数項目では `--executor-by PJR-0001=exec-a,PJR-0002=exec-b` のような項目別指定も使用できます。項目別指定は選択した全項目を含む必要があり、対象外 ID と指定漏れは実行前にエラーになります。片方だけの指定もエラーになります。

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

# 複数の項目を明示的に in-place で直列実行し、成功IDごとにcommitする
specdojo exec run --project prj-0001 --register PJR-0012 PJR-0013 --in-place --register-commit

# 途中で失敗しても残りの項目を続行する（既定は失敗時に停止）
specdojo exec run --project prj-0001 --register PJR-0012,PJR-0013 --on-failure continue

# 登録簿を flat な条件で絞り込み、ID 昇順に実行する
specdojo exec run --project prj-0001 --register-filter --register-types todo --register-priorities high --register-statuses open --register-limit 3

# 成果物を worktree に隔離して実行し、統合ブランチへ merge back する
specdojo exec run --project prj-0001 --register PJR-0012 --worktree

# app1 の統合先を、この run だけローカルの feature/login にする
specdojo exec run --project prj-0001 --register PJR-0012 --worktree --integration-branch app1=feature/login

# 統合後に読み取り専用 review を行い、完了した todo / issue を自動 close する
specdojo exec run --project prj-0001 --register PJR-0012 --worktree --post-review

# 保護設定で block された提案差分を表示し、確認後に統合先へ commit する
specdojo exec handoff apply --project prj-0001 --register PJR-0012

# worktree 隔離のまま複数項目を並列実行する
specdojo exec run --project prj-0001 --register PJR-0012 PJR-0013 --worktree --parallel 2

# executor/reporter パイプラインの agent を明示して実行する（両フラグをセットで指定）
specdojo exec run --project prj-0001 --register PJR-0012 --executor-by claude-expert-executor --reporter-by claude-reporter --worktree

# 項目ごとに executor を分け、解決結果を確認してから並列実行する
specdojo exec run --project prj-0001 --register PJR-0012 PJR-0013 --executor-by PJR-0012=codex-expert-executor,PJR-0013=claude-expert-executor --reporter-by gemma-reporter --worktree --parallel 2 --dry-run

# 途中で止まった項目を、止まった段（executor、reporter、または統合）から再開する
specdojo exec run --project prj-0001 --register PJR-0012 --worktree --resume

# 親検証の失敗を成果物側で直すため、既存 worktree の executor から再開する
specdojo exec run --project prj-0001 --register PJR-0012 --worktree --resume --resume-from executor

# Job Definitionから期間ごとのRunを生成して実行する
specdojo exec run --project prj-0001 --job job-weekly-report --input period=2026-W32
```

`--register` は指定した個票の項目を実行します。`--register-filter` は `--register-types` / `--register-priorities` / `--register-statuses` のカンマ区切り条件と、正の整数の `--register-limit` で項目を選びます。条件省略時は open かつ実行可能な type が対象です。いずれも実行対象になる type は `todo` / `issue` / `change-request` / `question` / `risk` で、`decision` / `note` は対象外です。実行場所の既定は `.specdojo/exec-defaults.yaml` の `run.register_execution`（`worktree` / `in-place`）で選び、未設定時は互換性のため in-place です。`--worktree` / `--in-place` は設定を上書きし、同時指定はエラーになります。worktree モードは成果物の変更を隔離し、状態遷移（`start` / `review` / `waiting`）を直列化したうえで、成功時に merge back します。`--post-review` または `run.register_post_review: true` を指定すると、merge back の後に完了判定を行い、todo / issue を自動 close できます。`--parallel <n>` は worktree モードでのみ指定できます。

`--integration-branch <repo>=<branch>` は、register の worktree モードで、その run に限ってプロダクトリポジトリ `<repo>` の統合先を上書きします。複数リポジトリにはオプションを繰り返します。`<repo>` は `repos[].name` に宣言済みで、`<branch>` はそのリポジトリに存在する有効なローカルブランチでなければならず、リモートブランチの取得やローカルブランチの作成は行いません。同じ `<repo>` の重複、宣言にないリポジトリ、空の値は register の状態を変える前に拒否します。統合先の優先順位は「run の指定 → `repos[].integration_branch` → そのリポジトリの現在のブランチ」です。指定しない run の挙動は従来と変わりません。

複数項目を `--parallel` で実行する場合、指定は選択された各 item run に同じように適用されます。中断した run を `--resume` するときは、開始時の指定を `pipeline-state.json` から再利用するため、オプションを繰り返す必要はありません。再開時に値を再指定する場合、その値は開始時の指定と一致する必要があり、run の途中で統合先を変更・追加する指定は拒否します。result の複数リポジトリ trace には、実際に使った統合先ブランチと統合後の commit snapshot が記録されます。

`exec handoff apply --register <PJR-ID>` は、worktree 実行が `agent-config-write` で waiting になった項目の最新 result から提案差分を読み、統合先へ適用して commit します。コマンドは差分を必ず表示し、対話では `y` / `yes`、非対話実行では `--yes` による明示確認がなければ何も変更しません。提案差分がない、切り詰められている、申し送りの対象パスと一致しない、保護対象外のパスを含む、統合先へ適用できない、対象パスに既存変更がある場合は commit 前に停止します。複数リポジトリでは `# repo: <name>` で区切られた差分を、宣言済みの各統合先へ限定 commit します。`package.json` を適用した場合は、依存定義を変更したか確認して対応する lock ファイルを再生成・commit し、その後に表示された `exec run --register ... --worktree --resume` を実行します。

`--resume` は register の worktree モードで使う pipeline 実行専用オプションで、途中で止まった run を止まった段から再開します。対象 run は既存 worktree に残る最新の `pipeline-state.json` から特定し、再開段も state から決まります。executor が `running` のまま残っていれば、同じ plan/result と未コミット成果を保持した worktree 上で executor を再実行します。executor が成功済みで reporter が未完了なら、保存済みの `evidence.json` を使って reporter だけを再開します。親検証の失敗を成果物側で直す必要がある場合は `--resume-from executor` を併用すると、reporter 段から再開可能な run を executor 段へ戻せます。直前の失敗した親検証の ID と要約、または executor の block 理由は prompt の申し送りに含まれます。統合段から executor へ戻す指定、`--resume` を伴わない指定、`executor` 以外の値は拒否します。

全再開段で、agent または親検証の起動前に統合先ブランチの最新を exec branch と worktree へ取り込みます（複数リポジトリの project ではプロダクトごとの統合先も取り込みます）。worktree の未コミット成果は未追跡ファイルを含めて一時退避し、取り込み後に index を復元せず戻すため、同一ファイルの非競合変更も両方保持できます。commit 済み変更または退避した成果の復元が競合する場合は同期 merge を巻き戻し、executor の成果を元の worktree へ戻してから、register の状態を変えずに再開を拒否します。親検証の記録が不足または失敗している場合は、現在の固定許可リストで親検証を更新してから reporter へ進みます。reporter も成功していて統合（commit → merge → worktree 撤去）だけが残っている場合は、agent を起動せずに統合段だけを再試行します。worktree や plan/result が無い、成功済み executor の evidence が欠損しているなど再開できない場合は、worktree を含め何も変更せずエラー終了します。再開可能な成果が残っている項目を `--resume` なしで再実行しようとした場合も、未統合の成果を守るために中断します。破棄して最初からやり直す場合は `--force-restart` を指定します。手順の使い分けは [exec運用ガイド](../guides/exec-operation-guide.md) を参照します。

`--by` を指定した場合は、従来どおり単一 agent が成果物編集と result 記入を1回の実行で完結します。`--by` を指定しない場合（`--executor-by` と `--reporter-by` を両方指定した場合、またはどちらも指定せず `stage_role` から自動選択した場合）は、`stage_role: executor` の agent が成果物を編集・検証し、その evidence（実行ログの要約・検証結果）を渡された `stage_role: reporter` の agent が result 本文を描画する2段階実行に切り替わります。`stage_role` が一致しない nickname を指定するとエラーになります。

register 実行の対応内容、状態追跡、commit の扱いは [登録簿運用ガイド](../guides/register-operation-guide.md)、実行フロー全体は [exec運用ガイド](../guides/exec-operation-guide.md) を参照します。

### 7.1. agent比較trial

`exec trial`は、同一タスクの既存planを複数agentへ同じ内容で渡し、agent名を含む独立worktreeとbranchで試行します。Schedule eventとregister状態は変更しません。

| サブコマンド | 用途                                                            |
| ------------ | --------------------------------------------------------------- |
| `run`        | 2つ以上のagentで試行し、客観指標を中央の比較記録へ集約する      |
| `status`     | plan/promptハッシュとagent別指標を表示する                      |
| `rate`       | 判断・文章・範囲遵守の人手評価（1〜5）と注記を記録する          |
| `adopt`      | 成功trialを現在branchへmergeし、残りのworktree/branchを破棄する |
| `discard`    | 成果を採用せず全worktree/branchを破棄し、比較記録だけを残す     |

```bash
specdojo exec trial run \
  --project prj-0001 \
  --plan docs/ja/projects/prj-0001/execution/exec/plans/<task>-plan.md \
  --base <commit-before-completed-work> \
  --agent agent-a agent-b \
  --reporter-by reporter-a \
  --parallel 2

# executorとreporterを組で比較する場合
specdojo exec trial run \
  --project prj-0001 \
  --plan docs/ja/projects/prj-0001/execution/exec/plans/<task>-plan.md \
  --base <commit-before-completed-work> \
  --pair executor-a=reporter-a executor-b=reporter-b

specdojo exec trial status --project prj-0001 --comparison <comparison-id>
specdojo exec trial rate --project prj-0001 --comparison <comparison-id> --trial agent-a --judgment-quality 4 --writing-quality 4 --scope-adherence 5
specdojo exec trial adopt --project prj-0001 --comparison <comparison-id> --trial agent-a
```

`run`はplan frontmatterの`task_id` / `mode` / `project_id`を要求します。`--base`はworktreeの起点となるcommit-ishで、省略時は従来どおりHEADです。指定値は完全なcommitへ解決され、実行開始時のHEAD（完了済み作業の参照結果）、baseがHEADの祖先か、plan内で参照されたリポジトリ相対パスが起点ツリーに存在するかという互換性確認とともに比較記録へ保存されます。plan自体が起点に存在しなくても、指定した現在のplan内容を全trialへ共通で渡します。

`--agent`と任意の`--reporter-by`を使うと、reporterなしまたは全trial共通reporterの従来方式になります。`--pair <executor>=<reporter>...`は2組以上を指定し、executorとreporterを一組として比較します。`--pair`は`--agent` / `--reporter-by`と併用できません。比較記録の`reporter_mode`には`none` / `shared` / `paired`のいずれかを保存します。各reporterについて構造化出力の成否、形式試行回数、形式再試行回数、`evidence_blocked` / `invalid_output` / `invocation_failure` / `rate_limit`の失敗分類も保存します。`evidence_blocked` は reporter の申告ではなく、executor evidence から runner が機械判定した blocked を表します。

`pipeline.parent_validations`に指定できるIDは`validate-schema`、`typecheck`、`test-unit`、`test-integration`、`lint-ts`、`lint-fm`、`lint-md`、`build`、`format-check`です（各IDは組み込み許可リストの固定argvへ解決されます）。`pipeline.parent_validations`はtrialにも適用され、executor成功後・reporter起動前に各worktreeで実行されます。親検証結果は`source: runner`付きでevidenceへ保存し、失敗時はtrialを`failed`にします。比較記録と`trial status`はexecutor・親検証・全体の時間を分け、executorの検証報告総数と`passed` / `failed` / `not_run` / `requires_human`、親検証の状態と件数を別々に表示します。採用前に親検証の成功、executorの未実施・未報告、sandbox 外で人が行う確認を確認してください。

記録先は`execution_path/exec/trials/<comparison-id>/`です。agent選定への反映は自動化せず、人が複数比較を確認して `.specdojo/agent-members.yaml` を更新します。

## 8. grade

`grade` は kata（rulebook / recipe / sample / template）または成果物を、review と同じ共通 viewpoint・category rubric で継続評価します。agent に直接ファイル探索やスコア計算をさせず、plan 生成と反映を分離します。

v0.3.0 の `grade` は試験的な機能です。npm package で利用できるのは `grade list` / `plan` / `apply` / `validate` / `result` などの部品で、通しの実行を担う `grade run` はありません。`tools/grade/run-per-document.sh` は SpecDojo 本体リポジトリの開発用であり、npm package には含まれません。成果物を `--target deliverable` で評価するには、対象 project に `catalog_path` を設定する必要があります。

| コマンド                 | 用途                                                           |
| ------------------------ | -------------------------------------------------------------- |
| `grade list`             | 選択した文書のパスを1行1件で出力し、plan は保存しない          |
| `grade plan`             | 1文書ごとに executor / reporter の評価 plan を保存する         |
| `grade apply`            | executor の申告を GradeSubmission へ機械変換して正本を反映する |
| `grade translation-plan` | 正本の英語 finding から日本語表示用の翻訳 plan を作る          |
| `grade localize`         | 訳文を件別検証し、合格した finding の `message_ja` を更新する  |
| `grade validate`         | サイドカーの内容ハッシュと finding 件数を検証する              |
| `grade result`           | 保存済み grade result を Markdown 文書のパスで表示する         |
| `grade migrate`          | インライン grade / finding をサイドカーへ一括移行する          |

```bash
specdojo grade plan --target kata --changed-only --project prj-0001
# 評価対象・参考資料・比較リファレンスを plan へ埋め込む
specdojo grade plan --target kata --changed-only --embed-documents --project prj-0001
specdojo grade list --target kata --changed-only --project prj-0001
specdojo grade plan --target kata --verdict pass --min-score 96 --max-findings 1 --project prj-0001
specdojo grade plan --target kata --ungraded --project prj-0001
specdojo grade list --target deliverable --changed-only --project prj-0001
specdojo grade plan --target deliverable --changed-only --project prj-0001
# 現在の rubric 以外で付けた結果が残る文書を数える
specdojo grade list --target kata --rubric-outdated --project prj-0001 | wc -l
# executor の最終応答の marker を GradeSubmission へ機械変換して反映する
specdojo grade apply --target kata --path <document.md> \
  --analysis-from <executor-output.txt> --by <executor-nickname>
specdojo grade validate --target kata --project prj-0001
```

`--target` は `kata` または `deliverable` です。`--path` は繰り返し指定でき、明示した Markdown 文書だけを対象にします。ただし、パス要素に `generated` を含む生成文書と `trash` を含む退避済み文書は自動探索から除外し、`--path` で明示した場合も入力エラーとして拒否します。`--changed-only` は grade result サイドカーの `content_hash` と現在の成果物ファイル全体の SHA-256 を比較します。`grade apply` はサイドカーだけを更新するため、評価結果の書き込み自体で成果物が変更扱いになることはありません。

`--changed-only` は、対象文書の本文が変わった文書に加えて、突き合わせ先が変わった文書も選びます。突き合わせ先は、対象文書に適用される継続評価の観点が `comparison_sources` で宣言したものです。`grade apply` は評価時点の突き合わせ先の SHA-256 をサイドカーの `source_hashes` へ記録し、`--changed-only` は記録と現在の値が 1 つでも異なる文書を選びます。宣言できる突き合わせ先と、`source_hashes` のキーは次のとおりです。

| `comparison_sources` の値 | `source_hashes` のキー   | hash の対象                                           |
| ------------------------- | ------------------------ | ----------------------------------------------------- |
| `catalog-entry`           | `catalog-entry`          | 成果物カタログのうち対象文書自身の項目                |
| `dependencies`            | `dependency:<local_id>`  | `depends_on` のうちカタログの Markdown 成果物への依存 |
| `schedule`                | `schedule`               | `schedule_path` 配下のファイル（`generated` を除く）  |
| `members`                 | `members`                | `members_path` のファイル                             |
| `roles`                   | `roles`                  | `roles_path` のファイル                               |
| `deliverable:<local_id>`  | `deliverable:<local_id>` | 指定したカタログ成果物のファイル                      |

`--changed-only` が検出しないものは次のとおりです。これらの変更で評価を更新する場合は、`--path` で対象を明示するか、フィルタなしの全件再評価を実行します。

- 観点の `check` や `comparison_sources` に宣言していない文書の変更。
- 評価に使うルーブリックや観点定義そのものの変更。rulebook の変更は `--rulebook-changed`、ルーブリックの版の変更は `--rubric-outdated` が扱います。
- 生成物（`generated`）の変更。生成物は生成元の変更として検出します。

`source_hashes` を持たないサイドカー（突き合わせ先の記録を導入する前の評価）は、突き合わせ先を宣言した観点が適用される場合に変更扱いとなり、次回の `--changed-only` で一度だけ選ばれます。

`--dependency-changed` は成果物だけを対象に、`depends_on` 先の現在の内容が `source_hashes` の `dependency:<local_id>` と異なる文書を選びます。依存先の評価日時は判定に使わないため、依存先を再評価しただけでは選びません。`grade apply` は突き合わせ先の宣言に関係なく、成果物の依存先の hash を記録します。

`--rubric-outdated` は、grade result サイドカーの `rubric` が、解決済みの観点定義にある `grade_rubric.id`（既定は `grade-rubric-v2`）と異なる文書を選びます。`rubric` が空の結果は、どの版で付けたか確かめられないため旧版として選びます。サイドカーがない文書は選ばず、`--ungraded` が扱います。そのため `--ungraded` との併用は入力エラーです。版の異なる結果は category と観点の構成が違い、score を比べられません。ルーブリックを改めたときは、この条件で旧版の結果を列挙して評価し直します。`grade list --rubric-outdated` の出力行数が、旧版の結果が残る文書の件数です。観点定義に `grade_rubric.id` がない場合は入力エラーとして終了します。

保存済みの判定結果では、`--verdict <pass|needs-work|fail>` で最新 verdict、`--min-score <score>` で総合 score が指定値以上、`--max-findings <count>` で全 severity の finding 合計が指定件数以下の文書に絞れます。score は 0 から 100 の整数で指定します。`--ungraded` は grade result サイドカーが存在しない文書だけ、`--incomplete` は同じ本文に対する設定済み段数の評価が未完了で連続失敗上限に達していない文書だけを選びます。`--unreviewed` は schedule タスクが割り当てられていない文書のうち、未評価または grade result サイドカーの `content_hash` が現在の内容と一致しない文書だけを選びます。複数の選択条件は AND で適用され、`--path` や `--changed-only` とも併用できます。保存済み grade を前提とする `--verdict`、`--min-score`、`--max-findings` のいずれかと `--ungraded` の併用は入力エラーです。`grade list` はこの選択規則を plan の生成や文書更新なしで利用するための機械可読な入口で、標準出力にはリポジトリ相対パスだけを辞書順で出力します。定期再評価の呼び出し側は変更済み、未評価、段未完了、旧 rubric を別々に列挙して和集合を取ります。

段の到達状況は `<execution_path>/grade/pipeline/` の文書別 JSON に保存します。`stage_completed`、`stage_failed`、`stage_total`、`consecutive_failures`、`max_failures` から再開段と上限到達を判定し、`content_hash` が現在本文と異なる古い state は再開に使いません。`grade state --target <target> --project <id> --path <document>` は現在本文に有効な state を JSON で返し、`--exhausted` は上限到達文書のパスを返します。state の更新は文書単位の実行 script が担い、pipeline 完了時にファイルを削除します。

`grade plan` は対象ごとに executor plan と reporter plan の2ファイルを生成し、既定では `<execution_path>/grade/generated/plans/<target>/` へ保存します。`generated/` 配下は再生成可能な派生生成物の置き場で、git 管理と文書索引の対象外です。`--out <directory>` で保存先を変更できます。ファイル名は対象パスから決定され、同じ対象の再生成は同じファイルを上書きするため履歴を増やしません。executor plan は評価対象を1件だけリポジトリ相対パスで示し、Kata の `rulebook` / `recipe` / `sample` / `template` 参照と逆参照から解決した対応文書も参考資料のパスとして列挙します。`--random-reference` を指定した場合は、同じ種別で `status: ready` の別文書から良い実例を1件無作為に選び、記載水準を比較するリファレンスとして記録します。Kata は同じ rulebook / recipe / sample / template 種別、成果物は同じ `specdojo.type` を候補範囲とします。実例は評価対象ではなく、`ready` も品質保証ではありません。再生成のたびに候補集合から選び直すため、同じ対象の plan でも実例だけが変わることがあります。`--random-reference` も `--reference` も指定しなければリファレンスは付けません。reporter plan は対象の固定 facts と GradeSubmission テンプレートだけを持ち、評価資料は持ちません。既定の pipeline は reporter plan を使わず、LLM reporter を明示指定して書き写しの精度を比較する場合にだけ使います。

既定では対象・参考資料・実例の本文を plan に埋め込みません。`--embed-documents` を指定した場合だけ、executor plan の「埋め込み資料」へ plan 生成時点の内容を格納します。Markdown の Frontmatter は行番号の対象外として本文と分離し、本文には Frontmatter を除く1始まりの行番号を付けます。この番号は finding の `line` と同じ基準で、通常は H1 が1行目です。埋め込み部分の上限は100,000文字です。評価対象・参考資料・実例を行番号付きで描画した合計が上限を超える場合は、CLI が警告し、当該 plan だけをパス参照へフォールバックします。上限内では、executor にファイル読み取りツールと検索ツールを使わず、埋め込み資料だけで判定するよう指示します。埋め込みは plan のサイズ増加と対象更新時の陳腐化を伴うため、既定値はパス参照のままです。

成果物の plan は、成果物カタログの `done_criteria` を `DC-001` から順に列挙し、条件文、担当 Role code、viewpoint を executor へ渡します。executor は各条件を `satisfied` / `unsatisfied` として score とは独立に申告し、`grade apply` はその判定と不足理由を `[DONE_CRITERIA]` ブロックからそのまま GradeSubmission の `done_criteria` へ変換します。`grade apply --target deliverable` は過不足を検証し、grade result サイドカーの要約と `<execution_path>/grade/criteria/` の詳細 YAML を同時に更新します。詳細は成果物ごとに1ファイルで、再評価では同じファイルを上書きします。

再評価時は、grade result サイドカーの `findings[]` から `rule`、`severity`、`line`、`anchor`、正本の `message` を前回の指摘として plan へ含めます。表示用の `message_ja` は含めません。agent は各指摘が現在も未解消かを確認し、未解消なら前回の `message` を変更せず、前回と同等以上の severity で今回の finding に含めます。`grade apply` も同じ正本 `message` の finding を未解消と扱い、提出された severity が前回より軽ければ前回値へ戻し、対応する viewpoint level を severity 上限まで補正します。日本語 `message` だけの旧記録はその日本語を互換用の正本とし、英語への翻訳とは照合しません。前回の問題が解消され、別の軽微な問題だけが残る場合は、新しい finding の `message` に引き下げの根拠を含めます。前回の観点割り当てに判定を引きずられないよう各 viewpoint を現在の根拠から独立に評価し、前回指摘にない問題も検出します。前回の level、score、verdict や解消履歴は plan に引き継ぎません。適用結果は最新サイドカーへ上書きされ、成果物本文は変更しません。

パス参照の executor は判定前に、plan が示す評価対象、すべての参考資料、選定された良い実例をファイル読み取りツールで全文読み、実行ログに各パスの読み取り操作を残します。埋め込みを使う executor は、plan に埋め込まれた同じ範囲だけを読みます。参考資料は成果物間整合、良い実例は章ごとの具体性・根拠の密度・過不足を比較する材料であり、どちらも評価対象にはしません。実例の表現や欠点を機械的に転用せず、rubric と viewpoint を最終的な判定基準にします。必要な資料を読み取れない場合は、内容を推測せず異常終了します。grade plan の Frontmatter と「このタスクで行うこと / 対象項目 / 進め方 / 完了手順 / 異常終了の条件」の章構成は exec plan に準拠します。

executor plan は JSON 契約を持ちません。各 viewpoint を `[VIEWPOINT <id>]` と `[END VIEWPOINT]` で囲み、`LEVEL: <0-4>` と、必要な `FINDING <severity> line=<line>: <message>` を申告します。新しい判定根拠と finding の `message` は英語で記述します。marker 間の根拠と検討過程は自由記述です。この軽量な申告形式により、JSON を安定して生成できない agent でも分析を完了できます。

`grade apply --analysis-from <executor-output>` を `--from` なしで実行すると、executor の最終応答の marker を解析して GradeSubmission を機械的に生成し、既存の GradeSubmission 検証を通してから反映します。LLM の reporter は起動しません。severity、line、message、done_criteria の status と reason は申告のまま写し、level だけは severity 上限を超える場合に下方向へ補正します。書き写しの誤りや JSON の構文破損は起こりません。`--submission-out <path>` を指定すると、生成した GradeSubmission をリポジトリ内のパスへ保存します（`--dry-run` では保存しません）。判定主体は executor なので、`--by <executor-nickname>` が `.specdojo/agent-members.yaml` に存在する nickname を検証してサイドカーの `graded_by` へ記録します。

executor の応答が契約を満たさない場合は、従来の忠実性検証と同じ parse と検証の条件で拒否し、理由を `$analysis` で始まるパスとともにエラーへ示します。拒否する条件は、`VIEWPOINT` / `END VIEWPOINT` / `DONE_CRITERIA` の欠落・入れ子・重複、`LEVEL` の欠落・重複・書式不正、`FINDING` の書式不正、適用されない viewpoint や viewpoint の欠落・重複、level 3 以下で finding がないこと、done_criteria の欠落・重複・未知の ID、および不足内容のない `unsatisfied` です。severity 上限だけは拒否せず level を下げます。拒否された応答は変換し直しても結果が変わらないため、再試行は executor の再実行で行います。

marker 行の書式の軽微な揺れは、正規化して受理します。対象は、行頭の空白、ブロッククオート `>`、リスト記号（`-` / `*` / `+` と空白）、および marker・`LEVEL`・`FINDING`・`DC-NNN` の見出し部分を囲む `**` です。executor が Markdown として整形しても判定内容は同じであり、拒否して再実行する費用に見合わないためです。message と reason の本文は正規化せず、`**` などの装飾も含めてそのまま記録します。文中に埋もれた `FINDING` は申告とみなしません。行頭以外の位置を許すと、根拠の説明に現れた語を申告と誤認するためです。

`--from <grade-result.json>` を併用すると、LLM reporter が返した JSON を executor marker と機械照合し、不一致、欠落、追加を拒否してから反映します。reporter の書き写しの精度を比較・検証するための経路です。

finding の忠実性照合では、message に限り、Unicode の正準等価（NFC）、連続・前後の空白、句読点周辺の空白、および `、。！？：；`（全角の `，．` を含む）と対応する ASCII 句読点を正規化します。これは reporter が内容を保ったまま起こす表記差だけを許容する境界です。英字の大小、英数字の全角・半角、括弧・ダッシュ、単語や文の言い換えは正規化しません。severity と line は常に完全一致が必要です。拒否時は、変更された severity、line、正規化後も異なる message の原文をエラーへ示します。

移行期間中は `--analysis-from` を省略し `--from` だけを指定する従来の1段構成も受理します。既存の保存済み plan や GradeSubmission を適用するための互換経路であり、新しく生成した plan では `--analysis-from` を指定します。旧 GradeSubmission の `graded_by` も入力互換性のため受理しますが、記録には使いません。

複数対象は、生成された executor plan を順に処理し、executor 応答を保存して直ちに `grade apply --path <document> --analysis-from <executor-output>` で反映します。agent 起動は `agent run`、応答の保存と受け渡しは呼び出し側が担い、`grade` は plan の生成と結果の検証・反映に限定されます。この単位で処理すると、後続文書が失敗しても適用済みの grade は保持されます。保存済み executor plan は `exec trial` などで同じ入力を複数 agent へ渡す用途にも利用できます。

### 8.1. npm package で 1 文書を評価する

npm package の部品だけで 1 文書を評価する最小手順は、plan の生成、executor agent の実行、marker の反映です。先に `.specdojo/agent-members.yaml` と agent の実行設定を用意してください。`grade plan` の出力に表示された executor plan のパスを `<executor-plan.md>` に指定し、同じ executor nickname を `agent run` と `grade apply` の `--by` に渡します。

```bash
# 1. 1 文書だけを対象に executor plan を生成する
npx specdojo grade plan --target deliverable --project <project-id> \
  --path <document.md>

# 2. 表示された executor plan を agent に渡し、marker を含む最終応答を保存する
npx specdojo agent run --project <project-id> --plan <executor-plan.md> \
  --by <executor-nickname> --out <executor-output.txt>

# 3. marker を GradeSubmission へ機械変換して grade result に反映する
npx specdojo grade apply --target deliverable --project <project-id> \
  --path <document.md> --analysis-from <executor-output.txt> \
  --by <executor-nickname>

# 4. 保存結果の内容ハッシュと finding 件数を検証する
npx specdojo grade validate --target deliverable --project <project-id>
```

成果物を扱うこの例では project の `catalog_path` が必要です。Kata を評価する場合は、各コマンドの `--target deliverable` を `--target kata` に置き換えます。複数文書の列挙、再試行、翻訳、途中状態の管理は利用者側で組み合わせる必要があります。

### 8.2. SpecDojo 本体リポジトリの文書単位 grade pipeline

この節は npm package の利用手順ではなく、SpecDojo 本体リポジトリを保守する開発者向けです。`tools/grade/run-per-document.sh` は npm package の `files` に含まれないため、公開物の利用者は実行できません。本体リポジトリで文書ごとに grade pipeline を実行する場合は、リポジトリルートからこのスクリプトを実行します。既定の `--stages 1` は codex 単段、`--stages 3` は互換用の従来構成です。`--target kata` では `--kind` に `rulebook` / `recipe` / `sample` / `template` のいずれか、または `all` を指定します。`--target deliverable` では成果物カタログの Markdown 成果物を対象にし、`--kind` は使いません。`--path` を繰り返すと明示した文書だけを処理できます。`--embed-documents` を指定すると、各段の `grade plan` に同名のオプションを渡します。選択値は Run state に保存するため、同じ `run-id` の再開時に切り替えることはできません。`--changed-only`、`--dependency-changed`、`--rulebook-changed`、`--unreviewed`、`--ungraded`、`--incomplete`、`--rubric-outdated` は `grade list` の選択結果を利用し、複数指定時は各結果の和集合を処理します。いずれも指定しない場合だけ、対象範囲の全件を処理します。既定 target は `kata`、既定 kind は `rulebook` です。

```bash
# 対象と agent / reference の確認だけを行う
tools/grade/run-per-document.sh --run-id 20260901-rulebooks --limit 3 --dry-run

# rulebook を codex 単段で評価する。同じ run-id で再実行すると中断箇所から再開する
tools/grade/run-per-document.sh --run-id 20260901-rulebooks --stages 1 --kind rulebook

# 評価対象と参考資料を plan に埋め込み、埋め込み資料だけで評価する
tools/grade/run-per-document.sh --run-id 20261004-embedded --stages 1 --kind rulebook \
  --embed-documents

# 変更済み、未評価、段未完了、または旧 rubric の4種別を最大15件再評価する
tools/grade/run-per-document.sh --run-id 20260908-recheck --kind all \
  --stages 1 --changed-only --ungraded --incomplete --rubric-outdated --limit 15

# 変更済み、未評価、段未完了、または旧 rubric の成果物を最大10件再評価する
tools/grade/run-per-document.sh --run-id 20260912-deliverables --target deliverable \
  --stages 1 --changed-only --ungraded --incomplete --rubric-outdated --limit 10

# 旧 rubric で評価された成果物を最大10件評価し直す
tools/grade/run-per-document.sh --run-id 20260928-rubric-v2 --target deliverable \
  --stages 1 --rubric-outdated --limit 10
```

`--stages 1` では stage 1 の既定を `codex-expert-executor` / 機械変換（`machine`）/ リファレンスなしとし、stage 2・3は実行しません。定期実行する `job-grade-kata` と `job-grade-deliverable` はこの構成を指定します。

reporter の既定はすべての段で `machine` です。`machine` の段は reporter agent を起動せず、`grade apply --analysis-from <executor-output> --submission-out <grade-submission.json>` で executor の marker を変換して反映します。finding の severity が許す level 上限を executor の申告が超えた場合は、機械変換が level を上限まで下げ、補正前後を grade result の `level_corrections` に記録します。`grade apply` が応答を拒否した場合は、拒否された応答を `executor-output.rejected.txt`、理由を `apply-rejection.log` として段のディレクトリへ残し、executor を1回だけ再実行して変換し直します。`--stage-<n>-reporter <nickname>` で agent の nickname を指定した段だけ、従来どおり LLM reporter を起動して `--from` の忠実性照合を行い、拒否時は reporter を1回だけ再実行します。LLM reporter は書き写しの精度を比較する用途に限ります。

正本の grade result を保存した後、script は `grade translation-plan` で英語 finding の文だけからなる配列を作り、1件以上ある場合だけ既定の `gemma26-translator`（`--translation-by` で変更可）へ渡します。plan は、同じ件数・同じ順序の訳文だけの JSON 文字列配列を返し、元のインラインコードを一字一句変えず、元にないインラインコードやバッククォートを加えないよう求めます。インラインコード以外の英語の語句は、固有名詞・識別子を除いて日本語へ訳します。

`grade localize` は件数が一致しなければ全項目を不合格とします。件数が一致する場合は、各要素が空でない文字列であること、平仮名または片仮名を含むこと、元の文と訳文のインラインコードの多重集合が一致することを検証し、合格項目だけを `message_ja` へ反映します。元のインラインコードが欠けた項目は `missing-inline-code`、元にないインラインコードが増えた項目は `extra-inline-code` で不合格にします。必須の `--rejections-out <path>` には、不合格項目の 0 始まりの `translation_index`、finding ID、理由を JSON で出力します。script はこの index ごとに `grade translation-plan --translation-index <index>` と `grade localize --translation-index <index>` を使って1回だけ再翻訳し、再び不合格なら正本の `message` を表示用にも保存します。翻訳 agent や JSON の失敗も同じフォールバックに入り、翻訳段階は viewpoint、level、severity、line、score、verdict を変更しません。

互換用の `--stages 3` では、各段の executor と reporter を個別に指定できます。1段目の比較リファレンスは `--kind` に応じて `docs/ja/specdojo/<種別ディレクトリ>/prj-overview-<kind>.md` を既定とします。たとえば `--kind recipe` では `docs/ja/specdojo/recipes/prj-overview-recipe.md` です。対応する既定文書が存在しない場合は警告し、1段目もリファレンスなしで続行します。`--stage-1-reference` の明示指定は既定値より優先しますが、選択した種別のディレクトリにある `prj-overview` 系 Markdown だけを受理し、異なる種別や `none` は入力エラーとします。2段目はリファレンスなし、3段目は `codex-expert-executor` によるリファレンスなしの確認が既定です。2段目が `pass`、score 96以上、finding 1件以下の3条件をすべて満たす場合だけ3段目を実行します。解決した構成は `--dry-run` の `stage=<n>` 行で確認できます。

Run 内の実行 state は既定で `logs/grade/runs/per-document/<run-id>/documents/` に文書・段ごとに保存し、保存先を変える場合は `--work-dir` で指定します。初回に選択した文書は同じ Run の `selection.txt` へ固定し、再開時に grade の更新で選択結果が変わっても、未完了の段を同じ対象で継続します。Run をまたぐ到達状況は前述の文書別 JSON に保存し、新しい Run は `stage_failed`、または `stage_completed + 1` から再開します。保存済み state の `stage_total` が今回の段数と異なる場合は、古い評価を完了済みへ移行せず state を削除し、現在の構成で1段目から再評価します。`content_hash` が現在本文と異なる state は `grade state` が返さないため、このリセット処理の対象になりません。`logs/` へ plan を置くのは、段ごとの plan が同じ文書 ID を持ち、`docs/` 配下では `index build` が重複 ID で失敗するためです。agent が rate limit を返した場合は終了コード75で中断し、その段を失敗回数には数えません。同じ引数と `--run-id` で再実行すると、完了済みの段を再適用せず未完了の段から続行します。設定が保存済み Run state と異なる場合は、別条件の結果を混在させず、新しい `--run-id` を要求します。

正常終了では、選択件数と訪問件数を照合した後に `grade pipeline complete:` の集計行を出します。集計行へ到達しない終了は、rate limit、signal、失敗したコマンド、処理中の文書、未着手文書を標準エラーへ出し、0以外で終了します。出力を `tail` などへパイプする場合、パイプの既定終了コードは末尾コマンドのものになるため、Bash の `pipefail` と `PIPESTATUS` で grade 側の終了コードを保存してください。

```bash
set -o pipefail
tools/grade/run-per-document.sh --run-id 20260901-rulebooks --kind rulebook | tail -20
grade_status=${PIPESTATUS[0]}
exit "$grade_status"
```

各段の status、所要秒数、verdict、score、finding 件数、executor、reporter、reference、連続失敗回数は同ディレクトリの `results.tsv` で確認できます。通常の agent / apply 失敗はその段で文書処理を止め、成功済みの前段を残して次回同じ段から再試行します。既定の連続失敗上限は3回で、`--max-stage-failures` で変更できます。上限到達文書は処理対象から外れますが、`retry_exhausted` 行として `results.tsv` に含め、reporter が人手対応を促せるようにします。

`apply` は level 3 以下に finding を要求し、`blocker` は level 0、`major` は最大 level 2、`minor` は最大 level 3 に制限します。executor marker の機械変換では上限超過を下方向だけに補正します。手書きの GradeSubmission は補正せず検証エラーにします。category score は viewpoint score（`level × 25`）の平均、総合 score は対象種別ごとの重み付き平均です。verdict は `blocker` があれば `fail`、`major` があるか総合 score が現行 rubric の `pass_score`（`grade-rubric-v2` では 75）未満なら `needs-work`、それ以外を `pass` とします。

現行の評価対象は Markdown です。評価結果は成果物本文へ書き込まず grade result サイドカーへ保存します。YAML / JSON の kata・成果物は Markdown と同じ Frontmatter・内容ハッシュの契約を持たないため、`--path` で指定した場合は書き込まずエラーにします。

## 9. exec worktree

`exec worktree` は、claim 済みタスクを段階ごとに確認しながら隔離実行するための分割コマンドです。

| サブコマンド | 用途                                                                          |
| ------------ | ----------------------------------------------------------------------------- |
| `prepare`    | plan、result、claim event を checkpoint commit し、task worktree を作成する   |
| `status`     | task state、actor、worktree、差分、統合状態を表示する                         |
| `agent`      | task worktree 内で agent command を1回実行する                                |
| `commit`     | 対象 result と成果物変更を exec ブランチへ commit する                        |
| `merge`      | exec ブランチを現在のブランチへ merge する                                    |
| `remove`     | 統合済み task worktree を削除する                                             |
| `prune`      | worktree のない exec ブランチを監査し、現在の HEAD に統合済みのものだけを削除 |

```bash
specdojo exec worktree prepare --project prj-0001 --task <task-id>
cd <worktree-path>
specdojo exec worktree agent --project prj-0001 --task <task-id>
specdojo exec worktree commit --project prj-0001 --task <task-id>
cd <merge-target-worktree>
specdojo exec worktree merge --project prj-0001 --task <task-id>
specdojo exec worktree remove --project prj-0001 --task <task-id> --delete-branch

# 孤立ブランチを確認してから、安全に削除する
specdojo exec worktree prune --project prj-0001 --dry-run
specdojo exec worktree prune --project prj-0001
```

`prepare` は root と tracked `package-lock.json` を持つ独立 package で `npm ci` を実行し、task worktree 内に書き込み可能な `node_modules` を準備します。過去の共有シンボリックリンクがある場合は、リンク先を変更せず実体ディレクトリへ置き換えます。install に失敗した場合、agent は起動されず task worktree が保持されます。

`prune` は登録済み worktree が使うブランチを対象外にし、孤立していても未統合のブランチは `kept (not merged)` として保持します。削除には `git branch -d` 相当だけを使います。

詳細な安全条件は [exec worktree運用ガイド](../guides/exec-worktree-guide.md) を参照します。

## 10. index

`index` は frontmatter の `id` とファイルパスのインデックスを扱います。

| コマンド        | 用途                                              | 例                                                     |
| --------------- | ------------------------------------------------- | ------------------------------------------------------ |
| `index build`   | `.specdojo/doc-index.json` を生成する             | `specdojo index build`                                 |
| `index lookup`  | ID からパスを返す                                 | `specdojo index lookup specdojo:prj-overview-rulebook` |
| `index replace` | `[[id]]` を Markdown リンクまたは path に展開する | `specdojo index replace --format path <plan-path>`     |

`exec run` は agent に plan を渡す直前に `index replace --format path --missing keep` 相当の処理を行います。

## 11. watch / build

| コマンド | 用途                                        | 例                                               |
| -------- | ------------------------------------------- | ------------------------------------------------ |
| `watch`  | ファイル変更を監視して対象 build を実行する | `specdojo watch --project prj-0001 --scope exec` |
| `build`  | 全生成物または指定 scope を一括再生成する   | `specdojo build --project prj-0001 --scope all`  |

`dashboard build --project <id>` は `execution/generated/dashboard.md` を再生成します。通常の進捗集計に加え、`routines/generated/routine-runs.jsonl` から昨日の実行と本日の予定を、登録簿個票から着手候補のおすすめ順を、register / exec の event から解除待ちの理由と次の行動を表示します。解除待ちの理由は、制御文字を除いた 1 行へ整形し、表の区切り文字をエスケープしたうえで、長い値を省略記号付きで打ち切ります。

`--scope` は `exec`、`catalog`、`register`、`index`、`all` を指定します。

## 12. job

`job`は再利用可能な`job-*.yaml`と、その定義からmaterializeされたJob Runを扱います。実行自体は`exec run --job`を使います。

| コマンド       | 用途                                       | 例                                         |
| -------------- | ------------------------------------------ | ------------------------------------------ |
| `job list`     | Job Definitionと最終Runを表示する          | `specdojo job list --project prj-0001`     |
| `job validate` | `job-*.yaml`を検証する                     | `specdojo job validate --project prj-0001` |
| `job where`    | Job Definition・Run・stateのパスを表示する | `specdojo job where --project prj-0001`    |

`exec run --job`の`--input <key=value...>`はJob入力を指定し、`--scheduled-at`はroutineやCIが論理実行枠を渡す場合に使います。入力定義の `enum` は string / integer / boolean の値、または list の各要素を制限し、integer の `minimum` / `maximum` は値域を制限します。command template では `{{project_id}}` で解決済みプロジェクトIDを、`{{specdojo}}` で現在のrunnerと同じCLI entryを、`{{job_run_id}}` で確定済みJob Run IDを参照できます。`job_run_id`は`run.idempotency_key`では参照できません。同じidempotency keyの完了済みRunは再実行せず、失敗済みRunは同じRun IDの次attemptとして実行します。Job Runは現在in-place実行に対応し、`--worktree`との併用は未対応です。

委譲先のagentは`task.agent.executor`（および必要なら`task.agent.reporter`）にnicknameで指名します。両方を指名したRunはexecutor→reporterの2段で実行し、resultはreporterが書きます。`--by`は単一agent実行としての差し替え、`--executor-by` / `--reporter-by`は段ごとの差し替えとして、いずれも指名より優先します。`job validate`はnicknameの書式だけを検査するため、実在確認は`--dry-run`で行います。責務境界と記述規約は [Job定義標準](../standards/job-definition-standard.md) を参照します。

`task.mode: command`では、materialize済みの`task.command`をrunnerが直接実行します。終了コード、標準出力、標準エラーはcommand evidenceへ記録され、終了コードが0以外ならagentを起動せずRunをfailedにします。stdout / stderr はredact・64 KiB上限付きログへの参照と同じbounded内容がevidence本体にも入り、判断が必要なJobでは成功時に`task.analysis.agent`へ渡されます。analysis reporterは参照先ログや作業ツリーを追加で読まず、このevidence本体から判断します。commandのrunner実行を`--by` / `--executor-by`でagent実行へ差し替えることはできません。analysis agentだけは`--reporter-by`で差し替えられます。

```bash
# 解決された runner command / analysis reporter を確認する（実行しない）
specdojo exec run --job job-grade-kata --project prj-0001 --input period=2026-W37 --dry-run
```

## 13. routine

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

`action` は単一オブジェクト、または先頭から順に実行する1件以上の配列を受け付けます。単一オブジェクトの `action.kind`、配列の各要素の `kind` は `job` または `specdojo` を受け付けます。`job` は実行内容と入力検証を参照先の Job Definition に委ね、`exec run --job` 経由で実行ロックに従います。`specdojo` は `args` に書いた specdojo サブコマンド（例: `[dashboard, build]`）へ `--project` を付けて直接起動し、実行ロックを取りません（agent を呼ばない読み取り・派生生成専用。`exec` と `--project` は `args` に書けません）。`register` / `exec-auto` / `exec-resume` / `exec-cycle` の旧 kind は廃止済みです。定義ファイルの配置、`interval`または`trigger.cron`の書式、複数 action の失敗方針、due判定は [routine運用ガイド](../guides/routine-operation-guide.md) を参照します。

各 routine の実行完了時には、`routine-state.json` の最新状態とは別に、`routines/generated/routine-runs.jsonl` へ `routine_id`、`scheduled_for`、開始・終了時刻、結果、Job Run ID（`specdojo` action では空）を1実行1行で追記します。この履歴が dashboard の「routine 実行状況（昨日・本日）」の正本です。

```bash
# due な routine をまとめて実行する（cron / CI から呼ぶ想定）
specdojo routine run --project prj-0001 --due

# 特定の routine を due 判定と無関係に即時実行する
specdojo routine run --project prj-0001 --id rtn-daily-register-sweep

# 実行内容を確認する（実行も last_run 記録もしない）
specdojo routine run --project prj-0001 --due --dry-run
```

schedule / register / job / routine の使い分けの基準は [exec運用ガイド](../guides/exec-operation-guide.md) の `実行経路の使い分け` を参照します。

## 14. agent

`agent` は、保存済みの plan を指定した1つの agent へ渡し、その標準出力を取得します。agent の選択は `.specdojo/agent-members.yaml` の nickname で一意に決まるため、実行のたびに担当が変わりません。決定論的な手順を shell script や CLI 側に置き、agent には判断だけを委ねるための最小の部品です。

| コマンド    | 用途                                                        |
| ----------- | ----------------------------------------------------------- |
| `agent run` | plan を stdin で agent へ渡し、標準出力をファイルへ保存する |

```bash
specdojo agent run --plan <plan.md> --by <nickname> --out <response.txt>
specdojo agent run --plan <plan.md> --by <nickname> --dry-run
```

`--plan` は agent へ標準入力で渡すファイルです。存在しない場合と内容が空の場合は、空のプロンプトを送らずにエラーにします。`--by` は `.specdojo/agent-members.yaml` の agent nickname で、重複、`type: agent` 以外、`disabled: true` の member は拒否します。`capabilities` や `proficiency` による間接的な絞り込みは行わないため、候補が複数になって担当が揺れることがありません。

`--out` を指定すると標準出力をそのファイルへ書き、親プロセスの標準出力には保存先だけを表示します。指定しない場合は agent の出力をそのまま端末へ流します。`--out` の親ディレクトリは必要に応じて作成します。`--dry-run` は解決したコマンドを表示するだけで agent を起動しません。

終了コードは、成功が `0`、agent の失敗が `1`、rate limit の検出が `75` です。rate limit は通常の失敗と区別する必要があります。呼び出し側は、対象を評価済みとして記録せずに中断し、後で再開できます。検出条件と cooldown は `exec run` と同じ `exec-defaults.yaml` の設定を provider ごとに解決して使います。

`exec run` と違い、`agent run` は claim や result の記帳を行いません。状態遷移を伴う実行は `exec run` を使い、`agent run` は plan と応答だけを扱う用途に限定します。

## 15. orchestrator

`orchestrator launch` は、対象 project の `repos` に宣言したプロダクトリポジトリを provider CLI の許可対象に加えて、対話型オーケストレーターを起動します。`config scaffold` が追加する `orch:*` npm script はこの入口を使うため、scaffold 時点の絶対パスを `package.json` へ書き込みません。

```bash
specdojo orchestrator launch --provider claude --project prj-0001 -- \
  --agent specdojo-orchestrator --model sonnet
```

対象 project は `--project`、`SPECDOJO_PROJECT`、`current_project`、`projects` の先頭の順で解決します。`--` より後ろの引数は provider CLI へそのまま渡します。`repos` が無い場合、provider CLI へ渡すコマンドと引数は従来と変わりません。

provider CLI の実行中、起動元は `SIGINT` と `SIGQUIT` を無視して子プロセスの終了を待ちます。端末での Ctrl-C は provider CLI に直接届くため、入力の取り消しとして扱う CLI が起動元だけを終了させることはありません。`SIGTERM` と `SIGHUP` は子プロセスへ転送し、子の終了後に同じ終了コードを返します。子がシグナルで終了した場合は `128 + シグナル番号` を返します。

Claude Code、Codex、Antigravity、GitHub Copilot には exec と同じ追加ルート引数を渡します。OpenCode は、起動時の `OPENCODE_CONFIG_CONTENT` に選択 agent の `permission.external_directory` を注入し、全外部ディレクトリを拒否したうえで宣言済みのリポジトリだけを許可します。外部パスへ既存の `permission.edit` が一致しないため、同じ宣言済みルートの編集許可も注入します。既存の inline config の他項目は保持します。未宣言のリポジトリは、どの provider でも許可対象になりません。

`orchestrator night` は `autopilot: approved` の付いた `open` todo・issue だけを夜間 queue として実行します。

```bash
specdojo orchestrator night --project prj-0001 \
  --max-items 10 --parallel 2 --max-consecutive-failures 2 \
  --on-rate-limit fallback --fallback-executor-by codex-executor
```

各 wave は worktree と post-review を必須にし、成功は close、未完了は `waiting` にします。`--max-items` は一晩の件数、`--parallel` は wave の同時数、`--max-consecutive-failures` は次の wave を止める閾値です。`--on-rate-limit fallback` では fallback executor の指定が必須です。失敗を含む朝報告を保存できた場合は部分成功を表す終了コード 2、コマンド自体の異常は 1 を返します。

## 16. devcontainer

`devcontainer` は、利用リポジトリの `.devcontainer/` 環境を構築するためのサブコマンドです。VS Code Dev Container などで、オーケストレーターを起動するための分離されたコンテナ環境を生成します。

| コマンド                | 用途                                        |
| ----------------------- | ------------------------------------------- |
| `devcontainer scaffold` | `.devcontainer/` の設定ファイル群を生成する |

`devcontainer scaffold` は、指定された provider の CLI と、要求された追加機能を組み込んだ `devcontainer.json` と `post-create.sh` を生成します。あわせて、常時稼働ホストへの接続と tmux セッション維持のためのサンプルスクリプト（`.devcontainer/remote-host/specdojo-tmux.sh.sample`）と接続元 SSH 設定サンプル（`.devcontainer/remote-host/ssh-config.sample`）も生成します。provider は `antigravity`、`claude`、`codex`、`opencode` を指定できます。`--editor emacs` / `--editor vim` を指定した場合は、それぞれ Emacs 用の `emacs/init.el` / Vim 用の `vim/vimrc` も生成します。Dev Container は任意の実行環境であり、既存の Node.js 環境を置き換える必須手順ではありません。

主要オプション:

| オプション                | 用途                                                         |
| ------------------------- | ------------------------------------------------------------ |
| `--preset recommended`    | 推奨のエディタ・tmux・VS Code 拡張と設定をまとめて追加する。 |
| `--provider <names>`      | `claude,codex` のようにカンマ区切りで provider を指定する。  |
| `--editor <names>`        | `emacs,vim` のようにエディタと初期設定を追加する。           |
| `--ollama`                | Ollama への接続設定（環境変数）を追加する。                  |
| `--cron`                  | cron をインストールし、起動時にサービスを開始する。          |
| `--tmux`                  | tmux をインストールする。                                    |
| `--workspace-name <name>` | Dev Container 内で使う親ディレクトリ名を上書きする。         |
| `--force`                 | `.devcontainer/` が既に存在する場合に上書きする。            |
| `--dry-run`               | 実際にファイルを作成せず、作成予定のファイルを表示する。     |

```bash
# claude と codex 用の CLI を含む Dev Container を生成する
npx specdojo devcontainer scaffold --provider claude,codex

# SpecDojo の文書作業向けの推奨設定をまとめて追加する
npx specdojo devcontainer scaffold --provider claude,codex --preset recommended

# 追加オプションを指定する
npx specdojo devcontainer scaffold --provider claude --ollama --tmux

# 端末版 Emacs と、すぐ使える組み込み機能だけの設定を追加する
npx specdojo devcontainer scaffold --provider claude --editor emacs

# ホスト側の親名を変えた後も、コンテナ内の従来パスを保つ
npx specdojo devcontainer scaffold --workspace-name app1-workspace
```

`.devcontainer/` が既に存在する場合は何も書き込まず、置き換える場合だけ `--force` を指定します。上書き前や初回生成前は `--dry-run` で対象ファイルを確認してください。生成設定は provider の設定ディレクトリを名前付きボリュームへ保存してコンテナ再作成後も利用できるようにし、ホストの認証情報・秘密鍵・`.env` を直接マウントしません。認証は生成したコンテナ内で行います。

生成する `devcontainer.json` は `${localWorkspaceFolder}/..` を、ホスト側の親ディレクトリ名に合わせた `/workspaces/<親名>` へマウントし、`workspaceFolder` をその中の `${localWorkspaceFolderBasename}` へ向けます。例えば `app1-workspace/app1-specdojo` で scaffold すると、作業ディレクトリは `/workspaces/app1-workspace/app1-specdojo` です。別リポジトリ構成の `repos` と `worktree_base` はプロジェクトリポジトリの外にあるため、親ディレクトリを共有することでプロダクトリポジトリと exec の worktree をコンテナから利用できます。`post-create.sh` はマウントした親ディレクトリ配下の Git リポジトリと worktree を `safe.directory` の対象にします。親ディレクトリ内のその他のファイルもコンテナから見えるため、コンテナへ公開しないファイルは同じ親ディレクトリに置かないでください。

親名には英数字・`.`・`_`・`-` だけを使用できます。空白、`/`、制御文字などを含む場合は、意図しないパスへ置換せずエラーにします。必要なら `--workspace-name <name>` で有効な名前を指定してください。`specdojo init --devcontainer` でも同じオプションを指定できます。コンテナ内で作った Git worktree は作成時の絶対パスを記録するため、ホスト側の親ディレクトリ名を変えて `.devcontainer/` を作り直す場合は、`--workspace-name` に以前の名前を指定してコンテナ内のパスを保ってください。

`codex` provider を指定した場合だけ、生成する `devcontainer.json` の `runArgs` に `--security-opt=seccomp=unconfined` を追加します。Docker の既定 seccomp profile は Codex 同梱の bubblewrap が sandbox 作成時に使う user namespace の作成を拒否するためです。この設定は devcontainer 全体の syscall filter を無効にしてコンテナの隔離を弱めますが、追加の Linux capability は付与せず、Docker が保護する `/proc` や `/sys` の system path も公開しません。`--security-opt=systempaths=unconfined` は保護範囲をさらに広げるため使用しません。

また、ベースイメージ `mcr.microsoft.com/devcontainers/typescript-node:22` にはシステムの bubblewrap が含まれています。Codex は PATH 上の `bwrap` を同梱版より優先しますが、システム版では Docker が保護する `/proc` の mount に失敗したときに Codex の回避処理が働かず、sandbox を開始できません（[[prj-0001:pjr-27z9-codex-bwrap-proc-mount]] と同じ事象）。このため `codex` provider の post-create 処理は、`bubblewrap` package が導入済みの場合に限って削除し、Codex 同梱の bwrap を使わせます。削除に失敗した場合は警告を表示して残りの post-create 処理を続けます。

Codex 自身の sandbox は引き続き使用し、`workspace-write` で許可範囲外への書き込みが拒否されることを確認してください。`codex` 以外の provider だけを指定した場合は、bubblewrap の削除処理と `runArgs` を追加せず、Docker の既定 seccomp profile を維持します。

名前付きボリュームは `<repository>-specdojo-*` という名前で生成します。`<repository>` は scaffold の対象ディレクトリ名を Docker volume 名に使える小文字へ正規化した値です。本体リポジトリや別の利用リポジトリとは共有せず、同じリポジトリの Dev Container を作り直した場合だけ再利用します。固定名を共有すればログインを使い回せますが、プロジェクトごとのアカウントを分けられず、`safe.directory` などのコンテナ固有 Git 設定も混在するため、分離を既定とします。volume 名は scaffold を実行した時点のディレクトリ名から決まり、生成した `devcontainer.json` に固定されます。後でディレクトリ名を変えても volume は変わりません。一方、別の場所にある同じディレクトリ名のリポジトリ（例: 別組織の `app`）を scaffold すると同じ volume 名になり、認証情報を共有します。分離したい場合は、生成後に `devcontainer.json` の `mounts` の `source` を一意な名前へ書き換えてください。

保存先は次のとおりです。表の「常時」は provider の指定にかかわらず mount します。GitHub CLI の設定は `gh` を利用者が導入して使う場合に保存され、未使用時は空の volume のままです。

| 対象                          | コンテナ内の保存先                 | volume 名                             | 条件                   |
| ----------------------------- | ---------------------------------- | ------------------------------------- | ---------------------- |
| コンテナ固有の Git 設定       | `/home/node/.config/git`           | `<repository>-specdojo-git`           | 常時                   |
| GitHub CLI の設定・認証       | `/home/node/.config/gh`            | `<repository>-specdojo-gh`            | 常時                   |
| Claude Code の設定・認証      | `/home/node/.claude`               | `<repository>-specdojo-claude`        | `claude` provider      |
| Codex の設定・認証            | `/home/node/.codex`                | `<repository>-specdojo-codex`         | `codex` provider       |
| OpenCode の設定               | `/home/node/.config/opencode`      | `<repository>-specdojo-opencode`      | `opencode` provider    |
| OpenCode の認証・アプリデータ | `/home/node/.local/share/opencode` | `<repository>-specdojo-opencode-data` | `opencode` provider    |
| Antigravity の設定・認証      | `/home/node/.config/antigravity`   | `<repository>-specdojo-antigravity`   | `antigravity` provider |

OpenCode の API key は `/home/node/.local/share/opencode/auth.json` に入り、設定とは別の `opencode-data` volume に残ります。`post-create.sh` は mount 先をコンテナユーザーが読み書きできる所有者へ整えます。Git 設定は volume 内の global config から、Dev Containers がホストからコピーした `~/.gitconfig` を include しますが、ホスト上のファイル自体を mount しません。

エディタや shell の個人設定は既定では scaffold の出力へ埋め込みません。VS Code の Dev Containers を実行する側の User Settings に `dotfiles.repository`、必要に応じて `dotfiles.targetPath` と `dotfiles.installCommand` を設定すると、コンテナ作成時に dotfiles が自動導入されます。個人のリポジトリ URL は生成される `devcontainer.json` へ記録されません。

`--editor emacs` を指定すると、端末版 Emacs、ripgrep、TypeScript・Markdown・YAML・Bash 用の LSP サーバーと `.devcontainer/emacs/init.el` を追加します。初期設定は Emacs 組み込み機能だけを使い、`C-h` の後退、UTF-8、行番号、対応する括弧、端末マウス、作業ツリー外のバックアップ・自動保存、対応ファイルでの Eglot 自動接続を設定します。

post-create は `~/.emacs`、`~/.emacs.el`、`~/.emacs.d/init.el`、`~/.config/emacs/init.el` のいずれも無い場合だけ、生成したテンプレートを配置します。`~/.emacs.d` ディレクトリがあれば `~/.emacs.d/init.el` へ、なければ `~/.config/emacs/init.el` へコピーし、配置先を出力します。dotfiles が設定を先に配置した場合は上書きしません。初回のコンテナ作成前に既定値を変える場合は `.devcontainer/emacs/init.el` を編集してください。作成後は出力されたコピー先を編集します。コピー先を削除しない限り、再度 post-create を実行してもテンプレートの変更は反映されません。

`--preset recommended` は、`--editor emacs,vim --tmux` 相当のツールに加え、Git Graph、markdownlint、YAML、Prettier、remark、Markdown All in One、Code Spell Checker、EditorConfig、Error Lens、Even Better TOML の VS Code 拡張を追加します。選択した provider が Claude Code、Codex、GitHub Copilot の場合は、その provider の拡張だけも追加します。Markdown と YAML は保存時に Prettier で整形し、`docs/specdojo/schemas/v1/` の主要な schema を SpecDojo の YAML へ関連付けます。同じ拡張は `.vscode/extensions.json` の `recommendations` にも入り、既存の recommendation は保持されます。個別の `--editor`・`--tmux` と一緒に指定した場合は両方を重複なく適用します。

Vim の雛形は `.devcontainer/vim/vimrc` に生成され、`~/.vimrc` と `~/.vim/vimrc` のどちらも無い場合だけ `~/.vimrc` へコピーされます。既存の Vim 設定は上書きしません。Emacs の雛形も上記と同じ上書き防止を維持します。

## 17. 関連ガイド

| 詳細                     | 参照先                                                                      |
| ------------------------ | --------------------------------------------------------------------------- |
| CLI全体像と初期設定      | [遂行の技活用ガイド](../guides/waza-guide.md)                               |
| Schedule設計             | [Schedule設計ガイド](../guides/schedule-design-guide.md)                    |
| exec運用（経路の選び方） | [exec運用ガイド](../guides/exec-operation-guide.md)                         |
| Schedule実行運用         | [Schedule実行運用ガイド](../guides/schedule-operation-guide.md)             |
| routine運用              | [routine運用ガイド](../guides/routine-operation-guide.md)                   |
| 登録簿運用               | [登録簿運用ガイド](../guides/register-operation-guide.md)                   |
| worktree隔離実行         | [exec worktree運用ガイド](../guides/exec-worktree-guide.md)                 |
| plan/result              | [plan/resultライフサイクルガイド](../guides/plan-result-lifecycle-guide.md) |
| エージェント設定         | [exec設定ガイド](../guides/exec-config-guide.md)                            |
