---
specdojo:
  id: prj-0001:pjr-xrab-exec-integration-branch-override
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T08:54:03Z"
  due_on: "2026-10-31"
---

# PJR-XRAB exec run でプロダクトリポジトリの統合先を run ごとに指定できるようにする

## 1. 概要

integration_branch は project の設定に固定され、GitHub flow ではトピックが変わるたびに設定ファイルを書き換える必要がある。exec run に --integration-branch `<repo>`=`<branch>` のような指定を加え、run ごとに統合先を選べるようにする

## 2. 完了条件

- `exec run` で、プロダクトリポジトリの統合先を run ごとに指定できる。指定がない場合は、従来どおり `repos[].integration_branch`（省略時はそのリポジトリの現在のブランチ）を使う。
- _UNDECIDED_: 指定の形（例: `--integration-branch <repo>=<branch>`）、`--resume` や `--parallel` での扱い、指定したブランチが存在しない場合の扱いは、設計時に決める。
- 指定した統合先が result の trace（統合先ブランチと commit snapshot）に記録される。
- [[specdojo:command-reference]] と [[specdojo:specdojo-config-reference]] に、指定の方法と優先順位が書かれている。
- 単体テストで優先順位（run の指定 → 設定 → 現在のブランチ）を、統合テストで指定したブランチへ統合されることを確認している。
- `_UNDECIDED_` の点は、設計の段階で executor が決め、決めた内容と理由を result と個票の対応結果に書く。決めた内容は既存の動きを変えない（指定しない利用者の動きは今のまま）ものにする。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- runner のコードを変えるため、統合の後に `exec run --register` を 1 回流して動作を確かめる（PJR-JSEY）。
- CHANGELOG の `## [0.4.1] - 未定` の節に書く。公開済みの版の節は変えない（2026-10-20、利用者の承認で 0.4.1 の範囲に加えた）。

## 3. 作業内容

| No  | 作業                           | 担当 | 状態 | メモ |
| --- | ------------------------------ | ---- | ---- | ---- |
| 1   | 指定の形と優先順位を設計する   | DEV  | open | -    |
| 2   | 実装し、テストと文書を更新する | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-zdvq-product-repo-branch-strategy]]: 派生元の決定。
- [[specdojo:specdojo-config-reference]]: `repos[].integration_branch`。
- [[prj-0002:pjr-hepk-lp-content]]: `specdojo-lp` の `main` に統合が並んだ項目。
