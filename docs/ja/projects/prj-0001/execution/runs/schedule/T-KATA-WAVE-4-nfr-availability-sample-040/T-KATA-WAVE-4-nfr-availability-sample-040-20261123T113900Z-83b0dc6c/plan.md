---
specdojo:
  id: prj-0001:xep-t-kata-wave-4-nfr-availability-sample-040-20261123t113900z-83b0dc6c
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-4-nfr-availability-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: rulebook-maintenance
  targets:
    - specdojo:nfr-availability-sample
    - specdojo:nfr-availability-rulebook
---

# Edit Plan: T-KATA-WAVE-4-nfr-availability-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 可用性要件の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、可用性要件の完成例を示す
- `path`: `docs/ja/specdojo/samples/nfr-availability-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-4-nfr-availability-sample-040/T-KATA-WAVE-4-nfr-availability-sample-040-20261123T113900Z-83b0dc6c/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/nfr-availability-rulebook.md`
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

- F001 \[minor/vp-po-purpose-alignment; line=9; anchor=`"- 可用性は稼働率、許容停止時間、RTO/RPO で定量的に定義する。"`\]: `「全体方針」に、基準値（稼働率・RTO/RPO）を業務停止の影響や重要業務時間帯の根拠文書から導出するという要件化の根拠を明記し、目的と基準値の対応を説明できるようにする。`
- F002 \[minor/vp-po-decision-readiness; line=79; anchor=``"- 表形式（`id` / `内容` / `指標` / `基準` / `備考`）で記述する。"``\]: `「可用性要件一覧」の記述ガイドに、基準値が初期仮説か確定値かの区別と、未確定時の明示方法を加え、PO が承認・保留を判断できるようにする。`
- F003 \[minor/vp-pm-plan-feasibility; line=67; anchor=`"- 可用性管理の目的と対象業務を記述する。"`\]: `記述ガイドの各章（特に 6.1 概要・6.2 適用範囲・6.4 測定・検証方法・6.5 関連ドキュメント導線）が1項目のみで、各必須章3項目以上という標準を満たさず、作成時の完了条件が判断しにくいため具体項目を補う。`
- F004 \[minor/vp-pm-dependency-risk; line=73; anchor=`"- 対象時間帯、計画停止、外部依存停止時の扱いを明記する。"`\]: `「適用範囲・除外条件」の記述ガイドに、外部依存サービスの SLA と自システムの基準値との整合確認、および整合しない場合をリスク・未決事項として扱う指示を加える。`
- F005 \[minor/vp-ba-business-value; line=79; anchor=``"- 表形式（`id` / `内容` / `指標` / `基準` / `備考`）で記述する。"``\]: `「可用性要件一覧」で、要件ごとに対象業務と停止時の業務影響（または根拠文書）を記述する列か指示を加え、基準値の業務価値を説明できるようにする。`
- F006 \[minor/vp-ba-requirements-completeness; line=79; anchor=``"- 表形式（`id` / `内容` / `指標` / `基準` / `備考`）で記述する。"``\]: `「可用性要件一覧」で、要件の対象範囲（システム／機能／コンポーネント）と、基準値の単位・比較方向（以上／以内）の明記を必須とする。`
- F007 \[minor/vp-ba-stakeholder-clarity; line=67; anchor=`"- 可用性管理の目的と対象業務を記述する。"`\]: `「概要（対象・目的）」の記述ガイドに、基準値の合意者と復旧判断を担う運用者を Role code で示す指示を加え、sample の必須観点「責任者」と整合させる。`
- F008 \[minor/vp-arc-technical-constraints; line=86; anchor=`"- 要件IDごとに、監視値・障害訓練・復旧試験による測定方法と判定時期を定める。"`\]: ``「測定・検証方法」または「可用性要件一覧」に、基準値を支える技術前提（冗長化・バックアップ・監視基盤）と、対応する設計文書・`dec-*` の明記を求める指示を加える。``
- F009 \[minor/vp-dev-implementation-readiness; line=104; anchor=``"注：形式の輪郭を示す最小例。成果物の見出しは `## 1...` から始まる。"``\]: `「サンプル」章の最小例が Frontmatter 以外をコードブロック外の H3・表で記述しており、rulebook 本文の章と生成物の例が混在するため、最小例全体を1つの自己完結したコードブロックにまとめる。`
- F010 \[minor/vp-dev-change-impact; line=18; anchor=``"- `nfr-index`：NFR全体の入口"``\]: ``「位置づけ」に、可用性要件の基準値を変更した場合に `sac-*` / `stc-*` / `opr-*` の判定基準・手順を見直す必要があることを明記する。``
- F011 \[minor/vp-qe-verifiability; line=86; anchor=`"- 要件IDごとに、監視値・障害訓練・復旧試験による測定方法と判定時期を定める。"`\]: `「測定・検証方法」に、稼働率の算出式（対象時間・除外時間の扱い）、測定期間、RTO/RPO の起点と終点の定義を求め、pass / fail を一意に判定できるようにする。`
- F012 \[major/vp-qe-omissions-consistency; line=102; anchor=`"## 8. サンプル"`\]: `「サンプル」章が rulebook-authoring-standard の「最小例をコードブロックで自己完結して埋め込む」規定に反し、かつ例の文脈が GCS 基幹システムで宣言 sample の駄菓子屋文脈と矛盾するため、共通サンプル文脈に揃えた最小例をコードブロックにまとめる。`
- F013 \[major/vp-qe-kata-conformance; line=1; anchor=`"# 非機能要件 / 可用性 作成ルール"`\]: `参照サンプル specdojo:nfr-availability-sample が、Section 5 で定義した必須の見出し構成に準拠していない。`
- F014 \[minor/vp-qe-kata-conformance; line=1; anchor=`"# 非機能要件 / 可用性 作成ルール"`\]: ``Frontmatter の `recipe` / `template` が `undecided` のままで Kata 相互の対応が定まっていないため、作成予定か不要かを決めて宣言する。``
- F015 \[minor/vp-ux-readability; line=27; anchor=`"| RTO    | 目標復旧時間                           |"`\]: `用語定義の RTO「目標復旧時間」・RPO「目標復旧時点」が起点・意味を示さず初見で解釈がぶれるため、「障害発生（または検知）から復旧までの目標時間」「復旧時に許容するデータ損失の時点」のように定義を補う。`
- F016 \[minor/vp-ux-language-consistency; line=86; anchor=`"- 要件IDごとに、監視値・障害訓練・復旧試験による測定方法と判定時期を定める。"`\]: ``「判定時期」と「判定タイミング」、「計画メンテ」と「計画停止」、列名 `id` と「要件ID」の表記ゆれを統一する。``
- F017 \[minor/vp-ops-release-readiness; line=1; anchor=`"# 非機能要件 / 可用性 作成ルール"`\]: `ready 化の前提となる sample の構成準拠と recipe/template の宣言が未解決のため、これらを解消してから ready 化を判断する。`

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
