---
specdojo:
  id: prj-0001:xrp-t-project-kata-prj-assumptions-constraints-dependencies-090-20261113t022004z-26bc0691
  type: exec-plan
  rulebook: none
  task_id: T-PROJECT-KATA-prj-assumptions-constraints-dependencies-090
  name: "完成版レビュー"
  mode: review
  status: ready
  project_id: prj-0001
  owner: PM
  approach: fully-guided
  targets:
    - prj-0001:prj-assumptions-constraints-dependencies
---

# Review Plan: T-PROJECT-KATA-prj-assumptions-constraints-dependencies-090

## 1. このフェーズで行うこと

対応する rulebook・sample と代表成果物を読み、型一式の章構成・判断基準・例の充実度・相互整合をレビューする。代表成果物の `done_criteria` だけで完了としない。成果物・型は変更せず、指摘と根拠を review result に残す。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 対象成果物

- `name`: 前提・制約・依存関係
- `depends_on`:
  - [[prj-0001:prj-scope]]
  - [[prj-0001:prj-charter]]
- `based_on`（対象成果物の frontmatter）: [[prj-0001:prj-scope]]、[[prj-0001:prj-charter]]
- 個票の `入力`: なし
- `overview`: 前提条件・制約事項・外部依存を整理
- `path`: `docs/ja/projects/prj-0001/020-project-definition/prj-assumptions-constraints-dependencies.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/prj-assumptions-constraints-dependencies-rulebook.md`（`_MISSING_` は `undecided`、`not-needed`、または未整備）
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-PROJECT-KATA-prj-assumptions-constraints-dependencies-090/T-PROJECT-KATA-prj-assumptions-constraints-dependencies-090-20261113T022004Z-26bc0691/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. 評価結果

review は成果物を再評価しない。次の評価結果を事実として受け取り、共通規約の `review の判断手順` に従ってタスクの完了可否を判断する。

- 評価対象: `docs/ja/projects/prj-0001/020-project-definition/prj-assumptions-constraints-dependencies.md`
- grade の対象種別（`--target`）: `deliverable`
- 評価結果サイドカー: `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.prj-assumptions-constraints-dependencies.yaml`（`_MISSING_` は評価対象が未作成、または評価対象の `id` を解決できないことを示す。この場合は評価結果が最新でないものとして扱う）

runner が review の前に確認した評価結果を次に示す。これは grade が確定済みの事実であり、review で観点を評価し直したり、同じ finding を改めて指摘したりしない。

- runner の grade 実行: 省略した（評価対象の `content_hash` が評価結果と一致したため、既存の評価結果を使う）
- 鮮度: 最新（評価対象の `content_hash` が評価結果の `content_hash` と一致する）
- `verdict`: `needs-work`
- `score`: 70
- `graded_at`: 2026-10-12T16:24:15.945Z（`graded_by`: agy-expert-executor）
- finding 件数: blocker 0 / major 13 / minor 8 / note 0

grade が判定した観点（全観点）:

| 観点 | level | score |
| --- | --- | --- |
| `vp-arc-conciseness` | 3 | 75 |
| `vp-arc-cross-document-consistency` | 2 | 50 |
| `vp-arc-document-structure` | 4 | 100 |
| `vp-arc-single-responsibility` | 4 | 100 |
| `vp-arc-technical-constraints` | 4 | 100 |
| `vp-ba-business-value` | 4 | 100 |
| `vp-ba-requirements-completeness` | 2 | 50 |
| `vp-ba-stakeholder-clarity` | 4 | 100 |
| `vp-dev-change-impact` | 3 | 75 |
| `vp-dev-implementation-readiness` | 3 | 75 |
| `vp-dev-testability` | 3 | 75 |
| `vp-ops-agent-boundary` | 4 | 100 |
| `vp-ops-operability` | 2 | 50 |
| `vp-ops-release-readiness` | 1 | 25 |
| `vp-pm-control-reporting` | 3 | 75 |
| `vp-pm-dependency-risk` | 2 | 50 |
| `vp-pm-plan-feasibility` | 2 | 50 |
| `vp-po-decision-readiness` | 2 | 50 |
| `vp-po-publication-accountability` | 2 | 50 |
| `vp-po-purpose-alignment` | 2 | 50 |
| `vp-qe-config-validity` | 4 | 100 |
| `vp-qe-done-criteria` | 2 | 50 |
| `vp-qe-omissions-consistency` | 2 | 50 |
| `vp-qe-verifiability` | 2 | 50 |
| `vp-ux-language-consistency` | 3 | 75 |
| `vp-ux-readability` | 4 | 100 |
| `vp-ux-user-flow` | 3 | 75 |

