---
specdojo:
  id: prj-0001:xrp-t-project-kata-prj-comparison-of-alternatives-090-20261113t023635z-5aa10c55
  type: exec-plan
  rulebook: none
  task_id: T-PROJECT-KATA-prj-comparison-of-alternatives-090
  name: "完成版レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  owner: PM
  approach: fully-guided
  targets:
    - prj-0001:prj-comparison-of-alternatives
---

# Review Plan: T-PROJECT-KATA-prj-comparison-of-alternatives-090

## 1. このフェーズで行うこと

対応する rulebook・sample と代表成果物を読み、型一式の章構成・判断基準・例の充実度・相互整合をレビューする。代表成果物の `done_criteria` だけで完了としない。成果物・型は変更せず、指摘と根拠を review result に残す。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 対象成果物

- `name`: 代替案比較
- `depends_on`:
  - [[prj-0001:prj-scope]]
  - [[prj-0001:prj-issues-and-approach]]
- `based_on`（対象成果物の frontmatter）: [[prj-0001:prj-scope]]、[[prj-0001:prj-issues-and-approach]]、[[prj-0001:prj-assumptions-constraints-dependencies]]
- 個票の `入力`: なし
- `overview`: 技術的・方針的な代替案を比較評価
- `path`: `docs/ja/projects/prj-0001/020-project-definition/prj-comparison-of-alternatives.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/prj-comparison-of-alternatives-rulebook.md`（`_MISSING_` は `undecided`、`not-needed`、または未整備）
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-PROJECT-KATA-prj-comparison-of-alternatives-090/T-PROJECT-KATA-prj-comparison-of-alternatives-090-20261113T023635Z-5aa10c55/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/projects/prj-0001/020-project-definition/prj-comparison-of-alternatives.md`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.prj-comparison-of-alternatives.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 省略した（評価対象の `content_hash` が評価結果と一致したため、既存の評価結果を使う）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 90
- `graded_at`: 2026-10-12T16:32:20.172Z（`graded_by`: agy-expert-executor）
- finding 件数: blocker 0 / major 4 / minor 1 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 4 | 100 |
| `vp-arc-cross-document-consistency` | 4 | 100 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-business-value` | 2 | 50 |
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
| `vp-qe-done-criteria` | 2 | 50 |
| `vp-qe-omissions-consistency` | 2 | 50 |
| `vp-qe-verifiability` | 2 | 50 |
| `vp-ux-language-consistency` | 4 | 100 |
| `vp-ux-readability` | 4 | 100 |
| `vp-ux-user-flow` | 4 | 100 |

finding:

- `F001` [major/`vp-ba-business-value`; line=109]: D-02とD-03の評価軸に「主に対応する課題・制約」の列がなく業務課題との対応が不明なため、各評価軸と根拠資料の課題・制約の対応を明記してください。
- `F002` [major/`vp-qe-done-criteria`; line=198]: リスクとトレードオフ表に案IDがなく、D-02・D-03を含む各候補のリスクとトレードオフを比較できないため、各記述を案IDへ対応付けてください。
- `F003` [major/`vp-qe-verifiability`; line=132]: High・Middle・Lowの判定境界、各セルの根拠、D-01の重みを総合評価と採否へ反映する規則がなく比較結果を再現できないため、尺度・証拠・集約規則を明記してください。
- `F004` [minor/`vp-qe-verifiability`; line=167]: OpenSpecとSpec Kitの試行は測定項目だけで完了条件と採用・撤退の閾値がないため,合否を判定できる数値または状態条件を追加してください。
- `F005` [major/`vp-qe-omissions-consistency`; line=107]: D-02とD-03は最低ラインである効果・コスト・期間・リスク・運用適合・技術実現性の一部を省略しているのに省略理由がないため、必要な軸を追加するか各省略理由を明記してください。

## 4. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | BA | vp-ba-business-value | 比較軸・評価根拠が業務価値と対応していること |
| DC-002 | PO | vp-po-decision-readiness | 推奨案を判断できる情報が含まれていること |
| DC-003 | ARC | vp-arc-technical-constraints | 技術的実現可能性・影響が評価されていること |
| DC-004 | PM | vp-pm-dependency-risk | 案ごとのリスク・トレードオフが比較されていること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 5. 進め方

fully-guided のタスクは、宣言された文書だけを参照し、rulebook / recipe / sample に沿って既存成果物を磨き込むことを求めた。下書きや調査による新しい値の選定は draft の役割である。磨き込みでは template を読み込まない。rulebook の必須要素・禁止事項、recipe の問い、sample の形式との整合は grade が評価済みである。review はこれらを照合し直さず、評価結果の finding として扱う。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備）:

- rulebook: `docs/ja/specdojo/rulebooks/prj-comparison-of-alternatives-rulebook.md`
- recipe: `docs/ja/specdojo/recipes/prj-comparison-of-alternatives-recipe.md`
- sample: `docs/ja/specdojo/samples/prj-comparison-of-alternatives-sample.md`
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
