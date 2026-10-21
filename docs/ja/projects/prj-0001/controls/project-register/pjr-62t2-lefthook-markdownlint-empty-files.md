---
specdojo:
  id: prj-0001:pjr-62t2-lefthook-markdownlint-empty-files
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-21T22:09:17Z"
  derived_from:
    - PJR-7H7N
---

# PJR-62T2 lefthook の markdownlint で対象のファイルがないとき使い方の説明が出ないようにする

## 1. 概要

PJR-7H7N の hook は、commit した Markdown がすべて除外の設定で外れると、ファイルなしで markdownlint を呼び、使い方の説明が出る。対象がないときは markdownlint を呼ばずに終える

## 2. 完了条件

- 0.4.2 の範囲とする（2026-10-22、利用者が承認）。
- `templates/lefthook/tools/specdojo-pre-commit.mjs` の markdownlint の処理で、`.markdownlintignore` などで対象のファイルがなくなった場合は、markdownlint を呼ばずに成功で終える。Prettier の処理にも同じ空の呼び出しがあれば合わせて直す。
- 対象のファイルがある場合の動き（違反で commit が止まること）は変えない。
- 統合テストで、除外されるファイルだけを commit したときに、hook が使い方の説明を出さずに通ることを確かめる。既存の統合テストは通ったままにする。

- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く。

## 3. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ         |
| --- | ------------------------------------------------ | ---- | ---- | ------------ |
| 1   | 対象のファイルがないとき markdownlint を呼ばない | DEV  | done | 0.4.2 の範囲 |

## 4. 対応結果

- `templates/lefthook/tools/specdojo-pre-commit.mjs` にて、`.markdownlintignore` および `.prettierignore` による除外判定ロジックを追加した。対象ファイルがすべて除外された場合は、markdownlint や Prettier を呼び出さずに終了コード 0 で正常終了するようにした。
- 統合テスト `tests/src/shared/lefthook-scaffold.integration.test.ts` に、`.markdownlintignore` で除外されるファイルのみを staged にして commit した場合に、Usage などの説明を出力せずに hook が正常終了することを検証するテストケースを追加した。
- CHANGELOG の `## [Unreleased]` の不具合修正に本対応を追記した。

## 5. 関連ドキュメント

- PJR-7H7N（利用者向けの lefthook の scaffold）
