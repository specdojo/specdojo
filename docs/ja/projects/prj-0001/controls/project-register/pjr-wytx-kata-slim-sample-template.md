---
specdojo:
  id: prj-0001:pjr-wytx-kata-slim-sample-template
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: kata-slim-3
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-17T23:20:25Z"
  due_on: "2026-11-30"
  depends_on:
    - PJR-DJZD
---

# PJR-WYTX 全ての sample と template から文書の運用の記述と言い直しを外し、簡潔にする

## 1. 概要

PJR-DJZD で直した rulebook に合わせ、残りの sample と全ての template を kata-slim と同じ一覧で簡潔にする

## 2. 入力

- 利用者の要望（2026-11-18）: rulebook と recipe の見直しの後、全ての sample と template も見直す epic を起票して schedule で実行したい
- 利用者の決定（2026-11-18、orchestrator の推奨の案）: PJR-DJZD の後に流す。template は手本がないため、先に prj-charter の template で試行して一覧を作ってから schedule に入れる。対象の型の線引きは PJR-DJZD と同じ。schedule の track は kata-slim-3

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
