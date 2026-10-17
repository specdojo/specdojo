---
specdojo:
  id: prj-0001:pjr-y79w-readme-lp-init-guide-alignment
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-17T11:27:04Z"
  due_on: null
---

# PJR-Y79W README・LP・init のガイドの内容を揃え、README に specdojo.org へのリンクを加える

## 1. 概要

README、ランディングページ（specdojo-lp、specdojo.org）、specdojo init のガイドの導入の手順と説明が食い違ってきている。内容を突き合わせて揃え、README から specdojo.org へリンクする

## 2. 完了条件

ランディングページ（specdojo-lp、<https://specdojo.org/>）を正とし、README と init のガイドを合わせる（2026-10-17、利用者の判断）。specdojo-lp は prj-0001 の `repos` に宣言せず、orchestrator が読んだ内容を本個票に書き写す。LP の側に直すべき点が見つかった場合は、本件では直さず、result に書いて prj-0002 の項目として起票を依頼する。

### 2.1. LP の始め方（2026-10-17、specdojo-lp の develop 54edf71 の `src/components/sections/GetStarted.astro`）

前提: Node.js 22.13 以上、Git、Claude Code の導入とログイン（`npm run orch:opus` は `specdojo orchestrator launch --provider claude` を経由して claude を起動する。ほかの provider も選べる）。

「5 つの手順で始める」:

1. SpecDojo を導入する。既に開発しているリポジトリ（例: `landing-page`）と並べて、プロジェクトのリポジトリを作る。

   ```bash
   mkdir landing-page-workspace
   mkdir landing-page-workspace/landing-page-specdojo
   git -C landing-page-workspace/landing-page-specdojo init
   cd landing-page-workspace/landing-page-specdojo
   npm init -y
   npm install --save-dev specdojo
   ```

2. 初期設定する。`npx specdojo init` の質問に答えると、設定（プロジェクト ID は `prj-0001`）、登録簿、人と AI の名簿、AI に実行させる設定、オーケストレーターを起動する npm script がまとめて作られる。provider と exec を尋ねられたら、Claude Code の場合は `claude` と「はい」を選ぶ。
3. オーケストレーターを起動する（`npm run orch:opus`。`orch:sonnet` も追加される）。
4. LP に加えたいことを起票する（Plan）。`npx specdojo register add --project prj-0001 --type todo --title "…"`。
5. 気づいたことも記して、一覧を作る。`register add --type issue` と `npx specdojo register build --project prj-0001`。

「4 つの手順で回す」:

1. LP のリポジトリをつなぐ。`.specdojo/specdojo.config.json` の `projects.prj-0001` に `"repos": [{ "name": "landing-page", "path": "../landing-page", "integration_branch": "main" }]` を加える。
2. 完了条件を書いて、AI に実行させる（Do）。`npx specdojo exec run --project prj-0001 --register PJR-XXXX --worktree --executor-by claude-executor --reporter-by claude-reporter`。
3. 確かめる（Check）。`git -C ../landing-page log --oneline -1`、`git log --oneline -1`、`npm --prefix ../landing-page run dev`。
4. 完了として残し、次の改善を記す（Action）。`register add --type todo ... --commit` と `register close --project prj-0001 --id PJR-XXXX --conclusion "…" --commit`。

LP の会話の例は、README の「会話で操作する」に合わせて作られている。

### 2.2. 2026-10-17 時点の主な食い違い

| 観点         | LP（正）                                                               | README                                                                         |
| ------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 初期設定     | `npx specdojo init`（対話式）                                          | `npx specdojo config init` と `npx specdojo config scaffold --provider claude` |
| 構成         | `<アプリ>-workspace/<アプリ>-specdojo`。プロダクトのリポジトリと並べる | `app1-specdojo` だけを作る                                                     |
| 導入するもの | `specdojo`                                                             | `specdojo` と `@specdojo/docs-lint`                                            |

### 2.3. 条件

- README の導入と始め方の章を、2.1 の手順に揃える。初期設定は `specdojo init` を主にし、`config init`・`config scaffold` は個別に設定したい場合の別の手順として残すか、ガイドへ移す。構成の例は `<アプリ>-workspace/<アプリ>-specdojo` にし、用語の整理（[[prj-0001:pjr-9g9y-practice-execution-terminology]]）の例（`app1-workspace/`）と揃える。
- `@specdojo/docs-lint` の導入は、必須の手順から外し、文書の検査を使う場合の任意の手順として書く（LP の始め方には含まれないため）。
- README の冒頭近くに、ランディングページ <https://specdojo.org/> へのリンクを加える。既存のドキュメントサイト（`specdojo.github.io`）へのリンクは残す。
- `docs/ja/specdojo/guides/quick-start-guide.md` など、`specdojo init` を説明するガイドの手順を 2.1 と揃える。食い違いを直した箇所を result に一覧で書く。
- README の「会話で操作する」は LP の会話の例の元であるため、変える場合は LP との違いが生じないかを確かめ、生じる場合は result に書く。
- 変えるのは文書だけとし、CLI の動作は変えない。CLI の挙動と文書の手順が合わない点（例: `init` の質問の順番）を見つけた場合は、直さずに result に書く。
- `npm run lint:md` と `npm run lint:fm` が通る。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 3. 作業内容

| No  | 作業                                                         | 担当 | 状態 | メモ                   |
| --- | ------------------------------------------------------------ | ---- | ---- | ---------------------- |
| 1   | README の導入と始め方を LP に揃え、specdojo.org へリンクする | DEV  | open | 2.1 を正とする         |
| 2   | init を説明するガイドを LP に揃える                          | DEV  | open | quick-start-guide ほか |
| 3   | LP の側に直すべき点を result に書く                          | DEV  | open | prj-0002 へ依頼する    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-b3xq-init-provider-retry-restarts]]: init の対話の改善。
- [[prj-0001:pjr-8gq4-devcontainer-workspace-dir-fixed]]: devcontainer の作業ディレクトリ。
