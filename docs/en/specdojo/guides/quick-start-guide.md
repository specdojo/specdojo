---
specdojo:
  id: specdojo:quick-start-guide
  type: guide
  status: draft
  translated_from:
    locale: ja
    commit: 482fcc65eaf35612371d98d82add6ca59b08224d
---

# Quick Start Guide

This guide walks through SpecDojo as one continuous story, driven by conversations with the orchestrator: installing SpecDojo, setting up the managed repository and Git flow, filing items in the register and running them with AI, creating deliverables from a deliverables catalog with a schedule, and registering a routine.

The guide uses a website product repository, `../landing-page`, as the running example. The todos, issues, and decisions shown here are examples for this guide, not facts about a real project.

Each step has the same structure:

1. **Prerequisites**: what you need before the operation
2. **Conversation**: a dialogue between you and the orchestrator (checking for missing information, proposing, approving, and running)
3. **Results and where to check them**: the files the operation creates or updates, and how to verify them
4. **Collapsed commands and configuration diffs**: CLI commands and configuration diffs folded into `<details>`

> [!NOTE]
> The orchestrator never settles project facts such as owners, due dates, or which option to adopt on its own. It always asks or proposes, and acts only after you explicitly approve.
>
> This is the English translation of the Japanese Quick Start guide, which remains the source of truth. Links to other guides lead to the Japanese documentation until their English versions exist.

**Audience**

- Developers and operators who are new to SpecDojo and want to try the whole flow once: filing work, running it with AI, scheduling, and routine operation

**What you will learn**

- Installing SpecDojo in a project repository, and setting up the managed repository (`../landing-page`) and Git flow branch rules
- Filing a feature (todo), a bug investigation (issue), and a choice between approaches (decision) in the register, and running them in isolation with AI
- Preparing a deliverables catalog (`dct-*.yaml`) and creating deliverables systematically with a schedule
- Registering periodic runs with a routine and wiring them into cron or CI

**What to read next**

- For register item types and state transitions, see the [[specdojo:register-operation-guide|Register Operation Guide (Japanese)]].
- For starting the orchestrator and its safety design, see the [[specdojo:orchestrator-operation-guide|Orchestrator Operation Guide (Japanese)]].
- For isolated runs, see the [[specdojo:exec-worktree-guide|exec worktree Guide (Japanese)]]; for branch rules, see the [[specdojo:branch-workflow-guide|Branch Workflow Guide (Japanese)]].

## 1. Installation and starting the orchestrator

Prepare Node.js 22.17 or later and Git. To keep deliverable updates, register state transitions, and run records out of the product's Git history, SpecDojo uses a **separate-repository layout (Detached Unit)** by default.

```text
landing-page-workspace/
├── landing-page/                    # Existing product repository (the website)
├── landing-page-specdojo/           # SpecDojo project repository
└── landing-page-specdojo-worktrees/ # Per-task worktrees
```

### 1.1. Preparing the workspace and installing

#### Prerequisites

- The workspace directory contains the existing product repository `landing-page/`.
- Node.js 22.17 or later, npm, and Git are available.
- The CLI of the AI provider you use for the orchestrator (Claude Code, Codex, OpenCode, and so on) is installed and logged in.

#### Install and start commands

Create a project repository next to the product repository, install SpecDojo, and answer the `init` questions.

```bash
mkdir -p landing-page-workspace
cd landing-page-workspace
# Create the project repository next to the existing product, landing-page
mkdir landing-page-specdojo
git -C landing-page-specdojo init -b develop
cd landing-page-specdojo
npm init -y
npm install --save-dev specdojo
npx specdojo init
# Commit the initial setup to Git, then add and commit the exec settings
git add . && git commit -m "chore: initialize SpecDojo project"
```

For a minimal setup, answer the interactive `init` as follows (values in `[]` are defaults; press Enter to accept them).

```text
Project ID [prj-0001]:                              <- Enter (prj-0001)
Project name [My Project]: Landing page improvements <- enter a project name
Create a project register? [Y/n]:                   <- Enter (create the register)
Your nickname [owner]: owner                        <- your nickname
Your display name [Project Owner]: Site owner       <- display name
Orchestrator providers (...) [codex]: claude        <- choose the AI tool you use
Delegate work to agents (exec)? [y/N]: y            <- y (enable delegating work to AI)
Create a Dev Container? [y/N]: n                    <- Enter (work on the local machine)
Keep agent sessions running with tmux (macOS / WSL / Linux)? [y/N]: n <- Enter (no tmux)
Create Git hooks with lefthook? [y/N]: n            <- Enter (not in the initial setup)
```

When initialization finishes, it shows the orchestrator start script for the provider you chose. Start the orchestrator with:

```bash
npm run orch:opus
```

