---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-design-imp-operations-sample-050-20261123t140258z-51846ae5
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-DESIGN-imp-operations-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: sample-maintenance
  targets:
    - specdojo:imp-operations-sample
    - specdojo:imp-operations-sample
---

# Edit Plan: T-KATA-WAVE-6-DESIGN-imp-operations-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 運用への影響調査の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、運用への影響調査の完成例を示す
- `path`: `docs/ja/specdojo/samples/imp-operations-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-DESIGN-imp-operations-sample-050/T-KATA-WAVE-6-DESIGN-imp-operations-sample-050-20261123T140258Z-51846ae5/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/imp-operations-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **OPS（Operations / Release Manager）**
- 責務: 文書群とツールのリリース・公開・配布・変更管理を担う。公開可否の最終判断は PO に残し、実行主体は pm-members.yaml で管理する。

このロールが重視するレビュー観点:

- リリース・公開準備: 公開、配布、ready 化、リリース判断に必要な前提や未解決事項が明示されているか。
- 運用しやすさ: 継続更新、再生成、変更管理、問い合わせ対応、障害時対応に必要な情報が読み取れるか。
- agent 委任境界: agent に最終承認、公開可否判断、説明責任を委ねる記述になっていないか。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-purpose-alignment; line=37; anchor=`"| 高     | 監視項目追加としきい値調整 | 2026-05-15 まで | SRE 担当（井上） | 監視基盤への設定権限確認 |"`\]: `「SRE 担当」「監視基盤」「当番体制のシフト」「夜間体制」は、店主が一人でタブレット 1 台を使う単一店舗という共通サンプル文脈と合わない。店主代表や家族利用者代表が担える運用体制に書き換える必要がある。`
- F002 \[minor/vp-po-decision-readiness; line=44; anchor=`"| 論点                     | 不足情報                       | 決定期限   | 担当             | 処理方針                                     |"`\]: `未解決事項の表に、rulebook が求める「運用判断への影響」の列がない。各論点が未決のままだと、どの対応方針や影響度判断に影響するかを判断できない。`
- F003 \[minor/vp-po-publication-accountability; line=37; anchor=`"| 高     | 監視項目追加としきい値調整 | 2026-05-15 まで | SRE 担当（井上） | 監視基盤への設定権限確認 |"`\]: `担当欄に人物の姓（井上・山本・高橋・中村）が書かれている。sample-authoring-standard に従って役割名または Role code に置き換え、対応方針を承認する PO を明記する必要がある。`
- F004 \[minor/vp-pm-plan-feasibility; line=35; anchor=`"| 優先度 | 対応項目                   | 実施時期        | 担当             | 前提条件                 |"`\]: `対応方針の各項目に完了条件がなく、担当も Role code になっていないため、進捗確認や完了判定に使いにくい。`
- F005 \[minor/vp-pm-dependency-risk; line=26; anchor=`"| 影響対象運用       | 変更要否 | 影響度 | 対応方針 | 判断根拠                                                                               | 備考                             |"`\]: `rulebook の位置づけの章に反し、影響詳細一覧の備考欄に影響を受ける成果物 ID（運用手順書や監視設計など）が書かれていない。そのため後続成果物への依存を追えない。`
- F006 \[minor/vp-pm-control-reporting; line=42; anchor=`"## 6. 未解決事項"`\]: `未解決事項のうち、PJR の課題やリスクとして登録すべきものと、報告先が区別されていない。`
- F007 \[minor/vp-ba-business-value; line=16; anchor=`"評価観点は、運用品質、障害対応力、運用負荷の 3 点とする。"`\]: `評価観点に、rulebook が定める「利用者影響」が含まれていない。バーコード会計や値引きの変更が店頭の利用者・顧客の運用に与える影響が評価されていない。`
- F008 \[minor/vp-ba-requirements-completeness; line=12; anchor=`"- 狙い: 変更後も運用品質を維持し、障害時の初動遅延を防止する。"`\]: `変更要求の概要に、rulebook が求める成功条件（受け入れの判定条件）がなく、狙いが達成されたかを利用者の視点で確認できない。`
- F009 \[minor/vp-ba-stakeholder-clarity; line=46; anchor=`"| 監視しきい値の最終値     | 新仕様適用後 1 週間の実測値    | 2026-05-22 | SRE 担当（井上） | 実測データを確認してしきい値を確定する。     |"`\]: `担当や合意の相手が、共通登場人物の役割（店主代表・店舗運営アドバイザーなど）と対応しておらず、影響判断を誰と合意するのかが分からない。`
- F010 \[minor/vp-arc-technical-constraints; line=37; anchor=`"| 高     | 監視項目追加としきい値調整 | 2026-05-15 まで | SRE 担当（井上） | 監視基盤への設定権限確認 |"`\]: `「監視基盤」が何を指すのか、タブレット 1 台の構成でどう監視を実現するのかが書かれておらず、技術的な前提が判断できない。`
- F011 \[minor/vp-dev-implementation-readiness; line=28; anchor=`"| 監視運用           | 要       | 高     | 実施     | 値引き適用エラー監視がないと、売上差異を早期検知できず日次締めで手戻りが発生するため。 | 新規監視 3 項目を追加する。      |"`\]: `「新規監視 3 項目」の内容（例: 値引き適用エラーなど）が挙げられておらず、監視を設定する作業の入力にならない。`
- F012 \[minor/vp-dev-change-impact; line=16; anchor=`"評価観点は、運用品質、障害対応力、運用負荷の 3 点とする。"`\]: `rulebook が検討を求める統制・監査への影響（値引き適用の記録や日次締めの証跡など）が評価されておらず、影響範囲の識別が不完全である。`
- F013 \[minor/vp-qe-verifiability; line=12; anchor=`"- 狙い: 変更後も運用品質を維持し、障害時の初動遅延を防止する。"`\]: `「運用品質を維持」「初動遅延を防止」を達成したと判定するための指標、閾値、確認時点が定義されていない。`
- F014 \[major/vp-qe-verifiability; line=30; anchor=`"| 日次締め運用       | 要       | 中     | 代替     | 全手順を即時更新すると教育負荷が高いため、当面は差分手順書を併用して段階移行する。     | 2 週間後に一本化判断を行う。     |"`\]: `影響度（高・中・低）を判定するための具体的な尺度（判定基準）が定義されていない。rulebook の禁止事項「影響度の尺度を定義せずに高・中・低を混在させない」に当たるため、severity を major に上げる。`
- F015 \[minor/vp-qe-verifiability; line=31; anchor=`"| 問い合わせ一次対応 | 否       | 低     | 見送り   | 問い合わせ分類に大きな変更がなく、既存テンプレートで対応可能なため。                   | 想定外問い合わせ増加時に再評価。 |"`\]: `「想定外問い合わせ増加時」の増加を判定する基準値または比較期間がなく、再評価条件の成立を客観的に判定できない。`
- F016 \[minor/vp-qe-omissions-consistency; line=6; anchor=`"対象は「監視運用」「アラート初動」「日次締め運用」「問い合わせ一次対応」の 4 運用領域とする。"`\]: `「目的と適用範囲」に、rulebook 6.1 が明記を求める対象期間が記載されていない。`
- F017 \[major/vp-qe-omissions-consistency; line=16; anchor=`"評価観点は、運用品質、障害対応力、運用負荷の 3 点とする。"`\]: `影響度の高・中・低の尺度が定義されておらず、rulebook の禁止事項に違反している。評価観点も rulebook の 4 観点（運用品質・障害対応力・継続運用性・利用者影響）と合っていない。`
- F018 \[major/vp-qe-kata-conformance; line=20; anchor=`"| 高     | 2    | 監視運用、アラート初動 | 要       |"`\]: `影響度の尺度を定義しないまま高・中・低を使っている。これは sample-authoring-standard の禁止事項「対応 rulebook の禁止事項に抵触する記述を含めない」に当たり、手本として誤用を招く。`
- F019 \[major/vp-qe-kata-conformance; line=37; anchor=`"| 高     | 監視項目追加としきい値調整 | 2026-05-15 まで | SRE 担当（井上） | 監視基盤への設定権限確認 |"`\]: `担当欄に人物の姓（井上・山本・高橋・中村）を使っている。役割名・nickname・Role code で書くという sample-authoring-standard の規定に反する。`
- F020 \[minor/vp-qe-kata-conformance; line=12; anchor=`"- 狙い: 変更後も運用品質を維持し、障害時の初動遅延を防止する。"`\]: `rulebook の記述ガイド 6.2 の成功条件と、6.6 の「運用判断への影響」が sample に反映されておらず、rulebook の要求する項目を完成例として示しきれていない。`
- F021 \[minor/vp-ux-readability; line=16; anchor=`"評価観点は、運用品質、障害対応力、運用負荷の 3 点とする。"`\]: `挙げた 3 つの評価観点が、影響分析サマリや影響詳細一覧のどの判定に対応するのか示されておらず、観点と判定の関係が読み取れない。`
- F022 \[minor/vp-ux-language-consistency; line=35; anchor=`"| 優先度 | 対応項目                   | 実施時期        | 担当             | 前提条件                 |"`\]: `対応方針の「優先度」が影響度と同じ高・中・低を使いながら、両者の関係が定義されていない。担当欄も部署名・職種・Role code が混在している。`
- F023 \[minor/vp-ops-release-readiness; line=33; anchor=`"## 5. 対応方針"`\]: `対応方針を確定させる承認者と、それを承認する前に確認すべき事項（未解決事項のうちどれを解消すれば実施に入れるか）が示されていない。`
- F024 \[minor/vp-ops-operability; line=30; anchor=`"| 日次締め運用       | 要       | 中     | 代替     | 全手順を即時更新すると教育負荷が高いため、当面は差分手順書を併用して段階移行する。     | 2 週間後に一本化判断を行う。     |"`\]: `差分手順書を併用している期間の問い合わせ導線と、一本化を判断する人が書かれておらず、移行期間中の運用を継続できるかが読み取れない。`

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
