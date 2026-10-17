---
specdojo:
  id: specdojo:quick-start-guide
  type: guide
  status: ready
---

# Quick Start ガイド

Quick Start Guide

SpecDojo CLI の初期設定から始め、register で課題と判断を整理し、成果物カタログ、schedule、routine へ展開する基本フローを最短手順で試します。冒頭の `10分で体験する — 仕様の判断台帳` では、kata や成果物カタログを用意せずに、記帳ひとつから判断を残す流れを先に体験します。

**対象読者**

- SpecDojo CLI を初めて使い、プロジェクトの作業を登録・実行してみたい開発者、運用者

**この文書で分かること**

- question の起票から decision、仕様書の更新、change-request による修正までを記帳する流れ
- CLI の初期設定と、register / schedule / routine の使い分け
- issue / decision / todo から成果物カタログと Schedule へ展開する手順
- npm package の kata を参照し、必要なものだけ eject する方法

**次に読む文書**

- register のtypeと状態遷移は [登録簿運用ガイド](register-operation-guide.md) を参照してください。
- Scheduleの自動・手動実行は [Schedule実行運用ガイド](schedule-operation-guide.md)、agent設定は [exec設定ガイド](exec-config-guide.md) を参照してください。

各コマンドには、設定済みのオーケストレーター（`specdojo-orchestrator`）へチャットで指示する場合の文言を `# チャット:` として併記します。オーケストレーターは指示を対応する `specdojo` サブコマンドへ変換し、状態を変える操作は実行前に内容を提示して承認を求めます。導入先での設定と起動方法は [オーケストレーター運用ガイド](orchestrator-operation-guide.md) を参照してください。`<project-id>` などのプレースホルダは実際の値に読み替えてください。

## 1. 10分で体験する — 仕様の判断台帳

**記して、形にして、磨き続ける。** SpecDojo は、迷っていることを記帳し、決めたことを仕様書へ書き、後日の変更も同じ台帳に残します。この節では、共通サンプルの「駄菓子屋きぬや 販売管理システム構築」を題材に、次の流れを 10 分ほどで体験します。kata（型）や成果物カタログを事前に用意する必要はありません。

```text
question を起票する（迷っていること）
  -> decision で決める（選択肢・理由・決定）
  -> 仕様書を 1 つ書く（決定を反映する）
  -> 後日 change-request で直す（変更の理由を残す）
  -> 決定ログ・変更要求ログで振り返る
```

各手順には、実行するコマンドと、オーケストレーターへの話しかけ方の例（`# チャット:`）を併記します。どちらか一方で進められます。表示された `PJR-XXXX` は、自分の環境で表示された ID に読み替えてください。

### 1.1. 道場を開く（導入と初期設定）

プロジェクトリポジトリを作り、SpecDojo を導入して `init` の質問に答えます。

```bash
mkdir app1-workspace
mkdir app1-workspace/app1-specdojo
git -C app1-workspace/app1-specdojo init
cd app1-workspace/app1-specdojo
npm init -y
npm install --save-dev specdojo
npx specdojo init
```

この体験では、記帳だけを使う最小構成で答えます。`[]` 内は既定値で、Enter だけで採用されます。

```text
Project ID [prj-0001]:                              <- Enter（prj-0001）
Project name [My Project]: 駄菓子屋きぬや 販売管理システム構築
Create a project register? [Y/n]:                   <- Enter（登録簿を作る）
Your nickname [owner]: owner
Your display name [Project Owner]: 店主
Orchestrator providers (...) [codex]: claude        <- 使う AI ツールを 1 つ選ぶ
Delegate work to agents (exec)? [y/N]:              <- Enter（実戦は後で設定する）
Deliverables catalog (none|small|medium|large) [none]:  <- Enter（カタログは使わない）
Create a Dev Container? [y/N]:                      <- Enter
```

登録簿は `docs/ja/projects/prj-0001/controls/project-register/` に作られます。オーケストレーターで進める場合は、終了時に表示される `npm run orch:<provider>` で起動します。

### 1.2. 迷っていることを起票する（question）

レジで扱う支払い方法が決まっていない、という迷いを question として起票します。

```bash
# チャット:「question を起票して。タイトルは『支払い方法をどこまで扱うか』」
npx specdojo register add \
  --project prj-0001 \
  --type question \
  --title "支払い方法をどこまで扱うか" \
  --topic payment-scope
```

出力に表示された `PJR-XXXX` を控えます。`controls/project-register/` に `pjr-xxxx-payment-scope.md` という個票ができるので開き、`確認事項` と `背景` に「現金のほか、常連客のつけやキャッシュレスまで扱うか」「つけの記録漏れが問題になっている」などを書きます。個票の章立ては question の型（テンプレート）から与えられます。

