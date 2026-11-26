---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-backup-restore-sample-150-20261125t113245z-978f83da
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-backup-restore-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-backup-restore-sample-150/T-KATA-REVIEW-ALL-opr-backup-restore-sample-150-20261125T113245Z-978f83da/plan.md
  started_at: "2026-11-25T11:32:58.898Z"
  completed_at: "2026-11-25T11:54:05.435Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-backup-restore-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、opr-backup-restore-sample と opr-sample の食い違い 4 件を直した。
- RTO の書き方の食い違い（R5-5）は要判断として残した。opd-index-sample の通知条件（R5-6）は相手側を直す案として申し送った。
- 整形と静的検査（prettier、markdownlint、runner の lint:md:changed、lint:fm:changed、lint:mermaid、lint:d2、test:docs、validate:schema）は通過した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-backup-restore-sample.md`: 関連導線の行と対象外のセルで、`opr-incident` の仮置きを作成済の `opr-incident-sample` への wikilink に直し、備考を「作成済」にした（R5-1）。アラート対応手順の夜間バックアップの通知を、他の sample に合わせて「9:30 に前日の閉店後の成功記録なし」に直した（R5-2）。表の列幅は prettier で整えた。
- `docs/ja/specdojo/samples/opr-sample.md`: 「バックアップ確認・リストア手順」の復元の完了条件と演習の比べる値につけ残高の合計を加えた。所要時間は復元の開始から照合を終えるまでとし、演習の記録と確認の分担を分冊に合わせた（R5-3）。章の冒頭に分冊 `opr-backup-restore-sample` への案内を足した（R5-4）。

## 3. 申し送り

- 指摘の一覧は executor の handoff（R5-1 から R5-6）を正とする。要判断は R5-5 の 1 件である。
- R5-5 の要判断: 分冊の RTO は「翌日の開店前点検（9:45）まで、15 時間 45 分以内」で、opr-sample と opd-index-sample の「翌営業日の開店まで」と食い違う。分冊の値はより厳しい具体化として成り立つため直していない。「翌営業日」に変えると 15 時間 45 分の固定閾値が成り立たなくなる。
- R5-6 の相手側を直す案: opd-index-sample「監視・アラート方針」の閉店後のバックアップの行を「翌朝 9:30（開店 30 分前）に前日の閉店後の成功記録がない」にする。この段では相手側を変更していない。
- grade の finding のうち F003 は前の段と R5-1 で解消した。F002 は R4 の観点で、opr-sample の概要に保管期間の行が既にあるため扱っていない。F001 と F004 は kata-guide で kata の段のレビューから外す観点のため扱っていない。
- R5-1: R5 / opr-backup-restore-sample「関連ドキュメント導線」「手順適用範囲・前提」 / `opr-incident` を「予定」としてバッククォートで仮置きしていたが、`opr-incident-sample` は既にあり、ほかの分冊（batch・monitoring）は作成済の wikilink で参照している / 関連導線の行と対象外のセルを `[[specdojo:opr-incident-sample\|運用手順（障害対応）]]` にし、備考を「作成済」にした / `vp-qe-kata-conformance`（kata 相互）。grade の F003 と同じ系統の指摘 / -
- R5-2: R5 / opr-backup-restore-sample「アラート対応手順」 / 夜間バックアップの通知を「開店時に成功記録なし」と書いていたが、opr-sample のアラート対応手順・opr-monitoring-sample・opr-batch-sample は「9:30 に前日の閉店後の成功記録なし」で食い違う / 「9:30 に前日の閉店後の成功記録なし」に直した / `vp-qe-kata-conformance`、`vp-dev-change-impact` / -
- R5-3: R5 / opr-sample「バックアップ確認・リストア手順」 / 復元と演習の判定が販売件数だけで、分冊 opr-backup-restore-sample の判定（販売件数とつけ残高の合計の照合、照合を終えるまでの所要時間、DEV が記録して OPS が月次点検で確かめる分担）と食い違う / 復元の完了条件と演習の比べる値につけ残高の合計を加え、所要時間を「復元の開始から照合を終えるまで」とし、演習の記録と確認の分担を分冊に合わせた / `vp-qe-kata-conformance`（index と個別の整合） / -
- R5-4: R5 / opr-sample「バックアップ確認・リストア手順」 / 障害対応手順・アカウント付与・剥奪手順の章には分冊への案内があるが、この章だけ分冊 opr-backup-restore-sample への案内がない / 章の冒頭に「復元の手順と演習の判定基準の詳細は [[specdojo:opr-backup-restore-sample\|運用手順（バックアップ確認・リストア）]] に従う」を足した / `vp-qe-kata-conformance`、`vp-dev-change-impact` / -
- R5-5: R5 / opr-backup-restore-sample「概要」の未決事項の表、「演習」の判定基準の表 / RTO の仮の合格条件を「翌日の開店前点検（9:45）まで、15 時間 45 分以内」としているが、opr-sample と opd-index-sample は「翌営業日の開店まで」で、休業日をはさむ場合と開店時刻の 15 分の差が食い違う / - / `vp-qe-kata-conformance`。分冊の値はより厳しい具体化として成り立つため直していない。「翌営業日」に変えると固定の時間の閾値（15 時間 45 分）が成り立たなくなる。翌営業日の基準へそろえる案は選ばなかった / 要判断
- R5-6: R5 / opd-index-sample「監視・アラート方針」の閉店後のバックアップの行 / 通知の条件が「翌朝の開店時に前日の閉店後の成功記録がない」で、手順側（opr-sample・opr-monitoring-sample・opr-batch-sample）の「開店 30 分前の 9:30」と時刻の書き方が違う / - / `vp-dev-change-impact`。相手側を直す案: opd-index-sample の該当セルを「翌朝 9:30（開店 30 分前）に前日の閉店後の成功記録がない」にする。この段では相手側を変更しない / -
- grade の finding の扱い: F003 は前の段で opr-sample の関連ドキュメント導線が全分冊の作成済の行になって解消済み（同じ系統の opr-backup-restore-sample 側は R5-1 で直した）。F002 は R4（`vp-qe-verifiability`）の観点であり、opr-sample の概要の未決事項に保管期間の行が既にあるため、この段では扱わない。F001・F004（`vp-po-decision-readiness`・`vp-ops-release-readiness`）は kata-guide の「kata の観点の組」で kata の段のレビューから外す観点のため扱わない。
- 用語集（docs/ja/product/010-business-specs/060-glossary/）には運用手順の用語（バックアップ・復元・RTO・つけ など）の項目がなく、食い違いはなかった。共通サンプル文脈（駄菓子屋きぬや・店番担当・Role code）にも外れていない。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

kata-guide の R5（整合）に従い、同じ接頭辞の sample（index と個別）、wikilink の参照先、用語集、共通サンプル文脈を読んで食い違いを確かめた。sample の側を直す差分を入れ、相手側を直すべき点は変更せず案を handoff に書いた。用語集には運用手順の用語の項目がなく、食い違いはなかった。共通サンプル文脈（駄菓子屋きぬや・店番担当・Role code）にも外れていない。`status` は `draft` のまま据え置いた。
