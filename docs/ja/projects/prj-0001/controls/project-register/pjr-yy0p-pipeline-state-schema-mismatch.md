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
  difficulty: medium
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

| 観点         | 影響                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| スコープ     | `pipeline-state.schema.yaml` と `validate:schema` の検査の範囲              |
| スケジュール | -                                                                           |
| コスト       | -                                                                           |
| 品質         | 記録の形の崩れを検査で見つけられない。schema が実際の記録の形を表していない |
| 関係者       | DEV                                                                         |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | runner が書く `artifacts`（`src/exec/pipeline-state.ts` の `PipelineArtifactRefs`）が `pipeline-state.schema.yaml` に無い。`npm run validate:schema` は `pipeline-state.json` を検査していない |
| 対応策   | schema に `artifacts` を足し、記録の検査を `validate:schema` に入れる案を作る                                                                                                                  |
| 依存事項 | `package.json` は保護された設定のため、検査を足す変更は orchestrator が反映する                                                                                                                |
| 完了条件 | 下記の条件をすべて満たすこと                                                                                                                                                                   |

完了条件の内訳。

- `docs/specdojo/schemas/v1/pipeline-state.schema.yaml` に、`src/exec/pipeline-state.ts` の型と同じ形で `artifacts` を足す。
- 足したあと、追跡済みの register の run の `pipeline-state.json` がすべて schema に通る（`npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/pipeline-state.schema.yaml --data "docs/ja/**/execution/runs/register/**/pipeline-state.json"`）。通らない記録が残る場合は、件数と理由と扱い（schema を広げる・古い形として外す）を executor が決めて対応結果に書く。過去の記録は書き換えない。
- `npm run validate:schema` に `pipeline-state.json` の検査を足す `package.json` の変更案（例: `validate:schema:pipeline-state`）を、個票の対応結果と `handoff` に書く。`package.json` は executor が変えない。
- schema の変更を単体テストか上の検証のコマンドで確かめる。
- `CHANGELOG.md` は変えず、個票の対応結果の「CHANGELOG に書く事項」の節に区分と行の文案を書く。利用者に影響が無い場合はそう書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書く。pipeline では報告の `handoff` にも書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証が通る。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
