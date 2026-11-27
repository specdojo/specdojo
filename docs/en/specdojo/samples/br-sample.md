---
specdojo:
  id: specdojo:br-sample
  type: rule
  status: draft
  rulebook: specdojo:br-rulebook
  translated_from:
    locale: ja
    commit: 32e5511d28d3ba1e755fd95b6b979f91d3b08835
---

# Kinuya Candy Shop: Stock Shortage Decision

For regular products subject to stock checking, decide whether sellable quantity after reservations is below the reorder point.

## 1. Overview

- Business value: let substitute shopkeepers reach the same judgment from the same stock and notice popular-product shortages.
- Users and situation: the shop representative or family user representative checks stock when stock, reserved quantity, and reorder point for a product are available.
- Applicability: compare quantities in units for one regular product at one shop at the same check time. Values are for learning.
- Exclusions: replenishment of other products, setting reorder points, order quantity, suppliers, approval, inventory updates, and whether a sale is permitted.

## 2. Inputs

| Input        | Conceptual data / field   | Purpose                                            | Applicability and missing-value handling           |
| ------------ | ------------------------- | -------------------------------------------------- | -------------------------------------------------- |
| Product      | Product identifier        | Associate inputs and results with the same product | Required                                           |
| Inventory    | Stock quantity (units)    | Starting point for sellable quantity               | Required; includes reserved units                  |
| Reservations | Reserved quantity (units) | Exclude reserved units                             | Required; explicitly enter 0 for none              |
| Product      | Reorder point (units)     | Shortage boundary                                  | Required; 0 is valid, not a substitute for absence |

## 3. Rules (decisions / calculations)

### 3.1. Decision rules

#### 3.1.1. R-01 Validate inputs

Check inputs in the order in Exceptions / abnormal cases. Stop before calculation if any are invalid.

#### 3.1.2. R-02 Calculate sellable quantity

Sellable quantity = stock quantity − reserved quantity. If reservations exceed stock, use the negative result without rounding to zero or treating it as invalid input. Adjusting reservations is outside scope.

#### 3.1.3. R-03 Decide shortage

Return Shortage when sellable quantity is less than the reorder point; otherwise return No shortage, including equality.

### 3.2. Decision examples

Product identifier is `ITEM-A` unless specified. Results beginning `E-` return no decision value.

| Example | Inputs (stock / reserved / reorder point, units) | Applied rules  | Expected result                                             |
| ------- | ------------------------------------------------ | -------------- | ----------------------------------------------------------- |
| 1       | 12 / 3 / 10                                      | `R-02`, `R-03` | Sellable 9, Shortage                                        |
| 2       | 13 / 3 / 10                                      | `R-02`, `R-03` | Sellable 10, No shortage (boundary)                         |
| 3       | 0 / 0 / 0                                        | `R-02`, `R-03` | Sellable 0, No shortage                                     |
| 4       | 2 / 4 / 0                                        | `R-02`, `R-03` | Sellable −2, Shortage (over-reservation)                    |
| 5       | 8 / missing / 10                                 | `R-01`         | `E-01`                                                      |
| 6       | 8 / 0.5 / 10                                     | `R-01`         | `E-02`                                                      |
| 7       | −1 / 0 / 10                                      | `R-01`         | `E-03`                                                      |
| 8       | −1 / missing / 10                                | `R-01`         | `E-01` first; show `E-03` on re-evaluation after correction |
| 9       | Missing product identifier; 8 / 0 / 10           | `R-01`         | `E-01`; cannot associate result with a product              |

## 4. Outputs

| Output            | Meaning, unit, or category                    | Consumer                                      |
| ----------------- | --------------------------------------------- | --------------------------------------------- |
| Product           | Input product identifier                      | Person checking stock                         |
| Sellable quantity | Units excluding reservations; may be negative | Check the shortage reason                     |
| Shortage decision | Shortage / No shortage; not an order decision | Shop representative considering replenishment |
| Invalid input     | Exception ID and affected field names         | Input owner correcting data                   |

For invalid input, return only the exception ID and field names. Inability to decide is not No shortage.

## 5. Exceptions / abnormal cases

| ID     | Situation                      | Handling                                      | User's next action                                              |
| ------ | ------------------------------ | --------------------------------------------- | --------------------------------------------------------------- |
| `E-01` | Any required field missing     | Return missing field names                    | Enter values; ask the shop representative for the reorder point |
| `E-02` | Any quantity is not an integer | Return field names; no conversion or rounding | Re-enter whole-unit quantities                                  |
| `E-03` | Any quantity is negative       | Return negative field names                   | Check and correct records                                       |

Do not decide for any exception. The input owner corrects and retries. If several types apply, return the first type in `E-01` → `E-02` → `E-03` order and all fields of that type. Callers must not invent unavailable input values before invoking this rule.

## 6. Notes / future issues

No unresolved matters. Approval requires that examples 1–9 have uniquely derivable results from `R-01`–`R-03` and the order of `E-01`–`E-03`.
