---
specdojo:
  id: prj-0001:pjr-6qtk-cdfd-overview-kata-align
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
  registered_at: "2026-11-03T01:34:40Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-GEZN
  commit_type: docs
  commit_scope: rulebooks
---

# PJR-6QTK 全体概要の Kata を書き直した全体概要に合わせる

## 1. 概要

cdfd-overview の rulebook・recipe・sample・template を、目的を全体像とし、区分を代表ノードにした 3 つの図の書き方に合わせる

## 2. 入力

- PJR-PZ6H・05QS・5Q7R・KV58 で全体概要（cdfd-overview）を 7 区分を代表ノードとする 3 つの図に書き直した。Kata の 4 文書（status は ready）はその書き方を定めていない（2026-11-03）
- 利用者の判断: 目的は全体像を示すことにし、PO の承認や引き継ぎなどの作業や読み手の役割は書かない。図の題は業務の言葉にする（2026-11-03）
- 利用者の判断: 区分から区分への実行要求の線（対応要求・実行要求など）は、名詞のラベルを付けて認める。完成判定の「対象範囲と領域分割を PO が承認した記録を特定できる」は ready に上げる手続きとして残す（2026-11-03）
- Orchestrator はデータの図に置かず、指示の図を別に設ける。Orchestrator からは直接読み書きするデータストアにだけ線を引き、CLI 経由のものは区分からの線で表す（2026-11-03）
- cdfd-d2-rulebook は直さない。sample の図は今の方式（データストアの区分）の例として残す（2026-11-03）

## 3. 完了条件

- [[specdojo:cdfd-overview-rulebook]] の目的の書き方（記述ガイドと完成判定）が、全体像として何を示すかを 1〜2 文で書くことを求め、PO の承認や引き継ぎなどの作業や読み手の役割を求めていない。完成判定の「対象範囲と領域分割を PO が承認した記録を特定できる」は残す
- rulebook の「系統の関係を描く方式」の定義（用語・全体方針・図の書き方）が、「共通・基盤」の語を使わず、プロセス領域の区分を代表ノードとし、区分とデータの関係を描く方式になっている
- rulebook の図の書き方に、系統の関係を描く方式について次を定めている
  - データの種類で分けた図の間で区分の位置をそろえる。線のない区分はその図に置かず、各区分はどれかの図に必ず出る
  - 調整役（Orchestrator）はデータの図に置かず、指示の図を別に設けてよい。調整役からは直接読み書きするデータストアにだけ線を引き、CLI 経由のものはデータの図の区分からの線で表す
  - 区分から区分への実行要求は、名詞のラベルを付けて線にしてよい
  - 図の題は業務の言葉で付け、説明は図から読み取れることを 1 文で書く。作図の約束は凡例に任せる
- rulebook のプロセス領域の表で、「PDCA」を任意の列として認めている
- [[specdojo:cdfd-overview-recipe]] の目的の問いが rulebook に合っており、図の分け方の問いに系統の関係を描く方式（区分の位置、線のない区分、調整役の指示の図）を足している。「グループ間の要求をトランザクションの図にだけ描く」との矛盾がない
- [[specdojo:cdfd-overview-template]] の目的の雛形が、全体像を示す 1〜2 文の形になっている
- [[specdojo:cdfd-overview-sample]] の目的が全体像の書き方になっている。図と、図の方式（データストアの区分）は変えない
- 4 文書の status は ready のまま変えない。[[specdojo:cdfd-d2-rulebook]]、全体概要と詳細の CDFD の文書は変えない
- 4 文書の間と、[[prj-0001:cdfd-overview]] の書き方との間で矛盾がないことを確かめ、文書ごとの変更点と確かめた結果を個票の対応結果に表で記録する
- 未決の点は executor が決め、理由を個票の対応結果に記録する
- `npm run lint:md` と親の検証が通る

## 4. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ |
| --- | ----------------------------------------------------- | ---- | ---- | ---- |
| 1   | rulebook の目的・方式の定義・図の書き方・表の列を直す | BA   | open | -    |
| 2   | recipe・template・sample を rulebook に合わせる       | BA   | open | -    |
| 3   | 矛盾がないことを確かめ、対応結果に記録する            | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:cdfd-overview]]
- [[specdojo:cdfd-overview-rulebook]]
- [[specdojo:cdfd-overview-recipe]]
- [[specdojo:cdfd-overview-sample]]
- [[specdojo:cdfd-overview-template]]
