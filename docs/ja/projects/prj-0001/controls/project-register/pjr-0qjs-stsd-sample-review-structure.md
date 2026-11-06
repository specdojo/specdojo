---
specdojo:
  id: prj-0001:pjr-0qjs-stsd-sample-review-structure
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
  registered_at: "2026-11-06T11:14:36Z"
  due_on: null
  derived_from:
    - PJR-3APD
  depends_on:
    - PJR-S8EF
    - PJR-16T7
  approach: sample-maintenance
  targets:
    - specdojo:stsd-sample
---

# PJR-0QJS stsd-sample を新しい章立てに合わせる

## 1. 概要

stsd-sample を新しい章立てと遷移 ID 入りのラベルに合わせる

## 2. 入力

- 利用者のレビュー: 目的には、状態が対象の何を管理し、何のために使われるか（誰がその状態で何を判断するか）を書く。文書の読み手や使い方（承認する人、実装・テストへの利用）は書かない。章の名前は「目的」のままとする（2026-11-06 indie が決定）
- 利用者のレビュー: 状態の正本・判定の規則・互換の扱いは「適用範囲」ではない。「適用範囲」の後に新しい章「状態の判定」を置いてそこへ書き、「適用範囲」には対象・業務の範囲・到達点だけを残す（2026-11-06 indie が決定）
- 利用者のレビュー: スコープ（AS-IS / TO-BE）は既定を現行とし、「現行実装（AS-IS）」とは書かない。TO-BE の文書と並ぶときだけスコープを書く（2026-11-06 indie が決定）
- 利用者のレビュー: 「状態遷移図」と「遷移の説明」を 1 つの章「状態遷移」にまとめ、図を分けた場合は図ごとに、そのすぐ下へ遷移の表を置く。図の遷移のラベルにも遷移 ID を入れ、`T-<nn>` イベント / 条件 の形にする（2026-11-06 indie が決定）

## 3. 完了条件

- 例が新しい章立てになり、目的が状態の目的（何を管理し、誰が何を判断するか）を示している。状態の判定の章に正本と判定の規則がある。
- 図の遷移ラベルが `T-<nn> イベント / 条件` で、分けた図ごとにすぐ下へ遷移の表がある。業務の文脈は駄菓子屋のままである。
- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]（PJR-S8EF・PJR-16T7 で直したもの）と食い違っていない。
- 変えるのは `stsd-sample` だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。ほかの Kata に直すべき点を見つけた場合は、変えずに個票の対応結果に書き、pipeline では報告の `handoff` にも書く。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ |
| --- | -------------------------------------------- | ---- | ---- | ---- |
| 1   | stsd-sample を新しい章立てとラベルに合わせる | BA   | open | -    |
| 2   | 検査を通す                                   | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:stsd-sample]]: 手入れの対象
- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]: そろえる先
