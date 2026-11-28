---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-index-sample-150-20261124t232624z-9bf18022
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-index-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-index-sample-150/T-KATA-REVIEW-ALL-opr-index-sample-150-20261124T232624Z-9bf18022/plan.md
  started_at: "2026-11-24T23:26:33.164Z"
  completed_at: "2026-11-24T23:40:06.855Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-index-sample
    - specdojo:opr-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として `opr-index-sample` を、`opd-index-sample` と個別の opr sample、Sample 記述標準の共通サンプル文脈に照らして確認し、sample 側の食い違い 4 件を直した。
- 直した内容は、日次締めの原因不明の差を翌朝の開店前に `PO` へ伝える条件の追加、夜間バックアップの判定時点を「前日の閉店後」に統一、作成済みの分冊・方針への wikilink 化（2 件）である。
- grade の F001（`vp-qe-verifiability`、人気商品の範囲が未定義）は前の段で解消済みだった。`opd-index-sample` の KPI の行とも整合するため、この段では変更していない。
- 相手側を直す案 3 件（R5-5、R5-6、R5-7）は変更せず handoff に記載した。R5-5 と R5-7 は要判断である。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-index-sample.md`: 日次締めの完了条件に「原因が分からない差は翌朝の開店前に `PO` へ伝えた」を追加した（R5-1）。夜間バックアップの確認・再実行・誤検知の終了条件の 3 か所を「前日の閉店後の成功記録」「記録の日時が前日の閉店後」に直した（R5-2）。障害対応手順の分冊 `opr-incident` を `opr-incident-sample` への wikilink に替えた（R5-3）。関連ドキュメント導線の `opd-monitoring`、`opd-incident-management`、`opd-access-control`、`opr-incident` の 4 行を wikilink（表内は `\|` でエスケープ）にし、状態を「作成済」にした（R5-4）。変更は 22 行の追加と 22 行の削除である。

## 3. 申し送り

- R5-5 と R5-7 は要判断である。R5-5 は、手順の入口が `opr-sample` 経由と `opr-index-sample` 経由に分かれている点で、複数の sample の構成判断が要る。R5-7 は、「閉店後のバックアップ」と「夜間バックアップ」のどちらを正にするかの判断である。
- R5-6（`opd-monitoring-sample` と `opd-incident-management-sample` の `opr-index` 行を wikilink と「作成済」に直す案）は相手側の変更であり、本タスクでは変更していない。
- R5-1: R5 / 日次/週次/月次点検手順（閉店後の日次締めの行） / 差がある場合に原因と金額を書くだけで、`opd-index-sample` の定期運用方針と監視・アラート方針にある「差異が解けない場合は翌朝の開店前に `PO` が確かめる」「通知先は `PO`」への引継ぎがない / 完了条件に「原因が分からない差は翌朝の開店前に `PO` へ伝えた」を足した / `vp-qe-kata-conformance`（`opd-index-sample` の定期運用方針の日次締めの行、監視・アラート方針の日次締めの差異の行） / -
- R5-2: R5 / アラート対応手順・バッチ再実行・失敗時対応 / 夜間バックアップの確認と再実行の条件が「当日分の成功記録」となっている。誤検知の終了条件は「記録の日時が当日の閉店後」で、開店時点ではまだ来ていない時刻を指す。`opd-index-sample` の監視の閾値（翌朝の開店時に前日の閉店後の成功記録がない）と `opr-backup-restore-sample` の日次の確認（前日の閉店後の日時）とも食い違う / 3 か所を「前日の閉店後の成功記録」「記録の日時が前日の閉店後」に直した / `vp-qe-kata-conformance`、`vp-dev-change-impact` / -
- R5-3: R5 / 障害対応手順（表の前の文） / 分冊の `opr-incident` がバッククォートの仮置きのまま。`opr-incident-sample` はすでにあり、本書の障害対応手順を具体化する分冊と自ら宣言している / `[[specdojo:opr-incident-sample|運用手順（障害対応）]]` の wikilink に替えた / Sample 記述標準の「リンクはファイルがある場合に記載し、ない場合はバッククォートで仮置きする」、`vp-qe-kata-conformance` / -
- R5-4: R5 / 関連ドキュメント導線（`opd-index` 参照） / `opd-monitoring`・`opd-incident-management`・`opd-access-control`・`opr-incident` が「予定」・仮置きのまま。各 sample はすでにあり、`opd-index-sample` の導線では作成済として wikilink されている / 4 行を各 sample への wikilink（表のセル内なので `\|` でエスケープ）にし、状態を「作成済」にした / Sample 記述標準のリンクの規則、`vp-qe-kata-conformance` / -
- R5-5: R5 / 関連ドキュメント導線と各個別 sample（相手側） / 手順の入口が 2 つに分かれている。`opr-monitoring-sample`・`opr-backup-restore-sample` などは `opr-sample` を差分元（`opr-index`）として `based_on` と wikilink に置き、`opr-incident-sample` は `opr-index-sample` を差分元としている。`opr-sample` も入口は `opr-index-sample` としているため、本書の「分冊は障害対応だけ」と、ほかの個別手順の実在が食い違う / - / 相手側の案 A: 個別の `opr-*-sample` の差分元を `opr-index-sample` に揃え、本書の導線に分冊として足す。案 B: `opr-sample` と `opr-index-sample` の役割を決めて書き分ける。どちらも複数の sample の構成判断が要り、本書の段だけでは決められないため選ばなかった / 要判断
- R5-6: R5 / `opd-monitoring-sample` と `opd-incident-management-sample` の関連ドキュメント導線（相手側） / `opr-index` が「予定」のバッククォートのまま。`opr-index-sample` はすでにあり、`opd-access-control-sample` と `opd-index-sample` は作成済として wikilink している / - / 相手側の 2 文書の該当行を `[[specdojo:opr-index-sample\|運用手順（全体構成）]]` と「作成済」に直す案。根拠は Sample 記述標準のリンクの規則、`vp-qe-kata-conformance` / -
- R5-7: R5 / 用語（夜間バックアップ・閉店後のバックアップ） / 運用方針（`opd-index-sample`）は「閉店後のバックアップ」、運用手順（本書と `opr-backup-restore-sample`・`opr-monitoring-sample`・`opr-incident-sample`）は「夜間バックアップ」と呼んでいる / - / 手順の側は一貫しているため本書は変えなかった。揃えるなら `opd-index-sample` の監視・定期運用の表に「閉店後のバックアップ（夜間バックアップ）」と書き添える案。方針と手順のどちらの呼び方を正にするかは文書群の判断のため迷った / 要判断
- F001（grade、`vp-qe-verifiability`）: 前の段で「`PO` が運用開始前に固定した人気商品の一覧」「一覧の商品すべて」に直され、解消済み。`opd-index-sample` の KPI の行（同じ対象商品・除外条件、記録の開始前に固定）とも整合することを確認し、この段では変えなかった。

## 4. 進め方と実践の型の適用

根拠とした資料は、`opd-index-sample`、個別の opr sample（`opr-monitoring-sample`、`opr-backup-restore-sample`、`opr-incident-sample`）、Sample 記述標準のリンクの規則と共通サンプル文脈、`kata-guide` の R5 の観点である。改訂した記述は、これらと食い違った 4 件に限った。食い違いがなかった記述は維持した。判定は `vp-qe-kata-conformance` と `vp-dev-change-impact` に基づく。F001 は前の段で「`PO` が運用開始前に固定した人気商品の一覧」に直されていて、`vp-qe-verifiability` の判定根拠に照らして解消済みと確認した。未解消の finding はない。相手側を直す案と、文書群として方針か手順のどちらを正にするかの判断は、いずれも handoff に残した。frontmatter の `status` は `draft` のまま据え置いた。
