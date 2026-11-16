---
specdojo:
  id: prj-0001:xrp-t-business-specs-kata-cdt-register-type-090-20261110t030304z-fee138a3
  type: exec-plan
  rulebook: none
  task_id: T-BUSINESS-SPECS-KATA-cdt-register-type-090
  name: "完成版レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: fully-guided
  targets:
    - prj-0001:cdt-register-type
---

# Review Plan: T-BUSINESS-SPECS-KATA-cdt-register-type-090

## 1. このフェーズで行うこと

対応する rulebook・sample（ifx-cmd は recipe・template も）と代表成果物を読み、型一式の章構成・判断基準・例の充実度・相互整合をレビューする。代表成果物の `done_criteria` だけで完了としない。template は frontmatter の ID から明示的に開く。成果物・型は変更せず、指摘と根拠を review result に残す。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 対象成果物

- `name`: 分類一覧（登録項目の種別）
- `depends_on`:
  - [[bdd-register-entry]]
- `based_on`（対象成果物の frontmatter）: なし
- 個票の `入力`: なし
- `overview`: 登録項目の種別（type）が取り得る issue・decision・todo・question・risk・change-request・note・epic の分類を一覧で定義する
- `path`: `docs/ja/product/010-business-specs/020-data-model/cdt-register-type.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/cdt-rulebook.md`（`_MISSING_` は `undecided`、`not-needed`、または未整備）
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-BUSINESS-SPECS-KATA-cdt-register-type-090/T-BUSINESS-SPECS-KATA-cdt-register-type-090-20261110T030304Z-fee138a3/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/product/010-business-specs/020-data-model/cdt-register-type.md`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.cdt-register-type.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 省略した（評価対象の `content_hash` が評価結果と一致したため、既存の評価結果を使う）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `pass`
- `score`: 87
- `graded_at`: 2026-11-09T05:51:43.976Z（`graded_by`: luna-review-executor）
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

- `F001` [minor/`vp-po-decision-readiness`; line=10]: Add any unresolved classification or policy decision and its impact or next action, or state that no PO decision remains, so the reviewer can determine whether to approve or return the document.
- `F002` [minor/`vp-po-publication-accountability`; line=4]: State the human PO's responsibility for final approval and whether the draft contains only information suitable for publication, so publication accountability is explicit.
- `F003` [minor/`vp-pm-plan-feasibility`; line=10]: Add a review or implementation checkpoint and an observable completion condition, so the stated roles can use this document to plan and track follow-up work.
- `F004` [minor/`vp-pm-dependency-risk`; line=22]: Identify any outstanding dependency or risk affecting the referenced dictionary, status definition, schema, or CLI, and its tracking or schedule impact; state that none remain if applicable.
- `F005` [minor/`vp-pm-control-reporting`; line=10]: Identify any items requiring project reporting, their destination and responsible role, or state that there are none, so follow-up can be transferred into project controls.
- `F006` [minor/`vp-arc-cross-document-consistency`; line=22]: Confirm that the referenced dictionary, status definition, schema, CLI values, and catalog entry agree with the classifications and scope stated here, and record or link the verification result.
- `F007` [minor/`vp-arc-technical-constraints`; line=24]: State how the schema and CLI references are checked for existence and value alignment, so technical consumers can verify the declared sources.
- `F008` [minor/`vp-dev-implementation-readiness`; line=22]: Add an implementation check that compares the schema enum and CLI accepted values with the classification meanings and derived-view routing, so DEV can confirm the mapping is complete.
- `F009` [minor/`vp-dev-change-impact`; line=22]: Specify the synchronization impacts and update targets when a classification value, meaning, or routing rule changes, so implementers can assess compatibility and required updates.
- `F010` [minor/`vp-dev-testability`; line=24]: Provide or reference the validation command and expected result for checking schema and CLI value alignment, so changes to classification values can be tested consistently.
- `F011` [minor/`vp-qe-verifiability`; line=24]: Define an explicit pass/fail check for confirming that every SSOT value has a corresponding business definition and that CLI validation accepts exactly those values.
- `F012` [minor/`vp-qe-omissions-consistency`; line=22]: Record the consistency check against the business data dictionary, status definition, schema, CLI, and catalog, or link to its result, so omissions or mismatches can be identified.
- `F013` [minor/`vp-ops-release-readiness`; line=4]: State the human approval required for promotion to `ready` and the outstanding release checks, or indicate that no blockers remain, so release readiness can be judged.
- `F014` [minor/`vp-ops-operability`; line=22]: Describe or reference the change and maintenance procedure for synchronizing classification meanings, schema values, CLI validation, and derived views when they are updated.

## 4. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | BA | vp-ba-requirements-completeness | 分類名・説明が業務観点で正確に定義されていること |
| DC-002 | DEV | vp-dev-implementation-readiness | 分類実装（マスタデータ・コード値）の基礎として参照できること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 5. 進め方

fully-guided のタスクは、宣言された文書だけを参照し、rulebook / recipe / sample に沿って既存成果物を磨き込むことを求めた。下書きや調査による新しい値の選定は draft の役割である。磨き込みでは template を読み込まない。rulebook の必須要素・禁止事項、recipe の問い、sample の形式との整合は grade が評価済みである。review はこれらを照合し直さず、評価結果の finding として扱う。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備）:

- rulebook: `docs/ja/specdojo/rulebooks/cdt-rulebook.md`
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/cdt-sample.md`
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
