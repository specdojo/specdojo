---
specdojo:
  id: specdojo:prj-overview-rulebook
  type: rulebook
  deliverable_type: project
  status: draft
  target_format: markdown
  recipe: specdojo:prj-overview-recipe
  sample: specdojo:prj-overview-sample
  template: specdojo:prj-overview-template
  translated_from:
    locale: ja
    commit: dfbdc86b1f7204cadf31b851c20babfbdd42a31c
---

# Project Overview Rulebook

This rulebook defines a consistent format for a project overview, at a level that lets stakeholders agree quickly on what to do, why, and with which guiding principles.

## 1. General policy

- Cover the project's background, necessity, principles, intended outcomes, expected benefits, and premises at an overview level.
- Establish the basis for deciding whether to launch the project and for creating subsequent deliverables.
- Delegate detailed scope, authorization, approval, success and acceptance criteria, design, implementation, and test design as described in “Boundaries with the charter and success criteria.”
- Avoid vague expressions such as “appropriately,” “as much as possible,” and “sufficiently.” Use statements people can agree on.
- For numerical targets, state the measurement method, assessment timing, and whether the value is an initial hypothesis or an agreed target.

## 2. Position in the documentation

`prj-overview` is the concept and overview document from which the stakeholder register (`prj-stakeholder-register`) and project charter (`prj-charter`) start. See the [[specdojo:track-design-guide|Track Design Guide]] for the launch track and the [[specdojo:deliverables-reference|Deliverables Reference]] for its deliverables.

## 3. File naming and IDs

### 3.1. Recommended location

Place the document in a project directory such as `docs/ja/projects/<project-id>/`, under `020-project-definition/`. Follow the [[specdojo:docs-structure-guide|Documentation Structure Guide]]. Subdirectories may hold related diagrams and reference material.

### 3.2. Recommended document ID

Use a unique ID, preferably `<project-id>:prj-overview`, for example `prj-0001:prj-overview`. Quote IDs containing colons in YAML where necessary.

### 3.3. Recommended filename

Use `prj-overview.md`. The Japanese filename may be `プロジェクト概要.md`.

## 4. Recommended frontmatter

### 4.1. Fields

Put all fields under `specdojo:`. Follow `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml` and the [[specdojo:document-metadata-standard|Document Metadata Standard]].

| Field                 | Meaning                                                                | Required |
| --------------------- | ---------------------------------------------------------------------- | -------- |
| `specdojo.id`         | `<project-id>:prj-overview`                                            | Yes      |
| `specdojo.type`       | `project`                                                              | Yes      |
| `specdojo.status`     | `draft` / `ready` / `deprecated`                                       | Yes      |
| `specdojo.rulebook`   | `specdojo:prj-overview-rulebook`                                       | Yes      |
| `specdojo.based_on`   | Existing management policies, institutional sources, or past decisions | No       |
| `specdojo.supersedes` | Documents replaced                                                     | No       |

After creating or updating the document, run `npm run lint:fm` and `npm run lint:md` and resolve all errors. Frontmatter lint also checks that `type` matches this rulebook's `deliverable_type` (`project`).

### 4.2. Maintenance

- List `based_on` only when there are sources directly supporting the document.
- Revise the same document when hypotheses, expected benefits, or premises change. Create a replacement only when the central hypothesis or intended outcomes are fundamentally rebuilt: set `supersedes` to the old ID and deprecate the old document. Follow the metadata standard's lifecycle rules; PO decides replacement, and PM files consequential updates.
- After a revision, check the summaries and references in `prj-stakeholder-register`, `prj-charter`, `prj-scope`, and `prj-success-criteria-and-acceptance-criteria` for consistency.
- When this rulebook's content requirements or benefit time horizons change, update its template, sample, recipe, and existing project overviews that follow it.

## 5. Content requirements

The template is authoritative for heading order, tables, and fields.

| Section                          | Required | Purpose                                                                                           |
| -------------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| Opening sentence                 | Yes      | Define the project or framework in one sentence                                                   |
| Background                       | Yes      | Describe the current situation, context, and structural problems                                  |
| Necessity                        | Yes      | Explain why action is needed now and what happens without it                                      |
| Guiding principles               | Yes      | State working principles and decision criteria                                                    |
| Intended outcomes                | Yes      | State what to provide, for whom, and where it applies                                             |
| Expected benefits                | Yes      | Define effects, indicators, initial hypotheses, and measurement by time horizon                   |
| Initial release indicators       | No       | Check value and viability with representative users before launch                                 |
| Short-term indicators            | No       | Check use, adoption, reuse, and direct improvements after launch                                  |
| Medium- and long-term indicators | No       | Check contributions to business or activity outcomes, continuity, participation, and transparency |
| Premises                         | Yes      | State dependencies, constraints, unchanged conditions, and conditions of use                      |

