---
specdojo:
  id: prj-0001:xrp-t-glossary-gl-common-090-20261111t204210z-9c30114d
  type: exec-plan
  rulebook: none
  task_id: T-GLOSSARY-gl-common-090
  name: "完成版レビュー（実装照合）"
  mode: review
  status: ready
  project_id: prj-0001
  owner: BA
  approach: retrofit
  targets:
    - gl-common
---

# Review Plan: T-GLOSSARY-gl-common-090

## 1. このフェーズで行うこと

完成版を変更せず、evidence_refs が示す現在動作、意図された仕様、done_criteria を照合する。実装との一致・乖離・未確認範囲を判定し、根拠と修正対象候補を review result に記録する。

## 2. 対象成果物

- `name`: 用語集（共通）
- `depends_on`:  -
- `overview`: 業務・システムで使用する用語の意味を、ドメインを横断して統一的に定義する
- `path`: `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml`
- `rulebook`: `docs/ja/specdojo/rulebooks/gl-rulebook.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-GLOSSARY-gl-common-090/T-GLOSSARY-gl-common-090-20261111T204210Z-9c30114d/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 実装エビデンス

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の確認入力である。実行記録にある対応記録の突き合わせに使い、実装は変更しない。

- `src/specdojo.ts`（implementation）: CLI のコマンドと引数で使う用語（用語の名前と英語名の根拠）
- `docs/specdojo/schemas/v1/register-item-frontmatter.schema.yaml`（implementation）: 登録簿の項目の種類と状態の用語
- `docs/specdojo/schemas/v1/exec-common.schema.yaml`（implementation）: 実行（exec）のタスクの状態と記録の用語
- `docs/specdojo/schemas/v1/sch-common.schema.yaml`（implementation）: schedule の段・ゲート・マイルストーンの用語

## 4. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/gl-common.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 実行した（run id: `review-prj-0001-T-GLOSSARY-gl-common-090-20261111T203851Z`）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 97
- `graded_at`: 2026-11-11T20:42:10.067Z（`graded_by`: sol-review-executor）
- finding 件数: blocker 0 / major 0 / minor 2 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-cross-document-consistency` | 3 | 75 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-requirements-completeness` | 4 | 100 |
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
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-config-validity` | 4 | 100 |
| `vp-qe-done-criteria` | 3 | 75 |
| `vp-qe-omissions-consistency` | 4 | 100 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |
| `vp-ux-user-flow` | 4 | 100 |

finding:

- `F001` [minor/`vp-arc-cross-document-consistency`; line=84]: Regenerate docs/ja/product/010-business-specs/060-glossary/generated/gl-common.md: its tm-schedule entry at lines 60-65 declares englishName: track, whereas the YAML at line 84 declares englishName: schedule, and it omits tm-rulebook, tm-recipe, tm-sample, tm-template, tm-task, and tm-document-maturity that the YAML now defines.
- `F002` [minor/`vp-qe-done-criteria`; line=84]: Complete DC-004 verification after refreshing the generated glossary: the current YAML defines Schedule as schedule, but generated/gl-common.md still defines it as track and lacks six current terms, so consistency across the source and its display document cannot yet be confirmed.

## 5. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | BA | vp-ba-requirements-completeness | 業務上の主要用語の定義・別名・分類が正確に記述されていること |
| DC-002 | PO | vp-po-purpose-alignment | 用語スコープと定義の妥当性を承認できること |
| DC-003 | ARC | vp-arc-cross-document-consistency | 技術実装・API命名・DBカラム名の参照として使えること |
| DC-004 | QE | vp-qe-omissions-consistency | ドキュメント間の用語の一貫性が確認できること |
| DC-005 | ARC | vp-arc-cross-document-consistency | schema の条件付きの決まり（if・then などで、状態や種類によって必須の項目が変わるもの）を、用語どうしの関係（どの状態・種類のときに使うか）として短く書き、条件を写さず schema を正本として参照していること |
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
