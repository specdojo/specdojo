---
specdojo:
  id: prj-0001:xer-t-kata-review-all-atc-sample-120-20261124t230628z-ecc5bf3c
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-atc-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-atc-sample-120/T-KATA-REVIEW-ALL-atc-sample-120-20261124T230628Z-ecc5bf3c/plan.md
  started_at: "2026-11-24T23:06:35.579Z"
  completed_at: "2026-11-24T23:10:26.710Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:atc-sample
    - specdojo:atc-sample
---

# Edit Result

## 1. 実施内容

- kata のレビュー R2（構成）を `docs/ja/specdojo/samples/atc-sample.md` に対して実施した。概要にあった店番の交代の除外文を対象外の表へ移し、受入の責務の箇条を観点の章の順（6.1→6.2→6.3）に並べ替えた。
- grade の F001（概要で引用した分割基準から「金額の提示」が抜けている）は、R1 の後の版ですでに解消していた。そのため追加の修正はしていない。
- 章の順は rulebook の本文要件に沿っていた。章の移動・分割・統合は行っていない。
- 指摘は 4 件ある。表にまとめる No・段・箇所・指摘・直した案・根拠・印は handoff に 1 件ずつ記載している。このうち「要判断」は R2-2 と R2-3 の 2 件である。
- executor の検証では `npx prettier --write` と `npx markdownlint-cli2` が通った。runner 実行の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/atc-sample.md`: 概要から店番の交代の除外文を削除し、対象外の表に「店番の交代と引継ぎ」の行を追加した。受入の責務の箇条は、自力完了の箇条を取消の箇条の後ろへ移し、観点の章の順（会計確定、自力完了、取引照合）にそろえた。差分は 9 行追加・8 行削除。

## 3. 申し送り

- R2-2 は要判断。先頭の箇条は全体の目的（店主不在でも会計できる）にも読めるため、箇条の順を観点の順にそろえる判断を人が確認してほしい。観点の章を並べ替える案は、6.3 が 6.1 の確定済み取引を使うため採らなかった。
- R2-3 は要判断。sample は変更していない。判定に影響する前提の表（`_ASSUMPTION_` の期待結果・印字の前提）には、rulebook の必須章に置き場がない。atc-rulebook の本文要件に置き場を書き足すか、別の置き場を決めるかを人が判断してほしい。rulebook は本タスクの変更対象外である。
- R2-1: R2 / 1. 概要・3. 対象外 / 概要に除外の文（店番の交代は `atc-sale-hold` の引継ぎ経路だけで確かめる）があり、理由・代替を書く対象外の章と役割が重なる / 概要からその文を外し、対象外の表に「店番の交代と引継ぎ｜引継ぎ経路は `atc-sale-hold` が主担当で、本カタログは店番を替えない経路だけを扱う｜`atc-sale-hold` の引継ぎ経路」の行を足した / `vp-arc-document-structure`、atc-rulebook の本文要件（対象外は理由と代替とともに示す）、atc-index-sample の分配方針 / -
- R2-2: R2 / 2. 受入の責務 / 責務の箇条の順（自力完了→会計確定→在庫→取消→照合）が観点の章の順（6.1 会計確定、6.2 自力完了、6.3 取引照合）と合わず、責務から観点へ辿りにくい / 自力完了の箇条を取消の箇条の後ろへ移し、観点の順にそろえた / `vp-arc-document-structure`。迷った理由: 先頭の箇条は全体の目的（店主不在でも会計できる）にも読める。観点の章を並べ替える案は、6.3 が 6.1 の確定済み取引を使うため選ばなかった / 要判断
- R2-3: R2 / 4. 環境/データ/外部依存 / 判定に影響する前提の表（`_ASSUMPTION_` の期待結果・印字の前提）は環境・データ・外部依存ではないが、rulebook の必須の章に置き場がない / - （sample は変えていない。atc-rulebook の本文要件に「前提（`_ASSUMPTION_`）は環境/データ/外部依存の章に表で置く」と書き足すか、置き場を決める案を人が判断する） / `vp-arc-document-structure`、`vp-qe-omissions-consistency` / 要判断
- R2-4: R2 / 1. 概要 / grade の F001（分割基準から「金額の提示」が抜けている）は R1 の後の版ですでに直っている / -（直す必要なし） / `vp-qe-omissions-consistency`、atc-index-sample の分割基準の表 / -
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan / result / 個票）を変更していないため）

## 4. 進め方と実践の型の適用

根拠は、plan の finding F001、atc-rulebook の本文要件、atc-index-sample の分割基準と分配方針、`vp-arc-document-structure`、`vp-qe-omissions-consistency` である。rulebook を正として構成を照合した。 - F001: 現行の版では分割基準が atc-index-sample の正本どおりになっていた。解消済みと判断し、sample は変更していない。grade result は本タスクでは編集していない。 - 改訂した箇所: 除外の文は、理由と代替を書く対象外の章へ移した。責務の箇条は観点の章の順にそろえた。 - 維持した箇所: 章の順は rulebook の本文要件に沿っているため維持した。 - 未解消の点: R2-3 の前提表の置き場は rulebook 側の判断が要る。そのため sample は推測で変えず、人の判断に回した。 - 補足: frontmatter の `status` は `draft` のまま変更していない。
