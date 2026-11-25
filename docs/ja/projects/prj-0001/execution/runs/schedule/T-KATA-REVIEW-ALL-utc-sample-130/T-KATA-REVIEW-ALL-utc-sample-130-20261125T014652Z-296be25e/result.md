---
specdojo:
  id: prj-0001:xer-t-kata-review-all-utc-sample-130-20261125t014652z-296be25e
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-utc-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-utc-sample-130/T-KATA-REVIEW-ALL-utc-sample-130-20261125T014652Z-296be25e/plan.md
  started_at: "2026-11-25T01:47:00.824Z"
  completed_at: "2026-11-25T01:59:26.884Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:utc-sample
    - specdojo:utc-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として `docs/ja/specdojo/samples/utc-sample.md` の文を直した。指摘は 7 件で、すべて直した。意味と判断に要る背景・例外・制約は変えていない。
- `prettier` 整形と `markdownlint-cli2` はともに通った。runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` も通った。 ## 指摘一覧 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R3-1 | R3 | 1. 概要 | 「`utc-&lt;term&gt;` は `utc-sales-checkout` であり、…の括り方に従う」で主語と述語がねじれている。 | 「`utc-sales-checkout` とし、term の括り方は … に従う」にした。 | W2 | - | | R3-2 | R3 | 2. 責務 | 取引番号の付与と印刷要求の送信が 1 項目に 2 つの判断として入っている。 | 「採番器が返す取引番号を付ける」と「確定1件につき、印刷要求を1回だけ送る」の 2 項目に分けた。 | 一項目一判断（`簡潔さと文章量を責務に合わせる`） | - | | R3-3 | R3 | 4. 境界/依存 | 括弧書き「（外れる扱いはない）」が文の途中に入っている。依存の表の前に、何の表かを示す 1 文がない。 | 「共通の扱いから外れる依存はない。」で文を切った。「次の表は、本 term のケースで使う依存と、その依存をテストで制御する方法を示す。」を足した。 | W3、表の前の 1 文（Sample 記述標準） | - | | R3-4 | R3 | 5. トレース | 表の前に、何の対応を示す表かの 1 文がない。 | 「次の表は、ケース表の `trace_key` と、根拠とした仕様ID・要点の対応を示す。」を足した。 | 表の前の 1 文（Sample 記述標準） | - | | R3-5 | R3 | 5. トレース（TR-04 の備考） | 「受領額不足の扱いを含めて解釈」では、どう解釈したかが読み取れない。 | 「受領額不足では確定しない扱いも含むと解釈」にした。責務と confirm-reject-020 と同じ意味である。 | W7 | - | | R3-6 | R3 | 5. トレース（TR-05 の備考） | 略語「UT」を正式名なしで使っている。 | 「単体テストは印刷要求データのみ確かめる」にした。 | W8 | - | | R3-7 | R3 | 6. テスト観点とケース | 3 つのケース表の前に、合格の条件を示す 1 文がない。証跡の欄の「暫定: ローカル実行結果、テストのパス、`kinuya-ci-unit` 整備後に差し替え」は、何を何へ差し替えるのか係り方があいまいである。 | 各表の前に合格の条件を示す 1 文を足した。証跡の欄を「暫定: `tests/unit/sales-checkout.test.ts` のローカル実行結果（`kinuya-ci-unit` 整備後に CI 実行結果へ差し替え）」にした。 | 表の前の 1 文（Sample 記述標準）、W5 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/utc-sample.md`: R3（読みやすさ）として文を直した。概要の主語と述語のねじれを解消し、責務の 1 項目 2 判断を 2 項目に分けた。境界/依存・トレース・テスト観点とケースの各表の前に、表の内容を示す 1 文を足した。TR-04 と TR-05 の備考と、全ケースの証跡の欄の書き方も明確にした。

## 3. 申し送り

