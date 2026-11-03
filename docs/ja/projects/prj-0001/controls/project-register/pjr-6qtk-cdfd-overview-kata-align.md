---
specdojo:
  id: prj-0001:pjr-6qtk-cdfd-overview-kata-align
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-03T01:34:40Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-GEZN
  commit_type: docs
  commit_scope: rulebooks
---

# PJR-6QTK 全体概要の Kata を書き直した全体概要に合わせる

## 1. 概要

cdfd-overview の rulebook・recipe・sample・template を、目的を全体像とし、区分を代表ノードにした 3 つの図の書き方に合わせる

## 2. 入力

- PJR-PZ6H・05QS・5Q7R・KV58 で全体概要（cdfd-overview）を 7 区分を代表ノードとする 3 つの図に書き直した。Kata の 4 文書（status は ready）はその書き方を定めていない（2026-11-03）
- 利用者の判断: 目的は全体像を示すことにし、PO の承認や引き継ぎなどの作業や読み手の役割は書かない。図の題は業務の言葉にする（2026-11-03）
- 利用者の判断: 区分から区分への実行要求の線（対応要求・実行要求など）は、名詞のラベルを付けて認める。完成判定の「対象範囲と領域分割を PO が承認した記録を特定できる」は ready に上げる手続きとして残す（2026-11-03）
- Orchestrator はデータの図に置かず、指示の図を別に設ける。Orchestrator からは直接読み書きするデータストアにだけ線を引き、CLI 経由のものは区分からの線で表す（2026-11-03）
- cdfd-d2-rulebook は直さない。sample の図は今の方式（データストアの区分）の例として残す（2026-11-03）

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
