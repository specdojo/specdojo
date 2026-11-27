---
specdojo:
  id: specdojo:br-rulebook
  type: rulebook
  deliverable_type: rule
  status: draft
  target_format: markdown
  recipe: specdojo:br-recipe
  sample: specdojo:br-sample
  template: specdojo:br-template
  translated_from:
    locale: ja
    commit: 7f8abc8b714927cb9f3606be247f9de91e8cd9f2
---

# Business Rule Rulebook

Specify business judgments, constraints, and calculations so the same inputs produce the same result. Use enough detail for business participants to assess validity and for implementation and test design to follow.

## 1. General policy

- Cover one decision purpose per document. Connect applicability, conceptual inputs, decisions, outputs, and exceptions.
- Inherit business value from upstream documents; state only the value this decision protects and its boundaries. Keep shared matters in the parent index or standard.
- Define the business meaning of comparisons and calculations. Refer to schemas and references for configuration values, syntax, and physical structures. Implementation code cannot replace a specification.
- Use project member definitions for role assignments and the [[specdojo:document-metadata-standard|Document Metadata Standard]] for `status` promotion, approval, revision, retirement, and unresolved matters. Repository formatting and lint are separate from business validation.

## 2. Position in the documentation

BR is authoritative for a decision invoked by a business process. BPS defines when and how it is applied; BR defines the result for the inputs at that point. Delegate screen operations, persistence, execution control, and test procedures to their respective deliverables.

Split documents when decision purposes can be approved and changed independently. Do not split input validation, calculation, or exceptions needed to complete one decision merely because there are many conditions.

## 3. File naming and IDs

- Prefer `br-<subject>.md`, naming the meaning of the decision. Sequential or project-specific management numbers are not required.
- Make the deliverable ID unique within the project and qualify references, for example `<project-id>:br-<subject>`.
- Follow the target project's deliverables catalog for location and the [[specdojo:docs-structure-guide|Documentation Structure Guide]] for common directory and ID rules.

## 4. Recommended frontmatter

Use the [[specdojo:document-metadata-standard|Document Metadata Standard]] and `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml` for fields, types, and allowed values.

- Use `rule` for `type` and declare the main rulebook.
- Use `based_on` for supporting upstream deliverables. If a dependency does not exist yet, record what remains unverified in the body; do not treat it as confirmed.
- Use `part_of` only when the rule belongs to a parent rule.

## 5. Content requirements

All the following are required. Write “None” when no exceptions or unresolved matters apply. The declared template governs heading order, tables, and fields.

| Content                          | Conditions                                                                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Overview                         | Decision purpose, users, business situation, premises, and exclusions are clear                                                                  |
| Inputs                           | Every input's conceptual field, purpose, applicability, and missing-value handling are clear, including paths using derived views                |
| Rules (decisions / calculations) | Order, conditions, results, and boundaries correspond; define priorities, ties, and missing values, with representative examples                 |
| Outputs                          | Meaning, units or categories, and consumers are clear; distinguish “no applicable target” from inability to decide                               |
| Exceptions / abnormal cases      | State the situation, whether judgment continues, whether a result exists, and who does what to recover                                           |
| Notes / future issues            | State unresolved questions, downstream impact, interim handling, needed evidence, and the inputs, rules, and examples to update after a decision |

## 6. Writing guidance

### 6.1. Overview

Define exactly which judgment in which business situation this rule owns, without overlapping excluded responsibilities.

Good: “During a stock check, determine whether sellable quantity is below the reorder point. Ordering quantity and approval are outside scope.” Bad: “Manage inventory appropriately,” which identifies neither the result nor the boundary.

### 6.2. Inputs

Make every value referenced by conditions and exceptions traceable. Distinguish optional, conditional, and required inputs. Recommended columns: Input / Conceptual data or field / Purpose / Applicability and missing-value handling. Add business units and comparison timing; delegate formats and enumerations to their authoritative source.

Good: “Reserved quantity is received in units and used to calculate sellable stock. If absent, no decision can be made.” Bad: “Refer to all inventory data,” which hides which missing fields affect the result.

### 6.3. Rules (decisions / calculations)

Prevent multiple results for the same inputs. Define presence for each compared field, defaults, tie-breaking, and priority when conditions overlap.

For string ordering, identify the authoritative collation method or an agreed comparison rule. “Dictionary order” alone leaves language and environment differences unresolved. Put undecided candidates and impacts in Notes.

Recommended example columns: Example / Inputs and premises / Applied rule / Expected result. Include applicable normal, boundary, missing-value, and tie cases.

Good: “Equal sellable stock and reorder point does not count as a shortage.” Bad: “If low, it is a shortage,” which omits the quantities and equality boundary. Do not duplicate prose with equivalent pseudocode.

### 6.4. Outputs

Let consumers understand the result and pass it to the next business step without mistaking an uncomputed result for a normal value.

Good: “Return Shortage or No shortage. For invalid input, return the invalid fields without a decision value.” Bad: “Return a flag,” which omits its meaning, indeterminate cases, and consumer.

### 6.5. Exceptions / abnormal cases

Separate missing inputs, inconsistent values, and failed external references from a normal absence of targets. Define handling when exceptions overlap. Recommended columns: ID / Situation / Handling / User's next action. Identify the normal rule replaced by any substitute value or priority.

Good: “Do not decide when the reorder point is absent. Re-evaluate after the shop representative registers it.” Bad: “Log errors,” which says nothing about business continuation or result validity.

### 6.6. Notes / future issues

Separate what the current specification can decide from inputs, rules, and examples blocked by unresolved matters.

Good: “`_UNDECIDED_`: whether to use seasonal reorder points. Apply the adoption decision and seasonal values to input applicability, shortage rules, and examples. Until then, seasonal implementation and acceptance conditions cannot be finalized.” Bad: “Consider later,” which omits the question, impact, and evidence needed.

## 7. Prohibited content

- Do not introduce business process procedures, screen operations, physical tables, SQL, or implementation classes as BR decision rules.
- Do not copy a rule across BR documents. Separate independent decisions and refer to document IDs.
- Do not settle unknown defaults, missing-value priorities, or continuation after exceptions by guessing. Do not use unresolved matters as expected values in normal examples.
