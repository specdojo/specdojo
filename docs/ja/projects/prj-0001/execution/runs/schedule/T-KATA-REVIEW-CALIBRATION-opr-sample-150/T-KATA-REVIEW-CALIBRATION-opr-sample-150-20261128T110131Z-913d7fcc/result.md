---
specdojo:
  id: prj-0001:xer-t-kata-review-calibration-opr-sample-150-20261128t110131z-913d7fcc
  type: exec-result
  task_id: T-KATA-REVIEW-CALIBRATION-opr-sample-150
  mode: edit
  status: in_progress
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-CALIBRATION-opr-sample-150/T-KATA-REVIEW-CALIBRATION-opr-sample-150-20261128T110131Z-913d7fcc/plan.md
  started_at: "2026-11-28T11:06:06.850Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として opr-sample を、同じ接頭辞の sample 群・共通サンプル文脈と照合した。
- 月次点検が欠品記録から KPI を集計するのに、その欠品記録を作る日次の手順がなかった。このため「日次・週次・月次点検手順」の表に、閉店後の欠品確認の行を足した。
- 分冊 sample の事実（権限の実施者、再実行の上限、演習の実施者、記録名）は opr-sample と一致していた。食い違いは opr-index-sample 側にあったので、編集せず直す案を findings に残した。
- grade の F001 と F004 は、kata のレビューの段から外す観点のため扱わなかった。F002 は R4 の観点で、未決事項の表にすでに保管期間の行がある。F003 は opr-sample 側の関連導線に分冊 8 件が載っていて解消済み。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R5 | opr-sample.md「日次・週次・月次点検手順」の表 | 月次点検が欠品記録から KPI を集計するのに、欠品記録を作る日次の手順がなかった。 | 閉店後に店番担当が、`PO` が固定した人気商品の一覧の在庫数を棚と照らし、欠品記録に残す行を足した（直し済み）。 | opr-index-sample の点検手順の表の欠品記録の行、opd-index-sample の KPI（人気商品の欠品、測定元は欠品記録）、Sample 記述標準の共通サンプル文脈（欠品発生を日次で記録する）。 | - |
| 2 | R5 | opr-index-sample.md「関連ドキュメント導線」（相手側） | 「分冊は障害対応だけ」として分冊の手順を opr-incident だけ載せるが、分冊 sample は 8 件ある。すべて `based_on` と本文で opr-index ではなく opr-sample を参照している（grade F003）。opr-sample 側は関連導線の表に分冊 8 件を作成済として載せており、解消済み。 | opr-index-sample の関連導線に分冊 8 件を足し、分冊は opr-sample を参照すると書く。どちらの sample を手順群の入口とするかを先に決める。 | opr-incident、opr-monitoring、opr-backup-restore、opr-batch、opr-change、opr-access-control、opr-support の各 sample の `based_on` と概要。 | 要判断 |
| 3 | R5 | opr-index-sample.md「アカウント付与/剥奪手順」の実施の行（相手側） | 実施者が `DEV` で、opr-sample と opr-access-control-sample の `OPS` と食い違う。 | 実施者を `OPS` にする。 | opr-access-control-sample の付与・剥奪の手順の表の実施の行。 | - |
| 4 | R5 | opr-index-sample.md のアカウント付与/剥奪手順と証跡の記録名（相手側） | 「権限の記録」「棚卸しの記録」と書き、opr-sample・opr-access-control-sample の「権限変更記録」「棚卸し記録」と食い違う。 | 「権限変更記録」「棚卸し記録」へそろえる。 | opr-sample の証跡の表、opr-access-control-sample の手順と証跡の列。 | - |
| 5 | R5 | opr-index-sample.md「バッチ再実行・失敗時対応」の上限回数と上限到達時（相手側） | 「1 日あたり 2 回」「閉店後の日次締めの後にもう一度取得する」と書き、手動の再実行が 1 回までであることが読めない。 | 「自動取得を含めて 1 日 2 回、手動の再実行は 1 回まで」「当日の閉店後の自動取得を待つ」にする。 | opr-sample のバッチ再実行の章、opr-batch-sample の「再実行上限と上限到達時」。 | - |
| 6 | R5 | opr-index-sample.md「バックアップ確認・リストア手順」の復元演習の行（相手側） | 実施者が `OPS` で、opr-sample・opr-backup-restore-sample の「`DEV` が行い `OPS` が確かめる」と食い違う。 | `DEV` が行い、`OPS` が結果を確かめると書く。 | opr-backup-restore-sample の演習の節と必要権限の行。 | - |
| 7 | R5 | opr-index-sample.md 概要の未決事項の表（相手側） | 「変更の凍結期間（繁忙期の扱い）」の行がなく、opr-sample と opr-change-sample にある未決事項が抜けている。 | 同じ行（凍結期間を置かず、閉店後であれば変更できるものとする、影響する章は運用変更作業）を足す。 | opr-sample と opr-change-sample の未決事項の表。 | - |

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/execution/queues/kra-day2-2026-11-26.json`: 変更、+8 / -10 行
- `docs/ja/projects/prj-0001/execution/reports/watch-scan/watch-scan-20261126.md`: 変更、+19 / -79 行
- `docs/ja/projects/prj-0001/execution/watch/watch-events.jsonl`: 変更、+92 / -0 行
- `docs/ja/specdojo/samples/opr-sample.md`: 「日次・週次・月次点検手順」の表に、閉店後に店番担当が `PO` の固定した人気商品の在庫数を棚と照らし、欠品記録へ残す行を足した。あわせて prettier で表の列幅を揃えた。
- `docs/ja/projects/prj-0001/execution/jobs/runs/JBR-exec-cycle-ec6d82a63310.json`: 追加、+40 / -0 行
- `docs/ja/projects/prj-0001/execution/jobs/runs/JBR-nightly-integration-tests-fc1d6ff7831c.json`: 追加、+51 / -0 行
- `docs/ja/projects/prj-0001/execution/jobs/runs/JBR-nightly-integration-tests-feb648de1088.json`: 追加、+51 / -0 行
- `docs/ja/projects/prj-0001/execution/queues/grade-qr23-then-g5dy-2026-11-27.json`: 追加、+70 / -0 行
- `docs/ja/projects/prj-0001/execution/queues/kra-day4-2026-11-26.json`: 追加、+43 / -0 行
- `docs/ja/projects/prj-0001/execution/queues/night-2026-11-27.json`: 追加、+124 / -0 行
- `docs/ja/projects/prj-0001/execution/queues/night2-2026-11-27.json`: 追加、+107 / -0 行
- `docs/ja/projects/prj-0001/execution/queues/qr23-86rk-2026-11-27.json`: 追加、+73 / -0 行
- `docs/ja/projects/prj-0001/execution/reports/nightly-integration-tests/nightly-integration-tests-20261126T190033Z.md`: 追加、+20 / -0 行
- `docs/ja/projects/prj-0001/execution/reports/nightly-integration-tests/nightly-integration-tests-20261127T190037Z.md`: 追加、+20 / -0 行
- `docs/ja/projects/prj-0001/execution/reports/watch-scan/watch-scan-20261127.md`: 追加、+237 / -0 行
- `docs/ja/projects/prj-0001/execution/reports/watch-scan/watch-scan-20261128.md`: 追加、+292 / -0 行
- `docs/ja/projects/prj-0001/execution/watch/diagnoses/63dfcbdd4b6a79ba980292a840a30470dffb5d38df956352c4541a25c9e2019e.json`: 追加、+2 / -0 行
- `docs/ja/projects/prj-0001/execution/watch/diagnoses/63dfcbdd4b6a79ba980292a840a30470dffb5d38df956352c4541a25c9e2019e.retry.json`: 追加、+2 / -0 行
- `docs/ja/projects/prj-0001/execution/watch/diagnoses/651e2fc28fc906c4c988fe7aa4a702cabdd66f3cbe4b0a68b82edfc99c188ac2.json`: 追加、+2 / -0 行
- `docs/ja/projects/prj-0001/execution/watch/diagnoses/7d53139af2412e3faed9e631b7b1139b2c952e4ce5650ca65260afaac8d13f8c.json`: 追加、+2 / -0 行
- `docs/ja/projects/prj-0001/execution/watch/diagnoses/83185a230a6eea7f5bfaf8763c3efee82f0490f7ace0310cd372cc745a33aa92.json`: 追加、+2 / -0 行
- `docs/ja/projects/prj-0001/execution/watch/diagnoses/b8a981a29ee8aa6a35a2fb37c4c1af73089b9963d44fd6de63fc4c74beaac80f.json`: 追加、+2 / -0 行

## 3. 申し送り

- `docs/ja/projects/prj-0001/execution/` 配下の queues、reports、watch、jobs の変更は、executor の実行中に生じた実行記録の差分である。本タスクの sample 編集とは関係がない。
- opr-index-sample は本タスクの編集対象外のため変更していない。findings の No=2 から No=7 は、相手側を直す案として別タスクで扱う。
- No=1; 段=R5; 箇所=opr-sample.md「日次・週次・月次点検手順」の表; 指摘=月次点検が欠品記録から KPI を集計するのに、欠品記録を作る日次の手順がなかった; 直した案=閉店後に店番担当が、`PO` が固定した人気商品の一覧の在庫数を棚と照らし、欠品記録に残す行を足した（直し済み）; 根拠=opr-index-sample の点検手順の表の欠品記録の行、opd-index-sample の KPI（人気商品の欠品、測定元は欠品記録）、Sample 記述標準の共通サンプル文脈（欠品発生を日次で記録する）; 印=なし
- No=2; 段=R5; 箇所=opr-index-sample.md「関連ドキュメント導線」（相手側）; 指摘=「分冊は障害対応だけ」として分冊の手順を opr-incident だけ載せるが、分冊 sample は 8 件あり、すべて `based_on` と本文で opr-index ではなく opr-sample を参照している（grade F003）。opr-sample 側は関連導線の表に分冊 8 件を作成済として載せており、解消済み; 直した案=opr-index-sample の関連導線に分冊 8 件を足し、分冊は opr-sample を参照すると書く。どちらの sample を手順群の入口とするかを先に決める; 根拠=opr-incident/opr-monitoring/opr-backup-restore/opr-batch/opr-change/opr-access-control/opr-support の各 sample の `based_on` と概要; 印=要判断
- No=3; 段=R5; 箇所=opr-index-sample.md「アカウント付与/剥奪手順」の実施の行（相手側）; 指摘=実施者が `DEV` で、opr-sample と opr-access-control-sample の `OPS` と食い違う; 直した案=実施者を `OPS` にする; 根拠=opr-access-control-sample の付与・剥奪の手順の表の実施の行; 印=なし
- No=4; 段=R5; 箇所=opr-index-sample.md のアカウント付与/剥奪手順と証跡の記録名（相手側）; 指摘=「権限の記録」「棚卸しの記録」と書き、opr-sample・opr-access-control-sample の「権限変更記録」「棚卸し記録」と食い違う; 直した案=「権限変更記録」「棚卸し記録」へそろえる; 根拠=opr-sample の証跡の表、opr-access-control-sample の手順と証跡の列; 印=なし
- No=5; 段=R5; 箇所=opr-index-sample.md「バッチ再実行・失敗時対応」の上限回数と上限到達時（相手側）; 指摘=「1 日あたり 2 回」「閉店後の日次締めの後にもう一度取得する」と書き、手動の再実行が 1 回までであることが読めない; 直した案=「自動取得を含めて 1 日 2 回、手動の再実行は 1 回まで」「当日の閉店後の自動取得を待つ」にする; 根拠=opr-sample のバッチ再実行の章、opr-batch-sample の「再実行上限と上限到達時」; 印=なし
- No=6; 段=R5; 箇所=opr-index-sample.md「バックアップ確認・リストア手順」の復元演習の行（相手側）; 指摘=実施者が `OPS` で、opr-sample・opr-backup-restore-sample の「`DEV` が行い `OPS` が確かめる」と食い違う; 直した案=`DEV` が行い、`OPS` が結果を確かめると書く; 根拠=opr-backup-restore-sample の演習の節と必要権限の行; 印=なし
- No=7; 段=R5; 箇所=opr-index-sample.md 概要の未決事項の表（相手側）; 指摘=「変更の凍結期間（繁忙期の扱い）」の行がなく、opr-sample と opr-change-sample にある未決事項が抜けている; 直した案=同じ行（凍結期間を置かず、閉店後であれば変更できるものとする、影響する章は運用変更作業）を足す; 根拠=opr-sample と opr-change-sample の未決事項の表; 印=なし
- 申し送り（指摘以外）: grade の F001・F004（`vp-po-decision-readiness`・`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」で kata の段のレビューから外す観点のため扱わなかった。F002（`vp-qe-verifiability`）は R4 の観点で、概要の未決事項の表にすでに「監査ログ以外の証跡の保管期間」の行がある。用語集（docs/ja/product/010-business-specs/060-glossary/）は SpecDojo の製品の用語だけで、業務の用語との食い違いはなかった。

## 4. 進め方と実践の型の適用

根拠にしたのは、opr-index-sample、opd-index-sample、opr-incident、opr-monitoring、opr-backup-restore、opr-batch、opr-change、opr-access-control、opr-support の各 sample と、Sample 記述標準の共通サンプル文脈である。用語集は SpecDojo の製品用語だけで、業務用語との食い違いはなかった。食い違った箇所のうち opr-sample 側の欠品確認の手順だけを直し、一致していた記述は維持した。相手側の食い違いは編集せず、直す案を findings に記録した。frontmatter の `status` は変更していない。
