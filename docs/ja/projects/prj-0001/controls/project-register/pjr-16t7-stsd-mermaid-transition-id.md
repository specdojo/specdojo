---
specdojo:
  id: prj-0001:pjr-16t7-stsd-mermaid-transition-id
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-06T11:13:40Z"
  due_on: null
  derived_from:
    - PJR-3APD
  depends_on:
    - PJR-S8EF
  approach: rulebook-maintenance
  targets:
    - specdojo:stsd-mermaid-rulebook
---

# PJR-16T7 stsd-mermaid-rulebook の遷移ラベルに遷移 ID を入れる

## 1. 概要

遷移ラベルを `T-<nn>` イベント / 条件 にし、分割図の遷移 ID の範囲の書き方を図の直下の表と合わせる

## 2. 入力

- 利用者のレビュー: 目的には、状態が対象の何を管理し、何のために使われるか（誰がその状態で何を判断するか）を書く。文書の読み手や使い方（承認する人、実装・テストへの利用）は書かない。章の名前は「目的」のままとする（2026-11-06 indie が決定）
- 利用者のレビュー: 状態の正本・判定の規則・互換の扱いは「適用範囲」ではない。「適用範囲」の後に新しい章「状態の判定」を置いてそこへ書き、「適用範囲」には対象・業務の範囲・到達点だけを残す（2026-11-06 indie が決定）
- 利用者のレビュー: スコープ（AS-IS / TO-BE）は既定を現行とし、「現行実装（AS-IS）」とは書かない。TO-BE の文書と並ぶときだけスコープを書く（2026-11-06 indie が決定）
- 利用者のレビュー: 「状態遷移図」と「遷移の説明」を 1 つの章「状態遷移」にまとめ、図を分けた場合は図ごとに、そのすぐ下へ遷移の表を置く。図の遷移のラベルにも遷移 ID を入れ、`T-<nn>` イベント / 条件 の形にする（2026-11-06 indie が決定）

## 3. 完了条件

- [[specdojo:stsd-mermaid-rulebook]] の遷移ラベルの規則と表（必須の要素）が `T-<nn> イベント / 条件` の形になり、遷移 ID は [[specdojo:stsd-rulebook]] の状態遷移の表の遷移 ID と一致させると書いている。条件が常に成立する場合は `T-<nn> イベント / イベント発生時` とする。
- 図の分割の規則が、PJR-S8EF で直した状態遷移の章（図ごとにすぐ下へ遷移の表を置く）と食い違わない。図の直前に遷移 ID の範囲を書く規則は、図の下の表で範囲が分かるなら不要とするか、残す理由を書いている。
- 規則の例（コードブロック）が新しいラベルになり、`npm run -s lint:mermaid` で描ける。
- [[specdojo:stsd-rulebook]] の章への参照を新しい章の名前に直している。
- 変えるのは `stsd-mermaid-rulebook` だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。ほかの Kata に直すべき点を見つけた場合は、変えずに個票の対応結果に書き、pipeline では報告の `handoff` にも書く。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ |
| --- | -------------------------------------------- | ---- | ---- | ---- |
| 1   | 遷移ラベルの規則と例を直す                   | BA   | open | -    |
| 2   | 図の分割の規則と章への参照を直し、検査を通す | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:stsd-mermaid-rulebook]]: 手入れの対象
- [[specdojo:stsd-rulebook]]: そろえる先（PJR-S8EF）
