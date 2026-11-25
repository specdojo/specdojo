---
specdojo:
  id: prj-0001:xep-t-kata-review-all-etc-sample-130-20261125t012658z-ae026697
  type: exec-plan
  rulebook: none
  task_id: T-KATA-REVIEW-ALL-etc-sample-130
  name: "R3 読みやすさ"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:etc-sample
    - specdojo:etc-sample
---

# Edit Plan: T-KATA-REVIEW-ALL-etc-sample-130

## 1. このフェーズで行うこと

kata のレビューの段 R3（読みやすさ）を行う。段の内容・読む範囲・観点・報告の形は [[specdojo:kata-guide|実践の型活用ガイド]]（docs/ja/specdojo/guides/kata-guide.md）の「kata を agent でレビューする」に従う。plan に展開された grade の finding は、この段の観点に当たるものだけを扱い、ほかは扱う段に任せる。前の段が直した版を読み、前の段の指摘を繰り返さない。
同ガイドの「文章のチェック項目」（W1〜W10）と、その正本として挙げた規約を確かめ、文の直しの差分を sample に入れる。意味と判断に要る背景・例外・制約は変えない。指摘の根拠の列にはチェック項目の No か観点 ID を書く。報告は同ガイドの「人への報告の形」に従い、executor は報告の handoff に指摘を 1 件ずつ 1 項目（No・段・箇所・指摘・直した案・根拠・印）で書き、表の文字列にまとめない。reporter は handoff の指摘を result の実施内容に Markdown の表として 1 回だけ書き、申し送りには表を重ねない。迷った指摘に「要判断」の印を付ける。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 外部結合テスト（対象別）の完成例
- `depends_on`:
  - [[specdojo:etc-index-sample]]
- `overview`: 駄菓子屋の販売管理システムと 1 つの外部サービスの連携を題材に、外部結合テストの対象別の完成例を示す
- `path`: `docs/ja/specdojo/samples/etc-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-REVIEW-ALL-etc-sample-130/T-KATA-REVIEW-ALL-etc-sample-130-20261125T012658Z-ae026697/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/etc-sample.md`
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

- F001 \[minor/vp-pm-control-reporting; line=39; anchor=``"_UNDECIDED_: [[specdojo:ifx-cmd-sample|レシート印刷コマンド連携仕様]] は上限30秒・送信前ビジー時の自動再試行（最大3回）を定めており、`etc-index` の応答待ち10秒・自動再送なしと食い違う。本書は `etc-index` に従い、送信前ビジーも自動再送しない期待値にしている。両者の値が揃った時点で、ケース `et-receipt-print-failure-handling-020` の期待値を更新する。"``\]: `` `_UNDECIDED_` の値の食い違いについて、登録簿（PJR）への転記候補であることと記録先が示されていない。進捗・課題の管理へどう引き継ぐかが読み取れない。 ``
- F002 \[minor/vp-dev-testability; line=31; anchor=``"| 依存の扱い   | 正常・用紙切れ・権限不足・入力不正は検証機へ実接続する。無応答・応答 JSON の欠落・送信前ビジーは `receipt-print` スタブで再現する             |"``\]: ``境界表で「入力不正は検証機へ実接続する」とし、概要でも終了コード `2` を挙げているが、終了コード `2` を判別するケースが条件・ケース表にない。契約観点「印刷結果の判別」の検証に漏れがある。``
- F003 \[minor/vp-qe-verifiability; line=84; anchor=``"| `et-receipt-print-failure-handling-030` | 入力: 明細2件。状態: 用紙切れ。環境: 検証機                         | 会計を確定し、印刷の終了を待つ | 終了コード `1`、印字状態が `unknown`、会計確定の通知と釣銭表示は残る | 印字状態、販売 CLI の終了コード `0`、警告の表示 | 検証機に実接続（用紙を抜く）             | TR-04       | P0     | manual    | 検証記録、取引番号、マスク済み stderr                                    |"``\]: ``ケース `et-receipt-print-failure-handling-030` の期待値「終了コード `1`」の主語（`receipt-print` か販売 CLI か）が明記されていない。観測点の「販売 CLI の終了コード `0`」と並ぶため、判定する対象を取り違えるおそれがある。``
- F004 \[minor/vp-qe-verifiability; line=82; anchor=``"| `et-receipt-print-failure-handling-010` | 入力: 明細2件の会計確定。状態: 用紙あり。環境: 印刷コマンドが無応答 | 会計を確定し、印刷の応答を待つ | 10秒で打ち切り、販売記録が1件のまま、印刷失敗の警告を表示する        | 販売記録の件数、印刷要求の回数、警告の表示      | 無応答スタブ、応答待ち10秒、自動再送なし | TR-01,TR-05 | P0     | automated | `tests/et/receipt-print/failure-handling.test.ts`、CI run 番号、取引番号 |"``\]: ``ケース `et-receipt-print-failure-handling-010` は無応答の打ち切りを扱うが、期待値と観測点に販売記録の印字状態（ifx-cmd-sample の `timeout_action` に従えば `unknown`）がなく、打ち切り後の状態を判定できない。期待値に印字状態 `unknown` を加え、観測点にも印字状態を入れる。``
- F005 \[minor/vp-qe-omissions-consistency; line=7; anchor=``"- 関連I/F: `receipt-print` の起動（入力 `receipts/receipt-YYYYMMDD-NNNN.txt`、stdout の結果 JSON、終了コード `0`・`1`・`2`・`5`）。"``\]: ``関連I/Fに挙げた終了コード `2` に対応するケースがなく、概要・境界表の記述とケース表の範囲が一致していない。``
- F006 \[minor/vp-qe-kata-conformance; line=39; anchor=``"_UNDECIDED_: [[specdojo:ifx-cmd-sample|レシート印刷コマンド連携仕様]] は上限30秒・送信前ビジー時の自動再試行（最大3回）を定めており、`etc-index` の応答待ち10秒・自動再送なしと食い違う。本書は `etc-index` に従い、送信前ビジーも自動再送しない期待値にしている。両者の値が揃った時点で、ケース `et-receipt-print-failure-handling-020` の期待値を更新する。"``\]: ``突き合わせ先 `docs/ja/specdojo/samples/ifx-cmd-sample.yaml` の `timeout_seconds: 30`・`retry.max_attempts: 3` と、本書と etc-index-sample の「応答待ち10秒・自動再送なし」が相反したままである。`_UNDECIDED_` で明示はされているが、サンプル間の値の不整合は未解消である。``
- F007 \[minor/vp-ux-language-consistency; line=67; anchor=``"| `et-receipt-print-contract-030` | 入力: 明細2件。環境: スタブが終了コード `0` で結果 JSON を返さない | 会計を確定し、印刷の終了を待つ | 印字状態が `unknown`、印刷失敗の警告を表示、販売記録は1件   | 印字状態、販売記録件数、警告の表示     | スタブ         | TR-02       | P0     | automated | `tests/et/receipt-print/contract.test.ts`、CI run 番号、取引番号 |"``\]: ``印字状態 `unknown` のケース（`et-receipt-print-contract-030`、`et-receipt-print-failure-handling-010`）で警告を「印刷失敗の警告」と呼んでおり、責務で区別した「印刷失敗」と「結果不明」の呼び方が混同されている。結果不明の警告であることが分かる呼び方に揃える。``

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
