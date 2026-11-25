---
specdojo:
  id: prj-0001:xer-t-kata-review-all-trc-requirements-to-specs-sample-120-20261125t235028z-6052c548
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-trc-requirements-to-specs-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-trc-requirements-to-specs-sample-120/T-KATA-REVIEW-ALL-trc-requirements-to-specs-sample-120-20261125T235028Z-6052c548/plan.md
  started_at: "2026-11-25T23:50:37.228Z"
  completed_at: "2026-11-25T23:56:39.853Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:trc-requirements-to-specs-sample
    - specdojo:trc-requirements-to-specs-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）として `trc-requirements-to-specs-sample` に構成の差分を 2 件入れた。1 件目は「充足状況サマリ」の表から、数える対象が違う「要求に対応しない仕様」の行を本文へ分離した。2 件目は「ギャップと対応方針」の表の行を、直前の「充足状況サマリ」の優先順に並べ替えた。
- grade の F001（使う人の欄の表記）は観点 `vp-ux-language-consistency` で R3 の担当のため、この段では直していない。R3 に送った。
- executor の検査では prettier と markdownlint が通った。runner の検査では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 4. 充足状況サマリ / 充足状況ごとの件数の表 | 数える対象が違う「要求に対応しない仕様」の行が、合計の後に表の行として並んでいた。rulebook の「トレースマトリクスの標準列」では、この行は充足状況ごとの件数に含めない。 | 表からその行を外した。表の後に「要求に対応しない仕様は 2 件であり、充足状況ごとの件数に含めない。」を置いた。 | `vp-arc-document-structure`、rulebook「本文要件」「トレースマトリクスの標準列」 | - |
| R2-2 | R2 | 5. ギャップと対応方針 / ギャップの表 | 行の順（req-r1-002、req-r1-004、bes-product-master）が、直前の「充足状況サマリ」の優先順（req-r1-004、req-r1-002、bes-product-master）と違い、前提から結論への流れが途切れていた。 | 行を優先順に並べ替えた。表の前の 1 文に「「充足状況サマリ」の優先順に示す」を足した。 | `vp-arc-document-structure`、`vp-qe-omissions-consistency`。迷った理由は、トレースマトリクスと同じ要求 ID 順にそろえる案もあるため。選ばなかった案は、行を ID 順のまま残して本文に優先順を書かない案。 | 要判断 |
| R2-3 | R2 | 1. 目的と適用範囲 / 使う場面の表の「使う人」欄（grade F001） | 使う人の欄が通称で書かれており、適用先のメンバー定義の Role code にそろっていない。観点 `vp-ux-language-consistency` は R3 の担当のため、この段では直していない。 | - | `vp-ux-language-consistency`（kata-guide「kata の観点の組」で R3 の観点）。R3 の段で使う人の欄の表記を直す。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/trc-requirements-to-specs-sample.md`: 「充足状況サマリ」の件数表から「要求に対応しない仕様」の行を外し、表の後に「充足状況ごとの件数に含めない」と明記する 1 文を置いた。「ギャップと対応方針」の表の行を優先順（req-r1-004、req-r1-002、bes-product-master）へ並べ替え、表の前の文に優先順で示す旨を足した。

## 3. 申し送り

- R2-2 は要判断。トレースマトリクスと同じ要求 ID 順にそろえる案もある。
- R2-1: R2 / 4. 充足状況サマリ / 充足状況ごとの件数の表に、数える対象が違う「要求に対応しない仕様」の行が合計の後に並んでいた。rulebook の「トレースマトリクスの標準列」では、この表の行はサマリの充足状況ごとの件数に含めない / 表からその行を外し、表の後に「要求に対応しない仕様は 2 件であり、充足状況ごとの件数に含めない。」を置いた / `vp-arc-document-structure`、rulebook「本文要件」「トレースマトリクスの標準列」 / -
- R2-2: R2 / 5. ギャップと対応方針 / ギャップの表の行の順（req-r1-002 → req-r1-004 → bes-product-master）が、直前の「充足状況サマリ」の優先順（req-r1-004 → req-r1-002 → bes-product-master）と違い、前提から結論への流れが途切れていた / 行を優先順に並べ替え、表の前の 1 文に「「充足状況サマリ」の優先順に示す」を足した / `vp-arc-document-structure`、`vp-qe-omissions-consistency`。迷った理由: トレースマトリクスと同じ要求 ID 順にそろえる案もある。選ばなかった案は、行を ID 順のまま残し、本文に優先順を書かない案 / 要判断
- R2-3: R2 / 1. 目的と適用範囲 / grade の F001（使う人の欄が通称で、適用先のメンバー定義の Role code にそろっていない）は観点 `vp-ux-language-consistency` で R3 の担当のため、この段では直していない / - / `vp-ux-language-consistency`（kata-guide「kata の観点の組」で R3 の観点）。R3 の段で使う人の欄の表記を直す / -
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

sample メンテナンスの進め方に従い、対象 sample を読んで rulebook の本文要件と「トレースマトリクスの標準列」に照らし、章の順と表・本文の配置を確かめた。差分は観点 `vp-arc-document-structure` を主な根拠とし、2 件目は `vp-qe-omissions-consistency` も根拠とした。rulebook など sample 以外は変更していない。F001 は R3 の観点のため未対応で、R3 の段で使う人の欄の表記を直す。
