---
specdojo:
  id: prj-0001:pjr-he9r-per-project-parent-validations
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T12:48:45Z"
  due_on: "2026-10-31"
---

# PJR-HE9R project ごとに parent_validations を足せるようにする

## 1. 概要

exec-defaults.yaml は project 間で共有され、プロダクトリポジトリ向けの { id, repo } を足すと、その repos を持たない project の run で検証が failed になる。exec-defaults を複製せずに、project ごとに親 runner の検証を足せるようにする（`projects.<id>.run` での追加や、exec-defaults の引き継ぎなど）

## 2. 完了条件

- `exec-defaults.yaml` を複製せずに、project ごとに親 runner の検証（`pipeline.parent_validations` の要素、`{ id, repo }` を含む）を足せる。
- _UNDECIDED_: 指定の場所と形（`projects.<id>.run` に追加の検証を書く、`exec-defaults` が別のファイルを引き継ぐ、など）は設計時に決める。
- prj-0002 で `{ id: typecheck, repo: specdojo-lp }` と `{ id: lint-ts, repo: specdojo-lp }` を足しても、`repos` を持たない prj-0001 の run が影響を受けないことを、テストで確認している。
- 足した検証が、その project の run の evidence に `source: runner` と `repo` 付きで記録される。
- [[specdojo:exec-config-guide]] と [[specdojo:specdojo-config-reference]] に、指定の方法と、共有の `exec-defaults.yaml` との関係が書かれている。
- 前提（2026-10-12）: `exec_defaults` は `projects.<id>.run` で project ごとに指定できるが、ファイルを引き継ぐ仕組みはない。`specdojo-lp` には prj-0002 の PJR-2CQC で `typecheck`・`lint:ts` の script を用意した。
- `_UNDECIDED_` の点は、設計の段階で executor が決め、決めた内容と理由を result と個票の対応結果に書く。決めた内容は既存の動きを変えない（指定しない利用者の動きは今のまま）ものにする。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG の `## [0.4.1] - 未定` の節に書く。公開済みの版の節は変えない（2026-10-20、利用者の承認で 0.4.1 の範囲に加えた）。

## 3. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ                                    |
| --- | -------------------------------------- | ---- | ---- | --------------------------------------- |
| 1   | 指定の場所と形を設計する               | DEV  | open | -                                       |
| 2   | 実装し、テストと文書を更新する         | DEV  | open | -                                       |
| 3   | prj-0002 に `specdojo-lp` の検証を足す | DEV  | open | `.specdojo/` の変更は利用者の承認を得る |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-2cqc-lp-dev-environment]]: 本項目を必要とした項目。
- [[specdojo:exec-config-guide]]: `parent_validations` と `{ id, repo }`。
- [[prj-0001:pjr-ns8y-parent-validation-build-format-ids]]: 許可リストに `build`・`format` の ID がない問題。
