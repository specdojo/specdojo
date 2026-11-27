---
specdojo:
  id: specdojo:prj-issues-and-approach-sample
  type: project
  status: draft
  rulebook: specdojo:prj-issues-and-approach-rulebook
  based_on:
    - specdojo:prj-overview-sample
    - specdojo:prj-scope-sample
    - specdojo:prj-assumptions-constraints-dependencies-sample
  supersedes: []
  translated_from:
    locale: ja
    commit: cd189e17c6b518164a0d6a1b13bd307524c6a3b0
---

# Project Issues and Approach: Kinuya Candy Shop Sales Management System

This document supports decisions about which initial-release issues to address and how. It starts from the memory/notebook problems in the [[specdojo:prj-overview-sample|Project Overview]], within the [[specdojo:prj-scope-sample|Project Scope]] (one shop's counter sales, stock, and credit), and subject to [[specdojo:prj-assumptions-constraints-dependencies-sample|Assumptions, Constraints, and Dependencies]] (continued tablet availability and recording close to current procedures).

Agreement covers priority issues P-01–P-03, combining A-01 and A-03, deferring P-04, and questions for the next decision. Detailed screens, data, procedures, and selection of a particular device or app are excluded.

## 1. Issues

Frequencies are interview estimates from the overview's Background. Replace them after the one-month baseline before operations.

| Issue ID | Issue                                                                       | Impact                                                                        | Priority | Notes                                                                      |
| -------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| P-01     | Cannot check sales, stock, and credit consistently when the owner is away   | Credit requests and stock inquiries on family shifts wait for the owner       | High     | Directly affects continuity                                                |
| P-02     | Credit checks take time and notebook balances disagree with customers       | Several investigations a month; missing records carry into the next month     | High     | Initial-release target: balance display within one minute                  |
| P-03     | Falling stock of popular products is noticed late                           | About weekly a customer reveals a stockout and the sale is lost               | Medium   | Assess stockout reduction after six months                                 |
| P-04     | Intuitive purchasing timing and quantity cause excess or insufficient stock | Several products a month discarded or discounted; no sales/stock evidence yet | Low      | Address after accumulating records; automatic suggestions are out of scope |

## 2. Causes, including hypotheses

| Issue ID | Cause type | Description                                                                         | Evidence / verification                                                                      |
| -------- | ---------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| P-01     | Fact       | Recording procedures are only passed on orally                                      | Family representative reports methods differ by shift                                        |
| P-01     | Fact       | Latest stock and credit values are only in the owner's notebook and memory          | Inquiries wait during family shifts (overview Background)                                    |
| P-02     | Fact       | Credit entries are chronological, not customer-based, requiring search and addition | Month-end checks go back through pages per customer                                          |
| P-02     | Hypothesis | Payments are missed at receipt, overstating balances                                | During baseline, record payment times separately; reconcile at month-end and count omissions |
| P-03     | Hypothesis | Stock-check timing varies by shopkeeper                                             | Inferred from stockouts; record check times and stockout dates during baseline and compare   |
| P-03     | Hypothesis | Product-specific replenishment thresholds are undefined                             | Ask the owner about previous-day quantities and decisions for products that ran out          |
| P-04     | Fact       | No sales or disposal counts support purchasing                                      | Current records contain only credit entries                                                  |

## 3. Candidate approaches

A-01 and A-02 are alternative recording methods. A-03 complements either by addressing timing and handoff.

| Approach ID | Approach                                    | Relationship | Summary                                                                                 | Expected effect                                                           | Issues addressed                |
| ----------- | ------------------------------------------- | ------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------- |
| A-01        | Minimal tablet recording                    | Alternative  | Consistent sales, stock, and credit records; stock list and customer balances           | Shared records across shifts; no manual balance addition                  | P-01, P-02, P-04 (records only) |
| A-02        | Common paper forms and instructions         | Alternative  | Customer credit pages, sales/stock fields, and paper instructions; no software          | Quick introduction; manual totals remain                                  | P-01, P-02                      |
| A-03        | Agree stock-check timing and shift handoffs | Complement   | Check low stock and credit before opening and after closing; hand over pending requests | Less variation and fewer missed requests; earlier replenishment decisions | P-01, P-03                      |

Do not propose purchasing-quantity solutions for P-04 until A-01 has accumulated sales and disposal records. Like automatic purchasing suggestions outside scope, address it after longer-term indicators are assessed.

## 4. Adopted approach and rationale

Adopt A-01 for recording and A-03 for timing and handoff. A-01 handles inconsistent procedures and inaccessible current values, but not the P-03 timing hypothesis. A-03 standardizes checks but leaves manual totals. Neither alone addresses P-01–P-03. Start A-03 with A-01's release because checks use its stock and balance displays.

Prioritize recording continuity, then user burden, then introduction before the busy season, matching Record First and Simple Operation in the overview.

| Candidate                  | Decision | Rationale                                                                                |
| -------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| A-01 Tablet recording      | Adopt    | Continuity: consistent records across shifts and sales/disposal evidence for P-04        |
| A-02 Paper standardization | Reject   | Easier introduction, but manual balance addition cannot meet the one-minute check target |
| A-03 Checks and handoffs   | Adopt    | Twice-daily checks support consistency within the ten-minute extra-time target           |

## 5. Trade-offs and risks

| Category  | Description                                                                     | Mitigation                                                                                |
| --------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Trade-off | Minimal release defers accounting integration, purchasing support, and analysis | Record requests; assess after short-term indicators against recording continuity          |
| Trade-off | Rejecting quicker A-02 leaves notebooks until release                           | Start separate payment notes alongside baseline measurement                               |
| Risk      | Unfamiliar tablet use stops recording                                           | Provide operating notes; check daily for two weeks and identify blocked operations        |
| Risk      | Unavailable device (ACD-D01) or network outage (ACD-A02) creates gaps           | Use paper forms like A-02 and re-enter after recovery; offline method remains _UNDECIDED_ |

## 6. Next decisions and tasks

| Task                                      | Purpose                                          | Completion criteria                                                     | Deadline / decision timing       | Responsible role    |
| ----------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------- | -------------------------------- | ------------------- |
| _TODO_: Confirm minimal initial functions | Limit A-01 to continuous recording               | Sales, stock, customer, and credit function list agrees with scope      | Before release plan is finalized | Shop representative |
| _TODO_: Decide balance migration          | Avoid omissions and importing P-02 discrepancies | Decide customers included and notebook reconciliation method            | Before scenario trials           | Developer           |
| _TODO_: Test P-03 timing hypothesis       | Assess whether A-03 checks reduce stockouts      | Compare baseline check times and stockouts; accept or reject hypothesis | End of baseline                  | Developer           |
| _UNDECIDED_: Decide offline recording     | Continue records and P-01 checks during outages  | Choose paper fallback or device storage and acceptance conditions       | Before initial operations        | Shop representative |

## 7. Review and change management

| Review trigger                                            | Review viewpoints                                             | Response                                                       |
| --------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------- |
| P-03 timing hypothesis disproved                          | Are missing thresholds the cause instead?                     | Revisit A-03 and timing; add threshold-setting as a complement |
| P-02 payment-omission hypothesis disproved                | Could calculation errors cause differences?                   | Revisit migration checks and adequacy of A-01 balance checks   |
| Balance migration completed                               | Is P-02 resolved?                                             | Close resolved issues and reprioritize remaining ones          |
| Recording-continuity premise ACD-A01 fails                | Which operations cannot continue close to current procedures? | Reduce A-01 functions or A-03 check frequency                  |
| Staffing or users change                                  | Effect on sharing P-01 procedures                             | Revisit handoff contents and minimal scope                     |
| Longer-term assessment or purchasing support enters scope | Are enough records available for P-04?                        | Reprioritize P-04 and develop purchasing candidates            |
