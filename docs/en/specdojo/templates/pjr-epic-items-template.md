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
  translated_from:
    locale: ja
    commit: d81cdc3a2580f9931eabede89997f5fbf24385a0
---

# Children by epic

> Direct child items and current states are generated from ticket `derived_from`. Ticket frontmatter is authoritative. Child completion alone does not automatically close an epic.

## 1. By epic

<!-- specdojo:view-slot=epic-items -->
