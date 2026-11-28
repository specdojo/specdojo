---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-success-criteria-and-acceptance-criteria-sample-110-20261125t053259z-a2e55f53
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-success-criteria-and-acceptance-criteria-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-success-criteria-and-acceptance-criteria-sample-110/T-KATA-REVIEW-ALL-prj-success-criteria-and-acceptance-criteria-sample-110-20261125T053259Z-a2e55f53/plan.md
  started_at: "2026-11-25T05:33:08.667Z"
  completed_at: "2026-11-25T05:46:43.514Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-success-criteria-and-acceptance-criteria-sample
    - specdojo:prj-success-criteria-and-acceptance-criteria-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1(目的の過不足)として、sample の「5. 例外条件と未解決事項」の例外表を rulebook・template の推奨列(論点・判定への影響・当面の扱い)にそろえた(grade F002 に対応)。
- grade F001(SC-06 の「必須記録と引き継ぎ」の定義不足)は、観点 `vp-qe-verifiability` が R4 の観点であるため、この段では直さず R4 へ回した。
- 検査では、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed になった。executor の prettier 整形も passed になった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-success-criteria-and-acceptance-criteria-sample.md`: 「5. 例外条件と未解決事項」の例外表を、旧来の列から「論点・判定への影響・当面の扱い」の 3 列に組み替えた。影響を受ける条件 ID と初期受入を進められるかは `判定への影響` に書いた。旧表の解決期限と責任者は `当面の扱い` に「店主代表(`PO`)が〜までに決める」と書き、決まるまで判定を保留する扱いを足した。表の前の 1 文も、表の内容を説明する文に変えた。差分は 8 行追加・8 行削除。

## 3. 申し送り

- R1-2 の SC-06 の指摘(grade F001)は R4 の担当である。R4 では、必須記録の項目(販売・在庫・つけの記録など)と引き継ぎの内容を、判定基準か測定方法の列に書き足す案を検討してほしい。この段では sample を変更していない。
- `npm run lint:md` と `npm run lint:fm` は、runner が変更種別により `not_applicable` とした。変更ファイルに対しては `lint:md:changed` と `lint:fm:changed` が passed になっている。
- R1-1: R1 / 5. 例外条件と未解決事項 / 例外表の列が rulebook・template の推奨表（論点・判定への影響・当面の扱い）と違い、影響を受ける条件 ID と初期受入を進められるかが独立した列になっていない（grade F002） / 列を 3 つにそろえ、`判定への影響` に条件 ID と初期受入を進められるかを書いた。旧表の解決期限と責任者は `当面の扱い` に「店主代表（`PO`）が〜までに決める」と書き、決まるまで判定を保留する扱いを足した。表の前の 1 文も表の内容を説明する文に変えた / `vp-qe-kata-conformance`、rulebook の「例外条件と未解決事項」の記述ガイド、template の 5 章 / -
- R1-2: R1 / 2. 成功基準 SC-06 / 「必須記録と引き継ぎ」が何を指すか決まっていない（grade F001） / - / 観点 `vp-qe-verifiability` は kata-guide の観点の組で R4 の観点なので、この段では直さない。R4 で必須記録の項目（販売・在庫・つけの記録など）と引き継ぎの内容を判定基準か測定方法の列に書き足す案を検討してほしい / -

## 4. 進め方と実践の型の適用

根拠にしたのは、grade F002 の指摘、rulebook の「例外条件と未解決事項」の記述ガイド、template の 5 章、観点 `vp-qe-kata-conformance` である。列構成が rulebook・template と矛盾するため、rulebook を正として表を 3 列にそろえた。F001 は観点が R4 に属するため、kata-guide の段の分担に従って見送った。理由は R4 で扱う観点だからであり、根拠不足ではない。次のアクションは R4 で SC-06 の必須記録と引き継ぎの内容を明記することである。rulebook など sample 以外は変更していない。frontmatter の `status` は変更していない。
