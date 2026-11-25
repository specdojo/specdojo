---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-backup-restore-sample-110-20261125t052400z-e97816f2
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-backup-restore-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-backup-restore-sample-110/T-KATA-REVIEW-ALL-opr-backup-restore-sample-110-20261125T052400Z-e97816f2/plan.md
  started_at: "2026-11-25T05:24:09.365Z"
  completed_at: "2026-11-25T05:38:17.293Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-backup-restore-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を `opr-backup-restore-sample.md` に対して実施した。opr-rulebook の「運用作業の受入確認」が求める模擬の記録先と項目が証跡の章に欠けていたため、1 段落を足した（2 行追加）。
- grade の finding F001〜F004 は、kata-guide の「kata の観点の組」に従い R1 の観点に当たらないものとして扱い、sample には反映していない。F001・F004 は kata の段で使わない観点、F002 は R4、F003 は R5 の観点にあたる。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-backup-restore-sample.md`: 「11. 証跡」の章末に、手順を新しく書いたときや改訂したときの模擬を `opr-index` の証跡に従って行う旨を追記した。月次の演習で通らない復元の手順 2・5・6 と、照合が不一致で 1 つ前の世代から戻し直す分岐も検証用の環境で 1 回ずつ模擬するとし、結果は月次点検の記録に確認日・確認環境・戻した世代の `run_id`・合否を残すと定めた。

## 3. 申し送り

- 指摘 R1-1（印なし）: 段 R1 / 箇所 11. 証跡 / 指摘: opr-rulebook の「運用作業の受入確認」は確認結果の記録先を証跡の章に求めるが、本書にはなかった。月次の演習では復元の手順 2・5・6 と、不一致時に 1 つ前の世代から戻し直す分岐が模擬されなかった。 / 直した案: 証跡の章末に模擬と記録項目の段落を追加した。 / 根拠: `vp-qe-kata-conformance`、opr-rulebook「運用作業の受入確認」。
- 指摘 R1-2（印なし）: 段 R1 / 箇所 12. 関連ドキュメント導線 / 指摘: grade finding F003 に当たる。表が `opr-incident` を「予定」と仮置きしているが、`opr-incident-sample` はすでにある。本書は `opr-sample` を `opr-index` と呼んでいる。 / 直した案: この段では直していない。R5 で表の行を作成済みの wikilink に直し、本文の仮置きも見直す。 / 根拠: kata-guide の「kata の観点の組」（R5、`vp-qe-kata-conformance`）。
- 指摘 R1-3（印なし）: 段 R1 / 箇所 1. 概要 / 指摘: grade finding F001・F004（未決事項の表に決定者・期限・ready 化前の解消項目がない）。 / 直した案: kata の段では使わない観点（`vp-po-decision-readiness`、`vp-ops-release-readiness`）のため直していない。 / 根拠: kata-guide の「kata の観点の組」（外す観点）。
- 指摘 R1-4（印なし）: 段 R1 / 箇所 11. 証跡 / 指摘: grade finding F002（保管期間が `_UNDECIDED_`）。 / 直した案: R4 の観点（`vp-qe-verifiability`）のためこの段では扱わない。なお、概要の未決事項の表にはバックアップの保管期間の行があり、証跡の章には「保管期間が決まるまでは証跡を消さない」がある。 / 根拠: kata-guide の「kata の観点の組」（R4）。
- 指摘 R1-5（要判断）: 段 R1 / 箇所 対象の確認 / 指摘: plan の編集対象欄は rulebook の sample 宣言から解決した `opr-sample.md` だが、task 名と根拠の `path` は `opr-backup-restore-sample.md` を指す。`targets` には両方が入っている。 / 直した案: `opr-sample.md` の R1 は兄弟タスク `T-KATA-REVIEW-ALL-opr-access-control-sample-110` で済んでいるため、本タスクは `opr-backup-restore-sample.md` をレビューし、`opr-sample.md` は変えていない。選ばなかった案は `opr-sample.md` をもう一度 R1 で見直すことである。 / 根拠: plan の「根拠となる成果物と編集対象」と `targets`、兄弟タスクの result。
- R1-1: R1 / 11. 証跡 / opr-rulebook の「運用作業の受入確認」は確認結果（確認日・確認環境・`run_id` 等・合否）を証跡の章に残すよう求めるが、本書には記録先がなかった。さらに月次の演習は検証用の環境への復元と照合だけで、本番の復元の手順 2（紙の販売控えへの切替）・5（転記と照合）・6（記録の再開）と、照合が一致せず 1 つ前の世代から戻し直す分岐が模擬されない / 証跡の章の末尾に「本書の手順を新しく書いたときや改訂したときの模擬は、`opr-index` の証跡に従う。月次の演習では通らない復元の手順 2・5・6 と、照合が一致せず 1 つ前の世代から戻し直す分岐も、検証用の環境で 1 回ずつ模擬する。結果は月次点検の記録に、確認日・確認環境・戻した世代の `run_id`・合否を残す。」を足した / `vp-qe-kata-conformance`（opr-rulebook「運用作業の受入確認」「障害時の停止・復旧…を該当する手順で確認する」、6.6 バックアップ確認・リストア手順） / -
- R1-2: R1 / 12. 関連ドキュメント導線 / grade finding F003。関連導線の表が `opr-incident` を「予定」としてバッククォートで仮置きしているが、`opr-incident-sample` はすでにある。本書は `opr-sample` を `opr-index` と呼んでいる / - / ほかの sample との食い違いで、kata-guide の「kata の観点の組」では R5 の `vp-qe-kata-conformance`（kata 相互と適用先）に当たる。R5 で表の行を [[specdojo:opr-incident-sample\|運用手順（障害対応）]]・作成済へ直し、本文の `opr-incident` の仮置きもあわせて見直す案 / -
- R1-3: R1 / 1. 概要 / grade finding F001・F004（未決事項の表に決定者・期限・ready 化の前に解消する項目の列がない）は `vp-po-decision-readiness`・`vp-ops-release-readiness` の指摘。kata-guide の「kata の観点の組」はこの 2 つを kata の段のレビューで使わない観点としているため、直していない / - / kata-guide「kata の観点の組」（外す観点） / -
- R1-4: R1 / 11. 証跡 / grade finding F002（保管期間が `_UNDECIDED_`）は `vp-qe-verifiability` で R4 の観点のため、この段では扱わない。本書では、概要の未決事項の表にバックアップの保管期間の行があり、証跡の章に「保管期間が決まるまでは証跡を消さない」がある / - / kata-guide「kata の観点の組」（R4 の観点） / -
- R1-5: R1 / 対象の確認 / plan の編集対象欄は rulebook の sample 宣言から解決した `opr-sample.md` だった。一方で task 名と plan の根拠の `path` は `opr-backup-restore-sample.md` を指し、plan の `targets` には両方が入っている。`opr-sample.md` の R1 は `T-KATA-REVIEW-ALL-opr-access-control-sample-110` で済んでいるため、本タスクは `opr-backup-restore-sample.md` をレビューし、`opr-sample.md` は変えていない / - / plan の「根拠となる成果物と編集対象」と `targets`、兄弟タスクの result / 要判断（迷った理由: plan の編集対象欄と task の対象が食い違う。選ばなかった案: `opr-sample.md` をもう一度 R1 で見直す）
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/opr-backup-restore-sample.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

sample メンテナンスの進め方に従い、opr-rulebook の「運用作業の受入確認」と kata-guide の「kata を agent でレビューする」を根拠に R1 を行った。rulebook を正として、模擬の記録先と項目の欠落だけを補った。F001〜F004 は kata-guide の観点の組に照らし、R1 ではなく他の段か対象外と判断して未反映とした。F003 は R5 での対応案を handoff に残した。検証では、変更ファイルに対する Prettier、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。`status` は `draft` のまま据え置いた。
