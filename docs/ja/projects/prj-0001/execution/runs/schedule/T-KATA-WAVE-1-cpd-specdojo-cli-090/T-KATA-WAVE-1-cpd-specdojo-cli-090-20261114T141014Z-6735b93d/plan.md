---
specdojo:
  id: prj-0001:xrp-t-kata-wave-1-cpd-specdojo-cli-090-20261114t141014z-6735b93d
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-1-cpd-specdojo-cli-090
  name: "完成版レビュー（実装照合）"
  mode: review
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: retrofit
  targets:
    - cpd-specdojo-cli
---

# Review Plan: T-KATA-WAVE-1-cpd-specdojo-cli-090

## 1. このフェーズで行うこと

対応する型一式（rulebook・sample、あれば recipe・template）と代表成果物を読み、型一式の章構成・判断基準・例の充実度・相互整合をレビューする。代表成果物の `done_criteria` だけで完了としない。成果物・型は変更せず、指摘と根拠を review result に残す。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 対象成果物

- `name`: C4コンポーネント図（SpecDojo CLI）
- `depends_on`:
  - [[cnd-specdojo]]
- `overview`: SpecDojo CLI内部の主要コンポーネント（catalog／schedule／exec／register／routine／index等のエンジン）と依存関係を定義する
- `path`: `docs/ja/product/030-architecture/010-c4/cpd-specdojo-cli.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/cpd-rulebook.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-1-cpd-specdojo-cli-090/T-KATA-WAVE-1-cpd-specdojo-cli-090-20261114T141014Z-6735b93d/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 実装エビデンス

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の確認入力である。実行記録にある対応記録の突き合わせに使い、実装は変更しない。

- `src/specdojo.ts`（implementation）: 各サブコマンド（catalog/schedule/exec/register/routine/index/build等）の登録・呼び出し関係

## 4. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/product/030-architecture/010-c4/cpd-specdojo-cli.md`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/cpd-specdojo-cli.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 実行した（run id: `review-prj-0001-T-KATA-WAVE-1-cpd-specdojo-cli-090-20261114T135502Z`）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 82
- `graded_at`: 2026-11-14T14:10:14.071Z（`graded_by`: qwen-review-executor）
- finding 件数: blocker 0 / major 4 / minor 12 / note 1

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 3 | 75 |
| `vp-arc-cross-document-consistency` | 3 | 75 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-business-value` | 2 | 50 |
| `vp-ba-requirements-completeness` | 3 | 75 |
| `vp-ba-stakeholder-clarity` | 3 | 75 |
| `vp-dev-change-impact` | 3 | 75 |
| `vp-dev-implementation-readiness` | 4 | 100 |
| `vp-dev-testability` | 4 | 100 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 3 | 75 |
| `vp-ops-release-readiness` | 3 | 75 |
| `vp-pm-control-reporting` | 3 | 75 |
| `vp-pm-dependency-risk` | 3 | 75 |
| `vp-pm-plan-feasibility` | 2 | 50 |
| `vp-po-decision-readiness` | 2 | 50 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 3 | 75 |
| `vp-qe-config-validity` | 2 | 50 |
| `vp-qe-done-criteria` | 3 | 75 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |
| `vp-ux-user-flow` | 4 | 100 |

finding:

- `F001` [minor/`vp-po-purpose-alignment`; line=18]: state which business need or expected value in prj-0001 overview this component split serves, by pointing to the specific upstream section, so the split's necessity is traceable to a concrete value.
- `F002` [major/`vp-po-decision-readiness`; line=164]: add the decider (human PO), decision timing, and whether each item is a PJR registration candidate, so PO can choose approve/hold/return.
- `F003` [minor/`vp-po-decision-readiness`; line=169]: state the impact of the external-reconciliation issue on downstream work start conditions, so the decision has a concrete downstream effect.
- `F004` [major/`vp-pm-plan-feasibility`; line=164]: add a decision-timing/limit row and a PJR registration-candidate flag per item, so the topics can be scheduled and estimated.
- `F005` [minor/`vp-pm-dependency-risk`; line=167]: state whether the reference-connection issue is a PJR registration candidate, so the dependency can be tracked in the common lifecycle.
- `F006` [minor/`vp-pm-control-reporting`; line=162]: add the reporting destination (PM/PO) and PJR transfer decision per item, so control items are separable for reporting.
- `F007` [major/`vp-ba-business-value`; line=18]: map each engine split to the specific stakeholder, business problem, and expected value (or upstream success criterion) it serves, so business value is explicit.
- `F008` [minor/`vp-ba-requirements-completeness`; line=18]: reference the term-definition source (rulebook §2) or add a brief glossary pointer, so term usage is verifiable within the document.
- `F009` [minor/`vp-ba-stakeholder-clarity`; line=24]: state the explicit agreement target (boundaries, responsibilities, dependency direction), so stakeholders can agree on a defined object.
- `F010` [note/`vp-arc-cross-document-consistency`; line=135]: the upstream cnd-specdojo is referenced but its body was not provided in this review's references, so cross-document consistency of REL-05/REL-07/REL-08 mapping could not be verified; provide the upstream body to confirm.
- `F011` [minor/`vp-arc-conciseness`; line=166]: the "内部構成と実装対応" item partly overlaps §4.1; consolidate by referencing §4.1 instead of restating, without losing the judgment-relevant basis.
- `F012` [minor/`vp-dev-change-impact`; line=169]: state which downstream deliverables (detail design, data design, integration observation points) are affected when the external-reconciliation or runtime assumptions change, so change impact is traceable.
- `F013` [minor/`vp-qe-done-criteria`; line=162]: list the catalog done_criteria or reference where they are tracked, so unmet conditions are explicit for completion judgment.
- `F014` [minor/`vp-qe-omissions-consistency`; line=164]: add the "decision timing" and "approval impact / handover destination" columns (or reference them) per item, matching the rulebook §6.5 recommended fields.
- `F015` [minor/`vp-ops-release-readiness`; line=24]: state the pre-publication check owner (OPS), the non-public/personal information scope, and the conditions for PO to approve/hold/return publication, so release readiness is explicit.
- `F016` [minor/`vp-ops-operability`; line=162]: add the operations inquiry route (owner ARC) and regeneration/change-management procedure, so ongoing operation and change management are actionable.
- `F017` [major/`vp-qe-config-validity`; line=7]: 未解決の _TODO_ / _ASSUMPTION_ が残っています。

## 5. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | ARC | vp-arc-technical-constraints | コンポーネント構成と依存関係を設計の入力として参照できること |
| DC-002 | QE | vp-qe-verifiability | コンポーネント間インターフェースのテスト観点が識別できること |
| DC-003 | DEV | vp-dev-implementation-readiness | コンポーネント実装の配置・依存方向の参照として使えること |
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