Depending on the provider, `npm run orch:sonnet`, `npm run orch:sol`, `npm run orch:opencode`, and others are available. For details, see the [[specdojo:orchestrator-operation-guide|Orchestrator Operation Guide (Japanese)]].

#### Conversation

After it starts, a session with the orchestrator begins in the terminal.

```chat
You: I've installed SpecDojo. I'd like to get this project going.

Orchestrator: I've confirmed that SpecDojo is initialized. The register (controls/project-register/) and the member list (docs/ja/projects/prj-0001/030-project-management/pm-members.yaml, pointed to by projects.prj-0001.members_path) are ready.
  I recommend first connecting the neighboring product repository (../landing-page) as a managed repository, and setting Git flow branch rules so development stays safe.
  Shall I proceed?

You: Yes, please go ahead.
```

#### Results and where to check them

- The basic register structure is created under `docs/ja/projects/prj-0001/controls/project-register/`.
- `orch:<provider>` scripts are added to `package.json`.
- You can now talk to the orchestrator.

To upgrade SpecDojo, use `npx specdojo update` instead of `npm install`. In one run it compares versions, shows the `CHANGELOG.md` entries in between, updates with the package manager that matches your lockfile, and checks the files distributed by `config scaffold` for differences, fixing them interactively. Run `npx specdojo update --dry-run` first to see what it would do. Versions without `update` (up to 0.9.2) stop with `unknown command 'update'`, so for the first upgrade from such a version, call `npx specdojo@latest update` (or `npx specdojo@<version> update` to pick a version). For details, see `update` in the [[specdojo:command-reference|CLI Command Reference (Japanese)]].

#### Collapsed commands and configuration diffs

<details>
<summary>Commands to check the initial setup, and the directory layout (click to expand)</summary>

```bash
# List projects
npx specdojo project list

# Check the created register
ls -l docs/ja/projects/prj-0001/controls/project-register/
```

The generated initial layout:

```text
landing-page-specdojo/
├── .specdojo/
│   ├── specdojo.config.json
│   ├── agent-members.yaml
│   └── exec-defaults.yaml
├── docs/ja/projects/prj-0001/
│   ├── 030-project-management/
│   │   └── pm-members.yaml
│   └── controls/
│       └── project-register/
│           ├── generated/
│           └── events/
└── package.json
```

</details>

### 1.2. Environment patterns

In `init`, you choose whether to use a Dev Container and whether to keep sessions alive with tmux. That gives the six combinations below. First check the prerequisites with `npx specdojo doctor` (Node.js, Git name and email, the agent CLI, and, depending on the pattern, Docker, the Dev Container CLI, or tmux), and install anything missing as shown.

| Pattern             | `init` answer / option                                           | Prerequisite check                          | What is created / how to enter                                                                                                                                                   |
| ------------------- | ---------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dev Container       | `--devcontainer --devcontainer-preset minimal`                   | `npx specdojo doctor --devcontainer`        | `.devcontainer/`. Open it with "Dev Containers: Reopen in Container" in VS Code                                                                                                  |
| Dev Container, tmux | `--devcontainer` (the recommended and full presets include tmux) | `npx specdojo doctor --devcontainer --tmux` | `.devcontainer/` and `.specdojo/host/devcontainer-tmux.sh`. For always-on hosts, see the [[specdojo:remote-host-development-guide\|Always-on Host Development Guide (Japanese)]] |
| macOS               | Default (neither Dev Container nor tmux)                         | `npx specdojo doctor`                       | Use it directly in your local terminal                                                                                                                                           |
| macOS, tmux         | `--tmux`                                                         | `npx specdojo doctor --tmux`                | `.specdojo/host/local-tmux.sh`. Enter the session with `bash .specdojo/host/local-tmux.sh`                                                                                       |
| WSL                 | Default                                                          | `npx specdojo doctor`                       | Use it directly in the WSL terminal                                                                                                                                              |
| WSL, tmux           | `--tmux`                                                         | `npx specdojo doctor --tmux`                | `.specdojo/host/local-tmux.sh`. Enter the session with `bash .specdojo/host/local-tmux.sh`                                                                                       |

Whatever the pattern, the goal for the first 10 minutes is to file your first todo and run it through an agent.

```bash
npx specdojo doctor --tmux          # change the options to match your pattern
npx specdojo init --tmux            # you can also answer interactively
bash .specdojo/host/local-tmux.sh   # tmux patterns only; detach with Ctrl-b d
npm run orch:opus                   # ask the orchestrator to "file the first todo and run it"
```

- With the tmux patterns, the orchestrator and any `exec run` started inside the session keep running even if you close the terminal or lose the connection. Run the same script to re-enter.
- On WSL, keep the working tree in the Linux home directory (for example `~/src`), not on the Windows side (under `/mnt/c`). Paths under `/mnt/c` are slow and prone to file permission problems; `doctor` warns about this. If you use a Dev Container, enable the WSL integration in Docker Desktop.
- Install tmux with `brew install tmux` on macOS, and with `sudo apt install tmux` on WSL and Linux.