finding:

- `F001` [major/`vp-po-purpose-alignment`; line=31]: ACD-D02/D03 は初期公開範囲を決定済みと扱う一方、憲章9章と成功基準5章は未決としており、上位の公開方針に沿った前提として利用できないため、決定済みのライセンス・公開先等と未決の公開対象を分離する必要がある。
- `F002` [major/`vp-po-decision-readiness`; line=31]: PJR-0120/0121 では初期公開範囲・公開範囲が conclusion に記録されていないにもかかわらず成立済みとしているため、未決事項、影響範囲、決定に必要な次アクションを明示する必要がある。
- `F003` [major/`vp-po-publication-accountability`; line=16]: 公開文書から個人情報・秘密情報・非公開組織情報を除外する制約, 検知方法、隔離・削除・匿名化またはPO判断までの公開保留手順がないため、公開適性について説明責任を果たせる形にする必要がある。
- `F004` [major/`vp-pm-plan-feasibility`; line=30]: ACD-D01 は対象成果物ID、適用するSC/AC、品質ゲート、証跡の正本、判定時期を特定しておらず、作業分解・順序付け・完了確認へ一意に展開できないため参照先を明示する必要がある。
- `F005` [major/`vp-pm-dependency-risk`; line=31]: ACD-D02/D03 は未確定の公開範囲を解消済み依存として扱い、憲章・成功基準に残る未決事項が計画や公開ゲートへ与えるリスクを隠しているため、未成立依存として状態と影響を記録する必要がある。
- `F006` [minor/`vp-pm-control-reporting`; line=46]: 「プロジェクト登録簿または対応する決定記録」へ残すとしているだけで、変化を課題・リスク・変更要求・決定のどれとして記録するか、および各報告先を分離していないため転記基準を補う必要がある。
- `F007` [major/`vp-ba-requirements-completeness`; line=16]: 公開情報に個人情報・機密情報・非公開情報を含めない条件と逸脱時対応が、委譲先のスコープにも本書にも定義されていないため、公開利用者視点で必要な除外条件を確認できない。
- `F008` [major/`vp-arc-cross-document-consistency`; line=31]: ACD-D02/D03 は初期公開範囲・公開範囲の決定を記録済みとしているが、PJR-0120/0121 の conclusion はライセンス・導線・公開先だけを確定し、憲章9章と成功基準5章も公開範囲を未決としているため、決定状態と根拠文書を整合させる必要がある。
- `F009` [minor/`vp-arc-conciseness`; line=31]: ACD-D02とACD-D03は公開範囲およびGitHub issue / pull requestによる導線を重複して扱っているため、各決定の固有境界を明示するか一方を正本参照へ置き換える必要がある。
- `F010` [minor/`vp-dev-implementation-readiness`; line=33]: ACD-D04 は「必要な検証コマンド」の実行を成立条件にする一方、対象ファイル、環境要件, コマンドを定義する正本への参照がなく、実装・設定作業の入力を特定できないため委譲先を示す必要がある。
- `F011` [minor/`vp-dev-change-impact`; line=33]: リポジトリまたは作業環境の変更時に、schema、生成物、CLI、検証コマンド、互換性のどれを再確認するか、またはそれを定義する技術成果物への参照がないため影響範囲を追跡できるようにする必要がある。
- `F012` [minor/`vp-dev-testability`; line=33]: ACD-D04 の「必要な検証コマンド」についてコマンド名、対象、期待結果、失敗時の確認先が示されていないため、検証手順の正本を参照する必要がある。
- `F013` [major/`vp-qe-done-criteria`; line=16]: 公開情報に個人情報・機密情報・非公開情報を含めない重要制約の監視・逸脱対応がなく、公開範囲の決定証跡も未完了であるため、DC-002を充足できない。
- `F014` [major/`vp-qe-verifiability`; line=30]: ACD-D01の「選定された成果物」と「担当ロールによるレビューと受入判定」は対象ID・適用するSC/AC・証跡の正本が示されずpass / failを一意に判定できないため、成果物カタログ、成功基準・受入条件、品質ゲートへの参照を明示する必要がある。
- `F015` [major/`vp-qe-omissions-consistency`; line=16]: 公開情報の限界をスコープへ委譲しているが、スコープには個人情報・機密情報・非公開情報の除外条件がなく、rulebookが求める検知時の除去または判断手順も欠けているため、憲章・AC-03を根拠に運用可能な制約を追加する必要がある。
- `F016` [minor/`vp-qe-omissions-consistency`; line=47]: 監視・変更管理に文書構造・配置・命名・技術制約・参照資料の整合確認を担うロールが明示されていないため、rulebookに従いARC等の確認責任を追記する必要がある。
- `F017` [minor/`vp-ux-user-flow`; line=30]: ACD-D01から初期公開対象の成果物カタログ、成功基準・受入条件、品質管理計画へのリンクがなく、利用者が対象一覧と合格証跡へ迷わず到達できないため参照先を追加する必要がある。
- `F018` [minor/`vp-ux-language-consistency`; line=31]: 「初期公開範囲」と「公開範囲」、「貢献導線」と「変更提案受付方法」がACD-D02/D03で同義に見えるまま別のPJRへ割り当てられているため、用語の差異と各決定の正本を明示する必要がある。
- `F019` [major/`vp-ops-release-readiness`; line=16]: 個人情報・秘密情報・非公開情報の除外、検知、隔離・除去、再確認を定める公開前制約がないため、AC-03に適合した公開準備を保証できない。
- `F020` [major/`vp-ops-release-readiness`; line=31]: ACD-D02/D03 は公開範囲を決定済みとしているが、PJR-0120/0121 の conclusion と憲章・成功基準では確定していないため、未解決の公開対象を解消済みと誤認してリリース判断するおそれがある。
- `F021` [major/`vp-ops-operability`; line=16]: 個人情報・機密情報・非公開情報を検知した場合の隔離、削除・匿名化、影響確認、再レビュー、PO判断までの公開保留手順がなく、公開不適合発生時に運用できない。

