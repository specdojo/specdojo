---
specdojo:
  id: prj-0001:pjr-5q7r-cdfd-overview-orchestrator-flow
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-02T06:56:59Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-05QS
---

# PJR-5Q7R 全体概要の Orchestrator を指示の図にし、線のない区分を外す

## 1. 概要

cdfd-overview の Orchestrator の調整の表を、Orchestrator から 6 区分への指示と、Orchestrator が直接読み書きするデータストアへの線の図に置き換え、トランザクションデータの図から 3.1、マスタ・構成データの図から 3.6 を外す

## 2. 入力

- PJR-05QS の後、トランザクションデータの図では 3.1、マスタ・構成データの図では 3.6 に線がない。利用者はこれらを図から外すよう求めた（2026-11-02）
- 利用者の考え: Orchestrator は register 系・schedule 系・routine 系・実行サイクル・3.1・3.6 に指示を出す。Orchestrator が直接触るデータストアには線をつなぎ、それ以外のデータストアは各区分が CLI 経由で扱う（2026-11-02）
- 5.3 の Orchestrator の調整の表は、この図に置き換えて不要にする

## 3. 完了条件

- [[prj-0001:cdfd-overview]] の「トランザクションデータの流れ」の図から「プロジェクト構成の構築・管理」（3.1）のノードを、「マスタ・構成データの流れ」の図から「文書の廃棄（非推奨化・保管）」（3.6）のノードを外している。ほかのノードと線は変えない
- 「Orchestrator の調整」の表を、同じ題の図に置き換えている。図には次を描く
  - Orchestrator（3.7）から 6 区分（3.1〜3.6）への指示の線。ラベルは指示の内容を 1〜2 語の名詞で書く
  - Orchestrator が直接読み書きするデータストアと、その線。どのデータストアが「直接」かは、実装（`src/` の orchestrator・runner・exec の処理）と運用ガイドを根拠に決め、specdojo の CLI のコマンドを通じて各区分が扱うものは Orchestrator から線を引かない。データストアごとの判断と根拠を個票の対応結果に表で記録する
  - 6 区分の位置は、ほかの 2 つの図にそろえ、Orchestrator を一番上に置く
- 図の説明は 1 文までとする。表は残さない
- 2 つの図に加えて 3 つ目の図を `d2 --layout elk` で SVG に出力し、並びと図の大きさを個票の対応結果に記録する
- 「プロセス領域」と「データストア」の表、「詳細 CDFD 一覧」、「凡例（本プロダクト共通）」は変えない。status は変えない（draft のまま）。詳細の CDFD の文書は変えない
- `npm run lint:md`・`npm run lint:d2` と親の検証が通る

## 4. 作業内容

| No  | 作業                                                             | 担当 | 状態 | メモ |
| --- | ---------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 2 つの図から線のない区分を外す                                   | BA   | open | -    |
| 2   | Orchestrator の調整の表を指示の図に置き換える                    | BA   | open | -    |
| 3   | 直接読み書きするデータストアの判断と根拠、並び・大きさを記録する | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:cdfd-overview]]
- [[specdojo:cdfd-d2-rulebook]]
