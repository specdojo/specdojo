---
specdojo:
  id: prj-0001:xer-t-kata-review-calibration-opr-sample-150-20261128t102630z-a0719568
  type: exec-result
  task_id: T-KATA-REVIEW-CALIBRATION-opr-sample-150
  mode: edit
  status: superseded
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-CALIBRATION-opr-sample-150/T-KATA-REVIEW-CALIBRATION-opr-sample-150-20261128T102630Z-a0719568/plan.md
  started_at: "2026-11-28T10:26:39.254Z"
  completed_at: "2026-11-28T11:01:51.203Z"
  agent: opus-executor
  approach: sample-maintenance
  targets:
    - specdojo:opr-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `docs/ja/specdojo/samples/opr-sample.md` を修正した。分冊 8 本がすべて本書を `opr-index` として参照する系列に合わせ、概要の入口の記述と関連導線を直した。
- 欠品記録の日次手順と証跡の行を足し、`opd-access-control-sample` への導線を関連導線の表に足した。
- 相手側（`opr-index-sample`・`opd-index-sample`）を直す案は変更せず、findings と handoff に残した。
- runner の `npm run lint:md:changed` は、`watch-scan-20261128.md` の MD028 で失敗した。このファイルはタスクの編集対象ではなく、実行環境が生成した差分である。対象の sample には指摘が出ていない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 1. 概要、12. 関連ドキュメント導線 | 分冊 8 本（`opr-incident`・`opr-monitoring`・`opr-batch`・`opr-backup-restore`・`opr-change`・`opr-access-control`・`opr-support` ほか）はすべて本書を `opr-index` として参照する。一方、本書は「手順群の入口は `opr-index-sample`」としていた。 | 概要を「本書は手順群の入口（`opr-index`）であり」に直した。関連導線の表から `opr-index-sample` の行を除いた。 | `vp-qe-kata-conformance`、`opr-rulebook` の「`opr-index` が実行手順の SSOT であることを明示する」、grade F003 | 要判断 |
| R5-2 | R5 | 相手側 `opr-index-sample` 12. 関連ドキュメント導線 | `opr-index-sample` は「分冊は障害対応だけ」と書くが、分冊 sample は 7 領域ある。 | 相手側 `docs/ja/specdojo/samples/opr-index-sample.md` を直す案: `opr-index-rulebook` と `opr-rulebook` のどちらの sample を `opr-index` の完成例とするかを決め、残す側の導線表へ分冊 7 本を載せる。もう一方は廃止するか、役割の違いを冒頭で明示する。 | `vp-qe-kata-conformance` | 要判断 |
| R5-3 | R5 | 相手側 `opr-index-sample` 9. アカウント付与/剥奪手順・11. 証跡 | `opr-index-sample` は付与・剥奪の実施者を `DEV` とし、証跡名を「権限の記録」「棚卸しの記録」とする。本書、`opr-access-control-sample`、`opd-index-sample` の RACI は実施者を `OPS` とし、証跡名を「権限変更記録」「棚卸し記録」とする。誤検知の閾値も「月 3 回を超えたら」で、本書の「月 3 件以上」と違う。 | 相手側 `opr-index-sample` を、実施者 `OPS`、証跡名「権限変更記録」「棚卸し記録」、閾値「月 3 件以上」に揃える。 | `vp-qe-kata-conformance`、`vp-dev-change-impact` | - |
| R5-4 | R5 | 3. 日次・週次・月次点検手順、11. 証跡 | 月次で欠品記録から KPI を集計するのに、欠品記録を作る手順と保存先が本書になかった。 | 日次（閉店後）の欠品の記録の行を点検表に、欠品記録の行（在庫の画面、`closing_date`・商品コード）を証跡表に足した。証跡表の後の文から欠品記録の記述を除いた。 | `vp-qe-kata-conformance`、共通サンプル文脈の期待効果 | - |
| R5-5 | R5 | 12. 関連ドキュメント導線 | 9 章で参照する `opd-access-control-sample` が関連導線の表になかった。 | 方針の行として `opd-access-control-sample` を足した。 | `vp-dev-change-impact` | - |
| R5-6 | R5 | 相手側 `opd-index-sample` 1. 概要・9. 権限・アカウント運用・12. 関連ドキュメント導線 | `opd-index-sample` は「アカウントは店番担当と `DEV` に限り」とするが、`opd-access-control-sample` は運用の区分（`OPS`）を定めている。未決事項の表に「変更の凍結期間」がない。関連導線の手順の行も `opr-index-sample` と `opr-incident-sample` の 2 本だけで、本書と他の分冊がない。 | 相手側 `docs/ja/specdojo/samples/opd-index-sample.md` に次を入れる案: 9 章に `OPS` の運用の区分を足す。未決事項に凍結期間の行を足す。関連導線に本書と分冊を載せる。 | `vp-qe-kata-conformance`、`vp-dev-change-impact` | - |

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/execution/queues/kra-day2-2026-11-26.json`: 変更、+8 / -10 行
- `docs/ja/projects/prj-0001/execution/reports/watch-scan/watch-scan-20261126.md`: 変更、+19 / -79 行
- `docs/ja/projects/prj-0001/execution/watch/watch-events.jsonl`: 変更、+92 / -0 行
- `docs/ja/specdojo/samples/opr-sample.md`: 概要を「手順群の入口（`opr-index`）」に直し、関連導線の表から `opr-index-sample` の行を除いて `opd-access-control-sample` の行を足した。日次点検表に欠品の記録の行、証跡表に欠品記録の行を足し、証跡表の後の文から欠品記録の記述を除いた。表は prettier で整形した。
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

- F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata の段のレビューに使わない観点のため、この段では扱っていない。
- `docs/ja/projects/prj-0001/execution/` 配下のキュー・レポート・watch・jobs の変更と未追跡ファイルは、実行環境が生成したもので、このタスクの成果物ではない。
- grade finding の扱い: F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」で kata の段のレビューに使わない観点とされているため、この段では扱っていない。F002 は、本書の未決事項の表に「監査ログ以外の証跡の保管期間」の行がすでにあり、証跡表の後の文もその扱いを指しているので、解消済みと判断した。F003 は R5-1 で解消した。ただし相手側の opr-index-sample は R5-2 で扱う。
- 用語集（docs/ja/product/010-business-specs/060-glossary/）は SpecDojo プロダクトの用語を扱い、店舗業務の語（店番担当・つけ・日次締めなど）を定義していないため、表記の食い違いはなかった。

## 4. 進め方と実践の型の適用

sample-maintenance の R5（整合）として、同じ接頭辞の分冊 sample、`opr-rulebook` の記述、Sample 記述標準の共通サンプル文脈を照合した。sample 側で直せる食い違いだけを直し、相手側の修正は案として残した。F002 は、未決事項の表に保管期間の行がすでにあるため解消済みとした。F003 は概要と関連導線の修正で解消した。F001 と F004 は kata の観点の組に含まれないため扱わなかった。用語集は店舗業務の語を定義していないため、表記の食い違いはなかった。
