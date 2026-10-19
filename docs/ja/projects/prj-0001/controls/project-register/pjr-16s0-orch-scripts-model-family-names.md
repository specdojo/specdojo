---
specdojo:
  id: prj-0001:pjr-16s0-orch-scripts-model-family-names
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-19T21:17:49Z"
  derived_from:
    - PJR-ZM1K
---

# PJR-16S0 配布する orch の script の名前を model の系統にそろえる

## 1. 概要

init が作る orch の script は、claude だけ model の系統（orch:opus・orch:sonnet）で、codex・antigravity は provider の名前（orch:codex・orch:agy）で model も指定していない。ZM1K の名付けに合わせ、codex は orch:sol・orch:terra、antigravity は orch:flash にし、model を指定する。opencode はローカルの model が利用者の環境ごとに違うため orch:opencode のままとする（2026-10-20、利用者が提案）

## 2. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 3. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
