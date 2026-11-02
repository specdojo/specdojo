---
specdojo:
  id: prj-0001:pjr-kv58-cdfd-overview-orchestrator-direct
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: BA
  registered_at: "2026-11-02T22:58:37Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-5Q7R
---

# PJR-KV58 全体概要の Orchestrator の図を直接のデータストアだけに絞る

## 1. 概要

cdfd-overview の Orchestrator の調整の図で、直接読み書きするデータストアを稼働構成・登録簿・実行記録の 3 つに絞り、6 区分の位置をほかの図にそろえ、CLI 経由のデータストアは 5.1・5.2 の区分からの線で表す

## 2. 入力

- PJR-5Q7R では、runner の内部の関数が読み書きするものまで Orchestrator の直接と数え、13 のデータストアに線が引かれた。図は 4558×2004px で、6 区分の位置もほかの図とそろっていない（2026-11-02）
- 利用者の判断: Orchestrator が直接読み書きするのは、稼働構成（参照・記録）、登録簿（参照・記録）、実行記録（参照）。進捗報告は CLI 経由（schedule 系の P-09）。CLI 経由のものは、区分からデータストアへの線で表す（2026-11-03）
- 利用者は、CLI 経由の線を Orchestrator の図に重ねず、5.1・5.2 の図の区分からの線で表す案 A を選んだ（2026-11-03）

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
