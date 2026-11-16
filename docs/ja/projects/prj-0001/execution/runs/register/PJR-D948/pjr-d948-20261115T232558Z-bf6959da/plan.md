---
specdojo:
  id: prj-0001:xep-pjr-d948-20261115t232558z-bf6959da
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
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-D948/pjr-d948-20261115T232558Z-bf6959da/result.md`

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

- F001 \[major/vp-po-decision-readiness; line=95; anchor=``"| 根拠の業務イベント（決定待ち） | つけ販売の確定と欠品の記録（`bes-stock-out-recorded`）の業務イベントが未同梱で、`based_on` に接続していない。つけ販売の数え方と欠品回数の境界を確かめられず、月次報告の帳票仕様とテストの設計もこの境界に依存する | PO が本書の確定時に、受入を保留するか、販売数と営業日数に限った限定受入とするかを決める。限定受入の間、欠品回数と補充候補は参考表示とし、仕入れ数量の根拠にしない。BA が業務イベントを作って `based_on` に接続し、QE が算出ルールとの境界の期待結果を確かめた後に、PO が全面受入へ戻すかを判断する | `specdojo:pjr-bds-sales-events`  |"``\]: `売掛金と在庫切れの境界が未確認の状態で、POが承諾を保持する必要があるか、あるいは制限された範囲を明示的に承認する必要があるかを指定し、その決定の機会、許可された用途、および完全な承諾を復元するための条件を記録してください。`
- F002 \[major/vp-ba-requirements-completeness; line=47; anchor=`"| 前週の報告   | 前週からの販売数の増減を示す               | 前週の本報告                                                                                                                            | 初回は増減を「前週なし」と表示する                                                               |"`\]: `最初の報告週の後に前週の報告が不足している、または読み取れない場合の、期待される比較および報告ステータスを定義してください。現在の例外は初回のみを対象としているため、ユーザーは利用不可能な比較と、真のゼロベースラインを区別することができません。`
- F003 \[major/vp-dev-implementation-readiness; line=43; anchor=`"| 日次締め記録 | 営業日を特定し、その日の販売件数を照合する | [[specdojo:cdsd-sample\\|概念データストア定義]] の日次締め記録                                                                           | 締め記録がない日は休業日とする。締め記録そのものを読めない場合は営業日を推測せず、報告を保留する |"`\]: `Specify which closing state, confirmation version, and referenced sales-summary baseline are used for each date; specdojo:cdsd-sample distinguishes closing drafts and preserved confirmation versions, so record existence alone does not determine a reproducible operating-day count or sales-count comparison.`
- F004 \[major/vp-dev-change-impact; line=99; anchor=`"| 本書の変更（変更要求）         | 表示項目・算出ルール・契機を変えると、定期処理、過去の週の再出力、仕入れノートに綴じた報告との比較に影響する                                                                                                      | BA が差分を整理し、DEV が定期処理と再出力する週の範囲を、QE が再検証の範囲を示す。PO が承認してから定期処理へ反映し、反映後に直近の週を再出力する                                                                                                                                                  | 変更ごとに登録する               |"`\]: `Include successor reports in the impact analysis when a historical week is regenerated: replacing week W changes the baseline for week W+1, so define whether affected comparisons are regenerated or retain an identifiable frozen baseline, and require QE to verify that policy.`
- F005 \[minor/vp-qe-verifiability; line=53; anchor=`"| 1   | 見出し | 対象週         | 対象期間の開始日と終了日（例: 2026-04-13〜04-19）                                              | 販売記録                                     | 期間内の最初と最後の営業日が範囲に含まれることを照合する                                 |"`\]: `対象週の包含チェックを、売上や営業日がない週を含め、日本時間でのリクエストされた月曜日と日曜日の日付との完全な一致に置き換えてください。現在は、より広い誤った範囲が通過してしまっており、売上記録から空の週に対する期待される日付を提供することができません。`
- F006 \[major/vp-qe-omissions-consistency; line=81; anchor=`"| 期間内に販売記録が 1 件もない                    | 報告を作る。欠品の記録がある商品は販売数 0 として明細に載せ、販売も欠品もなければ「明細なし」と表示する | 店主代表が締め記録の販売件数と照合し、記録漏れなら DEV へ知らせる |"`\]: `在庫切れのみの製品に対して表示される無条件の売上ゼロと、締めのカウントの不一致をゼロとして扱ってはならないというルールを整合させてください。締めの記録に売上が示されているが売上記録が不足している場合は、ゼロと断定するのではなく、利用不可または不完全な値を定義してください。`
- F007 \[major/vp-qe-omissions-consistency; line=82; anchor=`"| 期間内に日次締め記録が 1 件もない（全休の週）    | 報告を作り、見出しに「休業週」、営業日数 0 と表示する。明細は上の行と同じ規則で載せる                   | 店主代表が休業の予定と合うかを確かめる                            |"`\]: `「休業週」のラベルを確認済みの閉店に限定するか、明確な不完全な締めステータスを定義してください。この行は締めの記録がないすべての週を閉店とラベル付けしていますが、84行目では、締めが欠落している日付の売上記録を明示的に許可しています。`

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
- 2026-11-16 の再 grade は needs-work だった（結果は対応結果と `docs/ja/projects/prj-0001/execution/grade/results/specdojo.bds-sample.yaml`）。利用者は、close せず同じ項目に次の回の完了条件を足し、0.8.0 のリリースの後に流し直すことを選んだ（2026-11-16）。配る型のため、同じ日に orchestrator が 0.8.0 の前へ前倒しした（利用者が 0.8.0 に足す todo の選定と実行を依頼）

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- 最新の grade（`specdojo.<型>-sample`）の blocker・major の指摘を取り込み、sample を完成例として直す。rulebook は変えない。共通サンプル文脈（駄菓子屋）を保つ。
- 直した後に `grade run --target kata` で rulebook と sample を grade し直し、sample が pass になる。結果を対応結果に書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。
- 次の回（2026-11-16 の再 grade の指摘を取り込む回、0.8.0 の前に流す）: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.bds-sample.yaml` の未解消の指摘（major を優先）と未達の完了条件を取り込んで直し、作業内容の表を実績に合わせる。再 grade（`grade run --target kata`）は orchestrator が流すため、executor は理由をメモに書いてその行を open のまま残す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
