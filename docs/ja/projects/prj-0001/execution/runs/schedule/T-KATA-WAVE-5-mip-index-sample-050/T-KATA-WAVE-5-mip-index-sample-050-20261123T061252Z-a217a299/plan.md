---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-mip-index-sample-050-20261123t061252z-a217a299
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-mip-index-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: sample-maintenance
  targets:
    - specdojo:mip-index-sample
    - specdojo:mip-index-sample
---

# Edit Plan: T-KATA-WAVE-5-mip-index-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 移行計画の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、移行計画の完成例を示す
- `path`: `docs/ja/specdojo/samples/mip-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-mip-index-sample-050/T-KATA-WAVE-5-mip-index-sample-050-20261123T061252Z-a217a299/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/mip-index-sample.md`
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

- F001 \[minor/vp-ba-stakeholder-clarity; line=96; anchor=`"| 体制     | 開発担当が閉店後の日次締めに立ち会い、店舗運営アドバイザーが店番の引継ぎで困った点を聞き取る          |"`\]: `ハイパーケアの体制に挙げた「店舗運営アドバイザー」が「体制・役割（GO判断含む）」の表に載っておらず、移行後支援での責務と連絡先が分からないため、体制表へ行を加えて責務と連絡/判断を定義する。`
- F002 \[minor/vp-arc-technical-constraints; line=12; anchor=`"- _ASSUMPTION_: 平日の午前は来店が少ないため、切替当日は午前に取り込みと動作確認を行い、下校時間に来店が増える午後から本番で利用する。閉店時間は変えない。"`\]: `顧客の氏名・連絡先を転記用の表を経由して移すのに、「前提・制約」に個人情報の取り扱い（転記用の表の保管・廃棄、端末の保護）の制約がなく、rulebook の記述ガイドが求める法務/セキュリティ制約の例を欠くため、1 項目を追加する。`
- F003 \[minor/vp-qe-verifiability; line=44; anchor=`"| 業務停止時間   | 0 時間（開店時間を変えない）      | 切替日の午前（取り込み・動作確認）                                | 移行作業の記録表に書いた開始・終了時刻         | 店主代表 | 午後の開店までに終わらなければ延期し、ノートだけで営業する               |"`\]: `業務停止時間の基準「0 時間」に対し、証跡が移行作業の開始・終了時刻になっていて停止の有無を測れないため、証跡を「通常の開店時刻どおりに販売を受け付けたかの記録」などに改める。`
- F004 \[major/vp-qe-omissions-consistency; line=12; anchor=`"- _ASSUMPTION_: 平日の午前は来店が少ないため、切替当日は午前に取り込みと動作確認を行い、下校時間に来店が増える午後から本番で利用する。閉店時間は変えない。"`\]: `「平日の午前は来店が少ない」で午前の営業を前提にしながら、「切替日の午前は販売しない」（line 71）や「午後の開店前」（line 52）とも書いており、成功条件の「業務停止時間 0 時間」（line 44）と矛盾するため、切替日の午前を休業扱いにして停止許容時間を明記するか、午前の営業を続ける前提に揃える。`
- F005 \[minor/vp-qe-kata-conformance; line=31; anchor=`"| 区分   | 対象                                                 | 補足                                                                                    |"`\]: `rulebook の記述ガイドが対象一覧に含めるよう求める「機能」「I/F」の区分が表になく、該当しない場合の書き方も示していないため、機能（販売・在庫・つけの各画面）の行と、I/F が「なし（仕入先連携は対象外）」である旨の行を加える。`
- F006 \[minor/vp-ux-language-consistency; line=27; anchor=`"| 正本切替   | 並行記録の最終日の閉店後 | システムの記録を正本にし、ノートへの記録をやめる             | 店主代表が正本切替を承認し、以後の販売・つけの記録先をシステムだけにしたことを店番担当へ伝えた |"`\]: `正本切替の完了条件にある伝達先「店番担当」が体制表の役割名と一致せず指す相手が曖昧になるため、「家族利用者代表」など体制表の役割名に揃える。`

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
