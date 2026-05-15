---
id: prj-0001:wbs-strategy-project-definition
type: project
status: draft
rulebook: wbs-strategy-rulebook
based_on:
  - prj-0001:dct-project-definition
  - specdojo-deliverables-to-schedule-guide
---

# プロジェクト定義のWBS戦略

Project Definition WBS Strategy

本ドキュメントでは`プロジェクト定義`に関する成果物から、WBSへの展開戦略をまとめます。

## 1. WBS展開戦略

- `prj-0001:dct-project-definition`の内容をもとに、WBS item を作成します。
- `specdojo-deliverables-to-schedule-guide`に定めるルールに従います。
- wbsの出力先は、`./project-definition.yaml`とします。
- WBS item 毎の完了条件`done_criteria`は、一律で`PO`, `BA`, `ARC`, `QE`のロールの承認を条件とします。
