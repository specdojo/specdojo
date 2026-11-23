---
specdojo:
  id: specdojo:pjr-handoffs-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:pjr-handoffs
      type: project
      status: draft
      rulebook: specdojo:pjr-rulebook
      part_of:
        - _PROJECT_ID_:pjr-index
---

# 引き継ぎ（handoff）の一覧

> 個票の `item_type: handoff` から生成した引き継ぎの一覧です。正本は個票の Frontmatter です。受け取り待ちの handoff を読んだら、受け取った主体を `--by` にして `register close` します。

## 1. 受け取り待ち

<!-- specdojo:view-slot=open-handoffs -->

## 2. 受け取り済み

<!-- specdojo:view-slot=done-handoffs -->
