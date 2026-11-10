---
specdojo:
  id: prj-0001:xrp-t-business-specs-reps-sf-task-execution-090-20261110t223153z-212d9a36
  type: exec-plan
  rulebook: none
  task_id: T-BUSINESS-SPECS-REPS-sf-task-execution-090
  name: "完成版レビュー（実装照合）"
  mode: review
  status: ready
  project_id: prj-0001
  owner: BA
  approach: retrofit
  targets:
    - sf-task-execution
---

# Review Plan: T-BUSINESS-SPECS-REPS-sf-task-execution-090

## 1. このフェーズで行うこと

完成版を変更せず、evidence_refs が示す現在動作、意図された仕様、done_criteria を照合する。実装との一致・乖離・未確認範囲を判定し、根拠と修正対象候補を review result に記録する。

## 2. 対象成果物

- `name`: システム化機能（タスク実行）
- `depends_on`:
  - [[sf-index]]
  - [[bps-task-selection-preparation]]
- `overview`: タスク実行機能（タスク選択・claim・agent実行・検証・完了処理・worktree隔離と統合）の入出力、処理要件、外部連携を定義する
- `path`: `docs/ja/product/010-business-specs/050-system-functions/sf-task-execution.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/sf-rulebook.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-BUSINESS-SPECS-REPS-sf-task-execution-090/T-BUSINESS-SPECS-REPS-sf-task-execution-090-20261110T223153Z-212d9a36/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 実装エビデンス

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の確認入力である。実行記録にある対応記録の突き合わせに使い、実装は変更しない。

- `src/exec/run/agent-pipeline.ts`（implementation）: タスク実行パイプライン（executor実行・親検証バッチ・reporter実行・スナップショット管理）の実装

## 4. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/product/010-business-specs/050-system-functions/sf-task-execution.md`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/sf-task-execution.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 省略した（評価対象の `content_hash` が評価結果と一致したため、既存の評価結果を使う）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 89
- `graded_at`: 2026-11-09T22:40:30.836Z（`graded_by`: sol-review-executor）
- finding 件数: blocker 0 / major 1 / minor 7 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-cross-document-consistency` | 2 | 50 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 3 | 75 |
| `vp-ba-business-value` | 4 | 100 |
| `vp-ba-requirements-completeness` | 3 | 75 |
| `vp-ba-stakeholder-clarity` | 4 | 100 |
| `vp-dev-change-impact` | 4 | 100 |
| `vp-dev-implementation-readiness` | 4 | 100 |
| `vp-dev-testability` | 4 | 100 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 4 | 100 |
| `vp-ops-release-readiness` | 4 | 100 |
| `vp-pm-control-reporting` | 4 | 100 |
| `vp-pm-dependency-risk` | 4 | 100 |
| `vp-pm-plan-feasibility` | 4 | 100 |
| `vp-po-decision-readiness` | 4 | 100 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 3 | 75 |
| `vp-qe-config-validity` | 4 | 100 |
| `vp-qe-done-criteria` | 3 | 75 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 3 | 75 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |
| `vp-ux-user-flow` | 4 | 100 |

finding:

- `F001` [minor/`vp-po-purpose-alignment`; line=21]: Complete the `P-07` and task-selection mappings against the planned business-process specifications before final approval; the current table explicitly leaves their detailed correspondence unresolved.
- `F002` [minor/`vp-ba-requirements-completeness`; line=21]: Complete the business-process step mapping and confirm the resource constraints that affect acceptance; until then, the business alignment and acceptance scope are not fully established.
- `F003` [minor/`vp-arc-cross-document-consistency`; line=21]: Reconcile the stated `P-07` correspondence with the detailed BPS specifications when they are created; the current mapping is based on catalog categories rather than confirmed process-step identifiers.
- `F004` [major/`vp-arc-cross-document-consistency`; line=117]: Reconcile section 5.1 and V-13/V-14 with the existing resource-control contracts: the SF states a 300-second timeout for the whole parent-validation batch and a default provider limit of one, whereas `src/exec/parent-validation.ts` assigns 600 seconds to each validation command and `docs/ja/specdojo/guides/exec-config-guide.md` defines an omitted provider limit as unlimited and excludes several explicit Schedule execution routes from the gate; correct the baseline and applicability or explicitly identify an approved behavior change.
- `F005` [minor/`vp-arc-technical-constraints`; line=126]: Identify the authoritative logical contract and version source for evidence and pipeline-stage records; section 5.2 requires schema compatibility and version changes without identifying the interface definition that component designers must use.
- `F006` [minor/`vp-qe-done-criteria`; line=182]: Resolve the missing business-process correspondence and the undecided resource acceptance values before treating the related completion conditions as fully evidenced.
- `F007` [minor/`vp-qe-verifiability`; line=174]: Parameterize V-13 and V-14 by the effective configured timeout and concurrency limits, and cover overridden and omitted limits; the current acceptance rows use fixed defaults even though section 5.1 makes runtime configuration authoritative.
- `F008` [minor/`vp-qe-omissions-consistency`; line=65]: The former implementation names, internal structures, reconciliation table, and command option have been removed, resolving the previous major and minor findings; qualify the task-completion postcondition in section 3.2 and V-11 to apply only to state-tracked execution, because section 4.1 explicitly forbids implicit state changes for untracked single runs.

## 5. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | BA | vp-ba-requirements-completeness | タスク実行機能の入出力・処理要件が業務プロセス仕様と整合していること |
| DC-002 | PO | vp-po-purpose-alignment | タスク実行機能の機能スコープと振る舞いを承認できること |
| DC-003 | ARC | vp-arc-technical-constraints | タスク実行コンポーネント設計・アーキテクチャ境界の入力として参照できること |
| DC-004 | QE | vp-qe-verifiability | タスク実行機能のテスト観点・検証可能性が確認できること |
| DC-005 | DEV | vp-dev-implementation-readiness | 実装スコープ・機能境界の参照として使えること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 6. 進め方

retrofit のタスクは、既存の実装を根拠に成果物を意図された仕様へ合わせることを求めた。成果物の内容の品質は grade が評価済みである。review は成果物を読み直して判定せず、実装との対応が記録されているかを確認する。

1. フェーズ説明と完了条件が求めた作成・更新が、対象成果物に行われたかを確認する。
2. 実行記録に、「実装エビデンス」に列挙された各パスについて、成果物の記述との対応と判定（一致・乖離・確認不能・未確認）が残っているかを確認する。記録のないパスは未充足事項とする。
3. 乖離ごとに修正対象候補（実装・文書・意思決定）と根拠が記録されているか、調査できなかった範囲が明示されているかを確認する。
4. 実装から目的・業務判断・将来方針を推測して成果物へ書いた形跡が finding にある場合は、このタスクの完了を妨げるかを判断する。

本タスクの実行に必要な retrofit の確認方針は、このセクションで完結する。approach 全体の定義を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

## 7. 完了手順

1. 共通規約の `review の判断手順` に従い、評価結果の鮮度を確認してから完了可否を判断する。
2. result の各セクションを埋める。`評価結果の確認` には鮮度確認のコマンドと出力、grade の `verdict` / `score` / finding 件数を書く。`判断根拠` には照合した内容を、`未充足事項・改善指示` には未充足事項と改善指示を書く。`approach に応じた確認` には実装エビデンスの対応記録の確認結果と未確認範囲を、`decision` には `verdict` を書く。review result の記入はタスク完了に必須であり、未記入のまま終了しない（詳細は共通規約を参照）。
3. 文書の参照は `[[id]]` 形式、実装参照はリポジトリルート相対パスで記載し、絶対パスを使わない。
4. verdict が `complete` 以外でも、review result を記録できた場合は正常終了する（終了コード 0）。

## 8. 異常終了の条件

- `evidence_refs` 欠落、実装エビデンス不存在、対象ファイル不明、result 更新不能など、review 自体を完了できない場合は異常終了する（終了コード 1）。評価結果が最新でない・評価不能であることは異常終了の理由にせず、verdict として記録する。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:13f1d90345b0d1f0bd602cc3e3f06afa7d772eb714e855b6103c85854bebda59` `docs/ja/projects/prj-0001/execution/conventions/13f1d90345b0d1f0bd602cc3e3f06afa7d772eb714e855b6103c85854bebda59.txt`
