---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-roles-sample-120-20261125t230110z-ee7b3da2
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-roles-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-roles-sample-120/T-KATA-REVIEW-ALL-pm-roles-sample-120-20261125T230110Z-ee7b3da2/plan.md
  started_at: "2026-11-25T23:01:19.214Z"
  completed_at: "2026-11-25T23:07:14.076Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:pm-roles-sample
    - specdojo:pm-roles-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `docs/ja/specdojo/samples/pm-roles-sample.yaml` を確認した。メタ項目の順、コメントの位置、`roles` の並び、`roles[]` 要素のキーの順と粒度を、rulebook の本文要件・template・上位標準と照合した。
- いずれも沿っており、章の移動・分割・統合に当たる差分はないため、sample は変更していない（evidence.changes は空）。
- runner の検証では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`validate:schema` が passed だった。変更がないため、そのほかの検査は変更種別により `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | メタ項目とコメントの配置 | メタ項目は id・type・status・title・rulebook・`based_on`・version・`project_id` の順で、template の `metadata_template` と同じ。コメントも template と同じくメタ項目の後、`roles` の前にあり、採用 8 ロールの前提から正本の参照の順に読める。構成の問題はない。 | - | vp-arc-document-structure | - |
| R2-2 | R2 | `roles` の並び | PO・PM・BA・ARC・DEV・QE・UX・OPS の順で、上位標準の「標準ロール」の表の定義順と同じ。rulebook の `roles` の採用範囲が勧める記載順にも沿っている。 | - | vp-arc-document-structure | - |
| R2-3 | R2 | `roles[]` の要素 | キーは `code`・`name`・`project_note` の順で、rulebook の本文要件の表と template に沿っている。1 ロール 1 要素で、`project_note` は 1 行の粒度である。必須キーの欠けや矛盾はなく、R1 が直した後の版にも構成上の問題は残っていない。 | - | vp-qe-omissions-consistency | - |

## 2. 変更ファイル

- なし

## 3. 申し送り

- R2-1: R2 / メタ項目とコメントの配置 / メタ項目は id・type・status・title・rulebook・`based_on`・version・`project_id` の順で template の `metadata_template` と同じ。コメントも template と同じくメタ項目の後、`roles` の前にあり、採用 8 ロールの前提から正本の参照の順に読める。構成の問題はない / - / vp-arc-document-structure / -
- R2-2: R2 / `roles` の並び / PO・PM・BA・ARC・DEV・QE・UX・OPS の順で、上位標準の「標準ロール」の表の定義順と同じであり、rulebook の `roles` の採用範囲が勧める記載順に沿っている / - / vp-arc-document-structure / -
- R2-3: R2 / `roles[]` の要素 / キーは `code`・`name`・`project_note` の順で、rulebook の本文要件の表と template に沿っている。1 ロール 1 要素、`project_note` は 1 行の粒度で、必須キーの欠けや矛盾はない。R1 が直した後の版にも構成上の問題は残っていない / - / vp-qe-omissions-consistency / -
- 適用外の検証: `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/pm-roles.schema.yaml --data docs/ja/specdojo/samples/pm-roles-sample.yaml`（executor は `*.yaml` / `*.yml` を変更していないため、validate:schema:file の適用条件（変更した YAML がある）を満たさない）
- 適用外の検証: `npx prettier --check docs/ja/specdojo/samples/pm-roles-sample.yaml`（executor が変更したファイルがないため、Prettier の適用条件（変更した md/ts/js/json/yaml/yml がある）を満たさない）
- 適用外の検証: `npx markdownlint`（executor は `*.md` を変更していないため、markdownlint の適用条件を満たさない）

## 4. 進め方と実践の型の適用

参照の向きを「成果物 → sample」に切り替え、sample の構成を rulebook の本文要件、template、上位標準の「標準ロール」の表と照合した。R1 が直した版を前提に、R1 の指摘は繰り返していない。構成が根拠と整合していたため、既存の記述は維持した。変更がないので rulebook など sample 以外も変更していない。plan に展開された finding と成果物から届いた Kata が原因の finding はなく、未解消の finding もない。
