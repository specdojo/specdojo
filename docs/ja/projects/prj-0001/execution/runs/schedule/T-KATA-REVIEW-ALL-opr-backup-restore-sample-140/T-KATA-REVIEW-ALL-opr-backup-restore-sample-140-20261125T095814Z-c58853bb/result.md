---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-backup-restore-sample-140-20261125t095814z-c58853bb
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-backup-restore-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-backup-restore-sample-140/T-KATA-REVIEW-ALL-opr-backup-restore-sample-140-20261125T095814Z-c58853bb/plan.md
  started_at: "2026-11-25T09:58:24.735Z"
  completed_at: "2026-11-25T10:12:16.283Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-backup-restore-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として `docs/ja/specdojo/samples/opr-sample.md` のバックアップ確認・リストアに関わる主張を、opd-index-sample・opr-backup-restore-sample・opr-batch-sample・opr-monitoring-sample・deliverable-frontmatter schema と照合した。 | No | 主張 | 正本 | 結果 | | --- | --- | --- | --- | | 1 | frontmatter の `type: operations` | deliverable-frontmatter schema の enum | 一致 | | 2 | RTO/RPO 未決時は翌営業日の開店までに前日閉店時点へ復元できれば合格 | opd-index-sample | 一致 | | 3 | 自動取得は閉店後に 1 日 1 回 | opd-index-sample、opr-batch-sample | 一致 | | 4 | 9:30 に成功記録がなければ通知し P2 でバッチ再実行へ進む | opr-monitoring-sample、opd-index-sample | 一致 | | 5 | 誤検知は、実行ログが成功で世代の取得日が前日の `closing_date` と一致すれば終了 | opr-batch-sample | 一致 | | 6 | 復元は P1 で `PO` が決めた場合に `DEV` が行い、当日分を転記する | opr-backup-restore-sample、opd-index-sample | 一致 | | 7 | 月次の復元演習は `DEV` が行い `OPS` が確かめ、不一致なら P2 | opd-index-sample | 一致 | | 8 | 再実行は自動取得を含め 1 日 2 回（手動は 1 回）、上限到達時は P2 のまま翌朝も失敗なら P1 | opr-batch-sample | 一致 | | 9 | 証跡の識別子は `run_id`・実行日時・`ticket_id` | opr-backup-restore-sample、opr-batch-sample | 一致 | | 10 | 関連ドキュメント導線の wikilink の id | samples 配下の各 frontmatter id | 一致 | | 11 | 識別子 `closing_date`・`run_id` | 正本なし | 確かめられない | 一致 10 件、確かめられない 1 件、不一致 0 件だった。誤りがないため sample は変更していない。

## 2. 変更ファイル

- なし

## 3. 申し送り

