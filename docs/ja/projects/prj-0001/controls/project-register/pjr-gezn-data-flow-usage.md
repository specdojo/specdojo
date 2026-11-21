---
specdojo:
  id: prj-0001:pjr-gezn-data-flow-usage
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: data-flow-usage
  domains:
    - data-flow
  item_status: done
  priority: medium
  owner: BA
  registered_at: "2026-11-01T10:23:16Z"
  start_on: "2026-11-01"
  due_on: "2026-11-30"
  completed_at: "2026-11-03T12:52:43Z"
  conclusion: 概念データフローを、全体概要（7 区分の 3 つの図）と系統別の詳細 3 文書（register・schedule・routine）に再編し、旧 7 文書を非推奨にした。Kata（全体概要・ユースケース別）も合わせて見直した
  derived_from:
    - PJR-SJQC
---

# PJR-GEZN 概念データフローを overview と系統別の詳細 3 文書に再編する

## 1. 概要

PJR-SJQC の決定に沿って、cdfd-overview を共通・基盤と 3 系統の関係の図に改訂し、register・schedule・routine の詳細 3 文書を作り、旧 7 文書を非推奨にする。track data-flow-usage の schedule で進める

## 2. 入力

- PJR-SJQC で、作業を track data-flow-usage の epic で管理し、schedule に展開して実行すると決めた（2026-11-01）
- 準備として PJR-VRVP（rulebook）と PJR-5K8B（timeline・catalog・schedule 戦略）が完了し、sch-track-data-flow-usage.yaml に 4 件のタスクがある

## 3. 範囲（track と domain）

track `data-flow-usage` は、domain `data-flow` の全体概要（cdfd-overview）と系統別の詳細 3 文書（cdfd-uc-register・cdfd-uc-schedule・cdfd-uc-routine）への再編、および旧 7 文書の非推奨化と関連 Kata の見直しを担う。ほかの domain は対象外とする。

## 4. 完了の判断の基準

- _TODO_: 子項目と schedule を確認して、人が完了を判断できる基準を記載する。

## 5. 子項目

子 todo は `register add --type todo --from <epic-id>` で起票する。現在の一覧と状態は `register build` が生成する epic 別ビューで確認する。

## 6. 対応結果

_TODO_: 完了を判断した根拠と残課題を記載する。未完了の場合は `-` とする。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を文書 ID で記載する。