## 2. Managed repository and Git flow setup

### Prerequisites

- You are in a conversation with the orchestrator.
- The product repository `../landing-page` is a Git repository with `main` and `develop` branches.

### Conversation

Ask the orchestrator to connect the product repository and set Git flow rules. The orchestrator checks for missing information such as branch names and the integration strategy, and applies the settings after you choose.

```chat
You: I'd like to add ../landing-page next door as a managed repository and run it with Git flow branch rules.

Orchestrator: I'll connect ../landing-page as a product repository (repos) and set Git flow branch rules. Please confirm these settings:
  1. Integration branch (integration_branch): is develop fine? (Git flow separates main for production from develop for day-to-day integration)
  2. Work branch naming (branch_template): is feature/{topic} fine? (for example, feature/add-faq-section)
  3. Integration strategy (integration_strategy): ff (fast-forward) or merge (create a merge commit)? (ff is recommended because it keeps history linear)
  4. Commit subject rule (commit_subject_template): use the Conventional Commits format {type}({scope}): {title}?
  5. Dependency setup (setup): run npm ci for each tracked package-lock.json in isolated worktrees (install: true)?

You: Integration branch develop, work branches feature/{topic}, strategy ff, Conventional Commits subjects as proposed, and install: true for dependencies.

Orchestrator: Understood. I'll add the following to projects.prj-0001.repos in .specdojo/specdojo.config.json:
  - Repository name: landing-page
  - Path: ../landing-page
  - Integration branch: develop
  - Work branch rule: feature/{topic}
  - Integration strategy: ff
  - Commit subject: {type}({scope}): {title}
  - setup: { "install": true, "build": false }
  May I apply this change?

You: Yes, please apply it.

Orchestrator: Settings updated. landing-page is now a managed repository.
  I can generate a VS Code multi-root workspace (prj-0001.code-workspace) that opens the project and product repositories together. Shall I create it?

You: Yes, please.

Orchestrator: Created prj-0001.code-workspace. Open it in VS Code with "File > Open Workspace" to work on both repositories in one window.
```

### Results and where to check them

- The `repos` definition is saved in `.specdojo/specdojo.config.json`, and `../landing-page` is now managed by the project.
- `npx specdojo project list` shows the project ID and the resolved schedule and execution paths. It does not list repos.
- `prj-0001.code-workspace` is created, so you can open both repositories in VS Code at once.

### Collapsed commands and configuration diffs

<details>
<summary>repos configuration diff and CLI commands (click to expand)</summary>

Configuration diff in `.specdojo/specdojo.config.json`:

```json
{
  "projects": {
    "prj-0001": {
      "base_path": "docs/ja/projects/prj-0001",
      "project_register_path": "controls/project-register",
      "catalog_path": "010-deliverables-catalog",
      "schedule_path": "schedule",
      "execution_path": "execution",
      "members_path": "030-project-management/pm-members.yaml",
      "roles_path": "030-project-management/pm-roles.yaml",
      "routines_path": "routines",
      "jobs_path": "jobs",
      "repos": [
        {
          "name": "landing-page",
          "path": "../landing-page",
          "integration_branch": "develop",
          "branch_template": "feature/{topic}",
          "integration_strategy": "ff",
          "commit_subject_template": "{type}({scope}): {title}",
          "merge_message_template": "Merge branch '{branch}' into {target}",
          "setup": {
            "install": true,
            "build": false
          }
        }
      ]
    }
  }
}
```

`install: true` runs `npm ci` for each tracked `package-lock.json`. Commit the updated `.specdojo/specdojo.config.json` to the project's `develop` before running exec.

Matching commands for manual checks and workspace generation:

```bash
# Check project settings and repos
npx specdojo project list

# Generate the VS Code multi-root workspace
npx specdojo config scaffold --workspace --project prj-0001
```

</details>

## 3. Using the register by use case

The register is where you record and track problems, decisions, and work as individual items.
Using `../landing-page`, this section walks through three use cases beginners often meet: a feature (todo), a bug (issue), and a choice of approach (decision).

> [!NOTE]
> The FAQ section, menu bug, and contact form examples are samples for this guide, not facts about a real project.

### 3.1. Filing a feature (todo)

#### Prerequisites

- You want to add a frequently asked questions (FAQ) section at the bottom of the landing page to answer common user questions.
- You want to set a goal and completion criteria and track the work.

#### Conversation

