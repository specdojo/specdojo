---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-notation-stsd-sample-050-20261123t175037z-743e2425
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-NOTATION-stsd-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: sample-maintenance
  targets:
    - specdojo:stsd-sample
    - specdojo:stsd-sample
---

# Edit Plan: T-KATA-WAVE-6-NOTATION-stsd-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: ステータス定義の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、ステータス定義の完成例を示す
- `path`: `docs/ja/specdojo/samples/stsd-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-NOTATION-stsd-sample-050/T-KATA-WAVE-6-NOTATION-stsd-sample-050-20261123T175037Z-743e2425/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/stsd-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **ARC（Architect）**
- 責務: rulebook、recipe、sample、template、成果物カタログの構造整合と技術制約を整理する。

このロールが重視するレビュー観点:

- 文書構造・配置・命名: frontmatter、ID、ファイル名、配置、見出し、リンクがプロジェクトの文書体系と整合しているか。
- 成果物間整合: 成果物について、成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。不整合の finding は突き合わせ先の文書 ID またはパスと、双方の相反する記述を特定する。rulebook、recipe、sample、template の内部・相互・適用先との整合は vp-qe-kata-conformance で判定し、この観点では扱わない。
- 技術前提・制約の明確性: 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。
- 冗長性・簡潔性: 各節が固有の判断または手順に寄与し、同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲がないか。判断に要る背景・制約・例外・完了条件が残されていれば下限を満たしているとする。長さだけでは fail にせず、削る・まとめる・参照に置き換えることで判断情報を失わない箇所を具体的に特定できる場合のみ minor とする。
- 文書責務の単一性: 文書の中心主題と責務境界が一つに定まり、各章がその責務に直接寄与しているか。独立して参照・更新できる主題が複数あり、対象読者・利用時点が異なる、または別々の sample・recipe・template に対応する場合は分割を検討する。分量や対応する実践の型の数だけでは不備としない。同一主張の反復や正本の過剰な再掲は vp-arc-conciseness で判定し、この観点では扱わない。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-ba-requirements-completeness; line=74; anchor=``"| `T-06`  | 検品済み | 返品待ち | 検品完了     | 結果が数量違いまたは品質不良で返品保管箱へ分けた | 店番担当は不合格理由と返品保管箱への分離を確認する。分離未完了なら販売対象へ混ぜず、店主代表へ引き継ぐ       |"``\]: `` `T-06` と返品待ちの意味が「数量違い」を返品理由に含めているが、数量不足のときは返品する現物がなく返品保管箱へ分ける経路が成り立たないため、過剰分だけを返品対象とするのか、不足は別の扱い（仕入先への連絡など）とするのかを条件に書き分ける。 ``
- F002 \[minor/vp-arc-conciseness; line=19; anchor=`"- 未成立時の扱い: 条件の一部だけが満たされた場合は遷移元の状態を保つ。入荷受入が未成立なら状態を割り当てず、受入日時と数量の記録だけで入荷済みと判定しない"`\]: `「未成立時の扱い」の「入荷受入が未成立なら状態を割り当てず」は一意判定（18行）の「入荷受入前は状態を割り当てず」と同じ主張の繰り返しなので、一方にまとめて残りの記述（受入日時と数量だけで入荷済みと判定しない）だけを残す。`
- F003 \[major/vp-qe-verifiability; line=11; anchor=`"- 対象: 店舗が仕入先へ発注し、納品を受けた商品"`\]: `対象「納品を受けた商品」の単位（納品ロット単位か個品単位か）が定義されておらず、受入・返品は数量付きの納品単位、販売は顧客への引渡し単位で判定しているため、一部だけ販売・一部だけ不合格のときに現在状態を一意に決められない。対象の単位と、分割時の扱いを「適用範囲」または「状態の判定」に明記する。`
- F004 \[minor/vp-qe-kata-conformance; line=26; anchor=`"| received       | 入荷済み | 入った品   | 店舗が納品を受け、検品結果が未確定の商品                 | 納品情報を発注内容へ照合して受入日時と数量を仕入記録へ記録し、検品結果をまだ記録していない   | 仕入記録、検品場所   |"`\]: ```状態一覧の「値」列が template では `` `_INITIAL_STATE_CODE_` `` とインラインコードで書く骨組みなのに、sample は `received` などを素のまま書いており完成例と骨組みで表記がそろっていない。どちらかに統一する。```
- F005 \[minor/vp-ux-language-consistency; line=54; anchor=``"| `T-01`  | 開始     | 入荷済み | 入荷受入     | 商品受領後に納品情報を発注内容へ照合し、受入日時と数量を仕入記録へ記録した | 照合未実施なら店主代表または家族利用者代表が納品情報と発注内容を確認してから受入を確定する                     |"``\]: ``目的で「店番担当（店主代表または家族利用者代表）」と定義しているのに、`T-01`・`T-02`・`T-07` の補足では同じ集合を「店主代表または家族利用者代表」と書き、`T-03`・`T-04`・`T-06` では「店番担当」と書いて表記がゆれているため、定義した呼称に統一する。``

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