## 6. Writing guidance

### 6.1. General

Use bullets and only the tables needed. Distinguish facts and observations from assumptions and hypotheses. Make unresolved matters explicit so readers know what to decide next. Summarize matters delegated to later documents and name those documents when useful.

### 6.2. Opening sentence

Directly below H1, explain how the project supports whom to achieve what. Do not list detailed benefits, indicators, or implementation choices here.

### 6.3. Background

Separate the current situation from the problems. Support facts with concrete examples, frequencies, counts, or impacts where possible.

### 6.4. Necessity

Explain why now: deadlines, institutions or contracts, competition, incidents, or reliance on particular individuals. Explain why current methods cannot address the possibilities or problems in the background. Describe problems at a level that connects to principles and outcomes.

If possible, express a central hypothesis: whose problem, which intervention, and what change it should produce. Label it as a hypothesis, and break it into two to four value hypotheses if useful.

### 6.5. Guiding principles

Choose roughly two to five principles. Give each a name, a short explanation, and its meaning for this project. Use them as criteria for making the value hypotheses work, and allow revision through learning. Avoid tying them too closely to a particular development method, tool, or product.

### 6.6. Intended outcomes

List the outcomes to establish or provide. Include intended users, application areas, and publication or reuse policies where needed.

### 6.7. Expected benefits

- Separate value that can be tried before initial release, short-term use after launch, and medium- or long-term business and social outcomes.
- For each time horizon used, define viewpoint, indicator, target, and measurement method. Omit a measurement definition only when omitting that horizon; explain the omission or another assessment time in the text.
- If a target is not yet set, state what to record and when to assess it instead of leaving a blank or “undetermined.”
- Check that each value hypothesis has an initial validation method or a later assessment method.
- Initial indicators must test whether intended users can complete key scenarios, beyond checking that deliverables or features are finished.
- Short-term indicators concern actual use, adoption, reuse, and direct improvements users perceive.
- Longer-term indicators concern the business, operational, or social outcomes the project ultimately supports. Describe a contribution when the outcome cannot be attributed solely to this project.
- State whether numerical targets are assessed at initial release, after operations begin, or after a baseline is established.
- Quality, cost, and delivery may be supporting indicators. Completed deliverables, effort, and deadlines cannot substitute for user value.
- Label the initial-release target column “Target”; use “Initial target” for short- and longer-term hypotheses set before a baseline exists.

### 6.8. Premises

Distinguish conditions that will remain unchanged from dependencies on others. State human decision responsibility, scope of application, disclosure policy, and how users may select only the parts they need. When using AI agents in operations, define their role and the boundary with human judgment.

### 6.9. Boundaries with the charter and success criteria

This section is authoritative for the division of responsibilities:

- Keep background, necessity, principles, outcomes, and expected benefits here.
- Manage approvers, approval dates, delegated authority, approval routes, and evidence links in `prj-charter`.
- Manage agreed acceptance criteria, definitions of done, and GO / Not GO thresholds in `prj-success-criteria-and-acceptance-criteria`. Keep expected benefits and initial hypotheses here.
- Manage detailed scope and exclusions in `prj-scope`.
- Where documents overlap, use a summary and reference instead of duplicating the full text.

## 7. Prohibited content

| Content                                                                                  | Reason                                            |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Database, API, or other detailed design                                                  | Delegate to product specifications and design     |
| Vague claims such as “roughly” or “appropriately”                                        | Cannot be agreed or verified                      |
| Unsupported numerical targets                                                            | Create misleading expectations                    |
| Treating deliverable counts, feature counts, or completion rates alone as business value | Does not assess changes for users or the business |
| Replacing longer-term outcomes with short-term usage counts                              | Reduces the project's ultimate purpose            |
| Detailed authorization, acceptance, or GO / Not GO management                            | Duplicates the documents assigned above           |
| Personal names, contact details, or other information unsuitable for publication         | Documents may be used in public repositories      |