```chat
You: I want to add an FAQ section to the landing page. Please file a todo.

Orchestrator: I'll file a todo for adding the FAQ section. Please confirm the details:
  - Title: "Add a frequently asked questions (FAQ) section"
  - topic (used in the item file name and the work branch name): add-faq-section
  - Priority: is medium (normal) fine?
  - Due date (due_on): do you have a target date? (left blank if undecided)
  - Difficulty (difficulty): I recommend medium, since it follows the existing component structure.
  - Owner (owner): shall I assign a nickname from the member list?

You: Priority medium, owner owner, due 2026-11-30, difficulty medium.

Orchestrator: Understood. I'll file the todo with the following and commit it to the register:
  - Type: todo
  - Title: "Add a frequently asked questions (FAQ) section"
  - topic: add-faq-section
  - Priority: medium, owner: owner, due: 2026-11-30, difficulty: medium
  - Input: the FAQ questions and publishing policy are not settled yet; confirm with the user before implementing
  May I file it?

You: Yes, go ahead.

Orchestrator: Created item PJR-FA01 (example) and committed it to the register.
  Please review the item file docs/ja/projects/prj-0001/controls/project-register/pjr-fa01-add-faq-section.md.
  Writing the questions to publish, the accordion UI behavior, and the mobile checks in the item's "completion criteria" makes the later AI run go smoothly.
```

#### Results and where to check them

- The item file `docs/ja/projects/prj-0001/controls/project-register/pjr-fa01-add-faq-section.md` is created.
- The item is added to `docs/ja/projects/prj-0001/controls/project-register/generated/pjr-index.md` (the register list).
- The item comes with sections for the overview, completion criteria, work, and results.

#### Collapsed commands and configuration diffs

<details>
<summary>CLI command and an example of the created item (click to expand)</summary>

Matching CLI command:

```bash
npx specdojo register add \
  --project prj-0001 \
  --type todo \
  --title "Add a frequently asked questions (FAQ) section" \
  --topic add-faq-section \
  --description "Add an FAQ section at the bottom of the landing page with questions and answers, an accordion UI, and a mobile layout." \
  --priority medium \
  --owner owner \
  --due 2026-11-30 \
  --difficulty medium \
  --input "Confirm the FAQ questions and publishing policy with the user before implementing" \
  --commit-type feat \
  --commit-scope add-faq-section \
  --by specdojo-orchestrator \
  --commit
```

Frontmatter of the created item:

```yaml
---
specdojo:
  id: prj-0001:pjr-fa01-add-faq-section
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: owner
  due_on: "2026-11-30"
---
```

</details>

### 3.2. Investigating and fixing a bug (issue)

#### Prerequisites

- Someone reported that on a smartphone, after opening the navigation menu and tapping a link, the menu overlay does not close.
- You want to record the symptom and reproduction conditions, then investigate and fix it.

#### Conversation

```chat
You: On mobile, after opening the navigation menu, tapping a link doesn't close the menu. I want to file an issue and investigate.

Orchestrator: I'll file an issue for the navigation menu bug. Please confirm:
  - Title: "Investigate and fix the navigation menu not closing on mobile"
  - topic: fix-mobile-nav-close
  - Priority: I recommend high because it affects mobile visitors. What do you think?
  - Owner: is owner fine?
  - Difficulty (difficulty): set medium, since it needs investigation and a fix?
  - Reproduction: do you know the steps or environment to reproduce it?

You: Priority high, owner owner, difficulty medium. It reproduces at a screen width of 768px or less: clicking an anchor link in the menu doesn't trigger the overlay's close handler.

Orchestrator: Understood. I'll file the issue with the following:
  - Type: issue
  - Title: "Investigate and fix the navigation menu not closing on mobile"
  - topic: fix-mobile-nav-close
  - Priority: high, owner: owner, difficulty: medium
  - The reproduction notes go in the item's "problem" section
  May I file it?

You: Yes, please file it.

Orchestrator: Created item PJR-NV02 (example).
  It is also listed in the issue log (docs/ja/projects/prj-0001/controls/generated/pm-issue-log.md).
  Once the investigation and fix are clear, record them in the item's "cause", "impact", and "results" sections.
```

#### Results and where to check them

- The item file `docs/ja/projects/prj-0001/controls/project-register/pjr-nv02-fix-mobile-nav-close.md` is created.
- It is listed in `docs/ja/projects/prj-0001/controls/generated/pm-issue-log.md` (the issue log).

#### Collapsed commands and configuration diffs

<details>
<summary>CLI command and an example of the issue log (click to expand)</summary>

Matching CLI command:

```bash
npx specdojo register add \
  --project prj-0001 \
  --type issue \
  --title "Investigate and fix the navigation menu not closing on mobile" \
  --topic fix-mobile-nav-close \
  --description "At a screen width of 768px or less, choosing a link in the menu does not close the navigation overlay. Investigate and fix it." \
  --input "Reproduction: at a screen width of 768px or less, open the menu and choose an anchor link" \
  --priority high \
  --owner owner \
  --difficulty medium \
  --by specdojo-orchestrator \
  --commit
```

