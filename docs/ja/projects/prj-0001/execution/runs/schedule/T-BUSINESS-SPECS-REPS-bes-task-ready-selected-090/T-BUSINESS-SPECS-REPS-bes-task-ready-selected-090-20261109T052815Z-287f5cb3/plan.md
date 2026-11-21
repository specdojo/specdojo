---
specdojo:
  id: prj-0001:xrp-t-business-specs-reps-bes-task-ready-selected-090-20261109t052815z-287f5cb3
  type: exec-plan
  rulebook: none
  task_id: T-BUSINESS-SPECS-REPS-bes-task-ready-selected-090
  name: "完成版レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  owner: BA
  approach: fully-guided
  targets:
    - bes-task-ready-selected
---

# Review Plan: T-BUSINESS-SPECS-REPS-bes-task-ready-selected-090

## 1. このフェーズで行うこと

完成版を変更せず、実践の型と done_criteria、先行成果物との整合を照合する。判定結果と修正対象候補を根拠付きで review result に記録する。

## 2. 対象成果物

- `name`: 業務イベント仕様（実行可能タスクの選択）
- `depends_on`:
  - [[bes-index]]
  - [[cdfd-overview]]
  - [[prj-0001:stsd-task-execution]]
- `based_on`（対象成果物の frontmatter）: [[cdfd-overview]]、[[prj-0001:stsd-task-execution]]
- 個票の `入力`: なし
- `overview`: 実行可能なタスクが選択されたイベント（単発／自動／並列など起点が一意にならない）を定義する
- `path`: `docs/ja/product/010-business-specs/030-business-model/bes-task-ready-selected.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/bes-rulebook.md`（`_MISSING_` は `undecided`、`not-needed`、または未整備）
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-BUSINESS-SPECS-REPS-bes-task-ready-selected-090/T-BUSINESS-SPECS-REPS-bes-task-ready-selected-090-20261109T052815Z-287f5cb3/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/product/010-business-specs/030-business-model/bes-task-ready-selected.md`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/bes-task-ready-selected.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 実行した（run id: `review-prj-0001-T-BUSINESS-SPECS-REPS-bes-task-ready-selected-090-20261109T052705Z`）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 78
- `graded_at`: 2026-11-09T05:28:15.460Z（`graded_by`: luna-review-executor）
- finding 件数: blocker 0 / major 2 / minor 21 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-cross-document-consistency` | 3 | 75 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 3 | 75 |
| `vp-ba-business-value` | 3 | 75 |
| `vp-ba-requirements-completeness` | 3 | 75 |
| `vp-ba-stakeholder-clarity` | 3 | 75 |
| `vp-dev-change-impact` | 3 | 75 |
| `vp-dev-implementation-readiness` | 3 | 75 |
| `vp-dev-testability` | 3 | 75 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 3 | 75 |
| `vp-ops-release-readiness` | 3 | 75 |
| `vp-pm-control-reporting` | 3 | 75 |
| `vp-pm-dependency-risk` | 3 | 75 |
| `vp-pm-plan-feasibility` | 3 | 75 |
| `vp-po-decision-readiness` | 3 | 75 |
| `vp-po-publication-accountability` | 3 | 75 |
| `vp-po-purpose-alignment` | 3 | 75 |
| `vp-qe-config-validity` | 4 | 100 |
| `vp-qe-done-criteria` | 1 | 25 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 3 | 75 |
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 3 | 75 |
| `vp-ux-user-flow` | 4 | 100 |

finding:

