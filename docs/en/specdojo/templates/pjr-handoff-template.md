---
specdojo:
  id: specdojo:pjr-handoff-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PJR_DOCUMENT_ID_
      type: project
      status: draft
      rulebook: specdojo:pjr-rulebook
      part_of:
        - _PROJECT_ID_:pjr-index
      item_type: handoff
      item_status: open
      priority: medium
  translated_from:
    locale: ja
    commit: 5263f2d5944b9bf422fdf744b0dd48c815962a58
---

# `_PJR-XXXX_` `_HANDOFF_TITLE_`

## 1. From and to

_TODO_: State the originating session and LLM, and the recipient.

## 2. Valid approval scope

_TODO_: State valid approval scope, such as conditions for overnight closure or agents not to use. Move enduring instructions to the playbook or ticket inputs. Use `-` if none.

## 3. In progress

_TODO_: Use the register and `exec status` to list running queues/runs and review/waiting items. Use `-` if none.

## 4. Awaiting decisions

_TODO_: List only references to questions or items awaiting the user. File pending answers separately as questions. Use `-` if none.

## 5. Cautions

_TODO_: Record observations from the conversation; move enduring rules to the playbook. Use `-` if none.

## 6. Related documents

- _TODO_: List evidence, affected documents, and follow-up using `[[doc-id]]`.
