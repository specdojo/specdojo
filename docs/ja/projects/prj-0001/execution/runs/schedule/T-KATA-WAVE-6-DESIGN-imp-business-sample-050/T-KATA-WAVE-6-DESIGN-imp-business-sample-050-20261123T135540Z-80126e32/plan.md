---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-design-imp-business-sample-050-20261123t135540z-80126e32
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-DESIGN-imp-business-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: sample-maintenance
  targets:
    - specdojo:imp-business-sample
    - specdojo:imp-business-sample
---

# Edit Plan: T-KATA-WAVE-6-DESIGN-imp-business-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 業務への影響調査の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、業務への影響調査の完成例を示す
- `path`: `docs/ja/specdojo/samples/imp-business-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-DESIGN-imp-business-sample-050/T-KATA-WAVE-6-DESIGN-imp-business-sample-050-20261123T135540Z-80126e32/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/imp-business-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **BA（Business Analyst）**
- 責務: 仕様を書く人と読む人の利用者視点から、文書体系への要求、利用場面、受入条件を整理する。

このロールが重視するレビュー観点:

- 業務価値との対応: 主要な定義・判断がどの対象者のどの業務課題・期待価値に応えるかを説明でき、主要な成果・方針がその目的に対応しているか。
- 要件・受入条件の充足: 要件、受入条件、対象範囲、対象外が利用者視点で確認できる粒度になっているか。
- 関係者・利用場面の明確性: 関係者、利用場面、合意対象が読み取れるか。文書を確かめる・承認する役割の割り当ては本文に求めない。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-purpose-alignment; line=41; anchor=`"| 高     | 店頭販売の新手順適用       | 2026-05-15 まで | 業務設計担当（佐藤）       | レジ担当 3 名の訓練日程確保      |"`\]: `前提条件「レジ担当 3 名の訓練日程確保」は、店主一人での運用を前提とする共通サンプル文脈・プロジェクト概要と矛盾するため、店主代表と家族利用者代表による店番体制に合わせて書き直す必要がある。`
- F002 \[minor/vp-po-decision-readiness; line=50; anchor=`"| 論点                     | 不足情報                   | 決定期限   | 担当                 | 処理方針                                                   |"`\]: `未解決事項の表に、rulebook が求める「判断・対応への影響」（どの影響対象業務・対応項目の判断を左右するか）の列がなく、未決のままの場合に何が止まるか判断できないため、影響の列を追加する必要がある。`
- F003 \[minor/vp-pm-plan-feasibility; line=39; anchor=`"| 優先度 | 対応項目                   | 実施時期        | 担当                       | 前提条件                         |"`\]: `対応方針の担当が Role code ではなく独自の役割名と人物名で書かれ、完了条件もないため、Schedule の owner に使える Role code と各項目の完了条件を記載する必要がある。`
- F004 \[minor/vp-pm-dependency-risk; line=42; anchor=`"| 高     | 日次締め確認項目の更新     | 2026-05-20 まで | 運用管理担当（田中）       | 値引き内訳レポート定義の確定     |"`\]: `日次締めの前提条件「値引き内訳レポート定義の確定」が未解決事項に登録されておらず、値引き例外ルールの確定と各対応項目の依存関係も示されていないため、スケジュールへの影響が追えない。`
- F005 \[minor/vp-ba-business-value; line=14; anchor=`"- 成功条件: 平日 16:00-18:00 の 1 会計あたり平均処理時間を 90 秒以内にする。"`\]: `成功条件「1 会計あたり平均処理時間を 90 秒以内」に現状値（ベースライン）と測定方法がなく、期待価値の大きさと達成判定ができないため、現状値と計測方法を併記する必要がある。`
- F006 \[minor/vp-ba-stakeholder-clarity; line=41; anchor=`"| 高     | 店頭販売の新手順適用       | 2026-05-15 まで | 業務設計担当（佐藤）       | レジ担当 3 名の訓練日程確保      |"`\]: `担当に共通登場人物にない役割（業務設計担当、運用管理担当、店舗運用担当、プロジェクト管理者、業務責任者）が使われ、駄菓子屋きぬやの誰が確認・合意するか読み取れないため、共通登場人物の役割名へ置き換える必要がある。`
- F007 \[minor/vp-arc-technical-constraints; line=12; anchor=`"- 要求内容: バーコード読取による会計時間短縮と、キャンペーン値引き適用の業務ルール追加。"`\]: `バーコード読取の前提（タブレット 1 台で読み取るか、読取機器を追加するか）が示されず、店頭販売の手順変更や訓練の前提が判断できないため、業務運用上の前提を記載する必要がある。`
- F008 \[minor/vp-dev-change-impact; line=30; anchor=`"| 影響対象業務 | 変更要否 | 影響度 | 対応方針 | 判断根拠                                                                                                                 | 備考                                             |"`\]: `rulebook がプロセス・データ・テスト仕様への波及について概要と判断を求めているのに、商品コード登録・値引き内訳・売上集計項目の追加がどの関連仕様に波及するかが示されていないため、備考などに波及先を記載する必要がある。`
- F009 \[minor/vp-qe-verifiability; line=20; anchor=`"| 影響度 | 件数 | 主な対象業務       | 優先対応 |"`\]: `影響度の高・中・低を分ける条件がなく、影響詳細一覧の各業務に付けた影響度の妥当性を検証できないため、評価観点ごとの判定条件と集約方法を定義する必要がある。`
- F010 \[minor/vp-qe-omissions-consistency; line=20; anchor=`"| 影響度 | 件数 | 主な対象業務       | 優先対応 |"`\]: `影響度（高・中・低）の判定尺度（基準）が定義されておらず、rulebook の禁止事項に抵触している。`
- F011 \[minor/vp-qe-omissions-consistency; line=50; anchor=`"| 論点                     | 不足情報                   | 決定期限   | 担当                 | 処理方針                                                   |"`\]: `未解決事項に rulebook の記述ガイドが求める「判断・対応への影響」の記載がなく、必須の記載項目が欠けている。`
- F012 \[minor/vp-qe-kata-conformance; line=20; anchor=`"| 影響度 | 件数 | 主な対象業務       | 優先対応 |"`\]: `影響度の尺度定義を必須とする rulebook の禁止事項に従っていない。`
- F013 \[major/vp-qe-kata-conformance; line=41; anchor=`"| 高     | 店頭販売の新手順適用       | 2026-05-15 まで | 業務設計担当（佐藤）       | レジ担当 3 名の訓練日程確保      |"`\]: `担当欄に共通サンプル文脈にない人物名（佐藤・田中・山本・中村・高橋）と未定義の役割名を使っており、共通登場人物の役割名・nickname・Role code で記述するという sample-authoring-standard の規約に反しているため、置き換える必要がある。`
- F014 \[minor/vp-qe-kata-conformance; line=41; anchor=`"| 高     | 店頭販売の新手順適用       | 2026-05-15 まで | 業務設計担当（佐藤）       | レジ担当 3 名の訓練日程確保      |"`\]: `「レジ担当 3 名」は、店主一人で運用し運用体制を大きく変えないという共通サンプル文脈の前提と矛盾するため、共通の前提に合わせて書き直す必要がある。`
- F015 \[minor/vp-ux-language-consistency; line=6; anchor=`"対象は「店頭販売」「在庫補充」「日次締め」「ツケ管理」の 4 業務とし、判断対象期間は 2026-05-01 から 2026-07-31 とする。"`\]: `業務名「ツケ管理」が共通サンプル文脈・関連 sample の「つけ管理」と表記ゆれしており、また担当欄で役割名と人物名の組み合わせと「店主代表」だけの表記が混在しているため、どちらも統一する必要がある。`
- F016 \[minor/vp-ops-release-readiness; line=20; anchor=`"| 影響度 | 件数 | 主な対象業務       | 優先対応 |"`\]: `影響度の尺度が未定義で rulebook の禁止事項に抵触したままのため、sample を ready にする前に尺度の定義を追加する必要がある。`

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
