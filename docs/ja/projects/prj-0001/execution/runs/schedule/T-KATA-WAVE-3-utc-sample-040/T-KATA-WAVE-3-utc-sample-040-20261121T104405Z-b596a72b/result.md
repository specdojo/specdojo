---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-utc-sample-040-20261121t104405z-b596a72b
  type: exec-result
  task_id: T-KATA-WAVE-3-utc-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-utc-sample-040/T-KATA-WAVE-3-utc-sample-040-20261121T104405Z-b596a72b/plan.md
  started_at: "2026-11-21T10:44:11.678Z"
  completed_at: "2026-11-21T10:50:23.813Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:utc-sample
    - specdojo:utc-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook (`docs/ja/specdojo/rulebooks/utc-rulebook.md`) を簡潔に整えました。
- F001 に対応し、`case_id` の定義を `utc-index-rulebook` への参照に置き換え、二重管理を解消しました。
- F002 に対応し、H5 見出しを解消して H4 以下の構成に修正しました。
- F003 および F005 に対応し、山括弧プレースホルダのインラインコード化と、区切り記号（`:`）の統一を行いました。
- F007 に対応し、改訂時の追従対象となるテストコード・CI 証跡・`utc-index`・担当 `Role code` の定義を追加しました。
- Plan の指示に従い、完成例を記載していた「サンプル（最小）」の章を削除しました。
- 第 5 章の見出しを、執筆標準に合わせて「本文要件」に変更しました。
- F004 および F006 に関しては、`specdojo:utc-sample` が標準テンプレートに未整合であること、および `recipe`・`template` が未決定であることを `_UNDECIDED_` として記録し、後続の `sample-maintenance` フェーズへ引き継ぎました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/utc-rulebook.md`: grading 指摘（F001, F002, F003, F005, F007）に基づき、見出しレベルの修正、定義の参照化、プレースホルダのコード化、追従対象の追記を行い、完成例の章を削除して簡潔に整えました。

## 3. 申し送り

- F004・F006: sample `specdojo:utc-sample` は rulebook の「本文要件」に未整合で、後続の sample-maintenance で揃える必要がある。`recipe`・`template` は未判断のまま（template は PJR-WYTX）。rulebook の全体方針に `_UNDECIDED_` として記録した。
- rulebook-authoring-standard は既存 rulebook のサンプル章を個別の改訂で先に削除しないとしているが、plan の「rulebook に完成例の章を置かず」に従って「サンプル（最小）」章を削除した。完成例は sample に移す必要がある。
- 5 章の見出しを「本文構成（標準テンプレ）」から執筆標準に合わせて「本文要件」に変えた。
- 適用外の検証: `npm run validate:history-links`（変更は rulebook だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/rulebooks 配下だけで、docs/ja/projects/ の成果物に及ばない）

## 4. 進め方と実践の型の適用

対象の sample が従う rulebook を、grade の指摘と `done_criteria` に沿って簡潔に整える。rulebook に完成例の章を置かず、見出しは H4 までとする。F001 から F007 までの各指摘事項を解消し、未決定事項（F004, F006）は `_UNDECIDED_` として記録した。
