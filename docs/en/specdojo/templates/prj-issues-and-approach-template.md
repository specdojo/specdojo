---
specdojo:
  id: specdojo:prj-issues-and-approach-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:prj-issues-and-approach
      type: project
      status: draft
      rulebook: specdojo:prj-issues-and-approach-rulebook
      based_on:
        - _PROJECT_ID_:prj-overview
        - _PROJECT_ID_:prj-scope
        - _PROJECT_ID_:prj-assumptions-constraints-dependencies
      supersedes: []
  translated_from:
    locale: ja
    commit: 63c0ec11b292b22080e00d24ad400330b4d78c73
---

# Project issues and approach: `_PROJECT_NAME_`

Starting from the [[_PROJECT_ID_:prj-overview|project overview]] and subject to the [[_PROJECT_ID_:prj-scope|project scope]] and [[_PROJECT_ID_:prj-assumptions-constraints-dependencies|assumptions, constraints, and dependencies]], this document organizes the main user issues and approaches for `_PROJECT_NAME_`. It provides a basis for agreement on what to address and how; detailed design, implementation, and test design are outside scope.

Agreement covers priority issues, adopted approaches, deferred matters, and further decisions. It excludes individual system design, technology selection, and detailed procedures.

## 1. Issues

_TODO_: Describe troubling situations without assuming solutions. Give impact and priority (`High` / `Medium` / `Low`) for each.

| Issue ID | Issue  | Impact | Priority | Notes  |
| -------- | ------ | ------ | -------- | ------ |
| P-01     | _TODO_ | _TODO_ | _TODO_   | _TODO_ |
| P-02     | _TODO_ | _TODO_ | _TODO_   | _TODO_ |

## 2. Causes, including hypotheses

_TODO_: Describe causes per issue, separating facts and hypotheses.

| Issue ID | Cause type | Description | Evidence / notes |
| -------- | ---------- | ----------- | ---------------- |
| P-01     | _TODO_     | _TODO_      | _TODO_           |
| P-02     | _TODO_     | _TODO_      | _TODO_           |

## 3. Candidate approaches

_TODO_: Give at least two approaches with IDs, alternative/complementary relationships, summaries, expected effects, and issues addressed. Do not impose a single option. Delegate detailed comparison of complete alternatives to `prj-comparison-of-alternatives`.

| Approach ID | Approach | Relationship | Summary | Expected effect | Issues addressed |
| ----------- | -------- | ------------ | ------- | --------------- | ---------------- |
| A-01        | _TODO_   | _TODO_       | _TODO_  | _TODO_          | _TODO_           |
| A-02        | _TODO_   | _TODO_       | _TODO_  | _TODO_          | _TODO_           |

## 4. Adopted approach and rationale

The adopted direction is _TODO_.

_TODO_: For complementary measures, state the issues and causes each handles and why one alone is insufficient. Include core/supporting relationships or sequence only if they exist. Include rejected alternatives with decisions and reasons.

| Candidate | Decision | Rationale |
| --------- | -------- | --------- |
| _TODO_    | _TODO_   | _TODO_    |
| _TODO_    | _TODO_   | _TODO_    |

_TODO_: State the relative priority of criteria such as effect, cost, time, risk, and reuse in one sentence.

## 5. Trade-offs and risks

_TODO_: Describe sacrifices, deferrals, risks, mitigation, and responses if premises fail. Use categories `Trade-off` / `Risk`. Remove this optional section if unnecessary.

| Category | Description | Mitigation |
| -------- | ----------- | ---------- |
| _TODO_   | _TODO_      | _TODO_     |

## 6. Next decisions and tasks

_TODO_: List research, checks, and approvals with purpose, completion criteria, deadline or decision timing, and responsible role. Prefix each with `_TODO_:` for work to complete or `_UNDECIDED_:` for unsettled decisions. Remove this optional section if unnecessary.

| Task   | Purpose | Completion criteria | Deadline / decision timing | Responsible role |
| ------ | ------- | ------------------- | -------------------------- | ---------------- |
| _TODO_ | _TODO_  | _TODO_              | _TODO_                     | _TODO_           |

## 7. Review and change management

_TODO_: Describe review triggers, viewpoints, and responses. Remove this optional section if unnecessary.

| Review trigger | Review viewpoints | Response |
| -------------- | ----------------- | -------- |
| _TODO_         | _TODO_            | _TODO_   |
