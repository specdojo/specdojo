---
specdojo:
  id: prj-0001:xrp-t-kata-wave-2-ifx-file-agent-evidence-090-20261115t084154z-f94497b5
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-2-ifx-file-agent-evidence-090
  name: "完成版レビュー（実装照合）"
  mode: review
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: retrofit
  targets:
    - ifx-file-agent-evidence
---

# Review Plan: T-KATA-WAVE-2-ifx-file-agent-evidence-090

## 1. このフェーズで行うこと

完成版を変更せず、evidence_refs が示す現在動作、意図された仕様、done_criteria を照合する。実装との一致・乖離・未確認範囲を判定し、根拠と修正対象候補を review result に記録する。

## 2. 対象成果物

- `name`: 外部ファイル連携仕様（agent の evidence）
- `depends_on`:
  - [[ifx-index]]
- `overview`: executor の agent が書き runner が読む evidence.json と pipeline-state.json の受け渡しについて、置き場所・命名・形式・必須項目・書き手と読み手・失敗時の扱いを定義する
- `path`: `docs/ja/product/020-external-interface-specs/ifx-file-agent-evidence.yaml`
- `rulebook`: `docs/ja/specdojo/rulebooks/ifx-file-rulebook.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-2-ifx-file-agent-evidence-090/T-KATA-WAVE-2-ifx-file-agent-evidence-090-20261115T084154Z-f94497b5/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 実装エビデンス

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の確認入力である。実行記録にある対応記録の突き合わせに使い、実装は変更しない。

- `src/exec/evidence.ts`（implementation）: evidence.json の読込・検証と runner の検証結果の追記
- `src/exec/pipeline-state.ts`（implementation）: pipeline-state.json の段ごとの状態の記録と再開の判定

## 4. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/product/020-external-interface-specs/ifx-file-agent-evidence.yaml`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.ifx-file-agent-evidence.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 実行した（run id: `review-prj-0001-T-KATA-WAVE-2-ifx-file-agent-evidence-090-1bb1936bf1-20261115T084056Z`）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 85
- `graded_at`: 2026-11-15T08:41:52.994Z（`graded_by`: luna-review-executor）
- finding 件数: blocker 0 / major 1 / minor 14 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-cross-document-consistency` | 4 | 100 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 3 | 75 |
| `vp-ba-business-value` | 4 | 100 |
| `vp-ba-requirements-completeness` | 3 | 75 |
| `vp-ba-stakeholder-clarity` | 4 | 100 |
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
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-config-validity` | 2 | 50 |
| `vp-qe-done-criteria` | 3 | 75 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 3 | 75 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |
| `vp-ux-user-flow` | 4 | 100 |

finding:

- `F001` [minor/`vp-po-decision-readiness`; line=15]: List the open technical decisions, their impact, and the next action needed before PO can decide whether to promote this contract to ready.
- `F002` [minor/`vp-pm-plan-feasibility`; line=107]: Assign an owner and review timing for confirming the user notification behavior that is explicitly left unverified.
- `F003` [minor/`vp-pm-dependency-risk`; line=107]: Record the follow-up dependency and its schedule or project-register impact for confirming the notification behavior.
- `F004` [minor/`vp-pm-control-reporting`; line=107]: Specify the reporting or tracking destination and follow-up owner for the unresolved notification behavior.
- `F005` [minor/`vp-ba-requirements-completeness`; line=89]: Define the acceptance condition for treating absent structured evidence as complete, including how that fallback is distinguished from a valid complete report.
- `F006` [minor/`vp-arc-technical-constraints`; line=107]: Specify the notification behavior for evidence read or consistency failures, or identify the authoritative implementation location that defines it.
- `F007` [minor/`vp-dev-implementation-readiness`; line=107]: Define the notification output and behavior for evidence read failures so implementation and recovery handling have a concrete contract.
- `F008` [minor/`vp-dev-change-impact`; line=81]: State how changes to the referenced types or path resolver affect this contract and which artifacts must be updated together.
- `F009` [minor/`vp-dev-testability`; line=75]: Identify the validation procedure and expected result for checking the YAML contract against the referenced types and failure behavior.
- `F010` [minor/`vp-qe-done-criteria`; line=85]: Add or reference test cases and expected outcomes for missing and malformed evidence and pipeline-state files.
- `F011` [minor/`vp-qe-verifiability`; line=75]: Provide a check procedure with pass/fail results for validating each file against its referenced type and required fields.
- `F012` [minor/`vp-qe-omissions-consistency`; line=89]: Define a verifiable guard for the complete fallback so missing structured evidence cannot silently pass as a successful handoff.
- `F013` [minor/`vp-ops-release-readiness`; line=15]: List the open decisions and the conditions PO must review before promoting this contract to ready.
- `F014` [minor/`vp-ops-operability`; line=107]: Define the user notification destination and recovery handoff for evidence read or consistency failures.
- `F015` [major/`vp-qe-config-validity`; line=11]: 未解決の _TODO_ / _ASSUMPTION_ が残っています。

## 5. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | BA | vp-ba-requirements-completeness | 受け渡すファイルの置き場所・命名・形式・必須項目・書き手と読み手が記述されていること |
| DC-002 | ARC | vp-arc-technical-constraints | ファイル連携の方式と失敗時の扱いが設計として妥当であること |
| DC-003 | QE | vp-qe-verifiability | 欠けた・壊れたファイルを扱うテストの設計に活用できること |
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
