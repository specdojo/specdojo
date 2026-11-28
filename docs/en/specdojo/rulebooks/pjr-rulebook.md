---
specdojo:
  id: specdojo:pjr-rulebook
  type: rulebook
  deliverable_type: project
  status: draft
  target_format: markdown
  recipe: not-needed
  sample: not-needed
  template: not-needed
  based_on:
    - specdojo:rulebook-authoring-standard
  supersedes:
    - pjr-index-rulebook
  translated_from:
    locale: ja
    commit: f3f8d8a59c8e0cde079c58a013d2442be3a13978
---

# Project Register Rulebook

This rulebook covers individual register tickets (`pjr-XXXX-<topic>.md`), per-item event logs, and the indexes and views generated from them.

## 1. General policy

- Every epic, todo, question, risk, issue, change request, decision, note, and handoff has one ticket.
- Ticket frontmatter is the sole authoritative current value for classification, processing state, priority, owner, dates, conclusion, and origin. H1 is authoritative for the title; the body for description, evidence, history, and response.
- `events/pjr-XXXX.yaml` is the authoritative audit history of creation, transitions, and updates. Validate its consistency with current ticket values; do not recalculate current values from it.
- Generate `generated/pjr-index.md` and all derived views with `register build`. Never edit them directly.
- `<project-id>:pjr-index` identifies `generated/pjr-index.md`. `controls/**/generated/` is included in limited doc-index scanning; run `index build` after `register build`.
- `item_type` classifies a register item; document `type` is `project`. CLI `--type` specifies `item_type`.
- `register add` chooses a template by `item_type` from the table under Content structure. Since frontmatter can declare only one `template`, it uses `not-needed`; the table governs the mapping.
- Types and enums belong to `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml` and `docs/specdojo/schemas/v1/register-events.schema.yaml`. Command selection and examples belong to the [[specdojo:register-operation-guide|Register Operation Guide]]. Do not repeat them here.
- Use project member definitions for roles, and the [[specdojo:document-metadata-standard|Document Metadata Standard]] for approval, revision, retirement, and unresolved matters. Register commands update ticket `status` as described below. Repository formatting and lint do not belong in ticket completion criteria.

## 2. File naming and IDs

### 2.1. IDs

- Display IDs use `PJR-XXXX`: four digits or letters excluding `I`, `L`, `O`, and `U`, for example `PJR-AB12`.
- Document IDs use `<project-id>:pjr-XXXX-<topic>`, for example `prj-0001:pjr-ab12-auth-boundary`.
- Filenames use `pjr-XXXX-<topic>.md`. The basename must match the local document ID. Use lowercase for `XXXX` in filenames and document IDs.
- A topic starts with a lowercase letter or digit and contains only lowercase letters, digits, and single hyphens. No trailing or consecutive hyphens. Choose a short name that identifies the subject.
- Event filenames use lowercase `pjr-XXXX.yaml` without a topic.

### 2.2. Locations

Put tickets directly in `docs/ja/projects/<project-id>/controls/project-register/`, and one event file per ticket in its `events/` directory. Generate the index at `generated/pjr-index.md` and status, priority, owner, and derivation views under the same `generated/`. Generate controls-wide views by `item_type` under `controls/generated/`. Do not make alias copies of generated files.

## 3. Recommended frontmatter

Use schema-defined fields. Omit unknown owner, deadline, completion time, or conclusion instead of saving placeholders; use `due_on: null` only for an explicit absence of a deadline.

| Field             | Meaning                                                           | Required    |
| ----------------- | ----------------------------------------------------------------- | ----------- |
| `id`              | `<project-id>:pjr-XXXX-<topic>`                                   | Yes         |
| `type`            | `project`                                                         | Yes         |
| `status`          | Document maturity: `draft` / `ready` / `deprecated`               | Yes         |
| `rulebook`        | `specdojo:pjr-rulebook`                                           | Yes         |
| `part_of`         | Array containing `<project-id>:pjr-index`                         | Yes         |
| `item_type`       | Item classification                                               | Yes         |
| `track`           | Track owned by an epic; prohibited for other types                | For epics   |
| `domains`         | Epic's domain strings; prohibited for other types                 | No          |
| `item_status`     | Processing state                                                  | Yes         |
| `priority`        | Response priority                                                 | Yes         |
| `difficulty`      | Difficulty for agent routing                                      | No          |
| `owner`           | Principal person or role                                          | No          |
| `registered_at`   | Creation timestamp                                                | No          |
| `due_on`          | Action or decision deadline                                       | No          |
| `start_on`        | Planned epic start date; prohibited for other types               | No          |
| `completed_at`    | Completion, rejection, or decision timestamp                      | Conditional |
| `block_reason`    | Latest reason for entering `waiting`                              | No          |
| `conclusion`      | Summary at termination                                            | No          |
| `derived_from`    | Array of originating register item IDs                            | No          |
| `depends_on`      | Array of predecessor items that must finish before execution      | No          |
| `approach`        | Method for creating or modifying a target                         | No          |
| `target_path`     | Repository-relative deliverable path when no catalog entry exists | No          |
| `target_rulebook` | Target deliverable's rulebook ID                                  | No          |
| `targets`         | Document IDs to change                                            | No          |

