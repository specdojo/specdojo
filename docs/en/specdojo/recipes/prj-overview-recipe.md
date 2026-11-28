---
specdojo:
  id: specdojo:prj-overview-recipe
  type: recipe
  status: draft
  rulebook: specdojo:prj-overview-rulebook
  sample: specdojo:prj-overview-sample
  translated_from:
    locale: ja
    commit: bdf7f34f3a943652ce801fd49e80411a49641052
---

# Project Overview Recipe

Prepare an overview that lets readers quickly understand the basis for launching a project. This recipe provides questions, ways to investigate further, examples, and review viewpoints.

## 1. How to use this recipe

Sketch the project hypothesis first. Answer each section's questions to develop background, necessity, principles, outcomes, benefits, and premises. Finally check for vagueness and excessive detail belonging in later documents.

Organize users' problems, inaction risks, and intended value (Why); intended state and benefits (What); and the central hypothesis and criteria (How). Keep background, necessity, outcomes, and benefits traceable (Trace). Delegate detailed scope, acceptance, and design.

## 2. Information to collect

Start with short notes rather than trying to be precise immediately.

| Item                     | Information                                               |
| ------------------------ | --------------------------------------------------------- |
| Name                     | A name that identifies the project                        |
| Domain                   | Activities, business, services, or systems covered        |
| Current situation        | What is happening now                                     |
| Problems                 | Who struggles with what                                   |
| Inaction risk            | What worsens without intervention                         |
| Central hypothesis       | Whose problem, which intervention, and what change        |
| Intended state           | What capability would constitute progress                 |
| Decision criteria        | Important principles and commitments                      |
| Initial-release benefits | Value representative users can test before launch         |
| Short-term benefits      | Use, adoption, reuse, and direct improvement after launch |
| Longer-term benefits     | Continuity of the business or activity and social effects |
| Premises and constraints | Unchanged conditions, dependencies, unresolved matters    |
| Disclosure policy        | What to publish or withhold and intended reusers          |

## 3. Overall procedure

1. Define the project with H1 and a one-sentence introduction.
2. Separate the current situation and problems in Background.
3. Explain why action is needed now; express the central hypothesis if useful.
4. Choose two to five guiding principles.
5. List the intended outcomes.
6. Separate initial-release, short-term, and longer-term benefits, with measurement methods.
7. State scope of application, unchanged conditions, dependencies, human responsibility, disclosure, selection policy, and unresolved matters. If using AI in business operations, define its role and human boundary.
8. Check that details are delegated to later documents.

## 4. Writing each section

### 4.1. Opening sentence

Ask what the project supports, who uses it or is affected, and how it brings about the intended state. Use a form such as “A is a D that supports C through B.” Keep detailed benefits, indicators, and implementation out, so the reader understands the subject within ten seconds.

Good:

> The Kinuya candy shop sales management system supports small-shop operations by bringing counter sales, stock, and regular customers' credit together so the owner can keep daily work manageable alone.

Bad:

> A convenient system that improves shop operations appropriately.

### 4.2. Background

Ask what is happening, who struggles in which task, how often it recurs, and what impact is already visible. Give one or two paragraphs of context followed by concrete problems. Label inferred parts as hypotheses.

Good: popular products run out more often; purchasing timing and quantities rely on intuition, causing uneven stock; substitute shopkeepers cannot quickly check sales, stock, and credit. Bad: “Things are difficult and operations need improvement.”

### 4.3. Necessity

Ask what worsens without action, which opportunity is lost by waiting, whose burden or risk grows, and what minimum condition must stabilize first. Ask whose problem an intervention addresses and what value it should create.

Explain inaction risks and reasons to begin rather than repeating Background. Include deadlines or busy seasons. Avoid circular reasoning such as “necessary because it is needed.” If several values must work together, express a central hypothesis with identifiable component value hypotheses.

### 4.4. Guiding principles

Ask what wins when choices are difficult, what not to overdo, which value the method protects, and which principles affect later scope, design, and acceptance.

Choose two to five principles, each with a name and one sentence. Japanese names alone are acceptable; when adding English names for Japanese readers, provide a meaningful translation.

1. **Record first**: prioritize continued daily records over advanced analysis.
2. **Operate without hesitation**: minimize screens and input fields.
3. **Start small and improve**: limit initial release to one shop's counter operations.

### 4.5. Intended outcomes

Ask what capability makes the project worthwhile, whose work becomes easier, what to consider initially, and what later documents must detail. Describe the desired state rather than only feature names. Delegate detailed scope and exclusions to `prj-scope`. Roughly four to six bullets are readable.

Good: bring sales, stock, and customer credit into one simple process; let family shopkeepers check stock and balances using the same procedure. Bad: list product master, sales, stock, customer search, and monthly report screens to build.

### 4.6. Expected benefits

Separate value tested before launch, use after launch, and longer-term business or social outcomes.

Ask what can be judged at initial release; whether intended users can finish key scenarios without explanations or special help; how to assess use, adoption, reuse, and direct improvement afterward; and which ultimate outcomes matter. Ask how to check contribution when external factors prevent sole attribution, whether targets are hypotheses or commitments, and whether measurement is reproducible.

For initial release, observe task completion, serious obstacles, time, and help needed by representative users. Finished deliverables and features are acceptance conditions, not sufficient measures of user value. Relate quality, cost, and delivery indicators to task completion or business effects.

