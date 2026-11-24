---
specdojo:
  id: prj-0001:xep-t-kata-review-all-utc-index-sample-130-20261124t215623z-e1fdde45
  type: exec-plan
  rulebook: none
  task_id: T-KATA-REVIEW-ALL-utc-index-sample-130
  name: "R3 読みやすさ"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:utc-index-sample
    - specdojo:utc-index-sample
---

# Edit Plan: T-KATA-REVIEW-ALL-utc-index-sample-130

## 1. このフェーズで行うこと

kata のレビューの段 R3（読みやすさ）を行う。段の内容・読む範囲・観点・報告の形は [[specdojo:kata-guide|実践の型活用ガイド]]（docs/ja/specdojo/guides/kata-guide.md）の「kata を agent でレビューする」に従う。plan に展開された grade の finding は、この段の観点に当たるものだけを扱い、ほかは扱う段に任せる。前の段が直した版を読み、前の段の指摘を繰り返さない。
同ガイドの「文章のチェック項目」（W1〜W10）と、その正本として挙げた規約を確かめ、文の直しの差分を sample に入れる。意味と判断に要る背景・例外・制約は変えない。指摘の根拠の列にはチェック項目の No か観点 ID を書く。報告は同ガイドの「人への報告の形」に従い、executor は報告の handoff に指摘を 1 件ずつ 1 項目（No・段・箇所・指摘・直した案・根拠・印）で書き、表の文字列にまとめない。reporter は handoff の指摘を result の実施内容に Markdown の表として 1 回だけ書き、申し送りには表を重ねない。迷った指摘に「要判断」の印を付ける。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 単体テスト（全体構成）の完成例
- `depends_on`:
  - [[specdojo:tsp-index-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、単体テストの全体構成の完成例を示す
- `path`: `docs/ja/specdojo/samples/utc-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-REVIEW-ALL-utc-index-sample-130/T-KATA-REVIEW-ALL-utc-index-sample-130-20261124T215623Z-e1fdde45/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/utc-index-sample.md`
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

- F001 \[minor/vp-arc-technical-constraints; line=24; anchor=``"| `utc-sales-checkout` | 請求額・釣銭の計算と、会計確定時の在庫引当           | 商品・在庫リポジトリは Fake       | 金額と在庫減算は BAC-01 で同時に確定し、同時に変更される |"``\]: ``括り方の表の `utc-sales-checkout` は依存の扱いを「商品・在庫リポジトリは Fake」としか書いていないが、「単体テスト共通の境界/依存の扱い」では会計確定 1 回につき `receipt-print` の Mock で要求 1 回を検証し、記録サービス Stub・採番器も注入するとしており、どの term がこれらの依存を持つかが読み取れないため、括り方の表の依存の扱いに `receipt-print` Mock・記録サービス Stub・採番器のうち該当するものを書き足す。``
- F002 \[minor/vp-arc-conciseness; line=105; anchor=``"`utc-sales-checkout` の1行の書き方は次のとおりとする（`証跡` は CI 整備後の書き方で、整備前は上記の暫定表記にする）。"``\]: `` `証跡` の暫定の書き方は line 103 で定めており、line 105 の括弧書き「整備前は上記の暫定表記にする」と line 117 の「整備前は `証跡` を暫定のローカル実行結果とし」が同じ内容を繰り返しているため、line 105 の括弧書きを削り、line 117 は差し替えの期限と担当だけにまとめる。 ``
- F003 \[minor/vp-dev-implementation-readiness; line=101; anchor=``"- `優先度`: 誤課金・在庫の誤更新につながるものを P0、つけ残高を P1、表示の書式変換を P2 とする。"``\]: `` `優先度` の決め方が「誤課金・在庫の誤更新」「つけ残高」「表示の書式変換」しか扱っておらず、`utc-sale-input` が受け持つ入力検証と未確定で保留する判定（BAC-03）にどの優先度を付けるかを DEV が決められないため、この区分の優先度とその理由を書き足す。 ``
- F004 \[minor/vp-dev-testability; line=103; anchor=``"- `証跡`: CI ジョブ `kinuya-ci-unit` の実行結果とテストコードの位置を書く。CI 未整備の間は「暫定: ローカル実行結果、CI 整備後に差し替え」と書く。"``\]: ``CI 整備前の `証跡` を「暫定: ローカル実行結果」としているが、どのコマンドでどの範囲（対象の `utc-＜term＞` のテスト）を実行し、何を失敗 0 件の判定に使うかが書かれていないため、整備前に DEV が実行する確認のコマンドと合格の判定（例: 単体テスト全件の失敗 0 件）を書き足す。``
- F005 \[minor/vp-qe-verifiability; line=16; anchor=``"単体テストの合否は [[specdojo:tsp-index-sample|テスト戦略・方針]] の品質ゲートに従い、CI ジョブ `kinuya-ci-unit`（架空）の失敗 0 件と、境界条件の観点がすべて実装済みであることを DEV が判定する。"``\]: ``単体テストの合否条件「境界条件の観点がすべて実装済み」は、観点の型に「境界条件」がなく境界は条件の区分であるため何を数えて判定するかが定まらず、CI ジョブ `kinuya-ci-unit` の整備前の判定手段も書かれていないため、「条件の立て方（共通）」の境界値の条件がすべてケース表にあり automated で実行済みであることなど判定対象を具体化し、整備前の暫定の判定方法を書き足す。``
- F006 \[minor/vp-qe-omissions-consistency; line=101; anchor=``"- `優先度`: 誤課金・在庫の誤更新につながるものを P0、つけ残高を P1、表示の書式変換を P2 とする。"``\]: `優先度のルールは「誤課金・在庫の誤更新につながるものを P0、つけ残高を P1」としているが、分配方針の表ではつけ残高の採用理由を「誤計算は請求・入金の誤りにつながる」（誤課金）としているため、つけ残高を P0 にするか、P1 とする理由（例: 店頭の会計と違い請求前に照合できる）を書き足して食い違いをなくす。`
- F007 \[minor/vp-qe-omissions-consistency; line=66; anchor=`"| 環境 | 固定クロックの日付（月末・月初）、記録サービス Fake の保存失敗         |"`\]: `条件の立て方の「環境」では「記録サービス Fake の保存失敗」としているが、単体テスト共通の境界/依存の扱いでは記録サービスを「保存成功・保存失敗・タイムアウトを返す Stub」としており、テストダブルの種類が食い違うため、条件の例を「記録サービス Stub の保存失敗」にそろえる。`
- F008 \[minor/vp-qe-omissions-consistency; line=109; anchor=``"| `ut-sales-checkout-stock-allocation-020` | 入力: 商品A×5 状態: 在庫5個 環境: なし | 会計を確定する | 請求額150円の販売が1件確定し、在庫が5個から0個になる | 戻り値の請求額、Fake の在庫数 | 在庫リポジトリ Fake | BAC-01 / C-02 | P0     | automated | `kinuya-ci-unit` の実行結果 |"``\]: `` `証跡` の決め方では「CI ジョブ `kinuya-ci-unit` の実行結果とテストコードの位置を書く」としているが、記入例の `証跡` は「`kinuya-ci-unit` の実行結果」だけでテストコードの位置がなく、共通カラムの決め方と記入例が食い違うため、記入例にテストコードの位置（例: テストファイルとテスト名）を書き足す。 ``
- F009 \[minor/vp-ops-release-readiness; line=116; anchor=`"| _UNDECIDED_: 通信不能時の販売継続               | 対象外・除外理由（共通）                | 対象外とし、未確定取引の保留判定を UT に追加しない。初期リリースの範囲確定までに決める                                             | PM へリスクとして報告   |"`\]: ``前回あった ready 化の論点の記述が削られた結果、`_UNDECIDED_`（通信不能時の販売継続）と `_ASSUMPTION_`（CI ジョブ `kinuya-ci-unit` の整備）を残したまま ready にしてよいかが読み取れず、報告先も「PM へ」だけで転送先の PJR が示されていないため、ドキュメントメタ情報標準に沿って ready にする前に各ラベルを PJR（リスク登録簿・決定記録など）へ転送先を明記して引き継ぎラベルを外すことを書き足す。``

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
