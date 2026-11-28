---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-opr-support-sample-050-20261123t182405z-ad9ea488
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-opr-support-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: fully-guided
  targets:
    - specdojo:opr-support-sample
---

# Edit Plan: T-KATA-WAVE-5-opr-support-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 対象成果物

- `name`: 運用手順（問い合わせ一次対応）の完成例
- `depends_on`:
  - [[specdojo:opd-index-sample]]
  - [[specdojo:opr-sample]]
- `based_on`（対象成果物の frontmatter）: [[opd-index]]
- 個票の `入力`: なし
- `overview`: 駄菓子屋の販売管理システムを題材に、問い合わせ一次対応の運用手順の完成例を示す
- `path`: `docs/ja/specdojo/samples/opr-support-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-opr-support-sample-050/T-KATA-WAVE-5-opr-support-sample-050-20261123T182405Z-ad9ea488/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **OPS（Operations / Release Manager）**
- 責務: 文書群とツールのリリース・公開・配布・変更管理を担う。公開可否の最終判断は PO に残し、実行主体は pm-members.yaml で管理する。

このロールが重視するレビュー観点:

- リリース・公開準備: 公開、配布、ready 化、リリース判断に必要な前提や未解決事項が明示されているか。
- 運用しやすさ: 継続更新、再生成、変更管理、問い合わせ対応、障害時対応に必要な情報が読み取れるか。
- agent 委任境界: agent に最終承認、公開可否判断、説明責任を委ねる記述になっていないか。

## 4. 進め方

fully-guided は既存成果物の磨き込み専用である。雛形からの下書きや、調査して新しい値を選ぶ作業は draft で行う。対象成果物が未作成、または文脈だけの状態なら、下書きが必要なことを result に記録し、draft へ申し送る。

成果物内に `_CONTEXT_:` が残っている場合は、その指示を本文へ反映・削除せず、元の指示、未反映の箇所、必要な下書きを論点として result の `進め方と実践の型の適用` セクションに残し、draft へ申し送る。executor / reporter pipeline では報告の `handoff` に記載し、reporter と runner が result へ転記する。

対象成果物に必要と宣言された rulebook / recipe / sample は、指定されたファイルを実際に読み込んだうえで、次の役割に沿って参照する。読み込まずに記憶や推測で代替しない。

参照ファイル（成果物カタログの rulebook ID と rulebook frontmatter から解決。`_MISSING_` は `undecided`、`not-needed`、未整備、または `kind: generated` による非適用を表す。fully-guided では通常 `not-needed` の項目だけが該当する）:

- rulebook: `docs/ja/specdojo/rulebooks/opr-rulebook.md`
- 併せて適用する rulebook（記法など）: _MISSING_
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/opr-sample.md`

1. rulebook: `_MISSING_` でなければ指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. 併せて適用する rulebook: `_MISSING_` でない場合は各ファイルを読み込み、記法など主 rulebook が委譲したルールに従う。主 rulebook と矛盾する場合は主 rulebook を正とする。
3. recipe: `_MISSING_` でなければ指定された recipe を読み込み、示された問い・観点・深掘り手順に沿って内容を組み立てる。
4. sample: `_MISSING_` でなければ指定された sample を読み込み、rulebook の要求を満たす完成例の形式（章・表・記述の粒度）を確認する。sample は形式の参照に限って使い、sample の業務内容・固有名詞・値を対象成果物へ転記しない。

磨き込みでは template は読み込まない。粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる。sample は既存の対象成果物に該当する記述が無い箇所や、rulebook の要求を形式に落とす方法が判断できない箇所の参考に限る。既存の対象成果物と sample の形式が異なる場合は、rulebook の許容範囲内である限り既存の対象成果物を優先する。書き方が複数の文書間で矛盾する場合は rulebook を正とする。

### grade result から展開された finding

