---
specdojo:
  id: prj-0001:xer-t-kata-review-calibration-opr-sample-150-20261128t084025z-7ede9603
  type: exec-result
  task_id: T-KATA-REVIEW-CALIBRATION-opr-sample-150
  mode: edit
  status: superseded
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-CALIBRATION-opr-sample-150/T-KATA-REVIEW-CALIBRATION-opr-sample-150-20261128T084025Z-7ede9603/plan.md
  started_at: "2026-11-28T08:40:44.944Z"
  completed_at: "2026-11-28T10:26:39.254Z"
  agent: sol-executor
  approach: sample-maintenance
  targets:
    - specdojo:opr-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- opr-sample の R5（整合）を実施した。変更したのは対象の sample だけである。上位方針や index sample、各分冊 sample と食い違う箇所を、sample 側で直した。
- 直した内容は次の6点である。分冊が参照する `opr-index` と入口の関係を明記した。欠品記録の手順と保存先を足した。未決の目標は達成・未達を判定しないと明記した。P3 のエスカレーションを方針に揃えた。アラート対応の時限と恒久対応の完了条件を監視分冊に揃えた。復元演習の記録を独立した行にした。
- 相手側の文書（index sample と各分冊 sample）で直すべき点は、変更せずに直す案として findings に残した。
- runner の `npm run lint:md:changed` は失敗した。原因は `watch-scan-20261128.md` の MD028 で、変更対象の opr-sample ではない。この watch-scan ファイルは変更ファイル一覧に含まれ、runner が生成した実行記録とみられる。executor の整形・差分・wikilink の検査は通過した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-01 | R5 | 1. 概要、12. 関連ドキュメント導線 | 分冊が本書を指す際の `opr-index` と、入口の `specdojo:opr-index-sample` の関係が曖昧だった。 | 分冊中の `opr-index` が参照する共通規約を本書に置くことを明記した。作成済み分冊への導線は維持した。 | source=grade F003、`vp-qe-kata-conformance`、opr-rulebook 1.1・6.1、各分冊 sample の概要と参照ID | - |
| R5-02 | R5 | 3. 日次・週次・月次点検手順、11. 証跡 | 月次集計で使う欠品記録について、日次の記録手順と保存先がなく、運用方針と index sample の記録導線につながっていなかった。 | 固定した人気商品の欠品を閉店後に記録する行と、在庫画面への保存・参照権限・識別子の行を追加した。 | `vp-qe-kata-conformance`、opd-index-sample 3章、opr-index-sample 3・11章、Sample 記述標準 2・3.4章 | - |
| R5-03 | R5 | 3. 日次・週次・月次点検手順 | 運用方針は未決の目標で達成・未達を判定しないが、本書の指標の扱いにはその例外がなかった。 | 未決の目標は測定値だけを残し、達成・未達を判定しないと明記した。 | `vp-qe-kata-conformance`、opd-index-sample 1・3章、opr-rulebook 7章 | - |
| R5-04 | R5 | 4. 障害対応手順 | P3 のエスカレーションが「なし」で、回避策を使えなくなった場合の優先度見直しが方針と一致しなかった。 | 回避できなくなったら方針の条件で優先度を見直し、その期限で連絡する記述へ変更した。 | `vp-qe-kata-conformance`、opd-index-sample 4章、opd-incident-management-sample 2.1章 | - |
| R5-05 | R5 | 5. アラート対応手順 | 通知後の初動時限と営業時間外の扱いが、具体化した分冊へ接続されていなかった。 | 時限と営業時間外の扱いを opr-monitoring-sample に従う参照で補った。条件は重複掲載していない。 | `vp-qe-kata-conformance`、opd-monitoring-sample 2.3章、opr-monitoring-sample 1・5章 | - |
| R5-06 | R5 | 5. アラート対応手順 | 恒久対応の完了条件が「翌日の通知なし」で、分冊の「翌営業日に同じ原因の通知なし」と異なっていた。 | 翌営業日の同じ監視で同じ原因の通知が出ない条件に統一した。 | `vp-qe-kata-conformance`、opr-monitoring-sample 5章 | - |
| R5-07 | R5 | 11. 証跡 | 復元演習の記録を参照権限が `OPS`・`PO` の月次点検記録にまとめており、分冊で結果を記録する `DEV` の参照権限が読み取れなかった。 | 復元演習の記録を独立した行にし、分冊と同じ保存先・参照権限・識別子を明記した。月次点検と同じ `ticket_id` は維持した。 | `vp-qe-kata-conformance`、opr-backup-restore-sample 6.3・11章 | - |
| R5-08 | R5 | 相手側 opr-index-sample 1・12章 | index 自身も共通手順の正本とし、分冊は障害対応だけと記載する一方、各分冊は opr-sample の共通規約を参照している。 | docs/ja/specdojo/samples/opr-index-sample.md で二つの完成例の適用関係を明記し、共通規約の参照先と全分冊の導線を揃える案。ID の改名や統合は選ばなかった。 | source=grade F003、`vp-qe-kata-conformance`、opr-index-rulebook 2章、各分冊の概要。両文書が別の完成例なのか同時に使う構成なのか確定できない。 | 要判断 |
| R5-09 | R5 | 相手側 opr-index-sample 9章 | アカウントの付与・剥奪の実施者を `DEV` とするが、方針・本書・権限分冊は `OPS` が操作する。 | docs/ja/specdojo/samples/opr-index-sample.md の実施者と権限変更記録の導線を、具体化した方針に揃える案。 | `vp-qe-kata-conformance`、opd-access-control-sample 2.2章、opr-sample 9章、opr-access-control-sample 9.2章 | - |
| R5-10 | R5 | 相手側 opr-index-sample 5章 | 誤検知の閾値見直しを「月 3 回を超えたら」とするが、方針・本書・監視分冊は「月 3 件以上」とする。 | docs/ja/specdojo/samples/opr-index-sample.md の条件を月 3 件以上に揃える案。 | `vp-qe-kata-conformance`、opd-monitoring-sample 2.4章、opr-sample 5章、opr-monitoring-sample 3章 | - |
| R5-11 | R5 | 相手側 opr-incident-sample 4.3章 | 紙の控えから転記した件数・金額の照合を `OPS` が行うが、上位方針は `DEV` が照合すると定める。 | docs/ja/specdojo/samples/opr-incident-sample.md の手順5を `DEV` の照合へ揃え、`OPS` の報告・記録と分ける案。 | `vp-qe-kata-conformance`、opd-index-sample 6章、opd-incident-management-sample 2.2章 | - |
| R5-12 | R5 | 相手側 opr-backup-restore-sample 1・6.3章 | 未決 RTO の暫定条件を翌日の 9:45 および所要 15時間45分とする一方、上位方針と本書は翌営業日の開店までとする。 | docs/ja/specdojo/samples/opr-backup-restore-sample.md の暫定期限を翌営業日の開店へ揃え、9:45 を事前確認の時刻として区別する案。一律に所要16時間へ置き換える案は選ばなかった。 | `vp-qe-kata-conformance`、opd-index-sample 8章、opr-sample 1・6章。9:45 が意図した厳しい期限か確認できない。 | 要判断 |
| R5-13 | R5 | 相手側 opr-access-control-sample 3章 | 管理区分以外のつけ残高訂正・価格変更を一律に報告対象とし、方針が明示する緊急権限中の `DEV` の操作の除外がない。 | docs/ja/specdojo/samples/opr-access-control-sample.md の月次監査ログの判定から緊急権限中の操作を除き、9.4章の事後確認で扱う参照を足す案。 | `vp-qe-kata-conformance`、opd-access-control-sample 2.5章 | - |
| R5-14 | R5 | 相手側 opr-incident-sample 4.1章 | P3 で回避できなくなったら優先度を一つ上げるとするが、方針の例では販売を記録できなくなった場合は P1 とする。 | docs/ja/specdojo/samples/opr-incident-sample.md の P3 のエスカレーションを、業務への影響から優先度を再判定する記述へ揃える案。 | `vp-qe-kata-conformance`、opd-incident-management-sample 2.1章、opr-sample 4章 | - |

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/execution/queues/kra-day2-2026-11-26.json`: 変更、+8 / -10 行
- `docs/ja/projects/prj-0001/execution/reports/watch-scan/watch-scan-20261126.md`: 変更、+19 / -79 行
- `docs/ja/projects/prj-0001/execution/watch/watch-events.jsonl`: 変更、+88 / -0 行
- `docs/ja/specdojo/samples/opr-sample.md`: R5 の整合に合わせて更新した。概要と関連導線では、分冊の `opr-index` が参照する共通規約を本書に置くと明記した。点検手順では、欠品記録の行を追加し、未決の目標は測定値だけを残して達成・未達を判定しないと明記した。障害対応では、P3 のエスカレーションを方針の優先度見直し条件に合わせた。アラート対応では、時限と営業時間外の扱いを監視分冊への参照にし、恒久対応の完了条件を翌営業日の同じ原因の通知なしに統一した。証跡では、欠品記録と復元演習の記録を、保存先・参照権限・識別子つきで独立した行にした。frontmatter と12章の見出しは維持した。
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
- `docs/ja/projects/prj-0001/execution/reports/watch-scan/watch-scan-20261128.md`: 追加、+299 / -0 行
- `docs/ja/projects/prj-0001/execution/watch/diagnoses/63dfcbdd4b6a79ba980292a840a30470dffb5d38df956352c4541a25c9e2019e.json`: 追加、+2 / -0 行
- `docs/ja/projects/prj-0001/execution/watch/diagnoses/63dfcbdd4b6a79ba980292a840a30470dffb5d38df956352c4541a25c9e2019e.retry.json`: 追加、+2 / -0 行
- `docs/ja/projects/prj-0001/execution/watch/diagnoses/651e2fc28fc906c4c988fe7aa4a702cabdd66f3cbe4b0a68b82edfc99c188ac2.json`: 追加、+2 / -0 行
- `docs/ja/projects/prj-0001/execution/watch/diagnoses/7d53139af2412e3faed9e631b7b1139b2c952e4ce5650ca65260afaac8d13f8c.json`: 追加、+2 / -0 行
- `docs/ja/projects/prj-0001/execution/watch/diagnoses/83185a230a6eea7f5bfaf8763c3efee82f0490f7ace0310cd372cc745a33aa92.json`: 追加、+2 / -0 行
- `docs/ja/projects/prj-0001/execution/watch/diagnoses/b8a981a29ee8aa6a35a2fb37c4c1af73089b9963d44fd6de63fc4c74beaac80f.json`: 追加、+2 / -0 行

## 3. 申し送り

- F001 と F004 は kata-guide 6.3 が除外する観点のため、決定者や ready 化の列は追加していない。F002 は先行の R4 で解消済みのため、再指摘していない。
- R5-08 と R5-12 は要判断とした。R5-08 は、opr-sample と opr-index-sample が別の完成例なのか、同時に使う構成なのかを確定できない。R5-12 は、9:45 が意図した厳しい期限なのかを確認できない。
- `lint:md:changed` の失敗は `docs/ja/projects/prj-0001/execution/reports/watch-scan/watch-scan-20261128.md` の MD028 である。本タスクの変更対象外で、この evidence だけでは発生元を断定できない。
- R5-01: R5 / 箇所: 1. 概要、12. 関連ドキュメント導線 / 指摘: 分冊が本書を指す際の `opr-index` と、入口の `specdojo:opr-index-sample` の関係が曖昧 / 直した案: 分冊中の `opr-index` が参照する共通規約を本書に置くことを明記した。現行版の作成済み分冊への導線は維持 / 根拠: source=grade F003、`vp-qe-kata-conformance`、opr-rulebook 1.1・6.1、opr-incident・batch・backup-restore・change・access-control・support の各 sample の概要と実際の参照ID / 印: -
- R5-02: R5 / 箇所: 3. 日次・週次・月次点検手順、11. 証跡 / 指摘: 月次集計で使う欠品記録について、日次の記録手順と保存先がなく、運用方針と index sample の記録導線につながっていない / 直した案: 固定した人気商品の欠品を閉店後に記録する行と、在庫画面への保存・参照権限・識別子の行を追加 / 根拠: `vp-qe-kata-conformance`、opd-index-sample 3章、opr-index-sample 3・11章、Sample 記述標準 2・3.4章 / 印: -
- R5-03: R5 / 箇所: 3. 日次・週次・月次点検手順 / 指摘: 運用方針は未決の目標で達成・未達を判定しないが、本書の指標の扱いにはその例外がない / 直した案: 未決の目標は測定値だけを残し、達成・未達を判定しないと明記 / 根拠: `vp-qe-kata-conformance`、opd-index-sample 1・3章、opr-rulebook 7章の OPD と矛盾する手順の禁止 / 印: -
- R5-04: R5 / 箇所: 4. 障害対応手順 / 指摘: P3 のエスカレーションが「なし」で、回避策を使えなくなった場合の優先度見直しが方針と一致しない / 直した案: 回避できなくなったら方針の条件で優先度を見直し、その期限で連絡する記述へ変更 / 根拠: `vp-qe-kata-conformance`、opd-index-sample 4章、opd-incident-management-sample 2.1章の販売を記録できなくなったら P1 とする例 / 印: -
- R5-05: R5 / 箇所: 5. アラート対応手順 / 指摘: 通知後の初動時限と営業時間外の扱いが、具体化した分冊へ接続されていない / 直した案: 時限と営業時間外の扱いを opr-monitoring-sample に従う参照で補完 / 根拠: `vp-qe-kata-conformance`、opd-monitoring-sample 2.3章、opr-monitoring-sample 1・5章。条件を重複掲載せず参照する / 印: -
- R5-06: R5 / 箇所: 5. アラート対応手順 / 指摘: 恒久対応の完了条件が「翌日の通知なし」で、分冊の「翌営業日に同じ原因の通知なし」と異なる / 直した案: 翌営業日の同じ監視で同じ原因の通知が出ない条件に統一 / 根拠: `vp-qe-kata-conformance`、opr-monitoring-sample 5章の恒久対応の完了条件 / 印: -
- R5-07: R5 / 箇所: 11. 証跡 / 指摘: 復元演習の記録を参照権限が `OPS`・`PO` の月次点検記録にまとめており、分冊で結果を記録する `DEV` の参照権限が読み取れない / 直した案: 復元演習の記録を独立した行にし、分冊と同じ保存先・参照権限・識別子を明記。月次点検と同じ `ticket_id` を維持 / 根拠: `vp-qe-kata-conformance`、opr-backup-restore-sample 6.3・11章 / 印: -
- R5-08: R5 / 箇所: 相手側 opr-index-sample 1・12章 / 指摘: index 自身も共通手順の正本とし、分冊は障害対応だけと記載する一方、各分冊は opr-sample の共通規約を参照している / 直した案: - / 根拠: source=grade F003、`vp-qe-kata-conformance`、opr-index-rulebook 2章、各分冊の概要。docs/ja/specdojo/samples/opr-index-sample.md で二つの完成例の適用関係を明記し、共通規約の参照先と全分冊の導線を揃える案。両文書が別の完成例なのか同時に使う構成なのか確定できないため、ID の改名や統合は選ばなかった / 印: 要判断
- R5-09: R5 / 箇所: 相手側 opr-index-sample 9章 / 指摘: アカウントの付与・剥奪の実施者を `DEV` とするが、方針・本書・権限分冊は `OPS` が操作する / 直した案: - / 根拠: `vp-qe-kata-conformance`、opd-access-control-sample 2.2章、opr-sample 9章、opr-access-control-sample 9.2章。docs/ja/specdojo/samples/opr-index-sample.md の実施者と権限変更記録の導線を具体化した方針に揃える案 / 印: -
- R5-10: R5 / 箇所: 相手側 opr-index-sample 5章 / 指摘: 誤検知の閾値見直しを「月 3 回を超えたら」とするが、方針・本書・監視分冊は「月 3 件以上」とする / 直した案: - / 根拠: `vp-qe-kata-conformance`、opd-monitoring-sample 2.4章、opr-sample 5章、opr-monitoring-sample 3章。docs/ja/specdojo/samples/opr-index-sample.md の条件を月 3 件以上に揃える案 / 印: -
- R5-11: R5 / 箇所: 相手側 opr-incident-sample 4.3章 / 指摘: 紙の控えから転記した件数・金額の照合を `OPS` が行うが、上位方針は `DEV` が照合すると定める / 直した案: - / 根拠: `vp-qe-kata-conformance`、opd-index-sample 6章、opd-incident-management-sample 2.2章。docs/ja/specdojo/samples/opr-incident-sample.md の手順5を `DEV` の照合へ揃え、`OPS` の報告・記録と分ける案 / 印: -
- R5-12: R5 / 箇所: 相手側 opr-backup-restore-sample 1・6.3章 / 指摘: 未決 RTO の暫定条件を翌日の 9:45 および所要 15時間45分とする一方、上位方針と本書は翌営業日の開店までとする / 直した案: - / 根拠: `vp-qe-kata-conformance`、opd-index-sample 8章、opr-sample 1・6章。docs/ja/specdojo/samples/opr-backup-restore-sample.md の暫定期限を翌営業日の開店へ揃え、9:45 を事前確認の時刻として区別する案。9:45 が意図した厳しい期限か確認できないため、一律に所要16時間へ置き換える案は選ばなかった / 印: 要判断
- R5-13: R5 / 箇所: 相手側 opr-access-control-sample 3章 / 指摘: 管理区分以外のつけ残高訂正・価格変更を一律に報告対象とし、方針が明示する緊急権限中の `DEV` の操作の除外がない / 直した案: - / 根拠: `vp-qe-kata-conformance`、opd-access-control-sample 2.5章。docs/ja/specdojo/samples/opr-access-control-sample.md の月次監査ログの判定から緊急権限中の操作を除き、9.4章の事後確認で扱う参照を足す案 / 印: -
- R5-14: R5 / 箇所: 相手側 opr-incident-sample 4.1章 / 指摘: P3 で回避できなくなったら優先度を一つ上げるとするが、方針の例では販売を記録できなくなった場合は P1 とする / 直した案: - / 根拠: `vp-qe-kata-conformance`、opd-incident-management-sample 2.1章、opr-sample 4章。docs/ja/specdojo/samples/opr-incident-sample.md の P3 のエスカレーションを、業務への影響から優先度を再判定する記述へ揃える案 / 印: -
- 「進め方と実践の型の適用」への記録事項: kata-guide 6.1・6.3・6.5、Sample 記述標準（共通サンプル文脈を含む）、opr-rulebook、opr-template、opr-index-rulebook、共通レビュー観点一覧の該当観点、opr 系 sample 全9文書、対象の wikilink と `based_on` の参照先、opd-monitoring-sample、用語集全6ファイルの語彙と該当定義、grade result、先行 R1〜R4 の result を確認した。OPR の対応 recipe は宣言・実ファイルとも存在しない。章構成は rulebook・template を正として維持した。共通文脈・用語集との追加の不整合は見つからなかった。
- grade finding の扱い: `source=grade` F003 は現行版と参照先を再照合した。分冊一覧は既に作成済みの状態であり、今回の対応は R5-01・R5-08 に記録した。F002 は先行 R4 で解消済みのため再指摘せず、保管期間が決まるまで削除しない扱いを維持した。F001・F004 は kata-guide 6.3 が除外する観点のため、承認判断・ready 化の列は追加していない。plan に condense 由来の finding はない。R4 の実装正本不足による留保は本段で再評価していない。
- 変更ファイル欄への記録事項: docs/ja/specdojo/samples/opr-sample.md のみ。差分は26行追加・23行削除で表の整形を含む。frontmatter と12章の見出しを維持した。result と grade サイドカーは編集していない。指定された親検証は runner に委ねた。
- 適用外の検証: `npm run validate:schema:file`（変更対象は Markdown sample のみで、YAML/YML ファイルを変更していない。）
- 適用外の検証: `npm run validate:history-links`（履歴ファイル、既存 plan、result を編集していない。）
- 適用外の検証: `npm run validate:catalog`（成果物変更は docs/ja/specdojo/samples/ 内に限られ、docs/ja/projects/ 配下に及ばない。）

## 4. 進め方と実践の型の適用

kata-guide 6.1・6.3・6.5、Sample 記述標準、opr-rulebook、opr-template、opr-index-rulebook、共通レビュー観点、opr 系 sample 全9文書、対象の wikilink と `based_on` の参照先、opd-monitoring-sample、用語集、grade result、先行 R1〜R4 の result を確認した。OPR の対応 recipe は宣言も実ファイルも存在しない。構造は rulebook と template を正として維持した。共通文脈や用語集との追加の不整合は見つからなかった。grade の F003 は R5-01 と R5-08 で扱った。F001 と F004 は 6.3 の除外観点のため扱っていない。F002 は R4 で解消済みである。R4 の実装正本不足による留保は、本段では再評価していない。
