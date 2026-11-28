---
specdojo:
  id: prj-0001:xrp-t-kata-wave-5-opr-batch-sample-090-20261124t013340z-370ae288
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-opr-batch-sample-090
  name: "型の grade とレビュー"
  mode: review
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: fully-guided
  targets:
    - specdojo:opr-batch-sample
---

# Review Plan: T-KATA-WAVE-5-opr-batch-sample-090

## 1. このフェーズで行うこと

review の前に、runner が rulebook と sample の組（rulebook が宣言する recipe・template を含む）を grade の --target kata で評価する。この評価結果と、対応する rulebook と sample を読み、章構成・判断基準・例の充実度・相互整合をレビューする。sample の done_criteria だけで完了としない。成果物・型は変更せず、指摘と根拠を review result に残す。
人の確定はこの track に入れず、sample がひととおりそろった後の横串の確認でまとめて行う。確定の前に確かめるべき点は review result に書く。

## 2. 対象成果物

- `name`: 運用手順（バッチ再実行）の完成例
- `depends_on`:
  - [[specdojo:opd-index-sample]]
  - [[specdojo:opr-sample]]
- `based_on`（対象成果物の frontmatter）: [[opd-index]]
- 個票の `入力`: なし
- `overview`: 駄菓子屋の販売管理システムを題材に、バッチ再実行の運用手順の完成例を示す
- `path`: `docs/ja/specdojo/samples/opr-batch-sample.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/opr-rulebook.md`（`_MISSING_` は `undecided`、`not-needed`、または未整備）
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-opr-batch-sample-090/T-KATA-WAVE-5-opr-batch-sample-090-20261124T013340Z-370ae288/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/specdojo/samples/opr-batch-sample.md`
- grade の対象種別（`--target`）: `kata`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-batch-sample.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 実行した（run id: `review-prj-0001-T-KATA-WAVE-5-opr-batch-sample-090-0e1384b32e-20261124T013307Z`）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 89
- `graded_at`: 2026-11-24T01:33:40.390Z（`graded_by`: sonnet-review-executor）
- finding 件数: blocker 0 / major 0 / minor 8 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 3 | 75 |
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
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 3 | 75 |
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-arc-conciseness`; line=46]: P2 の条件・対応（開店前に成功記録なし→再実行）が、4章の表・5章の暫定対応・7.1 に重複しています。7.1 を基準に、他章は参照へ集約できます。
- `F002` [minor/`vp-qe-verifiability`; line=77]: 「当日の実行回数」の数え方（前夜の自動取得を当日に含めるか、当日閉店後の自動取得を上限 2 回にどう数えるか）が判定できません。起点日（`closing_date` 基準など）を明記してください。
- `F003` [minor/`vp-qe-omissions-consistency`; line=43]: 4章の表が template の列（初動目標・切り分け・一次対応・復旧・エスカレーション）と異なります。rulebook の「初動目標、切り分け、一次対応、復旧」を満たす列へ揃えるか、`opr-index` 参照と明記してください。
- `F004` [minor/`vp-qe-omissions-consistency`; line=146]: `opr-incident` と `opd-monitoring` を「予定」としていますが、`opr-incident-sample` と `opd-monitoring-sample` が存在します。ID と備考を実態に合わせてください。
- `F005` [minor/`vp-qe-kata-conformance`; line=1]: Frontmatter の `based_on` が `opd-index` で、他 sample の `specdojo:opd-index-sample` と不整合です。実在する ID（必要なら `specdojo:opr-sample` も）へ修正してください。
- `F006` [minor/`vp-qe-kata-conformance`; line=26]: template の項目名は「連絡先」ですが、本書は「連絡経路」です。template に合わせてください。
- `F007` [minor/`vp-qe-kata-conformance`; line=51]: 5章が template の段階表（確認・暫定対応・恒久対応・誤検知の完了条件と証跡）ではなく箇条書きです。誤検知のクローズ条件に当たる完了条件・証跡が不明確なので、表形式に揃えてください。
- `F008` [minor/`vp-ux-language-consistency`; line=143]: 方針文書の参照が、wikilink（`opd-index-sample`）と素の `opd-monitoring` で混在しています。実在する sample ID の wikilink に統一してください。

