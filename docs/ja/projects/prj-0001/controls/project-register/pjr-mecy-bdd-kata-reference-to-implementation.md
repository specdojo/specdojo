---
specdojo:
  id: prj-0001:pjr-mecy-bdd-kata-reference-to-implementation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T00:32:15Z"
  derived_from:
    - PJR-2GD6
  depends_on:
    - PJR-HMV6
  approach: rulebook-maintenance
  targets:
    - specdojo:bdd-rulebook
---

# PJR-MECY 業務データ辞書（bdd）の型を、実装と同じことを書かない形に手入れする

## 1. 概要

業務データ辞書の型を手入れする。schema があるエンティティは schema を正として参照し、fields には schema から読めない業務上の意味だけを書く。schema のないエンティティは今の形か TypeScript の型の参照にする

## 2. 入力

- 方針（indie が決定、2026-11-08）: schema があるエンティティは schema を正として参照し、fields には schema から読めない業務上の意味だけを書く。schema のないエンティティは今の形か TypeScript の型の参照にする。
- rulebook にあわせて bdd-sample も揃える。

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
