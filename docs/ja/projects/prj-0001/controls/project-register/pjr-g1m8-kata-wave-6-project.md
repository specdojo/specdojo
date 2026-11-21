---
specdojo:
  id: prj-0001:pjr-g1m8-kata-wave-6-project
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: kata-wave-6-project
  domains:
    - kata
  item_status: open
  priority: medium
  registered_at: "2026-11-21T03:04:51Z"
  derived_from:
    - PJR-6998
---

# PJR-G1M8 型の整備 第 6 波（プロジェクトの型の残り）

## 1. 概要

プロジェクトの型の残り 8 種類（prj-charter・prj-issues-and-approach・prj-overview・prj-scope・prj-stakeholder-register・prj-success-criteria-and-acceptance-criteria・pm-communication-plan・pm-members）を、sample を代表にして整える

## 2. 入力

- 対象: prj-charter・prj-issues-and-approach・prj-overview・prj-scope・prj-stakeholder-register・prj-success-criteria-and-acceptance-criteria・pm-communication-plan・pm-members の 8 種類
- PJR-6998 の決定（2026-11-21、indie）: kata ドメイン（dct-kata.yaml）に sample を成果物として載せ、sample を代表にして型を整える
- 2026-11-21 の洗い直し（tmp の一覧ではなく個票に要点を残す）: これまでの波で rulebook と sample の中身を整えていない 74 種類のうち、第 3〜5 波と PJR-CPA8 に入らない残りをこの epic を含む第 6 波の 3 件に割り振った。rulebook はどれも ready で grade は pass だが、PJR-960C の対象外で中身を整えていない。sample は prj-charter・prj-stakeholder-register・prj-success-criteria-and-acceptance-criteria が needs-work（76〜85）。pm-members は sample がない
- 段の組み方: rulebook を簡潔に → sample を厚く → 簡潔さの確認（condense） → review → 人の確定（利用者の承認、2026-11-21）。対象と順番は、2026-11-21 から opus で流している grade（run id regrade-kata-2026-11-21）の結果で見直す

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
