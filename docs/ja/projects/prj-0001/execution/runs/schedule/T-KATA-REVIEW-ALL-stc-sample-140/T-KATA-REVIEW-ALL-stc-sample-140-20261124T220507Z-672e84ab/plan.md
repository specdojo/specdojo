---
specdojo:
  id: prj-0001:xep-t-kata-review-all-stc-sample-140-20261124t220507z-672e84ab
  type: exec-plan
  rulebook: none
  task_id: T-KATA-REVIEW-ALL-stc-sample-140
  name: "R4 正しさ"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:stc-sample
    - specdojo:stc-sample
---

# Edit Plan: T-KATA-REVIEW-ALL-stc-sample-140

## 1. このフェーズで行うこと

kata のレビューの段 R4（正しさ）を行う。段の内容・読む範囲・観点・報告の形は [[specdojo:kata-guide|実践の型活用ガイド]]（docs/ja/specdojo/guides/kata-guide.md）の「kata を agent でレビューする」に従う。plan に展開された grade の finding は、この段の観点に当たるものだけを扱い、ほかは扱う段に任せる。前の段が直した版を読み、前の段の指摘を繰り返さない。
sample に書いてある事実（コマンド、オプション、キー、既定値、列挙値、パス、挙動）を、schema（docs/specdojo/schemas/v1/）、src/、コマンドリファレンス、必要なら --help や検証コマンドの実行と突き合わせる。主張ごとの確かめの表を result の実施内容に書き、誤りの直しの差分を sample に入れる。確かめられなかった主張も表に残す。指摘は同ガイドの「人への報告の形」に従い、executor は報告の handoff に 1 件ずつ 1 項目で書き、reporter は result の実施内容に Markdown の表として 1 回だけ書く（申し送りに表を重ねない）。駄菓子屋の業務の値のように正本のない仮定は、共通サンプル文脈と食い違わなければ確かめの対象にしない。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 総合テスト（対象別）の完成例
- `depends_on`:
  - [[specdojo:stc-index-sample]]
- `overview`: 駄菓子屋の店頭販売の業務を題材に、総合テストの対象別の完成例を示す
- `path`: `docs/ja/specdojo/samples/stc-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-REVIEW-ALL-stc-sample-140/T-KATA-REVIEW-ALL-stc-sample-140-20261124T220507Z-672e84ab/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/stc-sample.md`
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

- F001 \[minor/vp-arc-conciseness; line=33; anchor=`"| 実施           | 環境とデータの準備は DEV、実施と証跡の照合・合否判定は QE                                                                                                                                        |"`\]: ``境界/環境/依存の「実施」行（環境とデータの準備は DEV、実施・照合・合否判定は QE）と「外部依存」行の保管サービスの実接続は、`stc-index-sample` の「総合テスト共通の境界/環境の扱い」の責任行・外部依存行の再掲であり、共通方針への参照に置き換えて対象固有の差分（スタブの種類など）だけを残せる。``
- F002 \[minor/vp-qe-omissions-consistency; line=61; anchor=`"会計確定と同時に、販売記録1件と在庫減算が同じ取引番号で残り、確定前に取り消した取引は何も残さないことを保証する。"`\]: ``観点「販売確定成立」の意図が「確定で記録が残る」と「確定前の取消で何も残らない」の2つの合否命題を含み、stc-index の「1観点＝1合否命題」と食い違うため、取消ケース `st-cash-sale-flow-success-030` を別観点へ分けるか、両方を1つの命題として言い表せる意図に改める必要がある。``
- F003 \[minor/vp-qe-omissions-consistency; line=19; anchor=``"- 対象外: 印刷コマンドの全終了コードと再試行の分類（理由: 契約の網羅は境界の責務、代替: ET の `receipt-print` 連携。ST は用紙切れと結果不明の2種だけを扱う）"``\]: ``対象外「印刷コマンドの全終了コードと再試行の分類」は `stc-index-sample` の「対象外・除外理由（共通）」の「印刷コマンド・保管サービスの全障害パターン」行と除外内容・代替（ET の `receipt-print` 連携）が重複しており、rulebook の「共通の対象外と重複させず対象固有の除外だけを示す」に反するため、共通行への参照に置き換え、本 term で再現する2種（用紙切れ・印字結果不明）の限定だけを例外として残す必要がある。``
- F004 \[minor/vp-qe-kata-conformance; line=67; anchor=``"| `st-cash-sale-flow-success-010` | 入力: 商品A 2個 / 状態: 在庫5個              | 商品Aを2個登録し、60円で会計を確定する           | 販売記録が1件（数量2・60円）でき、在庫が5個から3個になる                   | 販売記録、在庫記録                 | `kinuya-st`、プリンタ検証機 | TR-01,TR-02 | P0     | automated | `kinuya-ci-st` の run、取引番号 |"``\]: `` `stc-index-sample` の記入例（同ファイル134〜135行目）では `st-cash-sale-flow-success-010` のトレースが `TR-01`、`st-cash-sale-print-failure-010` が `TR-02` で手順文も異なるが、本書では `TR-01,TR-02`・`TR-02,TR-03` となっており、同じ `case_id` の記述が文書間で食い違うため、どちらかに揃える必要がある。 ``
- F005 \[minor/vp-ux-language-consistency; line=71; anchor=`"### 6.2. 観点: 未確定停止"`\]: ``観点名「未確定停止」に対して意図は「会計確定後に印刷だけが失敗しても会計を取り消さず」であり、確定済みの会計を「未確定」と呼ぶ名称が内容と逆になって読み手を混乱させるため、`print-failure` に即した観点名（例: 印刷失敗時の会計維持）にするか、stc-index の分配表と併せて名称を見直す必要がある。``

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
