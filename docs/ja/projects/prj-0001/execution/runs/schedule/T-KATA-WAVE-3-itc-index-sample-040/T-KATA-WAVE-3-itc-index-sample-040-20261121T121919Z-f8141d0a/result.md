---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-itc-index-sample-040-20261121t121919z-f8141d0a
  type: exec-result
  task_id: T-KATA-WAVE-3-itc-index-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-itc-index-sample-040/T-KATA-WAVE-3-itc-index-sample-040-20261121T121919Z-f8141d0a/plan.md
  started_at: "2026-11-21T12:19:36.399Z"
  completed_at: "2026-11-21T12:26:38.741Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:itc-index-sample
    - specdojo:itc-index-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook (`docs/ja/specdojo/rulebooks/itc-index-rulebook.md`) を簡潔に整えました。
- 完成例の章を削除し、見出しレベルを H3 までに制限して `docs/ja/specdojo/standards/rulebook-authoring-standard.md` の構成に合わせました。
- grade 判定結果に基づき、F001、F002、F003、F006 の指摘事項を本文内で解消しました。
- F004、F005、F007 については、sample や frontmatter の変更を伴わないため、後続のステップへ申し送り事項として残しています。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/itc-index-rulebook.md`: rulebook の構成を簡潔化し、finding に基づく修正を行いました。完成例の章を削除し、見出しレベルを H3 までに抑えたほか、ケースIDの重複や列の定義、テストレベルの略語体系に関する指摘事項（F001, F002, F003, F006）を本文の記述へ反映しました。

## 3. 申し送り

- F004: sample `specdojo:itc-index-sample` が rulebook の本文要件（固定見出し順の 10 章）に沿っていない。後続の sample-maintenance で、駄菓子屋の販売管理システムを題材に必須章を揃えて厚くする。
- F005: rulebook frontmatter の `recipe` と `template` が `undecided` のまま。この段では宣言を変えない指示のため未対応。template は PJR-WYTX で扱い、recipe は作成するか `not-needed` とするかを人が判断する。
- F007: ready 化の前提として、F004（sample の整合）と F005（recipe・template の要否）の解消を誰がいつ行うかを決める必要がある。rulebook の `status` は `draft` のまま据え置いた。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/rulebooks/itc-index-rulebook.md だけで、plan・result・個票などの履歴ファイルを変更していないため）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/ 配下だけで、docs/ja/projects/ 配下の成果物を変更していないため）

## 4. 進め方と実践の型の適用

対象の sample が従う rulebook を、grade の指摘と `done_criteria` に沿って簡潔に整える。rulebook に完成例の章を置かず、見出しは H4 までとする。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を維持しつつ、指摘された問題（case ID の検査、カラム区分の定義、トレース列の定義、テストレベルの略語体系）を解消する。
