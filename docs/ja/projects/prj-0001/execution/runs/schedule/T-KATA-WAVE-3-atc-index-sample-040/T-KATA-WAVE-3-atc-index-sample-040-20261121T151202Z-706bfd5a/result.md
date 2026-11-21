---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-atc-index-sample-040-20261121t151202z-706bfd5a
  type: exec-result
  task_id: T-KATA-WAVE-3-atc-index-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-atc-index-sample-040/T-KATA-WAVE-3-atc-index-sample-040-20261121T151202Z-706bfd5a/plan.md
  started_at: "2026-11-21T15:12:09.225Z"
  completed_at: "2026-11-21T15:18:21.223Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:atc-index-sample
    - specdojo:atc-index-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook `docs/ja/specdojo/rulebooks/atc-index-rulebook.md` を簡潔化しました。
- rulebook 内の「サンプル（最小）」の章を削除し、完成例は `specdojo:atc-index-sample` に任せる形に変更しました。
- 記述ガイドの章立て（6.1〜6.8）に、判断の基準となる「良い例・悪い例」を追記しました。
- finding `F001` への対応として、`lint:fm` および `lint:md` による検証方法の記述を追記しました。
- finding `F002` および `F003` に関する事項は、後続のタスクへ引き継ぎます。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/atc-index-rulebook.md`: 「サンプル（最小）」の章を削除し、記述ガイドの各節に「良い例・悪い例」を追記。また、`lint:fm` と `lint:md` の検証手順に関する記述を追加した。

## 3. 申し送り

- F002: 後続の sample-maintenance で `specdojo:atc-index-sample` を rulebook の本文要件の 9 章構成（本ドキュメントの目的と適用対象〜メモ / 将来課題）に合わせる。現在の sample は相対 Markdown リンクを含む汎用の骨組みである。
- F003: `recipe` / `template` は `undecided` のまま（plan の指示で frontmatter は変えていない）。ready にする前に、template の要否（PJR-WYTX）、recipe の要否、sample の整備を済ませる。
- 根拠: rulebook-authoring-standard（完成例の正本は sample）、兄弟の itc-index-rulebook の簡潔化の前例、grade の run id regrade-kata-2026-11-21 の F001〜F003。
- 適用外の検証: `npm run validate:history-links`（plan / result / 個票などの履歴蓄積ファイルを変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがない）

## 4. 進め方と実践の型の適用

rulebook-maintenance
