---
specdojo:
  id: prj-0001:pjr-tc62-item-commit-type-scope
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-31T02:42:32Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-BNMV
---

# PJR-TC62 個票に commit の type と scope を持たせる

## 1. 概要

プロダクトのリポジトリの commit の type と scope を項目ごとに選べるよう、個票に `commit_type` と `commit_scope` を持たせ、`register add` と `update` で指定できるようにする。

## 2. 入力

- PJR-BNMV の決定: type は個票の `commit_type`、任意の scope は `commit_scope` に持ち、register add / update の --commit-type / --commit-scope で指定する。指定がなければ項目の type から決め（issue は fix、todo・change-request は feat）、この対応も設定で変えられるようにする

## 3. 完了条件

- 個票の frontmatter に任意の `commit_type` と `commit_scope` を足し、`register-item-frontmatter.schema.yaml` に定義する。`commit_type` の値は Conventional Commits の type（`feat`・`fix`・`docs`・`refactor`・`test`・`chore`・`perf`・`build`・`ci`・`style`・`revert`）とする。値の一覧を固定するか、形式だけを検査するかは executor が決める。
- `register add` と `register update` に `--commit-type` と `--commit-scope` を足す。`update` では `-` で消せるようにする。
- 指定がない項目の type は、項目の type から決める。既定の対応は `issue` が `fix`、`todo`・`change-request` が `feat` とし、その他の項目の type の扱いは executor が決める。対応は設定で変えられるようにし、置き場所（`specdojo.config.json` の project か `repos[]`）は executor が決める。
- 項目の commit の type と scope を、後続の項目（PJR-Z7GX・PJR-M1DH）から 1 つの関数で引けるようにする。この段階では、exec の commit メッセージやブランチ名はまだ変えない。
- 単体テストを足す。対象は、add と update での指定と消去、不正な値のエラー、指定がないときの既定の対応、設定による対応の上書き。
- command-reference の `register add` / `update` と、設定を足した場合は設定リファレンスに書く。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。`0.5.0` と公開済みの版の節は変えない。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と、変更した文書で `npm run lint:md`・`npm run lint:fm` を流して通し、親の検証も通る。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。
- 保護された設定（`.specdojo/`・`package.json` など）に触れる必要がある場合は、変更せずに案を本個票の対応結果と報告の `handoff` に書く。

## 4. 作業内容

| No  | 作業                                                                                            | 担当     | 状態 | メモ |
| --- | ----------------------------------------------------------------------------------------------- | -------- | ---- | ---- |
| 1   | 個票の frontmatter・schema と `register add` / `update` に `commit_type`・`commit_scope` を足す | executor | open | -    |
| 2   | 既定の対応と設定、引くための関数、テスト、文書を足す                                            | executor | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-bnmv-product-repo-git-workflow]]
- [[specdojo:specdojo-config-reference]]
- [[specdojo:command-reference]]
