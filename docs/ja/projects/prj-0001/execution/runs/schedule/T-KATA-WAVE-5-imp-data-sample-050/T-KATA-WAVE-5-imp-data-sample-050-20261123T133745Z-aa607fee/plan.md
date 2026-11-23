---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-imp-data-sample-050-20261123t133745z-aa607fee
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-imp-data-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: sample-maintenance
  targets:
    - specdojo:imp-data-sample
    - specdojo:imp-data-sample
---

# Edit Plan: T-KATA-WAVE-5-imp-data-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: データへの影響調査の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、データへの影響調査の完成例を示す
- `path`: `docs/ja/specdojo/samples/imp-data-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-imp-data-sample-050/T-KATA-WAVE-5-imp-data-sample-050-20261123T133745Z-aa607fee/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/imp-data-sample.md`
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

- F001 \[minor/vp-po-purpose-alignment; line=12; anchor=`"- 狙い: 集計整合性の確保と、会計処理のデータ品質向上。"`\]: ``「狙い」が抽象的で、プロジェクト目的や業務影響調査（`imp-business`）のどの課題に応えるかが示されていないため、上位根拠との対応を1文で追記すべきである。``
- F002 \[minor/vp-po-decision-readiness; line=44; anchor=`"| 論点                       | 不足情報                       | 決定期限   | 担当               | 処理方針                                         |"`\]: `未解決事項の表に「判断や対応への影響」がなく、各論点が対応方針のどの項目や期限を左右するか判断できないため、影響の列を追加すべきである。`
- F003 \[minor/vp-po-publication-accountability; line=48; anchor=`"| 履歴保持期間の見直し       | 監査要件に基づく保持年限の確認 | 2026-05-15 | 監査担当（伊藤）   | 監査部門確認後に運用規約へ反映する。             |"`\]: `判定と対応方針を最終承認する責任者（店主代表／PO）が示されず、架空の「監査部門」に判断を委ねているため、承認責任の所在を明記すべきである。`
- F004 \[major/vp-pm-plan-feasibility; line=35; anchor=`"| 優先度 | 対応項目                     | 実施時期        | 担当                     | 前提条件                     |"`\]: `対応方針の各項目に完了条件（データ検証・移行テストの確認手順と合格条件）がなく、タスクの完了判定ができないため、受入確認の条件を追記すべきである。`
- F005 \[minor/vp-pm-dependency-risk; line=26; anchor=`"| 影響対象データ       | 変更要否 | 影響度 | 対応方針 | 判断根拠                                                                             | 備考                         |"`\]: `備考に波及先成果物（I/F 仕様、テスト仕様、運用設計）の ID が示されず、後続成果物への依存を追えないため、該当する成果物 ID を備考に記載すべきである。`
- F006 \[minor/vp-pm-control-reporting; line=46; anchor=`"| 値引き理由コード体系の確定 | 例外値引きの分類方針           | 2026-05-08 | 業務責任者（高橋） | 次回レビューで運用コード表を確定する。           |"`\]: `未解決事項について、課題と決定記録のどちらへ転記するか、確定結果の報告先が示されず、管理への引き継ぎが曖昧なため、扱いを1語で明示すべきである。`
- F007 \[major/vp-ba-business-value; line=12; anchor=`"- 狙い: 集計整合性の確保と、会計処理のデータ品質向上。"`\]: `期待価値を判定する成功基準（例: 日次締めの差異件数0件、移行前後の売上合計差額0円）がなく、対応の効果を評価できないため、成功条件を追記すべきである。`
- F008 \[major/vp-ba-requirements-completeness; line=33; anchor=`"## 5. 対応方針"`\]: `対応方針に受入確認（業務影響の各対象と影響詳細一覧の照合、合格条件）がなく、受入条件を確認できないため、受入確認の記述を追加すべきである。`
- F009 \[major/vp-ba-stakeholder-clarity; line=37; anchor=`"| 高     | 商品マスタのコード整備       | 2026-05-12 まで | データ管理担当（田中）   | 対象 30 品目の合意           |"`\]: `担当に人物名と、共通サンプル文脈にない組織的な担当（業務システム担当、監査担当など）が使われ、関係者を誤読させるため、共通登場人物の役割名または Role code に置き換えるべきである。`
- F010 \[minor/vp-arc-technical-constraints; line=16; anchor=`"評価観点は、データ整合性、移行影響、運用負荷の 3 点とする。"`\]: `許容停止時間などの境界値が示されず、移行時の技術的制約を判断できないため、評価の前提となる境界値を先に記載すべきである。`
- F011 \[minor/vp-dev-implementation-readiness; line=29; anchor=`"| 売上明細             | 要       | 高     | 実施     | 値引き理由を保持しない場合、日次締め時に差異原因を追跡できず再計算が増えるため。     | 値引き理由コードを追加する。 |"`\]: `売上明細に追加する値引き理由コードについて、対象項目や格納先と既存集計への影響が示されず、変更作業の入力として不足するため、影響対象データ列か判断根拠に具体化すべきである。`
- F012 \[major/vp-dev-change-impact; line=28; anchor=`"| 商品マスタ           | 要       | 高     | 実施     | 商品コード未登録のままではバーコード会計時に照合失敗が発生し、会計停止が起こるため。 | 上位 30 品目を先行整備する。 |"`\]: `判断根拠に構造・整合性、データ検証・移行テスト、実装変更への影響が示されておらず rulebook の必須記載を満たさないため、各行にこの3点を記載すべきである。`
- F013 \[major/vp-dev-testability; line=35; anchor=`"| 優先度 | 対応項目                     | 実施時期        | 担当                     | 前提条件                     |"`\]: `データ検証・移行テストの確認手順と合格条件が示されず、変更後の検証ができないため、対応項目ごとに確認手順と期待結果を追記すべきである。`
- F014 \[major/vp-qe-verifiability; line=12; anchor=`"- 狙い: 集計整合性の確保と、会計処理のデータ品質向上。"`\]: `変更要求の概要に、判定可能な「成功条件」が記載されていないため、目標状態の検証ができない。`
- F015 \[major/vp-qe-verifiability; line=16; anchor=`"評価観点は、データ整合性、移行影響、運用負荷の 3 点とする。"`\]: `影響度「高・中・低」の判定基準が本文に定義されておらず、各判定の妥当性を検証できないため、尺度定義と境界値を記載すべきである。`
- F016 \[major/vp-qe-verifiability; line=35; anchor=`"| 優先度 | 対応項目                     | 実施時期        | 担当                     | 前提条件                     |"`\]: `対応方針に受入確認の合格条件がなく、対応が完了したかを判定できないため、照合手順と合格条件を記載すべきである。`
- F017 \[major/vp-qe-omissions-consistency; line=12; anchor=`"- 狙い: 集計整合性の確保と、会計処理のデータ品質向上。"`\]: `記述ガイド 6.2 で必須とされている「成功条件」の記述が欠落している。`
- F018 \[major/vp-qe-omissions-consistency; line=33; anchor=`"## 5. 対応方針"`\]: `rulebook の本文構成が対応方針に求める「受入確認」の記述が欠落しているため、追加すべきである。`
- F019 \[major/vp-qe-omissions-consistency; line=1; anchor=`"# 影響調査（データ）サンプル"`\]: ``Frontmatter の `based_on` が rulebook の必須とする業務影響調査（`＜project-id＞:imp-business`）ではなく `cr-2026-004` になっており、根拠の規約に違反するため修正すべきである。``
- F020 \[minor/vp-qe-omissions-consistency; line=44; anchor=`"| 論点                       | 不足情報                       | 決定期限   | 担当               | 処理方針                                         |"`\]: `未解決事項に rulebook が求める「判断や対応への影響」の列がないため追加すべきである。`
- F021 \[major/vp-qe-kata-conformance; line=16; anchor=`"評価観点は、データ整合性、移行影響、運用負荷の 3 点とする。"`\]: `禁止事項（尺度定義なしの高・中・低の混在）に抵触しており、影響度の判定基準が不明確である。`
- F022 \[major/vp-qe-kata-conformance; line=37; anchor=`"| 高     | 商品マスタのコード整備       | 2026-05-12 まで | データ管理担当（田中）   | 対象 30 品目の合意           |"`\]: `担当に人物名（田中、佐藤など）と、単一店舗の共通サンプル文脈にない組織（監査部門など）を使っており sample-authoring-standard に抵触するため、役割名または Role code に置き換えるべきである。`
- F023 \[minor/vp-qe-kata-conformance; line=16; anchor=`"評価観点は、データ整合性、移行影響、運用負荷の 3 点とする。"`\]: `評価観点「データ整合性、移行影響、運用負荷」が rulebook の「整合性・可用性・移行難易度・利用者影響」と異なり手本として誤用されるため、rulebook の観点にそろえるべきである。`
- F024 \[minor/vp-ux-readability; line=5; anchor=``"本書は、変更要求 `cr-2026-004` が駄菓子屋の販売管理システムのデータへ与える影響を判断するための文書である。"``\]: `目的の文に、前提とする業務影響調査と後続の波及先文書が示されず位置づけを把握しにくいため、上位と後続の文書を1文で示すべきである。`
- F025 \[minor/vp-ux-language-consistency; line=37; anchor=`"| 高     | 商品マスタのコード整備       | 2026-05-12 まで | データ管理担当（田中）   | 対象 30 品目の合意           |"`\]: `担当の表記が役割名、Role code（PM）、人物名の混在で、「データ管理担当」と「データ担当」の表記ゆれもあるため、1つの表記体系に統一すべきである。`
- F026 \[minor/vp-ops-release-readiness; line=42; anchor=`"## 6. 未解決事項"`\]: `未解決事項が確定するまでに何を満たせば判定を確定・承認できるか、その承認者が示されていないため、確定条件と承認者を明記すべきである。`
- F027 \[minor/vp-ops-operability; line=40; anchor=`"| 低     | 価格履歴の見送り再評価       | 2026-07-31      | PM（中村）               | 月次監査で差異発生件数を確認 |"`\]: `価格履歴の見送りを再評価する条件に差異発生件数の閾値がなく、再評価を発動するか判断できないため、具体的な閾値を記載すべきである。`

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