- Keep document maturity (`status`) separate from processing state (`item_status`). Omitting `difficulty` enables automatic agent selection.
- An epic is the authoritative overall plan for a track and does not execute itself. A track identifier starts with a lowercase letter or digit and contains lowercase letters, digits, and hyphens. Tracks are unique among project epics and cannot be removed from an epic.
- Only omitted `domains` delegates scope resolution to the compatibility timeline; `[]` explicitly means no domains.
- Derive overall order from inter-epic `depends_on`, scope from `domains`, and duration from `start_on`, start/completion records, and `due_on`. Dependencies must be acyclic. Follow the operation guide's overall-plan rules for start and end dates.
- `block_reason` records the latest waiting or failure reason; `conclusion` summarizes termination. Remove the current `block_reason` when leaving `waiting`; preserve the old reason in events.
- For `derived_from`, use `PJR-XXXX` within the project and `<project-id>:PJR-XXXX` across projects. No self-reference, nonexistent items, or unconfigured projects. Verify other-project existence against that project's local integration branch.
- `depends_on` means execution order; `derived_from` means origin. Never infer or copy one from the other. Apply the same reference and existence rules to both. Reject missing IDs, self-reference, and cross-project cycles before recording and during `register build`.
- Permit execution only when every predecessor is `done` or `decided`. `rejected` and `deferred` do not satisfy dependencies. Do not automatically set `waiting` because of dependencies.

### 3.1. Timestamps and dates

Record creation and termination by completion, decision, or rejection as UTC RFC 3339 timestamps with seconds (`YYYY-MM-DDTHH:MM:SSZ`) in `registered_at` and `completed_at`. `deferred` has no `completed_at`.

`start_on` and `due_on` are project-timezone calendar dates (`YYYY-MM-DD`), not instants. Omit an unknown `start_on`. Index registration and completion dates are display values converted from timestamps using the project's register timezone; do not duplicate them in tickets. Register commands record timestamps and normalize retrospective timezone-qualified input to UTC.

### 3.2. Events and responsibilities

- Git handles storage, distribution, and diff review; commits are not authoritative for reconstructing register history.
- Event files have YAML arrays at the root, appended oldest first. Separate files prevent unrelated parallel item updates from competing for one log.
- Follow the register-events schema for fields and actions. Link each event to the previous event using its ID and before/after `item_status`.
- Record the deciding or approving person's nickname, the executing agent, or a reserved actor. Do not use role codes such as `PO`, or substitute `specdojo-orchestrator` for a human decision maker. Follow the operation guide for accepted names.
- Repeating the same operation on the same current values must not append an event. Do not replace or delete existing events to remove duplicates.
- `register build` verifies one-to-one ticket/event-file correspondence, unique event IDs, chronological order, previous-event links, the transition chain, and agreement between the latest event and ticket state. Do not ignore invalid events to generate a view.

## 4. Content structure

### 4.1. Individual tickets

Use H1 `PJR-XXXX <title>`. Keep every required section for the item type, in order; write `-` rather than removing a section when nothing applies. Required content is considered filled when no `_TODO_` remains outside inline or fenced code. `register close` uses this check for promotion to `ready`.

