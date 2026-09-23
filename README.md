# SpecDojo

SpecDojo は、仕様駆動開発のためのドキュメントフレームワークです。
プロダクトの構築・改修に必要な情報を体系化し、人と生成 AI が同じ成果物を作成・検証・更新できるようにします。

SpecDojo は、次のものを npm package とオープンソースのテンプレートリポジトリとして提供します。

- 成果物の記述規則、作成手順、テンプレート、サンプル
- プロジェクトとプロダクトの文書体系
- register、Schedule、実行、レビューを支援する CLI

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

agent にタスクを実行させる場合は、利用する provider の設定を配置します。この手順は register
だけを使う最小構成では省略できます。

```sh
npx specdojo config scaffold --provider codex
```

`--provider` には `claude`、`codex`、`copilot`、`opencode` を指定できます。従来の
`npx specdojo exec scaffold --provider <name>` も互換入口として引き続き利用できます。

最初の登録簿と todo を作り、一覧を生成します。

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