### 1.3. decisionで決める

選択肢と理由を比べて決めるために、decision を起票します。

```bash
# チャット:「decision を起票して。タイトルは『初期リリースで扱う支払い方法を決める』」
npx specdojo register add \
  --project prj-0001 \
  --type decision \
  --title "初期リリースで扱う支払い方法を決める" \
  --topic payment-methods
```

decision の個票に、次のように書きます。オーケストレーターを使う場合は、相談した内容がそのまま個票の本文になります。

- `検討した選択肢`: A 現金のみ、B 現金とつけ、C 現金とつけとキャッシュレス
- `決定内容`: B 現金とつけを扱う
- `採択理由`: つけの記録漏れが現在の主な問題であり、キャッシュレスは利用者が少ない

書き終えたら、decision と、元の question を close します。decision と question は close すると `decided` になります。

```bash
# チャット:「decision PJR-XXXX を『現金とつけを扱う』で完了して」
npx specdojo register close \
  --project prj-0001 \
  --id PJR-XXXX \
  --conclusion "初期リリースは現金とつけを扱う"

# チャット:「question PJR-XXXX を『decision で決定』で完了して」
npx specdojo register close \
  --project prj-0001 \
  --id PJR-XXXX \
  --conclusion "decision で現金とつけを扱うと決定"
```

### 1.4. 決めたことを仕様書に書く

決定を仕様書へ反映します。この体験では成果物カタログを使わず、Markdown を 1 つ作ります。仕様書はプロダクトの文書なので、プロダクトリポジトリ（例: `app1/docs/ja/product/payment-policy.md`）に置きます。

```markdown
# 支払い方法の基本方針

## 1. 扱う支払い方法

- 現金
- つけ（常連客のみ。会計時に残高を記録する）

## 2. 根拠

- decision PJR-XXXX（初期リリースで扱う支払い方法を決める）
```

仕様書から decision の ID を参照しておくと、「なぜこう書いたか」を後から台帳でたどれます。

### 1.5. 後日の変更をchange-requestで直す

運用を始めた後、「子ども向けに交通系電子マネーも使いたい」という要望が出たとします。仕様書をいきなり書き換えず、change-request として記帳します。

```bash
# チャット:「change-request を起票して。タイトルは『交通系電子マネーを支払い方法に加える』」
npx specdojo register add \
  --project prj-0001 \
  --type change-request \
  --title "交通系電子マネーを支払い方法に加える" \
  --topic add-ic-card-payment
```

change-request の個票に `変更要求`、`影響評価`、`審査・決定` を書き、仕様書 `payment-policy.md` の扱う支払い方法へ「交通系電子マネー」を追加して、根拠に change-request の ID を加えます。直し終えたら close します。change-request は close すると `done` になります。

```bash
# チャット:「change-request PJR-XXXX を『仕様書へ反映』で完了して」
npx specdojo register close \
  --project prj-0001 \
  --id PJR-XXXX \
  --conclusion "交通系電子マネーを支払い方法の基本方針へ追加"
```

### 1.6. 台帳を確かめる

記帳のたびに、個票から一覧とログが生成されます。手動で作り直す場合は `register build` を実行します。

```bash
# チャット:「登録簿の一覧とログを作り直して」
npx specdojo register build --project prj-0001
```

| 生成物                                             | 内容                                          |
| -------------------------------------------------- | --------------------------------------------- |
| `controls/project-register/generated/pjr-index.md` | question・decision・change-request を含む全件 |
| `controls/generated/pm-decision-log.md`            | 決定ログ（decision の一覧）                   |
| `controls/generated/pm-change-request-log.md`      | 変更要求ログ（change-request の一覧）         |
| `controls/generated/pm-issue-log.md`               | 課題ログ（issue の一覧）                      |

パスは `docs/ja/projects/prj-0001/` からの相対です。正本は個票の Markdown なので、`git log` でも SpecDojo なしでも読めます。作成された設定・個票・仕様書を確認して commit すれば、体験は完了です。

### 1.7. 次に進む

- 型と実戦: 仕様書を増やしたくなったら、成果物カタログ（`dct-<domain>.yaml`）で作る成果物を宣言し、型に沿って作ります。手順は以降の `CLIを初期設定する` と `成果物カタログからscheduleへ展開する` を参照してください。
- 実戦（exec）: 起票した todo や issue を AI に実行させるには、[exec設定ガイド](exec-config-guide.md) で agent を設定し、`npx specdojo exec run --project prj-0001 --register PJR-XXXX` を実行します。
- 評定（grade）と講評（review）: 成果物の品質評価と完了判断は [レビューガイド](review-guide.md) を参照してください。v0.3.0 の grade は試験的で、npm package では `grade list` / `plan` / `apply` / `validate` / `result` などの部品を利用できます。通しの実行に使う本体リポジトリの開発用 `tools/grade/run-per-document.sh` は package に含まれず、成果物の grade には project の `catalog_path` が必要です。
- 記帳の種別と状態遷移は [登録簿運用ガイド](register-operation-guide.md) を参照してください。

