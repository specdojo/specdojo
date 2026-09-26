# SpecDojo

SpecDojo は、仕様駆動開発のためのドキュメントフレームワークです。
プロダクトの構築・改修に必要な情報を体系化し、人と生成 AI が同じ成果物を作成・検証・更新できるようにします。

**登録簿ひとつから始められます。** 設定 2 行で使い始め、必要になった分だけ広げられます。

## できること

### 気づいたことを、型に沿って残せる

作業だけでなく、判断・保留・観測・リスク・変更要求も同じ登録簿へ記録します。種別を選ぶと
本文の章構成が与えられるため、「選択肢を比較して理由を書く」といった記録が形を保ちます。
正本は Markdown なので、`git log` でそのまま読め、3 年後も SpecDojo なしで読めます。
決定ログ・課題ログ・リスク登録簿は、この記録から生成されます。

### 会話で進められる

同梱の対話型オーケストレーターを配置すると、やりたいことを話すだけで進みます。
調査や議論の内容がそのまま個票の本文になるため、別途まとめ直す必要がありません。
状態を変える操作は実行前に提示して承認を求め、`git push` や破壊的操作は行いません。

### 必要になったら、成果物の型へ広げられる

要件、設計、テスト、運用まで 100 種類以上の記述規則・手順・テンプレート・サンプルを持ちます。
使うものだけをカタログで宣言し、型に沿って作れます。最初から全部を用意する必要はありません。

日本語ドキュメントは [SpecDojo ドキュメントサイト](https://specdojo.github.io/specdojo/ja/) で公開しています。

## この README の役割

この README は、GitHub やパッケージページでリポジトリを訪れた人に、SpecDojo の概要、入手方法、詳しい文書への入口を示します。
文書体系や CLI 操作の詳細はここへ複製せず、ドキュメントサイトを正本とします。

## 使い始める

### npm で導入する

既定では、SpecDojo の記録をプロダクトの Git 履歴に混ぜないため、次の **別リポジトリ構成**で始めます。

- **プロダクトリポジトリ** `app1/`: ソースコードと、仕様・設計などのプロダクトドキュメントを置きます。
- **プロジェクトリポジトリ** `app1-specdojo/`: 登録簿・計画・実行記録などのプロジェクトドキュメントと、文書の作り方を定める実践体系を置きます。1つのプロジェクトリポジトリに、複数のプロジェクトを格納できます。
- **worktree 用ディレクトリ** `app1-worktrees/`: タスクごとの変更を隔離して進めるために、Git worktree を作る場所です。

```text
workspace/
├── app1/             # プロダクトリポジトリ
├── app1-specdojo/    # プロジェクトリポジトリ
└── app1-worktrees/   # タスクごとの作業場所
```

workspace 直下で次を実行します。

```sh
mkdir app1-specdojo app1-worktrees
git -C app1-specdojo init
cd app1-specdojo
npm init -y
npm install --save-dev specdojo @specdojo/docs-lint
npx specdojo config init
```

SpecDojo は開発時に使う文書・実行管理ツールなので、`--save-dev` で導入します。kata は、成果物を書くための規則・手順・テンプレート・サンプルの総称です。kata もインストールした package から参照されるため、`package-lock.json` によって SpecDojo と同じ版へ固定されます。

`config init` は、登録簿を使い始めるための最小設定を `.specdojo/specdojo.config.json` に作成します。設定を変える方法は、後述の「設定を変えたいとき」を参照してください。

### オーケストレーターを配置する

SpecDojo は、会話を CLI 操作へ変換する対話型オーケストレーターを同梱しています。利用する AI ツール（provider）の設定を配置します。次は Claude Code を使う例です。

```sh
npx specdojo config scaffold --provider claude
```

オーケストレーターの配置先と起動方法は provider ごとに異なります。

| provider      | 配置先                                      | 起動                                                                       |
| ------------- | ------------------------------------------- | -------------------------------------------------------------------------- |
| `claude`      | `.claude/agents/specdojo-orchestrator.md`   | `claude --agent specdojo-orchestrator`                                     |
| `opencode`    | `.opencode/agents/specdojo-orchestrator.md` | `opencode --agent specdojo-orchestrator`                                   |
| `codex`       | `.specdojo/codex/orchestrator.md`           | `codex "$(cat .specdojo/codex/orchestrator.md)"`                           |
| `antigravity` | `.specdojo/antigravity/orchestrator.md`     | `agy --add-dir "$(pwd)" -i "$(cat .specdojo/antigravity/orchestrator.md)"` |

配置されるファイルのモデル名は、手元で使えるモデルに合わせて編集してください。provider ごとの詳しい設定は [オーケストレーター運用ガイド](https://specdojo.github.io/specdojo/ja/specdojo/guides/orchestrator-operation-guide.html) を参照してください。

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

オーケストレーターを使わずに操作することもできます。最初の登録簿と、実施する作業を表す `todo` を作り、一覧を生成します。

```sh
npx specdojo register scaffold --project prj-0001
npx specdojo register add \
  --project prj-0001 \
  --type todo \
  --title "最初のタスク"
npx specdojo register build --project prj-0001
```

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

### 設定を変えたいとき

`config init` が作る設定は、`prj-0001` の登録簿から始める例です。別のプロジェクト ID や配置を使う場合は、`.specdojo/specdojo.config.json` を変更します。

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