Example of the generated issue log:

```markdown
| ID       | Status | Title                                                         | Priority | Owner |
| -------- | ------ | ------------------------------------------------------------- | -------- | ----- |
| PJR-NV02 | open   | Investigate and fix the navigation menu not closing on mobile | high     | owner |
```

</details>

### 3.3. Comparing approaches and deciding (decision)

#### Prerequisites

- To add a contact form to the landing page, there are several options (an external form service, your own serverless function, a mailto link, and so on), and you want to compare the trade-offs and decide.

#### Conversation

```chat
You: I want to compare a few ways to implement the contact form and decide. Please file a decision so we can discuss it.

Orchestrator: I'll file a decision on how to implement the contact form. Points to confirm:
  - Title: "Compare and decide how to implement the contact form"
  - topic: contact-form-strategy
  - Owner: shall I assign a nickname from the member list?
  - May I lay out these candidate options in the item?
    - Option A: embed an external form service (Formspree, Google Forms, and so on)
    - Option B: implement our own submission with a serverless function (API endpoint)
    - Option C: only show a mailto link or a contact email address

You: Owner owner, and compare those three options.

Orchestrator: I'll file the decision with the following:
  - Type: decision
  - Title: "Compare and decide how to implement the contact form"
  - topic: contact-form-strategy
  - Owner: owner
  May I file it?

You: Please do.

Orchestrator: Created item PJR-CF03 (example). I laid out the pros and cons of each option in the item:
  - Option A: quick to set up and no server to maintain; the trade-off is the external service's terms and limits.
  - Option B: full control over design and behavior, but needs spam protection and backend maintenance.
  - Option C: no implementation effort, but users must open a mail client, and the published address attracts spam.
  Which approach do you want for the first release? Please tell me along with your reason. (The orchestrator never chooses an option on its own.)

You: I want to start quickly and safely with little maintenance, so we'll adopt option A (external form service).

Orchestrator: Understood. May I update the item as follows and mark the decision as decided?
  - Decision: "Option A: adopt an embedded external form service"
  - Reason: "Reduces maintenance effort while handling spam protection"

You: Yes, please close it.

Orchestrator: Closed decision PJR-CF03 as decided.
  It is recorded in the decision log (docs/ja/projects/prj-0001/controls/generated/pm-decision-log.md).
```

#### Results and where to check them

- The item file `docs/ja/projects/prj-0001/controls/project-register/pjr-cf03-contact-form-strategy.md` records the options, the decision, and the reason, and its status becomes `decided`.
- It appears in `docs/ja/projects/prj-0001/controls/generated/pm-decision-log.md` (the decision log).

#### Collapsed commands and configuration diffs

<details>
<summary>CLI commands and an example of the decision log (click to expand)</summary>

CLI commands to file and close:

```bash
# File the decision
npx specdojo register add \
  --project prj-0001 \
  --type decision \
  --title "Compare and decide how to implement the contact form" \
  --topic contact-form-strategy \
  --description "Compare contact form approaches and record the options, trade-offs, and the reason for the choice." \
  --input "Candidates: external form service, own serverless function, mailto link" \
  --owner owner \
  --by specdojo-orchestrator \
  --commit

# Close after editing the item (transition to decided)
npx specdojo register close \
  --project prj-0001 \
  --id PJR-CF03 \
  --status decided \
  --by owner \
  --conclusion "Option A: adopt an embedded external form service (reduces maintenance while handling spam)" \
  --commit
```

</details>

### 3.4. Other item types and the operation guide

Besides the types above, the register has the following types. Use them according to your purpose. For how to choose a type and its state transitions, see the [[specdojo:register-operation-guide|Register Operation Guide (Japanese)]].

| Type             | Main use                                                    | Status when finished         |
| ---------------- | ----------------------------------------------------------- | ---------------------------- |
| `todo`           | Work with defined completion criteria                       | `done`                       |
| `issue`          | A problem to investigate (symptom, cause, impact) and fix   | `done`                       |
| `decision`       | A choice made by comparing options and recording the reason | `decided`                    |
| `question`       | An open question or point to confirm                        | `decided`                    |
| `change-request` | A request to change an agreed specification or scope        | `done`                       |
| `risk`           | A potential hazard or uncertainty to prepare for            | `done`                       |
| `note`           | An observation or memo for later reference                  | `open` (accumulates)         |
| `epic`           | A broad grouping of several pieces of work at track level   | `done` (decided by a person) |
| `handoff`        | A handover when switching sessions or LLMs                  | `done` (received)            |

## 4. Advanced: running one task in a worktree

You can delegate registered work to AI agents (executor and reporter).
To protect your local working tree, SpecDojo runs tasks **in isolation** using Git worktrees.

### Prerequisites

