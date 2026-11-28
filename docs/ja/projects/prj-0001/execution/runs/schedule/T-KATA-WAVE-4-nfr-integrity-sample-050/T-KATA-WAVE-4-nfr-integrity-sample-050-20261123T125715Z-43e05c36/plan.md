---
specdojo:
  id: prj-0001:xep-t-kata-wave-4-nfr-integrity-sample-050-20261123t125715z-43e05c36
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-4-nfr-integrity-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: sample-maintenance
  targets:
    - specdojo:nfr-integrity-sample
    - specdojo:nfr-integrity-sample
---

# Edit Plan: T-KATA-WAVE-4-nfr-integrity-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: データ整合性要件の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、データ整合性要件の完成例を示す
- `path`: `docs/ja/specdojo/samples/nfr-integrity-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-4-nfr-integrity-sample-050/T-KATA-WAVE-4-nfr-integrity-sample-050-20261123T125715Z-43e05c36/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/nfr-integrity-sample.md`
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
- 文書責務の単一性: 文書の中心主題と責務境界が一つに定まり、各章がその責務に直接寄与しているか。独立して参照・更新できる主題が複数あり、対象読者・利用時点が異なる、または別々の sample・recipe・template に対応する場合は分割を検討する。分量や対応する実践の型の数だけでは不備としない。同一主張の反復や正本の過剰な再掲は vp-arc-conciseness で判定し、この観点では扱わない。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[major/vp-po-purpose-alignment; line=5; anchor=`"本書は、データ正確性と改ざん防止を定義するための最小サンプルである。"`\]: `サンプルは抽象的なメタ記述のみを提供しており、菓子店管理システムのビジネス目的に沿った具体的な整合性の定義やスコープの境界を明確にできていません。`
- F002 \[major/vp-po-purpose-alignment; line=5; anchor=`"本書は、データ正確性と改ざん防止を定義するための最小サンプルである。"`\]: `目的には、共通サンプル文脈（駄菓子屋きぬや）の販売記録・在庫残高・つけ残高のうちどれの正確性を担保するかを、rulebook の「概要（対象・目的）」に沿って明記する必要がある。`
- F003 \[major/vp-po-decision-readiness; line=26; anchor=`"## 5. 未解決事項"`\]: `未解決の課題には、POが十分な情報に基づいた承認決定を行うために必要な意思決定者、影響範囲、および具体的な選択肢が不足しています。`
- F004 \[major/vp-pm-plan-feasibility; line=13; anchor=`"## 3. 記述内容"`\]: `ドキュメントには、タスクの分解と進捗管理に必要な、実行可能な作業単位、完了条件、および割り当てられたRoleコードが不足しています。`
- F005 \[major/vp-pm-dependency-risk; line=26; anchor=`"## 5. 未解決事項"`\]: `下流のテスト/受け入れ成果物への依存関係や、要件の延期に関連するスケジュールリスクが特定されていません。`
- F006 \[minor/vp-pm-control-reporting; line=26; anchor=`"## 5. 未解決事項"`\]: `未解決の課題には、割り当てられたRoleコードや、PJRまたは決定ログといった明確な転送先が欠けています。`
- F007 \[major/vp-ba-business-value; line=7; anchor=`"## 2. 入力情報"`\]: `ドキュメントには、菓子店運営におけるデータ整合性の失敗による具体的なビジネス上の問題、ステークホルダーの価値、またはビジネスへの影響が記載されていません。`
- F008 \[major/vp-ba-requirements-completeness; line=13; anchor=`"## 3. 記述内容"`\]: `要件、受け入れ基準、およびインスコープ/アウトオブスコープの境界が完全に省略されており、ハイレベルなトピックのプレースホルダーに置き換えられています。`
- F009 \[minor/vp-ba-stakeholder-clarity; line=13; anchor=`"## 3. 記述内容"`\]: `データ整合性の制約に関するステークホルダー、オペレーショナルユーザー、および合意当事者が特定されていません。`
- F010 \[major/vp-arc-technical-constraints; line=13; anchor=`"## 3. 記述内容"`\]: `技術的な制約、トランザクション境界、および監査ログの仕様が、具体的な技術詳細のないキーワードとしてのみリストされています。`
- F011 \[major/vp-arc-technical-constraints; line=15; anchor=`"- 主な内容: 整合性検証、監査証跡、トランザクション境界"`\]: `rulebook の禁止事項「監査証跡の保持基準を省略する」に該当するため、監査証跡の保持期間と必須項目（who/when/what）を明記する必要がある。`
- F012 \[minor/vp-arc-conciseness; line=18; anchor=`"## 4. 最小記述例"`\]: `セクション4の表は、独自の要件情報を提供することなく、セクション1とセクション3の記述を不必要に重複させています。`
- F013 \[major/vp-dev-implementation-readiness; line=13; anchor=`"## 3. 記述内容"`\]: `ドキュメントには、開発者が整合性コントロールを実装するための実装インプット、データスキーマの制約、または完了条件が提供されていません。`
- F014 \[minor/vp-dev-change-impact; line=13; anchor=`"## 3. 記述内容"`\]: `既存のデータベーススキーマ、トランザクション、およびオペレーショナルワークフローへの影響が特定されていません。`
- F015 \[major/vp-dev-testability; line=18; anchor=`"## 4. 最小記述例"`\]: `データ整合性を検証するための検証方法、テストコマンド、または期待されるテスト結果が指定されていません。`
- F016 \[major/vp-qe-verifiability; line=13; anchor=`"## 3. 記述内容"`\]: `完全性要件の具体的内容、指標、判定基準が記述されておらず、検証不能である。`
- F017 \[major/vp-qe-omissions-consistency; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `rulebook Section 5 で定義された必須の見出し構成（概要、適用範囲、要件一覧、検証方法、導線）が全て欠落している。`
- F018 \[minor/vp-qe-omissions-consistency; line=1; anchor=`"# [非機能要件 / 完全性](../rulebooks/nfr-integrity-rulebook.md) サンプル"`\]: ``rulebook の推奨 Frontmatter にある `part_of: nfr-index` を設定し、NFR 全体の入口との関係を示す必要がある。``
- F019 \[blocker/vp-qe-kata-conformance; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `rulebook 指定の必須見出し構成（## 1. 概要（対象・目的）〜 ## 5. 関連ドキュメント導線）を完全に無視した構成となっている。`
- F020 \[major/vp-qe-kata-conformance; line=4; anchor=`""`\]: `共通サンプル文脈（駄菓子屋きぬや）の業務データを使った完全性要件の完成例になっておらず、rulebook の禁止事項（検証方法なし・保持基準の省略）を避けた手本として機能していない。`
- F021 \[major/vp-ux-readability; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `ルールブックの標準構成と乖離した独自構成となっており, 正解例としての案内機能に欠けている。`
- F022 \[minor/vp-ux-language-consistency; line=1; anchor=`"# [非機能要件 / 完全性](../rulebooks/nfr-integrity-rulebook.md) サンプル"`\]: `H1 に rulebook への相対リンクを埋め込まず平文のタイトルとし、「完全性」「整合性」「正確性」の関係を rulebook の定義（正確性・整合性・改ざん耐性）に合わせて統一する必要がある。`
- F023 \[minor/vp-ops-release-readiness; line=26; anchor=`"## 5. 未解決事項"`\]: `ドキュメントをドラフトからreadyの状態に昇格させるために必要な条件と基準が定義されていません。`

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

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
