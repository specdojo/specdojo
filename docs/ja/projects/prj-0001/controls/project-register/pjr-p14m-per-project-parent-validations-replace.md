---
specdojo:
  id: prj-0001:pjr-p14m-per-project-parent-validations-replace
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-10-21T13:19:31Z"
  due_on: "2026-10-31"
---

# PJR-P14M project ごとに共有の親の検証を置き換えられるようにする

## 1. 概要

`projects.<id>.run.parent_validations` は共有の exec-defaults の親の検証へ追記するだけで減らせない。文書と LP だけを変える prj-0002 の run で本体の全テスト（test-unit・test-integration など）が走らないよう、exec-defaults.yaml を複製せずに project ごとに共有の親の検証を置き換える、または除外できるようにする（prj-0002 の PJR-B3W9 から起票）

## 2. 完了条件

- `exec-defaults.yaml` を複製せずに、project ごとに共有の `pipeline.parent_validations` を置き換える、または一部を除外できる。指定場所は `projects.<id>.run` 配下とする。
- 指定の形（置き換えか除外か、キーの名前と値）は executor が決め、決めた内容と理由を result と個票の対応結果に書く。
- 指定しない project の有効な親の検証は今のまま変わらない。既存の `run.parent_validations`（追記）の動きも変わらない。
- prj-0002 で本体の検証を外し、`lint-fm`・`lint-md` と `{ id: typecheck, repo: specdojo-lp }` などだけにした設定で、prj-0001 の有効な検証が変わらないことをテストで確かめる。
- 未知の ID、存在しない検証の除外の指定、指定の結果として同じ ID と実行先が重複する場合は、agent の起動前に設定エラーになる。
- [[specdojo:exec-config-guide]] と [[specdojo:specdojo-config-reference]]、config の schema に、指定の方法と共有の `exec-defaults.yaml` との関係が書かれている。
- CHANGELOG は未公開の版の節に書く。公開済みの版の節は変えない。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる。
- `.specdojo/` の設定（prj-0002 への適用を含む）は変えない。適用は prj-0002 の PJR-B3W9 で行う。

## 3. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ             |
| --- | ------------------------------ | ---- | ---- | ---------------- |
| 1   | 指定の場所と形を設計する       | DEV  | open | 置き換えか除外か |
| 2   | 実装し、テストと文書を更新する | DEV  | open | -                |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-b3w9-exec-defaults]]: 本項目を必要とした項目。ここでの実装の後に prj-0002 の設定へ適用する。
- [[prj-0001:pjr-he9r-per-project-parent-validations]]: project ごとに親の検証を足せるようにした項目。
- [[specdojo:exec-config-guide]]: `parent_validations` と `{ id, repo }`。