- The FAQ todo filed in 3.1 (`PJR-FA01`) has completion criteria in its item.
- `.specdojo/exec-defaults.yaml` has agent routing, and the required agent CLIs and providers are available. Check the settings created during initialization before running.
- The `develop` branch of the product repository `../landing-page` is ready for work.

### Conversation

Ask the orchestrator to run the filed task in isolation. The orchestrator presents the run mode (worktree), the work branch name, and the integration branch, and runs only after you approve.

```chat
You: I want AI to run the FAQ todo I filed (PJR-FA01). Please do it safely.

Orchestrator: I'll prepare the AI run (exec run) for PJR-FA01. Please review the plan:
  - Isolated run: create a dedicated working environment at ../landing-page-specdojo-worktrees/<the task ID actually assigned>/.
  - Git flow rules: following the configured branch rules, create the work branch feature/add-faq-section in the product repository (../landing-page).
  - Agents: assign the executor and reporter chosen by the configured routing.
  - Integration: integrate with the configured strategy. Before exec starts, I'll confirm the actual integration target and steps.
  May I start the AI run with this plan?

You: Yes, please start.

Orchestrator: The run has started.
  [1/4] Prepared the worktree and created feature/add-faq-section in the product repository.
  [2/4] The executor worked to the approved completion criteria and recorded the results of the applicable checks.
  [3/4] The reporter wrote the run results (evidence and result).
  [4/4] Integrated with the configured strategy and recorded the outcome in the run record.
  Item PJR-FA01 is now in review (waiting for a person to review it). Please check:
  1. The commit log (git log -1) and diff in the product repository (../landing-page)
  2. The result file (docs/ja/projects/prj-0001/execution/runs/register/PJR-FA01/.../result.md)
  3. The FAQ display and accordion behavior on a local development server
  If everything looks good, tell me to close it.

You: I checked the product commit and the local display. The FAQ works as expected. Please finish it.

Orchestrator: I've confirmed the completion criteria are met. May I close PJR-FA01 as done and commit it to the register?

You: Yes, please close it.

Orchestrator: Closed PJR-FA01 as done. Nice work!
```

### Results and where to check them

- On success, the changes are integrated into the configured integration branch. The commit subject's scope is empty unless specified; to get `feat(add-faq-section): ...`, pass `--commit-scope add-faq-section` when filing.
- `result.md` is written to `docs/ja/projects/prj-0001/execution/runs/register/PJR-FA01/<run ID>/`, with the list of changed files and the check records.
- Item `PJR-FA01` moves from `review` to `done`.

### Collapsed commands and configuration diffs

<details>
<summary>Manual CLI commands for the AI run and checks (click to expand)</summary>

Commands to run it by hand:

```bash
# Run one task in isolation in a worktree
npx specdojo exec run \
  --project prj-0001 \
  --register PJR-FA01 \
  --worktree

# Check the integration commit in the product repository
git -C ../landing-page log -1 --stat

# Close the item as done
npx specdojo register close \
  --project prj-0001 \
  --id PJR-FA01 \
  --conclusion "Implemented the FAQ section and checked its display and behavior locally" \
  --commit
```

</details>

## 5. Advanced: from a deliverables catalog to a schedule

This path goes beyond managing individual todos and issues: you plan the landing page's specifications and design documents (requirements, screen design, operating procedures, and so on) as a whole, and create them step by step along their dependencies.

### 5.1. Creating a deliverables catalog

#### Prerequisites

- You want to manage specifications and design documents systematically.
- `catalog_path` (for example `010-deliverables-catalog`) is set in `.specdojo/specdojo.config.json`.

#### Conversation

```chat
You: I'd like a complete, organized set of specifications and design documents for the landing page. How do I start with a deliverables catalog?

Orchestrator: Let me check the current settings. `catalog_path` is not set, so I propose `010-deliverables-catalog` as the location for the deliverables catalog (dct-*.yaml). The next steps also need the schedule and execution output locations, the member list and role mapping, and locations for routines and Jobs. Please review the settings diff.
  Please also confirm the catalog contents:
  - Size (size): generate the small size, which covers a minimal basic set? (you can add or remove deliverables later)
  - Location: place it in catalog_path (010-deliverables-catalog) in .specdojo/specdojo.config.json.
  May I first generate the small catalog skeleton and validate its syntax?

You: First add `catalog_path` if it's not set, and prepare `roles_path`, `schedule_path`, `execution_path`, `routines_path`, `jobs_path`, and the member and role files. After I check the diff and the initial files, generate the small catalog.

Orchestrator: Generated and validated the deliverables catalog, and generated the deliverable skeletons.
  - Created dct-project-definition.yaml (the project definition catalog).
  - Generated the deliverable files referenced by the catalog (under docs/ja/projects/prj-0001/010-deliverables/).
  You can adjust the deliverable definitions in the catalog to fit the project's scope.
```

#### Results and where to check them

- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-project-definition.yaml` is created.
- Markdown deliverable skeletons are generated under `docs/ja/projects/prj-0001/010-deliverables/`.
- Derived catalog views are written to `docs/ja/projects/prj-0001/010-deliverables-catalog/generated/`.

#### Collapsed commands and configuration diffs

<details>
<summary>Catalog operations and the project settings diff (click to expand)</summary>

Example settings keys to add under `projects.prj-0001`. They are resolved relative to `base_path`.

```json
{
  "catalog_path": "010-deliverables-catalog",
  "schedule_path": "schedule",
  "execution_path": "execution",
  "members_path": "030-project-management/pm-members.yaml",
  "roles_path": "030-project-management/pm-roles.yaml",
  "routines_path": "routines",
  "jobs_path": "jobs"
}
```

After initialization, prepare `030-project-management/pm-members.yaml` and `pm-roles.yaml`. Check that `pm-roles.yaml` has the ROLE code `BA`, and with the user's approval, add `BA` to `roles` of the person in `pm-members.yaml` (for example, the person whose nickname is `owner`). Use the ROLE code `BA` for the owner arguments of the strategy, and the person's nickname (`owner` in this example) for `--by` at run time. After changing run settings, commit them to the project repository before starting exec.

```bash
# Generate the catalog from a size template
npx specdojo catalog scaffold --project prj-0001 --size small

# Validate the catalog structure and dependencies
npx specdojo catalog validate --project prj-0001

# Generate the deliverable files the catalog points to
npx specdojo deliverable scaffold --project prj-0001

# Build the Markdown views of the catalog
npx specdojo build --only catalog --project prj-0001
```

</details>

### 5.2. Creating a track strategy

#### Prerequisites

- You create a track strategy, `sch-strategy-<track>.yaml`, that defines the phases, owner roles, and durations for creating the catalog's deliverables.
- The member list of `members_path` (`030-project-management/pm-members.yaml`) and the roles of `roles_path` (`030-project-management/pm-roles.yaml`) are ready.

#### Conversation

```chat
You: I want to create a schedule strategy for producing the catalog's deliverables.

Orchestrator: I'll generate a track strategy (sch-strategy-launch.yaml). Points to confirm:
  - Track name: is launch, for the launch track, fine?
  - Creation owner (default-owner): use the ROLE code BA from pm-roles.yaml?
  - Gate and milestone owners: also the ROLE code BA?
  - Person: I'll check that the person whose nickname is owner in pm-members.yaml has BA in roles.

You: Track launch, and BA as the role for creation, gates, and milestones. The person is owner, and BA is already in their roles.

Orchestrator: Generated sch-strategy-launch.yaml.
  I'll check the generated file and task definitions, and read the task IDs, deliverable paths, dependencies, owners, and execution modes from the actual output.
```

#### Results and where to check them

- `docs/ja/projects/prj-0001/schedule/sch-strategy-launch.yaml` is generated.

#### Collapsed commands and configuration diffs

<details>
<summary>Track strategy generation command (click to expand)</summary>

```bash
npx specdojo schedule strategy generate \
  --project prj-0001 \
  --track launch \
  --default-owner BA \
  --gate-owner BA \
  --milestone-owner BA
```

</details>

### 5.3. Generating the schedule

#### Prerequisites

- The catalog and the track strategy exist.

#### Conversation

```chat
You: I want to generate the schedule and see which tasks I can start now.

Orchestrator: I've checked track launch and the output location (`schedule_path` defaults to docs/ja/projects/prj-0001/schedule). May I run build --only schedule and exec refresh?

You: Yes, please run them.

Orchestrator: Generated the schedule (sch-track-launch.yaml) and ran exec refresh.
  I'll read out the task IDs, deliverable paths, owners, and execution modes of the Ready tasks from the generated output. Don't rely on example IDs or fixed paths; check the actual generated content.
```

#### Results and where to check them

- `docs/ja/projects/prj-0001/schedule/sch-track-launch.yaml`
- `docs/ja/projects/prj-0001/execution/generated/ready.json` (the list of tasks you can start)

#### Collapsed commands and configuration diffs

<details>
<summary>CLI commands to build the schedule (click to expand)</summary>

```bash
# Build the schedule
npx specdojo build --only schedule --project prj-0001 --track launch --force

# Update Ready tasks and the critical path
npx specdojo exec refresh --project prj-0001
```

</details>

### 5.4. Running one task

#### Prerequisites

- After `exec refresh`, there are actual Ready tasks. Check the task IDs registered in the catalog and schedule, and where their deliverables go.

#### Conversation

```chat
You: I want to work on the first Ready task.

Orchestrator: Here are the task ID, deliverable path, owner, execution mode, and input requirements from the Ready list. The task owner is the ROLE code BA, and I've confirmed from the member list that the person with BA in roles has the nickname owner. Please review.
  - Shall I claim this task with --by owner?