- `F001` [minor/`vp-po-purpose-alignment`; line=43]: Resolve the event’s scope across schedule, register, and routine task flows, or state a supported boundary, so readers can determine which task selections this specification covers.
- `F002` [minor/`vp-po-decision-readiness`; line=22]: Name the decision owner and decision timing for whether automated selection and claim share one business event boundary.
- `F003` [minor/`vp-po-publication-accountability`; line=4]: Identify the human PO responsible for approving the event definition and its publication readiness.
- `F004` [minor/`vp-pm-plan-feasibility`; line=43]: Add an owner role and decision timing for resolving the task-flow scope before this event can be treated as complete.
- `F005` [minor/`vp-pm-dependency-risk`; line=54]: Identify the execution-record data-model dependency by document ID and specify the follow-up needed to confirm the parallel-request identifier.
- `F006` [minor/`vp-pm-control-reporting`; line=43]: Specify who records and follows up the unresolved task-flow scope, and where that decision is reported.
- `F007` [minor/`vp-ba-business-value`; line=6]: State the operational problem this event definition addresses and a success criterion for determining whether it resolves that problem.
- `F008` [minor/`vp-ba-requirements-completeness`; line=43]: Define which task-flow types are in scope and how the event applies to them, or explicitly exclude the unresolved flows.
- `F009` [minor/`vp-ba-requirements-completeness`; line=54]: Specify the event-data field that correlates selections made by the same parallel request, based on the execution-record model.
- `F010` [minor/`vp-ba-stakeholder-clarity`; line=28]: Identify the role that reviews and agrees the event’s business definition, including the unresolved scope and parallel-request data.
- `F011` [minor/`vp-arc-cross-document-consistency`; line=8]: Add the event-index link when the index is created and verify this event’s catalog entry against the specification.
- `F012` [minor/`vp-arc-technical-constraints`; line=54]: Resolve the parallel-request correlation field against the execution-record data model so the event payload can be represented consistently.
- `F013` [minor/`vp-dev-implementation-readiness`; line=54]: Define the parallel-request correlation field against the execution-record model before using this event specification as an implementation reference.
- `F014` [minor/`vp-dev-change-impact`; line=54]: Identify the execution-record model and the downstream event or implementation artifacts affected by changing the parallel-selection data.
- `F015` [minor/`vp-dev-testability`; line=52]: Define the parallel-request correlation field and identify the event test cases that verify selections from one request are associated correctly.
- `F016` [major/`vp-qe-done-criteria`; line=43]: Resolve the task-flow scope and obtain business approval of the event’s applicability before claiming the event specification is complete.
- `F017` [major/`vp-qe-done-criteria`; line=54]: Specify the parallel-request correlation field and verify it against the execution-record model so the event can support implementation and test design.
- `F018` [minor/`vp-qe-verifiability`; line=52]: Name the field and verification rule that demonstrate which parallel selections belong to the same request.
- `F019` [minor/`vp-qe-omissions-consistency`; line=8]: Complete and verify the BEL event link when the index is available so the event catalog and specification remain connected.
- `F020` [minor/`vp-ux-readability`; line=43]: State the confirmed task-flow scope near the event definition so readers can tell which selections the specification covers.
- `F021` [minor/`vp-ux-language-consistency`; line=29]: Define `runner` and use a consistent actor label that makes clear whether it is a role, system component, or execution subject.
- `F022` [minor/`vp-ops-release-readiness`; line=43]: State the approval owner and readiness condition for closing the unresolved event-scope decision.
- `F023` [minor/`vp-ops-operability`; line=54]: Add the responsible role and follow-up route for validating the parallel-request identifier when the execution-record model is available.

## 4. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | BA | vp-ba-requirements-completeness | イベント内容・発生条件・タイミングが業務観点で正確に記述されていること |
| DC-002 | PO | vp-po-purpose-alignment | イベント仕様の業務的妥当性を承認できること |
| DC-003 | ARC | vp-arc-technical-constraints | イベント処理実装・メッセージ設計の基礎として参照できること |
| DC-004 | QE | vp-qe-verifiability | イベントテスト設計への活用が確認できること |
| DC-005 | DEV | vp-dev-implementation-readiness | イベントハンドラ・パブリッシャー実装の参照として使えること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 5. 進め方

fully-guided のタスクは、宣言された文書だけを参照し、rulebook / recipe / sample に沿って既存成果物を磨き込むことを求めた。下書きや調査による新しい値の選定は draft の役割である。磨き込みでは template を読み込まない。rulebook の必須要素・禁止事項、recipe の問い、sample の形式との整合は grade が評価済みである。review はこれらを照合し直さず、評価結果の finding として扱う。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備）:

- rulebook: `docs/ja/specdojo/rulebooks/bes-rulebook.md`
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/bes-sample.md`
- 併せて適用する rulebook（記法など）: _MISSING_

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
