---
specdojo:
  id: prj-0001:xrp-t-kata-wave-1-sf-index-090-20261114t143911z-7bc17b67
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-1-sf-index-090
  name: "完成版レビュー（実装照合）"
  mode: review
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: retrofit
  targets:
    - sf-index
---

# Review Plan: T-KATA-WAVE-1-sf-index-090

## 1. このフェーズで行うこと

対応する型一式（rulebook・sample、あれば recipe・template）と代表成果物を読み、型一式の章構成・判断基準・例の充実度・相互整合をレビューする。代表成果物の `done_criteria` だけで完了としない。成果物・型は変更せず、指摘と根拠を review result に残す。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 対象成果物

- `name`: システム化機能一覧（全体構成）
- `depends_on`:
  - [[bps-init-required]]
  - [[bps-register-required]]
  - [[bps-planning-catalog-strategy-update]]
  - [[bps-task-selection-preparation]]
  - [[bps-routine-required]]
  - [[bps-parallel-required]]
  - [[bps-config-change-evaluation]]
  - [[bps-derived-project-scoped]]
  - [[bps-reporting-monitoring-detection]]
  - [[bps-deprecation-process]]
  - [[clis-index]]
- `overview`: システムで実現する機能の全体構成と一覧を定義する。行ごとに業務プロセス仕様（bps-*）・CLI仕様（clis-index配下のCLIコマンド群）を要約参照する
- `path`: `docs/ja/product/010-business-specs/050-system-functions/sf-index.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/sf-index-rulebook.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-1-sf-index-090/T-KATA-WAVE-1-sf-index-090-20261114T143911Z-7bc17b67/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 実装エビデンス

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の確認入力である。実行記録にある対応記録の突き合わせに使い、実装は変更しない。

- `src/specdojo.ts`（implementation）: CLIサブコマンド一覧（機能一覧の行と対応させる根拠）

## 4. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/product/010-business-specs/050-system-functions/sf-index.md`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/sf-index.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 実行した（run id: `review-prj-0001-T-KATA-WAVE-1-sf-index-090-20261114T143750Z`）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 73
- `graded_at`: 2026-11-14T14:39:10.365Z（`graded_by`: luna-review-executor）
- finding 件数: blocker 0 / major 8 / minor 11 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-cross-document-consistency` | 2 | 50 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-technical-constraints` | 3 | 75 |
| `vp-ba-business-value` | 3 | 75 |
| `vp-ba-requirements-completeness` | 2 | 50 |
| `vp-ba-stakeholder-clarity` | 3 | 75 |
| `vp-dev-change-impact` | 3 | 75 |
| `vp-dev-implementation-readiness` | 3 | 75 |
| `vp-dev-testability` | 3 | 75 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 3 | 75 |
| `vp-ops-release-readiness` | 2 | 50 |
| `vp-pm-control-reporting` | 3 | 75 |
| `vp-pm-dependency-risk` | 3 | 75 |
| `vp-pm-plan-feasibility` | 2 | 50 |
| `vp-po-decision-readiness` | 4 | 100 |
| `vp-po-publication-accountability` | 3 | 75 |
| `vp-po-purpose-alignment` | 3 | 75 |
| `vp-qe-config-validity` | 2 | 50 |
| `vp-qe-done-criteria` | 2 | 50 |
| `vp-qe-omissions-consistency` | 2 | 50 |
| `vp-qe-verifiability` | 2 | 50 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |
| `vp-ux-user-flow` | 4 | 100 |

finding:

- `F001` [minor/`vp-po-purpose-alignment`; line=71]: The missing BPS dependencies leave the evidence for complete business-process coverage uncertain; resolve the dependency scope or document why representative BPS coverage is sufficient before treating the mapping as complete.
- `F002` [minor/`vp-po-publication-accountability`; line=23]: State the intended publication audience and confirm whether the document contains personal or non-public information so the PO can assess publication scope.
- `F003` [major/`vp-pm-plan-feasibility`; line=70]: Break the BPS and CLI mapping review into trackable work with an owner, completion condition, and decision timing so PM can schedule and monitor it.
- `F004` [minor/`vp-pm-dependency-risk`; line=71]: Record the dependency-gap resolution and its schedule or downstream-deliverable impact in a traceable project item so affected work can be managed.
- `F005` [minor/`vp-pm-control-reporting`; line=68]: Add the PJR and Schedule tracking references for the open mapping, dependency, and deprecation issues so progress and decisions can be reported consistently.
- `F006` [minor/`vp-ba-business-value`; line=15]: Name the principal user or operational problem and the expected result that would show the index is helping address it.
- `F007` [major/`vp-ba-requirements-completeness`; line=70]: The provisional BPS mappings and missing catalog dependencies prevent BA from confirming that the function list covers the agreed business scope; complete the source mapping or define and justify the representative-source policy.
- `F008` [minor/`vp-ba-stakeholder-clarity`; line=22]: Identify who maintains the index and where each role records its review or agreement, so readers can tell whether stakeholder confirmation is complete.
- `F009` [major/`vp-arc-cross-document-consistency`; line=71]: Reconcile the listed function-to-BPS mappings with the catalog dependencies, or record the approved representative-BPS rule and its rationale, because the current dependency gap makes coverage evidence inconsistent.
- `F010` [minor/`vp-arc-technical-constraints`; line=29]: State or reference the technical assumptions and constraints that component design must preserve, or identify the authoritative source where ARC can find them.
- `F011` [minor/`vp-dev-implementation-readiness`; line=44]: For functions without individual specifications, identify the authoritative source for the inputs, outputs, and constraints needed to establish implementation boundaries.
- `F012` [minor/`vp-dev-change-impact`; line=63]: Add or reference a change-impact procedure that identifies which schemas, generated outputs, commands, and operating procedures must be checked when a function boundary changes.
- `F013` [minor/`vp-dev-testability`; line=11]: Specify or reference the check that verifies function IDs, business-process mappings, and CLI references, including the expected pass condition.
- `F014` [major/`vp-qe-done-criteria`; line=40]: Provide evidence that every business-process area is mapped to the agreed scope and test targets, resolving the dependency gap recorded in `Q-02` before claiming coverage.
- `F015` [major/`vp-qe-verifiability`; line=40]: Define a review check that compares every business-process area and function ID to its source and test target, with a recorded pass/fail result.
- `F016` [major/`vp-qe-omissions-consistency`; line=71]: Resolve the missing BPS dependencies and provide a traceable check that the function list is covered by test targets, so omissions can be detected.
- `F017` [major/`vp-ops-release-readiness`; line=70]: Define the publication audience and the checks the PO must complete before approving `ready`, including resolution or explicit exclusion of the open mapping and dependency questions.
- `F018` [minor/`vp-ops-operability`; line=64]: Identify the role responsible for routine maintenance and the procedure or destination for reporting broken references and requesting updates.
- `F019` [major/`vp-qe-config-validity`; line=62]: 未解決の _TODO_ / _ASSUMPTION_ が残っています。

## 5. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | BA | vp-ba-requirements-completeness | 機能一覧が業務仕様と対応し、スコープが網羅されていること |
| DC-002 | PO | vp-po-purpose-alignment | システム化機能のスコープを承認できること |
| DC-003 | ARC | vp-arc-technical-constraints | 機能分割・コンポーネント設計の入力として参照できること |
| DC-004 | QE | vp-qe-omissions-consistency | テスト対象機能の網羅性が確認できること |
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
