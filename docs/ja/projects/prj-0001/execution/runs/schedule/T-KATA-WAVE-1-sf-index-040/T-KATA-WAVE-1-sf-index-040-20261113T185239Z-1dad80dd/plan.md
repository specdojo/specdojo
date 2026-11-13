---
specdojo:
  id: prj-0001:xep-t-kata-wave-1-sf-index-040-20261113t185239z-1dad80dd
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-1-sf-index-040
  name: "rulebook の見直し"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: rulebook-maintenance
  targets:
    - sf-index
    - specdojo:sf-index-rulebook
---

# Edit Plan: T-KATA-WAVE-1-sf-index-040

## 1. このフェーズで行うこと

新しく作った型の文書（rulebook・recipe・sample・template）は、packages/docs-site/.vitepress/sidebar-config.ts の型のメニューにも足す（tests/packages/docs-site/sidebar-kata.test.ts が確かめる）。
初期整備した代表の実績から rulebook を手入れする。成果物本体は変更しない。sample・recipe・template の整合は後続の段で行う。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: システム化機能一覧（全体構成）
- `depends_on`:
  - [[bps-init-required]]
  - [[bps-register-required]]
  - [[bps-planning-catalog-strategy-update]]
  - [[bps-task-selection-preparation]]
  - [[bps-routine-required]]
  - [[bps-parallel-required]]
  - [[bps-config-change-evaluation]]
  - [[bps-derived-project-scoped]]
  - [[bps-reporting-monitoring-detection]]
  - [[bps-deprecation-process]]
  - [[clis-index]]