型の整備を含む schedule の追加完了条件: 以下の型すべてに最新の `--target kata` の `pass` が必要。`needs-work` / `fail` は `incomplete` とし、`complete-with-findings` でも完了扱いにしない。未評価・未解決・古い結果は `grade-stale`、読取不能は `grade-unavailable` とする。各対象の鮮度を判定前にも確認し、review 中の変更は `changed-during-review` とする。

型の評価対象（`rulebook`、`--target kata`）: `docs/ja/specdojo/rulebooks/opr-rulebook.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-rulebook.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 94
- `graded_at`: 2026-11-23T18:17:04.191Z（`graded_by`: sonnet-review-executor）
- finding 件数: blocker 0 / major 1 / minor 1 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 3 | 75 |
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
| `vp-qe-kata-conformance` | 2 | 50 |
| `vp-qe-omissions-consistency` | 4 | 100 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-arc-conciseness`; line=97]: 6.4 の「停止判断・ロールバックが関わる場合は判断条件と承認者を書く」は template の障害対応手順の注記と同文の再掲であり、6.6 の RTO/RPO 達成可否の判定の記述も template と重複するため、正本の template 参照に置き換えるか差分だけに絞るべきである。
- `F002` [major/`vp-qe-kata-conformance`; line=1]: `opr-batch-sample`・`opr-change-sample`・`opr-support-sample` の 3 件が `rulebook: specdojo:opd-rulebook` を宣言し、template の12章構成にもなっていないため、`rulebook` を `specdojo:opr-rulebook` に直して template 構成に揃えるか、Frontmatter の sample 宣言から外すべきである。

型の評価対象（`sample: specdojo:opr-sample`、`--target kata`）: `docs/ja/specdojo/samples/opr-sample.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-sample.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 94
- `graded_at`: 2026-11-23T18:17:45.923Z（`graded_by`: sonnet-review-executor）
- finding 件数: blocker 0 / major 0 / minor 4 / note 0

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
| `vp-ops-release-readiness` | 3 | 75 |
| `vp-pm-control-reporting` | 4 | 100 |
| `vp-pm-dependency-risk` | 4 | 100 |
| `vp-pm-plan-feasibility` | 4 | 100 |
| `vp-po-decision-readiness` | 3 | 75 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-kata-conformance` | 3 | 75 |
| `vp-qe-omissions-consistency` | 4 | 100 |
| `vp-qe-verifiability` | 3 | 75 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-po-decision-readiness`; line=7]: 未決事項の表に、決定者（Role code）と決定の期限または判断タイミングの列を足し、PO が承認・保留を判断する際の次アクションを読み取れるようにする必要がある。
- `F002` [minor/`vp-qe-verifiability`; line=126]: 証跡の保管期間が監査ログ以外すべて `_UNDECIDED_` で判定値がない。概要の未決事項の表に「保管期間」の行を足して扱いを示すか、サンプル上の仮値（例: 点検記録 1 年）を置いて、水準を例示する必要がある。
- `F003` [minor/`vp-qe-kata-conformance`; line=142]: 関連導線の表と直後の文が「分冊は障害対応だけ」「`opr-incident` は予定」と書く一方、分冊 sample が複数存在し、`opr-incident-sample` は本書を `opr-index-sample` として参照している。id と分冊の記述を揃える必要がある。
- `F004` [minor/`vp-ops-release-readiness`; line=7]: 未決事項の表に、ready 化の前に解消すべき項目と確認者を示す記述（または列）が無く、ready 化の判断基準が読み取れない。

型の評価対象（`sample: specdojo:opr-access-control-sample`、`--target kata`）: `docs/ja/specdojo/samples/opr-access-control-sample.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-access-control-sample.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 95
- `graded_at`: 2026-11-23T18:41:14.858Z（`graded_by`: sonnet-review-executor）
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
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-qe-omissions-consistency`; line=107]: 本書の緊急権限と `OPS` による付与の実施は、`opr-sample` の「アカウントは店番担当と `DEV` に限る・緊急権限は置かない・`DEV` が実施」と食い違うため、`opr-sample` 側を本書に合わせて更新するか、差分であることを概要で明示して整合させるべきである。
- `F002` [minor/`vp-qe-kata-conformance`; line=107]: 本書の緊急権限と `OPS` による付与の実施は、`opr-sample` の「アカウントは店番担当と `DEV` に限る・緊急権限は置かない・`DEV` が実施」と食い違うため、`opr-sample` 側を本書に合わせて更新するか、差分であることを概要で明示して整合させるべきである。

型の評価対象（`sample: specdojo:opr-backup-restore-sample`、`--target kata`）: `docs/ja/specdojo/samples/opr-backup-restore-sample.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-backup-restore-sample.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 98
- `graded_at`: 2026-11-23T18:41:40.623Z（`graded_by`: sonnet-review-executor）
- finding 件数: blocker 0 / major 0 / minor 2 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 3 | 75 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-business-value` | 4 | 100 |
| `vp-ba-requirements-completeness` | 4 | 100 |
| `vp-ba-stakeholder-clarity` | 4 | 100 |
| `vp-dev-change-impact` | 4 | 100 |
| `vp-dev-implementation-readiness` | 3 | 75 |
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
| `vp-qe-kata-conformance` | 4 | 100 |
| `vp-qe-omissions-consistency` | 4 | 100 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-arc-conciseness`; line=55]: 6.1 の確認の実施条件・手順・完了条件は、点検手順の表の日次（開店前）の行とほぼ重複している。どちらかを他方への参照に置き換えれば、判断情報を失わずにまとめられる。
- `F002` [minor/`vp-dev-implementation-readiness`; line=53]: 復元と取得確認に使うホスティング環境の機能名または操作の入口（別紙への参照でも可）を一言示すと、第三者が復元手順を再現しやすくなる。

