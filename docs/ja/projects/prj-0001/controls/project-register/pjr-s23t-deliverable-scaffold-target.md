---
specdojo:
  id: prj-0001:pjr-s23t-deliverable-scaffold-target
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-10-30T09:32:07Z"
  derived_from:
    - PJR-6A2B
---

# PJR-S23T deliverable scaffold で成果物を 1 つだけ雛形にできるようにする

## 1. 概要

--target で成果物を 1 つだけ指定して雛形を作り、カタログにない成果物は --target-path と --target-rulebook で作れるようにする

## 2. 入力

- PJR-65DS の流れ（雛形→人による文脈の記入→draft→fully-guided→finalize）は雛形を成果物 1 つ単位で作れることを前提とするが、現在の deliverable scaffold は --dct でカタログ単位に一括生成するだけで、カタログのない成果物も作れない
- register の --target・--target-path・--target-rulebook の解決とパス検証（src/register/deliverable-target.ts）を使い回す

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
