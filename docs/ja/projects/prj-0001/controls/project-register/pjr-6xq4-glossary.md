---
specdojo:
  id: prj-0001:pjr-6xq4-glossary
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: epic
  track: glossary
  domains:
    - glossary
  item_status: open
  priority: medium
  owner: BA
  registered_at: "2026-11-11T15:05:57Z"
---

# PJR-6XQ4 用語集（gl-common）を、実装と文書の用語に合わせて磨き込む

## 1. 概要

用語集の schedule を作り、朝の exec cycle で用語の洗い出し・定義・review を流す

## 2. 入力

- indie の要望（2026-11-12）: 用語集を作る epic を作り、schedule を朝に実行したい
- 既存の gl-common.yaml（137 行）と specdojo:gl-rulebook（draft）がある

## 3. 範囲（track と domain）

- track `glossary`、domain `glossary`。対象は用語集（共通）`gl-common` の 1 件。
- schedule は 実装の調査と草案の反映（retrofit）→ 磨き込み → 冗長さの整理 → agent の review → 人の確定 の 5 段。intent は `reflect-implementation`（実装と文書の用語に合わせる。orchestrator の選択、indie に報告）。
- 用語の根拠は、カタログの `evidence_refs`（CLI の入口と、登録簿・実行・schedule の schema）。
- 対象外: 用語集の型（`specdojo:gl-rulebook`）の手入れ。型は draft のまま使い、足りない点は review の指摘として残す。

## 4. 完了の判断の基準

- `T-GLOSSARY-gl-common-140`（完成版確定）が人によって完了している。
- grade で gl-common が pass、または残る指摘が人の判断に要るものだけになっている。

## 5. 子項目

子 todo は `register add --type todo --from <epic-id>` で起票する。現在の一覧と状態は `register build` が生成する epic 別ビューで確認する。

## 6. 対応結果

_TODO_: 完了を判断した根拠と残課題を記載する。未完了の場合は `-` とする。

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を文書 ID で記載する。
