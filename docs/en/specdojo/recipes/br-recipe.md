---
specdojo:
  id: specdojo:br-recipe
  type: recipe
  status: draft
  rulebook: specdojo:br-rulebook
  sample: specdojo:br-sample
  translated_from:
    locale: ja
    commit: 67cb4ad78959dde4a5084cc2d71aa512d3bc003b
---

# Business Rule Recipe

Turn business participants' judgments into conditions that produce the same result whoever applies them.

## 1. How to use this recipe

Inherit why a decision is needed from the business process (Why). Define input/result correspondence (What), order and exception handling (How). Connect conditions, examples, and unresolved matters by ID (Trace).

## 2. Information to collect

| Item                 | Information                                                 | Source                            |
| -------------------- | ----------------------------------------------------------- | --------------------------------- |
| Usage situation      | Who decides in which work, and the harm of a wrong decision | Business process and participants |
| Decision inputs      | Fields, units, and comparison timing                        | Conceptual data and participants  |
| Examples             | Actual cases and why each result was reached                | Interviews                        |
| Unresolved questions | Undecided judgments and blocked work                        | Interview notes                   |

## 3. Overall procedure

1. Pair representative inputs with results first; starting from conditions can introduce unsupported rules.
2. Turn the reasons into conditions. Extend to equality, ties, and missing values, and determine order.
3. Put fields used by conditions in Inputs, and the recipient's next action in Outputs.
4. Decide whether business continues after invalid inputs or reference failures. Move unsettled judgments to Notes / future issues.
5. Write the overview last; established rules make exclusions easier to draw.

## 4. Writing each section

| Section               | Questions                                                                   | Tips                                                                |
| --------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Overview              | Who suffers from an error? Does responsibility overlap adjacent work?       | Refer to upstream purpose instead of copying                        |
| Inputs                | Can a decision be made if one value is absent? At what time is it measured? | Hide fields one at a time to uncover assumed zero values            |
| Rules                 | Why this result? Which rule takes priority when both apply?                 | Ask about values just below, at, and above a boundary               |
| Outputs               | What does the recipient choose next?                                        | Remove intermediate values no consumer needs                        |
| Exceptions            | What happens if work continues with a wrong value?                          | Offer stopping and continuing with a substitute as explicit choices |
| Notes / future issues | Whose judgment and which evidence will settle it?                           | Separate scope-changing questions from missing verification work    |

## 5. Going deeper

1. Check which problem each condition addresses; remove unsupported conditions.
2. Check which condition produces each expected result. For string ordering, test mixed case and digits for changes in outcome.
3. Separate a single missing field from inability to calculate any records. Ask why the same substitute rule would apply to both.
4. Return unsettled expected values to unresolved matters, stating downstream work affected by each option.

## 6. Good and bad examples

| Viewpoint       | Good                                                                                     | Bad                                |
| --------------- | ---------------------------------------------------------------------------------------- | ---------------------------------- |
| Missing input   | “No decision without reserved quantity, because sellable quantity cannot be calculated.” | “A blank is probably zero.”        |
| Partial absence | “Priority is unresolved for tasks missing only the earliest start date.”                 | “Put anything missing at the end.” |
| Consumer        | “Return shortage to the stock checker, who decides whether to order.”                    | “Automatically order on shortage.” |

## 7. Review viewpoints

| Viewpoint       | Question                                                                     |
| --------------- | ---------------------------------------------------------------------------- |
| Vocabulary      | Can business participants read conditions in their usual terms?              |
| Reproducibility | Could two people assign different results to the same example?               |
| Handoff         | Can the recipient select the next business step from results and exceptions? |

## 8. Final checks

- Every input field is used by a condition or exception.
- Every output arises from a condition or exception.
- Every unresolved matter identifies an affected condition or example by ID.
