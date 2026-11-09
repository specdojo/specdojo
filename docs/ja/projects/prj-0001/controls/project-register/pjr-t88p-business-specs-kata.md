---
specdojo:
  id: prj-0001:pjr-t88p-business-specs-kata
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: business-specs-kata
  domains:
    - data-model
    - business-model
    - system-functions
    - external-interface-specs
  item_status: open
  priority: medium
  registered_at: "2026-11-09T22:16:28Z"
  derived_from:
    - PJR-2GD6
---

# PJR-T88P 業務仕様の型 7 種類を標準の章立てに合わせ、中身を厚くする

## 1. 概要

代表づくりで使った型（sf・cdt・ccd・bdd・ifx-cmd・bes・br）を、rulebook-authoring-standard の章立てに合わせ、記述ガイドの判断の基準と良い例・悪い例、clis 程度の厚さの sample を備えた形にし、人が確定する。schedule で流す

## 2. 入力

- 2026-11-10、代表の確認の中で、clis 以外の型は章立てが標準に届かず、中身も薄いと分かった（indie の指摘）。bes・br は作り直し、sf・cdt・ccd・bdd・ifx-cmd は手入れとする（indie が承認）。
- executor は sol-executor、review は sol-review-executor。使用量の上限のときは argon-executor（review は agy-opus-review-executor）に替える（indie が決定）。
- 型の確定の後、business-specs-reps の磨き込みから先を流し直す。代表の確定（人）は型の確定まで先送りにする。

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
