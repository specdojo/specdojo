---
specdojo:
  id: prj-0001:xep-t-kata-wave-1-sysd-index-070-20261114t094326z-a6f22fc9
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-1-sysd-index-070
  name: "磨き込み・整合性確認"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: fully-guided
  targets:
    - sysd-index
---

# Edit Plan: T-KATA-WAVE-1-sysd-index-070

## 1. このフェーズで行うこと

整備済みの実践の型と先行・隣接成果物を参照し、既存の草案を保守的に磨き込む。責務境界と depends_on に沿った情報の受け渡しを確認し、不足や不整合だけを最小限修正して done_criteria を満たす状態へ整える。

## 2. 対象成果物

- `name`: システム設計（全体構成・リンク集）
- `depends_on`:  -
- `based_on`（対象成果物の frontmatter）: なし
- 個票の `入力`: なし
- `overview`: システム設計のSSOT（OpenAPI・AsyncAPI・migrationファイル・agent実行構成等）への導線を1箇所に集約する
- `path`: `docs/ja/product/040-system-design/sysd-index.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-1-sysd-index-070/T-KATA-WAVE-1-sysd-index-070-20261114T094326Z-a6f22fc9/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **ARC（Architect）**
- 責務: rulebook、recipe、sample、template、成果物カタログの構造整合と技術制約を整理する。

このロールが重視するレビュー観点:

- 文書構造・配置・命名: frontmatter、ID、ファイル名、配置、見出し、リンクがプロジェクトの文書体系と整合しているか。
- 成果物間整合: 成果物について、成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。不整合の finding は突き合わせ先の文書 ID またはパスと、双方の相反する記述を特定する。rulebook、recipe、sample、template の内部・相互・適用先との整合は vp-qe-kata-conformance で判定し、この観点では扱わない。
- 技術前提・制約の明確性: 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。
- 冗長性・簡潔性: 各節が固有の判断または手順に寄与し、同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲がないか。判断に要る背景・制約・例外・完了条件が残されていれば下限を満たしているとする。長さだけでは fail にせず、削る・まとめる・参照に置き換えることで判断情報を失わない箇所を具体的に特定できる場合のみ minor とする。

## 4. 進め方

fully-guided は既存成果物の磨き込み専用である。雛形からの下書きや、調査して新しい値を選ぶ作業は draft で行う。対象成果物が未作成、または文脈だけの状態なら、下書きが必要なことを result に記録し、draft へ申し送る。

成果物内に `_CONTEXT_:` が残っている場合は、その指示を本文へ反映・削除せず、元の指示、未反映の箇所、必要な下書きを論点として result の `進め方と実践の型の適用` セクションに残し、draft へ申し送る。executor / reporter pipeline では報告の `handoff` に記載し、reporter と runner が result へ転記する。

対象成果物に必要と宣言された rulebook / recipe / sample は、指定されたファイルを実際に読み込んだうえで、次の役割に沿って参照する。読み込まずに記憶や推測で代替しない。

参照ファイル（成果物カタログの rulebook ID と rulebook frontmatter から解決。`_MISSING_` は `undecided`、`not-needed`、未整備、または `kind: generated` による非適用を表す。fully-guided では通常 `not-needed` の項目だけが該当する）:

- rulebook: `docs/ja/specdojo/rulebooks/sysd-index-rulebook.md`
- 併せて適用する rulebook（記法など）: _MISSING_
- recipe: `docs/ja/specdojo/recipes/sysd-index-recipe.md`
- sample: `docs/ja/specdojo/samples/sysd-index-sample.md`

1. rulebook: `_MISSING_` でなければ指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. 併せて適用する rulebook: `_MISSING_` でない場合は各ファイルを読み込み、記法など主 rulebook が委譲したルールに従う。主 rulebook と矛盾する場合は主 rulebook を正とする。
3. recipe: `_MISSING_` でなければ指定された recipe を読み込み、示された問い・観点・深掘り手順に沿って内容を組み立てる。
4. sample: `_MISSING_` でなければ指定された sample を読み込み、rulebook の要求を満たす完成例の形式（章・表・記述の粒度）を確認する。sample は形式の参照に限って使い、sample の業務内容・固有名詞・値を対象成果物へ転記しない。

磨き込みでは template は読み込まない。粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる。sample は既存の対象成果物に該当する記述が無い箇所や、rulebook の要求を形式に落とす方法が判断できない箇所の参考に限る。既存の対象成果物と sample の形式が異なる場合は、rulebook の許容範囲内である限り既存の対象成果物を優先する。書き方が複数の文書間で矛盾する場合は rulebook を正とする。

### grade result から展開された finding

- F001 \[major/vp-po-decision-readiness; line=1; anchor=`"# SpecDojo システム設計"`; cause=document\]: `` `status: draft` の承認対象、API・DB・監視 SSOT の未決事項、影響範囲、解消後の次アクションを明示する必要がある。 ``
- F002 \[major/vp-pm-plan-feasibility; line=41; anchor=``"| ドキュメントサイト | `docs/`、`packages/docs-site/` | `npm run docs:build`      | `.vitepress/dist`（workspace 直下） | CI / ローカル検証 |"``; cause=document\]: `変更タスクを計画・完了判定できるよう、「代表実行」「経路を検証」「分離を確認」の対象ケース、実行手順、期待結果を具体化する必要がある。`
- F003 \[major/vp-pm-dependency-risk; line=59; anchor=`"| -------------- | --------------------------- | ---------------------------------- |"`; cause=document\]: ``廃止済み `cdfd-task-execution` と `cdfd-register-lifecycle` への依存を、現行の `cdfd-do`、`cdfd-plan` などへ更新し、後続作業への影響を解消する必要がある。``
- F004 \[major/vp-ba-requirements-completeness; line=12; anchor=`"| 種別 | SSOT | 参照先 | 更新責任 | 備考 |"`; cause=document\]: `API 定義、DB スキーマ、Observability の参照先または非該当理由を追加し、設計索引の利用者視点で必要な範囲を充足する必要がある。`
- F005 \[minor/vp-ba-stakeholder-clarity; line=7; anchor=`"対象は SpecDojo CLI、ドキュメント生成、agent 実行、Git / worktree 統合、定期処理である。ARC が構成と導線、DEV がコード・schema、PM がプロジェクト実行定義、OPS が運用設定の更新責任を持つ。"`; cause=document\]: `更新責任に加え、QE がテスト設計で確認する範囲と、PO が承認する対象を利用者・確認者として明示する必要がある。`
- F006 \[major/vp-arc-cross-document-consistency; line=34; anchor=``"| Git Integration | Git source and repository policy | `src/exec/worktree.ts`、`src/exec/worktree-ops*.ts`、`src/exec/repo-integration*.ts`、`.github/` | DEV / ARC | branch / worktree / repository integration / PR境界 |"``; cause=document\]: `` `npm run docs:index` は package scripts に存在しないため、実在する `npm run docs:generate` または `specdojo index build` へ修正する必要がある。 ``
- F007 \[major/vp-arc-cross-document-consistency; line=59; anchor=`"| -------------- | --------------------------- | ---------------------------------- |"`; cause=document\]: `` `cdfd-task-execution` と `cdfd-register-lifecycle` は deprecated として trash 配下へ移動済みであり、現行の `cdfd-do` と `cdfd-plan` など後継 SSOT への参照へ更新する必要がある。 ``
- F008 \[major/vp-arc-technical-constraints; line=12; anchor=`"| 種別 | SSOT | 参照先 | 更新責任 | 備考 |"`; cause=document\]: `API 定義、DB migration/schema、監視・ログ設定について、実在する SSOT、更新責任、検証方法または非該当理由を明示する必要がある。`
- F009 \[major/vp-dev-implementation-readiness; line=12; anchor=`"| 種別 | SSOT | 参照先 | 更新責任 | 備考 |"`; cause=document\]: `実装者が API・DB・設定変更を開始できるよう、各 SSOT の対象ファイル、schema、生成・検証コマンドを実在する内容で補う必要がある。`
- F010 \[major/vp-dev-change-impact; line=41; anchor=``"| ドキュメントサイト | `docs/`、`packages/docs-site/` | `npm run docs:build`      | `.vitepress/dist`（workspace 直下） | CI / ローカル検証 |"``; cause=document\]: `API、DB schema、設定 schema、Job、監視設定を変更する場合の SSOT、生成物、テスト、運用手順への影響を変更トリガーとして追加する必要がある。`
- F011 \[major/vp-dev-testability; line=34; anchor=``"| Git Integration | Git source and repository policy | `src/exec/worktree.ts`、`src/exec/worktree-ops*.ts`、`src/exec/repo-integration*.ts`、`.github/` | DEV / ARC | branch / worktree / repository integration / PR境界 |"``; cause=document\]: `` `npm run docs:index` を実在するコマンドへ修正し、各変更種別について実行する lint・schema・test・build コマンドと期待結果を明示する必要がある。 ``
- F012 \[major/vp-qe-done-criteria; line=12; anchor=`"| 種別 | SSOT | 参照先 | 更新責任 | 備考 |"`; cause=document\]: `SSOT 一覧に API 定義と DB スキーマの参照先または非該当である旨がなく、DC-001 を確認できない。`
- F013 \[major/vp-qe-done-criteria; line=48; anchor=`"| ---------------------- | --------------------------------------------------------- | ---------------------------------------------- | ----------------------------- |"`; cause=document\]: `運用文書ディレクトリだけが示され、運用・監視設定そのものの SSOT が特定できないため DC-004 を確認できない。`
- F014 \[major/vp-qe-verifiability; line=41; anchor=``"| ドキュメントサイト | `docs/`、`packages/docs-site/` | `npm run docs:build`      | `.vitepress/dist`（workspace 直下） | CI / ローカル検証 |"``; cause=document\]: `「代表実行成功」「経路を検証」「分離を確認」などの完了条件について、実行する検査・対象ケース・期待結果を明記しなければ判定者ごとに合否が変わる。`
- F015 \[minor/vp-qe-omissions-consistency; line=1; anchor=`"# SpecDojo システム設計"`; cause=document\]: ``Frontmatter に rulebook が必須とする `title` がないため、共通メタデータを補う必要がある。``
- F016 \[minor/vp-qe-omissions-consistency; line=9; anchor=`"## 2. SSOT 一覧"`; cause=document\]: `第2節から第4節の見出しが rulebook の順序固定見出しから括弧内の説明を省略しているため、規定の見出し名へ統一する必要がある。`
- F017 \[major/vp-qe-omissions-consistency; line=12; anchor=`"| 種別 | SSOT | 参照先 | 更新責任 | 備考 |"`; cause=document\]: `API、DB Schema、Observability の SSOT が一覧になく、存在しない場合の非該当宣言もないため、rulebook と成果物カタログが要求する参照範囲を満たしていない。`
- F018 \[minor/vp-ux-readability; line=3; anchor=`"SpecDojo のシステム設計情報と、コード・設定ファイルを正本とする SSOT への入口を集約する。本文へ詳細仕様を複製せず、変更時に最初に確認・更新する場所を示す。"`; cause=document\]: `SSOT、CPM、CDFD、OPD、SYSD などの略語が本文内で定義されていないため、初出時の展開または用語定義への導線を追加する必要がある。`
- F019 \[minor/vp-ux-user-flow; line=52; anchor=``"| 登録項目ID規則変更     | `src/register/register.ts`、`src/register/*.ts`、命名標準 | register CDFD、重要フロー                      | 衝突検出と参照更新を検証      |"``; cause=document\]: `関連文書の ID がコード表記だけでリンク化されていないため、解決可能な wikilink または Markdown リンクへ変更する必要がある。`
- F020 \[major/vp-ux-user-flow; line=59; anchor=`"| -------------- | --------------------------- | ---------------------------------- |"`; cause=document\]: `データフローの導線が廃止済み文書を指しており、利用者が現行の Plan・Do 設計へ到達できないため後継文書への導線へ置き換える必要がある。`
- F021 \[major/vp-ops-release-readiness; line=1; anchor=`"# SpecDojo システム設計"`; cause=document\]: `ready 化の前提として、API・DB・監視 SSOT、実在コマンド、現行関連文書への更新、確認者・承認者を公開前チェックとして明示する必要がある。`
- F022 \[major/vp-ops-operability; line=48; anchor=`"| ---------------------- | --------------------------------------------------------- | ---------------------------------------------- | ----------------------------- |"`; cause=document\]: `運用手順ディレクトリだけでなく、監視、ログ、通知、定期処理などの運用設定 SSOT、更新責任、検証・再生成手順を特定する必要がある。`

`cause` は原因の所在を示す。`kata:<kind>` の指摘も成果物側の修正が必要なため、この plan に載るすべての指摘を扱う。Kata の手入れは対応する maintenance の段で行う。

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

参照してよい文書は、宣言された文書だけに限る。具体的には、対象成果物、本セクションの rulebook / 併せて適用する rulebook / recipe / sample、`対象成果物` セクションの `depends_on` 成果物、対象成果物の frontmatter の `based_on`、プロジェクトコンテキスト（`project_context`）、個票の `入力`、カタログの `brief` である。加えて、下記「実装エビデンスと未作成の依存」に列挙した実装の根拠を読み取り専用で参照する。`入力` と `brief` は値が無いときは載せない。これらに宣言されていない他のプロジェクト文書・実装や外部の情報を独自に探索・参照しない。磨き込みは宣言された資料とこの plan 自身の記述（フェーズ説明・完了の狙い）だけを根拠に行い、不足があっても未宣言の文書を追加で読んで補わない。それでも判断できない箇所は憶測で埋めず _TODO_ / _ASSUMPTION_ として論点を残す。

本タスクの実行に必要な fully-guided の参照方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や review への適用）を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

### 実装エビデンスと未作成の依存

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の実装の根拠である。`targets`、変更許可範囲、commit 対象には含めない。

なし（`evidence_refs` 未指定またはカタログなし）。

実装エビデンスは現在動作の事実、rulebook は書き方、`depends_on` と個票の `入力` は意図された仕様の根拠として使い分ける。食い違いは実装へ無条件に合わせず、承認根拠のある現在動作だけを反映し、未承認の乖離は意図された仕様を保持して result に記録する。実装から目的・業務判断・将来方針を推測しない。

`depends_on` の「未作成」は参照できる本文がまだないことを示す。未作成の依存だけを理由に異常終了せず、存在する資料で進める。内容を推測で埋めず、必要な箇所は _TODO_ / _ASSUMPTION_ として、不足する根拠と次のアクションを残す。

### 4.1. 必要な実践の型が存在しない・内容が薄い場合

- `not-needed` ではない rulebook / recipe が存在しない、または基準として機能しないほど内容が薄い場合は、その事実と判断を result の `進め方と実践の型の適用` セクションに記録する。
- 不足分は、存在する他の実践の型と `depends_on` 成果物（いずれも plan 記載の文書）、および既存の対象成果物で補う。実践の型の欠落を理由にレビュー観点を未達にしない。
- 章構成は既存の対象成果物を骨組みとし、判断に迷う場合は rulebook の構成を正とする。
- 実践の型そのものの整備が必要と判断した場合でも、本タスクの範囲を超える整備は行わず、申し送りに残す。

### 4.2. 既存記述の扱い

- 対象成果物に既存の記述がある場合は、まず内容を確認し、既存記述を尊重する。既存記述の破棄や全面的な書き換えは原則として行わず、既存記述を基礎として不足分を加筆・補強する。
- 次のいずれかに該当する箇所は、既存記述であっても修正対象とする。修正はいずれも該当箇所に閉じた最小限にとどめる。
  - `depends_on` の最新の決定事項と明確に矛盾する箇所。
  - 手順1で確認した rulebook の必須要素が欠落している箇所、rulebook の禁止事項に抵触している箇所、および rulebook が定める章構成に適合していない箇所。
  - 同一成果物内で同じ内容が複数箇所に重複している箇所。
  - rulebook の必須要素にも「完了の狙い」に示された `done_criteria` にも寄与していない記述。
- 上記のいずれにも該当しない場合（完成度・整合性・読みやすさの向上など）は、それだけを理由に修正しない。既存記述が rulebook の許容範囲内（例: 複数の構成が認められている場合の一方の選択）であれば、他章との見た目の整合を理由に、より詳細な構成や長い記述へ書き換えない。
- rulebook 不適合の修正は、既存記述の内容を保持したまま rulebook の章構成へ移し替え、欠落した必須要素を補い、禁止事項に該当する記述形式を改める作業として行う。内容の全面書き換えはしない。移し替え先が定まらない既存記述は、下記の削除対象に該当しない限り削除せず、内容が最も近い章に残したうえで、その判断を result に記録する。
- 重複記述は、内容が最も適切な1箇所を正本と定めて統合し、他の箇所は要約または正本の章への参照に置き換える。統合で情報が失われる場合は、不足分を正本側に取り込んでから他方を整理する。
- rulebook の必須要素にも `done_criteria` にも寄与していない記述は削除する。削除は既存記述の尊重の例外であり、判断根拠を result に記録することで担保する。
- 既存記述が古いか判断できない場合、rulebook への不適合か意図的な逸脱か判断できない場合、および必須要素・`done_criteria` に寄与するか判断できない場合は、破棄せず _TODO_ / _ASSUMPTION_ で論点を残す。
- 加筆・修正・統合・削除の判断根拠を result の `進め方と実践の型の適用` セクションに残す。削除・統合した記述については、対象箇所と根拠が後から追える粒度で記録する。

### 4.3. 根拠のない具体化の禁止

- ファイルパス・コマンド・設定値など、実装や設定の実態を示す具体的な記述を新たに書き加える場合は、本セクションの宣言された参照範囲（rulebook / 併せて適用する rulebook / recipe、`depends_on` 成果物、`based_on`、プロジェクトコンテキスト、個票の `入力`、カタログの `brief`）で裏付けが取れる場合に限る。sample は別文脈の完成例であり、対象成果物の具体的な記述の裏付けにしない。
- 既存記述が曖昧・不完全（ファイル名のみでパスが無い、値が未確定など）であっても、裏付けが無ければ推測で具体化しない。完成度を上げる目的だけで、もっともらしい値を断定的に書き加えない。
- 裏付けが無く判断できない箇所は、既存の曖昧な記述を残したまま _TODO_ / _ASSUMPTION_ として論点を残す。

### 4.4. 判断根拠の記録

参照した文書・参照しなかった文書と、その判断根拠を result に残す。記録先は次のとおり。

- 参照した rulebook / recipe / sample の使い分け、矛盾時に rulebook を正とした箇所、欠落・薄い実践の型の扱い、既存記述の加筆・修正・統合・削除の根拠、具体化を見送った箇所とその理由: result の `進め方と実践の型の適用` セクション。

## 5. 完了の狙い

この成果物が満たすべき狙い（成果物カタログの `done_criteria`）を、owner ロールの狙いと下流ロールの入力適合に分けて示す。「進め方」に従って実践の型に沿って記述する中で、owner の狙いを作成目標として満たすことを目指す。下流ロールの項目は、その文書から各ロールが自分の責務の成果物を作成できるよう入力として最低限成立させる範囲にとどめ、各ロールの内容を成果物に作り込まない（一文書一責務）。下流ロールの適合性検証や観点別の自己レビュー・修正ループは行わず、多観点での検証は後続の独立した review task に委ねる。

owner として達成する狙い:

- 設計情報の参照先（API定義・DBスキーマ・設定スキーマ）へのリンクが揃っていること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [DEV] 設計のSSOT所在が確認できること
- [QE] テスト設計に必要な設計SSOTへのリンクが確認できること
- [OPS] 運用・監視設定の参照先が確認できること

## 6. 完了手順

1. 「このフェーズで行うこと」と「進め方」に従って成果物を更新する。
2. 「完了の狙い」を満たしているかを確認し、不足があれば加筆・補強する（観点別の自己レビューや再確認ループは行わない）。
3. 共通規約に従って、必要な整形・静的検査を実行する。
4. result に実施内容・変更ファイル・進め方と実践の型の適用を記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 7. 異常終了の条件

- 実行に必要なツール・パッケージの依存を解決できない、対象ファイルのパスが特定できない、または lint/test 未解消の場合は異常終了する（終了コード 1）。
- 未作成の `depends_on` と `evidence_refs` の欠落だけでは異常終了しない。未作成の依存の内容は推測せず _TODO_ / _ASSUMPTION_ と次のアクションを残す。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
