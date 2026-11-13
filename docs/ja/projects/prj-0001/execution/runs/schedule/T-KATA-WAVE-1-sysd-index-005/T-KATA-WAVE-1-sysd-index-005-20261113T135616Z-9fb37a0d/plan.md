---
specdojo:
  id: prj-0001:xep-t-kata-wave-1-sysd-index-005-20261113t135616z-9fb37a0d
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-1-sysd-index-005
  name: "代表成果物・実践の型の初期整備"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: bootstrap
  targets:
    - sysd-index
    - specdojo:sysd-index-rulebook
    - specdojo:sysd-index-sample
---

# Edit Plan: T-KATA-WAVE-1-sysd-index-005

## 1. このフェーズで行うこと

対象の成果物を代表として、対応する rulebook・sample（必要なら recipe・template）を起こし直すか、型に沿う代表の初版を作る。代表がすでにある場合は、その実績から型を整え、代表は型との整合に必要な範囲だけ直す。代表がない場合は、型に沿って SpecDojo（prj-0001）の代表の初版を作る。機械的な複写を避け、他の案件に使える型にする。業務判断は確定しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 対象成果物と実践の型

このフェーズは、成果物とその実践の型一式を一貫した一組として作成・整備する。成果物本体と、それに紐づく rulebook / recipe / sample / template を同一タスクで編集する。

成果物（主対象）:

- `name`: システム設計（全体構成・リンク集）
- `depends_on`:  -
- `overview`: システム設計のSSOT（OpenAPI・AsyncAPI・migrationファイル・agent実行構成等）への導線を1箇所に集約する
- `path`: `docs/ja/product/040-system-design/sysd-index.md`

実践の型（rulebook frontmatter の宣言から解決）:

- rulebook: `docs/ja/specdojo/rulebooks/sysd-index-rulebook.md`（state: `existing`）
- 併せて適用する rulebook（記法など）: _MISSING_
- recipe: `_MISSING_`（state: `unresolved`）
- sample: `docs/ja/specdojo/samples/sysd-index-sample.md`（state: `existing`）
- template: `_MISSING_`（state: `unresolved`）

`existing` は既存文書の編集対象、`missing` は宣言されたパスにファイルが無い新規作成対象、`unresolved` は宣言からパスを解決できず要否・宣言の確認が必要な状態を表す。`unresolved` のパスを命名規則から推測して作成しない。

