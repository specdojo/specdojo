---
specdojo:
  id: specdojo:prj-overview-template
  type: template
  status: draft
  frontmatter_template:
    specdojo:
      id: _PROJECT_ID_:prj-overview
      type: project
      status: draft
      rulebook: specdojo:prj-overview-rulebook
      based_on: []
      supersedes: []
  translated_from:
    locale: ja
    commit: bdf7f34f3a943652ce801fd49e80411a49641052
---

# Project overview: `_PROJECT_NAME_`

_TODO_: Define the project or framework in one sentence: how it supports whom to achieve what state.

## 1. Background

_TODO_: Describe the current situation and context.

_TODO_: Describe observed problems, frequency, counts, and impact. For estimated values, include their basis and how to replace them.

| Problem     | Frequency and impact |
| ----------- | -------------------- |
| `_PROBLEM_` | `_FREQUENCY_IMPACT_` |
| `_PROBLEM_` | `_FREQUENCY_IMPACT_` |

## 2. Necessity

_TODO_: Explain why action is needed now and what happens if current methods continue.

_ASSUMPTION_: If using a central hypothesis, state whose problem, which intervention, and what change in one sentence. Break it into value hypotheses with assessment horizons.

1. `_VALUE_HYPOTHESIS_` (check at `_TIME_AXIS_`)
2. `_VALUE_HYPOTHESIS_` (check at `_TIME_AXIS_`)

## 3. Guiding principles

1. **`_PRINCIPLE_NAME_`**: `_PRINCIPLE_DESCRIPTION_` `_PRINCIPLE_MEANING_`
2. **`_PRINCIPLE_NAME_`**: `_PRINCIPLE_DESCRIPTION_` `_PRINCIPLE_MEANING_`

## 4. Intended outcomes

- `_DESIRED_STATE_`
- `_DESIRED_STATE_`

Manage detailed scope and exclusions in `prj-scope`.

## 5. Expected benefits

_TODO_: State that targets are initial hypotheses, the baseline and assessment timing, and how to check contribution alongside external factors. Manage agreed success criteria in `prj-success-criteria-and-acceptance-criteria`.

<!-- Time horizons are optional. Remove an unused horizon's heading and table together; explain the omission or alternative assessment timing here. -->

### 5.1. Initial-release indicators

_TODO_: State who will try which scenarios before launch and what will be assessed.

| Viewpoint     | Indicator     | Target     | Measurement method     |
| ------------- | ------------- | ---------- | ---------------------- |
| `_VIEWPOINT_` | `_INDICATOR_` | `_TARGET_` | `_MEASUREMENT_METHOD_` |

### 5.2. Short-term indicators

_TODO_: State what will be assessed and when after launch or start of operations.

| Viewpoint     | Indicator     | Initial target     | Measurement method     |
| ------------- | ------------- | ------------------ | ---------------------- |
| `_VIEWPOINT_` | `_INDICATOR_` | `_INITIAL_TARGET_` | `_MEASUREMENT_METHOD_` |

### 5.3. Medium- and long-term indicators

_TODO_: State timing and the outcomes whose contribution will be assessed.

| Viewpoint     | Indicator     | Initial target     | Measurement method     |
| ------------- | ------------- | ------------------ | ---------------------- |
| `_VIEWPOINT_` | `_INDICATOR_` | `_INITIAL_TARGET_` | `_MEASUREMENT_METHOD_` |

## 6. Premises

The following conditions remain unchanged:

- `_UNCHANGED_PREMISE_`

The project depends on:

- `_DEPENDENT_CONDITION_`

Decision responsibility, disclosure, and selection policies:

_TODO_: If using AI agents in operations, define their role and boundary with human judgment.

- `_HUMAN_DECISION_RESPONSIBILITY_`
- `_DISCLOSURE_POLICY_`
- `_SELECTION_POLICY_`
- _UNDECIDED_: Decide `_UNDECIDED_ITEM_` in `_DECISION_DOCUMENT_OR_TIMING_`.
