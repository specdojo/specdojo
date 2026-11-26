---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-support-sample-110-20261125t061645z-15cb060f
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-support-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-support-sample-110/T-KATA-REVIEW-ALL-opr-support-sample-110-20261125T061645Z-15cb060f/plan.md
  started_at: "2026-11-25T06:16:54.571Z"
  completed_at: "2026-11-25T06:31:11.925Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-support-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）として、`opr-support-sample` を opr-rulebook と Sample 記述標準に照らして確認した。要る内容の欠けはなく、不足を補う追記はしていない。
- 重複していて表とも食い違う 1 文を「証跡」章から削った。変更は sample 1 ファイル、1 行の削除と 1 行の置換である。
- grade の F001 と F004 は kata のレビューで外す観点（`vp-po-decision-readiness`、`vp-ops-release-readiness`）に当たるため、sample は変更していない。F002 は R4、F003 は R5 で扱う。
- 検証は、executor の prettier と markdownlint、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` がすべて通った。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-support-sample.md`: 「証跡」章の表の前にあった「保存先と参照権限は `opr-index` の証跡の表と同じとする。」を削除した。表が保存先と参照権限を直接示しており、この文は重複する。`opr-index` の表にない「引き継ぎの記録」「操作メモ」の行もあり、表と食い違っていた。

## 3. 申し送り

- R1 で指摘 5 件のうち、sample に反映したのは No.1 のみ。No.2 と No.5 は「要判断」の印が付いている。
- No.2 の F001・F004 は、kata-guide の「kata の観点の組」で kata のレビューに使わないと定められた観点に当たる。sample は変更せず、grade が kata にこの 2 観点を当てないよう、観点の選び方を見直す案を出す。
- No.3 の F002（保管期間が `_UNDECIDED_` のまま）は R4 で扱う。opd-index-sample の方針と照らし、仮の値を置くか、未決事項の表で扱うかを決める。
- No.4 の F003 は R5 で扱う。`opr-incident-sample` は既にあるのに導線の表では「予定」になっている。R5 で wikilink と「作成済」に直し、`opr-sample` と `opr-index-sample` の呼び方もそろえる。
- No.5 では、plan の編集対象が rulebook の sample 宣言から `opr-sample.md` に決まっていた。レビューの対象は `opr-support-sample.md` だった。本段は `opr-support-sample.md` を直し、`opr-sample.md` は変更していない。kata のレビューの plan は編集対象をレビューする sample 自身に決めるよう、plan の作り方を見直す案を出す。
- grade result サイドカーは直接編集していない。F001〜F004 の解消状態は再評価時に更新される。
- No: 1 / 段: R1 / 箇所: docs/ja/specdojo/samples/opr-support-sample.md の「証跡」章、表の前の文 / 指摘: 「保存先と参照権限は `opr-index` の証跡の表と同じとする。」は、表が保存先と参照権限を直接示しているので要らない。`opr-index` の表にない「引き継ぎの記録」「操作メモ」の行もあり、表と食い違っている / 直した案: この文を削り、表の前の 1 文だけを残した（sample に反映済み） / 根拠: Sample 記述標準の「最小の記述量で完成例として成立させる」、`vp-arc-single-responsibility` / 印: なし
- No: 2 / 段: R1 / 箇所: 同 sample の「概要」の未決事項の表（grade F001・F004） / 指摘: 決定者・期限の列や ready 化の判断基準がないという finding だが、kata-guide の「kata の観点の組」は `vp-po-decision-readiness`・`vp-ops-release-readiness` を kata のレビューで使わないと定めている（承認と ready 化は登録簿で追う） / 直した案: sample は変更しない。grade が kata にこの 2 観点を当てないよう、grade 側の観点の選び方を見直す案を出す / 根拠: docs/ja/specdojo/guides/kata-guide.md「kata の観点の組」の外す観点の表、Sample 記述標準の「承認の進み具合を書かない」 / 印: 要判断
- No: 3 / 段: R1→R4 / 箇所: 同 sample の「証跡」章の保管期間の列（grade F002。anchor は opr-sample の証跡の表の行） / 指摘: 保管期間がほぼ `_UNDECIDED_` で水準の例がない。観点は `vp-qe-verifiability` で R4 が扱う / 直した案: R1 では変更しない。R4 で opd-index-sample の方針と照らし、仮の値を置くか、未決事項の表で扱うかを決める / 根拠: kata-guide「kata の観点の組」の R4 の行 / 印: なし
- No: 4 / 段: R1→R5 / 箇所: 同 sample の「関連ドキュメント導線」の表の `opr-incident` の行（「予定」）と、本文中の `opr-index` の呼び方（grade F003） / 指摘: opr-incident-sample は既にあるのに「予定」になっている。本書を指す id も opr-sample と opr-index-sample で揺れている。kata どうしの整合の問題なので R5 で扱う / 直した案: R5 で opr-incident-sample への wikilink と「作成済」に直し、opr-sample と opr-index-sample の呼び方をそろえる / 根拠: kata-guide「kata の観点の組」の R5 の行（kata 相互の `vp-qe-kata-conformance`） / 印: なし
- No: 5 / 段: R1 / 箇所: plan の編集対象 / 指摘: plan の「編集対象」は rulebook の sample 宣言から docs/ja/specdojo/samples/opr-sample.md に決まっていたが、レビューの対象（根拠となる成果物の path）は opr-support-sample.md だった。本段は opr-support-sample.md を直したものとして扱い、opr-sample.md は変更していない / 直した案: kata のレビューの plan は、編集対象をレビューする sample 自身に決めるよう、plan の作り方を見直す / 根拠: plan の「根拠となる成果物と編集対象」と kata-guide「段と渡す材料」（直すのは対象の kata だけ） / 印: 要判断
- 適用外の検証: `npm run validate:history-links`（変更したのは samples 配下の sample だけで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

根拠にしたのは、opr-rulebook、Sample 記述標準（最小の記述量で完成例として成立させる）、kata-guide の「kata の観点の組」、`vp-arc-single-responsibility` である。R1 では、種別の責務と rulebook の目的に対し、要る内容の欠けと要らない内容の混入を確かめた。結果、欠けはなく、要らない内容は重複する 1 文だけだった。整合している記述は維持した。F001・F004 は kata のレビューで外す観点のため見送った。F002 は R4、F003 は R5 に回した。根拠不足による見送りではなく、段の分担に従った扱いである。
