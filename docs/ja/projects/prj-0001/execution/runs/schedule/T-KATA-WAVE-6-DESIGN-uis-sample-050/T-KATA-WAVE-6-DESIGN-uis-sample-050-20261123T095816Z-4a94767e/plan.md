---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-design-uis-sample-050-20261123t095816z-4a94767e
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-DESIGN-uis-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: UX
  approach: sample-maintenance
  targets:
    - specdojo:uis-sample
    - specdojo:uis-sample
---

# Edit Plan: T-KATA-WAVE-6-DESIGN-uis-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 画面仕様の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、画面仕様の完成例を示す
- `path`: `docs/ja/specdojo/samples/uis-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-DESIGN-uis-sample-050/T-KATA-WAVE-6-DESIGN-uis-sample-050-20261123T095816Z-4a94767e/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/uis-sample.md`
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

- F001 \[minor/vp-ba-requirements-completeness; line=130; anchor=`"| 商品コード未登録             | 入力コードが商品台帳にない                           | 「商品コードが登録されていません」と入力コード                           | 入力を保持。明細は追加しない                                           | 入力を確かめるか「商品検索」で選ぶ                                  |"`\]: `商品の存在は会計確定時にも確認するが、「商品コード未登録」の次の手は入力確認・商品検索だけで、既存明細の商品が台帳からなくなった場合の解消方法が示されていないため、対象明細の削除など再確定できる状態へ戻す操作を追記する。`
- F002 \[minor/vp-arc-conciseness; line=35; anchor=`"| 明細の数量               | 入力 | 購入数量、個単位                                 | 可       | 初回追加は 1。同じ商品の追加で 1 増加                  |"`\]: `数量の「初回追加は1」「同じ商品の追加で1増加」は本文76行の商品追加の結果と二重定義になっているため、表示項目側を更新契機と「商品追加」への参照に置き換え、操作結果を正本に集約する。`
- F003 \[minor/vp-qe-omissions-consistency; line=130; anchor=`"| 商品コード未登録             | 入力コードが商品台帳にない                           | 「商品コードが登録されていません」と入力コード                           | 入力を保持。明細は追加しない                                           | 入力を確かめるか「商品検索」で選ぶ                                  |"`\]: `本文115行では商品の存在を追加時と会計確定時に判定するが、対応する「商品コード未登録」の状態説明は「明細は追加しない」と追加時だけを扱っているため、確定時に検出した場合の既存明細・集計・取引状態の扱いを区別して記載する。`
- F004 \[minor/vp-qe-omissions-consistency; line=131; anchor=`"| 販売対象外                   | 追加時または確定時に販売停止を検出                   | 「現在販売できない商品です」と商品名                                     | 確定せず登録中を保持                                                   | 別の商品を選ぶか、明細内なら「明細削除」                            |"`\]: `「販売対象外」の発生条件は追加時と確定時の両方だが、状態の扱いは「確定せず登録中を保持」と確定時だけを記しているため、追加時に検出した場合は入力を保持し明細を追加しないことを区別して記載する。`
- F005 \[minor/vp-qe-kata-conformance; line=130; anchor=`"| 商品コード未登録             | 入力コードが商品台帳にない                           | 「商品コードが登録されていません」と入力コード                           | 入力を保持。明細は追加しない                                           | 入力を確かめるか「商品検索」で選ぶ                                  |"`\]: `uis-rulebook の「エラー表示と利用者の次の手」は回復操作とその結果を求めているが、会計確定時の商品未登録に対する回復が追加時の説明に含まれていないため、確定を拒否した後に利用者が何を変更すれば再開できるかを完成例に補う。`
- F006 \[minor/vp-ux-readability; line=10; anchor=`"- 商品コードは手入力するか、入力欄を選択した状態でバーコードスキャナから読み取るし、スキャンで商品追加を確定する。"`\]: `「バーコードスキャナから読み取るし」は接続表現の誤記で入力方式の説明を読みづらくしているため、「バーコードスキャナから読み取り、スキャンで商品追加を確定する」など自然な文に修正する。`

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
