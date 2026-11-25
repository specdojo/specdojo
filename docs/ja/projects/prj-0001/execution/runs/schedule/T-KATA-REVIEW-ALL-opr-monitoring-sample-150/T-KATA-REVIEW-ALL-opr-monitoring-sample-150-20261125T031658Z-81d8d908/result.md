---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-monitoring-sample-150-20261125t031658z-81d8d908
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-monitoring-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-monitoring-sample-150/T-KATA-REVIEW-ALL-opr-monitoring-sample-150-20261125T031658Z-81d8d908/plan.md
  started_at: "2026-11-25T03:17:07.706Z"
  completed_at: "2026-11-25T03:29:48.465Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-monitoring-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`opr-monitoring-sample` を同じ接頭辞の sample、参照先、用語集と照合し、食い違い 4 件を本書側で直した。
- 直した内容は、閾値の正本の記述、`PO` に連絡がつかない場合の切替の扱い、誤検知の条件の範囲、参照先の不足である。
- 相手側の文書を直すべき点 3 件（R5-5 から R5-7）は、変更せずに直す案を handoff に残した。
- 変更したファイルは `docs/ja/specdojo/samples/opr-monitoring-sample.md` の 1 つだけである。prettier と markdownlint は指摘 0 件で、runner の検査も失敗なしだった。
- grade の finding のうち F003 は R5-5 で扱った。F001 と F004 は kata の段の観点に含まれず、F002 は R4 の観点なので、この段では扱っていない。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-monitoring-sample.md`: 概要で、監視対象と閾値の正本を `opd-index`、測定元・通知の手段・初動の時限の正本を `opd-monitoring-sample` に分けた。アラート対応手順では、`PO` に 15 分以内に連絡できない場合の切替を「店番担当が紙の販売控えへ切り替えて `PO` の連絡を待つ」に揃え、誤検知の条件を死活に限った。夜間バックアップの誤検知は `opr-index` の条件で終えると書き足した。バッチ再実行の章に `opr-batch-sample` への参照を足し、関連導線の表には `opd-incident-management-sample` と `opr-batch-sample` の行を足した。

## 3. 申し送り

- R5-5（要判断）: `opr-index-sample` の「関連ドキュメント導線」は「分冊は障害対応だけ」と書いているが、`opr-sample` は分冊 8 つ（monitoring を含む）を作成済として挙げている。相手側の案は、表の前の文と表を `opr-sample` の分冊一覧に揃えることである。入口の文書が `opr-index-sample` と `opr-sample` の 2 つある構成をどう整理するかは人の判断が要る。本書の `opr-index` の表記を `opr-index-sample` へ付け替える案は、`opr-incident-sample` と `opr-batch-sample` が差分元を `opr-sample` としているので採らなかった。
- R5-6: `opr-index-sample` の「アラート対応手順」は閾値の見直しの基準を「同じ誤検知が月 3 回を超えたら」としており、本書・`opr-sample`・`opd-monitoring-sample` の「月 3 件以上」と食い違う。相手側の案は、`opr-index-sample` を「死活の誤検知が月 3 件以上なら」に直すことである（`vp-qe-kata-conformance`）。
- R5-7: `opr-batch-sample` の「アラート対応手順」は通知を「開店時に当日分の成功記録なし」としているが、`opd-monitoring-sample` と `opr-sample` は判定の時刻を 9:30（開店 30 分前）としている。相手側の案は、`opr-batch-sample` の通知を「9:30 に当日分の成功記録なし」に直すことである（`vp-qe-kata-conformance`）。
- plan の編集対象は `docs/ja/specdojo/samples/opr-sample.md` と解決されていた。kata ガイドの「直すのは対象の kata だけ」に従い、タスクの対象である `opr-monitoring-sample.md` を直した。`opr-sample` には本書と食い違う点がなく、変更していない。
- 用語集 `docs/ja/product/010-business-specs/060-glossary/` の `gl-*.yaml` にはツール側の用語しかなく、本書の業務用語（死活、誤検知、紙の販売控え、店番担当）と食い違う語はなかった。
- R5-1: R5 / 1. 概要 / 監視対象・閾値・通知の手段・初動の時限をすべて opd-monitoring-sample に従うと書いていたが、opd-monitoring-sample は「監視対象と閾値は `opd-index` を正」と定めている / 「監視対象と閾値は `opd-index`、測定元・通知の手段・初動の時限は opd-monitoring-sample」に分けた。関連導線の表の opd-monitoring-sample の目的も同じ範囲に直した / `vp-qe-kata-conformance`（opd-monitoring-sample の概要） / -
- R5-2: R5 / 5. アラート対応手順（機能を止める判断の後の文） / `PO` に 15 分以内に連絡できない場合、本書は「紙の販売控えへの切替は `PO` の判断を待つ」としていたが、opd-incident-management-sample の停止・切替の判断と opr-incident-sample は「店番担当が紙の販売控えへ切り替えて `PO` の連絡を待つ」としている / opd-incident-management-sample に揃えて「店番担当が紙の販売控えへ切り替えて `PO` の連絡を待つ」にした / `vp-qe-kata-conformance`、`vp-dev-change-impact` / -
- R5-3: R5 / 5. アラート対応手順（誤検知の行） / 誤検知の条件が死活の条件だけなのに、夜間バックアップにも当てはまるように読める。opr-sample と opr-batch-sample は夜間バックアップに別の終了条件（世代の取得日が前日の `closing_date` と一致）を置いている / 条件を「死活は」に限り、夜間バックアップの誤検知は `opr-index` のアラート対応手順の条件で終えると書き足した / `vp-qe-kata-conformance` / -
- R5-4: R5 / 7. バッチ再実行・失敗時対応、12. 関連ドキュメント導線 / P2 の引き継ぎ先である opr-batch-sample と、機能を止める判断の正本である opd-incident-management-sample への参照がなかった / 7 章で opr-batch-sample を参照し、関連導線の表に opd-incident-management-sample と opr-batch-sample の行を足した / `vp-dev-change-impact` / -
- R5-5: R5 / opr-index-sample の 12. 関連ドキュメント導線 / 「分冊は障害対応だけ」と書いているが、opr-sample は分冊 8 つ（monitoring を含む）を作成済として挙げている。F003 の本書側の問題は直る前の版で既に解消していて、残りはこの記述 / - / 相手側の案: opr-index-sample の表の前の文と表を opr-sample の分冊一覧に揃える。入口の文書が opr-index-sample と opr-sample の 2 つある構成をどう整理するかは人の判断が要る。選ばなかった案: 本書の `opr-index` の表記を opr-index-sample へ付け替える案は、opr-incident-sample と opr-batch-sample が差分元を opr-sample としているので採らなかった / 要判断
- R5-6: R5 / opr-index-sample の 5. アラート対応手順 / 閾値の見直しの基準が「同じ誤検知が月 3 回を超えたら」で、本書・opr-sample・opd-monitoring-sample の「月 3 件以上」と食い違う / - / 相手側の案: opr-index-sample を「死活の誤検知が月 3 件以上なら」に直す（`vp-qe-kata-conformance`） / -
- R5-7: R5 / opr-batch-sample の 5. アラート対応手順 / 通知を「開店時に当日分の成功記録なし」としているが、opd-monitoring-sample と opr-sample は判定の時刻を 9:30（開店 30 分前）としている / - / 相手側の案: opr-batch-sample の通知を「9:30 に当日分の成功記録なし」に直す（`vp-qe-kata-conformance`） / -
- grade の finding のうち F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata ガイドの「kata の観点の組」が kata の段のレビューで使わない観点としているため扱わない（kata の承認と ready 化は登録簿で追う）。F002（`vp-qe-verifiability`）は R4 の観点のため R4 に任せる。F003 は R5-5 で扱った。
- plan の編集対象（rulebook の sample 宣言から解決）は docs/ja/specdojo/samples/opr-sample.md だったが、kata ガイドの「直すのは対象の kata だけ」に従い、タスクの対象である opr-monitoring-sample.md を直した。opr-sample には本書と食い違う点はなく、変更していない。
- 用語集 docs/ja/product/010-business-specs/060-glossary/ の `gl-*.yaml` にはツール側の用語しかなく、本書の業務用語（死活、誤検知、紙の販売控え、店番担当）と食い違う語はなかった。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

kata ガイドの R5（整合）に従い、`opr-monitoring-sample` を `opr-sample`・`opr-incident-sample`・`opr-batch-sample`・`opd-monitoring-sample`・`opd-incident-management-sample` と用語集、共通サンプル文脈に照らして確かめた。食い違いのうち、本書側で直せるものは直した。相手側を直すべきものは変更せず、案を handoff に記録した。矛盾した点では、運用方針（`opd-*`）の定めを正として本書を揃えた。finding の扱いは次のとおり。F003 は R5-5 で扱った。F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は kata の段のレビューで使わない観点なので扱わず、kata の承認と ready 化は登録簿で追う。F002（`vp-qe-verifiability`）は R4 の観点なので R4 に任せる。成果物の `status` は変更していない。
