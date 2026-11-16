---
specdojo:
  id: prj-0001:xep-t-kata-wave-1-bes-index-050-20261113t212722z-84613555
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-1-bes-index-050
  name: "sample の見直し"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: sample-maintenance
  targets:
    - bes-index
    - specdojo:bes-index-sample
---

# Edit Plan: T-KATA-WAVE-1-bes-index-050

## 1. このフェーズで行うこと

新しく作った型の文書（rulebook・recipe・sample・template）は、packages/docs-site/.vitepress/sidebar-config.ts の型のメニューにも足す（tests/packages/docs-site/sidebar-kata.test.ts が確かめる）。
改訂した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として手入れする。代表（prj-0001）の内容を写さず、判断に要る場面・例外を拾う。成果物本体は変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 業務イベント仕様（全体構成）
- `depends_on`:
  - [[cdfd-overview]]
- `overview`: cdfd-overview.md の10プロセス領域の起点イベントを一覧で定義する
- `path`: `docs/ja/product/010-business-specs/030-business-model/bes-index.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-1-bes-index-050/T-KATA-WAVE-1-bes-index-050-20261113T212722Z-84613555/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/bes-index-sample.md`
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

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-purpose-alignment; line=5; anchor=`"本書は、業務上で発生する主要なイベントを一覧で定義するための最小サンプルである。"`\]: `§ 2 の「参照: ../rulebooks/bes-index-rulebook.md」のみで上位のプロジェクト目的・スコープとの関係が不明であり、目的整合の根拠が不足している。`
- F002 \[minor/vp-po-decision-readiness; line=27; anchor=`""`\]: `§ 5 の未解決事項「要件詳細の補強」について、影響範囲・判断者・次アクションが明示されていない。`
- F003 \[minor/vp-pm-plan-feasibility; line=27; anchor=`""`\]: `§ 5 の未解決事項に担当 Role code・完了条件・期限が記載されていない。`
- F004 \[minor/vp-pm-dependency-risk; line=12; anchor=`""`\]: `ルールブックが言及する後続成果物（BPS/BR/UI/テスト仕様）との依存関係やリスクが記載されていない。`
- F005 \[minor/vp-pm-control-reporting; line=27; anchor=`""`\]: `未解決事項の PJR 転記候補・報告先・対応担当の Role code が未記載。`
- F006 \[minor/vp-ba-business-value; line=5; anchor=`"本書は、業務上で発生する主要なイベントを一覧で定義するための最小サンプルである。"`\]: `対象者の業務課題・期待価値・成功基準が明示されておらず、ビジネス上の意義が読み取りにくい。`
- F007 \[major/vp-ba-requirements-completeness; line=14; anchor=`""`\]: `ルールブック § 5 が定める必須構成「業務イベント一覧（表）」の標準7列（イベントID/イベント名/何が起きたか/いつ/誰が・何が/発生条件/事実データ）を含む具体的な完成例が存在せず、サンプルとしての要件を満たしていない。`
- F008 \[minor/vp-ba-stakeholder-clarity; line=5; anchor=`"本書は、業務上で発生する主要なイベントを一覧で定義するための最小サンプルである。"`\]: `サンプルの利用者（ドキュメント執筆者）、確認者、合意対象が明示されていない。`
- F009 \[minor/vp-arc-technical-constraints; line=8; anchor=`""`\]: ``Frontmatter の schema 制約（id 規約 `bes-index`）やドキュメント検証手順への言及がない。``
- F010 \[minor/vp-arc-conciseness; line=15; anchor=`"- 主な内容: イベントID、イベント名、何が起きたか、いつ、発生条件 など"`\]: `§ 3「主な内容: イベントID、イベント名…」と § 4 表の「主な内容」行が同一情報の反復であり、一方に統合しても判断情報を失わない。`
- F011 \[major/vp-dev-implementation-readiness; line=19; anchor=`""`\]: `ルールブックの標準列定義に対応する具体的なデータ行（例: bes-sale-checkout のような実例行）がなく、実装者が記載水準を把握できない。`
- F012 \[minor/vp-dev-change-impact; line=1; anchor=`"# [業務イベント / 業務イベント仕様 全体構成](../rulebooks/bes-index-rulebook.md) サンプル"`\]: `サンプルの変更が他の成果物（template、recipe）や生成処理に与える影響が識別されていない。`
- F013 \[minor/vp-dev-testability; line=1; anchor=`"# [業務イベント / 業務イベント仕様 全体構成](../rulebooks/bes-index-rulebook.md) サンプル"`\]: `このサンプルの正しさを確認するための lint・schema 検証コマンドや期待結果が記載されていない。`
- F014 \[major/vp-qe-verifiability; line=1; anchor=`"# [業務イベント / 業務イベント仕様 全体構成](../rulebooks/bes-index-rulebook.md) サンプル"`\]: `サンプルの成功基準・受入条件が明示されておらず、ルールブックの必須構成を満たしているか判定できない。`
- F015 \[blocker/vp-qe-omissions-consistency; line=1; anchor=`"# [業務イベント / 業務イベント仕様 全体構成](../rulebooks/bes-index-rulebook.md) サンプル"`\]: `ルールブック § 5 が定める必須章「業務イベント一覧（表）」および必須7列（イベントID/イベント名/何が起きたか/いつ/誰が・何が/発生条件/事実データ）を含む表が完全に欠落しており、構成要件を満たしていない。`
- F016 \[blocker/vp-qe-kata-conformance; line=1; anchor=`"# [業務イベント / 業務イベント仕様 全体構成](../rulebooks/bes-index-rulebook.md) サンプル"`\]: `標準テンプレートに準拠しておらず、核心となる業務イベント一覧の具体例が示されていないため、サンプルとしての役割を果たしていない。`
- F017 \[major/vp-ux-readability; line=1; anchor=`"# [業務イベント / 業務イベント仕様 全体構成](../rulebooks/bes-index-rulebook.md) サンプル"`\]: `ルールブックが定める主要な記述内容（イベント一覧表）が含まれておらず、初見の読者が正しい記載水準を理解できない。`
- F018 \[major/vp-ux-readability; line=19; anchor=`""`\]: `§ 4「最小記述例」の表がドキュメントメタ情報（ドキュメント/目的/主な内容）であり、業務イベントの具体例ではないため、読者に誤った記載水準を示す。`
- F019 \[minor/vp-ux-language-consistency; line=10; anchor=`"- 前提: プロジェクト文脈は handbook の共通方針に準拠する"`\]: `§ 2「対象: 駄菓子屋の販売管理システム」の「対象」が入力情報なのか適用範囲なのか曖昧であり、ルールブックの用語との対応が不明確。`
- F020 \[minor/vp-ops-release-readiness; line=27; anchor=`""`\]: `ready 化の前提条件（必須構成の充足、未解決指摘の解消）が明示されていない。`
- F021 \[minor/vp-ops-operability; line=1; anchor=`"# [業務イベント / 業務イベント仕様 全体構成](../rulebooks/bes-index-rulebook.md) サンプル"`\]: `ルールブック変更時のサンプル更新方針・再生成手順が記載されていない。`

### 成果物から届いた Kata が原因の finding

- なし

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の sample を読み込み、現状の粒度・文体・表の書き方を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 sample の frontmatter から辿れる rulebook と recipe、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。rulebook との構成不整合を指摘する finding では、成果物の有無にかかわらず rulebook を正として照合する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが完成例として適切かを見直す。
5. rulebook の必須項目・禁止事項を満たす最小の記述例になるよう再構成し、実成果物の丸写しを避ける。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した sample は [[specdojo:sample-authoring-standard]]（構成・記述ルール・禁止事項の正本）に従う。rulebook / recipe と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な sample メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 sample から辿れる rulebook / recipe、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で sample を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の sample が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って sample を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
