---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-change-sample-120-20261125t072913z-99dd9eb6
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-change-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-change-sample-120/T-KATA-REVIEW-ALL-opr-change-sample-120-20261125T072913Z-99dd9eb6/plan.md
  started_at: "2026-11-25T07:29:22.795Z"
  completed_at: "2026-11-25T07:44:07.525Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-change-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）を実施した。編集対象の `docs/ja/specdojo/samples/opr-sample.md` で、運用変更作業の表の後ろにある 1 段落を、適用前の段落とロールバックの段落に分けて並べ替えた。
- `docs/ja/specdojo/samples/opr-change-sample.md` の章の移動 2 件と、順序の要判断 1 件は、sample に反映していない。executor は案を handoff に残した。
- grade の finding F001〜F004 は R2 の観点（`vp-arc-document-structure`、`vp-qe-omissions-consistency`）に当たらない。そのため扱っていない。
- 検証は、executor 実行の prettier と markdownlint が passed だった。runner 実行では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed だった。変更の種類に当たらない検査は `not_applicable` である。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-sample.md`: 運用変更作業の表の直後の段落を 2 つに分けた。1 つ目は適用前の段落で、検証、承認、前日の閉店時の周知の順に書き、表示の修正は周知しない。2 つ目はロールバックの段落で、ロールバック条件に当たったら戻し、同じ確認をして理由を書く。template が示す「適用前の確認、適用、ロールバック」の順で読めるようにした（3 行追加、1 行削除）。

## 3. 申し送り

- R2 の指摘は、executor handoff の No 1〜4 と同じ内容である。No 1 は `opr-sample.md` に反映済みで、No 2・No 3 は案のみで未反映、No 4 は人の判断待ちである。
- No 2 と No 3 は、いずれも `opr-change-sample.md` の章の移動案である。今回の編集対象は `opr-sample.md` だけなので、`opr-change-sample.md` を直す別タスクで扱う必要がある。
- No 4 の「影響の範囲の判定」と「変更種別と承認・実施条件」の順は、前提から結論の順と template の表先置きが食い違う。入れ替えるかどうかは、人が判断する。
- No: 1 / 段: R2 / 箇所: docs/ja/specdojo/samples/opr-sample.md の運用変更作業（表の直後の段落） / 指摘: 表の後ろの 1 段落が「検証 → ロールバック → 事前周知」の順で、適用前の周知がロールバックの後にある。template の運用変更作業が示す「適用前の確認、適用、ロールバックの操作」の順で読めない。 / 直した案: 段落を「検証してから承認を求める → 前日の閉店時に周知する（表示の修正は周知しない）」の適用前の段落と、「ロールバック条件に当たったら戻し、同じ確認をして理由を書く」の段落の 2 つに分け、この順にした（sample に反映済み）。 / 根拠: docs/ja/specdojo/templates/opr-template.md の運用変更作業の記入指示、[[specdojo:opr-rulebook]] の記述ガイドの運用変更作業、[[specdojo:opr-change-sample]] の適用の手順（承認 → 事前周知 → 適用 → 確認）。 / 印: なし
- No: 2 / 段: R2 / 箇所: docs/ja/specdojo/samples/opr-change-sample.md の手順適用範囲・前提（表の後ろの「手順を新しく書いたときや改訂したときは…」の段落） / 指摘: 運用作業の受入確認（検証用の環境で版の更新とロールバックを模擬する）が前提の章にある。rulebook はこの確認を成果物の章ではないとし、結果を証跡の章に残すよう求めている。opr-sample.md は同じ内容を証跡の章の表の後ろに置いており、置き方が揃っていない。 / 直した案: この段落を証跡の章の表の後ろ（「戻した変更も…」の文の後ろ）へ移す。末尾の「結果は証跡の章の手順の確認の記録に残す。」は「結果は手順の確認の記録に残す。」に縮める。今回の編集対象は opr-sample.md だけのため、反映していない。 / 根拠: [[specdojo:opr-rulebook]] の「運用作業の受入確認」、[[specdojo:opr-sample]] の証跡の章の最後の段落。 / 印: なし
- No: 3 / 段: R2 / 箇所: docs/ja/specdojo/samples/opr-change-sample.md の「ロールバックとエスカレーション」の最後の段落（`OPS` が月次点検で変更件数・ロールバック件数とその理由を `PO` へ報告する） / 指摘: 月次点検で行う報告が、戻しの手順の節にある。点検を扱う章は「`opr-index` 参照。」だけで、本書に固有の月次の作業が読み手から見えない。 / 直した案: この段落を日次・週次・月次点検手順の章へ移し、「`opr-index` 参照。月次点検では、`OPS` が変更記録から…`PO` へ報告する。」とする。今回の編集対象は opr-sample.md だけのため、反映していない。 / 根拠: [[specdojo:opr-rulebook]] の本文要件（分冊は差分の手順を該当する章に書く）と記述ガイドの日次/週次/月次点検手順、docs/ja/specdojo/templates/opr-template.md の章の順。 / 印: なし
- No: 4 / 段: R2 / 箇所: docs/ja/specdojo/samples/opr-change-sample.md の運用変更作業（「変更種別と承認・実施条件」と「影響の範囲の判定」の順） / 指摘: 「影響の範囲の判定」は変更種別を決める節なので、前提から結論の順では「変更種別と承認・実施条件」の表より前に来る。一方で、判定の文は表の承認者を参照しており、template も運用変更作業の表を先に置いている。 / 直した案: 直さない（今の順を維持する）。前提から結論の順を優先して 2 つの節を入れ替えるかどうかを、人が判断する。 / 根拠: docs/ja/specdojo/templates/opr-template.md の運用変更作業（表が先）、kata-guide の R2 の確かめること（前提から結論の順に読めるか）。 / 印: 要判断
- grade の finding F001〜F004 は、どれも R2 の観点（`vp-arc-document-structure`、`vp-qe-omissions-consistency`）に当たらない。R1 の申し送り（No 2・No 3）で扱い済みのため、ここでは繰り返していない。

## 4. 進め方と実践の型の適用

根拠は、`opr-rulebook` の記述ガイドと本文要件、`opr-template.md` の運用変更作業の記入指示、kata-guide の R2 の観点である。R1 が直した版を読み、R1 の指摘は繰り返していない。矛盾する場合は rulebook を正とした。`opr-sample.md` の段落の順は template の手順の順に合わせて改訂し、ほかの記述は整合しているため維持した。rulebook など sample 以外は変更していない。F001〜F004 は R2 の観点ではないため未対応で、該当する段の担当に任せる。grade result のサイドカーは直接編集していない。
