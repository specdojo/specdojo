---
specdojo:
  id: prj-0001:xep-t-kata-review-all-itc-index-sample-140-20261124t222718z-ad87f74b
  type: exec-plan
  rulebook: none
  task_id: T-KATA-REVIEW-ALL-itc-index-sample-140
  name: "R4 正しさ"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:itc-index-sample
    - specdojo:itc-index-sample
---

# Edit Plan: T-KATA-REVIEW-ALL-itc-index-sample-140

## 1. このフェーズで行うこと

kata のレビューの段 R4（正しさ）を行う。段の内容・読む範囲・観点・報告の形は [[specdojo:kata-guide|実践の型活用ガイド]]（docs/ja/specdojo/guides/kata-guide.md）の「kata を agent でレビューする」に従う。plan に展開された grade の finding は、この段の観点に当たるものだけを扱い、ほかは扱う段に任せる。前の段が直した版を読み、前の段の指摘を繰り返さない。
sample に書いてある事実（コマンド、オプション、キー、既定値、列挙値、パス、挙動）を、schema（docs/specdojo/schemas/v1/）、src/、コマンドリファレンス、必要なら --help や検証コマンドの実行と突き合わせる。主張ごとの確かめの表を result の実施内容に書き、誤りの直しの差分を sample に入れる。確かめられなかった主張も表に残す。指摘は同ガイドの「人への報告の形」に従い、executor は報告の handoff に 1 件ずつ 1 項目で書き、reporter は result の実施内容に Markdown の表として 1 回だけ書く（申し送りに表を重ねない）。駄菓子屋の業務の値のように正本のない仮定は、共通サンプル文脈と食い違わなければ確かめの対象にしない。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 内部結合テスト（全体構成）の完成例
- `depends_on`:
  - [[specdojo:tsp-index-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、内部結合テストの全体構成の完成例を示す
- `path`: `docs/ja/specdojo/samples/itc-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-REVIEW-ALL-itc-index-sample-140/T-KATA-REVIEW-ALL-itc-index-sample-140-20261124T222718Z-ad87f74b/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/itc-index-sample.md`
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

- F001 \[minor/vp-po-purpose-alignment; line=7; anchor=``"適用対象は、[[specdojo:ifd-sample|インフラ構成図]] の店頭操作端末・販売・在庫・つけ記録サービス・業務記録 DB を結ぶ `PATH-01`〜`PATH-03` である（[[specdojo:tsp-index-sample|テスト戦略・方針]] の内部結合テストの範囲に合わせる）。保全の取得（`PATH-04`）と復元の回復（`PATH-07`）は外部結合テストの範囲とし、本書では扱わない。内部結合テストで防ぐ業務リスクは次の2つで、いずれも店主代表が記録を信用できなくなり、店主不在の店番を任せられなくなる。"``\]: ``tsp-index-sample は応答欠落時の照合待ちの判定（`PATH-02` の遅延・無応答）を内部結合テストで確認すると定めていますが、本書の観点の型と分配表にこれに当たる観点・主担当がありません。`itc-sales-checkout` の「依存障害時の挙動」に応答欠落時の照合待ちを加え、分配表にも主担当を置いてください。``
- F002 \[minor/vp-pm-control-reporting; line=140; anchor=``"| _UNDECIDED_: 通信不能時の販売継続                    | 未確定取引の照合の観点が増える                       | 対象外とし、`itc-sales-checkout` に保留後の再送の観点を追加しない      | PM へリスクとして報告   |"``\]: ``「通信不能時の販売継続」は ifd-sample で既に `kinuya:pjr-i003` へ引き継がれていますが、本書は「PM へリスクとして報告」とだけ書き、既存の個票を参照していません。報告先に `kinuya:pjr-i003` を書き、二重登録を避けてください。``
- F003 \[minor/vp-arc-technical-constraints; line=101; anchor=`"| 取引番号の採番             | 実装の採番を使い、期待値には件数と差分だけを書く                          | 再送の条件に限り、テストから同じ取引番号を指定する |"`\]: ``依存の表に、tsp が IT で求める `PATH-02` の遅延・無応答を再現する手段（遅延・無応答を返すスタブなど）がありません。応答欠落時の照合待ちを決定的に再現するための依存の扱いを1行加えてください。``
- F004 \[minor/vp-arc-conciseness; line=38; anchor=``"- 保全の取得（`PATH-04`）と復元の回復（`PATH-07`）は tsp の定めで外部結合テストの範囲のため、term にしない。"``\]: ``「保全の取得（`PATH-04`）と復元の回復（`PATH-07`）は…term にしない」は、目的と適用対象の段落、および対象外の表の内容を繰り返しています。この箇条を削るか、「対象外・除外理由（共通）」への参照に置き換えてください。``
- F005 \[minor/vp-qe-verifiability; line=123; anchor=``"- `優先度`: 二重計上・記録の欠落・在庫の誤更新につながるものを P0、つけ残高の照会を P1、通知内容を P2 とする。"``\]: `優先度の基準にある「通知内容を P2」の「通知」が、本書の IT 範囲のどれに当たるか分かりません。P0〜P2 のいずれにも当たらないケースの扱いも決まっていないため、判定できる基準に書き直してください。`
- F006 \[minor/vp-qe-omissions-consistency; line=40; anchor=`"- 1 term の観点が 15 以上、ケース表が 50 行以上の場合は分割を検討する。"`\]: `分割基準が観点数と行数だけになっており、rulebook の「依存境界・環境要件が混在する場合は分割候補」と「1〜2 ケースしかない単位は原則統合する」が抜けています。本システムでの扱いを加えるか、適用しない理由を書いてください。`

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
