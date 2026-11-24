---
specdojo:
  id: prj-0001:xep-t-kata-wave-4-nfr-operations-sample-040-20261123t115622z-9c570a24
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-4-nfr-operations-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: rulebook-maintenance
  targets:
    - specdojo:nfr-operations-sample
    - specdojo:nfr-operations-rulebook
---

# Edit Plan: T-KATA-WAVE-4-nfr-operations-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 運用要件の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、運用要件の完成例を示す
- `path`: `docs/ja/specdojo/samples/nfr-operations-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-4-nfr-operations-sample-040/T-KATA-WAVE-4-nfr-operations-sample-040-20261123T115622Z-9c570a24/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/nfr-operations-rulebook.md`
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

- F001 \[minor/vp-po-purpose-alignment; line=15; anchor=`"## 2. 位置づけ"`\]: ``位置づけ章が関連文書の名前を並べるだけで、`nfr-index` から見た `nfr-operations` の役割や、OPD/OPR・SAC との入出力関係（何を受け取り何を渡すか）を説明していないため、関係を1〜2文か図で補ってください。``
- F002 \[minor/vp-po-decision-readiness; line=1; anchor=`"# 非機能要件 / 運用 作成ルール"`\]: ``recipe・template が `undecided` のままの理由と判断の時期、sample 是正などの未決事項が本文に示されていないため、`_UNDECIDED_` / `_TODO_` ラベルで論点と次の判断を明記してください。``
- F003 \[minor/vp-pm-plan-feasibility; line=56; anchor=`"### 6.1. 概要（対象・目的）"`\]: `6.1 概要（対象・目的）と 6.2 適用範囲・体制前提の箇条書きがそれぞれ1項目だけで、authoring standard の「各必須章に最低3つ以上の具体項目」を満たさず、章ごとの完了条件を判断できないため、記載必須の項目（対象システム、対象外、運用時間帯、エスカレーション段数など）を補ってください。`
- F004 \[minor/vp-pm-dependency-risk; line=12; anchor=`"- OPR/OPD と接続して実行可能性を担保する。"`\]: `「OPR/OPD と接続して実行可能性を担保する」とあるが、どちらを先に作るか、OPR/OPD が未整備のときの扱い、基準値を変えたときに OPR/SAC へ反映する手順が書かれていないため、依存の向きと変更時の連携を明記してください。`
- F005 \[minor/vp-pm-control-reporting; line=69; anchor=`"### 6.4. 測定・検証方法"`\]: ``6.4 測定・検証方法で、判定結果が基準を満たさなかったときの記録先（課題登録簿、`dec-*`、`sac-*` のどれか）と担当 Role code が示されていないため、転記先を明記してください。``
- F006 \[minor/vp-ba-business-value; line=56; anchor=`"### 6.1. 概要（対象・目的）"`\]: `6.1 概要（対象・目的）で、運用要件が守る業務（例：営業時間中の販売継続）と、守れなかったときの業務影響を書くよう求めていないため、業務価値との対応を記述要件に加えてください。`
- F007 \[minor/vp-ba-requirements-completeness; line=64; anchor=`"### 6.3. 運用要件一覧"`\]: `導入文で運用を「監視、バックアップ、手順、体制」と定義しているのに、6.3 運用要件一覧でこの4領域を必ず扱うことや、対象外を明記することを求めていないため、網羅すべき領域と対象外の記載を必須として明記してください。`
- F008 \[minor/vp-ba-stakeholder-clarity; line=69; anchor=`"### 6.4. 測定・検証方法"`\]: `判定者や体制の記述に Role code を使う指定がなく、サンプルでも「SRE」「Ops」「PM」が混在しているため、適用先のメンバー定義の Role code で書くことを明記してください。`
- F009 \[minor/vp-arc-technical-constraints; line=104; anchor=`"### 8.2. 適用範囲・体制前提（例）"`\]: `サンプルの通知経路に PagerDuty・Slack という製品名が書かれているが、本書は「達成基準だけを記述する」（本文11行目）としており、製品の選定は OPD 側の責務と読めるため、要件に製品名を書いてよいかの境界を記述ガイドで明記するか、サンプルを手段に依存しない表現にしてください。`
- F010 \[minor/vp-arc-conciseness; line=85; anchor=`"## 8. サンプル"`\]: `8章サンプルは表4つを含む完成例に近い内容で、authoring standard の「形式の輪郭が伝わる最小例に限る」を超えているため、完成例は sample 側に置き、ここは列構成がわかる1〜2行の最小例へ絞ってください。`
- F011 \[minor/vp-dev-implementation-readiness; line=33; anchor=`"| 項目       | 説明                               | 必須 |"`\]: ``推奨 Frontmatter 表に必須の `status` がなく、`part_of` も表ではスカラー、サンプルでは配列と書き方が一致しないため、`status` 行を追加し、`part_of` の型をスキーマに合わせて統一してください。``
- F012 \[minor/vp-dev-change-impact; line=13; anchor=``"- 共通の運用: 役割の割り当ては適用先のメンバー定義に、`status` の昇格と承認、改訂と廃止、未決事項の登録簿への引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従い、本書と成果物で言い直さない。文書の整形・lint はリポジトリの検証で扱い、業務の受入確認に含めない。"``\]: ``共通の運用を document-metadata-standard に委ねているだけで、運用要件の基準値を変えたときに追従すべき `sac-*`・`opr-*`・`opd-*` と担当 Role code が定義されていないため、自系統の追従対象を明記してください。``
- F013 \[minor/vp-qe-verifiability; line=64; anchor=`"### 6.3. 運用要件一覧"`\]: `6.3 運用要件一覧の「基準」列に、数値・単位・集計期間（例：月次で 99.5% 以上）で書く要件がなく、pass / fail の判定基準が文書間でぶれるため、基準の記述形式を必須条件として明記してください。`
- F014 \[minor/vp-qe-omissions-consistency; line=40; anchor=`"## 5. 本文構成（標準テンプレ）"`\]: ``authoring standard の標準章構成では5章が「本文要件」で、`template: undecided` の系統は各章の目的と必須・任意を記載するとしているのに、本書は見出しと必須欄だけの「本文構成（標準テンプレ）」になっているため、各章の目的を付けて本文要件として整えてください。``
- F015 \[minor/vp-qe-omissions-consistency; line=119; anchor=`"| nfr-ops-005 | Runbook は全重要サービスに対して整備されていること | Runbook 網羅率 | 100%       | 重要サービス＝受注・在庫・会計 |"`\]: ``サンプルの要件 ID が nfr-ops-001・002・005 と飛んでおり、ID 規則「`nfr-ops-＜連番＞`」の例として誤解を招くため、連番にするか、欠番を許す運用ならその旨を明記してください。``
- F016 \[major/vp-qe-kata-conformance; line=1; anchor=`"# 非機能要件 / 運用 作成ルール"`\]: `参照サンプル specdojo:nfr-operations-sample の構成がルールブックで定義した標準テンプレ（第5節）に準拠しておらず、正しくない例となっている。`
- F017 \[minor/vp-qe-kata-conformance; line=85; anchor=`"## 8. サンプル"`\]: `サンプル章が見出しと表を本文に直接並べており、authoring standard の「最小例をコードブロックで本文内に自己完結して埋め込む」を満たさないため、コードブロック内に収めた最小例へ改めてください。`
- F018 \[minor/vp-qe-kata-conformance; line=102; anchor=`"本書は、GCS 基幹システムの運用要件を定義する。"`\]: `rulebook 内のサンプルが GCS 基幹システムを題材にしており、sample の駄菓子屋の販売管理システムという共通サンプル文脈と食い違うため、題材を共通サンプル文脈に揃えてください。`
- F019 \[minor/vp-ux-readability; line=17; anchor=``"- `nfr-operations`：運用要求の正本"``\]: ``位置づけ章の `nfr-index` と `opd-*` / `opr-*` の行で読む順序や利用場面が示されておらず、初見の読者が次に見る文書を判断しにくいため、利用場面（いつ参照するか）を補ってください。``
- F020 \[minor/vp-ux-language-consistency; line=11; anchor=`"- 運用手順そのものは OPR に置き、本書には満たすべき運用結果（達成基準）だけを記述する。"`\]: ``成果物の略称が「OPR/OPD」（本文11〜12行目）と `opd-*` / `opr-*`（本文19行目）で混在し、要件 ID の列名も `id`（6.3）と「要件ID」（8.4）でゆれているため、表記を統一してください。``
- F021 \[minor/vp-ops-release-readiness; line=1; anchor=`"# 非機能要件 / 運用 作成ルール"`\]: `ready 化の前提となる未解決事項（sample の構成是正、サンプル章のコードブロック化、recipe・template の要否判断）が本文に示されていないため、ready 条件として明記してください。`
- F022 \[minor/vp-ops-operability; line=69; anchor=`"### 6.4. 測定・検証方法"`\]: `6.4 で判定タイミングは求めているが、判定結果を受けて運用要件の基準値を見直す契機と担当 Role code を書く指針がないため、見直しの契機と責任者を記述要件に加えてください。`

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
