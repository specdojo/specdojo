---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-orchestrator-playbook-sample-110-20261125t142844z-783e33f3
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-110/T-KATA-REVIEW-ALL-pm-orchestrator-playbook-sample-110-20261125T142844Z-783e33f3/plan.md
  started_at: "2026-11-25T14:28:53.080Z"
  completed_at: "2026-11-25T14:36:36.325Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-orchestrator-playbook-sample
    - specdojo:pm-orchestrator-playbook-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）として、`pm-orchestrator-playbook-sample` に 4 か所の差分を入れた。内容は、使わない agent の明記、一般的な知見の落とし穴の章の削除、リリースの範囲の決め方の追加、未決事項への `question` の項目 ID の追加である。
- R1 の観点に当たらない F005・F006・F008・F009 は後の段に回し、直していない。
- 検査は executor の prettier と markdownlint、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` が通った。変更種別により対象外の検査は `not_applicable` である。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R1 | 2. agent の使い分けと癖の導入文（F007） | rulebook の本文要件が求める「使わない agent と理由」がなく、該当がないことも書かれていない。 | `local-executor` は開発用の PC のメモリ不足のため medium・hard には使わず easy の項目だけに使い、ほかに使わない agent はない、と書いた。 | pm-orchestrator-playbook-rulebook の本文要件「agent の使い分けと癖」、`vp-qe-kata-conformance` | - |
| 2 | R1 | 旧 7. 落とし穴（`pgrep -f` の自己一致、commitlint の `body-max-line-length`）（F004・F001） | どのプロジェクトにも当てはまる一般的な知見で、運用メモの責務の外にある。回避策に直す側の項目 ID もない。 | 章ごと削除し、後ろの章番号を詰めた（リリースの手順を 7、店頭の端末との分担を 8 に）。一般的な知見は本体へ入れる変更案として起票する。 | rulebook の「知見の置き場所の分け方」「知見の育て方」の手順 1、禁止事項「本体に書かれた一般的な進め方を再掲する」「直す側の項目を添えずに回避策を書く」 | - |
| 3 | R1 | 7. リリースの手順の導入文（F003） | リリースの手順の受入条件「範囲の決め方」がない。 | 店主代表（`PO`）が入れ替えの日の前日までに、登録簿の項目から店頭の販売・在庫・つけの記録に効くものを選んで版の範囲を決める、と足した。 | rulebook の本文要件「リリースの手順」の受入条件 | - |
| 4 | R1 | 8. 店頭の端末との分担の `_UNDECIDED_`（F002） | 回答を待っている登録簿の `question` の項目 ID がなく、記録先が分からない。 | `question` の `PJR-KN15` で店主代表の回答を待つことを書き添え、決まるまでの扱いは残した。rulebook を直す案は、「question の回答待ちの間は、`_UNDECIDED_` と question の項目 ID、作業を止めないための最小限の扱いだけを書いてよい」と、2 つの記述の片方にそろえること。 | rulebook の「handoff と question からの移し方」「章ごとの書き方」、禁止事項「利用者の返事を待っている判断を書き写す」 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-orchestrator-playbook-sample.md`: agent の使い分けと癖に、`local-executor` を easy の項目だけに使い、ほかに使わない agent はないと明記した。一般的な知見の落とし穴の章（`pgrep -f` の自己一致、commitlint の `body-max-line-length`）を削除し、後ろの章番号を詰めた。リリースの手順の導入に、店主代表（`PO`）が前日までに版の範囲を決める旨を足した。店頭の端末との分担の `_UNDECIDED_` に、回答待ちの `question` の項目 `PJR-KN15` を添えた。

## 3. 申し送り

