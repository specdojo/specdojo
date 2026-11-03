---
specdojo:
  id: prj-0001:pjr-gqn3-data-flow-uc-rewrite
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: data-flow-uc-rewrite
  item_status: done
  priority: medium
  owner: BA
  registered_at: "2026-11-03T03:46:02Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-03T12:52:17Z"
  conclusion: cdfd-uc-register・cdfd-uc-schedule・cdfd-uc-routine を、直したユースケース別 CDFD の Kata に合わせて 2 段（書き直しと磨き込み）で書き直した。目的を系統の目的にし、実行サイクルを 1 ノードにし、例外時の戻りを省かず図を分け、全図の線を 15 本以下にした
  derived_from:
    - PJR-GEZN
  depends_on:
    - PJR-PRYZ
---

# PJR-GQN3 系統別の詳細 CDFD 3 文書を、直した Kata に合わせて書き直す

## 1. 概要

cdfd-uc-register・cdfd-uc-schedule・cdfd-uc-routine を、PJR-PRYZ で直したユースケース別 CDFD の Kata に合わせて書き直す。track data-flow-uc-rewrite の schedule で 3 文書を並べて進める

## 2. 入力

- 利用者は詳細の 3 文書を読み、目的が読み手向け、deprecated の文書へのリンク、長い起点イベント、わかりにくい「引き渡し」「例外時の戻り先」の章を指摘した。Kata を PJR-PRYZ で直してから、詳細の 3 文書を epic と schedule で書き直すと判断した（2026-11-03）
- 利用者の判断: 「引き渡し」「例外時の戻り先」の章はなくし、図で表す。詳細の図から Orchestrator を外す（2026-11-03）
- 利用者は、3 文書を schedule で並列に実行することを求めた（2026-11-03）

## 3. 範囲（track と domain）

track `data-flow-uc-rewrite` は、domain data-flow のうち系統別の詳細 3 文書（cdfd-uc-register・cdfd-uc-schedule・cdfd-uc-routine）の書き直しを担う。全体概要（cdfd-overview）、Kata、deprecated の旧文書は対象外とする。

## 4. 完了の判断の基準

- track の 3 タスク（`T-DATA-FLOW-UC-REWRITE-cdfd-uc-register-010`・`-cdfd-uc-schedule-010`・`-cdfd-uc-routine-010`）が done になっている
- 3 文書が PJR-PRYZ で直した Kata（[[specdojo:cdfd-uc-rulebook]]）と [[prj-0001:cdfd-overview]] に合っていることを、利用者が VitePress で確かめている

## 5. 子項目

子 todo は `register add --type todo --from <epic-id>` で起票する。現在の一覧と状態は `register build` が生成する epic 別ビューで確認する。

## 6. 対応結果

_TODO_: 完了を判断した根拠と残課題を記載する。未完了の場合は `-` とする。

## 7. 関連ドキュメント

- [[prj-0001:sch-strategy-data-flow-uc-rewrite]]
- [[prj-0001:cdfd-uc-register]]
- [[prj-0001:cdfd-uc-schedule]]
- [[prj-0001:cdfd-uc-routine]]
