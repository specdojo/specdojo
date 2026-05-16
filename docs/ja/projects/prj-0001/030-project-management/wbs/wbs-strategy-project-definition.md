---
id: prj-0001:wbs-strategy-project-definition
type: project
status: draft
rulebook: wbs-strategy-rulebook
based_on:
  - prj-0001:dct-project-definition
  - wbs-rulebook
---

# プロジェクト定義のWBS戦略

Project Definition WBS Strategy

本ドキュメントでは`プロジェクト定義`に関する成果物から、WBSへの展開戦略をまとめます。

## 1. WBS展開戦略

- `prj-0001:dct-project-definition`の内容をもとに、WBS item を作成します。
- `wbs-rulebook`に定めるルールに従います。
- wbsの出力先は、`./wbs-project-definition.yaml`とします。

## 2. done_criteria 方針

- 各 WBS Item の `done_criteria` は、対象成果物がレビュー可能な粒度で目的・範囲・主要判断材料を記述していることを条件にする。
- プロジェクト定義ドメインでは、少なくとも PO / BA が業務観点、ARC が技術影響、QE が検証可能性を確認できる表現にする。
- 承認行為そのものは Schedule 側で扱い、WBS の `done_criteria` には成果物が満たすべき状態を書く。
