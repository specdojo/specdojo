---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-change-sample-110-20261125t055844z-d7db9a59
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-change-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-change-sample-110/T-KATA-REVIEW-ALL-opr-change-sample-110-20261125T055844Z-d7db9a59/plan.md
  started_at: "2026-11-25T05:58:53.323Z"
  completed_at: "2026-11-25T06:13:20.268Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-change-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を実施した。`opr-change-sample` の R1 で足す・削る点はなく、編集対象として宣言された `opr-sample.md` に、rulebook の運用変更作業が求める凍結期間の扱いを補う差分を 1 件入れた。
- plan に展開された F001〜F004 はどれも今回は直していない。F001・F004 は kata の段で使わない観点、F002 は R4 の担当で解消済み、F003 は解消済みで anchor が現行本文と合わない。
- 指摘は No 1〜4 の 4 件。No 2 と No 4 に「要判断」の印が付いている。
- executor 側で `npx prettier --check` と `npx markdownlint` が成功した。runner 側では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が成功した。他の検査は変更種別により非適用。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-sample.md`: 概要の未決事項の表に「変更の凍結期間（繁忙期の扱い）」の行を 1 行足した（1 insertion）。暫定の扱いは「凍結期間を置かず、閉店後であれば変更できるものとする」で、対象手順は運用変更作業。rulebook の運用変更作業が実施条件に時間帯と凍結期間を書くよう求めるのに、本書に凍結期間の記述がなかったため。

## 3. 申し送り

- R5 への申し送り（No 4）: `opr-sample.md` の運用変更作業の表と `opr-change-sample.md` の「変更種別と承認・実施条件」で、緊急の変更の扱いと表示の修正の証跡が食い違う。前者は緊急の変更をアプリの版の更新の実施条件に含め、証跡を「変更記録（差分、承認、実施）」とする。後者は「P1 の復旧に要る緊急の変更」を独立行にし、証跡を「変更記録（差分、実施）」とする。どちらに合わせるかは R5 で判断する。
- grade 側への依頼（No 2）: F001・F004 が求める決定者・期限・ready 化確認者の列は、kata-guide の「kata の観点の組」が kata の段で使わない観点として扱っている。grade の観点の組から外すかどうかは grade 側で判断する。
- F002・F003 は再評価で消えるかを確かめる。
- No: 1 / 段: R1 / 箇所: docs/ja/specdojo/samples/opr-sample.md の概要（未決事項の表） / 指摘: rulebook の「運用変更作業（設定変更・デプロイ・ロールバック）」は実施条件に時間帯と凍結期間を書くよう求めるが、本書の運用変更作業には凍結期間の記述がない。 / 直した案: 未決事項の表に「`_UNDECIDED_:` 変更の凍結期間（繁忙期の扱い）／凍結期間を置かず、閉店後であれば変更できるものとする／運用変更作業」の行を足した（sample に反映済み）。 / 根拠: [[specdojo:opr-rulebook]] の「運用変更作業（設定変更・デプロイ・ロールバック）」と「運用作業の受入確認」、[[specdojo:opr-change-sample]] の未決事項の表と手順適用範囲・前提（凍結期間の行）。運用方針の sample（[[specdojo:opd-index-sample]]）は凍結期間を決めていない。 / 印: なし
- No: 2 / 段: R1 / 箇所: grade の finding F001・F004（`vp-po-decision-readiness`・`vp-ops-release-readiness`） / 指摘: 未決事項の表に決定者・期限・ready 化の確認者の列を足すよう求めているが、kata-guide の「kata の観点の組」はこの 2 観点を kata の段のレビューで使わないと決めている（kata の承認と ready 化は登録簿で追う）。 / 直した案: 直さない。grade の観点の組から外すかどうかは、grade 側で判断してほしい。 / 根拠: docs/ja/specdojo/guides/kata-guide.md の「kata の観点の組」。 / 印: 要判断
- No: 3 / 段: R1 / 箇所: grade の finding F002・F003 / 指摘: F002（保管期間）は `vp-qe-verifiability` の観点で R4 の担当。本書の未決事項の表に「監査ログ以外の証跡の保管期間」の行がすでにあり解消済み。F003（関連導線の分冊の記述）は、関連ドキュメント導線の表が全分冊を「作成済」で載せており解消済み。anchor は現行の本文と合わず、古い版への finding とみられる。 / 直した案: 直さない。再評価で消えるかを確かめる。 / 根拠: opr-sample.md の現行の概要と関連ドキュメント導線の表。 / 印: なし
- No: 4 / 段: R1（R5 への申し送り） / 箇所: opr-sample.md の運用変更作業の表と opr-change-sample.md の「変更種別と承認・実施条件」 / 指摘: opr-change は「P1 の復旧に要る緊急の変更」を独立した行に分け、表示の修正の証跡を「変更記録（差分、実施）」としている。opr-sample は緊急の変更をアプリの版の更新の実施条件に含め、表示の修正の証跡を「変更記録（差分、承認、実施）」としている。 / 直した案: R5 で、どちらに合わせるかを決める（例: 表示の修正の承認者が `OPS` であることに合わせ、どちらかの記述を揃える）。 / 根拠: 2 つの sample の該当する表。 / 印: 要判断

## 4. 進め方と実践の型の適用

sample メンテナンスの進め方に沿い、`opr-change-sample` を `opr-rulebook` の運用変更作業・運用作業の受入確認、および `opr-sample`・`opd-index-sample` と照合して R1 の過不足を確かめた。その結果、凍結期間の扱いが欠けていると判断し、`opr-sample.md` の未決事項の表に行を足した。運用方針の sample は凍結期間を決めていないため、暫定の扱いを置いて `_UNDECIDED_` とした。`status` は `draft` のまま据え置いた。F001・F004 は kata-guide の観点の組を根拠に見送り、F002・F003 は現行本文で解消済みと確認したため見送った。grade result サイドカーは直接編集していない。