## 2. CLIを初期設定する

Node.js 22.13 以上と Git を用意します。オーケストレーターに Claude Code を使う場合は、Claude Code も導入してログインしておきます。ほかの provider も選べます。

既定では、SpecDojo の成果物更新、登録簿の状態遷移、実行記録をプロダクトの Git 履歴に混ぜないため、次の **別リポジトリ構成**で始めます。

- **プロダクトリポジトリ** `app1/`: ソースコードと、仕様・設計などのプロダクトドキュメントを置きます。
- **プロジェクトリポジトリ** `app1-specdojo/`: 登録簿・計画・実行記録などのプロジェクトドキュメントと型（Kata）を置きます。1つのプロジェクトリポジトリに、複数のプロジェクトを格納できます。
- **worktree 用ディレクトリ** `app1-specdojo-worktrees/`: タスクごとの変更を隔離して進めるために、Git worktree を作る場所です。名前はプロジェクトリポジトリのディレクトリ名から決まります。

```text
app1-workspace/
├── app1/             # 既存または新規のプロダクトリポジトリ
├── app1-specdojo/    # プロジェクトリポジトリ
└── app1-specdojo-worktrees/ # task 単位の worktree 置き場
```

既に開発している `app1/` と並べてプロジェクトリポジトリを作り、`app1-specdojo/` に SpecDojo を導入します。worktree 用ディレクトリは、最初の隔離実行時に設定に従って作られます。

```bash
mkdir app1-workspace
mkdir app1-workspace/app1-specdojo
git -C app1-workspace/app1-specdojo init
cd app1-workspace/app1-specdojo
npm init -y
npm install --save-dev specdojo
# 質問に答えて project、register、agent 実行までを初期設定する
npx specdojo init
```

`specdojo init` は、project ID と名前、人の nickname と表示名、利用する agent provider、
exec・成果物カタログ・Dev Container の要否を順に質問します。選択に応じて設定、登録簿、人と
agent の名簿、provider の scaffold、`package.json` の `orch:<provider>`、exec の起動設定を
作成します。exec の親検証は、対応する npm script が `package.json` にあるものだけを設定し、
該当する script がなければ省略します。既存ファイルは上書きせず、作成内容は `--dry-run` で
先に確認できます。

CI や標準入力が端末でない環境では質問しません。次のようにオプションだけで同じ初期設定を
行えます。省略値は画面に表示されます。

```bash
npx specdojo init --yes \
  --project prj-0001 \
  --name "Example Project" \
  --nickname owner \
  --display-name "Project Owner" \
  --provider claude,codex \
  --exec \
  --catalog small \
  --devcontainer \
  --dry-run
```

初期化後は、表示された `npm run orch:<provider>` でオーケストレーターを起動し、最初の 1 件を
起票します。オーケストレーターを使わない場合は、同じ案内に表示される
`exec run --register <id> --executor-by <executor> --reporter-by <reporter>` で実行できます。
作成された設定と文書は内容を確認して commit してください。

LP の例と同じく Claude Code へ作業を任せる場合は、provider の質問に `claude`、exec の質問に「はい」と答えます。初期化後は `npm run orch:opus`（または `npm run orch:sonnet`）でオーケストレーターを起動できます。

プロダクトを変更する前に、`.specdojo/specdojo.config.json` の `projects.prj-0001` へ、同じ workspace にあるプロダクトリポジトリを接続します。

```json
"repos": [
  {
    "name": "app1",
    "path": "../app1",
    "integration_branch": "main"
  }
]
```

最初の作業を起票して個票へ完了条件を書いたら、Claude Code の executor と reporter を指定して実行できます。

```bash
npx specdojo register add \
  --project prj-0001 \
  --type todo \
  --title "最初のタスク"
npx specdojo exec run \
  --project prj-0001 \
  --register PJR-XXXX \
  --worktree \
  --executor-by claude-executor \
  --reporter-by claude-reporter
```

実行後は両方のリポジトリの commit とプロダクトの動作を確認します。

```bash
git -C ../app1 log --oneline -1
git log --oneline -1
npm --prefix ../app1 run dev
```

人が result と成果物を確認し、気づいた改善を次の `todo` や `issue` として残してから、元の登録項目を close します。

