---
specdojo:
  id: prj-0001:xrp-t-kata-wave-3-trc-requirements-to-tests-sample-090-20261122t073308z-5bfed45b
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-trc-requirements-to-tests-sample-090
  name: "完成版レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  owner: QE
  approach: fully-guided
  targets:
    - specdojo:trc-requirements-to-tests-sample
---

# Review Plan: T-KATA-WAVE-3-trc-requirements-to-tests-sample-090

## 1. このフェーズで行うこと

対応する rulebook と sample を読み、章構成・判断基準・例の充実度・相互整合をレビューする。sample の done_criteria だけで完了としない。成果物・型は変更せず、指摘と根拠を review result に残す。

## 2. 対象成果物

- `name`: 要求とテストの対応（派生ビュー）の完成例
- `depends_on`:
  - [[specdojo:atc-sample]]
  - [[specdojo:stc-sample]]
- `based_on`（対象成果物の frontmatter）: [[specdojo:bac-sample]]、[[specdojo:prj-success-criteria-and-acceptance-criteria-sample]]、[[specdojo:atc-sample]]、[[specdojo:stc-sample]]、[[specdojo:stc-index-sample]]
- 個票の `入力`: なし
- `overview`: 駄菓子屋の業務の受入基準と受入テスト・総合テストを題材に、要求とテストの対応の派生ビューの完成例を示す
- `path`: `docs/ja/specdojo/samples/trc-requirements-to-tests-sample.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/trc-requirements-to-tests-rulebook.md`（`_MISSING_` は `undecided`、`not-needed`、または未整備）
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-trc-requirements-to-tests-sample-090/T-KATA-WAVE-3-trc-requirements-to-tests-sample-090-20261122T073308Z-5bfed45b/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/specdojo/samples/trc-requirements-to-tests-sample.md`
- grade の対象種別（`--target`）: `kata`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.trc-requirements-to-tests-sample.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 省略した（評価対象の `content_hash` が評価結果と一致したため、既存の評価結果を使う）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 99
- `graded_at`: 2026-11-22T06:57:44.575Z（`graded_by`: opus-review-executor）
- finding 件数: blocker 0 / major 0 / minor 1 / note 0

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
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-ux-language-consistency`; line=73]: ギャップと対応方針の表の「対象」列で、`prj-success-criteria-and-acceptance-criteria-sample SC-01`・`AC-01` や `bac-sample BAC-02`, `BAC-03` のように 2 件目以降の項目 ID に要求文書 ID がなく、区切りも `,` と `・` が混在しており、rulebook の要求項目の表記 `＜要求文書ID＞ ＜項目ID＞` とマトリクスの要求ID列に揃っていないため、各項目に文書 ID を付けて区切りを統一する（前回の指摘は各グループの先頭に文書 ID が付いたことで大部分が解消し、残りは表記の統一だけのため minor とする）。

型の整備を含む schedule の追加完了条件: 以下の型すべてに最新の `--target kata` の `pass` が必要。`needs-work` / `fail` は `incomplete` とし、`complete-with-findings` でも完了扱いにしない。未評価・未解決・古い結果は `grade-stale`、読取不能は `grade-unavailable` とする。各対象の鮮度を判定前にも確認し、review 中の変更は `changed-during-review` とする。

