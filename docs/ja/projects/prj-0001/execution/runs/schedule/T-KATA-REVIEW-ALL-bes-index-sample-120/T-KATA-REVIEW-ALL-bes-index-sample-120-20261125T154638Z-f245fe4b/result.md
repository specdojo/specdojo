---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bes-index-sample-120-20261125t154638z-f245fe4b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bes-index-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bes-index-sample-120/T-KATA-REVIEW-ALL-bes-index-sample-120-20261125T154638Z-f245fe4b/plan.md
  started_at: "2026-11-25T15:46:48.608Z"
  completed_at: "2026-11-25T15:56:14.671Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bes-index-sample
    - specdojo:bes-index-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）のレビューとして `bes-index-sample.md` の配置を 3 件直した。章の順は rulebook の本文要件に合っていたため、章の移動・分割・統合は行っていない。
- 対象範囲の説明を未決事項の表から冒頭の概要へ移した。事実データの前提は未決事項の行に一本化した。`P-03`・`P-05` の文言差は未決事項に行を足して置き場を揃えた。
- grade の F001・F002 は R2 の観点に当たらず、F003 は R1・R5 で扱う観点でありすでに解消していると判断した。このため、これらでは sample を変更していない。
- executor の `npx prettier --check`、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は passed。そのほかの検査は変更種別により `not_applicable`。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 3.1. 未決事項 / 最後の行「一覧の範囲は 10 領域の起点イベントだけとした」 | 未決・推定ではなく対象範囲の説明で、rulebook 本文要件の冒頭の概要（対象範囲）の責務に当たる。 | 値引き・取消・返品を含めない旨と、起点を足すときは先に上位 CDFD を見直す旨を冒頭の概要の第 1 段落へ移し、表から行を消した。 | `vp-arc-document-structure`（rulebook「本文要件」の冒頭の概要と未決事項と承認条件の分担） | - |
| R2-2 | R2 | 冒頭の概要・3.1. 未決事項 | 冒頭の `_ASSUMPTION_` 段落（事実データの出し方）と、未決事項の「事実データが未照合」の行が同じ前提を 2 か所に分けて書いていた。 | 冒頭の段落を消し、未決事項の行の論点を「事実データは上位 CDFD の「データストア」の記録から発生時点で観測できる情報を概念名で挙げ、データモデルとは未照合」にまとめた。 | `vp-arc-document-structure`、`vp-qe-omissions-consistency`（rulebook 6.9 は推定で埋めた列を未決事項に置くとしている） | - |
| R2-3 | R2 | 3.2. 照合の結果と確定入力として扱う条件 | `P-03`・`P-05` の起点イベントの文言とイベント名がずれている件が、照合結果の表にしか書かれておらず未決事項の表に載っていなかった。ほかの未決の扱いが「未決事項」を参照する形と合っていない。 | 3.1 に `_UNDECIDED_` の行（論点、当面の扱い、決まったときに直すもの）を足し、3.2 のセルは「未決事項」を参照する形にして文言の引用を 3.1 へ移した。 | `vp-qe-omissions-consistency` | 要判断：文言の差は R4・R5（上位 CDFD との整合）で直すべきかもしれない。R2 では差を未決事項に置き場を揃えるだけにとどめ、イベント名や CDFD を直す案は選ばなかった。 |
| R2-4 | R2 | grade の finding F001・F002 | 観点 `vp-pm-plan-feasibility`・`vp-pm-control-reporting` は kata-guide「kata の観点の組」で kata の段のレビューに使わない観点とされている。 | - | kata-guide「kata の観点の組」の使わない観点の表 | - |
| R2-5 | R2 | grade の finding F003 | 観点 `vp-qe-kata-conformance` は R1・R5 で扱う。今の 3.2 は確認項目ごとの結果を書き、未実施（個別 BES `bes-credit-sale-over-limit`、データモデルとの照合）も区別していて、すでに解消していると見る。 | - | rulebook 6.10、kata-guide「段と渡す材料」 | - |
| R2-6 | R2 | 3.2. 照合の結果と確定入力として扱う条件 | 表の前の文が「結果が「一致」の項目」としているが、結果の列には「一致」以外の書き方が多く、確定入力の判断は 3 列目で示している。直すのは文言なので R3 に任せる。 | - | R3（W4・W7）で表の前の文を 3 列目の扱いに合わせて直す案 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bes-index-sample.md`: 構成の配置を直した。(1) 未決事項の最後の行にあった一覧の範囲（10 領域の起点イベントだけ）を冒頭の概要の第 1 段落へ移した。(2) 冒頭の `_ASSUMPTION_` 段落を削除し、事実データの前提を未決事項の「事実データが未照合」の行にまとめた。(3) 未決事項に `P-03`・`P-05` の起点イベント文言とイベント名のずれの行を足し、「照合の結果と確定入力として扱う条件」の表のセルは「未決事項」を参照する形にした。差分は 4 行追加、6 行削除。

## 3. 申し送り

- R2-3 の `P-03`・`P-05` の文言差は R4・R5（上位 CDFD との整合）で直すべき可能性がある。R2 では未決事項への置き場の統一にとどめた。
- R2-6 の表前文の直しは R3 に委ねている。
- R2-1: R2 / 3.1. 未決事項 / 最後の行「一覧の範囲は 10 領域の起点イベントだけとした」は未決・推定ではなく対象範囲の説明で、rulebook 本文要件の冒頭の概要（対象範囲）の責務に当たる / 値引き・取消・返品を含めない旨と、起点を足すときは先に上位 CDFD を見直す旨を冒頭の概要の第 1 段落へ移し、表から行を消した / vp-arc-document-structure（rulebook「本文要件」の冒頭の概要と未決事項と承認条件の分担） / -
- R2-2: R2 / 冒頭の概要・3.1. 未決事項 / 冒頭の `_ASSUMPTION_` 段落（事実データの出し方）と、未決事項の「事実データが未照合」の行が同じ前提を 2 か所に分けて書いていた / 冒頭の段落を消し、未決事項の行の論点を「事実データは上位 CDFD の「データストア」の記録から発生時点で観測できる情報を概念名で挙げ、データモデルとは未照合」にまとめた / vp-arc-document-structure、vp-qe-omissions-consistency（rulebook 6.9 は推定で埋めた列を未決事項に置くとしている） / -
- R2-3: R2 / 3.2. 照合の結果と確定入力として扱う条件 / `P-03`・`P-05` の起点イベントの文言とイベント名がずれている件は、照合結果の表にしか書かれておらず未決事項の表に載っていなかった。ほかの未決の扱いが「未決事項」を参照する形と合っていない / 3.1 に `_UNDECIDED_` の行（論点、当面の扱い、決まったときに直すもの）を足し、3.2 のセルは「未決事項」を参照する形にして文言の引用を 3.1 へ移した / vp-qe-omissions-consistency / 要判断：文言の差は R4・R5（上位 CDFD との整合）で直すべきかもしれない。R2 では差を未決事項に置き場を揃えるだけにとどめ、イベント名や CDFD を直す案は選ばなかった
- R2-4: R2 / grade の finding F001・F002 / 観点 `vp-pm-plan-feasibility`・`vp-pm-control-reporting` は kata-guide「kata の観点の組」で kata の段のレビューに使わない観点とされている / - / kata-guide「kata の観点の組」の使わない観点の表 / -
- R2-5: R2 / grade の finding F003 / 観点 `vp-qe-kata-conformance` は R1・R5 で扱う。今の 3.2 は確認項目ごとの結果を書き、未実施（個別 BES `bes-credit-sale-over-limit`、データモデルとの照合）も区別していて、すでに解消していると見る / - / rulebook 6.10、kata-guide「段と渡す材料」 / -
- R2-6: R2 / 3.2. 照合の結果と確定入力として扱う条件 / 表の前の文が「結果が「一致」の項目」としているが、結果の列には「一致」以外の書き方が多く、確定入力の判断は 3 列目で示している。直すのは文言なので R3 に任せる / - / R3（W4・W7）で表の前の文を 3 列目の扱いに合わせて直す案 / -
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/bes-index-sample.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（`*.yaml` / `*.yml` のファイルを変更していない）

## 4. 進め方と実践の型の適用

根拠は rulebook の本文要件（冒頭の概要・未決事項・承認条件の分担）、rulebook 6.9・6.10、kata-guide の「kata の観点の組」と「段と渡す材料」、観点 `vp-arc-document-structure` と `vp-qe-omissions-consistency`。rulebook を正として配置のみを直し、章構成は維持した。grade の F001・F002 の観点（`vp-pm-plan-feasibility`、`vp-pm-control-reporting`）は kata の段のレビューに使わない観点のため扱わなかった。F003 の `vp-qe-kata-conformance` は R1・R5 の担当で、現行の照合結果の節は確認項目ごとの結果と未実施項目を区別して書いているため、解消済みと見ている。未解消の finding はない。