```bash
npx specdojo register add \
  --project prj-0001 \
  --type todo \
  --title "次の改善" \
  --commit
npx specdojo register close \
  --project prj-0001 \
  --id PJR-XXXX \
  --conclusion "完了条件を満たした" \
  --commit
```

`@specdojo/docs-lint` は初期設定に必須ではありません。SpecDojo 文書向けの remark プラグインと検証コマンドを使う場合だけ追加します。

```bash
npm install --save-dev @specdojo/docs-lint
```

リポジトリルートの `.remarkrc.yaml` から次のように公開 export を参照できます。

```yaml
plugins:
  - remark-parse
  - "@specdojo/docs-lint/remark/no-unescaped-angle-placeholder"
```

文書 lint の全設定例と検証コマンドは [[specdojo:docs-editing-guide|ドキュメント編集ガイド]] を参照してください。

### 2.1. 個別に設定する場合

各設定を個別に管理したい場合は、従来どおり `config init` と各 scaffold を順に実行できます。

```bash
# チャット:「<project-id> の SpecDojo 設定を初期化して」
npx specdojo config init
```

`specdojo config init` は `.specdojo/specdojo.config.json` が存在しない場合に雛形を作成し、既存ファイルは上書きしません。雛形は register だけを使える最小構成であり、project パスはリポジトリルートを基準とし、`run.worktree_base` はディレクトリ名から作る `../<リポジトリ名>-worktrees` を指します。例えば `app1-specdojo/` では `../app1-specdojo-worktrees` です。作成された設定を開き、対象プロジェクトの ID と各パスを実際の名前に合わせてください。catalog、schedule、exec へ進むときに追加するキーと既定値は [[specdojo:specdojo-config-reference|SpecDojo設定リファレンス]] で確認できます。

プロダクト文書は `app1/docs/ja/product/`、プロジェクト文書と SpecDojo の型（Kata）は `app1-specdojo/docs/ja/projects/` と `app1-specdojo/docs/ja/specdojo/` に置きます。現行実装では1つの項目で両リポジトリを自動統合できないため、プロダクト文書や実装も変更する項目は分けるか、人が統合を管理します。詳細は [ドキュメント構成ガイド](docs-structure-guide.md) の `別リポジトリ構成` を参照してください。

成果物と実装を常に同じ変更・履歴として扱う場合に限り、**同一リポジトリ構成**としてプロダクトリポジトリのルートで同じ初期化手順を実行できます。CLI は構成を強制しません。

agent を使う場合は、設定ファイルを確認した後で利用する provider の設定を配置します。register
だけを使う最小構成では、この手順を省略できます。

```bash
npx specdojo config scaffold --provider <name>
```

`<name>` には `antigravity`、`claude`、`codex`、`copilot`、`opencode` を指定します。従来の
`specdojo exec scaffold --provider <name>` も互換入口として利用できます。

Antigravity CLI を無人実行する場合は、先に dry-run でユーザー設定へ追加する permission rule を確認し、明示的に適用します。このグローバル設定は利用者のすべてのリポジトリに効きます。通常の scaffold はユーザーディレクトリへ触れません。

```bash
npx specdojo config scaffold --provider antigravity --global --dry-run
npx specdojo config scaffold --provider antigravity --global
```

Dev Container は任意です。分離された環境が必要な場合だけ、既存の `.devcontainer/` がないことと生成内容を dry-run で確認してから作成します。

```bash
npx specdojo devcontainer scaffold --provider <name> --dry-run
npx specdojo devcontainer scaffold --provider <name>
```

Dev Container の `<name>` には `antigravity`、`claude`、`codex`、`opencode` を指定します。既存の `.devcontainer/` は通常実行では上書きされません。生成設定は provider の設定ディレクトリを名前付きボリュームに保存し、ホストの認証情報・秘密鍵・`.env` はマウントしません。Ollama 接続、cron、tmux は必要な場合だけ `--ollama`、`--cron`、`--tmux` で追加します。

設定したプロジェクトを確認します。

```bash
# チャット:「設定済みのプロジェクト一覧を見せて」
npx specdojo project list
```

以降の例では、対象プロジェクトを `<project-id>` と表記します。`current_project` を設定している場合も、最初は対象を確認しやすいように `--project` を明示します。

このガイドの基本手順は、exec 未設定でも完了できるように人が作業する経路を使います。agent に実行させる箇所は、`specdojo init --exec` で設定するか、`.specdojo/agent-members.yaml` と provider を [exec設定ガイド](exec-config-guide.md) に従って個別に設定した後に試してください。

### 2.2. kataの参照元を確認する

rulebook、standard、recipe、sample、template は、利用リポジトリに同じ ID のファイルがあればそれを優先し、無ければ npm package 内を参照します。初期導入時に kata 一式をコピーする必要はありません。

