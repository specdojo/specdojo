---
specdojo:
  id: prj-0001:xrp-t-business-specs-kata-2-cdsd-execution-090-20261113t040733z-1e9f1a3b
  type: exec-plan
  rulebook: none
  task_id: T-BUSINESS-SPECS-KATA-2-cdsd-execution-090
  name: "完成版レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  owner: BA
  approach: fully-guided
  targets:
    - cdsd-execution
---

# Review Plan: T-BUSINESS-SPECS-KATA-2-cdsd-execution-090

## 1. このフェーズで行うこと

対応する rulebook・sample（ifx-cmd は recipe・template も）と代表成果物を読み、型一式の章構成・判断基準・例の充実度・相互整合をレビューする。代表成果物の `done_criteria` だけで完了としない。template は frontmatter の ID から明示的に開く。成果物・型は変更せず、指摘と根拠を review result に残す。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 対象成果物

- `name`: 概念データストア定義（プロジェクト実行）
- `depends_on`:
  - [[bdd-exec-event]]
  - [[bdd-exec-state]]
  - [[bdd-exec-plan-result]]
  - [[bdd-exec-evidence]]
  - [[bdd-worktree-branch]]
  - [[bdd-routine-definition]]
  - [[bdd-job-run]]
- `based_on`（対象成果物の frontmatter）: なし
- 個票の `入力`: なし
- `overview`: プロジェクト実行で扱うデータストア（実行イベント・状態、plan/result、worktree、定期処理、Job Run等）を一覧で定義する
- `path`: `docs/ja/product/010-business-specs/020-data-model/cdsd-execution.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/cdsd-rulebook.md`（`_MISSING_` は `undecided`、`not-needed`、または未整備）
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-BUSINESS-SPECS-KATA-2-cdsd-execution-090/T-BUSINESS-SPECS-KATA-2-cdsd-execution-090-20261113T040733Z-1e9f1a3b/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/product/010-business-specs/020-data-model/cdsd-execution.md`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/cdsd-execution.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 省略した（評価対象の `content_hash` が評価結果と一致したため、既存の評価結果を使う）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 65
- `graded_at`: 2026-11-10T16:20:57.215Z（`graded_by`: flash-high-executor）
- finding 件数: blocker 0 / major 13 / minor 11 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-cross-document-consistency` | 2 | 50 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 2 | 50 |
| `vp-ba-business-value` | 3 | 75 |
| `vp-ba-requirements-completeness` | 2 | 50 |
| `vp-ba-stakeholder-clarity` | 3 | 75 |
| `vp-dev-change-impact` | 3 | 75 |
| `vp-dev-implementation-readiness` | 2 | 50 |
| `vp-dev-testability` | 2 | 50 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 3 | 75 |
| `vp-ops-release-readiness` | 3 | 75 |
| `vp-pm-control-reporting` | 3 | 75 |
| `vp-pm-dependency-risk` | 3 | 75 |
| `vp-pm-plan-feasibility` | 3 | 75 |
| `vp-po-decision-readiness` | 2 | 50 |
| `vp-po-publication-accountability` | 3 | 75 |
| `vp-po-purpose-alignment` | 2 | 50 |
| `vp-qe-config-validity` | 2 | 50 |
| `vp-qe-done-criteria` | 2 | 50 |
| `vp-qe-omissions-consistency` | 1 | 25 |
| `vp-qe-verifiability` | 2 | 50 |
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 4 | 100 |
| `vp-ux-user-flow` | 4 | 100 |

finding:

