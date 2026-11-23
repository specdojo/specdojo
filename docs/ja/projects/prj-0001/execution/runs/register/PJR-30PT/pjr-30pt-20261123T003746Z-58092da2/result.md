---
specdojo:
  id: prj-0001:xer-pjr-30pt-20261123t003746z-58092da2
  type: exec-result
  task_id: PJR-30PT
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-30PT/pjr-30pt-20261123T003746Z-58092da2/plan.md
  started_at: "2026-11-23T00:37:47.633Z"
  completed_at: "2026-11-23T00:47:29.343Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- 第 3 波 13 種類の rulebook と sample のうち 22 文書（rulebook 9、sample 13）から、文書の役割・承認・ready への昇格の条件・未決事項の承認の記述を外した。テストの判定者・例外承認者・受入の判定記録・実施体制は対象外として残した。個票の作業内容・対応結果（判定の表、迷った点、直したほうがよい点、CHANGELOG の文案）・関連ドキュメントを記入した。grade は executor では実行していない。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/atc-rulebook.md`: 変更、+2 / -2 行
- `docs/ja/specdojo/rulebooks/imp-test-rulebook.md`: 変更、+6 / -7 行
- `docs/ja/specdojo/rulebooks/itc-index-rulebook.md`: 変更、+2 / -2 行
- `docs/ja/specdojo/rulebooks/stc-index-rulebook.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/rulebooks/stc-rulebook.md`: 変更、+3 / -3 行
- `docs/ja/specdojo/rulebooks/trc-requirements-to-tests-rulebook.md`: 変更、+3 / -3 行
- `docs/ja/specdojo/rulebooks/tsp-index-rulebook.md`: 変更、+3 / -3 行
- `docs/ja/specdojo/rulebooks/utc-index-rulebook.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/rulebooks/utc-rulebook.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/samples/atc-index-sample.md`: 変更、+6 / -6 行
- `docs/ja/specdojo/samples/atc-sample.md`: 変更、+4 / -4 行
- `docs/ja/specdojo/samples/etc-index-sample.md`: 変更、+9 / -11 行
- `docs/ja/specdojo/samples/etc-sample.md`: 変更、+2 / -3 行
- `docs/ja/specdojo/samples/imp-test-sample.md`: 変更、+3 / -3 行
- `docs/ja/specdojo/samples/itc-index-sample.md`: 変更、+15 / -17 行
- `docs/ja/specdojo/samples/itc-sample.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/samples/stc-index-sample.md`: 変更、+7 / -7 行
- `docs/ja/specdojo/samples/stc-sample.md`: 変更、+4 / -6 行
- `docs/ja/specdojo/samples/trc-requirements-to-tests-sample.md`: 変更、+10 / -10 行
- `docs/ja/specdojo/samples/tsp-index-sample.md`: 変更、+5 / -5 行
- `docs/ja/specdojo/samples/utc-index-sample.md`: 変更、+13 / -15 行
- `docs/ja/specdojo/samples/utc-sample.md`: 変更、+1 / -1 行

## 3. 申し送り

- 型の grade は統合の後に orchestrator が 1 回流す。対象は直した 13 種類（`tsp-index`・`utc-index`・`utc`・`stc-index`・`stc`・`itc-index`・`itc`・`etc-index`・`etc`・`atc-index`・`atc`・`imp-test`・`trc-requirements-to-tests`）。そのあと 140 の人の確定へ進む。個票の作業内容 No.4・No.5 は `open` のまま。
- 決めた点: `etc-index-sample` の「運用責任・確認者」の列は、rulebook の分割基準「運用責任」が求める外部 I/F の運用責任なので残し、列名を「運用責任」に直した。文書の担当の割り当てである「主担当」の列は外した。
- 決めた点: `imp-test` の対応方針・未解決事項の「担当」の列は、本文要件の必須の列でテストの対応項目の担当なので残した。`trc-requirements-to-tests` のように登録簿へ寄せるかは 140 の人の確定で決めるとよい。
- 決めた点: 未決事項の表で承認と担当だけを書いた列は列ごと外し、登録簿の項目 ID・期限・報告先など承認でない値は残した。rulebook の `_UNDECIDED_` の「ready 化前に解消する」は役割も承認も含まないので残し、「人が判断する」「QE が決める」の部分だけ外した。
- 直したほうがよい点: `itc-index-rulebook` の「推奨（運用必須）」の列は「完成した `itc-&lt;term&gt;` で全行に記入」に直したが、完成の判定の仕方は型に書かれていない。grade の指摘を見て決める。
- CHANGELOG の文案（区分: 変更）は個票の「CHANGELOG に書く事項」に記載した。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
