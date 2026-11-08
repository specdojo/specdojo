---
specdojo:
  id: prj-0001:xer-pjr-80f5-20261108t143900z-7875f55c
  type: exec-result
  task_id: PJR-80F5
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-80F5/pjr-80f5-20261108T143900Z-7875f55c/plan.md
  started_at: "2026-11-08T14:39:26.399Z"
  completed_at: "2026-11-08T15:22:55.752Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- 全110件の `rulebook` をドキュメント ID およびファイル命名標準と照合し、成果物 ID から `&lt;project-id&gt;:` が欠落していたプロジェクト文書向けの `rulebook` 13件を修正しました。
- 修正により、成果物 ID の規則がドキュメント ID 標準（`&lt;project-id&gt;:&lt;local-id&gt;`）に統一されました。
- 修正完了後、`Prettier` による整形および `validate:history-links` 等の各種検証を通過しています。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/dec-rulebook.md`: 成果物 ID の規則を、プロジェクト文書の標準である `&lt;project-id&gt;:&lt;local-id&gt;` 形式に修正しました。
- `docs/ja/specdojo/rulebooks/imp-business-rulebook.md`: 成果物 ID の規則を、プロジェクト文書の標準である `&lt;project-id&gt;:&lt;local-id&gt;` 形式に修正しました。
- `docs/ja/specdojo/rulebooks/imp-data-rulebook.md`: 成果物 ID の規則を、プロジェクト文書の標準である `&lt;project-id&gt;:&lt;local-id&gt;` 形式に修正しました。
- `docs/ja/specdojo/rulebooks/imp-interface-rulebook.md`: 成果物 ID の規則を、プロジェクト文書の標準である `&lt;project-id&gt;:&lt;local-id&gt;` 形式に修正しました。
- `docs/ja/specdojo/rulebooks/imp-operations-rulebook.md`: 成果物 ID の規則を、プロジェクト文書の標準である `&lt;project-id&gt;:&lt;local-id&gt;` 形式に修正しました。
- `docs/ja/specdojo/rulebooks/imp-test-rulebook.md`: 成果物 ID の規則を、プロジェクト文書の標準である `&lt;project-id&gt;:&lt;local-id&gt;` 形式に修正しました。
- `docs/ja/specdojo/rulebooks/mm-rulebook.md`: 成果物 ID の規則を、プロジェクト文書の標準である `&lt;project-id&gt;:&lt;local-id&gt;` 形式に修正しました。
- `docs/ja/specdojo/rulebooks/pm-change-request-log-rulebook.md`: 成果物 ID の規則を、プロジェクト文書の標準である `&lt;project-id&gt;:&lt;local-id&gt;` 形式に修正しました。
- `docs/ja/specdojo/rulebooks/pm-issue-log-rulebook.md`: 成果物 ID の規則を、プロジェクト文書の標準である `&lt;project-id&gt;:&lt;local-id&gt;` 形式に修正しました。
- `docs/ja/specdojo/rulebooks/pm-risk-register-rulebook.md`: 成果物 ID の規則を、プロジェクト文書の標準である `&lt;project-id&gt;:&lt;local-id&gt;` 形式に修正しました。
- `docs/ja/specdojo/rulebooks/pr-rulebook.md`: 成果物 ID の規則を、プロジェクト文書の標準である `&lt;project-id&gt;:&lt;local-id&gt;` 形式に修正しました。
- `docs/ja/specdojo/rulebooks/trc-requirements-to-specs-rulebook.md`: 成果物 ID の規則を、プロジェクト文書の標準である `&lt;project-id&gt;:&lt;local-id&gt;` 形式に修正しました。
- `docs/ja/specdojo/rulebooks/trc-requirements-to-tests-rulebook.md`: 成果物 ID の規則を、プロジェクト文書の標準である `&lt;project-id&gt;:&lt;local-id&gt;` 形式に修正しました。

## 3. 申し送り

- CHANGELOG に書く事項（区分: 変更）: プロジェクト文書向け rulebook（pm-risk-register、pm-issue-log、pm-change-request-log、dec、mm、pr、`imp-*`、`trc-*`）の成果物 ID 規則をドキュメント ID 標準（`&lt;project-id&gt;:&lt;local-id&gt;`）に合わせて修正
- 適用外の検証: `npm run validate:schema:file`（No `*.yaml` or `*.yml` files were changed）

## 4. 進め方

全 110 件の `rulebook` を走査し、成果物の記述例における ID が、命名の標準（プロダクト文書は `namespace` なし、プロジェクト文書は `&lt;project-id&gt;:` を付与）に適合しているかを調査しました。これにより、プロジェクト文書向けの `rulebook` 13 件において `specdojo:` などの不要な接頭辞を削除し、プロジェクト ID を含む正しい形式へ修正しました。
