---
specdojo:
  id: prj-0001:pjr-87ke-cdfd-uc-kata-shared-areas
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-03T10:11:07Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-GQN3
  commit_type: docs
  commit_scope: rulebooks
---

# PJR-87KE ユースケース別 CDFD の Kata に共通の領域・例外の図の分け方・絵文字の決まりを足す

## 1. 概要

cdfd-uc の Kata に、複数の系統が通る領域の内部は 1 か所でだけ描くこと、例外時の戻りは省かずに図を分けること、絵文字を全体概要の凡例にそろえることを定める

## 2. 入力

- PJR-GQN3 の 1 回目の書き直しで、3 文書が実行サイクル（P-07・P-08・P-11）をそれぞれ詳しく描き、schedule 系の図は線が約 30 本、routine 系は P-07 に 15 本ほどの線が集まり、例外時の戻りの図も線が多かった。絵文字の付け方も文書ごとにそろっていなかった（2026-11-03）
- 利用者の判断: 「実行サイクル」はこのプロダクトに固有の区分なので、Kata には一般化した形で書く。複数の系統（ユースケース）が共通して通るプロセス領域の内部は 1 か所（全体概要、またはその領域の詳細の文書）でだけ描き、ほかの詳細の文書では 1 つのノードとして置き、受け渡しの線だけを描く（2026-11-03）
- 利用者の判断: 例外時の戻りは、大事なものに絞ると必要な例外が抜けるため省略しない。1 つの図の線が多い場合は、戻り先や段ごとに図を分けて見やすくする（2026-11-03）
- 利用者の判断: ノードのラベルの絵文字は、全体概要の凡例に合わせて付けるか付けないかをそろえる（2026-11-03）

## 3. 完了条件

- [[specdojo:cdfd-uc-rulebook]] が、複数の系統（ユースケース）が共通して通るプロセス領域の内部は 1 か所（全体概要、またはその領域の詳細の文書）でだけ描き、ほかの詳細の文書ではその領域を 1 つのノードとして置き、受け渡しの線だけを描くと定めている。この決まりは、特定のプロダクトの区分名（実行サイクルなど）を使わずに書く
- rulebook が、例外時の戻りを省略せず、1 つの図の線が多い場合は戻り先や段ごとに図を分けると定めている。分ける目安（1 つの図の線の数など）を executor が決め、理由を個票の対応結果に記録する
- rulebook が、ノードのラベルの絵文字を全体概要の凡例に合わせて、付けるか付けないかを文書の中と系統の間でそろえると定めている
- [[specdojo:cdfd-uc-recipe]] の手順と問いが、上の 3 つに合っている
- [[specdojo:cdfd-uc-sample]] と [[specdojo:cdfd-uc-template]] が上の 3 つに反していない。sample の業務の中身は変えない
- 4 文書の status は draft のまま変えない。全体概要の Kata、[[specdojo:cdfd-d2-rulebook]]、全体概要、詳細の 3 文書は変えない
- 文書ごとの変更点と、矛盾がないことを確かめた結果を、個票の対応結果に表で記録する
- 未決の点は executor が決め、理由を個票の対応結果に記録する
- `npm run lint:md`・`npm run lint:d2` と親の検証が通る

## 4. 作業内容

| No  | 作業                                       | 担当 | 状態 | メモ |
| --- | ------------------------------------------ | ---- | ---- | ---- |
| 1   | rulebook に 3 つの決まりを足す             | BA   | open | -    |
| 2   | recipe・sample・template を合わせる        | BA   | open | -    |
| 3   | 矛盾がないことを確かめ、対応結果に記録する | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:cdfd-uc-rulebook]]
- [[specdojo:cdfd-uc-recipe]]
- [[specdojo:cdfd-uc-sample]]
- [[specdojo:cdfd-uc-template]]
- [[prj-0001:pjr-gqn3-data-flow-uc-rewrite]]