- `F001` [major/`vp-po-purpose-alignment`; line=19]: 成果物カタログ `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-cdsd.yaml` が対象とする実行状態、plan/result、evidence、worktree を追加するか、カタログ側のスコープを変更して目的と対象範囲を一致させる必要がある。
- `F002` [major/`vp-po-decision-readiness`; line=19]: 未収録の4領域について、追加の判断者、判断時期、既存設計への影響、次アクションを明記しないと承認または保留を判断できない。
- `F003` [minor/`vp-po-publication-accountability`; line=25]: `ready` 化または公開時の対象範囲、非公開情報確認、最終承認を担う人間の PO を明記する必要がある。
- `F004` [minor/`vp-pm-plan-feasibility`; line=19]: 未収録データストアの追加を、担当 Role code、依存順序、判断時期、完了条件を持つ作業単位として具体化する必要がある。
- `F005` [minor/`vp-pm-dependency-risk`; line=19]: 「対応する業務データ辞書」をカタログ上の `bdd-exec-state`、`bdd-exec-plan-result`、`bdd-exec-evidence`、`bdd-worktree-branch` と対応付け、Schedule または PJR で追跡する必要がある。
- `F006` [minor/`vp-pm-control-reporting`; line=19]: 未収録データストアの追加を PJR の課題または変更要求として転記する条件、報告先、担当 Role code を明記する必要がある。
- `F007` [minor/`vp-ba-business-value`; line=25]: 実行記録の管理単位や正本区分が解決する業務課題、未整備時の影響、期待する確認結果を上位文書への参照または本文で補う必要がある。
- `F008` [major/`vp-ba-requirements-completeness`; line=19]: 実行状態、plan/result、evidence、worktree の役割、内容、更新タイミング、粒度、用途、正本区分を追加しない限り、成果物カタログが要求する対象範囲は完結しない。
- `F009` [minor/`vp-ba-stakeholder-clarity`; line=29]: `運用担当`、`実行担当`、`Job owner` を組織定義上の Role code に対応付け、定義変更の確認者と合意対象を明記する必要がある。
- `F010` [major/`vp-arc-cross-document-consistency`; line=19]: `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-cdsd.yaml` の `cdsd-execution.overview` および `depends_on` は実行状態、plan/result、evidence、worktree を対象とする一方、本文は追加予定として未収録なので、いずれかを修正して整合させる必要がある。
- `F011` [major/`vp-arc-technical-constraints`; line=19]: 実行状態、plan/result、evidence、worktree の正本・派生区分、生成元、更新制約、外部依存を定義しないと、実行系データストア全体の設計基礎として利用できない。
- `F012` [major/`vp-dev-implementation-readiness`; line=19]: `src/exec.ts` が扱う実行状態、plan/result、evidence、worktree について、入力、出力、正本、更新制約、対象ファイルまたは保存単位を定義する必要がある。
- `F013` [minor/`vp-dev-change-impact`; line=31]: 各データストアの変更時に影響する `src/exec.ts`、`src/routine.ts`、`src/job.ts`、関連 schema、生成物またはコマンドを識別できる参照を追加する必要がある。
- `F014` [major/`vp-dev-testability`; line=28]: Job Definition を含む各正本について、検証コマンド、対象ファイルまたは schema、期待結果、エラー時の停止・修正手順を明記する必要がある。
- `F015` [major/`vp-qe-done-criteria`; line=19]: 成果物カタログで定義された実行状態などの対象データストアが未定義であり、完了条件を満たしていない箇所が残存している。
- `F016` [major/`vp-qe-verifiability`; line=28]: Job Definition の合否条件、idempotency・checkpoint・precondition の必須項目と許容値、検証手順を pass/fail 判定可能な形で定義する必要がある。
- `F017` [major/`vp-qe-omissions-consistency`; line=19]: カタログで `cdsd-execution` の対象とされた4領域を「概念データストア一覧」と「正本区分と更新責務」の双方へ追加し、必須情報の欠落を解消する必要がある。
- `F018` [major/`vp-qe-omissions-consistency`; line=19]: 未解決の _TODO_ / _ASSUMPTION_ が残っています。
- `F019` [major/`vp-qe-omissions-consistency`; line=9]: 未解決の _TODO_ / _ASSUMPTION_ が残っています。
- `F020` [minor/`vp-qe-omissions-consistency`; line=15]: Rulebook 2.4に反して、last_scheduled_forのような物理的な名前がcontentカラムに直接記載されています。physicalNameカラムを追加するか、概念的な内容を日本語で記載する必要があります。
- `F021` [minor/`vp-ux-language-consistency`; line=25]: `実行 event`、`task`、`routine`、`Job Definition`、`Job Run` の正式名称と使い分けを用語定義で示すか、日本語の業務名称へ統一する必要がある。
- `F022` [minor/`vp-ops-release-readiness`; line=9]: TODO 解消後の ready 条件、公開前に確認する項目、最終承認者を明記する必要がある。
- `F023` [minor/`vp-ops-operability`; line=29]: 正本に不整合や更新失敗が発生した場合の問い合わせ先、変更申請先、訂正・復旧手順への参照を追加する必要がある。
- `F024` [major/`vp-qe-config-validity`; line=9]: 未解決の _TODO_ / _ASSUMPTION_ が残っています。

## 4. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | BA | vp-ba-requirements-completeness | データストアの業務的役割・内容・粒度が記述されていること |
| DC-002 | ARC | vp-arc-technical-constraints | データストア構成を設計の基礎として参照できること |
| DC-003 | QE | vp-qe-verifiability | データ検証・整合性確認の対象が識別できること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 5. 進め方

fully-guided のタスクは、宣言された文書だけを参照し、rulebook / recipe / sample に沿って既存成果物を磨き込むことを求めた。下書きや調査による新しい値の選定は draft の役割である。磨き込みでは template を読み込まない。rulebook の必須要素・禁止事項、recipe の問い、sample の形式との整合は grade が評価済みである。review はこれらを照合し直さず、評価結果の finding として扱う。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備）:

- rulebook: `docs/ja/specdojo/rulebooks/cdsd-rulebook.md`
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/cdsd-sample.md`
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

`共通規約 sha256:13f1d90345b0d1f0bd602cc3e3f06afa7d772eb714e855b6103c85854bebda59` `docs/ja/projects/prj-0001/execution/conventions/13f1d90345b0d1f0bd602cc3e3f06afa7d772eb714e855b6103c85854bebda59.txt`
