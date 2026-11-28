---
specdojo:
  id: prj-0001:xer-pjr-yy0p-20261121t074956z-0199202f
  type: exec-result
  task_id: PJR-YY0P
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-YY0P/pjr-yy0p-20261121T074956Z-0199202f/plan.md
  started_at: "2026-11-21T07:49:57.102Z"
  completed_at: "2026-11-21T07:54:16.093Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- pipeline-state.schema.yaml に artifacts を追加し、追跡済みの register の pipeline-state.json 973 件がすべて valid になった。個票の対応結果を更新した。package.json は変更していない。

## 2. 変更ファイル

- `docs/specdojo/schemas/v1/pipeline-state.schema.yaml`: 変更、+12 / -0 行

## 3. 申し送り

- package.json の変更案: "validate:schema:pipeline-state": "node packages/docs-lint/bin/specdojo-docs-lint.js yaml-schema --schema docs/specdojo/schemas/v1/pipeline-state.schema.yaml --data `\"docs/ja/**/execution/runs/**/pipeline-state.json\"` --allow-empty" を追加し、validate:schema の validate:schema:grade-pipeline の後ろに && npm run validate:schema:pipeline-state を足す。register 以外の origin の記録は未確認のため、反映前に確認し、通らなければ `runs/register/**` に絞る。
- CHANGELOG 文案: 区分 Fixed。pipeline-state.schema.yaml に runner が記録する artifacts を追加し、既存の記録が schema に合うようにした。利用者への影響なし。
- 決定事項: 単体テストは足さず、全件の検証コマンドで schema の変更を確かめた。不合格は 0 件で、schema を広げる・外す対応は不要だった。
- 適用外の検証: `npm run validate:history-links`（変更した個票 pjr-yy0p-pipeline-state-schema-mismatch.md は Markdown リンクを書いていない。実行は省略した。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
