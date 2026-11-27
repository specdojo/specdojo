---
specdojo:
  id: specdojo:sf-index-sample
  type: requirement
  status: draft
  rulebook: specdojo:sf-index-rulebook
  translated_from:
    locale: ja
    commit: 48961813aaa7af5e001b9bbfff2237dd59b82fe8
---

# Kinuya Candy Shop: System Functions Index

Define the structure and list of functions provided on the shop's tablet. Map functions to business areas and screens as the entry point to individual specifications.

## 1. Purpose and scope

Following “Record First” in the [[specdojo:prj-overview-sample|Project Overview]], define recording and checking responsibilities for sales, stock, credit, and closing so records continue through shift changes. The shop representative checks scope and human decisions; DEV decides decomposition and implementation scope; QE identifies tests. Readers can assess business omissions and overlapping functions.

| Category | Scope                                                                                                                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Included | One shop's tablet records and checks for sales, credit, stock, and closing; the system-recorded, calculated, or presented parts of `P-02`–`P-10`                                                         |
| Excluded | Purchasing plans and supplier orders (`P-01`), final replenishment, credit-limit and selling-price judgments, cashless payment, full accounting, e-commerce, multiple shops, individual function details |

The list does not imply all functions ship initially (sequence: `Q-03`) or guarantee offline sales.

## 2. Function structure

Use business areas from the [[specdojo:cdfd-overview-sample|Conceptual Data Flow Overview]]. Receiving (`P-02`) belongs to inventory because it updates quantities, rather than to purchasing.

| Function area | Abbreviation | Business process area  | System responsibility                                                                        | Human judgment                                                 |
| ------------- | ------------ | ---------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Sales         | `POS`        | `P-03`                 | Present cash-sale details, amount, and change; record sales and pass quantities to inventory | Cancel transactions                                            |
| Credit        | `CRD`        | `P-04`, `P-07`, `P-08` | Register customers and limits; record credit sales/settlements and show balances             | Set limits; over-limit permission remains unresolved in `Q-02` |
| Inventory     | `INV`        | `P-02`, `P-05`, `P-06` | Apply receipts and sales; show products below threshold and requested quantities             | Approve replenishment requests                                 |
| Closing       | `CLS`        | `P-09`, `P-10`         | Reconcile daily sales, receipts, stock, credit; show differences and monthly totals          | Finalize closing; revise prices and thresholds                 |

Purchasing plans (`P-01`) are not computerized. Supplier integration is excluded initially; the representative orders from replenishment requests.

## 3. System functions index

Unlinked specification IDs are fictional documents not included with this example.

| Function ID | Function name                 | Summary                                                                                          | Business process specification                                       | Screen                                      | Individual specification                            |
| ----------- | ----------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------- |
| `SF-POS-01` | Counter product sales         | Calculate amount and change from products and quantities; record after cash receipt is confirmed | `P-03` / `bps-sales-order-flow`                                      | [[specdojo:uis-sample\|Sales entry screen]] | [[specdojo:sf-sample\|Product sales specification]] |
| `SF-CRD-01` | Credit sales                  | Check limit and balance, record credit sale, and show updated balance                            | `P-04` / `bps-credit-sale`                                           | `uis-credit-sale`                           | Summarized in row                                   |
| `SF-CRD-02` | Regular customer registration | Register/update identity and limit for credit eligibility                                        | `P-07` / `bps-customer-registration`                                 | `uis-customer`                              | Summarized in row                                   |
| `SF-CRD-03` | Credit settlement             | Accept payment, reduce credit balance, and show the remainder                                    | `P-08` / `bps-credit-settlement`                                     | `uis-credit-sale`                           | Summarized in row                                   |
| `SF-INV-01` | Stock checking                | Apply sales and receipts to stock and show current quantities                                    | `P-05` / `bps-inventory-check`                                       | `uis-inventory`                             | `sf-inventory` (candidate, `Q-03`)                  |
| `SF-INV-02` | Receiving records             | Record inspected products and quantities; pass to stock checking                                 | `P-02` / `bps-receiving`                                             | `uis-inventory`                             | Summarized in row                                   |
| `SF-INV-03` | Replenishment request support | Show products below threshold and quantities aligned to order units; record approved requests    | `P-06` / [[specdojo:bps-sample\|Replenishment request finalization]] | `uis-inventory`                             | Summarized in row                                   |
| `SF-CLS-01` | Daily closing reconciliation  | Compare sales, receipts, stock, and credit; show differences and record closing confirmation     | `P-09` / `bps-daily-closing`                                         | `uis-closing`                               | Summarized in row                                   |
| `SF-CLS-02` | Monthly reporting             | Aggregate sales, stockouts, and credit for review decisions                                      | `P-10` / `bps-monthly-review`                                        | `uis-closing`                               | Summarized in row                                   |

- Separate rows by function: credit sales and settlement share `uis-credit-sale`; three inventory functions share `uis-inventory`; closing and reporting share `uis-closing`.
- Sales quantities from `SF-POS-01` and `SF-CRD-01`, and receipts from `SF-INV-02`, pass to `SF-INV-01`, which owns stock calculation and updates. Sales functions do not report completion when stock updates are absent or unknown. Follow the [[specdojo:sf-sample|Product Sales Specification]] for counter-sale recovery. It excludes credit sales; their recovery conditions remain unresolved (`Q-03`).
- Do not count human judgments as functions. The system records their evidence and results.
- Normal interaction is GUI; no sales-management CLI is included.

## 4. Unresolved matters

| ID     | Question                                                                                                                                                                                                                                                         | Impact and interim handling                                                                                                                                                                                                                                  |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Q-01` | _TODO_: Only replenishment BPS and sales screen specifications exist; mappings for all nine functions are provisional from conceptual business areas. The product-sales specification references an uncreated `sf-index` and leaves its `SF-POS-01` mapping open | Compare summaries and steps as BPS/screens are created. Hold design and do not treat responsibilities as settled until checked. Treat this index's `SF-POS-01` as the parent row and finalize mutual references when that specification's `Q-01` is resolved |
| `Q-02` | _UNDECIDED_: Allow over-limit credit with representative approval, or reject it in the system?                                                                                                                                                                   | `SF-CRD-01` boundary remains open; hold design and acceptance for the over-limit route                                                                                                                                                                       |
| `Q-03` | _TODO_: Catalog registration and rollout order for individual specifications are unverified. `sf-inventory` is a candidate; initial inclusion of `SF-INV-03` and `SF-CLS-02` is undecided                                                                        | Do not create individual specifications before registration; use row summaries. Do not finalize rollout until initial/later scope is separated                                                                                                               |

When BPS, screens, or individual specifications change, or functions are added, retired, or merged, start from changed IDs and recheck index rows, structure, decomposition and component design, screens, implementation, the [[specdojo:bdd-sample|Business Data Dictionary]], shopkeeper instructions, and tests. This system generates no documents or configuration, so generation is not an affected responsibility.
