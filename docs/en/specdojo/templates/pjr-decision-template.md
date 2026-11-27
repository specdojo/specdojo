---
specdojo:
  id: specdojo:pjr-decision-template
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
      item_type: decision
      item_status: open
      priority: medium
  translated_from:
    locale: ja
    commit: 0de3d5ee63b15b4290dc85bdbe0d029d775f9c2d
---

# `_PJR-XXXX_` `_DECISION_TITLE_`

## 1. Background

_TODO_: State the background, constraints, and decision deadline.

## 2. Options considered

| Option | Content | Benefits | Concerns |
| ------ | ------- | -------- | -------- |
| A      | _TODO_  | _TODO_   | _TODO_   |

## 3. Decision

_TODO_: Clearly state the adopted decision.

## 4. Rationale

- _TODO_: State the grounds for the decision.

## 5. Approval

| Item            | Content |
| --------------- | ------- |
| Decision maker  | _TODO_  |
| Decision date   | _TODO_  |
| Approval method | _TODO_  |
| Evidence        | _TODO_  |

- Use `commit` or `PR` as the approval method. For `PR`, record the PR URL and merge SHA as body text in Evidence.
- Use PR approval for irreversible, high-risk, or breaking framework-schema decisions.

## 6. Impact and follow-up

| Item                  | Content |
| --------------------- | ------- |
| Impact                | _TODO_  |
| Required action       | _TODO_  |
| Follow-up destination | _TODO_  |

## 7. Related documents

- _TODO_: List evidence, affected documents, and follow-up using `[[doc-id]]`.
