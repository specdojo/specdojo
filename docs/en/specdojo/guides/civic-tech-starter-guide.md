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
- How agents create kata documents while people check and decide
- What to preserve first for new and existing systems
- How to mark unverified content with `_ASSUMPTION_` and `_UNDECIDED_`

**What to read next**

- [[specdojo:kata-guide|Kata Guide]] explains rulebooks, recipes, samples, and templates.
- [[specdojo:register-operation-guide|Register Operation Guide]] explains how to record decisions and work.
- [[specdojo:orchestrator-operation-guide|Orchestrator Operation Guide]] explains how to work with the orchestrator in conversation.
- [[specdojo:ryu-guide|Practice Guide]] explains `retrofit`, creating documentation from existing systems.

## 1. Comprehension debt and kata

Comprehension debt occurs when the purpose of what was built and the reasons behind it exist only in someone's head. When that person leaves, others cannot take over. Small teams with changing participants often cannot ask the previous developer. The faster AI writes code, the faster unexplained parts can accumulate.

Kata are rules and examples for what to write and in which form. Documents that follow them give future participants and AI a consistent place to find information without asking the original author. This guide uses four stages:

| Stage               | Action                                                                                |
| ------------------- | ------------------------------------------------------------------------------------- |
| Reconstruction      | An agent creates documents from existing code and fragmentary records using kata      |
| Verification status | The agent marks which reconstructed content is inferred                               |
| Human confirmation  | Ask affected people or experienced participants to check and confirm inferred content |
| Recording           | Have future reasons recorded in the register when decisions are made                  |

Code mainly reveals what a system does. It cannot recover people's problems, design rationale, or decisions to exclude something. Plausible AI guesses can create an illusion of understanding and hide the debt. Verification status and human confirmation prevent that.

## 2. The starter kata set

Start with these five kata. People who do not code can explain or check the content of each one. Agents write the documents; people take part through the flow in `What to preserve, in which order`.

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

Do not start with the following. Ask the orchestrator to file and add one at a time when its triggering problem actually occurs.

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

### 4.1. The basic flow

People do not write kata documents by hand; agents create them. When you ask the orchestrator (the conversational AI that operates SpecDojo), work proceeds as follows:

1. You tell the orchestrator which kata document you want and give it materials: interview notes, institutional sources, or the location of code to examine.
2. The orchestrator files a todo in the register. When creating several kata together, it splits the work into an epic and child todos. You check the completion conditions and approve filing.
3. The orchestrator has an agent create the document with `exec run`. The agent follows the kata's rulebook, marks content without evidence with `_ASSUMPTION_`, and marks undecided content with `_UNDECIDED_`.
4. People read and check the result. If changes are needed, add them to the completion conditions and run again; otherwise instruct the orchestrator to close the item.

People have four roles. Agents do the writing.

| Role            | What it involves                                                                                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Explain         | Tell the orchestrator, in your own words, about problems, purposes, institutional and local rules, and past history               |
| Check           | Read documents created by agents and check them against facts and real work                                                       |
| Decide          | Choose directions and instruct closing todos and epics and finalizing documents (`ready`); only people finalize                   |
| Resolve markers | Check `_ASSUMPTION_` content and have the marker removed; decide `_UNDECIDED_` content in a register decision and have it removed |

### 4.2. Starting something new

1. Affected people explain their problems and purpose, and an agent creates the project overview. Those people read and check it.
2. Have the agent create issues and approach. Explain approaches not chosen and why, and have them preserved.
3. Have the agent create the function index, mapping each function to a problem. People decide whether to omit functions without a match.
4. Have the agent create business rules for functions being started. Give it the location of institutional sources and participants' experience as materials.
5. Tell the orchestrator about decisions and uncertainties as they arise, and have them recorded in the register. Use decision for settled choices and question for unsettled ones.

To start steps 1 to 3 together, have the orchestrator file an epic and child todos as below. IDs and file names are examples.

```chat
You: We are building a reservation system for a children's cafeteria. Please create the first kata documents together, from the project overview to the function index. The material is last week's interview notes (notes/hearing.md).

Orchestrator: I will file an epic and child todos as follows:
  - Epic: Prepare the starter kata documents
  - Child todo 1: Create the project overview
  - Child todo 2: Create issues and approach (run after 1)
  - Child todo 3: Create the system functions index (run after 2)
  Each todo's completion conditions will say to use the interview notes and to mark any "why" not in the notes with `_ASSUMPTION_`. Business rules will be a separate todo once you decide which function to build first. May I file them?

You: Yes, please.

Orchestrator: I filed epic PJR-AB12 and child todos PJR-CD34, PJR-EF56, and PJR-GH78. I will have agents create them with `exec run`, starting with PJR-CD34. May I start?

You: Please start.

Orchestrator: PJR-CD34 has finished and is in review. The project overview has two `_ASSUMPTION_` markers. Please ask the affected people to check them and tell me the results.

You: The first one is correct. The second, "why the service is limited to elementary school children," is because of the venue size. Ms. Tanaka from the organizing team checked it today.

Orchestrator: I will add to the completion conditions: remove both markers and write who checked, the date, and the reason for the second. Then I will run it again, close PJR-CD34, and move on to PJR-EF56.
```

