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

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
