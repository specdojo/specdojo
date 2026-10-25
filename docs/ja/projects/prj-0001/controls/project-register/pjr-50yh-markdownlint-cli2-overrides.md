---
specdojo:
  id: prj-0001:pjr-50yh-markdownlint-cli2-overrides
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-25T01:36:26Z"
  due_on: "2026-10-31"
---

# PJR-50YH scaffold の markdownlint 設定のせいで、VS Code でファイルごとの規則を当てられない

## 1. 課題内容

`init --lefthook` が生成する `.markdownlint.jsonc` があると、VS Code の拡張（markdownlint-cli2）は `.markdownlint-cli2.yaml` の `overrides` を当てないため、Slidev のスライドなど一部のファイルにだけ別の規則を当てられない。

- 起きたこと: 利用者の project（coderdojo-lessons-specdojo の prj-0001）で、Slidev の kata（`docs/ja/specdojo/{samples,templates}/**/lsd-*.md`）にだけ Slidev 用の規則を当てようとした。VS Code では、Vue の部品・ページごとの H1 などで 114 件の警告が出ていた。
- 確かめたこと（markdownlint-cli2 0.24.0、VS Code の拡張 0.62.1 と同じ系統）:

| ルートの基本の設定                               | `.markdownlint-cli2.yaml` の `overrides`   |
| ------------------------------------------------ | ------------------------------------------ |
| なし                                             | 効く                                       |
| `.markdownlint.jsonc`（scaffold が生成する名前） | 効かない                                   |
| `.markdownlint.yaml`                             | 効かない（親のディレクトリにあっても同じ） |
| `.markdownlintrc`                                | 効く                                       |

- 利用者の project では、基本の設定を `.markdownlintrc` に移し、`.markdownlint-cli2.yaml` の `config` から `extends` で読み込んで解決した。markdownlint-cli（commit hook と、exec run の result の検査）は `.markdownlintrc` を読み、markdownlint-cli2 は読まないため、両者がぶつからない。

あわせて分かったこと（Slidev のスライドに専用の設定を当てるとき）:

- markdownlint-cli は、`.markdownlintrc` が `{` で始まるときだけ JSON として読む。先頭にコメントを書くと設定が読まれない。
- markdownlint-cli2 の `overrides` は、最初に一致した 1 つだけを使う。prettier の `overrides` は、後のものを優先する。Slidev 用の設定は、cli2 では先頭、prettier では末尾に置く必要がある。
- Slidev のスライドは中身ではなくパスで見分けるしかないため、利用者の project では名前の決まり（`lsd-` で始める）を作った。3 つの設定（`.markdownlint-cli2.yaml`・`.prettierrc`・`.markdownlintignore`）を同じ glob にそろえ、名前・glob・順番を commit の前に確かめる検査（`tools/check-slidev-files.mjs`）を加えた。
- その後、利用者の project は、本家の `--slidev` の決まり（`*-slidev-sample.md`・`*-slidev-template.md`）にそろえた（kata の ID は `lsd-slidev-rulebook`・`lsd-slidev-sample`・`lsd-slidev-template`）。上の 3 つの設定と検査も同じ glob を使う。

## 2. 影響範囲

