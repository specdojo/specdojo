---
specdojo:
  id: specdojo:pjr-index-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:pjr-index
      type: project
      status: ready
      rulebook: specdojo:pjr-rulebook
  translated_from:
    locale: ja
    commit: 5263f2d5944b9bf422fdf744b0dd48c815962a58
---

# Project Register

> This index is generated from individual `pjr-XXXX-<topic>.md` tickets. Ticket frontmatter is authoritative; manual edits here are lost on the next `specdojo register build`.

This is the project register for `_PROJECT_ID_`.

It lists todos, questions, risks, issues, change requests, decisions, notes, and other items arising during the project.

Follow [[specdojo:pjr-rulebook|Project Register Rulebook]] for writing rules and field, type, state, and priority definitions.
See [[specdojo:register-operation-guide|Register Operation Guide]] for filing decisions, transitions, and ticket creation.

## 1. Register items

<!-- prettier-ignore -->
| ID | State | Title | Description | Type | Priority | Owner | Registered date | Due date | Completed date | Conclusion | Ticket | `depends_on` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## 2. Derived views

The following auxiliary lists are generated from tickets. Each `pjr-XXXX-<topic>.md` is authoritative; derived views follow those sources.

### 2.1. Auxiliary register views

- [[pjr-views-by-status|Register view by state]]
- [[pjr-views-by-priority|Register view by priority]]
- [[pjr-views-by-owner|Register view by owner]]
- [[pjr-derived-items|Register item derivations]]
- [[_PROJECT_ID_:pjr-dependent-items|Register execution dependencies]]
- [[_PROJECT_ID_:pjr-epic-items|Children by epic]]
- [[_PROJECT_ID_:pjr-handoffs|Handoffs]]

### 2.2. Controls-wide management views

- [[pm-risk-register|Risk register]]
- [[pm-issue-log|Issue log]]
- [[pm-change-request-log|Change request log]]
- [[pm-decision-log|Decision log]]
