---
specdojo:
  id: specdojo:prj-issues-and-approach-recipe
  type: recipe
  status: draft
  rulebook: specdojo:prj-issues-and-approach-rulebook
  sample: specdojo:prj-issues-and-approach-sample
  translated_from:
    locale: ja
    commit: 1a11fe5c9e6a6a03da73afd96bf51c0392cddb2d
---

# Project Issues and Approach Recipe

Prepare issues and approaches that let stakeholders agree on which problems to address and how.

## 1. How to use this recipe

Inherit intended value from the overview (Why), define priority issues and adopted direction (What), and describe candidates, adoption rationale, and mitigation (How). Use issue and approach IDs to trace from issue through cause and candidate to adoption (Trace). Leave architecture and implementation details out.

Collect notes using the next section, write in the overall procedure's order, then use the review viewpoints and final checks.

## 2. Information to collect

| Item                      | Information                                                  | Source                                            |
| ------------------------- | ------------------------------------------------------------ | ------------------------------------------------- |
| Intended value            | Whose business value to improve; what worsens without action | Project overview                                  |
| Troubling situations      | Actual user or operational events, not solutions             | Interviews and observations                       |
| Boundaries and conditions | Scope, exclusions, premises, and constraints                 | Scope; assumptions, constraints, and dependencies |
| Clues to causes           | Confirmed facts and remaining speculation                    | Observations, deliverables, interviews            |
| Order of criteria         | Relative importance of effect, cost, time, and burden        | Confirm with approver                             |

## 3. Overall procedure

1. Write the issue list and allocate IDs first; causes and candidates depend on them.
2. Describe causes per issue, separating facts and hypotheses.
3. Give at least two approaches, their alternative/complementary relationship, and corresponding issues.
4. Write adoption and rationale in the order of decision criteria.
5. Add trade-offs/risks, next decisions/tasks, and review/change management only if needed.
6. Write the introduction below H1 last: purpose, approver and user roles, and agreement boundaries. Waiting until the approach is clear helps avoid repeating the body.

## 4. Writing each section

### 4.1. Issues

Ask what actually troubles users or operations and whose value suffers if it continues. When a statement begins “There is no…,” ask what happens because of that absence. Refer to the overview rather than copying its background; record issue impacts here.

### 4.2. Causes, including hypotheses

Ask why the issue occurs and whether the cause is verified or inferred. Ask how each hypothesis could be checked; an untestable hypothesis easily becomes unsupported adoption rationale. Investigate information, criteria, procedures, and constraints separately rather than assigning only one cause and narrowing candidates prematurely.

### 4.3. Candidate approaches

Ask whether candidates replace the same judgment or complement one another by addressing distinct causes; ask what each improves and sacrifices. If only one exists, ask “What would we do if we did not choose this?” Delegate detailed evaluation of complete alternatives to `prj-comparison-of-alternatives`, retaining only the question requiring comparison here.

### 4.4. Adopted approach and rationale

Ask which approaches to adopt, what each alone would miss, and which criterion excludes rejected options. Ask the approver for the criterion order first; otherwise reasons tend to become “looks good.” Check whether complementary measures overlap in the issues or causes they handle; overlap may indicate alternatives.

### 4.5. Trade-offs and risks

Ask what is sacrificed or deferred, what failures could occur, and how to mitigate them. Weaknesses against adoption criteria often reveal trade-offs.

### 4.6. Next decisions and tasks

Ask what research, checks, or approvals are needed next, who owns them, what constitutes completion, and when the decision is needed. Look at deferred questions and hypothesis verification methods to avoid omissions.

### 4.7. Review and change management

Ask what change would require revisiting the agreement, what to check, and how to respond. Asking what changes if each causal hypothesis is disproved pairs triggers with responses.

## 5. Going deeper

1. Match each issue's impact to intended value; remove unmatched issues or reconsider the value.
2. Check that every cause has an issue ID and each hypothesis a verification method.
3. Match every candidate to an issue or cause; remove unmatched proposals.
4. Match adoption and rejection rationale to decision criteria.
5. Replace excessive design or technology-selection detail with references to later deliverables.

## 6. Good and bad examples

| Viewpoint  | Good                                                                            | Bad                               |
| ---------- | ------------------------------------------------------------------------------- | --------------------------------- |
| Issue      | Inconsistent recording rules make handoff checks slow                           | No template exists                |
| Cause      | Fact: styles vary by owner; hypothesis: the common format is not understood     | It somehow depends on individuals |
| Candidates | A and B are alternatives for one issue; C complements them for another cause    | Standardize everything            |
| Rationale  | Combine A and C because they address distinct causes and neither suffices alone | A looks good                      |

## 7. Review viewpoints

| Viewpoint              | Check                                                                          |
| ---------------------- | ------------------------------------------------------------------------------ |
| Business value         | Issues and adopted direction correspond to intended value, users, and benefits |
| Stakeholders and usage | Approver, user roles, and agreement scope can be understood                    |
| Reproducible decisions | A later reader can derive adoption from the criterion order                    |
| Delegation             | Architecture, implementation, and technology decisions are not overdeveloped   |

## 8. Final checks

- Trace every issue through causes, candidates, and adoption using IDs.
- Do not state hypotheses as facts.
- Keep identifiable personal or organizational information and private observations out of issues, causes, and risks.
- Use only publishable information. Make unresolved matters and impacts needed for the human PO's publication judgment visible through `_UNDECIDED_` or next tasks.
