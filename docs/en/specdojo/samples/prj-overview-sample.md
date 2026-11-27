---
specdojo:
  id: specdojo:prj-overview-sample
  type: project
  status: draft
  rulebook: specdojo:prj-overview-rulebook
  based_on: []
  supersedes: []
  translated_from:
    locale: ja
    commit: dfbdc86b1f7204cadf31b851c20babfbdd42a31c
---

# Project Overview: Kinuya Candy Shop Sales Management System

The Kinuya candy shop sales management system supports small-shop operations by bringing counter sales, stock, and regular customers' credit together so the owner can keep daily work manageable alone.

## 1. Background

Kinuya, a candy shop long enjoyed by local children, relies on notebooks and memory for sales and stock. As the owner grows older, purchasing decisions, stock checks, and credit balance checks take more time. The owner usually serves customers; family members substitute when the owner is away.

The following frequencies are interview estimates from the shop representative and family user representative, not measured records. Replace them with a one-month baseline before operations begin.

| Problem                                                                             | Estimated frequency and impact                                              |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Popular products, including Umaibo snacks and ramune sweets, run out more often     | About weekly, a customer asks and a stockout is discovered, losing the sale |
| Purchasing timing and quantities rely on intuition, leaving uneven stock            | Several products a month are discarded or discounted after expiry           |
| Credit for regular children and neighboring adults is unclear, with missing records | Several balance disagreements a month take time to investigate              |
| Substitute shopkeepers cannot check sales, stock, or credit                         | On family shifts, credit requests and stock inquiries wait for the owner    |

## 2. Necessity

Continuing paper and memory-based work increases losses from shortages and excess stock, threatening continuity. Family members cannot make the same judgments, leaving operations dependent on the owner.

_ASSUMPTION_: The busy season is the school summer holiday, usually late July through August. Concentrated visits and transactions increase stock and credit checking work. Initial release and two weeks of recording adoption must finish before it begins. _UNDECIDED_: Set the release date in the initial-release plan.

The central hypothesis is that consistent recording and checking of sales, stock, and credit can reduce stockouts and waste while keeping daily effort acceptable and allowing operation without the owner. It has three value hypotheses:

1. Owner and family can record and check all three using the same procedure without explanation (initial-release indicators).
2. Recording is manageable and continues every business day (short-term indicators).
3. Using accumulated records for purchasing and handoff reduces stockouts and waste and supports operation without the owner (longer-term indicators).

## 3. Guiding principles

1. **Record First**: daily sales, stock, and credit records take priority over advanced analysis. Missing records prevent longer-term measurement; evaluate additions by whether they disrupt recording.
2. **Simple Operation**: minimize screens and fields so the owner can work alone. Consistent judgments by family members take priority over more inputs.
3. **Small Start, Improve Later**: initial release means the first version used at the counter, limited to one shop. Expand purchasing support or analysis only after records stabilize, using short-term results to decide.

## 4. Intended outcomes

- Manage sales, stock, and regular customers' credit together through a simple process.
- Provide screens and a flow the owner can use alone without excessive effort.
- Let family shopkeepers check stock and credit balances through the same procedure.
- Establish records that reveal shortages and excess inventory and support later purchasing assistance and analysis.

See the [[specdojo:prj-scope-sample|Project Scope]] for detailed inclusions and exclusions.

## 5. Expected benefits

These targets are initial hypotheses. Manage agreed success judgments, acceptance conditions, and timing in [[specdojo:prj-success-criteria-and-acceptance-criteria-sample|Success Criteria and Acceptance Conditions]], revising values there from measurements.

Use the month before operations as the baseline for stockouts and waste. Record seasonality, purchasing conditions, and visits; assess the system's contribution rather than attributing all improvement to it.

### 5.1. Initial-release indicators

Before release, the actual shop representative and family user representative try key scenarios. Assess complete business tasks, not feature counts.

| Viewpoint           | Indicator                                                            | Target                                                    | Measurement method                                                              |
| ------------------- | -------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Task completion     | Required sales recording, stock checking, and balance checking tasks | 100% for both representatives                             | Run scenarios without operating instructions; record completion, time, and help |
| Usability           | Serious obstacles preventing independent recovery and continuation   | 0                                                         | Observe hesitation, mistakes, questions, and recovery; assess severity          |
| Consistent judgment | Agreement on the same sales, stock, and credit records               | 100%                                                      | Independently compare sales details, stock counts, and balance answers          |
| Credit management   | Time from customer search to balance display                         | Within one minute in every trial for both representatives | Time the balance-check scenario from search start to display                    |

### 5.2. Short-term indicators

After two weeks, assess whether daily use is established without increasing the owner's burden.

| Viewpoint        | Indicator                                                     | Initial target                    | Measurement method                                            |
| ---------------- | ------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------- |
| Adoption         | Business days with sales, stock, and credit records           | At least 90%                      | Check all three record types per day; divide by business days |
| Operating burden | Extra daily time recording and checking all three             | At most ten minutes total per day | Time daily work during initial operations                     |
| Family use       | Family representative's shifts completed without owner's help | At least three                    | Record shifts, records made, support, and unfinished work     |

### 5.3. Medium- and long-term indicators

Assess contribution to purchasing, credit management, handoffs, and shop continuity. Assess stockouts, credit, and continuity after six months; assess inventory after twelve months to include a full seasonal cycle.

| Viewpoint         | Indicator                                                                   | Initial target                       | Measurement method                                                                   |
| ----------------- | --------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------ |
| Fewer stockouts   | Monthly stockouts for selected popular products                             | 50% below baseline                   | Fix the product set; compare month six with the baseline month                       |
| Better inventory  | Units and value wasted through disposal, discounting, or prolonged holding  | 20% reduction on an annualized basis | Compare twelve monthly totals with twelve times the baseline month                   |
| Credit management | Missing records or disagreements unresolved into the next month             | Zero per month                       | Reconcile at each month-end for six months; record discrepancies, causes, resolution |
| Continuity        | Owner-absent shifts where family finish sales, stock, and credit management | At least 90%                         | Across six months, check required records and handoffs for owner-absent shifts       |

Also record sales, visits, purchasing conditions, seasonality, and perceived burden to interpret changes and contribution. If the baseline falls in the busy season, revisit comparison treatment in the success criteria using seasonal records.

## 6. Premises

Unchanged conditions:

- One shop's counter sales, shop stock, and regular-customer credit only.
- Initial release excludes e-commerce, multiple shops, full accounting, and supplier-system integration.
- The owner/family organization and customer service procedures stay unchanged; prefer inputs close to current work.

Dependencies:

- One tablet can be provided for shop use.
- Stockouts, disposal, discounts, and long-held inventory can be recorded by hand for one baseline month.
- The family representative can attend pre-release trials and work shifts afterward.

Pass tablet-related release delays, measurement failure from missing baseline records, and delayed trials or family-use assessment from nonparticipation to [[specdojo:prj-assumptions-constraints-dependencies-sample|Assumptions, Constraints, and Dependencies]] as risks or unresolved matters.

Responsibility and policies:

- The owner makes final business decisions; the system supports recording and checking. It does not automatically decide purchasing quantities or credit treatment.
- Customer names and balances stay in shop records, outside shared documents including this one. Customer contact details are not managed.
- Record requests outside initial scope and assess after short-term measurement against continued recording.
- _UNDECIDED_: Decide offline operation policy in the initial-release plan.
