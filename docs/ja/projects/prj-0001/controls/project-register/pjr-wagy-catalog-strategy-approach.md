---
specdojo:
  id: prj-0001:pjr-wagy-catalog-strategy-approach
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  registered_at: "2026-10-27T22:58:31Z"
  derived_from:
    - PJR-NJJ7
  depends_on:
    - PJR-B4Y4
---

# PJR-WAGY カタログと strategy を作るための approach を追加する

## 1. 概要

子 todo からカタログの判定と生成（catalog plan・scaffold --plan）と schedule strategy generate を流せるようにし、todo の close から catalog_status を導く

- PJR-NJJ7 の決定に従い、epic の子 todo からカタログと strategy を作れるようにする。

## 2. 完了条件

- approach を 2 つ追加する。名前は executor が決める。
  - カタログを作る approach: agent が `catalog plan prompt` の指示に沿ってインスタンスを判定し、`catalog plan scaffold --from` で `dct-plan-<domain>.yaml` に取り込み、`catalog scaffold --plan` で `dct-<domain>.yaml` を作るまでを流す。
  - strategy を作る approach: agent が `sch-strategy-<track>.yaml` に scope と `approach_rules` を宣言し、`schedule strategy generate` と `schedule build --track` までを流す。
- domain と track を `--target` でどう指すかを executor が決め、理由を記録する。
- 2 つの approach の plan は、既存の kata と成果物カタログの参照を取り込み、完了条件が plan に出る。
- `timeline build` が register から `catalog_status` を導く。カタログを作る todo が `done` ならその domain を `primary` とみなす。人が書く計画である `tml-index.yaml` は書き換えず、手書きの値と食い違うときは警告する。
- command-reference を更新する。
- CHANGELOG の `## [Unreleased]` に追記する。公開済みの版の節は変えない。
- 単体テストで、approach の検証・plan の生成・`catalog_status` の導出を確かめる。
- 作業の中で `npm run typecheck`・`npm run lint:ts`・`npm run lint:md`・`npm run test:unit` が通り、親の検証 7 件が通る。
- 空のリポジトリで「カタログを作る todo → `timeline build` → strategy を作る todo」の流れを実際に通し、手順と結果を本個票の対応結果に書く。
- 設計で決めることは executor が決め、理由を本個票の対応結果に書き、報告の `handoff` にも書く。

## 3. 作業内容

| No  | 作業                                        | 担当     | 状態 | メモ |
| --- | ------------------------------------------- | -------- | ---- | ---- |
| 1   | カタログを作る approach を追加する          | executor | open | -    |
| 2   | strategy を作る approach を追加する         | executor | open | -    |
| 3   | `timeline build` で `catalog_status` を導く | executor | open | -    |
| 4   | command-reference・CHANGELOG を更新する     | executor | open | -    |
| 5   | 単体テストと空のリポジトリでの確認          | executor | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[specdojo:timeline-design-guide]]
- [[specdojo:command-reference]]
- [[specdojo:dct-rulebook]]
