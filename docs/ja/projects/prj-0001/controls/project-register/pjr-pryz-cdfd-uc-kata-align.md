---
specdojo:
  id: prj-0001:pjr-pryz-cdfd-uc-kata-align
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-03T03:39:16Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-GEZN
  commit_type: docs
  commit_scope: rulebooks
---

# PJR-PRYZ ユースケース別 CDFD の Kata を全体概要の書き方に合わせる

## 1. 概要

cdfd-uc の rulebook・recipe・sample・template を、目的は系統の目的、引き渡しと例外の章をなくして図で表す、Orchestrator をデータの図から外す、D2 の縦の流れの書き方に合わせる

## 2. 入力

- 詳細の 3 文書（cdfd-uc-register・schedule・routine）は cdfd-uc の Kata に従って書かれている。利用者は、詳細の文書の前に Kata を直すと判断した（2026-11-03）
- 利用者の指摘: 目的が BA や QE などの読み手向けになっている。適用範囲に deprecated の文書へのリンクがある。起点イベントの六角形が左右に長い。「引き渡し」「例外時の戻り先」の章がわかりにくく、必要なら図にすべき（2026-11-03）
- 利用者の判断: 「引き渡し」「例外時の戻り先」の章はなくし、渡すものは図の線のラベルで表し、条件のイベント（H-01 など）も図から外す。戻りの流れが業務として大事な系統だけ、「例外時の戻り」の図を任意で足せる（2026-11-03）
- 利用者の判断: 詳細の図から Orchestrator を外し、全体概要の「Orchestrator による PDCA の調整」の図に任せる（2026-11-03）
- Kata の 4 文書の status は draft。詳細の 3 文書は、この項目の後に epic と schedule で書き直す（2026-11-03）

## 3. 完了条件

- [[specdojo:cdfd-uc-rulebook]] と [[specdojo:cdfd-uc-recipe]] の目的の書き方が、その系統またはユースケースが何のためにあるか（例: 登録簿の起票から完了まで）を 1〜2 文で書くことを求め、承認者や読み手の役割を求めていない
- rulebook が「引き渡し」と「例外時の戻り先」の章を求めていない。渡す情報は図の線のラベルで表し、引き渡し条件のイベント（`H-<nn>`）を図に置かない。戻りの流れが業務として大事な場合だけ、「例外時の戻り」の図を任意で設けてよいと定めている。引き渡し ID・戻す条件・再開条件に関わる規定（用語、ファイル命名・ID 規則、完成判定、禁止事項）も合わせて整理している
- rulebook が、詳細の図に Orchestrator（調整役）を置かず、調整は全体概要の指示の図に任せると定めている
- rulebook が、`based_on` は全体概要などの有効な文書とし、status が deprecated の文書を `based_on` と本文で参照しないと定めている
- rulebook が、イベントは 1 つのノードに 1 つの出来事とし、短い文にする（長い場合は改行する）と定めている。起点イベントの文言は全体概要の表と同じにする規定と矛盾しない
- rulebook のプロセス領域の表の列が、全体概要の区分と、任意の「PDCA」の列にそろっている。PDCA の値を「プロセスグループ」の列に入れない
- rulebook が、図の題を業務の言葉で付け、説明を図から読み取れることの 1 文にすると定めている
- rulebook の「通常の横断ユースケース」と「系統の関係を描く方式の詳細」の書き分けを 1 つの節にまとめ、ほかの節で繰り返していない
- recipe の手順と問いが rulebook に合っている。図は上から下（縦）に並べる
- [[specdojo:cdfd-uc-sample]] と [[specdojo:cdfd-uc-template]] が rulebook に合っている。図は D2（`direction: down`）で、データストアの色は [[specdojo:cdfd-d2-rulebook]] の G 案に合わせ、凡例は全体概要の凡例を参照する。sample の業務の中身（駄菓子屋きぬやの欠品から補充まで）は変えない
- [[specdojo:cdfd-d2-rulebook]] の、ユースケース別 CDFD の必須要素（開始・引き渡し・終了のイベント）の記述を、上の規則に合わせている。それ以外の D2 の規則は変えない
- 4 文書の status は draft のまま変えない。全体概要の Kata、全体概要、詳細の 3 文書は変えない
- 文書ごとの変更点と、4 文書の間および全体概要の Kata との矛盾がないことを確かめた結果を、個票の対応結果に表で記録する
- sample の図を `d2 --layout elk` で SVG に出力し、並びと大きさを個票の対応結果に記録する
- 未決の点は executor が決め、理由を個票の対応結果に記録する
- `npm run lint:md`・`npm run lint:d2` と親の検証が通る

## 4. 作業内容

| No  | 作業                                            | 担当 | 状態 | メモ |
| --- | ----------------------------------------------- | ---- | ---- | ---- |
| 1   | rulebook を直す                                 | BA   | open | -    |
| 2   | recipe・template・sample を rulebook に合わせる | BA   | open | -    |
| 3   | D2 記法ルールのユースケース別の記述を合わせる   | BA   | open | -    |
| 4   | 矛盾がないことを確かめ、対応結果に記録する      | BA   | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:cdfd-uc-rulebook]]
- [[specdojo:cdfd-uc-recipe]]
- [[specdojo:cdfd-uc-sample]]
- [[specdojo:cdfd-uc-template]]
- [[specdojo:cdfd-d2-rulebook]]
- [[specdojo:cdfd-overview-rulebook]]
- [[prj-0001:cdfd-overview]]
