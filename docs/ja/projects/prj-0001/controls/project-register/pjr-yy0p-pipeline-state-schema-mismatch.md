---
specdojo:
  id: prj-0001:pjr-yy0p-pipeline-state-schema-mismatch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-20T23:36:40Z"
  derived_from:
    - PJR-5F1Y
---

# PJR-YY0P register の run の pipeline-state.json が schema に合わない

## 1. 課題内容

runner が書く artifacts が pipeline-state.schema.yaml に無く、register の run の記録 965 件中 957 件が schema の検証に通らない。validate:schema が検査していないため見えていない

## 2. 入力

- 2026-11-21、PJR-5F1Y の確認で validate:schema:file --schema docs/specdojo/schemas/v1/pipeline-state.schema.yaml を `docs/ja/**/execution/runs/register/**/pipeline-state.json` に流すと、develop でも大半が must NOT have additional properties で不合格になった
- 追跡済みの 965 件のうち 957 件で、schema に無い項目は artifacts だけだった。artifacts は src/exec/pipeline-state.ts の型（PipelineArtifactRefs）にあり、runner が書く
- npm run validate:schema は pipeline-state.json を検査していない（job-run・grade-pipeline は検査している）
- PJR-5F1Y の schema の変更（`resume_notes`）は、この不合格の件数を変えていない

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
