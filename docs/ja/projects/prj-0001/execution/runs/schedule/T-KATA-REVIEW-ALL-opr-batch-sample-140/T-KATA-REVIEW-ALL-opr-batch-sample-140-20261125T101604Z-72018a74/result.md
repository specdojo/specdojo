---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-batch-sample-140-20261125t101604z-72018a74
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-batch-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-batch-sample-140/T-KATA-REVIEW-ALL-opr-batch-sample-140-20261125T101604Z-72018a74/plan.md
  started_at: "2026-11-25T10:16:14.311Z"
  completed_at: "2026-11-25T10:25:53.911Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-batch-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として `opr-batch-sample` の事実の誤り 4 件を、schema・関連 sample・rulebook と突き合わせて直した。
- `opr-sample` には batch に関わる誤りがなく、変更していない。
- prettier と markdownlint-cli2 は通り、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` も passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-batch-sample.md`: frontmatter の `based_on` を project 修飾 id の `specdojo:opd-index-sample` と `specdojo:opr-sample` に直した。アラート対応手順の通知条件を「開店 30 分前の 9:30 に前日の閉店後の成功記録なし」に、障害対応手順の P2 の条件を「前日の閉店後の成功記録がない」に揃えた。関連ドキュメント導線では、既に存在する `opd-monitoring-sample` と `opr-incident-sample` を wikilink にして「作成済」とした。整形で表の列幅も変わった。

## 3. 申し送り

- R4-1: frontmatter の `based_on` が project 修飾のない `opd-index` で、id として解決しなかった。`specdojo:opd-index-sample` と `specdojo:opr-sample` にした。根拠は `vp-arc-technical-constraints` で、common-frontmatter schema の `idRefArray` と、同じ系列の opr-change-sample・opr-incident-sample の `based_on` による。要判断: `specdojo:opr-sample` を足すかは同じ系列に合わせた。足さない案もある。
- 根拠不足で確かめられなかった主張: `backup run` のコマンド形式と、取得中も記録を続けられる点は正本がなく、`_ASSUMPTION_` として残した。前者は実際のホスティング環境の手順書が要り、後者は証跡章の模擬で確かめる必要がある。
- grade の finding F001〜F004 は `opr-sample` の古い版を指している。executor の判断では、F002 と F003 は現行の `opr-sample` で解消済みで、F001 と F004 はこの段で使わない観点だった。
- R4-1: R4 / frontmatter / `based_on` が project 修飾のない `opd-index` で id として解決しない / `specdojo:opd-index-sample` と `specdojo:opr-sample` にした / `vp-arc-technical-constraints`（common-frontmatter schema の `idRefArray`、同じ系列の opr-change-sample と opr-incident-sample の `based_on`） / 要判断（`specdojo:opr-sample` を足すかは同じ系列に合わせた。足さない案もある）
- R4-2: R4 / 5. アラート対応手順 / 通知を「開店時に当日分の成功記録なし」と書き、opd-monitoring-sample（9:30 に前日の閉店後の成功記録を確かめる）と opr-sample のアラート対応手順に合わない / 「開店 30 分前の 9:30 に前日の閉店後の成功記録なし」にした / `vp-qe-verifiability` / -
- R4-3: R4 / 4. 障害対応手順 / P2 の条件「当日分の成功記録がない」が opd-index-sample の監視の表（翌朝の開店時に前日の閉店後の成功記録がない）と合わない / 「前日の閉店後の成功記録がない」にした / `vp-qe-verifiability` / -
- R4-4: R4 / 12. 関連ドキュメント導線 / `opd-monitoring` と `opr-incident` を予定としているが、opd-monitoring-sample と opr-incident-sample はすでにある / wikilink にして作成済にした / `vp-qe-verifiability` / -
- 確かめの表: 1 `based_on`（common-frontmatter schema・sample の id、不一致→直した）、2 アラート判定（opd-monitoring-sample の 46・49 行、不一致→直した）、3 P2 の条件（opd-index-sample の 90 行、不一致→直した）、4 導線の予定表記（samples の一覧、不一致→直した）、5 上限は自動を含め 1 日 2 回・手動 1 回（opr-sample のバッチ再実行、一致）、6 同じ取得日は世代を上書き（opr-sample、一致）、7 P2 から翌朝 P1 への移行（opr-incident-sample の 123 行・opd-monitoring-sample の 59 行、一致）、8 該当がない章も「`opr-index` 参照」で残す（opr-rulebook の 93 行、一致）、9 `backup run` のコマンド形式（正本なし、`_ASSUMPTION_`、確かめられない: 実際のホスティング環境の手順書が要る）、10 取得中も記録を続けられる（正本なし、`_ASSUMPTION_`、確かめられない: 証跡章の模擬で確かめる）
- grade の finding F001〜F004 は opr-sample の古い版を指す。F002（保管期間の未決の行）と F003（分冊の記述）は現行の opr-sample ですでに解消。F001・F004 は kata-guide がこの段のレビューで使わないとする観点（`vp-po-decision-readiness`、`vp-ops-release-readiness`）のため扱っていない。opr-sample は変更していない。

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample の事実を schema・関連 sample・rulebook と突き合わせた。確かめた主張は 10 件。内訳は、誤りがあり直したもの 4 件、一致したもの 4 件、正本がなく確かめられなかったもの 2 件。 | # | 主張 | 突き合わせ先 | 結果 | | --- | --- | --- | --- | | 1 | frontmatter の `based_on` | common-frontmatter schema、各 sample の id | 不一致のため直した | | 2 | アラート判定の時刻と対象 | `opd-monitoring-sample` | 不一致のため直した | | 3 | P2 の条件 | `opd-index-sample` | 不一致のため直した | | 4 | 導線の予定表記 | samples の一覧 | 不一致のため直した | | 5 | 再実行の上限（自動を含め 1 日 2 回、手動 1 回） | `opr-sample` のバッチ再実行 | 一致 | | 6 | 同じ取得日は世代を上書き | `opr-sample` | 一致 | | 7 | P2 から翌朝 P1 への移行 | `opr-incident-sample`、`opd-monitoring-sample` | 一致 | | 8 | 該当のない章も「`opr-index` 参照」で残す | `opr-rulebook` | 一致 | | 9 | `backup run` のコマンド形式 | 正本なし | 確かめられない（`_ASSUMPTION_`） | | 10 | 取得中も記録を続けられる | 正本なし | 確かめられない（`_ASSUMPTION_`） | `opr-sample` は batch に関わる誤りがなく、維持した。grade の F001〜F004 は `opr-sample` の古い版を指す。F002 と F003 は現行版で解消済みで、F001 と F004 はこの段の観点外のため扱っていない。
