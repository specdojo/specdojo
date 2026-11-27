---
specdojo:
  id: specdojo:sf-index-rulebook
  type: rulebook
  deliverable_type: requirement
  status: draft
  target_format: markdown
  recipe: not-needed
  sample: specdojo:sf-index-sample
  template: not-needed
  translated_from:
    locale: ja
    commit: fcbfd74d1352bd5735c65d618aa6695b60b6b76e
---

# System Functions Index Rulebook

`sf-index.md` is the entry point for the overall function structure and its correspondence to business process specifications (BPS), interaction points, and individual function specifications. Use it for scope decisions, function decomposition, and test coverage checks.

## 1. General policy

- Keep one authoritative index per system or agreed scope. State the scope at the beginning when covering multiple systems.
- Start from business process areas. Map every area to functions or explain why it is not computerized.
- Use the six standard index columns for summaries and references. Delegate inputs, outputs, behavior, and acceptance conditions to individual specifications.
- Distinguish system work (recording, validating, generating, launching) from human judgments. Do not count approval or final human decisions as system functions.
- If upstream BPS or interaction specifications do not exist, use verified sources such as the deliverables catalog. Track unverified mappings as unresolved rather than confirmed.
- Follow project member definitions and the [[specdojo:document-metadata-standard|Document Metadata Standard]] for roles, `status`, approval, revision, retirement, and handoffs. Repository formatting and lint are separate from business acceptance.

## 2. Position in the documentation

