---
specdojo:
  id: specdojo:pjr-risk-template
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
      item_type: risk
      item_status: open
      priority: medium
  translated_from:
    locale: ja
    commit: 19935e8567b9c3d6fb73c684096fc8d6c8819c97
---

# `_PJR-XXXX_` `_RISK_TITLE_`

## 1. Risk

_TODO_: State the uncertain future event and its causes.

## 2. Inputs

<!-- Record conversational premises, constraints, and delegated scope separately from completion or answer criteria. -->

-

## 3. Impact assessment

| Item        | Assessment          |
| ----------- | ------------------- |
| Probability | high / medium / low |
| Severity    | high / medium / low |
| Impact      | _TODO_              |
| Signals     | _TODO_              |

## 4. Response

| Item               | Content                              |
| ------------------ | ------------------------------------ |
| Policy             | Avoid / Mitigate / Transfer / Accept |
| Measures           | _TODO_                               |
| Trigger            | _TODO_                               |
| Escalation contact | _TODO_                               |

## 5. Monitoring

_TODO_: State monitoring frequency, check methods, and conditions for state updates.

## 6. Related documents

- _TODO_: List evidence, affected documents, and follow-up using `[[doc-id]]`.
