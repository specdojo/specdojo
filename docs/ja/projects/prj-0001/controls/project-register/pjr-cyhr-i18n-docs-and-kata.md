---
specdojo:
  id: prj-0001:pjr-cyhr-i18n-docs-and-kata
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: i18n-docs
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-15T13:25:05Z"
  derived_from:
    - PJR-BRCG
  depends_on:
    - PJR-DD33
---

# PJR-CYHR SpecDojo の文書と型を英語化する（英語版 第 2 段）

## 1. 概要

入り口の文書から順に英語化し、型は設計までの型が確定してから訳す

## 2. 入力

- PJR-BRCG の決定（indie が 2026-11-15）: 文書も型も日本語を正本にし、英語は rtn-translate-updated-docs で更新された文書を訳して追う。訳には元の文書の版（hash）を記録し、古くなった訳を見つけられるようにする。訳語の正本は用語集の englishName
- 訳す順番: 入り口（README・LP、Quick Start、ユースケース別ガイド、コマンドリファレンス）を先にし、型（rulebook・recipe・sample・template）は後
- 始める条件: 設計までの型（kata-wave-1・2 と、その差し戻しの手直し）が確定した後

## 3. 範囲（track と domain）

track `i18n-docs`。docs/en に、入り口の文書（README・LP、Quick Start、ユースケース別ガイド、コマンドリファレンス）と、設計までの型（rulebook・recipe・sample・template）の英語版を置く。正本は日本語のまま。CLI の多言語化は対象外（PJR-C0HH）。

## 4. 完了の判断の基準

- 入り口の文書と、設計までの型の英語版が docs/en にあり、文書サイトで読める。
- 訳した文書に元の文書の版（hash）が記録され、古くなった訳を見つけられる。
- `rtn-translate-updated-docs` で、更新された文書の訳を追える。
- 訳語が用語集の `englishName` とそろっている。

## 5. 子項目

子 todo は `register add --type todo --from <epic-id>` で起票する。現在の一覧と状態は `register build` が生成する epic 別ビューで確認する。

## 6. 対応結果

_TODO_: 完了を判断した根拠と残課題を記載する。未完了の場合は `-` とする。

## 7. 関連ドキュメント

- [[prj-0001:pjr-brcg-english-edition-approach]]