- F001 \[major/vp-po-purpose-alignment; line=12; anchor=``"- 障害疑いは `opr-incident` へ（P判定を付与）"``; cause=document\]: `文書には目的、範囲、および運用の必要性に関する明確な記述が不足しているため、プロジェクトの目的との整合性を評価することが不可能です。`
- F002 \[minor/vp-po-decision-readiness; line=12; anchor=``"- 障害疑いは `opr-incident` へ（P判定を付与）"``; cause=document\]: `サンプルには、前提条件やPOの承認待ち事項を詳述した、オープンな課題または意思決定準備状況のセクションが不足しています。`
- F003 \[major/vp-pm-plan-feasibility; line=10; anchor=`"- 受付→再現条件→影響→暫定回避→引継ぎ要否"`; cause=document\]: `手順には、作業計画や実現可能性の推定に必要な責任役割コード、条件を含むステップごとの順序、および完了基準が不足しています。`
- F004 \[minor/vp-pm-dependency-risk; line=12; anchor=``"- 障害疑いは `opr-incident` へ（P判定を付与）"``; cause=document\]: `運用のリスク、および後続の成果物やプロジェクトレジスターに対する明示的な依存関係の影響が特定されていません。`
- F005 \[minor/vp-pm-control-reporting; line=12; anchor=``"- 障害疑いは `opr-incident` へ（P判定を付与）"``; cause=document\]: `文書では、報告先が分離されておらず、プロジェクト管理レジスターに記録および追跡されるべき項目も指定されていません。`
- F006 \[major/vp-ba-business-value; line=12; anchor=``"- 障害疑いは `opr-incident` へ（P判定を付与）"``; cause=document\]: `文書では、サポート手順のビジネス上の課題、対象ユーザー、および期待されるビジネス価値や成功基準が明確に述べられていません。`
- F007 \[major/vp-ba-requirements-completeness; line=7; anchor=`"- 分類:"`; cause=document\]: `受付可能な問い合わせの範囲、除外事項、営業時間、および受け入れ基準が完全に省略されています。`
- F008 \[major/vp-ba-stakeholder-clarity; line=10; anchor=`"- 受付→再現条件→影響→暫定回避→引継ぎ要否"`; cause=document\]: `問い合わせの提出者、一次ラインのオペレーター、およびエスカレーションのレビュアーを含むステークホルダーが明確に特定されていません。`
- F009 \[minor/vp-arc-technical-constraints; line=7; anchor=`"- 分類:"`; cause=document\]: `問い合わせ対応に使用される技術的な制約や支援ツール（例：チケッティングシステム、コミュニケーションプラットフォーム）が定義されていない。`
- F010 \[major/vp-dev-implementation-readiness; line=10; anchor=`"- 受付→再現条件→影響→暫定回避→引継ぎ要否"`; cause=document\]: `手順には、具体的な問い合わせ受付フィールド、回答テンプレート、または実行可能な実装の詳細がなく、抽象的な段階のみが示されています。`
- F011 \[minor/vp-dev-change-impact; line=12; anchor=``"- 障害疑いは `opr-incident` へ（P判定を付与）"``; cause=document\]: `手順の変更が関連する運用のランブックやチケッティングワークフローに与える影響が文書化されていません。`
- F012 \[minor/vp-dev-testability; line=10; anchor=`"- 受付→再現条件→影響→暫定回避→引継ぎ要否"`; cause=document\]: `文書には、問い合わせ対応プロセスを検証するための検証ステップ、シミュレーションチェック、または受け入れテストが含まれていません。`
- F013 \[major/vp-qe-verifiability; line=12; anchor=``"- 障害疑いは `opr-incident` へ（P判定を付与）"``; cause=document\]: `優先度の決定ルールと一時的な解決の成功基準に、測定可能で合否判定可能な条件が欠けています。`
- F014 \[blocker/vp-qe-omissions-consistency; line=5; anchor=`"## 1. 問い合わせ一次対応手順（テンプレ・ナレッジ）"`; cause=document\]: `` `opr-rulebook` 第 5 章で定義されている必須章がほぼすべて欠落しており、かつ省略理由の記載もないため、運用手順書の構成として不成立である。 ``
- F015 \[major/vp-qe-omissions-consistency; line=12; anchor=``"- 障害疑いは `opr-incident` へ（P判定を付与）"``; cause=document\]: ``証跡章（保存先・保管期間・参照権限・`ticket_id` 等の識別子）がなく rulebook 禁止事項「証跡要件を未定義にする」に抵触し、関連ドキュメント導線に必須の `opd-index` 参照もないため追加が必要である。``
- F016 \[major/vp-qe-kata-conformance; line=1; anchor=`"# 運用手順: 問い合わせ一次対応 サンプル"`; cause=document\]: ``Frontmatter の `rulebook` が `specdojo:opd-rulebook` となっており、手順書であるため `specdojo:opr-rulebook` とすべきである。``
- F017 \[major/vp-qe-kata-conformance; line=5; anchor=`"## 1. 問い合わせ一次対応手順（テンプレ・ナレッジ）"`; cause=document\]: ``見出し番号が `## 1` となっているが、ルールおよびテンプレートの定義に従い `## 10` とすべきである。``
- F018 \[major/vp-qe-kata-conformance; line=11; anchor=`"- 引き継ぎ条件:"`; cause=document\]: ``rulebook の記述ガイドが求めるナレッジ参照先と開発・業務・運用それぞれへの引き継ぎ条件が欠け、障害疑い→`opr-incident` の1件のみのため、問い合わせ一次対応章の完成例として不足しており追記が必要である。``
- F019 \[major/vp-ux-readability; line=5; anchor=`"## 1. 問い合わせ一次対応手順（テンプレ・ナレッジ）"`; cause=document\]: ``必須構成を大幅に省略しているため、`opr-＜term＞` 文書を正しく作成するためのサンプルとしての役割（完成形の提示）を果たせておらず、不十分である。``
- F020 \[major/vp-ux-readability; line=1; anchor=`"# 運用手順: 問い合わせ一次対応 サンプル"`; cause=document\]: `共通サンプル文脈（駄菓子屋きぬや 販売管理システム）や対象システム・問い合わせ者が一切示されず、読者が手順の適用場面を読み取れないため、概要で文脈を明示する必要がある。`
- F021 \[minor/vp-ux-language-consistency; line=12; anchor=``"- 障害疑いは `opr-incident` へ（P判定を付与）"``; cause=document\]: `略語「P判定」が定義や標準的なインシデント優先順位の用語との整合性なしに使用されており、標準的な役割コードも不足しています。`
- F022 \[minor/vp-ux-language-consistency; line=10; anchor=`"- 受付→再現条件→影響→暫定回避→引継ぎ要否"`; cause=document\]: `「引継ぎ要否」（10行目）と「引き継ぎ条件」（11行目）で表記が揺れているため、rulebook と同じ「引き継ぎ」に統一する必要がある。`
- F023 \[minor/vp-ops-release-readiness; line=5; anchor=`"## 1. 問い合わせ一次対応手順（テンプレ・ナレッジ）"`; cause=document\]: `サンプルはドラフト状態のままであり、readyに進めるための基準や保留タスクが指定されていません。`
- F024 \[major/vp-ops-operability; line=10; anchor=`"- 受付→再現条件→影響→暫定回避→引継ぎ要否"`; cause=document\]: `ランブックには、ログのリポジトリ、監査証跡、ナレッジベースの更新フロー、および責任を持つ運用チームなどの不可欠な運用情報が不足しています。`

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

- 目的と範囲を示し、条件で分かれる手順と完了の基準を書いていること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [QE] rulebook の章立てと必須の表に沿っていること
- [QE] Sample 記述標準と共通サンプル文脈（駄菓子屋のプロジェクト）に沿っていること
- [QE] rulebook の禁止事項に当たらないこと
- [QE] Frontmatter の `rulebook` が opr-rulebook を指し、opr-rulebook が個別の手順に求める構成に沿っていること

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

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
