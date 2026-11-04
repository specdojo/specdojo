---
specdojo:
  id: prj-0001:pjr-sjbv-finding-cause-routing
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-04T11:48:08Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-CYG0
  depends_on:
    - PJR-CYG0
  commit_type: feat
  commit_scope: grade
---

# PJR-SJBV grade の指摘に原因を持たせて Kata の手入れへ振り分ける

## 1. 概要

PJR-CYG0 の決定に沿って、grade の指摘に原因（document または kata:`<kind>`）と Kata の箇所の根拠を持たせ、plan の生成時に Kata が原因の指摘をその Kata の手入れの段へ振り分ける

## 2. 入力

- PJR-CYG0 の決定内容（原因の振り分けの層）を実装の正本とする。冗長さに限らず、どの観点の指摘にも効かせる。Kata の箇所を示せない指摘は document とする（2026-11-04）
- 今は Kata の手入れの plan が読むのは Kata そのものの grade の指摘だけで、成果物の指摘のうち Kata が原因のものが届く道がない（2026-11-04）

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
