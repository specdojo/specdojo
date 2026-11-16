---
specdojo:
  id: prj-0001:xep-pjr-d948-20261115t165132z-1aedfa18
  type: exec-plan
  rulebook: none
  task_id: PJR-D948
  name: "bds の sample を grade の指摘で手直しする（kata-wave-2 の 2 回目）"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: UX
  approach: sample-maintenance
  targets:
    - specdojo:bds-sample
---

# Edit Plan: PJR-D948

## 1. このフェーズで行うこと

帳票の sample を最新の grade の指摘で直す

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 帳票仕様（週次進捗報告）
- `depends_on`:
  - [[bds-index]]
  - [[sysd-job-execution]]
- `overview`: routine が週ごとに作る進捗報告（reporting/progress-reports/）の利用目的・読み手・表示項目・出力の時期と、元にする記録を定義する
- `path`: `docs/ja/product/010-business-specs/040-user-interface-model/bds-progress-report.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-D948/pjr-d948-20261115T165132Z-1aedfa18/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/bds-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **UX（UX / Documentation Designer）**
- 責務: 仕様作成者が迷わず使える導線、説明、文書体験を担う。小規模運用では BA 観点と合わせて扱い、必要時に専任化を検討する。

このロールが重視するレビュー観点:

- 読みやすさ・理解しやすさ: 初見の読者が、成果物固有の目的または上位文書への参照、名称、メタデータから、なぜ扱うか、役割、利用先、対象、主要な判断、次に見る文書を理解できるか。主旨または主要な判断点を読み取れない箇所を特定できる場合は major とする。同一主張の反復や正本の過剰な再掲など冗長性の判定は vp-arc-conciseness で行い、この観点では扱わない。
- 利用者導線: 利用者や将来貢献者が迷わず必要情報へ到達できる構成になっているか。目次から必要な章を見つけられるか、関連成果物への参照が適切な位置にあるか、前提から結論への説明順序が守られているかのいずれかの基準に照らして判定し、情報を見失う箇所を具体的に特定できる場合のみ不備とする。
- 用語・表現の一貫性: 用語、Role code、成果物名、状態、ラベルが読み手を混乱させない形で統一されているか。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[major/vp-po-decision-readiness; line=88; anchor=``"| 根拠の業務イベント | 現金販売の確定は `based_on` に接続済みだが、つけ販売の確定と欠品の記録（`bes-stock-out-recorded`）の業務イベントは未同梱で接続していない。未接続の間は、つけ販売の数え方と欠品回数の境界を受入対象外とする | BA が業務イベントを作成した時点で `based_on` に接続し、QE が算出ルールとの整合を確かめる                                            |"``\]: `Specify whether PO must hold acceptance or explicitly approve a restricted scope while credit-sale and stockout boundaries remain unverified, and record the decision occasion, permitted use, and conditions for restoring full acceptance.`
- F002 \[major/vp-po-publication-accountability; line=33; anchor=`"- 提供方法: 店主代表がタブレットの報告一覧から開く。印刷した PDF は仕入れノートに綴じる。"`\]: `draft から公開可能な状態へ移す条件として、公開対象、機密・個人情報の有無、確認事項、人間の承認者を明記する必要がある。`
- F003 \[major/vp-pm-plan-feasibility; line=88; anchor=``"| 根拠の業務イベント | 現金販売の確定は `based_on` に接続済みだが、つけ販売の確定と欠品の記録（`bes-stock-out-recorded`）の業務イベントは未同梱で接続していない。未接続の間は、つけ販売の数え方と欠品回数の境界を受入対象外とする | BA が業務イベントを作成した時点で `based_on` に接続し、QE が算出ルールとの整合を確かめる                                            |"``\]: `記載項目の名称だけでなく、仕様確定に必要な作業単位、依存関係、担当 Role code、完了条件、判断タイミングを具体化する必要がある。`
- F004 \[major/vp-pm-dependency-risk; line=88; anchor=``"| 根拠の業務イベント | 現金販売の確定は `based_on` に接続済みだが、つけ販売の確定と欠品の記録（`bes-stock-out-recorded`）の業務イベントは未同梱で接続していない。未接続の間は、つけ販売の数え方と欠品回数の境界を受入対象外とする | BA が業務イベントを作成した時点で `based_on` に接続し、QE が算出ルールとの整合を確かめる                                            |"``\]: `参照先が特定できない handbook への依存を解消し、based_on による根拠仕様、後続成果物、未決事項の影響と PJR 登録候補を明記する必要がある。`
- F005 \[major/vp-pm-control-reporting; line=84; anchor=`"## 9. メモ / 将来課題"`\]: `未解決事項を課題・リスク・変更要求・決定待ちに分類し、PJR 転記要否、報告先、担当 Role code、対応方針を示す必要がある。`
- F006 \[major/vp-ba-requirements-completeness; line=79; anchor=`"| 期間内に販売記録が 1 件もない  | 報告を作り、明細なし・記録日数 0 と表示する            | 店主代表が休業か記録漏れかを確かめ、記録漏れなら開発担当へ知らせる   |"`\]: `The former placeholder has been replaced by a concrete report, but a week with no sales and recorded stockouts must still show the affected products, stockout counts, and replenishment flags; define this case instead of unconditionally requiring no detail rows.`
- F007 \[major/vp-ba-requirements-completeness; line=27; anchor=`"_ASSUMPTION_: 閉店処理は日曜に必ず行う前提とする。日曜が休業日の週は、直前の営業日の閉店処理完了を期間の終点とする。"`\]: `Define the automatic generation trigger when Sunday is closed and the expected period and output when the entire week is closed; changing the period end to the preceding closing event does not specify how these weeks produce a report.`
- F008 \[major/vp-arc-technical-constraints; line=43; anchor=`"| 販売記録   | 商品別の販売数を数える       | [[specdojo:cdsd-sample\\|概念データストア定義]] の販売記録。現金販売の確定は [[specdojo:bes-sample\\|業務イベント: 店頭の現金会計の確定]] | 記録がない営業日は「記録なし」と注記し、販売数 0 と区別する      |"`\]: `実装詳細には踏み込まず、出力形式、文字コード等の業務上必要な制約、外部依存、準拠 schema と検証方法を明記する必要がある。`
- F009 \[major/vp-dev-implementation-readiness; line=53; anchor=`"| 2   | 見出し | 記録日数       | 期間内で販売記録がある営業日の数                  | 販売記録           | 販売記録がある日付の数と一致することを照合する                       |"`\]: `The former implementation placeholder is resolved, but identify the authoritative operating-day or closing record needed to distinguish a closed day, a genuine zero-sales day, and missing sales records, and define the behavior when that input is unavailable.`
- F010 \[major/vp-dev-implementation-readiness; line=79; anchor=`"| 期間内に販売記録が 1 件もない  | 報告を作り、明細なし・記録日数 0 と表示する            | 店主代表が休業か記録漏れかを確かめ、記録漏れなら開発担当へ知らせる   |"`\]: `Define detail selection when sales are absent but stockout records exist; selecting products with sales or stockouts at line 54 conflicts with suppressing every detail row here, so implementations cannot produce a consistent result.`
- F011 \[major/vp-dev-change-impact; line=25; anchor=`"- 再出力: 同じ週を再出力した場合は、その週の報告を作り直し、別の報告を増やさない。"`\]: `based_on と関連成果物を特定し、帳票変更が schema、生成処理、出力形式、運用手順、既存利用者へ与える影響を明記する必要がある。`
- F012 \[major/vp-dev-testability; line=17; anchor=`"- 仕様の確認: BA が読み手と利用目的を、QE が表示項目の確かめ方と例外時の表示を確かめる。"`\]: `対象ファイルに対する lint、Frontmatter schema 検証、生成確認のコマンドと期待結果、エラー時の対応を示す必要がある。`
- F013 \[major/vp-qe-verifiability; line=53; anchor=`"| 2   | 見出し | 記録日数       | 期間内で販売記録がある営業日の数                  | 販売記録           | 販売記録がある日付の数と一致することを照合する                       |"`\]: `Identify an independent source for expected operating days and define pass/fail cases for a closed day, an open day with zero sales, and an open day with missing records; counting dates found in sales records cannot verify these distinctions.`
- F014 \[major/vp-qe-omissions-consistency; line=79; anchor=`"| 期間内に販売記録が 1 件もない  | 報告を作り、明細なし・記録日数 0 と表示する            | 店主代表が休業か記録漏れかを確かめ、記録漏れなら開発担当へ知らせる   |"`\]: `Reconcile the no-sales exception with the requirement to list products having sales or stockouts; a stockout-only week currently requires both stockout detail rows and no detail rows.`
- F015 \[major/vp-qe-omissions-consistency; line=60; anchor=`"| 9   | 注記   | 記録の注意     | 記録なしの営業日、商品台帳にない商品              | 販売記録、商品台帳 | 「対象範囲と元にする記録」の欠けるときの扱いに該当する事項だけが載る |"`\]: `Include the presence or absence of stockout records in the annotation definition and verification rule, or revise the source-table requirement at line 44; the current exhaustive list permits only missing sales days and unknown products.`
- F016 \[minor/vp-qe-kata-conformance; line=84; anchor=`"## 9. メモ / 将来課題"`\]: `The previous structural and naming blockers are resolved; only a minor declaration remains: identify the upper report index that owns shared conventions, or explicitly record that it has not been created, as required by the rulebook's overall policy.`
- F017 \[minor/vp-ux-language-consistency; line=89; anchor=`"| 補充候補の基準     | 補充候補の欠品回数の基準が未決であり、候補が多すぎる場合がある                                                                                                                                             | 店主代表が初回の報告で基準を決め、同行レビュー担当が判定の例を確かめる                                                              |"`\]: `The previous type and reference-name problems are resolved; map 同行レビュー担当 to a defined Role code, such as QE if intended, so the reviewer responsible for checking threshold examples is unambiguous.`
- F018 \[major/vp-ops-release-readiness; line=84; anchor=`"## 9. メモ / 将来課題"`\]: `ready 化に必要な必須章の充足条件、未解決事項の解消基準、公開対象、人間の承認者、公開前確認を明記する必要がある。`
- F019 \[major/vp-ops-operability; line=82; anchor=`"| 自動での作成が失敗した         | 報告を作らない                                         | 開発担当が原因を確かめ、解消後に同じ週を再出力する                   |"`\]: `帳票仕様の更新契機、変更管理先、再生成・再検証手順、問い合わせ導線、障害時対応、担当 Role code を記述する必要がある。`

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

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- T-KATA-WAVE-2-bds-progress-report-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）。型の rulebook は pass、sample は needs-work
- 最新の grade（specdojo.bds-sample）の major の指摘を取り込む。rulebook は変えない

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- 最新の grade（`specdojo.<型>-sample`）の blocker・major の指摘を取り込み、sample を完成例として直す。rulebook は変えない。共通サンプル文脈（駄菓子屋）を保つ。
- 直した後に `grade run --target kata` で rulebook と sample を grade し直し、sample が pass になる。結果を対応結果に書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
