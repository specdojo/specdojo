---
specdojo:
  id: prj-0001:xrp-t-business-specs-kata-2-stsd-task-execution-090-20261113t045750z-b765ddd7
  type: exec-plan
  rulebook: none
  task_id: T-BUSINESS-SPECS-KATA-2-stsd-task-execution-090
  name: "完成版レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  owner: BA
  approach: fully-guided
  targets:
    - prj-0001:stsd-task-execution
---

# Review Plan: T-BUSINESS-SPECS-KATA-2-stsd-task-execution-090

## 1. このフェーズで行うこと

対応する rulebook・sample（ifx-cmd は recipe・template も）と代表成果物を読み、型一式の章構成・判断基準・例の充実度・相互整合をレビューする。代表成果物の `done_criteria` だけで完了としない。template は frontmatter の ID から明示的に開く。成果物・型は変更せず、指摘と根拠を review result に残す。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 対象成果物

- `name`: ステータス定義（タスク実行）
- `depends_on`:
  - [[bdd-exec-state]]
  - [[bdd-exec-event]]
- `based_on`（対象成果物の frontmatter）: [[prj-0001:bdd-exec-state]]、[[prj-0001:bdd-exec-event]]
- 個票の `入力`: なし
- `overview`: タスク実行が取り得る状態（todo / ready / doing / blocked / done / cancelled）と状態遷移を一覧・図で定義する
- `path`: `docs/ja/product/010-business-specs/020-data-model/stsd-task-execution.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/stsd-rulebook.md`（`_MISSING_` は `undecided`、`not-needed`、または未整備）
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-BUSINESS-SPECS-KATA-2-stsd-task-execution-090/T-BUSINESS-SPECS-KATA-2-stsd-task-execution-090-20261113T045750Z-b765ddd7/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/product/010-business-specs/020-data-model/stsd-task-execution.md`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.stsd-task-execution.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 実行した（run id: `review-prj-0001-T-BUSINESS-SPECS-KATA-2-stsd-task-execution-090-20261113T045236Z`）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 79
- `graded_at`: 2026-11-13T04:57:50.469Z（`graded_by`: sol-review-executor）
- finding 件数: blocker 0 / major 5 / minor 11 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-cross-document-consistency` | 2 | 50 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 3 | 75 |
| `vp-ba-business-value` | 4 | 100 |
| `vp-ba-requirements-completeness` | 2 | 50 |
| `vp-ba-stakeholder-clarity` | 3 | 75 |
| `vp-dev-change-impact` | 3 | 75 |
| `vp-dev-implementation-readiness` | 2 | 50 |
| `vp-dev-testability` | 3 | 75 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 4 | 100 |
| `vp-ops-release-readiness` | 3 | 75 |
| `vp-pm-control-reporting` | 3 | 75 |
| `vp-pm-dependency-risk` | 3 | 75 |
| `vp-pm-plan-feasibility` | 3 | 75 |
| `vp-po-decision-readiness` | 2 | 50 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-config-validity` | 4 | 100 |
| `vp-qe-done-criteria` | 3 | 75 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 2 | 50 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |
| `vp-ux-user-flow` | 3 | 75 |

finding:

- `F001` [major/`vp-po-decision-readiness`; line=42]: Record the unresolved choice between claimant-based authority and latest-event-author authority, identify the affected transitions and compatibility consequences, and assign a human decision owner and decision timing; PO cannot approve the permission model while this business rule remains implicit.
- `F002` [minor/`vp-pm-plan-feasibility`; line=42]: Add a linked follow-up identifying the responsible Role codes and decision timing for defining actor authority, so the remaining specification work can be assigned and sequenced before implementation and acceptance testing.
- `F003` [minor/`vp-pm-dependency-risk`; line=17]: Identify prj-0001:bdd-exec-state and prj-0001:bdd-exec-event as unavailable upstream inputs and record the interim evidence, reconciliation trigger, and impact on downstream implementation and test design.
- `F004` [minor/`vp-pm-control-reporting`; line=42]: Link the actor-authority gap to a PJR record that distinguishes the observed implementation issue from the business decision and any resulting change request, with responsible Role codes and the reporting destination.
- `F005` [major/`vp-ba-requirements-completeness`; line=42]: Define who qualifies as the assigned actor after claim, another actor's unblock, a human forced block, and note/link/estimate events; the current permission conditions do not let users determine who may complete, block, or release an existing task.
- `F006` [minor/`vp-ba-stakeholder-clarity`; line=7]: Provide a link to the catalog's BA, PO, ARC, QE, and DEV confirmation responsibilities and identify who agrees the unresolved permission contract, without expanding the operational purpose paragraph into an approval procedure.
- `F007` [major/`vp-arc-cross-document-consistency`; line=42]: T-03 says the specified actor acquires work authority, and this paragraph grants subsequent operations to the assigned actor, but src/exec/events.ts foldEventsToState overwrites last_by for every event, including note/link/estimate, and canCompleteTask, canBlockTask, and canReleaseTask authorize against last_by. Consequently, A claiming a task followed by B adding a note gives B those permissions; reconcile this behavior with the documented actor contract.
- `F008` [minor/`vp-arc-technical-constraints`; line=19]: Identify the canonical same-timestamp replay-order contract or link to readAllEventFiles and orderSameTimestampEventsByState in src/exec/events.ts; ordering events only by whether a transition is valid omits the implementation's event-type priorities, path tie-break, and candidate-selection rules.
- `F009` [major/`vp-dev-implementation-readiness`; line=42]: Define how the assigned actor is established, retained, and transferred across claim, block, unblock, human overrides, and non-state-changing events. The current text does not specify whether authority follows the claimant or the latest event author, so DEV cannot implement the permission-dependent transitions consistently with both this document and the current guards.
- `F010` [minor/`vp-dev-change-impact`; line=42]: Expand the actor-related impact beyond T-05: enforcing assigned-actor authority also affects replay metadata and the complete, block, and release guards in src/exec/events.ts. Identify T-04, T-06, T-07, T-08, T-16, and T-17 as affected and record the compatibility implications for histories containing note/link/estimate events by another actor.
- `F011` [minor/`vp-dev-testability`; line=19]: Add a verification reference identifying the relevant checks and expected outcomes, such as exec validate for event records, tests/src/exec/events.test.ts for replay and guard behavior, and the Markdown/frontmatter/Mermaid checks for this document; readers currently have no linked verification procedure.
- `F012` [minor/`vp-qe-done-criteria`; line=42]: Extend the unmet-condition record to include the undefined actor-authority contract across T-04, T-06, T-07, T-08, T-16, and T-17, and identify its effect on DC-001, DC-003, and DC-005; the current T-05-only actor discussion does not explain the full remaining acceptance gap.
- `F013` [major/`vp-qe-verifiability`; line=42]: Specify which recorded actor must be compared with the requesting actor and whether note/link/estimate may change that identity. Without this rule, a claim by A followed by a note from B has no unambiguous document-defined permission oracle for completion, blocking, or release.
- `F014` [minor/`vp-qe-omissions-consistency`; line=42]: Restore an unresolved-items memo for the actor-authority boundary and upstream-dictionary reconciliation, including affected states or transition IDs, decision makers, and decision timing; omitting the memo does not establish that these known gaps are resolved.
- `F015` [minor/`vp-ux-user-flow`; line=19]: Replace the unlocated reference to the examined resume check with a link to the target's catalog evidence_refs or the relevant src/exec/events.ts functions, and provide the same navigation for the claim and completion observations; the referenced dictionaries are unavailable and cannot lead readers to this evidence.
- `F016` [minor/`vp-ops-release-readiness`; line=70]: Link the draft's ready decision to resolution or explicit disposition of the actor-authority gap, reconciliation with the unavailable upstream dictionaries, and human approval and publication checks, so task completion cannot be mistaken for readiness of this specification.

## 4. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | BA | vp-ba-requirements-completeness | ステータス名・意味・成立条件と、遷移・イベント・条件が業務観点で正確に定義されていること |
| DC-002 | PO | vp-po-purpose-alignment | 状態遷移の業務的妥当性を承認できること |
| DC-003 | ARC | vp-arc-technical-constraints | 状態遷移実装の基礎として参照できること |
| DC-004 | QE | vp-qe-verifiability | 状態ベースのテスト設計に活用できること |
| DC-005 | DEV | vp-dev-implementation-readiness | 状態管理実装の参照として使えること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 5. 進め方

fully-guided のタスクは、宣言された文書だけを参照し、rulebook / recipe / sample に沿って既存成果物を磨き込むことを求めた。下書きや調査による新しい値の選定は draft の役割である。磨き込みでは template を読み込まない。rulebook の必須要素・禁止事項、recipe の問い、sample の形式との整合は grade が評価済みである。review はこれらを照合し直さず、評価結果の finding として扱う。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備）:

- rulebook: `docs/ja/specdojo/rulebooks/stsd-rulebook.md`
- recipe: `docs/ja/specdojo/recipes/stsd-recipe.md`
- sample: `docs/ja/specdojo/samples/stsd-sample.md`
- 併せて適用する rulebook（記法など）: `docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md`

1. フェーズ説明と完了条件が求めた磨き込みが、対象成果物に行われたかを確認する。
2. 実践の型の欠落（`_MISSING_`）や内容の薄さがある場合は、実行記録にその扱いが残っているかを確認する。実践の型そのものの整備が必要な場合は、改善指示に残す。
3. finding が残っている場合は、このタスクの完了を妨げるかを判断する。rulebook の必須要素の欠落や禁止事項への抵触など、完了条件に直結する finding は完了を妨げる。

確認に用いてよい文書は、宣言された文書だけに限る。具体的には、評価結果、対象成果物、本セクションの参照ファイル、`depends_on` 成果物、対象成果物の frontmatter の `based_on`、プロジェクトコンテキスト（`project_context`）、個票の `入力`、カタログの `brief`、実行記録である。`入力` と `brief` は値が無いときは載せない。これらに宣言されていない他のプロジェクト文書や外部の情報を独自に探索・参照しない。

本タスクの実行に必要な fully-guided の確認方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や edit への適用）を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

## 6. 完了手順

1. 共通規約の `review の判断手順` に従い、評価結果の鮮度を確認してから完了可否を判断する。
2. result の各セクションを埋める。`評価結果の確認` には鮮度確認のコマンドと出力、grade の `verdict` / `score` / finding 件数を書く。`判断根拠` には照合した内容を、`未充足事項・改善指示` には未充足事項と改善指示を書く。`approach に応じた確認` には前章で確認した内容を、`decision` には `verdict` を書く。review result の記入はタスク完了に必須であり、未記入のまま終了しない（詳細は共通規約を参照）。
3. 文書の参照は `[[id]]` 形式（Obsidian wikilink）で記載する。行番号アンカー（`#L12-L18` など）や絶対パスは使わない。位置の補足が必要な場合は本文で述べる。
4. verdict が `complete` 以外でも、review result を記録できた場合は正常終了する（終了コード 0）。

## 7. 異常終了の条件

- 対象ファイル不明・依存未解決・result 更新不能など、review 自体を完了できない場合は異常終了する（終了コード 1）。評価結果が最新でない・評価不能であることは異常終了の理由にせず、verdict として記録する。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:13f1d90345b0d1f0bd602cc3e3f06afa7d772eb714e855b6103c85854bebda59` `docs/ja/projects/prj-0001/execution/conventions/13f1d90345b0d1f0bd602cc3e3f06afa7d772eb714e855b6103c85854bebda59.txt`
