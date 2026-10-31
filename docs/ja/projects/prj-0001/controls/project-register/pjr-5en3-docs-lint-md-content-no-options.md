---
specdojo:
  id: prj-0001:pjr-5en3-docs-lint-md-content-no-options
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: high
  difficulty: easy
  owner: DEV
  registered_at: "2026-10-31T08:47:12Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-2FV2
---

# PJR-5EN3 docs-lint の md-content を設定なしで使うと落ちる

## 1. 概要

`remark/md-content` を options なしで読み込むと `options.schemas` の読み取りで `TypeError` になるため、options がないときは空として扱う。

## 2. 入力

- 2026-10-31 の 0.6.0 の配布物の試用で見つけた。空のリポジトリの .remarkrc.yaml に @specdojo/docs-lint/remark/md-content を options なしで書くと、TypeError: Cannot read properties of undefined (reading 'schemas') で全ファイルが Cannot process file になる
- 原因は packages/docs-lint/src/remark-md-content.ts の remarkMdContent が options.schemas を options の有無を確かめずに読むこと。0.3.1 から同じだが、0.4.0 の README は content schema の対象にかかわらず `_CONTEXT_:` を検出すると案内している
- 0.6.0（docs-lint 0.4.0）の公開の前に直す。修正はリリースのブランチ feature/prj-0001/release-v0.6.0 にも取り込む

## 3. 完了条件

- `packages/docs-lint/src/remark-md-content.ts` の `remarkMdContent` で、options が渡されないとき（`undefined`）は空の options として扱い、`schemas` は空、`workspaceRoot` は `process.cwd()` とする。
- options なしで読み込んだとき、`_CONTEXT_:` の検出（ready の文書ではエラー、それ以外は情報）が動き、content schema の検査は行わないことを、単体テストで確かめる。
- options を渡す今の使い方の動きは変えない。
- 同じパッケージのほかの公開の remark プラグイン（`remark/no-unescaped-angle-placeholder`・`remark/frontmatter-ajv2020`）について、options なしで読み込んだときの動きを確かめ、本個票の対応結果に書く。`frontmatter-ajv2020` は schema の指定が必須で、なければ原因の分かるエラーで止まる今の動きのままでよい。
- `CHANGELOG.md` の `## [Unreleased]` 節の不具合修正に、`@specdojo/docs-lint` の変更として書く。公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を流して通し、親の検証も通る。

## 4. 作業内容

| No  | 作業                                                        | 担当     | 状態 | メモ |
| --- | ----------------------------------------------------------- | -------- | ---- | ---- |
| 1   | options がないときを空として扱い、テストと CHANGELOG を足す | executor | done | -    |

## 5. 対応結果

### 実施内容

- `packages/docs-lint/src/remark-md-content.ts` の `remarkMdContent` において、`options` が未指定（引数省略および `undefined` 渡し）の場合に空オブジェクト `{}` を既定値として扱い、`schemas` を空（`{}`）、`workspaceRoot` を `process.cwd()` とするよう修正した。options を渡す既存の呼び出し動作は維持される。
- `tests/packages/docs-lint/remark-md-content.test.ts` に options なし（引数なしおよび `undefined` 指定）で実行する単体テストを追加し、`status: ready` の文書では `_CONTEXT_:` の検出が error（fatal）となること、`status: draft` では info となること、`_CONTEXT_:` がない場合は content schema 検査が行われないことを確認した。
- `CHANGELOG.md` の `## [Unreleased]` 節の「不具合修正」に、`@specdojo/docs-lint` の変更内容を追記した。

### ほかの公開 remark プラグインの確認結果

- `remark/no-unescaped-angle-placeholder`: options 引数を取らないプラグイン（`Plugin<[], Root>`）であり、options なしで正常にロード・動作することを確認した。
- `remark/frontmatter-ajv2020`: options の引数既定値は `{}` となっているが、`schemaRules` または `yaml.schemas` の設定が必須と判定され、指定がない場合は明示的に `Error: remark-frontmatter-ajv2020: schema rules are required. Set options.schemaRules or options["yaml.schemas"].` という原因の分かるエラーで停止することを確認した。完了条件に合致しているため、現状の挙動のままとする。

### 成果物

- `packages/docs-lint/src/remark-md-content.ts`
- `tests/packages/docs-lint/remark-md-content.test.ts`
- `CHANGELOG.md`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-5en3-docs-lint-md-content-no-options.md`

### 残課題

- なし

## 6. 関連ドキュメント

- [[prj-0001:pjr-2fv2-release-v0-6-0]]
- [[prj-0001:pjr-jrsy-context-marker]]
