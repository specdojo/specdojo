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
- CLI の初期設定と、register のユースケース別の使い方
- issue / decision / todo から成果物カタログと Schedule へ展開する手順
- npm package の kata を参照し、必要なものだけ eject する方法

**次に読む文書**

- register のtypeと状態遷移は [登録簿運用ガイド](register-operation-guide.md) を参照してください。
- Scheduleの自動・手動実行は [Schedule実行運用ガイド](schedule-operation-guide.md)、agent設定は [exec設定ガイド](exec-config-guide.md) を参照してください。

各コマンドには、設定済みのオーケストレーター（`specdojo-orchestrator`）へチャットで指示する場合の文言を `# チャット:` として併記します。オーケストレーターは指示を対応する `specdojo` サブコマンドへ変換し、状態を変える操作は実行前に内容を提示して承認を求めます。オーケストレーターはターミナル（`npm run orch:<provider>`）だけでなく、VS Code の各種拡張機能（Copilot Chat、Claude Code、Codex）からも利用できます。導入先での設定と起動方法は [オーケストレーター運用ガイド](orchestrator-operation-guide.md)（VS Code からの利用は [VS Code から使う](orchestrator-operation-guide.md#22-vs-code-から使う) 節）を参照してください。`<project-id>` などのプレースホルダは実際の値に読み替えてください。

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
Create a Dev Container? [y/N]: y                    <- y（Dev Container を作る。使わない場合は Enter）
Dev Container preset (minimal, recommended, full) [recommended]:  <- Enter（推奨 preset を選ぶ）
Create Git hooks with lefthook? [y/N]:               <- Enter（この体験では作らない）
```

入力が不正な場合は理由が表示され、同じ質問だけがもう一度表示されます。たとえば provider に
`claud` と入力すると、利用可能な provider の一覧に続いて provider の質問だけが再表示されます。
それまでに答えた project や名簿の内容を入力し直す必要はありません。

Dev Container を作る質問に `y`、preset に Enter と答えると、既定の `recommended` が選ばれ、tmux・Emacs・Vim・推奨の VS Code 拡張と設定・`.vscode/extensions.json` が入った環境が生成されます。作成したコンテナは、VS Code の「コンテナーで再度開く」または `devcontainer up` で開けます（詳しい説明は [[specdojo:remote-host-development-guide]] を参照）。Dev Container を使わずに手元の環境で進めたい場合は、Dev Container の質問に Enter または `n`（いいえ）と答えて先へ進めます。この 10 分の体験は記帳だけで進められるため、コンテナを開かずにそのままホスト環境で続けて構いません。

登録簿は `docs/ja/projects/prj-0001/controls/project-register/` に作られます。オーケストレーターで進める場合は、終了時に表示される `npm run orch:<provider>` で起動します。成果物カタログは対話では作られません。成果物の構成が定まったら、[[#41-成果物カタログを作成する|成果物カタログを作成する]] に従って `catalog_path` を設定し、`catalog scaffold` で追加してください。

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
exec・Dev Container・Git hook の要否を順に質問し、Dev Container を選んだ場合だけ `minimal` / `recommended` / `full` の preset（既定は `recommended`）を続けて質問します。Git hook は既定では作りません。成果物カタログは対話では質問せず、`--catalog <size>` を
明示した場合にだけ初期化時に作成します。選択に応じて設定、登録簿、人と
agent の名簿、provider の scaffold、`package.json` の `orch:<provider>`、exec の起動設定を
作成します。exec の親検証は、対応する npm script が `package.json` にあるものだけを設定し、
該当する script がなければ省略します。既存ファイルは上書きせず、作成内容は `--dry-run` で
先に確認できます。対話中に不正な値を入力した場合は理由を表示して同じ質問だけをやり直し、
それまでの回答は保持します。非対話環境や `--yes` では再質問せず、不正な指定をエラーとして終了します。

CI や標準入力が端末でない環境では質問しません。次のようにオプションだけで同じ初期設定を
行えます。`--devcontainer` を指定した場合は既定で `recommended` preset（tmux・Emacs・Vim・推奨の VS Code 拡張と設定）が入ります。CLI と最低限だけにする場合は `--devcontainer-preset minimal` を指定します。従来の `none` も `minimal` と同じ意味で受け付けます。省略値は画面に表示されます。

```bash
npx specdojo init --yes \
  --project prj-0001 \
  --name "Example Project" \
  --nickname owner \
  --display-name "Project Owner" \
  --provider claude,codex \
  --exec \
  --devcontainer \
  --lefthook \
  --dry-run
```

初期化後は、表示された `npm run orch:<provider>` でオーケストレーターを起動し、最初の 1 件を
起票します。成果物カタログが必要になった場合は、`.specdojo/specdojo.config.json` に `catalog_path` を設定して `specdojo catalog scaffold` で追加します（詳細は [[#41-成果物カタログを作成する|成果物カタログを作成する]] を参照）。オーケストレーターを使わない場合は、同じ案内に表示される
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

通常の `init` と `config init` は、markdownlint の設定がなければリポジトリ直下に
`.markdownlint.yaml` も作ります。日本語の長い行などを許容するため、MD013・MD024・MD033・MD036・MD041・MD060
を無効にし、ほかの記法検査は維持します。既存の設定は上書きしません。既存の利用リポジトリでも
`npx specdojo config init --dry-run` で確認してから `npx specdojo config init` を再実行すると、
不足する設定を追加できます。設定がないままでも、exec の result の commit 前検査は同じ基本規則を使います。
既存設定で MD013 が有効ならその指定を優先するため、長い行を許容する場合は利用側の設定で
`MD013: false` を指定してください。CLI2 と hook の設定の関係は
[[specdojo:command-reference|CLIコマンドリファレンス]] を参照してください。

プロダクト文書は `app1/docs/ja/product/`、プロジェクト文書は `app1-specdojo/docs/ja/projects/` に置きます。同梱の SpecDojo の型（Kata）は `app1-specdojo/docs/ja/specdojo/<種類>s/`、このリポジトリで新しく作る kata はその下の `<kata_authority>/` から解決します。現行実装では1つの項目で両リポジトリを自動統合できないため、プロダクト文書や実装も変更する項目は分けるか、人が統合を管理します。詳細は [ドキュメント構成ガイド](docs-structure-guide.md) の `別リポジトリ構成` を参照してください。

成果物と実装を常に同じ変更・履歴として扱う場合に限り、**同一リポジトリ構成**としてプロダクトリポジトリのルートで同じ初期化手順を実行できます。CLI は構成を強制しません。

agent を使う場合は、設定ファイルを確認した後で利用する provider の設定を配置します。register
だけを使う最小構成では、この手順を省略できます。

```bash
npx specdojo config scaffold --provider <name>
```

`<name>` には `antigravity`、`claude`、`codex`、`copilot`、`opencode` を指定します。従来の
`specdojo exec scaffold --provider <name>` も互換入口として利用できます。

commit 前に文書と SpecDojo の入力を検査する場合は、生成予定と `package.json` への追加内容を
dry-run で確認してから lefthook を配置します。

```bash
npx specdojo config scaffold --lefthook --dry-run
npx specdojo config scaffold --lefthook
npm install
```

生成した hook は、変更した Markdown と YAML だけを Prettier で整形し、変更した Markdown だけを
markdownlint で検査します。対象 project の `project_register_path` 配下を変更した場合は
`register build`、`catalog_path` 配下を変更した場合は `catalog validate` も実行します。
`catalog_path` がない構成には catalog の検査を生成せず、時間のかかるテストも pre-commit には
含めません。設定がなければ、同じ基本規則の `.markdownlintrc` と VS Code 向けの
`.markdownlint-cli2.yaml`、provider の agent 定義を検査から外す `.markdownlintignore` も生成します。
`init --lefthook` / `--slidev` もこの配置を使います。既存の `.markdownlint.yaml` などの設定と ignore は
`--force` を付けても保持します。CLI2 の overrides を使う場合は
[[specdojo:command-reference|CLIコマンドリファレンス]] の手順で既存設定を `.markdownlintrc` に移してください。
`lefthook.yml` と `tools/` の既存ファイルは `--force` なしでは上書きしません。
必要な npm script と devDependencies は書き込み前に表示し、同名の既存項目は `--force` を付けても
保持します。linked worktree または `node_modules` がない環境では installer が安全に skip するため、
primary worktree で `npm install` または `node tools/install-lefthook.mjs` を実行してください。

Antigravity CLI を無人実行する場合は、先に dry-run でユーザー設定へ追加する permission rule を確認し、明示的に適用します。このグローバル設定は利用者のすべてのリポジトリに効きます。通常の scaffold はユーザーディレクトリへ触れません。

```bash
npx specdojo config scaffold --provider antigravity --global --dry-run
npx specdojo config scaffold --provider antigravity --global
```

Dev Container は任意です。分離された環境が必要な場合だけ、既存の `.devcontainer/` がないことと生成内容を dry-run で確認してから作成します。

```bash
npx specdojo devcontainer scaffold --provider <name> --preset recommended --dry-run
npx specdojo devcontainer scaffold --provider <name> --preset recommended
```

Dev Container の `<name>` には `antigravity`、`claude`、`codex`、`opencode` を指定します。`--preset recommended` を指定すると、`gh`・tmux・Emacs・Vim・推奨の VS Code 拡張と設定がまとめて設定されます。既存の `.devcontainer/` は通常実行では上書きされません。生成設定は provider の設定ディレクトリと `gh` の認証を名前付きボリュームに保存し、ホストの認証情報・秘密鍵・`.env` はマウントしません。GitHub へのログインは必要なときに利用者がコンテナ内で行います。preset を使わない場合は `gh` の導入と認証 volume を行わず、Ollama 接続、cron、tmux は必要な場合だけ `--ollama`、`--cron`、`--tmux` で個別に足せます。詳しい説明は [[specdojo:remote-host-development-guide]] を参照してください。

| preset        | 内容                                                                                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `minimal`     | 選んだ provider の CLI と SpecDojo の動作に必要な最小構成。preset を省略した場合と同じ。                                                             |
| `recommended` | `minimal` に `gh`、Emacs、Vim、tmux、文書作業向けの VS Code 拡張・設定を追加する。                                                                   |
| `full`        | `recommended` に ripgrep、fd、fzf、yq、shellcheck、shfmt、Ollama 接続、cron を追加する。fd は `fd-find` package から `fd` コマンドとして利用できる。 |

`--ollama`・`--cron`・`--tmux`・`--editor` はどの preset にも個別に追加できます。詳しい説明は [[specdojo:remote-host-development-guide]] を参照してください。

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

## 3. registerをユースケース別に使う

register は、後から追跡したい問題・判断・作業を個票として残す入口です。この章では、よくある状況ごとに「こんなとき」「チャットでの頼み方」「コマンド」を並べます。type の詳しい選び方と状態遷移は [登録簿運用ガイド](register-operation-guide.md)、approach と実行 pipeline の詳細は [exec運用ガイド](exec-operation-guide.md) を参照してください。複数の機能を組み合わせたシナリオから読みたい場合は [[specdojo:use-case-guide|ユースケース別ガイド]] へ進んでください。

初期設定で register を作らなかった場合は、先に `.specdojo/specdojo.config.json` の `project_register_path` を設定して登録簿を用意します。

```bash
# チャット:「<project-id> の登録簿を用意して」
npx specdojo register scaffold --project <project-id>
```

コマンドの `<project-id>`、`<PJR-ID>`、`<deliverable-doc-id>`、`<kata-doc-id>` は実際の値に置き換えます。`register add` が表示した `PJR-XXXX` を、続く `exec run` で使います。起票と同時に commit まで行う必要がある場合は `register add` に `--commit` を付けます。

### 3.1. 作業を起票してAIに任せる

**こんなとき:** 完了条件を書ける作業を todo として追跡し、難しさに合う agent へ安全に任せたいとき。

`difficulty` は agent の能力や作業範囲から選びます。`exec run` は `.specdojo/exec-defaults.yaml` の `routing` に同じ難しさの設定があれば、その executor・reporter・rate limit 対応を使います。`--executor-by` などをコマンドで指定した場合は、その指定が優先されます。

| `difficulty` | 目安                                             | 振り分け                                        |
| ------------ | ------------------------------------------------ | ----------------------------------------------- |
| `hard`       | 設計判断、広い影響範囲、複数ファイルの難しい変更 | `routing.hard`。推論力の高い agent を割り当てる |
| `medium`     | 手順と完了条件が明確な通常の実装・文書変更       | `routing.medium`。標準の executor を割り当てる  |
| `easy`       | 範囲が狭く、機械的で、失敗時の影響が小さい変更   | `routing.easy`。軽量な executor を割り当てる    |

```bash
# チャット:「中くらいの難しさの todo『検索結果の空表示を直す』を起票して、worktree で agent に任せて」
npx specdojo register add \
  --project <project-id> \
  --type todo \
  --title "検索結果の空表示を直す" \
  --topic fix-empty-search-result \
  --difficulty medium
npx specdojo exec run \
  --project <project-id> \
  --register <PJR-ID> \
  --worktree
```

成功すると個票は `review` になります。成果物と result を人が確認した後、`register close` で完了させます。

### 3.2. 問題を調べて直す

**こんなとき:** 症状は分かっているが、原因や直し方を調べる必要があるとき。issue の個票へ問題、影響、原因、対応結果を残します。

```bash
# チャット:「issue『CSV 出力で文字化けする』を起票して、難しさ hard で調査と修正を任せて」
npx specdojo register add \
  --project <project-id> \
  --type issue \
  --title "CSV 出力で文字化けする" \
  --topic csv-encoding \
  --difficulty hard
npx specdojo exec run \
  --project <project-id> \
  --register <PJR-ID> \
  --worktree
```

原因調査だけで終えず、個票の完了条件に再現条件、修正範囲、検証方法を書いてから実行します。

### 3.3. 決めることを残す

**こんなとき:** まだ答えがない論点を question として残したいとき、または選択肢・採択理由を decision として記録したいとき。

```bash
# チャット:「question『支払い方法をどこまで扱うか』を起票して」
npx specdojo register add \
  --project <project-id> \
  --type question \
  --title "支払い方法をどこまで扱うか" \
  --topic payment-scope

# チャット:「decision『初期リリースの支払い方法を決める』を起票して」
npx specdojo register add \
  --project <project-id> \
  --type decision \
  --title "初期リリースの支払い方法を決める" \
  --topic decide-payment-methods
```

question から decision、仕様書への反映、後日の変更までを一度通す場合は [[#1-10分で体験する--仕様の判断台帳|1. 10分で体験する — 仕様の判断台帳]] の流れを使います。decision は agent に判断させる実行対象ではなく、人が選択肢と理由を確認して `register close` します。

### 3.4. 合意した範囲を変える

**こんなとき:** 決定済みの仕様、スコープ、成果物へ変更を加え、理由と影響を追跡したいとき。

```bash
# チャット:「change-request『交通系電子マネーを支払い方法に加える』を起票して、影響を確認して反映して」
npx specdojo register add \
  --project <project-id> \
  --type change-request \
  --title "交通系電子マネーを支払い方法に加える" \
  --topic add-ic-card-payment \
  --difficulty medium
npx specdojo exec run \
  --project <project-id> \
  --register <PJR-ID> \
  --worktree
```

個票の `変更要求`、`影響評価`、`審査・決定` を埋め、元の decision や仕様書を参照できるようにします。

### 3.5. リスクと気づきを残す

**こんなとき:** 発生前に対応を追跡するなら risk、対応や判断を要求しない観察記録なら note として残したいとき。

```bash
# チャット:「risk『移行日に旧端末が残る』を起票して」
npx specdojo register add \
  --project <project-id> \
  --type risk \
  --title "移行日に旧端末が残る" \
  --topic legacy-terminal-on-migration \
  --priority high

# チャット:「note『検証環境では朝に負荷が上がる』を記録して」
npx specdojo register add \
  --project <project-id> \
  --type note \
  --title "検証環境では朝に負荷が上がる" \
  --topic morning-load-observation
```

risk は必要なら `exec run --register` で軽減策を実行できます。note は `open` のまま追記する記録で、close や agent 実行の対象にはしません。対応が必要になったら、note を元に todo や issue を起票します。

### 3.6. 成果物を作る・直す

**こんなとき:** 1 文書を、利用できる kata の整備状況に合う進め方で作成・更新したいとき。

| `approach`      | 選ぶ状況                                                         |
| --------------- | ---------------------------------------------------------------- |
| `fully-guided`  | rulebook・recipe・sample・template が揃い、すべてを基準に進める  |
| `recipe-guided` | recipe を主な手順として使い、ほかの kata が未整備でも進める      |
| `retrofit`      | 先にある実装や現行動作を調べ、その証拠から成果物を作成・更新する |

```bash
# チャット:「成果物 <deliverable-doc-id> を fully-guided で直す todo を起票して、agent に任せて」
npx specdojo register add \
  --project <project-id> \
  --type todo \
  --title "対象成果物を実践の型に沿って改訂する" \
  --topic revise-deliverable \
  --difficulty hard \
  --approach fully-guided \
  --target <deliverable-doc-id>
npx specdojo exec run \
  --project <project-id> \
  --register <PJR-ID> \
  --worktree
```

`recipe-guided`・`freeform`・`retrofit` を使う場合は、上の `--approach fully-guided` を選んだ値へ置き換えます。`--target` は成果物の doc id を 1 件指定します。カタログにある対象は従来どおりカタログの `done_criteria` と個票の完了条件を使います。

カタログがない場合、既存文書は文書索引からパスと frontmatter の `specdojo.rulebook` を辿れます。これから作る文書は、次のようにリポジトリ相対のパスと rulebook ID を個票に保存します。

```bash
npx specdojo register add \
  --project <project-id> --type todo \
  --title "文書を実践の型に沿って作る" --topic create-document \
  --approach fully-guided --target <deliverable-doc-id> \
  --target-path docs/ja/product/example.md \
  --target-rulebook <kata-authority>:example-rulebook
npx specdojo exec plan --project <project-id> --register <PJR-ID>
```

`--target-rulebook` の rulebook と、そこから参照する必要な kata は先に用意します。`fully-guided` は `not-needed` と宣言された型を除く一式、`recipe-guided` は recipe が必要です。不足する型は起票時に名前を示して停止します。個票の「完了条件」を具体化してから実行してください。カタログなしの完了基準は個票の完了条件と rulebook です。`retrofit` では調べる実装のパスも個票に明記します。

パスと rulebook は `register update --target-path <path> --target-rulebook <doc-id>` で更新でき、それぞれ `-` で削除できます。既存文書のパスや `specdojo.rulebook` と指定が食い違う場合は停止します。カタログ設定済みで対象が未登録の場合は、この 2 つを明示したときだけ同じ解決を使います。

### 3.7. 成果物とkataを一組で作る

**こんなとき:** プロジェクトの初期立ち上げで、成果物だけでなく、その成果物を繰り返し作るための rulebook・recipe・sample・template も同じ実行で初期整備したいとき。

```bash
# チャット:「成果物 <deliverable-doc-id> と必要な kata 一式を bootstrap で作る todo を起票して、agent に任せて」
npx specdojo register add \
  --project <project-id> \
  --type todo \
  --title "成果物と実践の型を初期整備する" \
  --topic bootstrap-deliverable-kata \
  --difficulty hard \
  --approach bootstrap \
  --target <deliverable-doc-id>
npx specdojo exec run \
  --project <project-id> \
  --register <PJR-ID> \
  --worktree
```

カタログなしの `bootstrap` では、上の起票に `--target-path docs/ja/product/example.md --target-rulebook <kata-authority>:example-rulebook` を追加し、設定ファイルに `kata_authority` を指定します。新しい rulebook ID が必要で、既存 ID は受け付けません。plan は `docs/ja/specdojo/<kind>s/<kata-authority>/example-<kind>.md` に未作成の kata を示し、成果物の `specdojo.rulebook` と rulebook の kata 参照を記入するよう指示します。

`finalize`・`bootstrap-finalize` は既存文書だけを対象にできます。カタログなしでは個票の完了条件をチェック表にし、人が成果物を確定します。`bootstrap-finalize` は frontmatter から辿る kata 一式も確定対象です。`cross-deliverable-dedup` は成果物群を扱うためカタログが必要です。

`bootstrap` は初期整備用です。既に信頼できる kata が揃っている成果物の通常改訂には `fully-guided` を使います。

### 3.8. kataを直す

**こんなとき:** 成果物ではなく、作り方・手順・例・雛形そのものを改善したいとき。

| 直す kata | `approach`             |
| --------- | ---------------------- |
| rulebook  | `rulebook-maintenance` |
| recipe    | `recipe-maintenance`   |
| sample    | `sample-maintenance`   |
| template  | `template-maintenance` |

```bash
# チャット:「rulebook <kata-doc-id> を見直す todo を起票して、agent に任せて」
npx specdojo register add \
  --project <project-id> \
  --type todo \
  --title "成果物の作成ルールを見直す" \
  --topic maintain-rulebook \
  --difficulty hard \
  --approach rulebook-maintenance \
  --target <kata-doc-id>
npx specdojo exec run \
  --project <project-id> \
  --register <PJR-ID> \
  --worktree
```

ほかの kata を直す場合は、表に従って `--approach` を置き換えます。`--target` には文書索引で解決でき、approach の種別と一致する kata の doc id を 1 件だけ指定します。

### 3.9. 既存成果物からkataを新しく作る

**こんなとき:** 成果物は既にあり、その実績を手本に rulebook など 1 種類の kata だけを新しく作りたいとき。

```bash
# チャット:「成果物 <deliverable-doc-id> を手本に <kata-id> の rulebook を新しく作る todo を起票して、agent に任せて」
npx specdojo register add \
  --project <project-id> \
  --type todo \
  --title "既存成果物からrulebookを作る" \
  --topic author-rulebook \
  --difficulty hard \
  --approach rulebook-authoring \
  --target <kata-authority>:<name>-rulebook \
  --source <deliverable-doc-id>
npx specdojo exec run \
  --project <project-id> \
  --register <PJR-ID> \
  --worktree
```

`--target` は新しい kata ID、`--source` は任意の読み取り専用の手本です。`--source` は繰り返し指定でき、文書索引の doc id、プロジェクトリポジトリの相対パス、`repos` に宣言した `<repo>:<path>` を受け付けます。パスにはファイル、ディレクトリ、`*.md` などの glob を書けます。たとえば `--source docs/ja/lessons/01-chase/README.md` や `--source 'coderdojo-lessons:lessons/**/*.md'` の形です。カタログがない project でも使えますが、手本が見つからない場合と展開後に 100 ファイルを超える場合は停止します。互換性のため、2 個目以降の `--target` も手本として引き続き受け付けます。

成果物も型もまだない初期立ち上げには `bootstrap` を使います。手本なしで kata だけを作る場合は `--source` を省略します。recipe / sample / template では `approach` と ID の末尾を同じ種類へ置き換えます。手本がカタログ成果物で該当参照が `undecided` または未記入の場合だけ参照を新しい kata ID へ更新し、カタログ外とプロダクトリポジトリの手本は変更しません。

### 3.10. 統合後にreviewのagentへ確かめさせる

**こんなとき:** worktree の成果を統合した後、完了条件・result・差分・検証結果を別の review agent に照合させたいとき。

```bash
# チャット:「todo または issue <PJR-ID> を worktree で実行し、統合後の review まで任せて」
npx specdojo exec run \
  --project <project-id> \
  --register <PJR-ID> \
  --worktree \
  --post-review
```

`--post-review` は worktree 実行でだけ使えます。todo と issue は判定が `complete` または `complete-with-findings` なら自動 close され、`incomplete` なら `waiting` に戻ります。question、decision、および SpecDojo 自身のコードを変えた項目は自動 close されません。

### 3.11. 夜の間に流す

**こんなとき:** 人が内容と完了条件を確認した todo・issue だけを、夜間に worktree と post-review 付きでまとめて流したいとき。

```bash
# チャット:「todo または issue <PJR-ID> を夜間実行してよい印に更新して」
npx specdojo register update \
  --project <project-id> \
  --id <PJR-ID> \
  --autopilot approved \
  --commit

# チャット:「<project-id> の承認済み項目を、最大10件、並列2件で夜間実行して」
npx specdojo orchestrator night \
  --project <project-id> \
  --max-items 10 \
  --parallel 2 \
  --max-consecutive-failures 2
```

夜間 queue に入るのは `autopilot: approved` の付いた `open` の todo と issue だけです。まず対象を確認する場合は、`orchestrator night` に `--dry-run` を付けます。朝の報告には close、`waiting`、失敗した項目がまとめられます。

### 3.12. 止まった項目を再開する

**こんなとき:** register の worktree 実行が agent、検証、reporter、統合の途中で止まり、残っている成果を生かして続けるか、破棄して最初からやり直したいとき。

```bash
# チャット:「<PJR-ID> を止まった段から再開して」
npx specdojo exec run \
  --project <project-id> \
  --register <PJR-ID> \
  --worktree \
  --resume

# チャット:「<PJR-ID> は親検証の失敗を直すため、executor から再開して」
npx specdojo exec run \
  --project <project-id> \
  --register <PJR-ID> \
  --worktree \
  --resume \
  --resume-from executor

# チャット:「<PJR-ID> の残っている worktree を破棄し、最初からやり直して」
npx specdojo exec run \
  --project <project-id> \
  --register <PJR-ID> \
  --worktree \
  --force-restart
```

| 指定                     | 使い分け                                                             |
| ------------------------ | -------------------------------------------------------------------- |
| `--resume`               | checkpoint が示す executor、reporter、統合の段から再開する           |
| `--resume-from executor` | reporter から再開可能だが、成果物を executor に直させる必要がある    |
| `--force-restart`        | 再開用 worktree と未統合の成果を破棄して、項目全体を最初から実行する |

`--force-restart` は未統合の成果を破棄します。先に evidence と agent のログを確認し、再利用しないと判断した場合だけ指定します。

### 3.13. 別のproject・別のリポジトリへ起票する

**こんなとき:** 作業中の気づきが別 project の責務であり、その project の登録簿と統合ブランチへ、起票元との関係を残して渡したいとき。

同じリポジトリ内の別 project には、対象 project と起票元を project 修飾 ID で指定します。

```bash
# チャット:「prj-0001:PJR-AB12 から派生した todo を prj-0002 へ起票して commit して」
npx specdojo register add \
  --project prj-0002 \
  --type todo \
  --title "共通 API の変更を追跡する" \
  --topic shared-api-change \
  --from prj-0001:PJR-AB12 \
  --commit
```

別リポジトリの場合は、呼び出し元の `.specdojo/specdojo.config.json` のトップレベルへ相手を宣言します。

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

宣言した別名を `--project` に使い、相手側にある起票元は `<別名>:PJR-XXXX` で指定します。

```bash
# チャット:「外部 project customer の PJR-AB12 から派生した todo を、customer へ起票して commit して」
npx specdojo register add \
  --project customer \
  --type todo \
  --title "相手側で追跡する" \
  --topic remote-follow-up \
  --from customer:PJR-AB12 \
  --commit
```

どちらも別 project への起票では `--commit` が必須です。別リポジトリでは、相手に SpecDojo 0.4.2 以上と対象 project の統合ブランチが必要です。push は行わず、close などの状態遷移は対象 project の作業ツリーで行います。

### 3.14. issueからdecision、epic、成果物カタログ・Scheduleへ進む

プロジェクト立ち上げ時に、問題、判断、実施作業がまだ混在している場合は、次の順で具体化します。register が起点と完了の判断を持ち、途中の進み具合は schedule が持ちます。

```text
issue（何が問題か）
  -> decision（何を対象とするか）
  -> epic（track の仕事を起票する）
  -> 子 todo（成果物カタログや strategy を作成する）
  -> schedule（成果物タスクの実行と進捗）
  -> epic を完了する（人が判断）
```

```bash
# チャット:「issue『初期スコープと必要成果物が未確定』を起票して」
npx specdojo register add \
  --project <project-id> \
  --type issue \
  --title "初期スコープと必要成果物が未確定" \
  --topic clarify-initial-scope

# チャット:「decision『初期スコープと対象成果物を決定する』を起票して」
npx specdojo register add \
  --project <project-id> \
  --type decision \
  --title "初期スコープと対象成果物を決定する" \
  --topic decide-initial-scope

# チャット:「launch トラックの epic を起票して」
npx specdojo register add \
  --project <project-id> \
  --type epic \
  --track launch \
  --title "プロジェクト定義の仕様整備" \
  --topic project-definition

# チャット:「epic から子 todo『成果物カタログを作成する』を起票して」
npx specdojo register add \
  --project <project-id> \
  --type todo \
  --from <epic-id> \
  --title "プロジェクト定義の成果物カタログを作成する" \
  --topic create-project-definition-catalog \
  --approach catalog-planning \
  --target domain:project-definition
```

issue の調査結果を decision の選択肢へ、decision の結論を track の `epic` とその子 todo へ引き継ぎます。decision は人が確定します。issue や子 todo は provider 未設定でも `exec plan --project <project-id> --register <PJR-ID>` で計画を確認でき、agent 設定後は `exec run --project <project-id> --register <PJR-ID> --worktree` で実行できます（`epic` 自体は実行対象外です）。

すべての登録項目には type 別の個票が作られ、個票 Frontmatter が構造化フィールドの正本になります。個票内の `_TODO_` を解消してから `register close` すると、個票の文書状態も `ready` になります。成果物カタログ作成の todo は、次章で `dct-<domain>.yaml` を作成・検証した後に完了させます。todo の完了により `catalog_status` が `primary` と導出され、strategy 作成と Schedule への展開（`schedule build --track launch`）が可能になります。成果物タスクの途中の進捗は schedule の依存グラフで管理し、登録簿に個々の成果物タスクを二重管理しません。トラック完了時に人が `epic` を close します。

## 4. 発展: 成果物カタログからscheduleへ展開する

この経路では、epic の子 todo から成果物カタログ（`dct-<domain>.yaml`）とトラック戦略（`sch-strategy-<track>.yaml`）を作成して Schedule を生成し、依存関係に従ってタスクを実行します。

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

## 5. 発展: worktreeで1タスクを隔離実行する

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

## 6. 発展: routineで定期実行する

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
