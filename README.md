# SpecDojo

SpecDojo は、Spec道（仕様道）の道場です。
仕様と設計を作り、運用まで保つための体系を整えます。判断を記帳し、型に沿って実戦で書き、評定で鍛え続け、講評で完了を判断します。人と生成 AI が同じ成果物を作成・検証・更新できるようにし、仕様駆動開発のツールに対しては、その上流で仕様と設計の体系を担います。

**記して、形にして、磨き続ける。**

**記帳ひとつから始められます。** 設定 2 行で使い始め、必要になった分だけ広げられます。
迷いを question として起票し、decision で決め、仕様書に書き、後日 change-request で直すまでを 10 分で体験できます。kata（型）を事前に用意する必要はありません。手順は [Quick Start ガイド](https://specdojo.github.io/specdojo/ja/specdojo/guides/quick-start-guide.html) 冒頭の「10分で体験する — 仕様の判断台帳」を参照してください。

| 道場の言葉 | SpecDojo の仕組み                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------------- |
| 型（Kata） | 成果物の作り方を定める rulebook・recipe・sample・template                                               |
| 技（Waza） | `specdojo` CLI。決定を残す記帳、成果物を作る実戦、品質を見る評定、完了を見る講評                        |
| 流（Ryu）  | 成果物・型・技をつなぐ `approach`。タスクごとに型をどこまで基準にして技を使うか（守・破・離など）を表す |

## できること

### 記帳 — 気づいたことを、型に沿って残せる

作業だけでなく、判断・保留・観測・リスク・変更要求も同じ登録簿へ記録します。種別を選ぶと
本文の章構成が与えられるため、「選択肢を比較して理由を書く」といった記録が形を保ちます。
正本は Markdown なので、`git log` でそのまま読め、3 年後も SpecDojo なしで読めます。
決定ログ・課題ログ・リスク登録簿は、この記録から生成されます。

### 会話で進められる

同梱の対話型オーケストレーターを配置すると、やりたいことを話すだけで進みます。
調査や議論の内容がそのまま個票の本文になるため、別途まとめ直す必要がありません。
状態を変える操作は実行前に提示して承認を求め、`git push` や破壊的操作は行いません。

### 型と実戦 — 必要になったら、成果物の型へ広げられる

要件、設計、テスト、運用まで 100 種類以上の記述規則・手順・テンプレート・サンプルを持ちます。
使うものだけをカタログで宣言し、型に沿った実戦で成果物を作れます。最初から全部を用意する必要はありません。

### 評定と講評 — 品質評価と完了判断を分けて残せる

`grade` は成果物の品質を共通の観点で評価し、`review` はその結果と実行記録・完了条件を照合して、タスクを完了してよいかを判断します。品質の finding とタスクの未充足事項を混同せず、最終的な `ready` への確定は人が行います。

v0.3.0 の `grade` は試験的な機能です。npm package では `grade list` / `plan` / `apply` / `validate` / `result` などの部品を利用できますが、これらを通しで実行する SpecDojo 本体リポジトリの開発用スクリプト `tools/grade/run-per-document.sh` は package に含まれません。成果物を評価するには、project の `catalog_path` も設定してください。1 文書を部品で評価する手順は [CLI コマンドリファレンス](docs/ja/specdojo/references/command-reference.md#81-npm-package-で-1-文書を評価する)を参照してください。

[specdojo.org](https://specdojo.org/) では、SpecDojo の考え方と始め方を紹介しています。日本語の詳細文書は [SpecDojo ドキュメントサイト](https://specdojo.github.io/specdojo/ja/) で公開しています。

## この README の役割

この README は、GitHub やパッケージページでリポジトリを訪れた人に、SpecDojo の概要、入手方法、詳しい文書への入口を示します。
文書体系や CLI 操作の詳細はここへ複製せず、ドキュメントサイトを正本とします。

## 使い始める

現在の変更点は [CHANGELOG](CHANGELOG.md) にまとめています。v0.2.1 から更新する場合は、
レビュー観点、rubric、review テンプレートに互換性のない変更があるため、
[v0.3.0 移行ガイド](docs/ja/specdojo/guides/release-v0-3-0-migration-guide.md)を先に確認してください。

### npm で導入する

Node.js 22.13 以上と Git を用意します。オーケストレーターに Claude Code を使う場合は、Claude Code も導入してログインしておきます。ほかの provider も選べます。

既定では、SpecDojo の記録をプロダクトの Git 履歴に混ぜないため、次の **別リポジトリ構成**で始めます。

- **プロダクトリポジトリ** `app1/`: ソースコードと、仕様・設計などのプロダクトドキュメントを置きます。
- **プロジェクトリポジトリ** `app1-specdojo/`: 登録簿・計画・実行記録などのプロジェクトドキュメントと、文書の作り方を定める型（Kata）を置きます。1つのプロジェクトリポジトリに、複数のプロジェクトを格納できます。
- **worktree 用ディレクトリ** `app1-specdojo-worktrees/`: タスクごとの変更を隔離して進めるために、Git worktree を作る場所です。名前はプロジェクトリポジトリのディレクトリ名から決まります。

```text
app1-workspace/
├── app1/             # プロダクトリポジトリ
├── app1-specdojo/    # プロジェクトリポジトリ
└── app1-specdojo-worktrees/ # タスクごとの作業場所
```

既に開発している `app1/` と並べてプロジェクトリポジトリを作り、SpecDojo を導入します。

```sh
mkdir app1-workspace
mkdir app1-workspace/app1-specdojo
git -C app1-workspace/app1-specdojo init
cd app1-workspace/app1-specdojo
npm init -y
npm install --save-dev specdojo
npx specdojo init
```

SpecDojo は開発時に使う文書・実行管理ツールなので、`--save-dev` で導入します。kata は、成果物を書くための規則・手順・テンプレート・サンプルの総称です。kata もインストールした package から参照されるため、`package-lock.json` によって SpecDojo と同じ版へ固定されます。

`specdojo init` の質問に答えると、`prj-0001` の設定、登録簿、人と AI の名簿、AI に実行させる設定、オーケストレーターを起動する npm script がまとめて作られます。Claude Code で AI に作業を任せる例では、provider に `claude`、exec の質問に「はい」を選びます。既存ファイルは上書きせず、作成内容は `--dry-run` で先に確認できます。

あわせて、`node_modules/` と SpecDojo の生成物（`docs/**/generated/*`、`.specdojo/doc-index.json` など）を Git の管理から外す行が `.gitignore` に用意されます。すでに `node_modules/` や生成物を Git で管理している場合は、表示される案内に従って管理から外し、コミットします。

`@specdojo/docs-lint` は必須ではありません。SpecDojo 文書向けの検査を使う場合だけ、[ドキュメント編集ガイド](https://specdojo.github.io/specdojo/ja/specdojo/guides/docs-editing-guide.html)に従って追加します。

### オーケストレーターを起動する

SpecDojo は、会話を CLI 操作へ変換する対話型オーケストレーターを同梱しています。`init` で Claude Code を選んだ場合は、追加された npm script で起動します。

```sh
npm run orch:opus
```

`orch:sonnet` も追加されます。これらの script は `specdojo orchestrator launch --provider claude` を経由して Claude Code を起動します。provider ごとの詳しい設定は [オーケストレーター運用ガイド](https://specdojo.github.io/specdojo/ja/specdojo/guides/orchestrator-operation-guide.html) を参照してください。

| provider      | 配置先                                      | 起動（`package.json` がある場合） |
| ------------- | ------------------------------------------- | --------------------------------- |
| `claude`      | `.claude/agents/specdojo-orchestrator.md`   | `npm run orch:opus` ほか          |
| `opencode`    | `.opencode/agents/specdojo-orchestrator.md` | `npm run orch:opencode`           |
| `codex`       | `.specdojo/codex/orchestrator.md`           | `npm run orch:codex`              |
| `antigravity` | `.specdojo/antigravity/orchestrator.md`     | `npm run orch:agy`                |

各設定を個別に管理したい場合は、後述の「設定を個別に行う場合」にある `config init` と `config scaffold` を使います。

Antigravity CLI を無人実行する場合は、利用者のグローバル設定へ permission rule を追加します。この設定はすべてのリポジトリに効くため、必ず先に差分を確認してから適用してください。通常の scaffold はグローバル設定へ触れません。

```sh
npx specdojo config scaffold --provider antigravity --global --dry-run
npx specdojo config scaffold --provider antigravity --global
```

実適用では既存設定を残し、変更前のファイルをバックアップします。追加する allow は `git status` / `diff` / `log` / `show` の読み取り操作だけです。

#### Dev Container を使う場合（任意）

利用環境として Dev Container を使う場合は、オーケストレーターの配置に加えて次のコマンドを実行すると、指定した provider の CLI が組み込まれた `.devcontainer/` を生成できます。

```sh
npx specdojo devcontainer scaffold --provider claude --dry-run
npx specdojo devcontainer scaffold --provider claude
```

既存の `.devcontainer/` は上書きせず、置き換える場合だけ `--force` を指定します。生成設定は provider の設定ディレクトリを名前付きボリュームに保存し、ホストの認証情報・秘密鍵・`.env` はマウントしません。生成後、VS Code などでコンテナを立ち上げると、分離された環境ですぐにオーケストレーターを起動できます。Ollama 接続、cron、tmux はそれぞれ `--ollama`、`--cron`、`--tmux` で追加できます。

### 会話で操作する

起動したら、やりたいことをそのまま伝えます。オーケストレーターがコマンドへ翻訳し、実行前に内容を提示します。

```text
あなた : このプロジェクトを始めたい。まず登録簿を用意して、最初の作業を起票して。
オーケストレーター : 次を実行します。よろしいですか。
           npx specdojo register scaffold --project prj-0001
           npx specdojo register add --project prj-0001 --type todo --title "..."
あなた : お願いします。
```

状態を変える操作は承認を得てから実行し、`git push` や破壊的操作は行いません。起票した項目の
実行、状況の確認、成果物の生成も同じ流れで進みます。

```text
PJR-XXXX を実行して
今の状況は？
kata の rulebook を確認したい
```

詳しい進め方は [オーケストレーター運用ガイド](https://specdojo.github.io/specdojo/ja/specdojo/guides/orchestrator-operation-guide.html) を参照してください。

### CLI を直接使う

オーケストレーターを使わずに操作することもできます。`init` が作成した登録簿へ、実施する作業を表す `todo` を起票し、一覧を生成します。

```sh
npx specdojo register add \
  --project prj-0001 \
  --type todo \
  --title "最初のタスク"
npx specdojo register build --project prj-0001
```

### プロダクトリポジトリをつないで実行する

AI にプロダクトを変更させる前に、`.specdojo/specdojo.config.json` の `projects.prj-0001` へ、同じ workspace にあるプロダクトリポジトリを追加します。

```json
"repos": [
  {
    "name": "app1",
    "path": "../app1",
    "integration_branch": "main"
  }
]
```

個票へ完了条件を書き、Claude Code の executor と reporter を指定して実行します。

```sh
npx specdojo exec run \
  --project prj-0001 \
  --register PJR-XXXX \
  --worktree \
  --executor-by claude-executor \
  --reporter-by claude-reporter
```

完了後は両方のリポジトリの commit とプロダクトの動作を確認します。

```sh
git -C ../app1 log --oneline -1
git log --oneline -1
npm --prefix ../app1 run dev
```

人が result と成果物を確認し、気づいた改善を次の `todo` や `issue` として残してから、元の登録項目を close します。

```sh
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

`exec run` と並行して記帳し、その変更だけを commit まで完了させる場合は、`register add` / `update` / `renumber` または状態遷移コマンドへ `--commit` を付けます。同じ project の `register lifecycle` 枠が空くまで待ち、ほかの未 commit 変更を含めずに記帳・一覧再生成・commit を行います。対象の個票や event に既存差分がある場合は、混在を避けるため記帳前に停止します。

ここまでの手順は、利用側へ kata をコピーせずに実行できます。生成された `todo` の個票が編集対象、
`generated/pjr-index.md` が個票から作る一覧です。`register add` が表示した ID を使い、AI に作業を
依頼する前に実行計画（exec plan）の内容まで確認できます。

```sh
npx specdojo exec plan --project prj-0001 --register PJR-XXXX
```

kata は既定で npm package 内のものを参照します。適用中の rulebook（成果物ごとの記述規則）を確認し、プロジェクトで変更する場合だけ `eject` でリポジトリへコピーします。

```sh
npx specdojo kata list --kind rulebook
npx specdojo kata show specdojo:pjr-rulebook
npx specdojo kata eject --id specdojo:pjr-rulebook
```

provider の設定を終えた後は、同じ登録項目を AI に実行させられます。成功後は人が実行結果（result）と成果物を確認し、登録項目を完了（close）します。

```sh
npx specdojo exec run --project prj-0001 --register PJR-XXXX
```

AI による実行は数分から数十分かかり、定期処理として登録した `routine` は決めた時刻に実行されます。作業端末の状態に依存せず
実行を続けたい場合は、常時稼働するホストへリモート接続する構成例を
[常時稼働ホスト運用ガイド](https://specdojo.github.io/specdojo/ja/specdojo/guides/remote-host-development-guide.html) に示しています。

### 設定を個別に行う場合

対話式の `init` を使わず、各設定を個別に管理したい場合は、`config init` と provider の `config scaffold` を順に実行します。

```sh
npx specdojo config init
npx specdojo config scaffold --provider claude
```

`config init` が作る設定は、`prj-0001` の登録簿から始める最小構成です。別のプロジェクト ID や配置を使う場合は、`.specdojo/specdojo.config.json` を変更します。

- `current_project`: `--project` を省略したときに使うプロジェクトです。
- `projects`: このプロジェクトリポジトリで扱うプロジェクトを定義します。複数登録できます。
- `base_path`: 各プロジェクトの文書を置く基準パスです。

成果物カタログやスケジュールへ進むときに追加する設定は、[SpecDojo設定リファレンス](https://specdojo.github.io/specdojo/ja/specdojo/references/specdojo-config-reference.html) を参照してください。

### テンプレートリポジトリとして導入する

npm package の参照方式ではなく、SpecDojo のソースと文書体系一式を最初から配置して
カスタマイズする場合は、このリポジトリの **Use this template** から新しいリポジトリを作成します。
通常の利用開始には、更新差分を小さく保てる npm 導入を推奨します。

導入後の初期設定と、最初のタスクを完了するまでの手順は [Quick Start ガイド](https://specdojo.github.io/specdojo/ja/specdojo/guides/quick-start-guide.html) を参照してください。
全体像から確認する場合は [全体概要ガイド](https://specdojo.github.io/specdojo/ja/specdojo/guides/specdojo-overview-guide.html) を参照してください。

## ライセンス

本リポジトリは MIT ライセンスです。詳細は [LICENSE](LICENSE) を参照してください。

## フィードバック

Issue または Pull Request を歓迎します。
