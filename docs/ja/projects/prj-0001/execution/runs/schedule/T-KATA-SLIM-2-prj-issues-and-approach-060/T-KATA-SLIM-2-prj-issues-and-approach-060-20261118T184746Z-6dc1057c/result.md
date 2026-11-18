---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-prj-issues-and-approach-060-20261118t184746z-6dc1057c
  type: exec-result
  task_id: T-KATA-SLIM-2-prj-issues-and-approach-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-prj-issues-and-approach-060/T-KATA-SLIM-2-prj-issues-and-approach-060-20261118T184746Z-6dc1057c/plan.md
  started_at: "2026-11-18T18:47:56.766Z"
  completed_at: "2026-11-18T19:17:59.358Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - prj-0001:prj-issues-and-approach
    - specdojo:prj-issues-and-approach-recipe
---

# Edit Result

## 1. 実施内容

- recipe から文書の運用記述、rulebook との重複記述、および冗長なチェック項目を削除し、執筆者が答えるべき問いとコツを中心とした構成に再編しました。
- 空白を除いた文字数を 3,840 文字から 2,668 文字（約 69.5%）に削減しました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/prj-issues-and-approach-recipe.md`: 共通の運用記述、rulebook で定義済みの表形式やラベル指示、冗長な構造チェックを削除し、執筆順序・入力ソース・各節の問いとコツに基づく構成に修正しました。

## 3. 申し送り

- Size: 3,840 characters before, 2,668 after (69.5%), counted without whitespace and table separator rows (with separator rows: 4,111 to 2,960; bytes: 11,583 to 8,156).
- Findings: F001/F003 - no columns added to the ToDo table because they would conflict with the rulebook's ToDo/purpose/owner-role columns; added the question 'what counts as done and by when must it be decided' instead. F002/F006/F011/F013 - added a content-level confidentiality check to the final checklist (no personal or organization identifiers, no non-public observations); human PO publication approval is common operation and left out under the plan. F004/F005/F008/F009/F012 - resolved by removing the targeted text (register transfer, 'required tables' check, label instructions). F007 - per the plan's 'remove delegation target', replaced the reference to the alternatives-comparison document with a tip to keep only the points that need comparison. F010 - the procedure now says the three optional chapters are written only when needed.
- Change proposal (not applied): prj-issues-and-approach-rulebook ToDo table has only ToDo/purpose/owner-role, while the prj-0001 deliverable already uses a completion-criteria column and grade findings F001/F003 ask for a decision timing and an impact. Consider adding a completion-criteria column and a decision-timing column to the rulebook and template.
- Change proposal (not applied): recipe-authoring-standard says the final checklist must confirm 'publication suitability', which grade viewpoints read as including human PO publication approval. That conflicts with the slim policy of keeping common operation out of recipes. Clarify in the standard that this means only a content-level confidentiality check.
- Change proposal (not applied): the rulebook's description of the trade-off/risk table says nothing about an owner, while the prj-0001 deliverable adds an owner column. Check whether the template and rulebook should match.
- Rulebook and sample: no other change was found to be needed. The recipe status stays ready; no status change was made.
- 適用外の検証: `npm run validate:history-links`（Only a recipe under docs/ja/specdojo/recipes was changed; no plan, result or register ticket was edited）

## 4. 進め方と実践の型の適用

recipe-maintenance
