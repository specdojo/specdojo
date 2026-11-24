---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-project-prj-success-criteria-and-acceptance-criteria-sample-050-20261124t025035z-e1ed7f2d
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-PROJECT-prj-success-criteria-and-acceptance-criteria-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PO
  approach: sample-maintenance
  targets:
    - specdojo:prj-success-criteria-and-acceptance-criteria-sample
    - specdojo:prj-success-criteria-and-acceptance-criteria-sample
---

# Edit Plan: T-KATA-WAVE-6-PROJECT-prj-success-criteria-and-acceptance-criteria-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 成功基準と受入条件の完成例
- `depends_on`:
  - [[specdojo:prj-overview-sample]]
  - [[specdojo:prj-scope-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、成功基準と受入条件の完成例を示す
- `path`: `docs/ja/specdojo/samples/prj-success-criteria-and-acceptance-criteria-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-PROJECT-prj-success-criteria-and-acceptance-criteria-sample-050/T-KATA-WAVE-6-PROJECT-prj-success-criteria-and-acceptance-criteria-sample-050-20261124T025035Z-e1ed7f2d/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/prj-success-criteria-and-acceptance-criteria-sample.md`
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

- F001 \[minor/vp-po-purpose-alignment; line=9; anchor=`"| BV-01       | 店主と家族が同じ手順で販売・在庫・つけを記録・確認できる | 初期リリース |"`\]: `BV-01 は「店主と家族が同じ手順で確認できる」ことを価値としているが、SC-01・AC-01〜AC-03 は各代表の個別完遂しか判定せず、同じ記録に対する両代表の確認結果の一致を判定する条件がないため、BV-01 の価値を直接確かめる判定基準を加える。`
- F002 \[minor/vp-po-decision-readiness; line=46; anchor=`"| 人気商品の対象範囲     | SC-04 の測定。初期受入は進める | _UNDECIDED_: ベースライン測定開始前に対象商品と除外条件を固定する |"`\]: `人気商品の対象範囲とオフライン時の記録方法に決定責任者がなく、PO が誰へ判断準備を依頼すべきか分からないため、各論点の担当と最終判断者を明記する。`
- F003 \[minor/vp-pm-plan-feasibility; line=38; anchor=`"2. 未達なら影響、是正内容、再確認の条件 ID と日を追記して再確認する。"`\]: `未達時に是正内容と再確認日を記録する手順はあるが、是正担当と再確認担当の割り当て方法がないため、担当 Role code を記録して作業を引き継ぐ手順を加える。`
- F004 \[minor/vp-pm-dependency-risk; line=20; anchor=`"| SC-04 | BV-03            | 人気商品の欠品を減らせる   | 対象商品の月間欠品回数が運用前1か月比で50%以上減る      | 日次記録の欠品を月単位で比較                                     | 運用開始後6か月    | 店主代表 |"`\]: `SC-04・SC-05 は運用前ベースラインとの比較を前提とするが、システム運用開始前に欠品・廃棄・値引き・長期滞留を誰がどの方法で記録し始めるかという先行作業とスケジュール依存が示されておらず、測定不能のリスクが見えないため、ベースライン収集の開始時期と担当を判定前提として明記する。`
- F005 \[minor/vp-pm-control-reporting; line=47; anchor=`"| オフライン時の記録方法 | 初期受入の対象外               | _UNDECIDED_: 初期運用開始前に運用方針を決め、受入条件を追加する   |"`\]: `オフライン方針の決定と受入条件の追加について、変更要求・決定記録への引き継ぎ先がなく、受入確認記録だけでは判断経緯を追跡しにくいため、PJR 等の記録先と担当 Role code を示す。`
- F006 \[minor/vp-ba-business-value; line=11; anchor=`"| BV-03       | 記録を仕入れと引き継ぎに使い、店主不在でも運営できる     | 中長期       |"`\]: `主要課題であるつけの記録漏れ・残高確認の手間に対する成果がどの業務価値・成功基準でも測定されず、BV-03 は欠品・在庫・不在時運営だけを扱っているため、つけ残高の不一致件数または確認時間を判定する成功基準を対応する業務価値に加える。`
- F007 \[major/vp-ba-requirements-completeness; line=29; anchor=`"| AC-02 | BV-01            | 利用者視点 | 在庫とつけ残高を確認できる       | 商品の在庫数と常連顧客のつけ残高を表示できる                                | 在庫一覧、つけ残高画面     | 両代表   | 店主代表 |"`\]: `AC-02 は在庫数とつけ残高を表示できれば合格となり、入荷・棚卸等の在庫記録やつけ残高の記録・更新ができなくても初期受入を通過するため、スコープ内の最小限の記録操作と、その結果が在庫・残高へ正しく反映される受入条件を追加する。`
- F008 \[minor/vp-dev-implementation-readiness; line=31; anchor=`"| AC-04 | BV-01〜BV-03     | 技術的受入 | 確認結果を追跡できる             | スコープ・本書・操作メモが矛盾せず、結果ごとに条件 ID・確認日・確認者が残る | 文書照合記録、受入確認記録 | 開発担当 | 店主代表 |"`\]: `AC-04 は「スコープ・本書・操作メモが矛盾しない」ことを合格基準とするが、操作メモの内容・作成者・作成時期が定義されておらず開発担当が準備すべき成果物を特定できないため、操作メモが何を記した文書かと作成担当を明記する。`
- F009 \[major/vp-qe-verifiability; line=21; anchor=`"| SC-05 | BV-03            | 在庫の無駄を減らせる       | 廃棄・値引き・長期滞留が年間換算で運用前から20%以上減る | 数量と金額の12か月実績を同じ定義のベースラインと比較             | 運用開始後12か月   | 店主代表 |"`\]: `SC-05 は廃棄・値引き・長期滞留の数量と金額を測定する一方、20%以上削減を項目別・合算・数量・金額のどれで判定するかが不明で、運用前ベースラインの期間と年間換算方法も定まっていないため、判定指標、集計式、比較期間を明記する。`
- F010 \[minor/vp-qe-verifiability; line=20; anchor=`"| SC-04 | BV-03            | 人気商品の欠品を減らせる   | 対象商品の月間欠品回数が運用前1か月比で50%以上減る      | 日次記録の欠品を月単位で比較                                     | 運用開始後6か月    | 店主代表 |"`\]: `SC-04 は運用開始後6か月に判定するが、比較する月間欠品回数が6か月目の値か期間平均か分からないため、評価対象期間と集計方法を指定する。`
- F011 \[minor/vp-qe-verifiability; line=17; anchor=`"| SC-01 | BV-01            | 主要操作を迷わず完了できる | 販売記録・在庫確認・つけ残高確認を両代表が完了する      | 説明なしで代表シナリオを行い、所要時間・質問・支援・誤操作を記録 | 初期リリース受入時 | 両代表   |"`\]: `SC-01 は「迷わず完了できる」を条件とし質問・支援を記録するが、支援を受けて完了した場合を合格とするかが判定基準にないため、許容する支援・質問の範囲を合否条件として明記する。`
- F012 \[minor/vp-qe-omissions-consistency; line=35; anchor=`"確認者・承認者は各表に従い、結果は受入確認記録へ残す。"`\]: `証跡の格納先は「受入確認記録」という名称だけで、ルールブックが求める保存先を特定できないため、記録の保管場所と、条件 ID から操作結果・文書照合記録を参照する方法を示す。`
- F013 \[major/vp-qe-kata-conformance; line=17; anchor=`"| SC-01 | BV-01            | 主要操作を迷わず完了できる | 販売記録・在庫確認・つけ残高確認を両代表が完了する      | 説明なしで代表シナリオを行い、所要時間・質問・支援・誤操作を記録 | 初期リリース受入時 | 両代表   |"`\]: `根拠とする概要 sample の「両代表の確認結果の一致100%」「短期の家族による自力記録3回以上」「翌月へ残るつけの記録漏れ・残高不一致0件」に対応する条件も除外理由もなく、上位の期待効果が判定対象から脱落しているため、対応する成功基準・受入条件または扱いを変更する判断根拠を示す。`
- F014 \[minor/vp-qe-kata-conformance; line=46; anchor=`"| 人気商品の対象範囲     | SC-04 の測定。初期受入は進める | _UNDECIDED_: ベースライン測定開始前に対象商品と除外条件を固定する |"`\]: `recipe と template は未決事項に決定時期と担当を求めるが、例外表の両論点には担当がないため、完成例として責任者を補う。`
- F015 \[minor/vp-qe-kata-conformance; line=20; anchor=`"| SC-04 | BV-03            | 人気商品の欠品を減らせる   | 対象商品の月間欠品回数が運用前1か月比で50%以上減る      | 日次記録の欠品を月単位で比較                                     | 運用開始後6か月    | 店主代表 |"`\]: `SC-04・SC-05 は運用前後の値だけを比較し、概要 sample とルールブックが求める季節・来店数・仕入れ条件等の外部要因の記録と寄与の確認が示されていないため、測定記録と判定手順にその扱いを加える。`
- F016 \[minor/vp-qe-kata-conformance; line=26; anchor=`"| ID    | 対応する業務価値 | 種別       | 条件                             | 合格基準                                                                    | 証跡                       | 確認者   | 承認者   |"`\]: `承認者欄は役割表示名の「店主代表」だけで、Sample 記述標準が承認責任に求める Role code が示されていないため、承認責任を PO と明記し、人間の担当である店主代表との対応を示す。`
- F017 \[minor/vp-qe-kata-conformance; line=44; anchor=`"| 論点                   | 判定への影響                   | 当面の扱い                                                        |"`\]: `例外表の列が「論点・判定への影響・当面の扱い」で、正本である template の「論点・扱い・解決期限 / 判断タイミング・責任者」の骨組みと一致せず完成例として template との対応が崩れているため、template の列構成に合わせる。`
- F018 \[minor/vp-qe-kata-conformance; line=17; anchor=`"| SC-01 | BV-01            | 主要操作を迷わず完了できる | 販売記録・在庫確認・つけ残高確認を両代表が完了する      | 説明なしで代表シナリオを行い、所要時間・質問・支援・誤操作を記録 | 初期リリース受入時 | 両代表   |"`\]: `共通サンプル文脈の期待効果「つけ残高を1分以内で確認可能」に対応する成功基準・受入条件がなく、値を変える場合は関連 sample と整合させるという Sample 記述標準の運用に沿わないため、つけ残高確認時間の判定条件を加えるか扱いを変える根拠を示す。`
- F019 \[minor/vp-ops-release-readiness; line=47; anchor=`"| オフライン時の記録方法 | 初期受入の対象外               | _UNDECIDED_: 初期運用開始前に運用方針を決め、受入条件を追加する   |"`\]: `オフライン対応は初期受入の対象外としつつ初期運用開始前に受入条件を追加するとしているが、追加条件の確認・承認を運用開始の必須条件にするかが不明なため、初期受入後の再判定と運用開始可否の判断手順を明記する。`
- F020 \[minor/vp-ops-operability; line=40; anchor=`"4. 運用開始後は SC-02〜SC-06 を判定時期に判定し、未達なら運用か改善方針を見直す。"`\]: `運用後の未達に対して「運用か改善方針を見直す」だけでは、改善案の担当、変更の承認者、再測定時期を決められないため、これらを記録して次回判定へ引き継ぐ手順を加える。`

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
