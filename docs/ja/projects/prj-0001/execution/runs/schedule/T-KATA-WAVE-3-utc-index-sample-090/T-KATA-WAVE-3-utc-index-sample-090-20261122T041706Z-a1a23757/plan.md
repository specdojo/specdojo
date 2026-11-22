---
specdojo:
  id: prj-0001:xrp-t-kata-wave-3-utc-index-sample-090-20261122t041706z-a1a23757
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-utc-index-sample-090
  name: "完成版レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  owner: QE
  approach: fully-guided
  targets:
    - specdojo:utc-index-sample
---

# Review Plan: T-KATA-WAVE-3-utc-index-sample-090

## 1. このフェーズで行うこと

対応する rulebook と sample を読み、章構成・判断基準・例の充実度・相互整合をレビューする。sample の done_criteria だけで完了としない。成果物・型は変更せず、指摘と根拠を review result に残す。

## 2. 対象成果物

- `name`: 単体テスト（全体構成）の完成例
- `depends_on`:
  - [[specdojo:tsp-index-sample]]
- `based_on`（対象成果物の frontmatter）: [[specdojo:tsp-index-sample]]、[[specdojo:bac-sample]]
- 個票の `入力`: なし
- `overview`: 駄菓子屋の販売管理システムを題材に、単体テストの全体構成の完成例を示す
- `path`: `docs/ja/specdojo/samples/utc-index-sample.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/utc-index-rulebook.md`（`_MISSING_` は `undecided`、`not-needed`、または未整備）
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-utc-index-sample-090/T-KATA-WAVE-3-utc-index-sample-090-20261122T041706Z-a1a23757/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/specdojo/samples/utc-index-sample.md`
- grade の対象種別（`--target`）: `kata`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.utc-index-sample.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 省略した（評価対象の `content_hash` が評価結果と一致したため、既存の評価結果を使う）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 92
- `graded_at`: 2026-11-22T01:26:03.510Z（`graded_by`: opus-review-executor）
- finding 件数: blocker 0 / major 1 / minor 7 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-technical-constraints` | 3 | 75 |
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
| `vp-qe-kata-conformance` | 3 | 75 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-pm-plan-feasibility`; line=111]: 「メモ / 将来課題」の各論点（AC-02 への接続、通信が途絶えたときの扱い、`kinuya-ci-unit` の整備）に、決める時期または締め切り（例: 内部結合テストの入口条件の判定まで）を足し、証跡の差し替えなどの後続作業を日程に組み込めるようにする。
- `F002` [minor/`vp-arc-technical-constraints`; line=88]: 記録サービスの Stub は保存の成功と失敗だけを返す定義で、rulebook の 6.7 が求めるタイムアウトの再現と、非同期・並行性の扱い（当てはまらないならその旨）が抜けているため、追記する。
- `F003` [minor/`vp-qe-omissions-consistency`; line=79]: つけ残高の行の採用理由「つけ残高を1分以内に確認する価値の前提」は、本書が定める採用根拠（業務への影響か BAC の明示要求）に当てはまらない。また AC-02 を含む成功基準・受入条件の文書が `based_on` にないため、業務への影響で根拠を書き直すか、根拠とした文書を `based_on` に加える。
- `F004` [minor/`vp-qe-omissions-consistency`; line=40]: 「通信不能時の販売継続」の行の代替レベル/代替手段の欄が、担保するテストレベルではなく「決定後に再判断」になっている。rulebook の 6.3.2 は担保先を必ず書くよう求めているため、未決のあいだ担保先がないこと（例: どのレベルでも担保しない、受入は保留）を明記する。
- `F005` [minor/`vp-qe-omissions-consistency`; line=107]: ケース表の共通カラムでは「CI 未整備の間は証跡を暫定と書く」と定め、「メモ / 将来課題」でも CI の整備を前提として扱っているのに、記入例の `証跡` が `kinuya-ci-unit` の実行結果になっていて自分のルールと合わない。記入例を暫定の書き方にそろえるか、CI 整備後の書き方であることを注記する。
- `F006` [minor/`vp-qe-kata-conformance`; line=29]: 分割の目安を「観点が 15、ケース表が 50 行を超えた場合」としているが、rulebook の 6.2 は「15以上／50以上」を分割候補としており、ちょうど15・50の場合の扱いが食い違うため、rulebook に合わせて「以上」にそろえる。
- `F007` [minor/`vp-ops-release-readiness`; line=111]: 前回の major（ready にするための条件がまったくない）は、未決事項と決まるまでの扱いが書かれたことで大部分が解消したため minor に下げる。ただし「メモ / 将来課題」の各論点のうち、どれを ready にする前に解消すべきかが書かれていないため、ready にする前に解消すべき論点を明記する。
- `F008` [major/`vp-ops-release-readiness`; line=113]: 未解決の _TODO_ / _ASSUMPTION_ が残っています。

型の整備を含む schedule の追加完了条件: 以下の型すべてに最新の `--target kata` の `pass` が必要。`needs-work` / `fail` は `incomplete` とし、`complete-with-findings` でも完了扱いにしない。未評価・未解決・古い結果は `grade-stale`、読取不能は `grade-unavailable` とする。各対象の鮮度を判定前にも確認し、review 中の変更は `changed-during-review` とする。

型の評価対象（`rulebook`、`--target kata`）: `docs/ja/specdojo/rulebooks/utc-index-rulebook.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.utc-index-rulebook.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 91
- `graded_at`: 2026-11-22T01:24:55.746Z（`graded_by`: opus-review-executor）
- finding 件数: blocker 0 / major 0 / minor 6 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 3 | 75 |
| `vp-arc-document-structure` | 4 | 100 |
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
| `vp-po-decision-readiness` | 4 | 100 |
| `vp-po-publication-accountability` | 4 | 100 |
| `vp-po-purpose-alignment` | 4 | 100 |
| `vp-qe-kata-conformance` | 3 | 75 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-arc-conciseness`; line=113]: 6.3.2 の空の推奨フォーマット表は 6.3.3 の典型例の表と見出し行が同一で二重の説明になっているため、典型例の表をそのままフォーマットとして示し、記載ルール（代替レベル必須・例外なしは `なし`）だけを残して統合する。
- `F002` [minor/`vp-qe-omissions-consistency`; line=248]: 禁止事項の「`utc-index` に個別ケース（条件・手順・期待値）を大量に列挙する」は全体方針の「個別ケースは列挙しない」と許容範囲が食い違うため、「大量に」を外すか、記載例として許す範囲を両方で一致させる。
- `F003` [minor/`vp-qe-kata-conformance`; line=13]: `_UNDECIDED_` の「sample は『本文要件』の見出し構成へ未整合であり、後続の sample の見直しで揃える」は、現在の `utc-index-sample` が本文要件の9見出し・カラム順と一致している実態と矛盾するため、sample の部分を削除して recipe・template の未決事項だけを残す（前回の major は sample 側の整合で解消済みのため、残る記述の更新漏れとして minor とした）。
- `F004` [minor/`vp-ux-language-consistency`; line=99]: 6.1 でテストレベルを「IT/ET/ST/AT」と定義しているのに、6.2・6.3（典型例の表を含む）では未定義の「E2E」を代替レベルとして用いており、どのレベルを指すか揺れるため、ST/AT など定義済みのレベル名に揃える。
- `F005` [minor/`vp-ux-language-consistency`; line=205]: 6.7 の「例外方針（Mock/Stub/Fakeの使い分け）」は内容が例外ではなくテストダブルの使い分けであり、6.3 の「例外（UTで扱う条件）」と用語が衝突するため、「テストダブルの使い分け」などへ改名する。
- `F006` [minor/`vp-ops-release-readiness`; line=13]: ready 化前の解消事項として挙げた「sample の見出し構成の未整合」は既に解消済みで、残課題が実態より多く見えるため、`_UNDECIDED_` を recipe・template の要否（PJR-WYTX）だけに更新して ready 化判断の前提を正確にする。

型の評価対象（`sample: specdojo:utc-index-sample`、`--target kata`）: `docs/ja/specdojo/samples/utc-index-sample.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.utc-index-sample.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 92
- `graded_at`: 2026-11-22T01:26:03.510Z（`graded_by`: opus-review-executor）
- finding 件数: blocker 0 / major 1 / minor 7 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-technical-constraints` | 3 | 75 |
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
| `vp-qe-kata-conformance` | 3 | 75 |
| `vp-qe-omissions-consistency` | 3 | 75 |
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-pm-plan-feasibility`; line=111]: 「メモ / 将来課題」の各論点（AC-02 への接続、通信が途絶えたときの扱い、`kinuya-ci-unit` の整備）に、決める時期または締め切り（例: 内部結合テストの入口条件の判定まで）を足し、証跡の差し替えなどの後続作業を日程に組み込めるようにする。
- `F002` [minor/`vp-arc-technical-constraints`; line=88]: 記録サービスの Stub は保存の成功と失敗だけを返す定義で、rulebook の 6.7 が求めるタイムアウトの再現と、非同期・並行性の扱い（当てはまらないならその旨）が抜けているため、追記する。
- `F003` [minor/`vp-qe-omissions-consistency`; line=79]: つけ残高の行の採用理由「つけ残高を1分以内に確認する価値の前提」は、本書が定める採用根拠（業務への影響か BAC の明示要求）に当てはまらない。また AC-02 を含む成功基準・受入条件の文書が `based_on` にないため、業務への影響で根拠を書き直すか、根拠とした文書を `based_on` に加える。
- `F004` [minor/`vp-qe-omissions-consistency`; line=40]: 「通信不能時の販売継続」の行の代替レベル/代替手段の欄が、担保するテストレベルではなく「決定後に再判断」になっている。rulebook の 6.3.2 は担保先を必ず書くよう求めているため、未決のあいだ担保先がないこと（例: どのレベルでも担保しない、受入は保留）を明記する。
- `F005` [minor/`vp-qe-omissions-consistency`; line=107]: ケース表の共通カラムでは「CI 未整備の間は証跡を暫定と書く」と定め、「メモ / 将来課題」でも CI の整備を前提として扱っているのに、記入例の `証跡` が `kinuya-ci-unit` の実行結果になっていて自分のルールと合わない。記入例を暫定の書き方にそろえるか、CI 整備後の書き方であることを注記する。
- `F006` [minor/`vp-qe-kata-conformance`; line=29]: 分割の目安を「観点が 15、ケース表が 50 行を超えた場合」としているが、rulebook の 6.2 は「15以上／50以上」を分割候補としており、ちょうど15・50の場合の扱いが食い違うため、rulebook に合わせて「以上」にそろえる。
- `F007` [minor/`vp-ops-release-readiness`; line=111]: 前回の major（ready にするための条件がまったくない）は、未決事項と決まるまでの扱いが書かれたことで大部分が解消したため minor に下げる。ただし「メモ / 将来課題」の各論点のうち、どれを ready にする前に解消すべきかが書かれていないため、ready にする前に解消すべき論点を明記する。
- `F008` [major/`vp-ops-release-readiness`; line=113]: 未解決の _TODO_ / _ASSUMPTION_ が残っています。

## 4. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | QE | vp-qe-omissions-consistency | rulebook の章立てと必須の表に沿っていること |
| DC-002 | QE | vp-qe-kata-conformance | Sample 記述標準と共通サンプル文脈（駄菓子屋のプロジェクト）に沿っていること |
| DC-003 | QE | vp-qe-kata-conformance | rulebook の禁止事項に当たらないこと |
| DC-004 | QE | vp-qe-kata-conformance | H1 が rulebook の定めるタイトル形式で、Frontmatter の `based_on` に直接の根拠（tsp-index）を持つこと |
| DC-005 | QE | vp-qe-verifiability | 受け入れ基準と合否の判定基準が、観測できる条件と期待値で書かれていること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 5. 進め方

fully-guided のタスクは、宣言された文書だけを参照し、rulebook / recipe / sample に沿って既存成果物を磨き込むことを求めた。下書きや調査による新しい値の選定は draft の役割である。磨き込みでは template を読み込まない。rulebook の必須要素・禁止事項、recipe の問い、sample の形式との整合は grade が評価済みである。review はこれらを照合し直さず、評価結果の finding として扱う。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備）:

- rulebook: `docs/ja/specdojo/rulebooks/utc-index-rulebook.md`
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/utc-index-sample.md`
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
