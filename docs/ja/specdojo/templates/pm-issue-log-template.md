---
specdojo:
  id: specdojo:pm-issue-log-template
  type: template
  status: ready
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:pm-issue-log
      type: project
      status: ready
      part_of:
        - _PROJECT_ID_:pjr-index
      rulebook: specdojo:pjr-rulebook
---

# 課題ログ

> このファイルは `item_type: issue` の各 `pjr-XXXX-<topic>.md`（個票）から `register build` で生成された派生ビューです。正本は個票の Frontmatter です。直接編集せず、個票を直して `register build` で再生成してください。

<!-- specdojo:view-slot=table -->