result: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-1-sysd-index-005/T-KATA-WAVE-1-sysd-index-005-20261113T135616Z-9fb37a0d/result.md`

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

## 4. 進め方

まず実践の型の作成条件に照らして rulebook / recipe / sample / template の要否を判断する。必要な型だけを成果物と相互に矛盾しない一組として作成・整備し、不要な recipe / sample / template は rulebook frontmatter へ `not-needed` と宣言する。rulebook 自体が不要なら成果物カタログへ `rulebook: not-needed` と宣言する。成果物を主対象とし、そこから一般化した規定・作り方・例・雛形を必要な実践の型に反映する。各対象は実際に読み込んだうえで、既存があれば評価し、維持/修正/作り直しを判断する。必要だが既存が無ければ新規作成する。

作成条件は [[specdojo:kata-guide]] の `実践の型を作る条件` を正本とする。`_MISSING_` の参照は、rulebook frontmatter で `not-needed` と宣言済みなら作成しない。`undecided` なら要否を判断し、必要な型を整備して ID を宣言するか、不要として `not-needed` へ更新する。項目省略は必要だが未整備であるため作成対象に含める。

### grade result から展開された finding

- F001 \[major/vp-po-decision-readiness; line=1; anchor=`"# SpecDojo システム設計"`\]: `` `status: draft` の承認対象、API・DB・監視 SSOT の未決事項、影響範囲、解消後の次アクションを明示する必要がある。 ``
- F002 \[major/vp-pm-plan-feasibility; line=41; anchor=``"| ドキュメントサイト | `docs/`、`packages/docs-site/` | `npm run docs:build`      | `.vitepress/dist`（workspace 直下） | CI / ローカル検証 |"``\]: `変更タスクを計画・完了判定できるよう、「代表実行」「経路を検証」「分離を確認」の対象ケース、実行手順、期待結果を具体化する必要がある。`
- F003 \[major/vp-pm-dependency-risk; line=59; anchor=`"| -------------- | --------------------------- | ---------------------------------- |"`\]: ``廃止済み `cdfd-task-execution` と `cdfd-register-lifecycle` への依存を、現行の `cdfd-do`、`cdfd-plan` などへ更新し、後続作業への影響を解消する必要がある。``
- F004 \[major/vp-ba-requirements-completeness; line=12; anchor=`"| 種別 | SSOT | 参照先 | 更新責任 | 備考 |"`\]: `API 定義、DB スキーマ、Observability の参照先または非該当理由を追加し、設計索引の利用者視点で必要な範囲を充足する必要がある。`
- F005 \[minor/vp-ba-stakeholder-clarity; line=7; anchor=`"対象は SpecDojo CLI、ドキュメント生成、agent 実行、Git / worktree 統合、定期処理である。ARC が構成と導線、DEV がコード・schema、PM がプロジェクト実行定義、OPS が運用設定の更新責任を持つ。"`\]: `更新責任に加え、QE がテスト設計で確認する範囲と、PO が承認する対象を利用者・確認者として明示する必要がある。`
- F006 \[major/vp-arc-cross-document-consistency; line=34; anchor=``"| Git Integration | Git source and repository policy | `src/exec/worktree.ts`、`src/exec/worktree-ops*.ts`、`src/exec/repo-integration*.ts`、`.github/` | DEV / ARC | branch / worktree / repository integration / PR境界 |"``\]: `` `npm run docs:index` は package scripts に存在しないため、実在する `npm run docs:generate` または `specdojo index build` へ修正する必要がある。 ``
- F007 \[major/vp-arc-cross-document-consistency; line=59; anchor=`"| -------------- | --------------------------- | ---------------------------------- |"`\]: `` `cdfd-task-execution` と `cdfd-register-lifecycle` は deprecated として trash 配下へ移動済みであり、現行の `cdfd-do` と `cdfd-plan` など後継 SSOT への参照へ更新する必要がある。 ``
- F008 \[major/vp-arc-technical-constraints; line=12; anchor=`"| 種別 | SSOT | 参照先 | 更新責任 | 備考 |"`\]: `API 定義、DB migration/schema、監視・ログ設定について、実在する SSOT、更新責任、検証方法または非該当理由を明示する必要がある。`
- F009 \[major/vp-dev-implementation-readiness; line=12; anchor=`"| 種別 | SSOT | 参照先 | 更新責任 | 備考 |"`\]: `実装者が API・DB・設定変更を開始できるよう、各 SSOT の対象ファイル、schema、生成・検証コマンドを実在する内容で補う必要がある。`
- F010 \[major/vp-dev-change-impact; line=41; anchor=``"| ドキュメントサイト | `docs/`、`packages/docs-site/` | `npm run docs:build`      | `.vitepress/dist`（workspace 直下） | CI / ローカル検証 |"``\]: `API、DB schema、設定 schema、Job、監視設定を変更する場合の SSOT、生成物、テスト、運用手順への影響を変更トリガーとして追加する必要がある。`
- F011 \[major/vp-dev-testability; line=34; anchor=``"| Git Integration | Git source and repository policy | `src/exec/worktree.ts`、`src/exec/worktree-ops*.ts`、`src/exec/repo-integration*.ts`、`.github/` | DEV / ARC | branch / worktree / repository integration / PR境界 |"``\]: `` `npm run docs:index` を実在するコマンドへ修正し、各変更種別について実行する lint・schema・test・build コマンドと期待結果を明示する必要がある。 ``
- F012 \[major/vp-qe-done-criteria; line=12; anchor=`"| 種別 | SSOT | 参照先 | 更新責任 | 備考 |"`\]: `SSOT 一覧に API 定義と DB スキーマの参照先または非該当である旨がなく、DC-001 を確認できない。`
- F013 \[major/vp-qe-done-criteria; line=48; anchor=`"| ---------------------- | --------------------------------------------------------- | ---------------------------------------------- | ----------------------------- |"`\]: `運用文書ディレクトリだけが示され、運用・監視設定そのものの SSOT が特定できないため DC-004 を確認できない。`
- F014 \[major/vp-qe-verifiability; line=41; anchor=``"| ドキュメントサイト | `docs/`、`packages/docs-site/` | `npm run docs:build`      | `.vitepress/dist`（workspace 直下） | CI / ローカル検証 |"``\]: `「代表実行成功」「経路を検証」「分離を確認」などの完了条件について、実行する検査・対象ケース・期待結果を明記しなければ判定者ごとに合否が変わる。`
- F015 \[minor/vp-qe-omissions-consistency; line=1; anchor=`"# SpecDojo システム設計"`\]: ``Frontmatter に rulebook が必須とする `title` がないため、共通メタデータを補う必要がある。``
- F016 \[minor/vp-qe-omissions-consistency; line=9; anchor=`"## 2. SSOT 一覧"`\]: `第2節から第4節の見出しが rulebook の順序固定見出しから括弧内の説明を省略しているため、規定の見出し名へ統一する必要がある。`
- F017 \[major/vp-qe-omissions-consistency; line=12; anchor=`"| 種別 | SSOT | 参照先 | 更新責任 | 備考 |"`\]: `API、DB Schema、Observability の SSOT が一覧になく、存在しない場合の非該当宣言もないため、rulebook と成果物カタログが要求する参照範囲を満たしていない。`
- F018 \[minor/vp-ux-readability; line=3; anchor=`"SpecDojo のシステム設計情報と、コード・設定ファイルを正本とする SSOT への入口を集約する。本文へ詳細仕様を複製せず、変更時に最初に確認・更新する場所を示す。"`\]: `SSOT、CPM、CDFD、OPD、SYSD などの略語が本文内で定義されていないため、初出時の展開または用語定義への導線を追加する必要がある。`
- F019 \[minor/vp-ux-user-flow; line=52; anchor=``"| 登録項目ID規則変更     | `src/register/register.ts`、`src/register/*.ts`、命名標準 | register CDFD、重要フロー                      | 衝突検出と参照更新を検証      |"``\]: `関連文書の ID がコード表記だけでリンク化されていないため、解決可能な wikilink または Markdown リンクへ変更する必要がある。`
- F020 \[major/vp-ux-user-flow; line=59; anchor=`"| -------------- | --------------------------- | ---------------------------------- |"`\]: `データフローの導線が廃止済み文書を指しており、利用者が現行の Plan・Do 設計へ到達できないため後継文書への導線へ置き換える必要がある。`
- F021 \[major/vp-ops-release-readiness; line=1; anchor=`"# SpecDojo システム設計"`\]: `ready 化の前提として、API・DB・監視 SSOT、実在コマンド、現行関連文書への更新、確認者・承認者を公開前チェックとして明示する必要がある。`
- F022 \[major/vp-ops-operability; line=48; anchor=`"| ---------------------- | --------------------------------------------------------- | ---------------------------------------------- | ----------------------------- |"`\]: `運用手順ディレクトリだけでなく、監視、ログ、通知、定期処理などの運用設定 SSOT、更新責任、検証・再生成手順を特定する必要がある。`

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

- 設計情報の参照先（API定義・DBスキーマ・設定スキーマ）へのリンクが揃っていること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [DEV] 設計のSSOT所在が確認できること
- [QE] テスト設計に必要な設計SSOTへのリンクが確認できること
- [OPS] 運用・監視設定の参照先が確認できること

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
