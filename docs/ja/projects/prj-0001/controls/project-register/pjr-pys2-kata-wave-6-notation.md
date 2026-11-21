---
specdojo:
  id: prj-0001:pjr-pys2-kata-wave-6-notation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: kata-wave-6-notation
  domains:
    - kata
  item_status: open
  priority: medium
  registered_at: "2026-11-21T03:03:26Z"
  derived_from:
    - PJR-6998
---

# PJR-PYS2 型の整備 第 6 波（記法の型）

## 1. 概要

記法の型 6 種類（cnd-mermaid・cpd-mermaid・cxd-mermaid・cdfd-mermaid・cdfd-d2・stsd-mermaid）を、rulebook を簡潔にし sample と合わせて整える

## 2. 入力

- 対象: cnd-mermaid・cpd-mermaid・cxd-mermaid・cdfd-mermaid・cdfd-d2・stsd-mermaid の 6 種類
- PJR-6998 の決定（2026-11-21、indie）: kata ドメイン（dct-kata.yaml）に sample を成果物として載せ、sample を代表にして型を整える
- 2026-11-21 の洗い直し（tmp の一覧ではなく個票に要点を残す）: これまでの波で rulebook と sample の中身を整えていない 74 種類のうち、第 3〜5 波と PJR-CPA8 に入らない残りをこの epic を含む第 6 波の 3 件に割り振った。rulebook は 129〜293 行で、cnd-mermaid・cpd-mermaid・cxd-mermaid・cdfd-mermaid の grade は needs-work（68〜77）。cdfd-d2・cdfd-mermaid は sample が not-needed のため rulebook だけを対象にし、kata ドメインに載せる成果物は持たない（扱いは最初の子の todo で決める）
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