When all child todos are done, a person also instructs closing the epic. See the section on managing track work with epics and child todos (`track の仕事を epic と子 todo で管理する`) in the [[specdojo:register-operation-guide|Register Operation Guide]] for how to file epics.

### 4.3. Starting from an existing system (reconstruction)

When a working system exists but its creators or reasons are unavailable, distinguish what code can reveal from what requires interviews.

1. Have an agent create the overview from what current participants and affected people explain. Code cannot recover “why,” so begin with interviews rather than reconstruction.
2. Have the agent reconstruct business rules and the function index from code. SpecDojo calls this approach, where an agent examines the implementation and creates documents, `retrofit`. Tell the orchestrator where the code is when filing.
3. The agent can confirm only current behavior from code. Have it mark inferred rationale and correctness with `_ASSUMPTION_`.
4. Ask affected or experienced people to check marked content. If confirmed, tell the orchestrator who checked and when, and have the marker removed. If behavior differs from intent, do not force the document to match code; decide whether to fix it and have that recorded as a register decision.
5. Have issues and approach created when the direction for changes or additions is decided.
6. Continue having decisions recorded as in step 5 for new work.

When you tell the orchestrator where the code is, it proposes filing a `retrofit` todo. When reconstructing several kata, it splits the work into an epic and child todos as for new work. IDs and paths are examples.

```chat
You: Please document the eligibility rules from the current benefit eligibility code (under src/eligibility/). The person who wrote it is gone.

Orchestrator: I will file a `retrofit` todo, "Reconstruct benefit eligibility rules." Its completion conditions will say to examine src/eligibility/, to state as fact only the current behavior confirmed in code, and to mark "why it works this way" and "whether that is correct" with `_ASSUMPTION_`. If you also want the function index reconstructed, I will split the work into an epic and two child todos. Which do you prefer?

You: Please include the function index too.

Orchestrator: I filed epic PJR-JK12 and child todos PJR-LM34 (business rules) and PJR-NP56 (function index). I will have agents create them with `exec run`, starting with PJR-LM34. May I start?

You: Please start.
```

The orchestrator uses the commands for filing and execution. See `register add` and `exec run` in the [[specdojo:command-reference|CLI Command Reference]] for details.

## 5. Mark verification status

Even kata-based documents can mix verified content and speculation. Later readers may mistake speculation for fact. Agents therefore prefix unverified paragraphs with these markers. People check the marked content, tell the orchestrator the results, and have the markers removed.

| Marker         | When the agent adds it                                                 | When to have it removed                                                                |
| -------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `_ASSUMPTION_` | Inferred or provisional content, especially a “why” inferred from code | After affected or experienced people check it; have the checker and date written first |
| `_UNDECIDED_`  | Information is sufficient, but nobody has chosen an option             | After a register decision; have that decision ticket referenced first                  |

In a document written by an agent, markers look like this:

```markdown
_ASSUMPTION_: The month-end application cutoff may match the municipality's closing date. Inferred from date checks in code; not confirmed with staff.

_UNDECIDED_: Whether household size includes family members living elsewhere. Decide in register item PJR-XXXX.
```

- Absence of a marker is not proof. Without a checker and date in the text, treat the content as unverified.
- When filing an item, the orchestrator writes into its completion conditions that the agent marks content `_ASSUMPTION_` when it cannot identify evidence in sources, code, or interviews.
- Instructing finalization (`ready`) does not confirm marked content. A person must check for remaining markers before instructing finalization.
- The [[specdojo:document-metadata-standard|Document Metadata Standard]] is authoritative for context-marker notation.

## 6. Do not require every kata

Sustainable Participation means counting participants' time and ongoing burden as costs alongside money, choosing only needed documents, and sharing work. This is why the starter set has five kata and others wait for actual problems.

- Do not fill every chapter of even these five at once. Have the agent mark unknown sections with `_ASSUMPTION_` or explain blanks, so someone with knowledge can explain them later and have them filled.
- Ask for kata to be filed when the triggers above actually occur, rather than because they might help someday.
- Leave writing to agents and limit human work to the four roles in `The basic flow`. Do not concentrate it on one person: affected people explain and check, experienced participants resolve markers, facilitators gather requests to the orchestrator and close instructions, and developers verify reconstructed content against code.
- Have decisions to add or stop using kata recorded, with reasons, in the register. Later participants can trace why this set was chosen.
