---
specdojo:
  id: prj-0001:xer-t-launch-pm-roles-010
  type: exec-result
  task_id: T-LAUNCH-pm-roles-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-pm-roles-010-plan.md
  started_at: "2026-06-28T03:23:03.561Z"
  completed_at: "2026-06-28T03:35:36.691Z"
  agent: codex-expert-edit-agent
  approach: bootstrap
  targets:
    - prj-0001:pm-roles
    - pm-roles-rulebook
    - pm-roles-recipe
    - pm-roles-sample
    - pm-roles-template
---

# Edit Result

## 1. 実施内容

- 成果物 `pm-roles.yaml` と参考資料一式（rulebook / recipe / sample / template）を実際に読み込み、`pm-organization.md` の採用方針・schema・同種 ready 文書を根拠に評価した。
- 成果物本体は owner（PO）視点で確認し、各 `project_note` を SpecDojo の公開可能な文書基盤、参考資料整備、人間 PO の最終判断という文脈に合わせて具体化した。全標準 Role code（PO/PM/BA/ARC/DEV/QE/UX/OPS）は過不足・重複なく維持した。
- `pm-roles-rulebook.md` は、標準 Role code 集合、schema にないメタ項目の禁止、専任 member がいない Role code の扱い、AI Agent に最終判断を委ねない方針を明示する形で補強した。
- `pm-roles-recipe.md` は、schema 確認、未許可キーの排除、下流文書が参照する Role code の明示を作成手順・問い・良い例 / 悪い例へ反映した。
- `pm-roles-sample.yaml` は、駄菓子屋プロジェクト共通文脈の完成例として、PO/PM/OPS の `project_note` を公開可否・専任化条件・人間 PO の責務境界が読み取れる粒度へ調整した。
- `pm-roles-template.yaml` は、雛形利用時に `rulebook` など schema にないメタ項目を追加しない注意をコメントとして追加した。
- 構造・必須項目・禁止事項は `pm-roles-rulebook.md` を正とし、recipe / sample / template が rulebook と矛盾しないこと（schema 適合、標準 Role code 語彙、実行主体との分離、公開可否の責務境界）を確認した。
- Markdown 参考資料を `npx prettier --write`（いずれも unchanged）と `npx markdownlint`（エラーなし）で整形・静的検査した。YAML は plan 指定の `npm run validate:schema:file` が `tsx` 起動時の IPC 制約で `EPERM` となったため、同じ schema と AJV/js-yaml ロジックで成果物・sample を検査し、ともに valid と確認した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/030-project-management/020-organization/pm-roles.yaml`
- `docs/ja/specdojo/rulebooks/pm-roles-rulebook.md`
- `docs/ja/specdojo/recipes/pm-roles-recipe.md`
- `docs/ja/specdojo/samples/pm-roles-sample.yaml`
- `docs/ja/specdojo/templates/pm-roles-template.yaml`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-roles-010-result.md`

## 3. 申し送り

- `pm-roles.yaml` は schema（`docs/specdojo/schemas/v1/pm-roles.schema.yaml`）上 `rulebook` キーを持てないため、rulebook 参照は成果物カタログと plan 側で管理する前提を維持した。
- `status: ready` への昇格は行っていない（`draft` 据え置き）。`ready` への昇格は人間の PO が判断する。
- `npm run validate:schema:file -- --schema docs/specdojo/schemas/v1/pm-roles.schema.yaml --data <対象>` は `tsx` が `/tmp/tsx-1000/14.pipe` を listen する段階で `EPERM` となった。schema 内容の未解消エラーではなく実行環境制約として扱い、`tools/docs/src/validate-yaml-schema.ts` と同じ AJV/js-yaml の検査処理を Node で実行して `pm-roles.yaml` と `pm-roles-sample.yaml` がどちらも valid であることを確認した。
- template（`pm-roles-template.yaml`）はプレースホルダ `_PROJECT_ID_` を含むため schema 検証対象外。プレースホルダ記法は `template-authoring-standard.md` の `_UPPER_SNAKE_` 規約に準拠している。

## 4. 参考資料の活用

- 依存文書 `docs/ja/projects/prj-0001/030-project-management/020-organization/pm-organization.md` を確認し、Role code は Schedule の `owner` 語彙であり、実行主体・兼務割り当ては `pm-members.yaml` に委譲する、最終判断・公開可否は人間 PO に残す、という方針を評価の根拠にした。
- 既存の `pm-roles` 一式（成果物 + rulebook / recipe / sample / template）は、章構成・必須項目・参照関係の骨格が成立していたため、作り直さず、schema 適合と PO 判断に必要な粒度の不足だけを補強する判断とした。
- 同種 ready 文書として `pm-members-rulebook.md` / `pm-members-recipe.md` / `pm-members-sample.yaml` / `pm-members-template.yaml` を手本に、YAML 成果物のメタ項目、実行主体との分離、agent に最終判断を持たせない記述粒度、sample の駄菓子屋プロジェクト共通文脈の使い方を揃えた。
- 構造・必須項目・禁止事項は `pm-roles-rulebook.md` を正とし、recipe / sample / template はそれと矛盾しないことを確認した。参考資料は成果物の丸写しではなく、同種成果物へ再利用できる一般化（標準 Role code 集合・プレースホルダ・問いとレビュー観点）として整理した。
- `upsert-rulebook` Skill が参照する `docs/ja/specdojo/guidelines/docs-contents-guide.md` は存在しなかったため、実在する `docs/ja/specdojo/guides/docs-contents-guide.md` の組織体制セクションを確認し、ロール定義の目的・主な内容の確認に使った。
- 成果物・参考資料の内容根拠は plan 対象、既存 reference material、`pm-organization.md` に限定した。外部 Web 出典は使用していない。
