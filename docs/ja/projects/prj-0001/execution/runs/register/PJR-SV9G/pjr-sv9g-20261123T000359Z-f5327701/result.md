---
specdojo:
  id: prj-0001:xer-pjr-sv9g-20261123t000359z-f5327701
  type: exec-result
  task_id: PJR-SV9G
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-SV9G/pjr-sv9g-20261123T000359Z-f5327701/plan.md
  started_at: "2026-11-23T00:04:30.010Z"
  completed_at: "2026-11-23T00:06:04.251Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- prj-charter-template の2回目の修正（目印の復元、合格条件列の追加、AI Agent 目印の追加、生成物 status を draft に変更）と、個票の対応結果（一覧の追記、文字数 2739→2265→2581、status が draft 以外の template 一覧）を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/prj-charter-template.md`: 変更、+18 / -14 行

## 3. 申し送り

- `frontmatter_template`（YAML は `metadata_template`）の生成物側 `status` が `draft` 以外の template: `pm-issue-log`・`pm-risk-register`・`pm-change-request-log`・`pm-decision-log`・`pjr-index`・`pjr-views-by-status`・`pjr-views-by-owner`・`pjr-views-by-priority`・`pjr-dependent-items`・`pjr-derived-items` は `ready`、`dct-index` は `_STATUS_`。この項目では直していない。
- `dct-index-template` の `_STATUS_` はプレースホルダのため、`draft` にするかの判断が必要。
- rulebook・sample・recipe の変更は不要。CHANGELOG に書く事項は個票 5.7（区分: 変更）に記載済み。保護された設定の変更はなし。
- 型の grade は統合の後に orchestrator が実行する（作業内容 No.3 は `open`）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
