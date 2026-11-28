---
specdojo:
  id: prj-0001:xep-t-kata-wave-3-trc-requirements-to-tests-sample-050-20261121t192714z-f0df27e5
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-trc-requirements-to-tests-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:trc-requirements-to-tests-sample
    - specdojo:trc-requirements-to-tests-sample
---

# Edit Plan: T-KATA-WAVE-3-trc-requirements-to-tests-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 要求とテストの対応（派生ビュー）の完成例
- `depends_on`:
  - [[specdojo:atc-sample]]
  - [[specdojo:stc-sample]]
- `overview`: 駄菓子屋の業務の受入基準と受入テスト・総合テストを題材に、要求とテストの対応の派生ビューの完成例を示す
- `path`: `docs/ja/specdojo/samples/trc-requirements-to-tests-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-trc-requirements-to-tests-sample-050/T-KATA-WAVE-3-trc-requirements-to-tests-sample-050-20261121T192714Z-f0df27e5/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/trc-requirements-to-tests-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **QE（Quality Engineer）**
- 責務: 成果物と参考資料の品質基準、レビュー観点、schema 適合、文書間整合を確認する。

このロールが重視するレビュー観点:

- done_criteria 充足: 成果物カタログの done_criteria を満たしているか、未充足条件が明示されているか。
- 検証可能性: 成功基準、受入条件、品質基準、設定値が pass / fail を判定できる表現になっているか。
- 抜け漏れ・矛盾: 必須章、必須キー、参照、責務、禁止事項に抜け漏れや矛盾がないか。
- 設定値の妥当性: 設定値・必須キー・参照が schema と整合し、妥当な値で過不足なく定義されているか。
- 実践の型としての適合性: rulebook、recipe、sample、template が種別ごとの責務を守り、Kata 内部、Kata 相互、および参照する組織定義や生成物を含む適用先との関係が矛盾なく定義されているか。Kata に関するこれらの整合はこの観点で判定し、vp-arc-cross-document-consistency では扱わない。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-purpose-alignment; line=5; anchor=`"本書は、駄菓子屋の販売管理システムにおける主要要求と対応テストの関係を可視化し、要求漏れ・テスト漏れを防ぐためのトレーサビリティを示す。対象は 2026 年度第 1 リリースで扱う会計、在庫、値引き、監査の要求とテストとする。"`\]: `目的と適用範囲に、このビューを誰がどのレビュー・受入判断（例: テストレビュー）で使うかが書かれておらず、rulebook の判断基準を満たしていないため追記する。`
- F002 \[minor/vp-po-decision-readiness; line=21; anchor=`"| req-r1-004 | 監査ログを 1 年保持する          | itc-audit-log-persist                       | 未着手   | _UNDECIDED_: 保持期間検証の受入条件が未確定 | 受入観点を ATC 側で定義予定    |"`\]: `` `req-r1-004` の `_UNDECIDED_` について、決める人と決める時点（または登録簿への引き継ぎ先）が書かれておらず、判断の次アクションが読み取れないため追記する。 ``
- F003 \[minor/vp-pm-plan-feasibility; line=37; anchor=``"| req-r1-002 | 障害復旧時の再送ケースが不足   | `itc-stock-message` に再送失敗/重複受信ケースを追加 | テスト設計担当 | 2026-05-12 | IT ケース表に該当ケースが追加される |"``\]: ``ギャップの判定条件が「ケース表に追加される」に留まっている。rulebook の良い例のように「`relations.verifies` を持たせ、再生成で `一部充足` 以上になる」など、再生成の結果で完了を判定できる形にする。``
- F004 \[minor/vp-pm-dependency-risk; line=9; anchor=``"- 要求参照元: 要求一覧 `req-2026-r1`"``\]: ``本文が参照している要求一覧 `req-2026-r1` と `atc-*` が `based_on` にないため、要求・テストを変えたときに再生成が必要だと依存関係から検出できない。``
- F005 \[minor/vp-pm-control-reporting; line=35; anchor=`"| 要求ID     | ギャップ内容                   | 解消方針                                            | 担当           | 期限       | 判定条件                            |"`\]: `担当・期限をビュー内で管理しており、登録簿へ転記する事項として分けていない。ギャップは PJR 個票の参照に置き換え、追跡を登録簿に寄せる。`
- F006 \[minor/vp-ba-business-value; line=5; anchor=`"本書は、駄菓子屋の販売管理システムにおける主要要求と対応テストの関係を可視化し、要求漏れ・テスト漏れを防ぐためのトレーサビリティを示す。対象は 2026 年度第 1 リリースで扱う会計、在庫、値引き、監査の要求とテストとする。"`\]: `テスト漏れを放置した場合の影響（受入判断の誤りや監査対応の不備など）が書かれておらず、トレースを行う価値が読み手に伝わりにくいため一文添える。`
- F007 \[minor/vp-ba-requirements-completeness; line=12; anchor=``"- 対象外: 非機能性能試験（`ptc-*`）は本トレースの対象外とする"``\]: ``対象外の非機能性能試験（`ptc-*`）に除外の理由がなく、rulebook の「対象外（理由付き）」という受入条件を満たしていないため理由を追記する。``
- F008 \[minor/vp-ba-stakeholder-clarity; line=5; anchor=`"本書は、駄菓子屋の販売管理システムにおける主要要求と対応テストの関係を可視化し、要求漏れ・テスト漏れを防ぐためのトレーサビリティを示す。対象は 2026 年度第 1 リリースで扱う会計、在庫、値引き、監査の要求とテストとする。"`\]: `このビューを利用・確認する関係者（例: テストレビューの確認者、受入判断者）が書かれておらず、合意の対象者が読み取れないため明示する。`
- F009 \[major/vp-arc-technical-constraints; line=9; anchor=``"- 要求参照元: 要求一覧 `req-2026-r1`"``\]: ``トレース対象の前提に、対応の正本（`relations.verifies`）、生成の手段（コマンドまたは手順）、生成日が書かれていない。rulebook の禁止事項「母集団と生成手段を書かずに表を示す」に当たる。``
- F010 \[major/vp-dev-implementation-readiness; line=10; anchor=``"- テスト参照元: 単体テスト `utc-*`、内部結合テスト `itc-*`、受入テスト `atc-*`"``\]: ``テスト参照元がワイルドカード（`utc-*` など）で列挙されているだけで、走査対象の文書と生成手段が特定できない。別の人が同じ表を再生成できないため、入力文書 ID と生成手順を示す。``
- F011 \[minor/vp-dev-change-impact; line=42; anchor=`"- 要求またはテストの更新が入った場合、同一レビュー単位で本トレースを更新する。"`\]: ``変更履歴と更新ルールに、再生成の契機（要求・テストの追加、`relations.verifies` の変更、テストの `status` 変更）と、前回から充足状況が変わった要求 ID が書かれていないため追記する。``
- F012 \[minor/vp-dev-testability; line=7; anchor=`"## 2. トレース対象の前提"`\]: `表を再生成して照合する確認手順（生成コマンドと、差分がないことの確認）が書かれておらず、ビューが正しいかを検証できないため追記する。`
- F013 \[major/vp-qe-verifiability; line=21; anchor=`"| req-r1-004 | 監査ログを 1 年保持する          | itc-audit-log-persist                       | 未着手   | _UNDECIDED_: 保持期間検証の受入条件が未確定 | 受入観点を ATC 側で定義予定    |"`\]: `` `req-r1-004` は対応テスト `itc-audit-log-persist` があるのに `未着手` とされ、rulebook の判定条件（`未着手` は対応テストなし）と矛盾する。`一部充足` に直すか、対応テストを `なし` にする。 ``
- F014 \[minor/vp-qe-verifiability; line=18; anchor=`"| req-r1-001 | レジ会計を 90 秒以内で完了する   | utc-pos-calc, itc-pos-flow, atc-cashier-001 | 充足     | なし                                        | 主要シナリオを各レベルで網羅   |"`\]: `` `充足` の行の備考に、判定根拠となる参照先テストの `status`（`ready`）や review result がなく、`充足` の条件を満たすか確かめられないため根拠を記す。 ``
- F015 \[major/vp-qe-omissions-consistency; line=9; anchor=``"- 要求参照元: 要求一覧 `req-2026-r1`"``\]: ``Frontmatter の `based_on` に、本文で参照されている要求一覧および受入テスト仕様の ID が漏れている。``
- F016 \[major/vp-qe-omissions-consistency; line=9; anchor=``"- 要求参照元: 要求一覧 `req-2026-r1`"``\]: `トレース対象の前提の必須要素である生成の手段（コマンドまたは手順）と生成日が欠けており、rulebook の本文要件を満たしていない。`
- F017 \[minor/vp-qe-omissions-consistency; line=16; anchor=`"| 要求ID     | 要求要約                         | 対応テストID                                | 充足状況 | ギャップ                                    | 備考                           |"`\]: ``母集団にない要求 ID を `relations.verifies` に持つテストの有無が示されていない。該当がなければ、その旨を前提かマトリクスに明記する。``
- F018 \[major/vp-qe-kata-conformance; line=40; anchor=`"## 6. 変更履歴と更新ルール"`\]: `rulebook で禁止されている「ビューの手編集」を前提とした更新ルール（手動での充足状況管理やチケット ID 追記）が定義されており、成果物の型定義に違反している。`
- F019 \[major/vp-qe-kata-conformance; line=35; anchor=`"| 要求ID     | ギャップ内容                   | 解消方針                                            | 担当           | 期限       | 判定条件                            |"`\]: `rulebook の記述ガイドは担当・期限を登録簿で追跡し本ビューに列を設けないと定めているのに、ギャップ表に担当・期限の列があり、型と矛盾する。`
- F020 \[major/vp-qe-kata-conformance; line=21; anchor=`"| req-r1-004 | 監査ログを 1 年保持する          | itc-audit-log-persist                       | 未着手   | _UNDECIDED_: 保持期間検証の受入条件が未確定 | 受入観点を ATC 側で定義予定    |"`\]: ``対応テストがある `req-r1-004` を `未着手` としており、rulebook の「充足状況の判定」と矛盾した完成例になっている。``
- F021 \[minor/vp-ux-readability; line=3; anchor=`"## 1. 目的と適用範囲"`\]: ``本書がテスト成果物の `relations.verifies` から生成される派生ビューであることが導入部に書かれておらず、手で管理する表と誤読されるため位置づけを一文で示す。``
- F022 \[minor/vp-ux-language-consistency; line=35; anchor=`"| 要求ID     | ギャップ内容                   | 解消方針                                            | 担当           | 期限       | 判定条件                            |"`\]: `担当者欄における表記が Role code ではなく役職名・役割名の自由記述となっており、表記が不統一である。`
- F023 \[minor/vp-ux-language-consistency; line=19; anchor=`"| req-r1-002 | 在庫引当をリアルタイムで更新する | utc-stock-update, itc-stock-message         | 一部充足 | _TODO_: 障害復旧時の再送ケースが未追加      | 失敗系ケースを IT 側へ追加予定 |"`\]: ``備考の「IT 側」「ATC 側」「UTC」が、前提で定義した `itc-*`・`atc-*`・`utc-*` の表記と揃っていないため統一する。``
- F024 \[minor/vp-ops-release-readiness; line=19; anchor=`"| req-r1-002 | 在庫引当をリアルタイムで更新する | utc-stock-update, itc-stock-message         | 一部充足 | _TODO_: 障害復旧時の再送ケースが未追加      | 失敗系ケースを IT 側へ追加予定 |"`\]: ``ギャップ列の `_TODO_`・`_UNDECIDED_` が、完成例として示した未決事項なのか sample 自体の未完了なのか区別できないため、ギャップの文言として書き直す。``
- F025 \[major/vp-ops-operability; line=43; anchor=``"- 充足状況は削除せず、`未着手` / `一部充足` / `充足` の状態遷移で管理する。"``\]: `充足状況をビュー上の状態遷移で管理する運用になっており、生成元を直して再生成するという rulebook の運用と矛盾する。再生成すると内容が失われるため、再生成手順に置き換える。`

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
