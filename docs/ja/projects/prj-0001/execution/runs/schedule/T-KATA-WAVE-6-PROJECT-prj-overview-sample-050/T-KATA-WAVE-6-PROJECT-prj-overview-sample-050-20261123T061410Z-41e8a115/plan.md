---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-project-prj-overview-sample-050-20261123t061410z-41e8a115
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-PROJECT-prj-overview-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PO
  approach: sample-maintenance
  targets:
    - specdojo:prj-overview-sample
    - specdojo:prj-overview-sample
---

# Edit Plan: T-KATA-WAVE-6-PROJECT-prj-overview-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: プロジェクト概要の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、プロジェクト概要の完成例を示す
- `path`: `docs/ja/specdojo/samples/prj-overview-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-PROJECT-prj-overview-sample-050/T-KATA-WAVE-6-PROJECT-prj-overview-sample-050-20261123T061410Z-41e8a115/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/prj-overview-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **PO（Project Owner）**
- 責務: 公開可能な SpecDojo 文書基盤としての目的・スコープ・優先順位・公開方針を最終判断する。

このロールが重視するレビュー観点:

- 目的・スコープとの整合: 成果物の主要な定義・判断が、プロジェクト目的、スコープ、優先順位、公開方針と矛盾せず、成果物固有の目的または上位文書への参照から必要性を説明できるか。対応する目的・成果のない手段を目的として扱っていないか。
- 承認判断に必要な情報: PO が承認、保留、差し戻しを判断するための論点、未決事項、影響範囲が明示されているか。文書の役割の割り当てと承認の進み具合は登録簿で追うため、本文に求めない。
- 公開可否と説明責任: 公開してよい情報だけで構成され、最終判断と説明責任を人間の PO が担う前提になっているか。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-decision-readiness; line=20; anchor=`"とりわけ繁忙期は来店と取引が集中し、欠品・在庫・つけの確認負荷が一気に高まる。記憶と紙の運用のままでは繁忙期の負荷に対応しきれず、損失と属人化のリスクが顕在化するため、負荷が高まる前のこの時期に着手する必要がある。"`\]: `The busy season and "this period" are not given as a concrete time (for example, a month or a school-holiday period), so the deadline behind "why now" is unclear. State when the busy season falls and what point the work must be done by.`
- F002 \[minor/vp-pm-dependency-risk; line=41; anchor=`"下記の目標値は初期仮説であり、実測値に基づき継続的に見直す。欠品回数と在庫の無駄は、運用開始前1か月の実績をベースラインとする。季節、仕入れ条件、来店数などの影響も記録し、改善を本システムだけの成果とは断定せず寄与として評価する。"`\]: ``The text says the targets are initial hypotheses but not which document confirms them. Name `prj-success-criteria-and-acceptance-criteria` as the hand-off target, as rulebook Section 6.7 requires.``
- F003 \[minor/vp-ba-business-value; line=11; anchor=`"- 人気商品（うまい棒、ラムネ等）の欠品が増えている"`\]: `The Background problems (more stockouts, uneven stock, missed credit records) give no frequency, count or impact, so the size of the problem and the basis for the targets are weak. Add rough figures such as stockouts per month, or label the statements as observations or hypotheses.`
- F004 \[minor/vp-arc-conciseness; line=39; anchor=`"初期リリース前は、店主代表と家族利用者代表が店頭販売、在庫確認、つけ残高確認を迷わず完了できるかを確認する。リリース後の短期は日々の記録が無理なく定着するか、中長期は記録の活用が欠品、在庫の無駄、属人化の軽減と店舗運営の継続に寄与したかを確認する。"`\]: `The opening paragraph of Expected Effects repeats the checks for each time horizon that the lead sentences of 5.1–5.3 already state. Keep only the paragraph on baselines and contribution, and leave the per-horizon checks to the subsections.`
- F005 \[minor/vp-qe-verifiability; line=70; anchor=`"| 在庫適正化 | 廃棄・値引き・長期滞留による在庫の無駄                           | 年間20%削減           | 廃棄、値引き、長期滞留の数量と金額を月次で集計する             |"`\]: `"20% reduction per year" cannot be compared directly with the one-month pre-launch baseline, and the decision timing for the medium- to long-term indicators is not stated. Add how the baseline is converted and when the result is judged, for example 12 months after launch.`
- F006 \[minor/vp-qe-omissions-consistency; line=78; anchor=`"本プロジェクトの策定および活用にあたっては、以下を前提とする。"`\]: `The Preconditions do not separate fixed premises from dependencies and do not state the publication policy or the AI Agent role (or that it does not apply). Fill these in so the sample meets every item in rulebook Section 6.8.`
- F007 \[minor/vp-qe-kata-conformance; line=57; anchor=`"| 観点     | 指標                                                             | 初期目標              | 測定方法                                                   |"`\]: `The short-term table header "初期目標" in the sample (and template) does not match "目標" in the rulebook Section 6.7 recommended table. Align the Kata on one column name.`
- F008 \[minor/vp-ux-language-consistency; line=45; anchor=`"初期リリース前には、実際に店番を行う利用者が主要操作を完遂できるかを確認する。機能数ではなく、一連の業務を止まらずに終えられることを判定する。"`\]: `The heading "初期公開指標" and the text "初期リリース前" mix two names for the same time horizon. Use one term, such as "初期公開", consistently in headings and text.`

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