| Document or information                     | Responsibility                                                                                                                                                        |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sf-index`                                  | Overall structure, coverage, and function ID allocation; this rulebook's subject                                                                                      |
| `sf-<term>`                                 | Individual inputs, outputs, processing requirements, constraints, and acceptance viewpoints; not overall coverage                                                     |
| BPS                                         | Authoritative business triggers, steps, and decisions; the starting point for coverage and allocation                                                                 |
| Interaction specifications (CLIS, UIS, IFX) | Command, screen, or external interface usage, inputs, outputs, syntax, and layout                                                                                     |
| Deliverables catalog                        | Need for individual specifications, dependencies, and completion criteria; register before adding one. If none exists, the index row is authoritative for the summary |

Use the [[specdojo:sf-rulebook|System Function Specification Rulebook]] for individual functions. Inputs here are higher-level purpose and scope, business areas and BPS, interaction specifications, and the catalog. Allocate business work to functions first; use implementation, schemas, and references to check destinations and current constraints.

## 3. File naming and IDs

- Use `sf-index.md` and deliverable ID `sf-index`. Reserve this ID for the index, not individual functions.
- Use `SF-<AREA>-<NN>` for function IDs: an uppercase area abbreviation such as `POS` or `EXEC`, then a two-digit number within the area.
- Never change an allocated ID's meaning or reuse it after retirement or merger. Record why it was removed in unresolved matters or a change record.
- Prefer catalog-declared locations and follow the [[specdojo:docs-structure-guide|Documentation Structure Guide]] for naming and management boundaries.

## 4. Recommended frontmatter

Follow the [[specdojo:document-metadata-standard|Document Metadata Standard]] and `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`. Use `requirement` for `type`, `specdojo:sf-index-rulebook` for `rulebook`, and put the title in H1.

## 5. Content requirements

| Section                   | Required    | Purpose and requirements                                                                                                                               |
| ------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Opening overview          | Yes         | In one to three sentences, state the system, index purpose, and scope                                                                                  |
| 1. Purpose and scope      | Yes         | Relate decisions supported to higher-level purpose; state users' business problems, inclusions, exclusions, and who uses the index for which judgments |
| 2. Function structure     | Yes         | Use the five recommended columns to show responsibilities; identify noncomputerized areas and reasons                                                  |
| 3. System functions index | Yes         | Use one main table with the six standard columns                                                                                                       |
| 4. Unresolved matters     | Conditional | For unverified mappings or missing references, state questions, affected function IDs and references, and interim handling                             |

All business areas must be traceable through both structure and index. If rows lead to the structure and the structure to business areas, do not add a separate coverage table. Large indexes may have area subsections with identical columns.

## 6. Writing guidance

Refer to authoritative higher-level purpose and scope, BPS, and interaction specifications for common matters. Keep allocation and responsibility boundaries in the index.

### 6.1. Purpose and scope

State the business problem and decisions the index supports, with a reference to higher-level purpose. Pair inclusions with exclusions, including human judgment, external product internals, and individual function details where relevant. Identify who uses it for decomposition, implementation scope, tests, and business correspondence.

Good: “The shop representative and developer check sales and inventory responsibilities to reduce missing records at shift changes. Counter recording and reconciliation are included; final ordering decisions are excluded.” Bad: “List system functions,” which leaves decisions and scope unclear.

### 6.2. Function structure

Base areas on business process groupings. Explain combinations or splits where business divisions and system responsibilities differ. Use verbs for system responsibilities, and state approvals, final decisions, and policy choices left to people.

Identify noncomputerized areas and reasons (manual work suffices, an external service handles them, or exclusion was agreed). Explicitly state when none exist.

Recommended columns: Function area / Abbreviation / Business process area / System responsibility / Human judgment.

Good: “Execution cycle: accept tasks, validate, integrate, and record results; business completion approval remains human.” Bad: “Manage tasks,” which has no boundary.

### 6.3. System functions index

| Column                         | Required | Content                                                                                                     |
| ------------------------------ | -------- | ----------------------------------------------------------------------------------------------------------- |
| Function ID                    | Yes      | `SF-<AREA>-<NN>`                                                                                            |
| Function name                  | Yes      | A noun phrase identifying the business responsibility, not a module or command name                         |
| Summary                        | Yes      | One sentence describing inputs and what is finalized, recorded, or generated                                |
| Business process specification | Yes      | BPS IDs or links; list all relevant ones including the representative process                               |
| Interaction point              | Yes      | Screen, CLI group, external interface, or automatic trigger, with specification references; explain if none |
| Individual specification       | Yes      | Link, or an explicit treatment such as “Summarized in this row”                                             |

Rename the interaction column to “Screen” or “CLI” when appropriate. Keep syntax, arguments, and layout in the interaction specification. If an interaction spans functions, use separate rows and note the overlap below the table. Also explain responsibility boundaries that cross business process areas.

Good: “`SF-EXEC-02` Deliverable assessment: a runner independent of the editor evaluates deliverables and records grades and findings.” Bad: “`SF-EXEC-02` grade: grade command,” which does not identify the responsibility.

### 6.4. Unresolved matters

For each question, state affected function IDs and references, downstream design, implementation, and validation impacts, and interim handling. Identify provisional mappings and their evidence when upstream BPS or interaction specifications are absent. Distinguish confirmed coverage evidence (such as catalog dependencies) from unverified details.

Raise mismatches between that coverage evidence and the index scope as questions too. Trace change impact from function IDs to BPS and index, decomposition and component design, interactions and implementation, schemas, generation, operational procedures, and tests. Give reasons for any nonapplicable destinations.

Good: “`SF-INV-01` stock-update responsibility is provisional because BPS is absent. The update owner is not agreed, so dependent design cannot be finalized.” Bad: “Check mappings later,” which identifies neither the question nor affected functions and design.

### 6.5. Acceptance and change impact

When BPS, interactions, or individual specifications are created or revised, or functions added, retired, or merged, recheck affected index rows and structure against downstream decomposition, component design, interfaces, implementation, operational procedures, and tests as applicable. Record results and unmet conditions in review records, then recheck affected rows and references after changes.

| Viewpoint                     | Procedure                                                                         | Pass condition                                                                                                     |
| ----------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Business coverage and purpose | Compare higher-level purpose and business areas with structure and row BPS        | Scope serves the purpose; every area has a function or exclusion reason; summaries agree with BPS responsibilities |
| Function boundaries           | Compare all IDs, area abbreviations, and responsibility notes                     | IDs are unique and match areas; overlaps and external/human boundaries can inform design                           |
| Interactions and detail       | Compare interaction points and individual specifications with sources and catalog | Triggers and authoritative specifications are traceable; detailed functions are distinguished from row summaries   |
| Test subjects                 | Map all IDs to tests; check six required columns and provisional mappings         | No functions are omitted; required content and unverified questions and impacts are identifiable                   |

Good: “Check sales and receiving handoffs to stock checking against BPS, ensuring no duplicate updates and mapping all three functions to tests.” Bad: “All cells are filled, so it is complete,” which does not verify business coverage or boundaries.

## 7. Prohibited content

| Prohibition                                                                       | Reason                                                            |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Building the list from modules or commands without checking business areas        | Hides business omissions and functions without business purpose   |
| Counting human approval or final judgment as a system function                    | Misstates system guarantees                                       |
| Expanding individual inputs, outputs, requirements, or acceptance conditions here | Duplicates individual specifications and obscures where to update |
| Copying command syntax, arguments, layouts, or schema fields                      | Duplicates interaction specifications and schemas                 |
| Linking unregistered individual specifications as if they exist                   | Creates dead links without a creation decision                    |
| Treating unverified mappings or missing references as settled                     | Leaves errors unchecked when upstream documents are created       |
| Reusing or changing the meaning of function IDs                                   | Breaks specifications, tests, and change-record references        |