```bash
# npm package から参照中の rulebook を一覧する
npx specdojo kata list --kind rulebook

# 登録簿の rulebook を解決順序に従って表示する
npx specdojo kata show specdojo:pjr-rulebook
```

プロジェクト固有の変更が必要なファイルだけを正準パスへ eject します。eject 後は同じ ID の `SOURCE` が `node_modules` から `repository` へ変わります。

```bash
npx specdojo kata eject --id specdojo:pjr-rulebook
npx specdojo kata status --kind rulebook
```

CLI と同じバージョンで使う `exec-template` と `schema` は npm package 参照固定であり、eject できません。`kata install --all` は docs サイト配信やオフライン運用で全量コピーするときの選択肢で、通常の導入では実行しません。

## 3. registerで課題と判断を整理する

プロジェクトの開始時点では、解決すべき問題、判断が必要な事項、実施する作業が混在しています。まず register に個票として記録し、issue → decision → todo の順に具体化します。

```text
issue（何が問題か）
  -> decision（何を対象とするか）
  -> todo（成果物カタログを作成する）
  -> dct-<domain>.yaml
  -> schedule
```

### 3.1. 登録簿を用意する

`.specdojo/specdojo.config.json` の `project_register_path` を設定し、登録簿を初期生成します。

```bash
# チャット:「<project-id> の登録簿を用意して」
npx specdojo register scaffold --project <project-id>
```

### 3.2. issue、decision、todoを登録する

次の例では、初期スコープと必要な成果物が未確定な状態から、成果物カタログを作成する作業までを3つの個票で追跡します。コマンドはまとめて示していますが、実運用では issue の調査結果を受けて decision を起票し、決定後に todo を起票します。

```bash
# 1. 解決すべき問題を記録する
# チャット:「issue を起票して。タイトルは『初期スコープと必要成果物が未確定』、個票あり、topic は clarify-initial-scope」
npx specdojo register add \
  --project <project-id> \
  --type issue \
  --title "初期スコープと必要成果物が未確定" \
  --topic clarify-initial-scope

# 2. 選択肢と決定を記録する
# チャット:「decision を起票して。タイトルは『初期スコープと対象成果物を決定する』、個票あり、topic は decide-initial-scope」
npx specdojo register add \
  --project <project-id> \
  --type decision \
  --title "初期スコープと対象成果物を決定する" \
  --topic decide-initial-scope

# 3. 決定内容を実行可能な作業にする
# チャット:「高優先度の todo を起票して。タイトルは『プロジェクト定義の成果物カタログを作成する』、個票あり、topic は create-project-definition-catalog」
npx specdojo register add \
  --project <project-id> \
  --type todo \
  --priority high \
  --title "プロジェクト定義の成果物カタログを作成する" \
  --topic create-project-definition-catalog
```

`register add` の出力に表示された `PJR-XXXX` を控えます。すべての登録項目は、背景、選択肢、完了条件、結論などを記録する type 別の個票として生成されます。個票 Frontmatter が構造化フィールドの正本であり、一覧は個票から生成されます。成果物カタログを複数ドメインに分ける場合は、原則として `dct-<domain>.yaml` ごとに todo 個票を起票すると、対象と完了条件を追跡しやすくなります。

agent の run と並行して記帳し、その変更だけを commit まで完了させる場合は `register add` や状態遷移コマンドへ `--commit` を付けます。同じ project の `register lifecycle` 枠が空くまで待って記帳・一覧再生成・commit を行うため、別の run の記帳・統合と競合しません。対象の個票や event に既存の未 commit 変更がある場合は、混在を避けるため書き込み前に停止します。

| type       | 記録する内容                           | 完了状態  | agent実行                                  |
| ---------- | -------------------------------------- | --------- | ------------------------------------------ |
| `issue`    | 発生している問題、影響、原因、対応結果 | `done`    | `exec run --register` で対応できる         |
| `decision` | 判断の背景、選択肢、決定内容、決定理由 | `decided` | 対象外。人が判断して `register close` する |
| `todo`     | 実施内容、完了条件、作業結果           | `done`    | `exec run --register` で対応できる         |

### 3.3. 判断を確定してカタログ作成へ進む

issue に人が着手し、個票へ問題、影響、原因、対応方針を記入して完了させます。

```bash
# チャット:「issue <issue-id> に着手して」
npx specdojo register start --project <project-id> --id <issue-id>

# issue 個票を編集して調査結果を記録する

# チャット:「issue <issue-id> を『問題、影響、対応方針を整理』で完了して」
npx specdojo register close \
  --project <project-id> \
  --id <issue-id> \
  --conclusion "問題、影響、対応方針を整理"
```

