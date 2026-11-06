---
specdojo:
  id: prj-0001:pjr-8tmf-stsd-template-review-structure
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
  registered_at: "2026-11-06T11:14:08Z"
  due_on: null
  derived_from:
    - PJR-3APD
  depends_on:
    - PJR-S8EF
    - PJR-16T7
  approach: template-maintenance
  targets:
    - specdojo:stsd-template
---

# PJR-8TMF stsd-template を新しい章立てに合わせる

## 1. 概要

stsd-template の見出しと骨組みを、目的・適用範囲・状態の判定・状態一覧・状態遷移の章立てに合わせる

## 2. 入力

- 利用者のレビュー: 目的には、状態が対象の何を管理し、何のために使われるか（誰がその状態で何を判断するか）を書く。文書の読み手や使い方（承認する人、実装・テストへの利用）は書かない。章の名前は「目的」のままとする（2026-11-06 indie が決定）
- 利用者のレビュー: 状態の正本・判定の規則・互換の扱いは「適用範囲」ではない。「適用範囲」の後に新しい章「状態の判定」を置いてそこへ書き、「適用範囲」には対象・業務の範囲・到達点だけを残す（2026-11-06 indie が決定）
- 利用者のレビュー: スコープ（AS-IS / TO-BE）は既定を現行とし、「現行実装（AS-IS）」とは書かない。TO-BE の文書と並ぶときだけスコープを書く（2026-11-06 indie が決定）
- 利用者のレビュー: 「状態遷移図」と「遷移の説明」を 1 つの章「状態遷移」にまとめ、図を分けた場合は図ごとに、そのすぐ下へ遷移の表を置く。図の遷移のラベルにも遷移 ID を入れ、`T-<nn>` イベント / 条件 の形にする（2026-11-06 indie が決定）

## 3. 完了条件

- 見出しの順と骨組みが、目的・適用範囲・状態の判定・状態一覧・状態遷移（図とその下の遷移の表）・今後の検討メモになっている。記入の案内（`_TODO_` など）が、目的に状態の目的を書くよう誘導し、文書の使い方へ誘導していない。
- スコープの既定（現行）に合わせ、AS-IS / TO-BE の記入欄を、TO-BE の文書と並ぶときだけ書く形にしている。
- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]（PJR-S8EF・PJR-16T7 で直したもの）と食い違っていない。
- 変えるのは `stsd-template` だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。ほかの Kata に直すべき点を見つけた場合は、変えずに個票の対応結果に書き、pipeline では報告の `handoff` にも書く。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ |
| --- | ---------------------------------------------- | ---- | ---- | ---- |
| 1   | stsd-template を新しい章立てとラベルに合わせる | BA   | open | -    |
| 2   | 検査を通す                                     | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:stsd-template]]: 手入れの対象
- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]: そろえる先