- F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、executor が kata の段で使わない観点と判断して扱っていない。F002（`vp-qe-verifiability`）は、`opr-sample` の未決事項の表に監査ログ以外の証跡の保管期間の行があるため解消済みとされている。F003（`vp-qe-kata-conformance`）は R5 の観点で、`opr-sample` 側は分冊を列挙済みのため解消済みとされている。
- R4 確かめ No1: 主張「frontmatter の `type: operations`」/ 正本 docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml / 確かめ方: deliverableType の enum を grep / 結果: 一致 / 根拠: enum に operations（運用設計・手順）がある
- R4 確かめ No2: 主張「未決事項の表: RTO/RPO が決まるまでは、翌営業日の開店までに前日閉店時点へ復元できれば合格」/ 正本 docs/ja/specdojo/samples/opd-index-sample.md（バックアップ・リストア方針）/ 確かめ方: 読み取り / 結果: 一致 / 根拠: RTO は『翌営業日の開店までに復元して記録を再開する』、RPO は『前日の閉店時点に戻ることを許す』
- R4 確かめ No3: 主張「バックアップ確認・リストア手順: 自動取得は閉店後に 1 日 1 回」/ 正本 opd-index-sample.md（取得の頻度）、opr-batch-sample.md（手順適用範囲・前提）/ 確かめ方: 読み取り / 結果: 一致 / 根拠: 『毎日、閉店後の日次締めの後に 1 回』
- R4 確かめ No4: 主張「アラート対応手順: 夜間バックアップは 9:30 に前日の閉店後の成功記録がなければ通知し、P2 としてバッチ再実行へ進む」/ 正本 opr-monitoring-sample.md（時間帯・点検・アラート）、opd-index-sample.md（監視・アラート方針）/ 確かめ方: 読み取り / 結果: 一致 / 根拠: monitoring が開店 30 分前の 9:30 に確認し P2 とする。opd は『P2 として DEV に再取得を依頼する』
- R4 確かめ No5: 主張「誤検知: 実行ログが成功で、世代の取得日が前日の `closing_date` と一致すれば終了」/ 正本 opr-batch-sample.md（アラート対応手順の誤検知）/ 確かめ方: 読み取り / 結果: 一致
- R4 確かめ No6: 主張「復元は P1 で `PO` が決めた場合に `DEV` が行い、最新の成功したバックアップを本番へ戻して当日分を転記する」/ 正本 opr-backup-restore-sample.md（復元）、opd-index-sample.md（当日分の転記）/ 確かめ方: 読み取り / 結果: 一致
- R4 確かめ No7: 主張「演習: `DEV` が月次で前日のバックアップを検証用の環境へ戻して販売件数を比べ、`OPS` が確かめ、一致しなければ P2」/ 正本 opd-index-sample.md（復元の確認・確認者）/ 確かめ方: 読み取り / 結果: 一致 / 根拠: 『月次で、検証用の環境へ復元し、前日の販売件数と一致するかを確かめる』『OPS。復元できなかった場合は P2』
- R4 確かめ No8: 主張「再実行の上限は自動取得を含めて 1 日 2 回（手動は 1 回）。同じ日付の取得は世代を上書きする。上限到達時は P2 のまま翌朝も失敗なら P1」/ 正本 opr-batch-sample.md（再実行上限と上限到達時、重複の防止、優先度の表）/ 確かめ方: 読み取り / 結果: 一致
- R4 確かめ No9: 主張「証跡: 実行ログの識別子は `run_id`・実行日時、復元演習の記録は月次点検の記録と同じ `ticket_id`」/ 正本 opr-backup-restore-sample.md（証跡）、opr-batch-sample.md（証跡）/ 確かめ方: 読み取り / 結果: 一致 / 根拠: 分冊は世代の日付や取得日を追加しているが、index の最低限の識別子と矛盾しない
- R4 確かめ No10: 主張「関連ドキュメント導線の wikilink（`opr-index-sample`・`opr-backup-restore-sample`・`opr-incident-sample` など）」/ 正本 docs/ja/specdojo/samples/ の各 sample の frontmatter の id / 確かめ方: grep で id を照合 / 結果: 一致
- R4 確かめ No11: 主張「識別子 `closing_date`・`run_id`」/ 正本: なし（schema・src・コマンドリファレンスにこの題材の正本がない）/ 確かめ方: sample 間で表記を照合 / 結果: 確かめられない / 根拠: 確かめるには業務データ仕様の正本が要る
- grade の finding の扱い: F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」で kata の段のレビューでは使わない観点のため扱わない。F002（`vp-qe-verifiability`）は、opr-sample の未決事項の表に『監査ログ以外の証跡の保管期間』の行があり解消済み。F003（`vp-qe-kata-conformance`）は R5 の観点。opr-sample の関連導線の表は分冊をすべて作成済として列挙しており、opr-sample 側は解消済み
- R5 への申し送り（opr-backup-restore-sample 側、本タスクの編集対象外）: (1) 関連ドキュメント導線で `opr-incident` を『予定』としているが opr-incident-sample は存在する。本文の呼称 `opr-index` と実在の opr-index-sample の取り違えもある。(2) 未決事項の RTO の仮基準が『開店前点検（9:45）まで』で、opr-sample・opd-index-sample の『開店まで』と違う。(3) アラート対応手順で通知を『開店時』と書くが、opr-sample・opr-monitoring-sample は 9:30。(4) 復元の完了条件でつけ残高の合計も照合するが、opr-sample の復元の完了条件は販売件数だけ。どちらへ揃えるかを R5 で決める
- 適用外の検証: `npx prettier --check` と `npm run validate:history-links` は、sample・履歴ファイルのどちらも変更していないため適用外
- 適用外の検証: `npx prettier --check docs/ja/specdojo/samples/opr-sample.md`（本タスクでは Markdown を含むファイルを変更していないため）
- 適用外の検証: `npm run validate:history-links`（plan・result・個票の履歴ファイルを executor が変更していないため）

## 4. 進め方と実践の型の適用

approach は sample-maintenance。R4（正しさ）として、`opr-sample` の事実に関する主張を、schema と関連 sample の正本に当てて確かめた。照合の結果、誤りは見つからなかった。このため記述はそのまま維持し、sample への編集は行っていない。No11 の `closing_date`・`run_id` は、確かめるための正本が無いため「確かめられない」として残した。finding のうち F001・F004 は kata の段で使わない観点なので扱わず、F002・F003 は `opr-sample` 側では解消済みと判断した。判断の根拠は executor の確かめ結果にある。`opr-backup-restore-sample` 側の不整合は R5 へ申し送る。内容は次のとおり。(1) 関連導線で `opr-incident` を「予定」とし、`opr-index` と書いているが、実在するのは `opr-incident-sample` と `opr-index-sample` である。(2) RTO の仮基準が 9:45 までで、`opr-sample`・`opd-index-sample` の「開店まで」と違う。(3) 通知の時刻を「開店時」とするが、`opr-sample`・`opr-monitoring-sample` は 9:30 である。(4) 復元の完了条件がつけ残高の合計も照合するが、`opr-sample` は販売件数だけである。
