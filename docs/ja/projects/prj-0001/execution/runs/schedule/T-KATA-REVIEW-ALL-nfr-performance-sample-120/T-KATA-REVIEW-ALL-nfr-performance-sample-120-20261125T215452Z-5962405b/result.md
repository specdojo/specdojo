---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-performance-sample-120-20261125t215452z-5962405b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-performance-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-performance-sample-120/T-KATA-REVIEW-ALL-nfr-performance-sample-120-20261125T215452Z-5962405b/plan.md
  started_at: "2026-11-25T21:55:01.603Z"
  completed_at: "2026-11-25T22:05:35.070Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-performance-sample
    - specdojo:nfr-performance-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `docs/ja/specdojo/samples/nfr-performance-sample.md` を見直した。章の順と章名は rulebook の本文構成（概要から未決事項まで）に一致しており、章の移動・分割・統合は行っていない。
- 「測定・検証方法」の表に、rulebook の記述ガイドが求める合格条件の列を加えた。表の外の段落にあった判定の扱いを要件ごとに表へ移した。
- 段落は pass / fail の決め方、基準確定後の判定し直し、運用後の監視だけに絞った。これにより、段落と性能要件一覧の『記録するだけ』の要件（`nfr-perf-002`・`nfr-perf-004`）との食い違いを解消した。grade F001 の未判定の扱いも、この変更で測定・検証方法に明記された。
- 整形（prettier）と、runner が実行した `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` は通過した。その他の検査は変更種別により非適用。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 4. 測定・検証方法 | rulebook の記述ガイドは測定方法・判定タイミング・合格条件を表にするよう求めるが、sample の表に合格条件の列がなく、表の外の段落にまとめて書いていた。 | 表に「合格条件」の列を加え、要件ごとの合格条件を書いた。前置きの文に「合格条件」を加え、段落は pass / fail の決め方・確定後の判定し直し・運用後の監視だけに絞った。 | `vp-arc-document-structure`（rulebook の記述ガイド「測定・検証方法」） | - |
| R2-2 | R2 | 4. 測定・検証方法 | 段落の『基準が `_UNDECIDED_` の間は暫定の判定で pass / fail を決め』は、性能要件一覧の `nfr-perf-002`・`nfr-perf-004`（決まるまでは値を記録するだけで判定しない）と食い違っていた（grade F001 と同じ箇所）。 | 合格条件の列で `nfr-perf-002`・`nfr-perf-004` を『基準の確定まで判定しない』と書き、`nfr-perf-001`・`nfr-perf-005`・`nfr-perf-006` は暫定の判定で決めると要件ごとに分けた。 | `vp-qe-omissions-consistency`。F001 は `vp-qe-verifiability`（R4 の観点）だが、未判定の扱いを測定・検証方法に書いたことで解消している。暫定の閾値を仮置きする案は、基準値の決定に当たり構成の段の範囲を超えるため採らなかった。 | 要判断 |
| R2-3 | R2 | 全体 | 章の順・章名は rulebook の本文構成（1 概要〜6 未決事項）と一致していた。rulebook の `template` は `undecided` のため、template との突き合わせはできなかった。 | - | `vp-arc-document-structure`。rulebook 側の `recipe`・`template` の要否の未決事項（rulebook の全体方針）は人の判断に残す。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-performance-sample.md`: 「測定・検証方法」の表に合格条件の列を追加し、要件ごとの合格条件を記載した。`nfr-perf-002`・`nfr-perf-004` は基準の確定まで判定しないと明記し、`nfr-perf-001`・`nfr-perf-005`・`nfr-perf-006` は暫定の判定で決めると分けた。前置きに「合格条件」を加え、表外の段落は判定の決め方・確定後の判定し直し・運用後の監視に絞った。

## 3. 申し送り

- `nfr-perf-002`・`nfr-perf-004` の暫定閾値を仮置きする案は、基準値の決定に当たり構成の段の範囲を超えるため採っていない。必要なら R4（検証可能性）の段か人の判断で扱う。
- rulebook の `template` が `undecided` のため、template との突き合わせはできていない。`recipe`・`template` の要否は rulebook 側の未決事項として人の判断に残る。
- R2-1: R2 / 4. 測定・検証方法 / rulebook の記述ガイド「測定・検証方法」は、測定方法・判定タイミング・合格条件を表にするよう求めるが、sample の表に合格条件の列がなく、表の外の段落にまとめて書いていた / 表に「合格条件」の列を加え、要件ごとの合格条件を書いた。前置きの文に「合格条件」を加え、段落は pass / fail の決め方・確定後の判定し直し・運用後の監視だけに絞った / `vp-arc-document-structure`（rulebook の記述ガイド「測定・検証方法」） / -
- R2-2: R2 / 4. 測定・検証方法 / 段落の『基準が `_UNDECIDED_` の間は暫定の判定で pass / fail を決め』は、性能要件一覧の `nfr-perf-002`・`nfr-perf-004`（決まるまでは値を記録するだけで判定しない）と食い違っていた（grade F001 の指摘と同じ箇所） / 合格条件の列で `nfr-perf-002`・`nfr-perf-004` を『基準の確定まで判定しない』と書き、`nfr-perf-001`・`nfr-perf-005`・`nfr-perf-006` は暫定の判定で決めると要件ごとに分けた / `vp-qe-omissions-consistency`。F001 は `vp-qe-verifiability`（R4 の観点）だが、未判定の扱いを測定・検証方法に書いたことで解消している。暫定の閾値を仮置きする案は、基準値の決定に当たり構成の段の範囲を超えるため採らなかった / 要判断
- R2-3: R2 / 全体 / 章の順・章名は rulebook の本文構成（1 概要〜6 未決事項）と一致していた。rulebook の `template` は `undecided` のため、template との突き合わせはできなかった / - / `vp-arc-document-structure`。rulebook 側の `recipe`・`template` の要否の未決事項（rulebook の全体方針）は人の判断に残す / -

## 4. 進め方と実践の型の適用

根拠としたのは rulebook の本文構成と記述ガイド「測定・検証方法」、および plan に展開された grade F001 の指摘である。rulebook を正として sample の構成を照合し、章の順・章名は維持した。表に合格条件の列がない点を修正し、段落と性能要件一覧の食い違いを要件ごとの記述に分けて解消した。F001 は未判定の扱いを測定・検証方法に書いたことで解消したが、仮置きの閾値は採っておらず、その採否は「要判断」とした。