You: Yes, I've reviewed it. Please claim it.

Orchestrator: Claimed. Please check the deliverable file shown and where the generated result is.
  When the completion criteria are met, tell me "mark it complete".

You: I've finished editing the deliverable. Please mark it complete.

Orchestrator: Recorded the task ID shown as complete and updated the next Ready tasks.
```

#### Results and where to check them

- The deliverable file and `result.md` under `<execution_path>/runs/schedule/<task-id>/<run-id>/` are recorded.
- `exec refresh` moves the following tasks up to Ready.

#### Collapsed commands and configuration diffs

Replace `<task-id>` with the actual task ID shown in the Ready list, and `<nickname>` with the nickname of the person in `pm-members.yaml` who has the owner role `BA` (`owner` in this example), including the angle brackets. `BA` is a ROLE code used for the strategy's owner arguments, while `owner` in `--by owner` is a person's nickname.

<details>
<summary>CLI commands to run a task (click to expand)</summary>

```bash
# Check the next task
npx specdojo exec scheduler --project prj-0001 --by owner --dry-run

# Claim the task
npx specdojo exec claim --project prj-0001 --task <task-id> --by <nickname>

# After editing the deliverable and result, record completion
npx specdojo exec complete --project prj-0001 --task <task-id> --by <nickname>

# Update Ready tasks
npx specdojo exec refresh --project prj-0001
```

</details>

## 6. Advanced: periodic runs with a routine

Define and automate jobs you want to repeat at fixed intervals, such as a daily sweep of unprocessed todos or periodic checks, as a `routine`.

### Prerequisites

- `routines_path` (for example `routines`) and `jobs_path` are set in `.specdojo/specdojo.config.json`.
- A Job is defined in `jobs_path`, and you have verified the inputs the routine passes, the command it runs, its permissions, and its side effects. If there is none, design, approve, and create the Job before the routine.

### Conversation

Ask the orchestrator to register a periodic routine. The orchestrator checks the frequency and target conditions, then creates and validates the definition.

```chat
You: I want a routine that checks open high-priority todos every day and processes them.

Orchestrator: I'll set up a periodic routine. Please confirm these settings:
  - Routine ID: rtn-daily-register-sweep (I'll check it doesn't clash with existing definitions)
  - Frequency (interval): is once a day, 1d, fine?
  - Target: todos whose status is open and priority is high?
  - Limit per run (limit): cap it at 3 items per run for safety?
  - Job to call: I'll choose a Job that exists in `jobs_path` and whose input spec I've checked. If there is none, we'll discuss its definition, permissions, and side effects and prepare it separately; I won't assume it exists.
  I'll check that the Job accepts the frequency and filter conditions, along with its input schema and side effects. The routine definition is saved where `routines_path` resolves. May I create it with these settings?

You: Yes, create it with those settings.

Orchestrator: Created the definition file. May I validate its syntax and do a dry run?

You: Yes, please validate it and do a dry run.

Orchestrator: routine validate passed, and the dry run correctly picked out the target todos.
  For ongoing operation, call the run command periodically from cron or CI (such as a GitHub Actions scheduled workflow). Would you like a configuration example?

You: Please show me a cron example.

Orchestrator: Here is a cron example that runs due routines at 9 a.m. on weekdays:
  0 9 * * 1-5 cd /path/to/landing-page-specdojo && npx specdojo routine run --project prj-0001 --due
```

### Results and where to check them

- `docs/ja/projects/prj-0001/routines/rtn-daily-register-sweep.yaml` is created (when `routines_path` is the default).
- `npx specdojo routine list` shows the routines, whether each is enabled, and when it last ran.
- Unattended periodic operation through cron or CI becomes possible.

### Collapsed commands and configuration diffs

<details>
<summary>Routine definition file and CLI commands (click to expand)</summary>

The following example follows the schema. Before saving, make sure `job-register-sweep` exists in `jobs_path` and that its input spec and side effects have been checked. If it doesn't exist, replace it with the ID and inputs of a real Job, and design, approve, and create that Job separately before validating.

Contents of `routines/rtn-daily-register-sweep.yaml`:

```yaml
id: rtn-daily-register-sweep
name: Daily sweep of open todos in the register
enabled: true
interval: 1d
action:
  kind: job
  job: job-register-sweep
  inputs:
    types: todo
    priorities: high
    statuses: open
    limit: "3"
```

Matching CLI commands:

```bash
# Validate the routine definition syntax
npx specdojo routine validate --project prj-0001

# List routines
npx specdojo routine list --project prj-0001

# Check the targets with a dry run
npx specdojo routine run --project prj-0001 --id rtn-daily-register-sweep --dry-run

# Run all routines that are due
npx specdojo routine run --project prj-0001 --due
```

</details>
