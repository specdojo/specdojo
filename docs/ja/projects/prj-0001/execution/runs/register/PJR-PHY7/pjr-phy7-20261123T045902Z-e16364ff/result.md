---
specdojo:
  id: prj-0001:xer-pjr-phy7-20261123t045902z-e16364ff
  type: exec-result
  task_id: PJR-PHY7
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-PHY7/pjr-phy7-20261123T045902Z-e16364ff/plan.md
  started_at: "2026-11-23T04:59:04.761Z"
  completed_at: "2026-11-23T05:00:48.197Z"
  agent: sonnet-executor
---

# Edit Result

## 1. 実施内容

- `cdt-rulebook` と `ifx-file-rulebook` の ID 規則、`ifx-index-template.yaml` と `ifx-cmd-template.yaml` の id を、名前空間なしのプロダクト文書の形に直した。`templates/generated/` の対応ページは、yaml-pages の代わりに同じ置換を手で当てて更新した。個票の対応結果に実施内容・探索方法・CHANGELOG 文案・残課題を記入した。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cdt-rulebook.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/rulebooks/ifx-file-rulebook.md`: 変更、+4 / -4 行
- `docs/ja/specdojo/templates/ifx-cmd-template.yaml`: 変更、+1 / -1 行
- `docs/ja/specdojo/templates/ifx-index-template.yaml`: 変更、+1 / -1 行

## 3. 申し送り

- `templates/generated/` の `ifx-index-template.md` と `ifx-cmd-template.md` は yaml-pages を実行せず、同じ文字列置換を手で当てた。orchestrator が close 前に yaml-pages を作り直して lint で確認すること。
- stsd・cdfd・cdfd-uc・bps・sf・cdfd-overview の rulebook は 1 回目の変更を統合せず、変えていない。
- cdt・ifx の sample に名前空間付きの id はなく、変更していない。`&lt;project-id&gt;:imp-*` の記述はプロジェクト文書なので変えていない。
- CHANGELOG に書く事項（Changed）: cdt・ifx-file の rulebook と ifx-index・ifx-cmd の template で、プロダクト文書の id を名前空間なしの形に改めた。
- `docs/ja/product/` の既存成果物の id と `based_on` は、この項目では変えていない。後続の todo で直す。
- 適用外の検証: `npm run validate:history-links`（履歴ファイルとして変更したのは個票のみで、個票の本文に Markdown リンクは書いていない。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
