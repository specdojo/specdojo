---
specdojo:
  id: specdojo:pjr-dependent-items-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:pjr-dependent-items
      type: project
      status: ready
      rulebook: specdojo:pjr-rulebook
      part_of:
        - _PROJECT_ID_:pjr-index
---

# 登録項目の実行依存

> このファイルは個票の `depends_on` から生成された派生ビューです。正本は個票の Frontmatter であり、このファイルは再生成可能です。

## 1. 先行項目から後続項目を辿る

<!-- specdojo:view-slot=derived-items -->
