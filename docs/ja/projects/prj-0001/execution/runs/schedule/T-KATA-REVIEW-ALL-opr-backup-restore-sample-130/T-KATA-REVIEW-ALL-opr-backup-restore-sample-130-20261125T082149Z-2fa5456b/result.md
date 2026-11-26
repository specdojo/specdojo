---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-backup-restore-sample-130-20261125t082149z-2fa5456b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-backup-restore-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-backup-restore-sample-130/T-KATA-REVIEW-ALL-opr-backup-restore-sample-130-20261125T082149Z-2fa5456b/plan.md
  started_at: "2026-11-25T08:21:59.001Z"
  completed_at: "2026-11-25T08:36:56.061Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-backup-restore-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、`docs/ja/specdojo/samples/opr-backup-restore-sample.md` に文の直しを 9 か所入れた。主語の補い、ねじれた文や長い文の分割、指示語の置き換え、RTO・RPO とロール略語の正式名の追加を行った。意味と判断に要る条件は変えていない。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R3-1 | R3 | 1. 概要 | 冒頭の文に主語がなく、主語と述語がねじれている | 「本書 `opr-backup-restore` は、…手順を定める。」に直し、続く文の頭に「本書は」を足した | W1、W2 | - | | R3-2 | R3 | 1. 概要 | ロール略語 `PO`・`DEV`・`OPS` が正式名なしで使われている | 概要の最後に、担当ロールの正式名と `PO` が決める範囲を述べる 1 文を足した | W8 | 要判断 | | R3-3 | R3 | 1. 概要（未決事項の表） | RTO・RPO に正式名がなく、独自の言い換えがある | 「目標復旧時間（RTO）」「目標復旧時点（RPO）」に直し、`opr-sample` の表記にそろえた | W8 | - | | R3-4 | R3 | 6. バックアップ確認・リストア手順 | 主語と述語がねじれ、1 文に 2 つの主張がある | 2 文に分けた | W2、W3 | - | | R3-5 | R3 | 6.3. 演習 | 主語がなく、「その」の指す先が読み取りにくい | 「運用変更の確認中であれば、`OPS` は演習を確認の後に回す。」に直した | W1、W4 | - | | R3-6 | R3 | 6.3. 演習 | 片付けの文に主語がない | 主語に `DEV` を足した | W1 | - | | R3-7 | R3 | 8. 運用変更作業 | 読点が 4 つある長い 1 文に条件・手順・完了条件が詰まっている | 2 文に分けた | W3 | - | | R3-8 | R3 | 11. 証跡 | 模擬の文に主語がない | 主語に `DEV` を足した | W1 | 要判断 | | R3-9 | R3 | 7. バッチ再実行・失敗時対応 | 失敗時の行き先が 6.1 と食い違う。通知の時刻も `opr-sample` と食い違う | R4・R5 に任せる | - | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-backup-restore-sample.md`: R3（読みやすさ）の文の直しを 8 行の挿入と 8 行の削除で入れた。主語を補い、ねじれた文や長い文を分割し、指示語を具体化した。RTO・RPO とロール略語には正式名を添えた。意味と判断に要る条件は変えていない。

## 3. 申し送り

