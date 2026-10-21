---
specdojo:
  id: prj-0001:pjr-7h7n-lefthook-scaffold-for-users
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: low
  owner: DEV
  registered_at: "2026-10-19T21:41:15Z"
---

# PJR-7H7N 利用者向けに git の hook（lefthook）を scaffold する

## 1. 概要

利用者のリポジトリでも、commit の前に Prettier・markdownlint・SpecDojo の検証（register build・catalog validate など）を流せるよう、lefthook の設定を scaffold する。どの検査を流すかの案を作り、完了条件を決めてから行う（2026-10-20、利用者が devcontainer の preset とは別の項目にすることを承認）

## 2. 完了条件

- 0.4.2 の範囲とする（2026-10-22、利用者が承認）。
- `specdojo init` と `config scaffold` で、利用者のリポジトリに lefthook の設定（`lefthook.yml`）と、それを入れる仕組みを作れる。`init` では選択肢（対話の質問と `--yes` 用のオプション）とし、既定は今の動き（作らない）のままとする。既存の `lefthook.yml` は上書きしない（上書きは明示の指定がある場合だけ）。
- commit の前（pre-commit）に流す検査は次の 4 つとし、変えたファイルだけを対象にする。時間のかかるテストは入れない。
  - 変えた Markdown と YAML の Prettier の検査
  - 変えた Markdown の markdownlint
  - 登録簿（`project_register_path` の下）を変えたときの `specdojo register build`（生成物の更新を同じ commit に含める）
  - カタログを変えたとき（`catalog_path` がある project だけ）の `specdojo catalog validate`
- 必要な devDependencies（lefthook・prettier・markdownlint-cli など）と npm script の追加は、利用者の `package.json` を書き換える前に内容を表示し、既存の script と依存を上書きしない。足りないものは案内として出す。
- 本リポジトリで起きた事故の対策を入れる: linked worktree や `node_modules` がない環境でも hook の入口が失敗しない（依存のない入口で判定してから委譲する、`.github/instructions/typescript.instructions.md` の hook の規則と前例の `tools/install-lefthook.mjs` に従う）。hook から git を呼ぶときに `GIT_DIR` などを引き継がない。
- [[specdojo:quick-start-guide]] の個別に設定する場合と、[[specdojo:command-reference]] に、作り方と流れる検査を書く。
- 単体テストで、生成される `lefthook.yml` の内容、既存ファイルを上書きしないこと、`catalog_path` がない project で catalog の検査が入らないことを確かめる。統合テストで、作った hook が一時のリポジトリで commit の前に動き、Markdown の違反で commit が止まることを確かめる。

- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ         |
| --- | -------------------------------------------- | ---- | ---- | ------------ |
| 1   | 利用者向けに lefthook の設定を scaffold する | DEV  | open | 0.4.2 の範囲 |

## 4. 対応結果

- `specdojo init --lefthook` の対話・非対話 opt-in と `config scaffold --lefthook` を追加した。既定は生成しない。
- staged の Markdown・YAML を対象にした Prettier、Markdown の markdownlint、設定済みパスに応じた `register build`・`catalog validate` を含む `lefthook.yml` を生成する。
- linked worktree・依存未導入時に安全に skip し、Git の repository-local 環境変数を子プロセスへ渡さない入口スクリプトを同梱した。
- 既存ファイル・npm script・依存を上書きせず、`package.json` への不足項目を変更前に表示するようにした。
- 単体テストと一時 Git リポジトリを使う統合テストを追加し、Quick Start・コマンドリファレンス・CHANGELOG を更新した。残課題はない。

## 5. 関連ドキュメント

- [[specdojo:quick-start-guide]]
- [[specdojo:command-reference]]
