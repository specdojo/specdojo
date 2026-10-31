---
specdojo:
  id: prj-0001:pjr-ykyk-scaffold-fallback-deliverable-type
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  registered_at: "2026-10-31T00:27:20Z"
  derived_from:
    - PJR-S23T
---

# PJR-YKYK template のない rulebook の雛形の type を deliverable_type にする

## 1. 概要

deliverable scaffold の一括生成と --target の両方で、template のない rulebook の最小の雛形の type を rulebook の deliverable_type にし、宣言がない場合は project のままにする

## 2. 入力

- template: not-needed の rulebook（tsd-rulebook など）の雛形は src/catalog/generate.ts の fallbackMarkdown・fallbackYaml で type: project になり、rulebook の `deliverable_type`（tsd は architecture）と合わないため docs-lint の frontmatter-deliverable-type が警告し、--frail の lint:fm で落ちる
- PJR-65DS の流れは雛形を作ってすぐ commit するため、この不一致で止まる

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
