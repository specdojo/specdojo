---
specdojo:
  id: prj-0001:xrp-t-kata-wave-1-ifd-specdojo-090-20261114t193124z-ff87d3bd
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-1-ifd-specdojo-090
  name: "完成版レビュー（実装照合）"
  mode: review
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: retrofit
  targets:
    - ifd-specdojo
---

# Review Plan: T-KATA-WAVE-1-ifd-specdojo-090

## 1. このフェーズで行うこと

対応する型一式（rulebook・sample、あれば recipe・template）と代表成果物を読み、型一式の章構成・判断基準・例の充実度・相互整合をレビューする。代表成果物の `done_criteria` だけで完了としない。成果物・型は変更せず、指摘と根拠を review result に残す。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 対象成果物

- `name`: インフラ構成図（SpecDojo実行環境）
- `depends_on`:
  - [[cnd-specdojo]]
- `overview`: SpecDojo CLIの実行環境（devcontainer／ホスト）と、クラウドAI provider（Claude・Codex・GitHub Copilot等）・Tailscale経由のホームMacローカルLLMゾーン（Ollama）・GitHubへの通信境界を定義する
- `path`: `docs/ja/product/030-architecture/020-infrastructure/ifd-specdojo.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/ifd-mermaid-rulebook.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-1-ifd-specdojo-090/T-KATA-WAVE-1-ifd-specdojo-090-20261114T193124Z-ff87d3bd/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 実装エビデンス

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の確認入力である。実行記録にある対応記録の突き合わせに使い、実装は変更しない。

- `.devcontainer/devcontainer.json`（implementation）: SpecDojo CLI実行環境（devcontainer）のネットワーク・接続構成
- `src/exec/exec.ts`（implementation）: exec コマンド入口から到達するクラウドAI providerへの接続解決規則

## 4. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/product/030-architecture/020-infrastructure/ifd-specdojo.md`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/ifd-specdojo.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 実行した（run id: `review-prj-0001-T-KATA-WAVE-1-ifd-specdojo-090-49b3b250d9-20261114T193006Z`）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 79
- `graded_at`: 2026-11-14T19:31:24.115Z（`graded_by`: luna-review-executor）
- finding 件数: blocker 0 / major 1 / minor 20 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 3 | 75 |
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
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-config-validity` | 2 | 50 |
| `vp-qe-done-criteria` | 3 | 75 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 3 | 75 |
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 4 | 100 |
| `vp-ux-user-flow` | 4 | 100 |

finding:

- `F001` [minor/`vp-po-decision-readiness`; line=96]: State the approval decision and the conditions PO must resolve before accepting this infrastructure policy; the current table identifies pending choices but does not summarize the approval gate.
- `F002` [minor/`vp-po-publication-accountability`; line=20]: Identify the human PO approval step for publication scope and release readiness so the draft status and pending publication decisions lead to a clear accountability point.
- `F003` [minor/`vp-pm-plan-feasibility`; line=122]: Add a decision or review timing for the open placement and persistence checks so progress can be tracked against a defined checkpoint.
- `F004` [minor/`vp-pm-dependency-risk`; line=122]: Identify which unresolved infrastructure risks should be registered or tracked in project control records, including the owner and follow-up point.
- `F005` [minor/`vp-pm-control-reporting`; line=122]: Mark the open items that require project status or risk reporting and name the record or reporting destination for their follow-up.
- `F006` [minor/`vp-ba-business-value`; line=18]: Add an observable success condition for using this diagram as an input, such as the required boundary and failure-test decisions that downstream design must be able to make.
- `F007` [minor/`vp-ba-requirements-completeness`; line=24]: Record the business constraints checked against the proposed environments and paths, or state the specific validation still required before declaring the placement aligned.
- `F008` [minor/`vp-ba-stakeholder-clarity`; line=71]: Identify the role that confirms the proposed execution placement and its persistence and network assumptions, so stakeholders know who validates the arrangement.
- `F009` [minor/`vp-arc-cross-document-consistency`; line=14]: Update the system design index entry for ifd-specdojo from “未作成” to its current state; sysd-index.md still describes this deliverable as not created.
- `F010` [minor/`vp-arc-technical-constraints`; line=65]: Link each deferred connectivity and route-control assumption to a specific technical design record or tracked follow-up, so security-zone designers can locate the contract that will resolve it.
- `F011` [minor/`vp-arc-conciseness`; line=65]: Consolidate the host-side Tailscale routing explanation with the PATH-06 placement note in section 3; the same logical-path caveat is described in both locations and can be retained once without losing a decision.
- `F012` [minor/`vp-dev-implementation-readiness`; line=20]: For implementation handoff, identify the specific technical configuration records that will define connection, authentication, and deployment inputs; the general reference to future tasks does not locate all of those contracts.
- `F013` [minor/`vp-dev-change-impact`; line=122]: Name the affected configuration or implementation artifacts for placement changes, or link to the change-impact record that will maintain those references.
- `F014` [minor/`vp-dev-testability`; line=108]: Identify the validation procedure or test artifact that will exercise these boundaries and record results; the table defines observations but not how a tester executes or reports the checks.
- `F015` [minor/`vp-qe-done-criteria`; line=108]: Mark the catalog completion conditions that remain pending until business alignment, PO approval, and verification evidence are available; the document currently distinguishes untested design input but does not map that status to the conditions.
- `F016` [minor/`vp-qe-verifiability`; line=108]: Define or reference the check procedure and evidence format for the stated pass/fail observations so different reviewers can reproduce the boundary checks.
- `F017` [minor/`vp-qe-omissions-consistency`; line=14]: Correct the system design index’s “未作成” status for ifd-specdojo to avoid contradictory completeness information across project documents.
- `F018` [minor/`vp-ux-language-consistency`; line=84]: Use the same name for the parent container diagram as in the overview and catalog, so readers can follow the reference without interpreting “上位関係” as a different artifact.
- `F019` [minor/`vp-ops-release-readiness`; line=20]: State the release-readiness conditions that must be met before promoting this draft, including the required PO decision and verification status.
- `F020` [minor/`vp-ops-operability`; line=108]: Name the specific operations document or tracked follow-up that will own the monitoring and recovery details; “運用文書” is not a uniquely traceable destination here.
- `F021` [major/`vp-qe-config-validity`; line=11]: 未解決の _TODO_ / _ASSUMPTION_ が残っています。

## 5. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | BA | vp-ba-requirements-completeness | 実行環境・ネットワーク・コンポーネント構成が業務制約と整合していること |
| DC-002 | PO | vp-po-decision-readiness | インフラ方針を承認できること |
| DC-003 | ARC | vp-arc-technical-constraints | インフラ設計・セキュリティゾーン設計の入力として参照できること |
| DC-004 | QE | vp-qe-verifiability | インフラテスト・障害テストの対象が識別できること |
| DC-005 | OPS | vp-ops-operability | 運用構成・監視設定の参照として使えること |
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
