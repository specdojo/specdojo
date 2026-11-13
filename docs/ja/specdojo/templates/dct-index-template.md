---
specdojo:
  id: specdojo:dct-index-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:dct-index
      type: project
      status: _STATUS_
      rulebook: specdojo:dct-index-rulebook
---

# 成果物カタログ

Project Deliverables Catalog

> このファイルは `dct-index.yaml` と各 `dct-*.yaml` から生成された一覧ビューです。直接編集した内容は、次回の `specdojo catalog build` で失われます。

ドメイン別成果物カタログへの参照起点です。

## 1. 索引の正本と参照先

- 分類・表示順・表示名・概要の正本は `dct-index.yaml` です。記述規約は [[specdojo:dct-index-rulebook|成果物カタログ索引の作成ルール]] に従います。
- 個別成果物の定義の正本は `dct-<domain>.yaml` です。次の一覧から、各ドメインの生成ビューへ進めます。

## 2. 成果物カタログ一覧

<!-- specdojo:view-slot=domain-tables -->
