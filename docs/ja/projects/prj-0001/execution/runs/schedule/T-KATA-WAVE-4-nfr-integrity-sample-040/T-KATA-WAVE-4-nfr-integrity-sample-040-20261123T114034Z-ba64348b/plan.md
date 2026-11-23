---
specdojo:
  id: prj-0001:xep-t-kata-wave-4-nfr-integrity-sample-040-20261123t114034z-ba64348b
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-4-nfr-integrity-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: rulebook-maintenance
  targets:
    - specdojo:nfr-integrity-sample
    - specdojo:nfr-integrity-rulebook
---

# Edit Plan: T-KATA-WAVE-4-nfr-integrity-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: データ整合性要件の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、データ整合性要件の完成例を示す
- `path`: `docs/ja/specdojo/samples/nfr-integrity-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-4-nfr-integrity-sample-040/T-KATA-WAVE-4-nfr-integrity-sample-040-20261123T114034Z-ba64348b/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/nfr-integrity-rulebook.md`
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

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-pm-dependency-risk; line=43; anchor=`"- 改ざん防止・監査要件は運用/監査ポリシーとの整合を取る。"`\]: `改ざん防止・監査要件の整合先が「運用/監査ポリシー」とだけ書かれ、文書 ID が示されていない。改ざん耐性はセキュリティ系 NFR と範囲が重なりやすいため、責務の境界と依存先の文書を明記して、重複や抜けのリスクを識別できるようにする必要がある。`
- F002 \[minor/vp-ba-business-value; line=63; anchor=`"- どの業務データの正確性を担保するかを明記する。"`\]: `概要の記述ガイドが「どの業務データの正確性を担保するか」だけで、完全性が損なわれたときの業務影響や、重要記録を選ぶ基準を書くよう求めていない。そのため各要件と業務価値の対応を説明できない。影響と優先度の記述を求める必要がある。`
- F003 \[minor/vp-ba-stakeholder-clarity; line=76; anchor=`"- 整合性チェック、監査レビュー、試験で判定する。"`\]: `測定・検証方法のガイドが判定者・確認者の記述を求めていない。例（本文 130 行目以降）の判定者も DBA / SRE / QA という職種名で、Role code ではない。判定者の列を必須にし、メンバー定義の Role code で書くよう定める必要がある。`
- F004 \[minor/vp-arc-conciseness; line=90; anchor=`"## 8. サンプル"`\]: ``「サンプル」の章が Frontmatter で宣言した sample と役割を重複して持っている。5 章分の完成例は `specdojo:nfr-integrity-sample` へ移し、rulebook からは削るか、sample 側へ委ねる形にまとめる必要がある。``
- F005 \[minor/vp-dev-implementation-readiness; line=25; anchor=``"- 生成対象ドキュメントIDは `nfr-integrity` を推奨する。"``\]: ``生成する文書の ID に `nfr-integrity` を推奨しているが、プロジェクト成果物の ID は `＜project-id＞:nfr-integrity` のように project 修飾にする必要がある。このままでは ID の一意性や wikilink の解決を損なう。``
- F006 \[minor/vp-qe-verifiability; line=76; anchor=`"- 整合性チェック、監査レビュー、試験で判定する。"`\]: `測定・検証方法のガイドが判定のタイミング・判定者・合否条件を必須にしておらず、要件表の「基準」を数値・単位・期間で書くよう求める規定もない。pass / fail を判定できない記述を防げない。`
- F007 \[minor/vp-qe-omissions-consistency; line=67; anchor=`"- 対象データ、整合性境界、例外条件を記述する。"`\]: `禁止事項で監査証跡の保持基準の省略を禁じているのに、適用範囲・前提条件と要件一覧のガイドに保持期間を書く項目がない。禁止事項に対応する書き方の指示を加える必要がある。`
- F008 \[minor/vp-qe-omissions-consistency; line=34; anchor=`"| 項目       | 説明                              | 必須 |"`\]: ``Frontmatter の表に `status` がなく、例の YAML（`status: draft`）や良い実例の項目と一致していない。``
- F009 \[minor/vp-qe-omissions-consistency; line=125; anchor=`"| nfr-int-004 | 金額データの改ざんを検知できること     | 改ざん検知漏れ率 | 0%      | HMAC / デジタル署名        |"`\]: ``例の要件 ID が `nfr-int-001, 002, 004, 006` と飛んでおり、本文 26 行目の「`nfr-int-＜連番＞`」の規定と矛盾する。``
- F010 \[major/vp-qe-kata-conformance; line=2; anchor=`""`\]: `指定されたサンプルの構成が本ルールの必須見出し構成（5章）に準拠していない。`
- F011 \[minor/vp-qe-kata-conformance; line=107; anchor=`"本書は、GCS 基幹システムの受注・在庫・会計データについて、正確性と監査対応の追跡可能性を担保する完全性要件を定義する。"`\]: `rulebook の中の例が「GCS 基幹システム」を題材にしており、共通サンプル文脈（駄菓子屋）と一致していない。sample と同じ文脈にそろえるか、例を sample へ移す必要がある。`
- F012 \[minor/vp-qe-kata-conformance; line=1; anchor=`"# 非機能要件 / 完全性 作成ルール"`\]: ``Frontmatter の `recipe` / `template` が `undecided` のままで、Kata の rulebook / recipe / sample / template の対応関係が定まっていない。``
- F013 \[minor/vp-ux-language-consistency; line=130; anchor=`"| 要件ID      | 測定方法                                   | 判定タイミング   | 判定者    |"`\]: `例の判定者が DBA / SRE / QA という職種名で、Role code と統一されていない。また「整合性チェック」（本文 76 行目）と「日次整合チェック」（本文 123・132 行目）で呼び名が揺れている。`
- F014 \[minor/vp-ops-release-readiness; line=1; anchor=`"# 非機能要件 / 完全性 作成ルール"`\]: `` `recipe` / `template` が `undecided`、sample の構成が不一致という ready 前の未解決事項が明示されておらず、ready にする前提条件を判断できない。 ``

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

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
