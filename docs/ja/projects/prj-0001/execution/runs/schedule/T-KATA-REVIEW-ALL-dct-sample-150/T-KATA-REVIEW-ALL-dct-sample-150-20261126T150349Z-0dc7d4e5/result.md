---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dct-sample-150-20261126t150349z-0dc7d4e5
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dct-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dct-sample-150/T-KATA-REVIEW-ALL-dct-sample-150-20261126T150349Z-0dc7d4e5/plan.md
  started_at: "2026-11-26T15:04:02.627Z"
  completed_at: "2026-11-26T15:10:56.789Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:dct-sample
    - specdojo:dct-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、`docs/ja/specdojo/samples/dct-sample.yaml` を同じ接頭辞の sample（`dct-index-sample`）、scaffold の template、`dct-rulebook`、用語集 `gl-planning`、共通サンプル文脈、prj 系 sample と照合した。
- 食い違いは見つからなかった。plan に展開された F001 は前の段で解消済みだった。コメントは「kind が work の成果物すべてに渡す前提」に改まっている。`prj-issues-and-approach` にも `brief: *project_baseline_brief` がある。そのためファイルは変更していない（`changes` は空）。
- YAML を変更していないため、executor の schema 検査は `not_applicable` とした。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`validate:schema` は passed で、ほかは変更種別により `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | `brief` のコメント（30 行目）と `prj-issues-and-approach`（F001） | コメントの「定義系の成果物すべてに渡す」という主張と、`brief` を持たない成果物が食い違うという指摘。 | - | `vp-qe-kata-conformance`、`dct-rulebook` の「`brief`・`overview` の使い分けと YAML アンカー」。前の段でコメントが「kind が work の成果物すべてに渡す前提」に改まり、`prj-issues-and-approach`（120 行目）にも `brief: *project_baseline_brief` がある。work の 5 件すべてがアンカーを参照していて解消済みのため、直していない。 | - |
| R5-2 | R5 | `groups` の先頭のコメント（22〜24 行目） | 「規模 small の既定に 2 件を追加」「ほかの medium 既定は採用しない」が、scaffold の規模の既定と合うかを確かめた。`dct-project-definition-template.yaml` では `prj-overview`・`prj-scope`・`prj-success-criteria-and-acceptance-criteria` が small の既定、`prj-assumptions-constraints-dependencies`・`prj-issues-and-approach` が `min_size: medium` で、コメントと一致する。`dct-index-sample` の `size: small` とも一致する。 | - | `vp-qe-kata-conformance`、`vp-dev-change-impact` | - |
| R5-3 | R5 | `prj-glossary` と `prj-definition-summary` のコメント・note | `not-needed` と、generated に実践の型を当てないことが、`dct-rulebook`（`kind` の分類、`rulebook` の値の規定）と用語集 `gl-planning` の `kind` の定義に合う。`prj-glossary` の note も `dct-index-sample` の glossary ドメインの overview と合う。control・generated に `done_criteria` がないことも rulebook どおりである。 | - | `vp-qe-kata-conformance` | - |
| R5-4 | R5 | `brief` と先頭の `_ASSUMPTION_` | `brief` の 3 項目（単一店舗・タブレット 1 台・EC 等の対象外）が共通サンプル文脈の「前提条件」と合う。夏休み前の初期公開は、文脈がリリース日程を未確定としているため `_ASSUMPTION_` で示されていて規定どおり。prj 系 sample とも同じ前提を使っている。「Web アプリケーション」は `cdr-sample` の店頭タブレット向け Web アプリの前提と合う。 | - | `vp-qe-kata-conformance` | - |
| R5-5 | R5 | ファイル先頭のコメントの wikilink と rulebook ID | `specdojo:sample-authoring-standard`、`specdojo:dct-index-sample`、成果物の rulebook 5 件がすべて実在する。`dct-index-sample` の `project_id` の注記（`dct-sample` と同じ例示値）とも食い違いがない。 | - | `vp-dev-change-impact` | - |

## 2. 変更ファイル

- なし

## 3. 申し送り

- R5-1: R5 / prj-overview の brief のコメント（30 行目）と prj-issues-and-approach / F001「定義系の成果物すべてに渡す」の主張と、brief を持たない成果物が食い違うという指摘 / - （前の段で、コメントが「kind が work の成果物すべてに渡す前提」に改まり、prj-issues-and-approach（120 行目）にも `brief: *project_baseline_brief` がある。work の 5 件すべてがアンカーを参照していて解消済みのため、直していない） / `vp-qe-kata-conformance`、dct-rulebook の「`brief`・`overview` の使い分けと YAML アンカー」 / -
- R5-2: R5 / groups の先頭のコメント（22〜24 行目） / 「規模 small の既定に 2 件を追加」「ほかの medium 既定は採用しない」が、scaffold の規模の既定と合うかを確かめた。dct-project-definition-template.yaml では prj-overview・prj-scope・prj-success-criteria-and-acceptance-criteria が small の既定、prj-assumptions-constraints-dependencies・prj-issues-and-approach が `min_size: medium` で、コメントと一致する。dct-index-sample の `size: small` とも一致する / - / `vp-qe-kata-conformance`、`vp-dev-change-impact` / -
- R5-3: R5 / prj-glossary と prj-definition-summary のコメント・note / `not-needed` と、generated に実践の型を当てないことが dct-rulebook（`kind` の分類、`rulebook` の値の規定）と、用語集 gl-planning.yaml の `kind` の定義（control は運営用の管理文書、generated は入力から生成する成果物）に合う。prj-glossary の note（つけ・商品区分は glossary ドメインで定義）も、dct-index-sample の glossary ドメインの overview と合う。control・generated に `done_criteria` がないことも rulebook どおり / - / `vp-qe-kata-conformance` / -
- R5-4: R5 / brief と先頭の `_ASSUMPTION_` / brief の 3 項目（単一店舗・タブレット 1 台・EC 等の対象外）が共通サンプル文脈の「前提条件」と合う。夏休み前の初期公開は、文脈がリリース日程を未確定としているため `_ASSUMPTION_` で示されていて規定どおり。prj-overview・prj-scope・prj-success-criteria-and-acceptance-criteria の各 sample とも同じ前提を使っている。「Web アプリケーション」は cdr-sample の店頭タブレット向け Web アプリの前提と合う / - / `vp-qe-kata-conformance` / -
- R5-5: R5 / ファイル先頭のコメントの wikilink と rulebook ID / specdojo:sample-authoring-standard、specdojo:dct-index-sample、成果物の rulebook 5 件（prj-overview・prj-scope・prj-success-criteria-and-acceptance-criteria・prj-assumptions-constraints-dependencies・prj-issues-and-approach）がすべて実在する。dct-index-sample の `project_id` の注記（dct-sample と同じ例示値）とも食い違いがない / - / `vp-dev-change-impact` / -
- 適用外の検証: `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/dct.schema.yaml --data docs/ja/specdojo/samples/dct-sample.yaml`（整合の確認で食い違いがなく、変更した `*.yaml` / `*.yml` ファイルがない）

## 4. 進め方と実践の型の適用

根拠にしたのは、同じ接頭辞の `dct-index-sample`、scaffold の `dct-project-definition-template.yaml`、`dct-rulebook`（`brief`・`overview` の使い分けと YAML アンカー、`kind` の分類、`rulebook` の値の規定）、用語集 `gl-planning` の `kind` の定義、Sample 記述標準の共通サンプル文脈、prj 系 sample（`prj-overview`、`prj-scope`、`prj-success-criteria-and-acceptance-criteria` ほか）である。これらは executor が確認した。すべて現状の記述と整合したので維持した。F001 は前の段で解消済みと確認し、追加の改訂はしていない。相手側を直すべき点は見つからなかった。