- grade の F001・F002・F009 は、観点 `vp-po-decision-readiness`・`vp-pm-dependency-risk`・`vp-ops-release-readiness` に当たる。executor は、`kata-guide` の「kata の観点の組」が kata のレビューでこれらを使わないとしている、と報告した。そのため R3 では扱っていない。F003〜F008 は R1・R2・R4・R5 の観点とした。executor は、F003・F004・F005・F008 の内容は前の段で本文に入っていたと報告した。F006・F007（`utc-index-sample` との食い違い）は R5 が扱う、としている。
- R3-1: R3 / 1. 概要 / 「`utc-&lt;term&gt;` は `utc-sales-checkout` であり、…の括り方に従う」で主語と述語がねじれている / 「`utc-sales-checkout` とし、term の括り方は … に従う」にした / W2 / -
- R3-2: R3 / 2. 責務 / 取引番号の付与と印刷要求の送信が 1 項目に 2 つの判断として入っている / 「採番器が返す取引番号を付ける」と「確定1件につき、印刷要求を1回だけ送る」の 2 項目に分けた / 一項目一判断（`簡潔さと文章量を責務に合わせる`） / -
- R3-3: R3 / 4. 境界/依存 / 括弧書き「（外れる扱いはない）」が文の途中に入り、依存の表の前に何の表かを示す 1 文がない / 「共通の扱いから外れる依存はない。」で文を切り、「次の表は、本 term のケースで使う依存と、その依存をテストで制御する方法を示す。」を足した / W3、表の前の 1 文（Sample 記述標準） / -
- R3-4: R3 / 5. トレース / 表の前に何の対応を示す表かの 1 文がない / 「次の表は、ケース表の `trace_key` と、根拠とした仕様ID・要点の対応を示す。」を足した / 表の前の 1 文（Sample 記述標準） / -
- R3-5: R3 / 5. トレース / TR-04 の備考「受領額不足の扱いを含めて解釈」では、どう解釈したかが読み取れない / 「受領額不足では確定しない扱いも含むと解釈」にした（責務と confirm-reject-020 と同じ意味） / W7 / -
- R3-6: R3 / 5. トレース / TR-05 の備考で略語「UT」を正式名なしで使っている / 「単体テストは印刷要求データのみ確かめる」にした / W8 / -
- R3-7: R3 / 6. テスト観点とケース / 3 つのケース表の前に合格の条件を示す 1 文がない。全ケースの証跡の欄「暫定: ローカル実行結果、テストのパス、`kinuya-ci-unit` 整備後に差し替え」は、何を何へ差し替えるのかの係り方があいまい / 各表の前に合格の条件を示す 1 文を足した。証跡の欄を「暫定: `tests/unit/sales-checkout.test.ts` のローカル実行結果（`kinuya-ci-unit` 整備後に CI 実行結果へ差し替え）」にした / 表の前の 1 文（Sample 記述標準）、W5 / -
- grade の F001〜F009 は R3 の観点（`vp-ux-readability`・`vp-ux-language-consistency`・`vp-arc-conciseness`）に当たらないため扱わない。F001（`vp-po-decision-readiness`）・F002（`vp-pm-dependency-risk`）・F009（`vp-ops-release-readiness`）の観点は、kata-guide の「kata の観点の組」が kata のレビューでは使わないとしている。F003〜F008 は R1・R2・R4・R5 が扱う観点であり、F003・F004・F005・F008 の内容は前の段で本文に入っていた。F006・F007（utc-index-sample との食い違い）は R5 が扱う。

## 4. 進め方と実践の型の適用

approach は `sample-maintenance` である。`docs/ja/specdojo/guides/kata-guide.md` の「kata を agent でレビューする」の R3 に従い、文章のチェック項目（W1〜W10）と Sample 記述標準に照らして `utc-sample.md` の文だけを直した。前の段が直した版を読み、前の段の指摘は繰り返さなかった。意味と判断に要る背景・例外・制約は維持した。frontmatter の `status` は `draft` のままで、`ready` へ変えていない。grade の F001〜F009 は R3 の観点に当たらないため、この段では扱わず、扱う段に任せた。