型の評価対象（`sample: specdojo:opr-batch-sample`、`--target kata`）: `docs/ja/specdojo/samples/opr-batch-sample.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-batch-sample.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 89
- `graded_at`: 2026-11-24T01:33:40.390Z（`graded_by`: sonnet-review-executor）
- finding 件数: blocker 0 / major 0 / minor 8 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 3 | 75 |
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
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 3 | 75 |
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-arc-conciseness`; line=46]: P2 の条件・対応（開店前に成功記録なし→再実行）が、4章の表・5章の暫定対応・7.1 に重複しています。7.1 を基準に、他章は参照へ集約できます。
- `F002` [minor/`vp-qe-verifiability`; line=77]: 「当日の実行回数」の数え方（前夜の自動取得を当日に含めるか、当日閉店後の自動取得を上限 2 回にどう数えるか）が判定できません。起点日（`closing_date` 基準など）を明記してください。
- `F003` [minor/`vp-qe-omissions-consistency`; line=43]: 4章の表が template の列（初動目標・切り分け・一次対応・復旧・エスカレーション）と異なります。rulebook の「初動目標、切り分け、一次対応、復旧」を満たす列へ揃えるか、`opr-index` 参照と明記してください。
- `F004` [minor/`vp-qe-omissions-consistency`; line=146]: `opr-incident` と `opd-monitoring` を「予定」としていますが、`opr-incident-sample` と `opd-monitoring-sample` が存在します。ID と備考を実態に合わせてください。
- `F005` [minor/`vp-qe-kata-conformance`; line=1]: Frontmatter の `based_on` が `opd-index` で、他 sample の `specdojo:opd-index-sample` と不整合です。実在する ID（必要なら `specdojo:opr-sample` も）へ修正してください。
- `F006` [minor/`vp-qe-kata-conformance`; line=26]: template の項目名は「連絡先」ですが、本書は「連絡経路」です。template に合わせてください。
- `F007` [minor/`vp-qe-kata-conformance`; line=51]: 5章が template の段階表（確認・暫定対応・恒久対応・誤検知の完了条件と証跡）ではなく箇条書きです。誤検知のクローズ条件に当たる完了条件・証跡が不明確なので、表形式に揃えてください。
- `F008` [minor/`vp-ux-language-consistency`; line=143]: 方針文書の参照が、wikilink（`opd-index-sample`）と素の `opd-monitoring` で混在しています。実在する sample ID の wikilink に統一してください。

型の評価対象（`sample: specdojo:opr-change-sample`、`--target kata`）: `docs/ja/specdojo/samples/opr-change-sample.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-change-sample.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 96
- `graded_at`: 2026-11-23T18:42:17.972Z（`graded_by`: sonnet-review-executor）
- finding 件数: blocker 0 / major 0 / minor 3 / note 0

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
| `vp-dev-change-impact` | 3 | 75 |
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
| `vp-qe-kata-conformance` | 4 | 100 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-dev-change-impact`; line=87]: 手動バックアップから復元する手順の参照先（`opr-index` のバックアップ・リストア手順または `opr-backup-restore`）を明記し、導線表にも追加すると、変更が復元手順へ与える影響を追えるようになる。
- `F002` [minor/`vp-qe-omissions-consistency`; line=81]: 適用の手順 step 5 が「閉店後」としており、変更種別の表の緊急変更（営業時間中も可、電話承認）と矛盾する。緊急変更の例外（事前周知を省略、検証と承認の扱い）を明記すること。
- `F003` [minor/`vp-qe-omissions-consistency`; line=97]: 「変更の適用件数とロールバックの件数は `opr-index` の月次点検で集計する」とあるが、`opr-sample` の月次点検の行にその項目はない。集計の責任を本書の運用変更作業に寄せるか、`opr-index` 側に項目を追加すること。