- F001 は、該当する落とし穴の章ごと削除したことで解消した。一般的な知見は本体へ入れる変更案として別途起票する必要がある。
- rulebook の「handoff と question からの移し方」と「章ごとの書き方」に食い違いがある。前者は回答待ちの間に仮の決まりを書かないとし、後者は `_UNDECIDED_` に決まるまでの扱いを添えるとする。sample では決まるまでの扱いを残した。rulebook を直す案は findings の No: 4 に記した。
- No: 1 / 段: R1 / 箇所: 2. agent の使い分けと癖の導入文 / 指摘: rulebook の本文要件が求める「使わない agent と理由」がなく、該当がないことも書かれていない（F007） / 直した案: `local-executor` は開発用の PC のメモリ不足のため medium・hard には使わず easy の項目だけに使い、ほかに使わない agent はない、と書いた / 根拠: pm-orchestrator-playbook-rulebook の本文要件「agent の使い分けと癖」、vp-qe-kata-conformance / 印: なし
- No: 2 / 段: R1 / 箇所: 旧 7. 落とし穴（`pgrep -f` の自己一致、commitlint の `body-max-line-length`） / 指摘: どのプロジェクトにも当てはまる一般的な知見で、運用メモの責務の外にある。回避策に直す側の項目 ID もない（F004・F001） / 直した案: 章ごと削除し、後ろの章の番号を詰めた（リリースの手順を 7、店頭の端末との分担を 8 に）。一般的な知見は本体へ入れる変更案として起票する / 根拠: rulebook の「知見の置き場所の分け方」「知見の育て方」の手順 1、禁止事項「本体に書かれた一般的な進め方を再掲する」「直す側の項目を添えずに回避策を書く」 / 印: なし
- No: 3 / 段: R1 / 箇所: 7. リリースの手順の導入文 / 指摘: リリースの手順の受入条件「範囲の決め方」がない（F003） / 直した案: 店主代表（`PO`）が入れ替えの日の前日までに、登録簿の項目から店頭の販売・在庫・つけの記録に効くものを選んで版の範囲を決める、と足した / 根拠: rulebook の本文要件「リリースの手順」の受入条件 / 印: なし
- No: 4 / 段: R1 / 箇所: 8. 店頭の端末との分担の `_UNDECIDED_` / 指摘: 回答を待っている登録簿の `question` の項目 ID がなく、記録先が分からない（F002） / 直した案: `question` の `PJR-KN15` で店主代表の回答を待つことを書き添えた。rulebook の「handoff と question からの移し方」は回答待ちの間に仮の決まりを書かないとし、「章ごとの書き方」は `_UNDECIDED_` に決まるまでの扱いを添えるとしていて食い違う。sample では決まるまでの扱いを残した。rulebook を直す案: 「question の回答待ちの間は、`_UNDECIDED_` と question の項目 ID、作業を止めないための最小限の扱いだけを書いてよい」と、片方の記述にそろえる / 根拠: rulebook の「handoff と question からの移し方」「章ごとの書き方」、禁止事項「利用者の返事を待っている判断を書き写す」 / 印: 要判断
- 後の段に回した指摘（R1 の観点に当たらないため直していない）: F005（リリースの手順 3 の「全件の検査」が何の検査か書かれていない）は R4、F006（参照名の例 `PJR-KN11` が本文で使われていない）は R2・R5、F008（`based_on` が decision ではなく pm-plan-sample を指し、template の `supersedes: []` もない）は R5（`based_on` の参照先）、F009（完了条件の書き方の決まりを任意章「登録簿項目の完了条件の書き方」へ移す）は R2（構成）。
- 適用外の検証: `npm run validate:history-links`（変更したのは sample だけで、plan・result・個票を変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がないため）

## 4. 進め方と実践の型の適用

根拠は pm-orchestrator-playbook-rulebook の本文要件・禁止事項・知見の育て方と、`vp-arc-conciseness` である。R1 の観点に当たる F001・F002・F003・F004・F007 を直した。F005 は R4、F006 は R2・R5、F008 は R5、F009 は R2 に回した。rulebook など sample 以外は変更していない。
