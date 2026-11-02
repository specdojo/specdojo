---
specdojo:
  id: prj-0001:pjr-5q7r-cdfd-overview-orchestrator-flow
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
  registered_at: "2026-11-02T06:56:59Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-05QS
---

# PJR-5Q7R 全体概要の Orchestrator を指示の図にし、線のない区分を外す

## 1. 概要

cdfd-overview の Orchestrator の調整の表を、Orchestrator から 6 区分への指示と、Orchestrator が直接読み書きするデータストアへの線の図に置き換え、トランザクションデータの図から 3.1、マスタ・構成データの図から 3.6 を外す

## 2. 入力

- PJR-05QS の後、トランザクションデータの図では 3.1、マスタ・構成データの図では 3.6 に線がない。利用者はこれらを図から外すよう求めた（2026-11-02）
- 利用者の考え: Orchestrator は register 系・schedule 系・routine 系・実行サイクル・3.1・3.6 に指示を出す。Orchestrator が直接触るデータストアには線をつなぎ、それ以外のデータストアは各区分が CLI 経由で扱う（2026-11-02）
- 5.3 の Orchestrator の調整の表は、この図に置き換えて不要にする

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