型の評価対象（`sample: specdojo:opr-incident-sample`、`--target kata`）: `docs/ja/specdojo/samples/opr-incident-sample.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-incident-sample.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 91
- `graded_at`: 2026-11-23T18:25:32.007Z（`graded_by`: sonnet-review-executor）
- finding 件数: blocker 0 / major 0 / minor 7 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 3 | 75 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-business-value` | 4 | 100 |
| `vp-ba-requirements-completeness` | 4 | 100 |
| `vp-ba-stakeholder-clarity` | 4 | 100 |
| `vp-dev-change-impact` | 4 | 100 |
| `vp-dev-implementation-readiness` | 3 | 75 |
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
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-arc-conciseness`; line=53]: 4.1 末尾の箇条書き（「気付いた時刻を障害記録に書く」）は、直前の導入文で初動期限の起点として既に述べられているため、導入文に統合するか参照に置き換えて重複を除く。
- `F002` [minor/`vp-dev-implementation-readiness`; line=48]: P1 の切り分け欄は確認の順序だけで、各確認項目の正常・異常の判定基準（見る画面や表示）がないため、`DEV` が実行できるよう判定基準を追記する。
- `F003` [minor/`vp-qe-omissions-consistency`; line=48]: 4.1 は P1 で「30 分で再開できなければ店番担当が紙の販売控えへ切り替える」とし、4.2 は同じ切替を `PO` の判断としている。誰が切り替えるかが読み手に曖昧なため、4.1 を「`PO` の判断（15 分連絡不能なら店番担当）」の趣旨に揃える。
- `F004` [minor/`vp-qe-omissions-consistency`; line=132]: 証跡表の保管期間がすべて `_UNDECIDED_` で、手順上の扱い（消さない）は概要の表に書かれているのが紙の販売控えと障害記録だけである。連絡帳・変更記録・月次点検の記録の扱いも明記する。
- `F005` [minor/`vp-qe-kata-conformance`; line=46]: 4.1 の表は template の列（初動目標、切り分け、一次対応、復旧、エスカレーション）に「条件（守る業務）」列を足し、「復旧」を「復旧の完了条件」に変えている。template の列名に合わせるか、差異の理由を明示する。
- `F006` [minor/`vp-qe-kata-conformance`; line=1]: Frontmatter の `based_on` が `opd-incident-management-sample` だけである。本文では `opd-index`・`opd-access-control` を判断根拠として参照しているため、直接利用した成果物として `based_on` に追加するか、参照を外す。
- `F007` [minor/`vp-ux-language-consistency`; line=53]: 「障害記録の用紙」と、課題管理の「障害記録」（11 章）が別媒体にもかかわらず同じ語で、紙から課題管理へ誰がいつ転記するかが未定義のため、用語を分け、転記者（`OPS`）と時点を追記する。

型の評価対象（`sample: specdojo:opr-monitoring-sample`、`--target kata`）: `docs/ja/specdojo/samples/opr-monitoring-sample.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-monitoring-sample.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 92
- `graded_at`: 2026-11-23T18:16:22.877Z（`graded_by`: sonnet-review-executor）
- finding 件数: blocker 0 / major 0 / minor 6 / note 0

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
| `vp-pm-control-reporting` | 3 | 75 |
| `vp-pm-dependency-risk` | 4 | 100 |
| `vp-pm-plan-feasibility` | 4 | 100 |
| `vp-po-decision-readiness` | 4 | 100 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-kata-conformance` | 3 | 75 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 3 | 75 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-pm-control-reporting`; line=58]: 恒久対応と誤検知の結果を `PO` へ報告するタイミングや報告先が示されておらず、`opr-index` の月次報告との接続が読み取れない。
- `F002` [minor/`vp-qe-verifiability`; line=57]: 暫定対応の時限「確認を終えたらすぐ」は pass/fail を判定できないため、「確認完了から 5 分以内」のように数値で示す。
- `F003` [minor/`vp-qe-omissions-consistency`; line=73]: 誤検知の閾値見直しを「月 3 件以上」としているが、`opr-sample` は「月 3 回を超えたら」で、基準が食い違っている。
- `F004` [minor/`vp-qe-omissions-consistency`; line=54]: 日次締めの差異は監視対象（障害対応手順の表で P2 として引き継がれる）だが、アラート対応手順の確認段階に手順と時限がなく、他の 2 対象と扱いが揃っていない。
- `F005` [minor/`vp-qe-kata-conformance`; line=33]: 日次点検の時刻を 9:30 としているが、`opr-sample` の開店前の日次点検は 9:45 からで、差分文書として共通規約と時刻が食い違っている。
- `F006` [minor/`vp-qe-kata-conformance`; line=42]: 障害対応手順の章が template の列構成（初動目標・切り分け・一次対応・復旧・エスカレーション）と異なる引継ぎ表になっており、手順の形式が template と揃っていない。

