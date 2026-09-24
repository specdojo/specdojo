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

既定では、プロダクトリポジトリ `app1/` の隣に SpecDojo 専用リポジトリ
`app1-specdojo/` と worktree 用ディレクトリ `app1-worktrees/` を置く Detached Unit で始めます。
workspace 直下で次を実行します。

```sh
mkdir app1-specdojo app1-worktrees
git -C app1-specdojo init
cd app1-specdojo
npm init -y
npm install --save-dev specdojo @specdojo/docs-lint
npx specdojo config init
```

SpecDojo は文書と実行管理のためのツールで、成果物へ同梱されるものではないため `--save-dev` で導入します。あわせて、kata は `node_modules/specdojo` から参照されるため、`package-lock.json` が kata の版も固定します。グローバル導入（`npm install -g`）では版がプロジェクトに記録されず再現できません。

`config init` は `.specdojo/specdojo.config.json` とその親ディレクトリを作成します。既定では
`prj-0001` と `docs/ja/projects/prj-0001/controls/project-register` を使う最小構成です。別の
project ID や配置を使う場合は、生成された設定の `current_project`、`projects` のキー、
`base_path` を次へ進む前に変更してください。catalog や schedule へ進むときに追加するキーは
[SpecDojo設定リファレンス](https://specdojo.github.io/specdojo/ja/specdojo/references/specdojo-config-reference.html)で確認できます。

### オーケストレーターを配置する

SpecDojo は対話型オーケストレーターを同梱しています。CLI を直接叩く代わりに、会話で意図を伝えると、
対応するコマンドを提案し、承認を得てから実行します。利用する provider の設定を配置します。

```sh
npx specdojo config scaffold --provider claude
```

`--provider` には `antigravity`、`claude`、`codex`、`copilot`、`opencode` を指定できます。
オーケストレーターの配置先と起動方法は provider ごとに異なります。

| provider      | 配置先                                      | 起動                                                                       |
| ------------- | ------------------------------------------- | -------------------------------------------------------------------------- |
| `claude`      | `.claude/agents/specdojo-orchestrator.md`   | `claude --agent specdojo-orchestrator`                                     |
| `opencode`    | `.opencode/agents/specdojo-orchestrator.md` | `opencode --agent specdojo-orchestrator`                                   |
| `codex`       | `.specdojo/codex/orchestrator.md`           | `codex "$(cat .specdojo/codex/orchestrator.md)"`                           |
| `antigravity` | `.specdojo/antigravity/orchestrator.md`     | `agy --add-dir "$(pwd)" -i "$(cat .specdojo/antigravity/orchestrator.md)"` |

`claude` と `opencode` は agent の定義ファイルを名前で選べるため、`--agent` で起動します。`codex` と
`antigravity` は定義ファイルから agent を選ぶ仕組みを持たないため、規範の本文を起動時の指示として
渡します。antigravity の `.agents/` は rules と skills のためのディレクトリで、agent の定義は扱いません。
rules へ置くと全セッションへ読み込まれ、executor として起動したときにも役割が混入します。

配置されるファイルにはモデル名が書かれています。手元で使えるモデルに合わせて編集してください。
executor / reporter の設定も同時に配置されるので、agent にタスクを実行させる段階で使います。

### 会話で操作する

起動したら、やりたいことをそのまま伝えます。オーケストレーターがコマンドへ翻訳し、実行前に内容を提示します。

```text
あなた : このプロジェクトを始めたい。まず登録簿を用意して、最初の作業を起票して。
agent  : 次を実行します。よろしいですか。
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

agent を使わずに操作することもできます。最初の登録簿と todo を作り、一覧を生成します。

```sh
npx specdojo register scaffold --project prj-0001
npx specdojo register add \
  --project prj-0001 \
  --type todo \
  --title "最初のタスク"
npx specdojo register build --project prj-0001
```

ここまでの手順は、利用側へ kata をコピーせずに実行できます。生成された todo の個票が編集対象、
`generated/pjr-index.md` が個票から作る一覧です。`register add` が表示した ID を使い、agent を
起動せずに exec plan の内容まで確認できます。

```sh
npx specdojo exec plan --project prj-0001 --register PJR-XXXX
```

kata は既定で npm package 内のものを参照します。適用中の rulebook を確認し、プロジェクトで
上書きする場合だけ eject します。

```sh
npx specdojo kata list --kind rulebook
npx specdojo kata show specdojo:pjr-rulebook
npx specdojo kata eject --id specdojo:pjr-rulebook
```

provider と agent の設定を終えた後は、同じ登録項目を実行できます。成功後は人が result と成果物を
確認し、登録項目を close します。

```sh
npx specdojo exec run --project prj-0001 --register PJR-XXXX
```

agent の実行は数分から数十分かかり、`routine` は定期実行されます。作業端末の状態に依存せず
実行を続けたい場合は、常時稼働するホストへリモート接続する構成例を
[常時稼働ホスト運用ガイド](https://specdojo.github.io/specdojo/ja/specdojo/guides/remote-host-development-guide.html) に示しています。

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
