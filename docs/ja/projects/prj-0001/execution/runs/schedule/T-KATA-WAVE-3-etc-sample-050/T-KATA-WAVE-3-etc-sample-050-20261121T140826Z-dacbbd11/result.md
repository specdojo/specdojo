---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-etc-sample-050-20261121t140826z-dacbbd11
  type: exec-result
  task_id: T-KATA-WAVE-3-etc-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-etc-sample-050/T-KATA-WAVE-3-etc-sample-050-20261121T140826Z-dacbbd11/plan.md
  started_at: "2026-11-21T14:08:46.061Z"
  completed_at: "2026-11-21T14:19:43.306Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:etc-sample
    - specdojo:etc-sample
---

# Edit Result

## 1. 実施内容

- rulebook の要件に従い、`docs/ja/specdojo/samples/etc-sample.md` を「レシート印刷連携」を題材とした外部結合テストカタログの完成例として再構成しました。
- 主な変更点は以下の通りです：
- `frontmatter` に `based_on` を追加し、`tsp-index` および `etc-index` への依存関係を明示しました。
- 構成を rulebook が定義する 7 つの必須章（1〜6章 + 7章）に準拠させました。
- 記述内容を「ガイド」から「完成例（sample）」へと変更し、具体的な境界条件、依存関係、環境構成、および検証可能なテストケース（11 行の表）を実装しました。
- テストケースには `trace_key`、および観測点（アサーション）と証跡を接続するための列を追加しました。
- `_UNDECIDED_` セクションを用いて、未解決事項（ARC による値の更新条件など）を具体的なアクションとして記述しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/etc-sample.md`: rulebook の必須構成（1〜6章）に基づき、レシート印刷連携の外部結合テストカタログの完成例として内容を全面改訂しました。具体的には、`based_on` の追加、境界・依存・環境の詳細定義、および `trace_key` を含むテストケース一覧の作成を行いました。

## 3. 申し送り

- 判断待ち: `specdojo:ifx-cmd-sample` は上限30秒・送信前ビジー時の自動再試行（最大3回）が必要ですが、`specdojo:etc-index-sample` は応答待ち10秒で自動再送なしのため、挙動が食い違います。rulebook の上書き禁止に従い、sample は `etc-index` に合わせましたが、本文の `_UNDECIDED_` に解消条件（ARC が値を揃え、PO が承認したら `et-receipt-print-failure-handling-020` の期待値を更新する）を記述しています。どちらを正とするかの判断と、もう一方の sample の修正が必要です。
- rulebook の変更案: 「全体方針」の `_UNDECIDED_` にある「sample は本文要件の見出し構成・`trace_key`・条件・ケース表へ未整合」という記述は、今回の改訂で解消されたため、rulebook の更新が必要です。
- rulebook の変更案: 本文要件に未決事項の章がなく、扱いを `document-metadata-standard` へ任せています。F003・F009・F032（判断者・`ready` にする条件・報告先）は、本文の `_UNDECIDED_` の段落のみで部分的に対応しています。章を持たないことを rulebook に明記するか、任意章を設けるかの判断が必要です。
- F004（公開責任）については、rulebook が `document-metadata-standard` に任せているため、概要に確認者の役割（PO・QE・DEV）を記載するに留めています。
- 判断待ち: `specdojo:ifx-cmd-sample` は上限30秒・送信前ビジー時の自動再試行（最大3回）、`specdojo:etc-index-sample` は応答待ち10秒・自動再送なしで食い違う。rulebook の上書き禁止に従い sample は `etc-index` に合わせ、本文の `_UNDECIDED_` に解消条件（ARC が値を揃え、PO が承認したら `et-receipt-print-failure-handling-020` の期待値を更新）を書いた。どちらを正とするかの判断と、もう一方の sample の修正が必要。
- rulebook の変更案: 「全体方針」の `_UNDECIDED_` にある「sample は本文要件の見出し構成・`trace_key`・条件・ケース表へ未整合」の記述は、この改訂で解消したので更新が要る。
- rulebook の変更案: 本文要件に未決事項の章がなく、扱いを `document-metadata-standard` へ任せている。F003・F009・F032（判断者・`ready` にする条件・報告先）は本文の `_UNDECIDED_` の段落だけで部分的に対応した。章を持たないことを rulebook に明記するか、任意章を設けるかの判断が必要。
- F004（公開責任）は、rulebook が `document-metadata-standard` に任せているため、概要に確認者の役割（PO・QE・DEV）を書くにとどめた。
- 適用外の検証: `npm run validate:history-links`（Changed only docs/ja/specdojo/samples/etc-sample.md; no plan/result/pjr history file was changed by the executor.）

## 4. 進め方と実践の型の適用

rulebook の必須構成と `sample-authoring-standard.md` に従い、既存の `etc-sample.md` を「完成例」の品質まで引き上げる作業を行いました。具体的には、依存関係の明示、章構成の是正、および検証可能なテストケースの具現化を通じて、`grade` で指摘された各種 `finding` を解消しました。
