---
specdojo:
  id: prj-0001:xep-t-kata-wave-3-imp-test-sample-050-20261121t092733z-c121e06b
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-imp-test-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:imp-test-sample
    - specdojo:imp-test-sample
---

# Edit Plan: T-KATA-WAVE-3-imp-test-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: テストへの影響調査の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムの変更を題材に、テストへの影響調査の完成例を示す
- `path`: `docs/ja/specdojo/samples/imp-test-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-imp-test-sample-050/T-KATA-WAVE-3-imp-test-sample-050-20261121T092733Z-c121e06b/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/imp-test-sample.md`
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

- F001 \[minor/vp-po-purpose-alignment; line=12; anchor=`"- 狙い: リリース前の欠陥流出リスクを抑え、期限内に必要な検証を完了する。"`\]: `狙いの「期限内」が指す期限（リリース予定日など）が本文にないため、狙いと対応方針の期日との対応を確認できるよう期限を明記する必要がある。`
- F002 \[minor/vp-po-decision-readiness; line=44; anchor=`"| 論点                     | 不足情報                         | 決定期限   | 担当               | 処理方針                                      |"`\]: `未解決事項の表に、各論点が影響度・対応方針の判断へ与える影響と、判断を承認する役割（Role code）がなく、承認・保留の判断材料が不足している。`
- F003 \[major/vp-po-publication-accountability; line=48; anchor=`"| 連携系テストデータの準備 | 値引き条件の代表データセット     | 2026-05-14 | QE 担当（井上）    | 代表パターンを 6 件作成しレビューで確定する。 |"`\]: `担当者欄に個人名を使用しており、sample 記述標準の禁止事項に抵触している。`
- F004 \[minor/vp-pm-plan-feasibility; line=39; anchor=`"| 中     | 回帰テスト重点化       | 2026-05-24 まで | テスト管理（山本）   | 優先順位基準の合意         |"`\]: `回帰テスト重点化の前提条件「優先順位基準の合意」に決定期限と担当がなく、未解決事項にも載っていないため、実施時期の 2026-05-24 を守れるか判断できない。`
- F005 \[minor/vp-pm-dependency-risk; line=48; anchor=`"| 連携系テストデータの準備 | 値引き条件の代表データセット     | 2026-05-14 | QE 担当（井上）    | 代表パターンを 6 件作成しレビューで確定する。 |"`\]: `未解決事項の各論点と「対応方針」の対応項目・前提条件の対応関係、および決定期限を過ぎた場合のスケジュールへの影響が示されていない。`
- F006 \[minor/vp-pm-control-reporting; line=44; anchor=`"| 論点                     | 不足情報                         | 決定期限   | 担当               | 処理方針                                      |"`\]: `未解決事項を課題・リスク・決定記録のどれとして管理するか、また報告先の役割が示されておらず、管理記録へ転記する際の手がかりがない。`
- F007 \[minor/vp-ba-business-value; line=12; anchor=`"- 狙い: リリース前の欠陥流出リスクを抑え、期限内に必要な検証を完了する。"`\]: `狙いが「欠陥流出リスクを抑え」という定性表現にとどまり、期待価値を確認できる成功基準（例: 重大欠陥の流出 0 件）に結び付いていない。`
- F008 \[major/vp-ba-requirements-completeness; line=7; anchor=`""`\]: `対象期間の記載が漏れている。`
- F009 \[major/vp-ba-requirements-completeness; line=15; anchor=`""`\]: `成功条件の記述が漏れている。`
- F010 \[minor/vp-ba-stakeholder-clarity; line=29; anchor=`"| 業務受入テスト | 要       | 高     | 実施     | 店舗運用手順の変更を反映しないと、受入判定基準を満たせないため。                     | 店舗担当の同席レビューを行う。 |"`\]: `「店舗担当」が共通登場人物のどの役割名（店主代表・家族利用者代表など）か不明で、同席レビューの確認者・合意対象が特定できない。`
- F011 \[minor/vp-dev-implementation-readiness; line=28; anchor=`"| 結合テスト     | 要       | 高     | 実施     | 値引き適用と売上集計の連携確認が不足すると、本番で差異が検出される可能性が高いため。 | 新規ケース 8 件を追加する。    |"`\]: `結合テストの新規ケース 8 件の観点・条件の内訳（値引き種別と集計項目の組み合わせ等）が示されておらず、ケース作成の入力として特定できない。`
- F012 \[major/vp-qe-verifiability; line=15; anchor=`""`\]: `成功条件に指標・状態・閾値などの判定基準がなく、検証不可能な状態である。`
- F013 \[major/vp-qe-verifiability; line=16; anchor=`"評価観点は、欠陥流出リスク、回帰範囲、実行コストの 3 点とする。"`\]: `評価観点（欠陥流出リスク・回帰範囲・実行コスト）ごとの高・中・低の境界条件がなく、詳細一覧の影響度が正しいかを第三者が判定できない。`
- F014 \[major/vp-qe-omissions-consistency; line=7; anchor=`""`\]: `対象期間の記載が漏れている。`
- F015 \[major/vp-qe-omissions-consistency; line=15; anchor=`""`\]: `成功条件の記述が漏れている。`
- F016 \[major/vp-qe-omissions-consistency; line=24; anchor=`"## 4. 影響詳細一覧"`\]: `影響度の判定尺度（高・中・低の定義）を定めずに使用しており、禁止事項に抵触している。`
- F017 \[major/vp-qe-omissions-consistency; line=16; anchor=`"評価観点は、欠陥流出リスク、回帰範囲、実行コストの 3 点とする。"`\]: `複数の評価観点で判定が分かれた場合の集約規則がなく、サマリ件数の集計規則と詳細一覧の判断根拠における尺度適用結果が rulebook の要求を満たしていない。`
- F018 \[major/vp-qe-omissions-consistency; line=35; anchor=`"| 優先度 | 対応項目               | 実施時期        | 担当                 | 前提条件                   |"`\]: `対応方針に、成功条件へ判定方法を適用して全条件達成を合格とする受入確認の記述がなく、rulebook の記述ガイドが求める要素が欠けている。`
- F019 \[minor/vp-qe-omissions-consistency; line=44; anchor=`"| 論点                     | 不足情報                         | 決定期限   | 担当               | 処理方針                                      |"`\]: `未解決事項の表に、rulebook が求める「判断・対応への影響」の列がなく、処理方針だけでは当面の扱いと影響が区別できない。`
- F020 \[major/vp-qe-kata-conformance; line=7; anchor=`""`\]: `必須要素である対象期間が欠落しており、完成最小例として不十分である。`
- F021 \[major/vp-qe-kata-conformance; line=15; anchor=`""`\]: `必須要素である成功条件が欠落しており、完成最小例として不十分である。`
- F022 \[major/vp-qe-kata-conformance; line=24; anchor=`"## 4. 影響詳細一覧"`\]: `影響度の判定尺度を定義せずに使用しており、rulebook の禁止事項に抵触している。`
- F023 \[major/vp-qe-kata-conformance; line=48; anchor=`"| 連携系テストデータの準備 | 値引き条件の代表データセット     | 2026-05-14 | QE 担当（井上）    | 代表パターンを 6 件作成しレビューで確定する。 |"`\]: `担当者欄に個人名を使用しており、sample 記述標準の禁止事項に抵触している。`
- F024 \[major/vp-qe-kata-conformance; line=16; anchor=`"評価観点は、欠陥流出リスク、回帰範囲、実行コストの 3 点とする。"`\]: `rulebook の影響分析サマリの記述ガイドが求める評価観点ごとの尺度定義と集約規則が sample に示されておらず、rulebook の要求を実演する完成例になっていない。`
- F025 \[minor/vp-qe-kata-conformance; line=1; anchor=`"# 影響調査（テスト）サンプル"`\]: ``Frontmatter の `part_of: prj-0001` が汎用 sample を特定プロジェクトの構成要素として宣言しており、sample の責務境界（共通サンプル文脈の完成例）との関係が不明確である。``
- F026 \[minor/vp-ux-readability; line=24; anchor=`"## 4. 影響詳細一覧"`\]: `影響度の判定基準が不明確であり、判断に曖昧さが残る。`
- F027 \[minor/vp-ux-language-consistency; line=46; anchor=`"| 重点回帰ケースの確定     | 変更箇所と既存障害履歴の突合結果 | 2026-05-11 | テスト管理（山本） | 障害履歴を参照して対象ケースを確定する。      |"`\]: `「影響度」と「優先度」という用語が使い分けられており、概念の整合性が不明確である。`
- F028 \[major/vp-ux-language-consistency; line=48; anchor=`"| 連携系テストデータの準備 | 値引き条件の代表データセット     | 2026-05-14 | QE 担当（井上）    | 代表パターンを 6 件作成しレビューで確定する。 |"`\]: `定義外の役割ラベルおよび個人名が使用されており、識別子として統一されていない。`
- F029 \[minor/vp-ux-language-consistency; line=47; anchor=`"| 受入判定基準の更新範囲   | 店舗運用側の必須判定項目         | 2026-05-13 | 業務受入（高橋）   | 現場ヒアリングを反映して判定基準を更新する。  |"`\]: `同一担当が本文38行「業務受入担当（高橋）」と本文47行「業務受入（高橋）」で異なるラベルになっており、表記ゆれがある。`
- F030 \[minor/vp-ops-release-readiness; line=42; anchor=`"## 6. 未解決事項"`\]: `未解決事項の解消と影響判断の承認が ready 化の条件であることや、承認する役割が示されておらず、確定に必要な前提が読み取れない。`

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