| `item_type`      | Template                               | Required sections                                                                                          |
| ---------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `epic`           | `specdojo:pjr-epic-template`           | Overview; Scope (track and domains); Completion criteria; Child items; Results; Related documents          |
| `todo`           | `specdojo:pjr-todo-template`           | Overview; Inputs; Completion criteria; Work items; Results; Related documents                              |
| `question`       | `specdojo:pjr-question-template`       | Question; Inputs; Background; Candidate answers; Answer and conclusion; Approval; Related documents        |
| `decision`       | `specdojo:pjr-decision-template`       | Background; Options considered; Decision; Rationale; Approval; Impact and follow-up; Related documents     |
| `note`           | `specdojo:pjr-note-template`           | Note; Background and context; Follow-up; Related documents                                                 |
| `handoff`        | `specdojo:pjr-handoff-template`        | From and to; Valid approval scope; In progress; Awaiting decisions; Cautions; Related documents            |
| `risk`           | `specdojo:pjr-risk-template`           | Risk; Inputs; Impact assessment; Response; Monitoring; Related documents                                   |
| `issue`          | `specdojo:pjr-issue-template`          | Issue; Inputs; Impact; Response; Results; Related documents                                                |
| `change-request` | `specdojo:pjr-change-request-template` | Change request; Inputs; Impact assessment; Review and decision; Implementation tracking; Related documents |

- Inputs record conversational premises, constraints, and delegated scope as bullets, or `-` when absent. Keep them separate from completion or answer criteria. Older tickets without Inputs remain readable; add the section on their first input update.
- Approval records approver, method, and evidence. Choose the method using the operation guide.
- For epics, scope identifies domains and boundaries; completion criteria state how to assess child items and schedule; results record the human completion judgment's evidence.
- Create child todos from an epic and record it in `derived_from`. Epic views show direct children only; do not aggregate states or close automatically.
- Build a handoff's In progress from the register and `exec status` (`specdojo orchestrator handoff` prepares and files it). Awaiting decisions contains references to separate questions or other items. Move enduring approval scope and cautions to the playbook or ticket inputs.
- Related documents identify evidence, affected documents, and follow-up by document ID. Keep unresolved results or conclusions separate from settled ones using `-` or common labels.

### 4.2. Generated indexes and views

| Output                               | Content                                        | Editable |
| ------------------------------------ | ---------------------------------------------- | -------- |
| `generated/pjr-index.md`             | All tickets including `depends_on`             | No       |
| `generated/pjr-views-by-status.md`   | By state                                       | No       |
| `generated/pjr-views-by-priority.md` | By priority                                    | No       |
| `generated/pjr-views-by-owner.md`    | By owner                                       | No       |
| `generated/pjr-derived-items.md`     | Origins and derived items                      | No       |
| `generated/pjr-epic-items.md`        | Direct children and states by epic             | No       |
| `generated/pjr-handoffs.md`          | Pending and received handoffs                  | No       |
| `generated/pjr-dependent-items.md`   | Reverse lookup from predecessors to successors | No       |
| `controls/generated/pm-*.md`         | Management views by `item_type`                | No       |

Standard index columns are ID, State, Title, Description, Type, Priority, Owner, Registered date, Due date, Completed date, Conclusion, Ticket, and `depends_on`. Derive title from H1, description from the body, and other values from frontmatter, converting dates as above. Put changes in tickets and rerun `register build`; do not add custom details or manual fixes to generated views.

## 5. Writing guidance

### 5.1. Tickets

State the facts that required registration, constraints, and action or decision deadline. Give comparable evaluation criteria and evidence for options instead of fixing the conclusion first. Record adopted or implemented scope and explicit exclusions. Results must state evidence of completion and follow-up.

When execution discovers a problem or follow-up requiring another item, always record the origin in `derived_from`. Use the same relationship for todos from decisions; do not duplicate follow-up destinations in decision prose or rewrite legacy prose just for migration.

Declare known document IDs in `targets` for executor coverage checks. Omit when unknown or not fixed. An explicit `approach` requires exactly one target. Resolve it through the catalog first; a new uncataloged document requires both `target_path` and `target_rulebook`. A `*-maintenance` target must be a kata ID of the corresponding type. Reject unresolvable IDs or type mismatches. See the [[specdojo:ryu-guide|Practice Guide]] and [[specdojo:command-reference|CLI Command Reference]] for resolution without a catalog.

### 5.2. Structured fields and generation

Create every item with `register add`; never omit a ticket. Change structured fields with `register update` and states with transition commands. Creation, transitions, updates, and renumbering record current ticket values and per-item events; indexes never write back to tickets.

Use `register renumber` for ID changes and `register update --topic` for topic changes. Keep filenames, document IDs, references, and generated views consistent.

