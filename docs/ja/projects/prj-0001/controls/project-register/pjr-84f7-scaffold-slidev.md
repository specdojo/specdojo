---
specdojo:
  id: prj-0001:pjr-84f7-scaffold-slidev
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-24T22:23:40Z"
  due_on: "2026-10-31"
---

# PJR-84F7 Slidev の kata を検証できるよう、scaffold で Slidev を選んで入れられるようにする

## 1. 概要

利用者が Slidev の sample・template の kata を作るとき、SpecDojo を入れたリポジトリに Slidev がないとビルドして表示を確かめられない。`init` / `config scaffold` で Slidev と関連の設定を選んで入れられるようにする。

利用者の project（coderdojo-lessons-specdojo の prj-0001）では、投影スライドの kata（`edu-scratch:lsd-sample`）を作るために、次の2つを手で加えた。

- `prettier-plugin-slidev` と `.prettierrc`。普通の Markdown として整形すると、区切りの `---` の直後に空行が入り、ページ設定が本文になるため。kata の Slidev のファイルだけに `slidev` の parser を当てた。
- `.markdownlintignore`。Slidev のスライドは H1 の繰り返しや Vue の要素を使い、MD024・MD025・MD033・MD036 で commit hook と統合の段が止まるため。

それでも、Slidev の本体・テーマ・活動のコンポーネント（`ScratchBlocks.vue` など）がリポジトリにないため、sample を `slidev build` で確かめられなかった。教材は別のリポジトリ（プロダクトリポジトリ）にあり、そちらには Slidev が入っている。

### 1.1. 利用者の project で手で入れた構成（参考）

coderdojo-lessons-specdojo では、表示を確かめるために次を手で入れ、kata の sample を `slidev export --format png` で書き出せた（commit `0b24afc`）。scaffold で入れる範囲を決める材料にする。

| 種類               | 入れたもの                                                                                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| npm の開発依存     | `@slidev/cli` ^53.0.0、`slidev-theme-neversink` ^0.4.1、`scratchblocks` ^3.7.1、`playwright-chromium` ^1.64.1、`prettier-plugin-slidev` ^1.0.5       |
| 整形と検査         | `.prettierrc` で kata の Slidev のファイルに `slidev` parser、`.markdownlintignore` で同じファイルを除外                                             |
| 表示用のスクリプト | kata を、プロダクトリポジトリの活動の `components/` と一緒に `tmp/` の下へ写し、`slidev`（`--remote`）または `slidev export --format png` を実行する |
| Dev Container      | apt に `fonts-noto-cjk`、`post-create.sh` に `playwright install-deps chromium`                                                                      |
| `.gitignore`       | `/tmp/`                                                                                                                                              |

分かったこと:

- Slidev は既定で `localhost` だけで待ち受ける。tmux や SSH からホストのブラウザで開くには `--remote` が要る（`--bind` は `--remote` と一緒でないと効かない）。
- 日本語のフォントがないと、書き出した PNG の日本語が表示されない。
- Chromium は、システムのライブラリがないと起動しない（終了コード 127）。
- 活動固有のコンポーネント（`ScratchBlocks.vue`）は kata に含まれないため、プロダクトリポジトリから写す必要があった。

## 2. 完了条件

- `init` と `config scaffold` に、Slidev を選んで入れるオプションがある。
- 選ぶと、Slidev の本体、prettier の plugin と設定、markdownlint の除外が入る。既存の設定ファイルと依存は上書きせず、追加する内容を先に表示する。
- 選ばなければ、何も変わらない。
- 入れた後、kata の Slidev の sample を `slidev build` で確かめる手順が文書にある。
- 以上を確かめる test がある。
- テーマと活動固有のコンポーネント（例: `ScratchBlocks.vue`）の扱いを、scaffold の範囲か利用者の作業かに決め、文書に書いている。

### 追記（2026-10-25、利用者が承認）

- v0.4.6 の範囲とする。
- Slidev は次の 2 つの部分に分けて入れる。
  - リポジトリの設定: `init --slidev` と `config scaffold --slidev` で、`package.json` の devDependencies（`@slidev/cli`・`prettier-plugin-slidev` など）、`.prettierrc` の overrides（スライドのファイルにだけ `slidev` の parser を当てる）、`.markdownlintignore`（スライドのファイルの除外）を入れる。既定では入れない。当てるパスは、報告元が手で入れた構成（kata の Slidev のファイルだけに当てる形）を手本に決め、result と個票の対応結果に書く。
  - Dev Container: preset の `full`（PJR-47S6）の VS Code 拡張の一覧に `antfu.slidev` を加える。`minimal` と `recommended` には加えない。
- `init` で Dev Container の preset に `full` を選んだときは、`--slidev` の質問の既定を「はい」にする（`--yes --devcontainer --devcontainer-preset full` のときも入れる）。それ以外の既定は「いいえ」のまま。
- 既存の `.prettierrc`・`.markdownlintignore`・`package.json` の項目は上書きしない。足りないものは追加する内容を表示して案内する。`package.json` の書き換えは lefthook（PJR-7H7N）と同じ扱いにする。
- 本リポジトリの `package.json` などの保護された設定は変えない。
- 文書化の範囲は [[specdojo:kata-guide]] と [[specdojo:command-reference]] とし、Slidev の kata を `slidev build` で確かめる手順と、テーマや活動固有のコンポーネントは利用者の作業とすることを書く。
- 継続検討の PJR-2ZMY（文書の編集ツールの方針）とは、「Slidev は既定では入れず、`full` か `--slidev` のときだけ入れる」形で整合させる。
- 単体テストで、`--slidev` の有無、`full` の preset の既定、既存のファイルを上書きしないことを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 3. 作業内容

| No  | 作業                                                          | 担当 | 状態 | メモ                               |
| --- | ------------------------------------------------------------- | ---- | ---- | ---------------------------------- |
| 1   | Slidev を入れるオプションの範囲（本体・テーマ・部品）を決める | DEV  | open | 利用者の手作業の内容は概要のとおり |
| 2   | `init` と `config scaffold` にオプションを加える              | DEV  | open | 既存の設定は上書きしない           |
| 3   | sample を `slidev build` で確かめる手順を文書に書く           | DEV  | open | -                                  |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 報告元: 利用者の project（coderdojo-lessons-specdojo の prj-0001）の PJR-0BVZ（投影スライドの sample を作る）
