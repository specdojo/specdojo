---
specdojo:
  id: prj-0001:pjr-s8ef-stsd-rulebook-review-structure
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
  registered_at: "2026-11-06T11:13:12Z"
  due_on: null
  derived_from:
    - PJR-3APD
  approach: rulebook-maintenance
  targets:
    - specdojo:stsd-rulebook
---

# PJR-S8EF stsd-rulebook を目的・状態の判定・状態遷移の章立てに直す

## 1. 概要

レビューの指摘で、目的の書き方、状態の判定の章、スコープの既定、状態遷移の章（図の直下に遷移の表）を stsd-rulebook に反映する

## 2. 入力

- 利用者のレビュー: 目的には、状態が対象の何を管理し、何のために使われるか（誰がその状態で何を判断するか）を書く。文書の読み手や使い方（承認する人、実装・テストへの利用）は書かない。章の名前は「目的」のままとする（2026-11-06 indie が決定）
- 利用者のレビュー: 状態の正本・判定の規則・互換の扱いは「適用範囲」ではない。「適用範囲」の後に新しい章「状態の判定」を置いてそこへ書き、「適用範囲」には対象・業務の範囲・到達点だけを残す（2026-11-06 indie が決定）
- 利用者のレビュー: スコープ（AS-IS / TO-BE）は既定を現行とし、「現行実装（AS-IS）」とは書かない。TO-BE の文書と並ぶときだけスコープを書く（2026-11-06 indie が決定）
- 利用者のレビュー: 「状態遷移図」と「遷移の説明」を 1 つの章「状態遷移」にまとめ、図を分けた場合は図ごとに、そのすぐ下へ遷移の表を置く。図の遷移のラベルにも遷移 ID を入れ、`T-<nn>` イベント / 条件 の形にする（2026-11-06 indie が決定）

## 3. 完了条件

- [[specdojo:stsd-rulebook]] の「目的」の規則が、入力の決定どおり、状態が対象の何を管理し何のために使われるか（誰がその状態で何を判断するか）を書くと定め、文書の読み手や使い方を書かないと明記している。章の名前は「目的」のままである。
- 「適用範囲」の後に必須の章「状態の判定」があり、状態の正本となる管理場所、現在状態の判定の規則（イベントの再生や導出状態の扱いなど）、互換の扱いをそこへ書くと定めている。「適用範囲」の規則には対象・状態変更を起こす業務範囲・到達点（終了点を置かない理由）だけが残っている。
- スコープの規則が、既定を現行とし、TO-BE の文書と並ぶときだけ AS-IS / TO-BE を書く形になっている。ファイル命名・ID 規則の `<term>` の説明と全体方針も、これと食い違っていない。
- 「状態遷移図」と「遷移の説明」が 1 つの必須の章「状態遷移」にまとまり、図を分けた場合は図ごとに、そのすぐ下へその図の遷移の表を置くと定めている。表の列の規則は今の「遷移の説明」の列を保つ。
- 図のラベルを `T-<nn> イベント / 条件` にすることを、本文要件か記述ガイドで [[specdojo:stsd-mermaid-rulebook]] に委ねる形で書いている。
- 本文要件の表、記述ガイド、完成判定（図の全遷移が、その図の下の表へ一度ずつ対応する）、禁止事項が新しい章立てと食い違っていない。章参照は章の名前で書いている。
- 変えるのは `stsd-rulebook` だけで、ほかの Kata と成果物（`docs/ja/product/` 配下）は変えていない。ほかの Kata に直すべき点を見つけた場合は、変えずに個票の対応結果に書き、pipeline では報告の `handoff` にも書く。
- `npm run -s lint:md`・`npm run -s lint:fm`・`npm run -s lint:mermaid` が通っている。

## 4. 作業内容

| No  | 作業                                                           | 担当 | 状態 | メモ |
| --- | -------------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 目的・状態の判定・スコープの規則を直す                         | BA   | open | -    |
| 2   | 状態遷移の章をまとめ、本文要件・記述ガイド・完成判定をそろえる | BA   | open | -    |
| 3   | 検査を通す                                                     | BA   | open | -    |

## 5. 対応結果

- [[specdojo:stsd-rulebook|ステータス定義作成ルール]] を改訂した。「目的」を状態による業務判断に限定し、「適用範囲」の後へ必須の「状態の判定」を追加した。現行を既定とするスコープ規則を全体方針・命名規則でそろえ、「状態遷移」に各図と直下の遷移表をまとめた。図のラベルは `T-<nn> イベント / 条件` とし、完成判定・禁止事項も整合させた。
- grade の F001 は既存の ID 保持・欠番・再利用禁止の規則で解消済みのため維持し、図のラベルにも同じ ID を使う規則を加えた。F002 は「本文要件」の表と記述ガイドに、正本の管理場所を「状態の判定」、状態変更を起こす業務範囲を「適用範囲」として対応させた。判定根拠は [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の `vp-qe-omissions-consistency` と [[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]。
- [[prj-0001:xer-t-stsd-pilot-stsd-job-run-080|Job Run の簡潔化結果]]、[[prj-0001:xer-t-stsd-pilot-stsd-register-entry-080|登録項目の簡潔化結果]]、[[prj-0001:xer-t-stsd-pilot-stsd-routine-run-080|定期処理の簡潔化結果]] と各成果物を照合した。`vp-arc-conciseness` に照らし、図表の全遷移の対応と共有状態の宣言は判断・到達性の確認に必要なため維持した。分割閾値を緩和する根拠はなく、Mermaid 規則への委譲を維持した。共通条件の集約・表からの参照により、図表以外の説明の反復を避ける規則を加えた。[[prj-0001:stsd-task-execution|タスク実行のステータス定義]] のイベント再生・導出状態・過去イベントの互換も「状態の判定」の根拠とした。
- 他の Kata は変更していない。後続で [[specdojo:stsd-recipe|STSD 作成レシピ]]・[[specdojo:stsd-sample|STSD サンプル]]・[[specdojo:stsd-template|STSD テンプレート]] の目的、スコープ、正本・判定・互換の配置、新章立て、図ごとの直下の表、ラベルの ID を改訂後の規則へ合わせる必要がある。[[specdojo:stsd-mermaid-rulebook|STSD の Mermaid 規則]] も章参照と遷移ラベル・構文例・完成判定を合わせる必要がある（図のラベルは PJR-16T7 の対象）。差異は主 rulebook を優先すると明記した。`docs/ja/product/` 配下は変更せず、適用する際の追随が必要である。検査結果は後続 runner の evidence・reporter の result に記録する。

## 6. 関連ドキュメント

- [[specdojo:stsd-rulebook]]: 手入れの対象
- [[specdojo:stsd-mermaid-rulebook]]: 図の規則（PJR-16T7 で直す）
- [[prj-0001:stsd-task-execution]]: レビューした代表の 1 件