| 観点         | 影響                                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | scaffold の markdownlint 設定を使い、VS Code でファイルごとに規則を変えたい利用者。Slidev の kata を作る利用者は必ず当たる |
| スケジュール | 原因の調査に時間がかかる（設定ファイルの名前が原因とは分かりにくい）                                                       |
| コスト       | 設定ファイルの名前の変更と、その理由の記録                                                                                 |
| 品質         | VS Code に大量の警告が出たままになるか、利用者が検査から外して誤りに気づけなくなる                                         |
| 関係者       | `init --lefthook` を使う利用者                                                                                             |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | scaffold が、markdownlint-cli2 の `overrides` を無効にする名前（`.markdownlint.jsonc`）で基本の設定を生成する                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 対応策   | 次のどちらかにする。<br>1. scaffold の基本の設定を `.markdownlintrc` で生成し、`.markdownlint-cli2.yaml`（`config` で `.markdownlintrc` を読み込む）も生成する。`.markdownlintrc` は `{` で始める。<br>2. commit hook と result の検査を markdownlint-cli2 に移し、設定を `.markdownlint-cli2.yaml` に一本化する。<br>どちらの場合も、既存の `.markdownlint.*` を持つ利用者への移行の案内を文書に書く。Slidev を選んで入れる scaffold（PJR-84F7、`--slidev`）が当てる `docs/ja/specdojo/{samples,templates}/**/*-slidev-{sample,template}.md` にも、`.markdownlint-cli2.yaml` の `overrides` で Slidev 用の規則を当て、overrides の順番を守る |
| 依存事項 | [[prj-0001:pjr-84f7-scaffold-slidev]]（完了済み。`--slidev` は `.prettierrc` と `.markdownlintignore` を扱い、`.markdownlint-cli2.yaml` は生成しない。`init --lefthook` は引き続き `.markdownlint.jsonc` を生成する）                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 完了条件 | scaffold の生成物のまま、`.markdownlint-cli2.yaml` の `overrides` で一部のファイルにだけ別の規則を当てられる。commit hook と exec run の result の検査で、基本の設定（`MD013: false` など）が効く。これらを確かめる test がある                                                                                                                                                                                                                                                                                                                                                                                                               |

### 追記（2026-10-25、利用者が承認）

- v0.4.6 の範囲とする。対応策は 1 を採る。commit hook と result の検査は markdownlint-cli のまま変えない。
- オーケストレーターが markdownlint-cli2 0.24.0 で確かめたこと:
  - `.markdownlint-cli2.yaml` の `config.extends` で `.markdownlintrc` を読むと、`overrides` が効く。基本の設定が `.markdownlint.jsonc` だと効かない（報告どおり）。
  - `overrides` の項目は `filter`（glob の配列）・`combine`（`merge` か `replace`）・`config` の 3 つで、`files` ではない。複数が一致するときは最初の 1 つだけが使われる。
  - markdownlint-cli2 と VS Code の拡張は `.markdownlintignore` を読まない。0.4.6 の `--slidev` が書く `.markdownlintignore` は、markdownlint-cli（commit hook と result の検査）にだけ効き、VS Code には効かない。
  - markdownlint-cli は `.markdownlint-cli2.yaml` を読まず、`.markdownlintrc` と `.markdownlintignore` を読む。
- `init --lefthook` は、基本の設定を `.markdownlintrc`（`{` で始まる JSON。今の `.markdownlint.jsonc` と同じ規則）で作り、`config.extends: .markdownlintrc` の `.markdownlint-cli2.yaml` も作る。
- `--slidev` は、`.markdownlint-cli2.yaml` の `overrides` の先頭に、Slidev の kata の glob（`.prettierrc` と `.markdownlintignore` と同じもの）へ Slidev 用の規則を当てる項目を入れる。`combine` は `merge` とする。Slidev 用に外す規則は executor が決め、理由を個票の対応結果と報告の `handoff` に書く。
- commit hook と result の検査は、これまでどおり `.markdownlintignore` で Slidev の kata を外す。VS Code では Slidev 用の規則で検査され、hook では外される。この分担を文書に書く。
- 既存の `.markdownlint.*`・`.markdownlintrc`・`.markdownlint-cli2.*` は上書きしない。足りないものは追加する内容を表示し、`.markdownlint.jsonc` などから `.markdownlintrc` へ移す手順を案内する。
- [[specdojo:kata-guide]] と [[specdojo:command-reference]] に、生成する設定の役割（どの道具がどのファイルを読むか）、overrides の順番（markdownlint-cli2 は先頭、prettier は末尾）、移行の手順を書く。
- 単体テストで、`init --lefthook` の生成物、`--slidev` の overrides、既存の設定を上書きしないことを確かめる。markdownlint-cli2 は依存にないため、実行での確認は求めない。生成物の内容（`filter`・`combine`・`config.extends`・`.markdownlintrc` の先頭が `{`）を test で確かめる。
- 本リポジトリの保護された設定と `package.json` は変えない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。