型の評価対象（`sample: specdojo:opr-support-sample`、`--target kata`）: `docs/ja/specdojo/samples/opr-support-sample.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-support-sample.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 95
- `graded_at`: 2026-11-24T01:30:57.480Z（`graded_by`: sonnet-review-executor）
- finding 件数: blocker 0 / major 0 / minor 3 / note 0

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
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-qe-omissions-consistency`; line=127]: `opr-incident` を「予定」としているが、`opr-incident-sample` が作成済みで、他の sample（`opr-monitoring-sample` など）は作成済みとして導線を張っている。状態と導線の書き方が揃っておらず、読者が引き継ぎ先の有無を誤解するため、備考を実態に合わせ、wikilink で参照する必要がある。
- `F002` [minor/`vp-qe-omissions-consistency`; line=113]: 引き継ぎの記録の保管期間が `_UNDECIDED_` のままで、概要の未決事項の表（問い合わせ記録のみ記載）にも論点と影響が載っていない。rulebook の「未決の条件は該当章に論点と運用への影響を記載」に沿い、未決事項の表へ追加するか、「概要参照」と明示する必要がある。
- `F003` [minor/`vp-qe-kata-conformance`; line=19]: 手順適用範囲・前提の表に template の必須行「連絡先」がなく、代わりに「問い合わせ者」「一次対応者」の行が入っている。連絡先（営業時間中は店内の電話で `OPS`、応答がなければ `PO`）が「使用手段」に混在しているため、template の 6 行を維持し、追加行は別に足す必要がある。

型の評価対象（`template: specdojo:opr-template`、`--target kata`）: `docs/ja/specdojo/templates/opr-template.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.opr-template.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 100
- `graded_at`: 2026-11-23T18:20:30.641Z（`graded_by`: sonnet-review-executor）
- finding 件数: blocker 0 / major 0 / minor 0 / note 0

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
| `vp-qe-kata-conformance` | 4 | 100 |
| `vp-qe-omissions-consistency` | 4 | 100 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- なし

## 4. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | QE | vp-qe-omissions-consistency | rulebook の章立てと必須の表に沿っていること |
| DC-002 | QE | vp-qe-kata-conformance | Sample 記述標準と共通サンプル文脈（駄菓子屋のプロジェクト）に沿っていること |
| DC-003 | QE | vp-qe-kata-conformance | rulebook の禁止事項に当たらないこと |
| DC-004 | QE | vp-qe-kata-conformance | Frontmatter の `rulebook` が opr-rulebook を指し、opr-rulebook が個別の手順に求める構成に沿っていること |
| DC-005 | DEV | vp-dev-implementation-readiness | 再実行のコマンド・入力・前提の確認・完了の条件を示していること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 5. 進め方

fully-guided のタスクは、宣言された文書だけを参照し、rulebook / recipe / sample に沿って既存成果物を磨き込むことを求めた。下書きや調査による新しい値の選定は draft の役割である。磨き込みでは template を読み込まない。rulebook の必須要素・禁止事項、recipe の問い、sample の形式との整合は grade が評価済みである。review はこれらを照合し直さず、評価結果の finding として扱う。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備）:

- rulebook: `docs/ja/specdojo/rulebooks/opr-rulebook.md`
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/opr-sample.md`
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
