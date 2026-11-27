---
specdojo:
  id: specdojo:pjr-question-template
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
      item_type: question
      item_status: open
      priority: medium
  translated_from:
    locale: ja
    commit: 19935e8567b9c3d6fb73c684096fc8d6c8819c97
---

# `_PJR-XXXX_` `_QUESTION_TITLE_`

## 1. Question

_TODO_: State the question at a level the respondent can decide.

## 2. Inputs

<!-- Record conversational premises, constraints, and delegated scope separately from completion or answer criteria. -->

-

## 3. Background

_TODO_: State why the question arose, its premises, and constraints.

## 4. Candidate answers

| Candidate | Content | Benefits | Concerns |
| --------- | ------- | -------- | -------- |
| A         | _TODO_  | _TODO_   | _TODO_   |

## 5. Answer and conclusion

_TODO_: Record the answer or adopted direction; use `-` while unanswered.

## 6. Approval

| Item            | Content |
| --------------- | ------- |
| Respondent      | _TODO_  |
| Answer date     | _TODO_  |
| Approval method | _TODO_  |
| Evidence        | _TODO_  |

- The default approval method is `commit` (transition to `decided` through `register close`).
- For answers involving irreversible, high-risk, or breaking framework-schema changes, use PR approval and record the PR URL and merge SHA.

## 7. Related documents

- _TODO_: List evidence, affected documents, and follow-up using `[[doc-id]]`.