issue の結論を基に、decision 個票へ選択肢、決定内容、理由を記入します。decision は agent の実行対象ではないため、人が判断して完了させます。

```bash
# チャット:「decision <decision-id> に着手して」
npx specdojo register start --project <project-id> --id <decision-id>

# decision 個票を編集して判断内容を記録する

# チャット:「decision <decision-id> を『採用するスコープと成果物を決定』で完了して」
npx specdojo register close \
  --project <project-id> \
  --id <decision-id> \
  --conclusion "採用するスコープと成果物を決定"
```

provider 未設定でも、`issue` や `todo` から生成される exec plan を確認できます。

```bash
# チャット:「issue または todo <issue-or-todo-id> の実行計画を作って」
npx specdojo exec plan --project <project-id> --register <issue-or-todo-id>
```

agent 設定が完了している場合は、同じ登録項目を実行できます。成功後は `review` になるため、人が result と成果物を確認して `register close` します。

```bash
# チャット:「issue または todo <issue-or-todo-id> を agent に実行させて」
npx specdojo exec run --project <project-id> --register <issue-or-todo-id>
```

個票内の `_TODO_` を解消してから `register close` すると、個票の文書状態も `ready` になります。基本手順では、成果物カタログ作成の todo を `open` のまま残し、`成果物カタログからscheduleへ展開する` で `dct-<domain>.yaml` を作成・検証した後に完了させます。登録簿は立ち上げ時の課題・判断・作業履歴、成果物カタログは合意後の管理対象成果物の正本です。同じ計画済み作業を register と schedule の両方で継続管理しません。

## 4. 成果物カタログからscheduleへ展開する

この経路では、成果物カタログ（`dct-<domain>.yaml`）とトラック戦略（`sch-strategy-<track>.yaml`）から Schedule を生成し、依存関係に従ってタスクを実行します。

### 4.1. 成果物カタログを作成する

成果物カタログは「何を、どこに作り、何を満たせば完了か」を定義する `dct-<domain>.yaml` です。`.specdojo/specdojo.config.json` の対象 project へ、たとえば `"catalog_path": "010-deliverables-catalog"` を追加してから次の順に実行します。パスの基準と後続の設定キーは [[specdojo:specdojo-config-reference|SpecDojo設定リファレンス]] を参照してください。

```bash
# プロジェクト規模に応じた dct-*.yaml をテンプレートから生成する
# チャット:「<project-id> の成果物カタログを small サイズで作成して」
npx specdojo catalog scaffold --project <project-id> --size small

# カタログの構造、ID、依存関係などを検証する
# チャット:「成果物カタログを検証して」
npx specdojo catalog validate --project <project-id>

# カタログが指す成果物ファイル本体を初回だけ生成する
# チャット:「カタログが指す成果物ファイルを一括生成して」
npx specdojo deliverable scaffold --project <project-id>

# カタログの Markdown 派生ビューを生成する
# チャット:「カタログの派生ビューをビルドして」
npx specdojo catalog build --project <project-id>

# dct-project-definition.yaml の作成 todo を完了する
# チャット:「todo <catalog-todo-id> を『対象成果物を dct-project-definition.yaml に定義し、検証を完了』で完了して」
npx specdojo register close \
  --project <project-id> \
  --id <catalog-todo-id> \
  --conclusion "対象成果物を dct-project-definition.yaml に定義し、検証を完了"
```

各コマンドの役割は次のとおりです。

| コマンド               | 作成・確認するもの                               | 再実行時の扱い                                                    |
| ---------------------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| `catalog scaffold`     | 規模別テンプレートから `dct-*.yaml` を作成する   | 既存ファイルは上書きしない。作り直す場合だけ `--force` を指定する |
| `catalog validate`     | カタログの構造、ID、依存関係を検証する           | カタログを変更するたびに実行する                                  |
| `deliverable scaffold` | カタログの `path` が指す成果物ファイル本体を作る | 既存成果物は上書きしない。通常は初期作成時に1回実行する           |
| `catalog build`        | `generated/dct-*.md` のカタログ派生ビューを作る  | 正本の `dct-*.yaml` を変更した後に再実行する                      |

`--size` には `small` / `medium` / `large` を指定します。`catalog scaffold` 後は、生成された全成果物をそのまま採用するのではなく、プロジェクトのスコープに合わせて `dct-*.yaml` の成果物、依存関係、完了条件を確認してください。

### 4.2. トラック戦略を作成する

`sch-strategy-<track>.yaml` は、成果物カタログを実行タスクへ展開するための生成入力です。成果物カタログが WHAT / DONE を持つのに対し、strategy は対象カタログ、作業フェーズ、担当ロールを定義します。新規 strategy は DCT・Timeline・整備状況判定から `schedule strategy generate` で作成し、既存 strategy の owner や開始日などの人間が決めた項目は再生成時も保持します。

