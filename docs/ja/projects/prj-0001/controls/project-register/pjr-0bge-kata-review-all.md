---
specdojo:
  id: prj-0001:pjr-0bge-kata-review-all
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: kata-review-all
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-24T13:31:44Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-F4TG
---

# PJR-0BGE kata の sample の全件を 5 段のレビューで直す

## 1. 概要

PJR-F4TG で 3 つの型（prj-overview・opr・stsd の sample）に目合わせした 5 段のレビュー（R1 目的の過不足・R2 構成・R3 読みやすさ・R4 正しさ・R5 整合）を、非推奨でないすべての sample に広げる。利用者は目合わせの 3 文書の段ごとの差分をすべて採用した（2026-11-24）。本質的な直しは利用者が 1 文書ずつ見て指示するため、この epic の範囲に入れない。

## 2. 入力

- 利用者は目合わせの 3 文書の段ごとの差分をすべて採用した（2026-11-24）
- 本質的な直しは利用者が 1 文書ずつ見て指示するため、この epic に入れない（利用者、2026-11-24）
- v0.10.0 のリリースの後でよい。段取りを進め、実行は 2026-11-24 の晩から行う（利用者、2026-11-24）
- 担当は BA、期限は 2026-11-30（利用者、2026-11-24）

## 3. 範囲（track と domain）

- track: `kata-review-all`（子の todo で strategy と track を作る）。
- 対象: `docs/ja/specdojo/samples/` の非推奨でない sample 106 件のうち、目合わせを済ませた 3 件を除く 103 件。
- 段の正本: [[specdojo:kata-guide|実践の型活用ガイド]] の `kata を agent でレビューする`。

## 4. 完了の判断の基準

- 子の todo（catalog への追加・報告の形・strategy と track）がすべて done である。
- track `kata-review-all` の全タスクが done で、利用者が型ごとの差分を確かめて採否を決めた。
- 戻すと決めた差分が戻され、相手側の文書の直し方の案（R5 など）が起票されているか、起票しない理由が記録されている。

## 5. 子項目

子 todo は `register add --type todo --from <epic-id>` で起票する。現在の一覧と状態は `register build` が生成する epic 別ビューで確認する。

## 6. 対応結果

_TODO_: 完了を判断した根拠と残課題を記載する。未完了の場合は `-` とする。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を文書 ID で記載する。
