---
specdojo:
  id: specdojo:pjr-epic-items-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:pjr-epic-items
      type: project
      status: draft
      rulebook: specdojo:pjr-rulebook
      part_of:
        - _PROJECT_ID_:pjr-index
---

# epic ごとの子項目

> 個票の `derived_from` から生成した直接の子項目と現在の状態です。正本は個票の Frontmatter です。子の完了だけでは epic を自動 close しません。

## 1. epic 別の一覧

<!-- specdojo:view-slot=epic-items -->