型の評価対象（`rulebook`、`--target kata`）: `docs/ja/specdojo/rulebooks/trc-requirements-to-tests-rulebook.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.trc-requirements-to-tests-rulebook.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 92
- `graded_at`: 2026-11-22T06:56:23.492Z（`graded_by`: opus-review-executor）
- finding 件数: blocker 0 / major 0 / minor 4 / note 0

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
| `vp-qe-verifiability` | 4 | 100 |
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-arc-conciseness`; line=78]: `relations.verifies` を定める種別（受入テスト）と定めない種別（総合テスト）の区別が、本文 10 行目・53 行目・78 行目で繰り返されているため、充足状況の判定の前文に 1 か所だけ定義し、全体方針と手順 2 からはそこを参照してください。
- `F002` [minor/`vp-qe-omissions-consistency`; line=60]: 手順 3 の規則は「要求文書だけで項目 ID がない行は手順 4 で記録する」とするが、手順 4 が記録するのは母集団にない項目・文書を指す行と `relations.verifies` との不一致だけで、母集団の要求文書を指しながら項目 ID がない行の記録先（母集団外の参照の表に入れるかどうか）が定まらないため、手順 4 にこの場合の記録先と表の書き方を加えてください。
- `F003` [minor/`vp-qe-kata-conformance`; line=78]: 前回の major のうち `relations.verifies` に関する部分は本文 10 行目と 78 行目で解消されたため minor に下げるが、`stc-rulebook` が仕様ID を「根拠仕様の文書ID」と定めたままで、本 rulebook は項目 ID のない行を項目への対応としないため `stc-rulebook` どおりの総合テストは要求項目に対応せず、仕様ID に項目 ID まで書くよう `stc-rulebook` 側の対応を求めるか、本 rulebook にその前提を明記してください。
- `F004` [minor/`vp-ux-language-consistency`; line=125]: 禁止事項の「要求 ID または対応テスト ID の空欄」は、標準列名の「要求ID」「対応テストID」と表記が揺れていて、同じ列を指すことが読み取りにくいため、列名と同じ表記にそろえてください。

型の評価対象（`sample: specdojo:trc-requirements-to-tests-sample`、`--target kata`）: `docs/ja/specdojo/samples/trc-requirements-to-tests-sample.md`
評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.trc-requirements-to-tests-sample.yaml`

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 99
- `graded_at`: 2026-11-22T06:57:44.575Z（`graded_by`: opus-review-executor）
- finding 件数: blocker 0 / major 0 / minor 1 / note 0

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
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 4 | 100 |

finding:

- `F001` [minor/`vp-ux-language-consistency`; line=73]: ギャップと対応方針の表の「対象」列で、`prj-success-criteria-and-acceptance-criteria-sample SC-01`・`AC-01` や `bac-sample BAC-02`, `BAC-03` のように 2 件目以降の項目 ID に要求文書 ID がなく、区切りも `,` と `・` が混在しており、rulebook の要求項目の表記 `＜要求文書ID＞ ＜項目ID＞` とマトリクスの要求ID列に揃っていないため、各項目に文書 ID を付けて区切りを統一する（前回の指摘は各グループの先頭に文書 ID が付いたことで大部分が解消し、残りは表記の統一だけのため minor とする）。

## 4. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | QE | vp-qe-omissions-consistency | rulebook の章立てと必須の表に沿っていること |
| DC-002 | QE | vp-qe-kata-conformance | Sample 記述標準と共通サンプル文脈（駄菓子屋のプロジェクト）に沿っていること |
| DC-003 | QE | vp-qe-kata-conformance | rulebook の禁止事項に当たらないこと |
| DC-004 | QE | vp-qe-omissions-consistency | rulebook が出力の列ごとに生成元と変換規則を定め、手編集しない派生ビューとして入力の解決・充足状況とギャップの導出・再生成の方法を示していること |
| DC-005 | QE | vp-qe-verifiability | 各要求の充足状況が rulebook の判定条件と一致していること（対応テストのある要求を未着手にしない） |
| DC-006 | QE | vp-qe-omissions-consistency | Frontmatter の `based_on` に本文が参照する直接の生成元をすべて持ち、前提に生成の手段と生成日を書いていること |
| DC-007 | QE | vp-qe-kata-conformance | ギャップ表に担当・期限の列を持たず、手編集を前提にした更新ルールを書いていないこと |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 5. 進め方

fully-guided のタスクは、宣言された文書だけを参照し、rulebook / recipe / sample に沿って既存成果物を磨き込むことを求めた。下書きや調査による新しい値の選定は draft の役割である。磨き込みでは template を読み込まない。rulebook の必須要素・禁止事項、recipe の問い、sample の形式との整合は grade が評価済みである。review はこれらを照合し直さず、評価結果の finding として扱う。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備）:

- rulebook: `docs/ja/specdojo/rulebooks/trc-requirements-to-tests-rulebook.md`
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/trc-requirements-to-tests-sample.md`
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