- `overview`: システムで実現する機能の全体構成と一覧を定義する。行ごとに業務プロセス仕様（bps-*）・CLI仕様（clis-index配下のCLIコマンド群）を要約参照する
- `path`: `docs/ja/product/010-business-specs/050-system-functions/sf-index.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-1-sf-index-040/T-KATA-WAVE-1-sf-index-040-20261113T185239Z-1dad80dd/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/sf-index-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

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

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[major/vp-po-purpose-alignment; line=19; anchor=`"## 3. ファイル命名・ID規則"`\]: `述べられている目的は同語反復的であり、より広いプロジェクトの目標と一致していないか、アーティファクトの必要性を説明できていません。`
- F002 \[major/vp-po-decision-readiness; line=1; anchor=`"# [システム化機能一覧 / 全体構成](../rulebooks/sf-rulebook.md) 作成ルール"`\]: `ルールブックには、必要な意思決定ポイント、承認者、またはPOの承認基準が定義されていません。`
- F003 \[major/vp-po-publication-accountability; line=1; anchor=`"# [システム化機能一覧 / 全体構成](../rulebooks/sf-rulebook.md) 作成ルール"`\]: `ドキュメントの責任、ならびに公開範囲や機密情報の取り扱いに関するガイドラインが不足しています。`
- F004 \[major/vp-pm-plan-feasibility; line=1; anchor=`"# [システム化機能一覧 / 全体構成](../rulebooks/sf-rulebook.md) 作成ルール"`\]: `ルールブックには、効果的なタスク計画に必要な作業単位、Roleコード、および完了条件の定義が不足しています。`
- F005 \[major/vp-pm-dependency-risk; line=20; anchor=`""`\]: `特定の依存関係、リスク、および後続のスケジュールへの影響が明示的に特定されていません。`
- F006 \[major/vp-pm-control-reporting; line=1; anchor=`"# [システム化機能一覧 / 全体構成](../rulebooks/sf-rulebook.md) 作成ルール"`\]: `進捗の報告、問題のエスカレーション、および変更リクエストの管理に関する指示が不足しています。`
- F007 \[major/vp-ba-business-value; line=1; anchor=`"# [システム化機能一覧 / 全体構成](../rulebooks/sf-rulebook.md) 作成ルール"`\]: `アーティファクトのビジネス価値、ターゲット層、およびそれが解決するビジネス上の課題が明確に述べられていません。`
- F008 \[major/vp-ba-requirements-completeness; line=47; anchor=`"- 章参照は章番号ではなく章タイトルで記述する。"`\]: `ルールブックは、完全性のための必要なガイドラインや基準を提供せずに、スコープの定義を委任しています。`
- F009 \[major/vp-ba-stakeholder-clarity; line=1; anchor=`"# [システム化機能一覧 / 全体構成](../rulebooks/sf-rulebook.md) 作成ルール"`\]: `アーティファクトのステークホルダー、ユーザー、およびレビュアーが特定されていません。`
- F010 \[major/vp-arc-technical-constraints; line=1; anchor=`"# [システム化機能一覧 / 全体構成](../rulebooks/sf-rulebook.md) 作成ルール"`\]: `必要な技術的制約、スキーマ定義、および検証手順が不足しています。`
- F011 \[major/vp-arc-conciseness; line=24; anchor=`"## 4. 推奨 Frontmatter 項目"`\]: `セクション2には実際のルールではなく生のテンプレート指示が含まれており、必要な判断基準を提供できていません。`
- F012 \[major/vp-dev-implementation-readiness; line=1; anchor=`"# [システム化機能一覧 / 全体構成](../rulebooks/sf-rulebook.md) 作成ルール"`\]: `実装に必要な入力、制約、およびスキーマの仕様が提供されていません。`
- F013 \[major/vp-dev-change-impact; line=1; anchor=`"# [システム化機能一覧 / 全体構成](../rulebooks/sf-rulebook.md) 作成ルール"`\]: `関連するアーティファクトや後続のプロセスに対する変更の影響を評価するためのガイドラインが不足しています。`
- F014 \[major/vp-dev-testability; line=50; anchor=`""`\]: `バリデーションの章が必要であるにもかかわらず、特定の検証基準、lintルール、または検証手順が定義されていません。`
- F015 \[minor/vp-qe-verifiability; line=22; anchor=``"- ドキュメントID: `sf-index-<term>` または用途に応じた識別子"``\]: `判定可能な記述を求める指示はあるが, 具体的にどのような状態が「判定可能」であるかの基準が不足している。`
- F016 \[major/vp-qe-omissions-consistency; line=24; anchor=`"## 4. 推奨 Frontmatter 項目"`\]: `「2. 位置づけと用語定義」がテンプレートの指示文のままであり、実際の定義が記載されていない。`
- F017 \[major/vp-qe-omissions-consistency; line=43; anchor=`"## 6. 記述ガイド"`\]: `第5節で定義した必須章（目的、入力情報、記述内容、検証観点）に対する具体的な記述ガイドが不足している。`
- F018 \[major/vp-qe-kata-conformance; line=43; anchor=`"## 6. 記述ガイド"`\]: `本文構成の定義（必須章）と、対応するサンプルの構成が矛盾しており、適用方法が不透明である。`
- F019 \[major/vp-ux-readability; line=11; anchor=`""`\]: `H1に成果物名の代わりに別ドキュメントへのリンクが記述されており、成果物の識別を混乱させる。`
- F020 \[major/vp-ux-readability; line=24; anchor=`"## 4. 推奨 Frontmatter 項目"`\]: `成果物の位置づけや責務境界が具体化されていないため、作成者が判断に迷う。`
- F021 \[major/vp-ux-language-consistency; line=11; anchor=`""`\]: `H1タイトルで使用されている用語や参照が、ドキュメントのIDや意図された目的と矛盾しており、混乱を招いています。`
- F022 \[major/vp-ops-release-readiness; line=1; anchor=`"# [システム化機能一覧 / 全体構成](../rulebooks/sf-rulebook.md) 作成ルール"`\]: `ルールブックには、アーティファクションをリリース準備完了としてマークするための基準や前提条件が定義されていません。`
- F023 \[major/vp-ops-operability; line=1; anchor=`"# [システム化機能一覧 / 全体構成](../rulebooks/sf-rulebook.md) 作成ルール"`\]: `アーティファクトの継続的な保守、変更管理、および運用上の取り扱いに関するガイドラインがありません。`

### 成果物から届いた Kata が原因の finding

- なし

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の rulebook を読み込み、現状の章構成・必須項目・禁止事項・判定基準を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 rulebook の frontmatter から辿れる recipe / sample / template、`併せて適用する rulebook`、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが成果物の実態と合っているかを見直す。
5. 成果物側で繰り返し守られていない規定は、規定が過剰なのか成果物側の不備なのかを判断し、根拠とともに rulebook へ反映するか result に記録する。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した rulebook は [[specdojo:rulebook-authoring-standard]]（章立て・記述ルール・禁止事項の正本）に従う。recipe / sample / template と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な rulebook メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 rulebook から辿れる関連文書、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で rulebook を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の rulebook が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って rulebook を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
