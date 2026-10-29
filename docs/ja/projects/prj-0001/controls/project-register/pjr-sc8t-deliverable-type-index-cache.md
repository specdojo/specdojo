---
specdojo:
  id: prj-0001:pjr-sc8t-deliverable-type-index-cache
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: easy
  registered_at: "2026-10-29T13:15:19Z"
  block_reason: "parent validation failed: test-unit"
  derived_from:
    - PJR-484B
---

# PJR-SC8T deliverable_type の照合が rulebook の一覧をファイルごとに作り直し lint:fm が遅い

## 1. 概要

remark がファイルごとにプラグインを読み込み直すため、PJR-484B の照合が rulebook の一覧（約 0.34 秒）を毎回作り、lint:fm が 7 分かかって親の検証の上限に迫る。一覧をワークスペースごとに 1 回だけ作る

## 2. 入力

- 利用者の判断（案 A）: 一覧をワークスペースごとに 1 回だけ作って使い回し、修正は @specdojo/docs-lint 0.3.1 として公開する。版の変更と公開作業は本項目の後に orchestrator が別に行う。
- 観測: 何も動かしていない状態で npm run lint:fm が 421 秒。210 ファイルの remark で rulebook の glob が 186 回（作り直し 93 回）呼ばれ、50 秒のうち約 30 秒を占めた。親の検証の上限は 10 分で、PJR-JSEY の lint-fm が 2 回時間切れになった。

## 3. 完了条件

- `packages/docs-lint/src/deliverable-type.cjs` の rulebook の一覧を、同じプロセスの中ではワークスペースのルートごとに 1 回だけ作り、remark のプラグインがファイルごとに読み込み直されても使い回す。remark の照合と `yaml-schema` の照合の両方に効く。
- 照合の結果は変えない。利用リポジトリの rulebook が package 同梱の rulebook より優先される規則、`deliverable_type` の宣言の読み方、エラーと警告の文言を維持し、既存のテストが通る。
- 単体テストで、checker を複数回作っても（プラグインの読み込みを複数回繰り返しても）一覧の作成が 1 回だけであることを確かめる。
- 可能なら、修正前後の `lint:fm` の所要時間か、同じ条件の remark の所要時間を本個票の対応結果に書く。sandbox で測れない場合は、測れなかったことを書く。
- `CHANGELOG.md` の `## [Unreleased]` 節の `不具合修正` に追記し、`@specdojo/docs-lint` の次の版で公開することを書く。`0.5.0` と公開済みの版の節は変えない。`packages/docs-lint` の版は変えない。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。

## 4. 作業内容

| No  | 作業                               | 担当     | 状態 | メモ |
| --- | ---------------------------------- | -------- | ---- | ---- |
| 1   | 一覧をワークスペースごとに使い回す | executor | open | -    |
| 2   | テストと CHANGELOG を更新する      | executor | open | -    |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-484b-deliverable-type-declaration]]
