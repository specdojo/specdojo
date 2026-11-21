---
specdojo:
  id: prj-0001:pjr-16t7-stsd-mermaid-transition-id
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-06T11:13:40Z"
  due_on: null
  completed_at: "2026-11-06T11:46:22Z"
  conclusion: stsd-mermaid-rulebook の遷移ラベルを `T-<nn>` イベント / 条件 にし、分割図の規則と章への参照を新しい状態遷移の章に合わせた
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

- [[specdojo:stsd-mermaid-rulebook|STSD の状態遷移図を Mermaid で記述するルール]] の遷移ラベル・必須要素・コード例を `T-<nn> イベント / 条件` に統一し、無条件の場合の `イベント発生時` と遷移表との ID 一致を明記した。章への参照は「状態遷移」に統一した。
- [[specdojo:stsd-rulebook|ステータス定義作成ルール]] の「状態遷移」に合わせ、図ごとに直下へ遷移表を置く規則を明記した。図の前の ID 範囲は、図を読む前に対象経路を識別するために維持し、直下の表との一致を必須にした。状態の表示名、分割の閾値、初期点・終了点と到達性の既存規則は変更していない。
- 根拠は主 rulebook の「ファイル命名・ID規則」「状態遷移」、[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]、[[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の `vp-arc-conciseness`。既存 sample と [[prj-0001:stsd-deliverable|ステータス定義（成果物）]] では図と別章の表をイベント・条件で照合する必要があり、ID の付与と図表の隣接が対応確認に役立つと判断した。既存の grade result は finding がなく、今回の改訂は個票の利用者レビューと主 rulebook を根拠にした。
- 申し送り: [[specdojo:stsd-sample|商品のステータス定義]] は「状態遷移図」「遷移の説明」が別章で、図のラベルに遷移 ID がない。目的に文書の利用者・用途を記載し、適用範囲に状態の正本・一意判定・AS-IS 表記も残っている。主 rulebook に合わせた改訂が必要だが、本タスクでは変更していない。
- Prettier 整形と適用される検査の結果は executor evidence に記録する。`lint:md`・`lint:fm`・`lint:mermaid` などの指定済み親検証は executor 終了後に runner が実行する。

## 6. 関連ドキュメント

- [[specdojo:stsd-mermaid-rulebook]]: 手入れの対象
- [[specdojo:stsd-rulebook]]: そろえる先（PJR-S8EF）
