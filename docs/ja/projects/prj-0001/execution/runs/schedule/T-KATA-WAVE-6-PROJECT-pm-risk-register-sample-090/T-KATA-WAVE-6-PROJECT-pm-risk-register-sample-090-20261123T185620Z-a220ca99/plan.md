---
specdojo:
  id: prj-0001:xrp-t-kata-wave-6-project-pm-risk-register-sample-090-20261123t185620z-a220ca99
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-090
  name: "型の grade とレビュー"
  mode: review
  status: ready
  project_id: prj-0001
  owner: PM
  approach: fully-guided
  targets:
    - specdojo:pm-risk-register-sample
---

# Review Plan: T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-090

## 1. このフェーズで行うこと

review の前に、runner が rulebook と sample の組（rulebook が宣言する recipe・template を含む）を grade の --target kata で評価する。この評価結果と、対応する rulebook と sample を読み、章構成・判断基準・例の充実度・相互整合をレビューする。sample の done_criteria だけで完了としない。成果物・型は変更せず、指摘と根拠を review result に残す。
人の確定はこの track に入れず、sample がひととおりそろった後の横串の確認でまとめて行う。確定の前に確かめるべき点は review result に書く。

## 2. 対象成果物

- `name`: リスク登録簿の完成例
- `depends_on`:  -
- `based_on`（対象成果物の frontmatter）: なし
- 個票の `入力`: なし
- `overview`: 駄菓子屋の販売管理システムを題材に、リスク登録簿の完成例を示す
- `path`: `docs/ja/specdojo/samples/pm-risk-register-sample.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/pm-risk-register-rulebook.md`（`_MISSING_` は `undecided`、`not-needed`、または未整備）
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-090/T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-090-20261123T185620Z-a220ca99/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/specdojo/samples/pm-risk-register-sample.md`
- grade の対象種別（`--target`）: `kata`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pm-risk-register-sample.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 実行した（run id: `review-prj-0001-T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-090-74b4533be3-20261123T185510Z`）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 93
- `graded_at`: 2026-11-23T18:55:48.630Z（`graded_by`: sonnet-review-executor）
- finding 件数: blocker 0 / major 2 / minor 2 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-business-value` | 4 | 100 |
| `vp-ba-requirements-completeness` | 4 | 100 |
| `vp-ba-stakeholder-clarity` | 4 | 100 |
| `vp-dev-change-impact` | 4 | 100 |
| `vp-dev-implementation-readiness` | 4 | 100 |
| `vp-dev-testability` | 4 | 100 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 4 | 100 |
| `vp-ops-release-readiness` | 2 | 50 |
| `vp-pm-control-reporting` | 4 | 100 |
| `vp-pm-dependency-risk` | 4 | 100 |
| `vp-pm-plan-feasibility` | 3 | 75 |
| `vp-po-decision-readiness` | 4 | 100 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-kata-conformance` | 4 | 100 |
| `vp-qe-omissions-consistency` | 4 | 100 |
| `vp-qe-verifiability` | 2 | 50 |
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-pm-plan-feasibility`; line=68]: RK-001 の完了条件の試行件数と会計確定の秒数が `_UNDECIDED_` のままで、完了を判定できない。具体値を入れる。
- `F002` [major/`vp-qe-verifiability`; line=68]: RK-001 の完了条件の件数と秒数が `_UNDECIDED_` のままで、rulebook 6.4 の「確認の手段と合格の基準」を満たさず合否を判定できない。具体値を確定する。
- `F003` [minor/`vp-ux-language-consistency`; line=71]: RK-004 の対応方針が「低減」なのに、完了条件は課題 IS-002 への移管で、方針区分と内容が一致しない。移管した旨を方針の側でも分かる表記にそろえる。
- `F004` [major/`vp-ops-release-readiness`; line=68]: RK-001 の完了条件に `_UNDECIDED_` が残っており、ready 化の前提である未解決事項の解消が済んでいない。

型の整備を含む schedule の追加完了条件: 以下の型すべてに最新の `--target kata` の `pass` が必要。`needs-work` / `fail` は `incomplete` とし、`complete-with-findings` でも完了扱いにしない。未評価・未解決・古い結果は `grade-stale`、読取不能は `grade-unavailable` とする。各対象の鮮度を判定前にも確認し、review 中の変更は `changed-during-review` とする。

