---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-pm-plan-060-20261118t150337z-7713e7f3
  type: exec-result
  task_id: T-KATA-SLIM-2-pm-plan-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-pm-plan-060/T-KATA-SLIM-2-pm-plan-060-20261118T150337Z-7713e7f3/plan.md
  started_at: "2026-11-18T15:03:43.358Z"
  completed_at: "2026-11-18T15:38:05.594Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - prj-0001:pm-plan
    - specdojo:pm-plan-recipe
---

# Edit Result

## 1. 実施内容

- プロジェクト管理計画の recipe (`docs/ja/specdojo/recipes/pm-plan-recipe.md`) から、rulebook と重複する判断基準の言い直し、共通の文書運用記述、未決事項台帳への登録手順、構造検査および冗長な確認項目を削除し、内容をスリム化した。
- 空白・改行・表の区切り行を除いた文字数は 2,216 字から 1,549 字（約 69.9%）になり、目標の 7 割以下を達成した。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/pm-plan-recipe.md`: rulebook と重複する判断基準、共通運用記述、未決事項台帳への登録手順、構造検査、および冗長な確認項目を削除。一方で、情報の取り出し元、執筆順序とその理由、聞き方とつまずきやすい点、深掘りの順序などの実践的なガイドを残し、レビュー観点を BA の視点に合わせて整理した。

## 3. 申し送り

- 大きさの記録（result の実施内容へ）: 測り方は prj-charter の試行（PJR-7M9J）と同じで、空白と改行を除き、表の区切り行も除く。前 2,216 字（区切り行込み 2,459 字・6,806 B）、後 1,549 字（同 1,746 字・4,529 B）、比 69.9%。
- rulebook・sample・template への変更案: なし。recipe から外した判断の基準（管理行の項目、判断ゲートの成立条件、正本・追従の扱い）は rulebook の本文要件と記述ガイドが持っているため、作成に支障はないと判断した。
- レビュー観点は、plan の BA の観点（関係者・利用場面）に合わせ、rulebook の判断基準を言い直さない形として、判断者と作業者が使う場面から読む 2 行に置き換えた。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/recipes/pm-plan-recipe.md だけで、plan・result・個票は変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

recipe-maintenance
