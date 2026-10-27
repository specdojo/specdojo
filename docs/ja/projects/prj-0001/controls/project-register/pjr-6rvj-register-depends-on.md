---
specdojo:
  id: prj-0001:pjr-6rvj-register-depends-on
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  registered_at: "2026-10-27T23:00:16Z"
  derived_from:
    - PJR-NJJ7
---

# PJR-6RVJ register の項目に順番の依存（depends_on）を追加する

## 1. 概要

個票の frontmatter に depends_on を足し、先行の項目が終端でなければ exec run --register・routine の sweep・夜間の queue で実行を飛ばす。存在しない ID・自己参照・循環を検証し、一覧と逆引きのビューに出す

- 由来を表す `derived_from` とは別に、先に終わっているべき項目を `depends_on` に記録し、順番のある todo を順番どおりに実行できるようにする（PJR-NJJ7 のフォローアップ）。
- 名前は timeline と schedule の `depends_on` にそろえる。

## 2. 完了条件

- 個票の frontmatter の schema（`register-item-frontmatter.schema.yaml`）と event の schema に `depends_on`（登録項目の ID の配列）がある。
- `register add` / `update` で `--depends-on <ID>` を繰り返し指定でき、`--depends-on -` で外せる。変更は event に記録される。
- 記帳と `register build` が、存在しない ID・自分自身・循環する依存をエラーにする。別の project の ID の扱いは `derived_from` の規則にそろえる。
- 先行の項目が終端（`done` / `decided`）でなければ、`exec run --register` は実行せずに止まり、終わっていない先行の項目を表示する。夜間の orchestrator（`specdojo orchestrator night`）は、その項目を飛ばして理由を記録する。
- 先行が `rejected` / `deferred` の場合も自動では進めない。状態を自動で `waiting` に変えない。
- 一覧（`pjr-index.md`）に `depends_on` が出る。どの項目に後続があるかを逆引きできるビューがある。
- pjr-rulebook・register-operation-guide・command-reference に、`depends_on` と `derived_from` の違いと、実行を飛ばす判定を書く。
- CHANGELOG の `## [Unreleased]` に追記する。公開済みの版の節は変えない。
- 単体テストで、検証の 3 種類・実行を飛ばす判定・記帳と event の往復を確かめる。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 設計で決めること（依存のグラフの検証を置くモジュールなど）は executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。

## 3. 作業内容

| No  | 作業                                                     | 担当     | 状態 | メモ |
| --- | -------------------------------------------------------- | -------- | ---- | ---- |
| 1   | schema・個票・event に `depends_on` を追加する           | executor | open | -    |
| 2   | `register add` / `update` の `--depends-on` と検証を実装 | executor | open | -    |
| 3   | `exec run --register` と夜間の orchestrator の判定を実装 | executor | open | -    |
| 4   | 一覧と逆引きのビューを追加する                           | executor | open | -    |
| 5   | rulebook・ガイド・command-reference・CHANGELOG を更新    | executor | open | -    |
| 6   | 単体テストを追加し、検査を通す                           | executor | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:pjr-rulebook]]
- [[specdojo:register-operation-guide]]
- [[specdojo:command-reference]]