型の評価対象（`rulebook`、`--target kata`）: `docs/ja/specdojo/rulebooks/pm-risk-register-rulebook.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pm-risk-register-rulebook.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 97
- `graded_at`: 2026-11-23T18:56:20.719Z（`graded_by`: sonnet-review-executor）
- finding 件数: blocker 0 / major 0 / minor 2 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-business-value` | 4 | 100 |
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
| `vp-qe-kata-conformance` | 3 | 75 |
| `vp-qe-omissions-consistency` | 4 | 100 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-qe-kata-conformance`; line=66]: sample の対応計画で、RK-001 の完了条件に `_UNDECIDED_` が残り、RK-004 の完了条件も確認の手段と合格の基準になっていない。完成例として、本書の完了条件の規定（確認の手段と合格の基準）と整合していない。
- `F002` [minor/`vp-ux-language-consistency`; line=50]: 「リスク ID」（本書）と sample の列名「リスクID」の表記が揺れているため、どちらかに統一する必要がある。

型の評価対象（`sample: specdojo:pm-risk-register-sample`、`--target kata`）: `docs/ja/specdojo/samples/pm-risk-register-sample.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pm-risk-register-sample.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 93
- `graded_at`: 2026-11-23T18:55:48.630Z（`graded_by`: sonnet-review-executor）
- finding 件数: blocker 0 / major 2 / minor 2 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-business-value` | 4 | 100 |
| `vp-ba-requirements-completeness` | 4 | 100 |
| `vp-ba-stakeholder-clarity` | 4 | 100 |
| `vp-dev-change-impact` | 4 | 100 |
| `vp-dev-implementation-readiness` | 4 | 100 |
| `vp-dev-testability` | 4 | 100 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 4 | 100 |
| `vp-ops-release-readiness` | 2 | 50 |
| `vp-pm-control-reporting` | 4 | 100 |
| `vp-pm-dependency-risk` | 4 | 100 |
| `vp-pm-plan-feasibility` | 3 | 75 |
| `vp-po-decision-readiness` | 4 | 100 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-kata-conformance` | 4 | 100 |
| `vp-qe-omissions-consistency` | 4 | 100 |
| `vp-qe-verifiability` | 2 | 50 |
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-pm-plan-feasibility`; line=68]: RK-001 の完了条件の試行件数と会計確定の秒数が `_UNDECIDED_` のままで、完了を判定できない。具体値を入れる。
- `F002` [major/`vp-qe-verifiability`; line=68]: RK-001 の完了条件の件数と秒数が `_UNDECIDED_` のままで、rulebook 6.4 の「確認の手段と合格の基準」を満たさず合否を判定できない。具体値を確定する。
- `F003` [minor/`vp-ux-language-consistency`; line=71]: RK-004 の対応方針が「低減」なのに、完了条件は課題 IS-002 への移管で、方針区分と内容が一致しない。移管した旨を方針の側でも分かる表記にそろえる。
- `F004` [major/`vp-ops-release-readiness`; line=68]: RK-001 の完了条件に `_UNDECIDED_` が残っており、ready 化の前提である未解決事項の解消が済んでいない。

型の評価対象（`template: specdojo:pm-risk-register-template`、`--target kata`）: `docs/ja/specdojo/templates/pm-risk-register-template.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.pm-risk-register-template.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `fail`
- `score`: 64
- `graded_at`: 2026-10-22T20:39:11.743Z（`graded_by`: flash-high-executor）
- finding 件数: blocker 1 / major 16 / minor 0 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-business-value` | 2 | 50 |
| `vp-ba-requirements-completeness` | 2 | 50 |
| `vp-ba-stakeholder-clarity` | 2 | 50 |
| `vp-dev-change-impact` | 2 | 50 |
| `vp-dev-implementation-readiness` | 2 | 50 |
| `vp-dev-testability` | 4 | 100 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 2 | 50 |
| `vp-ops-release-readiness` | 2 | 50 |
| `vp-pm-control-reporting` | 2 | 50 |
| `vp-pm-dependency-risk` | 2 | 50 |
| `vp-pm-plan-feasibility` | 2 | 50 |
| `vp-po-decision-readiness` | 2 | 50 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 2 | 50 |
| `vp-qe-kata-conformance` | 0 | 0 |
| `vp-qe-omissions-consistency` | 2 | 50 |
| `vp-qe-verifiability` | 2 | 50 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 2 | 50 |

finding:

- `F001` [major/`vp-po-purpose-alignment`; line=1]: このテンプレートは誤ったルールブックを参照しており、自身を自動生成されたビューとして記述しています。そのため、親となるルールブックで定義されたリスクレジスターの目的に適合していません。
- `F002` [major/`vp-po-decision-readiness`; line=1]: このテンプレートには、POの意思決定に必要なリスク評価基準、保留事項、および影響分析のための構造とプレースホルダーが不足しています。
- `F003` [major/`vp-pm-plan-feasibility`; line=1]: このテンプレートには、実行可能な緩和タスク、割り当てられた役割、期限、または完了基準のためのフィールドが提供されていません。
- `F004` [major/`vp-pm-dependency-risk`; line=1]: このテンプレートには、特定されたリスク、依存関係、またはスケジュールやその後の成果物への影響を記録するためのセクションがありません。
- `F005` [major/`vp-pm-control-reporting`; line=1]: The template lacks sections for monitoring cycles, reporting triggers, and explicit linkages to related documents like pm-issue-log.
- `F006` [major/`vp-ba-business-value`; line=1]: このテンプレートには、ビジネスコンテキスト、対象となるリスク、および期待される緩和価値を記述するためのプレースホルダーが不足しています。
- `F007` [major/`vp-ba-requirements-completeness`; line=1]: このテンプレートには、完全なリスク要件、スコープ、および受け入れ基準を捉えるために必要なセクションが提供されていません。
- `F008` [major/`vp-ba-stakeholder-clarity`; line=1]: このテンプレートには、責任ある役割、ステークホルダー、およびレビュアーを指定するためのプレースホルダーとテーブルの列が不足しています。
- `F009` [major/`vp-dev-implementation-readiness`; line=1]: このテンプレートには、実装に必要な入力フィールド、テーブルテンプレート、または作成構造が提供されていません。
- `F010` [major/`vp-dev-change-impact`; line=1]: このテンプレートは、個別のPJRファイルからの派生を誤って指定しており、ビルドプロセスと成果物の依存関係に関する重大な混乱を招いています。
- `F011` [major/`vp-qe-verifiability`; line=1]: このテンプレートには評価基準と完了条件の構造が不足しており、リスクの検証可能な合否判定ができません。
- `F012` [major/`vp-qe-omissions-consistency`; line=1]: rulebook で定義された必須本文構成（概要〜関連ドキュメント）がすべて欠落している。
- `F013` [blocker/`vp-qe-kata-conformance`; line=1]: ルールブックでは手動作成の文書構成を定義しているが、本テンプレートは自動生成ビューとして定義されており、責務が根本的に矛盾している。
- `F014` [major/`vp-qe-kata-conformance`; line=1]: Frontmatter の rulebook 指定が specdojo:pjr-rulebook となっており、正しくは specdojo:pm-risk-register-rulebook である。
- `F015` [major/`vp-ux-readability`; line=1]: ルールブックに定義されたリスク登録簿としての構造を持たず、実務上のテンプレートとして機能していない。
- `F016` [major/`vp-ops-release-readiness`; line=1]: このテンプレートは、未解決のブロッカーや重大な問題を抱えているにもかかわらず、フロントマターで ready とマークされています。
- `F017` [major/`vp-ops-operability`; line=1]: このテンプレートは個別のPJRファイルから再生成可能であると主張していますが、再生成のメカニズムや運用ワークフローは提供されていません。

## 4. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | QE | vp-qe-omissions-consistency | rulebook の章立てと必須の表に沿っていること |
| DC-002 | QE | vp-qe-kata-conformance | Sample 記述標準と共通サンプル文脈（駄菓子屋のプロジェクト）に沿っていること |
| DC-003 | QE | vp-qe-kata-conformance | rulebook の禁止事項に当たらないこと |
| DC-004 | BA | vp-ba-requirements-completeness | 発生確率と影響度の段階ごとの条件と、組み合わせから優先度を決める対応表を示していること |
| DC-005 | QE | vp-qe-verifiability | 対応の完了条件を、確認の手段と合格の基準で書いていること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 5. 進め方

fully-guided のタスクは、宣言された文書だけを参照し、rulebook / recipe / sample に沿って既存成果物を磨き込むことを求めた。下書きや調査による新しい値の選定は draft の役割である。磨き込みでは template を読み込まない。rulebook の必須要素・禁止事項、recipe の問い、sample の形式との整合は grade が評価済みである。review はこれらを照合し直さず、評価結果の finding として扱う。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備）:

- rulebook: `docs/ja/specdojo/rulebooks/pm-risk-register-rulebook.md`
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/pm-risk-register-sample.md`
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

`共通規約 sha256:0a9a60c0cf290acdf66e250274fb2db883829723ca3d3b292356b3276021b7f2` `docs/ja/projects/prj-0001/execution/conventions/0a9a60c0cf290acdf66e250274fb2db883829723ca3d3b292356b3276021b7f2.txt`
