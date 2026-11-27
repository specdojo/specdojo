---
specdojo:
  id: specdojo:civic-tech-starter-guide
  type: guide
  status: draft
  based_on:
    - specdojo:kata-guide
    - specdojo:ryu-guide
  translated_from:
    locale: ja
    commit: a9ab7fd04621afceba67e6b8a365ac9618a9aee0
---

# Civic Tech Starter Guide

This guide introduces five starter kata for small civic tech teams with limited funding and specialist time. It shows what to preserve, and in which order, to reduce comprehension debt, both for new work and for existing systems.

**Audience**

- Everyone on a small civic tech team, including affected people, citizens, community groups, and participants who do not write code
- Facilitators and developers introducing SpecDojo to that team

**What you will learn**

- What comprehension debt is and how kata can reduce it
- Which kata to start with and when to add others
- What to preserve first for new and existing systems
- How to mark unverified content with `_ASSUMPTION_` and `_UNDECIDED_`

**What to read next**

- [[specdojo:kata-guide|Kata Guide]] explains rulebooks, recipes, samples, and templates.
- [[specdojo:register-operation-guide|Register Operation Guide]] explains how to record decisions and work.
- [[specdojo:ryu-guide|Practice Guide]] explains `retrofit`, creating documentation from existing systems.

## 1. Comprehension debt and kata

Comprehension debt occurs when the purpose of what was built and the reasons behind it exist only in someone's head. When that person leaves, others cannot take over. Small teams with changing participants often cannot ask the previous developer. The faster AI writes code, the faster unexplained parts can accumulate.

Kata are rules and examples for what to write and in which form. Following them gives future participants and AI a consistent place to find information without asking the original author. This guide uses four stages:

| Stage               | Action                                                                                |
| ------------------- | ------------------------------------------------------------------------------------- |
| Reconstruction      | Create documents from existing code and fragmentary records using kata                |
| Verification status | Mark which reconstructed content has been checked and which is inferred               |
| Human confirmation  | Ask affected people or experienced participants to check and confirm inferred content |
| Recording           | Preserve future reasons in the register when decisions are made                       |

Code mainly reveals what a system does. It cannot recover people's problems, design rationale, or decisions to exclude something. Plausible AI guesses can create an illusion of understanding and hide the debt. Verification status and human confirmation prevent that.

## 2. The starter kata set

Start with these five kata. People who do not code can help write or check each one.

| Order | Kata                   | What to preserve                                                                        | How nonprogrammers participate                                              | Rulebook                                                                   |
| ----- | ---------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1     | Project overview       | Whose problem to solve and for what purpose                                             | Describe problems and purpose in their own words; check the written account | [[specdojo:prj-overview-rulebook\|Project Overview]]                       |
| 2     | Issues and approach    | Causes, chosen direction, and options not selected                                      | Check fit with real work                                                    | [[specdojo:prj-issues-and-approach-rulebook\|Project Issues and Approach]] |
| 3     | Business rules         | Institutional and operational rules, calculations, conditions, exceptions, and evidence | Check rules and exceptions against sources and experience                   | [[specdojo:br-rulebook\|Business Rule]]                                    |
| 4     | System functions index | What the system can do and which problems functions address                             | Identify missing or unnecessary functions                                   | [[specdojo:sf-index-rulebook\|System Functions Index]]                     |
| 5     | Project register       | Decisions, todos, and questions                                                         | Explain reasons and agree to decisions                                      | [[specdojo:pjr-rulebook\|Project Register]]                                |

Why these five:

- The overview and issues/approach preserve the “why” that code cannot recover. Writing them before people leave has the highest value.
- Business rules let affected people and developers check calculations and eligibility judgments common in civic tech in the same table. They require less writing than process specifications and are easier to reconstruct from code, making them the entry point to business specifications.
- The functions index is the minimum shared view of what the system can do. Add detailed function specifications later.
- Record judgments as register decisions rather than separate decision documents. The `dec` kata is deprecated; the register brings decisions, work, and questions together.

## 3. When to add other kata

Do not start with the following. Add one at a time when its triggering problem actually occurs.

