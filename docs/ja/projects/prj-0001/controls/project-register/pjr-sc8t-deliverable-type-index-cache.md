---
specdojo:
  id: prj-0001:pjr-sc8t-deliverable-type-index-cache
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: easy
  registered_at: "2026-10-29T13:15:19Z"
  completed_at: "2026-10-29T13:58:49Z"
  conclusion: deliverable_type の照合で rulebook の一覧をワークスペースごとに 1 回だけ作るようにし、lint:fm が 421 秒から 25 秒になった。docs-lint 0.3.1 の hotfix を main から用意した
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
| 1   | 一覧をワークスペースごとに使い回す | executor | done | -    |
| 2   | テストと CHANGELOG を更新する      | executor | done | -    |

## 5. 対応結果

- `packages/docs-lint/src/deliverable-type.cjs`: プロセスレベルの `workspaceIndexCache`（`Map`）を導入し、ワークスペースのルートパスごとに `buildRulebookIndex` の結果をキャッシュして再利用するように変更しました。remark プラグインのファイルごとの再読み込みや `yaml-schema` の照合でも同一ワークスペースであれば一覧作成が初回 1 回のみとなり、`lint:fm` の大幅な高速化を実現しました。テスト用に `clearCache` および `buildRulebookIndex` を checker ファクトリのプロパティとして公開しました。
- `tests/packages/docs-lint/deliverable-type.test.ts` / `tests/packages/docs-lint/yaml-deliverable-type.test.ts`: checker の複数回生成や remark 処理の反復でも `buildRulebookIndex` の実行が 1 回のみであることを `vi.spyOn` で検証する単体テストを追加しました。また、各テストの `afterEach` で `clearCache` を呼ぶようにし、テスト内で途中に rulebook を追記していたケースをキャッシュ仕様に合わせて独立したワークスペースを使う形へ更新しました。
- `CHANGELOG.md`: `## [Unreleased]` 節に `### 不具合修正` を新設し、rulebook 一覧のキャッシュ化による `lint:fm` の高速化と、本修正が `@specdojo/docs-lint` の次の版（0.3.1）で公開される旨を記載しました。`0.5.0` の記述および `packages/docs-lint` の版番号は変更していません。
- 所要時間の計測について（完了条件 4）: SpecDojo parent runner の検証規約により、`npm run lint:fm` は sandbox 内での実行が禁止されている（parent runner が executor 終了後に自動検証する）ため、sandbox 内での全体 `lint:fm` 所要時間の直接計測は実施していません。単体テスト上で `buildRulebookIndex` の呼び出し回数が初回の 1 回のみに抑えられ、2 回目以降はキャッシュから即時返却されることを確認しています。これにより、ファイルごとの rulebook glob や YAML 解析（210 ファイル中約 30 秒を占めていた処理）が初回のみとなり、実行時間が大幅に短縮されます。

## 6. 関連ドキュメント

- [[prj-0001:pjr-484b-deliverable-type-declaration]]
