---
specdojo:
  id: prj-0001:pjr-djzd-kata-slim-rulebook-recipe
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: kata-slim-2
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-17T23:19:13Z"
  due_on: "2026-11-30"
---

# PJR-DJZD 残りの rulebook と recipe から文書の運用の記述を外し、簡潔にする

## 1. 概要

kata-slim で業務仕様までの型が簡潔になったため、残りの rulebook（カタログに代表がある 79 件と記法の 6 件）と recipe 34 件を同じ一覧で簡潔にする

## 2. 入力

- 利用者の要望（2026-11-18）: sample の手直しで記述がだいぶ簡潔になった。他の全ての rulebook と recipe も見直したい。epic を起票して schedule で実行したい
- 利用者の決定（2026-11-18、orchestrator の推奨の案）: カタログに代表がない 21 件のうち、記法の rulebook 6 件（cdfd-mermaid・cdfd-d2・cnd-mermaid・cpd-mermaid・cxd-mermaid・stsd-mermaid）は親の型の段で一緒に直す。非推奨の cld・cstd・tml は対象外。cdr・dct・dss・trc-requirements-to-specs・trc-requirements-to-tests・dmd・cop・otp の 8 件は orchestrator がカタログに代表を足す。ifx-api・ifx-msg・dec は事実がないため代表を作らず子の todo で sample だけを相手に簡潔にする。dec と ntp は扱いを決める decision を起票し、ntp は決まるまで対象外
- 利用者の決定（2026-11-18）: recipe は手本がないため、先に prj-charter の recipe で試行して一覧を作ってから schedule に入れる。schedule の track は kata-slim-2

## 3. 範囲（track と domain）

_TODO_: Frontmatter の `track` が担う範囲と対象 domain、対象外の境界を記載する。

## 4. 完了の判断の基準

- _TODO_: 子項目と schedule を確認して、人が完了を判断できる基準を記載する。

## 5. 子項目

子 todo は `register add --type todo --from <epic-id>` で起票する。現在の一覧と状態は `register build` が生成する epic 別ビューで確認する。

## 6. 対応結果

_TODO_: 完了を判断した根拠と残課題を記載する。未完了の場合は `-` とする。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を文書 ID で記載する。
