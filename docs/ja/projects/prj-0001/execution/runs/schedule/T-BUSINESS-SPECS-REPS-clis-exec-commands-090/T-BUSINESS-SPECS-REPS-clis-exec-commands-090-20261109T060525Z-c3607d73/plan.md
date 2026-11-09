---
specdojo:
  id: prj-0001:xrp-t-business-specs-reps-clis-exec-commands-090-20261109t060525z-c3607d73
  type: exec-plan
  rulebook: none
  task_id: T-BUSINESS-SPECS-REPS-clis-exec-commands-090
  name: "完成版レビュー（実装照合）"
  mode: review
  status: ready
  project_id: prj-0001
  owner: BA
  approach: retrofit
  targets:
    - clis-exec-commands
---

# Review Plan: T-BUSINESS-SPECS-REPS-clis-exec-commands-090

## 1. このフェーズで行うこと

完成版を変更せず、evidence_refs が示す現在動作、意図された仕様、done_criteria を照合する。実装との一致・乖離・未確認範囲を判定し、根拠と修正対象候補を review result に記録する。

## 2. 対象成果物

- `name`: CLI仕様（exec コマンド群）
- `depends_on`:
  - [[clis-index]]
- `overview`: exec コマンド群の利用目的、操作の流れ、コマンドリファレンスへの参照、入力情報と出力情報の要点、終了コード、エラー表示、および利用者の次の手を定義する
- `path`: `docs/ja/product/010-business-specs/040-user-interface-model/clis-exec-commands.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/clis-rulebook.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-BUSINESS-SPECS-REPS-clis-exec-commands-090/T-BUSINESS-SPECS-REPS-clis-exec-commands-090-20261109T060525Z-c3607d73/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 実装エビデンス

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の確認入力である。実行記録にある対応記録の突き合わせに使い、実装は変更しない。

- `src/exec/commands.ts`（implementation）: exec サブコマンド群（run・plan・review・worktree等）のコマンド定義・対話出力・エラー表示を処理するCLI操作部

## 4. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/product/010-business-specs/040-user-interface-model/clis-exec-commands.md`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/clis-exec-commands.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 実行した（run id: `review-prj-0001-T-BUSINESS-SPECS-REPS-clis-exec-commands-090-20261109T060355Z`）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 84
- `graded_at`: 2026-11-09T06:05:25.474Z（`graded_by`: luna-review-executor）
- finding 件数: blocker 0 / major 0 / minor 16 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 3 | 75 |
| `vp-arc-cross-document-consistency` | 3 | 75 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 3 | 75 |
| `vp-ba-business-value` | 3 | 75 |
| `vp-ba-requirements-completeness` | 4 | 100 |
| `vp-ba-stakeholder-clarity` | 3 | 75 |
| `vp-dev-change-impact` | 4 | 100 |
| `vp-dev-implementation-readiness` | 3 | 75 |
| `vp-dev-testability` | 3 | 75 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 3 | 75 |
| `vp-ops-release-readiness` | 3 | 75 |
| `vp-pm-control-reporting` | 4 | 100 |
| `vp-pm-dependency-risk` | 3 | 75 |
| `vp-pm-plan-feasibility` | 4 | 100 |
| `vp-po-decision-readiness` | 4 | 100 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 3 | 75 |
| `vp-qe-config-validity` | 4 | 100 |
| `vp-qe-done-criteria` | 4 | 100 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 3 | 75 |
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 3 | 75 |
| `vp-ux-user-flow` | 3 | 75 |

finding:

- `F001` [minor/`vp-po-purpose-alignment`; line=7]: The empty `based_on` field leaves the CLI’s relationship to its higher-level purpose undocumented; link the relevant source when it is available.
- `F002` [minor/`vp-pm-dependency-risk`; line=109]: State which downstream work or schedule decisions depend on `clis-index` and the external agent contract so project managers can assess their impact.
- `F003` [minor/`vp-ba-business-value`; line=14]: Connect the stated handoff and recovery benefits to the higher-level project outcome so readers can see the business value of the command group.
- `F004` [minor/`vp-ba-stakeholder-clarity`; line=18]: Identify the role that confirms the proposed workflow and the open execution behavior, so stakeholders know whose agreement is needed.
- `F005` [minor/`vp-arc-cross-document-consistency`; line=7]: The empty `based_on` field omits the higher-level source relationship; align it with the project catalog and relevant function document when that relationship is established.
- `F006` [minor/`vp-arc-technical-constraints`; line=110]: Mark the external agent contract as an unresolved implementation dependency and identify the behavior that must be specified before implementation can rely on it.
- `F007` [minor/`vp-arc-conciseness`; line=82]: Remove or shorten the generic failure-message row because the error section already describes failure displays and recovery actions.
- `F008` [minor/`vp-dev-implementation-readiness`; line=111]: Identify the outstanding behavior and specification inputs that implementers must resolve before treating this document as an implementation basis.
- `F009` [minor/`vp-dev-testability`; line=92]: Add references to the test specifications or identify the expected assertions for the listed exit codes and error cases so QA can turn them into repeatable acceptance checks.
- `F010` [minor/`vp-qe-verifiability`; line=94]: Define observable success and recovery outcomes for the representative workflows so acceptance tests can determine pass or fail consistently.
- `F011` [minor/`vp-qe-omissions-consistency`; line=111]: Resolve or explicitly track the unverified execution, integration, and exit-code behavior against the operation guide before considering the specification complete.
- `F012` [minor/`vp-ux-readability`; line=30]: Define or link the workflow terms `review`, `waiting`, `Ready`, and `runner` at first use so new operators can follow the state transitions.
- `F013` [minor/`vp-ux-user-flow`; line=47]: Link each operation to the specific command-reference subsection where available so users can quickly find the syntax for the command they need.
- `F014` [minor/`vp-ux-language-consistency`; line=30]: Provide consistent Japanese labels or brief definitions for the English state and workflow terms used in the procedure.
- `F015` [minor/`vp-ops-release-readiness`; line=109]: State the human owner and completion check for resolving the missing index, external contract, and unverified execution behavior before promoting this document to `ready`.
- `F016` [minor/`vp-ops-operability`; line=110]: Specify the operational owner and resolution path for the missing external agent contract so operators know where to direct integration questions.

## 5. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | BA | vp-ba-requirements-completeness | exec コマンド群の利用目的・操作の流れ・入力情報と出力情報の要点・利用者の次の手が業務観点で記述されていること |
| DC-002 | PO | vp-po-purpose-alignment | exec コマンド群のスコープと利用フローを承認できること |
| DC-003 | ARC | vp-arc-technical-constraints | CLI 実装・コマンド体系設計の入力として参照できること |
| DC-004 | QE | vp-qe-verifiability | CLI テスト・受入テスト設計に活用できること |
| DC-005 | UX | vp-ux-readability | 開発者・運用者が操作しやすい表現・構成になっていること |
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
