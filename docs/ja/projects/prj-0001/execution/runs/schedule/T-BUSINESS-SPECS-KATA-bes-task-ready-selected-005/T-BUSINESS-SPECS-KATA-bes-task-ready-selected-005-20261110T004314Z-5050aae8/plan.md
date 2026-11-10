---
specdojo:
  id: prj-0001:xep-t-business-specs-kata-bes-task-ready-selected-005-20261110t004314z-5050aae8
  type: exec-plan
  rulebook: none
  task_id: T-BUSINESS-SPECS-KATA-bes-task-ready-selected-005
  name: "代表成果物・実践の型の初期整備"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: bootstrap
  targets:
    - bes-task-ready-selected
    - specdojo:bes-rulebook
    - specdojo:bes-sample
---

# Edit Plan: T-BUSINESS-SPECS-KATA-bes-task-ready-selected-005

## 1. このフェーズで行うこと

既存の代表 [[prj-0001:bes-task-ready-selected|実行可能タスクの選択]] または [[prj-0001:br-task-selection-strategy|タスク選択戦略]] を手本に、対応する bes-rulebook・bes-sample または br-rulebook・br-sample を起こし直す。既存の業務上の境界と未決事項を保ち、機械的な複写を避けて他の案件に使える型にする。必要な recipe・template の要否も判断する。代表成果物は新しい型との整合に必要な範囲だけ補正し、業務判断を確定しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 対象成果物と実践の型

このフェーズは、成果物とその実践の型一式を一貫した一組として作成・整備する。成果物本体と、それに紐づく rulebook / recipe / sample / template を同一タスクで編集する。

成果物（主対象）:

- `name`: 業務イベント仕様（実行可能タスクの選択）
- `depends_on`:
  - [[bes-index]]
  - [[cdfd-overview]]
  - [[prj-0001:stsd-task-execution]]
- `overview`: 実行可能なタスクが選択されたイベント（単発／自動／並列など起点が一意にならない）を定義する
- `path`: `docs/ja/product/010-business-specs/030-business-model/bes-task-ready-selected.md`

実践の型（rulebook frontmatter の宣言から解決）:

- rulebook: `docs/ja/specdojo/rulebooks/bes-rulebook.md`（state: `existing`）
- 併せて適用する rulebook（記法など）: _MISSING_
- recipe: `_MISSING_`（state: `unresolved`）
- sample: `docs/ja/specdojo/samples/bes-sample.md`（state: `existing`）
- template: `_MISSING_`（state: `unresolved`）

`existing` は既存文書の編集対象、`missing` は宣言されたパスにファイルが無い新規作成対象、`unresolved` は宣言からパスを解決できず要否・宣言の確認が必要な状態を表す。`unresolved` のパスを命名規則から推測して作成しない。