For short-term benefits, use actual use, continuation, reuse, and perceived improvement. With small early populations, begin with cumulative counts and concrete cases.

For longer-term benefits, consider sales, stockouts, burden, continuity, contribution to social problems, participation, and transparency. Assess before/after changes and contribution without claiming sole causation.

Do not impose all three horizons. Remove a heading and table when that horizon is not used, and explain why or when assessment occurs instead. Each retained horizon needs viewpoint, indicator, target, and measurement.

| Horizon         | Viewpoint       | Indicator                                                     | Target / initial target         | Measurement and timing                                                  |
| --------------- | --------------- | ------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------- |
| Initial release | Task completion | Shop representative completes sales, stock, and credit checks | 100% of required tasks          | Before-release scenario trial; record results and support needed        |
| Short term      | Adoption        | Share of business days with sales, stock, and credit records  | At least 90% (hypothesis)       | Count recorded days for two weeks after launch and assess at period end |
| Longer term     | Fewer stockouts | Popular-product stockouts                                     | 50% below baseline (hypothesis) | Baseline: one month before operations; compare monthly afterward        |

In deliverables, use a separate template table per horizon. Put timing in its introduction or measurement column. Use “Target” for initial-release trial values and “Initial target” for short- and longer-term hypotheses before a baseline exists; explain their status in prose too.

Revise indicators when it is unclear what is counted. Relative targets need a comparison basis. If measurement is not yet possible, state what to record for later assessment rather than only “undetermined.”

### 4.7. Premises

Ask what is initially included and excluded, what stays unchanged (organization, procedures, ways of working), and which parties or conditions the project depends on. Identify consequences for deliverables or schedule if dependencies fail.

Ask which human role owns final judgment and accountability; if using AI, how far its support goes. Identify what documents or deliverables may be published, what must be withheld, why that boundary was chosen, and what humans must check beforehand. Ask what users may adopt or omit and where or when unresolved matters will be decided.

Separate unchanged premises, dependencies, decision responsibility, disclosure, selection policy, and unresolved matters. Explain nonapplicability in a sentence. Add the AI boundary only where AI is used in operations.

Pair dependencies with fulfillment conditions; hand significant failures to later documents as risks or unresolved matters. Humans retain final judgment and accountability; AI supports them. Describe categories of excluded private or confidential information without including the information itself. Mark undecided matters with `_UNDECIDED_:` and decision timing.

## 5. Going deeper

1. Identify who struggles.
2. Record recurring events as facts.
3. State deterioration without action.
4. Decide the minimum viable initial state.
5. Connect problems, interventions, and expected changes in central and value hypotheses.
6. Choose two to five decision criteria.
7. Separate before-release trial indicators, short-term indicators, and longer-term tracking.
8. Extract details belonging to later documents.

## 6. Good and bad examples

| Viewpoint  | Good                                                                                | Bad                                        |
| ---------- | ----------------------------------------------------------------------------------- | ------------------------------------------ |
| Opening    | Small-shop support combining sales, stock, and credit                               | A convenient shop system                   |
| Background | Stockouts, uneven inventory, and missed credit records occur                        | People are struggling                      |
| Necessity  | Continuing paper operations increases continuity risks                              | Build it soon                              |
| Principles | Daily recording before advanced analysis                                            | Easy and feature-rich                      |
| Outcomes   | Family members can check stock and credit consistently                              | Build a stock screen                       |
| Benefits   | Initial task completion, short-term recording adoption, longer-term fewer stockouts | Finish features and make things convenient |
| Premises   | Exclude e-commerce, multiple shops, and full accounting integration initially       | Handle anything as needed                  |

## 7. Review viewpoints

| Viewpoint                 | Check                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Readability               | H1 and the introduction identify the project                                                               |
| Concrete background       | Situation, problems, and impacts are specific                                                              |
| Necessity                 | Inaction risks and timing connect to Background                                                            |
| Consistent hypothesis     | Central and value hypotheses connect to principles and benefits                                            |
| Decision criteria         | Principles help later scope and design decisions                                                           |
| Outcome level             | Outcomes are more than a feature list                                                                      |
| Measurability             | Indicators, targets, methods, and timing are clear                                                         |
| Time horizons             | Effects are neither mixed nor unintentionally omitted                                                      |
| User value                | Use, business, or social change appears beyond completion rates                                            |
| Responsibility boundaries | Authorization, acceptance, and detailed scope are delegated                                                |
| Premises                  | Unchanged conditions, dependencies and failure impacts, selection policy, and unresolved matters are clear |
| Judgment                  | Humans retain final judgment and accountability; AI support is bounded                                     |
| Publication               | Disclosure boundaries are clear and no private or confidential information is included                     |

## 8. Final checks

- All sections in the procedure are present and their purpose is apparent.
- Numerical targets have methods and timing, with hypothesis/commitment status clear.
- Omitted time horizons have a reason or alternative assessment timing.
- Indicators connect user value to wider effects across retained horizons.
- Initial hypotheses, unresolved matters, and delegated details remain distinct.
- Detailed scope, acceptance, authorization, and design are not overdeveloped.
- Where used, the central hypothesis's users, problems, intervention, and change correspond consistently to outcomes, criteria, and benefits.
