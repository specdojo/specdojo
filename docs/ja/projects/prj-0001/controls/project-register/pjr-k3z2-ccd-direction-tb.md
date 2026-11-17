---
specdojo:
  id: prj-0001:pjr-k3z2-ccd-direction-tb
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  owner: BA
  registered_at: "2026-11-17T22:52:02Z"
  due_on: "2026-11-30"
---

# PJR-K3Z2 概念クラス図（ccd）の向きを上から下にそろえる

## 1. 概要

ccd の sample と ccd-project-planning が direction LR で描かれているため、継承の読み方と状態遷移図にそろえて上→下を既定にし、rulebook に向きの決まりを足す

## 2. 入力

- 利用者の指摘（2026-11-18）: 概念クラス図は左→右ではなく、ほかの図に合わせて上から下の配置にした方がよい
- orchestrator の調べ（2026-11-18）: ccd-sample と ccd-project-planning は direction LR。stsd（sample と本番 5 件）は指定なし（上→下）。データフロー図・C4・プロジェクト定義の図は flowchart LR。ccd-mermaid-rulebook に向きの決まりはない。ccd-project-planning はクラス 11 個
- 利用者の決定（2026-11-18）: 上→下を既定とし、関連の連なりが長く横に並べた方が読みやすい場合だけ LR とし、理由を本文に書く

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
