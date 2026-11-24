---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-design-gl-sample-050-20261123t135106z-2c7a40b9
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-DESIGN-gl-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: sample-maintenance
  targets:
    - prj-0001:gl-sample
    - specdojo:gl-sample
---

# Edit Plan: T-KATA-WAVE-6-DESIGN-gl-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 用語集の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、用語集の完成例を示す
- `path`: `docs/ja/specdojo/samples/gl-sample.yaml`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-DESIGN-gl-sample-050/T-KATA-WAVE-6-DESIGN-gl-sample-050-20261123T135106Z-2c7a40b9/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/gl-sample.yaml`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **BA（Business Analyst）**
- 責務: 仕様を書く人と読む人の利用者視点から、文書体系への要求、利用場面、受入条件を整理する。

このロールが重視するレビュー観点:

- 要件・受入条件の充足: 要件、受入条件、対象範囲、対象外が利用者視点で確認できる粒度になっているか。
- 関係者・利用場面の明確性: 関係者、利用場面、合意対象が読み取れるか。文書を確かめる・承認する役割の割り当ては本文に求めない。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-ba-requirements-completeness; line=36; anchor=`"notes: 店主が認めた常連客だけが利用する。店頭では現金による販売と区別して記録する。"`\]: `つけの利用条件を決める「常連客」と、つけ残高・つけ限度額の単位となる「顧客」が用語として定義されていないため、顧客（および常連客との関係）を tm-actor 分類などで定義し、つけを利用できる対象者の境界を用語集内で確認できるようにする。`
- F002 \[minor/vp-qe-omissions-consistency; line=19; anchor=`"status: official"`\]: `用語の status: official が発注点だけに付いており、ほかの9語は採用状態が不明に読めるため、全用語で status を揃えるか、発注点だけに付ける理由がなければ削除して採用状態の表現を一貫させる。`
- F003 \[minor/vp-qe-kata-conformance; line=11; anchor=`"- id: tm-reorder-point"`\]: `rulebook の ID規約は新規採番を tm-＜領域＞-＜概念＞ とするが、tm-reorder-point・tm-standard-product・tm-safety-stock・tm-shop-owner は領域接頭辞を持たず tm-sales-credit-* と混在しているため、新規採番として規約どおりの ID に揃えるか、既存確定 ID として維持していることを冒頭コメント等で示し、完成例から規約の適用が読み取れるようにする。`
- F004 \[minor/vp-qe-kata-conformance; line=9; anchor=`"# 単一店舗の販売・在庫・つけ管理を扱う。外部システムとの連携と本格会計は対象外。"`\]: `rulebook の位置づけは冒頭コメントまたは代表用語の注記で対象範囲と共通・他領域の正本を示すことを求め、分類・関連用語の判断でも別ファイルの「商品」を文書リンクで案内する例を挙げているが、冒頭コメントは対象範囲だけを示し、定義で使う「商品」（line 26・70・84）の正本（共通用語集など）を示していないため、冒頭コメントまたは在庫・販売の notes か source で共通の正本を案内し、完成例から規約の適用が読み取れるようにする。`
- F005 \[minor/vp-ux-readability; line=77; anchor=`"notes: 発注を検討する基準の発注点とは区別する。"`\]: `安全在庫の notes は「発注点とは区別する」と述べるだけで区別の内容がなく、定義も需要変動に備えるという一般論に留まるため、この店舗で誰がどの商品（定番商品など）に設定するのか、発注点との関係（例: 発注点は安全在庫に入荷までの販売見込みを加えた水準とする）を注記で示し、初見の読者が2語の境界を判断できるようにする。`
- F006 \[minor/vp-ux-language-consistency; line=16; anchor=`"notes: 定番商品だけに設定し、発注候補に挙がった後の発注数量と発注先は店主が判断する。"`\]: `正式な用語は店主代表（line 60）で店主は別名だが、line 16・26・36・54 の定義・注記は店主、line 64 は店主代表と書き分けているため、他用語の定義・注記では正式な用語の店主代表に統一するか、term を店主にして店主代表を別名に回し、表記を一貫させる。`

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

`共通規約 sha256:49eac627d50989b27745d047415c0d26226f3a7a2b8b90ec1b8818862593d575` `docs/ja/projects/prj-0001/execution/conventions/49eac627d50989b27745d047415c0d26226f3a7a2b8b90ec1b8818862593d575.txt`
