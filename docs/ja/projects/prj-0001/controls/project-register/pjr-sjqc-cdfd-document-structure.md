---
specdojo:
  id: prj-0001:pjr-sjqc-cdfd-document-structure
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: decided
  priority: medium
  owner: PO
  registered_at: "2026-11-01T09:52:37Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-01T09:53:41Z"
  conclusion: 案 E を採択する。overview は共通・基盤と 3 系統の関係を描き、register・schedule・routine は系統別の詳細 3 文書で描く。図は縦向き、入口のイベントを描き、配色は G 案とする
  derived_from:
    - PJR-T1D1
    - PJR-RVTB
---

# PJR-SJQC 概念データフローの文書体系を overview と系統別の詳細 3 文書にする

## 1. 背景

CDFD を、共通・基盤と register・schedule・routine の関係を描く cdfd-overview と、系統ごとの詳細 3 文書（ユースケース別 CDFD）に分ける。プロセスグループ別 6 文書は非推奨にする。図は縦向き、入口のイベントを描き、配色は G 案とする

## 2. 入力

- 全体概要を使い方の流れ（register 系・schedule 系・routine 系・共通）で分けた（PJR-RXVC）後、詳細の CDFD 8 文書はプロセスグループ別のままで軸が合っていない（2026-11-01）
- 利用者は、cdfd-overview で共通・基盤と register・schedule・routine の関係を描き、register と schedule が epic と track でつながる全体関係も overview で示し、3 系統は詳細の文書で描く分け方を提案した（2026-11-01）
- PJR-RVTB の試行で、縦向き（direction: down）と系統ごとの入口のイベントを cdfd-overview で確かめた。配色は、トランザクションデータを中間の緑（#c8e6c9 / #2e7d32）、マスタ・構成データを薄い緑（#e8f5e9 / #43a047）、物理保管をトランザクションデータと同じ色にした G 案を利用者が確かめた（2026-11-01）

## 3. 検討した選択肢

| 選択肢    | 内容                                                                                                                                              | 利点                                                                                                                                                               | 懸念                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| A         | プロセスグループ別 6 文書とユースケース別 2 文書を残し、要点に絞って D2 に移す（PJR-T1D1）                                                        | rulebook と catalog を変えずに済む                                                                                                                                 | 全体概要と軸が合わず、同じ流れが重なって書かれる               |
| B         | 全体概要と同じ軸の 4 文書（register 系・schedule 系・routine 系・共通）にする                                                                     | 全体概要の図と詳細の文書が対応する                                                                                                                                 | 全体概要の図を細かくするだけになり、全体概要と重なる           |
| D         | 詳細の CDFD を作らず、全体概要と BPS で表す                                                                                                       | 文書が最も少ない                                                                                                                                                   | プロセス領域とデータストアの対応と、起点イベントが図から抜ける |
| E（採択） | overview は共通・基盤と 3 系統の関係（register と schedule を epic と track でつなぐ全体像を含む）を描き、3 系統の流れは系統別の詳細 3 文書で描く | 全体の関係と系統の中の流れで役割が分かれる。詳細はプロセス領域の単位で描くため、領域とデータストアの対応と入口のイベントを示せる。既存の cdfd-uc-rulebook を使える | rulebook の見直しと、プロセスグループ別 6 文書の非推奨化が要る |

## 4. 決定内容

案 E を採択する。

- 文書体系: `cdfd-overview` は、共通・基盤（Onboarding、Kata、稼働構成、非推奨化）と register 系・schedule 系・routine 系の関係を描く。register と schedule が epic と track でつながる全体関係と、routine が Job を通じて register と schedule を動かす関係を含む。プロセス領域の表、データストアの表、凡例は overview に置く。
- 詳細: register 系・schedule 系・routine 系の流れは、ユースケース別 CDFD（`specdojo:cdfd-uc-rulebook`）の形の詳細 3 文書で、プロセス領域の単位で描く。register 系は `cdfd-uc-register` を書き直す。schedule 系は新しい ID `cdfd-uc-schedule` で作り、`cdfd-uc-deliverable` は非推奨にする。routine 系は `cdfd-uc-routine` を新しく作る。
- プロセスグループ別 CDFD 6 文書（`cdfd-onboarding`・`cdfd-plan`・`cdfd-do`・`cdfd-check`・`cdfd-action`・`cdfd-orchestrator`）は非推奨にして保管庫へ移す。
- 図の向き: 凡例を含むすべての図を `direction: down` とし、プロセスは上から Orchestrator・Plan・Do・Check・Action の順（Onboarding は Orchestrator の上）に並べる。
- イベント: 系統ごとの入口の起点イベントを図に描く。routine 系の入口は、定義のきっかけではなく、Orchestrator の「PDCA の各サイクルが到来した」とする。
- 配色: トランザクションデータを中間の緑（`#c8e6c9` / `#2e7d32`）、マスタ・構成データを薄い緑（`#e8f5e9` / `#43a047`）、物理保管をトランザクションデータと同じ色にする。
- 作業は track `data-flow-usage` の epic で管理し、schedule に展開して実行する。

## 5. 採択理由

- 全体の関係（overview）と系統の中の流れ（詳細）で役割が分かれ、同じ流れを二重に書かずに済む。
- 詳細をプロセス領域の単位で描くことで、D 案で失われる領域とデータストアの対応と、入口のイベントを図で示せる。
- 3 系統は LP の Roadmap の分け方とそろい、schedule 系の ID も呼び方にそろえる。
- 縦向きは文書の幅で約 2 倍の大きさで読め、PJR-RVTB の試行で並び順と受け渡しが保てることを確かめた。
- 配色は、流れの主役のトランザクションデータを目立たせ、マスタ・構成データを控えめにするため。

## 6. 承認

| 項目     | 内容                                                              |
| -------- | ----------------------------------------------------------------- |
| 決定者   | indie                                                             |
| 決定日   | 2026-11-01                                                        |
| 承認方式 | commit                                                            |
| 証跡     | 本個票を decided にした commit（2026-11-01 の対話で利用者が承認） |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 7. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | `cdfd-overview`、詳細 CDFD 8 文書、`cdfd-overview-rulebook`・`cdfd-uc-rulebook`・`cdfd-d2-rulebook`、`dct-data-flow.yaml`、timeline と schedule の戦略、BPS の参照                      |
| 必要な対応 | rulebook の見直し、track `data-flow-usage` の timeline・catalog・schedule 戦略の用意、epic の起票、overview と詳細 3 文書の作成、旧 7 文書の非推奨化。PJR-T1D1 は本決定により不要とする |
| 追跡先     | track `data-flow-usage` の epic と子 todo（起票後に追記する）                                                                                                                           |

## 8. 関連ドキュメント

- [[prj-0001:cdfd-overview]]
- [[specdojo:cdfd-overview-rulebook]]
- [[specdojo:cdfd-uc-rulebook]]
- [[specdojo:cdfd-d2-rulebook]]
