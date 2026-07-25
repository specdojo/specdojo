---
specdojo:
  id: prj-0001:xer-t-launch-pm-raci-010
  type: exec-result
  task_id: T-LAUNCH-pm-raci-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-pm-raci-010-plan.md
  started_at: "2026-06-25T12:07:50.643Z"
  completed_at: "2026-06-25T12:18:58.817Z"
  agent: codex-expert-edit-agent
  approach: bootstrap
  targets:
    - prj-0001:pm-raci
    - pm-raci-rulebook
    - pm-raci-recipe
    - pm-raci-sample
    - pm-raci-template
---

## 1. 実施内容

- `pm-raci.md` を、PM が計画化、進捗確認、課題・リスク管理、変更要求、決定記録への接続に使える RACI として更新した。
- `pm-organization.md` が `pm-roles.yaml` の Role code を採用語彙として扱う方針に合わせ、既存の「PM / DEV / UX / OPS は未採用」という記述を削除した。
- 成果物別 RACI とプロセス別 RACI を、採用済み Role code の列で揃えた。各成果物・各プロセスは `A` が 1 つだけになるよう調整した。
- `pm-raci-rulebook.md` を ready 化し、`recipe` / `sample` / `template` を frontmatter に宣言した。
- `_MISSING_` だった `pm-raci-recipe.md` と `pm-raci-template.md` を新規作成した。
- `pm-raci-sample.md` を sample ID、駄菓子屋文脈、rulebook 準拠の最小完成例として更新した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/030-project-management/020-organization/pm-raci.md`
- `docs/ja/specdojo/rulebooks/pm-raci-rulebook.md`
- `docs/ja/specdojo/recipes/pm-raci-recipe.md`
- `docs/ja/specdojo/samples/pm-raci-sample.md`
- `docs/ja/specdojo/templates/pm-raci-template.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-pm-raci-010-result.md`

## 3. 申し送り

- `pm-raci.md` は `pm-roles.yaml` に存在する採用済み Role code を列に置いた。後続で `pm-roles.yaml` または `pm-members.yaml` の方針が変わる場合は、RACI 列と全行の `A` を再確認する。
- Schedule の各タスク `owner` との詳細突合は、本タスクの根拠範囲外のため実施していない。後続の schedule / review task で確認する。

## 4. 参考資料の活用

- 成果物本体は、対象成果物 `pm-raci.md` と依存成果物 `pm-organization.md` を主根拠にした。`pm-organization.md` が `pm-roles.yaml` を Role code 語彙の正本として参照しているため、整合確認のために `pm-roles.yaml` も確認した。
- bootstrap の手本として、同種で `status: ready` の `pm-organization-rulebook.md`、`pm-organization-recipe.md`、`pm-organization-sample.md`、`pm-organization-template.md` を参照した。章構成、粒度、表、プレースホルダの置き方を手本にし、内容は RACI 用に一般化した。
- 既存の `pm-raci.md` は、目的、適用方針、成果物別 RACI、プロセス別 RACI、見直し条件、禁止事項の骨格を維持した。ただし、採用ロールに関する記述が `pm-organization.md` と矛盾していたため修正した。
- 既存の `pm-raci-rulebook.md` は、構造の大枠を維持しつつ、recipe / sample / template への参照、PM 管理プロセス、`A` 1 つの判定基準、禁止事項を補強した。構造・必須項目・禁止事項は rulebook を正とし、recipe / sample / template を追従させた。
- `pm-raci-sample.md` は、既存が実プロジェクト ID と重複していたため `pm-raci-sample` に修正し、駄菓子屋文脈の完成例として再構成した。
- 外部情報は使用しなかった。指定された対象文書、依存成果物、同種 ready 文書で判断可能だったため、Web 出典は追加していない。

## 5. 検証

- `npm run -s lint:md`: 成功
- `npx remark --quiet --frail docs/ja/projects/prj-0001/030-project-management/020-organization/pm-raci.md docs/ja/specdojo/rulebooks/pm-raci-rulebook.md docs/ja/specdojo/recipes/pm-raci-recipe.md docs/ja/specdojo/samples/pm-raci-sample.md docs/ja/specdojo/templates/pm-raci-template.md`: 成功
- frontmatter YAML parse: 成功
- RACI 表の `A` 件数確認スクリプト: 成功
- `npm run -s build`: 成功
- `node dist/specdojo.js catalog validate`: 成功
