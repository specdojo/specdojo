---
specdojo:
  id: prj-0001:pjr-x05n-review-kata-grade-not-run
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T11:31:23Z"
  derived_from:
    - PJR-E4R5
  commit_type: fix
  commit_scope: review
---

# PJR-X05N 型を整備する schedule の review で、型一式の grade が流れるようにする（E4R5 の効き目の確認）

## 1. 概要

E4R5 の自動の grade が kata-wave-2 で流れなかった理由を調べ、直す

## 2. 入力

- 2026-11-15、kata-wave-2 の 090（review）が 4 件とも完了したのに、型（bac・bds・sld・ifx-file の rulebook・sample）の grade は 2026-10 のままで、自動の grade が流れていなかった。PJR-E4R5 で、型を整備する schedule の review で型一式を自動 grade するようにしたはず

## 3. 完了条件

- kata-wave-2（`sch-strategy-kata-wave-2`、intent は bootstrap-kata-set）の 090 で、型一式の自動の grade が流れなかった理由を調べ、対応結果に書いている（intent・approach・phase の条件の食い違い、grade の失敗の握りつぶしなど）。
- 型を整備する schedule（bootstrap-kata-set・improve-kata）の review の段で、型一式（rulebook・sample、宣言があれば recipe・template）を grade し、型の grade が pass になるまで完了を保つ。PJR-E4R5 の完了条件どおりに動く。
- bootstrap-kata-set の schedule の review で型の grade が流れることを、回帰テストで確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                     | 担当 | 状態 | メモ |
| --- | ------------------------ | ---- | ---- | ---- |
| 1   | 流れなかった理由を調べる | DEV  | open | -    |
| 2   | 型の自動の grade を直す  | DEV  | open | -    |
| 3   | 回帰テストを足す         | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