### 5.3. Processing state transitions

#### 5.3.1. Normal terminal states by type

Use normal termination only when the registered purpose has been achieved.

| `item_type`      | Terminal state | Condition                                                                        | `conclusion`                                      |
| ---------------- | -------------- | -------------------------------------------------------------------------------- | ------------------------------------------------- |
| `epic`           | `done`         | A person judges track criteria met using child items and schedule                | Evidence and remaining issues                     |
| `todo`           | `done`         | All ticket completion criteria are met                                           | Work and completion evidence                      |
| `question`       | `decided`      | Answer confirmed; need for follow-up can be judged                               | Confirmed answer                                  |
| `decision`       | `decided`      | Options, rationale, impact, and required approval recorded                       | Decision                                          |
| `note`           | `done`         | Contents moved to another item or document, or no longer needed because obsolete | Destination or reason for obsolescence (required) |
| `handoff`        | `done`         | Next session, LLM, or person has read and received it                            | Summary received                                  |
| `risk`           | `done`         | Risk expired unrealized, or response finished and tracking is unnecessary        | Evidence                                          |
| `issue`          | `done`         | Problem resolved and checks completed                                            | Resolution and checks                             |
| `change-request` | `done`         | Adopted change applied and checks completed                                      | Applied change and checks                         |

- Epics use todo's states and exceptional termination but do not run with `exec run --register`; filters and nightly queues skip them. Execute work through child todos.
- Handoffs use only `open` (awaiting receipt) and `done` (received). Close with the receiver as `--by`. They do not run with exec; filters and nightly queues skip them.
- File pending user answers separately as questions. Closing a handoff does not close those questions.
- An open note is a continuing record, not unhandled work. File separate items for action, answers, or decisions. Close a no-longer-needed note with `register close --conclusion <text>` and use `register reopen` to return it to `open` if needed. Close defaults to `done` when `--status` is omitted; other states such as `decided` are not allowed.

#### 5.3.2. Exceptional termination of tracking

Notes can be closed as `done`, but do not use `rejected` or `deferred`. Except for notes and handoffs, tracking may end before normal completion:

| `item_status` | Condition                                                            | Required record                                       |
| ------------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| `rejected`    | Outside scope, invalid premise, or a confirmed decision not to adopt | Reason and alternative tracking destination if needed |
| `deferred`    | Tracking paused with a resumption condition or reassessment time     | Condition or time                                     |

Do not substitute rejection for completion or a decision. Use `decided` when a question is answered or decision made; reject only when the question or judgment itself is unnecessary. `deferred` is terminal in the state machine but is not completion; resume with `register reopen`. For an accepted risk whose monitoring ends, record acceptance and residual impact in `conclusion` and use `done`. Reject a risk based on a false premise.

#### 5.3.3. Termination without intermediate states

An item may go directly from `open` to a terminal state without `in-progress`, `waiting`, or `review`. Do not backdate `start` for work completed before a person or orchestrator recorded it; runner records starts for exec runs. When no intermediate state exists, record who acted and how in the terminal event's `reason`, and record work and validation in ticket results because no exec plan, result, or evidence exists.

### 5.4. Document maturity transitions

| `status`     | Meaning                                           | Timing                                   |
| ------------ | ------------------------------------------------- | ---------------------------------------- |
| `draft`      | Newly created; required content unsettled         | `register add`                           |
| `ready`      | Required sections settled with no `_TODO_`        | `register close` after the content check |
| `deprecated` | Rejected or discarded; maturity no longer tracked | `register reject`                        |

Follow Individual tickets for required sections. Reopening preserves past results and appends the reason and new progress.

## 6. Prohibited actions

- Do not directly edit generated indexes, auxiliary lists, or controls-wide views.
- Do not introduce index/ticket synchronization, reverse writeback, or criteria for omitting tickets.
- Do not duplicate structured fields in prose or another authoritative source.
- Do not use schema-undefined values for `item_type`, `item_status`, `priority`, or `difficulty`.
- Do not store non-UTC, timezone-free, or date-only values in `registered_at` or `completed_at`.
- Do not omit the topic from document IDs or mismatch IDs and filenames.
- Do not terminate with empty required sections.
- Do not add transitions attributed to actors who did not act just to make records look consistent.
- Do not handwrite, edit, reorder, or delete event logs. Use register commands for corrections without destroying audit events.