| Kata                                                                                                           | When to add it                                                                             |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [[specdojo:gl-rulebook\|Glossary]]                                                                             | The same word has different meanings to different people and conversations break down      |
| [[specdojo:prj-stakeholder-register-rulebook\|Stakeholder Register]]                                           | More people or organizations join and it becomes unclear whom to ask                       |
| [[specdojo:prj-scope-rulebook\|Project Scope]]                                                                 | Disagreements about “Are we doing that too?” require explicit boundaries                   |
| [[specdojo:prj-success-criteria-and-acceptance-criteria-rulebook\|Success Criteria and Acceptance Conditions]] | Funders or partners need an explanation of what counts as success                          |
| [[specdojo:bps-rulebook\|Business Process Specification]]                                                      | Work spans several people or stages and a rules table cannot explain the flow              |
| [[specdojo:bac-rulebook\|Business Acceptance Conditions]]                                                      | Affected people need to define “usable for us” before implementation                       |
| [[specdojo:sf-rulebook\|System Function Specification]]                                                        | One index row leaves developers unsure about inputs, outputs, or exceptions                |
| [[specdojo:uis-rulebook\|User Interface Specification]]                                                        | More screens lead to differing expectations about fields or behavior                       |
| [[specdojo:nfr-index-rulebook\|Nonfunctional Requirements]]                                                    | Personal data, critical availability, speed, safety, or usability need explicit conditions |
| [[specdojo:mm-rulebook\|Meeting Minutes]]                                                                      | The discussion leading to a decision matters; the decision itself fits in the register     |

Consider test kata such as acceptance test catalogs, and migration or operations kata, after the system grows and multiple people develop it.

## 4. What to preserve, in which order

### 4.1. Starting something new

1. Write the project overview. Affected people explain their problems, a facilitator or AI writes using the kata, and those people check it.
2. Write issues and approach, including approaches not chosen and why.
3. Write the function index. Map each function to a problem; functions without a match are candidates to omit.
4. Write business rules for functions being started, including institutional sources or participants' experience.
5. Record decisions and uncertainties as they arise. Use decision for settled choices and question for unsettled ones.

### 4.2. Starting from an existing system (reconstruction)

When a working system exists but its creators or reasons are unavailable, distinguish what code can reveal from what requires interviews.

1. Write the overview through interviews with current participants and affected people. Code cannot recover “why,” so begin with interviews rather than reconstruction. Mark unknowns.
2. Reconstruct business rules and the function index from code. SpecDojo calls this approach `retrofit`.
3. Code confirms only current behavior. Mark inferred rationale and correctness with `_ASSUMPTION_`.
4. Ask affected or experienced people to check marked content. If confirmed, record who checked and when, then remove the marker. If behavior differs from intent, do not force the document to match code; record whether to fix it as a register decision.
5. Write issues and approach when the direction for changes or additions is decided.
6. Continue recording decisions as in step 5 for new work.

To run `retrofit` through the register, file an item and put the code location in its inputs before execution. The path and rulebook below are examples.

```bash
specdojo register add --project <project-id> --type todo --title "Reconstruct benefit eligibility rules" \
  --owner BA --approach retrofit --target <project-id>:br-benefit-eligibility \
  --target-path docs/ja/product/010-business-specs/030-business-model/br-benefit-eligibility.md \
  --target-rulebook specdojo:br-rulebook
```

Replace `<project-id>` with your project's ID. Follow its catalog for deliverable placement when available. See `register add` in the [[specdojo:command-reference|CLI Command Reference]] for options.

## 5. Mark verification status

Even kata-based documents can mix verified content and speculation. Later readers may mistake speculation for fact. Prefix unverified paragraphs with these markers:

| Marker         | When to use                                                            | When to remove                                                               |
| -------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `_ASSUMPTION_` | Inferred or provisional content, especially a “why” inferred from code | After affected or experienced people check it; record checker and date first |
| `_UNDECIDED_`  | Information is sufficient, but nobody has chosen an option             | After a register decision; reference that decision ticket first              |

```markdown
_ASSUMPTION_: The month-end application cutoff may match the municipality's closing date. Inferred from date checks in code; not confirmed with staff.

_UNDECIDED_: Whether household size includes family members living elsewhere. Decide in register item PJR-XXXX.
```

- Absence of a marker is not proof. Without a checker and date in the text, treat the content as unverified.
- Require AI to mark content `_ASSUMPTION_` when it cannot identify evidence in sources, code, or interviews.
- A document's `ready` state does not confirm marked content. A person must review remaining markers before finalization.
- The [[specdojo:document-metadata-standard|Document Metadata Standard]] is authoritative for context-marker notation.

## 6. Do not require every kata

Sustainable Participation means counting participants' time and ongoing burden as costs alongside money, choosing only needed documents, and sharing work. This is why the starter set has five kata and others wait for actual problems.

- Do not fill every chapter of even these five at once. Mark unknown sections with `_ASSUMPTION_` or explain blanks so someone with knowledge can fill them later.
- Add kata when the triggers above actually occur, rather than because they might help someday.
- Share the work: affected people explain and check, facilitators or AI write, developers verify correspondence with code.
- Record decisions to add or stop using kata, with reasons, in the register. Later participants can trace why this set was chosen.
