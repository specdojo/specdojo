---
specdojo:
  id: prj-0001:pjr-93nk-stsd-recipe-review-structure
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-06T11:15:04Z"
  due_on: null
  derived_from:
    - PJR-3APD
  depends_on:
    - PJR-S8EF
    - PJR-16T7
  approach: recipe-maintenance
  targets:
    - specdojo:stsd-recipe
---

# PJR-93NK stsd-recipe を新しい章立てに合わせる

## 1. 概要

stsd-recipe の手順を新しい章立てと遷移 ID 入りのラベルに合わせる

## 2. 入力

- 利用者のレビュー: 目的には、状態が対象の何を管理し、何のために使われるか（誰がその状態で何を判断するか）を書く。文書の読み手や使い方（承認する人、実装・テストへの利用）は書かない。章の名前は「目的」のままとする（2026-11-06 indie が決定）
- 利用者のレビュー: 状態の正本・判定の規則・互換の扱いは「適用範囲」ではない。「適用範囲」の後に新しい章「状態の判定」を置いてそこへ書き、「適用範囲」には対象・業務の範囲・到達点だけを残す（2026-11-06 indie が決定）
- 利用者のレビュー: スコープ（AS-IS / TO-BE）は既定を現行とし、「現行実装（AS-IS）」とは書かない。TO-BE の文書と並ぶときだけスコープを書く（2026-11-06 indie が決定）
- 利用者のレビュー: 「状態遷移図」と「遷移の説明」を 1 つの章「状態遷移」にまとめ、図を分けた場合は図ごとに、そのすぐ下へ遷移の表を置く。図の遷移のラベルにも遷移 ID を入れ、`T-<nn>` イベント / 条件 の形にする（2026-11-06 indie が決定）

## 3. 完了条件

- 手順が新しい章立て（状態の判定の章、図とその下の遷移の表）と、遷移 ID 入りのラベルに合っている。目的の書き方の手順が、状態の目的を書くよう導いている。
- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]（PJR-S8EF・PJR-16T7 で直したもの）と食い違っていない。
- 変えるのは `stsd-recipe` だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。ほかの Kata に直すべき点を見つけた場合は、変えずに個票の対応結果に書き、pipeline では報告の `handoff` にも書く。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ |
| --- | -------------------------------------------- | ---- | ---- | ---- |
| 1   | stsd-recipe を新しい章立てとラベルに合わせる | BA   | open | -    |
| 2   | 検査を通す                                   | BA   | open | -    |

## 5. 対応結果

- [[specdojo:stsd-recipe|STSD 作成レシピ]] の目的の問い・例を、状態が対象の何を管理し、誰が何を判断するかを引き出す内容へ更新した。「適用範囲」から正本を分離して「状態の判定」の問いを設け、「状態遷移」は各図と直下の遷移表を一組として作る手順へ統合した。遷移ラベルの `T-<nn> イベント / 条件`、既存 ID の維持、現行を既定とするスコープの扱いを、レビュー観点・仕上げチェックまで反映した。
- 判断根拠: [[specdojo:stsd-rulebook|STSD 作成ルール]]・[[specdojo:stsd-mermaid-rulebook|STSD Mermaid 記法ルール]]、[[specdojo:recipe-authoring-standard|Recipe 記述標準]]、[[specdojo:stsd-sample|商品のステータス定義]]。Job Run・成果物の既存 STSD と Job Run の完成版レビュー記録も確認し、正本と派生記録の区別、未決事項を判断者へ引き渡す手順は維持した。旧章立てが残る成果物・template より rulebook を優先した。recipe の既存 grade result は finding なしであり、今回は個票の利用者レビューを根拠に改訂した。
- 検証: 変更した Markdown の Prettier 整形、`npm run validate:history-links`、hook のカタログ検証、`register build --project prj-0001`、staged の証跡秘密情報検査が通過した。カタログ検証では変更対象外の参照に関する警告がある。`lint:md`・`lint:fm`・`lint:mermaid` などの親検証は、executor 終了後に親 runner が実施する。
- 申し送り: [[specdojo:stsd-template|STSD 雛形]] は正本を「適用範囲」に置き、「状態の判定」がなく、「状態遷移図」「遷移の説明」が別章で、遷移ラベルに ID がない。スコープも常に AS-IS / TO-BE を記入する形のため、[[prj-0001:pjr-8tmf-stsd-template-review-structure|PJR-8TMF]] で新しい章立て・ラベル・スコープの扱いへ追従する。本項目では他の Kata と `docs/ja/product/` 配下を変更していない。

## 6. 関連ドキュメント

- [[specdojo:stsd-recipe]]: 手入れの対象
- [[specdojo:stsd-rulebook]]・[[specdojo:stsd-mermaid-rulebook]]: そろえる先