## 4. 対応結果

### 作業内容

- 承認済みの対応策 1 を実装した。`init --lefthook` / `config scaffold --lefthook` は、先頭が `{` の
  JSON の `.markdownlintrc` と、`config.extends: .markdownlintrc` の `.markdownlint-cli2.yaml` を生成する。
  基本の 6 規則（`MD013`・`MD024`・`MD033`・`MD036`・`MD041`・`MD060`）は従来どおり無効とする。
- `--slidev` は、Prettier と ignore と同じ `*-slidev-sample.md` / `*-slidev-template.md` の glob を
  CLI2 の先頭の override の `filter` に設定し、`combine: merge` で基本設定を引き継ぐ。
  Slidev 単独でも、設定がなければ `.markdownlintrc` と `.markdownlint-cli2.yaml` を生成する。
- Slidev 用に追加で外す規則と理由は次のとおり。
  - `MD001`: スライドのレイアウトごとに見出しレベルを選べるようにする。
  - `MD022`: ページ区切り・ページごとの frontmatter に隣接する見出しを許す。
  - `MD025`: ページごとの H1 を許す。
  - `MD031`・`MD032`: ページ区切りに隣接するコードブロック・リストを許す。
- commit hook と result の検査は markdownlint-cli を使い続け、`.markdownlintrc` と
  `.markdownlintignore` を読む。Slidev の kata は hook・result 検査では除外し、VS Code では
  CLI2 の Slidev 用規則で検査する。
- 既存の `.markdownlint.*`・`.markdownlintrc`・`.markdownlint-cli2.*` は `--force` でも保持する。
  旧設定や CLI2 独自の設定がある場合は、競合する新規設定を自動作成せず、足りない内容と移行案を表示する。
  既存の `.markdownlintrc` だけがある場合は、その規則を保持して CLI2 の参照設定を追加する。
- [[specdojo:kata-guide|実践の型活用ガイド]] と [[specdojo:command-reference|コマンドリファレンス]] に
  各設定を読む道具、CLI2 は先頭・Prettier は末尾という順序、旧設定からの移行手順を記載した。
  `CHANGELOG.md` の Unreleased に変更を記録した。

### 確認結果と再発防止

- 変更した Markdown・TypeScript を `npx prettier --write` で整形し、`git diff --check` は成功した。
  hook に合わせて `node --import tsx tools/catalog-validate-if-configured.mjs` を実行し、終了コード 0。
  今回変更していないカタログの `based_on` 参照先の文書不足による警告は出るが、検証エラーはない。
- 単体テストを追加・更新した。生成物の JSON の先頭、CLI2 の `config.extends`・`filter`・`combine`・規則、
  lefthook と Slidev の同時指定、既存設定の保持、dry-run、設定の統合順序の案内を確認する。
  生成した hook の markdownlint 入口と result の検査を実際に呼ぶ回帰テストでは、長い行を許し、
  `MD018` の違反は検出することを確認する。
- 型検査・TypeScript lint・Markdown lint・frontmatter lint・単体テスト・統合テスト・schema 検査は、
  この pipeline の指定により親 runner が実行する。executor 内では重複実行しない。
- markdownlint-cli2 は依存にないため、個票で承認されたとおり実行検査は追加せず、生成内容を単体テストで検証する。
- 本リポジトリの保護された設定と `package.json`、登録簿の一覧・ステータス、result は変更していない。
  result には後続の reporter / runner が、実施内容・変更ファイル・親検証の結果と申し送りを記入する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-84f7-scaffold-slidev]]：Slidev を選んで入れる scaffold
- 報告元: 利用者の project（coderdojo-lessons-specdojo の prj-0001）。設定は commit `12976eb`・`a2495b9`、本家の決まりへの改名は `2c7c92b`