result: `docs/ja/projects/prj-0001/execution/runs/schedule/T-BUSINESS-SPECS-KATA-bes-task-ready-selected-005/T-BUSINESS-SPECS-KATA-bes-task-ready-selected-005-20261110T004314Z-5050aae8/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. owner ロールとしての記述ポイント

成果物本体は frontmatter の `owner` に記載された role の視点で記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **ARC（Architect）**
- 責務: rulebook、recipe、sample、template、成果物カタログの構造整合と技術制約を整理する。

このロールが重視するレビュー観点:

- 文書構造・配置・命名: frontmatter、ID、ファイル名、配置、見出し、リンクがプロジェクトの文書体系と整合しているか。
- 成果物間整合: 成果物について、成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。不整合の finding は突き合わせ先の文書 ID またはパスと、双方の相反する記述を特定する。rulebook、recipe、sample、template の内部・相互・適用先との整合は vp-qe-kata-conformance で判定し、この観点では扱わない。
- 技術前提・制約の明確性: 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。
- 冗長性・簡潔性: 各節が固有の判断または手順に寄与し、同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲がないか。判断に要る背景・制約・例外・完了条件が残されていれば下限を満たしているとする。長さだけでは fail にせず、削る・まとめる・参照に置き換えることで判断情報を失わない箇所を具体的に特定できる場合のみ minor とする。
- 文書責務の単一性: 文書の中心主題と責務境界が一つに定まり、各章がその責務に直接寄与しているか。独立して参照・更新できる主題が複数あり、対象読者・利用時点が異なる、または別々の sample・recipe・template に対応する場合は分割を検討する。分量や対応する実践の型の数だけでは不備としない。同一主張の反復や正本の過剰な再掲は vp-arc-conciseness で判定し、この観点では扱わない。

## 4. 進め方

まず実践の型の作成条件に照らして rulebook / recipe / sample / template の要否を判断する。必要な型だけを成果物と相互に矛盾しない一組として作成・整備し、不要な recipe / sample / template は rulebook frontmatter へ `not-needed` と宣言する。rulebook 自体が不要なら成果物カタログへ `rulebook: not-needed` と宣言する。成果物を主対象とし、そこから一般化した規定・作り方・例・雛形を必要な実践の型に反映する。各対象は実際に読み込んだうえで、既存があれば評価し、維持/修正/作り直しを判断する。必要だが既存が無ければ新規作成する。

作成条件は [[specdojo:kata-guide]] の `実践の型を作る条件` を正本とする。`_MISSING_` の参照は、rulebook frontmatter で `not-needed` と宣言済みなら作成しない。`undecided` なら要否を判断し、必要な型を整備して ID を宣言するか、不要として `not-needed` へ更新する。項目省略は必要だが未整備であるため作成対象に含める。

### grade result から展開された finding

- F001 \[minor/vp-po-purpose-alignment; line=43; anchor=`""`\]: `Resolve the event’s scope across schedule, register, and routine task flows, or state a supported boundary, so readers can determine which task selections this specification covers.`
- F002 \[minor/vp-po-decision-readiness; line=22; anchor=`""`\]: `Name the decision owner and decision timing for whether automated selection and claim share one business event boundary.`
- F003 \[minor/vp-po-publication-accountability; line=4; anchor=`""`\]: `Identify the human PO responsible for approving the event definition and its publication readiness.`
- F004 \[minor/vp-pm-plan-feasibility; line=43; anchor=`""`\]: `Add an owner role and decision timing for resolving the task-flow scope before this event can be treated as complete.`
- F005 \[minor/vp-pm-dependency-risk; line=54; anchor=`""`\]: `Identify the execution-record data-model dependency by document ID and specify the follow-up needed to confirm the parallel-request identifier.`
- F006 \[minor/vp-pm-control-reporting; line=43; anchor=`""`\]: `Specify who records and follows up the unresolved task-flow scope, and where that decision is reported.`
- F007 \[minor/vp-ba-business-value; line=6; anchor=`""`\]: `State the operational problem this event definition addresses and a success criterion for determining whether it resolves that problem.`
- F008 \[minor/vp-ba-requirements-completeness; line=43; anchor=`""`\]: `Define which task-flow types are in scope and how the event applies to them, or explicitly exclude the unresolved flows.`
- F009 \[minor/vp-ba-requirements-completeness; line=54; anchor=`""`\]: `Specify the event-data field that correlates selections made by the same parallel request, based on the execution-record model.`
- F010 \[minor/vp-ba-stakeholder-clarity; line=28; anchor=`"| 自動     | 実行主体（人または AI Agent）、または Orchestrator      | runner（選択戦略の順位に従ってシステムが確定する）   | 要求時点では対象が決まらない。順位が最も高い 1 件を選ぶ                    |"`\]: `Identify the role that reviews and agrees the event’s business definition, including the unresolved scope and parallel-request data.`
- F011 \[minor/vp-arc-cross-document-consistency; line=8; anchor=`""`\]: `Add the event-index link when the index is created and verify this event’s catalog entry against the specification.`
- F012 \[minor/vp-arc-technical-constraints; line=54; anchor=`""`\]: `Resolve the parallel-request correlation field against the execution-record data model so the event payload can be represented consistently.`
- F013 \[minor/vp-dev-implementation-readiness; line=54; anchor=`""`\]: `Define the parallel-request correlation field against the execution-record model before using this event specification as an implementation reference.`
- F014 \[minor/vp-dev-change-impact; line=54; anchor=`""`\]: `Identify the execution-record model and the downstream event or implementation artifacts affected by changing the parallel-selection data.`
- F015 \[minor/vp-dev-testability; line=52; anchor=`""`\]: `Define the parallel-request correlation field and identify the event test cases that verify selections from one request are associated correctly.`
- F016 \[major/vp-qe-done-criteria; line=43; anchor=`""`\]: `Resolve the task-flow scope and obtain business approval of the event’s applicability before claiming the event specification is complete.`
- F017 \[major/vp-qe-done-criteria; line=54; anchor=`""`\]: `Specify the parallel-request correlation field and verify it against the execution-record model so the event can support implementation and test design.`
- F018 \[minor/vp-qe-verifiability; line=52; anchor=`""`\]: `Name the field and verification rule that demonstrate which parallel selections belong to the same request.`
- F019 \[minor/vp-qe-omissions-consistency; line=8; anchor=`""`\]: `Complete and verify the BEL event link when the index is available so the event catalog and specification remain connected.`
- F020 \[minor/vp-ux-readability; line=43; anchor=`""`\]: `State the confirmed task-flow scope near the event definition so readers can tell which selections the specification covers.`
- F021 \[minor/vp-ux-language-consistency; line=29; anchor=`"| 並列     | 人または Orchestrator（件数の上限を指定して一括で要求） | runner（順位に従い、上限と実行能力の範囲で確定する） | 1 回の要求から複数件が確定する。実行能力が足りない候補は、今回は確定しない |"`\]: ``Define `runner` and use a consistent actor label that makes clear whether it is a role, system component, or execution subject.``
- F022 \[minor/vp-ops-release-readiness; line=43; anchor=`""`\]: `State the approval owner and readiness condition for closing the unresolved event-scope decision.`
- F023 \[minor/vp-ops-operability; line=54; anchor=`""`\]: `Add the responsible role and follow-up route for validating the parallel-request identifier when the execution-record model is available.`

1. 既存文書の finding: plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み、指摘された問題を解消するよう該当箇所を修正する。修正後、問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。修正後は `grade plan --changed-only` の対象になるため、再評価で構造・整合性が劣化していないことを確認する。
2. 成果物（主対象）: `depends_on` の決定事項・用語・制約と整合させ、owner ロールの責務に集中して記述する。既存記述があれば内容を評価し、活かせる部分は維持、古い・矛盾する部分は修正、前提と合わない場合は作り直す。内部情報だけで判断できない一般的な観点・用語・標準があり、実行 agent が Web 検索能力を持つ場合は、関連情報を取得して出典を添える。
3. rulebook: 必要と判断した場合だけ、成果物の構造を一般化し、章構成・必須項目・禁止事項・判定基準を、同種成果物へ適用できる規定として整理する。rulebook は [[specdojo:rulebook-authoring-standard]]（章立て・Frontmatter 規約・記述ルール・禁止事項の正本）に従う。
4. recipe: 必要と判断した場合だけ、良い成果物を作るための問い・観点・深掘り手順・レビュー観点を、再利用できる作成手順として整理する。
5. sample: 必要と判断した場合だけ、粒度・文体・表の書き方が伝わる最小の完成例にする。プロジェクト固有の値は一般化またはプレースホルダ化する。sample は [[specdojo:sample-authoring-standard]]（構成・記述ルール・共通サンプル文脈・禁止事項の正本）に従い、rulebook / recipe と矛盾しないように作成する。
6. template: 必要と判断した場合だけ、章構成の骨組みとプレースホルダを配置した雛形にする。成果物固有の内容は持ち込まない。template は [[specdojo:template-authoring-standard]]（構成・プレースホルダ規約・禁止事項の正本）に従い、埋めた結果が rulebook の本文構成と矛盾しないように作成する。

実践の型は成果物の丸写しにせず、同種成果物に再利用できる形に一般化する。構造・必須項目・禁止事項は rulebook を正とし、recipe / sample / template は rulebook と矛盾しないように揃える。

内容の根拠としてよい文書は、この plan に記載された対象（成果物・rulebook / 併せて適用する rulebook / recipe / sample / template）、`対象成果物` セクションの `depends_on` 成果物、プロジェクトコンテキストに限定する。これら以外を成果物の内容の根拠にしない。ただし bootstrap では例外として、同種で `status: ready` の文書を手本として参照してよい（次項参照）。判断できない箇所は憶測で埋めず _TODO_ / _ASSUMPTION_ として論点を残す。

ここで整備した実践の型は後続の refine-pass で凍結し、編集しない。本タスクの実行に必要な bootstrap の進め方は、このセクションで完結する。approach 全体の定義を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

### 4.1. 同種の ready 文書を手本にする

bootstrap では実践の型が未整備なため、構造・記法・慣行の揺れ（毎回ゼロから設計し直すことによる churn）を避ける目的で、同種で `status: ready` の文書を手本にする。

- 成果物・rulebook・recipe・sample・template のそれぞれについて、同じ種別で `status: ready` の文書があれば、その章構成・粒度・文体・表の書き方・プレースホルダの置き方などを手本にし、確立済みの形に倣う。
- 手本にするのは形（構造・記法・慣行）であり、内容は丸写ししない。当該成果物の内容は `depends_on` とプロジェクト文脈に基づいて書く。
- 手本が複数ある場合は、対象に最も近い種別・粒度のものを優先する。`status: ready` の同種文書が無い場合は、手本なしで `depends_on` と対象領域の慣行から組み立てる。
- 手本にした文書は result の `進め方と実践の型の適用` セクションに記録する。

### 4.2. 既存物の評価と作り直しの判断

- 各対象に既存記述がある場合は、まず内容を読み、根拠（成果物・`depends_on`・同種の `ready` 文書・対象領域の慣行）と整合するかを評価する。
- 整合するものは維持し、過不足・陳腐化・矛盾がある部分のみ修正する。基準として機能しないほど内容が古い・薄い場合に限り作り直す。
- 既存が無い、または参照範囲から外れた対象は、成果物・`depends_on`・同種の `ready` 文書を手本に新規作成する。

### 4.3. 判断根拠の記録

成果物と各実践の型について、評価・作成・修正・維持の判断根拠を result に残す。記録先は次のとおり。

- 成果物と各実践の型の作成・修正・維持の判断、手本にした同種 `ready` 文書、相互整合の取り方、矛盾時に rulebook を正とした箇所、丸写しを避けるための一般化、Web 出典: result の `進め方と実践の型の適用` セクション。

## 5. 完了の狙い

この成果物が満たすべき狙い（成果物カタログの `done_criteria`）を、owner ロールの狙いと下流ロールの入力適合に分けて示す。「進め方」に従って成果物と実践の型を整備する中で、owner の狙いを作成目標として満たすことを目指す。下流ロールの項目は、その文書から各ロールが自分の責務の成果物を作成できるよう入力として最低限成立させる範囲にとどめ、各ロールの内容を成果物に作り込まない（一文書一責務）。下流ロールの適合性検証や観点別の自己レビュー・修正ループは行わず、多観点での検証は後続の独立した review task に委ねる。

owner として達成する狙い:

- イベント処理実装・メッセージ設計の基礎として参照できること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [BA] イベント内容・発生条件・タイミングが業務観点で正確に記述されていること
- [PO] イベント仕様の業務的妥当性を承認できること
- [QE] イベントテスト設計への活用が確認できること
- [DEV] イベントハンドラ・パブリッシャー実装の参照として使えること

## 6. 仕上げの品質チェック

成果物と実践の型の更新が一通り終わった後、内容の質を上げる仕上げとして、次の4操作を1回だけ通しで実施する。これは単発の仕上げ操作であり、観点別の自己レビュー・修正ループではない。同じ観点での再確認を繰り返さず1巡で終え、多観点での検証は後続の独立した review task に委ねる。

1. 不要記述の削除: rulebook の必須要素にも「完了の狙い」に示された `done_criteria` にも寄与していない記述を削除する。
2. 重複記述の統合: 同じ内容が同一文書内、または成果物と実践の型の間で重複している場合は、内容が最も適切な1箇所を正本と定めて統合し、他は要約または正本への参照に置き換える。統合で情報が失われる場合は、不足分を正本側へ取り込んでから他方を整理する。
3. 可読性のための分割: 1つの節・段落・表に複数の論点が混在して読み取りにくい箇所を、節・箇条書き・表へ分割する。分割は rulebook が定める章構成の範囲内で行い、章構成そのものを崩さない。
4. 論理整合の確認: 用語・定義・前提・手順の順序が、文書内および成果物と実践の型の間で矛盾していないかを確認し、矛盾があれば整える（構造・必須項目・禁止事項は rulebook を正とする）。

この4操作は既存の記述の整理として行い、「進め方」で定めた根拠の範囲を超える内容は追記しない。削除・統合・分割の可否を判断できない箇所は、無理に整理せず _TODO_ / _ASSUMPTION_ として論点を残す。実施した削除・統合・分割と、その判断根拠は result の `進め方と実践の型の適用` セクションに記録する。

## 7. 完了手順

1. 「このフェーズで行うこと」と「進め方」に従って、成果物と必要な rulebook / recipe / sample / template、成果物カタログの rulebook 宣言、および rulebook frontmatter の3種の要否宣言を更新する。
2. 「完了の狙い」を満たしているかを確認し、不足があれば加筆・補強する（観点別の自己レビューや再確認ループは行わない）。
3. 「仕上げの品質チェック」の4操作を1回だけ実施する（成果物と各実践の型の相互整合の確認を含む）。
4. 共通規約に従って、必要な整形・静的検査を実行する。
5. result に実施内容・変更ファイル・進め方と実践の型の適用を記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 8. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
