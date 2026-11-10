---
specdojo:
  id: prj-0001:xrp-t-business-specs-reps-cdt-register-type-090-20261110t215816z-c91cc8c3
  type: exec-plan
  rulebook: none
  task_id: T-BUSINESS-SPECS-REPS-cdt-register-type-090
  name: "完成版レビュー（実装照合）"
  mode: review
  status: ready
  project_id: prj-0001
  owner: BA
  approach: retrofit
  targets:
    - prj-0001:cdt-register-type
---

# Review Plan: T-BUSINESS-SPECS-REPS-cdt-register-type-090

## 1. このフェーズで行うこと

完成版を変更せず、evidence_refs が示す現在動作、意図された仕様、done_criteria を照合する。実装との一致・乖離・未確認範囲を判定し、根拠と修正対象候補を review result に記録する。

## 2. 対象成果物

- `name`: 分類一覧（登録項目の種別）
- `depends_on`:
  - [[bdd-register-entry]]
- `overview`: 登録項目の種別（type）が取り得る issue・decision・todo・question・risk・change-request・note・epic の分類を一覧で定義する
- `path`: `docs/ja/product/010-business-specs/020-data-model/cdt-register-type.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/cdt-rulebook.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-BUSINESS-SPECS-REPS-cdt-register-type-090/T-BUSINESS-SPECS-REPS-cdt-register-type-090-20261110T215816Z-c91cc8c3/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 実装エビデンス

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の確認入力である。実行記録にある対応記録の突き合わせに使い、実装は変更しない。

- `src/register/register.ts`（implementation）: register コマンド入口から到達する登録項目のtype（issue/decision/todo/question/risk/change-request/note/epic等）の許容値定義

## 4. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/product/010-business-specs/020-data-model/cdt-register-type.md`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.cdt-register-type.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 省略した（評価対象の `content_hash` が評価結果と一致したため、既存の評価結果を使う）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 87
- `graded_at`: 2026-11-10T16:28:53.448Z（`graded_by`: flash-high-executor）
- finding 件数: blocker 0 / major 0 / minor 14 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-cross-document-consistency` | 3 | 75 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 3 | 75 |
| `vp-ba-business-value` | 4 | 100 |
| `vp-ba-requirements-completeness` | 4 | 100 |
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
| `vp-po-publication-accountability` | 3 | 75 |
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-config-validity` | 4 | 100 |
| `vp-qe-done-criteria` | 4 | 100 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 3 | 75 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |
| `vp-ux-user-flow` | 4 | 100 |

finding:

- `F001` [minor/`vp-po-decision-readiness`; line=10]: 未解決の分類またはポリシーの決定事項とその影響、あるいは次のアクションを追加するか、あるいはPOの決定事項が残っていないことを明記してください。これにより、レビュアーはドキュメントを承認するか差し戻すかを判断できます。
- `F002` [minor/`vp-po-publication-accountability`; line=4]: 最終承認における人間のPOの責任と、ドラフトが公開に適した情報のみを含んでいるかどうかを明記してください。これにより、公開の責任が明確になります。
- `F003` [minor/`vp-pm-plan-feasibility`; line=10]: レビューまたは実装のチェックポイントと、観察可能な完了条件を追加してください。これにより、記載された役割の担当者がこのドキュメントを使用して、フォローアップ作業の計画と追跡を行うことができます。
- `F004` [minor/`vp-pm-dependency-risk`; line=22]: 参照されているディクショナリ、ステータス定義、スキーマ、またはCLIに影響を与える未解決の依存関係やリスク、およびその追跡やスケジュールの影響を特定してください。該当がない場合は、残っていない旨を明記してください。
- `F005` [minor/`vp-pm-control-reporting`; line=10]: プロジェクト報告が必要な項目、その提出先、および責任のある役割を特定するか、あるいは該当がない旨を明記してください。これにより、フォローアップをプロジェクト管理に移管できます。
- `F006` [minor/`vp-arc-cross-document-consistency`; line=22]: 参照されているディクショナリ、ステータス定義、スキーマ、CLIの値、およびカタログのエントリが、ここに記載されている分類およびスコープと一致していることを確認し、検証結果を記録またはリンクしてください。
- `F007` [minor/`vp-arc-technical-constraints`; line=24]: スキーマとCLIの参照が、存在および値の一致についてどのように確認されるかを明記してください。これにより、技術的な利用者が宣言されたソースを検証できます。
- `F008` [minor/`vp-dev-implementation-readiness`; line=22]: スキーマのenumとCLIの受け入れ値が、分類の意味および派生ビューのルーティングと一致しているかを比較する実装チェックを追加してください。これにより、DEVはマッピングが完了していることを確認できます。
- `F009` [minor/`vp-dev-change-impact`; line=22]: 分類の値、意味、またはルーティングルールが変更された際の、同期の影響と更新対象を明記してください。これにより、実装者が互換性と必要な更新を評価できます。
- `F010` [minor/`vp-dev-testability`; line=24]: スキーマとCLIの値の一致を確認するための検証コマンドと期待される結果を提供するか、参照してください。これにより、分類値の変更を一貫してテストできます。
- `F011` [minor/`vp-qe-verifiability`; line=24]: すべてのSSOTの値に対応するビジネス定義が存在すること、およびCLIの検証が正確にそれらの値を受け入れることを確認するための、明示的な合格/不合格チェックを定義してください。
- `F012` [minor/`vp-qe-omissions-consistency`; line=22]: ビジネスデータディクショナリ、ステータス定義、スキーマ、CLI、およびカタログに対する一致確認の結果を記録するか、その結果にリンクしてください。これにより、漏れや不一致を特定できます。
- `F013` [minor/`vp-ops-release-readiness`; line=4]: `ready` への昇格に必要な人間の承認と、未完了のリリースのチェック事項を明記するか、あるいはブロッカーが残っていないことを示してください。これにより、リリースの準備状況を判断できます。
- `F014` [minor/`vp-ops-operability`; line=22]: 分類の意味、スキーマの値、CLIの検証、および派生ビューが更新された際の、それらを同期するための変更およびメンテナンスの手順を説明するか、参照してください。

## 5. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | BA | vp-ba-requirements-completeness | 分類名・説明が業務観点で正確に定義されていること |
| DC-002 | DEV | vp-dev-implementation-readiness | 分類実装（マスタデータ・コード値）の基礎として参照できること |
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