- `finding` の扱い: F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」でレビューに使わない観点とされているため、R3 では直していない。F002（`vp-qe-verifiability`）は R4 に、F003（`vp-qe-kata-conformance`）は R1/R5 に任せる。 要判断: R3-2 は 1 文増えるため、`vp-arc-conciseness` と釣り合うかを人が決める。R3-8 は、模擬を行うのが `DEV` か `OPS` かを本文が言い切っていないため、主語を `DEV` にした案でよいかを確かめてほしい。 R3-9 の食い違いは、6.1 と 7 の行き先をそろえる案と、通知の時刻を `opr-sample` の 9:30 にそろえる案がある。判断は R4・R5 に任せる。 編集対象の食い違い: plan の編集対象は `opr-sample.md` と書かれているが、レビュー対象の kata は `opr-backup-restore-sample` で、`finding` の位置もこのファイルを指す。そのため `opr-backup-restore-sample.md` を直し、`opr-sample.md` は変えていない。plan の編集対象の決め方を確かめてほしい。
- R3-1: R3 / 1. 概要 / 冒頭の文に主語がなく、「〜手順を定める `opr-backup-restore` である」と主語と述語がねじれている / 「本書 `opr-backup-restore` は、…手順を定める。」に直し、続く文の頭に「本書は」を足した / W1、W2 / -
- R3-2: R3 / 1. 概要 / ロールの略語 `PO`・`DEV`・`OPS` が、初めて出る箇所で正式名を添えずに使われている / 概要の最後に「手順を行うのは店番担当・開発（`DEV`: Developer）・運用／リリース管理（`OPS`: Operations / Release Manager）で、復元と演習の結果の扱いはプロジェクト責任者（`PO`: Project Owner）が決める。」の 1 文を足した / W8 / 要判断（迷った理由: 1 文増えるので `vp-arc-conciseness` と釣り合うかを人が決める。選ばなかった案: 正式名は `opr-index` 側に任せ、本書では足さない）
- R3-3: R3 / 1. 概要（未決事項の表） / RTO・RPO に正式名がなく、括弧の中で独自の言い換えをしている / 「目標復旧時間（RTO）」「目標復旧時点（RPO）」に直した（`opr-sample` の表記にそろえた。意味は右の列の扱いが示す） / W8 / -
- R3-4: R3 / 6. バックアップ確認・リストア手順 / 「取得は夜間バックアップが…行い、」と主語と述語がねじれ、1 文に 2 つの主張がある / 「夜間バックアップは、閉店後の日次締めの後に 1 日 1 回自動で取得する。同じ日付の取得は同じ世代を上書きする。」の 2 文に分けた / W2、W3 / -
- R3-5: R3 / 6.3. 演習 / 「確認中であれば、演習をその確認の後に回す。」は主語がなく、「その」が指す先も読み取りにくい / 「運用変更の確認中であれば、`OPS` は演習を確認の後に回す。」に直した / W1、W4 / -
- R3-6: R3 / 6.3. 演習 / 「演習の後、検証用の環境へ戻したデータを…片付ける」に主語がない / 主語に `DEV` を足した（演習を行うのは `DEV` のため） / W1 / -
- R3-7: R3 / 8. 運用変更作業 / 読点が 4 つある長い 1 文に、条件・従う手順・完了条件が詰まっている / 「…場合は、`opr-index` の運用変更作業に従う。」と「承認者と実施条件は「アプリの版の更新」と同じとし、…完了条件に加える。」の 2 文に分けた / W3 / -
- R3-8: R3 / 11. 証跡 / 模擬の文に主語がない / 「`DEV` は、月次の演習では通らない復元の手順 2・5・6 と、…」と主語を足した（検証用の環境の操作は `DEV` が行う） / W1 / 要判断（迷った理由: 模擬を行うのが `DEV` か `OPS` かを本文は言い切っていない。選ばなかった案: 主語を `OPS` にする、または主語を足さない）
- R3-9: R3 / 7. バッチ再実行・失敗時対応 / 本書の確認で失敗を見つけたときの行き先が「バッチ再実行」になっており、6.1 の「アラート対応手順へ進む」と食い違っている。5. アラート対応手順の「開店時に成功記録なし」と `opr-sample` の「9:30」も食い違っている / - / R4・R5 に任せる（本書の 6.1 と 7 の行き先をどちらかにそろえる案と、通知の時刻を `opr-sample` の 9:30 にそろえる案） / -
- finding の扱い（R3 では扱わない）: F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」でレビューに使わない観点としているため直していない。F002（`vp-qe-verifiability`）は R4、F003（`vp-qe-kata-conformance`。関連ドキュメント導線の `opr-incident` が「予定」のままで、`opr-incident-sample` はすでにある）は R1/R5 に任せる。
- 編集対象の食い違い: plan の編集対象は `docs/ja/specdojo/samples/opr-sample.md` と書かれているが、レビューする kata は `opr-backup-restore-sample` で、finding の位置もこのファイルを指す。同じ kata の R1・R2 の段もこのファイルを直していたため、`docs/ja/specdojo/samples/opr-backup-restore-sample.md` を直した。`opr-sample.md` は変えていない。plan を作るときの編集対象の決め方を確かめてほしい。
- 適用外の検証: `npm run validate:history-links`（自分で変えた履歴ファイル（plan・result・個票）がないため）
- 適用外の検証: `npm run validate:schema:file`（変えた YAML ファイルがないため）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従い、kata-guide の R3（読みやすさ）として W1〜W10 に沿った文の直しを sample に入れた。展開された `finding` F001〜F004 は R3 の観点に当たらないため直さず、扱う段に任せた。整形と静的検査（prettier、markdownlint、runner の lint-md-changed・lint-fm-changed・lint-mermaid・lint-d2・test-docs・validate-schema）は通った。`status` は `draft` のまま据え置いた。
