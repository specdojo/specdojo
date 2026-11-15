---
specdojo:
  id: prj-0001:pjr-aww3-cdfd-sample-d2
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
  registered_at: "2026-11-15T14:35:28Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-15T23:07:39Z"
  conclusion: cdfd-sample の 2 図を D2 に書き直し、型の再 grade で pass（96 点）
  derived_from:
    - PJR-PMK6
  commit_type: docs
  commit_scope: kata
  approach: sample-maintenance
  targets:
    - specdojo:cdfd-sample
---

# PJR-AWW3 cdfd-sample の概念データフロー図を D2 に書き直す

## 1. 概要

Mermaid のまま残る 5.1・5.2 の 2 図を、全体概要で採用した D2 へ書き直す

## 2. 入力

- cdfd-sample は cdfd-overview-sample（`based_on`）を詳細化する。全体概要は「凡例（本プロダクト共通）」で D2 を採用し、cdfd-rulebook は全体概要で選んだ記法に従うと定めるが、cdfd-sample の図は Mermaid のまま残っている（2026-11-15）
- 5.1 仕入計画と 5.2 入荷検品の 2 図を [[specdojo:cdfd-d2-rulebook]] に沿って D2 にする（direction: down、データストアの色は G 案）。ノード、エッジ、情報の流れと商品の流れの区別、プロセス ID は変えない。図の下の凡例の説明も D2 の表記に合わせる
- cdfd-overview-sample・cdfd-uc-sample の D2 の書き方にそろえる。本文の表と章構成は変えない
- 0.8.0（PJR-PMK6）で型を極力最新にする方針に含める（2026-11-15、利用者が承認）

## 3. 完了条件

- `cdfd-sample` の 5.1・5.2 の図が D2 で、[[specdojo:cdfd-d2-rulebook]] に従っている（`direction: down`、データストアの色は G 案）。
- ノード、エッジ、情報の流れと商品の流れの区別、プロセス ID が書き直す前と変わっていない。
- 図の下の凡例の説明が D2 の表記に合い、本文の表と章構成は変わっていない。
- `npm run lint:md`・`npm run lint:d2` と親の検証が通り、型の grade で確かめる。

## 4. 作業内容

| No  | 作業                                         | 担当 | 状態 | メモ                              |
| --- | -------------------------------------------- | ---- | ---- | --------------------------------- |
| 1   | cdfd-sample の 5.1・5.2 の図を D2 に書き直す | BA   | done | executor が実施（対応結果を参照） |

## 5. 対応結果

実施内容（2026-11-16、BA / executor）:

- cdfd-sample の 5.1 仕入計画・5.2 入荷検品の 2 図を Mermaid から D2（`direction: down`、全体概要の classes・G 案の色）に書き直した。ノード・エッジ・ラベル・プロセス ID は変えていない。
- 個票の入力は本文の表を変えないとしていたが、plan に展開された grade の finding F001〜F003 を解消するため、表の文言を最小限変えた（executor の判断。詳細は run の result）。

- 申し送り（executor）: 5.1・5.2 の D2 化に加え、plan に展開された grade の finding（F001〜F003）を解消するため、入力の「本文の表は変えない」の例外として表の文言を最小限変更した（`P-01-01` の業務目的、3.1 の導入文、4.1 商品台帳の利用、8.1 `E-02-02` の検出条件・停止範囲・扱い・再開条件）。表の列と章構成は変えていない。この例外を認めるかは利用者が確認する。

再 grade の結果（2026-11-16、orchestrator が実行）: cdfd-sample は pass 96 点。結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/` の `specdojo.cdfd-sample.yaml`。

## 6. 関連ドキュメント

- [[specdojo:cdfd-d2-rulebook]]
- [[prj-0001:pjr-pmk6-release-v0-8-0]]