## 4. 完了条件

成果物カタログの `done_criteria` を、このタスクの完了条件として照合する。観点ごとに成果物を評価し直すための表ではない。

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID | ロール | `viewpoint_id` | 完了条件 |
| --- | --- | --- | --- |
| DC-001 | BA | vp-ba-requirements-completeness | 業務上の前提・制約が業務観点で識別できること |
| DC-002 | PO | vp-po-decision-readiness | 重要な前提・制約を受け入れられる情報が含まれていること |
| DC-003 | ARC | vp-arc-technical-constraints | 技術的制約・外部依存が識別できること |
| DC-004 | PM | vp-pm-dependency-risk | 依存関係・リスクが計画・統制の観点で識別できること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

## 5. 進め方

fully-guided のタスクは、宣言された文書だけを参照し、rulebook / recipe / sample に沿って既存成果物を磨き込むことを求めた。下書きや調査による新しい値の選定は draft の役割である。磨き込みでは template を読み込まない。rulebook の必須要素・禁止事項、recipe の問い、sample の形式との整合は grade が評価済みである。review はこれらを照合し直さず、評価結果の finding として扱う。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備）:

- rulebook: `docs/ja/specdojo/rulebooks/prj-assumptions-constraints-dependencies-rulebook.md`
- recipe: `docs/ja/specdojo/recipes/prj-assumptions-constraints-dependencies-recipe.md`
- sample: `docs/ja/specdojo/samples/prj-assumptions-constraints-dependencies-sample.md`
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
