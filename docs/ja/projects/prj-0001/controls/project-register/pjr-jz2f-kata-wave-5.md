---
specdojo:
  id: prj-0001:pjr-jz2f-kata-wave-5
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: kata-wave-5
  item_status: open
  priority: medium
  registered_at: "2026-11-16T13:45:55Z"
  depends_on:
    - PJR-HJ3H
---

# PJR-JZ2F 型の整備 第 5 波（運用・移行・影響分析）

## 1. 概要

運用・移行・影響分析の型 11 種類（opd-index・opr・otp-index・cop・mip-index・dmd-index・mtp・ntp・imp-data など）を、代表の文書と一緒に整える

## 2. 入力

- 対象は opd-index・opr・opr-index・otp-index・cop・cop-index・mip-index・dmd-index・mtp・ntp・imp-data の 11 種類。どれも grade は needs-work で、prj-0001 に代表の文書はない
- PJR-APA2（2026-11-13）で、第 4 波は運用・移行・影響分析として予定されていた。利用者が 2026-11-16 に、非機能要件と受け入れ条件の後に進めることを承認した
- SpecDojo は CLI の OSS で、本番の切り替えやデータ移行の実物がない。代表を prj-0001 で作るか、駄菓子屋の文脈で作るかを、この epic の最初に決める
- 2026-11-16 の grade（--target kata）で rulebook 112 種類のうち pass 63・needs-work 47・fail 1。進行中の型の epic（APA2・DD33・T88P・ERR7・960C・2GD6）は人の確定（140）で止まっている

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