この段階へ進む前に、対象 project へ `schedule_path`、`execution_path`、`timeline_path`、`members_path`、`roles_path` を追加します。値は [[specdojo:specdojo-config-reference|SpecDojo設定リファレンス]] の設定例を参照し、前節で生成したファイルの配置と合わせてください。

`deliverable scaffold` で作成した `pm-members.yaml` の `members` に、タスクを実行する人を登録します。次の例では `<actor>` が BA ロールを担当します。

<details>
<summary>pm-members.yaml への追記例（クリックで展開）</summary>

```yaml
members:
  - nickname: <actor>
    display_name: Quick Start Operator
    email: null
    roles: [BA]
    type: human
```

</details>

先に `sch-strategy-launch.yaml` の `approach_rules` へ成果物ごとの intent を宣言し、必要な Kata を `specdojo grade` で評価します。v0.3.0 の npm package では grade の通しの実行は提供せず、試験的な `grade plan` / `agent run` / `grade apply` などの部品を組み合わせます。1 文書の手順は [CLI コマンドリファレンス](../references/command-reference.md#81-npm-package-で-1-文書を評価する)を参照してください。次のコマンドで strategy の差分を確認して生成します。`<role>` は `pm-roles.yaml` に定義された主担当ロールへ置き換えてください。

```bash
npx specdojo schedule strategy generate --project <project-id> --track launch \
  --default-owner <role> --gate-owner <role> --milestone-owner <role> --dry-run
npx specdojo schedule strategy generate --project <project-id> --track launch \
  --default-owner <role> --gate-owner <role> --milestone-owner <role>
```

以下は生成後の strategy 構造を理解するための例です。small の `dct-project-definition.yaml` に含まれる3成果物を依存順に作成・確認し、最初の Ready タスクが `prj-overview` になる構成を示します。

<details>
<summary>sch-strategy-launch.yaml の全体例（クリックで展開）</summary>

```yaml
kind: strategy
id: <project-id>:sch-strategy-launch
type: project
status: ready
title: スケジュール戦略（launch）
rulebook: specdojo:sch-rulebook
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

</details>

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

### 4.3. Scheduleを生成する

```bash
# チャット:「<track> トラックの schedule を生成して」
npx specdojo schedule build --project <project-id> --track <track> --force
# チャット:「実行状態と Ready、CPM を生成して」
npx specdojo exec refresh --project <project-id>
```

`exec refresh` により、着手可能なタスクが `generated/ready.json` に出力されます。

`schedule build` は strategy と対象カタログから、実行対象となる `sch-track-<track>.yaml` を生成します。`exec refresh` はそこから Ready タスク、CPM、タイムラインなどを生成します。

### 4.4. 1タスクを実行する

次のタスクを確認して claim します。`execution: human` のタスクは agent を起動せず、claim 時に確認用resultを生成します。人が成果物とresultを編集してから完了を記録します。

```bash
# 次のタスクを確認する（claim はしない）
# チャット:「次に着手すべきタスクを <actor> で確認して。claim はしないで」
npx specdojo exec scheduler --project <project-id> --by <actor> --dry-run

# 確認した task-id を claim する
# チャット:「タスク <task-id> を <actor> で claim して」
npx specdojo exec claim --project <project-id> --task <task-id> --by <actor>

# 成果物と、claim 時に生成された result のチェックリスト・確定判断を編集する

# 完了を記録する
# チャット:「タスク <task-id> を <actor> で完了にして」
npx specdojo exec complete --project <project-id> --task <task-id> --by <actor>

# 次の Ready タスクを更新する
# チャット:「Ready タスクを更新して」
npx specdojo exec refresh --project <project-id>
```

成果物の変更は作業ツリーに、実行結果は `<execution_path>/exec/results/` に記録されます。agent による自動実行や並列実行へ進む場合は、[exec設定ガイド](exec-config-guide.md) で設定してから [Schedule実行運用ガイド](schedule-operation-guide.md) を参照してください。

`mode: review` のタスクを実行すると、runner は review plan の生成前に対象成果物を grade します。ただし、この自動 grade は npm package に含まれない本体リポジトリ開発用の `tools/grade/run-per-document.sh` を使うため、v0.3.0 の公開物では実行されません。公開物では、`catalog_path` を設定したうえで grade の部品を使って成果物を事前評価します。grade は成果物の品質を観点ごとに評価し、review はその評価結果を付け直さず、変更内容・実行記録・`done_criteria` を照合してタスクの完了可否を判断します。review result の verdict と finding の読み方、成果物を `ready` にする human finalize との境界は [レビューガイド](review-guide.md) を参照してください。

agent に review を実行させる場合は、`exec run --plan` で executor と reporter を指定して 2 段で実行します。

```bash
# review を 2 段で実行する
npx specdojo exec run --project <project-id> --plan <execution_path>/exec/plans/<task-id>-plan.md \
  --executor-by <executor-nickname> --reporter-by <reporter-nickname>
```

ここまでで、register による立ち上げ整理から、成果物カタログ、Schedule、1タスクの完了までの Quick Start は終了です。以降の worktree 隔離実行と routine は、agent 設定後に試す任意の発展手順です。

## 5. （発展）worktreeで1タスクを隔離実行する

前節「1タスクを実行する」は human・in-place の経路でした。agent に成果物を作らせる場合は、変更を git worktree に隔離して実行し、成功時に現在ブランチへ merge back できます。この経路は agent・provider の設定が前提です。先に [exec設定ガイド](exec-config-guide.md) に従って `.specdojo/agent-members.yaml` の agent と `.specdojo/exec-defaults.yaml` を用意し、`execution: agent` のフェーズを持つ strategy で `schedule build` / `exec refresh` まで済ませておきます。

対象タスクを worktree に隔離して一括実行します。SpecDojo が worktree 準備・agent 実行・commit・merge・状態更新をまとめて行います。

```bash
# 実行前に統合先ブランチ（例: project/<project-id>/develop）にいることを確認する
git branch --show-current

# 1 タスクを worktree で隔離実行する
# チャット:「タスク <task-id> を worktree で隔離実行して」
npx specdojo exec run --project <project-id> --task <task-id> --worktree

# Ready 順に自動で隔離実行する場合
# チャット:「Ready タスクを worktree で並列5件、自動実行して」
npx specdojo exec run --project <project-id> --auto --parallel 5
```

各段階（prepare → agent → commit → merge → remove）を人が確認しながら進める場合は [exec worktree運用ガイド](exec-worktree-guide.md)、project `develop`・feature・exec のブランチ全体運用は [ブランチワークフローガイド](branch-workflow-guide.md)、自動・並列実行の運用は [Schedule実行運用ガイド](schedule-operation-guide.md) を参照してください。

## 6. routineで定期実行する

この経路では、動作確認済みの Job を `rtn-*.yaml` に定義した間隔で起動します。Job は schedule または register のagent実行を決定論的なコマンドで呼び出します。routine は任意の発展手順です。先に [exec設定ガイド](exec-config-guide.md) に従ってagentを設定し、次のような open かつ高優先度のtodoを用意します。

```bash
# チャット:「高優先度の todo『日次確認事項に対応する』を起票して」
npx specdojo register add \
  --project <project-id> \
  --type todo \
  --priority high \
  --title "日次確認事項に対応する"
```

次のroutine例は、このようなtodoを毎日最大3件実行します。先に `jobs_path` 配下へ `job-register-sweep.yaml` を配置してください。このリポジトリの定義例は `docs/ja/projects/prj-0001/jobs/job-register-sweep.yaml`、入力制約の規約は [Job定義標準](../standards/job-definition-standard.md) を参照します。

`.specdojo/specdojo.config.json` の `routines_path` 配下に `rtn-daily-register-sweep.yaml` を作成します。

<details>
<summary>rtn-daily-register-sweep.yaml の例（クリックで展開）</summary>

```yaml
id: rtn-daily-register-sweep
name: 登録簿 open todo の日次スイープ
enabled: true
interval: 1d
action:
  kind: job
  job: job-register-sweep
  inputs:
    types: todo
    priorities: high
    statuses: open
    limit: "3"
```

</details>

定義を検証し、実行対象を確認してから1回実行します。

```bash
# チャット:「ルーチン定義を検証して」
npx specdojo routine validate --project <project-id>
# チャット:「ルーチン一覧を見せて」
npx specdojo routine list --project <project-id>
# チャット:「rtn-daily-register-sweep を dry-run で確認して」
npx specdojo routine run --project <project-id> --id rtn-daily-register-sweep --dry-run
# チャット:「rtn-daily-register-sweep を実行して」
npx specdojo routine run --project <project-id> --id rtn-daily-register-sweep
```

継続運用では、cron や CI の scheduled workflow から次のコマンドを定期的に呼び出します。CLI 自体は常駐しません。

```bash
# チャット:「due なルーチンをまとめて実行して」
npx specdojo routine run --project <project-id> --due
```

schedule の自動実行や利用制限後の再開を起動する定義、`interval` と `last_run` の扱いは [routine運用ガイド](routine-operation-guide.md) を参照してください。
