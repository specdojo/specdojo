---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-incident-sample-110-20261125t001346z-829a9b7b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-incident-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-incident-sample-110/T-KATA-REVIEW-ALL-opr-incident-sample-110-20261125T001346Z-829a9b7b/plan.md
  started_at: "2026-11-25T00:13:56.559Z"
  completed_at: "2026-11-25T00:27:35.771Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-incident-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を実施した。`opr-incident-sample` の「証跡」の表に、本書の点検手順が証跡として指定する「日次点検の記録」の行を 1 行追加した。
- ほかの必須内容に過不足は見つからなかった。grade の finding F001〜F004 は R1 の観点に当たらないため、sample は変えず、扱う段へ回した。
- runner の検証では `lint-md-changed`・`lint-fm-changed`・`lint-mermaid`・`lint-d2`・`test-docs`・`validate-schema` が通過した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-incident-sample.md`: 「証跡」の表に「日次点検の記録」の行を 1 行追加した。内容は、店内の点検ノート（紙）、保管期間 `_UNDECIDED_`、店番担当と `OPS`、点検日と点検した役割で、`opr-sample` の同じ行に合わせた。これで rulebook が求める必須証跡の保存先・保管期間・参照権限を読み取れる。

## 3. 申し送り

- R1 の指摘一覧は次の表のとおり。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | 1 | R1 | `opr-incident-sample` の「証跡」の表 | 点検手順が指定する「日次点検の記録」が証跡の表になく、必須証跡の保存先・保管期間・参照権限が読み取れない | 日次点検の記録の行を `opr-sample` に合わせて追加した | `opr-rulebook` の「証跡」、Sample 記述標準の「内容充実化」、`opr-sample` の証跡の表 | なし | | 2 | R1 | plan の「編集対象」 | plan は編集対象を `opr-sample.md` としたが、タスク名と根拠の成果物は `opr-incident-sample` である | `opr-incident-sample.md` だけを直し、`opr-sample.md` は変えなかった。分冊 sample のレビュー plan では、編集対象をタスクの sample から解決するよう plan 生成を見直す案を出す | kata-guide の「kata を agent でレビューする」の「直すのは対象の kata だけ」、plan の「根拠となる成果物」の `path` | 要判断 | | 3 | R1 | grade の F001・F004（`vp-po-decision-readiness`・`vp-ops-release-readiness`） | 未決事項の表に決定者・期限・ready 化前の解消項目を足す指摘だが、kata-guide はこの 2 観点を kata の段のレビューで使わないとしている | sample は変えない。grade の観点の組から外すか、finding を見送りとして扱う | kata-guide の「kata の観点の組」の外す観点の表 | なし | | 4 | R1 | grade の F002（`vp-qe-verifiability`）・F003（`vp-qe-kata-conformance`） | F002 は R4、F003 は R5 が扱う観点で、R1 の扱いではない。指された文は `opr-sample` 側か古い版のもので、`opr-incident-sample` の本文と合わない | R4・R5 の段に回す。R5 では `opr-incident-sample` が参照する `opr-index-sample` と、id が別の `opr-sample` の関係もあわせて確かめる | kata-guide の「段と渡す材料」「kata の観点の組」 | 要判断 |
- No: 1 / 段: R1 / 箇所: docs/ja/specdojo/samples/opr-incident-sample.md「証跡」の表 / 指摘: 「日次・週次・月次点検手順」が証跡に指定する「日次点検の記録」が証跡の表になく、rulebook の「証跡（ログ、チケット、チェックリスト、実施記録）」が求める必須証跡の保存先・保管期間・参照権限を読み取れない / 直した案: 日次点検の記録の行（店内の点検ノート（紙）、保管期間 `_UNDECIDED_`、店番担当と `OPS`、点検日と点検した役割）を opr-sample の同じ行に合わせて追加した / 根拠: opr-rulebook「証跡」の「必須証跡、保存先、保管期間、参照権限を明記する」、Sample 記述標準「内容充実化」の「各必須章に、対応 rulebook が要求する具体項目をすべて埋める」、opr-sample の証跡の表の日次点検の記録の行 / 印: なし
- No: 2 / 段: R1 / 箇所: plan の「編集対象」 / 指摘: plan は rulebook の sample 宣言の先頭から編集対象を `docs/ja/specdojo/samples/opr-sample.md` としたが、タスク名と根拠の成果物は opr-incident-sample で、ほかの分冊のレビュー（例: T-KATA-REVIEW-ALL-opd-access-control-sample-150）もタスク名と同じ sample を直している / 直した案: opr-incident-sample.md だけを直し、opr-sample.md は変えなかった。分冊 sample のレビュー plan では、編集対象をタスクの sample から解決するよう plan の生成を見直す案を出す / 根拠: kata-guide「kata を agent でレビューする」の「直すのは対象の kata だけ」、plan の「根拠となる成果物」の `path` / 印: 要判断
- No: 3 / 段: R1 / 箇所: grade の finding F001・F004（`vp-po-decision-readiness`・`vp-ops-release-readiness`） / 指摘: 未決事項の表に決定者・期限・ready 化の前に解消する項目を足す指摘だが、kata-guide の「kata の観点の組」はこの 2 つの観点を kata の段のレビューで使わないとしている（kata の承認と ready 化は登録簿で追う） / 直した案: sample は変えない。grade の観点の組から外すか、finding を見送りとして扱う / 根拠: kata-guide「kata の観点の組」の外す観点の表 / 印: なし
- No: 4 / 段: R1 / 箇所: grade の finding F002（`vp-qe-verifiability`）・F003（`vp-qe-kata-conformance`、kata 相互） / 指摘: F002 は R4、F003 は R5 が扱う観点で、R1 の扱いではない。どちらも指している文（日次点検の記録の行 line=126、「分冊は障害対応だけ」「`opr-incident` は予定」の関連導線）は opr-sample 側か古い版のもので、opr-incident-sample の本文と合わない / 直した案: R4・R5 の段に回す。R5 では、opr-incident-sample が参照する `opr-index-sample` と、id が別の `opr-sample` の関係もあわせて確かめる / 根拠: kata-guide「段と渡す材料」「kata の観点の組」 / 印: 要判断
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/opr-incident-sample.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

進め方は sample-maintenance。根拠とした規範は、`opr-rulebook` の「証跡」、Sample 記述標準の「内容充実化」、kata-guide の「kata を agent でレビューする」「kata の観点の組」「段と渡す材料」、比較対象の `opr-sample` の証跡の表である。維持した記述は、概要・関連導線など rulebook と整合する既存の本文である。追加した記述は、日次点検の記録の行 1 件だけである。finding F001・F004 は kata の段で使わない観点、F002・F003 は R4・R5 の観点なので、R1 では見送り、sample は変えていない。plan の編集対象が `opr-sample.md` になっている点は、`opr-incident-sample.md` を直す形で扱い、要判断として申し送った。grade result のサイドカーは直接編集していない。
