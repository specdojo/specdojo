---
specdojo:
  id: prj-0001:pjr-mnm5-kata-slim
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: kata-slim
  item_status: open
  priority: high
  owner: BA
  registered_at: "2026-11-17T14:12:51Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0T83
    - PJR-8S4T
  commit_type: docs
  commit_scope: kata
---

# PJR-MNM5 業務仕様までの型から文書の運用の記述を外し、簡潔にする

## 1. 概要

sld の試行（PJR-8S4T）の一覧で、プロジェクト定義・プロジェクト管理・業務仕様の 18 種類の型の rulebook と sample から運用の記述と同じ判断の言い直しを外す。schedule の track kata-slim で進める

## 2. 入力

- 利用者が 2026-11-17 に、業務仕様までの sample の記述の精度を今晩中に上げたいとして、todo ではなく schedule で進めることを選んだ。担当は BA、期限は 2026-11-30
- PJR-8S4T の試行で、sld-sample は空白を除いた文字数で約 60%、sld-rulebook は約 71% になり、結論は変えなかった。広げるときの「外す記述・残す記述・参照の形」の一覧は 8S4T の対応結果にある
- uis はカタログに代表の成果物がないため、この track に含めていない。代表にする画面を利用者が決めた後に足す

## 3. 範囲（track と domain）

_TODO_: Frontmatter の `track` が担う範囲と対象 domain、対象外の境界を記載する。

## 4. 完了の判断の基準

- _TODO_: 子項目と schedule を確認して、人が完了を判断できる基準を記載する。

## 5. 子項目

子 todo は `register add --type todo --from <epic-id>` で起票する。現在の一覧と状態は `register build` が生成する epic 別ビューで確認する。

## 6. 対応結果

未完了（close は利用者の判断）。2026-11-18 時点の経過を記録する。

- schedule `kata-slim` の 36 段（rulebook 18・sample 18）がすべて done になった（2026-11-17 23:39〜2026-11-18 06:05、3 件ずつ並行）。途中の停止の原因（rulebook の段が recipe と template も変えた、参考の kata ディレクトリが変更範囲と読まれた）は、戦略の指示と [[prj-0001:pjr-9jn6-change-scope-protected-list-overlap|PJR-9JN6]] の 2 回目で直した。
- 子の [[prj-0001:pjr-3mts-uis-open-document-by-id|PJR-3MTS]] で uis の型と代表の画面仕様を書いた。
- 型の grade（run-id `grade-kata-slim-20261118`、`sol-review-executor`）: 19 の型の rulebook と sample と uis の 40 件のうち、pass が 35 件、needs-work が 5 件。

| 文書                                                | 判定       | 点数 | major |
| --------------------------------------------------- | ---------- | ---- | ----- |
| bes-sample                                          | needs-work | 83   | 4     |
| prj-charter-sample                                  | needs-work | 85   | 4     |
| prj-success-criteria-and-acceptance-criteria-sample | needs-work | 85   | 3     |
| sld-rulebook                                        | needs-work | 96   | 1     |
| br-rulebook                                         | needs-work | 96   | 1     |

- 利用者の方針（2026-11-17）により、grade の指摘は記録だけにして直さない。直すかは利用者が決める。指摘の本文は各文書の grade の結果（`execution/grade/results/`）にある。
- 残りの型は [[prj-0001:pjr-djzd-kata-slim-rulebook-recipe|PJR-DJZD]] と [[prj-0001:pjr-wytx-kata-slim-sample-template|PJR-WYTX]] で広げる。

## 7. 関連ドキュメント

- [[prj-0001:pjr-8s4t-sld-kata-slim-pilot]]
- [[prj-0001:sch-strategy-kata-slim]]
